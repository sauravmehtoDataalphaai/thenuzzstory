-- Phone OTP storage for MSG91 / custom SMS flow
-- Run in Supabase SQL Editor after schema.sql

create table if not exists public.phone_otps (
  phone text primary key,
  code_hash text not null,
  name text not null default '',
  email text not null default '',
  mode text not null default 'login',
  attempts integer not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.phone_otps enable row level security;

-- No public policies: only service role (server) can read/write OTPs
drop policy if exists "phone_otps_no_public" on public.phone_otps;
