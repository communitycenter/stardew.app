import { withDb } from "@/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "./saves";

async function get(req: NextApiRequest, res: NextApiResponse) {
	return withDb(async (db) => {
		// getSession already loads and verifies the signed-in user, so reuse
		// that row instead of querying Users again. Anonymous users get
		// undefined.
		const { uid, user } = await getSession(req, res, db);
		if (!uid) return res.status(401).end();

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
