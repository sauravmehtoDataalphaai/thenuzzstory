import { n as TRACKING_STATUSES, o as statusBadgeClass, t as ADMIN_ORDER_STATUSES } from "./order-status-DSTuo78T.js";
import { t as getAccessToken } from "./session-baWtAfAY.js";
import { p as updateAdminOrderStatus, s as listAdminOrders } from "./admin-CxIQCdTb.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { createPortal } from "react-dom";
//#region src/routes/admin.orders.tsx?tsr-split=component
function StatusMenu({ order, anchor, busy, onClose, onSelect }) {
	const menuRef = useRef(null);
	const menuWidth = 200;
	const left = Math.min(Math.max(8, anchor.left + anchor.width - menuWidth), window.innerWidth - menuWidth - 8);
	const top = Math.min(anchor.top, window.innerHeight - 280);
	useEffect(() => {
		function onKeyDown(e) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [onClose]);
	return createPortal(/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
		type: "button",
		"aria-label": "Close menu",
		className: "fixed inset-0 z-[100] cursor-default bg-transparent",
		onClick: onClose
	}), /* @__PURE__ */ jsxs("div", {
		ref: menuRef,
		role: "menu",
		className: "fixed z-[101] min-w-[200px] rounded-xl border border-border bg-card py-1 shadow-lift",
		style: {
			top,
			left
		},
		children: [
			order.status === "Processing" && /* @__PURE__ */ jsx("button", {
				type: "button",
				role: "menuitem",
				disabled: busy,
				onClick: () => onSelect("Order placed"),
				className: "mx-1 block w-[calc(100%-0.5rem)] rounded-lg bg-primary px-3 py-2 text-left text-xs font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50",
				children: "Confirm order"
			}),
			order.status === "Processing" && /* @__PURE__ */ jsx("div", { className: "my-1 border-t border-border" }),
			TRACKING_STATUSES.map((s) => /* @__PURE__ */ jsxs("button", {
				type: "button",
				role: "menuitem",
				disabled: order.status === s || busy,
				onClick: () => onSelect(s),
				className: "block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40",
				children: [s, order.status === s && /* @__PURE__ */ jsx("span", {
					className: "ml-1 text-[10px] text-muted-foreground",
					children: "(current)"
				})]
			}, s)),
			/* @__PURE__ */ jsx("div", { className: "my-1 border-t border-border" }),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				role: "menuitem",
				disabled: order.status === "Cancelled" || busy,
				onClick: () => onSelect("Cancelled"),
				className: "block w-full px-3 py-2 text-left text-xs font-semibold text-destructive hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40",
				children: "Cancel order"
			})
		]
	})] }), document.body);
}
function AdminOrders() {
	const [orders, setOrders] = useState([]);
	const [status, setStatus] = useState("all");
	const [loading, setLoading] = useState(true);
	const [busyId, setBusyId] = useState(null);
	const [menuAnchor, setMenuAnchor] = useState(null);
	async function reload() {
		const token = await getAccessToken();
		if (!token) throw new Error("Not signed in");
		const data = await listAdminOrders({ data: {
			accessToken: token,
			status
		} });
		setOrders(data);
	}
	useEffect(() => {
		let cancelled = false;
		(async () => {
			setLoading(true);
			try {
				await reload();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to load orders");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [status]);
	useEffect(() => {
		if (!menuAnchor) return;
		function reposition() {
			setMenuAnchor(null);
		}
		window.addEventListener("scroll", reposition, true);
		window.addEventListener("resize", reposition);
		return () => {
			window.removeEventListener("scroll", reposition, true);
			window.removeEventListener("resize", reposition);
		};
	}, [menuAnchor]);
	async function setOrderStatus(orderId, nextStatus) {
		setBusyId(orderId);
		setMenuAnchor(null);
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			await updateAdminOrderStatus({ data: {
				accessToken: token,
				orderId,
				status: nextStatus
			} });
			await reload();
			toast.success(`Order updated to "${nextStatus}"`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Update failed");
		} finally {
			setBusyId(null);
		}
	}
	const menuOrder = menuAnchor ? orders.find((o) => o.id === menuAnchor.orderId) : null;
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-2xl font-extrabold",
					children: "Orders"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "All customer orders and delivery status"
				})] }), /* @__PURE__ */ jsxs("label", {
					className: "text-sm",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-semibold text-muted-foreground",
						children: "Filter status"
					}), /* @__PURE__ */ jsxs("select", {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: "mt-1 block rounded-xl border border-border bg-background px-3 py-2 text-sm",
						children: [/* @__PURE__ */ jsx("option", {
							value: "all",
							children: "All"
						}), ADMIN_ORDER_STATUSES.map((s) => /* @__PURE__ */ jsx("option", {
							value: s,
							children: s
						}, s))]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "rounded-2xl border border-border bg-card p-4 shadow-sm",
				children: loading ? /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading orders…"
				}) : /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[880px] text-left text-sm",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "text-xs uppercase text-muted-foreground",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Order"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Customer"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Phone"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Total"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 font-semibold",
									children: "Date"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "pb-2 pr-2 font-semibold",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", { children: orders.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 7,
							className: "py-8 text-muted-foreground",
							children: "No orders found"
						}) }) : orders.map((o) => {
							const isOpen = menuAnchor?.orderId === o.id;
							return /* @__PURE__ */ jsxs("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "py-3",
										children: /* @__PURE__ */ jsx(Link, {
											to: "/admin/orders/$id",
											params: { id: o.id },
											className: "font-semibold text-primary",
											children: o.id
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3",
										children: o.shipping_name
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3",
										children: o.shipping_phone
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3",
										children: /* @__PURE__ */ jsx("span", {
											className: `inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(o.status)}`,
											children: o.status
										})
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "py-3 font-semibold",
										children: ["₹", Number(o.total).toLocaleString("en-IN")]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 text-muted-foreground",
										children: new Date(o.created_at).toLocaleString("en-IN")
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-3 pr-2",
										children: /* @__PURE__ */ jsxs("button", {
											type: "button",
											disabled: busyId === o.id,
											"aria-expanded": isOpen,
											"aria-haspopup": "menu",
											onClick: (e) => {
												const rect = e.currentTarget.getBoundingClientRect();
												if (isOpen) setMenuAnchor(null);
												else setMenuAnchor({
													orderId: o.id,
													top: rect.bottom + 6,
													left: rect.left,
													width: rect.width
												});
											},
											className: `inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-60 ${isOpen ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-secondary"}`,
											children: [busyId === o.id ? "Updating…" : "Update status", /* @__PURE__ */ jsx(ChevronDown, {
												size: 14,
												className: `transition-transform ${isOpen ? "rotate-180" : ""}`
											})]
										})
									})
								]
							}, o.id);
						}) })]
					})
				})
			}),
			menuAnchor && menuOrder && /* @__PURE__ */ jsx(StatusMenu, {
				order: menuOrder,
				anchor: menuAnchor,
				busy: busyId === menuOrder.id,
				onClose: () => setMenuAnchor(null),
				onSelect: (next) => void setOrderStatus(menuOrder.id, next)
			})
		]
	});
}
//#endregion
export { AdminOrders as component };
