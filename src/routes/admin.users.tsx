import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/admin/session";
import { deleteAdminCustomer, listAdminUsers, updateAdminCustomer } from "@/server/admin";
import type { Profile } from "@/types/database";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loyalty, setLoyalty] = useState("0");

  async function reload() {
    const token = await getAccessToken();
    if (!token) throw new Error("Not signed in");
    const data = await listAdminUsers({ data: { accessToken: token } });
    setUsers(data);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function openEdit(u: Profile) {
    setEditing(u);
    setName(u.name ?? "");
    setPhone(u.phone ?? "");
    setLoyalty(String(u.loyalty_points ?? 0));
  }

  async function saveEdit() {
    if (!editing) return;
    setBusyId(editing.id);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      await updateAdminCustomer({
        data: {
          accessToken: token,
          userId: editing.id,
          name,
          phone,
          loyalty_points: Number(loyalty),
        },
      });
      await reload();
      setEditing(null);
      toast.success("Customer updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function removeCustomer(u: Profile) {
    const ok = window.confirm(
      `Delete ${u.name || u.email}? This removes the account from the database (profile, addresses, orders) and cannot be undone.`,
    );
    if (!ok) return;
    setBusyId(u.id);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Not signed in");
      await deleteAdminCustomer({ data: { accessToken: token, userId: u.id } });
      await reload();
      if (editing?.id === u.id) setEditing(null);
      toast.success("Customer deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customer and staff accounts. Only customers can be edited or deleted. Super admins are protected.
        </p>
      </div>

      {editing && (
        <form
          className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            void saveEdit();
          }}
        >
          <p className="sm:col-span-2 lg:col-span-4 font-display text-lg font-extrabold">
            Edit {editing.email}
          </p>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Phone</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Loyalty points</span>
            <input
              type="number"
              min={0}
              value={loyalty}
              onChange={(e) => setLoyalty(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={busyId === editing.id}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {busyId === editing.id ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading users…</p>
        ) : (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th className="pb-2 font-semibold">Name</th>
                <th className="pb-2 font-semibold">Email</th>
                <th className="pb-2 font-semibold">Phone</th>
                <th className="pb-2 font-semibold">Role</th>
                <th className="pb-2 font-semibold">Loyalty</th>
                <th className="pb-2 font-semibold">Joined</th>
                <th className="pb-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isCustomer = u.role === "customer";
                  return (
                    <tr key={u.id} className="border-t border-border">
                      <td className="py-3">
                        <Link
                          to="/admin/users/$id"
                          params={{ id: u.id }}
                          className="font-semibold text-primary"
                        >
                          {u.name || "—"}
                        </Link>
                      </td>
                      <td className="py-3">{u.email}</td>
                      <td className="py-3">{u.phone || "—"}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 font-semibold">{u.loyalty_points}</td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3">
                        {isCustomer ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={busyId === u.id}
                              onClick={() => openEdit(u)}
                              className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary disabled:opacity-60"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={busyId === u.id}
                              onClick={() => void removeCustomer(u)}
                              className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/5 disabled:opacity-60"
                            >
                              {busyId === u.id ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
