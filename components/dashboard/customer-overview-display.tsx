"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Sparkles,
  ClipboardList,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

type ActivityItem = {
  title: string;
  subtitle: string;
  amount?: string;
};

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
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c49840]">
          <Sparkles className="h-3.5 w-3.5" />
          {t("portal.customer")}
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {t("dashboard.customer.title")}
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-[#9faf9b]">
          {t("dashboard.customer.welcome")}
          {data.userName ? `, ${data.userName}` : ""}. Track your catering
          requests, review activity, and continue planning your events through one
          premium customer experience.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/request/new"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            Plan an Event
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/caterers"
            className="inline-flex items-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
          >
            Browse Caterers
          </Link>

          <Link
            href="/customer/bookings"
            className="inline-flex items-center rounded-[1rem] border border-white/10 bg-black/10 px-5 py-3 text-sm font-medium text-[#eadfca] transition hover:border-white/15 hover:bg-white/[0.03]"
          >
            View My Requests
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("metrics.totalOrdersMade")}
          value={data.totalOrders}
          subtitle={t("metrics.allBookingsMade")}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.completedOrders")}
          value={data.completedOrders}
          subtitle={t("metrics.successfullyCompleted")}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.pendingOrders")}
          value={data.pendingOrders}
          subtitle={t("metrics.waitingUpdate")}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.favoriteCaterers")}
          value={data.favoriteCaterers}
          subtitle={t("metrics.savedByCust")}
          icon={<Heart className="h-5 w-5" />}
        />
      </div>

      {!hasOrders && (
        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c49840]">
            <Sparkles className="h-3.5 w-3.5" />
            Start planning
          </div>

          <h2 className="mt-3 text-2xl font-semibold text-white">
            No event requests yet
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9faf9b]">
            Tell us about your event and Speisely will help you discover suitable
            caterers for your occasion through a more premium and guided planning
            flow.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/request/new"
              className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Plan an Event
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/caterers"
              className="inline-flex items-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
            >
              Browse Caterers
            </Link>

            <Link
              href="/customer/bookings"
              className="inline-flex items-center rounded-[1rem] border border-white/10 bg-black/10 px-5 py-3 text-sm font-medium text-[#eadfca] transition hover:border-white/15 hover:bg-white/[0.03]"
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
              subtitle={t("chart.performance")}
            />
          ) : (
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {t("chart.orderHistory")}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8ea18b]">
                    {t("chart.performance")}
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8ea18b]">
                  Empty
                </span>
              </div>

              <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-[1.25rem] border border-dashed border-white/10 bg-black/10 text-center">
                <div className="max-w-sm px-6">
                  <p className="text-sm font-medium text-white">
                    Your request history will appear here
                  </p>
                  <p className="mt-2 text-sm text-[#92a18f]">
                    Once you start planning events, you will be able to track your
                    request activity and progress over time.
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
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {t("activity.recentOrders")}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8ea18b]">
                    {t("activity.latest")}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.25rem] border border-dashed border-white/10 bg-black/10 p-6 text-center">
                <p className="text-sm font-medium text-white">
                  No recent requests yet
                </p>
                <p className="mt-2 text-sm text-[#92a18f]">
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
