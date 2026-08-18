import { t as createServerFn } from "../server.js";
import { a as isAdminOrderStatus } from "./order-status-DSTuo78T.js";
import { i as STAFF_ROLES, l as roleMapFromMatrix, o as isStaffRole, s as matrixFromRoleMap, t as ALL_PERMISSIONS } from "./roles-DGja2QmC.js";
import { n as createServerRpc } from "./supabase-BNLNooLQ.js";
import { n as resolveStaffFromAccessToken, r as writeAuditLog, t as requirePermissionFromToken } from "./admin-auth-z8tFOJAo.js";
//#region src/server/admin.ts?tss-serverfn-split
var getAdminSession_createServerFn_handler = createServerRpc({
	id: "bbf374cdb00ffe214fa6c1d2c99b82c3b459419dce186882878d5b5e576a7c19",
	name: "getAdminSession",
	filename: "src/server/admin.ts"
}, (opts) => getAdminSession.__executeServer(opts));
var getAdminSession = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(getAdminSession_createServerFn_handler, async ({ data }) => {
	const { session } = await resolveStaffFromAccessToken(data.accessToken);
	return session;
});
var getAdminDashboardStats_createServerFn_handler = createServerRpc({
	id: "c9974c8cde5128f97f2b90ec882f623d717ff42f8132d49bbcfa68db28099139",
	name: "getAdminDashboardStats",
	filename: "src/server/admin.ts"
}, (opts) => getAdminDashboardStats.__executeServer(opts));
var getAdminDashboardStats = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(getAdminDashboardStats_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "dashboard");
	const [{ count: ordersCount }, { count: usersCount }, { data: recentOrders }] = await Promise.all([
		admin.from("orders").select("*", {
			count: "exact",
			head: true
		}),
		admin.from("profiles").select("*", {
			count: "exact",
			head: true
		}).eq("role", "customer"),
		admin.from("orders").select("id, total, status, created_at, shipping_name").order("created_at", { ascending: false }).limit(8)
	]);
	const { data: allTotals } = await admin.from("orders").select("total, status");
	const revenue = (allTotals ?? []).filter((o) => o.status !== "Cancelled").reduce((sum, o) => sum + Number(o.total ?? 0), 0);
	const processing = (allTotals ?? []).filter((o) => o.status === "Processing").length;
	return {
		ordersCount: ordersCount ?? 0,
		usersCount: usersCount ?? 0,
		revenue,
		processing,
		recentOrders: recentOrders ?? []
	};
});
var listAdminOrders_createServerFn_handler = createServerRpc({
	id: "089fa91e0e7a7dd926830e349264959ba7c5b017ea539ea94f695a223e71eef8",
	name: "listAdminOrders",
	filename: "src/server/admin.ts"
}, (opts) => listAdminOrders.__executeServer(opts));
var listAdminOrders = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(listAdminOrders_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "orders.read");
	let query = admin.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
	if (data.status && data.status !== "all") query = query.eq("status", data.status);
	const { data: orders, error } = await query;
	if (error) throw error;
	return orders ?? [];
});
var getAdminOrder_createServerFn_handler = createServerRpc({
	id: "3f9d2ffddb0de4cccd25e204162c63e22b672fada823802c680f2c18522141e9",
	name: "getAdminOrder",
	filename: "src/server/admin.ts"
}, (opts) => getAdminOrder.__executeServer(opts));
var getAdminOrder = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(getAdminOrder_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "orders.read");
	const { data: order, error } = await admin.from("orders").select("*").eq("id", data.orderId).maybeSingle();
	if (error) throw error;
	if (!order) throw new Error("Order not found");
	const { data: items, error: itemsError } = await admin.from("order_items").select("*").eq("order_id", data.orderId);
	if (itemsError) throw itemsError;
	const { data: profile } = await admin.from("profiles").select("*").eq("id", order.user_id).maybeSingle();
	return {
		order,
		items: items ?? [],
		customer: profile
	};
});
var updateAdminOrderStatus_createServerFn_handler = createServerRpc({
	id: "2f3b336c5f991757ff2dc438e7f1883582f8e61e7a62f2ef75cfeac94062a8fc",
	name: "updateAdminOrderStatus",
	filename: "src/server/admin.ts"
}, (opts) => updateAdminOrderStatus.__executeServer(opts));
var updateAdminOrderStatus = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(updateAdminOrderStatus_createServerFn_handler, async ({ data }) => {
	const { session, admin } = await requirePermissionFromToken(data.accessToken, "orders.write");
	if (!isAdminOrderStatus(data.status)) throw new Error("Invalid order status");
	const { data: order, error } = await admin.from("orders").update({ status: data.status }).eq("id", data.orderId).select("*").single();
	if (error) throw error;
	await writeAuditLog({
		session,
		action: "order.status_update",
		entityType: "order",
		entityId: data.orderId,
		details: { status: data.status }
	});
	return order;
});
var listAdminUsers_createServerFn_handler = createServerRpc({
	id: "b5f136c19f5b8e57693f41835cbd0596d76899e444c52e8e2256d99f166d664e",
	name: "listAdminUsers",
	filename: "src/server/admin.ts"
}, (opts) => listAdminUsers.__executeServer(opts));
var listAdminUsers = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(listAdminUsers_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "users.read");
	const { data: users, error } = await admin.from("profiles").select("*").order("created_at", { ascending: false }).limit(200);
	if (error) throw error;
	return users ?? [];
});
var getAdminUser_createServerFn_handler = createServerRpc({
	id: "1a766845e9bfd4fa2dfdd9217e905c7dfdd549cc17926d6ed4295172a6cf492b",
	name: "getAdminUser",
	filename: "src/server/admin.ts"
}, (opts) => getAdminUser.__executeServer(opts));
var getAdminUser = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(getAdminUser_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "users.read");
	const { data: profile, error } = await admin.from("profiles").select("*").eq("id", data.userId).maybeSingle();
	if (error) throw error;
	if (!profile) throw new Error("User not found");
	const [{ data: addresses }, { data: orders }] = await Promise.all([admin.from("addresses").select("*").eq("user_id", data.userId).order("created_at", { ascending: false }), admin.from("orders").select("*").eq("user_id", data.userId).order("created_at", { ascending: false }).limit(50)]);
	return {
		profile,
		addresses: addresses ?? [],
		orders: orders ?? []
	};
});
async function assertCustomerProfile(admin, userId) {
	const { data: profile, error } = await admin.from("profiles").select("*").eq("id", userId).maybeSingle();
	if (error) throw error;
	if (!profile) throw new Error("User not found");
	if (profile.role === "super_admin") throw new Error("super_admin accounts cannot be edited or deleted");
	if (profile.role !== "customer") throw new Error("Only customer accounts can be edited or deleted here. Use Staff for staff roles.");
	return profile;
}
var updateAdminCustomer_createServerFn_handler = createServerRpc({
	id: "3a8072040cbde7e8a726fd1b40b2ccc5321ee3c9e7fec9a36204b44794c7300f",
	name: "updateAdminCustomer",
	filename: "src/server/admin.ts"
}, (opts) => updateAdminCustomer.__executeServer(opts));
var updateAdminCustomer = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(updateAdminCustomer_createServerFn_handler, async ({ data }) => {
	const { session, admin } = await requirePermissionFromToken(data.accessToken, "users.write");
	await assertCustomerProfile(admin, data.userId);
	const loyalty = Math.max(0, Math.floor(Number(data.loyalty_points) || 0));
	const { data: updated, error } = await admin.from("profiles").update({
		name: data.name.trim(),
		phone: data.phone.trim(),
		loyalty_points: loyalty,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.userId).eq("role", "customer").select("*").single();
	if (error) throw error;
	await writeAuditLog({
		session,
		action: "user.update",
		entityType: "profile",
		entityId: data.userId,
		details: {
			name: data.name.trim(),
			phone: data.phone.trim(),
			loyalty_points: loyalty
		}
	});
	return updated;
});
var deleteAdminCustomer_createServerFn_handler = createServerRpc({
	id: "61fbbeeb6fb5eb2ef03de68295ce48cae8a43dd890fcced009644a4dac0e4262",
	name: "deleteAdminCustomer",
	filename: "src/server/admin.ts"
}, (opts) => deleteAdminCustomer.__executeServer(opts));
var deleteAdminCustomer = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(deleteAdminCustomer_createServerFn_handler, async ({ data }) => {
	const { session, admin } = await requirePermissionFromToken(data.accessToken, "users.write");
	if (data.userId === session.userId) throw new Error("You cannot delete your own account");
	const profile = await assertCustomerProfile(admin, data.userId);
	const { error: authError } = await admin.auth.admin.deleteUser(data.userId);
	if (authError) {
		const { error: profileError } = await admin.from("profiles").delete().eq("id", data.userId).eq("role", "customer");
		if (profileError) throw authError;
	}
	await writeAuditLog({
		session,
		action: "user.delete",
		entityType: "profile",
		entityId: data.userId,
		details: {
			email: profile.email,
			name: profile.name
		}
	});
	return {
		ok: true,
		userId: data.userId
	};
});
var listAdminStaff_createServerFn_handler = createServerRpc({
	id: "9050f0835b69df240c331fc57faeeb87cfa1bd7c2fe15d9a7d121ad0437fba1f",
	name: "listAdminStaff",
	filename: "src/server/admin.ts"
}, (opts) => listAdminStaff.__executeServer(opts));
var listAdminStaff = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(listAdminStaff_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "staff.manage");
	const { data: staff, error } = await admin.from("profiles").select("*").in("role", [...STAFF_ROLES]).order("created_at", { ascending: false });
	if (error) throw error;
	return staff ?? [];
});
var updateAdminStaff_createServerFn_handler = createServerRpc({
	id: "70e20e2c8a20cc43fa05736f919f61aa41a21a7510ce37a8092d90a727948fab",
	name: "updateAdminStaff",
	filename: "src/server/admin.ts"
}, (opts) => updateAdminStaff.__executeServer(opts));
var updateAdminStaff = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(updateAdminStaff_createServerFn_handler, async ({ data }) => {
	const { session, admin } = await requirePermissionFromToken(data.accessToken, "staff.manage");
	if (data.userId === session.userId && data.role !== "super_admin") throw new Error("You cannot demote your own super_admin account");
	if (data.userId === session.userId && !data.is_active) throw new Error("You cannot deactivate your own account");
	const { data: updated, error } = await admin.from("profiles").update({
		role: data.role,
		is_active: data.is_active,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.userId).select("*").single();
	if (error) throw error;
	await writeAuditLog({
		session,
		action: "staff.update",
		entityType: "profile",
		entityId: data.userId,
		details: {
			role: data.role,
			is_active: data.is_active
		}
	});
	return updated;
});
var promoteUserByEmail_createServerFn_handler = createServerRpc({
	id: "4bc67c0134bbf69aa883243bcb598f7a0a2583cae6df7ea51fe4b499b96e3ff9",
	name: "promoteUserByEmail",
	filename: "src/server/admin.ts"
}, (opts) => promoteUserByEmail.__executeServer(opts));
var promoteUserByEmail = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(promoteUserByEmail_createServerFn_handler, async ({ data }) => {
	const { session, admin } = await requirePermissionFromToken(data.accessToken, "staff.manage");
	if (!isStaffRole(data.role)) throw new Error("Invalid staff role");
	const email = data.email.trim().toLowerCase();
	const { data: profile, error: findError } = await admin.from("profiles").select("*").ilike("email", email).maybeSingle();
	if (findError) throw findError;
	if (!profile) throw new Error("No profile found for that email. Ask them to sign up on the store first.");
	const { data: updated, error } = await admin.from("profiles").update({
		role: data.role,
		is_active: true,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", profile.id).select("*").single();
	if (error) throw error;
	await writeAuditLog({
		session,
		action: "staff.promote",
		entityType: "profile",
		entityId: profile.id,
		details: {
			email,
			role: data.role
		}
	});
	return updated;
});
var getPermissionsMatrix_createServerFn_handler = createServerRpc({
	id: "90e5bcedbfdb9e3bb208687e55db715e77514d3a301a8085eb755f5b21df5293",
	name: "getPermissionsMatrix",
	filename: "src/server/admin.ts"
}, (opts) => getPermissionsMatrix.__executeServer(opts));
var getPermissionsMatrix = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(getPermissionsMatrix_createServerFn_handler, async ({ data }) => {
	const { overrides } = await requirePermissionFromToken(data.accessToken, "permissions.manage");
	return matrixFromRoleMap(overrides);
});
var savePermissionsMatrix_createServerFn_handler = createServerRpc({
	id: "96fbd681b9639947a0f004911b6a3d8c6765d98e2d9a2962d9cbad03a1b88d09",
	name: "savePermissionsMatrix",
	filename: "src/server/admin.ts"
}, (opts) => savePermissionsMatrix.__executeServer(opts));
var savePermissionsMatrix = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(savePermissionsMatrix_createServerFn_handler, async ({ data }) => {
	const { session, admin } = await requirePermissionFromToken(data.accessToken, "permissions.manage");
	const roleMap = roleMapFromMatrix(data.matrix);
	const rows = STAFF_ROLES.flatMap((role) => ALL_PERMISSIONS.map((permission) => ({
		role,
		permission,
		allowed: roleMap[role].includes(permission)
	})));
	const { error } = await admin.from("role_permissions").upsert(rows, { onConflict: "role,permission" });
	if (error) throw error;
	await writeAuditLog({
		session,
		action: "permissions.save",
		entityType: "role_permissions"
	});
	return matrixFromRoleMap(roleMap);
});
//#endregion
export { deleteAdminCustomer_createServerFn_handler, getAdminDashboardStats_createServerFn_handler, getAdminOrder_createServerFn_handler, getAdminSession_createServerFn_handler, getAdminUser_createServerFn_handler, getPermissionsMatrix_createServerFn_handler, listAdminOrders_createServerFn_handler, listAdminStaff_createServerFn_handler, listAdminUsers_createServerFn_handler, promoteUserByEmail_createServerFn_handler, savePermissionsMatrix_createServerFn_handler, updateAdminCustomer_createServerFn_handler, updateAdminOrderStatus_createServerFn_handler, updateAdminStaff_createServerFn_handler };
