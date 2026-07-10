-- Migration to add branding assistant config columns
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS use_generated_branding BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE caterers ADD COLUMN IF NOT EXISTS use_generated_branding BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE planners ADD COLUMN IF NOT EXISTS use_generated_branding BOOLEAN NOT NULL DEFAULT false;
