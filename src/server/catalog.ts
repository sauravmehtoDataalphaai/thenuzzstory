import { createServerFn } from "@tanstack/react-start";
import { products as staticProducts, coupons as staticCoupons } from "@/data/catalog";
import {
  couponToRow,
  parseProductRow,
  productToRow,
  rowToCoupon,
  rowToProduct,
  type CouponRow,
  type ProductRow,
} from "@/lib/catalog-db";
import { createServiceSupabase } from "@/server/supabase";
import { writeAuditLog } from "@/server/audit";
import { requirePermissionFromToken } from "@/server/admin-auth";

export const seedCatalogFromStatic = createServerFn({ method: "POST" })
  .inputValidator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { session, admin } = await requirePermissionFromToken(data.accessToken, "products.write");

    const productRows = staticProducts.map((p) => ({
      ...productToRow(p),
      updated_at: new Date().toISOString(),
    }));
    const couponRows = staticCoupons.map((c) => ({
      ...couponToRow(c),
      updated_at: new Date().toISOString(),
    }));

    const { error: pErr } = await admin.from("products").upsert(productRows, { onConflict: "id" });
    if (pErr) throw pErr;
    const { error: cErr } = await admin.from("coupons").upsert(couponRows, { onConflict: "code" });
    if (cErr) throw cErr;

    await writeAuditLog({
      session,
      action: "catalog.seed",
      entityType: "catalog",
      details: { products: productRows.length, coupons: couponRows.length },
    });

    return { products: productRows.length, coupons: couponRows.length };
  });

export const listAdminProducts = createServerFn({ method: "POST" })
  .inputValidator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { admin } = await requirePermissionFromToken(data.accessToken, "products.read");
    const { data: rows, error } = await admin.from("products").select("*").order("name");
    if (error) throw error;
    return (rows ?? []).map((r) => rowToProduct(parseProductRow(r)));
  });

export const getAdminProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { admin } = await requirePermissionFromToken(data.accessToken, "products.read");
    const { data: row, error } = await admin.from("products").select("*").eq("id", data.id).maybeSingle();
    if (error) throw error;
    if (!row) throw new Error("Product not found");
    return rowToProduct(parseProductRow(row));
  });

export const upsertAdminProduct = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      accessToken: string;
      product: ProductRow;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { session, admin } = await requirePermissionFromToken(data.accessToken, "products.write");
    const row = {
      ...data.product,
      updated_at: new Date().toISOString(),
    };

    const { error } = await admin.from("products").upsert(row, { onConflict: "id" });
    if (error) throw error;

    await writeAuditLog({
      session,
      action: "product.upsert",
      entityType: "product",
      entityId: data.product.id,
      details: { slug: data.product.slug, name: data.product.name },
    });

    return rowToProduct(data.product);
  });

export const deleteAdminProduct = createServerFn({ method: "POST" })
  .inputValidator((data: { accessToken: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { session, admin } = await requirePermissionFromToken(data.accessToken, "products.write");
    const { error } = await admin
      .from("products")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw error;

    await writeAuditLog({
      session,
      action: "product.deactivate",
      entityType: "product",
      entityId: data.id,
    });
    return { ok: true };
  });

export const listAdminCoupons = createServerFn({ method: "POST" })
  .inputValidator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { admin } = await requirePermissionFromToken(data.accessToken, "coupons.read");
    const { data: rows, error } = await admin.from("coupons").select("*").order("code");
    if (error) throw error;
    return (rows ?? []).map((r) => ({ ...rowToCoupon(r as CouponRow), active: (r as CouponRow).active }));
  });

export const upsertAdminCoupon = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      accessToken: string;
      coupon: CouponRow;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { session, admin } = await requirePermissionFromToken(data.accessToken, "coupons.write");
    const row = {
      ...data.coupon,
      code: data.coupon.code.toUpperCase(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await admin.from("coupons").upsert(row, { onConflict: "code" });
    if (error) throw error;

    await writeAuditLog({
      session,
      action: "coupon.upsert",
      entityType: "coupon",
      entityId: row.code,
    });

    return rowToCoupon(row);
  });

export const getAdminReports = createServerFn({ method: "POST" })
  .inputValidator((data: { accessToken: string }) => data)
  .handler(async ({ data }) => {
    const { admin } = await requirePermissionFromToken(data.accessToken, "reports.read");

    const { data: orders } = await admin.from("orders").select("total, status, created_at, payment_method");
    const { data: profiles } = await admin.from("profiles").select("role, created_at");
    const { data: products } = await admin.from("products").select("id, active, in_stock");
    const { data: items } = await admin.from("order_items").select("product_name, qty, unit_price");

    const validOrders = (orders ?? []).filter((o) => o.status !== "Cancelled");
    const revenue = validOrders.reduce((s, o) => s + Number(o.total ?? 0), 0);
    const avgOrder = validOrders.length ? revenue / validOrders.length : 0;

    const byStatus: Record<string, number> = {};
    for (const o of orders ?? []) {
      byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
    }

    const topProducts = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const item of items ?? []) {
      const cur = topProducts.get(item.product_name) ?? {
        name: item.product_name,
        qty: 0,
        revenue: 0,
      };
      cur.qty += item.qty;
      cur.revenue += Number(item.unit_price) * item.qty;
      topProducts.set(item.product_name, cur);
    }

    const topList = [...topProducts.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

    const last30 = validOrders.filter((o) => {
      const d = new Date(o.created_at);
      return d.getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
    });
    const revenue30 = last30.reduce((s, o) => s + Number(o.total ?? 0), 0);

    return {
      revenue,
      revenue30,
      orderCount: orders?.length ?? 0,
      avgOrder,
      customerCount: (profiles ?? []).filter((p) => p.role === "customer").length,
      productCount: products?.length ?? 0,
      inStockCount: (products ?? []).filter((p) => p.in_stock && p.active).length,
      byStatus,
      topProducts: topList,
    };
  });

export const listAuditLog = createServerFn({ method: "POST" })
  .inputValidator((data: { accessToken: string; limit?: number }) => data)
  .handler(async ({ data }) => {
    const { admin } = await requirePermissionFromToken(data.accessToken, "audit.read");
    const { data: rows, error } = await admin
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 100);
    if (error) throw error;
    return rows ?? [];
  });
