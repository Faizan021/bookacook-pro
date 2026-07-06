import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import crypto from "crypto";

// Helper to generate a high-entropy token
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateReviewInvite = createServerFn({ method: "POST" })
  .validator(
    (input: {
      role: "restaurant" | "caterer" | "planner";
      referenceId: string;
      customerEmail: string;
    }) =>
      z
        .object({
          role: z.enum(["restaurant", "caterer", "planner"]),
          referenceId: z.string().uuid(),
          customerEmail: z.string().email(),
        })
        .parse(input)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Enforce eligibility rules here if needed, but for MVP we assume the caller
    // (a webhook or admin dashboard) has already verified status & completion time.
    
    // Check if an invite already exists for this reference_id and is not consumed
    const { data: existing } = await supabaseAdmin
      .from("review_invites")
      .select("token")
      .eq("reference_id", data.referenceId)
      .is("consumed_at", null)
      .maybeSingle();

    if (existing) {
      return { token: existing.token };
    }

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14); // 14 days expiry

    const { error } = await supabaseAdmin.from("review_invites").insert({
      token,
      role: data.role,
      reference_id: data.referenceId,
      customer_email: data.customerEmail,
      expires_at: expiresAt.toISOString(),
    } as any);

    if (error) {
      console.error("Failed to generate review invite:", error);
      throw new Error("Failed to generate review invite.");
    }

    return { token };
  });

export const getReviewIntakeData = createServerFn({ method: "GET" })
  .validator((input: { token: string }) => z.object({ token: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: invite, error } = await supabaseAdmin
      .from("review_invites")
      .select("*")
      .eq("token", data.token)
      .maybeSingle();

    if (error || !invite) {
      throw new Error("invalid_token");
    }

    const inviteAny = invite as any;

    if (inviteAny.consumed_at) {
      throw new Error("already_consumed");
    }

    if (new Date(inviteAny.expires_at) < new Date()) {
      throw new Error("expired");
    }

    // Determine target ID (restaurant_id, caterer_id, planner_id)
    let vendorName = "Vendor";
    
    if (inviteAny.role === "restaurant") {
      const { data: order } = await supabaseAdmin.from("restaurant_orders").select("restaurant_id").eq("id", inviteAny.reference_id).maybeSingle();
      if (order) {
        const { data: vendor } = await supabaseAdmin.from("restaurants").select("name").eq("id", (order as any).restaurant_id).maybeSingle();
        if (vendor) vendorName = vendor.name;
      }
    } else if (inviteAny.role === "caterer") {
      const { data: booking } = await supabaseAdmin.from("catering_bookings").select("caterer_id").eq("id", inviteAny.reference_id).maybeSingle();
      if (booking) {
        const { data: vendor } = await supabaseAdmin.from("caterers").select("name").eq("id", (booking as any).caterer_id).maybeSingle();
        if (vendor) vendorName = vendor.name;
      }
    } else if (inviteAny.role === "planner") {
      const { data: booking } = await supabaseAdmin.from("event_bookings").select("planner_id").eq("id", inviteAny.reference_id).maybeSingle();
      if (booking) {
        const { data: vendor } = await supabaseAdmin.from("planners").select("name").eq("id", booking.planner_id).maybeSingle();
        if (vendor) vendorName = (vendor as any).name;
      }
    }

    return {
      role: inviteAny.role,
      referenceId: inviteAny.reference_id,
      vendorName,
    };
  });

export const submitReview = createServerFn({ method: "POST" })
  .validator((input: {
    token: string;
    overallRating: number;
    comment: string;
    // Dimensional
    foodQualityRating?: number; // Restaurant
    speedRating?: number; // Restaurant
    foodRating?: number; // Caterer
    reliabilityRating?: number; // Caterer
    communicationRating?: number; // Caterer, Planner
    valueRating?: number; // Caterer, Planner
    creativityRating?: number; // Planner
    executionRating?: number; // Planner
  }) => z.object({
    token: z.string(),
    overallRating: z.number().min(1).max(5),
    comment: z.string(),
    foodQualityRating: z.number().min(1).max(5).optional(),
    speedRating: z.number().min(1).max(5).optional(),
    foodRating: z.number().min(1).max(5).optional(),
    reliabilityRating: z.number().min(1).max(5).optional(),
    communicationRating: z.number().min(1).max(5).optional(),
    valueRating: z.number().min(1).max(5).optional(),
    creativityRating: z.number().min(1).max(5).optional(),
    executionRating: z.number().min(1).max(5).optional(),
  }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Validate token
    const { data: invite, error: inviteErr } = await supabaseAdmin
      .from("review_invites")
      .select("*")
      .eq("token", data.token)
      .maybeSingle();

    if (inviteErr || !invite) throw new Error("invalid_token");
    const inviteAny = invite as any;
    if (inviteAny.consumed_at) throw new Error("already_consumed");
    if (new Date(inviteAny.expires_at) < new Date()) throw new Error("expired");

    // Moderation auto-flagging basic check
    const profanityRegex = /fuck|shit|bitch|asshole/i; // Basic placeholder for MVP
    const isFlagged = profanityRegex.test(data.comment) || data.comment.includes("http");
    const status = isFlagged ? "pending_moderation" : "published";

    // Insert logic based on role
    if (inviteAny.role === "restaurant") {
      if (data.comment.length < 10) throw new Error("comment_too_short");

      // Get order to find restaurant_id and check identity
      const { data: order } = await supabaseAdmin.from("restaurant_orders").select("restaurant_id, customer_email").eq("id", inviteAny.reference_id).maybeSingle();
      if (!order) throw new Error("not_eligible");

      const { data: vendor } = await supabaseAdmin.from("restaurants").select("owner_id").eq("id", (order as any).restaurant_id).maybeSingle();
      
      // Self-review conflict check: We check if the customer email matches the vendor owner's email
      if (vendor && (vendor as any).owner_id) {
        const { data: user } = await supabaseAdmin.auth.admin.getUserById((vendor as any).owner_id);
        if (user && user.user?.email === (order as any).customer_email) {
          throw new Error("blocked_self_review");
        }
      }

      // Check for duplicate
      const { data: existing } = await supabaseAdmin.from("restaurant_reviews").select("id").eq("order_id", inviteAny.reference_id).maybeSingle();
      if (existing) throw new Error("duplicate_review");

      const { error: insertErr } = await supabaseAdmin.from("restaurant_reviews").insert({
        restaurant_id: (order as any).restaurant_id,
        order_id: inviteAny.reference_id,
        overall_rating: data.overallRating,
        food_quality_rating: data.foodQualityRating || data.overallRating,
        speed_rating: data.speedRating || data.overallRating,
        comment: data.comment,
        status,
      } as any);
      if (insertErr) throw new Error("insert_failed");

    } else if (inviteAny.role === "caterer") {
      if (data.comment.length < 50) throw new Error("comment_too_short");

      const { data: booking } = await supabaseAdmin.from("catering_bookings").select("caterer_id, customer_id").eq("id", inviteAny.reference_id).maybeSingle();
      if (!booking) throw new Error("not_eligible");

      const { data: vendor } = await supabaseAdmin.from("caterers").select("owner_id").eq("id", (booking as any).caterer_id).maybeSingle();
      
      if (vendor && (vendor as any).owner_id && (vendor as any).owner_id === (booking as any).customer_id) {
         throw new Error("blocked_self_review");
      }

      const { data: existing } = await supabaseAdmin.from("caterer_reviews").select("id").eq("booking_id", inviteAny.reference_id).maybeSingle();
      if (existing) throw new Error("duplicate_review");

      const { error: insertErr } = await supabaseAdmin.from("caterer_reviews").insert({
        caterer_id: (booking as any).caterer_id,
        booking_id: inviteAny.reference_id,
        customer_id: (booking as any).customer_id,
        overall_rating: data.overallRating,
        food_rating: data.foodRating || data.overallRating,
        reliability_rating: data.reliabilityRating || data.overallRating,
        communication_rating: data.communicationRating || data.overallRating,
        value_rating: data.valueRating || data.overallRating,
        comment: data.comment,
        status,
      } as any);
      if (insertErr) throw new Error("insert_failed");

    } else if (inviteAny.role === "planner") {
      if (data.comment.length < 50) throw new Error("comment_too_short");

      const { data: booking } = await supabaseAdmin.from("event_bookings").select("planner_id, customer_id").eq("id", inviteAny.reference_id).maybeSingle();
      if (!booking) throw new Error("not_eligible");

      const { data: vendor } = await supabaseAdmin.from("planners").select("owner_id").eq("id", booking.planner_id).maybeSingle();
      
      if (vendor && (vendor as any).owner_id && (vendor as any).owner_id === booking.customer_id) {
         throw new Error("blocked_self_review");
      }

      const { data: existing } = await supabaseAdmin.from("planner_reviews").select("id").eq("booking_id", inviteAny.reference_id).maybeSingle();
      if (existing) throw new Error("duplicate_review");

      const { error: insertErr } = await supabaseAdmin.from("planner_reviews").insert({
        planner_id: booking.planner_id,
        booking_id: inviteAny.reference_id,
        customer_id: booking.customer_id,
        overall_rating: data.overallRating,
        creativity_rating: data.creativityRating || data.overallRating,
        execution_rating: data.executionRating || data.overallRating,
        communication_rating: data.communicationRating || data.overallRating,
        value_rating: data.valueRating || data.overallRating,
        comment: data.comment,
        status,
      });
      if (insertErr) throw new Error("insert_failed");
    }

    // Atomicity note: While not perfectly atomic without a stored procedure, doing this via service_role 
    // after the DB constraint validation is reasonably safe for MVP. A unique constraint on 
    // the review tables ensures the duplicate_review error covers race conditions.
    
    // Mark consumed
    // @ts-ignore: review_invites table not yet generated in types.ts
    await supabaseAdmin
      .from("review_invites")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", inviteAny.id);

    return { success: true, status };
  });
