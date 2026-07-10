import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";
import { sendPartnerNotificationEmail } from "@/lib/email.functions";
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

    // 1. Fetch restaurant's seat capacity and approval status
    const { data: restaurant, error: restError } = await supabaseAdmin
      .from("restaurants")
      .select("seat_capacity, approval_status, accepts_orders")
      .eq("id", data.restaurantId)
      .single();

    if (restError || !restaurant) {
      throw new Error(data.locale === "de" ? "Restaurant nicht gefunden" : "Restaurant not found");
    }

    if (restaurant.approval_status !== "approved") {
      throw new Error(
        data.locale === "de"
          ? "Dieses Restaurant akzeptiert derzeit keine Reservierungen."
          : "This restaurant is currently not accepting reservations."
      );
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
    } as any);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getRestaurantBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.slug);
    const query = supabaseAdmin
      .from("restaurants")
      .select(
        "id, owner_id, name, slug, custom_domain, stripe_connect_status, subscription_status, is_published, certifications, accepts_cash, accepts_paypal, paypal_email",
      );

    const { data: rest, error } = await (isUuid
      ? query.or(`slug.eq.${data.slug},id.eq.${data.slug}`)
      : query.eq("slug", data.slug)
    ).maybeSingle();

    if (error) throw new Error(error.message);

    let promoCodes: any[] = [];
    if (rest) {
      const now = new Date().toISOString();
      const { data: promos } = await supabaseAdmin
        .from("promo_codes")
        .select("*")
        .eq("owner_id", rest.owner_id)
        .eq("is_active", true)
        .or(`starts_at.is.null,starts_at.lte.${now}`)
        .or(`ends_at.is.null,ends_at.gte.${now}`);
      if (promos) {
        promoCodes = promos;
      }
    }

    return { restaurant: rest, promoCodes };
  });

async function calculatePromoDiscount(
  supabaseAdmin: any,
  ownerId: string,
  promoCode: string | undefined,
  subtotalCents: number,
  validatedItems: Array<{ name: string; price_cents: number; quantity: number }>,
) {
  if (!promoCode) return { discountCents: 0, freeDelivery: false };

  const { data: promo, error: promoErr } = await supabaseAdmin
    .from("promo_codes")
    .select("*")
    .eq("owner_id", ownerId)
    .eq("code", promoCode.toUpperCase())
    .eq("is_active", true)
    .maybeSingle();

  if (!promo) return { discountCents: 0, freeDelivery: false, error: "Invalid code" };

  const now = new Date();
  if (promo.starts_at && new Date(promo.starts_at) > now) {
    return { discountCents: 0, freeDelivery: false, error: "This code is not valid yet" };
  }
  if (promo.ends_at && new Date(promo.ends_at) < now) {
    return { discountCents: 0, freeDelivery: false, error: "This code has expired" };
  }
  if (promo.min_order_value_cents && subtotalCents < promo.min_order_value_cents) {
    return {
      discountCents: 0,
      freeDelivery: false,
      error: `Minimum order value: €${(promo.min_order_value_cents / 100).toFixed(2)}`,
    };
  }

  let discountCents = 0;
  let freeDelivery = false;

  if (promo.discount_type === "percentage" && promo.discount_value) {
    discountCents = Math.round((subtotalCents * promo.discount_value) / 100);
  } else if (promo.discount_type === "fixed" && promo.discount_value) {
    discountCents = promo.discount_value;
  } else if (promo.discount_type === "free_item" && promo.free_item_name) {
    const targetItem = validatedItems.find((i: any) => i.name === promo.free_item_name);
    if (targetItem) {
      discountCents = targetItem.price_cents;
    }
  } else if (promo.discount_type === "free_delivery") {
    freeDelivery = true;
  }

  discountCents = Math.min(discountCents, subtotalCents);

  return { discountCents, freeDelivery, promoData: promo };
}

export const validatePromoCode = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      restaurantId: z.string().uuid(),
      promoCode: z.string(),
      items: z
        .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1) }))
        .min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rest, error: restErr } = await supabaseAdmin
      .from("restaurants")
      .select("owner_id")
      .eq("id", data.restaurantId)
      .single();

    if (restErr || !rest) throw new Error("Restaurant not found");

    const productIds = data.items.map((i) => i.productId);
    const { data: products, error: prodErr } = await supabaseAdmin
      .from("restaurant_products")
      .select("id, price_cents, name")
      .in("id", productIds)
      .eq("restaurant_id", data.restaurantId);

    if (prodErr || !products || products.length === 0) throw new Error("Products not found");

    let subtotalCents = 0;
    const validatedItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Invalid product ID: ${item.productId}`);
      subtotalCents += product.price_cents * item.quantity;
      return { name: product.name, price_cents: product.price_cents, quantity: item.quantity };
    });

    const result = await calculatePromoDiscount(
      supabaseAdmin,
      rest.owner_id,
      data.promoCode,
      subtotalCents,
      validatedItems,
    );
    if (result.error) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      discountCents: result.discountCents,
      freeDelivery: result.freeDelivery,
      code: result.promoData.code,
      discount_type: result.promoData.discount_type,
      discount_value: result.promoData.discount_value,
    };
  });

export const submitStorefrontOrder = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      restaurantId: string;
      slug: string;
      origin: string;
      paymentMethod: "stripe" | "cash" | "paypal";
      orderType: "pickup" | "delivery" | "dine_in";
      items: Array<{ productId: string; quantity: number }>;
      promoCode?: string;
      customerName: string;
      customerPhone: string;
      customerEmail: string;
      deliveryAddress?: string;
      notes?: string;
      marketingConsent?: boolean;
    }) =>
      z
        .object({
          restaurantId: z.string().uuid(),
          slug: z.string(),
          origin: z.string(),
          paymentMethod: z.enum(["stripe", "cash", "paypal"]),
          orderType: z.enum(["pickup", "delivery", "dine_in"]),
          items: z
            .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1) }))
            .min(1),
          promoCode: z.string().optional(),
          customerName: z.string().min(1),
          customerPhone: z.string().min(1),
          customerEmail: z.string().email(),
          deliveryAddress: z.string().optional(),
          notes: z.string().optional(),
          marketingConsent: z.boolean().optional(),
        })
        .refine((data) => data.orderType !== "delivery" || !!data.deliveryAddress, {
          message: "Delivery address is required for delivery orders",
          path: ["deliveryAddress"],
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Fetch restaurant
    const { data: rest, error: restErr } = await supabaseAdmin
      .from("restaurants")
      .select("id, owner_id, name, delivery_fee, paypal_email, approval_status, accepts_orders")
      .eq("id", data.restaurantId)
      .single();

    if (restErr || !rest) throw new Error("Restaurant not found");

    if (rest.approval_status !== "approved") {
      throw new Error("This restaurant storefront is currently under review or inactive.");
    }
    if (rest.accepts_orders === false) {
      throw new Error("We are currently not receiving orders.");
    }

    // 2. Fetch products and calculate subtotal
    const productIds = data.items.map((i) => i.productId);
    const { data: products, error: prodErr } = await supabaseAdmin
      .from("restaurant_products")
      .select("id, price_cents, name")
      .in("id", productIds)
      .eq("restaurant_id", data.restaurantId);

    if (prodErr || !products || products.length === 0)
      throw new Error("Products not found or invalid");

    let subtotalCents = 0;
    const validatedItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Invalid product ID: ${item.productId}`);
      const lineTotal = product.price_cents * item.quantity;
      subtotalCents += lineTotal;
      return {
        product_id: product.id,
        name: product.name,
        price_cents: product.price_cents,
        quantity: item.quantity,
        line_total_cents: lineTotal,
      };
    }); // 3. Apply promo code if present
    const promoResult = await calculatePromoDiscount(
      supabaseAdmin,
      (rest as any).owner_id,
      data.promoCode,
      subtotalCents,
      validatedItems,
    );

    if (data.promoCode && promoResult.error) {
      throw new Error(`Promo code error: ${promoResult.error}`);
    }

    const discountCents = promoResult.discountCents;

    // 4. Calculate delivery fee
    let deliveryFeeCents = 0;
    if (data.orderType === "delivery" && rest.delivery_fee !== null && rest.delivery_fee !== undefined) {
      deliveryFeeCents = Math.round(rest.delivery_fee * 100);
    }
    // If promo is free_delivery, waive fee
    if (promoResult.freeDelivery) {
      deliveryFeeCents = 0;
    }

    const finalTotalCents = subtotalCents - discountCents + deliveryFeeCents;

    // 4.5 Resolve CRM Customer Profile
    let authUserId = null;
    const cleanEmail = data.customerEmail.toLowerCase().trim();

    // Check if customer profile exists in CRM
    const { data: existingProfile } = await supabaseAdmin
      .from("customer_profiles")
      .select("id, auth_user_id")
      .eq("email", cleanEmail)
      .maybeSingle();

    let customerProfileId = null;

    if (existingProfile) {
      customerProfileId = existingProfile.id;
      authUserId = existingProfile.auth_user_id;

      // Update CRM profile details to keep it fresh
      await supabaseAdmin
        .from("customer_profiles")
        .update({
          name: data.customerName,
          phone: data.customerPhone,
        })
        .eq("id", customerProfileId);
    } else {
      // Check if an auth user already exists for this email address
      try {
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const matched = usersData?.users?.find(
          (u) => u.email?.toLowerCase().trim() === cleanEmail,
        );
        if (matched) {
          authUserId = matched.id;
        }
      } catch (err) {
        // ignore list users errors
      }

      // Create new customer profile record
      const { data: newProfile } = await supabaseAdmin
        .from("customer_profiles")
        .insert({
          email: cleanEmail,
          name: data.customerName,
          phone: data.customerPhone,
          auth_user_id: authUserId,
        })
        .select("id")
        .single();

      if (newProfile) {
        customerProfileId = newProfile.id;
      }
    }

    // GDPR Marketing Consent
    if (data.marketingConsent !== undefined) {
      await supabaseAdmin
        .from("user_consents")
        .upsert({
          email: cleanEmail,
          user_id: authUserId || null,
          audience_type: "customer",
          marketing_opt_in: data.marketingConsent,
          source_detail: "storefront_checkout",
        }, { onConflict: "email" });
    }

    // 5. Create Order in DB
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("restaurant_orders")
      .insert({
        restaurant_id: data.restaurantId,
        customer_id: authUserId || null,
        customer_profile_id: customerProfileId || null,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: cleanEmail,
        delivery_address: data.deliveryAddress || null,
        order_type: data.orderType,
        payment_method: data.paymentMethod,
        items: validatedItems as any,
        notes: data.notes || null,
        status: "pending",
        total_cents: finalTotalCents,
        applied_promo_code: data.promoCode ? data.promoCode.toUpperCase() : null,
      } as any)
      .select("id")
      .single();

    if (orderErr) {
      console.error("Order insertion failed:", orderErr);
      throw new Error("Failed to create order: " + orderErr.message);
    }
    if (!order) {
      throw new Error("Failed to create order: no data returned from database");
    }

    // 6. Handle Payment
    if (data.paymentMethod === "stripe") {
      const { data: stripeAcc } = await supabaseAdmin
        .from("restaurant_stripe_accounts")
        .select("stripe_user_id")
        .eq("restaurant_id", data.restaurantId)
        .maybeSingle();

      const stripeUserId = (stripeAcc as any)?.stripe_user_id;
      if (!stripeUserId) throw new Error("This restaurant has not configured card payments yet.");

      const { createStorefrontCheckoutSession } = await import("@/lib/stripe");
      const successUrl = `${data.origin}/restaurant/${data.slug}?order_success=true&claimable=${!authUserId ? "true" : "false"}&email=${encodeURIComponent(cleanEmail)}&name=${encodeURIComponent(data.customerName)}`;
      const cancelUrl = `${data.origin}/restaurant/${data.slug}?order_cancel=true`;

      // Stripe requires amount > 50 cents usually.
      const stripeAmount = Math.max(finalTotalCents, 50);

      const session = await createStorefrontCheckoutSession(
        stripeUserId,
        stripeAmount,
        (rest as any).name,
        successUrl,
        cancelUrl,
        order.id,
      );

      return { 
        orderId: order.id, 
        url: session.url, 
        customerProfileId, 
        accountClaimable: !authUserId 
      };
    } else {
      // Cash / PayPal
      let redirectUrl = null;
      if (data.paymentMethod === "paypal") {
        if (!(rest as any).paypal_email) {
          throw new Error("This restaurant has not configured PayPal payments.");
        }

        const rawPaypal = (rest as any).paypal_email.trim();
        // Restrict to safe PayPal.me patterns
        if (rawPaypal.startsWith("http")) {
          if (!rawPaypal.startsWith("https://paypal.me/")) {
            throw new Error(
              "Invalid PayPal URL configured by merchant. Only paypal.me links are allowed.",
            );
          }
          redirectUrl = rawPaypal;
        } else {
          const cleanHandle = rawPaypal.replace(/^paypal\.me\//i, "").split("/")[0];
          redirectUrl = `https://paypal.me/${cleanHandle}/${(finalTotalCents / 100).toFixed(2)}EUR`;
        }
      }

      // We should ideally leave it as "pending" for the kitchen to accept,
      // or "confirmed" automatically. Let's auto-confirm for now just like reservations do.
      await supabaseAdmin
        .from("restaurant_orders")
        .update({ status: "confirmed" })
        .eq("id", order.id);

      // Notify Restaurant via Email
      const { data: user } = await supabaseAdmin.auth.admin.getUserById((rest as any).owner_id);
      if (user?.user?.email) {
        const totalStr = `€${(finalTotalCents / 100).toFixed(2)}`;
        await sendPartnerNotificationEmail({
          data: {
            to: user.user.email,
            subject: `Neue Bestellung (${data.paymentMethod}) von ${data.customerName}`,
            text: `Sie haben eine neue Bestellung (${data.orderType}) von ${data.customerName} über ${totalStr}. Zahlungsmethode: ${data.paymentMethod}.`,
            html: `<p>Hallo ${(rest as any).name},</p><p>Eine neue Bestellung wurde soeben aufgegeben (Zahlung: ${data.paymentMethod}).</p>
                   <ul>
                     <li><strong>Kunde:</strong> ${data.customerName}</li>
                     <li><strong>Typ:</strong> ${data.orderType}</li>
                     <li><strong>Betrag:</strong> ${totalStr}</li>
                   </ul>
                   <p>Melden Sie sich in Ihrem Dashboard an, um die Bestelldetails zu sehen.</p>`,
          },
        });
      }

      return { 
        orderId: order.id, 
        url: redirectUrl, 
        customerProfileId, 
        accountClaimable: !authUserId 
      };
    }
  });
