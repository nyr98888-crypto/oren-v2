"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Clapperboard,
  Eraser,
  ImageIcon,
  Sparkles,
  Upload,
  UserCircle,
} from "lucide-react";
import type { AICampaignResponse } from "@/types/campaign";

type StudioTab = "profile" | "campaign" | "video";

type CreativeStudioProps = {
  campaign: AICampaignResponse | null;
  onBack: () => void;
  onMockAction?: (label: string) => void;
};

export function CreativeStudio({
  campaign,
  onBack,
  onMockAction,
}: CreativeStudioProps) {
  const [tab, setTab] = useState<StudioTab>("profile");
  const [toast, setToast] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bgRemoved, setBgRemoved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const studio = campaign?.creativeStudio;
  const imagePrompt = studio?.imagePrompt?.trim() || "";
  const videoPrompt = studio?.videoPrompt?.trim() || "";
  const tiktok = campaign?.platforms?.tiktok;

  function flash(label: string) {
    setToast(label);
    onMockAction?.(label);
    window.setTimeout(() => setToast(null), 2600);
  }

  function onFile(
    file: File | undefined,
    setter: (url: string | null) => void
  ) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setter(url);
    flash(`הועלה: ${file.name}`);
  }

  const tabs: { id: StudioTab; label: string; icon: ReactNode }[] = [
    {
      id: "profile",
      label: "תמונת פרופיל ובאנר",
      icon: <UserCircle className="h-4 w-4" />,
    },
    {
      id: "campaign",
      label: "תמונות לקמפיין",
      icon: <ImageIcon className="h-4 w-4" />,
    },
    {
      id: "video",
      label: "וידאו / טיקטוק",
      icon: <Clapperboard className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0a0f1d]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-blue-900/60 bg-[#111a33] px-5 py-3">
        <div>
          <h2 className="text-xl font-bold text-white">סטודיו יצירה</h2>
          <p className="text-[15px] text-blue-200">
            תמונות, באנרים וסרטונים לקמפיינים של העסק
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-cyan-400/40 bg-[#0d1428] px-4 text-[15px] font-bold text-white hover:bg-blue-800/80"
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
          ← חזור ללוח הראשי ולסוכן
        </button>
      </div>

      {toast && (
        <div
          className="mx-5 mt-3 rounded-lg border border-emerald-500/50 bg-emerald-500/20 px-3 py-2 text-[15px] font-semibold text-emerald-300"
          role="status"
        >
          {toast}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-blue-900/60 px-5 py-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-bold transition ${
              tab === t.id
                ? "border-cyan-400/60 bg-blue-600 text-white"
                : "border-blue-900/60 bg-[#0d1428] text-blue-200 hover:text-white"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === "profile" && (
          <div className="mx-auto max-w-2xl space-y-4">
            <section className="rounded-xl border border-blue-900/60 bg-[#111a33] p-4 shadow-lg">
              <p className="mb-3 text-[15px] font-bold text-white">
                תמונת פרופיל
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className={`relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-cyan-400/40 bg-[#0d1428] ${
                    bgRemoved ? "ring-4 ring-emerald-400/40" : ""
                  }`}
                >
                  {profilePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profilePreview}
                      alt="תצוגת פרופיל"
                      className={`h-full w-full object-cover ${
                        bgRemoved ? "contrast-125 saturate-110" : ""
                      }`}
                    />
                  ) : (
                    <UserCircle className="h-16 w-16 text-blue-400" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      onFile(e.target.files?.[0], setProfilePreview)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-cyan-400/40 bg-[#0d1428] px-4 text-[15px] font-bold text-white hover:bg-blue-800/80"
                  >
                    <Upload className="h-4 w-4" />
                    העלה תמונת פרופיל
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!profilePreview) {
                        flash("העלו תמונה קודם");
                        return;
                      }
                      setBgRemoved(true);
                      flash("מחק רקע אוטומטית — הושלם (הדגמה)");
                    }}
                    className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 text-[15px] font-bold text-emerald-300 hover:bg-emerald-500/25"
                  >
                    <Eraser className="h-4 w-4" />
                    מחק רקע אוטומטית
                  </button>
                </div>
              </div>
              {bgRemoved && (
                <p className="mt-3 text-sm text-emerald-300">
                  תצוגה מקדימה עם רקע מוסר (סימולציה)
                </p>
              )}
            </section>

            <section className="rounded-xl border border-blue-900/60 bg-[#111a33] p-4 shadow-lg">
              <p className="mb-3 text-[15px] font-bold text-white">באנר / כותרת</p>
              <div className="relative mb-3 aspect-[3/1] overflow-hidden rounded-xl border border-blue-800/50 bg-[#0d1428]">
                {bannerPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bannerPreview}
                    alt="תצוגת באנר"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-blue-300">
                    תצוגה מקדימה של באנר
                  </div>
                )}
              </div>
              <input
                ref={bannerRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  onFile(e.target.files?.[0], setBannerPreview)
                }
              />
              <button
                type="button"
                onClick={() => bannerRef.current?.click()}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-cyan-400/40 bg-[#0d1428] px-4 text-[15px] font-bold text-white hover:bg-blue-800/80"
              >
                <Upload className="h-4 w-4" />
                העלה באנר
              </button>
            </section>
          </div>
        )}

        {tab === "campaign" && (
          <div className="mx-auto max-w-2xl space-y-4">
            {imagePrompt ? (
              <section className="rounded-xl border border-blue-900/60 bg-[#111a33] p-4 shadow-lg">
                <p className="mb-2 flex items-center gap-2 text-[15px] font-bold text-cyan-300">
                  <ImageIcon className="h-5 w-5" aria-hidden />
                  הנחיה לתמונת קמפיין (מהסוכן)
                </p>
                <p className="whitespace-pre-wrap text-base leading-relaxed text-white">
                  {imagePrompt}
                </p>
                {campaign?.campaignTitle && (
                  <p className="mt-2 text-sm text-blue-200">
                    קמפיין: {campaign.campaignTitle}
                  </p>
                )}
              </section>
            ) : (
              <div className="rounded-xl border border-blue-900/60 bg-[#111a33] p-5 text-[15px] text-blue-200">
                עדיין אין הנחיה לתמונה מהקמפיין האחרון. בקשו מהסוכן להכין קמפיין
                עם תמונה — והיא תופיע כאן.
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <ActionBtn
                label="הפק תמונת קמפיין"
                onClick={() => flash("מפיק תמונת קמפיין… (הדגמה)")}
              />
              <ActionBtn
                label="מחק רקע"
                icon={<Eraser className="h-4 w-4" />}
                onClick={() => flash("מחק רקע — הושלם (הדגמה)")}
              />
              <ActionBtn
                label="שפר תאורה וצבע"
                icon={<Sparkles className="h-4 w-4" />}
                onClick={() => flash("שיפור תאורה הושלם (הדגמה)")}
              />
            </div>
          </div>
        )}

        {tab === "video" && (
          <div className="mx-auto max-w-2xl space-y-4">
            {tiktok?.scriptHook || videoPrompt ? (
              <>
                {tiktok?.scriptHook && (
                  <section className="rounded-xl border border-blue-900/60 bg-[#111a33] p-4 shadow-lg">
                    <p className="mb-2 text-[15px] font-bold text-cyan-300">
                      פתיח לסרטון (הוק)
                    </p>
                    <p className="text-base text-white">{tiktok.scriptHook}</p>
                    {tiktok.scriptBody && (
                      <>
                        <p className="mb-1 mt-3 text-[15px] font-bold text-cyan-300">
                          גוף הסקריפט
                        </p>
                        <p className="whitespace-pre-wrap text-base text-white">
                          {tiktok.scriptBody}
                        </p>
                      </>
                    )}
                  </section>
                )}
                {videoPrompt && (
                  <section className="rounded-xl border border-blue-900/60 bg-[#111a33] p-4 shadow-lg">
                    <p className="mb-2 flex items-center gap-2 text-[15px] font-bold text-cyan-300">
                      <Clapperboard className="h-5 w-5" aria-hidden />
                      הנחיה לווידאו
                    </p>
                    <p className="whitespace-pre-wrap text-base text-white">
                      {videoPrompt}
                    </p>
                  </section>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-blue-900/60 bg-[#111a33] p-5 text-[15px] text-blue-200">
                אין עדיין סקריפט או הנחיית וידאו. בקשו מהסוכן רעיון לטיקטוק /
                סרטון קצר — והוא יופיע כאן.
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <ActionBtn
                label="הפק סרטון טיקטוק"
                onClick={() => flash("מפיק סרטון טיקטוק… (הדגמה)")}
              />
              <ActionBtn
                label="צור כתוביות אוטומטיות"
                onClick={() => flash("כתוביות נוצרו (הדגמה)")}
              />
              <ActionBtn
                label="ייצא לסטורי"
                onClick={() => flash("ייצוא לסטורי מוכן (הדגמה)")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-cyan-400/40 bg-[#0d1428] px-4 text-[15px] font-bold text-white hover:bg-blue-800/80"
    >
      {icon}
      {label}
    </button>
  );
}
