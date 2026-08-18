-- Admin Phase 1 — run in Supabase SQL Editor after schema.sql
-- Adds staff roles + RLS so admins can manage all orders/users

alter table public.profiles
  add column if not exists role text not null default 'customer';

alter table public.profiles
  add column if not exists is_active boolean not null default true;

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('customer', 'ops', 'support', 'admin', 'super_admin'));

create index if not exists profiles_role_idx on public.profiles (role);

-- Staff helper (used by RLS)
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.is_active, true) = true
      and p.role in ('super_admin', 'admin', 'ops', 'support')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and coalesce(p.is_active, true) = true
      and p.role in ('super_admin', 'admin')
  );
$$;

-- Profiles: staff can read all customers
drop policy if exists "profiles_staff_select" on public.profiles;
create policy "profiles_staff_select" on public.profiles
  for select using (public.is_staff());

-- Orders: staff can read + update status
drop policy if exists "orders_staff_select" on public.orders;
create policy "orders_staff_select" on public.orders
  for select using (public.is_staff());

drop policy if exists "orders_staff_update" on public.orders;
create policy "orders_staff_update" on public.orders
  for update using (public.is_staff())
  with check (public.is_staff());

-- Order items: staff can read
drop policy if exists "order_items_staff_select" on public.order_items;
create policy "order_items_staff_select" on public.order_items
  for select using (public.is_staff());

-- Addresses: staff can read (for user detail)
drop policy if exists "addresses_staff_select" on public.addresses;
create policy "addresses_staff_select" on public.addresses
  for select using (public.is_staff());

-- IMPORTANT: promote your account to super_admin (change email if needed)
-- Sign up / login once on the store first, then run:
update public.profiles
set role = 'super_admin', is_active = true
where lower(email) = lower('sauravmehto.98@gmail.com');

-- Dev admin demo account (also auto-promoted by verifyDevAdminLogin)
update public.profiles
set role = 'super_admin', is_active = true
where lower(email) = lower('admin@gmail.com');
