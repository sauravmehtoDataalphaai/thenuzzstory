import { t as getAccessToken } from "./session-baWtAfAY.js";
import { o as listAuditLog } from "./catalog-Bypn6n3U.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/admin.audit.tsx?tsr-split=component
function AdminAudit() {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const token = await getAccessToken();
				if (!token) throw new Error("Not signed in");
				const data = await listAuditLog({ data: {
					accessToken: token,
					limit: 150
				} });
				if (!cancelled) setRows(data);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to load audit log");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "font-display text-2xl font-extrabold",
			children: "Audit log"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Recent admin actions across orders, staff, catalog and permissions"
		})] }), /* @__PURE__ */ jsx("div", {
			className: "overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm",
			children: loading ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading audit log…"
			}) : /* @__PURE__ */ jsxs("table", {
				className: "w-full min-w-[880px] text-left text-sm",
				children: [/* @__PURE__ */ jsx("thead", {
					className: "text-xs uppercase text-muted-foreground",
					children: /* @__PURE__ */ jsxs("tr", { children: [
						/* @__PURE__ */ jsx("th", {
							className: "pb-2 font-semibold",
							children: "When"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "pb-2 font-semibold",
							children: "Actor"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "pb-2 font-semibold",
							children: "Action"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "pb-2 font-semibold",
							children: "Entity"
						}),
						/* @__PURE__ */ jsx("th", {
							className: "pb-2 font-semibold",
							children: "Details"
						})
					] })
				}), /* @__PURE__ */ jsx("tbody", { children: rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 5,
					className: "py-8 text-center text-muted-foreground",
					children: "No audit entries yet"
				}) }) : rows.map((row) => /* @__PURE__ */ jsxs("tr", {
					className: "border-t border-border align-top",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "py-3 whitespace-nowrap text-xs text-muted-foreground",
							children: new Date(row.created_at).toLocaleString("en-IN")
						}),
						/* @__PURE__ */ jsx("td", {
							className: "py-3",
							children: /* @__PURE__ */ jsx("p", {
								className: "font-semibold",
								children: row.actor_email || "—"
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "py-3 font-mono text-xs",
							children: row.action
						}),
						/* @__PURE__ */ jsxs("td", {
							className: "py-3 text-xs",
							children: [row.entity_type, row.entity_id ? ` · ${row.entity_id}` : ""]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "py-3 max-w-xs truncate text-xs text-muted-foreground",
							children: Object.keys(row.details ?? {}).length ? JSON.stringify(row.details) : "—"
						})
					]
				}, row.id)) })]
			})
		})]
	});
}
//#endregion
export { AdminAudit as component };
