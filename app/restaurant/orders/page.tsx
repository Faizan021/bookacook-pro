"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ClipboardList,
  Clock,
  ChefHat,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeOrders } from "@/hooks/useRealtimeOrders";
import { updateRestaurantOrderStatus } from "@/lib/restaurant/actions";

type Order = {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  total_amount: number;
  order_status: string;
  created_at: string;
  notes: string | null;
};

const STATUS_FLOW = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "delivered",
] as const;

type OrderStatus = (typeof STATUS_FLOW)[number] | "cancelled";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode; bgColor: string }
> = {
  pending: {
    label: "Pending",
    color: "border-amber-200 bg-amber-50 text-amber-700",
    bgColor: "bg-amber-50",
    icon: <Clock className="h-4 w-4" />,
  },
  confirmed: {
    label: "Confirmed",
    color: "border-blue-200 bg-blue-50 text-blue-700",
    bgColor: "bg-blue-50",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  preparing: {
    label: "Preparing",
    color: "border-violet-200 bg-violet-50 text-violet-700",
    bgColor: "bg-violet-50",
    icon: <ChefHat className="h-4 w-4" />,
  },
  ready: {
    label: "Ready",
    color: "border-emerald-200 bg-emerald-50 text-emerald-700",
    bgColor: "bg-emerald-50",
    icon: <PackageCheck className="h-4 w-4" />,
  },
  picked_up: {
    label: "Picked Up",
    color: "border-teal-200 bg-teal-50 text-teal-700",
    bgColor: "bg-teal-50",
    icon: <Truck className="h-4 w-4" />,
  },
  delivered: {
    label: "Delivered",
    color: "border-gray-200 bg-gray-50 text-gray-600",
    bgColor: "bg-gray-50",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "border-red-200 bg-red-50 text-red-700",
    bgColor: "bg-red-50",
    icon: <XCircle className="h-4 w-4" />,
  },
};

function getNextStatus(current: string): string | null {
  const idx = STATUS_FLOW.indexOf(current as (typeof STATUS_FLOW)[number]);
  if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

function getNextStatusLabel(current: string): string | null {
  const next = getNextStatus(current);
  if (!next) return null;
  return STATUS_CONFIG[next]?.label ?? next;
}

function formatEuro(value: number) {
  return `€${value.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`;
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

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersPage() {
  const t = useT();
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | undefined>(undefined);

  const fetchOrders = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!restaurant) return;
    setRestaurantId(restaurant.id);

    let query = supabase
      .from("restaurant_orders")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("order_status", statusFilter);
    }

    const { data } = await query.limit(50);
    setOrders(data ?? []);
    setLoading(false);
  }, [supabase, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useRealtimeOrders(restaurantId, () => {
    fetchOrders();
  });

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    await updateRestaurantOrderStatus(orderId, newStatus);
    await fetchOrders();
    setUpdatingOrder(null);
  };

  const cancelOrder = async (orderId: string) => {
    setUpdatingOrder(orderId);
    await updateRestaurantOrderStatus(orderId, "cancelled");
    await fetchOrders();
    setUpdatingOrder(null);
  };

  // Count orders by status
  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.order_status] = (acc[o.order_status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#b28a3c]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[2rem] border border-[#eadfce] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c49840]/20 bg-[#faf6ee] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b28a3c]">
              <ClipboardList className="h-3.5 w-3.5" />
              Order Management
            </div>

            <h1 className="premium-heading mt-5 text-3xl font-semibold tracking-tight text-[#173f35] md:text-4xl">
              Live Orders
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5c6f68]">
              Track and manage incoming orders. Update status as you prepare
              and deliver each order.
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchOrders();
            }}
            className="inline-flex items-center gap-2 rounded-[1rem] border border-[#d8ccb9] bg-white px-4 py-3 text-sm font-semibold text-[#173f35] shadow-sm transition hover:bg-[#faf6ee]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
            statusFilter === "all"
              ? "border-[#173f35] bg-[#173f35] text-white"
              : "border-[#eadfce] bg-white text-[#5c6f68] hover:border-[#d8ccb9] hover:text-[#173f35]"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUS_FLOW.map((status) => {
          const config = STATUS_CONFIG[status];
          const count = statusCounts[status] || 0;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                statusFilter === status
                  ? "border-[#173f35] bg-[#173f35] text-white"
                  : `border-[#eadfce] bg-white text-[#5c6f68] hover:border-[#d8ccb9] hover:text-[#173f35]`
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-[#d8ccb9] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1rem] border border-[#d6b25e]/30 bg-[#faf6ee] text-[#9a7432]">
            <ClipboardList className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#173f35]">
            No orders found
          </h3>
          <p className="mt-2 text-sm text-[#5c6f68]">
            {statusFilter !== "all"
              ? `No ${STATUS_CONFIG[statusFilter]?.label.toLowerCase()} orders at the moment.`
              : "Orders will appear here when customers place them."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = STATUS_CONFIG[order.order_status] ?? STATUS_CONFIG.pending;
            const nextStatus = getNextStatus(order.order_status);
            const nextLabel = getNextStatusLabel(order.order_status);
            const isUpdating = updatingOrder === order.id;

            return (
              <div
                key={order.id}
                className="rounded-[1.75rem] border border-[#eadfce] bg-white p-5 shadow-sm transition hover:border-[#d8ccb9] md:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* Left: Order Info */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border ${config.color}`}
                    >
                      {config.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-semibold text-[#173f35]">
                          {order.customer_name ?? "Guest"}
                        </h3>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-[#5c6f68]">
                        <span className="font-semibold text-[#173f35]">
                          {formatEuro(order.total_amount ?? 0)}
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(order.created_at)} ({timeAgo(order.created_at)})
                        </span>
                      </div>

                      {order.notes && (
                        <p className="mt-2 rounded-[0.75rem] border border-[#eadfce] bg-[#faf6ee] px-3 py-2 text-xs text-[#5c6f68]">
                          <span className="font-semibold text-[#8a6d35]">
                            Note:
                          </span>{" "}
                          {order.notes}
                        </p>
                      )}

                      {order.customer_phone && (
                        <p className="mt-1 text-xs text-[#5c6f68]">
                          📞 {order.customer_phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {order.order_status !== "delivered" &&
                      order.order_status !== "cancelled" && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          disabled={isUpdating}
                          className="rounded-[0.75rem] border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}

                    {nextStatus && (
                      <button
                        onClick={() => updateStatus(order.id, nextStatus)}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-2 rounded-[1rem] bg-[#173f35] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0f2f27] disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          STATUS_CONFIG[nextStatus]?.icon
                        )}
                        Mark as {nextLabel}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
