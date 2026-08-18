import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
  STAFF_ROLES,
  type AdminPermission,
  type StaffRole,
} from "@/lib/admin/roles";
import { getAccessToken } from "@/lib/admin/session";
import { getPermissionsMatrix, savePermissionsMatrix } from "@/server/admin";

export const Route = createFileRoute("/admin/permissions")({
  component: AdminPermissions,
});

type Matrix = Record<StaffRole, Record<AdminPermission, boolean>>;

function AdminPermissions() {
  const [matrix, setMatrix] = useState<Matrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Not signed in");
        const data = await getPermissionsMatrix({ data: { accessToken: token } });
        if (!cancelled) setMatrix(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load permissions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(role: StaffRole, permission: AdminPermission) {
    if (!matrix) return;
    if (role === "super_admin") {
      toast.message("super_admin always has full access");
      return;
    }
    setMatrix({
      ...matrix,
      [role]: {
        ...matrix[role],
        [permission]: !matrix[role][permission],
      },
    });
  }

  async function save() {
    if (!matrix) return;
    setBusy(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      const saved = await savePermissionsMatrix({
        data: { accessToken: token, matrix },
      });
      setMatrix(saved);
      toast.success("Permissions saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading permissions…</p>;
  if (!matrix) return null;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Permissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control which admin pages each staff role can use
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="pb-3 font-semibold">Permission</th>
              {STAFF_ROLES.map((role) => (
                <th key={role} className="pb-3 text-center font-semibold">
                  {role.replace("_", " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_PERMISSIONS.map((permission) => (
              <tr key={permission} className="border-t border-border">
                <td className="py-3">
                  <p className="font-semibold">{PERMISSION_LABELS[permission]}</p>
                  <p className="text-xs text-muted-foreground">{permission}</p>
                </td>
                {STAFF_ROLES.map((role) => (
                  <td key={role} className="py-3 text-center">
                    <input
                      type="checkbox"
                      checked={matrix[role][permission]}
                      disabled={role === "super_admin"}
                      onChange={() => toggle(role, permission)}
                      className="h-4 w-4 accent-primary"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
