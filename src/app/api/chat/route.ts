import { NextRequest, NextResponse } from "next/server";
import type { BusinessProfile } from "@/lib/profile";
import { buildSystemPrompt } from "@/lib/ai-guidelines";
import { parseCampaignResponse } from "@/lib/campaignJson";
import type { CalendarEvent } from "@/types/campaign";
import { EMPTY_CAMPAIGN } from "@/types/campaign";

export const runtime = "nodejs";

type IncomingMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "הסוכן עדיין לא מוגדר במלואו בשרת. פנו למנהל המערכת להשלמת ההגדרה.",
      },
      { status: 500 }
    );
  }

  let body: {
    messages?: IncomingMessage[];
    profile?: BusinessProfile | null;
    calendarEvents?: CalendarEvent[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const messages = body.messages?.filter(
    (m) => m && typeof m.content === "string" && m.content.trim()
  );
  if (!messages?.length) {
    return NextResponse.json({ error: "אין הודעות לשליחה" }, { status: 400 });
  }

  const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  const system = buildSystemPrompt(
    body.profile,
    body.calendarEvents ?? []
  );

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": siteUrl,
          "X-Title": "SocialAI Pro",
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          max_tokens: 1800,
          response_format: { type: "json_object" },
          messages: [{ role: "system", content: system }, ...messages],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      // Retry without response_format for providers that reject it
      if (String(data?.error?.message || "").toLowerCase().includes("response_format")) {
        return await fallbackWithoutJsonMode(
          apiKey,
          model,
          siteUrl,
          system,
          messages,
          body.profile
        );
      }
      return NextResponse.json(
        { error: "הסוכן לא הצליח להשיב כרגע. נסו שוב בעוד רגע." },
        { status: response.status }
      );
    }

    const content =
      data?.choices?.[0]?.message?.content?.trim() ||
      JSON.stringify(EMPTY_CAMPAIGN);

    const campaign = parseCampaignResponse(content, body.profile);
    return NextResponse.json({
      reply: campaign.summaryToUser,
      campaign,
      model,
      actions: defaultActions(campaign),
    });
  } catch (err) {
    console.error("OpenRouter chat error:", err);
    return NextResponse.json(
      { error: "החיבור לסוכן נכשל. בדקו את החיבור לאינטרנט ונסו שוב." },
      { status: 502 }
    );
  }
}

async function fallbackWithoutJsonMode(
  apiKey: string,
  model: string,
  siteUrl: string,
  system: string,
  messages: IncomingMessage[],
  profile?: BusinessProfile | null
) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": "SocialAI Pro",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 1800,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(
      { error: String(data?.error?.message || data?.error || "שגיאה") },
      { status: response.status }
    );
  }
  const content =
    data?.choices?.[0]?.message?.content?.trim() ||
    JSON.stringify(EMPTY_CAMPAIGN);
  const campaign = parseCampaignResponse(content, profile);
  return NextResponse.json({
    reply: campaign.summaryToUser,
    campaign,
    model,
    actions: defaultActions(campaign),
  });
}

function defaultActions(campaign: {
  campaignTitle: string;
  platforms: object;
}): string[] {
  const hasContent =
    Boolean(campaign.campaignTitle) ||
    Object.keys(campaign.platforms || {}).length > 0;
  if (!hasContent) {
    return ["ספר על מבצע", "הכן פוסט לאינסטגרם", "תכנן שבוע תוכן"];
  }
  return ["אשר ותזמן אוטומטית", "ערוך טקסט", "החלף תמונה"];
}
