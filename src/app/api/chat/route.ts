import { NextRequest, NextResponse } from "next/server";
import type { BusinessProfile } from "@/lib/profile";
import { networkLabel } from "@/lib/profile";

export const runtime = "nodejs";

type IncomingMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function buildSystemPrompt(profile?: BusinessProfile | null): string {
  const networks =
    profile?.networks
      ?.filter((n) => n.enabled)
      .map((n) => {
        const mode =
          n.mode === "personal"
            ? "פרטי – שיתוף מהיר"
            : n.mode === "creator"
              ? "יוצר/עסקי – פרסום אוטומטי"
              : "עסקי – פרסום אוטומטי";
        return `${networkLabel(n.platform)} (${mode})`;
      })
      .join(", ") || "עדיין לא הוגדרו";

  const biz = profile
    ? `פרטי העסק השמורים:
- שם: ${profile.businessName}
- תחום: ${profile.businessField}
- וואטסאפ: ${profile.whatsapp}
- טלפון: ${profile.phone || "לא הוזן"}
- מיקום/אתר: ${profile.locationOrWebsite || "לא הוזן"}
- רשתות מחוברות: ${networks}`
    : "עדיין אין פרופיל עסק שמור.";

  return `אתה סוכן שיווק חכם בעברית פשוטה וברורה, בתוך מערכת SocialAI Pro לעסקים קטנים בישראל.

${biz}

כללים חשובים:
- ענה בעברית בלבד, קצר וברור, בלי ז'רגון טכני מיותר.
- השתמש תמיד בשם העסק ובפרטי הוואטסאפ כשיש תוכן עם קריאה לפעולה.
- הבחן בין חשבונות עסקיים/Creator (פרסום אוטומטי דרך API) לבין חשבונות פרטיים (שיתוף מהיר / העתקה).
- הרשתות הנתמכות: פייסבוק, אינסטגרם, וואטסאפ, טלגרם, לינקדאין, טיקטוק, יוטיוב, X (טוויטר), Threads, פינטרסט.
- כשמכינים תוכן: הצע ניסוח, האשטאגים, ולוח זמנים מומלץ.
- בסוף תשובה מועילה הוסף שורה אחת עם הצעות פעולה בפורמט:
פעולות: אשר ותזמן אוטומטית | ערוך טקסט | החלף תמונה`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "חסר OPENROUTER_API_KEY. הוסיפו אותו לקובץ .env.local והפעילו מחדש את השרת.",
      },
      { status: 500 }
    );
  }

  let body: { messages?: IncomingMessage[]; profile?: BusinessProfile | null };
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
          temperature: 0.7,
          max_tokens: 900,
          messages: [
            { role: "system", content: buildSystemPrompt(body.profile) },
            ...messages,
          ],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      const detail =
        data?.error?.message || data?.error || "שגיאה מול OpenRouter";
      return NextResponse.json(
        { error: String(detail) },
        { status: response.status }
      );
    }

    const content =
      data?.choices?.[0]?.message?.content?.trim() ||
      "לא התקבלה תשובה מהסוכן. נסו שוב.";

    const actions = extractActions(content);
    const reply = stripActionsLine(content);

    return NextResponse.json({ reply, actions, model });
  } catch (err) {
    console.error("OpenRouter chat error:", err);
    return NextResponse.json(
      { error: "חיבור ל־OpenRouter נכשל. בדקו רשת ומפתח API." },
      { status: 502 }
    );
  }
}

function extractActions(text: string): string[] {
  const match = text.match(/פעולות:\s*(.+)$/m);
  if (!match) {
    return ["אשר ותזמן אוטומטית", "ערוך טקסט", "החלף תמונה"];
  }
  return match[1]
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function stripActionsLine(text: string): string {
  return text.replace(/\n?פעולות:\s*.+$/m, "").trim();
}
