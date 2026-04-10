"use client";

import Link from "next/link";
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

  const hasOrders = data.totalOrders > 0;
  const hasSales = data.salesData.length > 0;
  const hasRecentBookings = data.recentBookings.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.caterer.title")}
        </h1>
        <p className="mt-1 text-gray-500">
          {t("dashboard.caterer.welcome")}
          {data.userName ? `, ${data.userName}` : ""}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("metrics.totalSales")}
          value={`€${data.totalSales}`}
          subtitle={t("metrics.salesThrough")}
        />
        <MetricCard
          title={t("metrics.totalOrders")}
          value={data.totalOrders}
          subtitle={t("metrics.allRequests")}
        />
        <MetricCard
          title={t("metrics.pendingRequests")}
          value={data.pendingRequests}
          subtitle={t("metrics.waitingResponse")}
        />
        <MetricCard
          title={t("metrics.packagesLive")}
          value={data.packagesLive}
          subtitle={t("metrics.visibleCustomers")}
        />
      </div>

      {!hasOrders && (
        <div className="rounded-2xl border border-dashed bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            No bookings yet
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Your caterer dashboard is ready. Once customers send booking requests
            or you publish packages, your activity will appear here.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/caterer/packages"
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
            >
              Add Packages
            </Link>
            <Link
              href="/caterer/bookings"
              className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              View Bookings
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {hasSales ? (
            <SalesChart title={t("chart.monthlySales")} data={data.salesData} />
          ) : (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("chart.monthlySales")}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No sales data yet.
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                  Empty
                </span>
              </div>

              <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center">
                <div className="max-w-sm px-6">
                  <p className="text-sm font-medium text-gray-700">
                    Your monthly sales chart will appear here.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    As soon as you receive bookings and payments, this overview
                    will start filling automatically.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          {hasRecentBookings ? (
            <RecentActivity
              title={t("activity.recentBookings")}
              items={data.recentBookings}
            />
          ) : (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("activity.recentBookings")}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Latest customer activity
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm font-medium text-gray-700">
                  No recent bookings yet
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  New booking requests and updates will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
