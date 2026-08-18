import { f as signOutSupabase } from "./auth-D9i6D0LJ.js";
import { t as getAccessToken } from "./session-baWtAfAY.js";
import { i as getAdminSession } from "./admin-CxIQCdTb.js";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BarChart3, ClipboardList, KeyRound, LayoutDashboard, LogOut, Package, Shield, Tag, Users } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/AdminShell.tsx
var links = [
	{
		to: "/admin/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard,
		permission: "dashboard"
	},
	{
		to: "/admin/orders",
		label: "Orders",
		icon: Package,
		permission: "orders.read"
	},
	{
		to: "/admin/users",
		label: "Users",
		icon: Users,
		permission: "users.read"
	},
	{
		to: "/admin/products",
		label: "Products",
		icon: Package,
		permission: "products.read"
	},
	{
		to: "/admin/coupons",
		label: "Coupons",
		icon: Tag,
		permission: "coupons.read"
	},
	{
		to: "/admin/reports",
		label: "Reports",
		icon: BarChart3,
		permission: "reports.read"
	},
	{
		to: "/admin/audit",
		label: "Audit log",
		icon: ClipboardList,
		permission: "audit.read"
	},
	{
		to: "/admin/staff",
		label: "Staff",
		icon: Shield,
		permission: "staff.manage"
	},
	{
		to: "/admin/permissions",
		label: "Permissions",
		icon: KeyRound,
		permission: "permissions.manage"
	}
];
function AdminShell({ session, onSignOut, children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-[#f6f4ef] text-foreground",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_minmax(0,1fr)]",
			children: [/* @__PURE__ */ jsxs("aside", {
				className: "h-fit rounded-2xl border border-border bg-card p-4 shadow-sm",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "font-display text-lg font-extrabold",
						children: "Nuzz Admin"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 truncate text-xs text-muted-foreground",
						children: session.email
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-[11px] font-semibold uppercase tracking-wide text-primary",
						children: session.role.replace("_", " ")
					}),
					/* @__PURE__ */ jsxs("nav", {
						className: "mt-5 grid gap-1",
						children: [links.filter((l) => session.permissions.includes(l.permission)).map((l) => /* @__PURE__ */ jsxs(Link, {
							to: l.to,
							activeProps: { className: "bg-primary-soft text-primary" },
							className: "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-secondary",
							children: [/* @__PURE__ */ jsx(l.icon, { size: 16 }), l.label]
						}, l.to)), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: onSignOut,
							className: "flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-destructive hover:bg-secondary",
							children: [/* @__PURE__ */ jsx(LogOut, { size: 16 }), " Sign out"]
						})]
					})
				]
			}), /* @__PURE__ */ jsx("section", {
				className: "min-w-0",
				children
			})]
		})
	});
}
//#endregion
//#region src/routes/admin.tsx?tsr-split=component
function AdminLayout() {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isLogin = pathname === "/admin/login";
	const [session, setSession] = useState(null);
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
	}, [
		isLogin,
		navigate,
		pathname
	]);
	async function signOut() {
		await signOutSupabase();
		setSession(null);
		navigate({ to: "/admin/login" });
	}
	if (isLogin) return /* @__PURE__ */ jsx(Outlet, {});
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center bg-[#f6f4ef] text-sm text-muted-foreground",
		children: "Checking admin access…"
	});
	if (!session) return null;
	return /* @__PURE__ */ jsx(AdminShell, {
		session,
		onSignOut: () => void signOut(),
		children: /* @__PURE__ */ jsx(Outlet, {})
	});
}
//#endregion
export { AdminLayout as component };
