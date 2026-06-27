-- 1. Add operating_hours to restaurants
ALTER TABLE public.restaurants 
ADD COLUMN operating_hours jsonb DEFAULT '{}'::jsonb;

-- 2. Create vendor_blackout_dates
CREATE TABLE IF NOT EXISTS public.vendor_blackout_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_type TEXT NOT NULL CHECK (vendor_type IN ('caterer', 'planner')),
    vendor_id UUID NOT NULL,
    blackout_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure vendors can only see/manage their own blackout dates via RLS
ALTER TABLE public.vendor_blackout_dates ENABLE ROW LEVEL SECURITY;

-- Policies for Caterers
CREATE POLICY "Caterers can view their blackout dates" 
    ON public.vendor_blackout_dates FOR SELECT 
    USING (
        (vendor_type = 'caterer' AND vendor_id IN (SELECT id FROM public.caterers WHERE owner_id = auth.uid()))
        OR
        (vendor_type = 'planner' AND vendor_id IN (SELECT id FROM public.planners WHERE owner_id = auth.uid()))
    );

CREATE POLICY "Caterers and Planners can insert blackout dates" 
    ON public.vendor_blackout_dates FOR INSERT 
    WITH CHECK (
        (vendor_type = 'caterer' AND vendor_id IN (SELECT id FROM public.caterers WHERE owner_id = auth.uid()))
        OR
        (vendor_type = 'planner' AND vendor_id IN (SELECT id FROM public.planners WHERE owner_id = auth.uid()))
    );

CREATE POLICY "Caterers and Planners can delete blackout dates" 
    ON public.vendor_blackout_dates FOR DELETE 
    USING (
        (vendor_type = 'caterer' AND vendor_id IN (SELECT id FROM public.caterers WHERE owner_id = auth.uid()))
        OR
        (vendor_type = 'planner' AND vendor_id IN (SELECT id FROM public.planners WHERE owner_id = auth.uid()))
    );

-- Anyone can read blackout dates (needed for public storefront)
CREATE POLICY "Public can read blackout dates"
    ON public.vendor_blackout_dates FOR SELECT
    USING (true);

-- 3. Create storefront_page_views
CREATE TABLE IF NOT EXISTS public.storefront_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_type TEXT NOT NULL CHECK (vendor_type IN ('restaurant', 'caterer', 'planner')),
    vendor_id UUID NOT NULL,
    viewer_ip TEXT, -- Masked or null ideally for privacy, just need distinct counts or simple tracking
    viewer_user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.storefront_page_views ENABLE ROW LEVEL SECURITY;

-- Public can insert views
CREATE POLICY "Public can insert page views"
    ON public.storefront_page_views FOR INSERT
    WITH CHECK (true);

-- Vendors can read their own views
CREATE POLICY "Vendors can read their own page views"
    ON public.storefront_page_views FOR SELECT
    USING (
        (vendor_type = 'restaurant' AND vendor_id IN (SELECT id FROM public.restaurants WHERE owner_id = auth.uid()))
        OR
        (vendor_type = 'caterer' AND vendor_id IN (SELECT id FROM public.caterers WHERE owner_id = auth.uid()))
        OR
        (vendor_type = 'planner' AND vendor_id IN (SELECT id FROM public.planners WHERE owner_id = auth.uid()))
    );
