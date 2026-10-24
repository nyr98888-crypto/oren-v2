import type { BusinessProfile, NetworkMode, OnboardingPlatformId } from "@/lib/profile";
import { networkLabel } from "@/lib/profile";

export type DashboardPlatform =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "telegram"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "x"
  | "threads"
  | "pinterest";

export type AccountKind = "business" | "creator" | "personal";

export type DashboardAccount = {
  id: string;
  platform: DashboardPlatform;
  name: string;
  kind: AccountKind;
  badge: string;
  badgeClass: string;
  connected: boolean;
};

const BADGE_BUSINESS =
  "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
const BADGE_PERSONAL =
  "bg-amber-500/20 text-amber-300 border-amber-500/50";

function kindFromMode(mode: NetworkMode): AccountKind {
  if (mode === "personal") return "personal";
  if (mode === "creator") return "creator";
  return "business";
}

function badgeFor(mode: NetworkMode, platform: OnboardingPlatformId): {
  badge: string;
  badgeClass: string;
} {
  if (mode === "personal") {
    return {
      badge: "פרטי – שיתוף מהיר",
      badgeClass: BADGE_PERSONAL,
    };
  }
  if (platform === "whatsapp") {
    return {
      badge: "קישור ישיר לפניות wa.me",
      badgeClass: BADGE_BUSINESS,
    };
  }
  if (mode === "creator") {
    return {
      badge: "יוצר – פרסום ישיר",
      badgeClass: BADGE_BUSINESS,
    };
  }
  return {
    badge: "עסקי – פרסום ישיר",
    badgeClass: BADGE_BUSINESS,
  };
}

function accountTitle(
  profile: BusinessProfile,
  platform: OnboardingPlatformId,
  mode: NetworkMode
): string {
  const label = networkLabel(platform);
  if (platform === "facebook") {
    return mode === "personal"
      ? `${label} פרופיל אישי`
      : `${label} דף עסקי`;
  }
  if (platform === "instagram") {
    return mode === "personal"
      ? `${label} חשבון פרטי`
      : `${label} חשבון יוצר`;
  }
  if (platform === "whatsapp") return `${label} עסקי`;
  if (platform === "telegram") return `${label} ערוץ`;
  if (platform === "tiktok") return `${label} חשבון יוצר`;
  return `${label} · ${profile.businessName}`;
}

export function accountsFromProfile(
  profile: BusinessProfile
): DashboardAccount[] {
  return profile.networks
    .filter((n) => n.enabled)
    .map((n) => {
      const kind = kindFromMode(n.mode);
      const { badge, badgeClass } = badgeFor(n.mode, n.platform);
      return {
        id: `${n.platform}-${n.mode}`,
        platform: n.platform as DashboardPlatform,
        name: accountTitle(profile, n.platform, n.mode),
        kind,
        badge,
        badgeClass,
        connected: true,
      };
    });
}

export function welcomeMessage(_businessName?: string): string {
  return "שלום! אני סוכן השיווק שלך. אני כאן כדי לנסח פוסטים, לתזמן קמפיינים ולנתח עבורך תוצאות. מה נרצה לקדם היום?";
}
