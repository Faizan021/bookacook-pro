import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import { createClient } from "@/lib/supabase/server";
import { RestaurantOverviewDisplay } from "@/components/dashboard/restaurant-overview-display";

export default async function RestaurantDashboardPage() {
  const { user, profile } = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  if (profile?.role !== "restaurant") {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch restaurant profile
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, business_name, slug, logo_url")
    .eq("user_id", user.id)
    .maybeSingle();

  const restaurantId = restaurant?.id;

  // Fetch today's orders
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  let todaysOrders = 0;
  let revenueToday = 0;
  let recentOrders: {
    id: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
    items_count: number;
  }[] = [];

  if (restaurantId) {
    // Count today's orders
    const { count } = await supabase
      .from("restaurant_orders")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId)
      .gte("created_at", todayStart.toISOString());

    todaysOrders = count ?? 0;

    // Revenue today
    const { data: todayOrdersData } = await supabase
      .from("restaurant_orders")
      .select("total_amount")
      .eq("restaurant_id", restaurantId)
      .gte("created_at", todayStart.toISOString());

    revenueToday = (todayOrdersData ?? []).reduce(
      (sum, o) => sum + (o.total_amount ?? 0),
      0
    );

    // Recent orders (last 10)
    const { data: recent } = await supabase
      .from("restaurant_orders")
      .select("id, customer_name, total_amount, order_status, created_at")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })
      .limit(10);

    recentOrders = (recent ?? []).map((o) => ({
      id: o.id,
      customer_name: o.customer_name ?? "Guest",
      total: o.total_amount ?? 0,
      status: o.order_status ?? "pending",
      created_at: o.created_at,
      items_count: 0,
    }));
  }

  // Count active menu items
  let activeMenuItems = 0;
  if (restaurantId) {
    const { count } = await supabase
      .from("restaurant_products")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true);

    activeMenuItems = count ?? 0;
  }

  const avgOrderValue =
    todaysOrders > 0 ? Math.round(revenueToday / todaysOrders) : 0;

  const dashboardData = {
    todaysOrders,
    revenueToday,
    activeMenuItems,
    avgOrderValue,
    recentOrders,
    businessName: restaurant?.business_name ?? "Restaurant",
  };

  return <RestaurantOverviewDisplay data={dashboardData} />;
}
