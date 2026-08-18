import { t as getAccessToken } from "./session-baWtAfAY.js";
import { d as savePermissionsMatrix, o as getPermissionsMatrix } from "./admin-CxIQCdTb.js";
import { i as STAFF_ROLES, r as PERMISSION_LABELS, t as ALL_PERMISSIONS } from "./roles-DGja2QmC.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/admin.permissions.tsx?tsr-split=component
function AdminPermissions() {
	const [matrix, setMatrix] = useState(null);
	const [loading, setLoading] = useState(true);
	const [busy, setBusy] = useState(false);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const token = await getAccessToken();
				if (!token) throw new Error("Not signed in");
				const data = await getPermissionsMatrix({ data: { accessToken: token } });
				if (!cancelled) setMatrix(data);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to load permissions");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	function toggle(role, permission) {
		if (!matrix) return;
		if (role === "super_admin") {
			toast.message("super_admin always has full access");
			return;
		}
		setMatrix({
			...matrix,
			[role]: {
				...matrix[role],
				[permission]: !matrix[role][permission]
			}
		});
	}
	async function save() {
		if (!matrix) return;
		setBusy(true);
		try {
			const token = await getAccessToken();
			if (!token) throw new Error("Not signed in");
			const saved = await savePermissionsMatrix({ data: {
				accessToken: token,
				matrix
			} });
			setMatrix(saved);
			toast.success("Permissions saved");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Save failed");
		} finally {
			setBusy(false);
		}
	}
	if (loading) return /* @__PURE__ */ jsx("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading permissions…"
	});
	if (!matrix) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-extrabold",
				children: "Permissions"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Control which admin pages each staff role can use"
			})] }), /* @__PURE__ */ jsx("button", {
				type: "button",
				disabled: busy,
				onClick: () => void save(),
				className: "rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60",
				children: busy ? "Saving…" : "Save changes"
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm",
			children: /* @__PURE__ */ jsxs("table", {
				className: "w-full min-w-[720px] text-left text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "text-xs uppercase text-muted-foreground",
					children: /* @__PURE__ */ jsxs("tr", { children: [/* @__PURE__ */ jsx("th", {
						className: "pb-3 font-semibold",
						children: "Permission"
					}), STAFF_ROLES.map((role) => /* @__PURE__ */ jsx("th", {
						className: "pb-3 text-center font-semibold",
						children: role.replace("_", " ")
					}, role))] })
				}), /* @__PURE__ */ jsx("tbody", { children: ALL_PERMISSIONS.map((permission) => /* @__PURE__ */ jsxs("tr", {
					className: "border-t border-border",
					children: [/* @__PURE__ */ jsxs("td", {
						className: "py-3",
						children: [/* @__PURE__ */ jsx("p", {
							className: "font-semibold",
							children: PERMISSION_LABELS[permission]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: permission
						})]
					}), STAFF_ROLES.map((role) => /* @__PURE__ */ jsx("td", {
						className: "py-3 text-center",
						children: /* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: matrix[role][permission],
							disabled: role === "super_admin",
							onChange: () => toggle(role, permission),
							className: "h-4 w-4 accent-primary"
						})
					}, role))]
				}, permission)) })]
			})
		})]
	});
}
//#endregion
export { AdminPermissions as component };
