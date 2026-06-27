import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";

export const acceptProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .validator((input: { briefId: string }) =>
    z.object({ briefId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch the brief to see details and preferred partner
    const { data: brief, error: getBriefError } = await supabaseAdmin
      .from("catering_briefs")
      .select("*")
      .eq("id", data.briefId)
      .single();

    if (getBriefError || !brief) {
      throw new Error(getBriefError?.message || "Brief not found");
    }

    if (brief.customer_id !== userId) {
      throw new Error("You are not authorized to accept this proposal");
    }

    if (brief.status !== "quoted") {
      throw new Error("This brief is not in a quoted state and cannot be accepted");
    }

    // Deposit is 10% of the quoted amount (budget_cents)
    const quotedAmountCents = brief.budget_cents || 0;
    const depositAmountCents = Math.round(quotedAmountCents * 0.10); // 10%
    const quotedAmountEuros = quotedAmountCents / 100;
    const depositAmountEuros = depositAmountCents / 100;

    let bookingId: string | null = null;

    if (brief.preferred_caterer_id) {
      // Create catering booking
      const { data: booking, error: bookingError } = await supabaseAdmin
        .from("catering_bookings")
        .insert({
          customer_id: userId,
          caterer_id: brief.preferred_caterer_id,
          brief_id: brief.id,
          event_date: brief.event_date,
          guest_count: brief.guest_count,
          event_type: brief.event_type,
          location: brief.location,
          quoted_amount: quotedAmountEuros,
          deposit_amount: depositAmountEuros,
          booking_status: "awaiting_deposit",
        })
        .select("id")
        .single();

      if (bookingError) throw new Error(bookingError.message);
      bookingId = booking.id;

    } else if (brief.preferred_planner_id) {
      // Create event booking
      const { data: booking, error: bookingError } = await supabaseAdmin
        .from("event_bookings")
        .insert({
          customer_id: userId,
          planner_id: brief.preferred_planner_id,
          brief_id: brief.id,
          event_date: brief.event_date,
          guest_count: brief.guest_count,
          event_type: brief.event_type,
          location: brief.location,
          quoted_amount: quotedAmountEuros,
          deposit_amount: depositAmountEuros,
          booking_status: "awaiting_deposit",
        })
        .select("id")
        .single();

      if (bookingError) throw new Error(bookingError.message);
      bookingId = booking.id;
    } else {
      throw new Error("No preferred caterer or planner assigned to this brief");
    }

    // Transition brief status to booked
    const { error: updateBriefError } = await supabaseAdmin
      .from("catering_briefs")
      .update({ status: "booked" })
      .eq("id", data.briefId);

    if (updateBriefError) throw new Error(updateBriefError.message);

    return { bookingId };
  });

export const getBookingDetails = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth()])
  .validator((input: { bookingId: string }) =>
    z.object({ bookingId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Try fetching from catering_bookings
    const { data: catBooking } = await supabaseAdmin
      .from("catering_bookings")
      .select("*, caterers(name)")
      .eq("id", data.bookingId)
      .eq("customer_id", userId)
      .maybeSingle();

    if (catBooking) {
      return {
        booking: {
          id: catBooking.id,
          type: "catering" as const,
          vendorName: catBooking.caterers?.name || "Caterer",
          eventDate: catBooking.event_date,
          guestCount: catBooking.guest_count,
          eventType: catBooking.event_type,
          location: catBooking.location,
          quotedAmount: catBooking.quoted_amount,
          depositAmount: catBooking.deposit_amount,
          status: catBooking.booking_status,
        }
      };
    }

    // Try fetching from event_bookings
    const { data: eventBooking } = await supabaseAdmin
      .from("event_bookings")
      .select("*, planners(name)")
      .eq("id", data.bookingId)
      .eq("customer_id", userId)
      .maybeSingle();

    if (eventBooking) {
      return {
        booking: {
          id: eventBooking.id,
          type: "planner" as const,
          vendorName: eventBooking.planners?.name || "Event Planner",
          eventDate: eventBooking.event_date,
          guestCount: eventBooking.guest_count,
          eventType: eventBooking.event_type,
          location: eventBooking.location,
          quotedAmount: eventBooking.quoted_amount,
          depositAmount: eventBooking.deposit_amount,
          status: eventBooking.booking_status,
        }
      };
    }

    throw new Error("Booking not found or access denied");
  });

export const startDepositCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .validator((input: { bookingId: string; origin: string }) =>
    z.object({ bookingId: z.string().uuid(), origin: z.string() }).parse(input)
  )
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch the booking from either catering or event bookings
    let bookingDetails: { vendorName: string; depositAmount: number; email: string } | null = null;

    const { data: catBooking } = await supabaseAdmin
      .from("catering_bookings")
      .select("*, caterers(name), customer:profiles(email)")
      .eq("id", data.bookingId)
      .eq("customer_id", userId)
      .maybeSingle();

    if (catBooking) {
      const email = (catBooking as any).customer?.email || "";
      bookingDetails = {
        vendorName: catBooking.caterers?.name || "Caterer",
        depositAmount: Number(catBooking.deposit_amount),
        email,
      };
    } else {
      const { data: eventBooking } = await supabaseAdmin
        .from("event_bookings")
        .select("*, planners(name), customer:profiles(email)")
        .eq("id", data.bookingId)
        .eq("customer_id", userId)
        .maybeSingle();

      if (eventBooking) {
        const email = (eventBooking as any).customer?.email || "";
        bookingDetails = {
          vendorName: eventBooking.planners?.name || "Planner",
          depositAmount: Number(eventBooking.deposit_amount),
          email,
        };
      }
    }

    if (!bookingDetails) {
      throw new Error("Booking not found");
    }

    const { createDepositCheckoutSession } = await import("@/lib/stripe");
    const amountCents = Math.round(bookingDetails.depositAmount * 100);

    const session = await createDepositCheckoutSession(
      data.bookingId,
      amountCents,
      bookingDetails.vendorName,
      bookingDetails.email,
      data.origin
    );

    return { url: session.url };
  });
