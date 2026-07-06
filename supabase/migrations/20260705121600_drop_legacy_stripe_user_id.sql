-- Migration: Drop Legacy Stripe ID (Stage 2)
-- Drops the exposed stripe_user_id column after Stage 1 application tier decoupling.

ALTER TABLE public.restaurants 
DROP COLUMN IF EXISTS stripe_user_id;
