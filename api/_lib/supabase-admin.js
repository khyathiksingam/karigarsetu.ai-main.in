import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client. Never import this file from frontend code.
const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const supabaseSecretKey = (
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  ''
).trim();

let client;

export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      'Missing server Supabase configuration. Set SUPABASE_URL and SUPABASE_SECRET_KEY in Vercel.'
    );
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseSecretKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
  }

  return client;
}
