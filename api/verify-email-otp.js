import crypto from 'crypto';
import { getSupabaseAdmin } from './_lib/supabase-admin.js';

const OTP_TABLE = 'email_otp_verifications';
const MAX_ATTEMPTS = 5;

function resolveRequestBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') {
    try { return JSON.parse(request.body); } catch { return {}; }
  }
  return {};
}

function setCors(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(request, response) {
  setCors(response);
  if (request.method === 'OPTIONS') return response.status(204).end();
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });

  const { email, otp } = resolveRequestBody(request);
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanOtp = typeof otp === 'string' ? otp.trim().replace(/\D/g, '') : '';
  if (!cleanEmail || !cleanOtp || cleanOtp.length !== 6) {
    return response.status(400).json({ error: 'Invalid OTP.' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: record, error: readError } = await supabase
      .from(OTP_TABLE)
      .select('email, otp_hash, expires_at, attempts')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (readError) throw readError;
    if (!record) {
      return response.status(400).json({ error: 'No active OTP was found. Please request a new code.' });
    }

    if (Date.now() > new Date(record.expires_at).getTime()) {
      await supabase.from(OTP_TABLE).delete().eq('email', cleanEmail);
      return response.status(400).json({ error: 'OTP expired. Please request a new code.' });
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      await supabase.from(OTP_TABLE).delete().eq('email', cleanEmail);
      return response.status(429).json({ error: 'Too many attempts. Please request a new code later.' });
    }

    const enteredHash = crypto.createHash('sha256').update(cleanOtp).digest();
    const storedHash = Buffer.from(record.otp_hash, 'hex');
    const matches = enteredHash.length === storedHash.length && crypto.timingSafeEqual(enteredHash, storedHash);

    if (!matches) {
      const nextAttempts = record.attempts + 1;
      const { error: attemptError } = await supabase.from(OTP_TABLE)
        .update({ attempts: nextAttempts, updated_at: new Date().toISOString() })
        .eq('email', cleanEmail);
      if (attemptError) throw attemptError;
      if (nextAttempts >= MAX_ATTEMPTS) {
        await supabase.from(OTP_TABLE).delete().eq('email', cleanEmail);
        return response.status(429).json({ error: 'Too many attempts. Please request a new code later.' });
      }
      return response.status(400).json({ error: 'Invalid OTP.' });
    }

    const { error: deleteError } = await supabase.from(OTP_TABLE).delete().eq('email', cleanEmail);
    if (deleteError) throw deleteError;

    return response.status(200).json({ success: true, message: 'OTP verified successfully.', verifiedContact: cleanEmail });
  } catch (error) {
    console.error('Verify OTP backend error:', error?.message || 'Unknown error');
    return response.status(503).json({ error: 'OTP verification is temporarily unavailable. Please try again.' });
  }
}
