-- PostgreSQL Migration: 20260808000001_caterer_multitenant_pipeline.sql
-- Description: Step 1 Database Foundation (Caterer/Catalogue extensions, Idempotency, Reference Counters, Item Snapshots, Status History, and Atomic Submission RPC).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ====================================================================
-- MIGRATION 001: TENANT & CATALOGUE ENHANCEMENTS
-- ====================================================================

-- 1. Extend caterers table
ALTER TABLE public.caterers 
  ADD COLUMN IF NOT EXISTS reference_prefix text DEFAULT 'CAT' NOT NULL CHECK (char_length(reference_prefix) BETWEEN 2 AND 10 AND reference_prefix ~ '^[A-Z0-9]+$'),
  ADD COLUMN IF NOT EXISTS pricing_model text DEFAULT 'on_request' NOT NULL CHECK (pricing_model IN ('on_request', 'fixed', 'hybrid')),
  ADD COLUMN IF NOT EXISTS allowed_event_types text[] DEFAULT ARRAY['wedding', 'nikkah', 'walima', 'mehndi', 'dholki', 'aqeeqah', 'dawat', 'ramadan', 'eid', 'corporate'],
  ADD COLUMN IF NOT EXISTS halal_claim_type text DEFAULT 'none' NOT NULL CHECK (halal_claim_type IN ('authentic_halal', 'certified_halal', 'none')),
  ADD COLUMN IF NOT EXISTS halal_verification_status text DEFAULT 'pending' NOT NULL CHECK (halal_verification_status IN ('pending', 'verified', 'rejected')),
  ADD COLUMN IF NOT EXISTS halal_verifier_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS halal_verification_date timestamptz,
  ADD COLUMN IF NOT EXISTS halal_document_ref text;

-- 2. Extend caterer_menu_items table (DEFAULT 'active' to preserve existing catalogue availability!)
ALTER TABLE public.caterer_menu_items
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' NOT NULL CHECK (status IN ('draft', 'active', 'unavailable', 'archived')),
  ADD COLUMN IF NOT EXISTS pricing_type text DEFAULT 'on_request' NOT NULL CHECK (pricing_type IN ('on_request', 'per_person', 'per_tray', 'per_piece', 'fixed')),
  ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0 NOT NULL;

CREATE INDEX IF NOT EXISTS idx_caterer_items_public 
  ON public.caterer_menu_items(caterer_id, status, is_available) 
  WHERE status = 'active' AND is_available = true;


-- ====================================================================
-- MIGRATION 002: IDEMPOTENCY & CONCURRENCY REFERENCE ALLOCATOR
-- ====================================================================

-- 1. Idempotency Keys Table
CREATE TABLE IF NOT EXISTS public.request_idempotency_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  idempotency_key text NOT NULL CHECK (char_length(idempotency_key) BETWEEN 8 AND 128),
  payload_hash text NOT NULL CHECK (char_length(payload_hash) = 64),
  created_brief_id uuid REFERENCES public.catering_briefs(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '24 hours') NOT NULL,
  CONSTRAINT idx_idempotency_tenant_key UNIQUE (tenant_id, idempotency_key),
  CONSTRAINT chk_idempotency_expiry CHECK (expires_at > created_at)
);

-- 2. Concurrency-Safe Reference Counter Table
CREATE TABLE IF NOT EXISTS public.catering_reference_counters (
  tenant_id uuid NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  year integer NOT NULL CHECK (year >= 2026 AND year <= 2100),
  last_value integer DEFAULT 0 NOT NULL CHECK (last_value >= 0),
  PRIMARY KEY (tenant_id, year)
);


-- ====================================================================
-- MIGRATION 003: CATERING BRIEFS EXTENSIONS, SNAPSHOTS & HISTORY
-- ====================================================================

-- 1. Extend catering_briefs table (privacy_policy_version is NULLABLE for historical rows!)
ALTER TABLE public.catering_briefs
  ADD COLUMN IF NOT EXISTS reference_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS privacy_policy_version text,
  ADD COLUMN IF NOT EXISTS privacy_consent_timestamp timestamptz,
  ADD COLUMN IF NOT EXISTS contact_consent boolean DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS marketing_consent boolean DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS marketing_consent_timestamp timestamptz,
  ADD COLUMN IF NOT EXISTS submission_language text DEFAULT 'de' NOT NULL CHECK (submission_language IN ('de', 'en'));

-- 2. Immutable Menu Item Snapshots Table (Single-language matching caterer_menu_items)
CREATE TABLE IF NOT EXISTS public.catering_brief_item_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id uuid NOT NULL REFERENCES public.catering_briefs(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES public.caterers(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.caterer_menu_items(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  item_description text,
  customer_language text DEFAULT 'de' NOT NULL CHECK (customer_language IN ('de', 'en')),
  quantity integer NOT NULL CHECK (quantity > 0 AND quantity <= 1000),
  quantity_unit text,
  pricing_type text NOT NULL,
  fixed_price_cents bigint DEFAULT 0 CHECK (fixed_price_cents >= 0),
  currency text DEFAULT 'EUR' NOT NULL,
  customer_notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Append-Only Status History Table
CREATE TABLE IF NOT EXISTS public.catering_brief_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id uuid NOT NULL REFERENCES public.catering_briefs(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_by_user_id uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);


-- ====================================================================
-- MIGRATION 004: ATOMIC SUBMISSION RPC FUNCTION (SECURITY DEFINER)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.submit_catering_request_atomic(
  p_tenant_id uuid,
  p_idempotency_key text,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_event_type text,
  p_event_date date,
  p_guest_count integer,
  p_location text,
  p_notes text,
  p_items jsonb,
  p_privacy_version text,
  p_privacy_consent boolean,
  p_contact_consent boolean,
  p_marketing_consent boolean,
  p_language text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid;
  v_tenant_record record;
  v_payload_raw text;
  v_payload_hash text;
  v_idempotency_rec record;
  v_prefix text;
  v_year integer;
  v_seq integer;
  v_ref_code text;
  v_brief_id uuid;
  v_req_item jsonb;
  v_db_item record;
  v_item_count integer;
  v_normalized_items jsonb;
BEGIN
  -- 1. Ownership & Authentication Validation
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to submit catering enquiry' USING ERRCODE = '28000';
  END IF;

  -- 2. Explicit Consent Validation
  IF p_privacy_consent IS NOT TRUE THEN
    RAISE EXCEPTION 'Explicit privacy policy consent is required' USING ERRCODE = '22000';
  END IF;

  IF p_contact_consent IS NOT TRUE THEN
    RAISE EXCEPTION 'Explicit contact consent is required' USING ERRCODE = '22000';
  END IF;

  -- 3. Input String Length & Regex Bounds Validation
  IF p_customer_email IS NULL OR p_customer_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid customer email address' USING ERRCODE = '22000';
  END IF;

  IF p_customer_name IS NULL OR char_length(p_customer_name) < 2 OR char_length(p_customer_name) > 150 THEN
    RAISE EXCEPTION 'Customer name must be between 2 and 150 characters' USING ERRCODE = '22000';
  END IF;

  IF p_guest_count IS NULL OR p_guest_count <= 0 OR p_guest_count > 10000 THEN
    RAISE EXCEPTION 'Guest count must be between 1 and 10,000' USING ERRCODE = '22000';
  END IF;

  IF p_event_date IS NULL OR p_event_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Event date must be a valid future date' USING ERRCODE = '22000';
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'Items payload must be a non-empty array' USING ERRCODE = '22000';
  END IF;

  v_item_count := jsonb_array_length(p_items);
  IF v_item_count < 1 OR v_item_count > 50 THEN
    RAISE EXCEPTION 'Item count must be between 1 and 50 items' USING ERRCODE = '22000';
  END IF;

  -- 4. Tenant Active/Approval Validation
  SELECT reference_prefix, allowed_event_types INTO v_tenant_record 
  FROM public.caterers 
  WHERE id = p_tenant_id AND approval_status = 'approved';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Caterer is not active or approved' USING ERRCODE = '22000';
  END IF;

  -- 5. Construct Canonical Server-Normalized Items Array
  SELECT jsonb_agg(
    jsonb_build_object(
      'item_id', (x->>'item_id')::uuid,
      'quantity', (x->>'quantity')::integer,
      'notes', TRIM(COALESCE(x->>'notes', ''))
    ) ORDER BY (x->>'item_id')::uuid
  ) INTO v_normalized_items
  FROM jsonb_array_elements(p_items) x;

  -- Complete Canonical Payload Hash (Normalized Ordering)
  v_payload_raw := jsonb_build_object(
    'tenant_id', p_tenant_id,
    'email', LOWER(TRIM(p_customer_email)),
    'name', TRIM(p_customer_name),
    'phone', TRIM(COALESCE(p_customer_phone, '')),
    'event_type', p_event_type,
    'event_date', p_event_date::text,
    'guest_count', p_guest_count,
    'location', TRIM(COALESCE(p_location, '')),
    'notes', TRIM(COALESCE(p_notes, '')),
    'privacy_version', p_privacy_version,
    'privacy_consent', p_privacy_consent,
    'contact_consent', p_contact_consent,
    'marketing_consent', p_marketing_consent,
    'language', p_language,
    'items', v_normalized_items
  )::text;
  v_payload_hash := encode(digest(v_payload_raw, 'sha256'), 'hex');

  -- 6. Atomic Race-Safe Idempotency Reservation & Unconditional Hash Comparison
  INSERT INTO public.request_idempotency_keys (tenant_id, idempotency_key, payload_hash, expires_at)
  VALUES (p_tenant_id, p_idempotency_key, v_payload_hash, now() + interval '24 hours')
  ON CONFLICT (tenant_id, idempotency_key) DO UPDATE 
    SET payload_hash = public.request_idempotency_keys.payload_hash
  RETURNING id, payload_hash, created_brief_id INTO v_idempotency_rec;

  IF v_idempotency_rec.payload_hash <> v_payload_hash THEN
    RAISE EXCEPTION 'Idempotency key payload mismatch' USING ERRCODE = '42000';
  END IF;

  IF v_idempotency_rec.created_brief_id IS NOT NULL THEN
    SELECT reference_code INTO v_ref_code FROM public.catering_briefs WHERE id = v_idempotency_rec.created_brief_id;
    RETURN jsonb_build_object('ok', true, 'reference_code', v_ref_code, 'brief_id', v_idempotency_rec.created_brief_id, 'is_duplicate', true);
  END IF;

  -- 7. Concurrency-Safe Reference Code Allocation
  v_prefix := UPPER(TRIM(COALESCE(v_tenant_record.reference_prefix, 'CAT')));
  v_year := EXTRACT(YEAR FROM CURRENT_DATE);

  INSERT INTO public.catering_reference_counters (tenant_id, year, last_value)
  VALUES (p_tenant_id, v_year, 1)
  ON CONFLICT (tenant_id, year) 
  DO UPDATE SET last_value = public.catering_reference_counters.last_value + 1
  RETURNING last_value INTO v_seq;

  v_ref_code := v_prefix || '-' || v_year || '-' || LPAD(v_seq::text, 5, '0');

  -- 8. Insert Catering Brief with Verified Default Enum Status ('submitted')
  INSERT INTO public.catering_briefs (
    customer_id, preferred_caterer_id, reference_code, customer_name, customer_email, customer_phone,
    status, event_type, event_date, guest_count, location, notes, privacy_policy_version, 
    privacy_consent_timestamp, contact_consent, marketing_consent, 
    marketing_consent_timestamp, submission_language
  ) VALUES (
    v_user_id, p_tenant_id, v_ref_code, p_customer_name, LOWER(TRIM(p_customer_email)), p_customer_phone,
    'submitted', p_event_type, p_event_date, p_guest_count, p_location, p_notes, p_privacy_version, 
    now(), p_contact_consent, p_marketing_consent, 
    CASE WHEN p_marketing_consent THEN now() ELSE NULL END, p_language
  ) RETURNING id INTO v_brief_id;

  UPDATE public.request_idempotency_keys SET created_brief_id = v_brief_id WHERE id = v_idempotency_rec.id;

  -- 9. Server-Side Verified Item Snapshot Insertion
  FOR v_req_item IN SELECT * FROM jsonb_array_elements(v_normalized_items) LOOP
    SELECT * INTO v_db_item 
    FROM public.caterer_menu_items 
    WHERE id = (v_req_item->>'item_id')::uuid 
      AND caterer_id = p_tenant_id 
      AND status = 'active' 
      AND is_available = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Item % is unavailable or invalid', (v_req_item->>'item_id') USING ERRCODE = '22000';
    END IF;

    INSERT INTO public.catering_brief_item_snapshots (
      brief_id, tenant_id, item_id, item_name, item_description, 
      customer_language, quantity, quantity_unit, pricing_type, 
      fixed_price_cents, customer_notes
    ) VALUES (
      v_brief_id, p_tenant_id, v_db_item.id, v_db_item.name, v_db_item.description, 
      p_language, (v_req_item->>'quantity')::integer, v_db_item.unit, 
      v_db_item.pricing_type, v_db_item.price_cents, v_req_item->>'notes'
    );
  END LOOP;

  -- 10. Status History Entry
  INSERT INTO public.catering_brief_status_history (brief_id, previous_status, new_status, changed_by_user_id, notes)
  VALUES (v_brief_id, NULL, 'submitted', v_user_id, 'Initial enquiry submission');

  RETURN jsonb_build_object('ok', true, 'reference_code', v_ref_code, 'brief_id', v_brief_id, 'is_duplicate', false);
END;
$$;

-- Exact Signature Function Grants
REVOKE EXECUTE ON FUNCTION public.submit_catering_request_atomic(uuid, text, text, text, text, text, date, integer, text, text, jsonb, text, boolean, boolean, boolean, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_catering_request_atomic(uuid, text, text, text, text, text, date, integer, text, text, jsonb, text, boolean, boolean, boolean, text) TO authenticated;


-- ====================================================================
-- MIGRATION 005: RLS POLICIES & SECURITY GRANTS
-- ====================================================================

ALTER TABLE public.request_idempotency_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_reference_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_brief_item_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_brief_status_history ENABLE ROW LEVEL SECURITY;

-- Idempotency Keys & Reference Counters: Private to Service & RPC
REVOKE ALL ON public.request_idempotency_keys FROM public, authenticated, anon;
REVOKE ALL ON public.catering_reference_counters FROM public, authenticated, anon;

-- Snapshots RLS: Visible only to owner customer or admins
CREATE POLICY snapshot_select ON public.catering_brief_item_snapshots
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR 
    EXISTS (SELECT 1 FROM public.catering_briefs b WHERE b.id = brief_id AND b.customer_id = auth.uid())
  );

-- History RLS: Append-only, readable by owner customer or admins
REVOKE UPDATE, DELETE ON public.catering_brief_status_history FROM public, authenticated, anon;

CREATE POLICY history_select ON public.catering_brief_status_history 
  FOR SELECT TO authenticated 
  USING (
    public.is_admin() OR 
    EXISTS (SELECT 1 FROM public.catering_briefs b WHERE b.id = brief_id AND b.customer_id = auth.uid())
  );
