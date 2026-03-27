-- Migration 002: verification status & payout gating
-- Run this in your Supabase SQL editor after migration 001

-- 1. Ensure verification_status column exists with default 'pending'
ALTER TABLE public.caterers
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending';

-- 2. Add CHECK constraint for valid statuses
ALTER TABLE public.caterers
  DROP CONSTRAINT IF EXISTS caterers_verification_status_check;

ALTER TABLE public.caterers
  ADD CONSTRAINT caterers_verification_status_check
    CHECK (verification_status IN ('pending', 'under_review', 'verified', 'rejected', 'suspended'));

-- 3. Payout eligibility flag — false until admin marks as verified
ALTER TABLE public.caterers
  ADD COLUMN IF NOT EXISTS payout_enabled BOOLEAN NOT NULL DEFAULT false;

-- 4. Optional audit fields
ALTER TABLE public.caterers
  ADD COLUMN IF NOT EXISTS reviewed_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by  UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 5. Payment extended columns for gross/net/payout tracking
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS gross_amount     NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS commission_amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS net_payout       NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS held_amount      NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS released_amount  NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payout_status    TEXT NOT NULL DEFAULT 'pending_payment';

-- 6. CHECK constraint for payout_status
ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_payout_status_check;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_payout_status_check
    CHECK (payout_status IN (
      'pending_payment', 'funds_held', 'partially_released',
      'payout_pending', 'payout_released',
      'refunded', 'partially_refunded', 'cancelled', 'disputed'
    ));

-- 7. Auto-populate commission/net from gross on insert (optional trigger)
--    If using a trigger-based approach, add here. Otherwise, calculate in app layer.

-- 8. RLS: allow admins to update caterer verification
--    (assumes you have a custom claim or role check)
--    Example policy — adjust to match your auth setup:
--
-- CREATE POLICY "admins_can_update_caterers"
--   ON public.caterers
--   FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE profiles.id = auth.uid()
--         AND profiles.role = 'admin'
--     )
--   );

-- After verifying existing data, you may optionally backfill:
-- UPDATE public.caterers
--   SET payout_enabled = true
--   WHERE verification_status = 'verified';
