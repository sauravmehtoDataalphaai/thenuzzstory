import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { CategorySlug, Pet, Product } from "@/data/catalog";
import { productToRow } from "@/lib/catalog-db";
import { getAccessToken } from "@/lib/admin/session";
import { getAdminProduct, upsertAdminProduct } from "@/server/catalog";

export const Route = createFileRoute("/admin/products/$id")({
  component: AdminProductEdit,
});

const CATEGORIES: CategorySlug[] = [
  "dog-food",
  "cat-food",
  "dog-grooming",
  "cat-grooming",
  "toys",
  "accessories",
  "healthcare",
];

function emptyProduct(id: string): Product {
  return {
    id,
    slug: "",
    name: "",
    brand: "",
    pet: "dog" as Pet,
    category: "dog-food" as CategorySlug,
    type: "",
    price: 0,
    mrp: 0,
    rating: 4.5,
    reviews: 0,
    image: "",
    variants: [{ label: "Standard pack", priceDelta: 0 }],
    inStock: true,
    isNew: false,
    popularity: 50,
    subscribable: false,
    lifeStage: "all",
    description: "",
    specs: [] as { label: string; value: string }[],
    ingredients: "",
  };
}

function AdminProductEdit() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const [form, setForm] = useState<Product>(emptyProduct(crypto.randomUUID()));
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Not signed in");
        const product = await getAdminProduct({ data: { accessToken: token, id } });
        if (!cancelled) setForm(product);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Product not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      const slug =
        form.slug.trim() ||
        form.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      const payload = productToRow({ ...form, slug }, true);
      await upsertAdminProduct({ data: { accessToken: token, product: payload } });
      toast.success(isNew ? "Product created" : "Product saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading product…</p>;
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeft size={16} /> Back to products
        </Link>
        <h1 className="mt-3 font-display text-2xl font-extrabold">
          {isNew ? "Add product" : "Edit product"}
        </h1>
      </div>

      <form onSubmit={(e) => void save(e)} className="grid gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            <span className="text-xs font-semibold text-muted-foreground">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Slug</span>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto from name if empty"
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Brand</span>
            <input
              required
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Pet</span>
            <select
              value={form.pet}
              onChange={(e) => setForm({ ...form, pet: e.target.value as Pet })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as CategorySlug })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Type</span>
            <input
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Price (₹)</span>
            <input
              type="number"
              required
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">MRP (₹)</span>
            <input
              type="number"
              required
              min={0}
              value={form.mrp}
              onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-xs font-semibold text-muted-foreground">Image URL</span>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-xs font-semibold text-muted-foreground">Description</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
            />
            In stock
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
            />
            New arrival
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.subscribable}
              onChange={(e) => setForm({ ...form, subscribable: e.target.checked })}
            />
            Subscribable
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-fit rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save product"}
        </button>
      </form>
    </div>
  );
}
