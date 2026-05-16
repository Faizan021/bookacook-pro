"use client";

import { useT } from "@/lib/i18n/context";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

const salesData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1800 },
  { name: "Mar", value: 1600 },
  { name: "Apr", value: 2400 },
  { name: "May", value: 2100 },
  { name: "Jun", value: 3200 },
];

const recentBookings = [
  { title: "Corporate Lunch - Berlin", subtitle: "24 guests • Confirmed", amount: "€1,200" },
  { title: "Wedding Catering - Potsdam", subtitle: "80 guests • Pending", amount: "€3,800" },
  { title: "Private Dinner - Hamburg", subtitle: "12 guests • Completed", amount: "€640" },
];

export function DemoCatererOverview() {
  const t = useT();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.caterer.title")}</h1>
        <p className="mt-1 text-gray-500">{t("dashboard.caterer.subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("metrics.totalSales")} value="€12,400" subtitle={t("metrics.salesThrough")} />
        <MetricCard title={t("metrics.totalOrders")} value={18} subtitle={t("metrics.allRequests")} />
        <MetricCard title={t("metrics.pendingRequests")} value={4} subtitle={t("metrics.waitingResponse")} />
        <MetricCard title={t("metrics.packagesLive")} value={6} subtitle={t("metrics.visibleCustomers")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title={t("chart.monthlySales")} data={salesData} />
        </div>
        <RecentActivity title={t("activity.recentBookings")} items={recentBookings} />
      </div>
    </div>
  );
}
