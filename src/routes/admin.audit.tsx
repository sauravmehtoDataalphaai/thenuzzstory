import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/admin/session";
import { listAuditLog } from "@/server/catalog";
import type { AuditLogRow } from "@/types/database";

export const Route = createFileRoute("/admin/audit")({
  component: AdminAudit,
});

function AdminAudit() {
  const [rows, setRows] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Not signed in");
        const data = await listAuditLog({ data: { accessToken: token, limit: 150 } });
        if (!cancelled) setRows(data as AuditLogRow[]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load audit log");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Audit log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent admin actions across orders, staff, catalog and permissions
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading audit log…</p>
        ) : (
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-2 font-semibold">When</th>
                <th className="pb-2 font-semibold">Actor</th>
                <th className="pb-2 font-semibold">Action</th>
                <th className="pb-2 font-semibold">Entity</th>
                <th className="pb-2 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No audit entries yet
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-border align-top">
                    <td className="py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(row.created_at).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3">
                      <p className="font-semibold">{row.actor_email || "—"}</p>
                    </td>
                    <td className="py-3 font-mono text-xs">{row.action}</td>
                    <td className="py-3 text-xs">
                      {row.entity_type}
                      {row.entity_id ? ` · ${row.entity_id}` : ""}
                    </td>
                    <td className="py-3 max-w-xs truncate text-xs text-muted-foreground">
                      {Object.keys(row.details ?? {}).length
                        ? JSON.stringify(row.details)
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
