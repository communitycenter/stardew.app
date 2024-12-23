import * as schema from "$drizzle/schema";
import { db } from "@/db";
import { cookies } from "next/headers";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { createToken } from "../../saves/route";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const state = cookieStore.get("oauth_state")?.value;
    if (!state) {
      console.log("[OAuth] No state cookie");
      return redirect("/");
    }

    const uid = cookieStore.get("uid")?.value;
    if (!uid) {
      console.log("[OAuth] No UID cookie");
      return redirect("/");
    }

    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) {
      console.log("[OAuth] No code");
      return redirect("/");
    }

    const discord = await fetch(`https://discord.com/api/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_ID ?? "",
        client_secret: process.env.DISCORD_SECRET ?? "",
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT ?? "",
      }),
    });

    if (!discord.ok) {
      console.log("[OAuth] Discord error");
      return redirect("/");
    }

    const discordData = await discord.json();
    console.log("discordData", discordData);

    const discordUser = await fetch(`https://discord.com/api/users/@me`, {
      headers: {
        Authorization: `Bearer ${discordData.access_token}`,
      },
    });

    if (!discordUser.ok) {
      console.log("[OAuth] Discord user error");
      return redirect("/");
    }

    const discordUserData = await discordUser.json();

    let [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, uid))
      .limit(1);

    let cookieSecret =
      user?.cookie_secret ?? crypto.randomBytes(16).toString("hex");

    if (!user) {
      let [discordUser] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.discord_id, discordUserData.id))
        .limit(1);

      if (discordUser) {
        user = discordUser;
        cookieSecret = user.cookie_secret;

        if (
          discordUser.discord_name !== discordUserData.username ||
          discordUser.discord_avatar !== discordUserData.avatar
        ) {
          await db
            .update(schema.users)
            .set({
              discord_name: discordUserData.username,
              discord_avatar: discordUserData.avatar,
            })
            .where(eq(schema.users.discord_id, discordUserData.id));
        }
      } else {
        await db
          .insert(schema.users)
          .values({
            id: uid,
            discord_id: discordUserData.id,
            discord_name: discordUserData.username,
            discord_avatar: discordUserData.avatar,
            cookie_secret: cookieSecret,
          })
          .onDuplicateKeyUpdate({
            set: {
              discord_id: discordUserData.id,
              discord_name: discordUserData.username,
              discord_avatar: discordUserData.avatar,
              cookie_secret: cookieSecret,
            },
          });

        user = {
          id: uid,
          discord_id: discordUserData.id,
          discord_name: discordUserData.username,
          discord_avatar: discordUserData.avatar,
          cookie_secret: cookieSecret,
        };
      }
    }

    const domain = parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
      ? "localhost"
      : "stardew.app";

    cookieStore.set("uid", user.id, {
      domain,
      maxAge: 60 * 60 * 24 * 365,
    });

    const token = createToken(user.id, cookieSecret, 60 * 60 * 24 * 365);
    cookieStore.set("token", token.token, {
      domain,
      expires: new Date(token.expires * 1000),
    });

    cookieStore.set(
      "discord_user",
      JSON.stringify({
        discord_id: discordUserData.id,
        discord_name: discordUserData.username,
        discord_avatar: discordUserData.avatar,
      }),
      {
        domain,
        expires: new Date(token.expires * 1000),
      },
    );

    if (discordData.scope.includes("guilds.join")) {
      await fetch(
        `https://discord.com/api/guilds/${process.env.DISCORD_GUILD}/members/${discordUserData.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            access_token: discordData.access_token,
            roles: ["1150490180860530819"],
          }),
          headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );
    }

    return redirect("/");
  } catch (error: any) {
    console.log("[OAuth] Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
