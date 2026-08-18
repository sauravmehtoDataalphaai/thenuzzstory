import { a as assertPermission, c as permissionsForRole, i as STAFF_ROLES, n as DEFAULT_ROLE_PERMISSIONS, o as isStaffRole, t as ALL_PERMISSIONS } from "./roles-DGja2QmC.js";
import { t as createServiceSupabase } from "./supabase-BNLNooLQ.js";
//#region src/server/audit.ts
async function writeAuditLog(input) {
	try {
		await createServiceSupabase().from("audit_log").insert({
			actor_id: input.session.userId,
			actor_email: input.session.email,
			action: input.action,
			entity_type: input.entityType,
			entity_id: input.entityId ?? "",
			details: input.details ?? {}
		});
	} catch (err) {
		console.error("audit log failed", err);
	}
}
//#endregion
//#region src/server/admin-auth.ts
async function loadPermissionOverrides() {
	const { data, error } = await createServiceSupabase().from("role_permissions").select("*");
	if (error || !data?.length) return { ...DEFAULT_ROLE_PERMISSIONS };
	const map = {
		ops: [],
		support: [],
		admin: [],
		super_admin: []
	};
	for (const row of data) {
		if (!isStaffRole(row.role)) continue;
		if (!row.allowed) continue;
		if (ALL_PERMISSIONS.includes(row.permission)) map[row.role].push(row.permission);
	}
	for (const role of STAFF_ROLES) if (map[role].length === 0) map[role] = [...DEFAULT_ROLE_PERMISSIONS[role]];
	map.super_admin = [...ALL_PERMISSIONS];
	return map;
}
async function resolveStaffFromAccessToken(accessToken) {
	const admin = createServiceSupabase();
	const { data: authData, error: authError } = await admin.auth.getUser(accessToken);
	if (authError || !authData.user) throw new Error("Not authenticated");
	const { data: profile, error: profileError } = await admin.from("profiles").select("*").eq("id", authData.user.id).maybeSingle();
	if (profileError) throw profileError;
	if (!profile || profile.is_active === false || !isStaffRole(profile.role)) throw new Error("Admin access denied");
	const overrides = await loadPermissionOverrides();
	return {
		session: {
			userId: profile.id,
			email: profile.email,
			role: profile.role,
			name: profile.name || profile.email,
			permissions: permissionsForRole(profile.role, overrides)
		},
		overrides
	};
}
async function requirePermissionFromToken(accessToken, permission) {
	const { session, overrides } = await resolveStaffFromAccessToken(accessToken);
	assertPermission(session.role, permission, overrides);
	return {
		session,
		overrides,
		admin: createServiceSupabase()
	};
}
//#endregion
export { resolveStaffFromAccessToken as n, writeAuditLog as r, requirePermissionFromToken as t };
