CREATE TABLE public.promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    code TEXT NOT NULL,
    owner_id UUID NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    UNIQUE(owner_id, code)
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for active promo codes" ON public.promo_codes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can manage their own promo codes" ON public.promo_codes
    FOR ALL USING (auth.uid() = owner_id);
