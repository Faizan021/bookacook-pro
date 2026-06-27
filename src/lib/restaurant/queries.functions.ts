import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/lib/auth/role-middleware";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "picked_up",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

async function resolveOwnedRestaurant(supabase: any, userId: string) {
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();
  return data;
}


export const getRestaurantOrders = createServerFn({ method: "GET" })
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const restaurant = await resolveOwnedRestaurant(supabase, userId);
    if (!restaurant) return { restaurant: null, orders: [] as any[] };
    const { data, error } = await supabase
      .from("restaurant_orders")
      .select("id, customer_name, items, total_cents, status, notes, created_at")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { restaurant, orders: data ?? [] };
  });

export const getRestaurantProducts = createServerFn({ method: "GET" })
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const restaurant = await resolveOwnedRestaurant(supabase, userId);
    if (!restaurant) return { restaurant: null, products: [] as any[] };
    const { data, error } = await supabase
      .from("restaurant_products")
      .select("id, name, description, price_cents, image_url, is_available, created_at")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const products = await Promise.all(
      (data ?? []).map(async (p: any) => {
        if (!p.image_url) return { ...p, image_signed_url: null as string | null };
        if (/^https?:\/\//i.test(p.image_url))
          return { ...p, image_signed_url: p.image_url };
        const { data: signed } = await supabase.storage
          .from("restaurant-products")
          .createSignedUrl(p.image_url, 60 * 60);
        return { ...p, image_signed_url: signed?.signedUrl ?? null };
      }),
    );
    return { restaurant, products };
  });

export const updateRestaurantOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .inputValidator((input: { orderId: string; status: OrderStatus }) =>
    z
      .object({
        orderId: z.string().uuid(),
        status: z.enum(ORDER_STATUSES),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const restaurant = await resolveOwnedRestaurant(supabase, userId);
    if (!restaurant) throw new Error("No restaurant for this account");
    const { error } = await supabase
      .from("restaurant_orders")
      .update({ status: data.status })
      .eq("id", data.orderId)
      .eq("restaurant_id", restaurant.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getRestaurantKPIs = createServerFn({ method: "GET" })
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const restaurant = await resolveOwnedRestaurant(supabase, userId);
    if (!restaurant) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: orders, error } = await supabase
      .from("restaurant_orders")
      .select("id, total_cents, status, created_at")
      .eq("restaurant_id", restaurant.id);

    if (error) throw new Error(error.message);

    const { data: reservations } = await supabase
      .from("table_reservations")
      .select("id, status, created_at")
      .eq("restaurant_id", restaurant.id);

    const { count: profileViewsToday } = await supabase
      .from("storefront_page_views")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", restaurant.id)
      .gte("created_at", today.toISOString());

    const { count: totalProducts } = await supabase
      .from("restaurant_products")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", restaurant.id);

    const pendingOrders = orders?.filter((o: any) => o.status === "pending") || [];
    const ordersTodayList = orders?.filter((o: any) => new Date(o.created_at) >= today) || [];
    const revenueTodayCents = ordersTodayList
      .filter((o: any) => o.status === "completed" || o.status === "delivered" || o.status === "picked_up")
      .reduce((sum: number, o: any) => sum + o.total_cents, 0);

    const pendingReservations = reservations?.filter((r: any) => r.status === "pending") || [];
    const reservationsTodayList = reservations?.filter((r: any) => new Date(r.created_at) >= today) || [];

    const isProfileIncomplete = !restaurant.logo_url || !restaurant.description || !restaurant.phone;

    return {
      isActive: restaurant.is_active,
      pendingOrders: pendingOrders.length,
      ordersToday: ordersTodayList.length,
      revenueTodayCents,
      pendingReservations: pendingReservations.length,
      reservationsToday: reservationsTodayList.length,
      profileViewsToday: profileViewsToday || 0,
      totalProducts: totalProducts || 0,
      isProfileIncomplete,
      stripeConnectStatus: restaurant.stripe_connect_status,
      subscriptionStatus: restaurant.subscription_status,
      isPublished: restaurant.is_published,
      slug: restaurant.slug,
    };
  });

export const getRestaurantActivityFeed = createServerFn({ method: "GET" })
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const restaurant = await resolveOwnedRestaurant(supabase, userId);
    if (!restaurant) return [];

    const { data: orders } = await supabase
      .from("restaurant_orders")
      .select("id, customer_name, status, created_at")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: reservations } = await supabase
      .from("table_reservations")
      .select("id, first_name, last_name, guest_count, reservation_date, reservation_time, status, created_at")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: products } = await supabase
      .from("restaurant_products")
      .select("id, name, created_at")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const events: any[] = [];
    
    (orders || []).forEach((o: any) => {
      events.push({
        id: `order-${o.id}`,
        type: "order",
        description: `New order #${o.id.slice(0, 8)} received`,
        status: o.status,
        time: new Date(o.created_at),
      });
    });

    (reservations || []).forEach((r: any) => {
      events.push({
        id: `res-${r.id}`,
        type: "reservation",
        description: `Reservation for ${r.guest_count} people on ${r.reservation_date} ${r.reservation_time}`,
        status: r.status,
        time: new Date(r.created_at),
      });
    });

    (products || []).forEach((p: any) => {
      events.push({
        id: `prod-${p.id}`,
        type: "menu",
        description: `Menu item "${p.name}" updated`,
        status: "updated",
        time: new Date(p.created_at),
      });
    });

    events.sort((a, b) => b.time.getTime() - a.time.getTime());
    return events.slice(0, 10).map((e) => ({ ...e, time: e.time.toISOString() }));
  });

export const getRestaurantReservations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const restaurant = await resolveOwnedRestaurant(supabase, userId);
    if (!restaurant) return { restaurant: null, reservations: [] };
    const { data, error } = await supabase
      .from("table_reservations")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { restaurant, reservations: data ?? [] };
  });

export const updateReservationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .inputValidator((input: { reservationId: string; status: "pending" | "confirmed" | "declined" | "approved" | "rejected" | "cancelled" | "completed" | "no_show" }) =>
    z.object({
      reservationId: z.string().uuid(),
      status: z.enum(["pending", "confirmed", "declined", "approved", "rejected", "cancelled", "completed", "no_show"]),
    }).parse(input)
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const restaurant = await resolveOwnedRestaurant(supabase, userId);
    if (!restaurant) throw new Error("No restaurant for this account");
    const { error } = await supabase
      .from("table_reservations")
      .update({ status: data.status })
      .eq("id", data.reservationId)
      .eq("restaurant_id", restaurant.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

