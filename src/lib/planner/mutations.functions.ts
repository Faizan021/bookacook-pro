import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/lib/auth/role-middleware";
import { requireSupabaseAuth } from "@/lib/auth/role-middleware";

async function resolveOwnedPlanner(supabase: any, userId: string) {
  const { data } = await supabase
    .from("planners")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();
  return data;
}

export const getMyPlanner = createServerFn({ method: "GET" })
  .middleware([requireRole("planner")])
  .handler(async ({ context }) => {
    const planner = await resolveOwnedPlanner(context.supabase, context.userId);
    return { planner };
  });

export const getMyPlannerServices = createServerFn({ method: "GET" })
  .middleware([requireRole("planner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const planner = await resolveOwnedPlanner(supabase, userId);
    if (!planner) return { planner: null, services: [] as any[] };
    const { data, error } = await supabase
      .from("planner_services")
      .select("id, title, description, starting_price_cents, image_url, is_available, created_at")
      .eq("planner_id", planner.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    // Resolve signed URLs for any image paths stored in image_url
    const services = await Promise.all(
      (data ?? []).map(async (s: any) => {
        if (!s.image_url) return { ...s, image_signed_url: null as string | null };
        if (/^https?:\/\//i.test(s.image_url))
          return { ...s, image_signed_url: s.image_url };
        const { data: signed } = await supabase.storage
          .from("planner-services")
          .createSignedUrl(s.image_url, 60 * 60);
        return { ...s, image_signed_url: signed?.signedUrl ?? null };
      }),
    );
    return { planner, services };
  });

export const createMyPlanner = createServerFn({ method: "POST" })
  .middleware([requireRole("planner")])
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
      .from("planners")
      .insert({ owner_id: userId, name: data.name, slug: data.slug, custom_domain: data.custom_domain })
      .select("id, name, slug")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const upsertPlannerService = createServerFn({ method: "POST" })
  .middleware([requireRole("planner")])
  .inputValidator(
    (input: {
      id?: string;
      title: string;
      description?: string;
      starting_price_cents: number;
      image_url?: string | null;
      is_available?: boolean;
    }) =>
      z
        .object({
          id: z.string().uuid().optional(),
          title: z.string().min(1).max(120),
          description: z.string().max(800).optional(),
          starting_price_cents: z.number().int().min(0).max(1_000_000_00),
          image_url: z.string().max(500).nullable().optional(),
          is_available: z.boolean().optional(),
        })
        .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const planner = await resolveOwnedPlanner(supabase, userId);
    if (!planner) throw new Error("No planner storefront for this account");
    const payload = {
      title: data.title,
      description: data.description ?? null,
      starting_price_cents: data.starting_price_cents,
      image_url: data.image_url ?? null,
      is_available: data.is_available ?? true,
    };
    if (data.id) {
      const { error } = await supabase
        .from("planner_services")
        .update(payload)
        .eq("id", data.id)
        .eq("planner_id", planner.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("planner_services")
        .insert({ ...payload, planner_id: planner.id });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deletePlannerService = createServerFn({ method: "POST" })
  .middleware([requireRole("planner")])
  .inputValidator((input: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const planner = await resolveOwnedPlanner(supabase, userId);
    if (!planner) throw new Error("No planner storefront for this account");
    const { error } = await supabase
      .from("planner_services")
      .delete()
      .eq("id", data.id)
      .eq("planner_id", planner.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateMyPlannerSettings = createServerFn({ method: "POST" })
  .middleware([requireRole("planner")])
  .inputValidator(
    (input: {
      name: string;
      description?: string;
      logo_url?: string;
      banner_image_url?: string;
      phone?: string;
      business_address?: string;
      city?: string;
      postal_code?: string;
      service_areas?: string;
      delivery_fee_cents?: number;
      min_delivery_cents?: number;
      max_delivery_distance_km?: number;
      custom_domain?: string | null;
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
          service_areas: z.string().optional().nullable(),
          delivery_fee_cents: z.number().optional().nullable(),
          min_delivery_cents: z.number().optional().nullable(),
          max_delivery_distance_km: z.number().optional().nullable(),
          custom_domain: z.string().optional().nullable(),
        })
        .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("planners")
      .update(data as any)
      .eq("owner_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getPlannerKPIs = createServerFn({ method: "GET" })
  .middleware([requireRole("planner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const planner = await resolveOwnedPlanner(supabase, userId);
    if (!planner) return null;

    const { data: requests, error } = await (supabase as any)
      .from("planner_requests")
      .select("id, status, budget_cents")
      .eq("planner_id", planner.id);

    if (error) throw new Error(error.message);

    const { count: profileViews } = await supabase
      .from("storefront_page_views")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", planner.id);

    const completed = requests?.filter((r: any) => r.status === "completed") || [];
    const pending = requests?.filter((r: any) => !["completed", "cancelled", "rejected"].includes(r.status)) || [];
    
    const cancelled = requests?.filter((r: any) => ["cancelled", "rejected"].includes(r.status)) || [];
    const totalOrders = completed.length;
    const revenueCents = completed.reduce((sum: number, r: any) => sum + (r.budget_cents || 0), 0);
    const averageOrderCents = totalOrders > 0 ? Math.round(revenueCents / totalOrders) : 0;
    const cancelledOrders = cancelled.length;

    // Advanced Business KPIs (Mocked for dashboard layout demonstration)
    const conversionRate = profileViews ? Math.round((requests!.length / profileViews) * 100) : 0;
    const customerRetentionRate = 22; // e.g. 22% returning clients
    const avgDeliveryTimeMins = 0; // Not applicable for event planner

    return {
      revenueCents,
      totalOrders,
      pendingOrders: pending.length,
      averageOrderCents,
      popularDish: "Full Wedding Package", // Renamed logically
      isActive: true, 
      cancelledOrders,
      conversionRate,
      customerRetentionRate,
      avgDeliveryTimeMins,
      profileViews: profileViews || 0
    };
  });

export const getPlannerRequests = createServerFn({ method: "GET" })
  .middleware([requireRole("planner")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const planner = await resolveOwnedPlanner(supabase, userId);
    if (!planner) return { planner: null, requests: [] as any[] };
    const { data, error } = await supabase
      .from("catering_briefs")
      .select(
        "id, status, created_at, event_type, event_date, guest_count, budget_cents, location, notes, milestones",
      )
      .eq("preferred_planner_id", planner.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { planner, requests: data ?? [] };
  });

export const updatePlannerRequestStatus = createServerFn({ method: "POST" })
  .middleware([requireRole("planner")])
  .inputValidator((input: { requestId: string; status: string }) =>
    z.object({
        requestId: z.string().uuid(),
        status: z.string(),
      }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const planner = await resolveOwnedPlanner(supabase, userId);
    if (!planner) throw new Error("No planner storefront for this account");
    const { error } = await supabase
      .from("catering_briefs")
      .update({ status: data.status })
      .eq("id", data.requestId)
      .eq("preferred_planner_id", planner.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
