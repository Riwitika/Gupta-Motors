import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const isPlaceholderUrl = (url?: string): boolean => {
  if (!url) return true;
  return (
    url.includes('placeholder.supabase.co') ||
    url.includes('your-project-id.supabase.co') ||
    !url.startsWith('https://')
  );
};

const isPlaceholderKey = (key?: string): boolean => {
  if (!key) return true;
  return (
    key === 'placeholder-anon-key' ||
    key === 'your-anon-key-here' ||
    key.length < 20
  );
};

/**
 * Validates whether live Supabase configuration is present and valid.
 * Does not pretend database connectivity when credentials are placeholders or absent.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(rawUrl && rawKey && !isPlaceholderUrl(rawUrl) && !isPlaceholderKey(rawKey));
};

// Fallback safe dummy endpoint for initialization without breaking client bundling
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-anon-key';

/**
 * Public Supabase client initialized with anonymous publishable key.
 * Service role keys MUST NEVER be bundled into client-side code.
 */
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() && rawUrl ? rawUrl : fallbackUrl,
  isSupabaseConfigured() && rawKey ? rawKey : fallbackKey
);
