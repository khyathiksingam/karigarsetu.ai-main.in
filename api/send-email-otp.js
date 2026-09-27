import crypto from 'crypto';

// In-memory OTP store for serverless instance lifecycle
// Schema: Map<email, { otpHash: string, expiresAt: number, attempts: number, lastSentAt: number }>
const globalOtpStore = global.__KARIGARSETU_OTP_STORE__ || new Map();
global.__KARIGARSETU_OTP_STORE__ = globalOtpStore;

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const EMAIL_COOLDOWN_MS = 30 * 1000; // 30 seconds

function resolveBrevoSender() {
  const configuredEmail = (process.env.BREVO_FROM_EMAIL || '').trim();
  const configuredName = (process.env.BREVO_FROM_NAME || 'KARIGARSETU AI').trim();

  if (configuredEmail) {
    return {
      email: configuredEmail,
      name: configuredName || 'KARIGARSETU AI',
    };
  }

  return {
    email: 'noreply@karigarsetu.ai',
    name: 'KARIGARSETU AI',
  };
}

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
  const { email } = body || {};
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
    return response.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey || brevoApiKey.includes('your_brevo_api_key')) {
    return response.status(503).json({
      success: false,
      code: 'EMAIL_PROVIDER_NOT_CONFIGURED',
      error: 'Email delivery is not configured for this environment.',
    });
  }

  const now = Date.now();
  const existingRecord = globalOtpStore.get(cleanEmail);

  if (existingRecord && now - existingRecord.lastSentAt < EMAIL_COOLDOWN_MS) {
    const waitSec = Math.ceil((EMAIL_COOLDOWN_MS - (now - existingRecord.lastSentAt)) / 1000);
    return response.status(429).json({ error: `Please wait ${waitSec}s before requesting another OTP.` });
  }

  // Generate secure 6-digit OTP
  const rawOtp = crypto.randomInt(100000, 999999).toString();
  const otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');

  // Save OTP in store
  globalOtpStore.set(cleanEmail, {
    otpHash,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    lastSentAt: now,
  });

  const sender = resolveBrevoSender();

  if (!sender.email || !sender.email.includes('@') || sender.email.length < 6) {
    return response.status(503).json({
      success: false,
      code: 'EMAIL_PROVIDER_NOT_CONFIGURED',
      error: 'Brevo sender email is not configured for this environment.',
    });
  }

  const subject = `${rawOtp} is your KARIGARSETU.AI verification code`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>KARIGARSETU.AI Verification Code</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FEFAF5; margin: 0; padding: 32px 16px; color: #1A3A5C;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; border: 1px solid #EAD8C7; box-shadow: 0 10px 30px rgba(26,58,92,0.06); overflow: hidden;">
        <tr>
          <td style="background-color: #1A3A5C; padding: 24px; text-align: center;">
            <h1 style="color: #D7B36A; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">KARIGARSETU.AI</h1>
            <p style="color: #FEFAF5; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">From Artisan to Market — Powered by AI</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 36px 28px; text-align: center;">
            <h2 style="color: #1A3A5C; font-size: 20px; margin: 0 0 12px 0;">Verify Your Contact</h2>
            <p style="color: #555555; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
              Please use the verification code below to securely authenticate your KARIGARSETU.AI account.
            </p>
            <div style="display: inline-block; background-color: #FEFAF5; border: 2px dashed #C8702A; border-radius: 14px; padding: 16px 36px; margin-bottom: 24px;">
              <span style="font-family: monospace; font-size: 32px; font-weight: 800; color: #C8702A; letter-spacing: 8px;">${rawOtp}</span>
            </div>
            <p style="color: #888888; font-size: 12px; margin: 0;">
              This code will expire in <strong>10 minutes</strong>. If you did not request this verification, please ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #F7EFE6; padding: 18px 24px; text-align: center; border-top: 1px solid #EAD8C7;">
            <p style="color: #1A3A5C; font-size: 11px; font-weight: 700; margin: 0;">Team HEXANOVA 3.0 &bull; SMART INDIA HACKATHON 2026</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const brevoRequestBody = {
      sender: {
        name: sender.name,
        email: sender.email,
      },
      to: [{ email: cleanEmail }],
      subject: 'Your KARIGARSETU AI verification code',
      htmlContent: htmlContent,
      textContent: `Your KARIGARSETU.AI verification code is ${rawOtp}. This code expires in 10 minutes.`,
    };

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(brevoRequestBody),
    });

    if (!brevoResponse.ok) {
      let errPayload = null;
      const errText = await brevoResponse.text();
      try {
        errPayload = JSON.parse(errText);
      } catch {
        errPayload = { message: errText };
      }

      const statusCode = brevoResponse.status;
      const errorCode = errPayload?.code || 'EMAIL_PROVIDER_ERROR';
      const errorMessage = errPayload?.message || 'Email delivery failed.';

      console.error('Brevo API Error:', {
        status: statusCode,
        code: errorCode,
        message: errorMessage,
      });

      if (statusCode === 401 || statusCode === 403) {
        return response.status(statusCode).json({
          success: false,
          code: 'EMAIL_PROVIDER_FORBIDDEN',
          error: 'The configured Brevo credentials are invalid or unauthorized.',
        });
      }

      if (statusCode === 422) {
        return response.status(422).json({
          success: false,
          code: 'EMAIL_VALIDATION_ERROR',
          error: 'The email request was rejected by the email provider.',
        });
      }

      return response.status(500).json({
        success: false,
        code: 'EMAIL_PROVIDER_ERROR',
        error: 'Email delivery failed due to a provider error.',
      });
    }

    return response.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('Send OTP Network Error:', {
      message: err && err.message ? err.message : 'Unknown network error',
      status: 500,
    });
    return response.status(502).json({
      success: false,
      code: 'EMAIL_DELIVERY_FAILED',
      error: 'Email delivery failed. Please try again.',
    });
  }
}
