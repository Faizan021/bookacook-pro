import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/lib/auth/role-middleware";

// Resolution helpers for vendor ownership
async function resolveOwnedRestaurant(supabase: any, userId: string) {
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();
  return data;
}

async function resolveOwnedCaterer(supabase: any, userId: string) {
  const { data } = await supabase.from("caterers").select("*").eq("owner_id", userId).maybeSingle();
  return data;
}

async function resolveOwnedPlanner(supabase: any, userId: string) {
  const { data } = await supabase
    .from("event_managers")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();
  return data;
}

// --------------------------------------------------------
// Restaurant Reviews
// --------------------------------------------------------

export const getVendorRestaurantReviews = createServerFn({ method: "GET" })
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const vendor = await resolveOwnedRestaurant(supabase, userId);
    if (!vendor) throw new Error("Not authorized");

    const { data, error } = await supabase
      .from("restaurant_reviews")
      .select(
        "id, overall_rating, food_quality_rating, speed_rating, comment, vendor_reply, status, created_at, customer_name",
      )
      .eq("restaurant_id", vendor.id)
      .in("status", ["published", "pending_moderation", "flagged"])
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const submitRestaurantVendorReply = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator((input: { reviewId: string; reply: string }) =>
    z.object({ reviewId: z.string().uuid(), reply: z.string().min(1) }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const vendor = await resolveOwnedRestaurant(supabase, userId);
    if (!vendor) throw new Error("Not authorized");

    // 1. Enforce ownership and check if already replied
    const { data: existing, error: checkErr } = await supabase
      .from("restaurant_reviews")
      .select("id, vendor_reply")
      .eq("id", data.reviewId)
      .eq("restaurant_id", vendor.id)
      .maybeSingle();

    if (checkErr || !existing) throw new Error("Review not found or not owned");
    if (existing.vendor_reply)
      throw new Error("Review already has a vendor reply. Single reply enforced.");

    // 2. Submit reply
    const { error: updateErr } = await supabase
      .from("restaurant_reviews")
      .update({ vendor_reply: data.reply })
      .eq("id", data.reviewId)
      .eq("restaurant_id", vendor.id);

    if (updateErr) throw new Error(updateErr.message);
    return { success: true };
  });

export const flagRestaurantReview = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator((input: { reviewId: string }) =>
    z.object({ reviewId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const vendor = await resolveOwnedRestaurant(supabase, userId);
    if (!vendor) throw new Error("Not authorized");

    // Only allow flagging if currently published to prevent tampering
    const { error: updateErr } = await supabase
      .from("restaurant_reviews")
      .update({ status: "flagged" })
      .eq("id", data.reviewId)
      .eq("restaurant_id", vendor.id)
      .eq("status", "published");

    if (updateErr) throw new Error(updateErr.message);
    return { success: true };
  });

// --------------------------------------------------------
// Caterer Reviews
// --------------------------------------------------------

export const getVendorCatererReviews = createServerFn({ method: "GET" })
  .middleware([requireRole("caterer")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const vendor = await resolveOwnedCaterer(supabase, userId);
    if (!vendor) throw new Error("Not authorized");

    const { data, error } = await supabase
      .from("caterer_reviews")
      .select(
        `
        id, overall_rating, food_rating, reliability_rating, communication_rating, value_rating, 
        comment, vendor_reply, status, created_at, customer_name,
        catering_bookings ( event_type )
      `,
      )
      .eq("caterer_id", vendor.id)
      .in("status", ["published", "pending_moderation", "flagged"])
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((r: any) => ({
      ...r,
      event_type: r.catering_bookings?.event_type || null,
      catering_bookings: undefined,
    }));
  });

export const submitCatererVendorReply = createServerFn({ method: "POST" })
  .middleware([requireRole("caterer")])
  .validator((input: { reviewId: string; reply: string }) =>
    z.object({ reviewId: z.string().uuid(), reply: z.string().min(1) }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const vendor = await resolveOwnedCaterer(supabase, userId);
    if (!vendor) throw new Error("Not authorized");

    const { data: existing, error: checkErr } = await supabase
      .from("caterer_reviews")
      .select("id, vendor_reply")
      .eq("id", data.reviewId)
      .eq("caterer_id", vendor.id)
      .maybeSingle();

    if (checkErr || !existing) throw new Error("Review not found or not owned");
    if (existing.vendor_reply)
      throw new Error("Review already has a vendor reply. Single reply enforced.");

    const { error: updateErr } = await supabase
      .from("caterer_reviews")
      .update({ vendor_reply: data.reply })
      .eq("id", data.reviewId)
      .eq("caterer_id", vendor.id);

    if (updateErr) throw new Error(updateErr.message);
    return { success: true };
  });

export const flagCatererReview = createServerFn({ method: "POST" })
  .middleware([requireRole("caterer")])
  .validator((input: { reviewId: string }) =>
    z.object({ reviewId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const vendor = await resolveOwnedCaterer(supabase, userId);
    if (!vendor) throw new Error("Not authorized");

    const { error: updateErr } = await supabase
      .from("caterer_reviews")
      .update({ status: "flagged" })
      .eq("id", data.reviewId)
      .eq("caterer_id", vendor.id)
      .eq("status", "published");

    if (updateErr) throw new Error(updateErr.message);
    return { success: true };
  });

// --------------------------------------------------------
// Planner Reviews
// --------------------------------------------------------

export const getVendorPlannerReviews = createServerFn({ method: "GET" })
  .middleware([requireRole("planner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const vendor = await resolveOwnedPlanner(supabase, userId);
    if (!vendor) throw new Error("Not authorized");

    const { data, error } = await supabase
      .from("event_manager_reviews")
      .select(
        `
        id, overall_rating, creativity_rating, execution_rating, communication_rating, value_rating, 
        comment, vendor_reply, status, created_at, customer_name,
        event_bookings ( event_type )
      `,
      )
      .eq("event_manager_id", vendor.id)
      .in("status", ["published", "pending_moderation", "flagged"])
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((r: any) => ({
      ...r,
      event_type: r.event_bookings?.event_type || null,
      event_bookings: undefined,
    }));
  });

export const submitPlannerVendorReply = createServerFn({ method: "POST" })
  .middleware([requireRole("planner")])
  .validator((input: { reviewId: string; reply: string }) =>
    z.object({ reviewId: z.string().uuid(), reply: z.string().min(1) }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const vendor = await resolveOwnedPlanner(supabase, userId);
    if (!vendor) throw new Error("Not authorized");

    const { data: existing, error: checkErr } = await supabase
      .from("event_manager_reviews")
      .select("id, vendor_reply")
      .eq("id", data.reviewId)
      .eq("event_manager_id", vendor.id)
      .maybeSingle();

    if (checkErr || !existing) throw new Error("Review not found or not owned");
    if (existing.vendor_reply)
      throw new Error("Review already has a vendor reply. Single reply enforced.");

    const { error: updateErr } = await supabase
      .from("event_manager_reviews")
      .update({ vendor_reply: data.reply })
      .eq("id", data.reviewId)
      .eq("event_manager_id", vendor.id);

    if (updateErr) throw new Error(updateErr.message);
    return { success: true };
  });

export const flagPlannerReview = createServerFn({ method: "POST" })
  .middleware([requireRole("planner")])
  .validator((input: { reviewId: string }) =>
    z.object({ reviewId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const vendor = await resolveOwnedPlanner(supabase, userId);
    if (!vendor) throw new Error("Not authorized");

    const { error: updateErr } = await supabase
      .from("event_manager_reviews")
      .update({ status: "flagged" })
      .eq("id", data.reviewId)
      .eq("event_manager_id", vendor.id)
      .eq("status", "published");

    if (updateErr) throw new Error(updateErr.message);
    return { success: true };
  });
