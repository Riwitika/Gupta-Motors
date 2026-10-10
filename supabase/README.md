# Gupta Motors — Supabase Database & Security Foundation

This directory contains version-controlled, standard PostgreSQL migrations, Row Level Security (RLS) policies, security helper functions, seed data, and verification suites for **Gupta Motors** (`Kurawali, Mainpuri, Uttar Pradesh`).

---

## 1. Database Architecture & Normalized Schema

The database schema is strictly normalized across 8 core relational tables:

```
auth.users (Supabase Auth)
    │
    └── (1:1) ── public.employees (roles: owner, admin, manager, sales, service_advisor, mechanic, inventory_manager, cashier)
                     │
                     ├── recorded_by ── public.stock_movements ── (N:1) ── public.inventory_products
                     ├── assigned ────── public.booking_enquiries ── (N:1) ── public.customers
                     └── assigned ────── public.service_jobs ────── (N:1) ── public.customers
                                                │
                                                └── (N:1) ── public.motorcycles (catalogue)

public.audit_logs (Immutable audit ledger with triggers blocking UPDATE & DELETE)
```

### Table Overview

| Table | Description | Primary Key | Key Security & Constraints |
|---|---|---|---|
| `public.employees` | Internal staff profiles & database-backed roles | `id` (references `auth.users.id`) | Protected by `guard_employee_mutations` trigger against self-promotion. Role defaults to `sales`. |
| `public.customers` | Verified dealership customer registry | `id` (UUID) | Validated phone (10–15 digits) with B-tree index. |
| `public.motorcycles` | Official Bajaj motorcycle catalogue models | `id` (UUID) | Unique `model_id` slug, engine displacement check (`> 0`). |
| `public.booking_enquiries` | Customer test rides & vehicle bookings | `id` (UUID) | Foreign keys to `customers` and `motorcycles`, status tracking. |
| `public.service_jobs` | Workshop service job cards & repairs | `id` (UUID) | Vehicle registration validation, service type enum, assignment. |
| `public.inventory_products` | Genuine OEM spare parts & lubricants | `id` (UUID) | Unique `sku`, non-negative constraints on `cost_price`, `selling_price`, `current_stock`. |
| `public.stock_movements` | Stock transactions (receipts, sales, consumption) | `id` (UUID) | Non-zero `quantity`. Trigger automatically updates `inventory_products.current_stock` atomically. |
| `public.audit_logs` | Immutable log of business & public operations | `id` (UUID) | Trigger raises exception on any `UPDATE` or `DELETE`. Sanitizes credentials. |

---

## 2. Role-Based Access Control (RBAC) Matrix

Row Level Security is enabled on **all 8 tables**. Roles are read directly from `public.employees` inside PostgreSQL via `SECURITY DEFINER` functions with fixed `search_path = public`:

| Role | Employees | Customers | Motorcycles | Bookings | Service Jobs | Inventory | Stock Movements | Audit Logs |
|---|---|---|---|---|---|---|---|---|
| **owner** | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full CRUD | SELECT |
| **admin** | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full CRUD | SELECT |
| **manager** | SELECT active | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full CRUD | SELECT |
| **sales** | SELECT active | SELECT, INSERT, UPDATE | SELECT | SELECT, INSERT, UPDATE | SELECT | SELECT (view stock) | None | None |
| **service_advisor** | SELECT active | SELECT, INSERT, UPDATE | SELECT | SELECT | Full CRUD | SELECT (view parts) | INSERT (`service_consumption`) | None |
| **mechanic** | None | None | SELECT | None | SELECT, UPDATE (assigned jobs only) | SELECT (view parts) | None | None |
| **inventory_manager** | SELECT active | None | SELECT | None | SELECT | Full CRUD | Full CRUD | None |
| **cashier** | SELECT active | SELECT | SELECT | SELECT | SELECT | SELECT | INSERT (`sale`, `return`) | None |
| **anon (Public)** | None | None | SELECT (`is_active = true`) | Secure RPC only | Secure RPC only | None | None | None |

---

## 3. Migration Files Sequence

Migrations are located in `supabase/migrations/` and should be applied in numeric order:

1. **`20261011000001_initial_schema.sql`**
   - Custom enums, 8 core tables, check constraints, foreign keys, and indexes.
2. **`20261011000002_security_helpers_and_functions.sql`**
   - Security helper functions (`get_current_role`, `is_active_employee`, `has_role`, `is_owner_or_admin`).
   - `guard_employee_mutations` trigger preventing self-elevation or unauthorized role edits.
   - `process_stock_movement` trigger synchronizing inventory stock atomically.
   - `prevent_audit_log_tampering` trigger enforcing audit log immutability.
   - `record_audit_event` sanitized audit logger.
3. **`20261011000003_row_level_security.sql`**
   - Enables RLS on all 8 tables.
   - Granular least-privilege policies for each employee role.
4. **`20261011000004_public_submission_functions.sql`**
   - `public.submit_public_booking_enquiry(...)`: Validated entry point for public test-ride and booking enquiries.
   - `public.submit_public_service_request(...)`: Validated entry point for public workshop service requests.
5. **`20261011000005_catalogue_seed.sql`**
   - Seeds verified Bajaj models (Pulsar NS200, N160, 125, Dominar 400, Avenger 220, Platina 110 ABS, CT 110X, etc.).
6. **`20261011000006_security_hardening.sql`**
   - Stock movement quantity direction checks (`chk_stock_movement_quantity_direction`).
   - Immutable stock movements trigger (`prevent_stock_movement_tampering`).
   - Row-level lock (`FOR UPDATE`) in stock processor to serialize concurrent transactions.
   - Owner protection preventing admins from demoting/deactivating owner records.
   - Anti-spam rate limiting on public booking and service RPCs.
   - Execution privilege revocations from `PUBLIC`.

---

## 4. How to Configure & Apply to Supabase

### Option A: Using Supabase Dashboard (Web SQL Editor)

1. Open your Supabase project at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor**.
3. Run each migration file in order (`000001` through `000006`).
4. Each migration file is idempotent and wrapped with safe guards.

### Option B: Using Supabase CLI

If you have Supabase CLI installed:
```bash
# Link your local repo to your remote project
supabase link --project-ref your-project-id

# Push all migrations
supabase db push
```

---

## 5. Securely Bootstrapping the Initial Dealership Owner

> **IMPORTANT:** Never commit service-role keys or passwords to Git. The first employee record must have the role `'owner'`.

### Step 1: Create the User in Supabase Auth
In Supabase Dashboard under **Authentication > Users**, invite or create the user:
- Email: `vishal.gupta@guptamotors.in` (or owner's email)
- Password: [Secure temporary password]
- Copy the generated `User UID` (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).

### Step 2: Assign Owner Profile via SQL
In the Supabase SQL Editor, insert the owner record:
```sql
INSERT INTO public.employees (
  id,
  full_name,
  phone,
  email,
  role,
  is_active
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- Replace with Auth UID
  'Vishal Gupta',
  '9410043111',
  'vishal.gupta@guptamotors.in',
  'owner',
  true
);
```

Because `employees` is initially empty, the `guard_employee_mutations` trigger allows this first insertion as `owner`. From this point forward, only this owner (or created admins) can create or modify other employee profiles.

---

## 6. Testing & Verification

### Automated Schema & Security Verification
To run the automated test suite locally:
```bash
npm run test:db
```
This runs 38 automated checks verifying migration file order, table definitions, RLS activation across all tables, role coverage, security-definer execution modes, and secret hygiene.

### SQL Transactional Test Suite
To test constraints, triggers, and RPCs directly against a live or local PostgreSQL database:
```bash
psql -d "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" -f supabase/tests/rls_and_schema_test.sql
```
The test script runs in an isolated `BEGIN ... ROLLBACK` transaction and verifies:
1. RLS is actively enabled on all 8 tables.
2. Check constraints reject negative prices, negative stock, and invalid phone numbers.
3. Audit log records reject `UPDATE` and `DELETE`.
4. Public submission functions validate names and phone numbers, safely creating customer and enquiry rows.
5. Stock movement triggers adjust stock atomically and block transactions that would oversell below zero.

---

## 7. Status Disclosure

- **Local/Static Verification**: Passed 38/38 checks with 0 failures (`npm run test:db`).
- **Production Build**: Passed (`tsc && vite build`).
- **Live Supabase Execution**: Migrations are prepared and version-controlled locally. They have **not** yet been applied to a live Supabase remote project (requires user's remote project credentials).
