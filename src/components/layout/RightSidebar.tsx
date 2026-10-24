import {
  CalendarDays,
  ImageIcon,
  Settings,
  Users,
} from "lucide-react";
import type { AutomationMode, ConnectedAccount } from "@/types/social";
import { AccountCard } from "@/components/accounts/AccountCard";
import { AutomationModePicker } from "@/components/accounts/AutomationModePicker";
import { Card } from "@/components/ui/Card";

const NAV_ITEMS = [
  { id: "calendar", label: "יומן ואירועים", icon: CalendarDays },
  { id: "leads", label: "ניהול פניות (לידים)", icon: Users },
  { id: "studio", label: "סטודיו תמונות ווידאו", icon: ImageIcon },
  { id: "settings", label: "הגדרות פרטי עסק", icon: Settings },
] as const;

type RightSidebarProps = {
  accounts: ConnectedAccount[];
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
  automationMode: AutomationMode;
  onAutomationModeChange: (mode: AutomationMode) => void;
  activeNav: string;
  onNavChange: (id: string) => void;
};

export function RightSidebar({
  accounts,
  selectedAccountId,
  onSelectAccount,
  automationMode,
  onAutomationModeChange,
  activeNav,
  onNavChange,
}: RightSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-y-auto border-l border-slate-300 bg-white p-4 lg:w-[300px] lg:shrink-0">
      <div>
        <h1 className="text-xl font-bold text-slate-900">אורן · סוויטת שיווק</h1>
        <p className="mt-1 text-sm text-slate-700">ניהול חשבונות והפצה חכמה</p>
      </div>

      <Card className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">חשבונות מחוברים</h2>
        <div className="space-y-2">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              selected={account.id === selectedAccountId}
              onSelect={onSelectAccount}
            />
          ))}
        </div>
      </Card>

      <Card>
        <AutomationModePicker
          value={automationMode}
          onChange={onAutomationModeChange}
        />
      </Card>

      <nav aria-label="תפריט ראשי" className="space-y-1">
        <p className="mb-2 px-1 text-base font-bold text-slate-900">תפריט ראשי</p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavChange(id)}
              className={`flex w-full min-h-touch items-center gap-3 rounded-xl border px-3 text-right text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                active
                  ? "border-blue-600 bg-blue-50 text-slate-900"
                  : "border-transparent text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
