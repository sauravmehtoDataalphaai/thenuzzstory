import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { money, resolveCatalogImage } from "@/data/catalog";
import { fetchOrders } from "@/lib/auth";
import { customerStatusLabel, statusBadgeClass } from "@/lib/admin/order-status";
import { useStore } from "@/store/StoreContext";
import type { OrderItemRow, OrderRow } from "@/types/database";

export const Route = createFileRoute("/account/orders")({
  component: Orders,
});

type OrderWithItems = OrderRow & { items: OrderItemRow[] };

function Orders() {
  const { user, lastOrderId } = useStore();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const rows = await fetchOrders(user.id);
        if (!cancelled) setOrders(rows);
      } catch (err) {
        console.error(err);
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, lastOrderId]);

  if (!user) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <h1 className="font-display text-2xl font-extrabold">Order history</h1>
        <p className="mt-2 text-sm text-muted-foreground">Login to see your past orders.</p>
        <Link
          to="/account/login"
          className="mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h1 className="font-display text-2xl font-extrabold">Order history</h1>
      {loading && <p className="text-sm text-muted-foreground">Loading orders…</p>}
      {!loading && orders.length === 0 && (
        <p className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No orders yet. Your purchases will show up here after checkout.
        </p>
      )}
      {orders.map((o) => (
        <article key={o.id} className="rounded-3xl border border-border bg-card p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
            <div className="min-w-0">
              <p className="truncate font-display text-base font-bold">Order {o.id}</p>
              <p className="text-xs text-muted-foreground">
                Placed{" "}
                {new Date(o.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClass(o.status)}`}
            >
              {customerStatusLabel(o.status)}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {o.items.map((item) => (
              <Link
                key={item.id}
                to="/product/$slug"
                params={{ slug: item.product_slug }}
                className="flex min-w-0 items-center gap-2"
              >
                {item.image_url ? (
                  <img
                    src={resolveCatalogImage(item.image_url)}
                    alt={item.product_name}
                    loading="lazy"
                    className="h-12 w-12 shrink-0 rounded-xl border border-border object-cover"
                  />
                ) : (
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-sand text-xs">
                    NZ
                  </span>
                )}
                <span className="truncate text-sm">
                  {item.product_name}
                  <span className="block text-xs text-muted-foreground">
                    {item.variant} × {item.qty}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <p className="text-sm font-bold">Total {money(Number(o.total))}</p>
            <Link
              to="/account/track/$id"
              params={{ id: o.id }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              <PackageSearch size={15} /> Track order
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
