"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth/get-user-profile";
import type {
  PackageFormData,
  PackageAddOn,
  PackageImage,
  PackageStatus,
} from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAuthedCaterer() {
  const { user } = await getUserProfile();
  if (!user) return { error: "error.notLoggedIn" as const, catererId: null };

  const supabase = await createClient();
  const { data: caterer, error } = await supabase
    .from("caterers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (error || !caterer) {
    return { error: "error.catererNotFound" as const, catererId: null };
  }

  return { error: null, catererId: caterer.id as string };
}

function normalizeStatus(value?: string | null): PackageStatus {
  if (value === "active" || value === "paused" || value === "draft") {
    return value;
  }
  return "draft";
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function cleanStringArray(values?: string[] | null): string[] {
  return (values ?? []).map((v) => v.trim()).filter(Boolean);
}

function cleanAddOns(values?: PackageAddOn[] | null): PackageAddOn[] {
  return (values ?? [])
    .filter((item) => item && typeof item.name === "string")
    .map((item) => ({
      name: item.name.trim(),
      price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
    }))
    .filter((item) => item.name.length > 0);
}

function cleanImages(values?: PackageImage[] | null): PackageImage[] {
  return (values ?? [])
    .filter((item) => item && typeof item.url === "string")
    .map((item, index) => ({
      url: item.url.trim(),
      alt: (item.alt ?? "").trim(),
      order: typeof item.order === "number" ? item.order : index,
    }))
    .filter((item) => item.url.length > 0);
}

function firstOrNull(values?: string[] | null): string | null {
  const cleaned = cleanStringArray(values);
  return cleaned.length > 0 ? cleaned[0] : null;
}

function statusToCompatFlags(status: PackageStatus) {
  return {
    is_published: status === "active",
    is_active: status !== "paused",
  };
}

function toRow(data: Partial<PackageFormData>) {
  const status = normalizeStatus(data.status);
  const eventTypes = cleanStringArray(data.event_types);
  const includedItems = cleanStringArray(data.included_items);
  const tags = cleanStringArray(data.tags);
  const keywords = cleanStringArray(data.keywords);
  const dietaryOptions = cleanStringArray(data.dietary_options);
  const galleryImages = cleanStringArray(data.gallery_images);
  const addOns = cleanAddOns(data.add_ons);
  const images = cleanImages(data.images);
  const summary = (data.summary ?? "").trim() || null;
  const description = (data.description ?? "").trim() || null;
  const imageUrl = (data.image_url ?? "").trim() || null;

  return {
    title: (data.title ?? "").trim(),
    summary,
    short_summary: summary,

    description,
    category: (data.category ?? "").trim() || null,
    cuisine_type: (data.cuisine_type ?? "").trim() || null,

    status,
    featured: data.featured ?? false,

    price_type: data.price_type ?? "per_person",
    price_amount: Number(data.price_amount ?? 0),
    currency: (data.currency ?? "EUR").trim() || "EUR",

    min_guests: data.min_guests ?? null,
    max_guests: data.max_guests ?? null,

    event_types: eventTypes,
    event_type: firstOrNull(eventTypes),

    dietary_options: dietaryOptions,

    included_items: includedItems,
    includes: includedItems,

    add_ons: addOns,

    service_area: (data.service_area ?? "").trim() || null,
    setup_time_hours: toNullableNumber(data.setup_time_hours),
    setup_time_minutes: data.setup_time_minutes ?? null,
    cleanup_time_minutes: data.cleanup_time_minutes ?? null,
    booking_notice_days: data.booking_notice_days ?? null,
    max_bookings_per_day: data.max_bookings_per_day ?? null,
    cancellation_policy: data.cancellation_policy ?? null,

    images,
    image_url: imageUrl,
    cover_image_url: imageUrl,
    gallery_images: galleryImages,

    tags,
    keywords,

    updated_at: new Date().toISOString(),

    ...statusToCompatFlags(status),
  };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createPackage(
  data: PackageFormData
): Promise<{ id?: string; error?: string }> {
  const { error: authError, catererId } = await getAuthedCaterer();
  if (authError || !catererId) return { error: authError ?? "error.auth" };

  const supabase = await createClient();
  const payload = {
    ...toRow(data),
    caterer_id: catererId,
    created_at: new Date().toISOString(),
  };

  const { data: pkg, error } = await supabase
    .from("packages")
    .insert(payload)
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

  const { data: existing, error: existingError } = await supabase
    .from("packages")
    .select("caterer_id")
    .eq("id", packageId)
    .single();

  if (existingError || !existing) return { error: "error.packageNotFound" };
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
  const { data: original, error: originalError } = await supabase
    .from("packages")
    .select("*")
    .eq("id", packageId)
    .single();

  if (originalError || !original) return { error: "error.packageNotFound" };
  if (original.caterer_id !== catererId) return { error: "error.forbidden" };

  const status: PackageStatus = "draft";
  const now = new Date().toISOString();

  const duplicatePayload = {
    ...original,
    title: `${original.title} (Copy)`,
    status,
    featured: false,
    created_at: now,
    updated_at: now,
    ...statusToCompatFlags(status),
  };

  delete duplicatePayload.id;

  const { data: pkg, error } = await supabase
    .from("packages")
    .insert(duplicatePayload)
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
  service_area?: string[] | null;
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
  const status: PackageStatus = "draft";
  const summary = (data.short_summary ?? "").trim() || null;
  const eventType = (data.event_type ?? "").trim() || null;

  const { data: pkg, error } = await supabase
    .from("packages")
    .insert({
      caterer_id: catererId,
      title: data.title.trim(),
      short_summary: summary,
      summary,
      description: (data.description ?? "").trim() || null,
      event_type: eventType,
      event_types: eventType ? [eventType] : [],
      cuisine_type: (data.cuisine_type ?? "").trim() || null,
      status,
      featured: false,
      price_type: "per_person",
      price_amount: 0,
      currency: "EUR",
      included_items: [],
      includes: [],
      dietary_options: [],
      add_ons: [],
      gallery_images: [],
      tags: [],
      keywords: [],
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...statusToCompatFlags(status),
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

  const { data: existing, error: existingError } = await supabase
    .from("packages")
    .select("caterer_id")
    .eq("id", packageId)
    .single();

  if (existingError || !existing) return { error: "error.packageNotFound" };
  if (existing.caterer_id !== catererId) return { error: "error.forbidden" };

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.title !== undefined) {
    payload.title = data.title.trim();
  }

  if (data.short_summary !== undefined) {
    const summary = (data.short_summary ?? "").trim() || null;
    payload.short_summary = summary;
    payload.summary = summary;
  }

  if (data.description !== undefined) {
    payload.description = (data.description ?? "").trim() || null;
  }

  if (data.event_type !== undefined) {
    const eventType = (data.event_type ?? "").trim() || null;
    payload.event_type = eventType;
    payload.event_types = eventType ? [eventType] : [];
  }

  if (data.cuisine_type !== undefined) {
    payload.cuisine_type = (data.cuisine_type ?? "").trim() || null;
  }

  if (data.price_type !== undefined) {
    payload.price_type = data.price_type;
  }

  if (data.price_amount !== undefined) {
    payload.price_amount = data.price_amount;
  }

  if (data.currency !== undefined) {
    payload.currency = data.currency?.trim() || "EUR";
  }

  if (data.min_guests !== undefined) {
    payload.min_guests = data.min_guests;
  }

  if (data.max_guests !== undefined) {
    payload.max_guests = data.max_guests;
  }

  if (data.dietary_options !== undefined) {
    payload.dietary_options = cleanStringArray(data.dietary_options);
  }

  if (data.service_area !== undefined) {
    payload.service_area = cleanStringArray(data.service_area).join(", ") || null;
  }

  if (data.includes !== undefined) {
    const includes = cleanStringArray(data.includes);
    payload.includes = includes;
    payload.included_items = includes;
  }

  if (data.image_url !== undefined) {
    const imageUrl = (data.image_url ?? "").trim() || null;
    payload.image_url = imageUrl;
    payload.cover_image_url = imageUrl;
  }

  if (data.is_published !== undefined) {
    const status: PackageStatus = data.is_published ? "active" : "draft";
    payload.status = status;
    Object.assign(payload, statusToCompatFlags(status));
  }

  const { error } = await supabase
    .from("packages")
    .update(payload)
    .eq("id", packageId);

  if (error) return { error: error.message };
  return {};
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deletePackage(
  packageId: string
): Promise<{ error?: string }> {
  const { error: authError, catererId } = await getAuthedCaterer();
  if (authError || !catererId) return { error: authError ?? "error.auth" };

  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase
    .from("packages")
    .select("caterer_id")
    .eq("id", packageId)
    .single();

  if (existingError || !existing) return { error: "error.packageNotFound" };
  if (existing.caterer_id !== catererId) return { error: "error.forbidden" };

  const { error } = await supabase.from("packages").delete().eq("id", packageId);
  if (error) return { error: error.message };
  return {};
}
