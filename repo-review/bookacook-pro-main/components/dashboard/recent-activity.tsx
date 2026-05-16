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
  "bg-[#c99a3d]",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-amber-400",
];

export function RecentActivity({ title, items }: RecentActivityProps) {
  const t = useT();

  return (
    <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4 rtl:flex-row-reverse">
        <div>
          <h3 className="text-lg font-semibold text-[#173f35]">{title}</h3>

          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8a6d35]">
            {t("activity.latest", "Latest")}
          </p>
        </div>

        <button
          type="button"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9a7432] transition hover:text-[#173f35]"
        >
          {t("activity.viewAll", "View all")}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.25rem] border border-dashed border-[#d8cbb9] bg-[#faf6ee] px-4 py-8 text-center">
          <p className="text-sm font-semibold text-[#173f35]">
            {t("activity.latest", "Latest")}
          </p>

          <p className="mt-2 text-sm text-[#5c6f68]">
            Activity updates will appear here as your dashboard becomes active.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex items-start gap-3 rounded-[1.15rem] border border-[#eadfce] bg-[#faf6ee] p-3 transition hover:border-[#c99a3d]/40 hover:bg-white rtl:flex-row-reverse"
            >
              <div
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  DOT_COLORS[index % DOT_COLORS.length]
                }`}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#173f35]">
                  {item.title}
                </p>

                <p className="mt-1 truncate text-xs text-[#5c6f68]">
                  {item.subtitle}
                </p>
              </div>

              {item.amount ? (
                <span className="shrink-0 text-sm font-semibold text-[#9a7432]">
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
