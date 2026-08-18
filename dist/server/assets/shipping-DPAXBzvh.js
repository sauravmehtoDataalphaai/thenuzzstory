import { d as STORE } from "./catalog-db-CghLbik8.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/shipping.tsx?tsr-split=component
var SplitComponent = () => /* @__PURE__ */ jsxs("article", {
	className: "mx-auto max-w-3xl px-4 py-14",
	children: [/* @__PURE__ */ jsx("h1", {
		className: "font-display text-4xl font-extrabold",
		children: "Shipping & Returns"
	}), /* @__PURE__ */ jsxs("div", {
		className: "mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground",
		children: [
			/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
				className: "font-display text-xl font-bold text-foreground",
				children: "Delivery timelines"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2",
				children: "Orders placed before 4 PM ship the same day. Metro cities: 1–2 business days. Rest of India: 3–5 business days."
			})] }),
			/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
				className: "font-display text-xl font-bold text-foreground",
				children: "Shipping charges"
			}), /* @__PURE__ */ jsxs("p", {
				className: "mt-2",
				children: [
					"Free delivery above ₹",
					STORE.freeShippingAbove,
					". Below that, a flat ₹",
					STORE.deliveryFee,
					". COD orders carry a ₹29 handling fee."
				]
			})] }),
			/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
				className: "font-display text-xl font-bold text-foreground",
				children: "Returns"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2",
				children: "Unopened products can be returned within 7 days. Damaged or wrong items are replaced free. Our Tail Wag Guarantee covers one opened food bag per household."
			})] }),
			/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
				className: "font-display text-xl font-bold text-foreground",
				children: "Refunds"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2",
				children: "Prepaid refunds reach your source account in 3–5 business days after pickup. COD refunds are issued as bank transfer or store credit."
			})] })
		]
	})]
});
//#endregion
export { SplitComponent as component };
