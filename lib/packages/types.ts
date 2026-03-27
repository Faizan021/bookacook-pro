/**
 * Package types and constants.
 * This file has NO server imports — safe to use in client components.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type PackageStatus = "draft" | "active" | "paused";

export type PackageAddOn = {
  name: string;
  price: number;
};

export type PackageImage = {
  url: string;
  alt: string;
  order: number;
};

/** Full package record as stored in Supabase. */
export type Package = {
  id: string;
  caterer_id: string;

  // Core
  title: string;
  summary: string;
  category: string;
  cuisine_type: string;
  status: PackageStatus;

  // Pricing & capacity
  price_per_person: number;
  min_guests: number;
  max_guests: number;

  // Categorisation
  event_types: string[];
  dietary_options: string[];

  // Inclusions
  included_items: string[];
  add_ons: PackageAddOn[];

  // Logistics
  service_area: string;
  setup_time_hours: number;
  booking_notice_days: number;

  // Media
  images: PackageImage[];
  cover_image_url: string;

  // Discovery
  tags: string[];
  featured: boolean;

  // Description
  description: string;

  // Timestamps
  created_at: string;
  updated_at: string;
};

/** Subset used by the creation / edit form. */
export type PackageFormData = Omit<Package, "id" | "caterer_id" | "created_at" | "updated_at">;

// ─── Constants ────────────────────────────────────────────────────────────────

export const PACKAGE_CATEGORIES = [
  "BBQ & Grill",
  "Fine Dining",
  "Buffet",
  "Cocktail",
  "Street Food",
  "Healthy & Organic",
  "Asian Fusion",
  "Mediterranean",
  "Italian",
  "German",
  "International",
  "Vegan",
  "Seafood",
  "Pastry & Dessert",
  "Other",
] as const;

export const EVENT_TYPES = [
  "wedding",
  "corporate",
  "birthday",
  "private_dinner",
  "team_event",
  "conference",
  "networking",
  "graduation",
  "anniversary",
  "other",
] as const;

export const DIETARY_OPTIONS = [
  "vegan",
  "vegetarian",
  "halal",
  "kosher",
  "gluten_free",
  "nut_free",
  "dairy_free",
  "shellfish_free",
] as const;

export const DEFAULT_PACKAGE_FORM: PackageFormData = {
  title: "",
  summary: "",
  category: "",
  cuisine_type: "",
  status: "draft",
  price_per_person: 0,
  min_guests: 20,
  max_guests: 100,
  event_types: [],
  dietary_options: [],
  included_items: [],
  add_ons: [],
  service_area: "",
  setup_time_hours: 2,
  booking_notice_days: 3,
  images: [],
  cover_image_url: "",
  tags: [],
  featured: false,
  description: "",
};
