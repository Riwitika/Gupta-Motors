/**
 * Gupta Motors — Live Supabase Connectivity Check
 * Performs safe, read-only HTTP health checks against the configured Supabase project.
 * Does not expose or print full secret values.
 */

import * as fs from 'fs';
import * as path from 'path';

async function checkConnection() {
  console.log('\n======================================================');
  console.log('Gupta Motors: Supabase Live Project Connectivity Check');
  console.log('======================================================\n');

  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('✗ .env.local not found in project root.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  let url = '';
  let anonKey = '';

  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [k, ...v] = trimmed.split('=');
    const val = v.join('=').trim().replace(/^["']|["']$/g, '');
    if (k.trim() === 'VITE_SUPABASE_URL') url = val;
    if (k.trim() === 'VITE_SUPABASE_ANON_KEY') anonKey = val;
  }

  // Sanitize URL in case markdown links were copied
  if (url.includes('[') || url.includes(']')) {
    const match = url.match(/https:\/\/[a-zA-Z0-9.-]+\.supabase\.co/);
    if (match) {
      url = match[0];
    }
  }
  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  console.log(`1. Project URL parsed: ${url ? url.replace(/https:\/\/(.{4}).+(.{4})\.supabase\.co/, 'https://$1...$2.supabase.co') : '[MISSING]'}`);
  console.log(`2. Anon Key present: ${anonKey ? `Yes (${anonKey.substring(0, 10)}...${anonKey.substring(anonKey.length - 4)}, length: ${anonKey.length})` : '[MISSING]'}`);

  if (!url || !anonKey) {
    console.error('✗ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local.');
    process.exit(1);
  }

  console.log('\n3. Performing safe, read-only HTTP checks against live project:');

  // Check 1: Auth Service Health & Settings
  try {
    const authStart = Date.now();
    const authRes = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    const authLatency = Date.now() - authStart;

    console.log(`   - Auth Endpoint (${url}/auth/v1/settings):`);
    console.log(`     HTTP Status: ${authRes.status} ${authRes.statusText} (${authLatency}ms)`);

    if (authRes.ok) {
      const authData = await authRes.json() as any;
      console.log(`     Auth Service Status: Healthy (External providers enabled: ${Object.keys(authData?.external || {}).filter(k => authData?.external?.[k]).length || 0})`);
    } else {
      const errText = await authRes.text();
      console.log(`     Auth Service Response: ${errText.substring(0, 150)}`);
    }
  } catch (err: any) {
    console.error(`     ✗ Failed to connect to Auth endpoint: ${err.message}`);
  }

  // Check 2: PostgREST API Service Health & OpenAPI Spec
  try {
    const restStart = Date.now();
    const restRes = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    const restLatency = Date.now() - restStart;

    console.log(`   - PostgREST Root (${url}/rest/v1/):`);
    console.log(`     HTTP Status: ${restRes.status} ${restRes.statusText} (${restLatency}ms)`);

    if (restRes.ok) {
      const spec = await restRes.json() as any;
      const paths = Object.keys(spec?.paths || {});
      console.log(`     Database API Status: Healthy`);
      console.log(`     Available REST endpoints count: ${paths.length}`);
      const customEndpoints = paths.filter(p => !p.startsWith('/rpc/'));
      console.log(`     Tables currently exposed: ${customEndpoints.length > 0 ? customEndpoints.join(', ') : 'None yet (Fresh project awaiting migrations)'}`);
    } else {
      const errText = await restRes.text();
      console.log(`     PostgREST Response: ${errText.substring(0, 150)}`);
    }
  } catch (err: any) {
    console.error(`     ✗ Failed to connect to PostgREST endpoint: ${err.message}`);
  }

  // Check 3: Query check for core tables
  try {
    const tableRes = await fetch(`${url}/rest/v1/motorcycles?select=count`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Range: '0-0',
      },
    });

    console.log(`   - Core Table Query (${url}/rest/v1/motorcycles):`);
    console.log(`     HTTP Status: ${tableRes.status} ${tableRes.statusText}`);

    if (tableRes.status === 404 || tableRes.status === 400) {
      console.log('     Result: Table "motorcycles" does not exist yet. Confirms project is fresh and migrations are pending.');
    } else if (tableRes.ok) {
      console.log('     Result: Table "motorcycles" exists in live database.');
    }
  } catch (err: any) {
    console.error(`     ✗ Query failed: ${err.message}`);
  }

  console.log('\n======================================================\n');
}

checkConnection().catch(err => {
  console.error('Connectivity check error:', err);
  process.exit(1);
});
