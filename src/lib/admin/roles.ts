export type StaffRole = "ops" | "support" | "admin" | "super_admin";
export type UserRole = "customer" | StaffRole;

export const STAFF_ROLES: StaffRole[] = ["ops", "support", "admin", "super_admin"];

export function isStaffRole(role: string | null | undefined): role is StaffRole {
  return STAFF_ROLES.includes(role as StaffRole);
}

export type AdminPermission =
  | "dashboard"
  | "orders.read"
  | "orders.write"
  | "users.read"
  | "users.write"
  | "staff.manage"
  | "permissions.manage"
  | "settings"
  | "products.read"
  | "products.write"
  | "coupons.read"
  | "coupons.write"
  | "reports.read"
  | "audit.read";

export const ALL_PERMISSIONS: AdminPermission[] = [
  "dashboard",
  "orders.read",
  "orders.write",
  "users.read",
  "users.write",
  "staff.manage",
  "permissions.manage",
  "settings",
  "products.read",
  "products.write",
  "coupons.read",
  "coupons.write",
  "reports.read",
  "audit.read",
];

export const PERMISSION_LABELS: Record<AdminPermission, string> = {
  dashboard: "Dashboard",
  "orders.read": "View orders",
  "orders.write": "Update order status",
  "users.read": "View users",
  "users.write": "Edit users",
  "staff.manage": "Manage staff",
  "permissions.manage": "Edit permissions",
  settings: "Settings",
  "products.read": "View products",
  "products.write": "Edit products",
  "coupons.read": "View coupons",
  "coupons.write": "Edit coupons",
  "reports.read": "View reports",
  "audit.read": "View audit log",
};

export const DEFAULT_ROLE_PERMISSIONS: Record<StaffRole, AdminPermission[]> = {
  ops: ["dashboard", "orders.read", "orders.write", "products.read", "coupons.read", "reports.read"],
  support: ["dashboard", "orders.read", "users.read", "products.read", "coupons.read"],
  admin: [
    "dashboard",
    "orders.read",
    "orders.write",
    "users.read",
    "users.write",
    "settings",
    "products.read",
    "products.write",
    "coupons.read",
    "coupons.write",
    "reports.read",
    "audit.read",
  ],
  super_admin: [
    "dashboard",
    "orders.read",
    "orders.write",
    "users.read",
    "users.write",
    "staff.manage",
    "permissions.manage",
    "settings",
    "products.read",
    "products.write",
    "coupons.read",
    "coupons.write",
    "reports.read",
    "audit.read",
  ],
};

/** @deprecated use DEFAULT_ROLE_PERMISSIONS — kept for older imports */
export const ROLE_PERMISSIONS = DEFAULT_ROLE_PERMISSIONS;

export function permissionsForRole(
  role: string | null | undefined,
  overrides?: Partial<Record<StaffRole, AdminPermission[]>>,
): AdminPermission[] {
  if (!isStaffRole(role)) return [];
  return overrides?.[role] ?? DEFAULT_ROLE_PERMISSIONS[role];
}

export function hasPermission(
  role: string | null | undefined,
  permission: AdminPermission,
  overrides?: Partial<Record<StaffRole, AdminPermission[]>>,
): boolean {
  return permissionsForRole(role, overrides).includes(permission);
}

export function assertPermission(
  role: string | null | undefined,
  permission: AdminPermission,
  overrides?: Partial<Record<StaffRole, AdminPermission[]>>,
): void {
  if (!hasPermission(role, permission, overrides)) {
    throw new Error(`Missing permission: ${permission}`);
  }
}

export function matrixFromRoleMap(
  map: Record<StaffRole, AdminPermission[]>,
): Record<StaffRole, Record<AdminPermission, boolean>> {
  const matrix = {} as Record<StaffRole, Record<AdminPermission, boolean>>;
  for (const role of STAFF_ROLES) {
    matrix[role] = {} as Record<AdminPermission, boolean>;
    for (const perm of ALL_PERMISSIONS) {
      matrix[role][perm] = map[role].includes(perm);
    }
  }
  return matrix;
}

export function roleMapFromMatrix(
  matrix: Record<StaffRole, Record<AdminPermission, boolean>>,
): Record<StaffRole, AdminPermission[]> {
  const map = {} as Record<StaffRole, AdminPermission[]>;
  for (const role of STAFF_ROLES) {
    map[role] = ALL_PERMISSIONS.filter((perm) => matrix[role]?.[perm]);
    // super_admin always keeps manage permissions
    if (role === "super_admin") {
      for (const required of ["staff.manage", "permissions.manage"] as const) {
        if (!map[role].includes(required)) map[role].push(required);
      }
      for (const perm of ALL_PERMISSIONS) {
        if (!map[role].includes(perm)) map[role].push(perm);
      }
    }
  }
  return map;
}
