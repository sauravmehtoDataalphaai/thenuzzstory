import { o as productToRow } from "./catalog-db-CghLbik8.js";
import { r as Route } from "./router-Cn9sBPaq.js";
import { t as getAccessToken } from "./session-baWtAfAY.js";
import { l as upsertAdminProduct, n as getAdminProduct } from "./catalog-Bypn6n3U.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/admin.products.$id.tsx?tsr-split=component
var CATEGORIES = [
	"dog-food",
	"cat-food",
	"dog-grooming",
	"cat-grooming",
	"toys",
	"accessories",
	"healthcare"
];
function emptyProduct(id) {
	return {
		id,
		slug: "",
		name: "",
		brand: "",
		pet: "dog",
		category: "dog-food",
		type: "",
		price: 0,
		mrp: 0,
		rating: 4.5,
		reviews: 0,
		image: "",
		variants: [{
			label: "Standard pack",
			priceDelta: 0
		}],
		inStock: true,
		isNew: false,
		popularity: 50,
		subscribable: false,
		lifeStage: "all",
		description: "",
		specs: [],
		ingredients: ""
	};
}
function AdminProductEdit() {
	const { id } = Route.useParams();
	const isNew = id === "new";
	const [form, setForm] = useState(emptyProduct(crypto.randomUUID()));
	const [loading, setLoading] = useState(!isNew);
	const [saving, setSaving] = useState(false);
	useEffect(() => {
		if (isNew) return;
		let cancelled = false;
		(async () => {
			try {
				const token = await getAccessToken();
				if (!token) throw new Error("Not signed in");
				const product = await getAdminProduct({ data: {
					accessToken: token,
					id
				} });
				if (!cancelled) setForm(product);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Product not found");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [id, isNew]);
	async function save(e) {
		e.preventDefault();
		setSaving(true);
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			const slug = form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
			const payload = productToRow({
				...form,
				slug
			}, true);
			await upsertAdminProduct({ data: {
				accessToken: token,
				product: payload
			} });
			toast.success(isNew ? "Product created" : "Product saved");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Save failed");
		} finally {
			setSaving(false);
		}
	}
	if (loading) return /* @__PURE__ */ jsx("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading product…"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "grid max-w-3xl gap-6",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Link, {
			to: "/admin/products",
			className: "inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary",
			children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 16 }), " Back to products"]
		}), /* @__PURE__ */ jsx("h1", {
			className: "mt-3 font-display text-2xl font-extrabold",
			children: isNew ? "Add product" : "Edit product"
		})] }), /* @__PURE__ */ jsxs("form", {
			onSubmit: (e) => void save(e),
			className: "grid gap-4 rounded-2xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm sm:col-span-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Name"
							}), /* @__PURE__ */ jsx("input", {
								required: true,
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								}),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Slug"
							}), /* @__PURE__ */ jsx("input", {
								value: form.slug,
								onChange: (e) => setForm({
									...form,
									slug: e.target.value
								}),
								placeholder: "auto from name if empty",
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Brand"
							}), /* @__PURE__ */ jsx("input", {
								required: true,
								value: form.brand,
								onChange: (e) => setForm({
									...form,
									brand: e.target.value
								}),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Pet"
							}), /* @__PURE__ */ jsxs("select", {
								value: form.pet,
								onChange: (e) => setForm({
									...form,
									pet: e.target.value
								}),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm",
								children: [/* @__PURE__ */ jsx("option", {
									value: "dog",
									children: "Dog"
								}), /* @__PURE__ */ jsx("option", {
									value: "cat",
									children: "Cat"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Category"
							}), /* @__PURE__ */ jsx("select", {
								value: form.category,
								onChange: (e) => setForm({
									...form,
									category: e.target.value
								}),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm",
								children: CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", {
									value: c,
									children: c
								}, c))
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Type"
							}), /* @__PURE__ */ jsx("input", {
								required: true,
								value: form.type,
								onChange: (e) => setForm({
									...form,
									type: e.target.value
								}),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Price (₹)"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								required: true,
								min: 0,
								value: form.price,
								onChange: (e) => setForm({
									...form,
									price: Number(e.target.value)
								}),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "MRP (₹)"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								required: true,
								min: 0,
								value: form.mrp,
								onChange: (e) => setForm({
									...form,
									mrp: Number(e.target.value)
								}),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm sm:col-span-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Image URL"
							}), /* @__PURE__ */ jsx("input", {
								value: form.image,
								onChange: (e) => setForm({
									...form,
									image: e.target.value
								}),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm sm:col-span-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Description"
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 4,
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								}),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-4 text-sm",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: form.inStock,
								onChange: (e) => setForm({
									...form,
									inStock: e.target.checked
								})
							}), "In stock"]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: form.isNew,
								onChange: (e) => setForm({
									...form,
									isNew: e.target.checked
								})
							}), "New arrival"]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: form.subscribable,
								onChange: (e) => setForm({
									...form,
									subscribable: e.target.checked
								})
							}), "Subscribable"]
						})
					]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "submit",
					disabled: saving,
					className: "w-fit rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60",
					children: saving ? "Saving…" : "Save product"
				})
			]
		})]
	});
}
//#endregion
export { AdminProductEdit as component };
