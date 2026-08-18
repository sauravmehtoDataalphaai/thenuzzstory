//#region src/lib/admin/roles.ts
var STAFF_ROLES = [
	"ops",
	"support",
	"admin",
	"super_admin"
];
function isStaffRole(role) {
	return STAFF_ROLES.includes(role);
}
var ALL_PERMISSIONS = [
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
	"audit.read"
];
var PERMISSION_LABELS = {
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
	"audit.read": "View audit log"
};
var DEFAULT_ROLE_PERMISSIONS = {
	ops: [
		"dashboard",
		"orders.read",
		"orders.write",
		"products.read",
		"coupons.read",
		"reports.read"
	],
	support: [
		"dashboard",
		"orders.read",
		"users.read",
		"products.read",
		"coupons.read"
	],
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
		"audit.read"
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
		"audit.read"
	]
};
function permissionsForRole(role, overrides) {
	if (!isStaffRole(role)) return [];
	return overrides?.[role] ?? DEFAULT_ROLE_PERMISSIONS[role];
}
function hasPermission(role, permission, overrides) {
	return permissionsForRole(role, overrides).includes(permission);
}
function assertPermission(role, permission, overrides) {
	if (!hasPermission(role, permission, overrides)) throw new Error(`Missing permission: ${permission}`);
}
function matrixFromRoleMap(map) {
	const matrix = {};
	for (const role of STAFF_ROLES) {
		matrix[role] = {};
		for (const perm of ALL_PERMISSIONS) matrix[role][perm] = map[role].includes(perm);
	}
	return matrix;
}
function roleMapFromMatrix(matrix) {
	const map = {};
	for (const role of STAFF_ROLES) {
		map[role] = ALL_PERMISSIONS.filter((perm) => matrix[role]?.[perm]);
		if (role === "super_admin") {
			for (const required of ["staff.manage", "permissions.manage"]) if (!map[role].includes(required)) map[role].push(required);
			for (const perm of ALL_PERMISSIONS) if (!map[role].includes(perm)) map[role].push(perm);
		}
	}
	return map;
}
//#endregion
export { assertPermission as a, permissionsForRole as c, STAFF_ROLES as i, roleMapFromMatrix as l, DEFAULT_ROLE_PERMISSIONS as n, isStaffRole as o, PERMISSION_LABELS as r, matrixFromRoleMap as s, ALL_PERMISSIONS as t };
