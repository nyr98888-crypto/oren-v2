import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
};

export function Card({ children, className = "", as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={`rounded-xl border border-slate-300 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </Tag>
  );
}
