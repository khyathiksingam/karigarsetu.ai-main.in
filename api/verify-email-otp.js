import crypto from 'crypto';

const globalOtpStore = global.__KARIGARSETU_OTP_STORE__ || new Map();
global.__KARIGARSETU_OTP_STORE__ = globalOtpStore;

const MAX_ATTEMPTS = 5;

function resolveRequestBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body);
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const body = resolveRequestBody(request);
  const { email, otp } = body || {};
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanOtp = typeof otp === 'string' ? otp.trim().replace(/\D/g, '') : '';

  if (!cleanEmail || !cleanOtp || cleanOtp.length !== 6) {
    return response.status(400).json({ error: 'Invalid OTP.' });
  }

  const record = globalOtpStore.get(cleanEmail);

  if (!record) {
    return response.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    globalOtpStore.delete(cleanEmail);
    return response.status(400).json({ error: 'OTP expired.' });
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    globalOtpStore.delete(cleanEmail);
    return response.status(429).json({ error: 'Too many attempts. Please try again later.' });
  }

  const enteredHash = crypto.createHash('sha256').update(cleanOtp).digest('hex');

  if (enteredHash !== record.otpHash) {
    record.attempts += 1;
    globalOtpStore.set(cleanEmail, record);
    return response.status(400).json({ error: 'Invalid OTP.' });
  }

  // Verification succeeded - clear OTP from store
  globalOtpStore.delete(cleanEmail);

  return response.status(200).json({
    success: true,
    message: 'OTP verified successfully.',
    verifiedContact: cleanEmail,
  });
}
