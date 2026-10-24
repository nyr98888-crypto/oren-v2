"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Rocket, Sparkles } from "lucide-react";
import {
  BusinessProfile,
  DEFAULT_NETWORKS,
  NetworkMode,
  OnboardingPlatformId,
  SelectedNetwork,
  networkLabel,
  saveProfile,
} from "@/lib/profile";

type OnboardingWizardProps = {
  onComplete: (profile: BusinessProfile) => void;
};

type Draft = {
  businessName: string;
  businessField: string;
  whatsapp: string;
  phone: string;
  locationOrWebsite: string;
  networks: SelectedNetwork[];
};

const STEP_COPY = [
  {
    title: "שלב 1 מתוך 3 – הקמת פרופיל מהירה ב־30 שניות",
    agent:
      "שלום! אני הסוכן השיווקי האישי שלך. אני כאן כדי לנהל, לנסח ולפרסם עבורך את כל התוכן. בוא נקדיש חצי דקה לחבר את דרכי ההתקשרות, כדי שכל מודעה שנוציא תביא לקוחות ישירות אליך.",
  },
  {
    title: "שלב 2 מתוך 3 – דרכי התקשרות ראשיות",
    agent:
      "מצוין! עכשיו המספרים שהלקוחות יפנו אליהם. כל מודעה שנעשה תוביל בלחיצה ישירה לוואטסאפ שלך.",
  },
  {
    title: "שלב 3 מתוך 3 – חיבור רשתות והגדרת חשבון",
    agent:
      "איפה נפרסם? סמן את הרשתות שלך ובחר אם מדובר בחשבון עסקי (לפרסום אוטומטי) או פרופיל פרטי (לשיתוף מהיר בלחיצה אחת).",
  },
] as const;

const inputClass =
  "mt-1.5 min-h-12 w-full rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 text-base text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50";

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({
    businessName: "",
    businessField: "",
    whatsapp: "",
    phone: "",
    locationOrWebsite: "",
    networks: DEFAULT_NETWORKS.map((n) => ({ ...n })),
  });

  const progress = useMemo(() => ((step + 1) / 3) * 100, [step]);

  function updateNetwork(
    platform: OnboardingPlatformId,
    patch: Partial<SelectedNetwork>
  ) {
    setDraft((prev) => ({
      ...prev,
      networks: prev.networks.map((n) =>
        n.platform === platform ? { ...n, ...patch } : n
      ),
    }));
  }

  function goNext() {
    setError(null);
    if (step === 0) {
      if (!draft.businessName.trim()) {
        setError("נא להזין שם עסק");
        return;
      }
      if (!draft.businessField.trim()) {
        setError("נא להזין תחום עסק בקצרה");
        return;
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!draft.whatsapp.trim()) {
        setError("מספר וואטסאפ הוא חובה – כך נבנה קישורי wa.me");
        return;
      }
      setStep(2);
      return;
    }
  }

  function finish() {
    setError(null);
    const enabled = draft.networks.filter((n) => n.enabled);
    if (enabled.length === 0) {
      setError("סמנו לפחות רשת אחת לפרסום");
      return;
    }

    const profile: BusinessProfile = {
      businessName: draft.businessName.trim(),
      businessField: draft.businessField.trim(),
      whatsapp: draft.whatsapp.trim(),
      phone: draft.phone.trim(),
      locationOrWebsite: draft.locationOrWebsite.trim(),
      networks: draft.networks,
      configuredAt: new Date().toISOString(),
    };

    setFinishing(true);
    saveProfile(profile);
    window.setTimeout(() => onComplete(profile), 1500);
  }

  if (finishing) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen w-full items-center justify-center bg-[#0a0f1d] p-6 text-white"
      >
        <div className="w-full max-w-xl rounded-2xl border border-emerald-500/40 bg-[#111a33] p-8 text-center shadow-2xl">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
          <p className="mt-4 text-lg font-bold leading-relaxed text-white">
            מעולה! הפרופיל מוכן. כל דרכי ההתקשרות מסונכרנות. מעביר אותך לפאנל
            הניהול…
          </p>
          <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-[#0d1428]">
            <div className="h-full animate-pulse rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="flex min-h-screen w-full items-center justify-center bg-[#0a0f1d] p-6 text-white"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-blue-800/60 bg-[#111a33] p-8 shadow-2xl">
        <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[15px] font-semibold text-blue-200">
              {STEP_COPY[step].title}
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/15 text-cyan-300">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#0d1428]">
            <div
              className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.55)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="relative mb-6 rounded-2xl border border-blue-800/50 bg-[#182344] px-4 py-3 text-base leading-relaxed text-white shadow-lg">
          <p className="mb-1 text-sm font-semibold text-blue-200">הסוכן</p>
          <p>{STEP_COPY[step].agent}</p>
        </div>

        {step === 0 && (
          <div className="relative space-y-4">
            <label className="block text-[15px] font-semibold text-white">
              שם העסק
              <input
                className={inputClass}
                value={draft.businessName}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, businessName: e.target.value }))
                }
                placeholder='למשל: "מספרת אלי", "יוסי אינסטלציה"'
                autoFocus
              />
            </label>
            <label className="block text-[15px] font-semibold text-white">
              תחום העסק
              <input
                className={inputClass}
                value={draft.businessField}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, businessField: e.target.value }))
                }
                placeholder="למשל: מספרה, אינסטלציה, קפה שכונתי"
              />
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="relative space-y-4">
            <label className="block text-[15px] font-semibold text-white">
              מספר וואטסאפ לקבלת פניות{" "}
              <span className="text-amber-300">(חובה)</span>
              <input
                className={inputClass}
                value={draft.whatsapp}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, whatsapp: e.target.value }))
                }
                placeholder="050-1234567"
                inputMode="tel"
                autoFocus
              />
            </label>
            <label className="block text-[15px] font-semibold text-white">
              מספר טלפון לחיוג מהיר{" "}
              <span className="font-normal text-blue-200">(אופציונלי)</span>
              <input
                className={inputClass}
                value={draft.phone}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, phone: e.target.value }))
                }
                placeholder="03-1234567"
                inputMode="tel"
              />
            </label>
            <label className="block text-[15px] font-semibold text-white">
              כתובת / אזור פעילות או אתר
              <input
                className={inputClass}
                value={draft.locationOrWebsite}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    locationOrWebsite: e.target.value,
                  }))
                }
                placeholder="תל אביב / www.example.co.il"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="relative space-y-3">
            {draft.networks.map((net) => (
              <NetworkRow
                key={net.platform}
                network={net}
                onToggle={(enabled) =>
                  updateNetwork(net.platform, { enabled })
                }
                onMode={(mode) => updateNetwork(net.platform, { mode })}
              />
            ))}
          </div>
        )}

        {error && (
          <p
            className="relative mt-4 rounded-lg border border-amber-500/50 bg-amber-500/15 px-3 py-2 text-[15px] font-semibold text-amber-300"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep((s) => s - 1);
              }}
              className="min-h-12 rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 text-[15px] font-bold text-white hover:bg-[#182344] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              חזרה
            </button>
          ) : (
            <span />
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={goNext}
              className="min-h-12 rounded-xl bg-blue-600 px-5 text-[15px] font-bold text-white shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {step === 0
                ? "המשך להגדרת וואטסאפ וטלפון ←"
                : "המשך לבחירת רשתות חברתיות ←"}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-base font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <Rocket className="h-5 w-5" aria-hidden />
              סיימנו! צור את הפרופיל שלי וכנס למערכת
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NetworkRow({
  network,
  onToggle,
  onMode,
}: {
  network: SelectedNetwork;
  onToggle: (enabled: boolean) => void;
  onMode: (mode: NetworkMode) => void;
}) {
  const showModeToggle =
    network.platform === "facebook" || network.platform === "instagram";

  const businessLabel =
    network.platform === "instagram" ? "חשבון יוצר/עסקי" : "דף עסקי";
  const personalLabel =
    network.platform === "instagram" ? "חשבון פרטי" : "פרופיל אישי";

  const subtitle =
    network.platform === "whatsapp"
      ? "סטטוס וקבוצות"
      : network.platform === "tiktok"
        ? "טיקטוק / רילס"
        : undefined;

  return (
    <div
      className={`rounded-xl border p-3 transition ${
        network.enabled
          ? "border-cyan-400/40 bg-[#182344]"
          : "border-blue-900/60 bg-[#0d1428]"
      }`}
    >
      <label className="flex min-h-12 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={network.enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="h-5 w-5 accent-cyan-400"
        />
        <span>
          <span className="block text-[15px] font-bold text-white">
            {networkLabel(network.platform)}
            {subtitle ? ` (${subtitle})` : ""}
          </span>
        </span>
      </label>

      {network.enabled && showModeToggle && (
        <div className="mt-2 flex flex-wrap gap-2 pr-8">
          <ModeChip
            active={
              network.mode === "business" || network.mode === "creator"
            }
            label={businessLabel}
            onClick={() =>
              onMode(network.platform === "instagram" ? "creator" : "business")
            }
          />
          <ModeChip
            active={network.mode === "personal"}
            label={personalLabel}
            onClick={() => onMode("personal")}
          />
        </div>
      )}
    </div>
  );
}

function ModeChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-lg border px-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
        active
          ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
          : "border-blue-700/60 bg-[#0d1428] text-blue-200 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
