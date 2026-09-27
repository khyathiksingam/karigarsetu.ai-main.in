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

  const { mobile } = request.body || {};
  const cleanMobile = typeof mobile === 'string' ? mobile.trim() : '';

  if (!cleanMobile || cleanMobile.replace(/\D/g, '').length < 10) {
    return response.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioVerifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!twilioSid || !twilioToken || !twilioVerifySid) {
    return response.status(503).json({
      success: false,
      code: 'SMS_PROVIDER_NOT_CONFIGURED',
      error: 'SMS provider is not configured.',
    });
  }

  try {
    const formattedPhone = cleanMobile.startsWith('+') ? cleanMobile : `+91${cleanMobile.replace(/\D/g, '')}`;
    const twilioUrl = `https://verify.twilio.com/v2/Services/${twilioVerifySid}/Verifications`;
    const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');

    const twilioRes = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: formattedPhone,
        Channel: 'sms',
      }),
    });

    if (!twilioRes.ok) {
      console.error('Twilio SMS error:', await twilioRes.text());
      return response.status(502).json({
        success: false,
        code: 'SMS_DELIVERY_FAILED',
        error: 'Unable to send SMS OTP. Please try again.',
      });
    }

    return response.status(200).json({ success: true, message: 'OTP sent successfully via SMS.' });
  } catch (err) {
    console.error('SMS OTP Exception:', err.message);
    return response.status(502).json({
      success: false,
      code: 'SMS_DELIVERY_FAILED',
      error: 'Unable to send SMS OTP. Please try again.',
    });
  }
}
