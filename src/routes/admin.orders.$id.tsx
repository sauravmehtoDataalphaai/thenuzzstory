import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { TRACKING_STATUSES, statusBadgeClass } from "@/lib/admin/order-status";
import { getAccessToken } from "@/lib/admin/session";
import { getAdminOrder, updateAdminOrderStatus } from "@/server/admin";

export const Route = createFileRoute("/admin/orders/$id")({
  component: AdminOrderDetail,
});

type Detail = Awaited<ReturnType<typeof getAdminOrder>>;

function AdminOrderDetail() {
  const { id } = Route.useParams();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Not signed in");
        const data = await getAdminOrder({ data: { accessToken: token, orderId: id } });
        if (!cancelled) {
          setDetail(data);
          setStatus(data.order.status);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function saveStatus() {
    if (!detail) return;
    setBusy(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      const updated = await updateAdminOrderStatus({
        data: { accessToken: token, orderId: id, status },
      });
      setDetail({ ...detail, order: updated });
      toast.success("Delivery status updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading order…</p>;
  if (!detail) return null;

  const { order, items, customer } = detail;

  return (
    <div className="grid gap-6">
      <div>
        <Link to="/admin/orders" className="text-sm font-semibold text-primary">
          ← Back to orders
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold">{order.id}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Placed {new Date(order.created_at).toLocaleString("en-IN")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold">Delivery status</h2>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="text-xs font-semibold text-muted-foreground">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="Processing">Processing</option>
                {TRACKING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
            <button
              type="button"
              disabled={busy || status === order.status}
              onClick={() => void saveStatus()}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Saving…" : "Update status"}
            </button>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(order.status)}`}
            >
              Current: {order.status}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold">Customer & shipping</h2>
          <dl className="mt-3 grid gap-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Name</dt>
              <dd className="font-semibold">{order.shipping_name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Phone</dt>
              <dd className="font-semibold">{order.shipping_phone}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Address</dt>
              <dd className="font-semibold">{order.shipping_address}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Account email</dt>
              <dd className="font-semibold">
                {customer ? (
                  <Link
                    to="/admin/users/$id"
                    params={{ id: customer.id }}
                    className="text-primary"
                  >
                    {customer.email}
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Payment</dt>
              <dd className="font-semibold">{order.payment_method || "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold">Items</h2>
        <ul className="mt-3 divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-semibold">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.variant} · qty {item.qty}
                </p>
              </div>
              <p className="font-semibold">
                ₹{(Number(item.unit_price) * item.qty).toLocaleString("en-IN")}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Discount</span>
            <span>-₹{Number(order.discount).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery</span>
            <span>₹{Number(order.delivery_fee).toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
