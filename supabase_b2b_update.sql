-- Add B2B and recurring fields to catering_briefs

ALTER TABLE public.catering_briefs
ADD COLUMN is_b2b BOOLEAN DEFAULT false,
ADD COLUMN company_name TEXT,
ADD COLUMN is_recurring BOOLEAN DEFAULT false,
ADD COLUMN recurrence_pattern TEXT,
ADD COLUMN contract_end_date DATE;

-- Update RLS policies if necessary (optional, but good practice if adding new fields doesn't automatically expose them to RLS properly. Actually, RLS is row-level so adding columns is fine)
