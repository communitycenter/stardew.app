// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import crypto from "crypto";

type Data = Record<string, any>;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const state = crypto.randomBytes(4).toString("hex");
  setCookie("oauth_state", state, {
    req,
    res,
    domain: process.env.NEXT_PUBLIC_DEVELOPMENT ? "localhost" : "stardew.app",
    maxAge: 60 * 60 * 24 * 365,
  });
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${
      process.env.DISCORD_ID
    }&redirect_uri=${encodeURIComponent(
      process.env.DISCORD_REDIRECT ?? ""
    )}&state=${state}&response_type=code&scope=identify%20guilds.join`
  );
}
