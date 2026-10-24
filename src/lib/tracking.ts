import type {
  AnalyticsStore,
  AnalyticsSummary,
  PlatformAccountType,
  PlatformMetrics,
  TrackedClickEvent,
  TrackEventKind,
} from "@/types/analytics";
import { toWhatsAppLink } from "@/lib/profile";

export const ANALYTICS_STORAGE_KEY = "socialai_pro_analytics_v1";

/** Hebrew source tags embedded in WhatsApp prefill text */
export const PLATFORM_SOURCE_TAGS: Record<string, string> = {
  facebook: "הגעתי_מפייסבוק",
  facebook_business: "הגעתי_מפייסבוק_עסקי",
  facebook_personal: "הגעתי_מפייסבוק_פרטי",
  instagram: "הגעתי_מאינסטגרם",
  telegram: "הגעתי_מטלגרם",
  tiktok: "הגעתי_מטיקטוק",
  youtube: "הגעתי_מיוטיוב",
  linkedin: "הגעתי_מלינקדאין",
  whatsapp: "הגעתי_מוואטסאפ",
  x: "הגעתי_מטוויטר",
  threads: "הגעתי_מטרדס",
  pinterest: "הגעתי_מפינטרסט",
};

const PLATFORM_META: Record<
  string,
  {
    platformName: string;
    icon: string;
    accountType: PlatformAccountType;
    topPerformingPost: string;
  }
> = {
  facebook_business: {
    platformName: "פייסבוק (עסקי)",
    icon: "📘",
    accountType: "business",
    topPerformingPost: "מבצע חמישי — פוסט דף עסקי",
  },
  facebook_personal: {
    platformName: "פייסבוק (פרטי)",
    icon: "👤",
    accountType: "personal",
    topPerformingPost: "שיתוף אישי — מבצע חמישי",
  },
  facebook: {
    platformName: "פייסבוק",
    icon: "📘",
    accountType: "business",
    topPerformingPost: "מבצע חמישי — פייסבוק",
  },
  instagram: {
    platformName: "אינסטגרם",
    icon: "📸",
    accountType: "business",
    topPerformingPost: "רילס מבצע חמישי",
  },
  telegram: {
    platformName: "טלגרם",
    icon: "✈️",
    accountType: "business",
    topPerformingPost: "הודעת ערוץ — מבצע",
  },
  tiktok: {
    platformName: "טיקטוק",
    icon: "🎵",
    accountType: "personal",
    topPerformingPost: "POV מבצע חמישי",
  },
  youtube: {
    platformName: "יוטיוב",
    icon: "▶️",
    accountType: "business",
    topPerformingPost: "Shorts מאחורי הקלעים",
  },
  linkedin: {
    platformName: "לינקדאין",
    icon: "💼",
    accountType: "business",
    topPerformingPost: "פוסט B2B — נוכחות עקבית",
  },
  whatsapp: {
    platformName: "וואטסאפ",
    icon: "💬",
    accountType: "business",
    topPerformingPost: "סטטוס מבצע חמישי",
  },
  x: {
    platformName: "X",
    icon: "𝕏",
    accountType: "personal",
    topPerformingPost: "ציוץ מבצע",
  },
  threads: {
    platformName: "Threads",
    icon: "🧵",
    accountType: "personal",
    topPerformingPost: "שרשור מבצע",
  },
  pinterest: {
    platformName: "פינטרסט",
    icon: "📌",
    accountType: "business",
    topPerformingPost: "פין השראה + מבצע",
  },
};

function emptyStore(): AnalyticsStore {
  return {
    version: 1,
    seeded: false,
    growthPercentage: 0,
    events: [],
    platforms: {},
  };
}

function ensurePlatform(
  store: AnalyticsStore,
  platformId: string
): AnalyticsStore["platforms"][string] {
  if (!store.platforms[platformId]) {
    const meta = PLATFORM_META[platformId] ?? {
      platformName: platformId,
      icon: "📊",
      accountType: "business" as PlatformAccountType,
      topPerformingPost: "—",
    };
    store.platforms[platformId] = {
      platformId,
      platformName: meta.platformName,
      icon: meta.icon,
      accountType: meta.accountType,
      views: 0,
      linkClicks: 0,
      whatsappLeads: 0,
      topPerformingPost: meta.topPerformingPost,
    };
  }
  return store.platforms[platformId];
}

function conversionRate(leads: number, clicks: number): number {
  if (!clicks || clicks <= 0) return 0;
  return Math.round((leads / clicks) * 1000) / 10;
}

function withConversion(
  p: Omit<PlatformMetrics, "conversionRate">
): PlatformMetrics {
  return {
    ...p,
    conversionRate: conversionRate(p.whatsappLeads, p.linkClicks),
  };
}

export function loadAnalyticsStore(): AnalyticsStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as AnalyticsStore;
    if (!parsed || parsed.version !== 1) return emptyStore();
    return {
      ...emptyStore(),
      ...parsed,
      events: Array.isArray(parsed.events) ? parsed.events : [],
      platforms: parsed.platforms ?? {},
    };
  } catch {
    return emptyStore();
  }
}

export function saveAnalyticsStore(store: AnalyticsStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(store));
}

/**
 * Build a WhatsApp deep-link with platform attribution.
 * Embeds Hebrew source tag in the message AND `?src=` on the URL path query.
 */
export function buildTrackedWhatsAppLink(
  phone: string,
  message: string,
  platformId: string
): string {
  const base = toWhatsAppLink(phone);
  const sourceTag =
    PLATFORM_SOURCE_TAGS[platformId] ??
    PLATFORM_SOURCE_TAGS[platformId.replace(/_business|_personal/, "")] ??
    `הגעתי_מ${platformId}`;

  const srcParam = platformId.replace(/\s+/g, "_").toLowerCase();
  const body = [message.trim(), "", `מקור: ${sourceTag}`, `#src_${srcParam}`]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");

  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}text=${encodeURIComponent(body)}&src=${encodeURIComponent(srcParam)}`;
}

export function trackEvent(
  platformId: string,
  kind: TrackEventKind,
  meta?: string
): AnalyticsSummary {
  const store = loadAnalyticsStore();
  const platform = ensurePlatform(store, platformId);

  if (kind === "view") platform.views += 1;
  else if (kind === "link_click") platform.linkClicks += 1;
  else if (kind === "whatsapp_lead") platform.whatsappLeads += 1;

  const event: TrackedClickEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    platformId,
    kind,
    meta,
  };
  store.events = [...store.events.slice(-499), event];
  saveAnalyticsStore(store);
  return summarize(store);
}

function pickBestPlatform(
  platforms: Record<string, PlatformMetrics>
): string {
  const list = Object.values(platforms);
  if (list.length === 0) return "—";
  const sorted = [...list].sort((a, b) => {
    if (b.whatsappLeads !== a.whatsappLeads) {
      return b.whatsappLeads - a.whatsappLeads;
    }
    return b.linkClicks - a.linkClicks;
  });
  return sorted[0]?.platformName ?? "—";
}

function summarize(store: AnalyticsStore): AnalyticsSummary {
  const platforms: Record<string, PlatformMetrics> = {};
  for (const [id, p] of Object.entries(store.platforms)) {
    platforms[id] = withConversion(p);
  }
  const list = Object.values(platforms);
  return {
    totalClicks: list.reduce((s, p) => s + p.linkClicks, 0),
    totalWhatsAppLeads: list.reduce((s, p) => s + p.whatsappLeads, 0),
    bestPlatform: pickBestPlatform(platforms),
    growthPercentage: store.growthPercentage,
    platforms,
  };
}

/** Realistic mock data so the Advisor is useful before real traffic */
export function seedDemoAnalytics(force = false): AnalyticsSummary {
  const existing = loadAnalyticsStore();
  if (existing.seeded && !force) {
    return summarize(existing);
  }

  const demo: AnalyticsStore = {
    version: 1,
    seeded: true,
    growthPercentage: 18,
    events: [],
    platforms: {},
  };

  const rows: Array<{
    id: string;
    views: number;
    linkClicks: number;
    whatsappLeads: number;
  }> = [
    { id: "instagram", views: 4200, linkClicks: 186, whatsappLeads: 47 },
    { id: "facebook_business", views: 3100, linkClicks: 142, whatsappLeads: 38 },
    { id: "facebook_personal", views: 980, linkClicks: 41, whatsappLeads: 6 },
    { id: "tiktok", views: 8600, linkClicks: 210, whatsappLeads: 29 },
    { id: "telegram", views: 720, linkClicks: 64, whatsappLeads: 22 },
    { id: "whatsapp", views: 450, linkClicks: 95, whatsappLeads: 51 },
    { id: "youtube", views: 1900, linkClicks: 38, whatsappLeads: 5 },
    { id: "linkedin", views: 610, linkClicks: 22, whatsappLeads: 3 },
  ];

  for (const row of rows) {
    const p = ensurePlatform(demo, row.id);
    p.views = row.views;
    p.linkClicks = row.linkClicks;
    p.whatsappLeads = row.whatsappLeads;
  }

  const now = Date.now();
  demo.events = [
    {
      id: "demo-1",
      timestamp: new Date(now - 3600_000).toISOString(),
      platformId: "instagram",
      kind: "whatsapp_lead",
      meta: "demo",
    },
    {
      id: "demo-2",
      timestamp: new Date(now - 7200_000).toISOString(),
      platformId: "facebook_business",
      kind: "link_click",
      meta: "demo",
    },
  ];

  saveAnalyticsStore(demo);
  return summarize(demo);
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const store = loadAnalyticsStore();
  if (!store.seeded && Object.keys(store.platforms).length === 0) {
    return seedDemoAnalytics();
  }
  return summarize(store);
}

export function resetAnalytics(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ANALYTICS_STORAGE_KEY);
}

/** Map dashboard tab / account platform to analytics platformId */
export function resolveAnalyticsPlatformId(
  platform: string,
  accountKind?: "business" | "creator" | "personal"
): string {
  if (platform === "facebook") {
    if (accountKind === "personal") return "facebook_personal";
    return "facebook_business";
  }
  return platform;
}
