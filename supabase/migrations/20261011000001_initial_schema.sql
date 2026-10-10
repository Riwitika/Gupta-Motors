-- =============================================================================
-- Gupta Motors — Initial Schema Migration
-- Migration: 20261011000001_initial_schema.sql
-- Description: Core normalized tables, types, constraints, and indexes.
-- =============================================================================

-- Ensure necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Custom Types & Enumerations
-- -----------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.employee_role AS ENUM (
    'owner',
    'admin',
    'manager',
    'sales',
    'service_advisor',
    'mechanic',
    'inventory_manager',
    'cashier'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.motorcycle_category AS ENUM (
    'commuter',
    'pulsar',
    'cruiser',
    'tourer'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_enquiry_type AS ENUM (
    'booking',
    'test_ride',
    'pricing_quote',
    'general'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_enquiry_status AS ENUM (
    'new',
    'contacted',
    'scheduled',
    'completed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.service_type AS ENUM (
    'periodic',
    'repair',
    'warranty',
    'express_wash',
    'inspection'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.service_job_status AS ENUM (
    'booked',
    'received',
    'in_progress',
    'completed',
    'delivered',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.product_category AS ENUM (
    'spare_part',
    'lubricant',
    'accessory',
    'merchandise',
    'consumable'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.stock_movement_type AS ENUM (
    'receipt',
    'adjustment',
    'sale',
    'service_consumption',
    'return'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 2. Core Tables
-- -----------------------------------------------------------------------------

-- 2.1 Employees (Linked 1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL CHECK (length(trim(full_name)) >= 2),
  phone text NOT NULL CHECK (length(trim(phone)) >= 10),
  email text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  role public.employee_role NOT NULL DEFAULT 'sales',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2.2 Customers Registry
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (length(trim(full_name)) >= 2),
  phone text NOT NULL CHECK (length(trim(phone)) >= 10),
  email text CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2.3 Motorcycle Catalogue Registry
CREATE TABLE IF NOT EXISTS public.motorcycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id text UNIQUE NOT NULL CHECK (length(trim(model_id)) >= 2),
  name text NOT NULL CHECK (length(trim(name)) >= 2),
  series text NOT NULL,
  category public.motorcycle_category NOT NULL,
  engine_cc numeric(6, 2) NOT NULL CHECK (engine_cc > 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2.4 Booking & Test Ride Enquiries
CREATE TABLE IF NOT EXISTS public.booking_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  motorcycle_id uuid REFERENCES public.motorcycles(id) ON DELETE SET NULL,
  enquiry_type public.booking_enquiry_type NOT NULL DEFAULT 'booking',
  status public.booking_enquiry_status NOT NULL DEFAULT 'new',
  assigned_employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  preferred_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2.5 Service Jobs (Workshop service records)
CREATE TABLE IF NOT EXISTS public.service_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  motorcycle_id uuid REFERENCES public.motorcycles(id) ON DELETE SET NULL,
  registration_number text NOT NULL CHECK (length(trim(registration_number)) >= 4),
  service_type public.service_type NOT NULL DEFAULT 'periodic',
  status public.service_job_status NOT NULL DEFAULT 'booked',
  complaint_notes text NOT NULL CHECK (length(trim(complaint_notes)) >= 3),
  estimated_completion timestamptz,
  assigned_employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2.6 Inventory Products (Genuine spares & lubricants)
CREATE TABLE IF NOT EXISTS public.inventory_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE NOT NULL CHECK (length(trim(sku)) >= 3),
  name text NOT NULL CHECK (length(trim(name)) >= 2),
  category public.product_category NOT NULL DEFAULT 'spare_part',
  cost_price numeric(10, 2) NOT NULL CHECK (cost_price >= 0),
  selling_price numeric(10, 2) NOT NULL CHECK (selling_price >= 0),
  current_stock integer NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  reorder_threshold integer NOT NULL DEFAULT 5 CHECK (reorder_threshold >= 0),
  unit text NOT NULL DEFAULT 'piece',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2.7 Stock Movements (Ledger of all stock changes)
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.inventory_products(id) ON DELETE RESTRICT,
  movement_type public.stock_movement_type NOT NULL,
  quantity integer NOT NULL CHECK (quantity != 0),
  reference_id text,
  notes text,
  recorded_by uuid NOT NULL REFERENCES public.employees(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2.8 Audit Logs (Immutable business action audit ledger)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 3. Indexes for Common Lookups & Foreign Keys
-- -----------------------------------------------------------------------------

-- Employees indexes
CREATE INDEX IF NOT EXISTS idx_employees_role ON public.employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON public.employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_phone ON public.employees(phone);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_full_name ON public.customers(full_name);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);

-- Motorcycles indexes
CREATE INDEX IF NOT EXISTS idx_motorcycles_model_id ON public.motorcycles(model_id);
CREATE INDEX IF NOT EXISTS idx_motorcycles_category ON public.motorcycles(category);
CREATE INDEX IF NOT EXISTS idx_motorcycles_is_active ON public.motorcycles(is_active);

-- Booking enquiries indexes
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_customer ON public.booking_enquiries(customer_id);
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_motorcycle ON public.booking_enquiries(motorcycle_id);
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_assigned ON public.booking_enquiries(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_status ON public.booking_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_created_at ON public.booking_enquiries(created_at DESC);

-- Service jobs indexes
CREATE INDEX IF NOT EXISTS idx_service_jobs_customer ON public.service_jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_jobs_motorcycle ON public.service_jobs(motorcycle_id);
CREATE INDEX IF NOT EXISTS idx_service_jobs_assigned ON public.service_jobs(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_service_jobs_status ON public.service_jobs(status);
CREATE INDEX IF NOT EXISTS idx_service_jobs_reg_no ON public.service_jobs(registration_number);
CREATE INDEX IF NOT EXISTS idx_service_jobs_created_at ON public.service_jobs(created_at DESC);

-- Inventory products indexes
CREATE INDEX IF NOT EXISTS idx_inventory_products_sku ON public.inventory_products(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_products_category ON public.inventory_products(category);
CREATE INDEX IF NOT EXISTS idx_inventory_products_is_active ON public.inventory_products(is_active);
CREATE INDEX IF NOT EXISTS idx_inventory_products_stock ON public.inventory_products(current_stock);

-- Stock movements indexes
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_recorded_by ON public.stock_movements(recorded_by);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON public.stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON public.stock_movements(created_at DESC);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
