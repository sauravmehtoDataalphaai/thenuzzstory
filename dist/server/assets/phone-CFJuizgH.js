//#region src/lib/phone.ts
/** Normalize Indian mobile numbers to 10 digits for storage/lookup. */
function normalizePhone(input) {
	const digits = input.replace(/\D/g, "");
	if (digits.length === 10) return digits;
	if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
	if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
	return null;
}
function isValidPhone(input) {
	return normalizePhone(input) !== null;
}
function formatPhoneDisplay(phone) {
	const n = normalizePhone(phone);
	if (!n) return phone;
	return `+91 ${n.slice(0, 5)} ${n.slice(5)}`;
}
//#endregion
export { isValidPhone as n, normalizePhone as r, formatPhoneDisplay as t };
