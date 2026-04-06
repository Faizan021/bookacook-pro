type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
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
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        {icon ? (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50">
            <span className="text-orange-500">{icon}</span>
          </div>
        ) : null}
        {trend ? (
          <span
            className={`ml-auto flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              trendUp
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        ) : null}
      </div>

      <div className={icon ? "mt-3" : ""}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
          {title}
        </p>
        <p className="mt-1.5 text-3xl font-bold tracking-tight text-gray-900">
          {value}
        </p>
        {subtitle ? (
          <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
