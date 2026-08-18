import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, PackageOpen, Plus, Tag, Trash2 } from "lucide-react";
import { money } from "@/data/catalog";
import { useStore } from "@/store/StoreContext";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — The Nuzz Story" },
      { name: "description", content: "Review your pet food, grooming and accessory picks before checkout." },
      { property: "og:title", content: "Your Cart — The Nuzz Story" },
      { property: "og:description", content: "Review your cart and apply coupons before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const {
    cart, updateQty, removeLine, subtotal, discount, deliveryFee, total, savings,
    coupon, applyCoupon, removeCoupon, products,
  } = useStore();
  const [code, setCode] = useState("");

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-primary-soft text-primary">
          <PackageOpen size={40} />
        </span>
        <h1 className="font-display text-3xl font-extrabold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground">
          No kibble, no toys, no treats. Let's fix that right away.
        </p>
        <Link to="/" className="mt-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-8">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Your Cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cart.length} item(s) · You save {money(savings)}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {cart.map((line) => {
            const p = products.find((x) => x.slug === line.slug);
            return (
              <div key={line.slug + line.variant} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                <img src={p?.image} alt={p?.name ?? ""} loading="lazy" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to="/product/$slug" params={{ slug: line.slug }} className="line-clamp-2 text-sm font-bold hover:text-primary">
                    {p?.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p?.brand} · {line.variant}{line.subscription && " · Monthly subscription (10% off)"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-lg border border-border">
                      <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(line.slug, line.variant, line.qty - 1)} className="px-2.5 py-1.5"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-bold">{line.qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => updateQty(line.slug, line.variant, line.qty + 1)} className="px-2.5 py-1.5"><Plus size={14} /></button>
                    </div>
                    <span className="text-base font-extrabold">{money(line.unitPrice * line.qty)}</span>
                    <button type="button" onClick={() => removeLine(line.slug, line.variant)} className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive">
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-40">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="flex items-center gap-2 text-sm font-bold"><Tag size={16} className="text-primary" /> Apply coupon</p>
            {coupon ? (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-success/10 px-3 py-2.5 text-sm">
                <span className="font-bold text-success">{coupon.code} applied</span>
                <button type="button" onClick={removeCoupon} className="text-xs font-semibold text-muted-foreground">Remove</button>
              </div>
            ) : (
              <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (applyCoupon(code)) setCode(""); }}>
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="PAW20" aria-label="Coupon code"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm uppercase outline-none focus:border-primary" />
                <button type="submit" className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Apply</button>
              </form>
            )}
            <p className="mt-2 text-xs text-muted-foreground">Try PAW20, NEWPET or GROOM10</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-card p-5 text-sm">
            <p className="mb-2 font-display text-lg font-extrabold">Price details</p>
            <Row label="Subtotal" value={money(subtotal)} />
            <Row label="Discount" value={discount ? `- ${money(discount)}` : "—"} good={!!discount} />
            <Row label="Delivery" value={deliveryFee === 0 ? "FREE" : money(deliveryFee)} />
            <div className="flex justify-between border-t border-border pt-3 text-base font-extrabold">
              <span>Total</span><span>{money(total)}</span>
            </div>
            <Link to="/checkout" className="mt-3 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground hover:shadow-glow">
              Proceed to Checkout
            </Link>
            <Link to="/" className="block rounded-xl border border-border px-4 py-3 text-center text-sm font-semibold hover:bg-secondary">
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={good ? "font-bold text-success" : "font-semibold"}>{value}</span>
    </div>
  );
}
