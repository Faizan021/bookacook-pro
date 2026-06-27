import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { optionalSupabaseAuth, requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireRole } from "@/lib/auth/role-middleware";

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
      .select("id, category, name, description, price_cents, unit, serves, image_url, is_available, created_at")
      .eq("caterer_id", caterer.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const menu = await Promise.all(
      (data ?? []).map(async (m: any) => {
        if (!m.image_url) return { ...m, image_signed_url: null as string | null };
        if (/^https?:\/\//i.test(m.image_url))
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
  .inputValidator((input: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
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

export const getPublicCatererProfile = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) =>
    z.object({ slug: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: caterer, error: cErr } = await supabaseAdmin
      .from("caterers")
      .select("id, name, slug, custom_domain, certifications, description, logo_url, banner_image_url, phone, business_address, service_areas, min_delivery_cents, delivery_fee_cents, announcement_active, announcement_bg_color, announcement_text")
      .eq("slug", data.slug)
      .maybeSingle();
    
    if (cErr || !caterer) return null;

    const { data: menuData, error: mErr } = await (supabaseAdmin as any)
      .from("caterer_menu_items")
      .select("id, category, name, description, price_cents, unit, serves, image_url, is_available")
      .eq("caterer_id", caterer.id)
      .eq("is_available", true)
      .order("created_at", { ascending: true });

    if (mErr) throw new Error(mErr.message);

    const menu = await Promise.all(
      (menuData ?? []).map(async (m: any) => {
        if (!m.image_url) return { ...m, image_signed_url: null as string | null };
        if (/^https?:\/\//i.test(m.image_url))
          return { ...m, image_signed_url: m.image_url };
        const { data: signed } = await supabaseAdmin.storage
          .from("caterer-menu")
          .createSignedUrl(m.image_url, 60 * 60);
        return { ...m, image_signed_url: signed?.signedUrl ?? null };
      }),
    );

    return { ...caterer, menu };
  });

export const getPublicCatererList = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("caterers")
      .select("id, name, slug, custom_domain, certifications, description, logo_url, banner_image_url, phone, business_address, service_areas, min_delivery_cents, delivery_fee_cents, announcement_active, announcement_bg_color, announcement_text");
    if (error) {
      console.error("Error in getPublicCatererList:", error);
      throw new Error(error.message);
    }
    return data || [];
  });

export const submitCateringBrief = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .inputValidator(
    (input: {
      catererId: string;
      eventType: string;
      eventDate: string;
      guestCount: number;
      budgetCents: number;
      location: string;
      notes: string;
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
          eventDate: z.string(),
          guestCount: z.number().min(1),
          budgetCents: z.number().min(0),
          location: z.string(),
          notes: z.string(),
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
    const { userId } = context as { userId: string };

    const insertData: any = {
      customer_id: userId,
      preferred_caterer_id: data.catererId,
      status: "draft",
      event_type: data.eventType,
      event_date: data.eventDate,
      guest_count: data.guestCount,
      budget_cents: data.budgetCents,
      location: data.location,
      notes: data.notes,
      milestones: [{
        title: "Request Submitted",
        description: "Your catering request has been sent.",
        completed: true,
        date: new Date().toISOString()
      }]
    };

    if (data.isB2b) insertData.is_b2b = data.isB2b;
    if (data.companyName) insertData.company_name = data.companyName;
    if (data.isRecurring) insertData.is_recurring = data.isRecurring;
    if (data.recurrencePattern) insertData.recurrence_pattern = data.recurrencePattern;
    if (data.contractEndDate) insertData.contract_end_date = data.contractEndDate;

    const { error } = await supabaseAdmin.from("catering_briefs").insert(insertData);
    if (error) throw new Error(error.message);

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
    const { data: caterer } = await supabase
      .from("caterers")
      .select("id")
      .eq("slug", data.catererSlug)
      .maybeSingle();

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
      milestones: [{
        title: "B2B Request Submitted",
        description: "Your recurring catering request has been sent.",
        completed: true,
        date: new Date().toISOString()
      }]
    });

    if (error) throw new Error(error.message);
    return { ok: true };
  });
