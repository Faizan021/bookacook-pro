-- Migration 010: Speisely storefront + direct orders + catering source tracking
-- Purpose: Add the MVP backend foundation for restaurant storefronts like /r/[slug]
-- Safe to run multiple times in Supabase SQL Editor.

-- ─────────────────────────────────────────────────────────────
-- 1) Extend caterers for storefront/public ordering
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.caterers
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS storefront_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS storefront_status TEXT NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS storefront_theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS storefront_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS accepts_direct_orders BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS accepts_catering_requests BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.caterers
  DROP CONSTRAINT IF EXISTS caterers_storefront_status_check;

ALTER TABLE public.caterers
  ADD CONSTRAINT caterers_storefront_status_check
    CHECK (storefront_status IN ('draft', 'published', 'paused'));

-- ─────────────────────────────────────────────────────────────
-- 2) Storefront settings
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.storefront_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  headline TEXT,
  description TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  pickup_enabled BOOLEAN NOT NULL DEFAULT true,
  delivery_enabled BOOLEAN NOT NULL DEFAULT false,
  catering_cta_enabled BOOLEAN NOT NULL DEFAULT true,
  minimum_order_amount NUMERIC(10,2) DEFAULT 0,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  opening_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT storefront_settings_status_check CHECK (status IN ('draft', 'published', 'paused'))
);

CREATE INDEX IF NOT EXISTS idx_storefront_settings_caterer_id ON public.storefront_settings(caterer_id);
CREATE INDEX IF NOT EXISTS idx_storefront_settings_slug ON public.storefront_settings(slug);
CREATE INDEX IF NOT EXISTS idx_storefront_settings_status ON public.storefront_settings(status);

-- ─────────────────────────────────────────────────────────────
-- 3) Menu/product catalogue for restaurant storefronts
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  name_de TEXT NOT NULL,
  name_en TEXT,
  description_de TEXT,
  description_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_categories_caterer_id ON public.product_categories(caterer_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_active ON public.product_categories(is_active);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,

  name_de TEXT NOT NULL,
  name_en TEXT,
  description_de TEXT,
  description_en TEXT,

  service_type TEXT NOT NULL DEFAULT 'instant',
  price_type TEXT NOT NULL DEFAULT 'fixed',
  price NUMERIC(10,2),
  min_guests INTEGER,
  max_guests INTEGER,

  image_url TEXT,
  gallery_urls TEXT[] NOT NULL DEFAULT '{}',
  cuisine_tags TEXT[] NOT NULL DEFAULT '{}',
  dietary_tags TEXT[] NOT NULL DEFAULT '{}',
  allergen_tags TEXT[] NOT NULL DEFAULT '{}',

  available_for_pickup BOOLEAN NOT NULL DEFAULT true,
  available_for_delivery BOOLEAN NOT NULL DEFAULT false,
  available_for_marketplace BOOLEAN NOT NULL DEFAULT true,

  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT products_service_type_check CHECK (service_type IN ('instant', 'catering')),
  CONSTRAINT products_price_type_check CHECK (price_type IN ('fixed', 'per_person', 'quote_based'))
);

CREATE INDEX IF NOT EXISTS idx_products_caterer_id ON public.products(caterer_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_service_type ON public.products(service_type);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_cuisine_tags ON public.products USING gin(cuisine_tags);
CREATE INDEX IF NOT EXISTS idx_products_dietary_tags ON public.products USING gin(dietary_tags);

-- ─────────────────────────────────────────────────────────────
-- 4) Direct storefront orders
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  source TEXT NOT NULL DEFAULT 'direct_storefront',
  order_type TEXT NOT NULL DEFAULT 'instant_order',
  status TEXT NOT NULL DEFAULT 'pending',

  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,

  fulfillment_type TEXT NOT NULL DEFAULT 'pickup',
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_postal_code TEXT,
  requested_time TIMESTAMPTZ,
  notes TEXT,

  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_fee_rate NUMERIC(5,2) NOT NULL DEFAULT 3.00,
  platform_fee_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,

  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT orders_source_check CHECK (source IN ('direct_storefront', 'storefront_catering', 'speisely_marketplace', 'admin_created')),
  CONSTRAINT orders_order_type_check CHECK (order_type IN ('instant_order', 'catering_order')),
  CONSTRAINT orders_status_check CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled', 'refunded')),
  CONSTRAINT orders_fulfillment_type_check CHECK (fulfillment_type IN ('pickup', 'delivery')),
  CONSTRAINT orders_payment_status_check CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded'))
);

CREATE INDEX IF NOT EXISTS idx_orders_caterer_id ON public.orders(caterer_id);
CREATE INDEX IF NOT EXISTS idx_orders_source ON public.orders(source);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  modifiers JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT order_items_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ─────────────────────────────────────────────────────────────
-- 5) Catering brief / source tracking foundation
-- This does not replace existing event_requests; it gives the new model
-- its own brief table while event_requests can continue to power current UI.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.catering_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  preferred_caterer_id UUID REFERENCES public.caterers(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'speisely_marketplace',
  raw_request TEXT NOT NULL,

  event_type TEXT,
  catering_type TEXT,
  service_style TEXT,
  venue_type TEXT,
  guest_count INTEGER,
  event_date DATE,
  event_time TEXT,
  city TEXT,
  postal_code TEXT,
  budget_total NUMERIC(10,2),
  budget_per_person NUMERIC(10,2),
  cuisine_preferences TEXT[] NOT NULL DEFAULT '{}',
  dietary_requirements TEXT[] NOT NULL DEFAULT '{}',
  extra_services TEXT[] NOT NULL DEFAULT '{}',
  special_requests TEXT,

  ai_extracted_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  missing_fields TEXT[] NOT NULL DEFAULT '{}',
  confidence_score NUMERIC(4,3),

  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT catering_briefs_source_check CHECK (source IN ('speisely_marketplace', 'storefront_catering', 'manual_customer', 'admin_created')),
  CONSTRAINT catering_briefs_status_check CHECK (status IN ('draft', 'needs_more_info', 'ready_for_matching', 'matched', 'quote_requested', 'booked', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_catering_briefs_customer_id ON public.catering_briefs(customer_id);
CREATE INDEX IF NOT EXISTS idx_catering_briefs_preferred_caterer_id ON public.catering_briefs(preferred_caterer_id);
CREATE INDEX IF NOT EXISTS idx_catering_briefs_source ON public.catering_briefs(source);
CREATE INDEX IF NOT EXISTS idx_catering_briefs_status ON public.catering_briefs(status);

CREATE TABLE IF NOT EXISTS public.catering_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID NOT NULL REFERENCES public.catering_briefs(id) ON DELETE CASCADE,
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  match_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  match_reasons TEXT[] NOT NULL DEFAULT '{}',
  warnings TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'suggested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT catering_matches_status_check CHECK (status IN ('suggested', 'viewed', 'shortlisted', 'quote_requested', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_catering_matches_brief_id ON public.catering_matches(brief_id);
CREATE INDEX IF NOT EXISTS idx_catering_matches_caterer_id ON public.catering_matches(caterer_id);

CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES public.catering_briefs(id) ON DELETE SET NULL,
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'speisely_marketplace',
  status TEXT NOT NULL DEFAULT 'draft',
  title TEXT,
  description TEXT,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  service_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_fee_rate NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  platform_fee_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  valid_until DATE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT quotes_source_check CHECK (source IN ('storefront_catering', 'speisely_marketplace', 'admin_created')),
  CONSTRAINT quotes_status_check CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_quotes_brief_id ON public.quotes(brief_id);
CREATE INDEX IF NOT EXISTS idx_quotes_caterer_id ON public.quotes(caterer_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- 1. storefront_settings
ALTER TABLE public.storefront_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Storefront settings are viewable by public if active."
  ON public.storefront_settings FOR SELECT
  USING (status = 'published' OR caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

CREATE POLICY "Caterers can insert their own settings."
  ON public.storefront_settings FOR INSERT
  WITH CHECK (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

CREATE POLICY "Caterers can update their own settings."
  ON public.storefront_settings FOR UPDATE
  USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

-- 2. product_categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by public."
  ON public.product_categories FOR SELECT
  USING (true);

CREATE POLICY "Caterers can manage their own categories."
  ON public.product_categories FOR ALL
  USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

-- 3. products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by public."
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Caterers can manage their own products."
  ON public.products FOR ALL
  USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

-- 4. orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert orders."
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own orders or caterers their incoming orders."
  ON public.orders FOR SELECT
  USING (customer_id = auth.uid() OR caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

CREATE POLICY "Caterers can update their incoming orders."
  ON public.orders FOR UPDATE
  USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

CREATE POLICY "Only caterers can delete their own incoming orders."
  ON public.orders FOR DELETE
  USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

-- 5. order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert order items."
  ON public.order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own order items or caterers their incoming order items."
  ON public.order_items FOR SELECT
  USING (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid() OR caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid())));

CREATE POLICY "Caterers can update their incoming order items."
  ON public.order_items FOR UPDATE
  USING (order_id IN (SELECT id FROM public.orders WHERE caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid())));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for storefront_settings
DROP TRIGGER IF EXISTS set_storefront_settings_updated_at ON public.storefront_settings;
CREATE TRIGGER set_storefront_settings_updated_at
BEFORE UPDATE ON public.storefront_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for product_categories
DROP TRIGGER IF EXISTS set_product_categories_updated_at ON public.product_categories;
CREATE TRIGGER set_product_categories_updated_at
BEFORE UPDATE ON public.product_categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for products
DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for orders
DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT quote_items_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON public.quote_items(quote_id);

-- Optional bridge columns on current event_requests so existing /request/new can track storefront referrals.
ALTER TABLE public.event_requests
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'speisely_marketplace',
  ADD COLUMN IF NOT EXISTS storefront_slug TEXT;

ALTER TABLE public.event_requests
  DROP CONSTRAINT IF EXISTS event_requests_source_check;

ALTER TABLE public.event_requests
  ADD CONSTRAINT event_requests_source_check
    CHECK (source IN ('speisely_marketplace', 'storefront_catering', 'manual_customer', 'admin_created'));

-- ─────────────────────────────────────────────────────────────
-- 6) updated_at trigger shared by new tables
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'storefront_settings',
    'product_categories',
    'products',
    'orders',
    'catering_briefs',
    'quotes'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I', t, t);
    EXECUTE format('CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t, t);
  END LOOP;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 7) RLS policies
-- Public can read only published storefront/menu rows.
-- Caterers can manage their own storefront/menu/orders.
-- Public can create direct orders; only owners/admins can read them.
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.storefront_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- storefront_settings
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='storefront_settings' AND policyname='public_read_published_storefronts') THEN
    CREATE POLICY public_read_published_storefronts ON public.storefront_settings
      FOR SELECT TO anon, authenticated
      USING (status = 'published');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='storefront_settings' AND policyname='caterers_manage_own_storefronts') THEN
    CREATE POLICY caterers_manage_own_storefronts ON public.storefront_settings
      FOR ALL TO authenticated
      USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()))
      WITH CHECK (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));
  END IF;

  -- product_categories
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='product_categories' AND policyname='public_read_active_categories') THEN
    CREATE POLICY public_read_active_categories ON public.product_categories
      FOR SELECT TO anon, authenticated
      USING (is_active = true AND caterer_id IN (SELECT caterer_id FROM public.storefront_settings WHERE status = 'published'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='product_categories' AND policyname='caterers_manage_own_categories') THEN
    CREATE POLICY caterers_manage_own_categories ON public.product_categories
      FOR ALL TO authenticated
      USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()))
      WITH CHECK (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));
  END IF;

  -- products
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='public_read_active_instant_products') THEN
    CREATE POLICY public_read_active_instant_products ON public.products
      FOR SELECT TO anon, authenticated
      USING (is_active = true AND service_type = 'instant' AND caterer_id IN (SELECT caterer_id FROM public.storefront_settings WHERE status = 'published'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='caterers_manage_own_products') THEN
    CREATE POLICY caterers_manage_own_products ON public.products
      FOR ALL TO authenticated
      USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()))
      WITH CHECK (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));
  END IF;

  -- orders: public inserts only direct storefront instant orders. Dashboard reads own.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='public_create_direct_storefront_orders') THEN
    CREATE POLICY public_create_direct_storefront_orders ON public.orders
      FOR INSERT TO anon, authenticated
      WITH CHECK (source = 'direct_storefront' AND order_type = 'instant_order');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='caterers_read_update_own_orders') THEN
    CREATE POLICY caterers_read_update_own_orders ON public.orders
      FOR ALL TO authenticated
      USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()))
      WITH CHECK (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));
  END IF;

  -- order_items: allow insert when related order exists; read via owner order.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='public_create_order_items') THEN
    CREATE POLICY public_create_order_items ON public.order_items
      FOR INSERT TO anon, authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='caterers_read_own_order_items') THEN
    CREATE POLICY caterers_read_own_order_items ON public.order_items
      FOR SELECT TO authenticated
      USING (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
          AND orders.caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid())
      ));
  END IF;

  -- catering_briefs and quotes: basic owner/customer/admin policies can be tightened later.
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='catering_briefs' AND policyname='customers_manage_own_catering_briefs') THEN
    CREATE POLICY customers_manage_own_catering_briefs ON public.catering_briefs
      FOR ALL TO authenticated
      USING (customer_id = auth.uid())
      WITH CHECK (customer_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='catering_briefs' AND policyname='preferred_caterer_read_briefs') THEN
    CREATE POLICY preferred_caterer_read_briefs ON public.catering_briefs
      FOR SELECT TO authenticated
      USING (preferred_caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='quotes' AND policyname='caterers_manage_own_quotes') THEN
    CREATE POLICY caterers_manage_own_quotes ON public.quotes
      FOR ALL TO authenticated
      USING (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()))
      WITH CHECK (caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));
  END IF;
END $$;

notify pgrst, 'reload schema';
