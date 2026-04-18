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
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        {icon ? (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-secondary">
            <span className="text-primary">{icon}</span>
          </div>
        ) : null}

        {trend ? (
          <span
            className={`ml-auto flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              trendUp
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        ) : null}
      </div>

      <div className={icon ? "mt-3" : ""}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </p>
        <p className="mt-1.5 text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        {subtitle ? (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
