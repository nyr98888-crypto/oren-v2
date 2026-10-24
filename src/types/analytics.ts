export type TrackEventKind = "link_click" | "whatsapp_lead" | "view";

export type PlatformAccountType = "business" | "personal";

export interface TrackedClickEvent {
  id: string;
  timestamp: string;
  platformId: string;
  kind: TrackEventKind;
  meta?: string;
}

export interface PlatformMetrics {
  platformId: string;
  platformName: string;
  icon: string;
  accountType: PlatformAccountType;
  views: number;
  linkClicks: number;
  whatsappLeads: number;
  conversionRate: number;
  topPerformingPost: string;
}

export interface AnalyticsSummary {
  totalClicks: number;
  totalWhatsAppLeads: number;
  bestPlatform: string;
  growthPercentage: number;
  platforms: Record<string, PlatformMetrics>;
}

export interface AnalyticsStore {
  version: 1;
  seeded: boolean;
  growthPercentage: number;
  events: TrackedClickEvent[];
  platforms: Record<string, Omit<PlatformMetrics, "conversionRate">>;
}
