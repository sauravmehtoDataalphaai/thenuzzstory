import { Link } from "@tanstack/react-router";
import { Minus, PackageOpen, Plus, Trash2, X } from "lucide-react";
import { money } from "@/data/catalog";
import { useStore } from "@/store/StoreContext";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQty, removeLine, subtotal, discount, deliveryFee, total, products } =
    useStore();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-foreground/50"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-lift">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="font-display text-base font-extrabold sm:text-lg">Your Cart ({cart.length})</h2>
          <button type="button" aria-label="Close cart" onClick={() => setCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary">
              <PackageOpen size={34} />
            </span>
            <p className="font-display text-lg font-bold">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Treats, kibble and toys are waiting for a very good pet.
            </p>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:space-y-4 sm:px-5 sm:py-4">
              {cart.map((line) => {
                const p = products.find((x) => x.slug === line.slug);
                return (
                  <div key={line.slug + line.variant} className="flex gap-2.5 sm:gap-3">
                    <img
                      src={p?.image}
                      alt={p?.name ?? ""}
                      loading="lazy"
                      className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold sm:text-sm">{p?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {line.variant}
                        {line.subscription && " · Monthly subscription"}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(line.slug, line.variant, line.qty - 1)}
                            className="px-2 py-1.5"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">{line.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(line.slug, line.variant, line.qty + 1)}
                            className="px-2 py-1.5"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-bold">{money(line.unitPrice * line.qty)}</span>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeLine(line.slug, line.variant)}
                          className="ml-auto text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 border-t border-border px-4 py-3 text-xs sm:px-5 sm:py-4 sm:text-sm">
              <Row label="Subtotal" value={money(subtotal)} />
              {discount > 0 && <Row label="Discount" value={`- ${money(discount)}`} good />}
              <Row label="Delivery" value={deliveryFee === 0 ? "FREE" : money(deliveryFee)} />
              <div className="flex items-center justify-between border-t border-border pt-2 text-base font-bold">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setCartOpen(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold hover:bg-secondary"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:shadow-glow"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Row({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={good ? "font-semibold text-success" : "font-semibold"}>{value}</span>
    </div>
  );
}
