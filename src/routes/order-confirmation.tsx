import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, PawPrint } from "lucide-react";
import { PAW_POINTS_PER_ORDER } from "@/lib/loyalty";
import { z } from "zod";

export const Route = createFileRoute("/order-confirmation")({
  validateSearch: z.object({ order: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — The Nuzz Story" },
      { name: "description", content: "Your pet supplies order is confirmed and on its way." },
      { property: "og:title", content: "Order Confirmed — The Nuzz Story" },
      { property: "og:description", content: "Thanks for shopping with The Nuzz Story." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const { order } = Route.useSearch();
  const id = order ?? "PP-20000";
  const eta = new Date(Date.now() + 3 * 864e5).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <span className="mx-auto grid h-24 w-24 animate-[scale-in_0.4s_ease-out] place-items-center rounded-full bg-success/15 text-success">
        <CheckCircle2 size={48} />
      </span>
      <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">Order confirmed!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tails are already wagging. We've emailed your invoice and tracking details.
      </p>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Order ID</p>
            <p className="font-display text-xl font-extrabold">{id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Estimated delivery</p>
            <p className="font-display text-xl font-extrabold">{eta}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-primary-soft p-4 text-sm text-primary">
          <PawPrint size={18} /> You earned {PAW_POINTS_PER_ORDER} Paw Points on this order.
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/account/track/$id" params={{ id }} className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
          Track Order
        </Link>
        <Link to="/" className="rounded-2xl border border-border px-6 py-3 text-sm font-bold hover:bg-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
