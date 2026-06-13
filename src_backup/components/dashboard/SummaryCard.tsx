import React from "react";

type SummaryCardProps = {
  title: string;
  value: string;
  detail?: string;
  tone?: "default" | "success" | "warning";
};

const toneStyles: Record<NonNullable<SummaryCardProps["tone"]>, string> = {
  default: "border-slate-200 bg-white text-slate-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
};

export function SummaryCard({
  title,
  value,
  detail,
  tone = "default",
}: SummaryCardProps) {
  return (
    <section className={`rounded-lg border p-5 shadow-sm ${toneStyles[tone]}`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-normal">{value}</p>
      {detail && <p className="mt-2 text-sm text-slate-500">{detail}</p>}
    </section>
  );
}
