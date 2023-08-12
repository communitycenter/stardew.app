import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie, setCookie } from "cookies-next";
import crypto from "crypto";
import { createToken, conn, SqlUser } from "../saves"

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

    let user = (await conn.execute('SELECT * FROM Users WHERE id = ? LIMIT 1', [uid]))?.rows[0] as SqlUser | undefined
    let cookieSecret =
      user?.cookie_secret ?? crypto.randomBytes(16).toString("hex");
    if (!user) {
      let discordUser = (await conn.execute('SELECT * FROM Users WHERE discord_id = ? LIMIT 1', [discordUserData.id]))?.rows[0] as SqlUser | undefined

      if (discordUser) {
        user = discordUser;
        cookieSecret = user.cookie_secret;
      } else {
        user = (await conn.execute('INSERT INTO Users (id, discord_id, discord_name, discord_avatar, cookie_secret) VALUES (?, ?, ?, ?, ?)', [
            uid as string,
            discordUserData.id,
            discordUserData.username,
            discordUserData.avatar,
            cookieSecret,
				]))?.rows[0] as SqlUser
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