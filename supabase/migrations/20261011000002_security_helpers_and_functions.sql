-- =============================================================================
-- Gupta Motors — Security Helpers, Triggers, and Role Enforcement
-- Migration: 20261011000002_security_helpers_and_functions.sql
-- Description: Security Definer helper functions, role guards, stock sync,
--              and audit immutability triggers.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Timestamp Auto-Update Trigger Function
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS trg_employees_updated_at ON public.employees;
CREATE TRIGGER trg_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_customers_updated_at ON public.customers;
CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_motorcycles_updated_at ON public.motorcycles;
CREATE TRIGGER trg_motorcycles_updated_at
  BEFORE UPDATE ON public.motorcycles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_booking_enquiries_updated_at ON public.booking_enquiries;
CREATE TRIGGER trg_booking_enquiries_updated_at
  BEFORE UPDATE ON public.booking_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_service_jobs_updated_at ON public.service_jobs;
CREATE TRIGGER trg_service_jobs_updated_at
  BEFORE UPDATE ON public.service_jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_inventory_products_updated_at ON public.inventory_products;
CREATE TRIGGER trg_inventory_products_updated_at
  BEFORE UPDATE ON public.inventory_products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 2. Security Definer Role & Auth Helpers
-- -----------------------------------------------------------------------------
-- These functions use SECURITY DEFINER with a fixed search_path = public
-- to prevent recursive RLS execution and privilege escalation attacks.

CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.employees
  WHERE id = auth.uid() AND is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_active_employee()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees
    WHERE id = auth.uid() AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role(VARIADIC allowed_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees
    WHERE id = auth.uid()
      AND is_active = true
      AND role::text = ANY(allowed_roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('owner', 'admin')
  );
$$;

-- -----------------------------------------------------------------------------
-- 3. Strict Role-Assignment & Status Protection Trigger
-- -----------------------------------------------------------------------------
-- Ordinary employees must NEVER be able to grant themselves elevated roles,
-- edit their own role, or change active employee status.

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

    -- For subsequent employees, only existing owner or admin can insert
    IF NOT public.is_owner_or_admin() THEN
      RAISE EXCEPTION 'Unauthorized: only dealership owner or admin can create new employee profiles.';
    END IF;

    -- Only owner can create an owner
    IF NEW.role = 'owner' AND NOT public.has_role('owner') THEN
      RAISE EXCEPTION 'Unauthorized: only the existing dealership owner can create an owner profile.';
    END IF;

    RETURN NEW;
  END IF;

  -- UPDATE checks:
  IF (TG_OP = 'UPDATE') THEN
    -- If role or active status is changing:
    IF (OLD.role IS DISTINCT FROM NEW.role) OR (OLD.is_active IS DISTINCT FROM NEW.is_active) THEN
      -- Cannot be updated by someone who is not owner or admin
      IF NOT public.is_owner_or_admin() THEN
        RAISE EXCEPTION 'Unauthorized: only dealership owner or admin can modify employee roles or active status.';
      END IF;

      -- An employee cannot change their own role or active status
      IF OLD.id = auth.uid() AND (OLD.role IS DISTINCT FROM NEW.role) THEN
        RAISE EXCEPTION 'Self-modification forbidden: employees cannot modify their own role.';
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

DROP TRIGGER IF EXISTS trg_guard_employee_insert ON public.employees;
CREATE TRIGGER trg_guard_employee_insert
  BEFORE INSERT ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.guard_employee_mutations();

DROP TRIGGER IF EXISTS trg_guard_employee_update ON public.employees;
CREATE TRIGGER trg_guard_employee_update
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.guard_employee_mutations();

-- -----------------------------------------------------------------------------
-- 4. Atomic Inventory Stock Synchronization Trigger
-- -----------------------------------------------------------------------------
-- Automatically adjusts current_stock in inventory_products when a stock movement is logged.
-- Protects against invalid negative stock via the table check constraint.

CREATE OR REPLACE FUNCTION public.process_stock_movement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Atomically apply quantity adjustment to product
  UPDATE public.inventory_products
  SET current_stock = current_stock + NEW.quantity
  WHERE id = NEW.product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product with ID % not found for stock movement.', NEW.product_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_process_stock_movement ON public.stock_movements;
CREATE TRIGGER trg_process_stock_movement
  AFTER INSERT ON public.stock_movements
  FOR EACH ROW EXECUTE FUNCTION public.process_stock_movement();

-- -----------------------------------------------------------------------------
-- 5. Audit Log Immutability Enforcement
-- -----------------------------------------------------------------------------
-- Business audit records must NEVER be updated or deleted by any user or client.

CREATE OR REPLACE FUNCTION public.prevent_audit_log_tampering()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Audit log entries are immutable: updates and deletions are strictly prohibited.';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_audit_log_update ON public.audit_logs;
CREATE TRIGGER trg_prevent_audit_log_update
  BEFORE UPDATE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_tampering();

DROP TRIGGER IF EXISTS trg_prevent_audit_log_delete ON public.audit_logs;
CREATE TRIGGER trg_prevent_audit_log_delete
  BEFORE DELETE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_tampering();

-- -----------------------------------------------------------------------------
-- 6. Safe Audit Logging Procedure
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.record_audit_event(
  p_action text,
  p_table_name text,
  p_record_id text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id uuid;
  v_sanitized_meta jsonb;
BEGIN
  -- Sanitize metadata to avoid capturing sensitive credentials or tokens
  v_sanitized_meta := p_metadata - 'password' - 'token' - 'access_token' - 'secret' - 'apiKey' - 'service_role';

  INSERT INTO public.audit_logs (
    actor_id,
    action,
    table_name,
    record_id,
    metadata
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    v_sanitized_meta
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;
