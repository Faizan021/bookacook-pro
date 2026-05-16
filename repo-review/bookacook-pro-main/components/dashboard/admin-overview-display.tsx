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
    <div className="space-y-6 text-[#16372f]">
      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#d6b25e]/30 bg-[#faf6ee] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a7432]">
          <Sparkles className="h-3.5 w-3.5" />
          {t("portal.admin", "Admin portal")}
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#173f35] md:text-4xl">
          {t("dashboard.admin.title", "Admin overview")}
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-[#5c6f68]">
          {t("dashboard.admin.welcome", "Welcome back")}
          {data.userName ? `, ${data.userName}` : ""}. Monitor caterer quality,
          platform activity, booking performance, and marketplace revenue from
          one premium admin control layer.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/caterers"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c99a3d] px-5 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#b88a2f]"
          >
            Review caterers
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/admin/bookings"
            className="inline-flex items-center rounded-[1rem] border border-[#eadfce] bg-[#faf6ee] px-5 py-3 text-sm font-semibold text-[#173f35] transition hover:border-[#c99a3d]"
          >
            View bookings
          </Link>

          <Link
            href="/admin/payments"
            className="inline-flex items-center rounded-[1rem] border border-[#eadfce] bg-white px-5 py-3 text-sm font-semibold text-[#5c6f68] transition hover:border-[#c99a3d] hover:text-[#173f35]"
          >
            Open payments
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("metrics.platformRevenue", "Platform revenue")}
          value={formatEuro(data.totalRevenue)}
          subtitle={t("metrics.totalGmv", "Total GMV")}
          icon={<Wallet className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.commissionEarned", "Commission earned")}
          value={formatEuro(data.totalCommission)}
          subtitle={t("metrics.platformShare", "10% platform share")}
          icon={<Receipt className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.totalCaterers", "Total caterers")}
          value={data.totalCaterers}
          subtitle={t("metrics.registeredCaterers", "Registered caterers")}
          icon={<Building2 className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.totalOrders", "Total orders")}
          value={data.totalOrders}
          subtitle={t("metrics.allBookings", "All platform bookings")}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7432]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Platform focus
            </div>

            <h2 className="mt-2 text-2xl font-semibold text-[#173f35]">
              Keep operations and quality aligned
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5c6f68]">
              Speisely’s admin layer should help you review caterers, protect
              marketplace quality, and monitor platform performance without
              breaking the premium brand experience.
            </p>
          </div>

          <Link
            href="/admin/caterers"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#c99a3d] px-5 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#b88a2f]"
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
              title={t("chart.platformRevenueTrend", "Platform revenue trend")}
              data={data.revenueData}
              subtitle={t("chart.performance", "Performance")}
            />
          ) : (
            <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#173f35]">
                    {t("chart.platformRevenueTrend", "Platform revenue trend")}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8a6d35]">
                    {t("chart.performance", "Performance")}
                  </p>
                </div>

                <span className="rounded-full border border-[#eadfce] bg-[#faf6ee] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Empty
                </span>
              </div>

              <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-[1.25rem] border border-dashed border-[#d8cbb9] bg-[#faf6ee] text-center">
                <div className="max-w-sm px-6">
                  <p className="text-sm font-semibold text-[#173f35]">
                    Revenue trend data will appear here
                  </p>
                  <p className="mt-2 text-sm text-[#5c6f68]">
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
            title={t("activity.platformActivity", "Platform activity")}
            items={data.recentActivity}
          />
        ) : (
          <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold text-[#173f35]">
                {t("activity.platformActivity", "Platform activity")}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8a6d35]">
                {t("activity.latest", "Latest")}
              </p>
            </div>

            <div className="mt-6 rounded-[1.25rem] border border-dashed border-[#d8cbb9] bg-[#faf6ee] p-6 text-center">
              <p className="text-sm font-semibold text-[#173f35]">
                No platform activity yet
              </p>
              <p className="mt-2 text-sm text-[#5c6f68]">
                Recent approvals, bookings, and payment updates will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
