"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_AUTOMATION_MODE,
  INITIAL_CHAT,
  MOCK_ACCOUNTS,
  MOCK_CAMPAIGN,
} from "@/data/mock";
import type { AutomationMode, Platform } from "@/types/social";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { AgentChat } from "@/components/agent/AgentChat";
import { LivePreview } from "@/components/preview/LivePreview";

export function AppShell() {
  const [accounts] = useState(MOCK_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState(
    MOCK_ACCOUNTS.find((a) => a.isConnected)?.id ?? MOCK_ACCOUNTS[0].id
  );
  const [automationMode, setAutomationMode] = useState<AutomationMode>(
    DEFAULT_AUTOMATION_MODE
  );
  const [activeNav, setActiveNav] = useState("calendar");
  const [activePlatform, setActivePlatform] = useState<Platform>("facebook");
  const [mobilePane, setMobilePane] = useState<"accounts" | "chat" | "preview">(
    "chat"
  );

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedAccountId),
    [accounts, selectedAccountId]
  );

  function handleSelectAccount(id: string) {
    setSelectedAccountId(id);
    const account = accounts.find((a) => a.id === id);
    if (account) setActivePlatform(account.platform);
  }

  return (
    <div className="flex h-dvh flex-col bg-slate-50 text-slate-900">
      {/* Mobile pane switcher */}
      <div className="flex gap-1 border-b border-slate-300 bg-white p-2 lg:hidden">
        {(
          [
            ["accounts", "חשבונות"],
            ["chat", "סוכן"],
            ["preview", "תצוגה"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMobilePane(id)}
            className={`min-h-touch flex-1 rounded-lg border text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              mobilePane === id
                ? "border-blue-600 bg-blue-50"
                : "border-slate-300 bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* RTL: first child = right column (accounts), last = left (preview) */}
      <div className="flex min-h-0 flex-1">
        <div
          className={`${
            mobilePane === "accounts" ? "flex" : "hidden"
          } min-h-0 w-full lg:flex`}
        >
          <RightSidebar
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onSelectAccount={handleSelectAccount}
            automationMode={automationMode}
            onAutomationModeChange={setAutomationMode}
            activeNav={activeNav}
            onNavChange={setActiveNav}
          />
        </div>

        <div
          className={`${
            mobilePane === "chat" ? "flex" : "hidden"
          } min-h-0 min-w-0 flex-1 flex-col lg:flex`}
        >
          <div className="hidden border-b border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 lg:block">
            מצב נוכחי:{" "}
            <span className="font-semibold text-slate-900">
              {automationMode === "full_auto"
                ? "אוטומטי מלא"
                : automationMode === "semi_auto"
                  ? "חצי אוטומטי"
                  : "ידני"}
            </span>
            {selectedAccount && (
              <>
                {" "}
                · חשבון נבחר:{" "}
                <span className="font-semibold text-slate-900">
                  {selectedAccount.accountName}
                </span>
              </>
            )}
          </div>
          <AgentChat initialMessages={INITIAL_CHAT} />
        </div>

        <div
          className={`${
            mobilePane === "preview" ? "flex" : "hidden"
          } min-h-0 w-full lg:flex`}
        >
          <LivePreview
            campaign={MOCK_CAMPAIGN}
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            activePlatform={activePlatform}
            onPlatformChange={setActivePlatform}
          />
        </div>
      </div>
    </div>
  );
}
