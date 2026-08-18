import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { money } from "@/data/catalog";
import { getAccessToken } from "@/lib/admin/session";
import { getAdminReports } from "@/server/catalog";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

function AdminReports() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminReports>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Not signed in");
        const report = await getAdminReports({ data: { accessToken: token } });
        if (!cancelled) setData(report);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading reports…</p>;
  }

  if (!data) return null;

  const statCards = [
    { label: "Total revenue", value: money(data.revenue) },
    { label: "Last 30 days", value: money(data.revenue30) },
    { label: "Orders", value: String(data.orderCount) },
    { label: "Avg order value", value: money(Math.round(data.avgOrder)) },
    { label: "Customers", value: String(data.customerCount) },
    { label: "Products in stock", value: `${data.inStockCount} / ${data.productCount}` },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sales overview and top performers</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-extrabold">Orders by status</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(data.byStatus).length === 0 ? (
              <li className="text-muted-foreground">No orders yet</li>
            ) : (
              Object.entries(data.byStatus).map(([status, count]) => (
                <li key={status} className="flex items-center justify-between border-b border-border py-2">
                  <span className="font-semibold">{status}</span>
                  <span>{count}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-lg font-extrabold">Top products</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {data.topProducts.length === 0 ? (
              <li className="text-muted-foreground">No sales data yet</li>
            ) : (
              data.topProducts.map((p) => (
                <li key={p.name} className="flex items-center justify-between border-b border-border py-2">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.qty} units sold</p>
                  </div>
                  <span className="font-bold">{money(p.revenue)}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
