import { n as Route } from "./router-Cn9sBPaq.js";
import { o as statusBadgeClass } from "./order-status-DSTuo78T.js";
import { t as getAccessToken } from "./session-baWtAfAY.js";
import { a as getAdminUser } from "./admin-CxIQCdTb.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/admin.users.$id.tsx?tsr-split=component
function AdminUserDetail() {
	const { id } = Route.useParams();
	const [detail, setDetail] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const token = await getAccessToken();
				if (!token) throw new Error("Not signed in");
				const data = await getAdminUser({ data: {
					accessToken: token,
					userId: id
				} });
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
	if (loading) return /* @__PURE__ */ jsx("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading user…"
	});
	if (!detail) return null;
	const { profile, addresses, orders } = detail;
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/admin/users",
					className: "text-sm font-semibold text-primary",
					children: "← Back to users"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-2 font-display text-2xl font-extrabold",
					children: profile.name || profile.email
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: profile.email
				})
			] }),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						label: "Phone",
						value: profile.phone || "—"
					},
					{
						label: "Role",
						value: profile.role
					},
					{
						label: "Loyalty",
						value: String(profile.loyalty_points)
					},
					{
						label: "Active",
						value: profile.is_active ? "Yes" : "No"
					}
				].map((c) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border bg-card p-4 shadow-sm",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold uppercase text-muted-foreground",
						children: c.label
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 font-display text-lg font-bold",
						children: c.value
					})]
				}, c.label))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-lg font-bold",
					children: "Addresses"
				}), addresses.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "No saved addresses"
				}) : /* @__PURE__ */ jsx("ul", {
					className: "mt-3 grid gap-3",
					children: addresses.map((a) => /* @__PURE__ */ jsxs("li", {
						className: "rounded-xl bg-secondary/50 p-3 text-sm",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "font-semibold",
							children: [
								a.type,
								" · ",
								a.name
							]
						}), /* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-muted-foreground",
							children: [
								a.address,
								", ",
								a.city,
								", ",
								a.state,
								" — ",
								a.pincode
							]
						})]
					}, a.id))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-lg font-bold",
					children: "Orders"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[520px] text-left text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "text-xs uppercase text-muted-foreground",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Order"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Total"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Date"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: orders.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 4,
							className: "py-6 text-muted-foreground",
							children: "No orders"
						}) }) : orders.map((o) => /* @__PURE__ */ jsxs("tr", {
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
									children: /* @__PURE__ */ jsx("span", {
										className: `inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(o.status)}`,
										children: o.status
									})
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "py-3 font-semibold",
									children: ["₹", Number(o.total).toLocaleString("en-IN")]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3 text-muted-foreground",
									children: new Date(o.created_at).toLocaleDateString("en-IN")
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
export { AdminUserDetail as component };
