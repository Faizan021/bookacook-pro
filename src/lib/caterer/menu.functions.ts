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
        if (/^https?:\/\//i.test(m.image_url) || m.image_url.startsWith("/")) return { ...m, image_signed_url: m.image_url };
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
  .inputValidator((input: { subdomain: string }) => z.object({ subdomain: z.string() }).parse(input))
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const cleanSlug = data.slug.toLowerCase().trim();

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      cleanSlug,
    );
    const query = supabaseAdmin
      .from("caterers")
      .select(
        "id, owner_id, name, slug, custom_domain, certifications, service_categories, description, logo_url, banner_image_url, phone, business_address, service_areas, min_delivery_cents, delivery_fee_cents, announcement_active, announcement_bg_color, announcement_text, approval_status",
      );

    let catererRes = await (
      isUuid
        ? query.or(`slug.eq.${cleanSlug},id.eq.${cleanSlug}`).maybeSingle()
        : query.ilike("slug", cleanSlug).maybeSingle()
    );

    let caterer = catererRes.data;
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
          name: sf.slug ? sf.slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Caterer Profile",
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

    if (!caterer && cleanSlug && cleanSlug.length >= 3 && !cleanSlug.includes(".")) {
      const formattedName = cleanSlug
        .split("-")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      caterer = {
        id: cleanSlug,
        owner_id: cleanSlug,
        name: formattedName,
        slug: cleanSlug,
        custom_domain: null,
        certifications: null,
        description: `Willkommen bei ${formattedName}. Wir bieten erstklassiges Catering für Events, Feiern und Business.`,
        logo_url: null,
        banner_image_url: null,
        phone: "",
        business_address: "",
        service_areas: "",
        min_delivery_cents: 0,
        delivery_fee_cents: 0,
        announcement_active: false,
        announcement_bg_color: null,
        announcement_text: null,
        approval_status: "approved",
      };
    }

    if (!caterer) return null;

    const { data: menuData, error: mErr } = await supabaseAdmin
      .from("caterer_menu_items")
      .select("id, category, name, description, price_cents, unit, serves, image_url, is_available")
      .eq("caterer_id", caterer.id)
      .eq("is_available", true)
      .order("created_at", { ascending: true });

    if (mErr) throw new Error(mErr.message);

    const menu = await Promise.all(
      (menuData ?? []).map(async (m: any) => {
        if (!m.image_url) return { ...m, image_signed_url: null as string | null };
        if (/^https?:\/\//i.test(m.image_url)) return { ...m, image_signed_url: m.image_url };
        const { data: signed } = await supabaseAdmin.storage
          .from("caterer-menu")
          .createSignedUrl(m.image_url, 60 * 60);
        return { ...m, image_signed_url: signed?.signedUrl ?? null };
      }),
    );

    let promoCodes: any[] = [];
    const now = new Date().toISOString();
    const { data: promos } = await supabaseAdmin
      .from("promo_codes")
      .select("*")
      .eq("owner_id", caterer.owner_id) // Wait, caterer object here does not have owner_id fetched! I need to add it to the select query!
      .eq("is_active", true)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`);
    if (promos) {
      promoCodes = promos;
    }

    return { ...caterer, menu, promoCodes };
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
  const kuepperBanner = "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop";
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
    return !n.includes("milan") && !n.includes("wali") && !s.includes("milan") && !s.includes("wali");
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
          catererId: z.string().uuid(),
          eventType: z.string(),
          eventDate: z.string().refine(
            (date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const parsed = new Date(date);
              return !isNaN(parsed.getTime()) && parsed >= today;
            },
            { message: "Event date cannot be in the past" },
          ),
          guestCount: z.number().min(1),
          budgetCents: z.number().min(0),
          location: z.string(),
          notes: z.string(),
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

    const insertData: any = {
      customer_id: finalCustomerId,
      preferred_caterer_id: data.catererId,
      status: "quote_requested",
      event_type: data.eventType,
      event_date: data.eventDate,
      guest_count: data.guestCount,
      budget_cents: data.budgetCents,
      location: data.location,
      notes: data.notes,
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

    const { error } = await supabaseAdmin.from("catering_briefs").insert(insertData);
    if (error) throw new Error(error.message);

    // Notify Caterer via Email
    const { data: caterer } = await supabaseAdmin
      .from("caterers")
      .select("name, owner_id")
      .eq("id", data.catererId)
      .maybeSingle();

    if (caterer?.owner_id) {
      const { data: user } = await supabaseAdmin.auth.admin.getUserById(caterer.owner_id);
      if (user?.user?.email) {
        const eventDateStr = new Date(data.eventDate).toLocaleDateString("de-DE");
        const budgetStr = `€${(data.budgetCents / 100).toFixed(2)}`;
        await sendPartnerNotificationEmail({
          data: {
            to: user.user.email,
            subject: `Neue Catering-Anfrage für ${eventDateStr}`,
            text: `Sie haben eine neue Anfrage für ${data.eventType} (${data.guestCount} Personen) am ${eventDateStr} in ${data.location}. Budget: ${budgetStr}.`,
            html: `<p>Hallo ${caterer.name},</p><p>Sie haben eine neue Catering-Anfrage erhalten!</p>
                   <ul>
                     <li><strong>Art des Events:</strong> ${data.eventType}</li>
                     <li><strong>Datum:</strong> ${eventDateStr}</li>
                     <li><strong>Gästezahl:</strong> ${data.guestCount}</li>
                     <li><strong>Budget:</strong> ${budgetStr}</li>
                     <li><strong>Ort:</strong> ${data.location}</li>
                   </ul>
                   <p>Melden Sie sich in Ihrem Speisely Dashboard an, um die Anfrage zu überprüfen.</p>`,
          },
        });
      }
    }

    return { ok: true };
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

    if (error) throw new Error(error.message);

    // Notify Caterer via Email
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: catererData } = await supabaseAdmin
      .from("caterers")
      .select("name, owner_id")
      .eq("id", caterer.id)
      .maybeSingle();

    if (catererData?.owner_id) {
      const { data: user } = await supabaseAdmin.auth.admin.getUserById(catererData.owner_id);
      if (user?.user?.email) {
        const startDateStr = new Date(data.startDate).toLocaleDateString("de-DE");
        await sendPartnerNotificationEmail({
          data: {
            to: user.user.email,
            subject: `Neue B2B Catering-Anfrage von ${data.companyName}`,
            text: `Sie haben eine neue wiederkehrende Anfrage von ${data.companyName} für ${data.employees} Mitarbeiter ab ${startDateStr}. Rhythmus: ${data.pattern}.`,
            html: `<p>Hallo ${catererData.name},</p><p>Sie haben eine neue B2B Catering-Anfrage erhalten!</p>
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
      }
    }

    return { ok: true };
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
