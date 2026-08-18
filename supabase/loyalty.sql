-- Run once in Supabase SQL Editor if profiles already exists without loyalty_points
alter table public.profiles
  add column if not exists loyalty_points integer not null default 100;
