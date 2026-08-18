import { _ as money, x as resolveCatalogImage } from "./catalog-db-CghLbik8.js";
import { l as cn, u as useStore } from "./router-Cn9sBPaq.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Heart, ShoppingCart, Star } from "lucide-react";
//#region src/components/Stars.tsx
function Stars({ rating, size = 14 }) {
	return /* @__PURE__ */ jsx("span", {
		className: "inline-flex items-center gap-0.5",
		"aria-label": `Rated ${rating} out of 5`,
		children: [
			1,
			2,
			3,
			4,
			5
		].map((i) => /* @__PURE__ */ jsx(Star, {
			size,
			className: i <= Math.round(rating) ? "fill-warning text-warning" : "text-muted-foreground/40"
		}, i))
	});
}
//#endregion
//#region src/components/ProductCard.tsx
function ProductCard({ product }) {
	const { addToCart, wishlist, toggleWishlist, pets } = useStore();
	const off = Math.round((product.mrp - product.price) / product.mrp * 100);
	const wished = wishlist.includes(product.slug);
	const matchedPet = pets.find((p) => p.type === product.pet);
	return /* @__PURE__ */ jsxs("article", {
		className: "card-lift group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card sm:rounded-2xl",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => toggleWishlist(product.slug),
				"aria-label": wished ? "Remove from wishlist" : "Add to wishlist",
				className: "absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-card/90 shadow-soft backdrop-blur transition-colors hover:bg-primary-soft sm:right-3 sm:top-3 sm:h-9 sm:w-9",
				children: /* @__PURE__ */ jsx(Heart, {
					size: 14,
					className: cn(wished ? "fill-primary text-primary" : "text-muted-foreground")
				})
			}),
			/* @__PURE__ */ jsxs(Link, {
				to: "/product/$slug",
				params: { slug: product.slug },
				className: "relative block overflow-hidden bg-sand",
				children: [/* @__PURE__ */ jsx("img", {
					src: resolveCatalogImage(product.image, product.category),
					alt: product.name,
					loading: "lazy",
					width: 800,
					height: 800,
					className: "aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
				}), /* @__PURE__ */ jsxs("div", {
					className: "absolute left-2 top-2 flex flex-col items-start gap-1 sm:left-3 sm:top-3 sm:gap-1.5",
					children: [
						off > 0 && /* @__PURE__ */ jsxs("span", {
							className: "rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground sm:px-2.5 sm:py-1 sm:text-[11px]",
							children: [off, "% OFF"]
						}),
						product.isNew && /* @__PURE__ */ jsx("span", {
							className: "rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground sm:px-2.5 sm:py-1 sm:text-[11px]",
							children: "NEW"
						}),
						!product.inStock && /* @__PURE__ */ jsx("span", {
							className: "rounded-full bg-foreground/80 px-1.5 py-0.5 text-[9px] font-bold text-background sm:px-2.5 sm:py-1 sm:text-[11px]",
							children: "Out of stock"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 flex-col gap-1 p-2.5 sm:gap-2 sm:p-4",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]",
						children: product.brand
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/product/$slug",
						params: { slug: product.slug },
						className: "line-clamp-2 text-xs font-semibold leading-snug hover:text-primary sm:text-sm",
						children: product.name
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1 text-[10px] text-muted-foreground sm:gap-1.5 sm:text-xs",
						children: [/* @__PURE__ */ jsx(Stars, {
							rating: product.rating,
							size: 11
						}), /* @__PURE__ */ jsxs("span", { children: [
							"(",
							product.reviews,
							")"
						] })]
					}),
					matchedPet && /* @__PURE__ */ jsxs("span", {
						className: "hidden w-fit rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent sm:inline",
						children: ["Recommended for ", matchedPet.name]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-auto flex items-baseline gap-1.5 pt-1 sm:gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm font-bold sm:text-base",
							children: money(product.price)
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-muted-foreground line-through sm:text-xs",
							children: money(product.mrp)
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						disabled: !product.inStock,
						onClick: () => addToCart(product),
						className: "mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-2 py-1.5 text-[11px] font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm",
						children: [
							/* @__PURE__ */ jsx(ShoppingCart, { size: 14 }),
							/* @__PURE__ */ jsx("span", {
								className: "sm:hidden",
								children: product.inStock ? "Add" : "Notify"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline",
								children: product.inStock ? "Add to Cart" : "Notify me"
							})
						]
					})
				]
			})
		]
	});
}
function ProductCardSkeleton() {
	return /* @__PURE__ */ jsxs("div", {
		className: "overflow-hidden rounded-xl border border-border bg-card sm:rounded-2xl",
		children: [/* @__PURE__ */ jsx("div", { className: "aspect-square w-full animate-pulse bg-muted" }), /* @__PURE__ */ jsxs("div", {
			className: "space-y-2 p-2.5 sm:p-4",
			children: [
				/* @__PURE__ */ jsx("div", { className: "h-3 w-1/3 animate-pulse rounded bg-muted" }),
				/* @__PURE__ */ jsx("div", { className: "h-4 w-4/5 animate-pulse rounded bg-muted" }),
				/* @__PURE__ */ jsx("div", { className: "h-3 w-1/2 animate-pulse rounded bg-muted" }),
				/* @__PURE__ */ jsx("div", { className: "h-9 w-full animate-pulse rounded-xl bg-muted" })
			]
		})]
	});
}
//#endregion
export { ProductCardSkeleton as n, Stars as r, ProductCard as t };
