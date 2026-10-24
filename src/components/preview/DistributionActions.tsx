"use client";

import { useState } from "react";
import { CalendarClock, Copy, Share2 } from "lucide-react";
import type { AccountType, PostVariant } from "@/types/social";
import { supportsDirectPublish } from "@/lib/labels";
import { Button } from "@/components/ui/Button";

type DistributionActionsProps = {
  accountType: AccountType;
  variant: PostVariant;
  scheduledTime?: string;
};

export function DistributionActions({
  accountType,
  variant,
  scheduledTime,
}: DistributionActionsProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [scheduleAt, setScheduleAt] = useState(
    scheduledTime?.slice(0, 16) ?? "2026-10-29T18:00"
  );

  const canAuto = supportsDirectPublish(accountType);

  async function handleSchedule() {
    setStatus(`נקבע פרסום אוטומטי ל־${formatHe(scheduleAt)}`);
  }

  async function handleOneClickShare() {
    try {
      await navigator.clipboard.writeText(
        [variant.caption, ...variant.hashtags].filter(Boolean).join("\n")
      );
    } catch {
      // Clipboard may be blocked in some environments; still show handoff UX
    }

    setStatus(
      "הפוסט מוכן, העתקנו לך את הטקסט – רק ללחוץ הדבק ולשתף!"
    );

    // Frictionless handoff: open platform surface when possible
    const handoff =
      variant.platform === "whatsapp"
        ? `https://wa.me/?text=${encodeURIComponent(variant.caption)}`
        : variant.platform === "telegram"
          ? `https://t.me/share/url?url=${encodeURIComponent(variant.ctaUrl ?? "")}&text=${encodeURIComponent(variant.caption)}`
          : variant.platform === "facebook"
            ? "https://www.facebook.com/"
            : variant.platform === "instagram"
              ? "https://www.instagram.com/"
              : "https://www.linkedin.com/feed/";

    window.open(handoff, "_blank", "noopener,noreferrer");
  }

  if (canAuto) {
    return (
      <div className="space-y-3 border-t border-slate-300 bg-white p-4">
        <p className="text-base font-bold text-emerald-900">
          חשבון עסקי/יוצר: פרסום ישיר דרך API
        </p>
        <label className="block text-sm font-semibold text-slate-800">
          תאריך ושעה
          <input
            type="datetime-local"
            value={scheduleAt}
            onChange={(e) => setScheduleAt(e.target.value)}
            className="mt-1 min-h-touch w-full rounded-lg border border-slate-300 px-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </label>
        <Button variant="success" fullWidth onClick={handleSchedule}>
          <CalendarClock className="h-5 w-5" aria-hidden />
          תזמן פרסום אוטומטי
        </Button>
        {status && (
          <p className="text-sm font-semibold text-emerald-900" role="status">
            {status}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-amber-300 bg-amber-50 p-4">
      <p className="text-base font-bold text-amber-900">
        חשבון פרטי: העתק טקסט ופתח אפליקציה לשיתוף
      </p>
      <p className="text-sm text-amber-950">
        פייסבוק/אינסטגרם לא מאפשרים פרסום אוטומטי לחשבון פרטי — לכן הכנו שיתוף
        בלחיצה אחת.
      </p>
      <Button variant="amber" fullWidth onClick={handleOneClickShare}>
        <Share2 className="h-5 w-5" aria-hidden />
        שיתוף מהיר (1-Click Share)
      </Button>
      <Button
        variant="secondary"
        fullWidth
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(variant.caption);
            setStatus("הטקסט הועתק ללוח");
          } catch {
            setStatus("לא הצלחנו להעתיק — העתק ידנית מהתצוגה המקדימה");
          }
        }}
      >
        <Copy className="h-5 w-5" aria-hidden />
        העתק טקסט בלבד
      </Button>
      {status && (
        <p className="text-sm font-semibold text-amber-950" role="status">
          {status}
        </p>
      )}
    </div>
  );
}

function formatHe(isoLocal: string): string {
  try {
    return new Date(isoLocal).toLocaleString("he-IL", {
      weekday: "long",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoLocal;
  }
}
