"use client";

import { useT } from "@/lib/i18n/context";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

type ActivityItem = { title: string; subtitle: string; amount?: string };

type AdminData = {
  totalCaterers: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  revenueData: { name: string; value: number }[];
  recentActivity: ActivityItem[];
  userName?: string;
};

export function AdminOverviewDisplay({ data }: { data: AdminData }) {
  const t = useT();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.admin.title")}</h1>
        <p className="mt-1 text-gray-500">
          {t("dashboard.admin.welcome")}
          {data.userName ? `, ${data.userName}` : ""}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("metrics.platformRevenue")} value={`€${data.totalRevenue}`} subtitle={t("metrics.totalGmv")} />
        <MetricCard title={t("metrics.commissionEarned")} value={`€${data.totalCommission}`} subtitle={t("metrics.platformShare")} />
        <MetricCard title={t("metrics.totalCaterers")} value={data.totalCaterers} subtitle={t("metrics.registeredCaterers")} />
        <MetricCard title={t("metrics.totalOrders")} value={data.totalOrders} subtitle={t("metrics.allBookings")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title={t("chart.platformRevenueTrend")} data={data.revenueData} />
        </div>
        <RecentActivity title={t("activity.platformActivity")} items={data.recentActivity} />
      </div>
    </div>
  );
}
