import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/admin/session";
import { statusBadgeClass } from "@/lib/admin/order-status";
import { getAdminDashboardStats } from "@/server/admin";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

type Stats = Awaited<ReturnType<typeof getAdminDashboardStats>>;

function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Not signed in");
        const data = await getAdminDashboardStats({ data: { accessToken: token } });
        if (!cancelled) setStats(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading dashboard…</p>;
  }

  if (!stats) return null;

  const cards = [
    { label: "Orders", value: String(stats.ordersCount) },
    { label: "Customers", value: String(stats.usersCount) },
    { label: "Revenue", value: `₹${Math.round(stats.revenue).toLocaleString("en-IN")}` },
    { label: "Processing", value: String(stats.processing) },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Store overview for The Nuzz Story</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {c.label}
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-primary">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-2 font-semibold">Order</th>
                <th className="pb-2 font-semibold">Customer</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-muted-foreground">
                    No orders yet
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="py-3">
                      <Link
                        to="/admin/orders/$id"
                        params={{ id: o.id }}
                        className="font-semibold text-primary"
                      >
                        {o.id}
                      </Link>
                    </td>
                    <td className="py-3">{o.shipping_name || "—"}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(o.status)}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 font-semibold">
                      ₹{Number(o.total).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
