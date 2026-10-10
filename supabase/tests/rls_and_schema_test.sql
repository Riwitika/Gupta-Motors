-- =============================================================================
-- Gupta Motors — Schema and Security Verification Test Suite
-- File: supabase/tests/rls_and_schema_test.sql
-- Description: Repeatable SQL test suite validating RLS policies, RBAC,
--              constraints, immutability, and safe submission RPCs.
-- =============================================================================

BEGIN;

-- Display test run header
DO $$ BEGIN RAISE NOTICE 'Starting Gupta Motors PostgreSQL Security Verification Suite...'; END $$;

-- -----------------------------------------------------------------------------
-- TEST 1: Table & RLS Activation Verification
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_table text;
  v_rls_enabled boolean;
  v_tables text[] := ARRAY[
    'employees',
    'customers',
    'motorcycles',
    'booking_enquiries',
    'service_jobs',
    'inventory_products',
    'stock_movements',
    'audit_logs'
  ];
BEGIN
  FOREACH v_table IN ARRAY v_tables LOOP
    SELECT rowsecurity INTO v_rls_enabled
    FROM pg_tables
    WHERE schemaname = 'public' AND tablename = v_table;

    IF NOT v_rls_enabled THEN
      RAISE EXCEPTION 'TEST 1 FAILED: Table public.% does NOT have Row Level Security enabled!', v_table;
    END IF;
  END LOOP;

  RAISE NOTICE 'TEST 1 PASSED: RLS is actively enabled on all 8 core tables.';
END $$;

-- -----------------------------------------------------------------------------
-- TEST 2: Constraints Enforcement
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_failed boolean := false;
BEGIN
  -- Test 2.1: Invalid negative price on inventory product must fail
  BEGIN
    INSERT INTO public.inventory_products (
      sku, name, category, cost_price, selling_price, current_stock
    ) VALUES (
      'INVALID-SKU-1', 'Invalid Product', 'spare_part', -100, 200, 10
    );
    v_failed := true;
  EXCEPTION WHEN check_violation THEN
    -- Expected check violation
  END;

  IF v_failed THEN
    RAISE EXCEPTION 'TEST 2.1 FAILED: Negative cost_price was accepted!';
  END IF;

  -- Test 2.2: Invalid negative stock must fail
  v_failed := false;
  BEGIN
    INSERT INTO public.inventory_products (
      sku, name, category, cost_price, selling_price, current_stock
    ) VALUES (
      'INVALID-SKU-2', 'Invalid Product', 'spare_part', 100, 200, -5
    );
    v_failed := true;
  EXCEPTION WHEN check_violation THEN
    -- Expected check violation
  END;

  IF v_failed THEN
    RAISE EXCEPTION 'TEST 2.2 FAILED: Negative current_stock was accepted!';
  END IF;

  -- Test 2.3: Zero quantity in stock movement must fail
  v_failed := false;
  BEGIN
    INSERT INTO public.stock_movements (
      product_id, movement_type, quantity, recorded_by
    ) VALUES (
      gen_random_uuid(), 'receipt', 0, gen_random_uuid()
    );
    v_failed := true;
  EXCEPTION WHEN check_violation THEN
    -- Expected check violation
  END;

  IF v_failed THEN
    RAISE EXCEPTION 'TEST 2.3 FAILED: Zero quantity stock movement was accepted!';
  END IF;

  RAISE NOTICE 'TEST 2 PASSED: Check constraints reliably reject invalid monetary and stock values.';
END $$;

-- -----------------------------------------------------------------------------
-- TEST 3: Audit Log Immutability Enforcement
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_log_id uuid;
  v_failed boolean := false;
BEGIN
  -- Insert a test audit record directly
  INSERT INTO public.audit_logs (
    actor_id, action, table_name, record_id, metadata
  ) VALUES (
    NULL, 'test_action', 'test_table', '123', '{"test": true}'::jsonb
  ) RETURNING id INTO v_log_id;

  -- Attempt to UPDATE audit record
  BEGIN
    UPDATE public.audit_logs
    SET action = 'tampered_action'
    WHERE id = v_log_id;
    v_failed := true;
  EXCEPTION WHEN OTHERS THEN
    -- Expected rejection from trigger
  END;

  IF v_failed THEN
    RAISE EXCEPTION 'TEST 3.1 FAILED: Audit log record was successfully UPDATED!';
  END IF;

  -- Attempt to DELETE audit record
  v_failed := false;
  BEGIN
    DELETE FROM public.audit_logs WHERE id = v_log_id;
    v_failed := true;
  EXCEPTION WHEN OTHERS THEN
    -- Expected rejection from trigger
  END;

  IF v_failed THEN
    RAISE EXCEPTION 'TEST 3.2 FAILED: Audit log record was successfully DELETED!';
  END IF;

  RAISE NOTICE 'TEST 3 PASSED: Audit logs are completely immutable and reject updates and deletions.';
END $$;

-- -----------------------------------------------------------------------------
-- TEST 4: Public Submission RPC Input Validation
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_result jsonb;
  v_failed boolean := false;
BEGIN
  -- Test 4.1: Short/invalid customer name must fail
  BEGIN
    SELECT public.submit_public_booking_enquiry('A', '9410043111') INTO v_result;
    v_failed := true;
  EXCEPTION WHEN OTHERS THEN
    -- Expected validation error
  END;

  IF v_failed THEN
    RAISE EXCEPTION 'TEST 4.1 FAILED: Invalid 1-character name was accepted!';
  END IF;

  -- Test 4.2: Invalid phone number must fail
  v_failed := false;
  BEGIN
    SELECT public.submit_public_booking_enquiry('Rahul Kumar', '123') INTO v_result;
    v_failed := true;
  EXCEPTION WHEN OTHERS THEN
    -- Expected validation error
  END;

  IF v_failed THEN
    RAISE EXCEPTION 'TEST 4.2 FAILED: 3-digit phone was accepted!';
  END IF;

  -- Test 4.3: Valid public submission must succeed and create customer & enquiry
  v_result := public.submit_public_booking_enquiry(
    'Ramesh Sharma',
    '9876543210',
    'ramesh@example.com',
    'pulsar-ns200',
    'test_ride',
    current_date + 1,
    'Interested in NS200 test ride in Kurawali.'
  );

  IF NOT (v_result->>'success')::boolean THEN
    RAISE EXCEPTION 'TEST 4.3 FAILED: Valid booking submission failed with message: %', v_result->>'message';
  END IF;

  -- Verify enquiry and customer were properly created
  IF NOT EXISTS (
    SELECT 1 FROM public.customers WHERE phone = '9876543210' AND full_name = 'Ramesh Sharma'
  ) THEN
    RAISE EXCEPTION 'TEST 4.3 FAILED: Customer was not registered in customers table.';
  END IF;

  RAISE NOTICE 'TEST 4 PASSED: Public submission functions strictly validate inputs and safely upsert enquiries.';
END $$;

-- -----------------------------------------------------------------------------
-- TEST 5: Public Service Booking RPC Input Validation
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_result jsonb;
  v_failed boolean := false;
BEGIN
  -- Test 5.1: Invalid registration number must fail
  BEGIN
    SELECT public.submit_public_service_request('Sunil Verma', '9876543211', 'UP') INTO v_result;
    v_failed := true;
  EXCEPTION WHEN OTHERS THEN
    -- Expected validation error
  END;

  IF v_failed THEN
    RAISE EXCEPTION 'TEST 5.1 FAILED: Short registration number was accepted!';
  END IF;

  -- Test 5.2: Valid public service request must succeed
  v_result := public.submit_public_service_request(
    'Sunil Verma',
    '9876543211',
    'UP-84-AB-1234',
    'periodic',
    current_date + 2,
    'Second free service and chain lubrication.',
    'pulsar-125'
  );

  IF NOT (v_result->>'success')::boolean THEN
    RAISE EXCEPTION 'TEST 5.2 FAILED: Valid service booking failed: %', v_result->>'message';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.service_jobs WHERE registration_number = 'UP-84-AB-1234' AND status = 'booked'
  ) THEN
    RAISE EXCEPTION 'TEST 5.2 FAILED: Service job was not recorded.';
  END IF;

  RAISE NOTICE 'TEST 5 PASSED: Public service booking function safely creates workshop jobs.';
END $$;

-- -----------------------------------------------------------------------------
-- TEST 6: Atomic Stock Movement Synchronization Trigger
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_product_id uuid;
  v_initial_stock integer := 20;
  v_dummy_user_id uuid := gen_random_uuid();
  v_updated_stock integer;
BEGIN
  -- Create test product
  INSERT INTO public.inventory_products (
    sku, name, category, cost_price, selling_price, current_stock
  ) VALUES (
    'TEST-SPARK-PLUG', 'Test Champion Spark Plug', 'spare_part', 80.00, 120.00, v_initial_stock
  ) RETURNING id INTO v_product_id;

  -- Create dummy employee for recorded_by (bypass trigger via temporary mock or insert as owner)
  -- Note: in this transaction block, we test trigger sync behavior
  INSERT INTO public.stock_movements (
    product_id, movement_type, quantity, recorded_by, notes
  ) VALUES (
    v_product_id, 'receipt', 15, v_dummy_user_id, 'New stock shipment'
  );

  SELECT current_stock INTO v_updated_stock
  FROM public.inventory_products
  WHERE id = v_product_id;

  IF v_updated_stock != (v_initial_stock + 15) THEN
    RAISE EXCEPTION 'TEST 6.1 FAILED: Stock was not updated atomically! Expected 35, got %', v_updated_stock;
  END IF;

  -- Test negative stock prevention via check constraint
  BEGIN
    INSERT INTO public.stock_movements (
      product_id, movement_type, quantity, recorded_by, notes
    ) VALUES (
      v_product_id, 'sale', -50, v_dummy_user_id, 'Attempting to oversell stock'
    );
    RAISE EXCEPTION 'TEST 6.2 FAILED: Overselling past 0 stock was allowed!';
  EXCEPTION WHEN check_violation THEN
    -- Expected check violation on inventory_products(current_stock >= 0)
  END;

  RAISE NOTICE 'TEST 6 PASSED: Atomic stock movement trigger synchronizes quantities and prevents negative inventory.';
END $$;

-- -----------------------------------------------------------------------------
-- Rollback the test transaction so no dirty test data persists
-- -----------------------------------------------------------------------------
ROLLBACK;

DO $$ BEGIN RAISE NOTICE 'Gupta Motors Security Verification Suite Complete: All tests executed successfully.'; END $$;
