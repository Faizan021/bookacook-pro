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
  "bg-orange-400",
  "bg-blue-400",
  "bg-violet-400",
  "bg-green-400",
  "bg-amber-400",
];

export function RecentActivity({ title, items }: RecentActivityProps) {
  const t = useT();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between rtl:flex-row-reverse">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-400">{t("activity.latest")}</p>
        </div>
        <button className="text-xs font-medium text-orange-500 transition-colors hover:text-orange-600">
          {t("activity.viewAll")}
        </button>
      </div>

      <div className="space-y-1">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 rtl:flex-row-reverse"
          >
            <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${DOT_COLORS[index % DOT_COLORS.length]}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800">{item.title}</p>
              <p className="mt-0.5 truncate text-xs text-gray-400">{item.subtitle}</p>
            </div>
            {item.amount ? (
              <span className="flex-shrink-0 text-sm font-semibold text-gray-900">
                {item.amount}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
