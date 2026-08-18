import { createHash, randomInt } from "node:crypto";

const OTP_LENGTH = 6;
const MAX_VERIFY_ATTEMPTS = 5;

export { MAX_VERIFY_ATTEMPTS };

function pepper(): string {
  return (
    process.env["OTP_PEPPER"] ||
    process.env["SUPABASE_SECRET_KEY"] ||
    "dev-otp-pepper-change-in-production"
  );
}

export function generateOtpCode(): string {
  return String(randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
}

export function hashOtp(code: string): string {
  return createHash("sha256").update(`${code.trim()}:${pepper()}`).digest("hex");
}

export function verifyOtpHash(code: string, hash: string): boolean {
  return hashOtp(code) === hash;
}

export function otpExpiresAt(minutes = 10): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}
