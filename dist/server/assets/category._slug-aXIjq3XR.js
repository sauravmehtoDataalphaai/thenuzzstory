import { _ as money, f as brands, y as productTypes } from "./catalog-db-CghLbik8.js";
import { s as Route, u as useStore } from "./router-Cn9sBPaq.js";
import { n as ProductCardSkeleton, t as ProductCard } from "./ProductCard-J3zyhahX.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
//#region src/routes/category.$slug.tsx?tsr-split=component
var SORTS = [
	{
		id: "popularity",
		label: "Popularity"
	},
	{
		id: "price-asc",
		label: "Price: Low to High"
	},
	{
		id: "price-desc",
		label: "Price: High to Low"
	},
	{
		id: "newest",
		label: "Newest"
	},
	{
		id: "rating",
		label: "Rating"
	}
];
function CategoryPage() {
	const { category } = Route.useLoaderData();
	const { products, catalogLoading } = useStore();
	const [maxPrice, setMaxPrice] = useState(3e3);
	const [brandSel, setBrandSel] = useState([]);
	const [petSel, setPetSel] = useState([]);
	const [typeSel, setTypeSel] = useState([]);
	const [minRating, setMinRating] = useState(0);
	const [inStockOnly, setInStockOnly] = useState(false);
	const [sort, setSort] = useState("popularity");
	const [visible, setVisible] = useState(8);
	const [loading, setLoading] = useState(true);
	const [filtersOpen, setFiltersOpen] = useState(false);
	useEffect(() => {
		setLoading(true);
		const t = setTimeout(() => setLoading(false), 400);
		return () => clearTimeout(t);
	}, [category.slug, catalogLoading]);
	const inCategory = useMemo(() => products.filter((p) => p.category === category.slug), [category.slug, products]);
	const availableBrands = useMemo(() => brands.filter((b) => inCategory.some((p) => p.brand === b)), [inCategory]);
	const availableTypes = useMemo(() => productTypes.filter((t) => inCategory.some((p) => p.type === t)), [inCategory]);
	const filtered = useMemo(() => {
		const sorted = [...inCategory.filter((p) => p.price <= maxPrice && (brandSel.length === 0 || brandSel.includes(p.brand)) && (petSel.length === 0 || petSel.includes(p.pet)) && (typeSel.length === 0 || typeSel.includes(p.type)) && p.rating >= minRating && (!inStockOnly || p.inStock))];
		sorted.sort((a, b) => {
			switch (sort) {
				case "price-asc": return a.price - b.price;
				case "price-desc": return b.price - a.price;
				case "rating": return b.rating - a.rating;
				case "newest": return Number(b.isNew) - Number(a.isNew);
				default: return b.popularity - a.popularity;
			}
		});
		return sorted;
	}, [
		inCategory,
		maxPrice,
		brandSel,
		petSel,
		typeSel,
		minRating,
		inStockOnly,
		sort
	]);
	const toggle = (arr, set, val) => set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
	const resetFilters = () => {
		setMaxPrice(3e3);
		setBrandSel([]);
		setPetSel([]);
		setTypeSel([]);
		setMinRating(0);
		setInStockOnly(false);
	};
	const Filters = /* @__PURE__ */ jsxs("div", {
		className: "space-y-7",
		children: [
			/* @__PURE__ */ jsxs(FilterBlock, {
				title: "Price range",
				children: [/* @__PURE__ */ jsx("input", {
					type: "range",
					min: 199,
					max: 3e3,
					step: 50,
					value: maxPrice,
					onChange: (e) => setMaxPrice(Number(e.target.value)),
					"aria-label": "Maximum price",
					className: "w-full accent-[var(--color-primary)]"
				}), /* @__PURE__ */ jsxs("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: ["Up to ", /* @__PURE__ */ jsx("span", {
						className: "font-bold text-foreground",
						children: money(maxPrice)
					})]
				})]
			}),
			/* @__PURE__ */ jsx(FilterBlock, {
				title: "Brand",
				children: availableBrands.map((b) => /* @__PURE__ */ jsx(Check$1, {
					label: b,
					checked: brandSel.includes(b),
					onChange: () => toggle(brandSel, setBrandSel, b)
				}, b))
			}),
			/* @__PURE__ */ jsx(FilterBlock, {
				title: "Pet type",
				children: ["dog", "cat"].map((p) => /* @__PURE__ */ jsx(Check$1, {
					label: p === "dog" ? "Dog" : "Cat",
					checked: petSel.includes(p),
					onChange: () => toggle(petSel, setPetSel, p)
				}, p))
			}),
			/* @__PURE__ */ jsx(FilterBlock, {
				title: "Product type",
				children: availableTypes.map((t) => /* @__PURE__ */ jsx(Check$1, {
					label: t,
					checked: typeSel.includes(t),
					onChange: () => toggle(typeSel, setTypeSel, t)
				}, t))
			}),
			/* @__PURE__ */ jsx(FilterBlock, {
				title: "Rating",
				children: [
					4.5,
					4,
					3.5,
					0
				].map((r) => /* @__PURE__ */ jsxs("label", {
					className: "flex cursor-pointer items-center gap-2 py-1 text-sm",
					children: [/* @__PURE__ */ jsx("input", {
						type: "radio",
						name: "rating",
						checked: minRating === r,
						onChange: () => setMinRating(r),
						className: "accent-[var(--color-primary)]"
					}), r === 0 ? "All ratings" : `${r} ★ & above`]
				}, r))
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold",
				children: ["In stock only", /* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: inStockOnly,
					onChange: (e) => setInStockOnly(e.target.checked),
					className: "h-4 w-4 accent-[var(--color-primary)]"
				})]
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: resetFilters,
				className: "w-full rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary",
				children: "Clear all filters"
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-8",
		children: [
			/* @__PURE__ */ jsxs("nav", {
				className: "flex items-center gap-1.5 text-xs text-muted-foreground",
				"aria-label": "Breadcrumb",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "hover:text-primary",
						children: "Home"
					}),
					/* @__PURE__ */ jsx(ChevronRight, { size: 13 }),
					/* @__PURE__ */ jsx("span", { children: "Shop" }),
					/* @__PURE__ */ jsx(ChevronRight, { size: 13 }),
					/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-foreground",
						children: category.name
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "font-display text-2xl font-extrabold sm:text-4xl",
						children: category.name
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-xs text-muted-foreground sm:text-sm",
						children: [
							filtered.length,
							" products · ",
							category.blurb
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setFiltersOpen(true),
						className: "inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-semibold lg:hidden sm:px-3 sm:py-2.5 sm:text-sm",
						children: [/* @__PURE__ */ jsx(SlidersHorizontal, { size: 15 }), " Filters"]
					}), /* @__PURE__ */ jsx("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						"aria-label": "Sort products",
						className: "rounded-xl border border-border bg-card px-2 py-1.5 text-xs font-semibold outline-none sm:px-3 sm:py-2.5 sm:text-sm",
						children: SORTS.map((s) => /* @__PURE__ */ jsx("option", {
							value: s.id,
							children: s.label
						}, s.id))
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ jsx("aside", {
					className: "hidden lg:block",
					children: /* @__PURE__ */ jsx("div", {
						className: "sticky top-40 rounded-2xl border border-border bg-card p-5",
						children: Filters
					})
				}), /* @__PURE__ */ jsx("div", { children: loading ? /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4",
					children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(ProductCardSkeleton, {}, i))
				}) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-dashed border-border p-12 text-center",
					children: [/* @__PURE__ */ jsx("p", {
						className: "font-display text-lg font-bold",
						children: "No products match these filters"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: resetFilters,
						className: "mt-3 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground",
						children: "Clear filters"
					})]
				}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4",
					children: filtered.slice(0, visible).map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
				}), visible < filtered.length && /* @__PURE__ */ jsx("div", {
					className: "mt-8 text-center",
					children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setVisible((v) => v + 8),
						className: "rounded-2xl border border-border bg-card px-8 py-3 text-sm font-bold hover:bg-secondary",
						children: [
							"Load more (",
							filtered.length - visible,
							" left)"
						]
					})
				})] }) })]
			}),
			filtersOpen && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 z-[60] lg:hidden",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					"aria-label": "Close filters",
					onClick: () => setFiltersOpen(false),
					className: "absolute inset-0 bg-foreground/50"
				}), /* @__PURE__ */ jsxs("div", {
					className: "absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-display text-lg font-extrabold",
								children: "Filters"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								"aria-label": "Close filters",
								onClick: () => setFiltersOpen(false),
								children: /* @__PURE__ */ jsx(X, { size: 20 })
							})]
						}),
						Filters,
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setFiltersOpen(false),
							className: "mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground",
							children: [
								"Show ",
								filtered.length,
								" products"
							]
						})
					]
				})]
			})
		]
	});
}
function FilterBlock({ title, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
		className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground",
		children: title
	}), children] });
}
function Check$1({ label, checked, onChange }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "flex cursor-pointer items-center gap-2 py-1 text-sm",
		children: [/* @__PURE__ */ jsx("input", {
			type: "checkbox",
			checked,
			onChange,
			className: "h-4 w-4 accent-[var(--color-primary)]"
		}), label]
	});
}
//#endregion
export { CategoryPage as component };
