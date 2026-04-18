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
      <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("dashboard.customer.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
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
        <div className="rounded-[1.75rem] border border-dashed border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            No event requests yet
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Tell us about your event and Speisely will help you discover suitable
            caterers for your occasion.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/request/new"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Plan an Event
            </Link>

            <Link
              href="/caterers"
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              Browse Caterers
            </Link>

            <Link
              href="/customer/bookings"
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              View My Requests
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
            <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t("chart.orderHistory")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No request history yet.
                  </p>
                </div>
                <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  Empty
                </span>
              </div>

              <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-[1.25rem] border border-dashed border-border bg-secondary/35 text-center">
                <div className="max-w-sm px-6">
                  <p className="text-sm font-medium text-foreground">
                    Your event request activity will appear here.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Once you start planning events, you will be able to track
                    your request history over time.
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
            <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t("activity.recentOrders")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Latest updates and activity
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.25rem] border border-dashed border-border bg-secondary/35 p-6 text-center">
                <p className="text-sm font-medium text-foreground">
                  No recent requests yet
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  When you create your first event request, it will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
