import {
  AICampaignResponse,
  EMPTY_CAMPAIGN,
} from "@/types/campaign";
import type { BusinessProfile } from "@/lib/profile";
import { toWhatsAppLink } from "@/lib/profile";

export function extractJsonObject(raw: string): unknown | null {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    /* continue */
  }

  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) {
    try {
      return JSON.parse(fence[1].trim());
    } catch {
      /* continue */
    }
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      return null;
    }
  }
  return null;
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v.trim() : fallback;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string").map((s) => s.trim());
}

export function normalizeCampaign(
  raw: unknown,
  profile?: BusinessProfile | null,
  fallbackSummary?: string
): AICampaignResponse {
  if (!raw || typeof raw !== "object") {
    return {
      ...EMPTY_CAMPAIGN,
      summaryToUser: fallbackSummary || EMPTY_CAMPAIGN.summaryToUser,
    };
  }

  const o = raw as Record<string, unknown>;
  const platformsRaw =
    o.platforms && typeof o.platforms === "object"
      ? (o.platforms as Record<string, unknown>)
      : {};
  const studioRaw =
    o.creativeStudio && typeof o.creativeStudio === "object"
      ? (o.creativeStudio as Record<string, unknown>)
      : {};

  const waBase = profile ? toWhatsAppLink(profile.whatsapp) : "https://wa.me/";

  const fbBiz = platformsRaw.facebook_business as Record<string, unknown> | undefined;
  const fbPer = platformsRaw.facebook_personal as Record<string, unknown> | undefined;
  const ig = platformsRaw.instagram as Record<string, unknown> | undefined;
  const tt = platformsRaw.tiktok as Record<string, unknown> | undefined;
  const wa = platformsRaw.whatsapp as Record<string, unknown> | undefined;
  const tg = platformsRaw.telegram as Record<string, unknown> | undefined;
  const li = platformsRaw.linkedin as Record<string, unknown> | undefined;
  const yt = platformsRaw.youtube_shorts as Record<string, unknown> | undefined;
  const th = platformsRaw.threads as Record<string, unknown> | undefined;

  const platforms: AICampaignResponse["platforms"] = {};

  if (fbBiz) {
    platforms.facebook_business = {
      caption: asString(fbBiz.caption),
      ctaText: asString(fbBiz.ctaText, "פנה אלינו בוואטסאפ"),
    };
  }
  if (fbPer) {
    platforms.facebook_personal = {
      caption: asString(fbPer.caption),
      shareTip: asString(fbPer.shareTip, "העתק ושתף בפרופיל האישי"),
    };
  }
  if (ig) {
    platforms.instagram = {
      caption: asString(ig.caption),
      hashtags: asStringArray(ig.hashtags).slice(0, 7),
      visualPrompt: asString(ig.visualPrompt),
    };
  }
  if (tt) {
    platforms.tiktok = {
      scriptHook: asString(tt.scriptHook),
      scriptBody: asString(tt.scriptBody),
      visualScenePrompt: asString(tt.visualScenePrompt),
    };
  }
  if (wa) {
    const messageText = asString(wa.messageText);
    // Always rebuild wa.me from verified profile number (anti-hallucination)
    const waLink = `${waBase}?text=${encodeURIComponent(messageText)}`;
    platforms.whatsapp = { messageText, waLink };
  }
  if (tg) {
    platforms.telegram = { messageText: asString(tg.messageText) };
  }
  if (li) {
    platforms.linkedin = {
      caption: asString(li.caption),
      ctaText: asString(li.ctaText, "בואו נדבר"),
    };
  }
  if (yt) {
    platforms.youtube_shorts = {
      title: asString(yt.title),
      script: asString(yt.script),
      description: asString(yt.description),
    };
  }
  if (th) {
    platforms.threads = { caption: asString(th.caption) };
  }

  return {
    campaignTitle: asString(o.campaignTitle),
    suggestedScheduleDate: asString(o.suggestedScheduleDate),
    calendarEventNote: asString(o.calendarEventNote),
    summaryToUser:
      asString(o.summaryToUser) ||
      fallbackSummary ||
      EMPTY_CAMPAIGN.summaryToUser,
    platforms,
    creativeStudio: {
      imagePrompt: asString(studioRaw.imagePrompt),
      videoPrompt: asString(studioRaw.videoPrompt) || undefined,
      logoConcept: asString(studioRaw.logoConcept) || undefined,
    },
  };
}

export function parseCampaignResponse(
  content: string,
  profile?: BusinessProfile | null
): AICampaignResponse {
  const parsed = extractJsonObject(content);
  if (!parsed) {
    return {
      ...EMPTY_CAMPAIGN,
      summaryToUser:
        content.trim().slice(0, 600) || EMPTY_CAMPAIGN.summaryToUser,
    };
  }
  return normalizeCampaign(parsed, profile, content.trim().slice(0, 400));
}

export function countConfiguredPlatforms(
  campaign: AICampaignResponse
): number {
  return Object.values(campaign.platforms).filter(Boolean).length;
}
