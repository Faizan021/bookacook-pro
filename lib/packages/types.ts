export type PackageStatus = "draft" | "active" | "paused";
export type PackagePriceType = "fixed" | "per_person";

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
  summary: string | null;
  short_summary?: string | null;
  description: string | null;

  category: string | null;
  cuisine_type: string | null;

  status: PackageStatus | null;
  is_active: boolean;
  is_published: boolean;
  featured: boolean | null;

  price_type: PackagePriceType;
  price_amount: number;
  currency: string;

  min_guests: number | null;
  max_guests: number | null;

  event_type: string | null;
  event_types: string[] | null;
  dietary_options: string[] | null;

  included_items: string[] | null;
  includes: string[] | null;
  add_ons: PackageAddOn[] | null;

  service_area: string | null;
  location: string | null;

  setup_time_hours: number | null;
  setup_time_minutes: number | null;
  cleanup_time_minutes: number | null;
  booking_notice_days: number | null;
  max_bookings_per_day: number | null;
  cancellation_policy: string | null;

  image_url: string | null;
  cover_image_url: string | null;
  gallery_images: string[] | null;
  images: PackageImage[] | null;

  tags: string[] | null;
  keywords: string[] | null;

  duration_hours?: number | null;
  deposit_percentage?: number | null;

  created_at: string;
  updated_at: string;
};

export type PackageFormData = {
  title: string;
  summary: string;
  description: string;
  category: string;
  cuisine_type: string;

  status: PackageStatus;
  price_type: PackagePriceType;
  price_amount: number;
  currency: string;

  min_guests: number;
  max_guests: number;

  event_types: string[];
  dietary_options: string[];

  included_items: string[];
  add_ons: PackageAddOn[];

  service_area: string;
  setup_time_hours: number;
  setup_time_minutes: number | null;
  cleanup_time_minutes: number | null;
  booking_notice_days: number;
  max_bookings_per_day: number | null;
  cancellation_policy: string | null;

  images: PackageImage[];
  image_url: string;
  gallery_images: string[];

  tags: string[];
  keywords: string[];
  featured: boolean;
};
