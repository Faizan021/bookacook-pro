"use client";

import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  DollarSign,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  Clock,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { MetricCard } from "@/components/dashboard/metric-card";

type RecentOrder = {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
  items_count: number;
};

type RestaurantData = {
  todaysOrders: number;
  revenueToday: number;
  activeMenuItems: number;
  avgOrderValue: number;
  recentOrders: RecentOrder[];
  businessName: string;
};

function formatEuro(value: number) {
  return `€${value.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "confirmed":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "preparing":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "ready":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "picked_up":
      return "border-teal-200 bg-teal-50 text-teal-700";
    case "delivered":
      return "border-gray-200 bg-gray-50 text-gray-600";
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-[#eadfce] bg-[#faf6ee] text-[#8a6d35]";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "preparing":
      return "Preparing";
    case "ready":
      return "Ready";
    case "picked_up":
      return "Picked Up";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function RestaurantOverviewDisplay({ data }: { data: RestaurantData }) {
  const t = useT();

  const hasOrders = data.recentOrders.length > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#faf6ee] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
          <Sparkles className="h-3.5 w-3.5" />
          Restaurant Portal
        </div>

        <h1 className="premium-heading mt-5 text-3xl font-semibold tracking-tight text-[#173f35] md:text-4xl">
          {t("dashboard.restaurant.title", "Restaurant Dashboard")}
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-[#5c6f68]">
          {t(
            "dashboard.restaurant.welcome",
            "Welcome back"
          )}
          {data.businessName ? `, ${data.businessName}` : ""}. Manage your menu,
          track orders, and grow your restaurant — all from one place.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/restaurant/menu"
            className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
          >
            Manage Menu
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/restaurant/orders"
            className="inline-flex items-center rounded-[1rem] border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
          >
            View Orders
          </Link>

          <Link
            href="/restaurant/settings"
            className="inline-flex items-center rounded-[1rem] border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#5c6f68] shadow-sm transition hover:bg-[#faf6ee]"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Today's Orders"
          value={data.todaysOrders}
          subtitle="Orders received today"
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <MetricCard
          title="Revenue Today"
          value={formatEuro(data.revenueToday)}
          subtitle="Total earnings today"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Menu Items"
          value={data.activeMenuItems}
          subtitle="Currently available"
          icon={<UtensilsCrossed className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Order Value"
          value={data.todaysOrders > 0 ? formatEuro(data.avgOrderValue) : "—"}
          subtitle="Per order average"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Empty State or CTA */}
      {!hasOrders && (
        <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
            <Sparkles className="h-3.5 w-3.5" />
            Getting Started
          </div>

          <h2 className="premium-heading mt-3 text-2xl font-semibold text-[#173f35]">
            No orders yet
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5c6f68]">
            Your restaurant dashboard is ready. Start by adding menu items to
            your storefront. Once customers discover your restaurant, orders will
            flow in and your metrics will come alive.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/restaurant/menu"
              className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
            >
              Add Menu Items
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/restaurant/settings"
              className="inline-flex items-center rounded-[1rem] border border-[#d8ccb9] bg-white px-5 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
            >
              Configure Settings
            </Link>
          </div>
        </div>
      )}

      {/* Live Orders CTA */}
      {hasOrders && (
        <div className="rounded-[1.75rem] border border-[#eadfce] bg-[#faf6ee] p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
                Live orders
              </div>
              <h2 className="premium-heading mt-2 text-2xl font-semibold text-[#173f35]">
                Stay on top of incoming orders
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5c6f68]">
                Track each order from the moment it&apos;s placed through
                preparation and pickup — deliver a seamless experience to every
                customer.
              </p>
            </div>

            <Link
              href="/restaurant/orders"
              className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2f27]"
            >
              Open live orders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent Orders List */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#173f35]">
                  Recent Orders
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5c6f68]">
                  Latest incoming orders
                </p>
              </div>

              {hasOrders && (
                <Link
                  href="/restaurant/orders"
                  className="rounded-full border border-[#eadfce] bg-[#faf6ee] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a6d35] transition hover:bg-[#f4ead7]"
                >
                  View All
                </Link>
              )}
            </div>

            {hasOrders ? (
              <div className="mt-5 space-y-3">
                {data.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-[#eadfce] bg-[#faf6ee]/50 px-4 py-3.5 transition hover:border-[#d8ccb9] hover:bg-[#faf6ee]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.75rem] border border-[#d6b25e]/30 bg-[#faf6ee] text-[#9a7432]">
                        <ClipboardList className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#173f35]">
                          {order.customer_name}
                        </p>
                        <p className="text-xs text-[#5c6f68]">
                          {order.items_count} {order.items_count === 1 ? "item" : "items"} · {formatEuro(order.total)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-[#5c6f68]">
                        <Clock className="h-3 w-3" />
                        {timeAgo(order.created_at)}
                      </div>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.25rem] border border-dashed border-[#d8ccb9] bg-[#faf6ee] p-6 text-center">
                <p className="text-sm font-medium text-[#173f35]">
                  No recent orders yet
                </p>
                <p className="mt-2 text-sm text-[#5c6f68]">
                  New orders will appear here as customers place them through
                  your storefront.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="rounded-[1.75rem] border border-[#eadfce] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#173f35]">
            Quick Actions
          </h3>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5c6f68]">
            Manage your restaurant
          </p>

          <div className="mt-5 space-y-2.5">
            <Link
              href="/restaurant/menu"
              className="group flex items-center gap-3 rounded-[1rem] border border-[#eadfce] bg-[#faf6ee]/50 px-4 py-3.5 transition hover:border-[#c99a3d]/40 hover:bg-[#faf6ee]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] border border-[#d6b25e]/30 bg-[#faf6ee] text-[#9a7432]">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#173f35]">
                  Manage Menu
                </p>
                <p className="text-xs text-[#5c6f68]">
                  Add, edit, or toggle items
                </p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-[#5c6f68] transition group-hover:text-[#173f35]" />
            </Link>

            <Link
              href="/restaurant/orders"
              className="group flex items-center gap-3 rounded-[1rem] border border-[#eadfce] bg-[#faf6ee]/50 px-4 py-3.5 transition hover:border-[#c99a3d]/40 hover:bg-[#faf6ee]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] border border-[#d6b25e]/30 bg-[#faf6ee] text-[#9a7432]">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#173f35]">
                  Live Orders
                </p>
                <p className="text-xs text-[#5c6f68]">
                  Track and update orders
                </p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-[#5c6f68] transition group-hover:text-[#173f35]" />
            </Link>

            <Link
              href="/restaurant/settings"
              className="group flex items-center gap-3 rounded-[1rem] border border-[#eadfce] bg-[#faf6ee]/50 px-4 py-3.5 transition hover:border-[#c99a3d]/40 hover:bg-[#faf6ee]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] border border-[#d6b25e]/30 bg-[#faf6ee] text-[#9a7432]">
                <DollarSign className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#173f35]">
                  Settings
                </p>
                <p className="text-xs text-[#5c6f68]">
                  Business info & delivery
                </p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-[#5c6f68] transition group-hover:text-[#173f35]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
