"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  ClipboardList,
  Package2,
  Sparkles,
  Wallet,
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

type CatererData = {
  totalSales: number;
  totalOrders: number;
  pendingRequests: number;
  packagesLive: number;
  salesData: { name: string; value: number }[];
  recentBookings: ActivityItem[];
  userName?: string;
};

function formatEuro(value: number) {
  return `€${value.toLocaleString("de-DE")}`;
}

export function CatererOverviewDisplay({ data }: { data: CatererData }) {
  const t = useT();

  const hasOrders = data.totalOrders > 0;
  const hasSales = data.salesData.length > 0;
  const hasRecentBookings = data.recentBookings.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#faf6ee] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
          <Sparkles className="h-3.5 w-3.5" />
          {t("portal.caterer")}
        </div>

        <h1 className="premium-heading mt-5 text-3xl font-semibold tracking-tight text-[#173f35] md:text-4xl">
          {t("dashboard.caterer.title")}
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-[#5c6f68]">
          {t("dashboard.caterer.welcome")}
          {data.userName ? `, ${data.userName}` : ""}. Manage visibility,
          packages, requests, and revenue from a dashboard that feels like the
          same premium Speisely experience.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/caterer/packages"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
          >
            {t("btn.newPackage")}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/caterer/bookings"
            className="inline-flex items-center rounded-[1rem] border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
          >
            {t("bookings.title")}
          </Link>

          <Link
            href="/caterer/verification"
            className="inline-flex items-center rounded-[1rem] border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#5c6f68] shadow-sm transition hover:bg-[#faf6ee]"
          >
            {t("nav.verification")}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("metrics.totalSales")}
          value={formatEuro(data.totalSales)}
          subtitle="Revenue through Speisely"
          icon={<Wallet className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.totalOrders")}
          value={data.totalOrders}
          subtitle={t("metrics.allRequests")}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.pendingRequests")}
          value={data.pendingRequests}
          subtitle={t("metrics.waitingResponse")}
          icon={<CalendarRange className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.packagesLive")}
          value={data.packagesLive}
          subtitle={t("metrics.visibleCustomers")}
          icon={<Package2 className="h-5 w-5" />}
        />
      </div>

      {!hasOrders && (
        <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
            <Sparkles className="h-3.5 w-3.5" />
            Caterer setup
          </div>

          <h2 className="premium-heading mt-3 text-2xl font-semibold text-[#173f35]">
            No booking requests yet
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5c6f68]">
            Your caterer dashboard is ready. Once customers start discovering
            your services and sending requests, your pipeline, revenue, and
            recent activity will appear here.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/caterer/packages"
              className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
            >
              Add Packages
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/caterer/bookings"
              className="inline-flex items-center rounded-[1rem] border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
            >
              View Bookings
            </Link>

            <Link
              href="/caterer/verification"
              className="inline-flex items-center rounded-[1rem] border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#5c6f68] shadow-sm transition hover:bg-[#faf6ee]"
            >
              Check Verification
            </Link>
          </div>
        </div>
      )}

      {hasOrders && (
        <div className="rounded-[1.75rem] border border-[#eadfce] bg-[#faf6ee] p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
                Sales and demand
              </div>
              <h2 className="premium-heading mt-2 text-2xl font-semibold text-[#173f35]">
                Stay on top of incoming opportunities
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5c6f68]">
                Watch demand build across bookings, package visibility, and
                customer interest so your Speisely presence keeps converting
                into stronger leads.
              </p>
            </div>

            <Link
              href="/caterer/bookings"
              className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
            >
              Open booking requests
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {hasSales ? (
            <SalesChart
              title={t("chart.monthlySales")}
              data={data.salesData}
              subtitle={t("chart.performance")}
            />
          ) : (
            <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#173f35]">
                    {t("chart.monthlySales")}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5c6f68]">
                    {t("chart.performance")}
                  </p>
                </div>

                <span className="rounded-full border border-[#eadfce] bg-[#faf6ee] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Empty
                </span>
              </div>

              <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-[1.25rem] border border-dashed border-[#d8ccb9] bg-[#faf6ee] text-center">
                <div className="max-w-sm px-6">
                  <p className="text-sm font-medium text-[#173f35]">
                    Your monthly sales view will appear here
                  </p>
                  <p className="mt-2 text-sm text-[#5c6f68]">
                    As bookings and payments move through Speisely, this area
                    will show your commercial performance over time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {hasRecentBookings ? (
          <RecentActivity
            title={t("activity.recentBookings")}
            items={data.recentBookings}
          />
        ) : (
          <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#173f35]">
                  {t("activity.recentBookings")}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5c6f68]">
                  Latest customer activity
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.25rem] border border-dashed border-[#d8ccb9] bg-[#faf6ee] p-6 text-center">
              <p className="text-sm font-medium text-[#173f35]">
                No recent bookings yet
              </p>
              <p className="mt-2 text-sm text-[#5c6f68]">
                New booking requests and customer activity will appear here as
                your dashboard becomes active.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
