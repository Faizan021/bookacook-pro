"use client";

import { useT } from "@/lib/i18n/context";

type ActivityItem = {
  title: string;
  subtitle: string;
  amount?: string;
};

type RecentActivityProps = {
  title: string;
  items: ActivityItem[];
};

const DOT_COLORS = [
  "bg-[#c49840]",
  "bg-emerald-400",
  "bg-sky-400",
  "bg-violet-400",
  "bg-amber-300",
];

export function RecentActivity({ title, items }: RecentActivityProps) {
  const t = useT();

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="mb-5 flex items-start justify-between rtl:flex-row-reverse">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8ea18b]">
            {t("activity.latest")}
          </p>
        </div>

        <button className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c49840] transition hover:text-[#eadfca]">
          {t("activity.viewAll")}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-black/10 px-4 py-8 text-center text-sm text-[#92a18f]">
          {t("activity.latest")}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex items-start gap-3 rounded-[1.15rem] border border-transparent bg-black/10 p-3 transition hover:border-white/10 hover:bg-white/[0.03] rtl:flex-row-reverse"
            >
              <div
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  DOT_COLORS[index % DOT_COLORS.length]
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1 truncate text-xs text-[#8ea18b]">
                  {item.subtitle}
                </p>
              </div>
              {item.amount ? (
                <span className="shrink-0 text-sm font-semibold text-[#eadfca]">
                  {item.amount}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
