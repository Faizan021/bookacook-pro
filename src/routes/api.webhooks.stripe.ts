import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";

// Hard-fail on missing secrets — never fall back to placeholders.
// If these are absent in production, the misconfiguration must surface
// immediately rather than allowing unverified webhook payloads.
function requireWebhookEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[Stripe Webhook] Missing required environment variable: ${name}. ` +
      `Configure this in your Vercel project environment variables.`
    );
  }
  return value;
}

export const Route = createFileRoute("/api/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Require both secrets — throw at startup if either is absent.
        // This means a misconfigured deployment surfaces a 500 error
        // on the first webhook call rather than silently accepting forged events.
        const stripeSecretKey = requireWebhookEnv('STRIPE_SECRET_KEY');
        const endpointSecret = requireWebhookEnv('STRIPE_WEBHOOK_SECRET');

        const stripe = new Stripe(stripeSecretKey, {
          apiVersion: "2025-02-24" as any,
        });

        const signature = request.headers.get("stripe-signature") ?? "";
        const bodyText = await request.text();

        let event: Stripe.Event;

        try {
          // Signature verification is ALWAYS required — no dev bypass.
          // Use `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
          // for local development to get a real STRIPE_WEBHOOK_SECRET.
          event = stripe.webhooks.constructEvent(bodyText, signature, endpointSecret);
        } catch (err: any) {
          console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
          return new Response("Webhook signature verification failed", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        console.log(`[Stripe Webhook Received]: ${event.type}`);

        switch (event.type) {
          // ==================== SUBSCRIPTION EVENTS ====================
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            
            // Handle restaurant subscription checkout
            if (session.metadata?.type === "restaurant_subscription" && session.metadata?.restaurant_id) {
              const restaurantId = session.metadata.restaurant_id;
              const stripeSubscriptionId = session.subscription as string;
              const stripeCustomerId = session.customer as string;

              // Retrieve subscription details from Stripe
              let status = "active";
              let currentPeriodStart = new Date().toISOString();
              let currentPeriodEnd = new Date(Date.now() + 30 * 86400000).toISOString();

              if (stripeSubscriptionId) {
                try {
                  const subDetails = await stripe.subscriptions.retrieve(stripeSubscriptionId);
                  status = subDetails.status;
                  // current_period_start/end are present at runtime on 2025-02-24 API
                  // but the TypeScript types renamed them — cast via any.
                  const sub = subDetails as any;
                  currentPeriodStart = new Date(sub.current_period_start * 1000).toISOString();
                  currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
                } catch (subErr) {
                  console.error("[Stripe Webhook] Error retrieving subscription details:", subErr);
                }
              }

              // 1. Create or update subscription record
              const { error: subError } = await supabaseAdmin
                .from("subscriptions")
                .upsert({
                  restaurant_id: restaurantId,
                  stripe_customer_id: stripeCustomerId,
                  stripe_subscription_id: stripeSubscriptionId,
                  status: status,
                  plan: "starter",
                  current_period_start: currentPeriodStart,
                  current_period_end: currentPeriodEnd,
                }, { onConflict: "restaurant_id" });

              if (subError) {
                console.error("[Stripe Webhook] Error updating subscriptions table:", subError);
                return new Response("Database Error", { status: 500 });
              }

              // 2. Sync subscription status back to restaurant row
              const { error: restError } = await supabaseAdmin
                .from("restaurants")
                .update({
                  subscription_status: status,
                  billing_cycle_start: currentPeriodStart,
                })
                .eq("id", restaurantId);

              if (restError) {
                console.error("[Stripe Webhook] Error updating restaurant subscription status:", restError);
                return new Response("Database Error", { status: 500 });
              }

              console.log(`[Stripe Webhook] Subscription successfully created for restaurant ${restaurantId}`);
            }

            // Handle booking deposit paid via Checkout Session directly
            if (session.metadata?.type === "booking_deposit" && session.metadata?.booking_id) {
              const bookingId = session.metadata.booking_id;
              await confirmBookingDeposit(supabaseAdmin, bookingId, session.payment_intent as string, (session.amount_total || 0) / 100);
            }

            break;
          }

          case "customer.subscription.updated":
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const stripeSubscriptionId = subscription.id;
            const status = subscription.status;
            // current_period_start/end exist at runtime on 2025-02-24 API;
            // TypeScript types renamed them — cast via any.
            const subAny = subscription as any;
            const currentPeriodStart = new Date(subAny.current_period_start * 1000).toISOString();
            const currentPeriodEnd = new Date(subAny.current_period_end * 1000).toISOString();

            // Find the subscription row by stripe_subscription_id
            const { data: subRow, error: subFetchError } = await supabaseAdmin
              .from("subscriptions")
              .select("restaurant_id")
              .eq("stripe_subscription_id", stripeSubscriptionId)
              .maybeSingle();

            if (subFetchError || !subRow || !subRow.restaurant_id) {
              console.warn(`[Stripe Webhook] Subscription ${stripeSubscriptionId} not found in database or missing restaurant_id.`);
              break;
            }

            // 1. Update subscription status
            const { error: subUpdateError } = await supabaseAdmin
              .from("subscriptions")
              .update({
                status: status,
                current_period_start: currentPeriodStart,
                current_period_end: currentPeriodEnd,
                updated_at: new Date().toISOString(),
              })
              .eq("stripe_subscription_id", stripeSubscriptionId);

            if (subUpdateError) {
              console.error("[Stripe Webhook] Error updating subscription:", subUpdateError);
              break;
            }

            // 2. Sync to restaurant row and unpublish storefront if canceled
            const updates: any = {
              subscription_status: status,
            };

            if (status === "canceled") {
              updates.is_published = false; // Hard gate unpublish
            }

            const { error: restUpdateError } = await supabaseAdmin
              .from("restaurants")
              .update(updates)
              .eq("id", subRow.restaurant_id as string);

            if (restUpdateError) {
              console.error("[Stripe Webhook] Error updating restaurant subscription:", restUpdateError);
            }

            console.log(`[Stripe Webhook] Subscription ${stripeSubscriptionId} status updated to ${status}. Restaurant: ${subRow.restaurant_id}`);
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            // invoice.subscription is string | Stripe.Subscription | null in newer types
            const stripeSubscriptionId = (invoice as any).subscription as string | null;

            if (!stripeSubscriptionId) break;

            const { data: subRow } = await supabaseAdmin
              .from("subscriptions")
              .select("restaurant_id")
              .eq("stripe_subscription_id", stripeSubscriptionId)
              .maybeSingle();

            if (subRow?.restaurant_id) {
              // Mark subscription and restaurant as past_due
              await supabaseAdmin
                .from("subscriptions")
                .update({ status: "past_due", updated_at: new Date().toISOString() })
                .eq("stripe_subscription_id", stripeSubscriptionId);

              await supabaseAdmin
                .from("restaurants")
                .update({ subscription_status: "past_due" })
                .eq("id", subRow.restaurant_id as string);

              console.log(`[Stripe Webhook] Invoice payment failed for subscription ${stripeSubscriptionId}. Marked as past_due.`);
            }

            break;
          }

          // ==================== DEPOSIT EVENTS ====================
          case "payment_intent.succeeded": {
            const pi = event.data.object as Stripe.PaymentIntent;

            // Direct payment intent handling (in case Checkout session webhook wasn't handled)
            if (pi.metadata?.type === "booking_deposit" && pi.metadata?.booking_id) {
              const bookingId = pi.metadata.booking_id;
              // pi.amount is always a number; cast payment_intent id (pi.id) directly
              await confirmBookingDeposit(supabaseAdmin, bookingId, pi.id, pi.amount / 100);
            }
            break;
          }

          case "charge.refunded": {
            const charge = event.data.object as Stripe.Charge;
            const piId = charge.payment_intent as string;

            if (!piId) break;

            // Find payment in DB
            const { data: payment, error: pError } = await supabaseAdmin
              .from("payments")
              .select("id, catering_booking_id, event_booking_id")
              .eq("stripe_payment_intent_id", piId)
              .maybeSingle();

            if (pError || !payment) {
              console.warn(`[Stripe Webhook] Refunded payment ${piId} not found in database.`);
              break;
            }

            // Update payment row to refunded
            await supabaseAdmin
              .from("payments")
              .update({ status: "refunded", refund_reason: "Refunded via Stripe dashboard" })
              .eq("id", payment.id);

            // Update booking status to cancelled and log refunded time
            const now = new Date().toISOString();
            if (payment.catering_booking_id) {
              await supabaseAdmin
                .from("catering_bookings")
                .update({
                  booking_status: "cancelled",
                  deposit_refunded_at: now,
                  cancellation_by: "platform",
                  cancellation_reason: "Deposit refunded via Stripe",
                })
                .eq("id", payment.catering_booking_id);
            } else if (payment.event_booking_id) {
              await supabaseAdmin
                .from("event_bookings")
                .update({
                  booking_status: "cancelled",
                  deposit_refunded_at: now,
                  cancellation_by: "platform",
                  cancellation_reason: "Deposit refunded via Stripe",
                })
                .eq("id", payment.event_booking_id);
            }

            console.log(`[Stripe Webhook] Escrow payment ${piId} refunded successfully.`);
            break;
          }

          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        return new Response("OK", { status: 200 });
      },
    },
  },
});

// Helper function to confirm booking deposit and write payments record
async function confirmBookingDeposit(supabaseAdmin: any, bookingId: string, paymentIntentId: string, amountEuros: number) {
  const now = new Date().toISOString();

  // Try checking catering bookings first
  const { data: catBooking } = await supabaseAdmin
    .from("catering_bookings")
    .select("id, booking_status")
    .eq("id", bookingId)
    .maybeSingle();

  if (catBooking) {
    if (catBooking.booking_status === "confirmed") {
      console.log(`[Stripe Webhook] Booking ${bookingId} already confirmed.`);
      return;
    }

    // 1. Update booking
    const { error: bError } = await supabaseAdmin
      .from("catering_bookings")
      .update({
        booking_status: "confirmed",
        deposit_paid_at: now,
      })
      .eq("id", bookingId);

    if (bError) {
      console.error("[Stripe Webhook] Error confirming catering booking:", bError);
      return;
    }

    // 2. Insert payment
    const { error: pError } = await supabaseAdmin
      .from("payments")
      .insert({
        booking_id: bookingId,
        catering_booking_id: bookingId,
        stripe_payment_intent_id: paymentIntentId,
        amount_total: amountEuros,
        platform_fee_amount: amountEuros, // Full deposit amount goes to platform fee (10%)
        currency: "EUR",
        status: "captured",
      });

    if (pError) {
      console.error("[Stripe Webhook] Error creating catering payment record:", pError);
    } else {
      console.log(`[Stripe Webhook] Catering booking ${bookingId} deposit paid and confirmed!`);
    }
    return;
  }

  // Check event bookings
  const { data: eventBooking } = await supabaseAdmin
    .from("event_bookings")
    .select("id, booking_status")
    .eq("id", bookingId)
    .maybeSingle();

  if (eventBooking) {
    if (eventBooking.booking_status === "confirmed") {
      console.log(`[Stripe Webhook] Booking ${bookingId} already confirmed.`);
      return;
    }

    // 1. Update booking
    const { error: bError } = await supabaseAdmin
      .from("event_bookings")
      .update({
        booking_status: "confirmed",
        deposit_paid_at: now,
      })
      .eq("id", bookingId);

    if (bError) {
      console.error("[Stripe Webhook] Error confirming event booking:", bError);
      return;
    }

    // 2. Insert payment
    const { error: pError } = await supabaseAdmin
      .from("payments")
      .insert({
        booking_id: bookingId,
        event_booking_id: bookingId,
        stripe_payment_intent_id: paymentIntentId,
        amount_total: amountEuros,
        platform_fee_amount: amountEuros, // Full deposit amount is the platform fee
        currency: "EUR",
        status: "captured",
      });

    if (pError) {
      console.error("[Stripe Webhook] Error creating event payment record:", pError);
    } else {
      console.log(`[Stripe Webhook] Event booking ${bookingId} deposit paid and confirmed!`);
    }
    return;
  }

  console.error(`[Stripe Webhook] Booking ${bookingId} not found in catering_bookings or event_bookings.`);
}
