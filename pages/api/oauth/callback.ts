// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie, setCookie } from "cookies-next";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { createToken } from "../kv";

const prisma = new PrismaClient();

type Data = Record<string, any>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // get state from cookie to verify that this is the correct authentication request
    const state = getCookie("oauth_state", { req });
    if (!state) {
      res.status(400).end();
      return;
    }

    const uid = getCookie("uid", { req });
    if (!uid) {
      res.status(400).end();
      return;
    }

    const code = req.query.code as string;
    if (!code) {
      res.status(400).end();
      return;
    }

    const discord = await fetch(
      `https://discord.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(
        process.env.DISCORD_REDIRECT ?? ""
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
      }
    );

    if (!discord.ok) {
      res.status(400).end();
      return;
    }

    const discordData = await discord.json();

    const discordUser = await fetch(`https://discord.com/api/users/@me`, {
      headers: {
        Authorization: `Bearer ${discordData.access_token}`,
      },
    });

    if (!discordUser.ok) {
      res.status(400).end();
      return;
    }

    const discordUserData = await discordUser.json();

    let user = await prisma.users.findFirst({ where: { id: uid as string } });
    let cookieSecret =
      user?.cookie_secret ?? crypto.randomBytes(16).toString("hex");
    if (!user) {
      let discordUser = await prisma.users.findFirst({
        where: { discord_id: discordUserData.id },
      });

      if (discordUser) {
        user = discordUser;
        cookieSecret = user.cookie_secret;
      } else {
        user = await prisma.users.create({
          data: {
            id: uid as string,
            discord_id: discordUserData.id,
            discord_name: discordUserData.username,
            discord_avatar: discordUserData.avatar,
            cookie_secret: cookieSecret,
          },
        });
      }
    }

    setCookie("uid", user.id, {
      req,
      res,
      domain: process.env.NEXT_PUBLIC_DEVELOPMENT ? "localhost" : "stardew.app",
      maxAge: 60 * 60 * 24 * 365,
    });

    const token = createToken(user.id, cookieSecret, 60 * 60 * 24 * 365);
    setCookie("token", token.token, {
      req,
      res,
      domain: process.env.NEXT_PUBLIC_DEVELOPMENT ? "localhost" : "stardew.app",
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
        domain: process.env.NEXT_PUBLIC_DEVELOPMENT
          ? "localhost"
          : "stardew.app",
        expires: new Date(token.expires * 1000),
      }
    );

    res.redirect("/");

    const addToGuild = await fetch(
      `https://discord.com/api/guilds/${process.env.DISCORD_GUILD}/members/${discordUserData.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          access_token: `${discordData.access_token}`,
        }),
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}
