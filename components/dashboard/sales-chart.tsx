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
    <div className="rounded-[1rem] border border-white/10 bg-[#0d1711]/95 px-3 py-2 shadow-2xl backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-[0.14em] text-[#8ea18b]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">
        {typeof value === "number" && value > 100
          ? `€${value.toLocaleString()}`
          : value}
      </p>
    </div>
  );
}

export function SalesChart({ title, data, subtitle }: SalesChartProps) {
  const t = useT();

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="mb-6 flex items-start justify-between rtl:flex-row-reverse">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8ea18b]">
            {subtitle ?? t("chart.performance")}
          </p>
        </div>

        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
          {t("chart.live")}
        </span>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="speiselyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c49840" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#c49840" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#8ea18b" }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#8ea18b" }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#c49840"
              strokeWidth={2.5}
              fill="url(#speiselyAreaGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#c49840",
                stroke: "#07110c",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
