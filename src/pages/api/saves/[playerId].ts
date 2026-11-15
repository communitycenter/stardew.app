import { withDb } from "$db";
import * as schema from "$drizzle/schema";
import { applyPlayerPatch } from "@/lib/player-patch";
import { and, eq, sql } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { Player, SaveField, getUID, saveFields } from ".";

function parseRequestBody<T>(body: unknown): T {
	if (typeof body === "string") {
		return JSON.parse(body) as T;
	}

	return body as T;
}

async function patch(req: NextApiRequest, res: NextApiResponse) {
	return withDb(async (db) => {
		res.setHeader(
			"Cache-Control",
			"no-store, no-cache, must-revalidate, max-age=0",
		);

		const playerId = req.query.playerId as string | undefined;
		if (!playerId) return res.status(400).end();

		const player = parseRequestBody<Player>(req.body);
		if (!player) return res.status(400).end();

		const fields = saveFields.filter((field) =>
			Object.prototype.hasOwnProperty.call(player, field),
		);
		if (fields.length === 0) {
			return res.status(400).json({ error: "No update fields provided" });
		}

		const uid = await getUID(req, res, db);

		try {
			const where = and(
				eq(schema.saves._id, playerId),
				eq(schema.saves.user_id, uid),
			);

			// Read only the columns being patched; a full save is ~24 KB of JSON.
			const [existingSave] = await db
				.select(
					Object.fromEntries(
						fields.map((field) => [field, schema.saves[field]]),
					) as Record<SaveField, (typeof schema.saves)[SaveField]>,
				)
				.from(schema.saves)
				.where(where)
				.limit(1);

			if (!existingSave) {
				return res.status(404).json({ error: "Save not found" });
			}

			const updates: Partial<Record<SaveField, unknown>> = {};
			for (const field of fields) {
				updates[field] = applyPlayerPatch(existingSave[field], player[field]);
			}

			await db
				.update(schema.saves)
				.set({ ...updates, updated_at: sql`CURRENT_TIMESTAMP` })
				.where(where);

			res.status(204).end();
		} catch (e) {
			console.error("Database update error:", e);
			console.error("Player data:", JSON.stringify(player, null, 2));
			console.error("Player ID:", playerId);
			console.error("User ID:", uid);
			res
				.status(500)
				.json({ error: e instanceof Error ? e.message : "Unknown error" });
		}
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		switch (req.method) {
			case "PATCH":
				return await patch(req, res);
		}
		res.status(405).end();
	} catch (e: any) {
		console.error("Handler error:", e);
		res.status(500).json({ error: e.message });
	}
}
