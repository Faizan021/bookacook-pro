export type StorefrontSettings = {
  id: string;
  caterer_id: string;
  slug: string;
  display_name: string;
  headline: string | null;
  description: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  pickup_enabled: boolean;
  delivery_enabled: boolean;
  catering_cta_enabled: boolean;
  minimum_order_amount: number | null;
  delivery_fee: number | null;
  opening_hours: Record<string, unknown> | null;
  status: string;
};

export type StorefrontCaterer = {
  id: string;
  business_name: string | null;
  city: string | null;
  phone: string | null;
  cuisine_types: string[] | null;
  average_rating: number | null;
  verification_status: string | null;
  storefront_enabled: boolean | null;
  storefront_status: string | null;
  accepts_direct_orders: boolean | null;
  accepts_catering_requests: boolean | null;
};

export type StorefrontCategory = {
  id: string;
  caterer_id: string;
  name_de: string;
  name_en: string | null;
  description_de: string | null;
  description_en: string | null;
  sort_order: number | null;
  is_active: boolean | null;
};

export type StorefrontProduct = {
  id: string;
  caterer_id: string;
  category_id: string | null;
  name_de: string;
  name_en: string | null;
  description_de: string | null;
  description_en: string | null;
  service_type: "instant" | "catering";
  price_type: "fixed" | "per_person" | "quote_based";
  price: number | null;
  min_guests: number | null;
  max_guests: number | null;
  image_url: string | null;
  cuisine_tags: string[] | null;
  dietary_tags: string[] | null;
  allergen_tags: string[] | null;
  available_for_pickup: boolean | null;
  available_for_delivery: boolean | null;
  is_active: boolean | null;
  sort_order: number | null;
};

export type StorefrontData = {
  storefront: StorefrontSettings;
  caterer: StorefrontCaterer;
  categories: StorefrontCategory[];
  products: StorefrontProduct[];
};
