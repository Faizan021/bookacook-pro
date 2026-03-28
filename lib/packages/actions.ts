"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import type { PackageFormData, PackageAddOn, PackageImage } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAuthedCaterer() {
  const { user } = await getUserProfile();
  if (!user) return { error: "error.notLoggedIn" as const, catererId: null };

  const supabase = await createClient();
  const { data: caterer } = await supabase
    .from("caterers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!caterer) return { error: "error.catererNotFound" as const, catererId: null };
  return { error: null, catererId: caterer.id as string };
}

function toRow(data: Partial<PackageFormData>) {
  return {
    title: data.title,
    summary: data.summary,
    description: data.description,
    category: data.category,
    cuisine_type: data.cuisine_type,
    status: data.status,
    price_per_person: data.price_per_person,
    min_guests: data.min_guests,
    max_guests: data.max_guests,
    event_types: data.event_types ?? [],
    dietary_options: data.dietary_options ?? [],
    included_items: data.included_items ?? [],
    add_ons: (data.add_ons ?? []) as PackageAddOn[],
    service_area: data.service_area,
    setup_time_hours: data.setup_time_hours,
    booking_notice_days: data.booking_notice_days,
    images: (data.images ?? []) as PackageImage[],
    cover_image_url: data.cover_image_url,
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    updated_at: new Date().toISOString(),
  };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createPackage(
  data: PackageFormData
): Promise<{ id?: string; error?: string }> {
  const { error: authError, catererId } = await getAuthedCaterer();
  if (authError || !catererId) return { error: authError ?? "error.auth" };

  const supabase = await createClient();
  const { data: pkg, error } = await supabase
    .from("packages")
    .insert({ ...toRow(data), caterer_id: catererId, created_at: new Date().toISOString() })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: pkg.id };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updatePackage(
  packageId: string,
  data: Partial<PackageFormData>
): Promise<{ error?: string }> {
  const { error: authError, catererId } = await getAuthedCaterer();
  if (authError || !catererId) return { error: authError ?? "error.auth" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("packages")
    .select("caterer_id")
    .eq("id", packageId)
    .single();

  if (!existing) return { error: "error.packageNotFound" };
  if (existing.caterer_id !== catererId) return { error: "error.forbidden" };

  const { error } = await supabase
    .from("packages")
    .update(toRow(data))
    .eq("id", packageId);

  if (error) return { error: error.message };
  return {};
}

// ─── Duplicate ────────────────────────────────────────────────────────────────

export async function duplicatePackage(
  packageId: string
): Promise<{ id?: string; error?: string }> {
  const { error: authError, catererId } = await getAuthedCaterer();
  if (authError || !catererId) return { error: authError ?? "error.auth" };

  const supabase = await createClient();
  const { data: original } = await supabase
    .from("packages")
    .select("*")
    .eq("id", packageId)
    .single();

  if (!original) return { error: "error.packageNotFound" };
  if (original.caterer_id !== catererId) return { error: "error.forbidden" };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = original;

  const { data: pkg, error } = await supabase
    .from("packages")
    .insert({
      ...rest,
      title: `${original.title} (Copy)`,
      status: "draft",
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: pkg.id };
}

// ─── Wizard: exact schema actions ─────────────────────────────────────────────

export type WizardStep1 = {
  title: string;
  short_summary?: string | null;
  description?: string | null;
  event_type?: string | null;
  cuisine_type?: string | null;
};

export type WizardStep2 = {
  price_type: "fixed" | "per_person";
  price_amount: number;
  currency?: string;
  min_guests?: number | null;
  max_guests?: number | null;
};

export type WizardStep3 = {
  dietary_options?: string[];
  service_area?: string | null;
  includes?: string[];
  image_url?: string | null;
  is_published?: boolean;
};

export async function createWizardPackage(
  data: WizardStep1
): Promise<{ id?: string; error?: string }> {
  const { error: authError, catererId } = await getAuthedCaterer();
  if (authError || !catererId) return { error: authError ?? "error.auth" };

  const supabase = await createClient();
  const { data: pkg, error } = await supabase
    .from("packages")
    .insert({
      caterer_id: catererId,
      title: data.title,
      short_summary: data.short_summary ?? null,
      description: data.description ?? null,
      event_type: data.event_type ?? null,
      cuisine_type: data.cuisine_type ?? null,
      price_type: "fixed",
      price_amount: 0,
      currency: "EUR",
      is_published: false,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: pkg.id };
}

export async function updateWizardPackage(
  packageId: string,
  data: Partial<WizardStep1 & WizardStep2 & WizardStep3>
): Promise<{ error?: string }> {
  const { error: authError, catererId } = await getAuthedCaterer();
  if (authError || !catererId) return { error: authError ?? "error.auth" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("packages")
    .select("caterer_id")
    .eq("id", packageId)
    .single();

  if (!existing) return { error: "error.packageNotFound" };
  if (existing.caterer_id !== catererId) return { error: "error.forbidden" };

  const { error } = await supabase
    .from("packages")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", packageId);

  if (error) return { error: error.message };
  return {};
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deletePackage(packageId: string): Promise<{ error?: string }> {
  const { error: authError, catererId } = await getAuthedCaterer();
  if (authError || !catererId) return { error: authError ?? "error.auth" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("packages")
    .select("caterer_id")
    .eq("id", packageId)
    .single();

  if (!existing) return { error: "error.packageNotFound" };
  if (existing.caterer_id !== catererId) return { error: "error.forbidden" };

  const { error } = await supabase.from("packages").delete().eq("id", packageId);
  if (error) return { error: error.message };
  return {};
}
