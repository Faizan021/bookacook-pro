"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import type { PackageFormData, PackageAddOn, PackageImage } from "./types";

async function getAuthedCaterer() {
  const { user } = await getUserProfile();
  if (!user) return { error: "error.notLoggedIn" as const, catererId: null };

  const supabase = await createClient();
  const { data: caterer } = await supabase
    .from("caterers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!caterer) {
    return { error: "error.catererNotFound" as const, catererId: null };
  }

  return { error: null, catererId: caterer.id as string };
}

function toRow(data: Partial<PackageFormData>) {
  return {
    title: data.title ?? "",
    summary: data.summary ?? "",
    description: data.description ?? "",
    category: data.category ?? "",
    cuisine_type: data.cuisine_type ?? "",
    status: data.status ?? "draft",
    price_amount: data.price_amount ?? 0,
    min_guests: data.min_guests ?? null,
    max_guests: data.max_guests ?? null,
    event_types: data.event_types ?? [],
    dietary_options: data.dietary_options ?? [],
    included_items: data.included_items ?? [],
    add_ons: (data.add_ons ?? []) as PackageAddOn[],
    service_area: data.service_area ?? "",
    setup_time_hours: data.setup_time_hours ?? null,
    setup_time_minutes: data.setup_time_minutes ?? null,
    cleanup_time_minutes: data.cleanup_time_minutes ?? null,
    booking_notice_days: data.booking_notice_days ?? null,
    max_bookings_per_day: data.max_bookings_per_day ?? null,
    cancellation_policy: data.cancellation_policy ?? null,
    images: (data.images ?? []) as PackageImage[],
    image_url: data.image_url ?? null,
    gallery_images: data.gallery_images ?? [],
    tags: data.tags ?? [],
    keywords: data.keywords ?? [],
    featured: data.featured ?? false,
    updated_at: new Date().toISOString(),
  };
}

export async function createPackage(
  data: PackageFormData
): Promise<{ id?: string; error?: string }> {
  const { error: authError, catererId } = await getAuthedCaterer();
  if (authError || !catererId) return { error: authError ?? "error.auth" };

  const supabase = await createClient();

  const { data: pkg, error } = await supabase
    .from("packages")
    .insert({
      ...toRow(data),
      caterer_id: catererId,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: pkg.id };
}

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

export type WizardStep1 = {
  title: string;
  summary?: string | null;
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
  included_items?: string[];
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
      summary: data.summary ?? null,
      description: data.description ?? null,
      event_types: data.event_type ? [data.event_type] : [],
      cuisine_type: data.cuisine_type ?? null,
      status: "draft",
      price_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.title !== undefined) payload.title = data.title;
  if (data.summary !== undefined) payload.summary = data.summary;
  if (data.description !== undefined) payload.description = data.description;
  if (data.event_type !== undefined) payload.event_types = data.event_type ? [data.event_type] : [];
  if (data.cuisine_type !== undefined) payload.cuisine_type = data.cuisine_type;
  if (data.price_amount !== undefined) payload.price_amount = data.price_amount;
  if (data.min_guests !== undefined) payload.min_guests = data.min_guests;
  if (data.max_guests !== undefined) payload.max_guests = data.max_guests;
  if (data.dietary_options !== undefined) payload.dietary_options = data.dietary_options;
  if (data.service_area !== undefined) payload.service_area = data.service_area;
  if (data.included_items !== undefined) payload.included_items = data.included_items;
  if (data.image_url !== undefined) payload.image_url = data.image_url;
  if (data.is_published !== undefined) payload.status = data.is_published ? "active" : "draft";

  const { error } = await supabase
    .from("packages")
    .update(payload)
    .eq("id", packageId);

  if (error) return { error: error.message };
  return {};
}

export async function deletePackage(
  packageId: string
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

  const { error } = await supabase.from("packages").delete().eq("id", packageId);

  if (error) return { error: error.message };
  return {};
}
