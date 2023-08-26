import type { NextApiRequest, NextApiResponse } from "next";
import { getUID, conn } from "@/pages/api/saves";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const uid = await getUID(req, res);

  if (!uid) return res.status(401).end();

  const user = (await conn.execute("SELECT * FROM Users WHERE id = ?", [uid]))
    .rows?.[0];

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
