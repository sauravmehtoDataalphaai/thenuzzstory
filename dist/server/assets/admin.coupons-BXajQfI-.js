import { t as couponToRow } from "./catalog-db-CghLbik8.js";
import { t as getAccessToken } from "./session-baWtAfAY.js";
import { c as upsertAdminCoupon, i as listAdminCoupons } from "./catalog-Bypn6n3U.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Plus } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/admin.coupons.tsx?tsr-split=component
var emptyCoupon = () => ({
	code: "",
	label: "",
	type: "percent",
	value: 10,
	minCart: 0,
	active: true
});
function AdminCoupons() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState(emptyCoupon());
	const [saving, setSaving] = useState(false);
	const [showForm, setShowForm] = useState(false);
	async function reload() {
		const token = await getAccessToken();
		if (!token) throw new Error("Not signed in");
		const data = await listAdminCoupons({ data: { accessToken: token } });
		setItems(data.map((c) => ({
			code: c.code,
			label: c.label,
			type: c.type,
			value: c.value,
			minCart: c.minCart,
			active: c.active !== false
		})));
	}
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				await reload();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to load coupons");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	async function save(e) {
		e.preventDefault();
		setSaving(true);
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			const row = couponToRow({
				code: form.code,
				label: form.label,
				type: form.type,
				value: form.value,
				minCart: form.minCart
			}, form.active);
			await upsertAdminCoupon({ data: {
				accessToken: token,
				coupon: row
			} });
			setForm(emptyCoupon());
			setShowForm(false);
			await reload();
			toast.success("Coupon saved");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Save failed");
		} finally {
			setSaving(false);
		}
	}
	function edit(c) {
		setForm(c);
		setShowForm(true);
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-2xl font-extrabold",
					children: "Coupons"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Promo codes customers can apply at checkout"
				})] }), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => {
						setForm(emptyCoupon());
						setShowForm(true);
					},
					className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground",
					children: [/* @__PURE__ */ jsx(Plus, { size: 16 }), " Add coupon"]
				})]
			}),
			showForm && /* @__PURE__ */ jsxs("form", {
				onSubmit: (e) => void save(e),
				className: "grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Code"
						}), /* @__PURE__ */ jsx("input", {
							required: true,
							value: form.code,
							onChange: (e) => setForm({
								...form,
								code: e.target.value.toUpperCase()
							}),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm uppercase"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Label"
						}), /* @__PURE__ */ jsx("input", {
							required: true,
							value: form.label,
							onChange: (e) => setForm({
								...form,
								label: e.target.value
							}),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Type"
						}), /* @__PURE__ */ jsxs("select", {
							value: form.type,
							onChange: (e) => setForm({
								...form,
								type: e.target.value
							}),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm",
							children: [/* @__PURE__ */ jsx("option", {
								value: "percent",
								children: "Percent off"
							}), /* @__PURE__ */ jsx("option", {
								value: "flat",
								children: "Flat ₹ off"
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Value"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							required: true,
							min: 0,
							value: form.value,
							onChange: (e) => setForm({
								...form,
								value: Number(e.target.value)
							}),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Min cart (₹)"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							min: 0,
							value: form.minCart,
							onChange: (e) => setForm({
								...form,
								minCart: Number(e.target.value)
							}),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "flex items-end gap-2 text-sm",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: form.active,
							onChange: (e) => setForm({
								...form,
								active: e.target.checked
							})
						}), "Active"]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2 sm:col-span-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: saving,
							className: "rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60",
							children: saving ? "Saving…" : "Save coupon"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setShowForm(false),
							className: "rounded-xl border border-border px-4 py-2.5 text-sm font-bold",
							children: "Cancel"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm",
				children: loading ? /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading coupons…"
				}) : /* @__PURE__ */ jsxs("table", {
					className: "w-full min-w-[640px] text-left text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "text-xs uppercase text-muted-foreground",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Code"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Label"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Discount"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Min cart"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Status"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", { children: items.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 6,
						className: "py-8 text-center text-muted-foreground",
						children: "No coupons yet"
					}) }) : items.map((c) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "py-3 font-mono font-bold",
								children: c.code
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: c.label
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: c.type === "percent" ? `${c.value}%` : `₹${c.value}`
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3",
								children: ["₹", c.minCart]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: /* @__PURE__ */ jsx("span", {
									className: `rounded-full px-2 py-0.5 text-xs font-bold ${c.active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`,
									children: c.active ? "Active" : "Inactive"
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => edit(c),
									className: "rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary",
									children: "Edit"
								})
							})
						]
					}, c.code)) })]
				})
			})
		]
	});
}
//#endregion
export { AdminCoupons as component };
