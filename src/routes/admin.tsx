import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAccessToken } from "@/lib/admin/session";
import { signOutSupabase } from "@/lib/auth";
import { getAdminSession, type AdminSession } from "@/server/admin";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(!isLogin);

  useEffect(() => {
    if (isLogin) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          navigate({ to: "/admin/login" });
          return;
        }
        const adminSession = await getAdminSession({ data: { accessToken: token } });
        if (!cancelled) setSession(adminSession);
      } catch {
        if (!cancelled) {
          toast.error("Admin access required");
          navigate({ to: "/admin/login" });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLogin, navigate, pathname]);

  async function signOut() {
    await signOutSupabase();
    setSession(null);
    navigate({ to: "/admin/login" });
  }

  if (isLogin) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f6f4ef] text-sm text-muted-foreground">
        Checking admin access…
      </div>
    );
  }

  if (!session) return null;

  return (
    <AdminShell session={session} onSignOut={() => void signOut()}>
      <Outlet />
    </AdminShell>
  );
}
