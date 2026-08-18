-- Custom OTP auth (phone login) — run after schema.sql
-- Email signup/login still uses Supabase Auth email OTP.

create table if not exists public.otp_requests (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('email', 'phone')),
  target_value text not null,
  otp_hash text not null,
  purpose text not null check (purpose in ('signup', 'login')),
  expires_at timestamptz not null,
  attempts int not null default 0,
  is_used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists otp_requests_target_idx
  on public.otp_requests (target_type, target_value, created_at desc);

-- Unique phone per customer (ignore empty phones)
create unique index if not exists profiles_phone_unique_idx
  on public.profiles (phone)
  where phone <> '' and phone is not null;

alter table public.otp_requests enable row level security;

-- Service role only (admin server client bypasses RLS)
