import crypto from 'crypto';

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

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderDetails,
  } = request.body || {};

  if (!razorpay_order_id || !razorpay_payment_id) {
    return response.status(400).json({ error: 'Missing payment transaction reference.' });
  }

  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (razorpayKeySecret && !razorpayKeySecret.includes('your_razorpay_key')) {
    if (!razorpay_signature) {
      return response.status(400).json({ error: 'Payment signature missing.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Razorpay signature verification failed!');
      return response.status(400).json({ error: 'Payment signature verification failed. Possible fraud attempt.' });
    }
  }

  // Signature is valid or running in local dev mode
  const paidAt = new Date().toISOString();

  // Send Order Confirmation Email via Resend if email is provided
  const resendApiKey = process.env.RESEND_API_KEY;
  const buyerEmail = orderDetails?.buyer_email;

  if (resendApiKey && buyerEmail && !resendApiKey.includes('your_resend_api_key')) {
    try {
      const configuredFrom = (process.env.RESEND_FROM_EMAIL || '').trim();
      const fromEmail = configuredFrom
        ? (configuredFrom.includes('<') && configuredFrom.includes('>') ? configuredFrom.match(/<([^>]+)>/)?.[1] || configuredFrom : configuredFrom)
        : 'onboarding@resend.dev';
      const orderCode = orderDetails?.order_code || `KS202600${Math.floor(1000 + Math.random() * 9000)}`;
      const totalAmount = orderDetails?.total_amount || 0;
      const itemsList = (orderDetails?.items || [])
        .map((i) => `<li><strong>${i.product_name}</strong> (Qty: ${i.quantity}) — ₹${(i.price * i.quantity).toLocaleString('en-IN')}</li>`)
        .join('');

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `KARIGARSETU.AI <${fromEmail}>`,
          to: [buyerEmail],
          subject: `Order Confirmed: ${orderCode} — KARIGARSETU.AI`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #FEFAF5; padding: 24px; color: #1A3A5C;">
              <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EAD8C7; overflow: hidden; padding: 28px;">
                <h2 style="color: #C8702A; margin-top: 0;">Payment Successful & Order Confirmed!</h2>
                <p>Namaste <strong>${orderDetails?.buyer_name || 'Patron'}</strong>,</p>
                <p>Thank you for supporting authentic Indian craftspersons. Your order has been placed successfully.</p>
                <div style="background-color: #FEFAF5; padding: 16px; border-radius: 12px; margin: 16px 0;">
                  <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> ${orderCode}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                  <p style="margin: 0;"><strong>Total Paid:</strong> ₹${totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <h3>Items:</h3>
                <ul>${itemsList || '<li>Authentic Craft Item</li>'}</ul>
                <p style="font-size: 12px; color: #666; margin-top: 24px; border-top: 1px solid #EAD8C7; padding-top: 12px;">
                  Team HEXANOVA 3.0 &bull; SMART INDIA HACKATHON 2026 &bull; KARIGARSETU.AI
                </p>
              </div>
            </div>
          `,
        }),
      });
    } catch (emailErr) {
      console.warn('Order confirmation email sending notice:', emailErr.message);
    }
  }

  return response.status(200).json({
    success: true,
    message: 'Payment verified and confirmed successfully.',
    payment_status: 'paid',
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature: razorpay_signature || 'test_verified',
    paid_at: paidAt,
  });
}
