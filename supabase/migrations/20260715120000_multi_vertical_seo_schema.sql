-- Restaurants: Additional SEO fields
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS seo_primary_keyword text,
  ADD COLUMN IF NOT EXISTS seo_secondary_keywords text[],
  ADD COLUMN IF NOT EXISTS seo_cuisine_target text,
  ADD COLUMN IF NOT EXISTS seo_signature_dishes text[],
  ADD COLUMN IF NOT EXISTS seo_local_intro text,
  ADD COLUMN IF NOT EXISTS seo_nearby_landmarks text[];

-- Caterers: Additional SEO fields
ALTER TABLE public.caterers
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS seo_primary_keyword text,
  ADD COLUMN IF NOT EXISTS seo_secondary_keywords text[],
  ADD COLUMN IF NOT EXISTS seo_event_types_target text[],
  ADD COLUMN IF NOT EXISTS seo_catering_styles text[],
  ADD COLUMN IF NOT EXISTS seo_service_areas text[],
  ADD COLUMN IF NOT EXISTS seo_service_radius_km int,
  ADD COLUMN IF NOT EXISTS seo_logistics_details text,
  ADD COLUMN IF NOT EXISTS seo_local_intro text,
  ADD COLUMN IF NOT EXISTS seo_nearby_landmarks text[],
  ADD COLUMN IF NOT EXISTS seo_menu_or_packages_intro text;

-- Event Planners: Additional SEO fields
ALTER TABLE public.planners
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS seo_primary_keyword text,
  ADD COLUMN IF NOT EXISTS seo_secondary_keywords text[],
  ADD COLUMN IF NOT EXISTS seo_event_types_target text[],
  ADD COLUMN IF NOT EXISTS seo_service_areas text[],
  ADD COLUMN IF NOT EXISTS seo_venue_expertise text[],
  ADD COLUMN IF NOT EXISTS seo_planning_scope text,
  ADD COLUMN IF NOT EXISTS seo_local_intro text,
  ADD COLUMN IF NOT EXISTS seo_nearby_landmarks text[],
  ADD COLUMN IF NOT EXISTS seo_vendor_specialties text[];

-- Discovery Pages: New Table
CREATE TABLE IF NOT EXISTS public.discovery_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  vertical text NOT NULL CHECK (vertical IN ('restaurant', 'caterer', 'event_manager')),
  city_slug text NOT NULL,
  seo_title text,
  seo_description text,
  hero_copy text,
  intro_md text,
  faq_md text,
  curated_content text,
  canonical_path text,
  entity_count int DEFAULT 0,
  min_quality_score numeric DEFAULT 0.0,
  is_published boolean DEFAULT false,
  noindex boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(vertical, city_slug)
);

-- Enable RLS
ALTER TABLE public.discovery_pages ENABLE ROW LEVEL SECURITY;

-- Policies for discovery_pages
CREATE POLICY "Public can view published discovery pages" ON public.discovery_pages
  FOR SELECT USING (is_published = true);

-- Add updated_at trigger for discovery_pages
CREATE TRIGGER handle_updated_at_discovery_pages
  BEFORE UPDATE ON public.discovery_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();
