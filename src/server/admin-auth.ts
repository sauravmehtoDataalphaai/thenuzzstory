import { createServiceSupabase } from "@/server/supabase";
import {
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  STAFF_ROLES,
  assertPermission,
  isStaffRole,
  matrixFromRoleMap,
  permissionsForRole,
  roleMapFromMatrix,
  type AdminPermission,
  type StaffRole,
} from "@/lib/admin/roles";
import type { Profile } from "@/types/database";

export type AdminSession = {
  userId: string;
  email: string;
  role: StaffRole;
  name: string;
  permissions: AdminPermission[];
};

type PermissionOverrides = Record<StaffRole, AdminPermission[]>;

async function loadPermissionOverrides(): Promise<PermissionOverrides> {
  const admin = createServiceSupabase();
  const { data, error } = await admin.from("role_permissions").select("*");
  if (error || !data?.length) {
    return { ...DEFAULT_ROLE_PERMISSIONS };
  }

  const map = {
    ops: [] as AdminPermission[],
    support: [] as AdminPermission[],
    admin: [] as AdminPermission[],
    super_admin: [] as AdminPermission[],
  };

  for (const row of data) {
    if (!isStaffRole(row.role)) continue;
    if (!row.allowed) continue;
    if ((ALL_PERMISSIONS as string[]).includes(row.permission)) {
      map[row.role].push(row.permission as AdminPermission);
    }
  }

  for (const role of STAFF_ROLES) {
    if (map[role].length === 0) map[role] = [...DEFAULT_ROLE_PERMISSIONS[role]];
  }
  map.super_admin = [...ALL_PERMISSIONS];
  return map;
}

export async function resolveStaffFromAccessToken(accessToken: string): Promise<{
  session: AdminSession;
  overrides: PermissionOverrides;
}> {
  const admin = createServiceSupabase();
  const { data: authData, error: authError } = await admin.auth.getUser(accessToken);
  if (authError || !authData.user) {
    throw new Error("Not authenticated");
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile || profile.is_active === false || !isStaffRole(profile.role)) {
    throw new Error("Admin access denied");
  }

  const overrides = await loadPermissionOverrides();
  return {
    session: {
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      name: profile.name || profile.email,
      permissions: permissionsForRole(profile.role, overrides),
    },
    overrides,
  };
}

export async function requirePermissionFromToken(
  accessToken: string,
  permission: AdminPermission,
) {
  const { session, overrides } = await resolveStaffFromAccessToken(accessToken);
  assertPermission(session.role, permission, overrides);
  return { session, overrides, admin: createServiceSupabase() };
}

export type { Profile };
