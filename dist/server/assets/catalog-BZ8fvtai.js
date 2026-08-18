import { t as createServerFn } from "../server.js";
import { a as parseProductRow, b as products, c as rowToProduct, m as coupons, o as productToRow, s as rowToCoupon, t as couponToRow } from "./catalog-db-CghLbik8.js";
import { n as createServerRpc } from "./supabase-BNLNooLQ.js";
import { r as writeAuditLog, t as requirePermissionFromToken } from "./admin-auth-z8tFOJAo.js";
//#region src/server/catalog.ts?tss-serverfn-split
var seedCatalogFromStatic_createServerFn_handler = createServerRpc({
	id: "624dda450a197b6671432529c3e7ee9ef75d3f2e48929a960066b27bff2fd0a6",
	name: "seedCatalogFromStatic",
	filename: "src/server/catalog.ts"
}, (opts) => seedCatalogFromStatic.__executeServer(opts));
var seedCatalogFromStatic = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(seedCatalogFromStatic_createServerFn_handler, async ({ data }) => {
	const { session, admin } = await requirePermissionFromToken(data.accessToken, "products.write");
	const productRows = products.map((p) => ({
		...productToRow(p),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}));
	const couponRows = coupons.map((c) => ({
		...couponToRow(c),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}));
	const { error: pErr } = await admin.from("products").upsert(productRows, { onConflict: "id" });
	if (pErr) throw pErr;
	const { error: cErr } = await admin.from("coupons").upsert(couponRows, { onConflict: "code" });
	if (cErr) throw cErr;
	await writeAuditLog({
		session,
		action: "catalog.seed",
		entityType: "catalog",
		details: {
			products: productRows.length,
			coupons: couponRows.length
		}
	});
	return {
		products: productRows.length,
		coupons: couponRows.length
	};
});
var listAdminProducts_createServerFn_handler = createServerRpc({
	id: "cf1382c6e4ea5681598d0e61585745ced86660535c555b65c7c67a067256c134",
	name: "listAdminProducts",
	filename: "src/server/catalog.ts"
}, (opts) => listAdminProducts.__executeServer(opts));
var listAdminProducts = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(listAdminProducts_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "products.read");
	const { data: rows, error } = await admin.from("products").select("*").order("name");
	if (error) throw error;
	return (rows ?? []).map((r) => rowToProduct(parseProductRow(r)));
});
var getAdminProduct_createServerFn_handler = createServerRpc({
	id: "54396c0d48269654ad585833821ff0af227bc31fc9a278596a11d5f71f73d34c",
	name: "getAdminProduct",
	filename: "src/server/catalog.ts"
}, (opts) => getAdminProduct.__executeServer(opts));
var getAdminProduct = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(getAdminProduct_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "products.read");
	const { data: row, error } = await admin.from("products").select("*").eq("id", data.id).maybeSingle();
	if (error) throw error;
	if (!row) throw new Error("Product not found");
	return rowToProduct(parseProductRow(row));
});
var upsertAdminProduct_createServerFn_handler = createServerRpc({
	id: "a1fe58f2b43dd55365d1ebda350cbb10f4297bd7832c118003fb73b48714c693",
	name: "upsertAdminProduct",
	filename: "src/server/catalog.ts"
}, (opts) => upsertAdminProduct.__executeServer(opts));
var upsertAdminProduct = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(upsertAdminProduct_createServerFn_handler, async ({ data }) => {
	const { session, admin } = await requirePermissionFromToken(data.accessToken, "products.write");
	const row = {
		...data.product,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	const { error } = await admin.from("products").upsert(row, { onConflict: "id" });
	if (error) throw error;
	await writeAuditLog({
		session,
		action: "product.upsert",
		entityType: "product",
		entityId: data.product.id,
		details: {
			slug: data.product.slug,
			name: data.product.name
		}
	});
	return rowToProduct(data.product);
});
var deleteAdminProduct_createServerFn_handler = createServerRpc({
	id: "16fafd27d8025fdeb96230d8420d49215fc1a28228092b1f93f9dc9a0f381876",
	name: "deleteAdminProduct",
	filename: "src/server/catalog.ts"
}, (opts) => deleteAdminProduct.__executeServer(opts));
var deleteAdminProduct = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(deleteAdminProduct_createServerFn_handler, async ({ data }) => {
	const { session, admin } = await requirePermissionFromToken(data.accessToken, "products.write");
	const { error } = await admin.from("products").update({
		active: false,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id);
	if (error) throw error;
	await writeAuditLog({
		session,
		action: "product.deactivate",
		entityType: "product",
		entityId: data.id
	});
	return { ok: true };
});
var listAdminCoupons_createServerFn_handler = createServerRpc({
	id: "c73e9e0c3a6082206bc829aac2e66b497a15d33b3c41798c87111df1b8a19426",
	name: "listAdminCoupons",
	filename: "src/server/catalog.ts"
}, (opts) => listAdminCoupons.__executeServer(opts));
var listAdminCoupons = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(listAdminCoupons_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "coupons.read");
	const { data: rows, error } = await admin.from("coupons").select("*").order("code");
	if (error) throw error;
	return (rows ?? []).map((r) => ({
		...rowToCoupon(r),
		active: r.active
	}));
});
var upsertAdminCoupon_createServerFn_handler = createServerRpc({
	id: "36f8c275197ebfd12f84219018b0e9bbfd206e29b982f9620818e2a7eece345a",
	name: "upsertAdminCoupon",
	filename: "src/server/catalog.ts"
}, (opts) => upsertAdminCoupon.__executeServer(opts));
var upsertAdminCoupon = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(upsertAdminCoupon_createServerFn_handler, async ({ data }) => {
	const { session, admin } = await requirePermissionFromToken(data.accessToken, "coupons.write");
	const row = {
		...data.coupon,
		code: data.coupon.code.toUpperCase(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	const { error } = await admin.from("coupons").upsert(row, { onConflict: "code" });
	if (error) throw error;
	await writeAuditLog({
		session,
		action: "coupon.upsert",
		entityType: "coupon",
		entityId: row.code
	});
	return rowToCoupon(row);
});
var getAdminReports_createServerFn_handler = createServerRpc({
	id: "240a888f657a18f4decefc9bcd56aa1dbccfa35f895b06750de2c822ecd3a616",
	name: "getAdminReports",
	filename: "src/server/catalog.ts"
}, (opts) => getAdminReports.__executeServer(opts));
var getAdminReports = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(getAdminReports_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "reports.read");
	const { data: orders } = await admin.from("orders").select("total, status, created_at, payment_method");
	const { data: profiles } = await admin.from("profiles").select("role, created_at");
	const { data: products } = await admin.from("products").select("id, active, in_stock");
	const { data: items } = await admin.from("order_items").select("product_name, qty, unit_price");
	const validOrders = (orders ?? []).filter((o) => o.status !== "Cancelled");
	const revenue = validOrders.reduce((s, o) => s + Number(o.total ?? 0), 0);
	const avgOrder = validOrders.length ? revenue / validOrders.length : 0;
	const byStatus = {};
	for (const o of orders ?? []) byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
	const topProducts = /* @__PURE__ */ new Map();
	for (const item of items ?? []) {
		const cur = topProducts.get(item.product_name) ?? {
			name: item.product_name,
			qty: 0,
			revenue: 0
		};
		cur.qty += item.qty;
		cur.revenue += Number(item.unit_price) * item.qty;
		topProducts.set(item.product_name, cur);
	}
	const topList = [...topProducts.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);
	return {
		revenue,
		revenue30: validOrders.filter((o) => {
			return new Date(o.created_at).getTime() > Date.now() - 2592e6;
		}).reduce((s, o) => s + Number(o.total ?? 0), 0),
		orderCount: orders?.length ?? 0,
		avgOrder,
		customerCount: (profiles ?? []).filter((p) => p.role === "customer").length,
		productCount: products?.length ?? 0,
		inStockCount: (products ?? []).filter((p) => p.in_stock && p.active).length,
		byStatus,
		topProducts: topList
	};
});
var listAuditLog_createServerFn_handler = createServerRpc({
	id: "6c1df528347f13f13c912311059de94c2794bb311e7cb6f13c6341b34b64abfd",
	name: "listAuditLog",
	filename: "src/server/catalog.ts"
}, (opts) => listAuditLog.__executeServer(opts));
var listAuditLog = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(listAuditLog_createServerFn_handler, async ({ data }) => {
	const { admin } = await requirePermissionFromToken(data.accessToken, "audit.read");
	const { data: rows, error } = await admin.from("audit_log").select("*").order("created_at", { ascending: false }).limit(data.limit ?? 100);
	if (error) throw error;
	return rows ?? [];
});
//#endregion
export { deleteAdminProduct_createServerFn_handler, getAdminProduct_createServerFn_handler, getAdminReports_createServerFn_handler, listAdminCoupons_createServerFn_handler, listAdminProducts_createServerFn_handler, listAuditLog_createServerFn_handler, seedCatalogFromStatic_createServerFn_handler, upsertAdminCoupon_createServerFn_handler, upsertAdminProduct_createServerFn_handler };
