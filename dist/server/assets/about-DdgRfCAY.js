import { d as STORE } from "./catalog-db-CghLbik8.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/about.tsx?tsr-split=component
var SplitComponent = () => /* @__PURE__ */ jsxs("article", {
	className: "mx-auto max-w-3xl px-4 py-14",
	children: [
		/* @__PURE__ */ jsx("h1", {
			className: "font-display text-4xl font-extrabold",
			children: "About Us"
		}),
		/* @__PURE__ */ jsxs("p", {
			className: "mt-3 text-base text-muted-foreground",
			children: [STORE.name, " started in 2019 as a 300 sq ft corner store in Chittaranjan Park with one promise: only sell what we'd feed our own pets."]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground",
			children: [
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-xl font-bold text-foreground",
					children: "Our story"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2",
					children: "What began as a weekend project between two dog parents is now a full pet-care destination — a store, a grooming studio and an online shop trusted by 40,000+ families."
				})] }),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-xl font-bold text-foreground",
					children: "How we pick products"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2",
					children: "Every product is reviewed by our in-house veterinarian for ingredient quality, sourcing and safety. If a formula changes, we re-review it. If it fails, we delist it."
				})] }),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-xl font-bold text-foreground",
					children: "Giving back"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2",
					children: "1% of every order funds sterilisation and vaccination drives for community animals in New Delhi — 1,240 procedures last year."
				})] })
			]
		})
	]
});
//#endregion
export { SplitComponent as component };
