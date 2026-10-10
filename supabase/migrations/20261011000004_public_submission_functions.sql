-- =============================================================================
-- Gupta Motors — Narrowly Scoped Public Submission Functions
-- Migration: 20261011000004_public_submission_functions.sql
-- Description: Input-validated, security-definer entry points allowing
--              unauthenticated website customers to submit test ride,
--              booking, and workshop service enquiries safely.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Public Booking & Test Ride Enquiry Submission
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
BEGIN
  -- 1. Input sanitization & validation
  v_clean_name := trim(p_customer_name);
  IF length(v_clean_name) < 2 OR length(v_clean_name) > 100 THEN
    RAISE EXCEPTION 'Invalid customer name: must be between 2 and 100 characters.';
  END IF;

  -- Normalize phone (strip non-digits)
  v_clean_phone := regexp_replace(p_customer_phone, '\D', '', 'g');
  IF length(v_clean_phone) < 10 OR length(v_clean_phone) > 15 THEN
    RAISE EXCEPTION 'Invalid phone number: must contain between 10 and 15 digits.';
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

  -- Validate preferred date if provided
  IF p_preferred_date IS NOT NULL AND p_preferred_date < current_date THEN
    RAISE EXCEPTION 'Preferred date cannot be in the past.';
  END IF;

  -- Sanitize notes length
  v_clean_notes := substr(trim(COALESCE(p_notes, '')), 1, 1000);

  -- 2. Lookup motorcycle model if provided
  IF p_motorcycle_model_id IS NOT NULL AND trim(p_motorcycle_model_id) != '' THEN
    SELECT id INTO v_motorcycle_id
    FROM public.motorcycles
    WHERE model_id = trim(p_motorcycle_model_id)
      AND is_active = true
    LIMIT 1;
  END IF;

  -- 3. Upsert customer record based on phone number
  SELECT id INTO v_customer_id
  FROM public.customers
  WHERE phone = v_clean_phone
  LIMIT 1;

  IF v_customer_id IS NULL THEN
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
    ) RETURNING id INTO v_customer_id;
  ELSE
    -- Keep existing customer, update email if newly provided
    IF v_clean_email IS NOT NULL THEN
      UPDATE public.customers
      SET email = COALESCE(email, v_clean_email)
      WHERE id = v_customer_id;
    END IF;
  END IF;

  -- 4. Insert booking enquiry
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

  -- 5. Record anonymous audit event
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

-- Revoke default execute permissions and explicitly grant to anon and authenticated
REVOKE ALL ON FUNCTION public.submit_public_booking_enquiry FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_booking_enquiry TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 2. Public Workshop Service Booking Submission
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

  v_clean_reg := upper(trim(p_registration_number));
  IF length(v_clean_reg) < 4 OR length(v_clean_reg) > 20 THEN
    RAISE EXCEPTION 'Invalid vehicle registration number: must be between 4 and 20 characters.';
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

  -- 2. Lookup motorcycle model if provided
  IF p_bike_model_id IS NOT NULL AND trim(p_bike_model_id) != '' THEN
    SELECT id INTO v_motorcycle_id
    FROM public.motorcycles
    WHERE model_id = trim(p_bike_model_id)
    LIMIT 1;
  END IF;

  -- 3. Upsert customer
  SELECT id INTO v_customer_id
  FROM public.customers
  WHERE phone = v_clean_phone
  LIMIT 1;

  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (
      full_name,
      phone,
      notes
    ) VALUES (
      v_clean_name,
      v_clean_phone,
      'Registered via public website service booking'
    ) RETURNING id INTO v_customer_id;
  END IF;

  -- 4. Insert service job
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

  -- 5. Record anonymous audit event
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

REVOKE ALL ON FUNCTION public.submit_public_service_request FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_service_request TO anon, authenticated;
