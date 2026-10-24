import type { AutomationMode } from "@/types/social";
import { AUTOMATION_MODE_OPTIONS } from "@/lib/labels";

type AutomationModePickerProps = {
  value: AutomationMode;
  onChange: (mode: AutomationMode) => void;
};

export function AutomationModePicker({
  value,
  onChange,
}: AutomationModePickerProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-base font-bold text-slate-900">
        מצב עבודה גלובלי
      </legend>
      <div className="space-y-2" role="radiogroup" aria-label="מצב אוטומציה">
        {AUTOMATION_MODE_OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex min-h-touch cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                checked
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-300 bg-white hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="automation-mode"
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="mt-1 h-5 w-5 accent-blue-600"
              />
              <span>
                <span className="block text-base font-semibold text-slate-900">
                  {option.label}
                </span>
                <span className="block text-sm text-slate-700">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
