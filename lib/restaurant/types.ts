// ---------------------------------------------------------------------------
// Restaurant module – TypeScript types
// Mirrors the pattern from lib/storefront/types.ts for the caterer system.
// These types map 1:1 to the restaurant_* database tables.
// ---------------------------------------------------------------------------

/** Matches the `restaurants` table. */
export interface Restaurant {
  id: string;
  user_id: string;
  business_name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_image_url: string | null;
  phone: string | null;
  email: string | null;
  business_address: string | null;
  city: string | null;
  postal_code: string | null;
  cuisine_type: string | null;
  is_active: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  opening_hours: Record<string, unknown> | null;
  delivery_radius_km: number | null;
  min_order_amount: number;
  delivery_fee: number;
  accepts_pickup: boolean;
  accepts_delivery: boolean;
  created_at: string;
  updated_at: string;
}

/** Matches the `restaurant_products` table. */
export interface RestaurantProduct {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  dietary_tags: string[];
  allergen_info: string | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/** Matches the `restaurant_orders` table. */
export interface RestaurantOrder {
  id: string;
  restaurant_id: string;
  customer_id: string | null;
  order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  fulfillment_type: 'pickup' | 'delivery';
  subtotal: number;
  delivery_fee: number;
  platform_fee_rate: number;
  platform_fee_amount: number;
  total_amount: number;
  notes: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  delivery_address: string | null;
  requested_time: string | null;
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

/** Matches the `restaurant_order_items` table. */
export interface RestaurantOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Composite / view types used by pages & components
// ---------------------------------------------------------------------------

export interface RestaurantOrderWithItems extends RestaurantOrder {
  items: (RestaurantOrderItem & { product?: RestaurantProduct })[];
}

export interface RestaurantCartItem {
  product: RestaurantProduct;
  quantity: number;
  notes?: string;
}

export interface RestaurantCartSummary {
  items: RestaurantCartItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
  fulfillmentType: 'pickup' | 'delivery';
}

/** All the data needed to render a public restaurant storefront page. */
export interface RestaurantStorefrontData {
  restaurant: Restaurant;
  products: RestaurantProduct[];
}
