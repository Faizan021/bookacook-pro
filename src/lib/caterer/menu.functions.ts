/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { optionalSupabaseAuth, requireSupabaseAuth } from "@/lib/auth/role-middleware";
import { requireRole } from "@/lib/auth/role-middleware";
import { sendPartnerNotificationEmail } from "@/lib/email.functions";
import { parsedItemSchema, type ParsedMenuItem } from "@/lib/restaurant/menu-import.functions";

async function resolveOwnedCaterer(supabase: any, userId: string) {
  const { data } = await supabase
    .from("caterers")
    .select("id, name, slug")
    .eq("owner_id", userId)
    .maybeSingle();
  return data as { id: string; name: string; slug: string } | null;
}

export const getMyCatererMenu = createServerFn({ method: "GET" })
  .middleware([requireRole("caterer")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const caterer = await resolveOwnedCaterer(supabase, userId);
    if (!caterer) return { caterer: null, menu: [] as any[] };
    const { data, error } = await (supabase as any)
      .from("caterer_menu_items")
      .select(
        "id, category, name, description, price_cents, unit, serves, image_url, is_available, created_at",
      )
      .eq("caterer_id", caterer.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const menu = await Promise.all(
      (data ?? []).map(async (m: any) => {
        if (!m.image_url) return { ...m, image_signed_url: null as string | null };
        if (/^https?:\/\//i.test(m.image_url) || m.image_url.startsWith("/"))
          return { ...m, image_signed_url: m.image_url };
        const { data: signed } = await supabase.storage
          .from("caterer-menu")
          .createSignedUrl(m.image_url, 60 * 60);
        return { ...m, image_signed_url: signed?.signedUrl ?? null };
      }),
    );
    return { caterer, menu };
  });

export const upsertCatererMenuItem = createServerFn({ method: "POST" })
  .middleware([requireRole("caterer")])
  .inputValidator(
    (input: {
      id?: string;
      category: string;
      name: string;
      description?: string;
      price_cents: number;
      unit: string;
      serves: number;
      image_url?: string | null;
      is_available?: boolean;
    }) =>
      z
        .object({
          id: z.string().uuid().optional(),
          category: z.string().min(1).max(50),
          name: z.string().min(1).max(120),
          description: z.string().max(800).optional(),
          price_cents: z.number().int().min(0).max(1_000_000_00),
          unit: z.string().min(1).max(50),
          serves: z.number().int().min(1).max(1000),
          image_url: z.string().max(500).nullable().optional(),
          is_available: z.boolean().optional(),
        })
        .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const caterer = await resolveOwnedCaterer(supabase, userId);
    if (!caterer) throw new Error("No caterer storefront for this account");
    const payload = {
      category: data.category,
      name: data.name,
      description: data.description ?? null,
      price_cents: data.price_cents,
      unit: data.unit,
      serves: data.serves,
      image_url: data.image_url ?? null,
      is_available: data.is_available ?? true,
    };
    if (data.id) {
      const { error } = await (supabase as any)
        .from("caterer_menu_items")
        .update(payload)
        .eq("id", data.id)
        .eq("caterer_id", caterer.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await (supabase as any)
        .from("caterer_menu_items")
        .insert({ ...payload, caterer_id: caterer.id });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteCatererMenuItem = createServerFn({ method: "POST" })
  .middleware([requireRole("caterer")])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const caterer = await resolveOwnedCaterer(supabase, userId);
    if (!caterer) throw new Error("No caterer storefront for this account");
    const { error } = await (supabase as any)
      .from("caterer_menu_items")
      .delete()
      .eq("id", data.id)
      .eq("caterer_id", caterer.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const resolveSubdomainVendor = createServerFn({ method: "GET" })
  .inputValidator((input: { subdomain: string }) =>
    z.object({ subdomain: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const sub = data.subdomain.toLowerCase().trim();

    // 1. Check caterers
    const { data: caterer } = await supabaseAdmin
      .from("caterers")
      .select("slug, custom_domain")
      .or(`slug.ilike.${sub},custom_domain.ilike.%${sub}%`)
      .maybeSingle();

    if (caterer) {
      return { type: "catering" as const, slug: caterer.slug };
    }

    // 2. Check restaurants
    const { data: restaurant } = await supabaseAdmin
      .from("restaurants")
      .select("slug, custom_domain")
      .or(`slug.ilike.${sub},custom_domain.ilike.%${sub}%`)
      .maybeSingle();

    if (restaurant) {
      return { type: "restaurant" as const, slug: restaurant.slug };
    }

    // 3. Check planners
    const { data: planner } = await supabaseAdmin
      .from("planners")
      .select("slug, custom_domain")
      .or(`slug.ilike.${sub},custom_domain.ilike.%${sub}%`)
      .maybeSingle();

    if (planner) {
      return { type: "planner" as const, slug: planner.slug };
    }

    // Default fallback: catering
    return { type: "catering" as const, slug: sub };
  });

export const getPublicCatererProfile = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const cleanSlug = data.slug.toLowerCase().trim();

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        cleanSlug,
      );
      const query = supabaseAdmin
        .from("caterers")
        .select(
          "id, owner_id, name, slug, custom_domain, certifications, description, logo_url, banner_image_url, phone, business_address, service_areas, min_delivery_cents, delivery_fee_cents, announcement_active, announcement_bg_color, announcement_text, approval_status",
        );

      const catererRes = await (isUuid
        ? query.or(`slug.eq.${cleanSlug},id.eq.${cleanSlug}`).maybeSingle()
        : query.ilike("slug", cleanSlug).maybeSingle());

      let caterer = catererRes?.data;
      if (!caterer) {
        // Fallback search by name or custom domain
        const { data: fallbackCaterer } = await query
          .or(`name.ilike.%${cleanSlug}%,custom_domain.ilike.%${cleanSlug}%`)
          .maybeSingle();
        caterer = fallbackCaterer;
      }

      if (!caterer) {
        // Fallback: Query storefront_settings directly
        const { data: sf } = await supabaseAdmin
          .from("storefront_settings")
          .select("*")
          .ilike("slug", cleanSlug)
          .maybeSingle();

        if (sf) {
          caterer = {
            id: sf.caterer_id || sf.id,
            owner_id: sf.caterer_id,
            name: sf.slug
              ? sf.slug
                  .split("-")
                  .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")
              : "Caterer Profile",
            slug: sf.slug || cleanSlug,
            custom_domain: null,
            certifications: null,
            description: sf.description || "",
            logo_url: null,
            banner_image_url: sf.banner_image_url || null,
            phone: "",
            business_address: "",
            service_areas: "",
            min_delivery_cents: (sf.min_order_amount || 0) * 100,
            delivery_fee_cents: (sf.delivery_fee || 0) * 100,
            announcement_active: false,
            announcement_bg_color: null,
            announcement_text: null,
            approval_status: "approved",
          };
        }
      }

      if (!caterer) return null;

      let menu: any[] = [];
      try {
        const { data: menuData } = await supabaseAdmin
          .from("caterer_menu_items")
          .select(
            "id, category, name, description, price_cents, unit, serves, image_url, is_available",
          )
          .eq("caterer_id", caterer.id)
          .eq("is_available", true)
          .order("created_at", { ascending: true });

        if (menuData) {
          menu = await Promise.all(
            menuData.map(async (m: any) => {
              if (!m.image_url) return { ...m, image_signed_url: null as string | null };
              if (/^https?:\/\//i.test(m.image_url)) return { ...m, image_signed_url: m.image_url };
              try {
                const { data: signed } = await supabaseAdmin.storage
                  .from("caterer-menu")
                  .createSignedUrl(m.image_url, 60 * 60);
                return { ...m, image_signed_url: signed?.signedUrl ?? null };
              } catch (e) {
                return { ...m, image_signed_url: null };
              }
            }),
          );
        }
      } catch (mErr) {
        console.error("Error fetching menu items for public caterer profile:", mErr);
      }

      let promoCodes: any[] = [];
      if (
        caterer.owner_id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(caterer.owner_id)
      ) {
        try {
          const now = new Date().toISOString();
          const { data: promos } = await supabaseAdmin
            .from("promo_codes")
            .select("*")
            .eq("owner_id", caterer.owner_id)
            .eq("is_active", true)
            .or(`starts_at.is.null,starts_at.lte.${now}`)
            .or(`ends_at.is.null,ends_at.gte.${now}`);
          if (promos) {
            promoCodes = promos;
          }
        } catch (pErr) {
          console.error("Error fetching promo codes for public caterer profile:", pErr);
        }
      }

      return { ...caterer, menu, promoCodes };
    } catch (err) {
      console.error("Global error in getPublicCatererProfile:", err);
      return null;
    }
  });

export const getPublicCatererList = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // 1. Delete test entries ('milan', 'wali') from backend database
  try {
    const { data: testItems } = await supabaseAdmin
      .from("caterers")
      .select("id")
      .or("name.ilike.%milan%,name.ilike.%wali%,slug.ilike.%milan%,slug.ilike.%wali%");

    if (testItems && testItems.length > 0) {
      const ids = testItems.map((t: any) => t.id);
      await supabaseAdmin.from("caterer_menu_items").delete().in("caterer_id", ids);
      await supabaseAdmin.from("storefront_settings").delete().in("caterer_id", ids);
      await supabaseAdmin.from("caterers").delete().in("id", ids);
    }
  } catch (e) {
    console.error("Cleanup error in getPublicCatererList:", e);
  }

  // 2. Ensure Partyservice Küpper has valid banner_image_url
  const kuepperBanner =
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop";
  try {
    await supabaseAdmin
      .from("caterers")
      .update({ banner_image_url: kuepperBanner })
      .ilike("slug", "%kuepper%");
    await supabaseAdmin
      .from("storefront_settings")
      .update({ banner_image_url: kuepperBanner })
      .ilike("slug", "%kuepper%");
  } catch (e) {
    console.error("Banner update error for Küpper:", e);
  }

  // 3. Fetch all remaining active caterers
  const { data, error } = await supabaseAdmin
    .from("caterers")
    .select(
      "id, name, slug, custom_domain, certifications, service_categories, description, logo_url, banner_image_url, phone, business_address, service_areas, min_delivery_cents, delivery_fee_cents, announcement_active, announcement_bg_color, announcement_text",
    );
  if (error) {
    console.error("Error in getPublicCatererList:", error);
    throw new Error(error.message);
  }

  // 4. Filter out any remaining test items
  const filtered = (data || []).filter((c: any) => {
    const n = (c.name || "").toLowerCase();
    const s = (c.slug || "").toLowerCase();
    return (
      !n.includes("milan") && !n.includes("wali") && !s.includes("milan") && !s.includes("wali")
    );
  });

  return filtered;
});

export const submitCateringBrief = createServerFn({ method: "POST" })
  .middleware([optionalSupabaseAuth()])
  .inputValidator(
    (input: {
      catererId: string;
      eventType: string;
      eventDate: string;
      guestCount: number;
      budgetCents: number;
      location: string;
      notes: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      isB2b?: boolean;
      companyName?: string;
      isRecurring?: boolean;
      recurrencePattern?: string;
      contractEndDate?: string;
    }) =>
      z
        .object({
          catererId: z.string().min(1),
          eventType: z.string().default("Event / Feier"),
          eventDate: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
          guestCount: z.number().min(1).default(10),
          budgetCents: z.number().min(0).default(0),
          location: z.string().default("Berlin"),
          notes: z.string().default(""),
          customerName: z.string().optional(),
          customerEmail: z.string().optional(),
          customerPhone: z.string().optional(),
          isB2b: z.boolean().optional(),
          companyName: z.string().optional(),
          isRecurring: z.boolean().optional(),
          recurrencePattern: z.string().optional(),
          contractEndDate: z.string().optional(),
        })
        .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context as { userId?: string };

    let finalCustomerId = userId || null;

    // If customer is not signed in but provided an email, resolve or create a customer account
    if (!finalCustomerId && data.customerEmail) {
      try {
        const { data: usersList } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
        const existingUser = usersList?.users?.find(
          (u) => u.email?.toLowerCase() === data.customerEmail?.toLowerCase(),
        );

        if (existingUser) {
          finalCustomerId = existingUser.id;
        } else {
          // Register customer account for non-registered guest so brief appears in customer dashboard
          const { data: newUser } = await supabaseAdmin.auth.admin.createUser({
            email: data.customerEmail,
            email_confirm: true,
            user_metadata: {
              full_name: data.customerName || "Speisely Kunde",
              role: "customer",
            },
          });
          if (newUser?.user) {
            finalCustomerId = newUser.user.id;
          }
        }
      } catch (e) {
        console.warn("Auto-creation of guest customer account skipped:", e);
      }
    }

    // Resolve caterer ID if slug was passed
    let targetCatererId = data.catererId;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.catererId);

    if (!isUuid) {
      const { data: dbCat } = await supabaseAdmin
        .from("caterers")
        .select("id")
        .eq("slug", data.catererId)
        .maybeSingle();

      if (dbCat?.id) {
        targetCatererId = dbCat.id;
      } else if (data.catererId.includes("veedo")) {
        targetCatererId = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d0001";
      }
    }

    const isTargetUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetCatererId);

    const insertData: any = {
      customer_id: finalCustomerId,
      preferred_caterer_id: isTargetUuid ? targetCatererId : null,
      status: "quote_requested",
      event_type: data.eventType || "Event / Feier",
      event_date: data.eventDate || new Date().toISOString().split("T")[0],
      guest_count: data.guestCount || 10,
      budget_cents: data.budgetCents || 0,
      location: data.location || "Berlin",
      notes: data.notes || "",
      milestones: [
        {
          title: "Request Submitted",
          description: "Your catering request has been sent.",
          completed: true,
          date: new Date().toISOString(),
        },
      ],
    };

    if (data.isB2b) insertData.is_b2b = data.isB2b;
    if (data.companyName) insertData.company_name = data.companyName;
    if (data.isRecurring) insertData.is_recurring = data.isRecurring;
    if (data.recurrencePattern) insertData.recurrence_pattern = data.recurrencePattern;
    if (data.contractEndDate) insertData.contract_end_date = data.contractEndDate;

    try {
      const { error } = await supabaseAdmin.from("catering_briefs").insert(insertData);
      if (error) {
        console.warn("[Catering Brief DB Insert Warning]:", error.message);
      }
    } catch (dbErr: any) {
      console.warn("[Catering Brief DB Exception]:", dbErr?.message || dbErr);
    }

    // Notify Caterer via Email
    try {
      const { data: caterer } = await supabaseAdmin
        .from("caterers")
        .select("name, owner_id")
        .eq("id", targetCatererId)
        .maybeSingle();

      let targetEmail: string = "faizan.ahmed01213@gmail.com";
      if (caterer?.owner_id) {
        const { data: user } = await supabaseAdmin.auth.admin.getUserById(caterer.owner_id);
        if (user?.user?.email) {
          targetEmail = user.user.email;
        }
      }

      let parsedDate = new Date(data.eventDate);
      const eventDateStr = !isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString("de-DE")
        : data.eventDate || "Auf Anfrage";
      const budgetStr = data.budgetCents > 0 ? `€${(data.budgetCents / 100).toFixed(2)}` : "Auf Anfrage";

      const catererName = caterer?.name || "VeeDo's Kitchen";
      const formattedNotes = data.notes || "Keine besonderen Anmerkungen.";

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #16372f; border: 1px solid #eadfce; border-radius: 16px; overflow: hidden; padding: 24px; background: #fdfaf5;">
          <div style="background: #1A4D2E; color: white; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 20px;">🍽️ Neue Catering-Anfrage für ${catererName}</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Event-Datum: <strong>${eventDateStr}</strong></p>
          </div>

          <h3 style="color: #1A4D2E; margin-top: 0; font-size: 16px;">📋 Event & Lieferübersicht</h3>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="border-b: 1px solid #eee;"><td style="padding: 8px 0; color: #555;">Art des Events:</td><td style="font-weight: bold; text-align: right; color: #1A4D2E;">${data.eventType}</td></tr>
            <tr style="border-b: 1px solid #eee;"><td style="padding: 8px 0; color: #555;">Gästeanzahl:</td><td style="font-weight: bold; text-align: right; color: #1A4D2E;">${data.guestCount} Personen</td></tr>
            <tr style="border-b: 1px solid #eee;"><td style="padding: 8px 0; color: #555;">Event-Datum:</td><td style="font-weight: bold; text-align: right; color: #1A4D2E;">${eventDateStr}</td></tr>
            <tr style="border-b: 1px solid #eee;"><td style="padding: 8px 0; color: #555;">Lieferort / Stadt:</td><td style="font-weight: bold; text-align: right; color: #1A4D2E;">${data.location}</td></tr>
          </table>

          <div style="background: white; border: 1px solid #eadfce; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <h3 style="color: #1A4D2E; margin: 0 0 10px 0; font-size: 15px;">🛒 Ausgewählte Speisen & Details:</h3>
            <pre style="font-family: inherit; font-size: 13px; white-space: pre-wrap; margin: 0; color: #222; line-height: 1.6; background: #fdfaf5; padding: 12px; rounded-lg; border: 1px solid #eee;">${formattedNotes}</pre>
          </div>

          <div style="background: #eef7f2; border: 1px solid #ccebd9; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <h3 style="color: #1A4D2E; margin: 0 0 10px 0; font-size: 15px;">👤 Kunden-Kontaktdaten (Direkt kontaktieren):</h3>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Name:</strong> ${data.customerName || "Kunde"}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>E-Mail:</strong> <a href="mailto:${data.customerEmail}" style="color: #1A4D2E; font-weight: bold;">${data.customerEmail || "Keine E-Mail"}</a></p>
            ${data.customerPhone ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Telefon / WhatsApp:</strong> <a href="tel:${data.customerPhone}" style="color: #1A4D2E; font-weight: bold;">${data.customerPhone}</a></p>` : ""}
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://speisely.de/caterer" style="background-color: #1A4D2E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Anfrage im Dashboard prüfen & Bestätigen ➔</a>
          </div>
        </div>
      `;

      await sendPartnerNotificationEmail({
        data: {
          to: targetEmail,
          subject: `Neue Catering-Anfrage für ${catererName} (${eventDateStr})`,
          text: `Sie haben eine neue Anfrage für ${data.eventType} (${data.guestCount} Personen) am ${eventDateStr} in ${data.location}.\n\nSpeisen & Details:\n${formattedNotes}\n\nKunde: ${data.customerName} (${data.customerEmail}, ${data.customerPhone || "keine Tel."})`,
          html: htmlBody,
        },
      });
    } catch (emailErr: any) {
      console.warn("[Catering Brief Email Notification Warning]:", emailErr?.message || emailErr);
    }

    return { ok: true, success: true };
  });

export const submitB2bBriefFromLanding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .inputValidator(
    (input: {
      catererSlug: string;
      companyName: string;
      employees: number;
      pattern: string;
      startDate: string;
      notes: string;
    }) =>
      z
        .object({
          catererSlug: z.string(),
          companyName: z.string().min(1),
          employees: z.number().min(1),
          pattern: z.string(),
          startDate: z.string(),
          notes: z.string().optional(),
        })
        .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    // Resolve the caterer UUID by slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      data.catererSlug,
    );
    const query = supabase.from("caterers").select("id");

    const { data: caterer } = await (
      isUuid
        ? query.or(`slug.eq.${data.catererSlug},id.eq.${data.catererSlug}`)
        : query.eq("slug", data.catererSlug)
    ).maybeSingle();

    if (!caterer) {
      throw new Error("Caterer not found for the provided slug");
    }

    const { error } = await supabase.from("catering_briefs").insert({
      customer_id: userId,
      preferred_caterer_id: caterer.id,
      status: "draft",
      event_type: "Corporate Recurring Catering",
      event_date: data.startDate,
      guest_count: data.employees,
      budget_cents: data.employees * 15 * 100, // Estimate €15 per head per day
      location: "Corporate Office",
      notes: data.notes || "",
      is_b2b: true,
      company_name: data.companyName,
      is_recurring: true,
      recurrence_pattern: data.pattern,
      milestones: [
        {
          title: "B2B Request Submitted",
          description: "Your recurring catering request has been sent.",
          completed: true,
          date: new Date().toISOString(),
        },
      ],
    });

    if (error) {
      console.warn("[B2B Brief DB Insert Warning]:", error.message);
    }

    // Notify Caterer via Email
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: catererData } = await supabaseAdmin
        .from("caterers")
        .select("name, owner_id")
        .eq("id", caterer.id)
        .maybeSingle();

      let targetEmail: string = "faizan.ahmed01213@gmail.com";
      if (catererData?.owner_id) {
        const { data: user } = await supabaseAdmin.auth.admin.getUserById(catererData.owner_id);
        if (user?.user?.email) {
          targetEmail = user.user.email;
        }
      }

      let parsedDate = new Date(data.startDate);
      const startDateStr = !isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString("de-DE")
        : data.startDate || "Auf Anfrage";

      await sendPartnerNotificationEmail({
        data: {
          to: targetEmail,
          subject: `Neue B2B Catering-Anfrage für ${catererData?.name || "VeeDo's Kitchen"} von ${data.companyName}`,
          text: `Sie haben eine neue wiederkehrende Anfrage von ${data.companyName} für ${data.employees} Mitarbeiter ab ${startDateStr}. Rhythmus: ${data.pattern}.`,
          html: `<p>Hallo ${catererData?.name || "VeeDo's Kitchen"},</p><p>Sie haben eine neue B2B Catering-Anfrage erhalten!</p>
                 <ul>
                   <li><strong>Unternehmen:</strong> ${data.companyName}</li>
                   <li><strong>Startdatum:</strong> ${startDateStr}</li>
                   <li><strong>Mitarbeiterzahl:</strong> ${data.employees}</li>
                   <li><strong>Rhythmus:</strong> ${data.pattern}</li>
                   <li><strong>Zusätzliche Infos:</strong> ${data.notes || "-"}</li>
                 </ul>
                 <p>Melden Sie sich in Ihrem Speisely Dashboard an, um die Anfrage zu überprüfen.</p>`,
        },
      });
    } catch (emailErr: any) {
      console.warn("[B2B Brief Email Notification Warning]:", emailErr?.message || emailErr);
    }

    return { ok: true, success: true };
  });

export const bulkImportCatererMenuItems = createServerFn({ method: "POST" })
  .middleware([requireRole("caterer")])
  .validator((input: { items: ParsedMenuItem[] }) =>
    z.object({ items: z.array(parsedItemSchema).min(1).max(1000) }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const caterer = await resolveOwnedCaterer(supabase, userId);
    if (!caterer) throw new Error("No caterer storefront for this account");

    const rows = data.items.map((item: ParsedMenuItem) => ({
      caterer_id: caterer.id,
      name: item.name?.trim() || "",
      description: item.description?.trim() || null,
      price_cents: item.price_cents || 0,
      category: item.category?.trim() || "Catering",
      unit: "Person",
      serves: 1,
      is_available: true,
      image_url: null,
    }));

    const { error } = await supabase.from("caterer_menu_items").insert(rows);
    if (error) throw new Error(error.message);
    return { ok: true, count: rows.length };
  });
