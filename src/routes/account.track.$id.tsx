import { useEffect, useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { TRACKING_STEPS, statusToStepIndex } from "@/lib/admin/order-status";
import { fetchOrderById } from "@/lib/auth";
import { useStore } from "@/store/StoreContext";
import type { OrderItemRow, OrderRow } from "@/types/database";

export const Route = createFileRoute("/account/track/$id")({
  component: Track,
});

function Track() {
  const { id } = Route.useParams();
  const { user } = useStore();
  const [order, setOrder] = useState<(OrderRow & { items: OrderItemRow[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const row = await fetchOrderById(user.id, id);
        if (!cancelled) setOrder(row);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, id]);

  if (!user) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Login to track your order.</p>
        <Link
          to="/account/login"
          className="mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading tracking…</p>;
  }

  if (!order) {
    throw notFound();
  }

  const current = statusToStepIndex(order.status);

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <h1 className="font-display text-2xl font-extrabold">Tracking {id}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {order.status === "Processing"
          ? "Waiting for store confirmation — we'll update tracking once your order is confirmed."
          : order.status === "Delivered"
            ? "Delivered — thank you for shopping with us!"
            : "Estimated delivery: within 2 business days"}
      </p>
      {order.status === "Processing" ? (
        <p className="mt-4 rounded-xl bg-sand px-4 py-3 text-sm font-semibold">
          Status: Processing — admin will confirm your order soon.
        </p>
      ) : (
        <ol className="mt-6 grid gap-5">
          {TRACKING_STEPS.map((s, i) => {
            const done = current >= 0 && i <= current;
            return (
              <li key={s.status} className="flex gap-3">
                <span className={done ? "text-primary" : "text-muted-foreground"}>
                  {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-bold ${done ? "" : "text-muted-foreground"}`}>
                    {s.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <Link
        to="/account/orders"
        className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
      >
        ← Back to order history
      </Link>
    </div>
  );
}
