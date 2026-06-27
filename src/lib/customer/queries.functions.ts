import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";

export type UnifiedActivityItem =
  | {
      kind: "order";
      id: string;
      status: string;
      total_cents: number;
      created_at: string;
      restaurant_id: string;
      restaurant_name: string | null;
      restaurant_slug: string | null;
      items: Array<{ name?: string; qty?: number; price_cents?: number }>;
      notes: string | null;

    }
  | {
      kind: "reservation";
      id: string;
      status: string;
      created_at: string;
      restaurant_name: string | null;
      restaurant_slug: string | null;
      reservation_date: string;
      reservation_time: string;
      guest_count: number;
    }
  | {
      kind: "brief";
      id: string;
      status: string;
      created_at: string;
      caterer_slug: string | null;
      planner_slug: string | null;
      event_type: string | null;
      event_date: string | null;
      guest_count: number | null;
      budget_cents: number | null;
      location: string | null;
      notes: string | null;
      milestones?: any[];
    };

export const getCustomerUnifiedActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [ordersRes, briefsRes, resRes] = await Promise.all([
      supabase
        .from("restaurant_orders")
        .select(
          "id, status, total_cents, created_at, restaurant_id, items, notes, restaurants(name, slug)",
        )
        .eq("customer_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("catering_briefs")
        .select(
          "id, status, created_at, caterer_slug, planner_slug, event_type, event_date, guest_count, budget_cents, location, notes, milestones",
        )
        .eq("customer_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("table_reservations")
        .select(
          "id, status, created_at, reservation_date, reservation_time, guest_count, restaurants(name, slug)"
        )
        .eq("customer_id", userId)
        .order("created_at", { ascending: false }),
    ]);

    if (ordersRes.error) throw new Error(ordersRes.error.message);
    if (briefsRes.error) throw new Error(briefsRes.error.message);
    if (resRes.error) throw new Error(resRes.error.message);

    const orders: UnifiedActivityItem[] = (ordersRes.data ?? []).map((o: any) => ({
      kind: "order",
      id: o.id,
      status: o.status,
      total_cents: o.total_cents,
      created_at: o.created_at,
      restaurant_id: o.restaurant_id,
      restaurant_name: o.restaurants?.name ?? null,
      restaurant_slug: o.restaurants?.slug ?? null,
      items: Array.isArray(o.items) ? (o.items as any[]) : [],
      notes: o.notes,
    }));

    const briefs: UnifiedActivityItem[] = (briefsRes.data ?? []).map((b: any) => ({
      kind: "brief",
      id: b.id,
      status: b.status,
      created_at: b.created_at,
      caterer_slug: b.caterer_slug,
      planner_slug: b.planner_slug,
      event_type: b.event_type,
      event_date: b.event_date,
      guest_count: b.guest_count,
      budget_cents: b.budget_cents,
      location: b.location,
      notes: b.notes,
      milestones: b.milestones || [],
    }));

    const reservations: UnifiedActivityItem[] = (resRes.data ?? []).map((r: any) => ({
      kind: "reservation",
      id: r.id,
      status: r.status,
      created_at: r.created_at,
      restaurant_name: r.restaurants?.name ?? null,
      restaurant_slug: r.restaurants?.slug ?? null,
      reservation_date: r.reservation_date,
      reservation_time: r.reservation_time,
      guest_count: r.guest_count,
    }));

    const timeline = [...orders, ...briefs, ...reservations].sort((a, b) =>
      a.created_at < b.created_at ? 1 : -1,
    );

    return {
      orders,
      briefs,
      reservations,
      timeline,
      counts: { orders: orders.length, briefs: briefs.length, reservations: reservations.length, total: timeline.length },
    };
  });
