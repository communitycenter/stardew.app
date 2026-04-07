import * as schema from "$drizzle/schema";
import { withDb } from "@/db";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUID } from "./saves";

async function get(req: NextApiRequest, res: NextApiResponse) {
	return withDb(async (db) => {
		const { uid, user } = await getUID(req, res, db);
		if (!uid) return res.status(401).end();

		// If getUID already fetched the user (authenticated), reuse it
		if (user) return res.json(user);

		// Otherwise look up by uid (anonymous user, may not exist)
		const [dbUser] = await db
			.select()
			.from(schema.users)
			.where(eq(schema.users.id, uid))
			.limit(1);

		return res.json(dbUser);
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
