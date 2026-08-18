import { o as statusBadgeClass } from "./order-status-DSTuo78T.js";
import { t as getAccessToken } from "./session-baWtAfAY.js";
import { n as getAdminDashboardStats } from "./admin-CxIQCdTb.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/admin.dashboard.tsx?tsr-split=component
function AdminDashboard() {
	const [stats, setStats] = useState(null);
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
	if (loading) return /* @__PURE__ */ jsx("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading dashboard…"
	});
	if (!stats) return null;
	const cards = [
		{
			label: "Orders",
			value: String(stats.ordersCount)
		},
		{
			label: "Customers",
			value: String(stats.usersCount)
		},
		{
			label: "Revenue",
			value: `₹${Math.round(stats.revenue).toLocaleString("en-IN")}`
		},
		{
			label: "Processing",
			value: String(stats.processing)
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-extrabold",
				children: "Dashboard"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Store overview for The Nuzz Story"
			})] }),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: cards.map((c) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: c.label
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2 font-display text-2xl font-extrabold",
						children: c.value
					})]
				}, c.label))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-display text-lg font-bold",
						children: "Recent orders"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/admin/orders",
						className: "text-sm font-semibold text-primary",
						children: "View all"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[560px] text-left text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "text-xs uppercase text-muted-foreground",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Order"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Customer"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Total"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: stats.recentOrders.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 4,
							className: "py-6 text-muted-foreground",
							children: "No orders yet"
						}) }) : stats.recentOrders.map((o) => /* @__PURE__ */ jsxs("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: /* @__PURE__ */ jsx(Link, {
										to: "/admin/orders/$id",
										params: { id: o.id },
										className: "font-semibold text-primary",
										children: o.id
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: o.shipping_name || "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: /* @__PURE__ */ jsx("span", {
										className: `inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(o.status)}`,
										children: o.status
									})
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "py-3 font-semibold",
									children: ["₹", Number(o.total).toLocaleString("en-IN")]
								})
							]
						}, o.id)) })]
					})
				})]
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
