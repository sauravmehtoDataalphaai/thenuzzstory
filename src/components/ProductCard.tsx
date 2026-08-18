import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { Stars } from "@/components/Stars";
import { money, resolveCatalogImage, type Product } from "@/data/catalog";
import { useStore } from "@/store/StoreContext";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist, pets } = useStore();
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const wished = wishlist.includes(product.slug);
  const matchedPet = pets.find((p) => p.type === product.pet);

  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card sm:rounded-2xl">
      <button
        type="button"
        onClick={() => toggleWishlist(product.slug)}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-card/90 shadow-soft backdrop-blur transition-colors hover:bg-primary-soft sm:right-3 sm:top-3 sm:h-9 sm:w-9"
      >
        <Heart
          size={14}
          className={cn(wished ? "fill-primary text-primary" : "text-muted-foreground")}
        />
      </button>

      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden bg-sand"
      >
        <img
          src={resolveCatalogImage(product.image, product.category)}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground sm:px-2.5 sm:py-1 sm:text-[11px]">
              {off}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground sm:px-2.5 sm:py-1 sm:text-[11px]">
              NEW
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-foreground/80 px-1.5 py-0.5 text-[9px] font-bold text-background sm:px-2.5 sm:py-1 sm:text-[11px]">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-2.5 sm:gap-2 sm:p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">
          {product.brand}
        </p>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 text-xs font-semibold leading-snug hover:text-primary sm:text-sm"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground sm:gap-1.5 sm:text-xs">
          <Stars rating={product.rating} size={11} />
          <span>({product.reviews})</span>
        </div>
        {matchedPet && (
          <span className="hidden w-fit rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent sm:inline">
            Recommended for {matchedPet.name}
          </span>
        )}
        <div className="mt-auto flex items-baseline gap-1.5 pt-1 sm:gap-2">
          <span className="text-sm font-bold sm:text-base">{money(product.price)}</span>
          <span className="text-[10px] text-muted-foreground line-through sm:text-xs">{money(product.mrp)}</span>
        </div>
        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => addToCart(product)}
          className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-2 py-1.5 text-[11px] font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm"
        >
          <ShoppingCart size={14} />
          <span className="sm:hidden">{product.inStock ? "Add" : "Notify"}</span>
          <span className="hidden sm:inline">{product.inStock ? "Add to Cart" : "Notify me"}</span>
        </button>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card sm:rounded-2xl">
      <div className="aspect-square w-full animate-pulse bg-muted" />
      <div className="space-y-2 p-2.5 sm:p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-9 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
