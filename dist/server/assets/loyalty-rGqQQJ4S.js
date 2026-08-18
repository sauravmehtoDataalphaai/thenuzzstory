/** Every order earns a flat Paw Points bonus. */
function loyaltyPointsForOrder(_orderTotal) {
	return 50;
}
function profileLoyaltyPoints(profile) {
	return Math.max(0, profile?.loyalty_points ?? 0);
}
/** Convert points to rupees (floored to ₹10 blocks). */
function rupeesFromPoints(points) {
	if (points < 100) return 0;
	return Math.floor(points / 100) * 10;
}
/** Points consumed to get a given rupee discount (₹10 blocks). */
function pointsForRupees(rupees) {
	return Math.floor(Math.max(0, rupees) / 10) * 100;
}
/** Max redeemable rupees given balance and remaining payable amount. */
function maxRedeemRupees(points, payable) {
	return Math.min(rupeesFromPoints(points), Math.max(0, Math.floor(payable / 10) * 10));
}
//#endregion
export { rupeesFromPoints as a, profileLoyaltyPoints as i, maxRedeemRupees as n, pointsForRupees as r, loyaltyPointsForOrder as t };
