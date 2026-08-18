import { _ as money, p as categories, x as resolveCatalogImage } from "./catalog-db-CghLbik8.js";
import { o as Route, u as useStore } from "./router-Cn9sBPaq.js";
import { r as Stars, t as ProductCard } from "./ProductCard-J3zyhahX.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BadgePercent, Check, ChevronRight, Heart, Minus, Plus, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/product.$slug.tsx?tsr-split=component
var TABS = [
	"Description",
	"Ingredients & Specs",
	"Reviews & Ratings"
];
function ProductPage() {
	const { product } = Route.useLoaderData();
	const { addToCart, wishlist, toggleWishlist, products } = useStore();
	const [variant, setVariant] = useState(product.variants[0].label);
	const [qty, setQty] = useState(1);
	const [subscribe, setSubscribe] = useState(false);
	const [tab, setTab] = useState("Description");
	const [thumb, setThumb] = useState(0);
	const [pincode, setPincode] = useState("");
	const [pinResult, setPinResult] = useState(null);
	const [bundle, setBundle] = useState([]);
	const delta = product.variants.find((v) => v.label === variant)?.priceDelta ?? 0;
	const price = product.price + delta;
	const mrp = product.mrp + delta;
	const off = Math.round((mrp - price) / mrp * 100);
	const subPrice = Math.round(price * .9);
	const category = categories.find((c) => c.slug === product.category);
	const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
	const fbt = products.filter((p) => p.pet === product.pet && p.id !== product.id).slice(0, 2);
	const bundleTotal = price + fbt.filter((p) => bundle.includes(p.id)).reduce((s, p) => s + p.price, 0);
	const gallery = [
		resolveCatalogImage(product.image, product.category),
		category.image,
		resolveCatalogImage(product.image, product.category),
		category.image
	];
	const wished = wishlist.includes(product.slug);
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-8",
		children: [
			/* @__PURE__ */ jsxs("nav", {
				className: "flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
				"aria-label": "Breadcrumb",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "hover:text-primary",
						children: "Home"
					}),
					/* @__PURE__ */ jsx(ChevronRight, { size: 13 }),
					/* @__PURE__ */ jsx(Link, {
						to: "/category/$slug",
						params: { slug: product.category },
						className: "hover:text-primary",
						children: category.name
					}),
					/* @__PURE__ */ jsx(ChevronRight, { size: 13 }),
					/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-foreground",
						children: product.name
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-[84px_minmax(0,1fr)]",
					children: [/* @__PURE__ */ jsx("div", {
						className: "order-2 flex gap-3 sm:order-1 sm:flex-col",
						children: gallery.map((g, i) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setThumb(i),
							"aria-label": `View image ${i + 1}`,
							className: `overflow-hidden rounded-xl border-2 bg-sand ${thumb === i ? "border-primary" : "border-border"}`,
							children: /* @__PURE__ */ jsx("img", {
								src: g,
								alt: "",
								loading: "lazy",
								className: "h-20 w-20 object-cover"
							})
						}, i))
					}), /* @__PURE__ */ jsx("div", {
						className: "order-1 overflow-hidden rounded-3xl border border-border bg-sand sm:order-2",
						children: /* @__PURE__ */ jsx("img", {
							src: gallery[thumb],
							alt: product.name,
							width: 800,
							height: 800,
							className: "aspect-square w-full object-cover"
						})
					})]
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-xs font-bold uppercase tracking-wide text-muted-foreground",
						children: product.brand
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-1 font-display text-xl font-extrabold leading-tight sm:text-4xl",
						children: product.name
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ jsx(Stars, { rating: product.rating }),
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold",
								children: product.rating
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-muted-foreground",
								children: [
									"(",
									product.reviews,
									" reviews)"
								]
							}),
							/* @__PURE__ */ jsx("span", {
								className: `ml-2 rounded-full px-2.5 py-1 text-xs font-bold ${product.inStock ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`,
								children: product.inStock ? "In stock" : "Out of stock"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex flex-wrap items-baseline gap-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-display text-2xl font-extrabold sm:text-3xl",
								children: money(subscribe ? subPrice : price)
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-base text-muted-foreground line-through",
								children: money(mrp)
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground",
								children: [off, "% OFF"]
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Inclusive of all taxes"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "text-xs font-bold uppercase tracking-wide text-muted-foreground",
							children: ["Select ", product.variants.length > 1 ? "pack size" : "pack"]
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: product.variants.map((v) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setVariant(v.label),
								className: `rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${variant === v.label ? "border-primary bg-primary-soft text-primary" : "border-border bg-card hover:border-primary"}`,
								children: v.label
							}, v.label))
						})]
					}),
					product.subscribable && /* @__PURE__ */ jsx("div", {
						className: "mt-5 rounded-2xl border border-border bg-card p-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsxs("p", {
									className: "flex items-center gap-2 text-sm font-bold",
									children: [/* @__PURE__ */ jsx(RefreshCw, {
										size: 15,
										className: "text-primary"
									}), " Subscribe & Save 10%"]
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										"Monthly delivery at ",
										money(subPrice),
										". Pause, skip or cancel anytime."
									]
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								role: "switch",
								"aria-checked": subscribe,
								"aria-label": "Toggle monthly subscription",
								onClick: () => setSubscribe((s) => !s),
								className: `h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${subscribe ? "bg-primary" : "bg-muted"}`,
								children: /* @__PURE__ */ jsx("span", { className: `block h-5 w-5 rounded-full bg-card transition-transform ${subscribe ? "translate-x-5" : ""}` })
							})]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center rounded-xl border border-border bg-card",
								children: [
									/* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": "Decrease quantity",
										onClick: () => setQty((q) => Math.max(1, q - 1)),
										className: "px-3 py-3",
										children: /* @__PURE__ */ jsx(Minus, { size: 15 })
									}),
									/* @__PURE__ */ jsx("span", {
										className: "w-9 text-center text-sm font-bold",
										children: qty
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										"aria-label": "Increase quantity",
										onClick: () => setQty((q) => q + 1),
										className: "px-3 py-3",
										children: /* @__PURE__ */ jsx(Plus, { size: 15 })
									})
								]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: !product.inStock,
								onClick: () => addToCart(product, variant, qty, subscribe),
								className: "flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-shadow hover:shadow-glow disabled:bg-muted disabled:text-muted-foreground",
								children: "Add to Cart"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/checkout",
								onClick: () => addToCart(product, variant, qty, subscribe),
								className: "flex-1 rounded-xl bg-foreground px-6 py-3 text-center text-sm font-bold text-background",
								children: "Buy Now"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								"aria-label": "Toggle wishlist",
								onClick: () => toggleWishlist(product.slug),
								className: "grid h-12 w-12 place-items-center rounded-xl border border-border bg-card",
								children: /* @__PURE__ */ jsx(Heart, {
									size: 18,
									className: wished ? "fill-primary text-primary" : ""
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 rounded-2xl border border-border bg-primary-soft/60 p-4",
						children: [/* @__PURE__ */ jsxs("p", {
							className: "flex items-center gap-2 text-sm font-bold",
							children: [/* @__PURE__ */ jsx(BadgePercent, {
								size: 16,
								className: "text-primary"
							}), " Offers on this product"]
						}), /* @__PURE__ */ jsxs("ul", {
							className: "mt-2 space-y-1.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ jsxs("li", { children: ["• Flat 20% off above ₹999 with code ", /* @__PURE__ */ jsx("b", {
									className: "text-foreground",
									children: "PAW20"
								})] }),
								/* @__PURE__ */ jsx("li", { children: "• 10% instant discount on HDFC & ICICI credit cards" }),
								/* @__PURE__ */ jsx("li", { children: "• Free grooming kit on your first order above ₹999" }),
								/* @__PURE__ */ jsx("li", { children: "• Earn 50 Paw Points on this purchase" })
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 rounded-2xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ jsxs("p", {
								className: "flex items-center gap-2 text-sm font-bold",
								children: [/* @__PURE__ */ jsx(Truck, {
									size: 16,
									className: "text-primary"
								}), " Check delivery"]
							}),
							/* @__PURE__ */ jsxs("form", {
								className: "mt-2 flex gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									setPinResult(/^\d{6}$/.test(pincode) ? `Delivers to ${pincode} by ${new Date(Date.now() + 1728e5).toLocaleDateString("en-IN", {
										weekday: "short",
										day: "numeric",
										month: "short"
									})} · COD available` : "Please enter a valid 6-digit pincode");
								},
								children: [/* @__PURE__ */ jsx("input", {
									value: pincode,
									onChange: (e) => setPincode(e.target.value),
									placeholder: "Enter pincode",
									"aria-label": "Pincode",
									className: "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "shrink-0 rounded-xl border border-primary px-4 py-2.5 text-sm font-bold text-primary",
									children: "Check"
								})]
							}),
							pinResult && /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-xs font-semibold text-success",
								children: pinResult
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(ShieldCheck, {
									size: 14,
									className: "text-primary"
								}), " 100% genuine"]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(Truck, {
									size: 14,
									className: "text-primary"
								}), " Free above ₹499"]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(RefreshCw, {
									size: 14,
									className: "text-primary"
								}), " 7-day returns"]
							})
						]
					})
				] })]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-14 rounded-3xl border border-border bg-card p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-xl font-extrabold",
					children: "Frequently bought together"
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx(BundleRow, {
							name: product.name,
							price,
							image: resolveCatalogImage(product.image, product.category),
							locked: true
						}), fbt.map((p) => /* @__PURE__ */ jsx(BundleRow, {
							name: p.name,
							price: p.price,
							image: resolveCatalogImage(p.image, p.category),
							checked: bundle.includes(p.id),
							onToggle: () => setBundle((b) => b.includes(p.id) ? b.filter((x) => x !== p.id) : [...b, p.id])
						}, p.id))]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl bg-sand p-5",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-xs font-semibold uppercase text-muted-foreground",
								children: "Bundle total"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "font-display text-2xl font-extrabold",
								children: money(bundleTotal)
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									addToCart(product, variant, 1, subscribe);
									fbt.filter((p) => bundle.includes(p.id)).forEach((p) => addToCart(p));
								},
								className: "mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground",
								children: "Add bundle to cart"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ jsx("div", {
					className: "no-scrollbar flex gap-2 overflow-x-auto border-b border-border",
					children: TABS.map((t) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setTab(t),
						className: `shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`,
						children: t
					}, t))
				}), /* @__PURE__ */ jsxs("div", {
					className: "py-6 text-sm leading-relaxed text-muted-foreground",
					children: [
						tab === "Description" && /* @__PURE__ */ jsx("p", {
							className: "max-w-3xl",
							children: product.description
						}),
						tab === "Ingredients & Specs" && /* @__PURE__ */ jsxs("div", {
							className: "grid gap-8 md:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "mb-2 font-display text-base font-bold text-foreground",
								children: "Ingredients"
							}), /* @__PURE__ */ jsx("p", { children: product.ingredients })] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "mb-2 font-display text-base font-bold text-foreground",
								children: "Specifications"
							}), /* @__PURE__ */ jsx("dl", {
								className: "divide-y divide-border rounded-2xl border border-border bg-card",
								children: product.specs.map((s) => /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between gap-4 px-4 py-2.5",
									children: [/* @__PURE__ */ jsx("dt", { children: s.label }), /* @__PURE__ */ jsx("dd", {
										className: "text-right font-semibold text-foreground",
										children: s.value
									})]
								}, s.label))
							})] })]
						}),
						tab === "Reviews & Ratings" && /* @__PURE__ */ jsxs("div", {
							className: "grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-border bg-card p-5 text-center",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "font-display text-4xl font-extrabold text-foreground",
										children: product.rating
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-1 flex justify-center",
										children: /* @__PURE__ */ jsx(Stars, { rating: product.rating })
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-1 text-xs",
										children: [product.reviews, " verified reviews"]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [[
									{
										n: "Meera K.",
										r: 5,
										t: "My picky eater finished the whole bowl. Packaging was sealed and fresh."
									},
									{
										n: "Arjun S.",
										r: 4,
										t: "Great quality for the price. Delivery took a day longer than promised."
									},
									{
										n: "Nikhil R.",
										r: 5,
										t: "Noticeable difference in coat shine within three weeks. Repeat buyer now."
									}
								].map((r) => /* @__PURE__ */ jsxs("div", {
									className: "rounded-2xl border border-border bg-card p-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ jsx(Stars, {
												rating: r.r,
												size: 13
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-sm font-bold text-foreground",
												children: r.n
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "ml-auto flex items-center gap-1 text-xs text-success",
												children: [/* @__PURE__ */ jsx(Check, { size: 13 }), " Verified"]
											})
										]
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-2",
										children: r.t
									})]
								}, r.n)), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => toast("Review form coming soon"),
									className: "rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary",
									children: "Write a review"
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-3 font-display text-xl font-extrabold sm:mb-5 sm:text-2xl",
					children: "You may also like"
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4",
					children: related.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
				})]
			})
		]
	});
}
function BundleRow({ name, price, image, checked, onToggle, locked }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "flex items-center gap-3 rounded-2xl border border-border p-3",
		children: [
			/* @__PURE__ */ jsx("input", {
				type: "checkbox",
				checked: locked ? true : !!checked,
				disabled: locked,
				onChange: onToggle,
				"aria-label": `Include ${name}`,
				className: "h-4 w-4 accent-[var(--color-primary)]"
			}),
			/* @__PURE__ */ jsx("img", {
				src: image,
				alt: "",
				loading: "lazy",
				className: "h-14 w-14 rounded-xl object-cover"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "min-w-0 flex-1 truncate text-sm font-semibold",
				children: name
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-sm font-bold",
				children: money(price)
			})
		]
	});
}
//#endregion
export { ProductPage as component };
