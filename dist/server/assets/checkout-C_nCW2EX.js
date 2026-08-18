import { _ as money } from "./catalog-db-CghLbik8.js";
import { a as rupeesFromPoints } from "./loyalty-rGqQQJ4S.js";
import { u as useStore } from "./router-Cn9sBPaq.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Banknote, Check, CreditCard, Landmark, Smartphone } from "lucide-react";
//#region src/routes/checkout.tsx?tsr-split=component
var steps = [
	"Address",
	"Payment",
	"Confirm"
];
var payments = [
	{
		id: "upi",
		label: "UPI",
		desc: "GPay, PhonePe, Paytm & more",
		icon: Smartphone
	},
	{
		id: "card",
		label: "Credit / Debit Card",
		desc: "Visa, Mastercard, RuPay",
		icon: CreditCard
	},
	{
		id: "netbanking",
		label: "Net Banking",
		desc: "All major Indian banks",
		icon: Landmark
	},
	{
		id: "cod",
		label: "Cash on Delivery",
		desc: "₹29 handling fee applies",
		icon: Banknote
	}
];
function Checkout() {
	const { cart, subtotal, discount, deliveryFee, total, addresses, addAddress, placeOrder, user, products, loyaltyPoints, loyaltyDiscount, redeemLoyalty, setRedeemLoyalty } = useStore();
	const [step, setStep] = useState(0);
	const [selected, setSelected] = useState("");
	const [pay, setPay] = useState("upi");
	const [showForm, setShowForm] = useState(false);
	const [placing, setPlacing] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		if (!selected && addresses[0]) setSelected(addresses[0].id);
		if (addresses.length === 0) setShowForm(true);
	}, [addresses, selected]);
	if (!user) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-extrabold",
				children: "Login to checkout"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Sign in with email OTP so we can save your address and order history."
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/account/login",
				className: "mt-5 inline-block rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground",
				children: "Login / Sign up"
			})
		]
	});
	if (cart.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-extrabold",
				children: "Nothing to check out"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Add a few things to your cart first."
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/",
				className: "mt-5 inline-block rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground",
				children: "Start shopping"
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-3xl font-extrabold sm:text-4xl",
				children: "Checkout"
			}),
			/* @__PURE__ */ jsx("ol", {
				className: "mt-6 flex items-center gap-2",
				children: steps.map((s, i) => /* @__PURE__ */ jsxs("li", {
					className: "flex flex-1 items-center gap-2",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: `grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
							children: i < step ? /* @__PURE__ */ jsx(Check, { size: 15 }) : i + 1
						}),
						/* @__PURE__ */ jsx("span", {
							className: `truncate text-xs font-bold sm:text-sm ${i <= step ? "" : "text-muted-foreground"}`,
							children: s
						}),
						i < steps.length - 1 && /* @__PURE__ */ jsx("span", { className: `h-0.5 flex-1 ${i < step ? "bg-primary" : "bg-border"}` })
					]
				}, s))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					step === 0 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							addresses.map((a) => /* @__PURE__ */ jsxs("label", {
								className: `flex cursor-pointer gap-3 rounded-2xl border p-4 ${selected === a.id ? "border-primary bg-primary-soft/40" : "border-border bg-card"}`,
								children: [/* @__PURE__ */ jsx("input", {
									type: "radio",
									name: "addr",
									checked: selected === a.id,
									onChange: () => setSelected(a.id),
									className: "mt-1 accent-[var(--color-primary)]"
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0 text-sm",
									children: [
										/* @__PURE__ */ jsxs("p", {
											className: "font-bold",
											children: [
												a.name,
												" ",
												/* @__PURE__ */ jsx("span", {
													className: "ml-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold",
													children: a.type
												})
											]
										}),
										/* @__PURE__ */ jsxs("p", {
											className: "mt-1 text-muted-foreground",
											children: [
												a.address,
												", ",
												a.landmark,
												", ",
												a.city,
												", ",
												a.state,
												" — ",
												a.pincode
											]
										}),
										/* @__PURE__ */ jsxs("p", {
											className: "text-muted-foreground",
											children: ["Phone: ", a.phone]
										})
									]
								})]
							}, a.id)),
							showForm ? /* @__PURE__ */ jsxs("form", {
								className: "grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2",
								onSubmit: (e) => {
									e.preventDefault();
									const f = new FormData(e.currentTarget);
									(async () => {
										try {
											const created = await addAddress({
												name: String(f.get("name")),
												phone: String(f.get("phone")),
												pincode: String(f.get("pincode")),
												address: String(f.get("address")),
												city: String(f.get("city")),
												state: String(f.get("state")),
												landmark: String(f.get("landmark")),
												type: f.get("type") === "Work" ? "Work" : "Home"
											});
											setSelected(created.id);
											setShowForm(false);
										} catch {}
									})();
								},
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "font-display text-lg font-bold sm:col-span-2",
										children: "Add a new address"
									}),
									/* @__PURE__ */ jsx(Field, {
										name: "name",
										label: "Full name"
									}),
									/* @__PURE__ */ jsx(Field, {
										name: "phone",
										label: "Phone number"
									}),
									/* @__PURE__ */ jsx(Field, {
										name: "pincode",
										label: "Pincode"
									}),
									/* @__PURE__ */ jsx(Field, {
										name: "city",
										label: "City"
									}),
									/* @__PURE__ */ jsx(Field, {
										name: "state",
										label: "State"
									}),
									/* @__PURE__ */ jsx(Field, {
										name: "landmark",
										label: "Landmark",
										required: false
									}),
									/* @__PURE__ */ jsx("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ jsx(Field, {
											name: "address",
											label: "Flat, building, street"
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Address type"
										}), /* @__PURE__ */ jsx("div", {
											className: "mt-2 flex gap-4 text-sm",
											children: ["Home", "Work"].map((t) => /* @__PURE__ */ jsxs("label", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ jsx("input", {
														type: "radio",
														name: "type",
														value: t,
														defaultChecked: t === "Home",
														className: "accent-[var(--color-primary)]"
													}),
													" ",
													t
												]
											}, t))
										})]
									}),
									/* @__PURE__ */ jsx("button", {
										type: "submit",
										className: "rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground sm:col-span-2",
										children: "Save address"
									})
								]
							}) : /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowForm(true),
								className: "w-full rounded-2xl border border-dashed border-border px-4 py-3 text-sm font-semibold hover:bg-secondary",
								children: "+ Add a new address"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: !selected,
								onClick: () => setStep(1),
								className: "w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:bg-muted disabled:text-muted-foreground",
								children: "Continue to payment"
							})
						]
					}),
					step === 1 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [payments.map((p) => /* @__PURE__ */ jsxs("label", {
							className: `flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${pay === p.id ? "border-primary bg-primary-soft/40" : "border-border bg-card"}`,
							children: [
								/* @__PURE__ */ jsx("input", {
									type: "radio",
									name: "pay",
									checked: pay === p.id,
									onChange: () => setPay(p.id),
									className: "accent-[var(--color-primary)]"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "grid h-10 w-10 place-items-center rounded-xl bg-secondary",
									children: /* @__PURE__ */ jsx(p.icon, { size: 18 })
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("span", {
										className: "block text-sm font-bold",
										children: p.label
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs text-muted-foreground",
										children: p.desc
									})]
								})
							]
						}, p.id)), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 pt-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setStep(0),
								className: "rounded-xl border border-border px-5 py-3 text-sm font-semibold",
								children: "Back"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setStep(2),
								className: "flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground",
								children: "Review order"
							})]
						})]
					}),
					step === 2 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4 rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "font-display text-lg font-bold",
								children: "Review & place order"
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Paying via ",
									/* @__PURE__ */ jsx("b", {
										className: "text-foreground",
										children: payments.find((p) => p.id === pay)?.label
									}),
									" · Delivering to",
									" ",
									/* @__PURE__ */ jsx("b", {
										className: "text-foreground",
										children: addresses.find((a) => a.id === selected)?.address
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setStep(1),
									className: "rounded-xl border border-border px-5 py-3 text-sm font-semibold",
									children: "Back"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									disabled: placing,
									onClick: () => {
										(async () => {
											setPlacing(true);
											try {
												const id = await placeOrder({
													paymentMethod: pay,
													addressId: selected
												});
												navigate({
													to: "/order-confirmation",
													search: { order: id }
												});
											} catch {} finally {
												setPlacing(false);
											}
										})();
									},
									className: "flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow disabled:opacity-60",
									children: placing ? "Placing…" : `Place Order · ${money(total)}`
								})]
							})
						]
					})
				] }), /* @__PURE__ */ jsxs("aside", {
					className: "h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-40",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "font-display text-lg font-extrabold",
							children: "Order summary"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3 space-y-3",
							children: cart.map((l) => {
								const p = products.find((x) => x.slug === l.slug);
								return /* @__PURE__ */ jsxs("div", {
									className: "flex gap-3",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: p?.image,
											alt: "",
											loading: "lazy",
											className: "h-12 w-12 rounded-lg object-cover"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "min-w-0 flex-1 text-xs",
											children: [/* @__PURE__ */ jsx("p", {
												className: "truncate font-semibold",
												children: p?.name
											}), /* @__PURE__ */ jsxs("p", {
												className: "text-muted-foreground",
												children: [
													l.variant,
													" × ",
													l.qty
												]
											})]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-sm font-bold",
											children: money(l.unitPrice * l.qty)
										})
									]
								}, l.slug + l.variant);
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 space-y-2 border-t border-border pt-3 text-sm",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Subtotal"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: money(subtotal)
									})]
								}),
								discount > 0 && /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Discount"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-bold text-success",
										children: ["- ", money(discount)]
									})]
								}),
								loyaltyDiscount > 0 && /* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Loyalty"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-bold text-success",
										children: ["- ", money(loyaltyDiscount)]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Delivery"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: deliveryFee === 0 ? "FREE" : money(deliveryFee)
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between border-t border-border pt-2 text-base font-extrabold",
									children: [/* @__PURE__ */ jsx("span", { children: "Total" }), /* @__PURE__ */ jsx("span", { children: money(total) })]
								})
							]
						}),
						loyaltyPoints >= 100 && rupeesFromPoints(loyaltyPoints) > 0 && /* @__PURE__ */ jsxs("label", {
							className: "mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-3 text-sm",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: redeemLoyalty,
								onChange: (e) => setRedeemLoyalty(e.target.checked),
								className: "mt-0.5 accent-[var(--color-primary)]"
							}), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
								className: "font-bold",
								children: "Redeem loyalty points"
							}), /* @__PURE__ */ jsxs("span", {
								className: "mt-0.5 block text-xs text-muted-foreground",
								children: [
									loyaltyPoints,
									" points · worth ",
									money(rupeesFromPoints(loyaltyPoints)),
									redeemLoyalty && loyaltyDiscount > 0 ? ` · applying ${money(loyaltyDiscount)} off` : "",
									redeemLoyalty && loyaltyDiscount === 0 ? " · nothing left to redeem on this total" : ""
								]
							})] })]
						})
					]
				})]
			})
		]
	});
}
function Field({ name, label, required = true }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block text-sm",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs font-semibold text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("input", {
			name,
			required,
			className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
		})]
	});
}
//#endregion
export { Checkout as component };
