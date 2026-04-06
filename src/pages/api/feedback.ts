import { NextApiRequest, NextApiResponse } from "next";

async function turnstile(token: string, ip: string | null) {
	const formData = new URLSearchParams();

	formData.append("secret", process.env.TURNSTILE_KEY as string);
	formData.append("response", token);

	if (ip) {
		formData.append("remoteip", ip);
	}

	const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

	const result = await fetch(url, {
		body: formData,
		method: "POST",
	});

	return (await result.json()) as
		| {
				"success": true;
				"challenge_ts": string;
				"hostname": string;
				"error-codes": string[];
				"action": string;
				"cdata": string;
		  }
		| {
				"success": false;
				"error-codes": [string, ...string[]];
		  };
}

function codeblock(code: string, lang = "ts") {
	return `\`\`\`${lang}
${code}
\`\`\``;
}

async function post(req: NextApiRequest, res: NextApiResponse) {
	const body = req.body;
	const ip =
		(req.headers["x-forwarded-for"] as string) ??
		req.socket.remoteAddress ??
		null;

	const outcome = await turnstile(body.turnstile, ip);

	if (!outcome.success) {
		return res.status(400).end();
	}

	const result = await fetch(process.env.FEEDBACK_WEBHOOK as string, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			embeds: [
				{
					author: {
						name: `${body.user.discord_name} (${body.user.discord_id})`,
						icon_url: body.user.discord_avatar
							? `https://cdn.discordapp.com/avatars/${body.user.discord_id}/${body.user.discord_avatar}.png`
							: `https://cdn.discordapp.com/embed/avatars/0.png`,
					},
					title: "<a:SDVowo:1018861004190400513> Feedback recieved!",
					description: body.body,
					footer: {
						text: `Turnstile: ${outcome.challenge_ts} | IP: ${ip}`,
					},
				},
			],
		}),
	});

	return res.json({});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		switch (req.method) {
			case "POST":
				return await post(req, res);
		}
		res.status(405).end();
	} catch (e: any) {
		res.send(e.message);
	}
}
