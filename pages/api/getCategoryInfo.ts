// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import { getUID } from "./kv";

type Data = { [key: string]: any };

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uid = await getUID(req, res);
  // const uid = "cc83846d389883722be3fc7636b3a63e";

  const query = req.query;
  const { category, type } = query;

  if (!category || !type) {
    return res
      .status(400)
      .json({ error: "Missing Query Param (Category or Type required)" });
  }

  // grab all {id: id, value: value} from trackedVariables where user = uid,
  // from the correct category
  const vars = await prisma.trackedVariables.findMany({
    select: {
      id: true,
      value: true,
    },
    where: {
      user: uid,
      tag: category as string,
      value: {
        in: type === "boolean" ? ["true", "false"] : ["0", "1", "2"],
      },
    },
  });

  if (vars.length === 0) {
    res.status(404).json({ error: "No variables found" });
    return;
  }

  // convert to {id: value} format
  const result = vars.reduce<Record<string, any>>((acc, v) => {
    const [, , key] = v.id.split(";");
    if (key) {
      try {
        acc[key] = JSON.parse(v.value);
      } catch (e) {
        if (e instanceof SyntaxError) {
          acc[key] = v.value;
        }
      }
    } else {
      try {
        acc[key] = JSON.parse(v.value);
      } catch (e) {
        if (e instanceof SyntaxError) {
          acc[key] = v.value;
        }
      }
    }
    return acc;
  }, {});

  console.log(result);

  res.status(200).json(result);
};
