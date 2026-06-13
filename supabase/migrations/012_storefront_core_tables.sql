-- ============================================================================
-- storefront_settings: Per-caterer storefront configuration
-- ============================================================================
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
  CONSTRAINT positive_delivery_fee CHECK (delivery_fee >= 0),
  CONSTRAINT service_required CHECK (accepts_pickup OR accepts_delivery)
);

-- ============================================================================
-- product_categories: Organize menu items (Pizza, Pasta, Drinks, etc.)
-- ============================================================================
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

-- ============================================================================
-- products: Individual menu items (pizza, pasta, drinks, lunch boxes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL CHECK (service_type IN ('instant', 'catering')) DEFAULT 'instant',
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  allergen_info TEXT,
  preparation_time_minutes INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT positive_price CHECK (price >= 0)
);

-- ============================================================================
-- orders: Storefront orders (small direct orders only)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caterer_id UUID NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('direct_storefront', 'storefront_catering', 'speisely_marketplace', 'admin_created')) DEFAULT 'direct_storefront',
  order_status TEXT NOT NULL CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')) DEFAULT 'pending',
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

-- ============================================================================
-- order_items: Line items in an order
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT positive_quantity CHECK (quantity > 0)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Fix #2)
-- ============================================================================

-- 1. storefront_settings
ALTER TABLE public.storefront_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Storefront settings are viewable by public if active."
  ON public.storefront_settings FOR SELECT
  USING (is_active = true OR caterer_id IN (SELECT id FROM public.caterers WHERE user_id = auth.uid()));

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
-- TRIGGERS (Fix #4)
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
CREATE TRIGGER set_storefront_settings_updated_at
BEFORE UPDATE ON public.storefront_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for product_categories
CREATE TRIGGER set_product_categories_updated_at
BEFORE UPDATE ON public.product_categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for products
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for orders
CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
