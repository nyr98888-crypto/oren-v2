export interface AICampaignResponse {
  campaignTitle: string;
  suggestedScheduleDate: string; // ISO format (e.g. "2026-10-28T18:00:00Z")
  calendarEventNote: string; // תזכורת קצרה שתופיע ביומן
  summaryToUser: string; // הסבר קצר וידידותי בעברית פשוטה בצ'אט
  platforms: {
    facebook_business?: { caption: string; ctaText: string };
    facebook_personal?: { caption: string; shareTip: string };
    instagram?: { caption: string; hashtags: string[]; visualPrompt: string };
    tiktok?: {
      scriptHook: string;
      scriptBody: string;
      visualScenePrompt: string;
    };
    whatsapp?: { messageText: string; waLink: string };
    telegram?: { messageText: string };
    linkedin?: { caption: string; ctaText: string };
    youtube_shorts?: { title: string; script: string; description: string };
    threads?: { caption: string };
  };
  creativeStudio: {
    imagePrompt: string;
    videoPrompt?: string;
    logoConcept?: string;
  };
}

export type CalendarEventSource = "ai" | "user";

export interface CalendarEvent {
  id: string;
  title: string;
  datetime: string;
  note: string;
  source: CalendarEventSource;
  platforms?: string[];
}

export type PreviewTabId =
  | "instagram"
  | "facebook_business"
  | "facebook_personal"
  | "whatsapp"
  | "telegram"
  | "tiktok";

export const EMPTY_CAMPAIGN: AICampaignResponse = {
  campaignTitle: "",
  suggestedScheduleDate: "",
  calendarEventNote: "",
  summaryToUser:
    "קיבלתי. כדי להכין קמפיין מדויק בלי להמציא פרטים — ספר לי מה המבצע או המוצר, ובאילו רשתות לפרסם.",
  platforms: {},
  creativeStudio: {
    imagePrompt: "",
  },
};
