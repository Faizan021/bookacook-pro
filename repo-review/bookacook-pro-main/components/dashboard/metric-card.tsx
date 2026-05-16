import type { ReactNode } from "react";

type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendUp = true,
}: MetricCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#c99a3d]/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border border-[#d6b25e]/30 bg-[#faf6ee] text-[#9a7432]">
            {icon}
          </div>
        ) : (
          <div className="h-11 w-11 shrink-0 rounded-[1rem] border border-[#eadfce] bg-[#faf6ee]" />
        )}

        {trend ? (
          <span
            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
              trendUp
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
          {title}
        </p>

        <p className="mt-2 text-3xl font-semibold tracking-tight text-[#173f35]">
          {value}
        </p>

        {subtitle ? (
          <p className="mt-2 text-sm leading-6 text-[#5c6f68]">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
