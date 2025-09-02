import { db } from "$db";
import { sql } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { Player, getUID } from ".";

async function patch(req: NextApiRequest, res: NextApiResponse) {
	const playerId = req.query.playerId as string | undefined;
	if (!playerId) return res.status(400).end();

	const uid = await getUID(req, res);
	const player = JSON.parse(req.body) as Player;
	if (!player) return res.status(400).end();

	try {
		await db.execute(
			sql`
			UPDATE Saves SET
				general=JSON_MERGE_PATCH(general, ${player.general ? JSON.stringify(player.general) : "{}"}),
        bundles=JSON_MERGE_PATCH(bundles, ${player.bundles ? JSON.stringify(player.bundles) : "[]"}),
				fishing=JSON_MERGE_PATCH(fishing, ${player.fishing ? JSON.stringify(player.fishing) : "{}"}),
				cooking=JSON_MERGE_PATCH(cooking, ${player.cooking ? JSON.stringify(player.cooking) : "{}"}),
				crafting=JSON_MERGE_PATCH(crafting, ${player.crafting ? JSON.stringify(player.crafting) : "{}"}),
				shipping=JSON_MERGE_PATCH(shipping, ${player.shipping ? JSON.stringify(player.shipping) : "{}"}),
				museum=JSON_MERGE_PATCH(museum, ${player.museum ? JSON.stringify(player.museum) : "{}"}),
				social=JSON_MERGE_PATCH(social, ${player.social ? JSON.stringify(player.social) : "{}"}),
				monsters=JSON_MERGE_PATCH(monsters, ${player.monsters ? JSON.stringify(player.monsters) : "{}"}),
				walnuts=JSON_MERGE_PATCH(walnuts, ${player.walnuts ? JSON.stringify(player.walnuts) : "{}"}),
				notes=JSON_MERGE_PATCH(notes, ${player.notes ? JSON.stringify(player.notes) : "{}"}),
				scraps=JSON_MERGE_PATCH(scraps, ${player.scraps ? JSON.stringify(player.scraps) : "{}"}),
				perfection=JSON_MERGE_PATCH(perfection, ${player.perfection ? JSON.stringify(player.perfection) : "{}"}),
        powers=JSON_MERGE_PATCH(powers, ${player.powers ? JSON.stringify(player.powers) : "{}"}),
				rarecrows=JSON_MERGE_PATCH(rarecrows, ${player.rarecrows ? JSON.stringify(player.rarecrows) : "[]"})
			WHERE _id = ${playerId} AND user_id = ${uid}
		`,
		);
		res.status(200).end();
	} catch (e) {
		console.error("Database update error:", e);
		console.error("Player data:", JSON.stringify(player, null, 2));
		console.error("Player ID:", playerId);
		console.error("User ID:", uid);
		res
			.status(500)
			.json({ error: e instanceof Error ? e.message : "Unknown error" });
	}
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
