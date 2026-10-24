import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "success" | "amber" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 focus:ring-blue-600",
  secondary:
    "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus:ring-blue-600",
  success:
    "bg-emerald-600 text-white border border-emerald-700 hover:bg-emerald-700 focus:ring-emerald-600",
  amber:
    "bg-amber-500 text-amber-950 border border-amber-600 hover:bg-amber-400 focus:ring-amber-500",
  ghost:
    "bg-transparent text-slate-800 border border-transparent hover:bg-slate-100 focus:ring-blue-600",
};

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-touch items-center justify-center gap-2 rounded-lg px-4 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
