import type { Profile } from "@/types/database";

/** Welcome bonus — once per email/account on first profile create */
export const WELCOME_LOYALTY_POINTS = 100;

/** Paw Points earned on every completed order (same as loyalty points) */
export const PAW_POINTS_PER_ORDER = 50;

/** 100 loyalty points = ₹10 (₹0.10 per point) */
export const POINTS_PER_RUPEE_BLOCK = 100;
export const RUPEES_PER_BLOCK = 10;

/** Every order earns a flat Paw Points bonus. */
export function loyaltyPointsForOrder(_orderTotal?: number): number {
  return PAW_POINTS_PER_ORDER;
}

export function profileLoyaltyPoints(profile: Pick<Profile, "loyalty_points"> | null | undefined): number {
  return Math.max(0, profile?.loyalty_points ?? 0);
}

/** Convert points to rupees (floored to ₹10 blocks). */
export function rupeesFromPoints(points: number): number {
  if (points < POINTS_PER_RUPEE_BLOCK) return 0;
  return Math.floor(points / POINTS_PER_RUPEE_BLOCK) * RUPEES_PER_BLOCK;
}

/** Points consumed to get a given rupee discount (₹10 blocks). */
export function pointsForRupees(rupees: number): number {
  const blocks = Math.floor(Math.max(0, rupees) / RUPEES_PER_BLOCK);
  return blocks * POINTS_PER_RUPEE_BLOCK;
}

/** Max redeemable rupees given balance and remaining payable amount. */
export function maxRedeemRupees(points: number, payable: number): number {
  return Math.min(
    rupeesFromPoints(points),
    Math.max(0, Math.floor(payable / RUPEES_PER_BLOCK) * RUPEES_PER_BLOCK),
  );
}
