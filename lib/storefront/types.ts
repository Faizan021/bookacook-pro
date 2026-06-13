export interface StorefrontSettings {
  id: string;
  caterer_id: string;
  slug: string;
  is_active: boolean;
  min_order_amount: number;
  minimum_order_amount?: number;
  delivery_fee: number;
  estimated_prep_time_minutes: number;
  accepts_pickup: boolean;
  accepts_delivery: boolean;
  pickup_enabled?: boolean;
  delivery_enabled?: boolean;
  description: string | null;
  banner_image_url: string | null;
  hero_image_url?: string;
  display_name?: string;
  headline?: string;
  city?: string;
  postal_code?: string;
  catering_cta_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  caterer_id: string;
  name: string;
  name_de?: string;
  description: string | null;
  description_de?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type StorefrontProduct = Product;

export interface Product {
  id: string;
  caterer_id: string;
  category_id: string;
  name: string;
  name_de?: string;
  description: string | null;
  description_de?: string;
  description_en?: string;
  dietary_tags?: string[];
  service_type: 'instant' | 'catering';
  price: number;
  image_url: string | null;
  is_available: boolean;
  allergen_info: string | null;
  preparation_time_minutes: number | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  caterer_id: string;
  customer_id: string | null;
  source_type: 'direct_storefront' | 'storefront_catering' | 'speisely_marketplace' | 'admin_created';
  order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  service_type: 'pickup' | 'delivery';
  total_amount: number;
  delivery_fee: number;
  notes: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  delivery_address: string | null;
  estimated_ready_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  notes: string | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalPeople: number;
  serviceType: 'pickup' | 'delivery';
  estimatedReadyTime: number;
}

export interface StorefrontData {
  storefront: StorefrontSettings;
  caterer: {
    id: string;
    business_name: string | null;
    logo_url: string | null;
    phone: string | null;
    city: string | null;
    average_rating?: number;
  };
  categories: ProductCategory[];
  products: Product[];
}
