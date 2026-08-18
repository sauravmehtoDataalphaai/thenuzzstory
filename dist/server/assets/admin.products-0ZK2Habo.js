import { _ as money } from "./catalog-db-CghLbik8.js";
import { t as getAccessToken } from "./session-baWtAfAY.js";
import { a as listAdminProducts, s as seedCatalogFromStatic, t as deleteAdminProduct } from "./catalog-Bypn6n3U.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Database, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/admin.products.tsx?tsr-split=component
function AdminProducts() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [seeding, setSeeding] = useState(false);
	async function reload() {
		const token = await getAccessToken();
		if (!token) throw new Error("Not signed in");
		const data = await listAdminProducts({ data: { accessToken: token } });
		setItems(data);
	}
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				await reload();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to load products");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	async function seed() {
		setSeeding(true);
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			const result = await seedCatalogFromStatic({ data: { accessToken: token } });
			await reload();
			toast.success(`Seeded ${result.products} products and ${result.coupons} coupons`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Seed failed");
		} finally {
			setSeeding(false);
		}
	}
	async function deactivate(id) {
		if (!confirm("Deactivate this product? It will be hidden from the storefront.")) return;
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			await deleteAdminProduct({ data: {
				accessToken: token,
				id
			} });
			await reload();
			toast.success("Product deactivated");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not deactivate");
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-2xl font-extrabold",
					children: "Products"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Manage catalog items shown on the storefront"
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => void seed(),
						disabled: seeding,
						className: "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold hover:bg-secondary disabled:opacity-60",
						children: [/* @__PURE__ */ jsx(Database, { size: 16 }), seeding ? "Seeding…" : "Seed from static catalog"]
					}), /* @__PURE__ */ jsxs(Link, {
						to: "/admin/products/$id",
						params: { id: "new" },
						className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground",
						children: [/* @__PURE__ */ jsx(Plus, { size: 16 }), " Add product"]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm",
				children: loading ? /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading products…"
				}) : /* @__PURE__ */ jsxs("table", {
					className: "w-full min-w-[880px] text-left text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "text-xs uppercase text-muted-foreground",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Product"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Category"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Price"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Stock"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", { children: items.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 5,
						className: "py-10 text-center text-muted-foreground",
						children: "No products in database yet. Click \"Seed from static catalog\" to import the default catalog."
					}) }) : items.map((p) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [p.image ? /* @__PURE__ */ jsx("img", {
										src: p.image,
										alt: "",
										className: "h-10 w-10 rounded-lg object-cover"
									}) : /* @__PURE__ */ jsx("span", {
										className: "grid h-10 w-10 place-items-center rounded-lg bg-secondary text-xs",
										children: "—"
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "font-semibold",
										children: p.name
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: p.brand
									})] })]
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: p.category
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3",
								children: [money(p.price), /* @__PURE__ */ jsx("span", {
									className: "ml-1 text-xs text-muted-foreground line-through",
									children: money(p.mrp)
								})]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: /* @__PURE__ */ jsx("span", {
									className: `rounded-full px-2 py-0.5 text-xs font-bold ${p.inStock ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`,
									children: p.inStock ? "In stock" : "Out of stock"
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Link, {
										to: "/admin/products/$id",
										params: { id: p.id },
										className: "rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary",
										children: "Edit"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => void deactivate(p.id),
										className: "rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/5",
										children: "Deactivate"
									})]
								})
							})
						]
					}, p.id)) })]
				})
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ jsx(RefreshCw, { size: 12 }), "Storefront falls back to static catalog if the database is empty or unreachable."]
			})
		]
	});
}
//#endregion
export { AdminProducts as component };
