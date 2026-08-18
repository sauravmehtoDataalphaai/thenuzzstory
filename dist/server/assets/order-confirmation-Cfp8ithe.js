import { c as Route } from "./router-Cn9sBPaq.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, PawPrint } from "lucide-react";
//#region src/routes/order-confirmation.tsx?tsr-split=component
function Confirmation() {
	const { order } = Route.useSearch();
	const id = order ?? "PP-20000";
	const eta = new Date(Date.now() + 2592e5).toLocaleDateString("en-IN", {
		weekday: "long",
		day: "numeric",
		month: "long"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-2xl px-4 py-20 text-center",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "mx-auto grid h-24 w-24 animate-[scale-in_0.4s_ease-out] place-items-center rounded-full bg-success/15 text-success",
				children: /* @__PURE__ */ jsx(CheckCircle2, { size: 48 })
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-6 font-display text-3xl font-extrabold sm:text-4xl",
				children: "Order confirmed!"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Tails are already wagging. We've emailed your invoice and tracking details."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 rounded-3xl border border-border bg-card p-6 text-left",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold uppercase text-muted-foreground",
						children: "Order ID"
					}), /* @__PURE__ */ jsx("p", {
						className: "font-display text-xl font-extrabold",
						children: id
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "text-right",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold uppercase text-muted-foreground",
							children: "Estimated delivery"
						}), /* @__PURE__ */ jsx("p", {
							className: "font-display text-xl font-extrabold",
							children: eta
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-5 flex items-center gap-2 rounded-2xl bg-primary-soft p-4 text-sm text-primary",
					children: [
						/* @__PURE__ */ jsx(PawPrint, { size: 18 }),
						" You earned ",
						50,
						" Paw Points on this order."
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/account/track/$id",
					params: { id },
					className: "rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground",
					children: "Track Order"
				}), /* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "rounded-2xl border border-border px-6 py-3 text-sm font-bold hover:bg-secondary",
					children: "Continue Shopping"
				})]
			})
		]
	});
}
//#endregion
export { Confirmation as component };
