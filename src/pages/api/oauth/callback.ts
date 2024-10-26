import * as schema from "$drizzle/schema";
import { db } from "@/db";
import { getCookie, setCookie } from "cookies-next";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { createToken } from "../saves";

type Data = Record<string, any>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    // get state from cookie to verify that this is the correct authentication request
    const state = getCookie("oauth_state", { req });
    if (!state) {
      res.status(400).end();
      console.log("[OAuth] No state cookie");
      return;
    }

    const uid = getCookie("uid", { req });

    if (!uid || typeof uid !== "string") {
      res.status(400).end();
      res.redirect("/");
      console.log("[OAuth] No UID cookie");
      return;
    }

    const code = req.query.code as string;
    if (!code) {
      res.status(400).end();
      res.redirect("/");
      console.log("[OAuth] No code");
      return;
    }

    const discord = await fetch(
      `https://discord.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
        process.env.DISCORD_REDIRECT ?? "",
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.DISCORD_ID ?? "",
          client_secret: process.env.DISCORD_SECRET ?? "",
          grant_type: "authorization_code",
          code: code ?? "",
          redirect_uri: process.env.DISCORD_REDIRECT ?? "",
        }),
      },
    );

    if (!discord.ok) {
      res.status(400).end();
      console.log("[OAuth] Discord error");
      return;
    }

    const discordData = await discord.json();

    console.log("discordData", discordData);

    const discordUser = await fetch(`https://discord.com/api/users/@me`, {
      headers: {
        Authorization: `Bearer ${discordData.access_token}`,
      },
    });

    if (!discordUser.ok) {
      res.status(400).end();
      console.log("[OAuth] Discord user error");
      return;
    }

    const discordUserData = await discordUser.json();

    let [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, uid))
      .limit(1);

    let cookieSecret =
      user?.cookie_secret ?? crypto.randomBytes(16).toString("hex");

    if (!user) {
      let [discordUser] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.discord_id, discordUserData.id))
        .limit(1);

      if (discordUser) {
        user = discordUser;
        cookieSecret = user.cookie_secret;

        // update discord name if it has changed
        if (discordUser.discord_name !== discordUserData.username) {
          await db
            .update(schema.users)
            .set({ discord_name: discordUserData.username })
            .where(eq(schema.users.discord_id, discordUserData.id));
        }

        // update discord avatar if the avatar hash changed
        if (discordUser.discord_avatar !== discordUserData.avatar) {
          await db
            .update(schema.users)
            .set({ discord_avatar: discordUserData.avatar })
            .where(eq(schema.users.discord_id, discordUserData.id));
        }
      } else {
        await db
          .insert(schema.users)
          .values({
            id: uid,
            discord_id: discordUserData.id,
            discord_name: discordUserData.username,
            discord_avatar: discordUserData.avatar,
            cookie_secret: cookieSecret,
          })
          .onDuplicateKeyUpdate({
            set: {
              discord_id: discordUserData.id,
              discord_name: discordUserData.username,
              discord_avatar: discordUserData.avatar,
              cookie_secret: cookieSecret,
            },
          });
        // await conn.execute(
        //   "INSERT INTO Users (id, discord_id, discord_name, discord_avatar, cookie_secret) VALUES (?, ?, ?, ?, ?)",
        //   [
        //     uid as string,
        //     discordUserData.id,
        //     discordUserData.username,
        //     discordUserData.avatar,
        //     cookieSecret,
        //   ],
        // );
        user = {
          id: uid,
          discord_id: discordUserData.id,
          discord_name: discordUserData.username,
          discord_avatar: discordUserData.avatar,
          cookie_secret: cookieSecret,
        };
      }
    }

    setCookie("uid", user.id, {
      req,
      res,
      domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
        ? "localhost"
        : "stardew.app",
      maxAge: 60 * 60 * 24 * 365,
    });

    const token = createToken(user.id, cookieSecret, 60 * 60 * 24 * 365);
    setCookie("token", token.token, {
      req,
      res,
      domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
        ? "localhost"
        : "stardew.app",
      expires: new Date(token.expires * 1000),
    });

    setCookie(
      "discord_user",
      JSON.stringify({
        discord_id: discordUserData.id,
        discord_name: discordUserData.username,
        discord_avatar: discordUserData.avatar,
      }),
      {
        req,
        res,
        domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
          ? "localhost"
          : "stardew.app",
        expires: new Date(token.expires * 1000),
      },
    );

    res.redirect("/");

    if (discordData.scope.includes("guilds.join")) {
      await fetch(
        `https://discord.com/api/guilds/${process.env.DISCORD_GUILD}/members/${discordUserData.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            access_token: `${discordData.access_token}`,
            roles: ["1150490180860530819"],
          }),
          headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (e: any) {
    res.status(500).send(e.message);
    console.log("[OAuth] Error", e);
  }
}
