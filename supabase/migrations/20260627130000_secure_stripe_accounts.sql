-- Migration: Secure Stripe Accounts (Step 1)
-- Creates a secure private table to store Stripe connected account IDs and backfills existing data.

CREATE TABLE IF NOT EXISTS public.restaurant_stripe_accounts (
    restaurant_id UUID PRIMARY KEY REFERENCES public.restaurants(id) ON DELETE CASCADE,
    stripe_user_id TEXT NOT NULL,
    stripe_connected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurant_stripe_accounts ENABLE ROW LEVEL SECURITY;

-- Row Level Security policies
CREATE POLICY "owners_manage_stripe_accounts" ON public.restaurant_stripe_accounts
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.owner_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.restaurants r WHERE r.id = restaurant_id AND r.owner_id = auth.uid()));

-- Backfill existing data
INSERT INTO public.restaurant_stripe_accounts (restaurant_id, stripe_user_id, stripe_connected_at)
SELECT id, stripe_user_id, COALESCE(stripe_connected_at, now())
FROM public.restaurants
WHERE stripe_user_id IS NOT NULL
ON CONFLICT (restaurant_id) DO UPDATE
SET stripe_user_id = EXCLUDED.stripe_user_id,
    stripe_connected_at = EXCLUDED.stripe_connected_at;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.restaurant_stripe_accounts TO authenticated;
GRANT ALL ON public.restaurant_stripe_accounts TO service_role;
