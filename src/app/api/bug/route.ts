import { NextRequest, NextResponse } from "next/server";

async function turnstile(token: string, ip: string | null) {
  const formData = new URLSearchParams();

  formData.append("secret", process.env.TURNSTILE_KEY as string);
  formData.append("response", token);

  if (ip) {
    formData.append("remoteip", ip);
  }

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  return (await result.json()) as
    | {
        success: true;
        challenge_ts: string;
        hostname: string;
        "error-codes": string[];
        action: string;
        cdata: string;
      }
    | {
        success: false;
        "error-codes": [string, ...string[]];
      };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0] ??
      request.headers.get("x-real-ip") ??
      request.headers.get("cf-connecting-ip") ??
      null;

    const outcome = await turnstile(body.turnstile, ip);

    if (!outcome.success) {
      return new NextResponse(null, { status: 400 });
    }

    const linearResponse = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.LINEAR_API_KEY}`,
      },
      body: JSON.stringify({
        query: `mutation IssueCreate{
          issueCreate(
            input: {
              title: "${body.short}",
              description: "**Reported by:** ${body.user.discord_name} (${body.user.discord_id})\\n\\n${body.long}\\n\\nIP: ${ip}",
              teamId: "${process.env.LINEAR_TEAM_ID}",
              labelIds: ["${process.env.LINEAR_BUG_LABEL}"]
            }
          ) {
            success
            issue {
              id
              identifier
              title
            }
          }
        }`,
        variables: {},
      }),
    });

    if (!linearResponse.ok) {
      throw new Error("Failed to create issue in Linear");
    }

    const parsedLinearResponse = await linearResponse.json();
    const identifier = parsedLinearResponse.data.issueCreate.issue.identifier;

    await fetch(process.env.FEEDBACK_WEBHOOK as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: null,
        embeds: [
          {
            title: `<a:sdvUh:1220462519466852493> New bug report! (${identifier})`,
            url: `https://linear.app/stardew/issue/${identifier}`,
            color: null,
            fields: [
              {
                name: "What happened?",
                value: `${body.short}`,
              },
              {
                name: "What were you doing when this happened?",
                value: `${body.long}`,
              },
            ],
            author: {
              name: `${body.user.discord_name} (${body.user.discord_id})`,
              url: "https://cdn.discordapp.com/embed/avatars/0.png",
            },
            footer: {
              text: `Turnstile: ${outcome.challenge_ts} | IP: ${ip}`,
            },
          },
        ],
        attachments: [],
      }),
    });

    return NextResponse.json({ identifier });
  } catch (error: any) {
    console.error("Error processing bug report:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
