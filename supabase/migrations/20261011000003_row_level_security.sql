-- =============================================================================
-- Gupta Motors — Row Level Security (RLS) Policies
-- Migration: 20261011000003_row_level_security.sql
-- Description: Enable RLS on all public tables and implement granular,
--              least-privilege role-based access control.
-- =============================================================================

-- Enable RLS on all 8 tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motorcycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 1. Policies: public.employees
-- =============================================================================

-- SELECT: Dealership owner and admins see all employee records.
-- Other active employees can view active colleagues for directory lookups.
CREATE POLICY "employees_select_policy"
  ON public.employees
  FOR SELECT
  TO authenticated
  USING (
    public.is_owner_or_admin()
    OR (public.is_active_employee() AND (is_active = true OR id = auth.uid()))
  );

-- INSERT: Only owner or admin can create new employee profiles.
-- (Bootstrap of the very first owner is permitted by guard trigger when table is empty).
CREATE POLICY "employees_insert_policy"
  ON public.employees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_owner_or_admin()
    OR (SELECT count(*) FROM public.employees) = 0
  );

-- UPDATE: Owner and admin can update any employee profile.
-- Individual active employees can update their own personal contact details
-- (role and is_active elevation/tampering are strictly blocked by the guard trigger).
CREATE POLICY "employees_update_policy"
  ON public.employees
  FOR UPDATE
  TO authenticated
  USING (
    public.is_owner_or_admin()
    OR (auth.uid() = id AND public.is_active_employee())
  )
  WITH CHECK (
    public.is_owner_or_admin()
    OR (auth.uid() = id AND public.is_active_employee())
  );

-- DELETE: Only dealership owner can delete employee profiles.
CREATE POLICY "employees_delete_policy"
  ON public.employees
  FOR DELETE
  TO authenticated
  USING (
    public.has_role('owner')
  );

-- =============================================================================
-- 2. Policies: public.customers
-- =============================================================================

-- SELECT: Accessible to sales, service, cashier, manager, and admin staff.
-- Public/unauthenticated and mechanics do NOT have broad customer database access.
CREATE POLICY "customers_select_policy"
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (
    public.has_role('owner', 'admin', 'manager', 'sales', 'service_advisor', 'cashier')
  );

-- INSERT: Sales and service staff can register new customers.
CREATE POLICY "customers_insert_policy"
  ON public.customers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role('owner', 'admin', 'manager', 'sales', 'service_advisor')
  );

-- UPDATE: Sales, service, and managerial staff can update customer contact information.
CREATE POLICY "customers_update_policy"
  ON public.customers
  FOR UPDATE
  TO authenticated
  USING (
    public.has_role('owner', 'admin', 'manager', 'sales', 'service_advisor')
  )
  WITH CHECK (
    public.has_role('owner', 'admin', 'manager', 'sales', 'service_advisor')
  );

-- DELETE: Strictly restricted to dealership owner or admin.
CREATE POLICY "customers_delete_policy"
  ON public.customers
  FOR DELETE
  TO authenticated
  USING (
    public.is_owner_or_admin()
  );

-- =============================================================================
-- 3. Policies: public.motorcycles
-- =============================================================================

-- SELECT: Active models are visible to everyone (including public website queries).
-- Inactive models are visible only to dealership management.
CREATE POLICY "motorcycles_select_active_policy"
  ON public.motorcycles
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    OR public.has_role('owner', 'admin', 'manager')
  );

-- INSERT/UPDATE: Managed by owner, admin, or manager.
CREATE POLICY "motorcycles_insert_policy"
  ON public.motorcycles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role('owner', 'admin', 'manager')
  );

CREATE POLICY "motorcycles_update_policy"
  ON public.motorcycles
  FOR UPDATE
  TO authenticated
  USING (
    public.has_role('owner', 'admin', 'manager')
  )
  WITH CHECK (
    public.has_role('owner', 'admin', 'manager')
  );

-- DELETE: Strictly owner or admin.
CREATE POLICY "motorcycles_delete_policy"
  ON public.motorcycles
  FOR DELETE
  TO authenticated
  USING (
    public.is_owner_or_admin()
  );

-- =============================================================================
-- 4. Policies: public.booking_enquiries
-- =============================================================================

-- SELECT: Accessible to sales, cashiers, and dealership managers.
-- Unauthenticated users have NO direct read access to customer booking records.
CREATE POLICY "booking_enquiries_select_policy"
  ON public.booking_enquiries
  FOR SELECT
  TO authenticated
  USING (
    public.has_role('owner', 'admin', 'manager', 'sales', 'cashier')
  );

-- INSERT: Authorized sales and management personnel can create enquiries.
-- (Public customers submit through the validated security-definer function).
CREATE POLICY "booking_enquiries_insert_policy"
  ON public.booking_enquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role('owner', 'admin', 'manager', 'sales')
  );

-- UPDATE: Sales staff can update enquiry progress, assign staff, or reschedule.
CREATE POLICY "booking_enquiries_update_policy"
  ON public.booking_enquiries
  FOR UPDATE
  TO authenticated
  USING (
    public.has_role('owner', 'admin', 'manager', 'sales')
  )
  WITH CHECK (
    public.has_role('owner', 'admin', 'manager', 'sales')
  );

-- DELETE: Strictly owner or admin.
CREATE POLICY "booking_enquiries_delete_policy"
  ON public.booking_enquiries
  FOR DELETE
  TO authenticated
  USING (
    public.is_owner_or_admin()
  );

-- =============================================================================
-- 5. Policies: public.service_jobs
-- =============================================================================

-- SELECT:
-- Service advisors, cashiers, managers, and sales see workshop jobs.
-- Mechanics ONLY see jobs explicitly assigned to their employee ID.
CREATE POLICY "service_jobs_select_policy"
  ON public.service_jobs
  FOR SELECT
  TO authenticated
  USING (
    public.has_role('owner', 'admin', 'manager', 'service_advisor', 'cashier', 'sales', 'inventory_manager')
    OR (public.has_role('mechanic') AND assigned_employee_id = auth.uid())
  );

-- INSERT: Service advisors and management create service jobs.
CREATE POLICY "service_jobs_insert_policy"
  ON public.service_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role('owner', 'admin', 'manager', 'service_advisor')
  );

-- UPDATE:
-- Service advisors and managers can update all aspects of service jobs.
-- Mechanics can update status and notes ONLY on jobs assigned to them.
CREATE POLICY "service_jobs_update_policy"
  ON public.service_jobs
  FOR UPDATE
  TO authenticated
  USING (
    public.has_role('owner', 'admin', 'manager', 'service_advisor')
    OR (public.has_role('mechanic') AND assigned_employee_id = auth.uid())
  )
  WITH CHECK (
    public.has_role('owner', 'admin', 'manager', 'service_advisor')
    OR (public.has_role('mechanic') AND assigned_employee_id = auth.uid())
  );

-- DELETE: Strictly owner or admin.
CREATE POLICY "service_jobs_delete_policy"
  ON public.service_jobs
  FOR DELETE
  TO authenticated
  USING (
    public.is_owner_or_admin()
  );

-- =============================================================================
-- 6. Policies: public.inventory_products
-- =============================================================================

-- SELECT: All active internal employees can view product details, prices, and stock.
-- Public/unauthenticated users have NO direct read access to inventory records.
CREATE POLICY "inventory_products_select_policy"
  ON public.inventory_products
  FOR SELECT
  TO authenticated
  USING (
    public.is_active_employee()
  );

-- INSERT: Only inventory manager, manager, admin, or owner.
-- Sales staff and mechanics CANNOT add or administer inventory.
CREATE POLICY "inventory_products_insert_policy"
  ON public.inventory_products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role('owner', 'admin', 'manager', 'inventory_manager')
  );

-- UPDATE: Only inventory manager, manager, admin, or owner.
-- Direct stock quantity updates are managed via stock movements ledger.
CREATE POLICY "inventory_products_update_policy"
  ON public.inventory_products
  FOR UPDATE
  TO authenticated
  USING (
    public.has_role('owner', 'admin', 'manager', 'inventory_manager')
  )
  WITH CHECK (
    public.has_role('owner', 'admin', 'manager', 'inventory_manager')
  );

-- DELETE: Strictly owner or admin.
CREATE POLICY "inventory_products_delete_policy"
  ON public.inventory_products
  FOR DELETE
  TO authenticated
  USING (
    public.is_owner_or_admin()
  );

-- =============================================================================
-- 7. Policies: public.stock_movements
-- =============================================================================

-- SELECT: Accessible to inventory managers, cashiers, and dealership leadership.
-- Mechanics and sales staff do not have stock movement audit access.
CREATE POLICY "stock_movements_select_policy"
  ON public.stock_movements
  FOR SELECT
  TO authenticated
  USING (
    public.has_role('owner', 'admin', 'manager', 'inventory_manager', 'cashier')
  );

-- INSERT:
-- Inventory managers and leadership can log receipts, adjustments, returns.
-- Service advisors can log service-consumption movements for jobs.
-- Cashiers can log sale and return movements.
-- recorded_by MUST match the authenticated user's ID.
CREATE POLICY "stock_movements_insert_policy"
  ON public.stock_movements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    recorded_by = auth.uid()
    AND (
      public.has_role('owner', 'admin', 'manager', 'inventory_manager')
      OR (public.has_role('service_advisor') AND movement_type = 'service_consumption')
      OR (public.has_role('cashier') AND movement_type IN ('sale', 'return'))
    )
  );

-- Stock movements are an immutable ledger: NO UPDATE or DELETE policies exist.

-- =============================================================================
-- 8. Policies: public.audit_logs
-- =============================================================================

-- SELECT: Only dealership owner, admin, and general manager can inspect audit records.
CREATE POLICY "audit_logs_select_policy"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    public.has_role('owner', 'admin', 'manager')
  );

-- INSERT: Active employees can insert audit records for legitimate business actions.
CREATE POLICY "audit_logs_insert_policy"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_active_employee()
    AND (actor_id IS NULL OR actor_id = auth.uid())
  );

-- Audit logs are completely immutable: NO UPDATE or DELETE policies exist.
