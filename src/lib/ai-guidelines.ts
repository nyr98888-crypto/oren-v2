import type { BusinessProfile } from "@/lib/profile";
import { networkLabel, toWhatsAppLink } from "@/lib/profile";
import {
  formatPlatformRulesForPrompt,
  getRulesForConnectedProfile,
} from "@/lib/platform-rules";
import type { CalendarEvent } from "@/types/campaign";

export const SYSTEM_CAMPAIGN_GUIDELINES = `
אתה סוכן שיווק וסושיאל מקצועי הפועל תחת חוקים נוקשים. אסור לך בשום אופן להמציא עובדות או "להזות".

### חוקי יסוד ואמינות (Anti-Hallucination Rules):
1. **הסתמכות על עובדות בלבד:** השתמש אך ורק בפרטי העסק שסופקו (שם העסק, טלפון, וואטסאפ, תחום, שעות פעילות). אם חסר מידע קריטי (כגון מחיר מדויק או מבצע), שאל את המשתמש או השאר מקום מסומן בבירור כמו [נא להשלים מחיר], אך לעולם אל תמציא מחירים, הנחות או כתובות שלא ניתנו.
2. **כללי וואטסאפ מוחלטים:** כל הנעה לפעולה בוואטסאפ חייבת להשתמש אך ורק במספר שהוגדר בפרופיל בתבנית 'https://wa.me/[מספר]?text=[הודעה]'.
3. **התאמה קשיחה לרשתות (Platform Content Adapter):**
   - לכל פלטפורמה וריאנט **נפרד ומנודס** לפי מטריצת החוקים שמוזרקת למטה — לא העתק־הדבק.
   - אסור להשתמש באותו כיתוב/תסריט/CTA ביותר מרשת אחת.
   - התאם טון, אורך, מבנה, הוקים, האשטאגים ו־CTA לפי PLATFORM_RULES_DATABASE.
4. **פורמט פלט חובה:** עליך להחזיר תמיד תשובה במבנה JSON תקין ומדויק בלבד, כדי שהמערכת תוכל לפזר את המידע ליומן, לתצוגה המקדימה ולסטודיו ללא שגיאות.
`;

export const JSON_SCHEMA_INSTRUCTION = `
החזר אובייקט JSON אחד בלבד (בלי markdown ובלי טקסט מחוץ ל-JSON) במבנה המדויק הבא:
{
  "campaignTitle": "string",
  "suggestedScheduleDate": "ISO-8601 string או מחרוזת ריקה אם אין תזמון",
  "calendarEventNote": "תזכורת קצרה ליומן",
  "summaryToUser": "הסבר קצר וידידותי בעברית פשוטה",
  "platforms": {
    "facebook_business": { "caption": "...", "ctaText": "..." },
    "facebook_personal": { "caption": "...", "shareTip": "..." },
    "instagram": { "caption": "...", "hashtags": ["#..."], "visualPrompt": "..." },
    "tiktok": { "scriptHook": "...", "scriptBody": "...", "visualScenePrompt": "..." },
    "whatsapp": { "messageText": "...", "waLink": "https://wa.me/..." },
    "telegram": { "messageText": "..." },
    "linkedin": { "caption": "...", "ctaText": "..." },
    "youtube_shorts": { "title": "...", "script": "...", "description": "..." },
    "threads": { "caption": "..." }
  },
  "creativeStudio": {
    "imagePrompt": "פרומפט מדויק למחולל תמונות",
    "videoPrompt": "אופציונלי",
    "logoConcept": "אופציונלי"
  }
}

כל וריאנט ב־platforms חייב להיות ייחודי לפלטפורמה (לא אותו טקסט). מלא לפי מטריצת החוקים.
אם חסר מידע קריטי: מלא summaryToUser בשאלה ברורה, השאר platforms ריק או חלקי, ואל תמציא מחירים/הנחות/כתובות.
כלול רק פלטפורמות רלוונטיות לפרופיל או לבקשת המשתמש.
`;

export function buildVerifiedBusinessContext(
  profile?: BusinessProfile | null
): string {
  if (!profile) {
    return `### הקשר עסק מאומת:\nאין פרופיל עסק. אל תמציא פרטים.`;
  }

  const networks =
    profile.networks
      .filter((n) => n.enabled)
      .map((n) => {
        const mode =
          n.mode === "personal"
            ? "פרטי – שיתוף מהיר"
            : n.mode === "creator"
              ? "יוצר/עסקי – פרסום אוטומטי"
              : "עסקי – פרסום אוטומטי";
        return `- ${networkLabel(n.platform)}: ${mode}`;
      })
      .join("\n") || "- אין רשתות מחוברות";

  return `### הקשר עסק מאומת (מקור אמת יחיד):
- שם העסק: ${profile.businessName}
- תחום: ${profile.businessField}
- וואטסאפ: ${profile.whatsapp}
- בסיס קישור: ${toWhatsAppLink(profile.whatsapp)}
- טלפון: ${profile.phone || "לא סופק"}
- מיקום/אתר: ${profile.locationOrWebsite || "לא סופק"}
- שעות פעילות: לא סופקו (אל תמציא)
- רשתות מחוברות:
${networks}`;
}

export function buildCalendarContext(events: CalendarEvent[] = []): string {
  if (!events.length) {
    return `### יומן שיווק נוכחי:\nאין אירועים מתוזמנים עדיין.`;
  }

  const lines = events
    .slice(0, 12)
    .map(
      (e) =>
        `- ${e.datetime}: ${e.title}${e.note ? ` (${e.note})` : ""}${e.source === "user" ? " [סומן ע״י משתמש]" : ""}`
    )
    .join("\n");

  return `### יומן שיווק נוכחי (התחשב בתאריכים האלה; אל תשכפל סתם):\n${lines}`;
}

export function buildSystemPrompt(
  profile?: BusinessProfile | null,
  calendarEvents: CalendarEvent[] = []
): string {
  const connectedRules = getRulesForConnectedProfile(profile?.networks);
  const platformKeys = connectedRules.map((r) => r.platform);
  const platformRulesBlock = formatPlatformRulesForPrompt(platformKeys);

  return [
    SYSTEM_CAMPAIGN_GUIDELINES.trim(),
    buildVerifiedBusinessContext(profile).trim(),
    platformRulesBlock.trim(),
    buildCalendarContext(calendarEvents).trim(),
    JSON_SCHEMA_INSTRUCTION.trim(),
  ].join("\n\n");
}
