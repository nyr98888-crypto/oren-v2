import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Send,
} from "lucide-react";
import type { ConnectedAccount, Platform } from "@/types/social";
import { accountTypeBadge, PLATFORM_LABELS } from "@/lib/labels";
import { Badge } from "@/components/ui/Badge";

const PLATFORM_ICONS: Record<Platform, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  telegram: Send,
  whatsapp: MessageCircle,
};

type AccountCardProps = {
  account: ConnectedAccount;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

export function AccountCard({ account, selected, onSelect }: AccountCardProps) {
  const Icon = PLATFORM_ICONS[account.platform];
  const badge = accountTypeBadge(account.accountType);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(account.id)}
      className={`flex w-full min-h-touch flex-col gap-2 rounded-xl border p-3 text-right transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-slate-300 bg-white hover:bg-slate-50"
      } ${!account.isConnected ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-50 text-slate-800">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-slate-900">
            {account.accountName}
          </p>
          <p className="text-sm text-slate-700">
            {PLATFORM_LABELS[account.platform]}
            {!account.isConnected ? " · לא מחובר" : ""}
          </p>
        </div>
      </div>
      <Badge className={badge.className}>{badge.label}</Badge>
    </button>
  );
}
