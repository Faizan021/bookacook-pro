/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/lib/auth/role-middleware";

/**
 * Asserts the user's roles array contains `restaurant_owner` as a primary role,
 * NOT via the partner→restaurant_owner legacy expansion in role-middleware.
 * This prevents Caterers and Planners (who also hold `partner`) from calling
 * surplus offer endpoints through the expanded role set.
 */
function assertRestaurantOwnerPrimary(context: any, action: string): void {
  // roles list is populated by requireRole middleware from user_roles table
  const dbRoles: string[] = context.roles ?? [];
  // Check for restaurant_owner directly in the DB-sourced role list.
  // We check user_roles table via context, but we also need to verify the user
  // actually has a restaurant (done in the handler). This double-check prevents
  // caterers who only have 'caterer' + 'partner' from reaching restaurant logic.
  const isDirectRestaurantOwner = dbRoles.includes("restaurant_owner");
  const isCatererOrPlannerOnly =
    (dbRoles.includes("caterer") || dbRoles.includes("planner")) && !isDirectRestaurantOwner;

  if (isCatererOrPlannerOnly) {
    console.warn(
      `[SurplusOffers] AUTH_DENIED action=${action} userId=${context.userId} roles=${dbRoles.join(",")} reason=caterer_or_planner_not_restaurant_owner`,
    );
    throw new Error("Unauthorized: This action is only available to restaurant owners.");
  }
}

// Enforce limits and timing validations on the server
export const createSurplusOffer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      menuItemId: z.string().uuid(),
      surplusPriceCents: z.number().int().positive(),
      initialQuantity: z.number().int().positive(),
      startTime: z.string().datetime(),
      endTime: z.string().datetime(),
      fulfillmentMode: z.enum(["pickup", "delivery_eligible"]),
    }),
  )
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ data: input, context }) => {
    const { supabase, userId } = context;

    // 1a. Explicit vertical isolation — blocks Caterers/Planners with partner expansion
    assertRestaurantOwnerPrimary(context, "createSurplusOffer");

    // 1b. Get the restaurant owned by this user
    const { data: restaurant, error: restErr } = await supabase
      .from("restaurants")
      .select("id, name, operating_hours")
      .eq("owner_id", userId)
      .maybeSingle();

    if (restErr || !restaurant) {
      console.warn(
        `[SurplusOffers] AUTH_DENIED action=createSurplusOffer userId=${userId} reason=no_restaurant_profile`,
      );
      throw new Error("No restaurant profile associated with this account.");
    }

    // 2. Fetch and validate the menu item
    const { data: menuItem, error: itemErr } = await supabase
      .from("restaurant_products")
      .select("id, name, price_cents")
      .eq("id", input.menuItemId)
      .eq("restaurant_id", restaurant.id)
      .maybeSingle();

    if (itemErr || !menuItem) {
      throw new Error("Menu item not found or does not belong to your restaurant.");
    }

    const originalPriceCents = menuItem.price_cents;
    if (input.surplusPriceCents >= originalPriceCents) {
      throw new Error("Surplus price must be lower than the original item price.");
    }

    // Admin limit validations (Dynamic from configuration later, MVP defaults used here)
    const MAX_DISCOUNT_CAP = 0.5; // Max 50% discount cap
    const maxSurplusPriceCents = Math.floor(originalPriceCents * (1 - MAX_DISCOUNT_CAP));
    if (input.surplusPriceCents > maxSurplusPriceCents) {
      throw new Error(`Offer exceeds maximum allowed discount cap of ${MAX_DISCOUNT_CAP * 100}%.`);
    }

    // 3. Time Validation
    const start = new Date(input.startTime);
    const end = new Date(input.endTime);
    const now = new Date();

    if (start.getTime() < now.getTime() - 60000) {
      // 1 min grace buffer for clock skew
      throw new Error("Start time cannot be in the past.");
    }
    if (start.getTime() >= end.getTime()) {
      throw new Error("End time must be after the start time.");
    }

    // 4. Closing Time Validation (must close at least 30 minutes before restaurant closing)
    const endDayName = end.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const hours = (restaurant.operating_hours as any)?.[endDayName];

    if (hours && !hours.closed && hours.close) {
      const [closeHours, closeMinutes] = hours.close.split(":").map(Number);

      const closingTime = new Date(end);
      closingTime.setHours(closeHours, closeMinutes, 0, 0);

      // Subtract 30 minutes
      const cutoffTime = new Date(closingTime.getTime() - 30 * 60000);

      if (end.getTime() > cutoffTime.getTime()) {
        throw new Error(
          `Offers must end at least 30 minutes before restaurant closing time (${hours.close}).`,
        );
      }
    }

    // 5. Call PostgreSQL creation function with advisory locking
    const DAILY_LIMIT = 1;

    const { data: offerId, error: lockErr } = await (supabase as any).rpc(
      "create_surplus_offer_with_lock",
      {
        p_restaurant_id: restaurant.id,
        p_menu_item_id: menuItem.id,
        p_item_name: menuItem.name,
        p_original_price_cents: originalPriceCents,
        p_surplus_price_cents: input.surplusPriceCents,
        p_initial_quantity: input.initialQuantity,
        p_start_time: input.startTime,
        p_end_time: input.endTime,
        p_fulfillment_mode: input.fulfillmentMode,
        p_daily_limit: DAILY_LIMIT,
      },
    );

    if (lockErr) {
      if (lockErr.message?.includes("LOCK_CONFLICT")) {
        console.warn(
          `[SurplusOffers] LOCK_CONFLICT restaurantId=${restaurant.id} userId=${userId}`,
        );
        throw new Error(
          "The system is currently busy processing another offer request for this date. Please try again in a few seconds.",
        );
      }
      if (lockErr.message?.includes("DAILY_LIMIT_REACHED")) {
        console.warn(
          `[SurplusOffers] DAILY_LIMIT_REACHED restaurantId=${restaurant.id} userId=${userId} limit=${DAILY_LIMIT}`,
        );
        throw new Error(
          `Your restaurant has reached the daily limit of ${DAILY_LIMIT} surplus offers for this date.`,
        );
      }
      console.error(
        `[SurplusOffers] RPC_ERROR action=createSurplusOffer restaurantId=${restaurant.id}`,
        lockErr.message,
      );
      throw new Error(lockErr.message);
    }

    console.log(
      `[SurplusOffers] CREATED offerId=${offerId} restaurantId=${restaurant.id} userId=${userId}`,
    );
    return { success: true, offerId };
  });

export const pauseSurplusOffer = createServerFn({ method: "POST" })
  .validator(z.object({ offerId: z.string().uuid() }))
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ data: input, context }) => {
    const { supabase, userId } = context;

    assertRestaurantOwnerPrimary(context, "pauseSurplusOffer");

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (!restaurant) {
      console.warn(
        `[SurplusOffers] AUTH_DENIED action=pauseSurplusOffer userId=${userId} reason=no_restaurant_profile`,
      );
      throw new Error("Unauthorized");
    }

    const { error } = await supabase
      .from("surplus_offers")
      .update({ status: "paused" })
      .eq("id", input.offerId)
      .eq("restaurant_id", restaurant.id)
      .eq("status", "active");

    if (error) throw new Error(error.message);
    console.log(
      `[SurplusOffers] PAUSED offerId=${input.offerId} restaurantId=${restaurant.id} userId=${userId}`,
    );
    return { success: true };
  });

export const resumeSurplusOffer = createServerFn({ method: "POST" })
  .validator(z.object({ offerId: z.string().uuid() }))
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ data: input, context }) => {
    const { supabase, userId } = context;

    assertRestaurantOwnerPrimary(context, "resumeSurplusOffer");

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (!restaurant) {
      console.warn(
        `[SurplusOffers] AUTH_DENIED action=resumeSurplusOffer userId=${userId} reason=no_restaurant_profile`,
      );
      throw new Error("Unauthorized");
    }

    // Can only resume paused offers if the time window is still active
    const { data: offer } = await supabase
      .from("surplus_offers")
      .select("end_time")
      .eq("id", input.offerId)
      .eq("restaurant_id", restaurant.id)
      .eq("status", "paused")
      .maybeSingle();

    if (!offer) throw new Error("Offer not found or not in paused state.");
    if (new Date(offer.end_time).getTime() <= Date.now()) {
      throw new Error("This offer has already expired and cannot be resumed.");
    }

    const { error } = await supabase
      .from("surplus_offers")
      .update({ status: "active" })
      .eq("id", input.offerId);

    if (error) throw new Error(error.message);
    console.log(
      `[SurplusOffers] RESUMED offerId=${input.offerId} restaurantId=${restaurant.id} userId=${userId}`,
    );
    return { success: true };
  });

export const cancelSurplusOffer = createServerFn({ method: "POST" })
  .validator(z.object({ offerId: z.string().uuid() }))
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ data: input, context }) => {
    const { supabase, userId } = context;

    assertRestaurantOwnerPrimary(context, "cancelSurplusOffer");

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (!restaurant) {
      console.warn(
        `[SurplusOffers] AUTH_DENIED action=cancelSurplusOffer userId=${userId} reason=no_restaurant_profile`,
      );
      throw new Error("Unauthorized");
    }

    const { error } = await supabase
      .from("surplus_offers")
      .update({ status: "cancelled" })
      .eq("id", input.offerId)
      .eq("restaurant_id", restaurant.id)
      .in("status", ["draft", "scheduled", "active", "paused"]);

    if (error) throw new Error(error.message);
    console.log(
      `[SurplusOffers] CANCELLED offerId=${input.offerId} restaurantId=${restaurant.id} userId=${userId}`,
    );
    return { success: true };
  });

export const getSurplusOffers = createServerFn({ method: "GET" })
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (!restaurant) return { offers: [] };

    // Fetch and sort surplus offers
    const { data: offers, error } = await supabase
      .from("surplus_offers")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Auto-compute expired statuses if time has passed and state has not transitioned
    const now = Date.now();
    const mapped = (offers || []).map((off: any) => {
      let derivedStatus = off.status;
      if (off.status === "active" && new Date(off.end_time).getTime() <= now) {
        derivedStatus = "expired";
      } else if (off.status === "scheduled" && new Date(off.start_time).getTime() <= now) {
        derivedStatus = "active";
      }
      return {
        ...off,
        status: derivedStatus,
      };
    });

    return { offers: mapped };
  });

// Customer-facing retrieval logic
export const getActiveSurplusOffer = createServerFn({ method: "GET" })
  .validator(z.object({ restaurantId: z.string().uuid() }))
  .handler(async ({ data: input }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Query active offers
    const nowStr = new Date().toISOString();
    const { data: offers, error } = await supabaseAdmin
      .from("surplus_offers")
      .select(
        "id, menu_item_id, item_name, original_price_cents, surplus_price_cents, initial_quantity, current_quantity, start_time, end_time, status, fulfillment_mode",
      )
      .eq("restaurant_id", input.restaurantId)
      .eq("status", "active")
      .lte("start_time", nowStr)
      .gt("end_time", nowStr)
      .gt("current_quantity", 0)
      .order("created_at", { ascending: false });

    if (error || !offers || offers.length === 0) {
      return null;
    }

    // Return the latest active valid offer
    return offers[0];
  });
