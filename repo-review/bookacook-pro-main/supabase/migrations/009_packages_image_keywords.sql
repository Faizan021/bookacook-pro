-- Migration 009: Rename cover_image_url → image_url; add gallery_images + keywords
-- Apply in Supabase SQL Editor if not already done.

ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS image_url       TEXT,
  ADD COLUMN IF NOT EXISTS gallery_images  TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS keywords        TEXT[]  NOT NULL DEFAULT '{}';

-- If the old cover_image_url column exists, copy data across then drop it.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'cover_image_url'
  ) THEN
    UPDATE public.packages SET image_url = cover_image_url WHERE image_url IS NULL;
    ALTER TABLE public.packages DROP COLUMN cover_image_url;
  END IF;
END $$;

notify pgrst, 'reload schema';
