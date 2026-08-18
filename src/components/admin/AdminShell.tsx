import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Package,
  Shield,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { AdminSession } from "@/server/admin";
import type { AdminPermission } from "@/lib/admin/roles";

const links: Array<{
  to:
    | "/admin/dashboard"
    | "/admin/orders"
    | "/admin/users"
    | "/admin/products"
    | "/admin/coupons"
    | "/admin/reports"
    | "/admin/audit"
    | "/admin/staff"
    | "/admin/permissions";
  label: string;
  icon: LucideIcon;
  permission: AdminPermission;
}> = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { to: "/admin/orders", label: "Orders", icon: Package, permission: "orders.read" },
  { to: "/admin/users", label: "Users", icon: Users, permission: "users.read" },
  { to: "/admin/products", label: "Products", icon: Package, permission: "products.read" },
  { to: "/admin/coupons", label: "Coupons", icon: Tag, permission: "coupons.read" },
  { to: "/admin/reports", label: "Reports", icon: BarChart3, permission: "reports.read" },
  { to: "/admin/audit", label: "Audit log", icon: ClipboardList, permission: "audit.read" },
  { to: "/admin/staff", label: "Staff", icon: Shield, permission: "staff.manage" },
  {
    to: "/admin/permissions",
    label: "Permissions",
    icon: KeyRound,
    permission: "permissions.manage",
  },
];

export function AdminShell({
  session,
  onSignOut,
  children,
}: {
  session: AdminSession;
  onSignOut: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f4ef] text-foreground">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="font-display text-lg font-extrabold">Nuzz Admin</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{session.email}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            {session.role.replace("_", " ")}
          </p>
          <nav className="mt-5 grid gap-1">
            {links
              .filter((l) => session.permissions.includes(l.permission))
              .map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  activeProps={{ className: "bg-primary-soft text-primary" }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-secondary"
                >
                  <l.icon size={16} />
                  {l.label}
                </Link>
              ))}
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-destructive hover:bg-secondary"
            >
              <LogOut size={16} /> Sign out
            </button>
          </nav>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
