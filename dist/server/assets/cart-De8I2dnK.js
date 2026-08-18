import { _ as money } from "./catalog-db-CghLbik8.js";
import { u as useStore } from "./router-Cn9sBPaq.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Minus, PackageOpen, Plus, Tag, Trash2 } from "lucide-react";
//#region src/routes/cart.tsx?tsr-split=component
function CartPage() {
	const { cart, updateQty, removeLine, subtotal, discount, deliveryFee, total, savings, coupon, applyCoupon, removeCoupon, products } = useStore();
	const [code, setCode] = useState("");
	if (cart.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "grid h-24 w-24 place-items-center rounded-full bg-primary-soft text-primary",
				children: /* @__PURE__ */ jsx(PackageOpen, { size: 40 })
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-extrabold",
				children: "Your cart is empty"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "No kibble, no toys, no treats. Let's fix that right away."
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/",
				className: "mt-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground",
				children: "Continue Shopping"
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-extrabold sm:text-4xl",
				children: "Your Cart"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					cart.length,
					" item(s) · You save ",
					money(savings)
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]",
				children: [/* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: cart.map((line) => {
						const p = products.find((x) => x.slug === line.slug);
						return /* @__PURE__ */ jsxs("div", {
							className: "flex gap-4 rounded-2xl border border-border bg-card p-4",
							children: [/* @__PURE__ */ jsx("img", {
								src: p?.image,
								alt: p?.name ?? "",
								loading: "lazy",
								className: "h-24 w-24 shrink-0 rounded-xl object-cover"
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsx(Link, {
										to: "/product/$slug",
										params: { slug: line.slug },
										className: "line-clamp-2 text-sm font-bold hover:text-primary",
										children: p?.name
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: [
											p?.brand,
											" · ",
											line.variant,
											line.subscription && " · Monthly subscription (10% off)"
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-3 flex flex-wrap items-center gap-3",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center rounded-lg border border-border",
												children: [
													/* @__PURE__ */ jsx("button", {
														type: "button",
														"aria-label": "Decrease quantity",
														onClick: () => updateQty(line.slug, line.variant, line.qty - 1),
														className: "px-2.5 py-1.5",
														children: /* @__PURE__ */ jsx(Minus, { size: 14 })
													}),
													/* @__PURE__ */ jsx("span", {
														className: "w-8 text-center text-sm font-bold",
														children: line.qty
													}),
													/* @__PURE__ */ jsx("button", {
														type: "button",
														"aria-label": "Increase quantity",
														onClick: () => updateQty(line.slug, line.variant, line.qty + 1),
														className: "px-2.5 py-1.5",
														children: /* @__PURE__ */ jsx(Plus, { size: 14 })
													})
												]
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-base font-extrabold",
												children: money(line.unitPrice * line.qty)
											}),
											/* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => removeLine(line.slug, line.variant),
												className: "ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive",
												children: [/* @__PURE__ */ jsx(Trash2, { size: 15 }), " Remove"]
											})
										]
									})
								]
							})]
						}, line.slug + line.variant);
					})
				}), /* @__PURE__ */ jsxs("aside", {
					className: "h-fit space-y-4 lg:sticky lg:top-40",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ jsxs("p", {
								className: "flex items-center gap-2 text-sm font-bold",
								children: [/* @__PURE__ */ jsx(Tag, {
									size: 16,
									className: "text-primary"
								}), " Apply coupon"]
							}),
							coupon ? /* @__PURE__ */ jsxs("div", {
								className: "mt-3 flex items-center justify-between rounded-xl bg-success/10 px-3 py-2.5 text-sm",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "font-bold text-success",
									children: [coupon.code, " applied"]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: removeCoupon,
									className: "text-xs font-semibold text-muted-foreground",
									children: "Remove"
								})]
							}) : /* @__PURE__ */ jsxs("form", {
								className: "mt-3 flex gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									if (applyCoupon(code)) setCode("");
								},
								children: [/* @__PURE__ */ jsx("input", {
									value: code,
									onChange: (e) => setCode(e.target.value),
									placeholder: "PAW20",
									"aria-label": "Coupon code",
									className: "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm uppercase outline-none focus:border-primary"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground",
									children: "Apply"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "Try PAW20, NEWPET or GROOM10"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-2 rounded-2xl border border-border bg-card p-5 text-sm",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "mb-2 font-display text-lg font-extrabold",
								children: "Price details"
							}),
							/* @__PURE__ */ jsx(Row, {
								label: "Subtotal",
								value: money(subtotal)
							}),
							/* @__PURE__ */ jsx(Row, {
								label: "Discount",
								value: discount ? `- ${money(discount)}` : "—",
								good: !!discount
							}),
							/* @__PURE__ */ jsx(Row, {
								label: "Delivery",
								value: deliveryFee === 0 ? "FREE" : money(deliveryFee)
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between border-t border-border pt-3 text-base font-extrabold",
								children: [/* @__PURE__ */ jsx("span", { children: "Total" }), /* @__PURE__ */ jsx("span", { children: money(total) })]
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/checkout",
								className: "mt-3 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground hover:shadow-glow",
								children: "Proceed to Checkout"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								className: "block rounded-xl border border-border px-4 py-3 text-center text-sm font-semibold hover:bg-secondary",
								children: "Continue Shopping"
							})
						]
					})]
				})]
			})
		]
	});
}
function Row({ label, value, good }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: good ? "font-bold text-success" : "font-semibold",
			children: value
		})]
	});
}
//#endregion
export { CartPage as component };
