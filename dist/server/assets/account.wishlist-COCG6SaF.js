import { u as useStore } from "./router-Cn9sBPaq.js";
import { t as ProductCard } from "./ProductCard-J3zyhahX.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/account.wishlist.tsx?tsr-split=component
function Wishlist() {
	const { wishlist, products } = useStore();
	const items = products.filter((p) => wishlist.includes(p.slug));
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
		className: "font-display text-2xl font-extrabold",
		children: "Wishlist"
	}), items.length === 0 ? /* @__PURE__ */ jsxs("div", {
		className: "mt-6 rounded-3xl border border-dashed border-border p-10 text-center",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: "Nothing saved yet."
		}), /* @__PURE__ */ jsx(Link, {
			to: "/category/$slug",
			params: { slug: "dog-food" },
			className: "mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground",
			children: "Start shopping"
		})]
	}) : /* @__PURE__ */ jsx("div", {
		className: "mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
		children: items.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.slug))
	})] });
}
//#endregion
export { Wishlist as component };
