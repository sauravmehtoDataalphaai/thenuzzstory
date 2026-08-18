import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { statusBadgeClass } from "@/lib/admin/order-status";
import { getAccessToken } from "@/lib/admin/session";
import { getAdminUser } from "@/server/admin";

export const Route = createFileRoute("/admin/users/$id")({
  component: AdminUserDetail,
});

type Detail = Awaited<ReturnType<typeof getAdminUser>>;

function AdminUserDetail() {
  const { id } = Route.useParams();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Not signed in");
        const data = await getAdminUser({ data: { accessToken: token, userId: id } });
        if (!cancelled) setDetail(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading user…</p>;
  if (!detail) return null;

  const { profile, addresses, orders } = detail;

  return (
    <div className="grid gap-6">
      <div>
        <Link to="/admin/users" className="text-sm font-semibold text-primary">
          ← Back to users
        </Link>
        <h1 className="mt-2 font-display text-2xl font-extrabold">
          {profile.name || profile.email}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Phone", value: profile.phone || "—" },
          { label: "Role", value: profile.role },
          { label: "Loyalty", value: String(profile.loyalty_points) },
          { label: "Active", value: profile.is_active ? "Yes" : "No" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-display text-lg font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold">Addresses</h2>
        {addresses.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No saved addresses</p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {addresses.map((a) => (
              <li key={a.id} className="rounded-xl bg-secondary/50 p-3 text-sm">
                <p className="font-semibold">
                  {a.type} · {a.name}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {a.address}, {a.city}, {a.state} — {a.pincode}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold">Orders</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-2 font-semibold">Order</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Total</th>
                <th className="pb-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-muted-foreground">
                    No orders
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
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
                    <td className="py-3 text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString("en-IN")}
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
