-- Admin Phase 2 — staff + permissions matrix
-- Run after admin.sql

create table if not exists public.role_permissions (
  role text not null
    check (role in ('ops', 'support', 'admin', 'super_admin')),
  permission text not null,
  allowed boolean not null default true,
  primary key (role, permission)
);

alter table public.role_permissions enable row level security;

drop policy if exists "role_permissions_staff_select" on public.role_permissions;
create policy "role_permissions_staff_select" on public.role_permissions
  for select using (public.is_staff());

-- Seed defaults (safe to re-run)
insert into public.role_permissions (role, permission, allowed) values
  ('ops', 'dashboard', true),
  ('ops', 'orders.read', true),
  ('ops', 'orders.write', true),
  ('ops', 'users.read', false),
  ('ops', 'users.write', false),
  ('ops', 'staff.manage', false),
  ('ops', 'permissions.manage', false),
  ('ops', 'settings', false),
  ('support', 'dashboard', true),
  ('support', 'orders.read', true),
  ('support', 'orders.write', false),
  ('support', 'users.read', true),
  ('support', 'users.write', false),
  ('support', 'staff.manage', false),
  ('support', 'permissions.manage', false),
  ('support', 'settings', false),
  ('admin', 'dashboard', true),
  ('admin', 'orders.read', true),
  ('admin', 'orders.write', true),
  ('admin', 'users.read', true),
  ('admin', 'users.write', true),
  ('admin', 'staff.manage', false),
  ('admin', 'permissions.manage', false),
  ('admin', 'settings', true),
  ('super_admin', 'dashboard', true),
  ('super_admin', 'orders.read', true),
  ('super_admin', 'orders.write', true),
  ('super_admin', 'users.read', true),
  ('super_admin', 'users.write', true),
  ('super_admin', 'staff.manage', true),
  ('super_admin', 'permissions.manage', true),
  ('super_admin', 'settings', true)
on conflict (role, permission) do nothing;
