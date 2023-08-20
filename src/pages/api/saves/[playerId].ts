import { NextApiRequest, NextApiResponse } from "next";
import { Player, conn, getUID } from ".";

async function patch(req: NextApiRequest, res: NextApiResponse) {
	const playerId = req.query.playerId as string | undefined;
	if (!playerId) return res.status(400).end();

	const uid = await getUID(req, res);
  const player = JSON.parse(req.body) as Player;
	if (!player) return res.status(400).end();

	try {
		await conn.execute(`
			UPDATE Saves SET
				general=JSON_MERGE_PATCH(general, ?),
				fishing=JSON_MERGE_PATCH(fishing, ?),
				cooking=JSON_MERGE_PATCH(cooking, ?),
				crafting=JSON_MERGE_PATCH(crafting, ?),
				shipping=JSON_MERGE_PATCH(shipping, ?),
				museum=JSON_MERGE_PATCH(museum, ?),
				social=JSON_MERGE_PATCH(social, ?),
				monsters=JSON_MERGE_PATCH(monsters, ?),
				walnuts=JSON_MERGE_PATCH(walnuts, ?),
				notes=JSON_MERGE_PATCH(notes, ?),
				scraps=JSON_MERGE_PATCH(scraps, ?),
				perfection=JSON_MERGE_PATCH(perfection, ?)
			WHERE _id = ? AND user_id = ?
		`, [
			player.general ? JSON.stringify(player.general) : '{}',
			player.fishing ? JSON.stringify(player.fishing) : '{}',
			player.cooking ? JSON.stringify(player.cooking) : '{}',
			player.crafting ? JSON.stringify(player.crafting) : '{}',
			player.shipping ? JSON.stringify(player.shipping) : '{}',
			player.museum ? JSON.stringify(player.museum) : '{}',
			player.social ? JSON.stringify(player.social) : '{}',
			player.monsters ? JSON.stringify(player.monsters) : '{}',
			player.walnuts ? JSON.stringify(player.walnuts) : '{}',
			player.notes ? JSON.stringify(player.notes) : '{}',
			player.scraps ? JSON.stringify(player.scraps) : '{}',
			player.perfection ? JSON.stringify(player.perfection) : '{}',
			playerId,
			uid
		])
		res.status(200).end();
	} catch (e) {
		// console.log(e)
		res.status(500).end();
	}
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "PATCH":
				return await patch(req, res);
    }
    res.status(405).end();
  } catch (e: any) {
    res.send(e.message);
  }
}
