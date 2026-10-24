import type { AccountType, AutomationMode, Platform } from "@/types/social";

export const PLATFORM_LABELS: Record<Platform, string> = {
  facebook: "פייסבוק",
  instagram: "אינסטגרם",
  linkedin: "לינקדאין",
  telegram: "טלגרם",
  whatsapp: "וואטסאפ",
};

export function accountTypeBadge(accountType: AccountType): {
  label: string;
  className: string;
} {
  if (accountType === "personal") {
    return {
      label: "חשבון פרטי – שיתוף מהיר בלחיצה",
      className: "bg-amber-100 text-amber-900 border border-amber-300",
    };
  }

  const label =
    accountType === "creator"
      ? "חשבון יוצר – פרסום אוטומטי"
      : "חשבון עסקי – פרסום אוטומטי";

  return {
    label,
    className: "bg-emerald-100 text-emerald-900 border border-emerald-300",
  };
}

export const AUTOMATION_MODE_OPTIONS: {
  value: AutomationMode;
  label: string;
  description: string;
}[] = [
  {
    value: "full_auto",
    label: "אוטומטי מלא",
    description: "פרסום ישיר לחשבונות עסקיים/יוצרים",
  },
  {
    value: "semi_auto",
    label: "חצי אוטומטי",
    description: "העתקה + פתיחת אפליקציה לשיתוף",
  },
  {
    value: "manual",
    label: "ידני",
    description: "טיוטות והצעות בלבד – שליטה מלאה שלך",
  },
];

export function supportsDirectPublish(accountType: AccountType): boolean {
  return accountType === "business" || accountType === "creator";
}
