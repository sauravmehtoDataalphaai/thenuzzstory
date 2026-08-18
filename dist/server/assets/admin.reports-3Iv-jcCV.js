import { _ as money } from "./catalog-db-CghLbik8.js";
import { t as getAccessToken } from "./session-baWtAfAY.js";
import { r as getAdminReports } from "./catalog-Bypn6n3U.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/admin.reports.tsx?tsr-split=component
function AdminReports() {
	const [data, setData] = useState(null);
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
	if (loading) return /* @__PURE__ */ jsx("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading reports…"
	});
	if (!data) return null;
	const statCards = [
		{
			label: "Total revenue",
			value: money(data.revenue)
		},
		{
			label: "Last 30 days",
			value: money(data.revenue30)
		},
		{
			label: "Orders",
			value: String(data.orderCount)
		},
		{
			label: "Avg order value",
			value: money(Math.round(data.avgOrder))
		},
		{
			label: "Customers",
			value: String(data.customerCount)
		},
		{
			label: "Products in stock",
			value: `${data.inStockCount} / ${data.productCount}`
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-extrabold",
				children: "Reports"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Sales overview and top performers"
			})] }),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
				children: statCards.map((s) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: s.label
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2 font-display text-2xl font-extrabold",
						children: s.value
					})]
				}, s.label))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-display text-lg font-extrabold",
						children: "Orders by status"
					}), /* @__PURE__ */ jsx("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: Object.entries(data.byStatus).length === 0 ? /* @__PURE__ */ jsx("li", {
							className: "text-muted-foreground",
							children: "No orders yet"
						}) : Object.entries(data.byStatus).map(([status, count]) => /* @__PURE__ */ jsxs("li", {
							className: "flex items-center justify-between border-b border-border py-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-semibold",
								children: status
							}), /* @__PURE__ */ jsx("span", { children: count })]
						}, status))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-display text-lg font-extrabold",
						children: "Top products"
					}), /* @__PURE__ */ jsx("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: data.topProducts.length === 0 ? /* @__PURE__ */ jsx("li", {
							className: "text-muted-foreground",
							children: "No sales data yet"
						}) : data.topProducts.map((p) => /* @__PURE__ */ jsxs("li", {
							className: "flex items-center justify-between border-b border-border py-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "font-semibold",
								children: p.name
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-muted-foreground",
								children: [p.qty, " units sold"]
							})] }), /* @__PURE__ */ jsx("span", {
								className: "font-bold",
								children: money(p.revenue)
							})]
						}, p.name))
					})]
				})]
			})
		]
	});
}
//#endregion
export { AdminReports as component };
