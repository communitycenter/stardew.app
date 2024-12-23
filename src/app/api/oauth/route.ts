import { cookies } from "next/headers";
import crypto from "crypto";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const includeGuilds = !searchParams.has("discord");

  const state = crypto.randomBytes(4).toString("hex");
  const cookieStore = await cookies();

  cookieStore.set("oauth_state", state, {
    domain: parseInt(process.env.NEXT_PUBLIC_DEVELOPMENT!)
      ? "localhost"
      : "stardew.app",
    maxAge: 60 * 60 * 24 * 365,
  });

  // TODO: update to use Pathcat instead of search params
  const discordUrl = new URL("https://discord.com/api/oauth2/authorize");
  discordUrl.searchParams.set("client_id", process.env.DISCORD_ID ?? "");
  discordUrl.searchParams.set(
    "redirect_uri",
    process.env.DISCORD_REDIRECT ?? "",
  );
  discordUrl.searchParams.set("state", state);
  discordUrl.searchParams.set("response_type", "code");
  discordUrl.searchParams.set(
    "scope",
    `identify${includeGuilds ? " guilds.join" : ""}`,
  );

  return redirect(discordUrl.toString());
}
