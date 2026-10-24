"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BarChart3,
  Lightbulb,
  RefreshCw,
  TrendingUp,
  Trophy,
  MousePointerClick,
  MessageCircle,
} from "lucide-react";
import type { AnalyticsSummary, PlatformMetrics } from "@/types/analytics";
import {
  getAnalyticsSummary,
  seedDemoAnalytics,
} from "@/lib/tracking";

type PerformanceAdvisorProps = {
  refreshKey?: number;
};

function buildAdvice(summary: AnalyticsSummary): string[] {
  const platforms = Object.values(summary.platforms);
  if (platforms.length === 0) {
    return [
      "עדיין אין נתונים. לחצו על קישורי וואטסאפ או שיתוף בתצוגה המקדימה כדי להתחיל למדוד.",
    ];
  }

  const byLeads = [...platforms].sort(
    (a, b) => b.whatsappLeads - a.whatsappLeads
  );
  const byConv = [...platforms]
    .filter((p) => p.linkClicks >= 10)
    .sort((a, b) => b.conversionRate - a.conversionRate);
  const weak = [...platforms]
    .filter((p) => p.linkClicks > 0)
    .sort((a, b) => a.conversionRate - b.conversionRate);

  const top = byLeads[0];
  const runner = byLeads[1];
  const bestConv = byConv[0];
  const weakest = weak[0];

  const tips: string[] = [];

  if (top) {
    tips.push(
      `${top.icon} ${top.platformName} מביא הכי הרבה פניות לוואטסאפ (${top.whatsappLeads}). כדאי להכפיל שם תוכן ומבצעים.`
    );
  }

  if (bestConv && bestConv.platformId !== top?.platformId) {
    tips.push(
      `שיעור ההמרה הגבוה ביותר: ${bestConv.platformName} (${bestConv.conversionRate}%). שם הכפתור/הקריאה לפעולה עובדים טוב — שמרו על אותו סגנון.`
    );
  }

  if (runner && top && runner.whatsappLeads > 0) {
    tips.push(
      `${runner.platformName} במקום שני (${runner.whatsappLeads} פניות). אפשר לבדוק A/B של אותן הצעות גם שם.`
    );
  }

  const highViewsLowLeads = platforms.find(
    (p) => p.views >= 1500 && p.whatsappLeads < 10 && p.linkClicks > 20
  );
  if (highViewsLowLeads) {
    tips.push(
      `${highViewsLowLeads.platformName} מקבל הרבה צפיות אבל מעט פניות — חזקו את ה־CTA לוואטסאפ בביו / בתיאור.`
    );
  }

  if (weakest && weakest.conversionRate < 8 && weakest.linkClicks >= 15) {
    tips.push(
      `${weakest.platformName} ממיר חלש (${weakest.conversionRate}%). בדקו אם הקישור ברור, או אם המסר לא מתאים לקהל שם.`
    );
  }

  if (summary.growthPercentage > 0) {
    tips.push(
      `מגמה חיובית: כ־${summary.growthPercentage}% צמיחה בתקופה האחרונה — המשיכו את הקצב ברשת המובילה.`
    );
  }

  if (tips.length < 3) {
    tips.push(
      "עקבו אחרי לחיצות על כפתורי וואטסאפ בתצוגה המקדימה — כל לחיצה מתויגת לפי הרשת הפעילה."
    );
  }

  return tips.slice(0, 5);
}

export function PerformanceAdvisor({ refreshKey = 0 }: PerformanceAdvisorProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  const reload = useCallback(() => {
    setSummary(getAnalyticsSummary());
  }, []);

  useEffect(() => {
    reload();
  }, [reload, refreshKey]);

  const advice = useMemo(
    () => (summary ? buildAdvice(summary) : []),
    [summary]
  );

  const rows: PlatformMetrics[] = useMemo(() => {
    if (!summary) return [];
    return Object.values(summary.platforms).sort(
      (a, b) => b.whatsappLeads - a.whatsappLeads || b.linkClicks - a.linkClicks
    );
  }, [summary]);

  if (!summary) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-blue-200">
        טוען נתונים…
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-5" dir="rtl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <BarChart3 className="h-6 w-6 text-cyan-300" aria-hidden />
            יועץ שיווק חכם
          </h2>
          <p className="mt-1 text-[15px] text-blue-200">
            מעקב קליקים ופניות לוואטסאפ לפי רשת — עם המלצות בעברית פשוטה
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            seedDemoAnalytics(true);
            reload();
          }}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 text-[15px] font-bold text-white hover:bg-[#182344]"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          טען נתוני הדגמה
        </button>
      </div>

      {/* Summary strip */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<MousePointerClick className="h-5 w-5 text-cyan-300" />}
          label="סה״כ קליקים"
          value={String(summary.totalClicks)}
        />
        <StatCard
          icon={<MessageCircle className="h-5 w-5 text-emerald-300" />}
          label="פניות וואטסאפ"
          value={String(summary.totalWhatsAppLeads)}
        />
        <StatCard
          icon={<Trophy className="h-5 w-5 text-amber-300" />}
          label="רשת מובילה"
          value={summary.bestPlatform}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-emerald-300" />}
          label="צמיחה"
          value={`${summary.growthPercentage}%`}
        />
      </div>

      {/* AI advice */}
      <section className="mb-5 rounded-xl border border-blue-900/60 bg-[#111a33] p-4 shadow-lg">
        <h3 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-cyan-300">
          <Lightbulb className="h-5 w-5" aria-hidden />
          המלצות היועץ (מבוסס מספרים)
        </h3>
        <ul className="space-y-2">
          {advice.map((tip) => (
            <li
              key={tip}
              className="rounded-lg border border-blue-800/40 bg-[#0d1428] px-3 py-3 text-[15px] leading-relaxed text-white"
            >
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* Platforms table */}
      <section className="rounded-xl border border-blue-900/60 bg-[#111a33] p-4 shadow-lg">
        <h3 className="mb-3 text-[15px] font-bold text-white">ביצועים לפי רשת</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-right text-[15px]">
            <thead>
              <tr className="border-b border-blue-800/50 text-blue-200">
                <th className="px-2 py-3 font-semibold">רשת</th>
                <th className="px-2 py-3 font-semibold">סוג</th>
                <th className="px-2 py-3 font-semibold">צפיות</th>
                <th className="px-2 py-3 font-semibold">קליקים</th>
                <th className="px-2 py-3 font-semibold">פניות WA</th>
                <th className="px-2 py-3 font-semibold">המרה %</th>
                <th className="px-2 py-3 font-semibold">פוסט מוביל</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.platformId}
                  className="border-b border-blue-900/40 text-white hover:bg-[#182344]/60"
                >
                  <td className="px-2 py-3 font-bold">
                    <span className="me-1">{p.icon}</span>
                    {p.platformName}
                  </td>
                  <td className="px-2 py-3 text-blue-200">
                    {p.accountType === "business" ? "עסקי" : "פרטי"}
                  </td>
                  <td className="px-2 py-3" dir="ltr">
                    {p.views.toLocaleString("he-IL")}
                  </td>
                  <td className="px-2 py-3" dir="ltr">
                    {p.linkClicks.toLocaleString("he-IL")}
                  </td>
                  <td className="px-2 py-3 font-semibold text-emerald-300" dir="ltr">
                    {p.whatsappLeads.toLocaleString("he-IL")}
                  </td>
                  <td className="px-2 py-3" dir="ltr">
                    {p.conversionRate}%
                  </td>
                  <td className="max-w-[180px] truncate px-2 py-3 text-blue-100">
                    {p.topPerformingPost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-blue-900/60 bg-[#111a33] p-4 shadow-lg">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-200">
        {icon}
        {label}
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
