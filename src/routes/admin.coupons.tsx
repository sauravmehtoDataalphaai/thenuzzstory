import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { couponToRow } from "@/lib/catalog-db";
import { getAccessToken } from "@/lib/admin/session";
import { listAdminCoupons, upsertAdminCoupon } from "@/server/catalog";

export const Route = createFileRoute("/admin/coupons")({
  component: AdminCoupons,
});

type CouponForm = {
  code: string;
  label: string;
  type: "percent" | "flat";
  value: number;
  minCart: number;
  active: boolean;
};

const emptyCoupon = (): CouponForm => ({
  code: "",
  label: "",
  type: "percent",
  value: 10,
  minCart: 0,
  active: true,
});

function AdminCoupons() {
  const [items, setItems] = useState<
    Array<CouponForm & { code: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CouponForm>(emptyCoupon());
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function reload() {
    const token = await getAccessToken();
    if (!token) throw new Error("Not signed in");
    const data = await listAdminCoupons({ data: { accessToken: token } });
    setItems(
      data.map((c) => ({
        code: c.code,
        label: c.label,
        type: c.type,
        value: c.value,
        minCart: c.minCart,
        active: (c as { active?: boolean }).active !== false,
      })),
    );
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load coupons");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      const row = couponToRow(
        {
          code: form.code,
          label: form.label,
          type: form.type,
          value: form.value,
          minCart: form.minCart,
        },
        form.active,
      );
      await upsertAdminCoupon({ data: { accessToken: token, coupon: row } });
      setForm(emptyCoupon());
      setShowForm(false);
      await reload();
      toast.success("Coupon saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function edit(c: CouponForm & { code: string }) {
    setForm(c);
    setShowForm(true);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">Promo codes customers can apply at checkout</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(emptyCoupon());
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Plus size={16} /> Add coupon
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => void save(e)}
          className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"
        >
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Code</span>
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm uppercase"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Label</span>
            <input
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Type</span>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "flat" })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            >
              <option value="percent">Percent off</option>
              <option value="flat">Flat ₹ off</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Value</span>
            <input
              type="number"
              required
              min={0}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Min cart (₹)</span>
            <input
              type="number"
              min={0}
              value={form.minCart}
              onChange={(e) => setForm({ ...form, minCart: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="flex items-end gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save coupon"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading coupons…</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-2 font-semibold">Code</th>
                <th className="pb-2 font-semibold">Label</th>
                <th className="pb-2 font-semibold">Discount</th>
                <th className="pb-2 font-semibold">Min cart</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No coupons yet
                  </td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c.code} className="border-t border-border">
                    <td className="py-3 font-mono font-bold">{c.code}</td>
                    <td className="py-3">{c.label}</td>
                    <td className="py-3">
                      {c.type === "percent" ? `${c.value}%` : `₹${c.value}`}
                    </td>
                    <td className="py-3">₹{c.minCart}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          c.active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => edit(c)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
