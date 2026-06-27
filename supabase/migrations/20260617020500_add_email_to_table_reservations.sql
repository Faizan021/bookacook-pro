-- Migration to add email column to table_reservations
ALTER TABLE public.table_reservations ADD COLUMN email text;
