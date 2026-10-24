"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { ChatMessage } from "@/types/social";
import { Button } from "@/components/ui/Button";

type AgentChatProps = {
  initialMessages: ChatMessage[];
  onQuickAction?: (action: string) => void;
};

export function AgentChat({ initialMessages, onQuickAction }: AgentChatProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const agentMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "agent",
      content:
        "קיבלתי. אני מעדכן את הטיוטה בתצוגה המקדימה משמאל, ומתאים את מצב ההפצה לפי סוג כל חשבון (עסקי = תזמון אוטומטי, פרטי = שיתוף מהיר).",
      quickActions: ["אשר ותזמן להפצה", "שנה ניסוח", "החלף תמונה"],
      timestamp: new Date().toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setInput("");
  }

  function handleQuickAction(action: string) {
    onQuickAction?.(action);
    setNotice(`בוצע: ${action}`);
    window.setTimeout(() => setNotice(null), 2500);
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-300 bg-white px-4 py-3">
        <h2 className="text-xl font-bold text-slate-900">סוכן ה־AI</h2>
        <p className="text-sm text-slate-700">
          שיחה בעברית פשוטה · מזהה אוטומטית חשבונות עסקיים ופרטיים
        </p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[92%] rounded-2xl border px-4 py-3 text-base leading-relaxed ${
                msg.role === "user"
                  ? "border-slate-300 bg-white text-slate-900"
                  : "border-blue-300 bg-blue-50 text-slate-900"
              }`}
            >
              <p className="mb-1 text-sm font-semibold text-slate-700">
                {msg.role === "user" ? "אתה" : "הסוכן"} · {msg.timestamp}
              </p>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.quickActions && msg.quickActions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.quickActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleQuickAction(action)}
                      className="min-h-touch rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {notice && (
        <div
          className="mx-4 mb-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900"
          role="status"
        >
          {notice}
        </div>
      )}

      <form
        className="flex gap-2 border-t border-slate-300 bg-white p-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <label htmlFor="agent-input" className="sr-only">
          הודעה לסוכן
        </label>
        <input
          id="agent-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="כתוב כאן מה תרצה לפרסם…"
          className="min-h-touch flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <Button type="submit" aria-label="שלח">
          <Send className="h-5 w-5" aria-hidden />
          שלח
        </Button>
      </form>
    </section>
  );
}
