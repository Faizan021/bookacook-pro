-- Migration: Global Preferences V1

-- Add columns
ALTER TABLE public.user_consents
  ADD COLUMN pref_interests text[] DEFAULT '{}',
  ADD COLUMN pref_language text;

-- Add check constraint for strictly controlled vocabulary
ALTER TABLE public.user_consents
  ADD CONSTRAINT pref_interests_check
  CHECK (pref_interests <@ ARRAY['general', 'reservations', 'catering', 'event_planning', 'orders']::text[]);
