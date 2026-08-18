import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Heart, LogOut, PackageSearch, PawPrint, User } from "lucide-react";
import { rupeesFromPoints } from "@/lib/loyalty";
import { useStore } from "@/store/StoreContext";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — The Nuzz Story" },
      { name: "description", content: "Manage your profile, pet profiles, wishlist, loyalty points and order history." },
      { property: "og:title", content: "My Account — The Nuzz Story" },
      { property: "og:description", content: "Your orders, pets, wishlist and loyalty points in one place." },
    ],
  }),
  component: AccountLayout,
});

const nav = [
  { to: "/account/profile", label: "Profile & Pets", icon: PawPrint },
  { to: "/account/orders", label: "Order History", icon: PackageSearch },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
] as const;

function AccountLayout() {
  const { user, signOut, loyaltyPoints } = useStore();

  return (
    <div className="mx-auto grid max-w-7xl gap-5 px-3 py-6 sm:px-4 sm:py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
      <aside className="h-fit rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><User size={18} /></span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold">{user ? user.name : "Guest"}</p>
            <p className="truncate text-xs text-muted-foreground">{user ? user.email : "Not signed in"}</p>
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-sand px-3 py-2 text-xs font-semibold">
          {loyaltyPoints} loyalty / Paw Points
          {loyaltyPoints >= 100 ? ` · ₹${rupeesFromPoints(loyaltyPoints)}` : ""}
        </p>
        <nav className="mt-4 grid gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeProps={{ className: "bg-primary-soft text-primary" }}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-secondary">
              <n.icon size={16} /> {n.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => void signOut()}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-destructive hover:bg-secondary"
            >
              <LogOut size={16} /> Sign out
            </button>
          ) : (
            <Link to="/account/login" activeProps={{ className: "bg-primary-soft text-primary" }}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-secondary">
              <User size={16} /> Login / Sign up
            </Link>
          )}
        </nav>
      </aside>
      <section><Outlet /></section>
    </div>
  );
}
