import * as schema from "$drizzle/schema";
import { withDb } from "@/db";
import { getCookie } from "cookies-next";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUID } from "./saves";

async function get(req: NextApiRequest, res: NextApiResponse) {
	return withDb(async (db) => {
		const uid = await getUID(req, res, db);
		if (!uid) return res.status(401).end();

		// getUID already verified the token. Re-use the DB query it made
		// by checking if there's a token — if so, the user record exists.
		const token = getCookie("token", { req, res });
		if (!token) {
			// Anonymous user — no user record
			return res.json(undefined);
		}

		const [user] = await db
			.select()
			.from(schema.users)
			.where(eq(schema.users.id, uid))
			.limit(1);

		return res.json(user);
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		switch (req.method) {
			case "GET":
				return await get(req, res);
		}
		res.status(405).end();
	} catch (e: any) {
		res.send(e.message);
	}
}
