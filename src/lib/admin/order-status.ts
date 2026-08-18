/** Customer-facing delivery pipeline (after admin confirms). */
export const TRACKING_STEPS = [
  { status: "Order placed", title: "Order placed", description: "We've received your order and payment." },
  { status: "Packed", title: "Packed", description: "Picked and packed at our New Delhi warehouse." },
  { status: "Shipped", title: "Shipped", description: "Handed to our delivery partner." },
  { status: "Out for delivery", title: "Out for delivery", description: "Arriving today between 10 AM and 6 PM." },
  { status: "Delivered", title: "Delivered", description: "Enjoy! Don't forget to rate your products." },
] as const;

export const TRACKING_STATUSES = TRACKING_STEPS.map((s) => s.status);

/** All statuses admins can set (plus pre-confirm and cancelled). */
export const ADMIN_ORDER_STATUSES = [
  "Processing",
  ...TRACKING_STATUSES,
  "Cancelled",
] as const;

export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export function isAdminOrderStatus(value: string): value is AdminOrderStatus {
  return (ADMIN_ORDER_STATUSES as readonly string[]).includes(value);
}

export function customerStatusLabel(status: string): string {
  return normalizeOrderStatus(status);
}

const LEGACY_STATUS_MAP: Record<string, string> = {
  Placed: "Order placed",
  "Out for Delivery": "Out for delivery",
};

export function normalizeOrderStatus(status: string): string {
  return LEGACY_STATUS_MAP[status] ?? status;
}

/** -1 = none complete (Processing), 0–4 = step index for tracking UI. */
export function statusToStepIndex(status: string): number {
  const normalized = normalizeOrderStatus(status);
  const idx = TRACKING_STATUSES.indexOf(normalized as (typeof TRACKING_STATUSES)[number]);
  return idx;
}

export function statusBadgeClass(status: string): string {
  const normalized = normalizeOrderStatus(status);
  switch (normalized) {
    case "Delivered":
      return "bg-emerald-100 text-emerald-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    case "Out for delivery":
      return "bg-amber-100 text-amber-900";
    case "Shipped":
      return "bg-sky-100 text-sky-800";
    case "Packed":
      return "bg-violet-100 text-violet-800";
    case "Order placed":
      return "bg-primary-soft text-primary";
    case "Processing":
    default:
      return "bg-sand text-foreground";
  }
}
