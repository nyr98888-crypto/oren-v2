import type {
  AutomationMode,
  CampaignDraft,
  ChatMessage,
  ConnectedAccount,
} from "@/types/social";

export const MOCK_ACCOUNTS: ConnectedAccount[] = [
  {
    id: "acc-fb-business",
    platform: "facebook",
    accountName: "קפה אורן – עמוד עסקי",
    accountType: "business",
    isConnected: true,
  },
  {
    id: "acc-ig-creator",
    platform: "instagram",
    accountName: "@oren_cafe",
    accountType: "creator",
    isConnected: true,
  },
  {
    id: "acc-fb-personal",
    platform: "facebook",
    accountName: "ניר כהן (פרטי)",
    accountType: "personal",
    isConnected: true,
  },
  {
    id: "acc-wa",
    platform: "whatsapp",
    accountName: "וואטסאפ עסקי",
    accountType: "business",
    isConnected: true,
  },
  {
    id: "acc-tg",
    platform: "telegram",
    accountName: "ערוץ קפה אורן",
    accountType: "business",
    isConnected: true,
  },
  {
    id: "acc-li",
    platform: "linkedin",
    accountName: "ניר כהן – לינקדאין",
    accountType: "personal",
    isConnected: false,
  },
];

export const DEFAULT_AUTOMATION_MODE: AutomationMode = "semi_auto";

const SAMPLE_MEDIA =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80";

export const MOCK_CAMPAIGN: CampaignDraft = {
  id: "camp-weekend",
  title: "מבצע סוף שבוע – קפה + מאפה",
  status: "ready_for_review",
  scheduledTime: "2026-10-29T18:00:00",
  targetAccounts: [
    "acc-fb-business",
    "acc-ig-creator",
    "acc-fb-personal",
    "acc-wa",
    "acc-tg",
  ],
  variants: {
    facebook: {
      platform: "facebook",
      caption:
        "סוף שבוע טעים בקפה אורן ☕\nקפה + מאפה לבחירה ב־29 ₪ בלבד.\nמחכים לכם עד שבת בערב!",
      mediaUrl: SAMPLE_MEDIA,
      mediaType: "image",
      hashtags: ["#קפהאורן", "#סופש", "#מבצע"],
      ctaUrl: "https://wa.me/972501234567",
    },
    instagram: {
      platform: "instagram",
      caption:
        "סופ״ש מושלם מתחיל כאן ✨\nקפה + מאפה = 29 ₪\nתייגו חבר שמגיע איתכם 👇",
      mediaUrl: SAMPLE_MEDIA,
      mediaType: "image",
      hashtags: ["#cafe", "#weekenddeal", "#אורן"],
    },
    whatsapp: {
      platform: "whatsapp",
      caption:
        "היי! ☕ מבצע סוף שבוע בקפה אורן:\nקפה + מאפה ב־29 ₪.\nרוצים לשריין שולחן? השאירו הודעה.",
      mediaUrl: SAMPLE_MEDIA,
      mediaType: "image",
      hashtags: [],
      ctaUrl: "https://wa.me/972501234567",
    },
    telegram: {
      platform: "telegram",
      caption:
        "📢 מבצע סוף שבוע בערוץ!\nקפה + מאפה ב־29 ₪ עד שבת.\nפרטים והזמנות בתגובות.",
      mediaUrl: SAMPLE_MEDIA,
      mediaType: "image",
      hashtags: ["#מבצע", "#קפה"],
    },
    linkedin: {
      platform: "linkedin",
      caption:
        "סוף שבוע הוא הזדמנות לעצור רגע.\nבקפה אורן מחכים לכם עם מבצע קפה + מאפה ב־29 ₪ — הזמנה קטנה לאיזון גדול יותר.",
      mediaUrl: SAMPLE_MEDIA,
      mediaType: "image",
      hashtags: ["#עסקיםקטנים", "#שיווק"],
    },
  },
};

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "m1",
    role: "agent",
    content:
      "שלום! אני הסוכן שלך לשיווק ברשתות. ספר לי מה תרצה לקדם היום — מבצע, אירוע, או פוסט רגיל.",
    timestamp: "16:40",
  },
  {
    id: "m2",
    role: "user",
    content: "תכין לי מודעה למבצע סוף שבוע: קפה + מאפה ב־29 שקל.",
    timestamp: "16:41",
  },
  {
    id: "m3",
    role: "agent",
    content:
      "הכנתי את המודעה לסוף שבוע. לפייסבוק העסקי אני אתזמן פרסום אוטומטי ליום חמישי ב־18:00. לחשבון הפרטי שלך הכנתי כפתור שיתוף מהיר שמעתיק את הטקסט ומוריד את התמונה בלחיצה אחת.",
    quickActions: ["אשר ותזמן להפצה", "שנה ניסוח", "החלף תמונה"],
    timestamp: "16:42",
  },
];
