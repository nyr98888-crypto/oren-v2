import type { SelectedNetwork } from "@/lib/profile";

export interface NetworkRules {
  platform: string;
  charLimit: number;
  optimalLength: string;
  bestTone: string;
  structuralRequirements: string[];
  algorithmBestPractices: string[];
}

/** Canonical keys used in prompts and (where applicable) campaign JSON. */
export const PLATFORM_RULES_DATABASE: Record<string, NetworkRules> = {
  instagram_reels: {
    platform: "instagram_reels",
    charLimit: 2200,
    optimalLength: "הוק ב־125 תווים ראשונים; כיתוב מלא עד ~300–600 תווים",
    bestTone: "ויזואלי, מסקרן, קליל־מקצועי בעברית טבעית",
    structuralRequirements: [
      "פתיח (Hook) חזק ב־125 התווים הראשונים — עוצר גלילה לפני 'עוד…'",
      "תיאור ויזואלי ברור של פריים/תנועה בפורמט 9:16",
      "5–7 האשטאגים בעברית (ממוקדים לעסק/תחום, לא ספאם כללי)",
      "CTA להנעה לוואטסאפ עם מילת מפתח/משפט מוכן להקלדה (למשל: שלחו 'מבצע')",
      "בסכמת JSON של הקמפיין: מלא את המפתח platforms.instagram (caption, hashtags, visualPrompt)",
    ],
    algorithmBestPractices: [
      "3 השניות הראשונות חייבות להיות scroll-stopper (תנועה, שאלה, או ניגוד חזק)",
      "כתוביות על המסך — רוב הצופים צופים בלי קול",
      "שמור על קצב עריכה גבוה; אל תפתח כמו פרסומת טלוויזיה",
      "האשטאגים רלוונטיים לנישה מקומית + מותג; הימנע מרשימות גנריות באנגלית בלבד",
      "סיום עם שאלה או הנחיה ברורה שמגבירה תגובות/שמירות",
    ],
  },

  tiktok: {
    platform: "tiktok",
    charLimit: 4000,
    optimalLength: "טקסט קצר ~150 תווים; תסריט מלא נפרד (פתיח/גוף/CTA)",
    bestTone: "עברית רחוב טבעית, אותנטית, לא פרסומית־טלוויזיונית",
    structuralRequirements: [
      "טקסט פוסט קצר (~150 תווים) נפרד מהתסריט",
      "תסריט מלא: פתיח 1–3 שניות → גוף → CTA",
      "הנחיות לכתוביות על המסך (מילים מדויקות לכל סצנה)",
      "בסכמת JSON: platforms.tiktok עם scriptHook, scriptBody, visualScenePrompt",
    ],
    algorithmBestPractices: [
      "אופטימיזציה ל־watch-time: אל תיתן לצופה סיבה לעזוב בשנייה 2",
      "הימנע מתחושת פרסומת טלוויזיה — POV, מאחורי הקלעים, או 'לפני/אחרי'",
      "לופים טבעיים והפתעה קטנה באמצע מגבירים צפייה חוזרת",
      "קול/מוזיקה משניים לכתוביות — רוב הצופים בלי סאונד",
      "CTA אחד ברור (לינק בביו / מילת מפתח לוואטסאפ) — בלי רשימת קישורים",
    ],
  },

  facebook_business: {
    platform: "facebook_business",
    charLimit: 63206,
    optimalLength: "פורם ארוך: 3–5 פסקאות קצרות (סיפור → ערך → CTA)",
    bestTone: "שירותי־מקצועי, ברור ואמין — בלי סלנג מוגזם",
    structuralRequirements: [
      "3–5 פסקאות קצרות בסגנון storytelling (בעיה/הקשר → פתרון → תועלת)",
      "שפת כפתור CTA ברורה לוואטסאפ (למשל: 'שלחו הודעה בוואטסאפ')",
      "בסכמת JSON: platforms.facebook_business עם caption ו־ctaText",
    ],
    algorithmBestPractices: [
      "משפט ראשון חייב לעבוד גם כשקטוע בפיד",
      "שאלות וסיפור אישי של העסק מגבירים תגובות ושיתופים",
      "CTA אחד בולט בסוף — אל תפזר מספר קריאות לפעולה סותרות",
      "הימנע מקישורים מרובים בגוף; העדף כפתור/הנחיה אחת לוואטסאפ",
    ],
  },

  facebook_personal: {
    platform: "facebook_personal",
    charLimit: 63206,
    optimalLength: "קצר יותר מדף עסקי — פסקה־שתיים, ידידותי לשיתוף בלחיצה",
    bestTone: "גוף ראשון אותנטי, חם, בלי ז'רגון מכירות קשיח",
    structuralRequirements: [
      "ניסוח בגוף ראשון ('אני'/'אנחנו' אישי) — לא כאילו דף מותג",
      "בלי ביטויי מכירה קשיחים ('הזדמנות אחרונה!!!', 'רק היום')",
      "טקסט ידידותי לשיתוף בלחיצה אחת (קצר, ברור, לא 'מודעה')",
      "בסכמת JSON: platforms.facebook_personal עם caption ו־shareTip",
    ],
    algorithmBestPractices: [
      "תוכן שנשמע כמו המלצה מחבר מניב יותר שיתופים אורגניים",
      "שאלה רכה בסוף מעודדת תגובות בלי לחץ מכירה",
      "אל תעתיק את כיתוב הדף העסקי — התאם אישיות וקצב",
    ],
  },

  whatsapp: {
    platform: "whatsapp",
    charLimit: 4096,
    optimalLength: "אולטרה־קצר: 1–3 משפטים, בקשה אחת ברורה",
    bestTone: "ישיר, חם, כמו הודעת צ'אט אמיתית",
    structuralRequirements: [
      "הודעה ישירה קצרה עם בקשה אחת בלבד (למשל: לשריין תור / לקבל פרטים)",
      "קישור במבנה המעקב: https://wa.me/[מספר_מאומת]?text=[הודעה]",
      "בסכמת JSON: platforms.whatsapp עם messageText ו־waLink (המספר תמיד מהפרופיל)",
    ],
    algorithmBestPractices: [
      "אל תשלח פסקאות ארוכות — אנשים סורקים בצ'אט",
      "פתח בשם/הקשר קצר ואז הבקשה",
      "הימנע מקישורים מרובים או רשימות; שאלה אחת = תשובה אחת",
    ],
  },

  telegram: {
    platform: "telegram",
    charLimit: 4096,
    optimalLength: "פוסט ערוץ תמציתי וסריק — כותרת + 2–4 שורות",
    bestTone: "תמציתי, מסודר, CTA רך",
    structuralRequirements: [
      "מבנה סריק: שורת פתיחה בולטת → גוף קצר → CTA רך",
      "אפשר אימוג'י אחד־שניים לסימון, בלי הצפה",
      "בסכמת JSON: platforms.telegram עם messageText",
    ],
    algorithmBestPractices: [
      "ערוצים נסרקים במבט — שים את הערך בשורה הראשונה",
      "CTA רך ('לתיאום — השאירו הודעה / וואטסאפ') עדיף על לחץ מכירה",
      "שמור על עקביות סגנון הערוץ; אל תעתיק כיתוב מאינסטגרם",
    ],
  },

  linkedin: {
    platform: "linkedin",
    charLimit: 3000,
    optimalLength: "ערך תחילה: 120–250 מילים, פסקאות קצרות",
    bestTone: "עברית מקצועית, ערך־ראשון, מינימום אימוג'י",
    structuralRequirements: [
      "פתיחה עם תובנה/ערך עסקי לפני המבצע",
      "מינימום אימוג'י (0–2); בלי האשטאגים מוגזמים",
      "CTA רך בסוף (שיחה / וואטסאפ / תגובה) — לא 'קנו עכשיו'",
      "אם נדרש בקמפיין: הוסף platforms.linkedin כ־{ caption, ctaText } או שלב בסיכום",
    ],
    algorithmBestPractices: [
      "שורה ראשונה קובעת אם ילחצו 'ראה עוד'",
      "סיפור קצר + לקח מעשי מניב יותר engagement ממודעת מבצע יבשה",
      "האשטאגים: 3 לכל היותר, מקצועיים ורלוונטיים",
    ],
  },

  youtube_shorts: {
    platform: "youtube_shorts",
    charLimit: 5000,
    optimalLength: "תסריט אנכי 15–60 שנ׳ + כותרת קצרה ותיאור עם מילות מפתח",
    bestTone: "אנרגטי־ברור, מותאם ל־Shorts (לא טריילר ארוך)",
    structuralRequirements: [
      "תסריט אנכי מלא: הוק → גוף → CTA על המסך",
      "כותרת קצרה (עד ~70 תווים) ותיאור עם מילות מפתח בעברית",
      "הנחיית ויזואל 9:16 בסגנון Shorts",
      "אם נדרש בקמפיין: platforms.youtube_shorts כ־{ title, script, description } או videoPrompt בסטודיו",
    ],
    algorithmBestPractices: [
      "שנייה 1 חייבת להסביר 'למה להישאר' — בלי אינטרו ארוך",
      "כתוביות חובה; סיום עם לולאה או שאלה שמעודדת צפייה חוזרת",
      "כותרת עם הבטחת ערך ספציפית עדיפה על כותרת גנרית",
    ],
  },

  threads: {
    platform: "threads",
    charLimit: 500,
    optimalLength: "פוסט שיחתי קצר — משפט־שניים עד פסקה קצרה",
    bestTone: "שיחתי, קליל, כמו עדכון לחברים — לא מודעה",
    structuralRequirements: [
      "טקסט קצר ושיחתי; אפשר שאלה פתוחה",
      "בלי האשטאגים כבדים ובלי שפת מכירות קשיחה",
      "אם נדרש בקמפיין: platforms.threads כ־{ caption }",
    ],
    algorithmBestPractices: [
      "נשמע אנושי = יותר תגובות; הימנע מהעתקת כיתוב אינסטגרם מלא",
      "שאלה אחת בסוף עדיפה על CTA אגרסיבי",
      "שמור על אורך שמתאים לנייד — קריא במבט אחד",
    ],
  },
};

/** Map onboarding/dashboard network ids (+ mode) → rules database keys. */
export function mapNetworkToRulesKeys(
  platform: string,
  mode?: string
): string[] {
  switch (platform) {
    case "facebook":
      if (mode === "personal") return ["facebook_personal"];
      if (mode === "business" || mode === "creator") return ["facebook_business"];
      return ["facebook_business", "facebook_personal"];
    case "instagram":
      return ["instagram_reels"];
    case "tiktok":
      return ["tiktok"];
    case "whatsapp":
      return ["whatsapp"];
    case "telegram":
      return ["telegram"];
    case "linkedin":
      return ["linkedin"];
    case "youtube":
      return ["youtube_shorts"];
    case "threads":
      return ["threads"];
    case "instagram_reels":
    case "facebook_business":
    case "facebook_personal":
    case "youtube_shorts":
      return [platform];
    default:
      return PLATFORM_RULES_DATABASE[platform] ? [platform] : [];
  }
}

/**
 * Resolve which PLATFORM_RULES_DATABASE keys apply to the connected profile networks.
 */
export function getRulesForConnectedProfile(
  networks: SelectedNetwork[] | undefined | null
): NetworkRules[] {
  if (!networks?.length) {
    return Object.values(PLATFORM_RULES_DATABASE);
  }

  const keys = new Set<string>();
  for (const n of networks) {
    if (!n.enabled) continue;
    for (const key of mapNetworkToRulesKeys(n.platform, n.mode)) {
      keys.add(key);
    }
  }

  if (keys.size === 0) {
    return Object.values(PLATFORM_RULES_DATABASE);
  }

  return Array.from(keys)
    .map((k) => PLATFORM_RULES_DATABASE[k])
    .filter((r): r is NetworkRules => Boolean(r));
}

function serializeRule(rule: NetworkRules): string {
  const structural = rule.structuralRequirements
    .map((s) => `    - ${s}`)
    .join("\n");
  const practices = rule.algorithmBestPractices
    .map((s) => `    - ${s}`)
    .join("\n");

  return `### ${rule.platform}
- מגבלת תווים: ${rule.charLimit}
- אורך אופטימלי: ${rule.optimalLength}
- טון מומלץ: ${rule.bestTone}
- דרישות מבנה:
${structural}
- שיטות עבודה לאלגוריתם:
${practices}`;
}

/**
 * Serialize relevant platform rules into a system-prompt block.
 * Pass canonical keys (e.g. instagram_reels) and/or dashboard ids (instagram, facebook…).
 */
export function formatPlatformRulesForPrompt(
  enabledPlatforms?: string[]
): string {
  let rules: NetworkRules[];

  if (!enabledPlatforms?.length) {
    rules = Object.values(PLATFORM_RULES_DATABASE);
  } else {
    const keys = new Set<string>();
    for (const p of enabledPlatforms) {
      for (const key of mapNetworkToRulesKeys(p)) {
        keys.add(key);
      }
      if (PLATFORM_RULES_DATABASE[p]) keys.add(p);
    }
    rules = Array.from(keys)
      .map((k) => PLATFORM_RULES_DATABASE[k])
      .filter((r): r is NetworkRules => Boolean(r));
    if (rules.length === 0) {
      rules = Object.values(PLATFORM_RULES_DATABASE);
    }
  }

  const body = rules.map(serializeRule).join("\n\n");

  return `### מטריצת חוקי פלטפורמות (חובה — Platform Content Adapter)
לכל רשת מחוברת/מבוקשת עליך להפיק וריאנט **מונדס הנדסית** לפי החוקים למטה.
חוקים מוחלטים:
1. **לעולם אל תעתיק** את אותו כיתוב בין פלטפורמות — כל וריאנט חייב להיות שונה בטון, באורך, במבנה, בהוק, בהאשטאגים וב־CTA.
2. התאם טון, אורך, מבנה, הוקים, האשטאגים ו־CTA לפי PLATFORM_RULES_DATABASE של אותה רשת.
3. חוקי Anti-Hallucination עדיין חלים — רק עובדות עסק מאומתות מהפרופיל.
4. העדף את סכמת JSON של הקמפיין (AICampaignResponse.platforms) עם שדות נפרדים לכל פלטפורמה.

${body}`;
}

/** UI helper: tip line for the active preview tab. */
export function getPlatformTipForTab(
  tabId: string,
  accountKind?: "business" | "creator" | "personal" | string
): { optimalLength: string; bestTone: string } | null {
  let key: string | undefined;
  switch (tabId) {
    case "instagram":
      key = "instagram_reels";
      break;
    case "facebook":
      key =
        accountKind === "personal" ? "facebook_personal" : "facebook_business";
      break;
    case "facebook_business":
    case "facebook_personal":
      key = tabId;
      break;
    case "tiktok":
      key = "tiktok";
      break;
    case "whatsapp":
      key = "whatsapp";
      break;
    case "telegram":
      key = "telegram";
      break;
    case "linkedin":
      key = "linkedin";
      break;
    case "youtube":
      key = "youtube_shorts";
      break;
    case "threads":
      key = "threads";
      break;
    default:
      key = PLATFORM_RULES_DATABASE[tabId] ? tabId : undefined;
  }
  if (!key) return null;
  const rule = PLATFORM_RULES_DATABASE[key];
  if (!rule) return null;
  return { optimalLength: rule.optimalLength, bestTone: rule.bestTone };
}
