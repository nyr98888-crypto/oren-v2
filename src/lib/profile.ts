export type OnboardingPlatformId =
  | "facebook"
  | "instagram"
  | "whatsapp"
  | "tiktok"
  | "telegram";

export type NetworkMode = "business" | "personal" | "creator";

export type SelectedNetwork = {
  platform: OnboardingPlatformId;
  enabled: boolean;
  mode: NetworkMode;
};

export type BusinessProfile = {
  businessName: string;
  businessField: string;
  whatsapp: string;
  phone: string;
  locationOrWebsite: string;
  networks: SelectedNetwork[];
  configuredAt: string;
};

export const PROFILE_STORAGE_KEY = "socialai_pro_business_profile_v1";

export const DEFAULT_NETWORKS: SelectedNetwork[] = [
  { platform: "facebook", enabled: true, mode: "business" },
  { platform: "instagram", enabled: true, mode: "creator" },
  { platform: "whatsapp", enabled: false, mode: "business" },
  { platform: "tiktok", enabled: false, mode: "creator" },
  { platform: "telegram", enabled: false, mode: "business" },
];

export function loadProfile(): BusinessProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BusinessProfile;
    if (!parsed?.businessName?.trim() || !parsed?.whatsapp?.trim()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(profile: BusinessProfile): void {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
}

/** Normalize Israeli / international phone into digits for wa.me */
export function toWhatsAppLink(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = `972${digits.slice(1)}`;
  }
  if (!digits) return "https://wa.me/";
  return `https://wa.me/${digits}`;
}

export function networkLabel(platform: OnboardingPlatformId): string {
  switch (platform) {
    case "facebook":
      return "פייסבוק";
    case "instagram":
      return "אינסטגרם";
    case "whatsapp":
      return "וואטסאפ";
    case "tiktok":
      return "טיקטוק";
    case "telegram":
      return "טלגרם";
  }
}
