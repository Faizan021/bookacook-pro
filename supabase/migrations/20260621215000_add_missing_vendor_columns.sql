-- Migration to add missing storefront settings columns to caterers, restaurants, and planners

-- ==================== 1. public.caterers ====================
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS banner_image_url TEXT;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS business_address TEXT;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS delivery_fee_cents INTEGER;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS min_delivery_cents INTEGER;
ALTER TABLE public.caterers ADD COLUMN IF NOT EXISTS max_delivery_distance_km INTEGER;

-- ==================== 2. public.restaurants ====================
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS banner_image_url TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS business_address TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS cuisine_type TEXT;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS delivery_radius_km NUMERIC;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS min_order_amount NUMERIC;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS accepts_pickup BOOLEAN DEFAULT true;
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS accepts_delivery BOOLEAN DEFAULT true;

-- ==================== 3. public.planners ====================
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS banner_image_url TEXT;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS business_address TEXT;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS delivery_fee_cents INTEGER;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS min_delivery_cents INTEGER;
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS max_delivery_distance_km INTEGER;

-- ==================== 4. reload postgrest schema cache ====================
NOTIFY pgrst, 'reload schema';
