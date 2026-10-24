"use client";

import { useMemo, useState } from "react";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";

type LeadStatus = "חדש" | "נוצר קשר" | "בטיפול" | "נסגר";
type LeadSource =
  | "אינסטגרם"
  | "פייסבוק"
  | "וואטסאפ"
  | "טיקטוק"
  | "טלגרם";

type Lead = {
  id: string;
  name: string;
  source: LeadSource;
  whatsapp: string;
  status: LeadStatus;
  note: string;
  createdAt: string;
};

const INITIAL_LEADS: Lead[] = [
  {
    id: "l1",
    name: "נועה כהן",
    source: "אינסטגרם",
    whatsapp: "050-1234567",
    status: "חדש",
    note: "שאלה על מבצע סופ״ש",
    createdAt: "היום 10:20",
  },
  {
    id: "l2",
    name: "יוסי לוי",
    source: "פייסבוק",
    whatsapp: "052-9876543",
    status: "בטיפול",
    note: "רוצה הצעת מחיר לחבילת חודש",
    createdAt: "אתמול 16:45",
  },
  {
    id: "l3",
    name: "מיכל אברהם",
    source: "וואטסאפ",
    whatsapp: "054-1112233",
    status: "נוצר קשר",
    note: "הגיעה מקישור בסטטוס",
    createdAt: "לפני יומיים",
  },
  {
    id: "l4",
    name: "דני שמש",
    source: "טיקטוק",
    whatsapp: "053-4445566",
    status: "חדש",
    note: "עניין בסרטון המבצע",
    createdAt: "היום 08:05",
  },
  {
    id: "l5",
    name: "רותם גולן",
    source: "טלגרם",
    whatsapp: "058-7778899",
    status: "נסגר",
    note: "תור נקבע לשבוע הבא",
    createdAt: "לפני שבוע",
  },
];

const SOURCES: Array<LeadSource | "הכל"> = [
  "הכל",
  "אינסטגרם",
  "פייסבוק",
  "וואטסאפ",
  "טיקטוק",
  "טלגרם",
];

type LeadsCrmProps = {
  onBack: () => void;
};

export function LeadsCrm({ onBack }: LeadsCrmProps) {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [filter, setFilter] = useState<LeadSource | "הכל">("הכל");
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_LEADS[0]?.id ?? null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      filter === "הכל" ? leads : leads.filter((l) => l.source === filter),
    [filter, leads]
  );

  const selected = filtered.find((l) => l.id === selectedId) ?? filtered[0] ?? null;

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }

  function markContacted(id: string) {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "נוצר קשר" as LeadStatus } : l
      )
    );
    flash("סומן כנוצר קשר");
  }

  function setStatus(id: string, status: LeadStatus) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    flash(`סטטוס עודכן: ${status}`);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#0a0f1d]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-blue-900/60 bg-[#111a33] px-5 py-3">
        <div>
          <h2 className="text-xl font-bold text-white">ניהול פניות</h2>
          <p className="text-[15px] text-blue-200">
            לידים מהרשתות — מעקב וטיפול מהיר
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
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {SOURCES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setFilter(s);
                  setSelectedId(null);
                }}
                className={`min-h-11 rounded-lg border px-3 text-sm font-bold transition ${
                  filter === s
                    ? "border-cyan-400/60 bg-blue-600 text-white"
                    : "border-blue-900/60 bg-[#0d1428] text-blue-200 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-blue-900/60 bg-[#111a33] p-4 text-[15px] text-blue-200">
                אין פניות במקור הזה כרגע.
              </div>
            ) : (
              filtered.map((lead) => {
                const active = selected?.id === lead.id;
                return (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setSelectedId(lead.id)}
                    className={`flex w-full flex-col gap-1 rounded-xl border p-4 text-right shadow-lg transition ${
                      active
                        ? "border-cyan-400/50 bg-[#182344]"
                        : "border-blue-900/60 bg-[#111a33] hover:bg-[#182344]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-bold text-white">
                        {lead.name}
                      </span>
                      <StatusBadge status={lead.status} />
                    </div>
                    <p className="text-sm text-blue-200">
                      {lead.source} · {lead.createdAt}
                    </p>
                    <p className="text-[15px] text-slate-300">{lead.note}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {selected && (
          <aside className="w-full shrink-0 rounded-xl border border-blue-900/60 bg-[#111a33] p-5 shadow-lg lg:w-[340px]">
            <h3 className="text-lg font-bold text-white">{selected.name}</h3>
            <p className="mt-1 text-[15px] text-blue-200">
              מקור: {selected.source}
            </p>
            <p className="mt-3 text-[15px] text-slate-200">{selected.note}</p>
            <p className="mt-2 text-sm text-blue-200">{selected.createdAt}</p>

            <a
              href={`https://wa.me/972${selected.whatsapp.replace(/\D/g, "").replace(/^0/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-[15px] font-bold text-white hover:bg-emerald-500"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              וואטסאפ · {selected.whatsapp}
            </a>

            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => markContacted(selected.id)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-[#0d1428] px-4 text-[15px] font-bold text-white hover:bg-blue-800/80"
              >
                <Phone className="h-4 w-4" aria-hidden />
                סמן כנוצר קשר
              </button>
              {(["חדש", "נוצר קשר", "בטיפול", "נסגר"] as LeadStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(selected.id, st)}
                    className={`min-h-11 rounded-lg border px-3 text-sm font-semibold ${
                      selected.status === st
                        ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                        : "border-blue-900/60 bg-[#0d1428] text-blue-200 hover:text-white"
                    }`}
                  >
                    סטטוס: {st}
                  </button>
                )
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const colors: Record<LeadStatus, string> = {
    חדש: "border-cyan-400/40 bg-cyan-500/15 text-cyan-300",
    "נוצר קשר": "border-amber-400/40 bg-amber-500/15 text-amber-300",
    בטיפול: "border-blue-400/40 bg-blue-500/15 text-blue-200",
    נסגר: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  };
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-sm font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
}
