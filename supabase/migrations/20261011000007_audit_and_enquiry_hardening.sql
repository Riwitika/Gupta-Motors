-- =============================================================================
-- Gupta Motors — Audit and Enquiry Security Hardening
-- Migration: 20261011000007_audit_and_enquiry_hardening.sql
-- Description: Enforces customer phone uniqueness to prevent duplicate records
--              under concurrent requests, hardens audit_logs insert policy
--              so authenticated staff cannot forge anonymous audit events,
--              and enforces strict motorcycle model validation in enquiries.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Unique Customer Phone Constraint
-- -----------------------------------------------------------------------------
-- Ensures one canonical customer record per phone number, supporting atomic upserts.
CREATE UNIQUE INDEX IF NOT EXISTS uq_customers_phone ON public.customers(phone);

-- -----------------------------------------------------------------------------
-- 2. Hardened Audit Log Insert Policy
-- -----------------------------------------------------------------------------
-- Authenticated staff MUST identify themselves: actor_id cannot be NULL when
-- inserted directly by an authenticated client. (Anonymous events are inserted
-- only via security-definer RPCs).

DROP POLICY IF EXISTS "audit_logs_insert_policy" ON public.audit_logs;

CREATE POLICY "audit_logs_insert_policy"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_active_employee()
    AND actor_id = auth.uid()
  );

-- -----------------------------------------------------------------------------
-- 3. Atomic Customer Upsert & Strict Model Validation in Booking Enquiry RPC
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.submit_public_booking_enquiry(
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text DEFAULT NULL,
  p_motorcycle_model_id text DEFAULT NULL,
  p_enquiry_type text DEFAULT 'booking',
  p_preferred_date date DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean_name text;
  v_clean_phone text;
  v_clean_email text;
  v_clean_notes text;
  v_customer_id uuid;
  v_motorcycle_id uuid;
  v_enquiry_id uuid;
  v_recent_enquiries integer;
BEGIN
  -- 1. Input sanitization & validation
  v_clean_name := trim(p_customer_name);
  IF length(v_clean_name) < 2 OR length(v_clean_name) > 100 THEN
    RAISE EXCEPTION 'Invalid customer name: must be between 2 and 100 characters.';
  END IF;

  v_clean_phone := regexp_replace(p_customer_phone, '\D', '', 'g');
  IF length(v_clean_phone) < 10 OR length(v_clean_phone) > 15 THEN
    RAISE EXCEPTION 'Invalid phone number: must contain between 10 and 15 digits.';
  END IF;

  -- 2. Anti-spam rate limiting: max 5 submissions per phone number per hour
  SELECT count(*) INTO v_recent_enquiries
  FROM public.booking_enquiries be
  JOIN public.customers c ON be.customer_id = c.id
  WHERE c.phone = v_clean_phone
    AND be.created_at > (now() - interval '1 hour');

  IF v_recent_enquiries >= 5 THEN
    RAISE EXCEPTION 'Too many enquiries submitted from this phone number recently. Please call Gupta Motors directly at 9410043111.';
  END IF;

  -- Validate optional email
  v_clean_email := NULLIF(trim(p_customer_email), '');
  IF v_clean_email IS NOT NULL AND v_clean_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email address format.';
  END IF;

  -- Validate enquiry type
  IF p_enquiry_type NOT IN ('booking', 'test_ride', 'pricing_quote', 'general') THEN
    RAISE EXCEPTION 'Invalid enquiry type specified.';
  END IF;

  -- Validate preferred date
  IF p_preferred_date IS NOT NULL AND p_preferred_date < current_date THEN
    RAISE EXCEPTION 'Preferred date cannot be in the past.';
  END IF;

  v_clean_notes := substr(trim(COALESCE(p_notes, '')), 1, 1000);

  -- 3. Lookup and strictly validate motorcycle model if provided
  IF p_motorcycle_model_id IS NOT NULL AND trim(p_motorcycle_model_id) != '' THEN
    SELECT id INTO v_motorcycle_id
    FROM public.motorcycles
    WHERE model_id = trim(p_motorcycle_model_id)
      AND is_active = true
    LIMIT 1;

    IF v_motorcycle_id IS NULL THEN
      RAISE EXCEPTION 'Motorcycle model "%" not found or is currently inactive.', trim(p_motorcycle_model_id);
    END IF;
  END IF;

  -- 4. Atomic customer upsert: race-condition safe via ON CONFLICT (phone)
  INSERT INTO public.customers (
    full_name,
    phone,
    email,
    notes
  ) VALUES (
    v_clean_name,
    v_clean_phone,
    v_clean_email,
    'Registered via public website enquiry'
  )
  ON CONFLICT (phone) DO UPDATE
  SET email = COALESCE(public.customers.email, EXCLUDED.email)
  RETURNING id INTO v_customer_id;

  -- 5. Insert booking enquiry
  INSERT INTO public.booking_enquiries (
    customer_id,
    motorcycle_id,
    enquiry_type,
    status,
    preferred_date,
    notes
  ) VALUES (
    v_customer_id,
    v_motorcycle_id,
    p_enquiry_type::public.booking_enquiry_type,
    'new',
    p_preferred_date,
    v_clean_notes
  ) RETURNING id INTO v_enquiry_id;

  -- 6. Record anonymous audit event
  INSERT INTO public.audit_logs (
    actor_id,
    action,
    table_name,
    record_id,
    metadata
  ) VALUES (
    NULL,
    'public_enquiry_received',
    'booking_enquiries',
    v_enquiry_id::text,
    jsonb_build_object(
      'enquiry_type', p_enquiry_type,
      'model_id', p_motorcycle_model_id,
      'phone_last4', right(v_clean_phone, 4)
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'enquiry_id', v_enquiry_id,
    'message', 'Your enquiry has been received by Gupta Motors. Our sales desk will contact you.'
  );
END;
$$;

-- -----------------------------------------------------------------------------
-- 4. Atomic Customer Upsert in Workshop Service Request RPC
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.submit_public_service_request(
  p_customer_name text,
  p_customer_phone text,
  p_registration_number text,
  p_service_type text DEFAULT 'periodic',
  p_preferred_date date DEFAULT NULL,
  p_complaint_notes text DEFAULT '',
  p_bike_model_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean_name text;
  v_clean_phone text;
  v_clean_reg text;
  v_clean_notes text;
  v_customer_id uuid;
  v_motorcycle_id uuid;
  v_job_id uuid;
  v_recent_requests integer;
BEGIN
  -- 1. Input sanitization & validation
  v_clean_name := trim(p_customer_name);
  IF length(v_clean_name) < 2 OR length(v_clean_name) > 100 THEN
    RAISE EXCEPTION 'Invalid customer name: must be between 2 and 100 characters.';
  END IF;

  v_clean_phone := regexp_replace(p_customer_phone, '\D', '', 'g');
  IF length(v_clean_phone) < 10 OR length(v_clean_phone) > 15 THEN
    RAISE EXCEPTION 'Invalid phone number: must contain between 10 and 15 digits.';
  END IF;

  -- 2. Anti-spam rate limiting: max 5 service requests per phone per hour
  SELECT count(*) INTO v_recent_requests
  FROM public.service_jobs sj
  JOIN public.customers c ON sj.customer_id = c.id
  WHERE c.phone = v_clean_phone
    AND sj.created_at > (now() - interval '1 hour');

  IF v_recent_requests >= 5 THEN
    RAISE EXCEPTION 'Too many service bookings submitted from this phone number recently. Please call Gupta Motors Workshop directly at 9410043111.';
  END IF;

  v_clean_reg := upper(trim(p_registration_number));
  IF length(v_clean_reg) < 4 OR length(v_clean_reg) > 20 OR v_clean_reg !~* '^[A-Z0-9 -]{4,20}$' THEN
    RAISE EXCEPTION 'Invalid vehicle registration number format.';
  END IF;

  IF p_service_type NOT IN ('periodic', 'repair', 'warranty', 'express_wash', 'inspection') THEN
    RAISE EXCEPTION 'Invalid service type requested.';
  END IF;

  IF p_preferred_date IS NOT NULL AND p_preferred_date < current_date THEN
    RAISE EXCEPTION 'Preferred service appointment date cannot be in the past.';
  END IF;

  v_clean_notes := substr(trim(COALESCE(p_complaint_notes, 'Routine service request')), 1, 1000);
  IF length(v_clean_notes) < 3 THEN
    v_clean_notes := 'Routine periodic service requested';
  END IF;

  -- 3. Lookup motorcycle model if provided
  IF p_bike_model_id IS NOT NULL AND trim(p_bike_model_id) != '' THEN
    SELECT id INTO v_motorcycle_id
    FROM public.motorcycles
    WHERE model_id = trim(p_bike_model_id)
      AND is_active = true
    LIMIT 1;
  END IF;

  -- 4. Atomic customer upsert: race-condition safe via ON CONFLICT (phone)
  INSERT INTO public.customers (
    full_name,
    phone,
    notes
  ) VALUES (
    v_clean_name,
    v_clean_phone,
    'Registered via public website service booking'
  )
  ON CONFLICT (phone) DO NOTHING;

  SELECT id INTO v_customer_id
  FROM public.customers
  WHERE phone = v_clean_phone
  LIMIT 1;

  -- 5. Insert service job
  INSERT INTO public.service_jobs (
    customer_id,
    motorcycle_id,
    registration_number,
    service_type,
    status,
    complaint_notes,
    estimated_completion
  ) VALUES (
    v_customer_id,
    v_motorcycle_id,
    v_clean_reg,
    p_service_type::public.service_type,
    'booked',
    v_clean_notes,
    CASE WHEN p_preferred_date IS NOT NULL THEN (p_preferred_date::timestamptz + interval '18 hours') ELSE NULL END
  ) RETURNING id INTO v_job_id;

  -- 6. Record anonymous audit event
  INSERT INTO public.audit_logs (
    actor_id,
    action,
    table_name,
    record_id,
    metadata
  ) VALUES (
    NULL,
    'public_service_booked',
    'service_jobs',
    v_job_id::text,
    jsonb_build_object(
      'service_type', p_service_type,
      'registration_number', v_clean_reg,
      'preferred_date', p_preferred_date
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'job_id', v_job_id,
    'message', 'Service appointment booked successfully at Gupta Motors Workshop.'
  );
END;
$$;
