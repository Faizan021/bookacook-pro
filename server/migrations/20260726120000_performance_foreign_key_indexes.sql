-- Speisely Performance Optimization: Foreign Key & Lookup Indexes
-- Migration: 20260726120000_performance_foreign_key_indexes.sql

-- 1. Vendor owner lookups and RLS policy evaluation
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON public.restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_caterers_owner_id ON public.caterers(owner_id);
CREATE INDEX IF NOT EXISTS idx_planners_owner_id ON public.planners(owner_id);

-- 2. Restaurant orders filtering & activity feed sorting
CREATE INDEX IF NOT EXISTS idx_restaurant_orders_restaurant_created 
  ON public.restaurant_orders(restaurant_id, created_at DESC);

-- 3. Table reservations lookup & activity feed sorting
CREATE INDEX IF NOT EXISTS idx_table_reservations_restaurant_created 
  ON public.table_reservations(restaurant_id, created_at DESC);

-- 4. Storefront page views analytics lookup (KPIs)
CREATE INDEX IF NOT EXISTS idx_storefront_page_views_vendor_created 
  ON public.storefront_page_views(vendor_id, created_at DESC);

-- 5. Catering briefs preferred caterer lookup
CREATE INDEX IF NOT EXISTS idx_catering_briefs_caterer_id 
  ON public.catering_briefs(preferred_caterer_id);

-- 6. Planner requests planner_id lookup
CREATE INDEX IF NOT EXISTS idx_planner_requests_planner_id 
  ON public.planner_requests(planner_id);
