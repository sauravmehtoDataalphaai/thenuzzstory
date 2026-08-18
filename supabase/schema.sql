-- The Nuzz Story — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor → New query → Run

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  loyalty_points integer not null default 100,
  role text not null default 'customer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Existing projects: add column if missing (safe to re-run)
alter table public.profiles
  add column if not exists loyalty_points integer not null default 100;

alter table public.profiles
  add column if not exists role text not null default 'customer';

alter table public.profiles
  add column if not exists is_active boolean not null default true;

-- Addresses
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  phone text not null,
  pincode text not null,
  address text not null,
  city text not null,
  state text not null,
  landmark text not null default '',
  type text not null check (type in ('Home', 'Work')) default 'Home',
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses (user_id);

-- Orders
create table if not exists public.orders (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'Processing',
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  delivery_fee numeric not null default 0,
  total numeric not null default 0,
  payment_method text not null default '',
  shipping_name text not null default '',
  shipping_phone text not null default '',
  shipping_address text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders (id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  variant text not null default '',
  qty integer not null default 1,
  unit_price numeric not null default 0,
  image_url text not null default ''
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone, loyalty_points)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    100
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "addresses_all_own" on public.addresses;
create policy "addresses_all_own" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "order_items_select_own" on public.order_items;
create policy "order_items_select_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "order_items_insert_own" on public.order_items;
create policy "order_items_insert_own" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Phone OTP storage (MSG91 / custom SMS) — service role only
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
