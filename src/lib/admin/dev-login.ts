/** Temporary admin demo login — remove or disable before production. */
export const DEV_ADMIN_EMAIL = "admin@gmail.com";
export const DEV_ADMIN_OTP = "256868";

export function isDevAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === DEV_ADMIN_EMAIL;
}

export function isDevAdminOtp(code: string): boolean {
  return code.trim() === DEV_ADMIN_OTP;
}
