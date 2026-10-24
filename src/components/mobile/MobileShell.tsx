"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Copy,
  Eye,
  LayoutGrid,
  Loader2,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Rocket,
  Send,
  Settings,
  Share2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { PerformanceAdvisor } from "@/components/PerformanceAdvisor";
import { SocialIcon } from "@/components/SocialIcons";
import { CalendarView } from "@/components/CalendarView";
import { CreativeStudio } from "@/components/CreativeStudio";
import { LeadsCrm } from "@/components/LeadsCrm";
import { BusinessSettings } from "@/components/BusinessSettings";
import type {
  DashboardAccount,
  DashboardPlatform,
} from "@/lib/accountsFromProfile";
import type { BusinessProfile } from "@/lib/profile";
import type { AICampaignResponse, CalendarEvent } from "@/types/campaign";

export type MobileActiveView =
  | "workspace"
  | "analytics"
  | "calendar"
  | "studio"
  | "crm"
  | "settings";

type ChatMessage = {
  id: string;
  role: "agent" | "user";
  content: string;
  time: string;
  actions?: string[];
};

type PostVariant = {
  caption: string;
  hashtags: string[];
  mediaUrl: string;
  ctaLabel: string;
};

type PlatformTab = { id: DashboardPlatform; label: string };

type MobileTab = "agent" | "preview" | "accounts" | "more";

const MORE_ITEMS: {
  id: Exclude<MobileActiveView, "workspace">;
  label: string;
  icon: typeof CalendarDays;
}[] = [
  { id: "calendar", label: "יומן אירועים ותזכורות", icon: CalendarDays },
  { id: "studio", label: "סטודיו תמונות ווידאו", icon: LayoutGrid },
  { id: "crm", label: "ניהול פניות CRM", icon: Users },
  { id: "settings", label: "הגדרות עסק", icon: Settings },
  { id: "analytics", label: "יועץ שיווק חכם", icon: Sparkles },
];

export type MobileShellProps = {
  profile: BusinessProfile;
  accounts: DashboardAccount[];
  selectedAccountId: string;
  onSelectAccount: (account: DashboardAccount) => void;
  activeView: MobileActiveView;
  onActiveViewChange: (view: MobileActiveView) => void;
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: (overrideText?: string) => void;
  isThinking: boolean;
  thinkingPhrase: string;
  statusNote: string | null;
  onFlash: (note: string) => void;
  onActionClick: (action: string) => void;
  activeTab: DashboardPlatform;
  onActiveTabChange: (tab: DashboardPlatform) => void;
  platformTabs: PlatformTab[];
  platformTip: { optimalLength: string; bestTone: string } | null;
  previewAccount: DashboardAccount | undefined;
  variant: PostVariant;
  trackedWaLink: string;
  isDirectPublish: boolean;
  onWhatsAppCtaClick: () => void;
  onOneClickShare: () => void;
  onSchedulePublish: () => void;
  onCopyCaption: () => void;
  calendarEvents: CalendarEvent[];
  onAddCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;
  onScheduleWithAgent: (prompt: string) => void;
  lastCampaign: AICampaignResponse | null;
  analyticsRefresh: number;
  onProfileChange: (next: BusinessProfile) => void;
  onResetProfile: () => void;
};

export function MobileShell({
  profile,
  accounts,
  selectedAccountId,
  onSelectAccount,
  activeView,
  onActiveViewChange,
  messages,
  input,
  onInputChange,
  onSend,
  isThinking,
  thinkingPhrase,
  statusNote,
  onFlash,
  onActionClick,
  activeTab,
  onActiveTabChange,
  platformTabs,
  platformTip,
  previewAccount,
  variant,
  trackedWaLink,
  isDirectPublish,
  onWhatsAppCtaClick,
  onOneClickShare,
  onSchedulePublish,
  onCopyCaption,
  calendarEvents,
  onAddCalendarEvent,
  onScheduleWithAgent,
  lastCampaign,
  analyticsRefresh,
  onProfileChange,
  onResetProfile,
}: MobileShellProps) {
  const [mobileTab, setMobileTab] = useState<MobileTab>("agent");
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      feedRef.current?.scrollTo({
        top: feedRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages, isThinking]);

  function goBackToWorkspace() {
    onActiveViewChange("workspace");
    setMobileTab("more");
  }

  function openSecondary(view: Exclude<MobileActiveView, "workspace">) {
    onActiveViewChange(view);
  }

  const showSecondary = activeView !== "workspace";

  return (
    <div
      dir="rtl"
      className="flex h-dvh min-h-dvh w-full flex-col overflow-hidden bg-[#0a0f1d] font-sans text-white"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-blue-900/60 bg-[#111a33] px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/15 text-cyan-300">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-white">
            SocialAI Pro
          </h1>
          <p className="truncate text-xs text-blue-200">
            {profile.businessName} · {profile.businessField}
          </p>
        </div>
        {isThinking ? (
          <span
            className="agent-status-pill agent-status-pill--busy inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-400/60 bg-cyan-500/15 px-2 py-1 text-xs font-semibold text-cyan-200"
            role="status"
          >
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            חושב
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            פעיל
          </span>
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {showSecondary ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {activeView === "analytics" && (
              <div className="flex h-full flex-col overflow-hidden">
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-blue-900/60 bg-[#111a33] px-4 py-3">
                  <h2 className="text-lg font-bold text-white">יועץ שיווק</h2>
                  <button
                    type="button"
                    onClick={goBackToWorkspace}
                    className="inline-flex min-h-11 items-center rounded-xl border border-cyan-400/40 bg-[#0d1428] px-3 text-sm font-bold text-white"
                  >
                    ← חזור
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <PerformanceAdvisor refreshKey={analyticsRefresh} />
                </div>
              </div>
            )}
            {activeView === "calendar" && (
              <CalendarView
                events={calendarEvents}
                onAddSpecialEvent={onAddCalendarEvent}
                onBack={goBackToWorkspace}
                onScheduleWithAgent={onScheduleWithAgent}
              />
            )}
            {activeView === "studio" && (
              <CreativeStudio
                campaign={lastCampaign}
                onBack={goBackToWorkspace}
                onMockAction={onFlash}
              />
            )}
            {activeView === "crm" && <LeadsCrm onBack={goBackToWorkspace} />}
            {activeView === "settings" && (
              <BusinessSettings
                profile={profile}
                onProfileChange={onProfileChange}
                onResetOnboarding={onResetProfile}
                onBack={goBackToWorkspace}
              />
            )}
          </div>
        ) : (
          <>
            {mobileTab === "agent" && (
              <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div
                  ref={feedRef}
                  className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-3"
                  role="log"
                  aria-live="polite"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[92%] rounded-2xl border px-3.5 py-2.5 text-[15px] leading-relaxed text-white shadow-lg ${
                          msg.role === "user"
                            ? "border-blue-500/40 bg-blue-600"
                            : "border-blue-800/50 bg-[#182344]"
                        }`}
                      >
                        <p
                          className={`mb-1 text-xs font-semibold ${
                            msg.role === "user"
                              ? "text-blue-100"
                              : "text-blue-200"
                          }`}
                        >
                          {msg.role === "user" ? "אתה" : "הסוכן"} · {msg.time}
                        </p>
                        <p className="whitespace-pre-wrap text-white">
                          {msg.content}
                        </p>
                        {msg.actions && (
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {msg.actions.map((action) => (
                              <button
                                key={action}
                                type="button"
                                onClick={() => onActionClick(action)}
                                className="min-h-11 rounded-lg border border-cyan-400/50 bg-[#0d1428] px-3 text-sm font-bold text-white"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex justify-end">
                      <div className="agent-thinking-bubble inline-flex items-center gap-2 rounded-2xl border border-cyan-500/40 bg-[#182344] px-3 py-2.5 text-sm text-cyan-100 animate-pulse">
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                        <span>{thinkingPhrase}</span>
                      </div>
                    </div>
                  )}
                </div>

                {statusNote && (
                  <div
                    className="mx-3 mb-2 rounded-lg border border-emerald-500/50 bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-300"
                    role="status"
                  >
                    {statusNote}
                  </div>
                )}

                <form
                  className="flex shrink-0 items-center gap-2 border-t border-blue-900/60 bg-[#111a33] px-3 py-2.5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void onSend();
                  }}
                >
                  <label htmlFor="mobile-agent-input" className="sr-only">
                    הודעה לסוכן
                  </label>
                  <input
                    id="mobile-agent-input"
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    disabled={isThinking}
                    placeholder="כתוב לסוכן..."
                    className="min-h-11 flex-1 rounded-xl border border-blue-700/60 bg-[#0d1428] px-3 text-[15px] text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    aria-label="הקלטה קולית"
                    onClick={() => onFlash("הקלטת קול תתווסף בגרסה הבאה")}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-blue-700/60 bg-[#0d1428] text-cyan-300"
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={isThinking || !input.trim()}
                    aria-label="שלח"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isThinking ? (
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    ) : (
                      <Send className="h-5 w-5" aria-hidden />
                    )}
                  </button>
                </form>
              </section>
            )}

            {mobileTab === "preview" && (
              <section className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
                <h2 className="mb-3 text-base font-bold text-white">
                  תצוגה מקדימה
                </h2>
                <div
                  className="mb-3 flex flex-wrap gap-1"
                  role="tablist"
                  aria-label="רשתות"
                >
                  {platformTabs.map(({ id, label }) => {
                    const selected = activeTab === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => onActiveTabChange(id)}
                        className={`inline-flex min-h-10 items-center gap-1 rounded-lg border px-2 text-xs font-bold ${
                          selected
                            ? "border-cyan-400/60 bg-blue-600 text-white"
                            : "border-blue-900/60 bg-[#0d1428] text-blue-200"
                        }`}
                      >
                        <SocialIcon platform={id} size={14} />
                        {label}
                      </button>
                    );
                  })}
                </div>

                {platformTip && (
                  <div className="mb-3 rounded-lg border border-cyan-400/25 bg-[#0d1428] px-3 py-2 text-xs leading-relaxed text-blue-100">
                    <span className="font-bold text-cyan-300">טיפ · </span>
                    {platformTip.optimalLength}
                    <span className="text-blue-400"> · </span>
                    טון: {platformTip.bestTone}
                  </div>
                )}

                <article className="overflow-hidden rounded-xl border border-blue-900/60 bg-[#182344] shadow-lg">
                  <div className="flex items-center gap-3 border-b border-blue-800/50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/15 text-sm font-bold text-cyan-300">
                      {profile.businessName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {profile.businessName}
                      </p>
                      <p className="truncate text-xs text-blue-200">
                        {previewAccount?.name ?? "תצוגה מקדימה"} ·{" "}
                        {platformTabs.find((t) => t.id === activeTab)?.label}
                      </p>
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] w-full bg-[#0d1428]">
                    <Image
                      src={variant.mediaUrl}
                      alt="תצוגה מקדימה של מדיה"
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                  <div className="space-y-3 p-3">
                    <p className="whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-white">
                      {variant.caption}
                    </p>
                    {variant.hashtags.length > 0 && (
                      <p className="text-sm font-semibold text-cyan-300">
                        {variant.hashtags.join(" ")}
                      </p>
                    )}
                    <a
                      href={trackedWaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onWhatsAppCtaClick}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white"
                    >
                      {variant.ctaLabel}
                    </a>
                  </div>
                </article>

                <div className="mt-3 pb-2">
                  {isDirectPublish ? (
                    <button
                      type="button"
                      onClick={onSchedulePublish}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-[15px] font-bold text-white"
                    >
                      <Rocket className="h-5 w-5" aria-hidden />
                      שגר ותזמן פרסום אוטומטי
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <p className="flex items-center gap-1 text-sm font-bold text-amber-300">
                        <Zap className="h-4 w-4" aria-hidden />
                        חשבון פרטי — שיתוף מהיר
                      </p>
                      <button
                        type="button"
                        onClick={onOneClickShare}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-[15px] font-bold text-slate-950"
                      >
                        <Share2 className="h-5 w-5" aria-hidden />
                        העתק ופתח לשיתוף
                      </button>
                      <button
                        type="button"
                        onClick={onCopyCaption}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 text-sm font-bold text-white"
                      >
                        <Copy className="h-5 w-5" aria-hidden />
                        העתק טקסט בלבד
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {mobileTab === "accounts" && (
              <section className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
                <div className="mb-4 rounded-xl border border-blue-800/50 bg-[#182344] p-3">
                  <p className="text-sm font-semibold text-blue-200">העסק שלך</p>
                  <p className="text-base font-bold text-white">
                    {profile.businessName}
                  </p>
                  <p className="text-sm text-blue-200">{profile.businessField}</p>
                  {profile.locationOrWebsite && (
                    <p className="mt-1 text-sm text-slate-300">
                      {profile.locationOrWebsite}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-emerald-300" dir="ltr">
                    WA: {profile.whatsapp}
                  </p>
                </div>
                <h2 className="mb-3 text-base font-bold text-white">
                  חשבונות מחוברים
                </h2>
                <div className="space-y-2">
                  {accounts.map((account) => {
                    const selected = account.id === selectedAccountId;
                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => {
                          onSelectAccount(account);
                          setMobileTab("preview");
                        }}
                        className={`flex w-full flex-col gap-2 rounded-xl border p-3 text-right ${
                          selected
                            ? "border-cyan-400/60 bg-[#182344]"
                            : "border-blue-900/60 bg-[#111a33]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10">
                            <SocialIcon platform={account.platform} size={20} />
                          </span>
                          <span className="text-[15px] font-bold text-white">
                            {account.name}
                          </span>
                        </div>
                        <span
                          className={`inline-flex w-fit rounded-md border px-2 py-1 text-sm font-semibold ${account.badgeClass}`}
                        >
                          {account.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {mobileTab === "more" && (
              <section className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
                <h2 className="mb-3 text-base font-bold text-white">עוד כלים</h2>
                <nav className="space-y-2" aria-label="תפריט נוסף">
                  {MORE_ITEMS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => openSecondary(id)}
                      className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-blue-900/60 bg-[#111a33] px-4 text-right text-[15px] font-semibold text-white"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      {label}
                    </button>
                  ))}
                </nav>
                <button
                  type="button"
                  onClick={onResetProfile}
                  className="mt-6 w-full rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 py-3 text-sm font-semibold text-blue-200"
                >
                  איפוס פרופיל / אשף הקמה
                </button>
              </section>
            )}
          </>
        )}
      </div>

      <nav
        className="pb-safe flex shrink-0 border-t border-blue-900/60 bg-[#111a33]"
        aria-label="ניווט מובייל"
      >
        {(
          [
            { id: "agent" as const, label: "סוכן", icon: MessageSquare },
            { id: "preview" as const, label: "תצוגה", icon: Eye },
            { id: "accounts" as const, label: "חשבונות", icon: Users },
            { id: "more" as const, label: "עוד", icon: MoreHorizontal },
          ] as const
        ).map(({ id, label, icon: Icon }) => {
          const active =
            !showSecondary && mobileTab === id
              ? true
              : showSecondary && id === "more";
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                onActiveViewChange("workspace");
                setMobileTab(id);
              }}
              className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold transition ${
                active ? "text-cyan-300" : "text-blue-200/80"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
