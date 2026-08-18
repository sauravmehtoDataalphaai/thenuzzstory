import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  BadgePercent,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { Stars } from "@/components/Stars";
import { categories, money, resolveCatalogImage } from "@/data/catalog";
import { fetchProductBySlug } from "@/lib/catalog-db";
import { useStore } from "@/store/StoreContext";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable — The Nuzz Story" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.product;
    const t = `${p.name} by ${p.brand} — The Nuzz Story`;
    const d = `${p.name} at ${money(p.price)} (MRP ${money(p.mrp)}). Rated ${p.rating}/5 by ${p.reviews} pet parents. Free delivery above ₹499.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: ProductPage,
});

const TABS = ["Description", "Ingredients & Specs", "Reviews & Ratings"] as const;

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, wishlist, toggleWishlist, products } = useStore();
  const [variant, setVariant] = useState(product.variants[0]!.label);
  const [qty, setQty] = useState(1);
  const [subscribe, setSubscribe] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Description");
  const [thumb, setThumb] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pinResult, setPinResult] = useState<string | null>(null);
  const [bundle, setBundle] = useState<string[]>([]);

  const delta = product.variants.find((v: { label: string; priceDelta: number }) => v.label === variant)?.priceDelta ?? 0;
  const price = product.price + delta;
  const mrp = product.mrp + delta;
  const off = Math.round(((mrp - price) / mrp) * 100);
  const subPrice = Math.round(price * 0.9);
  const category = categories.find((c) => c.slug === product.category)!;
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const fbt = products.filter((p) => p.pet === product.pet && p.id !== product.id).slice(0, 2);
  const bundleTotal = price + fbt.filter((p) => bundle.includes(p.id)).reduce((s, p) => s + p.price, 0);
  const gallery = [
    resolveCatalogImage(product.image, product.category),
    category.image,
    resolveCatalogImage(product.image, product.category),
    category.image,
  ];
  const wished = wishlist.includes(product.slug);

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-8">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={13} />
        <Link to="/category/$slug" params={{ slug: product.category }} className="hover:text-primary">
          {category.name}
        </Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="grid gap-4 sm:grid-cols-[84px_minmax(0,1fr)]">
          <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
            {gallery.map((g, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setThumb(i)}
                aria-label={`View image ${i + 1}`}
                className={`overflow-hidden rounded-xl border-2 bg-sand ${
                  thumb === i ? "border-primary" : "border-border"
                }`}
              >
                <img src={g} alt="" loading="lazy" className="h-20 w-20 object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 overflow-hidden rounded-3xl border border-border bg-sand sm:order-2">
            <img
              src={gallery[thumb]}
              alt={product.name}
              width={800}
              height={800}
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>

        {/* Buy box */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </p>
          <h1 className="mt-1 font-display text-xl font-extrabold leading-tight sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Stars rating={product.rating} />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
            <span
              className={`ml-2 rounded-full px-2.5 py-1 text-xs font-bold ${
                product.inStock ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
              }`}
            >
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-2xl font-extrabold sm:text-3xl">
              {money(subscribe ? subPrice : price)}
            </span>
            <span className="text-base text-muted-foreground line-through">{money(mrp)}</span>
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
              {off}% OFF
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          {/* Variants */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Select {product.variants.length > 1 ? "pack size" : "pack"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v: { label: string; priceDelta: number }) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setVariant(v.label)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    variant === v.label
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-card hover:border-primary"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subscribe & save */}
          {product.subscribable && (
            <div className="mt-5 rounded-2xl border border-border bg-card p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <RefreshCw size={15} className="text-primary" /> Subscribe &amp; Save 10%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Monthly delivery at {money(subPrice)}. Pause, skip or cancel anytime.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={subscribe}
                  aria-label="Toggle monthly subscription"
                  onClick={() => setSubscribe((s) => !s)}
                  className={`h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${
                    subscribe ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-card transition-transform ${
                      subscribe ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Qty + CTAs */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-border bg-card">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3">
                <Minus size={15} />
              </button>
              <span className="w-9 text-center text-sm font-bold">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="px-3 py-3">
                <Plus size={15} />
              </button>
            </div>
            <button
              type="button"
              disabled={!product.inStock}
              onClick={() => addToCart(product, variant, qty, subscribe)}
              className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-shadow hover:shadow-glow disabled:bg-muted disabled:text-muted-foreground"
            >
              Add to Cart
            </button>
            <Link
              to="/checkout"
              onClick={() => addToCart(product, variant, qty, subscribe)}
              className="flex-1 rounded-xl bg-foreground px-6 py-3 text-center text-sm font-bold text-background"
            >
              Buy Now
            </Link>
            <button
              type="button"
              aria-label="Toggle wishlist"
              onClick={() => toggleWishlist(product.slug)}
              className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-card"
            >
              <Heart size={18} className={wished ? "fill-primary text-primary" : ""} />
            </button>
          </div>

          {/* Offers */}
          <div className="mt-6 rounded-2xl border border-border bg-primary-soft/60 p-4">
            <p className="flex items-center gap-2 text-sm font-bold">
              <BadgePercent size={16} className="text-primary" /> Offers on this product
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              <li>• Flat 20% off above ₹999 with code <b className="text-foreground">PAW20</b></li>
              <li>• 10% instant discount on HDFC &amp; ICICI credit cards</li>
              <li>• Free grooming kit on your first order above ₹999</li>
              <li>• Earn 50 Paw Points on this purchase</li>
            </ul>
          </div>

          {/* Pincode */}
          <div className="mt-5 rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 text-sm font-bold">
              <Truck size={16} className="text-primary" /> Check delivery
            </p>
            <form
              className="mt-2 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPinResult(
                  /^\d{6}$/.test(pincode)
                    ? `Delivers to ${pincode} by ${new Date(Date.now() + 2 * 864e5).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · COD available`
                    : "Please enter a valid 6-digit pincode",
                );
              }}
            >
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
                aria-label="Pincode"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button type="submit" className="shrink-0 rounded-xl border border-primary px-4 py-2.5 text-sm font-bold text-primary">
                Check
              </button>
            </form>
            {pinResult && <p className="mt-2 text-xs font-semibold text-success">{pinResult}</p>}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-primary" /> 100% genuine</span>
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-primary" /> Free above ₹499</span>
            <span className="flex items-center gap-1.5"><RefreshCw size={14} className="text-primary" /> 7-day returns</span>
          </div>
        </div>
      </div>

      {/* Frequently bought together */}
      <section className="mt-14 rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-extrabold">Frequently bought together</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-3">
            <BundleRow name={product.name} price={price} image={resolveCatalogImage(product.image, product.category)} locked />
            {fbt.map((p) => (
              <BundleRow
                key={p.id}
                name={p.name}
                price={p.price}
                image={resolveCatalogImage(p.image, p.category)}
                checked={bundle.includes(p.id)}
                onToggle={() =>
                  setBundle((b) => (b.includes(p.id) ? b.filter((x) => x !== p.id) : [...b, p.id]))
                }
              />
            ))}
          </div>
          <div className="rounded-2xl bg-sand p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Bundle total</p>
            <p className="font-display text-2xl font-extrabold">{money(bundleTotal)}</p>
            <button
              type="button"
              onClick={() => {
                addToCart(product, variant, 1, subscribe);
                fbt.filter((p) => bundle.includes(p.id)).forEach((p) => addToCart(p));
              }}
              className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Add bundle to cart
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-12">
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="py-6 text-sm leading-relaxed text-muted-foreground">
          {tab === "Description" && <p className="max-w-3xl">{product.description}</p>}

          {tab === "Ingredients & Specs" && (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-display text-base font-bold text-foreground">Ingredients</h3>
                <p>{product.ingredients}</p>
              </div>
              <div>
                <h3 className="mb-2 font-display text-base font-bold text-foreground">Specifications</h3>
                <dl className="divide-y divide-border rounded-2xl border border-border bg-card">
                  {product.specs.map((s: { label: string; value: string }) => (
                    <div key={s.label} className="flex justify-between gap-4 px-4 py-2.5">
                      <dt>{s.label}</dt>
                      <dd className="text-right font-semibold text-foreground">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {tab === "Reviews & Ratings" && (
            <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="rounded-2xl border border-border bg-card p-5 text-center">
                <p className="font-display text-4xl font-extrabold text-foreground">{product.rating}</p>
                <div className="mt-1 flex justify-center"><Stars rating={product.rating} /></div>
                <p className="mt-1 text-xs">{product.reviews} verified reviews</p>
              </div>
              <div className="space-y-4">
                {[
                  { n: "Meera K.", r: 5, t: "My picky eater finished the whole bowl. Packaging was sealed and fresh." },
                  { n: "Arjun S.", r: 4, t: "Great quality for the price. Delivery took a day longer than promised." },
                  { n: "Nikhil R.", r: 5, t: "Noticeable difference in coat shine within three weeks. Repeat buyer now." },
                ].map((r) => (
                  <div key={r.n} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <Stars rating={r.r} size={13} />
                      <span className="text-sm font-bold text-foreground">{r.n}</span>
                      <span className="ml-auto flex items-center gap-1 text-xs text-success">
                        <Check size={13} /> Verified
                      </span>
                    </div>
                    <p className="mt-2">{r.t}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => toast("Review form coming soon")}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  Write a review
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-extrabold sm:mb-5 sm:text-2xl">You may also like</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BundleRow({
  name,
  price,
  image,
  checked,
  onToggle,
  locked,
}: {
  name: string;
  price: number;
  image: string;
  checked?: boolean;
  onToggle?: () => void;
  locked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-border p-3">
      <input
        type="checkbox"
        checked={locked ? true : !!checked}
        disabled={locked}
        onChange={onToggle}
        aria-label={`Include ${name}`}
        className="h-4 w-4 accent-[var(--color-primary)]"
      />
      <img src={image} alt="" loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{name}</span>
      <span className="text-sm font-bold">{money(price)}</span>
    </label>
  );
}
