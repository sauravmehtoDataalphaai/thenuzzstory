import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Banknote, Check, CreditCard, Landmark, Smartphone } from "lucide-react";
import { money } from "@/data/catalog";
import { rupeesFromPoints } from "@/lib/loyalty";
import { useStore } from "@/store/StoreContext";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — The Nuzz Story" },
      { name: "description", content: "Add your delivery address, choose a payment method and place your pet supplies order." },
      { property: "og:title", content: "Checkout — The Nuzz Story" },
      { property: "og:description", content: "Secure checkout with UPI, cards, net banking and cash on delivery." },
    ],
  }),
  component: Checkout,
});

const steps = ["Address", "Payment", "Confirm"];
const payments = [
  { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm & more", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major Indian banks", icon: Landmark },
  { id: "cod", label: "Cash on Delivery", desc: "₹29 handling fee applies", icon: Banknote },
];

function Checkout() {
  const {
    cart,
    subtotal,
    discount,
    deliveryFee,
    total,
    addresses,
    addAddress,
    placeOrder,
    user,
    products,
    loyaltyPoints,
    loyaltyDiscount,
    redeemLoyalty,
    setRedeemLoyalty,
  } = useStore();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [pay, setPay] = useState("upi");
  const [showForm, setShowForm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selected && addresses[0]) setSelected(addresses[0].id);
    if (addresses.length === 0) setShowForm(true);
  }, [addresses, selected]);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-extrabold">Login to checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with email OTP so we can save your address and order history.
        </p>
        <Link
          to="/account/login"
          className="mt-5 inline-block rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          Login / Sign up
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-extrabold">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add a few things to your cart first.</p>
        <Link to="/" className="mt-5 inline-block rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-8">
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Checkout</h1>

      <ol className="mt-6 flex items-center gap-2">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {i < step ? <Check size={15} /> : i + 1}
            </span>
            <span className={`truncate text-xs font-bold sm:text-sm ${i <= step ? "" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <span className={`h-0.5 flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {step === 0 && (
            <div className="space-y-4">
              {addresses.map((a) => (
                <label key={a.id} className={`flex cursor-pointer gap-3 rounded-2xl border p-4 ${selected === a.id ? "border-primary bg-primary-soft/40" : "border-border bg-card"}`}>
                  <input type="radio" name="addr" checked={selected === a.id} onChange={() => setSelected(a.id)} className="mt-1 accent-[var(--color-primary)]" />
                  <div className="min-w-0 text-sm">
                    <p className="font-bold">{a.name} <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold">{a.type}</span></p>
                    <p className="mt-1 text-muted-foreground">{a.address}, {a.landmark}, {a.city}, {a.state} — {a.pincode}</p>
                    <p className="text-muted-foreground">Phone: {a.phone}</p>
                  </div>
                </label>
              ))}

              {showForm ? (
                <form
                  className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    void (async () => {
                      try {
                        const created = await addAddress({
                          name: String(f.get("name")),
                          phone: String(f.get("phone")),
                          pincode: String(f.get("pincode")),
                          address: String(f.get("address")),
                          city: String(f.get("city")),
                          state: String(f.get("state")),
                          landmark: String(f.get("landmark")),
                          type: f.get("type") === "Work" ? "Work" : "Home",
                        });
                        setSelected(created.id);
                        setShowForm(false);
                      } catch {
                        /* toast handled in store */
                      }
                    })();
                  }}
                >
                  <p className="font-display text-lg font-bold sm:col-span-2">Add a new address</p>
                  <Field name="name" label="Full name" />
                  <Field name="phone" label="Phone number" />
                  <Field name="pincode" label="Pincode" />
                  <Field name="city" label="City" />
                  <Field name="state" label="State" />
                  <Field name="landmark" label="Landmark" required={false} />
                  <div className="sm:col-span-2"><Field name="address" label="Flat, building, street" /></div>
                  <div className="sm:col-span-2">
                    <span className="text-xs font-semibold text-muted-foreground">Address type</span>
                    <div className="mt-2 flex gap-4 text-sm">
                      {["Home", "Work"].map((t) => (
                        <label key={t} className="flex items-center gap-2">
                          <input type="radio" name="type" value={t} defaultChecked={t === "Home"} className="accent-[var(--color-primary)]" /> {t}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground sm:col-span-2">Save address</button>
                </form>
              ) : (
                <button type="button" onClick={() => setShowForm(true)} className="w-full rounded-2xl border border-dashed border-border px-4 py-3 text-sm font-semibold hover:bg-secondary">
                  + Add a new address
                </button>
              )}

              <button type="button" disabled={!selected} onClick={() => setStep(1)} className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:bg-muted disabled:text-muted-foreground">
                Continue to payment
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              {payments.map((p) => (
                <label key={p.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${pay === p.id ? "border-primary bg-primary-soft/40" : "border-border bg-card"}`}>
                  <input type="radio" name="pay" checked={pay === p.id} onChange={() => setPay(p.id)} className="accent-[var(--color-primary)]" />
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary"><p.icon size={18} /></span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{p.label}</span>
                    <span className="text-xs text-muted-foreground">{p.desc}</span>
                  </span>
                </label>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(0)} className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Back</button>
                <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Review order</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
              <p className="font-display text-lg font-bold">Review &amp; place order</p>
              <p className="text-sm text-muted-foreground">
                Paying via <b className="text-foreground">{payments.find((p) => p.id === pay)?.label}</b> · Delivering to{" "}
                <b className="text-foreground">{addresses.find((a) => a.id === selected)?.address}</b>
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Back</button>
                <button
                  type="button"
                  disabled={placing}
                  onClick={() => {
                    void (async () => {
                      setPlacing(true);
                      try {
                        const id = await placeOrder({ paymentMethod: pay, addressId: selected });
                        navigate({ to: "/order-confirmation", search: { order: id } });
                      } catch {
                        /* toast in store */
                      } finally {
                        setPlacing(false);
                      }
                    })();
                  }}
                  className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow disabled:opacity-60"
                >
                  {placing ? "Placing…" : `Place Order · ${money(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-40">
          <p className="font-display text-lg font-extrabold">Order summary</p>
          <div className="mt-3 space-y-3">
            {cart.map((l) => {
              const p = products.find((x) => x.slug === l.slug);
              return (
                <div key={l.slug + l.variant} className="flex gap-3">
                  <img src={p?.image} alt="" loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="truncate font-semibold">{p?.name}</p>
                    <p className="text-muted-foreground">{l.variant} × {l.qty}</p>
                  </div>
                  <span className="text-sm font-bold">{money(l.unitPrice * l.qty)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-bold text-success">- {money(discount)}</span></div>}
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loyalty</span>
                <span className="font-bold text-success">- {money(loyaltyDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-semibold">{deliveryFee === 0 ? "FREE" : money(deliveryFee)}</span></div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-extrabold"><span>Total</span><span>{money(total)}</span></div>
          </div>

          {loyaltyPoints >= 100 && rupeesFromPoints(loyaltyPoints) > 0 && (
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-3 text-sm">
              <input
                type="checkbox"
                checked={redeemLoyalty}
                onChange={(e) => setRedeemLoyalty(e.target.checked)}
                className="mt-0.5 accent-[var(--color-primary)]"
              />
              <span>
                <span className="font-bold">Redeem loyalty points</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {loyaltyPoints} points · worth {money(rupeesFromPoints(loyaltyPoints))}
                  {redeemLoyalty && loyaltyDiscount > 0
                    ? ` · applying ${money(loyaltyDiscount)} off`
                    : ""}
                  {redeemLoyalty && loyaltyDiscount === 0
                    ? " · nothing left to redeem on this total"
                    : ""}
                </span>
              </span>
            </label>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ name, label, required = true }: { name: string; label: string; required?: boolean }) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        name={name}
        required={required}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
