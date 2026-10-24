"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarPlus, Sparkles } from "lucide-react";
import type { CalendarEvent } from "@/types/campaign";
import { formatCountdown, formatHeDate } from "@/lib/calendarStore";

type CalendarViewProps = {
  events: CalendarEvent[];
  onAddSpecialEvent: (event: Omit<CalendarEvent, "id">) => void;
  onBack: () => void;
  onScheduleWithAgent: (prompt: string) => void;
};

const WEEKDAY_HE = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"] as const;

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function badgeLabel(event: CalendarEvent): string {
  const d = new Date(event.datetime);
  const day = WEEKDAY_HE[d.getDay()] ?? "";
  const time = d.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `יום ${day} ${time} - ${event.title}`;
}

export function CalendarView({
  events,
  onAddSpecialEvent,
  onBack,
  onScheduleWithAgent,
}: CalendarViewProps) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [toast, setToast] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) => Date.parse(a.datetime) - Date.parse(b.datetime)
      ),
    [events]
  );

  const monthLabel = cursor.toLocaleDateString("he-IL", {
    month: "long",
    year: "numeric",
  });

  const cells = useMemo(() => {
    const first = startOfMonth(cursor);
    const pad = first.getDay(); // Sunday first
    const daysInMonth = new Date(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      0
    ).getDate();
    const grid: Array<Date | null> = [];
    for (let i = 0; i < pad; i++) grid.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(new Date(cursor.getFullYear(), cursor.getMonth(), day));
    }
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [cursor]);

  const dayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return sorted.filter((e) => sameDay(new Date(e.datetime), selectedDay));
  }, [selectedDay, sorted]);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }

  function eventsOn(day: Date) {
    return sorted.filter((e) => sameDay(new Date(e.datetime), day));
  }

  function scheduleForDay(day: Date) {
    const dateStr = day.toLocaleDateString("he-IL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    onScheduleWithAgent(
      `תזמן עבורי קמפיין/פוסט לתאריך ${dateStr}. הצע רעיון רלוונטי לעסק וציין שעה מומלצת.`
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0a0f1d]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-blue-900/60 bg-[#111a33] px-5 py-3">
        <div>
          <h2 className="text-xl font-bold text-white">יומן שיווק</h2>
          <p className="text-[15px] text-blue-200">
            קמפיינים מתוכננים, חגים וימי קניות
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

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-center justify-between gap-2 rounded-xl border border-blue-900/60 bg-[#111a33] px-4 py-3">
            <button
              type="button"
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
                )
              }
              className="min-h-11 rounded-lg border border-blue-700/60 bg-[#0d1428] px-3 text-sm font-bold text-white"
            >
              חודש קודם
            </button>
            <p className="text-base font-bold text-white capitalize">
              {monthLabel}
            </p>
            <button
              type="button"
              onClick={() =>
                setCursor(
                  new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
                )
              }
              className="min-h-11 rounded-lg border border-blue-700/60 bg-[#0d1428] px-3 text-sm font-bold text-white"
            >
              חודש הבא
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-blue-900/60 bg-[#111a33]">
            <div className="grid grid-cols-7 border-b border-blue-900/60 bg-[#182344] text-center text-sm font-bold text-blue-200">
              {["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"].map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((day, idx) => {
                if (!day) {
                  return (
                    <div
                      key={`e-${idx}`}
                      className="min-h-[72px] border border-blue-900/30 bg-[#0a0f1d]/40"
                    />
                  );
                }
                const onDay = eventsOn(day);
                const isSelected =
                  selectedDay && sameDay(day, selectedDay);
                const isToday = sameDay(day, new Date());
                const isShabbat = day.getDay() === 6;
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[72px] border border-blue-900/40 p-1.5 text-right transition ${
                      isSelected
                        ? "bg-blue-600/40"
                        : "bg-[#0d1428] hover:bg-[#182344]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
                        isToday
                          ? "bg-cyan-500 text-slate-950"
                          : "text-white"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    {isShabbat && (
                      <p className="mt-0.5 text-[10px] font-semibold text-blue-300">
                        שבת שלום
                      </p>
                    )}
                    <div className="mt-1 space-y-0.5">
                      {onDay.slice(0, 2).map((ev) => (
                        <span
                          key={ev.id}
                          className="block truncate rounded bg-cyan-500/20 px-1 text-[10px] font-semibold text-cyan-200"
                          title={badgeLabel(ev)}
                        >
                          {ev.title}
                        </span>
                      ))}
                      {onDay.length > 2 && (
                        <span className="text-[10px] text-blue-300">
                          +{onDay.length - 2}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const day = selectedDay ?? new Date();
              scheduleForDay(day);
            }}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-base font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500"
          >
            <Sparkles className="h-5 w-5" aria-hidden />
            תזמן אירוע חדש עם הסוכן
          </button>
        </div>

        <div className="w-full shrink-0 space-y-4 lg:w-[340px]">
          <form
            className="space-y-3 rounded-xl border border-blue-900/60 bg-[#111a33] p-4 shadow-lg"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const title = String(fd.get("title") || "").trim();
              const datetime = String(fd.get("datetime") || "").trim();
              const note = String(fd.get("note") || "").trim();
              if (!title || !datetime) return;
              onAddSpecialEvent({
                title,
                datetime: new Date(datetime).toISOString(),
                note: note || "אירוע מיוחד שסומן ידנית",
                source: "user",
              });
              flash("האירוע נוסף ליומן");
              e.currentTarget.reset();
            }}
          >
            <p className="flex items-center gap-2 text-[15px] font-bold text-white">
              <CalendarPlus className="h-5 w-5 text-cyan-300" aria-hidden />
              סמן אירוע מיוחד
            </p>
            <input
              name="title"
              required
              placeholder="למשל: מבצע חמישי / פורים"
              className="min-h-12 w-full rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 text-base text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              name="datetime"
              type="datetime-local"
              required
              className="min-h-12 w-full rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 text-base text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              name="note"
              placeholder="הערה קצרה לסוכן (אופציונלי)"
              className="min-h-12 w-full rounded-xl border border-blue-700/60 bg-[#0d1428] px-4 text-base text-white placeholder:text-blue-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              type="submit"
              className="min-h-12 w-full rounded-xl bg-blue-600 text-base font-bold text-white hover:bg-blue-500"
            >
              הוסף ליומן
            </button>
          </form>

          <div className="space-y-2">
            <h3 className="text-[15px] font-bold text-white">
              {selectedDay
                ? `אירועים ב־${selectedDay.toLocaleDateString("he-IL")}`
                : "אירועים קרובים"}
            </h3>
            {(selectedDay ? dayEvents : sorted.slice(0, 8)).length === 0 ? (
              <div className="rounded-xl border border-blue-900/60 bg-[#111a33] p-4 text-[15px] text-blue-200">
                אין אירועים ביום זה. לחצו על ״תזמן אירוע חדש עם הסוכן״.
              </div>
            ) : (
              (selectedDay ? dayEvents : sorted.slice(0, 8)).map((event) => (
                <article
                  key={event.id}
                  className="rounded-xl border border-blue-900/60 bg-[#111a33] p-3 shadow-lg"
                >
                  <p className="text-[15px] font-bold text-cyan-200">
                    {badgeLabel(event)}
                  </p>
                  <p className="mt-1 text-sm text-blue-200">
                    {formatHeDate(event.datetime)} ·{" "}
                    {formatCountdown(event.datetime) || "מתוזמן"}
                  </p>
                  {event.note && (
                    <p className="mt-1 text-sm text-slate-300">{event.note}</p>
                  )}
                  <span className="mt-2 inline-block text-xs font-semibold text-blue-300">
                    {event.source === "ai" ? "מהסוכן" : "ידני / הדגמה"}
                  </span>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
