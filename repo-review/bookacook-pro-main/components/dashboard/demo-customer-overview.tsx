"use client";

import { useT } from "@/lib/i18n/context";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

const orderData = [
  { name: "Jan", value: 1 },
  { name: "Feb", value: 3 },
  { name: "Mar", value: 2 },
  { name: "Apr", value: 4 },
  { name: "May", value: 3 },
  { name: "Jun", value: 5 },
];

const recentOrders = [
  { title: "BBQ Party Booking", subtitle: "Booked with Berlin Grill House • Completed", amount: "€850" },
  { title: "Wedding Catering Inquiry", subtitle: "Booked with Royal Events Catering • Pending", amount: "€2,400" },
  { title: "Corporate Lunch", subtitle: "Booked with FreshBite Catering • Confirmed", amount: "€1,150" },
];

export function DemoCustomerOverview() {
  const t = useT();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{t("dashboard.customer.title")}</h1>
        <p className="mt-1 text-gray-500">{t("dashboard.customer.subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("metrics.totalOrdersMade")} value={12} subtitle={t("metrics.allBookingsMade")} />
        <MetricCard title={t("metrics.completedOrders")} value={8} subtitle={t("metrics.successfullyCompleted")} />
        <MetricCard title={t("metrics.pendingOrders")} value={3} subtitle={t("metrics.waitingUpdate")} />
        <MetricCard title={t("metrics.favoriteCaterers")} value={5} subtitle={t("metrics.savedByCust")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart title={t("chart.orderHistory")} data={orderData} />
        </div>
        <RecentActivity title={t("activity.recentOrders")} items={recentOrders} />
      </div>
    </div>
  );
}
