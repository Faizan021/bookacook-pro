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
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-gray-900">
          {typeof payload[0].value === "number" && payload[0].value > 100
            ? `€${payload[0].value.toLocaleString()}`
            : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

export function SalesChart({ title, data, subtitle }: SalesChartProps) {
  const t = useT();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between rtl:flex-row-reverse">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-400">
            {subtitle ?? t("chart.performance")}
          </p>
        </div>
        <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green-600">
          {t("chart.live")}
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#areaGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
