import type { CalendarEvent } from "@/types/campaign";

export const CALENDAR_STORAGE_KEY = "socialai_pro_calendar_v1";

/** Israeli-relevant demo events when the calendar is empty */
export function buildDemoCalendarEvents(now = new Date()): CalendarEvent[] {
  const y = now.getFullYear();
  const m = now.getMonth();
  const nextThursday = (() => {
    const d = new Date(now);
    const day = d.getDay();
    const add = (4 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + add);
    d.setHours(18, 0, 0, 0);
    return d;
  })();
  const nextFriday = new Date(nextThursday);
  nextFriday.setDate(nextThursday.getDate() + 1);
  nextFriday.setHours(14, 0, 0, 0);

  return [
    {
      id: "demo-weekend",
      title: "מבצע סופ״ש באינסטגרם",
      datetime: nextThursday.toISOString(),
      note: "פוסט מבצע + סטורי לפני שבת",
      source: "ai",
      platforms: ["instagram"],
    },
    {
      id: "demo-shabbat",
      title: "שבת שלום — תזכורת תוכן",
      datetime: nextFriday.toISOString(),
      note: "לא לפרסם בשבת; לתזמן למוצ״ש",
      source: "user",
    },
    {
      id: "demo-bf",
      title: "Black Friday — מבצע קניות",
      datetime: new Date(y, 10, 27, 10, 0, 0).toISOString(),
      note: "הכנת קמפיין הנחות לרשתות",
      source: "user",
    },
    {
      id: "demo-purim",
      title: "פורים — קמפיין חג",
      datetime: new Date(m >= 2 ? y + 1 : y, 2, 14, 12, 0, 0).toISOString(),
      note: "רעיון תוכן לחג פורים",
      source: "user",
    },
    {
      id: "demo-pesach",
      title: "פסח — מבצע עונתי",
      datetime: new Date(y + (m >= 3 ? 1 : 0), 3, 5, 11, 0, 0).toISOString(),
      note: "קמפיין לקראת החג",
      source: "user",
    },
  ];
}

export function loadCalendarEvents(): CalendarEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CalendarEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCalendarEvents(events: CalendarEvent[]): void {
  window.localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
}

export function daysUntil(iso: string): number | null {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const startOfTarget = new Date(t);
  const targetDay = new Date(
    startOfTarget.getFullYear(),
    startOfTarget.getMonth(),
    startOfTarget.getDate()
  ).getTime();
  return Math.round((targetDay - startOfToday) / (1000 * 60 * 60 * 24));
}

export function formatCountdown(iso: string): string {
  const d = daysUntil(iso);
  if (d === null) return "";
  if (d === 0) return "היום";
  if (d === 1) return "מחר";
  if (d > 1) return `עוד ${d} ימים`;
  if (d === -1) return "אתמול";
  return `לפני ${Math.abs(d)} ימים`;
}

export function formatHeDate(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toLocaleString("he-IL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
