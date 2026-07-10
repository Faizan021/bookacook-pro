import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/lib/auth/role-middleware";

export const createMyRestaurant = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator((input: { name: string; slug: string; custom_domain: string }) =>
    z
      .object({
        name: z.string().min(2).max(80),
        slug: z
          .string()
          .min(2)
          .max(60)
          .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
        custom_domain: z.string().min(4).max(100),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context as any;
    // Removed implicit role upgrade - user must ALREADY have the role via the middleware.
    const { data: row, error } = await supabase
      .from("restaurants")
      .insert({
        owner_id: userId,
        name: data.name,
        slug: data.slug,
        custom_domain: data.custom_domain,
      })
      .select("id, name, slug")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const upsertRestaurantProduct = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator(
    (input: {
      id?: string;
      name: string;
      description?: string;
      price_cents: number;
      is_available?: boolean;
      category?: string;
      dietary_tags?: string[];
    }) =>
      z
        .object({
          id: z.string().uuid().optional(),
          name: z.string().min(1).max(120),
          description: z.string().max(500).optional(),
          price_cents: z.number().int().min(0).max(10_000_00),
          image_url: z.string().max(500).nullable().optional(),
          is_available: z.boolean().optional(),
          category: z.string().max(120).optional(),
          dietary_tags: z.array(z.string()).optional(),
        })
        .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: r } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();
    if (!r) throw new Error("No restaurant for this account");
    if (data.id) {
      const { error } = await supabase
        .from("restaurant_products")
        .update({
          name: data.name,
          description: data.description ?? null,
          price_cents: data.price_cents,
          image_url: data.image_url ?? null,
          is_available: data.is_available ?? true,
          category: data.category ?? null,
          dietary_tags: data.dietary_tags ?? null,
        } as any)
        .eq("id", data.id)
        .eq("restaurant_id", r.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("restaurant_products").insert({
        restaurant_id: r.id,
        name: data.name,
        description: data.description ?? null,
        price_cents: data.price_cents,
        image_url: data.image_url ?? null,
        is_available: data.is_available ?? true,
        category: data.category ?? null,
        dietary_tags: data.dietary_tags ?? null,
      } as any);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const updateMyRestaurantSettings = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator(
    (input: {
      name: string;
      description?: string;
      logo_url?: string;
      banner_image_url?: string;
      phone?: string;
      business_address?: string;
      city?: string;
      postal_code?: string;
      cuisine_type?: string;
      is_active?: boolean;
      is_published?: boolean;
      delivery_radius_km?: number;
      min_order_amount?: number;
      delivery_fee?: number;
      accepts_pickup?: boolean;
      accepts_delivery?: boolean;
      service_areas?: string;
      operating_hours?: any;
      custom_domain?: string | null;
      seat_capacity?: number | null;
      certifications?: string | null;
      slug?: string;
      accepts_cash?: boolean;
      accepts_paypal?: boolean;
      paypal_email?: string | null;
      accepts_orders?: boolean;
      use_generated_branding?: boolean;
    }) =>
      z
        .object({
          name: z.string().min(2).max(80),
          description: z.string().max(1000).optional(),
          logo_url: z.string().max(500).optional().nullable(),
          banner_image_url: z.string().max(500).optional().nullable(),
          phone: z.string().max(30).optional(),
          business_address: z.string().max(250).optional(),
          city: z.string().max(100).optional(),
          postal_code: z.string().max(20).optional(),
          cuisine_type: z.string().max(100).optional(),
          is_active: z.boolean().optional(),
          is_published: z.boolean().optional(),
          delivery_radius_km: z.number().optional().nullable(),
          min_order_amount: z.number().optional().nullable(),
          delivery_fee: z.number().optional().nullable(),
          accepts_pickup: z.boolean().optional().nullable(),
          accepts_delivery: z.boolean().optional().nullable(),
          service_areas: z.string().optional().nullable(),
          operating_hours: z.any().optional(),
          custom_domain: z.string().max(100).optional().nullable(),
          seat_capacity: z.number().int().min(0).max(5000).optional().nullable(),
          certifications: z.string().max(1000).optional().nullable(),
          slug: z.string().max(100).optional(),
          accepts_cash: z.boolean().optional(),
          accepts_paypal: z.boolean().optional(),
          paypal_email: z.string().max(500).optional().nullable(),
          accepts_orders: z.boolean().optional(),
          use_generated_branding: z.boolean().optional(),
        })
        .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    // Gate publishing: restaurant must have Stripe connected OR at least one
    // alternative payment method (cash or PayPal) so customers can always pay.
    if (data.is_published === true) {
      const { data: rest, error: getRestError } = await supabase
        .from("restaurants")
        .select("id, stripe_connect_status, accepts_cash, accepts_paypal")
        .eq("owner_id", userId)
        .maybeSingle();

      if (getRestError) throw new Error(getRestError.message);

      // Merge incoming values with stored values (user may be toggling right now)
      const cashEnabled = data.accepts_cash ?? (rest as any)?.accepts_cash ?? false;
      const paypalEnabled = data.accepts_paypal ?? (rest as any)?.accepts_paypal ?? false;
      const stripeConnected = rest?.stripe_connect_status === "connected";
      const hasPaymentMethod = cashEnabled || paypalEnabled || stripeConnected;

      if (!rest || !hasPaymentMethod) {
        throw new Error(
          "Please enable at least one payment method (Cash, PayPal, or Stripe) before publishing your storefront.",
        );
      }
    }

    // Check current approval status
    const { data: restStatus } = await supabase
      .from("restaurants")
      .select("approval_status")
      .eq("owner_id", userId)
      .maybeSingle();

    const updatePayload: any = { ...data };
    if (restStatus?.approval_status === "rejected") {
      updatePayload.approval_status = "pending";
      updatePayload.rejection_reason = null;
      console.log(`[Review Queue] Resetting rejected restaurant status back to pending due to profile update for owner=${userId}`);
    }

    const { error } = await supabase
      .from("restaurants")
      .update(updatePayload)
      .eq("owner_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getStripeConnectUrl = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator((input: { slug: string; origin: string }) =>
    z.object({ slug: z.string(), origin: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { getConnectOAuthUrl } = await import("@/lib/stripe");
    const url = getConnectOAuthUrl(data.slug, data.origin);
    return { url };
  });

export const disconnectStripe = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // 1. Fetch restaurant details
    const { data: rest, error: fetchError } = await supabase
      .from("restaurants")
      .select("id, accepts_cash, accepts_paypal, is_published")
      .eq("owner_id", userId)
      .maybeSingle();

    if (fetchError || !rest) {
      throw new Error(fetchError?.message || "Restaurant not found");
    }

    // 2. Delete the private Stripe account entry
    const { error: deleteError } = await supabase
      .from("restaurant_stripe_accounts")
      .delete()
      .eq("restaurant_id", rest.id);

    if (deleteError) {
      throw new Error("Failed to delete Stripe account entry: " + deleteError.message);
    }

    // 3. Update the restaurant status
    const hasAlternative = !!((rest as any).accepts_cash || (rest as any).accepts_paypal);
    const { error: updateError } = await supabase
      .from("restaurants")
      .update({
        stripe_connect_status: "deauthorized",
        stripe_connected_at: null,
        is_published: hasAlternative ? rest.is_published : false,
      })
      .eq("owner_id", userId);

    if (updateError) throw new Error(updateError.message);
    return { ok: true };
  });

export const startStarterSubscription = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator((input: { origin: string }) => z.object({ origin: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: rest, error: restErr } = await supabase
      .from("restaurants")
      .select("id, name")
      .eq("owner_id", userId)
      .maybeSingle();

    if (restErr || !rest) {
      throw new Error(restErr?.message || "No restaurant found for this account");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const email = user?.email || "";

    const { createSubscriptionCheckoutSession } = await import("@/lib/stripe");
    const session = await createSubscriptionCheckoutSession(rest.id, rest.name, email, data.origin);

    return { url: session.url };
  });

export const openBillingPortal = createServerFn({ method: "POST" })
  .middleware([requireRole("restaurant_owner")])
  .validator((input: { origin: string }) => z.object({ origin: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: rest } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (!rest) throw new Error("No restaurant storefront found");

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("restaurant_id", rest.id)
      .maybeSingle();

    if (!sub || !sub.stripe_customer_id) {
      throw new Error("No active subscription billing portal is available. Start a plan first.");
    }

    const { createBillingPortalSession } = await import("@/lib/stripe");
    const session = await createBillingPortalSession(sub.stripe_customer_id, data.origin);

    return { url: session.url };
  });
