"use client";

import { useState } from "react";
import { ArrowRight, Save, RotateCcw } from "lucide-react";
import type { BusinessProfile } from "@/lib/profile";
import { saveProfile } from "@/lib/profile";

type BusinessSettingsProps = {
  profile: BusinessProfile;
  onProfileChange: (next: BusinessProfile) => void;
  onResetOnboarding: () => void;
  onBack: () => void;
};

export function BusinessSettings({
  profile,
  onProfileChange,
  onResetOnboarding,
  onBack,
}: BusinessSettingsProps) {
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [businessField, setBusinessField] = useState(profile.businessField);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [phone, setPhone] = useState(profile.phone);
  const [locationOrWebsite, setLocationOrWebsite] = useState(
    profile.locationOrWebsite
  );
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const next: BusinessProfile = {
      ...profile,
      businessName: businessName.trim() || profile.businessName,
      businessField: businessField.trim(),
      whatsapp: whatsapp.trim() || profile.whatsapp,
      phone: phone.trim(),
      locationOrWebsite: locationOrWebsite.trim(),
    };
    saveProfile(next);
    onProfileChange(next);
    flash("פרטי העסק נשמרו");
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0a0f1d]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-blue-900/60 bg-[#111a33] px-5 py-3">
        <div>
          <h2 className="text-xl font-bold text-white">הגדרות עסק</h2>
          <p className="text-[15px] text-blue-200">
            עדכון פרטי העסק שמופיעים לסוכן ולתצוגות
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

      <form
        onSubmit={handleSave}
        className="mx-auto w-full max-w-xl space-y-4 overflow-y-auto p-5"
      >
        <Field
          label="שם העסק"
          value={businessName}
          onChange={setBusinessName}
          required
        />
        <Field
          label="תחום העיסוק"
          value={businessField}
          onChange={setBusinessField}
        />
        <Field
          label="וואטסאפ"
          value={whatsapp}
          onChange={setWhatsapp}
          dir="ltr"
          required
        />
        <Field label="טלפון" value={phone} onChange={setPhone} dir="ltr" />
        <Field
          label="מיקום / אתר"
          value={locationOrWebsite}
          onChange={setLocationOrWebsite}
        />

        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-base font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500"
        >
          <Save className="h-5 w-5" aria-hidden />
          שמור שינויים
        </button>

        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="mb-2 text-[15px] font-bold text-amber-200">
            איפוס אשף ההקמה
          </p>
          <p className="mb-3 text-sm text-amber-100/80">
            מוחק את פרופיל העסק השמור ופותח מחדש את מסך ההקמה הראשוני.
          </p>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "לאפס את פרופיל העסק ולחזור לאשף ההקמה?"
                )
              ) {
                onResetOnboarding();
              }
            }}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-amber-500/50 bg-[#0d1428] px-4 text-[15px] font-bold text-amber-200 hover:bg-amber-900/30"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            אפס הקמה מחדש
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="block">
      <span className="text-[15px] font-semibold text-blue-200">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        dir={dir}
        className="mt-1.5 min-h-12 w-full rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 text-base text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />
    </label>
  );
}
