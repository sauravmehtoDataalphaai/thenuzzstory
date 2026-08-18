import { i as Route } from "./router-Cn9sBPaq.js";
import { n as TRACKING_STATUSES, o as statusBadgeClass } from "./order-status-DSTuo78T.js";
import { t as getAccessToken } from "./session-baWtAfAY.js";
import { p as updateAdminOrderStatus, r as getAdminOrder } from "./admin-CxIQCdTb.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/admin.orders.$id.tsx?tsr-split=component
function AdminOrderDetail() {
	const { id } = Route.useParams();
	const [detail, setDetail] = useState(null);
	const [status, setStatus] = useState("");
	const [busy, setBusy] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const token = await getAccessToken();
				if (!token) throw new Error("Not signed in");
				const data = await getAdminOrder({ data: {
					accessToken: token,
					orderId: id
				} });
				if (!cancelled) {
					setDetail(data);
					setStatus(data.order.status);
				}
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to load order");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [id]);
	async function saveStatus() {
		if (!detail) return;
		setBusy(true);
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			const updated = await updateAdminOrderStatus({ data: {
				accessToken: token,
				orderId: id,
				status
			} });
			setDetail({
				...detail,
				order: updated
			});
			toast.success("Delivery status updated");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Update failed");
		} finally {
			setBusy(false);
		}
	}
	if (loading) return /* @__PURE__ */ jsx("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading order…"
	});
	if (!detail) return null;
	const { order, items, customer } = detail;
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/admin/orders",
					className: "text-sm font-semibold text-primary",
					children: "← Back to orders"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-2 font-display text-2xl font-extrabold",
					children: order.id
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: ["Placed ", new Date(order.created_at).toLocaleString("en-IN")]
				})
			] }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-display text-lg font-bold",
						children: "Delivery status"
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap items-end gap-3",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Status"
								}), /* @__PURE__ */ jsxs("select", {
									value: status,
									onChange: (e) => setStatus(e.target.value),
									className: "mt-1 block rounded-xl border border-border bg-background px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "Processing",
											children: "Processing"
										}),
										TRACKING_STATUSES.map((s) => /* @__PURE__ */ jsx("option", {
											value: s,
											children: s
										}, s)),
										/* @__PURE__ */ jsx("option", {
											value: "Cancelled",
											children: "Cancelled"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: busy || status === order.status,
								onClick: () => void saveStatus(),
								className: "rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60",
								children: busy ? "Saving…" : "Update status"
							}),
							/* @__PURE__ */ jsxs("span", {
								className: `inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(order.status)}`,
								children: ["Current: ", order.status]
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "font-display text-lg font-bold",
						children: "Customer & shipping"
					}), /* @__PURE__ */ jsxs("dl", {
						className: "mt-3 grid gap-2 text-sm",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
								className: "text-xs text-muted-foreground",
								children: "Name"
							}), /* @__PURE__ */ jsx("dd", {
								className: "font-semibold",
								children: order.shipping_name
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
								className: "text-xs text-muted-foreground",
								children: "Phone"
							}), /* @__PURE__ */ jsx("dd", {
								className: "font-semibold",
								children: order.shipping_phone
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
								className: "text-xs text-muted-foreground",
								children: "Address"
							}), /* @__PURE__ */ jsx("dd", {
								className: "font-semibold",
								children: order.shipping_address
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
								className: "text-xs text-muted-foreground",
								children: "Account email"
							}), /* @__PURE__ */ jsx("dd", {
								className: "font-semibold",
								children: customer ? /* @__PURE__ */ jsx(Link, {
									to: "/admin/users/$id",
									params: { id: customer.id },
									className: "text-primary",
									children: customer.email
								}) : "—"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
								className: "text-xs text-muted-foreground",
								children: "Payment"
							}), /* @__PURE__ */ jsx("dd", {
								className: "font-semibold",
								children: order.payment_method || "—"
							})] })
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "font-display text-lg font-bold",
						children: "Items"
					}),
					/* @__PURE__ */ jsx("ul", {
						className: "mt-3 divide-y divide-border",
						children: items.map((item) => /* @__PURE__ */ jsxs("li", {
							className: "flex items-center justify-between gap-3 py-3 text-sm",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "font-semibold",
								children: item.product_name
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-muted-foreground",
								children: [
									item.variant,
									" · qty ",
									item.qty
								]
							})] }), /* @__PURE__ */ jsxs("p", {
								className: "font-semibold",
								children: ["₹", (Number(item.unit_price) * item.qty).toLocaleString("en-IN")]
							})]
						}, item.id))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 border-t border-border pt-4 text-sm",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ jsx("span", { children: "Subtotal" }), /* @__PURE__ */ jsxs("span", { children: ["₹", Number(order.subtotal).toLocaleString("en-IN")] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ jsx("span", { children: "Discount" }), /* @__PURE__ */ jsxs("span", { children: ["-₹", Number(order.discount).toLocaleString("en-IN")] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-muted-foreground",
								children: [/* @__PURE__ */ jsx("span", { children: "Delivery" }), /* @__PURE__ */ jsxs("span", { children: ["₹", Number(order.delivery_fee).toLocaleString("en-IN")] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex justify-between font-bold",
								children: [/* @__PURE__ */ jsx("span", { children: "Total" }), /* @__PURE__ */ jsxs("span", { children: ["₹", Number(order.total).toLocaleString("en-IN")] })]
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { AdminOrderDetail as component };
