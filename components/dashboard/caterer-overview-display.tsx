"use client";

import { useT } from "@/lib/i18n/context";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

type ActivityItem = { title: string; subtitle: string; amount?: string };

type CatererData = {
  totalSales: number;
  totalOrders: number;
  pendingRequests: number;
  packagesLive: number;
  salesData: { name: string; value: number }[];
  recentBookings: ActivityItem[];
  userName?: string;
};

export function CatererOverviewDisplay({ data }: { data: CatererData }) {
  const t = useT();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.caterer.title")}</h1>
        <p className="mt-1 text-gray-500">
          {t("dashboard.caterer.welcome")}
          {data.userName ? `, ${data.userName}` : ""}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("metrics.totalSales")} value={`€${data.totalSales}`} subtitle={t("metrics.salesThrough")} />
        <MetricCard title={t("metrics.totalOrders")} value={data.totalOrders} subtitle={t("metrics.allRequests")} />
        <MetricCard title={t("metrics.pendingRequests")} value={data.pendingRequests} subtitle={t("metrics.waitingResponse")} />
        <MetricCard title={t("metrics.packagesLive")} value={data.packagesLive} subtitle={t("metrics.visibleCustomers")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title={t("chart.monthlySales")} data={data.salesData} />
        </div>
        <RecentActivity title={t("activity.recentBookings")} items={data.recentBookings} />
      </div>
    </div>
  );
}
