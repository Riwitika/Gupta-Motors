-- =============================================================================
-- Gupta Motors — Database Security Hardening Migration
-- Migration: 20261011000006_security_hardening.sql
-- Description: Strengthens stock movement concurrency and quantity directions,
--              locks immutable stock movements with triggers, tightens role
--              guards against admin-on-owner tampering, adds anti-spam rate
--              limiting on public RPCs, and revokes broad execute grants.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Stock Movement Quantity Direction Constraints & Concurrency Lock
-- -----------------------------------------------------------------------------

-- 1.1 Ensure quantity sign aligns strictly with business movement type
ALTER TABLE public.stock_movements
  DROP CONSTRAINT IF EXISTS chk_stock_movement_quantity_direction;

ALTER TABLE public.stock_movements
  ADD CONSTRAINT chk_stock_movement_quantity_direction CHECK (
    (movement_type = 'receipt' AND quantity > 0) OR
    (movement_type = 'sale' AND quantity < 0) OR
    (movement_type = 'service_consumption' AND quantity < 0) OR
    (movement_type = 'return' AND quantity > 0) OR
    (movement_type = 'adjustment' AND quantity != 0)
  );

-- 1.2 Immutable Stock Movements Trigger (blocks UPDATE and DELETE at database engine level)
CREATE OR REPLACE FUNCTION public.prevent_stock_movement_tampering()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Stock movements are an immutable transaction ledger: updates and deletions are strictly prohibited.';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_stock_movement_update ON public.stock_movements;
CREATE TRIGGER trg_prevent_stock_movement_update
  BEFORE UPDATE ON public.stock_movements
  FOR EACH ROW EXECUTE FUNCTION public.prevent_stock_movement_tampering();

DROP TRIGGER IF EXISTS trg_prevent_stock_movement_delete ON public.stock_movements;
CREATE TRIGGER trg_prevent_stock_movement_delete
  BEFORE DELETE ON public.stock_movements
  FOR EACH ROW EXECUTE FUNCTION public.prevent_stock_movement_tampering();

-- 1.3 Hardened Stock Movement Processor with Row Locking (FOR UPDATE)
-- Serializes concurrent transactions for the same product to prevent race conditions.
CREATE OR REPLACE FUNCTION public.process_stock_movement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_stock integer;
BEGIN
  -- Acquire row-level exclusive lock on the target product
  SELECT current_stock INTO v_current_stock
  FROM public.inventory_products
  WHERE id = NEW.product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product with ID % not found for stock movement.', NEW.product_id;
  END IF;

  -- Validate that deduction does not exceed current physical stock
  IF (v_current_stock + NEW.quantity) < 0 THEN
    RAISE EXCEPTION 'Insufficient inventory: product has % units available, attempted deduction of % units.',
      v_current_stock, abs(NEW.quantity);
  END IF;

  -- Apply atomic update
  UPDATE public.inventory_products
  SET current_stock = current_stock + NEW.quantity
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. Hardened Employee Mutation Guard (Owner Protection & Immutability)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.guard_employee_mutations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  employee_count integer;
BEGIN
  -- INSERT checks:
  IF (TG_OP = 'INSERT') THEN
    SELECT count(*) INTO employee_count FROM public.employees;

    -- Allow bootstrap of the first owner record if table is empty
    IF employee_count = 0 THEN
      IF NEW.role != 'owner' THEN
        RAISE EXCEPTION 'First employee record must be assigned role "owner".';
      END IF;
      RETURN NEW;
    END IF;

    -- Only existing owner or admin can insert
    IF NOT public.is_owner_or_admin() THEN
      RAISE EXCEPTION 'Unauthorized: only dealership owner or admin can create new employee profiles.';
    END IF;

    -- Only owner can create another owner
    IF NEW.role = 'owner' AND NOT public.has_role('owner') THEN
      RAISE EXCEPTION 'Unauthorized: only the existing dealership owner can create an owner profile.';
    END IF;

    RETURN NEW;
  END IF;

  -- UPDATE checks:
  IF (TG_OP = 'UPDATE') THEN
    -- Protect employee ID from being mutated
    IF (OLD.id IS DISTINCT FROM NEW.id) THEN
      RAISE EXCEPTION 'Employee ID is immutable and cannot be changed.';
    END IF;

    -- Protect owner records from being modified or deactivated by admins
    IF (OLD.role = 'owner') AND (OLD.id != auth.uid()) AND NOT public.has_role('owner') THEN
      RAISE EXCEPTION 'Unauthorized: only the dealership owner can modify an owner profile.';
    END IF;

    -- If role or active status is changing:
    IF (OLD.role IS DISTINCT FROM NEW.role) OR (OLD.is_active IS DISTINCT FROM NEW.is_active) THEN
      -- Must be owner or admin
      IF NOT public.is_owner_or_admin() THEN
        RAISE EXCEPTION 'Unauthorized: only dealership owner or admin can modify employee roles or active status.';
      END IF;

      -- An employee cannot change their own role or active status (prevents self-elevation or self-reactivation)
      IF OLD.id = auth.uid() THEN
        RAISE EXCEPTION 'Self-modification forbidden: employees cannot modify their own role or active status.';
      END IF;

      -- Elevating to 'owner' requires caller to be 'owner'
      IF NEW.role = 'owner' AND OLD.role != 'owner' AND NOT public.has_role('owner') THEN
        RAISE EXCEPTION 'Unauthorized: only the dealership owner can elevate another user to owner.';
      END IF;
    END IF;

    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. Hardened Public Submission Functions with Anti-Spam Rate Limiting
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

  -- Normalize phone (digits only)
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

  -- 3. Lookup motorcycle model if provided
  IF p_motorcycle_model_id IS NOT NULL AND trim(p_motorcycle_model_id) != '' THEN
    SELECT id INTO v_motorcycle_id
    FROM public.motorcycles
    WHERE model_id = trim(p_motorcycle_model_id)
      AND is_active = true
    LIMIT 1;
  END IF;

  -- 4. Upsert customer record based on phone number (does not overwrite existing verified name)
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
    -- Populate email only if customer record didn't have one
    IF v_clean_email IS NOT NULL THEN
      UPDATE public.customers
      SET email = COALESCE(email, v_clean_email)
      WHERE id = v_customer_id;
    END IF;
  END IF;

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

  -- 4. Upsert customer
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

-- -----------------------------------------------------------------------------
-- 4. Function Execution Privilege Revocations
-- -----------------------------------------------------------------------------
-- Revoke default public execution privileges on internal security functions

REVOKE ALL ON FUNCTION public.guard_employee_mutations() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.process_stock_movement() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.prevent_stock_movement_tampering() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.prevent_audit_log_tampering() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_audit_event(text, text, text, jsonb) FROM PUBLIC;

-- Explicitly allow only authenticated staff to execute the audit event logger
GRANT EXECUTE ON FUNCTION public.record_audit_event(text, text, text, jsonb) TO authenticated;
