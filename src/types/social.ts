export type Platform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "telegram"
  | "whatsapp";

export type AccountType = "business" | "creator" | "personal";

export type AutomationMode = "full_auto" | "semi_auto" | "manual";

export interface ConnectedAccount {
  id: string;
  platform: Platform;
  accountName: string;
  accountType: AccountType;
  avatarUrl?: string;
  isConnected: boolean;
}

export interface PostVariant {
  platform: Platform;
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  hashtags: string[];
  ctaUrl?: string;
}

export interface CampaignDraft {
  id: string;
  title: string;
  variants: Partial<Record<Platform, PostVariant>>;
  targetAccounts: string[];
  scheduledTime?: string;
  status: "draft" | "ready_for_review" | "scheduled" | "published";
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  quickActions?: string[];
  timestamp: string;
}
