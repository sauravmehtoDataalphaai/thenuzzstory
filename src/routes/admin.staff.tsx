import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { STAFF_ROLES, type StaffRole } from "@/lib/admin/roles";
import { getAccessToken } from "@/lib/admin/session";
import { listAdminStaff, promoteUserByEmail, updateAdminStaff } from "@/server/admin";
import type { Profile } from "@/types/database";

export const Route = createFileRoute("/admin/staff")({
  component: AdminStaff,
});

function AdminStaff() {
  const [staff, setStaff] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("ops");
  const [busy, setBusy] = useState(false);

  async function reload() {
    const token = await getAccessToken();
    if (!token) throw new Error("Not signed in");
    const data = await listAdminStaff({ data: { accessToken: token } });
    setStaff(data);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load staff");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function promote() {
    setBusy(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      await promoteUserByEmail({
        data: { accessToken: token, email, role },
      });
      setEmail("");
      await reload();
      toast.success("Staff access granted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not promote user");
    } finally {
      setBusy(false);
    }
  }

  async function saveRow(user: Profile, nextRole: string, isActive: boolean) {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      await updateAdminStaff({
        data: {
          accessToken: token,
          userId: user.id,
          role: nextRole,
          is_active: isActive,
        },
      });
      await reload();
      toast.success("Staff updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Staff</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Promote store users to staff roles and manage access
        </p>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-[1fr_160px_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          void promote();
        }}
      >
        <label className="text-sm">
          <span className="text-xs font-semibold text-muted-foreground">User email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="already signed up on the store"
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
          />
        </label>
        <label className="text-sm">
          <span className="text-xs font-semibold text-muted-foreground">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as StaffRole)}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
          >
            {STAFF_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Saving…" : "Add staff"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading staff…</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-2 font-semibold">Name</th>
                <th className="pb-2 font-semibold">Email</th>
                <th className="pb-2 font-semibold">Role</th>
                <th className="pb-2 font-semibold">Active</th>
                <th className="pb-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-muted-foreground">
                    No staff yet
                  </td>
                </tr>
              ) : (
                staff.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="py-3 font-semibold">{u.name || "—"}</td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => void saveRow(u, e.target.value, u.is_active !== false)}
                        className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
                      >
                        {STAFF_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                        <option value="customer">customer (remove staff)</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => void saveRow(u, u.role, !(u.is_active !== false))}
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          u.is_active !== false
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.is_active !== false ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      Joined {new Date(u.created_at).toLocaleDateString("en-IN")}
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
