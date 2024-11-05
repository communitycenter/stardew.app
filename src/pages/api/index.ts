import * as schema from '$drizzle/schema';
import { db } from "@/db";
import { eq } from 'drizzle-orm';
import type { NextApiRequest, NextApiResponse } from "next";
import { getUID } from "./saves";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const uid = await getUID(req, res);
  if (!uid) return res.status(401).end();
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, uid)).limit(1);
  return res.json(user);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
