import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Database, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { money } from "@/data/catalog";
import { getAccessToken } from "@/lib/admin/session";
import { deleteAdminProduct, listAdminProducts, seedCatalogFromStatic } from "@/server/catalog";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof listAdminProducts>>>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  async function reload() {
    const token = await getAccessToken();
    if (!token) throw new Error("Not signed in");
    const data = await listAdminProducts({ data: { accessToken: token } });
    setItems(data);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function seed() {
    setSeeding(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      const result = await seedCatalogFromStatic({ data: { accessToken: token } });
      await reload();
      toast.success(`Seeded ${result.products} products and ${result.coupons} coupons`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  }

  async function deactivate(id: string) {
    if (!confirm("Deactivate this product? It will be hidden from the storefront.")) return;
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      await deleteAdminProduct({ data: { accessToken: token, id } });
      await reload();
      toast.success("Product deactivated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not deactivate");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage catalog items shown on the storefront
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void seed()}
            disabled={seeding}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold hover:bg-secondary disabled:opacity-60"
          >
            <Database size={16} />
            {seeding ? "Seeding…" : "Seed from static catalog"}
          </button>
          <Link
            to="/admin/products/$id"
            params={{ id: "new" }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
          >
            <Plus size={16} /> Add product
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading products…</p>
        ) : (
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-2 font-semibold">Product</th>
                <th className="pb-2 font-semibold">Category</th>
                <th className="pb-2 font-semibold">Price</th>
                <th className="pb-2 font-semibold">Stock</th>
                <th className="pb-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted-foreground">
                    No products in database yet. Click &quot;Seed from static catalog&quot; to import
                    the default catalog.
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-xs">
                            —
                          </span>
                        )}
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{p.category}</td>
                    <td className="py-3">
                      {money(p.price)}
                      <span className="ml-1 text-xs text-muted-foreground line-through">
                        {money(p.mrp)}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          p.inStock ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.inStock ? "In stock" : "Out of stock"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to="/admin/products/$id"
                          params={{ id: p.id }}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => void deactivate(p.id)}
                          className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/5"
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <RefreshCw size={12} />
        Storefront falls back to static catalog if the database is empty or unreachable.
      </p>
    </div>
  );
}
