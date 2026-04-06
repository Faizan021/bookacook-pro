"use client";

import { useT } from "@/lib/i18n/context";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

const revenueData = [
  { name: "Jan", value: 4200 },
  { name: "Feb", value: 6100 },
  { name: "Mar", value: 5300 },
  { name: "Apr", value: 7900 },
  { name: "May", value: 6800 },
  { name: "Jun", value: 9400 },
];

const activityItems = [
  { title: "New caterer application", subtitle: "Berlin BBQ House • Pending approval" },
  { title: "Large booking completed", subtitle: "Corporate event • 120 guests", amount: "€4,200" },
  { title: "Commission received", subtitle: "Platform fee from recent booking", amount: "€420" },
];

export function DemoAdminOverview() {
  const t = useT();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.admin.title")}</h1>
        <p className="mt-1 text-gray-500">{t("dashboard.admin.subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("metrics.platformRevenue")} value="€38,500" subtitle={t("metrics.totalGmv")} />
        <MetricCard title={t("metrics.commissionEarned")} value="€3,850" subtitle={t("metrics.platformShare")} />
        <MetricCard title={t("metrics.totalCaterers")} value={24} subtitle={t("metrics.registeredCaterers")} />
        <MetricCard title={t("metrics.totalOrders")} value={126} subtitle={t("metrics.allBookings")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title={t("chart.platformRevenueTrend")} data={revenueData} />
        </div>
        <RecentActivity title={t("activity.platformActivity")} items={activityItems} />
      </div>
    </div>
  );
}
