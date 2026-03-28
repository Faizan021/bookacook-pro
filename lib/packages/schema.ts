/**
 * Shared Package content model — server-side queries only.
 *
 * Types and constants live in lib/packages/types.ts (no server imports,
 * safe for client components). This file adds the Supabase read functions
 * used by the dashboard and the future public website.
 */

import { createClient } from "@/lib/supabase/server";

// Re-export everything from types so consumers can import from one place
export type {
  Package,
  PackageFormData,
  PackageStatus,
  PackageAddOn,
  PackageImage,
} from "./types";
export {
  PACKAGE_CATEGORIES,
  EVENT_TYPES,
  DIETARY_OPTIONS,
  DEFAULT_PACKAGE_FORM,
} from "./types";

import type { Package } from "./types";

// ─── Dashboard read functions ─────────────────────────────────────────────────

export async function getCatererPackages(catererId: string): Promise<Package[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("caterer_id", catererId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Package[];
  } catch {
    return [];
  }
}

export async function getPackageById(id: string): Promise<Package | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return data as Package;
  } catch {
    return null;
  }
}

// ─── Public / website read functions (used by website phase later) ────────────

export type PublicPackageFilters = {
  category?: string;
  event_type?: string;
  max_price?: number;
  min_guests?: number;
  dietary?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export async function getPublicPackages(filters: PublicPackageFilters = {}): Promise<Package[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("packages").select("*").eq("status", "active");

    if (filters.category) query = query.eq("category", filters.category);
    if (filters.max_price) query = query.lte("price_amount", filters.max_price);
    if (filters.min_guests) query = query.lte("min_guests", filters.min_guests);
    if (filters.search) query = query.ilike("title", `%${filters.search}%`);
    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset) query = query.range(filters.offset, (filters.offset + (filters.limit ?? 20)) - 1);

    const { data, error } = await query.order("featured", { ascending: false }).order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Package[];
  } catch {
    return [];
  }
}

export async function getPublicPackageById(id: string): Promise<Package | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("id", id)
      .eq("status", "active")
      .single();
    if (error || !data) return null;
    return data as Package;
  } catch {
    return null;
  }
}

export async function getFeaturedPackages(limit = 6): Promise<Package[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("status", "active")
      .eq("featured", true)
      .limit(limit)
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Package[];
  } catch {
    return [];
  }
}
