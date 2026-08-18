-- Admin Phase 3 — products, coupons, audit log, extra permissions
-- Run after admin-phase2.sql

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  brand text not null,
  pet text not null check (pet in ('dog', 'cat')),
  category text not null,
  type text not null,
  price numeric not null default 0,
  mrp numeric not null default 0,
  rating numeric not null default 0,
  reviews integer not null default 0,
  image_url text not null default '',
  variants jsonb not null default '[]'::jsonb,
  in_stock boolean not null default true,
  is_new boolean not null default false,
  popularity integer not null default 0,
  subscribable boolean not null default false,
  life_stage text not null default 'all',
  description text not null default '',
  specs jsonb not null default '[]'::jsonb,
  ingredients text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_slug_idx on public.products (slug);

create table if not exists public.coupons (
  code text primary key,
  label text not null,
  type text not null check (type in ('percent', 'flat')),
  value numeric not null default 0,
  min_cart numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  actor_email text not null default '',
  action text not null,
  entity_type text not null,
  entity_id text not null default '',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_idx on public.audit_log (created_at desc);

alter table public.products enable row level security;
alter table public.coupons enable row level security;
alter table public.audit_log enable row level security;

-- Public read active products/coupons (storefront)
drop policy if exists "products_public_select" on public.products;
create policy "products_public_select" on public.products
  for select using (active = true);

drop policy if exists "coupons_public_select" on public.coupons;
create policy "coupons_public_select" on public.coupons
  for select using (active = true);

-- Staff read all + manage via service role in admin APIs
drop policy if exists "products_staff_all" on public.products;
create policy "products_staff_all" on public.products
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "coupons_staff_all" on public.coupons;
create policy "coupons_staff_all" on public.coupons
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "audit_staff_select" on public.audit_log;
create policy "audit_staff_select" on public.audit_log
  for select using (public.is_staff());

-- Extend permissions for Phase 3
insert into public.role_permissions (role, permission, allowed) values
  ('admin', 'products.read', true),
  ('admin', 'products.write', true),
  ('admin', 'coupons.read', true),
  ('admin', 'coupons.write', true),
  ('admin', 'reports.read', true),
  ('admin', 'audit.read', true),
  ('super_admin', 'products.read', true),
  ('super_admin', 'products.write', true),
  ('super_admin', 'coupons.read', true),
  ('super_admin', 'coupons.write', true),
  ('super_admin', 'reports.read', true),
  ('super_admin', 'audit.read', true),
  ('ops', 'products.read', true),
  ('ops', 'products.write', false),
  ('ops', 'coupons.read', true),
  ('ops', 'coupons.write', false),
  ('ops', 'reports.read', true),
  ('ops', 'audit.read', false),
  ('support', 'products.read', true),
  ('support', 'products.write', false),
  ('support', 'coupons.read', true),
  ('support', 'coupons.write', false),
  ('support', 'reports.read', false),
  ('support', 'audit.read', false)
on conflict (role, permission) do nothing;
