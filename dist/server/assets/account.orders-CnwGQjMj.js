import { _ as money, x as resolveCatalogImage } from "./catalog-db-CghLbik8.js";
import { s as fetchOrders } from "./auth-D9i6D0LJ.js";
import { u as useStore } from "./router-Cn9sBPaq.js";
import { i as customerStatusLabel, o as statusBadgeClass } from "./order-status-DSTuo78T.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { PackageSearch } from "lucide-react";
//#region src/routes/account.orders.tsx?tsr-split=component
function Orders() {
	const { user, lastOrderId } = useStore();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			if (!user) {
				setOrders([]);
				setLoading(false);
				return;
			}
			setLoading(true);
			try {
				const rows = await fetchOrders(user.id);
				if (!cancelled) setOrders(rows);
			} catch (err) {
				console.error(err);
				if (!cancelled) setOrders([]);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [user, lastOrderId]);
	if (!user) return /* @__PURE__ */ jsxs("div", {
		className: "rounded-3xl border border-border bg-card p-8 text-center",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-extrabold",
				children: "Order history"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Login to see your past orders."
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/account/login",
				className: "mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground",
				children: "Login"
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-extrabold",
				children: "Order history"
			}),
			loading && /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading orders…"
			}),
			!loading && orders.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground",
				children: "No orders yet. Your purchases will show up here after checkout."
			}),
			orders.map((o) => /* @__PURE__ */ jsxs("article", {
				className: "rounded-3xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "truncate font-display text-base font-bold",
								children: ["Order ", o.id]
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Placed",
									" ",
									new Date(o.created_at).toLocaleDateString("en-IN", {
										day: "2-digit",
										month: "short",
										year: "numeric"
									})
								]
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: `shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClass(o.status)}`,
							children: customerStatusLabel(o.status)
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 flex flex-wrap gap-3",
						children: o.items.map((item) => /* @__PURE__ */ jsxs(Link, {
							to: "/product/$slug",
							params: { slug: item.product_slug },
							className: "flex min-w-0 items-center gap-2",
							children: [item.image_url ? /* @__PURE__ */ jsx("img", {
								src: resolveCatalogImage(item.image_url),
								alt: item.product_name,
								loading: "lazy",
								className: "h-12 w-12 shrink-0 rounded-xl border border-border object-cover"
							}) : /* @__PURE__ */ jsx("span", {
								className: "grid h-12 w-12 place-items-center rounded-xl border border-border bg-sand text-xs",
								children: "NZ"
							}), /* @__PURE__ */ jsxs("span", {
								className: "truncate text-sm",
								children: [item.product_name, /* @__PURE__ */ jsxs("span", {
									className: "block text-xs text-muted-foreground",
									children: [
										item.variant,
										" × ",
										item.qty
									]
								})]
							})]
						}, item.id))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-sm font-bold",
							children: ["Total ", money(Number(o.total))]
						}), /* @__PURE__ */ jsxs(Link, {
							to: "/account/track/$id",
							params: { id: o.id },
							className: "inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary",
							children: [/* @__PURE__ */ jsx(PackageSearch, { size: 15 }), " Track order"]
						})]
					})
				]
			}, o.id))
		]
	});
}
//#endregion
export { Orders as component };
