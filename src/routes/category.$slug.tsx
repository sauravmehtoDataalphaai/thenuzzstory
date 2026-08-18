import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { brands, categories, money, productTypes } from "@/data/catalog";
import { useStore } from "@/store/StoreContext";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = categories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Category unavailable — The Nuzz Story" }, { name: "robots", content: "noindex" }],
      };
    }
    const t = `${loaderData.category.name} — Buy Online | The Nuzz Story`;
    const d = `Shop ${loaderData.category.name.toLowerCase()} (${loaderData.category.blurb}) with free delivery above ₹499, vet-reviewed picks and easy returns.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
      ],
    };
  },
  component: CategoryPage,
});

const SORTS = [
  { id: "popularity", label: "Popularity" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
  { id: "rating", label: "Rating" },
] as const;

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { products, catalogLoading } = useStore();
  const [maxPrice, setMaxPrice] = useState(3000);
  const [brandSel, setBrandSel] = useState<string[]>([]);
  const [petSel, setPetSel] = useState<string[]>([]);
  const [typeSel, setTypeSel] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("popularity");
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [category.slug, catalogLoading]);

  const inCategory = useMemo(
    () => products.filter((p) => p.category === category.slug),
    [category.slug, products],
  );
  const availableBrands = useMemo(
    () => brands.filter((b) => inCategory.some((p) => p.brand === b)),
    [inCategory],
  );
  const availableTypes = useMemo(
    () => productTypes.filter((t) => inCategory.some((p) => p.type === t)),
    [inCategory],
  );

  const filtered = useMemo(() => {
    const list = inCategory.filter(
      (p) =>
        p.price <= maxPrice &&
        (brandSel.length === 0 || brandSel.includes(p.brand)) &&
        (petSel.length === 0 || petSel.includes(p.pet)) &&
        (typeSel.length === 0 || typeSel.includes(p.type)) &&
        p.rating >= minRating &&
        (!inStockOnly || p.inStock),
    );
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return Number(b.isNew) - Number(a.isNew);
        default:
          return b.popularity - a.popularity;
      }
    });
    return sorted;
  }, [inCategory, maxPrice, brandSel, petSel, typeSel, minRating, inStockOnly, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const resetFilters = () => {
    setMaxPrice(3000);
    setBrandSel([]);
    setPetSel([]);
    setTypeSel([]);
    setMinRating(0);
    setInStockOnly(false);
  };

  const Filters = (
    <div className="space-y-7">
      <FilterBlock title="Price range">
        <input
          type="range"
          min={199}
          max={3000}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="w-full accent-[var(--color-primary)]"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Up to <span className="font-bold text-foreground">{money(maxPrice)}</span>
        </p>
      </FilterBlock>

      <FilterBlock title="Brand">
        {availableBrands.map((b) => (
          <Check
            key={b}
            label={b}
            checked={brandSel.includes(b)}
            onChange={() => toggle(brandSel, setBrandSel, b)}
          />
        ))}
      </FilterBlock>

      <FilterBlock title="Pet type">
        {["dog", "cat"].map((p) => (
          <Check
            key={p}
            label={p === "dog" ? "Dog" : "Cat"}
            checked={petSel.includes(p)}
            onChange={() => toggle(petSel, setPetSel, p)}
          />
        ))}
      </FilterBlock>

      <FilterBlock title="Product type">
        {availableTypes.map((t) => (
          <Check
            key={t}
            label={t}
            checked={typeSel.includes(t)}
            onChange={() => toggle(typeSel, setTypeSel, t)}
          />
        ))}
      </FilterBlock>

      <FilterBlock title="Rating">
        {[4.5, 4, 3.5, 0].map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
            <input
              type="radio"
              name="rating"
              checked={minRating === r}
              onChange={() => setMinRating(r)}
              className="accent-[var(--color-primary)]"
            />
            {r === 0 ? "All ratings" : `${r} ★ & above`}
          </label>
        ))}
      </FilterBlock>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold">
        In stock only
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-primary)]"
        />
      </label>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight size={13} />
        <span>Shop</span>
        <ChevronRight size={13} />
        <span className="font-semibold text-foreground">{category.name}</span>
      </nav>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold sm:text-4xl">{category.name}</h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {filtered.length} products · {category.blurb}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-semibold lg:hidden sm:px-3 sm:py-2.5 sm:text-sm"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort products"
            className="rounded-xl border border-border bg-card px-2 py-1.5 text-xs font-semibold outline-none sm:px-3 sm:py-2.5 sm:text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-40 rounded-2xl border border-border bg-card p-5">{Filters}</div>
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="font-display text-lg font-bold">No products match these filters</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                {filtered.slice(0, visible).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {visible < filtered.length && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + 8)}
                    className="rounded-2xl border border-border bg-card px-8 py-3 text-sm font-bold hover:bg-secondary"
                  >
                    Load more ({filtered.length - visible} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-foreground/50"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-lg font-extrabold">Filters</span>
              <button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>
            {Filters}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
            >
              Show {filtered.length} products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[var(--color-primary)]"
      />
      {label}
    </label>
  );
}
