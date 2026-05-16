-- Migration 010: Storefront Core Tables + Stripe Preparation + Caterer Slug

-- 1. Add slug and stripe_account_id to caterers
ALTER TABLE public.caterers
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;

-- 2. Backfill slugs for existing caterers
UPDATE public.caterers
SET slug = lower(regexp_replace(business_name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL AND business_name IS NOT NULL;

-- 3. Create storefront_settings table
CREATE TABLE IF NOT EXISTS public.storefront_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL UNIQUE REFERENCES public.caterers(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  min_order_amount NUMERIC(10,2) DEFAULT 15.00,
  delivery_fee NUMERIC(10,2) DEFAULT 2.50,
  estimated_prep_time_minutes INTEGER DEFAULT 30,
  accepts_pickup BOOLEAN NOT NULL DEFAULT true,
  accepts_delivery BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  banner_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT positive_min_order CHECK (min_order_amount > 0),
  CONSTRAINT positive_delivery_fee CHECK (delivery_fee >= 0)
);

-- 4. Create product_categories
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL CHECK (service_type IN ('instant', 'catering')),
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  allergen_info TEXT,
  preparation_time_minutes INTEGER,
  display_order INTEGER DEFAULT 0,
  stripe_price_id TEXT, -- Stripe Preparation
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT positive_price CHECK (price >= 0)
);

-- 6. Create orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id),
  source TEXT NOT NULL CHECK (
    source IN ('direct_storefront', 'storefront_catering', 'speisely_marketplace', 'admin_created')
  ),
  order_type TEXT NOT NULL DEFAULT 'instant_order' CHECK (
    order_type IN ('instant_order', 'catering_request')
  ),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')
  ),
  service_type TEXT NOT NULL CHECK (service_type IN ('pickup', 'delivery')),
  total_amount NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  delivery_address TEXT,
  estimated_ready_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Create order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.storefront_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active storefront settings" ON public.storefront_settings FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active product categories" ON public.product_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read available products" ON public.products FOR SELECT USING (is_available = true);

-- Caterers manage their own storefront
CREATE POLICY "Caterers manage own storefront settings"
  ON public.storefront_settings FOR ALL
  USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

CREATE POLICY "Caterers manage own product categories"
  ON public.product_categories FOR ALL
  USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

CREATE POLICY "Caterers manage own products"
  ON public.products FOR ALL
  USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));
