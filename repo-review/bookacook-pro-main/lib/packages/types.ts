/**
 * Package types and constants.
 * Safe for client components.
 */

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

export type Package = {
  id: string;
  caterer_id: string;

  title: string;
  summary: string;
  category: string;
  cuisine_type: string;
  status: PackageStatus;

  price_type: "fixed" | "per_person";
  price_amount: number;
  currency: string;

  min_guests: number;
  max_guests: number;

  event_types: string[];
  dietary_options: string[];

  included_items: string[];
  add_ons: PackageAddOn[];

  service_area: string;
  setup_time_hours: number | null;
  setup_time_minutes: number | null;
  cleanup_time_minutes: number | null;
  booking_notice_days: number | null;
  max_bookings_per_day: number | null;
  cancellation_policy: string | null;

  images: PackageImage[];
  image_url: string;
  gallery_images: string[];

  tags: string[];
  keywords: string[];
  featured: boolean;

  description: string;

  created_at: string;
  updated_at: string;
};

export type PackageFormData = Omit<
  Package,
  "id" | "caterer_id" | "created_at" | "updated_at"
>;

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

  price_type: "per_person",
  price_amount: 0,
  currency: "EUR",

  min_guests: 20,
  max_guests: 100,

  event_types: [],
  dietary_options: [],

  included_items: [],
  add_ons: [],

  service_area: "",
  setup_time_hours: 2,
  setup_time_minutes: null,
  cleanup_time_minutes: null,
  booking_notice_days: 3,
  max_bookings_per_day: null,
  cancellation_policy: null,

  images: [],
  image_url: "",
  gallery_images: [],

  tags: [],
  keywords: [],
  featured: false,

  description: "",
};
