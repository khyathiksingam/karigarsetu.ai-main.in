-- Run this in Supabase Dashboard > SQL Editor.
create table if not exists public.email_otp_verifications (
  email text primary key,
  otp_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0 check (attempts >= 0),
  last_sent_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.email_otp_verifications enable row level security;

-- OTP records must only be accessed by the trusted server-side secret/service-role key.
revoke all on table public.email_otp_verifications from anon, authenticated;
grant all on table public.email_otp_verifications to service_role;
