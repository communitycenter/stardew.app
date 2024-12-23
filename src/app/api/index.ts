import * as schema from "$drizzle/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { getUID } from "./saves/route";

export async function GET(request: NextRequest) {
  try {
    const uid = await getUID();
    if (!uid) {
      return new NextResponse(null, { status: 401 });
    }

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, uid))
      .limit(1);

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
