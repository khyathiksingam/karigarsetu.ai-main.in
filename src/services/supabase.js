import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (import.meta.env.DEV) {
  console.info('Supabase project URL:', supabaseUrl || '(missing)');
}

const hasPlaceholderUrl = !supabaseUrl || supabaseUrl === 'https://your-project.supabase.co';
const hasPlaceholderKey = !supabaseAnonKey || supabaseAnonKey === 'your-anon-key';

export const isSupabaseConfigured = !hasPlaceholderUrl && !hasPlaceholderKey;
export const supabaseConfigurationError = isSupabaseConfigured
  ? ''
  : 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.';

export function getSupabaseDiagnostics() {
  const parsed = (() => {
    try {
      return supabaseUrl ? new URL(supabaseUrl) : null;
    } catch {
      return null;
    }
  })();

  return {
    isConfigured: isSupabaseConfigured,
    url: supabaseUrl || '(missing)',
    host: parsed?.hostname || '(missing)',
    protocol: parsed?.protocol || '(missing)',
    hasAnonKey: Boolean(supabaseAnonKey),
    hasPlaceholderUrl,
    hasPlaceholderKey,
  };
}

let client = null;
if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
  }
}

export const supabase = client;

/**
 * Send OTP via Email (Resend Server API), SMS, or WhatsApp.
 * No hidden fallback auth provider logic is used here.
 */
export async function sendSupabaseOtp({ channel, value }) {
  const cleanVal = (value || '').trim();

  if (channel === 'email') {
    const response = await fetch('/api/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanVal }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Email delivery failed. Please try again.');
    }
    return data;
  }

  if (channel === 'whatsapp') {
    const response = await fetch('/api/send-whatsapp-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: cleanVal }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'WhatsApp provider is not configured.');
    }
    return data;
  }

  const response = await fetch('/api/send-mobile-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile: cleanVal }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'SMS provider is not configured.');
  }
  return data;
}

/**
 * Verify OTP using the existing server-side verification flow.
 */
export async function verifySupabaseOtp({ channel, value, token }) {
  const cleanVal = (value || '').trim();
  const cleanToken = (token || '').trim();

  if (channel === 'email') {
    const response = await fetch('/api/verify-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanVal, otp: cleanToken }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || 'Invalid OTP.');
    }
    return data;
  }

  if (!supabase || !isSupabaseConfigured) {
    throw new Error(channel === 'whatsapp' ? 'WhatsApp provider is not configured.' : 'SMS provider is not configured.');
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone: cleanVal,
    token: cleanToken,
    type: 'sms',
  });
  if (error) throw new Error(error.message || 'Invalid OTP.');
  return data;
}

/**
 * Google Sign-In with the exact OAuth redirect used by Supabase.
 */
let googleAuthRequestInFlight = false;

export async function signInWithGoogle(pendingRole = 'buyer') {
  if (!supabase || !isSupabaseConfigured || !supabaseUrl) {
    throw new Error('Google authentication is not configured correctly.');
  }

  if (googleAuthRequestInFlight) {
    throw new Error('Google sign-in is already in progress. Please wait a moment.');
  }

  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error('Google authentication is not configured correctly.');
  }

  googleAuthRequestInFlight = true;
  sessionStorage.setItem('karigarsetu_google_oauth_inflight', '1');
  localStorage.setItem('karigarsetu_pending_role', pendingRole);

  try {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) throw error;
    return data;
  } finally {
    googleAuthRequestInFlight = false;
    sessionStorage.removeItem('karigarsetu_google_oauth_inflight');
  }
}
