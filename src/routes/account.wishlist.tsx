import { Link, createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/store/StoreContext";

export const Route = createFileRoute("/account/wishlist")({
  component: Wishlist,
});

function Wishlist() {
  const { wishlist, products } = useStore();
  const items = products.filter((p) => wishlist.includes(p.slug));

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">Nothing saved yet.</p>
          <Link to="/category/$slug" params={{ slug: "dog-food" }}
            className="mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </div>
  );
}
