"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import type { PackageFormData, PackageAddOn, PackageImage } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAuthedCaterer() {
  const { user } = await getUserProfile();
  if (!user) return { error: "Nicht angemeldet" as const, catererId: null };

  const supabase = await createClient();
  const { data: caterer } = await supabase
    .from("caterers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!caterer) return { error: "Caterer-Profil nicht gefunden" as const, catererId: null };
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
  if (authError || !catererId) return { error: authError ?? "Auth error" };

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
  if (authError || !catererId) return { error: authError ?? "Auth error" };

  const supabase = await createClient();

  // Verify ownership
  const { data: existing } = await supabase
    .from("packages")
    .select("caterer_id")
    .eq("id", packageId)
    .single();

  if (!existing) return { error: "Paket nicht gefunden" };
  if (existing.caterer_id !== catererId) return { error: "Keine Berechtigung" };

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
  if (authError || !catererId) return { error: authError ?? "Auth error" };

  const supabase = await createClient();
  const { data: original } = await supabase
    .from("packages")
    .select("*")
    .eq("id", packageId)
    .single();

  if (!original) return { error: "Paket nicht gefunden" };
  if (original.caterer_id !== catererId) return { error: "Keine Berechtigung" };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = original;

  const { data: pkg, error } = await supabase
    .from("packages")
    .insert({
      ...rest,
      title: `${original.title} (Kopie)`,
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

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deletePackage(packageId: string): Promise<{ error?: string }> {
  const { error: authError, catererId } = await getAuthedCaterer();
  if (authError || !catererId) return { error: authError ?? "Auth error" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("packages")
    .select("caterer_id")
    .eq("id", packageId)
    .single();

  if (!existing) return { error: "Paket nicht gefunden" };
  if (existing.caterer_id !== catererId) return { error: "Keine Berechtigung" };

  const { error } = await supabase.from("packages").delete().eq("id", packageId);
  if (error) return { error: error.message };
  return {};
}
