import { withDb } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

async function get(req: NextApiRequest, res: NextApiResponse) {
    return withDb(async (db) => {
        res.setHeader(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, max-age=0",
        );

        const farmId = req.query.farmId as string | undefined;
        if (!farmId) return res.status(400).end();

        const players = await db
            .select()
            .from(schema.saves)
            .where(eq(schema.saves.farmId, farmId));

        res.json(players);
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end();
    try {
        return await get(req, res);
    } catch (e: any) {
        console.error(e);
        res.status(500).send(e instanceof Error ? e.message : "Internal Server Error");
    }
}