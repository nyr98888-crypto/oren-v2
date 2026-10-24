"use client";

import Image from "next/image";
import type {
  CampaignDraft,
  ConnectedAccount,
  Platform,
} from "@/types/social";
import { PLATFORM_LABELS } from "@/lib/labels";
import { DistributionActions } from "@/components/preview/DistributionActions";
import { SocialIcon } from "@/components/SocialIcons";

const TABS: Platform[] = [
  "facebook",
  "instagram",
  "whatsapp",
  "telegram",
  "linkedin",
];

type LivePreviewProps = {
  campaign: CampaignDraft;
  accounts: ConnectedAccount[];
  selectedAccountId: string;
  activePlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
};

export function LivePreview({
  campaign,
  accounts,
  selectedAccountId,
  activePlatform,
  onPlatformChange,
}: LivePreviewProps) {
  const variant = campaign.variants[activePlatform];
  const account =
    accounts.find((a) => a.id === selectedAccountId) ??
    accounts.find((a) => a.platform === activePlatform && a.isConnected) ??
    accounts[0];

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-r border-slate-300 bg-white lg:w-[400px] lg:shrink-0">
      <header className="border-b border-slate-300 px-4 py-3">
        <h2 className="text-xl font-bold text-slate-900">תצוגה מקדימה והפצה</h2>
        <p className="text-sm text-slate-700">{campaign.title}</p>
      </header>

      <div
        className="flex gap-1 overflow-x-auto border-b border-slate-300 px-2 py-2"
        role="tablist"
        aria-label="רשתות חברתיות"
      >
        {TABS.map((platform) => {
          const selected = platform === activePlatform;
          return (
            <button
              key={platform}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onPlatformChange(platform)}
              className={`inline-flex min-h-touch shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                selected
                  ? "border-blue-600 bg-blue-50 text-slate-900"
                  : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              <SocialIcon platform={platform} size={16} />
              {PLATFORM_LABELS[platform]}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4" role="tabpanel">
        {!variant ? (
          <p className="text-base text-slate-700">אין טיוטה לרשת זו עדיין.</p>
        ) : (
          <article className="overflow-hidden rounded-xl border border-slate-300 bg-slate-50">
            <div className="flex items-center gap-3 border-b border-slate-300 bg-white p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-base font-bold text-slate-800">
                {(account?.accountName ?? "ע").charAt(0)}
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">
                  {account?.accountName ?? PLATFORM_LABELS[activePlatform]}
                </p>
                <p className="text-sm text-slate-700">
                  תצוגה מקדימה · {PLATFORM_LABELS[activePlatform]}
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full bg-slate-200">
              <Image
                src={variant.mediaUrl}
                alt="תצוגה מקדימה של מדיה לפוסט"
                fill
                className="object-cover"
                sizes="400px"
                priority
              />
            </div>

            <div className="space-y-2 p-4">
              <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-900">
                {variant.caption}
              </p>
              {variant.hashtags.length > 0 && (
                <p className="text-sm font-semibold text-blue-800">
                  {variant.hashtags.join(" ")}
                </p>
              )}
            </div>
          </article>
        )}
      </div>

      {variant && account && (
        <DistributionActions
          accountType={account.accountType}
          variant={variant}
          scheduledTime={campaign.scheduledTime}
        />
      )}
    </aside>
  );
}
