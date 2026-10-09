# Persistent email OTP storage (Vercel + Supabase)

## 1. Create the table

In Supabase Dashboard, open the correct project, choose **SQL Editor**, paste and run `docs/email-otp-supabase.sql`.

## 2. Add server-only environment variables in Vercel

Under Project > Settings > Environment Variables, add these for **Production** (and Preview/Development if you use those environments):

- `SUPABASE_URL` = your Supabase project URL, e.g. `https://YOUR_PROJECT_REF.supabase.co`
- `SUPABASE_SECRET_KEY` = your Supabase **secret key** (`sb_secret_...`) from Project Settings > API Keys. If your project only has the legacy key, `SUPABASE_SERVICE_ROLE_KEY` is also accepted by the code.

Do not prefix the server secret with `VITE_`; never put it in frontend code or commit it to Git. The existing `VITE_SUPABASE_URL` is public and can be used as a URL fallback, but set `SUPABASE_URL` explicitly for the backend.

Keep the existing `BREVO_API_KEY`, `BREVO_FROM_EMAIL`, and `BREVO_FROM_NAME` settings.

## 3. Deploy

Commit/push the changes or redeploy the project after setting the environment variables. New environment variables are available to new deployments, not old ones.

## 4. Test

1. Open the deployed site and request an email OTP.
2. In Supabase Table Editor, verify a row appears in `email_otp_verifications`. Only the SHA-256 hash is stored, not the raw OTP.
3. Enter the latest OTP promptly; successful verification deletes the row.
4. Request another code within 30 seconds and confirm the server returns a cooldown message.
5. Test an incorrect OTP five times and confirm the code is invalidated.

The frontend currently sends both initial requests and resend requests to `/api/send-email-otp`; the same endpoint handles both, applying the cooldown.

## Notes

- Keep this table private: do not add public SELECT/INSERT/UPDATE/DELETE policies.
- This implementation stores hashes, enforces expiry and attempt limits, and uses persistent shared storage. For strict race-proof throttling under heavy concurrent requests, move cooldown/attempt checks into a Postgres RPC transaction.
