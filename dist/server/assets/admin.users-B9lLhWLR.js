import { t as getAccessToken } from "./session-baWtAfAY.js";
import { f as updateAdminCustomer, l as listAdminUsers, t as deleteAdminCustomer } from "./admin-CxIQCdTb.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/admin.users.tsx?tsr-split=component
function AdminUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [busyId, setBusyId] = useState(null);
	const [editing, setEditing] = useState(null);
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [loyalty, setLoyalty] = useState("0");
	async function reload() {
		const token = await getAccessToken();
		if (!token) throw new Error("Not signed in");
		const data = await listAdminUsers({ data: { accessToken: token } });
		setUsers(data);
	}
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				await reload();
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to load users");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	function openEdit(u) {
		setEditing(u);
		setName(u.name ?? "");
		setPhone(u.phone ?? "");
		setLoyalty(String(u.loyalty_points ?? 0));
	}
	async function saveEdit() {
		if (!editing) return;
		setBusyId(editing.id);
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			await updateAdminCustomer({ data: {
				accessToken: token,
				userId: editing.id,
				name,
				phone,
				loyalty_points: Number(loyalty)
			} });
			await reload();
			setEditing(null);
			toast.success("Customer updated");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Update failed");
		} finally {
			setBusyId(null);
		}
	}
	async function removeCustomer(u) {
		if (!window.confirm(`Delete ${u.name || u.email}? This removes the account from the database (profile, addresses, orders) and cannot be undone.`)) return;
		setBusyId(u.id);
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			await deleteAdminCustomer({ data: {
				accessToken: token,
				userId: u.id
			} });
			await reload();
			if (editing?.id === u.id) setEditing(null);
			toast.success("Customer deleted");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Delete failed");
		} finally {
			setBusyId(null);
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-extrabold",
				children: "Users"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Customer and staff accounts. Only customers can be edited or deleted. Super admins are protected."
			})] }),
			editing && /* @__PURE__ */ jsxs("form", {
				className: "grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4",
				onSubmit: (e) => {
					e.preventDefault();
					saveEdit();
				},
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "sm:col-span-2 lg:col-span-4 font-display text-lg font-extrabold",
						children: ["Edit ", editing.email]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Name"
						}), /* @__PURE__ */ jsx("input", {
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Phone"
						}), /* @__PURE__ */ jsx("input", {
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Loyalty points"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							min: 0,
							value: loyalty,
							onChange: (e) => setLoyalty(e.target.value),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-end gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: busyId === editing.id,
							className: "rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60",
							children: busyId === editing.id ? "Saving…" : "Save"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setEditing(null),
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
					children: "Loading users…"
				}) : /* @__PURE__ */ jsxs("table", {
					className: "w-full min-w-[820px] text-left text-sm",
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
								children: "Phone"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Role"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Loyalty"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Joined"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "pb-2 font-semibold",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", { children: users.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 7,
						className: "py-8 text-muted-foreground",
						children: "No users found"
					}) }) : users.map((u) => {
						const isCustomer = u.role === "customer";
						return /* @__PURE__ */ jsxs("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: /* @__PURE__ */ jsx(Link, {
										to: "/admin/users/$id",
										params: { id: u.id },
										className: "font-semibold text-primary",
										children: u.name || "—"
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: u.email
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: u.phone || "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: /* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-secondary px-2.5 py-1 text-xs font-bold",
										children: u.role
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3 font-semibold",
									children: u.loyalty_points
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3 text-muted-foreground",
									children: new Date(u.created_at).toLocaleDateString("en-IN")
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3",
									children: isCustomer ? /* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap gap-2",
										children: [/* @__PURE__ */ jsx("button", {
											type: "button",
											disabled: busyId === u.id,
											onClick: () => openEdit(u),
											className: "rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:bg-secondary disabled:opacity-60",
											children: "Edit"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											disabled: busyId === u.id,
											onClick: () => void removeCustomer(u),
											className: "rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/5 disabled:opacity-60",
											children: busyId === u.id ? "Deleting…" : "Delete"
										})]
									}) : /* @__PURE__ */ jsx("span", {
										className: "text-xs text-muted-foreground",
										children: "Protected"
									})
								})
							]
						}, u.id);
					}) })]
				})
			})
		]
	});
}
//#endregion
export { AdminUsers as component };
