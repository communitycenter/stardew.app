import { db } from "$db";
import * as schema from "$drizzle/schema";
import { cookies } from "next/headers";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export interface SqlUser {
  id: string;
  discord_id: string;
  cookie_secret: string;
  discord_avatar: string;
  discord_name: string;
}

export interface Player {
  _id?: string;
  general?: object;
  bundles?: Array<object>;
  fishing?: object;
  cooking?: object;
  crafting?: object;
  shipping?: object;
  museum?: object;
  social?: object;
  monsters?: object;
  walnuts: object;
  notes?: object;
  scraps?: object;
  perfection?: object;
  powers?: object;
}

const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};

const setCookie = async (name: string, value: string, options: any) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    maxAge: options.maxAge,
    domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
      ? "localhost"
      : "stardew.app",
  });
};

export async function getUID(): Promise<string> {
  let uid = await getCookie("uid");

  if (uid) {
    // uids can be anonymous, so we need to check if the user exists
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, uid))
      .limit(1);

    if (user) {
      // user exists, so we check if the user is authenticated
      let token = await getCookie("token");
      if (!token) {
        throw new Error("User is not authenticated (1)");
      }
      // verify that the token is valid
      const { valid, userId } = verifyToken(token, user.cookie_secret);
      if (!valid || userId !== uid) {
        throw new Error(`User is not authenticated (valid token: ${valid})`);
      }
    }
    // everything is ok, so we return the uid
    return uid;
  } else {
    console.log("Generating new UID...");
    // no uid, so we create an anonymous one
    uid = crypto.randomBytes(16).toString("hex");
    setCookie("uid", uid, {
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return uid;
}

export const createToken = (userId: string, key: string, validFor: number) => {
  const expires = Math.floor(new Date().getTime() / 1000 + validFor);
  const salt = crypto.randomBytes(8).toString("hex");
  const payload = Buffer.from(`${expires}.${userId}.${salt}`, "utf8").toString(
    "base64",
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

// Route Handlers
export async function GET(request: NextRequest) {
  try {
    const uid = await getUID();
    const players = await db
      .select()
      .from(schema.saves)
      .where(eq(schema.saves.user_id, uid));

    return NextResponse.json(players);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const uid = await getUID();
    const players = (await request.json()) as Player[];

    for (const player of players) {
      if (player._id) {
        await db
          .insert(schema.saves)
          .values({
            _id: player._id,
            user_id: uid,
            ...player,
          })
          .onDuplicateKeyUpdate({ set: player });
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const uid = await getUID();

    let body = null;
    try {
      body = await request.json();
    } catch (e) {
      // no body provided, delete all players
      await db.delete(schema.saves).where(eq(schema.saves.user_id, uid));
      return new NextResponse(null, { status: 204 });
    }

    if (body.type === "player") {
      // delete single player
      await db
        .delete(schema.saves)
        .where(
          and(eq(schema.saves.user_id, uid), eq(schema.saves._id, body._id)),
        );
    } else {
      // delete entire account
      await db.delete(schema.saves).where(eq(schema.saves.user_id, uid));
      await db.delete(schema.users).where(eq(schema.users.id, uid));
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
