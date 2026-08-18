import { o as fetchOrderById } from "./auth-D9i6D0LJ.js";
import { a as Route, u as useStore } from "./router-Cn9sBPaq.js";
import { r as TRACKING_STEPS, s as statusToStepIndex } from "./order-status-DSTuo78T.js";
import { useEffect, useState } from "react";
import { Link, notFound } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, Circle } from "lucide-react";
//#region src/routes/account.track.$id.tsx?tsr-split=component
function Track() {
	const { id } = Route.useParams();
	const { user } = useStore();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			if (!user) {
				setLoading(false);
				return;
			}
			try {
				const row = await fetchOrderById(user.id, id);
				if (!cancelled) setOrder(row);
			} catch (err) {
				console.error(err);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [user, id]);
	if (!user) return /* @__PURE__ */ jsxs("div", {
		className: "rounded-3xl border border-border bg-card p-8 text-center",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: "Login to track your order."
		}), /* @__PURE__ */ jsx(Link, {
			to: "/account/login",
			className: "mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground",
			children: "Login"
		})]
	});
	if (loading) return /* @__PURE__ */ jsx("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading tracking…"
	});
	if (!order) throw notFound();
	const current = statusToStepIndex(order.status);
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-3xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ jsxs("h1", {
				className: "font-display text-2xl font-extrabold",
				children: ["Tracking ", id]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: order.status === "Processing" ? "Waiting for store confirmation — we'll update tracking once your order is confirmed." : order.status === "Delivered" ? "Delivered — thank you for shopping with us!" : "Estimated delivery: within 2 business days"
			}),
			order.status === "Processing" ? /* @__PURE__ */ jsx("p", {
				className: "mt-4 rounded-xl bg-sand px-4 py-3 text-sm font-semibold",
				children: "Status: Processing — admin will confirm your order soon."
			}) : /* @__PURE__ */ jsx("ol", {
				className: "mt-6 grid gap-5",
				children: TRACKING_STEPS.map((s, i) => {
					const done = current >= 0 && i <= current;
					return /* @__PURE__ */ jsxs("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: done ? "text-primary" : "text-muted-foreground",
							children: done ? /* @__PURE__ */ jsx(CheckCircle2, { size: 20 }) : /* @__PURE__ */ jsx(Circle, { size: 20 })
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("p", {
								className: `text-sm font-bold ${done ? "" : "text-muted-foreground"}`,
								children: s.title
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: s.description
							})]
						})]
					}, s.status);
				})
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/account/orders",
				className: "mt-6 inline-block text-sm font-semibold text-primary hover:underline",
				children: "← Back to order history"
			})
		]
	});
}
//#endregion
export { Track as component };
