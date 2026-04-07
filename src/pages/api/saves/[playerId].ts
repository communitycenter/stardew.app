import { withDb } from "$db";
import * as schema from "$drizzle/schema";
import { applyPlayerPatch } from "@/lib/player-patch";
import { and, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { Player, getUID } from ".";

function parseRequestBody<T>(body: unknown): T {
	if (typeof body === "string") {
		return JSON.parse(body) as T;
	}

	return body as T;
}

const mergeableFields = [
	"general",
	"bundles",
	"fishing",
	"cooking",
	"crafting",
	"shipping",
	"museum",
	"social",
	"monsters",
	"walnuts",
	"notes",
	"scraps",
	"perfection",
	"powers",
	"rarecrows",
	"animals",
] as const satisfies ReadonlyArray<keyof Player>;

async function patch(req: NextApiRequest, res: NextApiResponse) {
	return withDb(async (db) => {
		res.setHeader(
			"Cache-Control",
			"no-store, no-cache, must-revalidate, max-age=0",
		);

		const playerId = req.query.playerId as string | undefined;
		if (!playerId) return res.status(400).end();

		const { uid } = await getUID(req, res, db);
		const player = parseRequestBody<Player>(req.body);
		if (!player) return res.status(400).end();

		try {
			const [existingSave] = await db
				.select()
				.from(schema.saves)
				.where(
					and(eq(schema.saves._id, playerId), eq(schema.saves.user_id, uid)),
				)
				.limit(1);

			if (!existingSave) {
				return res.status(404).json({ error: "Save not found" });
			}

			const updates = mergeableFields.reduce(
				(acc, field) => {
					if (!Object.prototype.hasOwnProperty.call(player, field)) {
						return acc;
					}

					acc[field] = applyPlayerPatch(existingSave[field], player[field]);
					return acc;
				},
				{} as Partial<Record<(typeof mergeableFields)[number], unknown>>,
			);

			if (Object.keys(updates).length === 0) {
				return res.status(400).json({ error: "No update fields provided" });
			}

			await db
				.update(schema.saves)
				.set(updates)
				.where(
					and(eq(schema.saves._id, playerId), eq(schema.saves.user_id, uid)),
				);

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
