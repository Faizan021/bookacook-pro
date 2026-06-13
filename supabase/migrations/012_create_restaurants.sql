-- ============================================================================
-- Migration 012: Speisely Restaurant Module (Option B – Separate Tables)
-- ============================================================================
-- Purpose: Create the restaurant-specific tables alongside the existing caterer
-- tables. Restaurants use a 2% commission rate (vs 10% for caterers).
-- Both share the same auth system (auth.users) and profiles table.
--
-- Tables created:
--   • restaurants
--   • restaurant_products
--   • restaurant_orders
--   • restaurant_order_items
--
-- Safe to run multiple times (uses IF NOT EXISTS / DROP IF EXISTS).
-- ============================================================================

-- ─────────────────────────────────────────────────────────────
-- 1) restaurants
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.restaurants (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  business_name       TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description         TEXT,
  logo_url            TEXT,
  banner_image_url    TEXT,
  phone               TEXT,
  email               TEXT,
  business_address    TEXT,
  city                TEXT,
  postal_code         TEXT,
  cuisine_type        TEXT,

  is_active           BOOLEAN NOT NULL DEFAULT false,
  verification_status TEXT NOT NULL DEFAULT 'pending',

  opening_hours       JSONB,
  delivery_radius_km  NUMERIC(6,2),
  min_order_amount    NUMERIC(10,2) NOT NULL DEFAULT 10.00,
  delivery_fee        NUMERIC(10,2) NOT NULL DEFAULT 2.50,
  accepts_pickup      BOOLEAN NOT NULL DEFAULT true,
  accepts_delivery    BOOLEAN NOT NULL DEFAULT true,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT restaurants_verification_status_check
    CHECK (verification_status IN ('pending', 'verified', 'rejected'))
);

-- Ensure restaurant slugs never collide with caterer storefront slugs.
-- This is an application-level check (see actions.ts), but we add a comment
-- as documentation. A cross-table UNIQUE constraint would require a shared
-- slug registry table — deferred to a later migration if needed.

CREATE UNIQUE INDEX IF NOT EXISTS idx_restaurants_user_id
  ON public.restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug
  ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_is_active
  ON public.restaurants(is_active);
CREATE INDEX IF NOT EXISTS idx_restaurants_city
  ON public.restaurants(city);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine_type
  ON public.restaurants(cuisine_type);

-- ─────────────────────────────────────────────────────────────
-- 2) restaurant_products
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.restaurant_products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,

  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10,2) NOT NULL,
  image_url       TEXT,
  category        TEXT,
  dietary_tags    TEXT[] NOT NULL DEFAULT '{}',
  allergen_info   TEXT,
  is_available    BOOLEAN NOT NULL DEFAULT true,
  display_order   INTEGER NOT NULL DEFAULT 0,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT restaurant_products_price_positive CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_restaurant_products_restaurant_id
  ON public.restaurant_products(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_products_category
  ON public.restaurant_products(category);
CREATE INDEX IF NOT EXISTS idx_restaurant_products_available
  ON public.restaurant_products(is_available);
CREATE INDEX IF NOT EXISTS idx_restaurant_products_dietary_tags
  ON public.restaurant_products USING gin(dietary_tags);

-- ─────────────────────────────────────────────────────────────
-- 3) restaurant_orders
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.restaurant_orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id       UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE RESTRICT,
  customer_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  order_status        TEXT NOT NULL DEFAULT 'pending',
  fulfillment_type    TEXT NOT NULL DEFAULT 'pickup',

  subtotal            NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee        NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_fee_rate   NUMERIC(5,2)  NOT NULL DEFAULT 2.00,    -- 2% for restaurants
  platform_fee_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount        NUMERIC(10,2) NOT NULL DEFAULT 0,

  customer_name       TEXT,
  customer_email      TEXT,
  customer_phone      TEXT,
  delivery_address    TEXT,
  requested_time      TIMESTAMPTZ,
  notes               TEXT,

  payment_status      TEXT NOT NULL DEFAULT 'unpaid',

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT restaurant_orders_status_check
    CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
  CONSTRAINT restaurant_orders_fulfillment_check
    CHECK (fulfillment_type IN ('pickup', 'delivery')),
  CONSTRAINT restaurant_orders_payment_status_check
    CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded'))
);

CREATE INDEX IF NOT EXISTS idx_restaurant_orders_restaurant_id
  ON public.restaurant_orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_orders_customer_id
  ON public.restaurant_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_orders_status
  ON public.restaurant_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_restaurant_orders_created_at
  ON public.restaurant_orders(created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 4) restaurant_order_items
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.restaurant_order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES public.restaurant_orders(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES public.restaurant_products(id) ON DELETE SET NULL,

  product_name TEXT NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1,
  unit_price   NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes        TEXT,

  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT restaurant_order_items_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_restaurant_order_items_order_id
  ON public.restaurant_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_order_items_product_id
  ON public.restaurant_order_items(product_id);


-- ============================================================================
-- 5) updated_at triggers (reuses the existing set_updated_at function)
-- ============================================================================

-- Ensure the shared trigger function exists (it was created in migration 010).
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
    'restaurants',
    'restaurant_products',
    'restaurant_orders'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
      t, t
    );
  END LOOP;
END $$;


-- ============================================================================
-- 6) Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_order_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN

  -- ── restaurants ──────────────────────────────────────────────

  -- Public can view active restaurants
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='restaurants' AND policyname='public_read_active_restaurants') THEN
    CREATE POLICY public_read_active_restaurants ON public.restaurants
      FOR SELECT TO anon, authenticated
      USING (is_active = true);
  END IF;

  -- Restaurant owners can manage their own restaurant
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='restaurants' AND policyname='owners_manage_own_restaurant') THEN
    CREATE POLICY owners_manage_own_restaurant ON public.restaurants
      FOR ALL TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;

  -- ── restaurant_products ──────────────────────────────────────

  -- Public can view available products of active restaurants
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='restaurant_products' AND policyname='public_read_available_restaurant_products') THEN
    CREATE POLICY public_read_available_restaurant_products ON public.restaurant_products
      FOR SELECT TO anon, authenticated
      USING (
        is_available = true
        AND restaurant_id IN (SELECT id FROM public.restaurants WHERE is_active = true)
      );
  END IF;

  -- Restaurant owners can manage their products
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='restaurant_products' AND policyname='owners_manage_own_restaurant_products') THEN
    CREATE POLICY owners_manage_own_restaurant_products ON public.restaurant_products
      FOR ALL TO authenticated
      USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()))
      WITH CHECK (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));
  END IF;

  -- ── restaurant_orders ────────────────────────────────────────

  -- Public (anon + authenticated) can create orders
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='restaurant_orders' AND policyname='public_create_restaurant_orders') THEN
    CREATE POLICY public_create_restaurant_orders ON public.restaurant_orders
      FOR INSERT TO anon, authenticated
      WITH CHECK (true);
  END IF;

  -- Customers can view their own orders
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='restaurant_orders' AND policyname='customers_view_own_restaurant_orders') THEN
    CREATE POLICY customers_view_own_restaurant_orders ON public.restaurant_orders
      FOR SELECT TO authenticated
      USING (customer_id = auth.uid());
  END IF;

  -- Restaurant owners can view and update their incoming orders
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='restaurant_orders' AND policyname='owners_manage_own_restaurant_orders') THEN
    CREATE POLICY owners_manage_own_restaurant_orders ON public.restaurant_orders
      FOR ALL TO authenticated
      USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()))
      WITH CHECK (restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid()));
  END IF;

  -- ── restaurant_order_items ───────────────────────────────────

  -- Public can insert items when a related order exists
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='restaurant_order_items' AND policyname='public_create_restaurant_order_items') THEN
    CREATE POLICY public_create_restaurant_order_items ON public.restaurant_order_items
      FOR INSERT TO anon, authenticated
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.restaurant_orders
        WHERE restaurant_orders.id = restaurant_order_items.order_id
      ));
  END IF;

  -- Restaurant owners can view their order items
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='restaurant_order_items' AND policyname='owners_read_own_restaurant_order_items') THEN
    CREATE POLICY owners_read_own_restaurant_order_items ON public.restaurant_order_items
      FOR SELECT TO authenticated
      USING (EXISTS (
        SELECT 1 FROM public.restaurant_orders
        WHERE restaurant_orders.id = restaurant_order_items.order_id
          AND restaurant_orders.restaurant_id IN (SELECT id FROM public.restaurants WHERE user_id = auth.uid())
      ));
  END IF;

  -- Customers can view their own order items
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='restaurant_order_items' AND policyname='customers_read_own_restaurant_order_items') THEN
    CREATE POLICY customers_read_own_restaurant_order_items ON public.restaurant_order_items
      FOR SELECT TO authenticated
      USING (EXISTS (
        SELECT 1 FROM public.restaurant_orders
        WHERE restaurant_orders.id = restaurant_order_items.order_id
          AND restaurant_orders.customer_id = auth.uid()
      ));
  END IF;

END $$;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
