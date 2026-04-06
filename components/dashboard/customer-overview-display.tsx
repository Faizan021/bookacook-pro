"use client";

import { useT } from "@/lib/i18n/context";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

type ActivityItem = { title: string; subtitle: string; amount?: string };

type CustomerData = {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  favoriteCaterers: number;
  orderHistory: { name: string; value: number }[];
  recentOrders: ActivityItem[];
  userName?: string;
};

export function CustomerOverviewDisplay({ data }: { data: CustomerData }) {
  const t = useT();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.customer.title")}</h1>
        <p className="mt-1 text-gray-500">
          {t("dashboard.customer.welcome")}
          {data.userName ? `, ${data.userName}` : ""}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("metrics.totalOrdersMade")} value={data.totalOrders} subtitle={t("metrics.allBookingsMade")} />
        <MetricCard title={t("metrics.completedOrders")} value={data.completedOrders} subtitle={t("metrics.successfullyCompleted")} />
        <MetricCard title={t("metrics.pendingOrders")} value={data.pendingOrders} subtitle={t("metrics.waitingUpdate")} />
        <MetricCard title={t("metrics.favoriteCaterers")} value={data.favoriteCaterers} subtitle={t("metrics.savedByCust")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title={t("chart.orderHistory")} data={data.orderHistory} />
        </div>
        <RecentActivity title={t("activity.recentOrders")} items={data.recentOrders} />
      </div>
    </div>
  );
}
