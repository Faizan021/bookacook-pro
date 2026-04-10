"use client";

import Link from "next/link";
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

  const hasOrders = data.totalOrders > 0;
  const hasHistory = data.orderHistory.length > 0;
  const hasRecentOrders = data.recentOrders.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.customer.title")}
        </h1>
        <p className="mt-1 text-gray-500">
          {t("dashboard.customer.welcome")}
          {data.userName ? `, ${data.userName}` : ""}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("metrics.totalOrdersMade")}
          value={data.totalOrders}
          subtitle={t("metrics.allBookingsMade")}
        />
        <MetricCard
          title={t("metrics.completedOrders")}
          value={data.completedOrders}
          subtitle={t("metrics.successfullyCompleted")}
        />
        <MetricCard
          title={t("metrics.pendingOrders")}
          value={data.pendingOrders}
          subtitle={t("metrics.waitingUpdate")}
        />
        <MetricCard
          title={t("metrics.favoriteCaterers")}
          value={data.favoriteCaterers}
          subtitle={t("metrics.savedByCust")}
        />
      </div>

      {!hasOrders && (
        <div className="rounded-2xl border border-dashed bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            No bookings yet
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            You have not placed any booking requests yet. Start by exploring
            caterers and sending your first booking inquiry.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/caterers"
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
            >
              Find Caterers
            </Link>
            <Link
              href="/customer/bookings"
              className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {hasHistory ? (
            <SalesChart
              title={t("chart.orderHistory")}
              data={data.orderHistory}
            />
          ) : (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("chart.orderHistory")}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No booking history yet.
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                  Empty
                </span>
              </div>

              <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center">
                <div className="max-w-sm px-6">
                  <p className="text-sm font-medium text-gray-700">
                    Your booking activity chart will appear here.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Once you create bookings, you will be able to track
                    activity over time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          {hasRecentOrders ? (
            <RecentActivity
              title={t("activity.recentOrders")}
              items={data.recentOrders}
            />
          ) : (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("activity.recentOrders")}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Latest updates and activity
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm font-medium text-gray-700">
                  No recent orders yet
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  When you place your first booking, it will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
