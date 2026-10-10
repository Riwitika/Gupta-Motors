/**
 * Gupta Motors — Database Schema & Security Static Verification Runner
 * Runs automated checks verifying migration ordering, table definitions,
 * RLS enablement, security helper functions, trigger integrity, and secret hygiene.
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assertTest(name: string, condition: boolean, details?: string) {
  results.push({ name, passed: condition, details });
  if (condition) {
    console.log(`  ✓ ${name}`);
  } else {
    console.error(`  ✗ ${name} — ${details || 'Failed'}`);
  }
}

async function runVerification() {
  console.log('\n======================================================');
  console.log('Gupta Motors: Supabase Database & Security Verification');
  console.log('======================================================\n');

  const migrationsDir = path.resolve(process.cwd(), 'supabase/migrations');

  // Test 1: Migrations directory exists
  assertTest(
    'Migrations directory exists',
    fs.existsSync(migrationsDir),
    `Path ${migrationsDir} must exist`
  );

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  // Test 2: Migration sequence check
  const expectedPrefixes = [
    '20261011000001_initial_schema.sql',
    '20261011000002_security_helpers_and_functions.sql',
    '20261011000003_row_level_security.sql',
    '20261011000004_public_submission_functions.sql',
    '20261011000005_catalogue_seed.sql',
  ];

  assertTest(
    'Expected migration files exist and in order',
    expectedPrefixes.every(f => files.includes(f)),
    `Found files: ${files.join(', ')}`
  );

  // Combine migrations content for comprehensive checks
  const allSql = files.map(f => fs.readFileSync(path.join(migrationsDir, f), 'utf-8')).join('\n');

  // Test 3: Required tables defined
  const requiredTables = [
    'public.employees',
    'public.customers',
    'public.motorcycles',
    'public.booking_enquiries',
    'public.service_jobs',
    'inventory_products',
    'stock_movements',
    'audit_logs',
  ];

  requiredTables.forEach(tbl => {
    const tableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS (public\\.)?${tbl.replace('public.', '')}`, 'i');
    assertTest(
      `Table created: ${tbl}`,
      tableRegex.test(allSql),
      `Expected CREATE TABLE definition for ${tbl}`
    );
  });

  // Test 4: RLS enabled on all 8 tables
  const rlsTables = [
    'public.employees',
    'public.customers',
    'public.motorcycles',
    'public.booking_enquiries',
    'public.service_jobs',
    'public.inventory_products',
    'public.stock_movements',
    'public.audit_logs',
  ];

  rlsTables.forEach(tbl => {
    const rlsRegex = new RegExp(`ALTER TABLE ${tbl} ENABLE ROW LEVEL SECURITY;`, 'i');
    assertTest(
      `RLS enabled on: ${tbl}`,
      rlsRegex.test(allSql),
      `Missing ALTER TABLE ${tbl} ENABLE ROW LEVEL SECURITY;`
    );
  });

  // Test 5: Role definition includes all 8 specified roles
  const roles = [
    'owner',
    'admin',
    'manager',
    'sales',
    'service_advisor',
    'mechanic',
    'inventory_manager',
    'cashier',
  ];

  roles.forEach(role => {
    assertTest(
      `Role supported: ${role}`,
      allSql.includes(`'${role}'`),
      `Role ${role} missing in schema definition`
    );
  });

  // Test 6: Security Definer helper functions with fixed search_path = public
  const secDefinerFunctions = [
    'get_current_role',
    'is_active_employee',
    'has_role',
    'is_owner_or_admin',
    'guard_employee_mutations',
    'process_stock_movement',
    'submit_public_booking_enquiry',
    'submit_public_service_request',
  ];

  secDefinerFunctions.forEach(fn => {
    const fnRegex = new RegExp(`CREATE OR REPLACE FUNCTION public\\.${fn}[\\s\\S]*?SECURITY DEFINER[\\s\\S]*?SET search_path = public`, 'i');
    assertTest(
      `Security Definer with safe search_path: ${fn}`,
      fnRegex.test(allSql),
      `Function ${fn} must specify SECURITY DEFINER and SET search_path = public`
    );
  });

  // Test 7: Audit log immutability trigger attached
  assertTest(
    'Audit log UPDATE/DELETE prevented by trigger',
    allSql.includes('trg_prevent_audit_log_update') && allSql.includes('trg_prevent_audit_log_delete'),
    'Audit logs must have triggers preventing UPDATE and DELETE'
  );

  // Test 8: Secret and sensitive token hygiene
  const dangerousPatterns = [
    /service_role_key\s*=/i,
    /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/i,
    /sbp_[a-zA-Z0-9]{30,}/i,
  ];

  dangerousPatterns.forEach((pat, i) => {
    assertTest(
      `No committed secret token pattern #${i + 1}`,
      !pat.test(allSql),
      'Found potential secret or service token pattern in SQL files!'
    );
  });

  console.log('\n------------------------------------------------------');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  console.log(`Summary: ${passed}/${total} checks passed (${failed} failures)`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Verification script error:', err);
  process.exit(1);
});
