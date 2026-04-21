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
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#c49840]/20 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-3">
        {icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border border-[#c49840]/15 bg-[#c49840]/10 text-[#c49840]">
            {icon}
          </div>
        ) : (
          <div className="h-11 w-11 shrink-0 rounded-[1rem] border border-white/8 bg-black/10" />
        )}

        {trend ? (
          <span
            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
              trendUp
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : "border-red-400/20 bg-red-400/10 text-red-300"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea18b]">
          {title}
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>
        {subtitle ? (
          <p className="mt-2 text-sm leading-6 text-[#9faf9b]">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
