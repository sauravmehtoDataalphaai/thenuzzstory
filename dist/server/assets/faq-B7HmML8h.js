import { h as faqs } from "./catalog-db-CghLbik8.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/faq.tsx?tsr-split=component
var SplitComponent = () => /* @__PURE__ */ jsxs("article", {
	className: "mx-auto max-w-3xl px-4 py-14",
	children: [/* @__PURE__ */ jsx("h1", {
		className: "font-display text-4xl font-extrabold",
		children: "Frequently asked questions"
	}), /* @__PURE__ */ jsx("div", {
		className: "mt-8 divide-y divide-border rounded-3xl border border-border bg-card",
		children: faqs.map((f) => /* @__PURE__ */ jsxs("details", {
			className: "px-5 py-4",
			children: [/* @__PURE__ */ jsx("summary", {
				className: "cursor-pointer list-none text-sm font-bold",
				children: f.q
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: f.a
			})]
		}, f.q))
	})]
});
//#endregion
export { SplitComponent as component };
