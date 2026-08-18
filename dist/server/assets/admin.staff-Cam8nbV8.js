import { t as getAccessToken } from "./session-baWtAfAY.js";
import { c as listAdminStaff, m as updateAdminStaff, u as promoteUserByEmail } from "./admin-CxIQCdTb.js";
import { i as STAFF_ROLES } from "./roles-DGja2QmC.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/admin.staff.tsx?tsr-split=component
function AdminStaff() {
	const [staff, setStaff] = useState([]);
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("ops");
	const [busy, setBusy] = useState(false);
	async function reload() {
		const token = await getAccessToken();
		if (!token) throw new Error("Not signed in");
		const data = await listAdminStaff({ data: { accessToken: token } });
		setStaff(data);
	}
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				await reload();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to load staff");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	async function promote() {
		setBusy(true);
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			await promoteUserByEmail({ data: {
				accessToken: token,
				email,
				role
			} });
			setEmail("");
			await reload();
			toast.success("Staff access granted");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not promote user");
		} finally {
			setBusy(false);
		}
	}
	async function saveRow(user, nextRole, isActive) {
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			await updateAdminStaff({ data: {
				accessToken: token,
				userId: user.id,
				role: nextRole,
				is_active: isActive
			} });
			await reload();
			toast.success("Staff updated");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Update failed");
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-extrabold",
				children: "Staff"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Promote store users to staff roles and manage access"
			})] }),
			/* @__PURE__ */ jsxs("form", {
				className: "grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-[1fr_160px_auto]",
				onSubmit: (e) => {
					e.preventDefault();
					promote();
				},
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "User email"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "already signed up on the store",
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Role"
						}), /* @__PURE__ */ jsx("select", {
							value: role,
							onChange: (e) => setRole(e.target.value),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm",
							children: STAFF_ROLES.map((r) => /* @__PURE__ */ jsx("option", {
								value: r,
								children: r
							}, r))
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: busy,
							className: "w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60",
							children: busy ? "Saving…" : "Add staff"
						})
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm",
				children: loading ? /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading staff…"
				}) : /* @__PURE__ */ jsxs("table", {
					className: "w-full min-w-[720px] text-left text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "text-xs uppercase text-muted-foreground",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Name"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Email"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Role"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Active"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", { children: staff.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 5,
						className: "py-8 text-muted-foreground",
						children: "No staff yet"
					}) }) : staff.map((u) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "py-3 font-semibold",
								children: u.name || "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: u.email
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: /* @__PURE__ */ jsxs("select", {
									value: u.role,
									onChange: (e) => void saveRow(u, e.target.value, u.is_active !== false),
									className: "rounded-lg border border-border bg-background px-2 py-1.5 text-sm",
									children: [STAFF_ROLES.map((r) => /* @__PURE__ */ jsx("option", {
										value: r,
										children: r
									}, r)), /* @__PURE__ */ jsx("option", {
										value: "customer",
										children: "customer (remove staff)"
									})]
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "py-3",
								children: /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => void saveRow(u, u.role, !(u.is_active !== false)),
									className: `rounded-full px-2.5 py-1 text-xs font-bold ${u.is_active !== false ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`,
									children: u.is_active !== false ? "Active" : "Inactive"
								})
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "py-3 text-xs text-muted-foreground",
								children: ["Joined ", new Date(u.created_at).toLocaleDateString("en-IN")]
							})
						]
					}, u.id)) })]
				})
			})
		]
	});
}
//#endregion
export { AdminStaff as component };
