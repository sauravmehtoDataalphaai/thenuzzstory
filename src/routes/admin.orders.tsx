import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  ADMIN_ORDER_STATUSES,
  TRACKING_STATUSES,
  statusBadgeClass,
} from "@/lib/admin/order-status";
import { getAccessToken } from "@/lib/admin/session";
import { listAdminOrders, updateAdminOrderStatus } from "@/server/admin";
import type { OrderRow } from "@/types/database";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

type MenuAnchor = {
  orderId: string;
  top: number;
  left: number;
  width: number;
};

function StatusMenu({
  order,
  anchor,
  busy,
  onClose,
  onSelect,
}: {
  order: OrderRow;
  anchor: MenuAnchor;
  busy: boolean;
  onClose: () => void;
  onSelect: (status: string) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuWidth = 200;
  const left = Math.min(
    Math.max(8, anchor.left + anchor.width - menuWidth),
    window.innerWidth - menuWidth - 8,
  );
  const top = Math.min(anchor.top, window.innerHeight - 280);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-[100] cursor-default bg-transparent"
        onClick={onClose}
      />
      <div
        ref={menuRef}
        role="menu"
        className="fixed z-[101] min-w-[200px] rounded-xl border border-border bg-card py-1 shadow-lift"
        style={{ top, left }}
      >
        {order.status === "Processing" && (
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            onClick={() => onSelect("Order placed")}
            className="mx-1 block w-[calc(100%-0.5rem)] rounded-lg bg-primary px-3 py-2 text-left text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            Confirm order
          </button>
        )}
        {order.status === "Processing" && (
          <div className="my-1 border-t border-border" />
        )}
        {TRACKING_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            role="menuitem"
            disabled={order.status === s || busy}
            onClick={() => onSelect(s)}
            className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            {s}
            {order.status === s && (
              <span className="ml-1 text-[10px] text-muted-foreground">(current)</span>
            )}
          </button>
        ))}
        <div className="my-1 border-t border-border" />
        <button
          type="button"
          role="menuitem"
          disabled={order.status === "Cancelled" || busy}
          onClick={() => onSelect("Cancelled")}
          className="block w-full px-3 py-2 text-left text-xs font-semibold text-destructive hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Cancel order
        </button>
      </div>
    </>,
    document.body,
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);

  async function reload() {
    const token = await getAccessToken();
    if (!token) throw new Error("Not signed in");
    const data = await listAdminOrders({
      data: { accessToken: token, status },
    });
    setOrders(data);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    if (!menuAnchor) return;
    function reposition() {
      setMenuAnchor(null);
    }
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [menuAnchor]);

  async function setOrderStatus(orderId: string, nextStatus: string) {
    setBusyId(orderId);
    setMenuAnchor(null);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      await updateAdminOrderStatus({
        data: { accessToken: token, orderId, status: nextStatus },
      });
      await reload();
      toast.success(`Order updated to "${nextStatus}"`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  const menuOrder = menuAnchor ? orders.find((o) => o.id === menuAnchor.orderId) : null;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">All customer orders and delivery status</p>
        </div>
        <label className="text-sm">
          <span className="text-xs font-semibold text-muted-foreground">Filter status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            {ADMIN_ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading orders…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="pb-2 font-semibold">Order</th>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold">Phone</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Total</th>
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 pr-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => {
                    const isOpen = menuAnchor?.orderId === o.id;
                    return (
                      <tr key={o.id} className="border-t border-border">
                        <td className="py-3">
                          <Link
                            to="/admin/orders/$id"
                            params={{ id: o.id }}
                            className="font-semibold text-primary"
                          >
                            {o.id}
                          </Link>
                        </td>
                        <td className="py-3">{o.shipping_name}</td>
                        <td className="py-3">{o.shipping_phone}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(o.status)}`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 font-semibold">
                          ₹{Number(o.total).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(o.created_at).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 pr-2">
                          <button
                            type="button"
                            disabled={busyId === o.id}
                            aria-expanded={isOpen}
                            aria-haspopup="menu"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              if (isOpen) {
                                setMenuAnchor(null);
                              } else {
                                setMenuAnchor({
                                  orderId: o.id,
                                  top: rect.bottom + 6,
                                  left: rect.left,
                                  width: rect.width,
                                });
                              }
                            }}
                            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-60 ${
                              isOpen
                                ? "border-primary bg-primary-soft text-primary"
                                : "border-border hover:bg-secondary"
                            }`}
                          >
                            {busyId === o.id ? "Updating…" : "Update status"}
                            <ChevronDown
                              size={14}
                              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {menuAnchor && menuOrder && (
        <StatusMenu
          order={menuOrder}
          anchor={menuAnchor}
          busy={busyId === menuOrder.id}
          onClose={() => setMenuAnchor(null)}
          onSelect={(next) => void setOrderStatus(menuOrder.id, next)}
        />
      )}
    </div>
  );
}
