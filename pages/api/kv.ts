// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getCookie, setCookie } from "cookies-next";
import crypto from "crypto";

type Data = Record<string, any>;

const prisma = new PrismaClient();

async function get(req: NextApiRequest, res: NextApiResponse<Data>) {
  const uid = await getUID(req, res);
  const variables = await prisma.trackedVariables.findMany({
    where: {
      user: uid,
    },
  });
  res.send(
    variables.reduce<Record<string, any>>((acc, v) => {
      const [_, tag, key] = v.id.split(";");
      if (key) {
        try {
          acc[tag] = Object.assign(acc[tag] || {}, {
            [key]: JSON.parse(v.value),
          });
        } catch (e) {
          if (e instanceof SyntaxError) {
            acc[tag] = Object.assign(acc[tag] || {}, {
              [key]: v.value,
            });
          }
        }
      } else {
        try {
          acc[tag] = JSON.parse(v.value);
        } catch (e) {
          if (e instanceof SyntaxError) {
            acc[tag] = v.value;
          }
        }
      }
      return acc;
    }, {})
  );
}

async function patch(req: NextApiRequest, res: NextApiResponse<Data>) {
  const uid = await getUID(req, res);
  const body = JSON.parse(req.body);
  const flatBody = Object.entries(body).reduce<Record<string, any>>(
    (acc, [tag, value]) => {
      if (value instanceof Object) {
        Object.entries(value!).forEach(([key, value]) => {
          acc[`${tag};${key}`] = value.toString();
        });
      } else {
        acc[tag] = (<any>value).toString();
      }
      return acc;
    },
    {}
  );

  console.log(flatBody);
  const transactions = Object.keys(flatBody).map((key) => {
    return {
      id: `${uid};${key}`,
      user: uid,
      tag: key.split(";")[0],
      value: flatBody[key],
    };
  });

  const chunks = [];
  for (let i = 0; i < transactions.length; i += 600) {
    chunks.push(transactions.slice(i, i + 600));
  }

  try {
    await Promise.all(
      chunks.map((chunk) =>
        prisma.$transaction([
          prisma.trackedVariables.deleteMany({
            where: { id: { in: chunk.map((row) => row.id) } },
          }),
          prisma.trackedVariables.createMany({ data: chunk }),
        ])
      )
    );
  } catch (e) {
    console.log(e);
  }

  res.status(200).send(transactions);
}

async function _delete(req: NextApiRequest, res: NextApiResponse<Data>) {
  const uid = await getUID(req, res);

  try {
    await prisma.trackedVariables.deleteMany({
      where: { user: uid },
    });
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "GET":
        return await get(req, res);
      case "PATCH":
        return await patch(req, res);
      case "DELETE":
        return await _delete(req, res);
    }
    res.status(405).end();
  } catch (e: any) {
    res.send(e.message);
  }
}

// magic functions dreamt up by me, i think they're secure lol, i use them a lot - Leah
export const createToken = (userId: string, key: string, validFor: number) => {
  const expires = Math.floor(new Date().getTime() / 1000 + validFor);
  const salt = crypto.randomBytes(8).toString("hex");
  const payload = Buffer.from(`${expires}.${userId}.${salt}`, "utf8").toString(
    "base64"
  );
  const signature = crypto
    .createHmac("sha256", key)
    .update(payload)
    .digest("hex");
  return { token: `${payload}.${signature}`, expires };
};

export const verifyToken = (token: string, key: string) => {
  const [payload, signature] = token.split(".");
  const decoded = Buffer.from(payload, "base64").toString("utf8");
  const [expires, userId] = decoded.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", key)
    .update(payload)
    .digest("hex");
  return {
    valid:
      signature === expectedSignature &&
      parseInt(expires) > Math.floor(new Date().getTime() / 1000),
    userId,
  };
};

export async function getUID(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<string> {
  let uid = getCookie("uid", { req, res });
  if (uid) {
    // uids can be anonymous, so we need to check if the user exists
    const user = await prisma.users.findFirst({ where: { id: uid as string } });
    if (user) {
      // user exists, so we check if the user is authenticated
      // verify that the user has a stored token
      let token = getCookie("token", { req, res });
      if (!token) {
        res.status(400);
        throw new Error("User is not authenticated (1)");
      }
      // verify that the token is valid
      const { valid, userId } = verifyToken(
        token as string,
        user.cookie_secret
      );
      if (!valid || userId !== uid) {
        res.status(400);
        throw new Error(`User is not authenticated (valid token: ${valid})`);
      }
    }
    // everything is ok, so we return the uid
    return uid as string;
  } else {
    // no uid, so we create an anonymous one
    uid = crypto.randomBytes(16).toString("hex");
    setCookie("uid", uid, { req, res, maxAge: 60 * 60 * 24 * 365 });
  }
  return uid;
}
