import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Heart,
  HeartPulse,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  Scissors,
  Stethoscope,
  Dog,
  Cat,
  Bone,
} from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { money, resolveCatalogImage } from "@/data/catalog";
import { useStore } from "@/store/StoreContext";

const navLinks = [
  { to: "/category/$slug", params: { slug: "dog-food" }, label: "Dog", icon: Dog },
  { to: "/category/$slug", params: { slug: "cat-food" }, label: "Cat", icon: Cat },
  { to: "/category/$slug", params: { slug: "toys" }, label: "Toys", icon: Bone },
  { to: "/category/$slug", params: { slug: "healthcare" }, label: "Healthcare", icon: HeartPulse },
] as const;

const mobileShopLinks = [
  { slug: "dog-food", label: "Dog Food" },
  { slug: "cat-grooming", label: "Cat Grooming" },
  { slug: "toys", label: "Toys" },
  { slug: "accessories", label: "Accessories" },
  { slug: "healthcare", label: "Healthcare" },
] as const;

const linkClass =
  "rounded-xl px-3 py-2 text-[13px] font-semibold text-[#c79236] hover:bg-[#c79236]/10 sm:text-sm";

export function Header() {
  const { cartCount, setCartOpen, wishlist, user, products, signOut } = useStore();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMenuOpen(false);
    setFocused(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, products]);

  async function handleLogout() {
    setMenuOpen(false);
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#0d1b4b] bg-[rgb(13,27,75)] text-[#c79236] backdrop-blur">
      <div className="relative flex items-center gap-2 px-3 py-2 lg:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-[#c79236]/60 text-[#c79236]"
        >
          <Menu size={18} strokeWidth={2.75} />
        </button>

        <BrandLockup compact className="min-w-0 flex-1" />

        <div className="ml-auto flex shrink-0 items-center gap-1 text-[#c79236]">
          <Link
            to="/account/profile"
            aria-label="Profile"
            className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-[#c79236]/60 bg-card text-xs font-bold text-[#c79236]"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={17} strokeWidth={2.75} />}
          </Link>
          <button
            type="button"
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
            className="relative grid h-9 w-9 place-items-center rounded-xl border-2 border-[#c79236]/60 bg-[rgb(13,27,75)] text-[#c79236]"
          >
            <ShoppingCart size={17} strokeWidth={2.75} />
            {cartCount > 0 && <Badge count={cartCount} />}
          </button>
        </div>
      </div>

      <div className="mx-auto hidden max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-3 text-[#c79236] lg:grid">
        <BrandLockup />

        <div ref={boxRef} className="relative min-w-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const first = suggestions[0];
              if (first) navigate({ to: "/product/$slug", params: { slug: first.slug } });
            }}
          >
            <label className="flex items-center gap-2 rounded-2xl border border-[#c79236]/40 bg-card px-3 py-2.5 focus-within:border-[#c79236]">
              <Search size={17} className="shrink-0 text-[#c79236]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Search food, grooming, toys…"
                className="w-full min-w-0 bg-transparent text-sm text-[#c79236] outline-none placeholder:text-[#c79236]/60"
                aria-label="Search products"
              />
            </label>
          </form>

          {focused && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-lift">
              {suggestions.map((p) => (
                <Link
                  key={p.id}
                  to="/product/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => setQuery("")}
                  className="flex items-center gap-3 px-3 py-2.5 text-[#c79236] transition-colors hover:bg-secondary"
                >
                  <img
                    src={resolveCatalogImage(p.image, p.category)}
                    alt=""
                    loading="lazy"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="text-xs text-[#c79236]/70">{p.brand}</span>
                  </span>
                  <span className="text-sm font-bold">{money(p.price)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 text-[#c79236]">
          <Link
            to="/account/wishlist"
            aria-label="Wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-[#c79236]/10"
          >
            <Heart size={19} strokeWidth={2.5} />
            {wishlist.length > 0 && <Badge count={wishlist.length} />}
          </Link>
          <Link
            to="/account/profile"
            aria-label="Account"
            className="grid h-10 w-10 place-items-center rounded-xl hover:bg-[#c79236]/10"
          >
            <User size={19} strokeWidth={2.5} />
          </Link>
          <button
            type="button"
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
            className="relative grid h-10 w-10 place-items-center rounded-xl bg-[rgb(13,27,75)] text-[#c79236] transition-shadow hover:shadow-glow"
          >
            <ShoppingCart size={19} strokeWidth={2.5} />
            {cartCount > 0 && <Badge count={cartCount} />}
          </button>
        </div>
      </div>

      <nav className="mx-auto hidden max-w-7xl items-center gap-6 px-4 pb-3 text-sm font-semibold text-[#c79236] lg:flex">
        {navLinks.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            params={l.params}
            className="flex items-center gap-1.5 transition-colors hover:opacity-80"
          >
            <l.icon size={16} strokeWidth={2.5} /> {l.label}
          </Link>
        ))}
        <Link to="/grooming" className="flex items-center gap-1.5 transition-colors hover:opacity-80">
          <Scissors size={16} strokeWidth={2.5} /> Grooming Services
        </Link>
        <Link to="/contact" className="flex items-center gap-1.5 transition-colors hover:opacity-80">
          <Stethoscope size={16} strokeWidth={2.5} /> Vet Consultation
        </Link>
        <Link to="/about" className="ml-auto transition-colors hover:opacity-80">
          About
        </Link>
        <Link to="/faq" className="transition-colors hover:opacity-80">
          FAQ
        </Link>
      </nav>

      <div className="overflow-hidden border-t border-[#c79236]/20 bg-[rgb(13,27,75)] py-1.5">
        <div className="flex w-max animate-promo-marquee whitespace-nowrap text-xs font-semibold text-white">
          <span className="px-8">
            Free delivery above ₹499 · Use code PAW20 for flat 20% off · Vet-reviewed products
          </span>
          <span className="px-8" aria-hidden>
            Free delivery above ₹499 · Use code PAW20 for flat 20% off · Vet-reviewed products
          </span>
          <span className="px-8" aria-hidden>
            Free delivery above ₹499 · Use code PAW20 for flat 20% off · Vet-reviewed products
          </span>
          <span className="px-8" aria-hidden>
            Free delivery above ₹499 · Use code PAW20 for flat 20% off · Vet-reviewed products
          </span>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-foreground/50"
          />
          <div className="absolute left-0 top-0 flex h-full w-[78%] max-w-[280px] flex-col bg-background text-[#c79236]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-display text-base font-extrabold text-[#c79236]">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="text-[#c79236]"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
              {mobileShopLinks.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className={linkClass}
                >
                  {c.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              <Link to="/account/profile" className={linkClass}>
                Profile
              </Link>
            </nav>

            <div className="border-t border-border p-3">
              {user ? (
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#c79236]/40 px-3 py-2.5 text-[13px] font-semibold text-[#c79236]"
                >
                  <LogOut size={15} /> Logout
                </button>
              ) : (
                <Link
                  to="/account/login"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[rgb(13,27,75)] px-3 py-2.5 text-[13px] font-semibold text-[#c79236]"
                >
                  <User size={15} /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#c79236] px-1 text-[9px] font-bold text-[rgb(13,27,75)] sm:h-5 sm:min-w-5 sm:text-[10px]">
      {count}
    </span>
  );
}
