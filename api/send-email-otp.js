import crypto from 'crypto';
import { getSupabaseAdmin } from './_lib/supabase-admin.js';

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const EMAIL_COOLDOWN_MS = 30 * 1000;
const OTP_TABLE = 'email_otp_verifications';

function resolveBrevoSender() {
  const email = (process.env.BREVO_FROM_EMAIL || '').trim();
  const name = (process.env.BREVO_FROM_NAME || 'KARIGARSETU AI').trim();
  return { email, name: name || 'KARIGARSETU AI' };
}

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

function makeEmailHtml(rawOtp) {
  return `
    <!DOCTYPE html><html><head><meta charset="utf-8"><title>KARIGARSETU.AI Verification Code</title></head>
    <body style="font-family:Arial,sans-serif;background:#FEFAF5;margin:0;padding:32px 16px;color:#1A3A5C">
      <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:540px;background:#fff;border-radius:20px;border:1px solid #EAD8C7;overflow:hidden">
        <tr><td style="background:#1A3A5C;padding:24px;text-align:center"><h1 style="color:#D7B36A;margin:0;font-size:24px;letter-spacing:1px">KARIGARSETU.AI</h1><p style="color:#FEFAF5;margin:4px 0 0;font-size:11px;letter-spacing:1px">From Artisan to Market — Powered by AI</p></td></tr>
        <tr><td style="padding:36px 28px;text-align:center"><h2 style="font-size:20px;margin:0 0 12px">Verify Your Contact</h2><p style="font-size:14px;line-height:1.5;margin:0 0 24px">Use this verification code to securely authenticate your KARIGARSETU.AI account.</p><div style="display:inline-block;background:#FEFAF5;border:2px dashed #C8702A;border-radius:14px;padding:16px 36px;margin-bottom:24px"><span style="font-family:monospace;font-size:32px;font-weight:800;color:#C8702A;letter-spacing:8px">${rawOtp}</span></div><p style="color:#888;font-size:12px;margin:0">This code expires in <strong>10 minutes</strong>. If you did not request it, ignore this email.</p></td></tr>
        <tr><td style="background:#F7EFE6;padding:18px 24px;text-align:center;border-top:1px solid #EAD8C7"><p style="font-size:11px;font-weight:700;margin:0">Team HEXANOVA 3.0 • SMART INDIA HACKATHON 2026</p></td></tr>
      </table>
    </body></html>`;
}

export default async function handler(request, response) {
  setCors(response);
  if (request.method === 'OPTIONS') return response.status(204).end();
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });

  const { email } = resolveRequestBody(request);
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) {
    return response.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const brevoApiKey = (process.env.BREVO_API_KEY || '').trim();
  if (!brevoApiKey || brevoApiKey.includes('your_brevo_api_key')) {
    return response.status(503).json({ success: false, code: 'EMAIL_PROVIDER_NOT_CONFIGURED', error: 'Email delivery is not configured for this environment.' });
  }

  const sender = resolveBrevoSender();
  if (!sender.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender.email)) {
    return response.status(503).json({ success: false, code: 'EMAIL_PROVIDER_NOT_CONFIGURED', error: 'Brevo sender email is not configured for this environment.' });
  }

  try {
    const supabase = getSupabaseAdmin();
    const now = Date.now();
    const { data: existing, error: readError } = await supabase
      .from(OTP_TABLE)
      .select('last_sent_at')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (readError) throw readError;
    if (existing?.last_sent_at) {
      const elapsed = now - new Date(existing.last_sent_at).getTime();
      if (elapsed < EMAIL_COOLDOWN_MS) {
        const waitSec = Math.ceil((EMAIL_COOLDOWN_MS - elapsed) / 1000);
        return response.status(429).json({ error: `Please wait ${waitSec}s before requesting another OTP.` });
      }
    }

    const rawOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');
    const expiresAt = new Date(now + OTP_EXPIRY_MS).toISOString();

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': brevoApiKey, accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({
        sender,
        to: [{ email: cleanEmail }],
        subject: 'Your KARIGARSETU AI verification code',
        htmlContent: makeEmailHtml(rawOtp),
        textContent: `Your KARIGARSETU.AI verification code is ${rawOtp}. This code expires in 10 minutes.`,
      }),
    });

    if (!brevoResponse.ok) {
      const providerText = await brevoResponse.text();
      console.error('Brevo send failed:', { status: brevoResponse.status, response: providerText.slice(0, 500) });
      if (brevoResponse.status === 401 || brevoResponse.status === 403) {
        return response.status(brevoResponse.status).json({ success: false, code: 'EMAIL_PROVIDER_FORBIDDEN', error: 'The configured Brevo credentials are invalid or unauthorized.' });
      }
      return response.status(502).json({ success: false, code: 'EMAIL_PROVIDER_ERROR', error: 'Email delivery failed. Please try again.' });
    }

    // Persist only after Brevo accepts the email, so failed sends don't create active OTPs.
    const { error: saveError } = await supabase.from(OTP_TABLE).upsert({
      email: cleanEmail,
      otp_hash: otpHash,
      expires_at: expiresAt,
      attempts: 0,
      last_sent_at: new Date(now).toISOString(),
      updated_at: new Date(now).toISOString(),
    }, { onConflict: 'email' });

    if (saveError) {
      // Email was accepted but verification cannot work until persistence succeeds.
      console.error('OTP persistence failed after Brevo accepted email:', saveError.message);
      return response.status(503).json({ success: false, code: 'OTP_STORAGE_ERROR', error: 'The email was sent, but verification storage failed. Please request a new code shortly.' });
    }

    return response.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Send OTP backend error:', error?.message || 'Unknown error');
    return response.status(503).json({ success: false, code: 'OTP_STORAGE_ERROR', error: 'Email verification is temporarily unavailable. Please try again shortly.' });
  }
}
