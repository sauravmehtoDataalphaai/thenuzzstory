import { a as rupeesFromPoints } from "./loyalty-rGqQQJ4S.js";
import { u as useStore } from "./router-Cn9sBPaq.js";
import { Link, Outlet } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Heart, LogOut, PackageSearch, PawPrint, User } from "lucide-react";
//#region src/routes/account.tsx?tsr-split=component
var nav = [
	{
		to: "/account/profile",
		label: "Profile & Pets",
		icon: PawPrint
	},
	{
		to: "/account/orders",
		label: "Order History",
		icon: PackageSearch
	},
	{
		to: "/account/wishlist",
		label: "Wishlist",
		icon: Heart
	}
];
function AccountLayout() {
	const { user, signOut, loyaltyPoints } = useStore();
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto grid max-w-7xl gap-5 px-3 py-6 sm:px-4 sm:py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "h-fit rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary",
						children: /* @__PURE__ */ jsx(User, { size: 18 })
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("p", {
							className: "truncate font-display text-base font-bold",
							children: user ? user.name : "Guest"
						}), /* @__PURE__ */ jsx("p", {
							className: "truncate text-xs text-muted-foreground",
							children: user ? user.email : "Not signed in"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-4 rounded-xl bg-sand px-3 py-2 text-xs font-semibold",
					children: [
						loyaltyPoints,
						" loyalty / Paw Points",
						loyaltyPoints >= 100 ? ` · ₹${rupeesFromPoints(loyaltyPoints)}` : ""
					]
				}),
				/* @__PURE__ */ jsxs("nav", {
					className: "mt-4 grid gap-1",
					children: [nav.map((n) => /* @__PURE__ */ jsxs(Link, {
						to: n.to,
						activeProps: { className: "bg-primary-soft text-primary" },
						className: "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-secondary",
						children: [
							/* @__PURE__ */ jsx(n.icon, { size: 16 }),
							" ",
							n.label
						]
					}, n.to)), user ? /* @__PURE__ */ jsxs("button", {
						onClick: () => void signOut(),
						className: "flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-destructive hover:bg-secondary",
						children: [/* @__PURE__ */ jsx(LogOut, { size: 16 }), " Sign out"]
					}) : /* @__PURE__ */ jsxs(Link, {
						to: "/account/login",
						activeProps: { className: "bg-primary-soft text-primary" },
						className: "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-secondary",
						children: [/* @__PURE__ */ jsx(User, { size: 16 }), " Login / Sign up"]
					})]
				})
			]
		}), /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx(Outlet, {}) })]
	});
}
//#endregion
export { AccountLayout as component };
