"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AtSign,
  Copy,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  MessageCircle,
  Mic,
  Music2,
  Pin,
  Rocket,
  Send,
  Share2,
  Sparkles,
  Twitter,
  Youtube,
  Zap,
} from "lucide-react";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import {
  accountsFromProfile,
  welcomeMessage,
  type DashboardAccount,
  type DashboardPlatform,
} from "@/lib/accountsFromProfile";
import {
  BusinessProfile,
  clearProfile,
  loadProfile,
  toWhatsAppLink,
} from "@/lib/profile";

type NavId = "agent" | "calendar" | "studio" | "crm" | "settings";

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

const NAV_ITEMS: { id: NavId; label: string }[] = [
  { id: "agent", label: "💬 שיחה עם הסוכן" },
  { id: "calendar", label: "📅 יומן אירועים ותזכורות" },
  { id: "studio", label: "🎨 סטודיו תמונות ווידאו" },
  { id: "crm", label: "👥 ניהול פניות CRM" },
  { id: "settings", label: "⚙️ הגדרות עסק" },
];

const PLATFORM_TABS: {
  id: DashboardPlatform;
  label: string;
  icon: typeof Instagram;
}[] = [
  { id: "instagram", label: "אינסטגרם", icon: Instagram },
  { id: "facebook", label: "פייסבוק", icon: Facebook },
  { id: "tiktok", label: "טיקטוק", icon: Music2 },
  { id: "youtube", label: "יוטיוב", icon: Youtube },
  { id: "whatsapp", label: "וואטסאפ", icon: MessageCircle },
  { id: "telegram", label: "טלגרם", icon: Send },
  { id: "linkedin", label: "לינקדאין", icon: Linkedin },
  { id: "x", label: "X", icon: Twitter },
  { id: "threads", label: "Threads", icon: AtSign },
  { id: "pinterest", label: "פינטרסט", icon: Pin },
];

const MEDIA =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80";

function makeVariant(
  caption: string,
  hashtags: string[],
  ctaLabel = "פנה אלינו בוואטסאפ"
): PostVariant {
  return { caption, hashtags, mediaUrl: MEDIA, ctaLabel };
}

function buildVariants(businessName: string): Record<DashboardPlatform, PostVariant> {
  const base = `חמישי מבצע ב${businessName} ✂️\nתספורת + עיצוב ב־20% הנחה עד השעה 20:00.\nשמרו מקום בוואטסאפ!`;
  return {
    instagram: makeVariant(base, ["#מבצע", "#תספורת", `#${businessName.replace(/\s/g, "")}`]),
    facebook: makeVariant(
      `יום חמישי ב${businessName} — מבצע מיוחד!\nתספורת + עיצוב בהנחה של 20%.\nלחצו לוואטסאפ לתיאום תור מהיר.`,
      ["#מבצע", "#עסק"]
    ),
    whatsapp: makeVariant(
      `היי 👋 חמישי מבצע ב${businessName}:\nתספורת + עיצוב ב־20% הנחה.\nרוצים לשריין? השאירו שם ושעה מועדפת.`,
      []
    ),
    telegram: makeVariant(
      `📢 מבצע חמישי בערוץ של ${businessName}!\nתספורת + עיצוב ב־20% הנחה עד 20:00.`,
      ["#מבצע"]
    ),
    linkedin: makeVariant(
      `עסקים קטנים חיים על נוכחות עקבית.\nהשבוע ב${businessName}: מבצע חמישי.`,
      ["#עסקיםקטנים"]
    ),
    tiktok: makeVariant(
      `POV: חמישי ב${businessName} ואתם יוצאים עם לוק חדש 🔥\n20% הנחה — לינק בוואטסאפ בביו!`,
      ["#fyp", "#מבצע"]
    ),
    youtube: makeVariant(
      `Shorts: מאחורי הקלעים של מבצע חמישי ב${businessName}.`,
      ["#Shorts"]
    ),
    x: makeVariant(
      `חמישי ב${businessName}: תספורת + עיצוב ב־20% הנחה עד 20:00.`,
      ["#מבצע"]
    ),
    threads: makeVariant(
      `מי אמר שיום חמישי חייב להיות שגרתי?\nב${businessName} מחכים לכם עם 20% הנחה.`,
      []
    ),
    pinterest: makeVariant(
      `השראה + מבצע חמישי ב${businessName}\nשמרו את הפין ותאמו תור.`,
      ["#hairinspo"]
    ),
  };
}

const PLATFORM_ICON: Record<DashboardPlatform, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: MessageCircle,
  telegram: Send,
  linkedin: Linkedin,
  tiktok: Music2,
  youtube: Youtube,
  x: Twitter,
  threads: AtSign,
  pinterest: Pin,
};

const SHARE_URLS: Record<DashboardPlatform, (caption: string) => string> = {
  whatsapp: (c) => `https://wa.me/?text=${encodeURIComponent(c)}`,
  telegram: (c) => `https://t.me/share/url?text=${encodeURIComponent(c)}`,
  facebook: () => "https://www.facebook.com/",
  instagram: () => "https://www.instagram.com/",
  linkedin: () => "https://www.linkedin.com/feed/",
  tiktok: () => "https://www.tiktok.com/",
  youtube: () => "https://studio.youtube.com/",
  x: (c) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(c)}`,
  threads: () => "https://www.threads.net/",
  pinterest: () => "https://www.pinterest.com/",
};

function nowHe() {
  return new Date().toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen w-full items-center justify-center bg-[#0a0f1d] text-white"
      >
        <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
      </div>
    );
  }

  if (!profile) {
    return (
      <OnboardingWizard
        onComplete={(next) => {
          setProfile(next);
        }}
      />
    );
  }

  return (
    <Dashboard
      profile={profile}
      onResetProfile={() => {
        clearProfile();
        setProfile(null);
      }}
    />
  );
}

function Dashboard({
  profile,
  onResetProfile,
}: {
  profile: BusinessProfile;
  onResetProfile: () => void;
}) {
  const accounts = useMemo(() => accountsFromProfile(profile), [profile]);
  const variants = useMemo(
    () => buildVariants(profile.businessName),
    [profile.businessName]
  );
  const waLink = useMemo(
    () => toWhatsAppLink(profile.whatsapp),
    [profile.whatsapp]
  );

  const [activeTab, setActiveTab] = useState<DashboardPlatform>(
    accounts[0]?.platform ?? "instagram"
  );
  const [activeNav, setActiveNav] = useState<NavId>("agent");
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts[0]?.id ?? ""
  );
  const [sampleMessages, setSampleMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "agent",
      content: welcomeMessage(profile.businessName),
      time: nowHe(),
      actions: ["הכן פוסט למבצע", "כתוב סטטוס לוואטסאפ", "תכנן שבוע תוכן"],
    },
  ]);
  const [input, setInput] = useState("");
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedAccountId) ?? accounts[0],
    [accounts, selectedAccountId]
  );

  const previewAccount = useMemo(() => {
    const match = accounts.find((a) => a.platform === activeTab);
    return match ?? selectedAccount;
  }, [accounts, activeTab, selectedAccount]);

  const variant = variants[activeTab];
  const isDirectPublish =
    !previewAccount ||
    previewAccount.kind === "business" ||
    previewAccount.kind === "creator";

  function flash(note: string) {
    setStatusNote(note);
    window.setTimeout(() => setStatusNote(null), 2800);
  }

  function scrollFeed() {
    window.requestAnimationFrame(() => {
      feedRef.current?.scrollTo({
        top: feedRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      time: nowHe(),
    };

    const historyForApi = [...sampleMessages, userMsg].map((m) => ({
      role: m.role === "agent" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));

    setSampleMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    scrollFeed();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi, profile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "שגיאה מהשרת");

      setSampleMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "agent",
          content: data.reply as string,
          time: nowHe(),
          actions: (data.actions as string[]) || [
            "אשר ותזמן אוטומטית",
            "ערוך טקסט",
            "החלף תמונה",
          ],
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "תקלה לא צפויה מול הסוכן";
      setSampleMessages((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: "agent",
          content: `לא הצלחתי לקבל תשובה מ־OpenRouter.\n${message}`,
          time: nowHe(),
        },
      ]);
    } finally {
      setIsThinking(false);
      scrollFeed();
    }
  }

  async function handleOneClickShare() {
    const payload = [variant.caption, ...variant.hashtags]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      /* ignore */
    }
    flash("הטקסט הועתק — פתחנו חלון לשיתוף מיידי");
    window.open(
      SHARE_URLS[activeTab](variant.caption),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div
      dir="rtl"
      className="flex h-screen min-h-screen w-full flex-col overflow-hidden bg-[#0a0f1d] font-sans text-white"
    >
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-blue-900/60 bg-[#111a33] px-6 shadow-lg">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-white">
              SocialAI Pro – ניהול סושיאל ופרסום חכם
            </h1>
            <p className="truncate text-[15px] text-blue-200">
              עסק מחובר: {profile.businessName} · {profile.businessField} | מצב
              פרסום: משולב (עסקי + פרטי)
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-900/40 px-3 py-2 text-[15px] text-white shadow-lg shadow-emerald-900/30">
            וואטסאפ:{" "}
            <span className="font-bold" dir="ltr">
              {profile.whatsapp}
            </span>
          </div>
          <div className="rounded-xl border border-blue-700/60 bg-[#182344] px-3 py-2 text-[15px] text-slate-50">
            <span className="font-bold text-white">{accounts.length}</span>{" "}
            רשתות מחוברות
          </div>
          <button
            type="button"
            onClick={onResetProfile}
            className="rounded-xl border border-blue-700/60 bg-[#0d1428] px-3 py-2 text-sm font-semibold text-blue-200 hover:text-white"
            title="הפעל מחדש את אשף ההקמה"
          >
            איפוס פרופיל
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-[300px] shrink-0 flex-col overflow-y-auto border-l border-blue-900/60 bg-[#111a33] p-4 shadow-lg">
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
          </div>

          <h2 className="mb-3 text-base font-bold text-white">
            חשבונות מחוברים
          </h2>
          <div className="space-y-2">
            {accounts.map((account) => (
              <AccountButton
                key={account.id}
                account={account}
                selected={account.id === selectedAccountId}
                onSelect={() => {
                  setSelectedAccountId(account.id);
                  setActiveTab(account.platform);
                }}
              />
            ))}
          </div>

          <h2 className="mb-2 mt-6 text-base font-bold text-white">
            תפריט פעולות
          </h2>
          <nav className="space-y-1" aria-label="ניווט ראשי">
            {NAV_ITEMS.map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`flex min-h-12 w-full items-center rounded-xl border px-3 text-right text-[15px] font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    active
                      ? "border-cyan-400/50 bg-blue-600/40"
                      : "border-transparent text-slate-50 hover:bg-[#182344]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden border-l border-blue-900/60 bg-[#0a0f1d]">
          <div className="flex items-center gap-3 border-b border-blue-900/60 bg-[#111a33] px-5 py-3">
            <h2 className="text-xl font-bold text-white">
              סוכן השיווק החכם שלך
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/20 px-2.5 py-1 text-sm font-semibold text-emerald-300">
              <span
                className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                aria-hidden
              />
              OpenRouter פעיל
            </span>
          </div>

          {activeNav !== "agent" ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div className="max-w-md rounded-xl border border-blue-900/60 bg-[#111a33] p-6 shadow-lg">
                <p className="text-lg font-bold text-white">
                  {NAV_ITEMS.find((n) => n.id === activeNav)?.label}
                </p>
                <p className="mt-2 text-[15px] text-blue-200">
                  המסך הזה יתמלא בגרסה הבאה. בינתיים חזרו לשיחה עם הסוכן.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveNav("agent")}
                  className="mt-4 min-h-12 rounded-lg bg-blue-600 px-4 text-[15px] font-bold text-white shadow-lg hover:bg-blue-500"
                >
                  חזרה לשיחה עם הסוכן
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={feedRef}
                className="flex-1 space-y-3 overflow-y-auto p-5"
                role="log"
                aria-live="polite"
              >
                {sampleMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl border px-4 py-3 text-base leading-relaxed text-white shadow-lg ${
                        msg.role === "user"
                          ? "border-blue-500/40 bg-blue-600"
                          : "border-blue-800/50 bg-[#182344]"
                      }`}
                    >
                      <p
                        className={`mb-1 text-sm font-semibold ${
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
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.actions.map((action) => (
                            <button
                              key={action}
                              type="button"
                              onClick={() => {
                                flash(`בוצע: ${action}`);
                                setInput(action);
                              }}
                              className="min-h-12 rounded-lg border border-cyan-400/50 bg-[#0d1428] px-3 text-[15px] font-bold text-white transition hover:bg-blue-800/80"
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
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-800/50 bg-[#182344] px-4 py-3 text-blue-200">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      הסוכן חושב…
                    </div>
                  </div>
                )}
              </div>

              {statusNote && (
                <div
                  className="mx-5 mb-2 rounded-lg border border-emerald-500/50 bg-emerald-500/20 px-3 py-2 text-[15px] font-semibold text-emerald-300"
                  role="status"
                >
                  {statusNote}
                </div>
              )}

              <form
                className="flex shrink-0 items-center gap-2 border-t border-blue-900/60 bg-[#111a33] p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSend();
                }}
              >
                <label htmlFor="agent-input" className="sr-only">
                  הודעה לסוכן
                </label>
                <input
                  id="agent-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isThinking}
                  placeholder="כתוב הנחיה לסוכן או שאל שאלה..."
                  className="min-h-12 flex-1 rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 text-base text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60"
                />
                <button
                  type="button"
                  aria-label="הקלטה קולית"
                  onClick={() => flash("הקלטת קול תתווסף בגרסה הבאה")}
                  className="flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-blue-700/60 bg-[#0d1428] text-cyan-300 hover:bg-[#182344]"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  disabled={isThinking || !input.trim()}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-base font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isThinking ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  ) : (
                    <Send className="h-5 w-5" aria-hidden />
                  )}
                  שלח
                </button>
              </form>
            </>
          )}
        </main>

        <aside className="flex w-[420px] shrink-0 flex-col overflow-y-auto border-r border-blue-900/60 bg-[#111a33] p-4 shadow-lg">
          <h2 className="mb-3 text-lg font-bold text-white">
            תצוגה מקדימה חיה (Live Preview)
          </h2>

          <div
            className="mb-4 flex flex-wrap gap-1"
            role="tablist"
            aria-label="רשתות"
          >
            {PLATFORM_TABS.map(({ id, label, icon: Icon }) => {
              const selected = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    selected
                      ? "border-cyan-400/60 bg-blue-600 text-white shadow-lg"
                      : "border-blue-900/60 bg-[#0d1428] text-blue-200 hover:bg-[#182344] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>

          <article className="overflow-hidden rounded-xl border border-blue-900/60 bg-[#182344] shadow-lg">
            <div className="flex items-center gap-3 border-b border-blue-800/50 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/15 text-base font-bold text-cyan-300">
                {profile.businessName.charAt(0)}
              </div>
              <div>
                <p className="text-[15px] font-bold text-white">
                  {profile.businessName}
                </p>
                <p className="text-sm text-blue-200">
                  {previewAccount?.name ?? "תצוגה מקדימה"} ·{" "}
                  {PLATFORM_TABS.find((t) => t.id === activeTab)?.label}
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full bg-[#0d1428]">
              <Image
                src={variant.mediaUrl}
                alt="תצוגה מקדימה של מדיה"
                fill
                className="object-cover"
                sizes="420px"
                priority
              />
            </div>

            <div className="space-y-3 p-4">
              <p className="whitespace-pre-wrap text-base font-medium leading-relaxed text-white">
                {variant.caption}
              </p>
              {variant.hashtags.length > 0 && (
                <p className="text-[15px] font-semibold text-cyan-300">
                  {variant.hashtags.join(" ")}
                </p>
              )}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-600 px-4 text-[15px] font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500"
              >
                {variant.ctaLabel}
              </a>
            </div>
          </article>

          <div className="mt-4">
            {isDirectPublish ? (
              <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-4 shadow-lg">
                <p className="mb-3 text-[15px] font-bold text-emerald-300">
                  חשבון עסקי/Creator — פרסום ישיר דרך API
                </p>
                <button
                  type="button"
                  onClick={() =>
                    flash("הפוסט תוזמן לפרסום אוטומטי (סימולציה)")
                  }
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-base font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500"
                >
                  <Rocket className="h-5 w-5" aria-hidden />
                  שגר ותזמן פרסום אוטומטי
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/50 bg-amber-500/15 p-4 shadow-lg">
                <p className="mb-1 flex items-center gap-1 text-[15px] font-bold text-amber-300">
                  <Zap className="h-5 w-5" aria-hidden />
                  חשבון פרטי: 1-Click Share
                </p>
                <button
                  type="button"
                  onClick={handleOneClickShare}
                  className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-base font-bold text-slate-950 shadow-lg shadow-amber-900/30 hover:bg-amber-400"
                >
                  <Share2 className="h-5 w-5" aria-hidden />
                  1-Click Share: העתק טקסט ופתח אפליקציה לשיתוף
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(variant.caption);
                      flash("הטקסט הועתק ללוח");
                    } catch {
                      flash("העתקה נחסמה");
                    }
                  }}
                  className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 text-[15px] font-bold text-white hover:bg-[#182344]"
                >
                  <Copy className="h-5 w-5" aria-hidden />
                  העתק טקסט בלבד
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function AccountButton({
  account,
  selected,
  onSelect,
}: {
  account: DashboardAccount;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = PLATFORM_ICON[account.platform];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full flex-col gap-2 rounded-xl border p-3 text-right shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
        selected
          ? "border-cyan-400/60 bg-[#182344]"
          : "border-blue-900/60 bg-[#111a33] hover:bg-[#182344]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-[15px] font-bold text-white">{account.name}</span>
      </div>
      <span
        className={`inline-flex w-fit rounded-md border px-2 py-1 text-sm font-semibold ${account.badgeClass}`}
      >
        {account.badge}
      </span>
    </button>
  );
}
