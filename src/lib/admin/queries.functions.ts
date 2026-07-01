import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";

// Helper to verify admin role
async function verifyAdmin(supabaseAdmin: any, userId: string) {
  const { data: roleRecord, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error || !roleRecord) {
    throw new Error("Unauthorized: Administrator access required");
  }
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    // 1. Fetch Subscription Data for MRR
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("plan, status, created_at, current_period_start");

    if (subError) throw new Error("Failed to fetch subscriptions: " + subError.message);

    // Calculate MRR
    let currentMRR = 0;
    const activeSubs = subscriptions?.filter(s => s.status === 'active' || s.status === 'trialing') || [];
    activeSubs.forEach(s => {
      if (s.plan === 'starter') currentMRR += 34.99;
      else if (s.plan === 'growth') currentMRR += 59;
      else if (s.plan === 'premium') currentMRR += 99;
    });

    // 6-Month MRR Trend Calculation
    // Generate last 6 months (chronological order: oldest to newest)
    const trendData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('en-US', { month: 'short' });
      const year = d.getFullYear();
      const monthIndex = d.getMonth(); // 0-11
      const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

      // Sum active plans created on or before this month end
      let monthMRR = 0;
      subscriptions?.forEach(s => {
        const createdDate = new Date(s.created_at || s.current_period_start);
        if (createdDate <= monthEnd && (s.status === 'active' || s.status === 'trialing')) {
          if (s.plan === 'starter') monthMRR += 34.99;
          else if (s.plan === 'growth') monthMRR += 59;
          else if (s.plan === 'premium') monthMRR += 99;
        }
      });

      trendData.push({
        month: monthLabel,
        mrr: monthMRR
      });
    }

    // 2. Fetch Commissions Revenue
    const { data: payments, error: pError } = await supabaseAdmin
      .from("payments")
      .select("platform_fee_amount, amount_total, status, created_at")
      .eq("status", "captured");

    if (pError) throw new Error("Failed to fetch payments: " + pError.message);

    const totalCommissions = (payments || []).reduce((acc, p) => acc + Number(p.platform_fee_amount || 0), 0);

    // 3. Fetch KPI Counts
    const [
      { count: totalUsers },
      { count: totalRestaurants },
      { count: totalCaterers },
      { count: totalPlanners },
      { count: totalRestOrders },
      { count: totalCatBookings },
      { count: totalEventBookings }
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("restaurants").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("caterers").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("planners").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("restaurant_orders").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("catering_bookings").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("event_bookings").select("*", { count: "exact", head: true })
    ]);

    const totalOrders = (totalRestOrders || 0) + (totalCatBookings || 0) + (totalEventBookings || 0);

    return {
      mrr: currentMRR,
      mrrTrend: trendData,
      commissions: totalCommissions,
      metrics: {
        users: totalUsers || 0,
        restaurants: totalRestaurants || 0,
        caterers: totalCaterers || 0,
        planners: totalPlanners || 0,
        orders: totalOrders || 0,
        subscriptions: activeSubs.length
      },
      recentPayments: (payments || []).slice(0, 10)
    };
  });

export const getAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    // Fetch all profiles and their app roles
    const [{ data: profiles, error: pError }, { data: roles, error: rError }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("user_roles").select("*")
    ]);

    if (pError) throw new Error("Failed to fetch profiles: " + pError.message);
    if (rError) throw new Error("Failed to fetch roles: " + rError.message);

    // Map profiles with their roles
    return (profiles || []).map(p => {
      const userRoles = (roles || []).filter(r => r.user_id === p.id).map(r => r.role);
      const primaryRole = userRoles.includes("admin") ? "admin" 
                        : userRoles.includes("caterer") ? "caterer"
                        : userRoles.includes("restaurant_owner") ? "restaurant_owner"
                        : userRoles.includes("planner") ? "planner"
                        : "customer";
      return {
        ...p,
        role: primaryRole, // Override the deprecated profiles.role
        roles: userRoles
      };
    });
  });

export const getAdminListings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    // Fetch listings
    const [
      { data: restaurants, error: rError },
      { data: caterers, error: cError },
      { data: planners, error: plError },
      { data: subscriptions },
      { data: profiles }
    ] = await Promise.all([
      supabaseAdmin.from("restaurants").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("caterers").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("planners").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("subscriptions").select("*"),
      supabaseAdmin.from("profiles").select("id, full_name, email")
    ]);

    if (rError) throw new Error("Failed to fetch restaurants: " + rError.message);
    if (cError) throw new Error("Failed to fetch caterers: " + cError.message);
    if (plError) throw new Error("Failed to fetch planners: " + plError.message);

    // Helper mapping profiles
    const getOwner = (ownerId: string) => {
      const owner = profiles?.find(p => p.id === ownerId);
      return owner ? { name: owner.full_name || "Unknown", email: owner.email || "No Email" } : { name: "Unknown", email: "No Email" };
    };

    // Process restaurants
    const mappedRestaurants = (restaurants || []).map(r => {
      const sub = subscriptions?.find(s => s.restaurant_id === r.id);
      const hasStripe = r.stripe_connect_status === 'connected';
      const hasSubscription = sub && (sub.status === 'active' || sub.status === 'trialing');
      const isPublished = r.is_published;

      // Determine onboarding step
      let onboardingStep = "Stripe Pending";
      if (!hasStripe) {
        onboardingStep = "Stripe Pending";
      } else if (!hasSubscription) {
        onboardingStep = "Subscription Pending";
      } else if (!isPublished) {
        onboardingStep = "Publish Pending";
      } else {
        onboardingStep = "Complete";
      }

      return {
        ...r,
        owner: getOwner(r.owner_id),
        subscription: sub ? { plan: sub.plan, status: sub.status } : null,
        onboardingStep
      };
    });

    // Process caterers
    const mappedCaterers = (caterers || []).map(c => {
      return {
        ...c,
        owner: getOwner(c.owner_id)
      };
    });

    // Process planners
    const mappedPlanners = (planners || []).map(p => {
      return {
        ...p,
        owner: getOwner(p.owner_id)
      };
    });

    return {
      restaurants: mappedRestaurants,
      caterers: mappedCaterers,
      planners: mappedPlanners
    };
  });

export const getAdminOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    // Fetch orders, catering bookings, event bookings
    const [
      { data: restOrders, error: roError },
      { data: cateringBookings, error: cbError },
      { data: eventBookings, error: ebError },
      { data: restaurants },
      { data: caterers },
      { data: planners },
      { data: profiles }
    ] = await Promise.all([
      supabaseAdmin.from("restaurant_orders").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("catering_bookings").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("event_bookings").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("restaurants").select("id, name"),
      supabaseAdmin.from("caterers").select("id, name"),
      supabaseAdmin.from("planners").select("id, name"),
      supabaseAdmin.from("profiles").select("id, full_name, email")
    ]);

    if (roError) throw new Error("Failed to fetch restaurant orders: " + roError.message);
    if (cbError) throw new Error("Failed to fetch catering bookings: " + cbError.message);
    if (ebError) throw new Error("Failed to fetch event bookings: " + ebError.message);

    const getCustomerName = (id: string) => {
      const p = profiles?.find(prof => prof.id === id);
      return p?.full_name || "Guest Customer";
    };

    // Unified format mapping
    const ordersList: any[] = [];

    restOrders?.forEach(o => {
      const rest = restaurants?.find(r => r.id === o.restaurant_id);
      ordersList.push({
        id: o.id,
        type: "Restaurant Order",
        merchantName: rest?.name || "Unknown Restaurant",
        customerName: o.customer_name || getCustomerName(o.customer_id),
        date: o.created_at,
        amount: Number(o.total_cents || 0) / 100,
        status: o.status,
        currency: "EUR"
      });
    });

    cateringBookings?.forEach(cb => {
      const cat = caterers?.find(c => c.id === cb.caterer_id);
      ordersList.push({
        id: cb.id,
        type: "Catering Booking",
        merchantName: cat?.name || "Unknown Caterer",
        customerName: getCustomerName(cb.customer_id),
        date: cb.created_at,
        amount: Number(cb.deposit_amount || cb.quoted_amount || 0),
        status: cb.booking_status,
        currency: cb.currency || "EUR"
      });
    });

    eventBookings?.forEach(eb => {
      const plan = planners?.find(p => p.id === eb.planner_id);
      ordersList.push({
        id: eb.id,
        type: "Event Booking",
        merchantName: plan?.name || "Unknown Planner",
        customerName: getCustomerName(eb.customer_id),
        date: eb.created_at,
        amount: Number(eb.deposit_amount || eb.quoted_amount || 0),
        status: eb.booking_status,
        currency: eb.currency || "EUR"
      });
    });

    // Sort chronologically (newest first)
    ordersList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return ordersList;
  });

export const getSeoDrafts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await verifyAdmin(supabaseAdmin, userId);

    const { data, error } = await supabaseAdmin
      .from("seo_content_pages")
      .select(`
        *,
        author:last_edited_by (
          email
        )
      `)
      .order("updated_at", { ascending: false });

    if (error) throw new Error("Failed to fetch SEO drafts: " + error.message);
    return data;
  });
