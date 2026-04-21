"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Clock3,
  CalendarRange,
  Sparkles,
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
          {data.userName ? `, ${data.userName}` : ""}.{" "}
          Manage your requests, review your matches, and continue your event
          planning journey with Speisely.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/request/new"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            {t("home.editorialCtaPrimary")}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/caterers"
            className="inline-flex items-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
          >
            {t("home.editorialCtaSecondary")}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("metrics.totalOrdersMade")}
          value={data.totalOrders}
          subtitle={t("metrics.allBookingsMade")}
          icon={<CalendarRange className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.completedOrders")}
          value={data.completedOrders}
          subtitle={t("metrics.successfullyCompleted")}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.pendingOrders")}
          value={data.pendingOrders}
          subtitle={t("metrics.waitingUpdate")}
          icon={<Clock3 className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.favoriteCaterers")}
          value={data.favoriteCaterers}
          subtitle={t("metrics.savedByCust")}
          icon={<Heart className="h-5 w-5" />}
        />
      </div>

      {!hasOrders && (
        <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-8">
          <h2 className="text-2xl font-semibold text-white">
            No event requests yet
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9faf9b]">
            Tell Speisely what you are planning and we will help you turn your
            event idea into a structured request and a more relevant shortlist
            of catering partners.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/request/new"
              className="rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Plan an Event
            </Link>

            <Link
              href="/caterers"
              className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
            >
              Browse Caterers
            </Link>

            <Link
              href="/customer/bookings"
              className="rounded-[1rem] border border-white/10 bg-black/10 px-5 py-3 text-sm font-medium text-[#eadfca] transition hover:border-white/15 hover:bg-white/[0.03]"
            >
              View My Requests
            </Link>
          </div>
        </div>
      )}

      {hasOrders && (
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c49840]">
                Active planning
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Continue your customer journey
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#9faf9b]">
                Review your existing requests, compare caterers, and move your
                event planning forward from one place.
              </p>
            </div>

            <Link
              href="/customer/bookings"
              className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              View active requests
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart
            title={t("chart.orderHistory")}
            data={data.orderHistory}
            subtitle={t("chart.performance")}
          />
        </div>

        <RecentActivity
          title={t("activity.recentOrders")}
          items={data.recentOrders}
        />
      </div>

      {!hasHistory && hasOrders && (
        <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/10 p-6 text-center text-sm text-[#92a18f]">
          Your request history and booking activity will appear here as your
          Speisely journey progresses.
        </div>
      )}

      {!hasRecentOrders && hasOrders && (
        <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-black/10 p-6 text-center text-sm text-[#92a18f]">
          Recent customer activity will appear here once requests and booking
          updates start moving through the platform.
        </div>
      )}
    </div>
  );
}
