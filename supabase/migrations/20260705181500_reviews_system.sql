-- Enums
CREATE TYPE review_status AS ENUM ('pending_moderation', 'published', 'flagged', 'hidden');
CREATE TYPE review_role AS ENUM ('restaurant', 'caterer', 'planner');

-- Review Invites
CREATE TABLE IF NOT EXISTS public.review_invites (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  role review_role not null,
  reference_id uuid not null,
  customer_email text not null,
  expires_at timestamp with time zone not null,
  consumed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Restaurant Reviews
CREATE TABLE IF NOT EXISTS public.restaurant_reviews (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  order_id uuid references public.restaurant_orders(id) on delete set null,
  customer_id uuid references auth.users(id) on delete set null,
  overall_rating integer not null check (overall_rating between 1 and 5),
  food_quality_rating integer not null check (food_quality_rating between 1 and 5),
  speed_rating integer not null check (speed_rating between 1 and 5),
  comment text,
  vendor_reply text,
  status review_status default 'published' not null,
  created_at timestamp with time zone default now(),
  CONSTRAINT unique_restaurant_review_per_order UNIQUE(order_id)
);

-- Caterer Reviews
CREATE TABLE IF NOT EXISTS public.caterer_reviews (
  id uuid primary key default gen_random_uuid(),
  caterer_id uuid references public.caterers(id) on delete cascade not null,
  booking_id uuid references public.catering_bookings(id) on delete set null,
  customer_id uuid references auth.users(id) on delete set null,
  overall_rating integer not null check (overall_rating between 1 and 5),
  food_rating integer not null check (food_rating between 1 and 5),
  reliability_rating integer not null check (reliability_rating between 1 and 5),
  communication_rating integer not null check (communication_rating between 1 and 5),
  value_rating integer not null check (value_rating between 1 and 5),
  comment text not null check (char_length(comment) >= 50),
  vendor_reply text,
  status review_status default 'published' not null,
  created_at timestamp with time zone default now(),
  CONSTRAINT unique_caterer_review_per_booking UNIQUE(booking_id)
);

-- Event Manager Reviews
CREATE TABLE IF NOT EXISTS public.planner_reviews (
  id uuid primary key default gen_random_uuid(),
  planner_id uuid references public.planners(id) on delete cascade not null,
  booking_id uuid references public.event_bookings(id) on delete set null,
  customer_id uuid references auth.users(id) on delete set null,
  overall_rating integer not null check (overall_rating between 1 and 5),
  creativity_rating integer not null check (creativity_rating between 1 and 5),
  execution_rating integer not null check (execution_rating between 1 and 5),
  communication_rating integer not null check (communication_rating between 1 and 5),
  value_rating integer not null check (value_rating between 1 and 5),
  comment text not null check (char_length(comment) >= 50),
  vendor_reply text,
  status review_status default 'published' not null,
  created_at timestamp with time zone default now(),
  CONSTRAINT unique_planner_review_per_booking UNIQUE(booking_id)
);

-- RLS Policies

-- review_invites
ALTER TABLE public.review_invites ENABLE ROW LEVEL SECURITY;
-- No public read/write access. Service role only.

-- restaurant_reviews
ALTER TABLE public.restaurant_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published restaurant reviews" ON public.restaurant_reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Restaurants can view their own reviews" ON public.restaurant_reviews FOR SELECT USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid()));
CREATE POLICY "Restaurants can update vendor_reply on their own reviews" ON public.restaurant_reviews FOR UPDATE USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid())) WITH CHECK (restaurant_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid()));
-- Note: Insert is handled by server-side functions using service_role, no public insert policy to prevent bypass

-- caterer_reviews
ALTER TABLE public.caterer_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published caterer reviews" ON public.caterer_reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Caterers can view their own reviews" ON public.caterer_reviews FOR SELECT USING (caterer_id IN (SELECT id FROM public.caterers WHERE owner_id = auth.uid()));
CREATE POLICY "Caterers can update vendor_reply on their own reviews" ON public.caterer_reviews FOR UPDATE USING (caterer_id IN (SELECT id FROM public.caterers WHERE owner_id = auth.uid())) WITH CHECK (caterer_id IN (SELECT id FROM public.caterers WHERE owner_id = auth.uid()));

-- planner_reviews
ALTER TABLE public.planner_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published planner reviews" ON public.planner_reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Planners can view their own reviews" ON public.planner_reviews FOR SELECT USING (planner_id IN (SELECT id FROM public.planners WHERE owner_id = auth.uid()));
CREATE POLICY "Planners can update vendor_reply on their own reviews" ON public.planner_reviews FOR UPDATE USING (planner_id IN (SELECT id FROM public.planners WHERE owner_id = auth.uid())) WITH CHECK (planner_id IN (SELECT id FROM public.planners WHERE owner_id = auth.uid()));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_restaurant_reviews_restaurant_id ON public.restaurant_reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_reviews_status ON public.restaurant_reviews(status);

CREATE INDEX IF NOT EXISTS idx_caterer_reviews_caterer_id ON public.caterer_reviews(caterer_id);
CREATE INDEX IF NOT EXISTS idx_caterer_reviews_status ON public.caterer_reviews(status);

CREATE INDEX IF NOT EXISTS idx_planner_reviews_planner_id ON public.planner_reviews(planner_id);
CREATE INDEX IF NOT EXISTS idx_planner_reviews_status ON public.planner_reviews(status);

CREATE INDEX IF NOT EXISTS idx_review_invites_token ON public.review_invites(token);
