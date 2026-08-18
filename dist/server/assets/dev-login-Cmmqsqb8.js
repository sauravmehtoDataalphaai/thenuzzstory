//#region src/lib/admin/dev-login.ts
/** Temporary admin demo login — remove or disable before production. */
var DEV_ADMIN_EMAIL = "admin@gmail.com";
var DEV_ADMIN_OTP = "256868";
function isDevAdminEmail(email) {
	return email.trim().toLowerCase() === DEV_ADMIN_EMAIL;
}
function isDevAdminOtp(code) {
	return code.trim() === DEV_ADMIN_OTP;
}
//#endregion
export { isDevAdminOtp as i, DEV_ADMIN_OTP as n, isDevAdminEmail as r, DEV_ADMIN_EMAIL as t };
