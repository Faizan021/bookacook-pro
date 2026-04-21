"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
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

type AdminData = {
  totalCaterers: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  revenueData: { name: string; value: number }[];
  recentActivity: ActivityItem[];
  userName?: string;
};

function formatEuro(value: number) {
  return `€${value.toLocaleString("de-DE")}`;
}

export function AdminOverviewDisplay({ data }: { data: AdminData }) {
  const t = useT();

  const hasRevenue = data.revenueData.length > 0;
  const hasRecentActivity = data.recentActivity.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#c49840]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c49840]">
          <Sparkles className="h-3.5 w-3.5" />
          {t("portal.admin")}
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {t("dashboard.admin.title")}
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-[#9faf9b]">
          {t("dashboard.admin.welcome")}
          {data.userName ? `, ${data.userName}` : ""}. Monitor caterer quality,
          platform activity, booking performance, and marketplace revenue from one
          premium admin control layer.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/caterers"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            Review caterers
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/admin/bookings"
            className="inline-flex items-center rounded-[1rem] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#c49840]/40 hover:text-[#c49840]"
          >
            View bookings
          </Link>

          <Link
            href="/admin/payments"
            className="inline-flex items-center rounded-[1rem] border border-white/10 bg-black/10 px-5 py-3 text-sm font-medium text-[#eadfca] transition hover:border-white/15 hover:bg-white/[0.03]"
          >
            Open payments
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("metrics.platformRevenue")}
          value={formatEuro(data.totalRevenue)}
          subtitle={t("metrics.totalGmv")}
          icon={<Wallet className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.commissionEarned")}
          value={formatEuro(data.totalCommission)}
          subtitle={t("metrics.platformShare")}
          icon={<Receipt className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.totalCaterers")}
          value={data.totalCaterers}
          subtitle={t("metrics.registeredCaterers")}
          icon={<Building2 className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.totalOrders")}
          value={data.totalOrders}
          subtitle={t("metrics.allBookings")}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c49840]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Platform focus
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Keep operations and quality aligned
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#9faf9b]">
              Speisely’s admin layer should help you review caterers, protect
              marketplace quality, and monitor platform performance without breaking
              the premium brand experience.
            </p>
          </div>

          <Link
            href="/admin/caterers"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c49840] px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            Manage caterers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {hasRevenue ? (
            <SalesChart
              title={t("chart.platformRevenueTrend")}
              data={data.revenueData}
              subtitle={t("chart.performance")}
            />
          ) : (
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {t("chart.platformRevenueTrend")}
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
                    Revenue trend data will appear here
                  </p>
                  <p className="mt-2 text-sm text-[#92a18f]">
                    As platform bookings and payments grow, this admin view will
                    visualize marketplace momentum automatically.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {hasRecentActivity ? (
          <RecentActivity
            title={t("activity.platformActivity")}
            items={data.recentActivity}
          />
        ) : (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {t("activity.platformActivity")}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8ea18b]">
                  {t("activity.latest")}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.25rem] border border-dashed border-white/10 bg-black/10 p-6 text-center">
              <p className="text-sm font-medium text-white">
                No platform activity yet
              </p>
              <p className="mt-2 text-sm text-[#92a18f]">
                Recent approvals, bookings, and payment updates will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
