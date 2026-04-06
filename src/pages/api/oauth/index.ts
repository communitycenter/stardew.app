import { setCookie } from "cookies-next";
import { getRequestOrigin, getServerCookieDomain } from "@/lib/cookies";
import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = Record<string, any>;

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	const origin = getRequestOrigin(req);
	if (!origin) {
		res.status(400).end();
		return;
	}

	const redirectUri = `${origin}/api/oauth/callback`;
	const state = crypto.randomBytes(4).toString("hex");
	setCookie("oauth_state", state, {
		req,
		res,
		domain: getServerCookieDomain(req),
		maxAge: 60 * 60 * 24 * 365,
	});
	res.redirect(
		`https://discord.com/api/oauth2/authorize?client_id=${
			process.env.DISCORD_ID
		}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&response_type=code&scope=identify${req.query && !req.query.discord ? `` : `%20guilds.join`}`,
	);
}
