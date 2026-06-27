import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/lib/auth/role-middleware";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const BRIEF_STATUSES = [
  "draft",
  "needs_more_info",
  "ready_for_matching",
  "matched",
  "quote_requested",
  "quoted",
  "booked",
  "cancelled",
] as const;
export type BriefStatus = (typeof BRIEF_STATUSES)[number];

async function resolveOwnedCaterer(supabase: any, userId: string) {
  const { data } = await supabase
    .from("caterers")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();
  return data;
}

export const getCatererBriefs = createServerFn({ method: "GET" })
  .middleware([requireRole("caterer")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const caterer = await resolveOwnedCaterer(supabase, userId);
    if (!caterer) return { caterer: null, briefs: [] as any[] };
    const { data, error } = await supabase
      .from("catering_briefs")
      .select(
        "id, status, created_at, event_type, event_date, guest_count, budget_cents, location, notes, milestones, is_b2b, company_name, is_recurring, recurrence_pattern, contract_end_date",
      )
      .eq("preferred_caterer_id", caterer.id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { caterer, briefs: data ?? [] };
  });

export const updateCatererBriefStatus = createServerFn({ method: "POST" })
  .middleware([requireRole("caterer")])
  .inputValidator((input: { briefId: string; status: BriefStatus }) =>
    z
      .object({
        briefId: z.string().uuid(),
        status: z.enum(BRIEF_STATUSES),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const caterer = await resolveOwnedCaterer(supabase, userId);
    if (!caterer) throw new Error("No caterer storefront for this account");
    const { error } = await supabase
      .from("catering_briefs")
      .update({ status: data.status })
      .eq("id", data.briefId)
      .eq("preferred_caterer_id", caterer.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateBriefMilestones = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth()])
  .inputValidator((input: { briefId: string; milestones: any[] }) =>
    z
      .object({
        briefId: z.string().uuid(),
        milestones: z.array(z.any()),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const caterer = await resolveOwnedCaterer(supabase, userId);
    // Planners can also use this, but for now we enforce caterer ownership
    if (!caterer) {
        // Check if planner
        const { data: planner } = await supabase.from("planners").select("id").eq("owner_id", userId).maybeSingle();
        if (!planner) throw new Error("No vendor storefront for this account");
        const { error } = await supabase
          .from("catering_briefs")
          .update({ milestones: data.milestones })
          .eq("id", data.briefId)
          .eq("preferred_planner_id", planner.id);
        if (error) throw new Error(error.message);
        return { ok: true };
    }
    
    const { error } = await supabase
      .from("catering_briefs")
      .update({ milestones: data.milestones })
      .eq("id", data.briefId)
      .eq("preferred_caterer_id", caterer.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const submitCatererProposal = createServerFn({ method: "POST" })
  .middleware([requireRole("caterer")])
  .inputValidator((input: { briefId: string; proposalCents: number; depositCents: number; notes: string }) =>
    z
      .object({
        briefId: z.string().uuid(),
        proposalCents: z.number().min(0),
        depositCents: z.number().min(0),
        notes: z.string(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const caterer = await resolveOwnedCaterer(supabase, userId);
    if (!caterer) throw new Error("No caterer storefront for this account");
    
    // We update budget_cents to the new proposal amount so the customer sees the updated total
    const { error } = await supabase
      .from("catering_briefs")
      .update({ 
        status: "quoted",
        budget_cents: data.proposalCents,
        notes: `[PROPOSAL SENT]\nDeposit Required: €${(data.depositCents / 100).toFixed(2)}\n\nNotes:\n${data.notes}`
      })
      .eq("id", data.briefId)
      .eq("preferred_caterer_id", caterer.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateMyCatererSettings = createServerFn({ method: "POST" })
  .middleware([requireRole("caterer")])
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
      certifications?: string | null;
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
          certifications: z.string().optional().nullable(),
        })
        .parse(input),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("caterers")
      .update(data as any)
      .eq("owner_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getCatererKPIs = createServerFn({ method: "GET" })
  .middleware([requireRole("caterer")])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const caterer = await resolveOwnedCaterer(supabase, userId);
    if (!caterer) return null;

    const { data: briefs, error } = await supabase
      .from("catering_briefs")
      .select("id, status, budget_cents")
      .eq("preferred_caterer_id", caterer.id);

    if (error) throw new Error(error.message);

    const { count: profileViews } = await supabase
      .from("storefront_page_views")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", caterer.id);

    const completed = briefs?.filter((b: any) => b.status === "booked") || [];
    const pending = briefs?.filter((b: any) => !["booked", "cancelled"].includes(b.status)) || [];
    
    const cancelled = briefs?.filter((b: any) => b.status === "cancelled") || [];
    const totalOrders = completed.length;
    const revenueCents = completed.reduce((sum: number, b: any) => sum + (b.budget_cents || 0), 0);
    const averageOrderCents = totalOrders > 0 ? Math.round(revenueCents / totalOrders) : 0;
    const cancelledOrders = cancelled.length;

    // Advanced Business KPIs (Mocked for dashboard layout demonstration)
    const conversionRate = profileViews ? Math.round((briefs!.length / profileViews) * 100) : 0;
    const customerRetentionRate = 45; // e.g. 45% returning corporate clients
    const avgDeliveryTimeMins = 0; // Not applicable for catering (or could be response time)

    return {
      revenueCents,
      totalOrders,
      pendingOrders: pending.length,
      averageOrderCents,
      popularDish: "Corporate Buffet", // Mocked for layout
      isActive: true, // Assuming active by default
      cancelledOrders,
      conversionRate,
      customerRetentionRate,
      avgDeliveryTimeMins,
      profileViews: profileViews || 0
    };
  });

export const createMyCaterer = createServerFn({ method: "POST" })
  .middleware([requireRole("caterer")])
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
      .from("caterers")
      .insert({ owner_id: userId, name: data.name, slug: data.slug, custom_domain: data.custom_domain })
      .select("id, name, slug")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });
