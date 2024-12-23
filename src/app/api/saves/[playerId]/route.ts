import { db } from "$db";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Player, getUID } from "../route";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { playerId: string } },
) {
  try {
    const playerId = params.playerId;
    if (!playerId) {
      return new NextResponse(null, { status: 400 });
    }

    const uid = await getUID();
    const player = (await request.json()) as Player;
    if (!player) {
      return new NextResponse(null, { status: 400 });
    }

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
        powers=JSON_MERGE_PATCH(powers, ${player.powers ? JSON.stringify(player.powers) : "{}"})
      WHERE _id = ${playerId} AND user_id = ${uid}
    `,
    );

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
