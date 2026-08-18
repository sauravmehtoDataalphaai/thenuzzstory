//#region src/lib/admin/order-status.ts
/** Customer-facing delivery pipeline (after admin confirms). */
var TRACKING_STEPS = [
	{
		status: "Order placed",
		title: "Order placed",
		description: "We've received your order and payment."
	},
	{
		status: "Packed",
		title: "Packed",
		description: "Picked and packed at our New Delhi warehouse."
	},
	{
		status: "Shipped",
		title: "Shipped",
		description: "Handed to our delivery partner."
	},
	{
		status: "Out for delivery",
		title: "Out for delivery",
		description: "Arriving today between 10 AM and 6 PM."
	},
	{
		status: "Delivered",
		title: "Delivered",
		description: "Enjoy! Don't forget to rate your products."
	}
];
var TRACKING_STATUSES = TRACKING_STEPS.map((s) => s.status);
/** All statuses admins can set (plus pre-confirm and cancelled). */
var ADMIN_ORDER_STATUSES = [
	"Processing",
	...TRACKING_STATUSES,
	"Cancelled"
];
function isAdminOrderStatus(value) {
	return ADMIN_ORDER_STATUSES.includes(value);
}
function customerStatusLabel(status) {
	return normalizeOrderStatus(status);
}
var LEGACY_STATUS_MAP = {
	Placed: "Order placed",
	"Out for Delivery": "Out for delivery"
};
function normalizeOrderStatus(status) {
	return LEGACY_STATUS_MAP[status] ?? status;
}
/** -1 = none complete (Processing), 0–4 = step index for tracking UI. */
function statusToStepIndex(status) {
	const normalized = normalizeOrderStatus(status);
	return TRACKING_STATUSES.indexOf(normalized);
}
function statusBadgeClass(status) {
	switch (normalizeOrderStatus(status)) {
		case "Delivered": return "bg-emerald-100 text-emerald-800";
		case "Cancelled": return "bg-red-100 text-red-800";
		case "Out for delivery": return "bg-amber-100 text-amber-900";
		case "Shipped": return "bg-sky-100 text-sky-800";
		case "Packed": return "bg-violet-100 text-violet-800";
		case "Order placed": return "bg-primary-soft text-primary";
		default: return "bg-sand text-foreground";
	}
}
//#endregion
export { isAdminOrderStatus as a, customerStatusLabel as i, TRACKING_STATUSES as n, statusBadgeClass as o, TRACKING_STEPS as r, statusToStepIndex as s, ADMIN_ORDER_STATUSES as t };
