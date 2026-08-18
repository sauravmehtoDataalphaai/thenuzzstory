import { d as STORE } from "./catalog-db-CghLbik8.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Clock, Mail, MapPin, Phone, Stethoscope } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/contact.tsx?tsr-split=component
function Contact() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-7xl px-4 py-14",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-4xl font-extrabold",
				children: "Contact us"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 max-w-xl text-sm text-muted-foreground",
				children: "Questions about an order, a product, grooming slots or your pet's diet? We reply within a few hours."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid gap-8 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-3xl border border-border bg-card p-6",
						children: [/* @__PURE__ */ jsx("p", {
							className: "font-display text-lg font-bold",
							children: "Store & support"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "mt-4 space-y-3 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ jsxs("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx(MapPin, {
										size: 16,
										className: "mt-0.5 shrink-0 text-primary"
									}), STORE.address]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx(Clock, {
										size: 16,
										className: "mt-0.5 shrink-0 text-primary"
									}), STORE.hours]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx(Phone, {
										size: 16,
										className: "mt-0.5 shrink-0 text-primary"
									}), STORE.phone]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx(Mail, {
										size: 16,
										className: "mt-0.5 shrink-0 text-primary"
									}), STORE.email]
								})
							]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid h-56 place-items-center rounded-3xl border border-dashed border-border bg-sand text-sm font-semibold text-muted-foreground",
						children: "Map embed placeholder"
					})]
				}), /* @__PURE__ */ jsxs("form", {
					className: "grid gap-4 rounded-3xl border border-border bg-card p-6",
					onSubmit: (e) => {
						e.preventDefault();
						toast.success("Message sent!", { description: "Our team will get back to you shortly." });
						e.currentTarget.reset();
					},
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "flex items-center gap-2 font-display text-lg font-bold",
							children: [/* @__PURE__ */ jsx(Stethoscope, {
								size: 18,
								className: "text-primary"
							}), " Send a message / book a vet consult"]
						}),
						/* @__PURE__ */ jsx(F, { label: "Your name" }),
						/* @__PURE__ */ jsx(F, { label: "Email or phone" }),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Topic"
							}), /* @__PURE__ */ jsxs("select", {
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								children: [
									/* @__PURE__ */ jsx("option", { children: "Order support" }),
									/* @__PURE__ */ jsx("option", { children: "Vet consultation" }),
									/* @__PURE__ */ jsx("option", { children: "Grooming appointment" }),
									/* @__PURE__ */ jsx("option", { children: "Something else" })
								]
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Message"
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 5,
								required: true,
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow",
							children: "Send message"
						})
					]
				})]
			})
		]
	});
}
function F({ label }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "text-sm",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs font-semibold text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("input", {
			required: true,
			className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
		})]
	});
}
//#endregion
export { Contact as component };
