"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useT } from "@/lib/i18n/context";

type SalesChartProps = {
  title: string;
  data: { name: string; value: number }[];
  subtitle?: string;
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;

  return (
    <div className="rounded-[1rem] border border-[#eadfce] bg-white px-3 py-2 shadow-xl">
      <p className="text-[11px] uppercase tracking-[0.14em] text-[#8a6d35]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#173f35]">
        {typeof value === "number" && value > 100
          ? `€${value.toLocaleString("de-DE")}`
          : value}
      </p>
    </div>
  );
}

export function SalesChart({ title, data, subtitle }: SalesChartProps) {
  const t = useT();

  return (
    <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4 rtl:flex-row-reverse">
        <div>
          <h3 className="text-lg font-semibold text-[#173f35]">{title}</h3>

          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8a6d35]">
            {subtitle ?? t("chart.performance", "Performance")}
          </p>
        </div>

        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
          {t("chart.live", "Live")}
        </span>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
          >
            <defs>
              <linearGradient id="speiselyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c99a3d" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#c99a3d" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#eadfce"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#5c6f68" }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#5c6f68" }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#c99a3d"
              strokeWidth={2.5}
              fill="url(#speiselyAreaGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#c99a3d",
                stroke: "#173f35",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
