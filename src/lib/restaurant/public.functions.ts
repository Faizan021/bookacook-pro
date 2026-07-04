import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";

export const createTableReservation = createServerFn({ method: "POST" })
  .validator(
    (input: {
      restaurantId: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      guestCount: number;
      reservationDate: string;
      reservationTime: string;
      notes?: string;
      locale?: string;
    }) =>
      z
        .object({
          restaurantId: z.string().uuid(),
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          phone: z.string().min(1),
          email: z.string().email(),
          guestCount: z.number().min(1),
          reservationDate: z.string().refine(
            (date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const parsed = new Date(date);
              return !isNaN(parsed.getTime()) && parsed >= today;
            },
            { message: "Reservation date cannot be in the past" },
          ),
          reservationTime: z.string(),
          notes: z.string().optional(),
          locale: z.string().optional(),
        })
        .parse(input),
  )
  .middleware([requireSupabaseAuth()])
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;

    // Standardize time formatting to HH:MM:00 for strict match
    const timeWithSeconds =
      data.reservationTime.includes(":") && data.reservationTime.split(":").length === 2
        ? `${data.reservationTime}:00`
        : data.reservationTime;

    // 1. Fetch restaurant's seat capacity
    const { data: restaurant, error: restError } = await supabaseAdmin
      .from("restaurants")
      .select("seat_capacity")
      .eq("id", data.restaurantId)
      .single();

    if (restError || !restaurant) {
      throw new Error(data.locale === "de" ? "Restaurant nicht gefunden" : "Restaurant not found");
    }

    const seatCapacity = restaurant.seat_capacity ?? 30;

    // 2. Sum confirmed guest counts for this slot (date + time)
    const { data: existingReservations, error: queryError } = await supabaseAdmin
      .from("table_reservations")
      .select("guest_count")
      .eq("restaurant_id", data.restaurantId)
      .eq("reservation_date", data.reservationDate)
      .eq("reservation_time", timeWithSeconds)
      .in("status", ["confirmed", "approved"]);

    if (queryError) {
      throw new Error(queryError.message);
    }

    const totalConfirmedGuests = (existingReservations || []).reduce(
      (sum, r) => sum + r.guest_count,
      0,
    );

    // 3. Verify if capacity allows booking
    if (totalConfirmedGuests + data.guestCount > seatCapacity) {
      throw new Error(
        data.locale === "de"
          ? "Es sind leider nicht genügend Plätze für diesen Zeitraum frei."
          : "Sorry, there are not enough seats available for this time slot.",
      );
    }

    // 4. Auto-accept by inserting directly as "confirmed"
    const { error } = await supabaseAdmin.from("table_reservations").insert({
      restaurant_id: data.restaurantId,
      customer_id: userId,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      email: data.email,
      guest_count: data.guestCount,
      reservation_date: data.reservationDate,
      reservation_time: timeWithSeconds,
      notes: data.notes || null,
      status: "confirmed",
    });

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getRestaurantBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rest, error } = await supabaseAdmin
      .from("restaurants")
      .select(
        "id, name, slug, custom_domain, stripe_connect_status, subscription_status, is_published, certifications",
      )
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return { restaurant: rest };
  });

export const startStorefrontCheckout = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { restaurantId: string; amountCents: number; origin: string; slug: string }) =>
      z
        .object({
          restaurantId: z.string().uuid(),
          amountCents: z.number().int().min(50).max(100000000), // Stripe min limit 50 cents
          origin: z.string(),
          slug: z.string(),
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Fetch restaurant name
    const { data: rest, error: restErr } = await supabaseAdmin
      .from("restaurants")
      .select("name")
      .eq("id", data.restaurantId)
      .single();

    if (restErr || !rest) throw new Error("Restaurant not found");

    // 2. Fetch secure stripe_user_id from the new private secure table
    const { data: stripeAcc, error: stripeErr } = await supabaseAdmin
      .from("restaurant_stripe_accounts")
      .select("stripe_user_id")
      .eq("restaurant_id", data.restaurantId)
      .maybeSingle();

    // Fallback: If not found in private table, try public table (during 2-step migration fallback)
    let stripeUserId = stripeAcc?.stripe_user_id;
    if (!stripeUserId && !stripeErr) {
      const { data: fallbackRest } = await supabaseAdmin
        .from("restaurants")
        .select("stripe_user_id")
        .eq("id", data.restaurantId)
        .single();
      stripeUserId = fallbackRest?.stripe_user_id ?? undefined;
    }

    if (!stripeUserId) {
      throw new Error("This restaurant has not configured card payments yet.");
    }

    const { createStorefrontCheckoutSession } = await import("@/lib/stripe");
    const successUrl = `${data.origin}/restaurant/${data.slug}?order_success=true`;
    const cancelUrl = `${data.origin}/restaurant/${data.slug}?order_cancel=true`;

    const session = await createStorefrontCheckoutSession(
      stripeUserId,
      data.amountCents,
      rest.name,
      successUrl,
      cancelUrl,
    );

    return { url: session.url };
  });
