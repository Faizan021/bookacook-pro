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
    <div className="space-y-6 text-[#16372f]">
      <div className="overflow-hidden rounded-[2rem] border border-[#eadfce] bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-[#faf6ee] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6d35]">
              <Sparkles className="h-3.5 w-3.5" />
              {t("portal.customer", "Kundenbereich")}
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
              {t("dashboard.customer.title", "Willkommen in Ihrem Speisely Dashboard")}
              {data.userName ? `, ${data.userName}` : ""}
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5c6f68]">
              {t(
                "dashboard.customer.welcome",
                "Planen Sie neue Catering-Anfragen, entdecken Sie passende Caterer und verfolgen Sie Ihre Event-Aktivitäten an einem Ort."
              )}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/request/new"
                className="inline-flex items-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
              >
                {t("customer.planEvent", "Event planen")}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/caterers"
                className="inline-flex items-center rounded-full border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#f4ead7]"
              >
                {t("customer.browseCaterers", "Caterer entdecken")}
              </Link>

              <Link
                href="/customer/bookings"
                className="inline-flex items-center rounded-full border border-[#d8ccb9] bg-[#faf6ee] px-5 py-3 text-sm font-semibold text-[#173f35] transition hover:bg-[#f4ead7]"
              >
                {t("customer.myRequests", "Meine Anfragen")}
              </Link>
            </div>
          </div>

          <div className="hidden bg-[#faf6ee] p-6 lg:block">
            <div className="h-full rounded-[1.5rem] border border-[#eadfce] bg-gradient-to-br from-[#173f35] via-[#244f43] to-[#d7b66d] p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f6df9e]">
                AI Matching
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Beschreiben Sie Ihr Event. Speisely strukturiert den Rest.
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/75">
                Nutzen Sie die KI-gestützte Anfrage, um Budget, Gästezahl, Stil,
                Ort und Anforderungen schneller zu klären.
              </p>

              <Link
                href="/request/new"
                className="mt-6 inline-flex rounded-full bg-[#d7b66d] px-5 py-3 text-sm font-semibold text-[#173f35]"
              >
                Anfrage starten →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("metrics.totalOrdersMade", "Anfragen gesamt")}
          value={data.totalOrders}
          subtitle={t("metrics.allBookingsMade", "Alle erstellten Anfragen")}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.completedOrders", "Abgeschlossen")}
          value={data.completedOrders}
          subtitle={t("metrics.successfullyCompleted", "Erfolgreich abgeschlossen")}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.pendingOrders", "Offen")}
          value={data.pendingOrders}
          subtitle={t("metrics.waitingUpdate", "Warten auf Update")}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <MetricCard
          title={t("metrics.favoriteCaterers", "Favoriten")}
          value={data.favoriteCaterers}
          subtitle={t("metrics.savedByCust", "Gespeicherte Caterer")}
          icon={<Heart className="h-5 w-5" />}
        />
      </div>

      {!hasOrders && (
        <div className="rounded-[1.75rem] border border-dashed border-[#d8ccb9] bg-white p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
            <Sparkles className="h-3.5 w-3.5" />
            {t("customer.startPlanning", "Planung starten")}
          </div>

          <h2 className="mt-3 text-2xl font-semibold">
            {t("customer.noRequestsTitle", "Noch keine Event-Anfragen")}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5c6f68]">
            {t(
              "customer.noRequestsText",
              "Beschreiben Sie Ihr Event und Speisely hilft Ihnen, passende Caterer für Ihren Anlass zu entdecken."
            )}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/request/new"
              className="inline-flex items-center gap-2 rounded-full bg-[#173f35] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2f27]"
            >
              {t("customer.planEvent", "Event planen")}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/caterers"
              className="inline-flex items-center rounded-full border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#f4ead7]"
            >
              {t("customer.browseCaterers", "Caterer entdecken")}
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {hasHistory ? (
            <SalesChart
              title={t("chart.orderHistory", "Anfrageverlauf")}
              data={data.orderHistory}
              subtitle={t("chart.performance", "Aktivität")}
            />
          ) : (
            <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {t("chart.orderHistory", "Anfrageverlauf")}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8a6d35]">
                    {t("chart.performance", "Aktivität")}
                  </p>
                </div>

                <span className="rounded-full border border-[#eadfce] bg-[#faf6ee] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35]">
                  Empty
                </span>
              </div>

              <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-[1.25rem] border border-dashed border-[#d8ccb9] bg-[#faf6ee] text-center">
                <div className="max-w-sm px-6">
                  <p className="text-sm font-semibold">
                    {t("customer.historyEmptyTitle", "Ihr Anfrageverlauf erscheint hier")}
                  </p>
                  <p className="mt-2 text-sm text-[#5c6f68]">
                    {t(
                      "customer.historyEmptyText",
                      "Sobald Sie Events planen, sehen Sie hier Ihre Aktivität und Fortschritte."
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          {hasRecentOrders ? (
            <RecentActivity
              title={t("activity.recentOrders", "Aktuelle Anfragen")}
              items={data.recentOrders}
            />
          ) : (
            <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold">
                  {t("activity.recentOrders", "Aktuelle Anfragen")}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8a6d35]">
                  {t("activity.latest", "Neueste Aktivität")}
                </p>
              </div>

              <div className="mt-6 rounded-[1.25rem] border border-dashed border-[#d8ccb9] bg-[#faf6ee] p-6 text-center">
                <p className="text-sm font-semibold">
                  {t("customer.noRecentTitle", "Noch keine aktuellen Anfragen")}
                </p>
                <p className="mt-2 text-sm text-[#5c6f68]">
                  {t(
                    "customer.noRecentText",
                    "Wenn Sie Ihre erste Event-Anfrage erstellen, erscheint sie hier."
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
