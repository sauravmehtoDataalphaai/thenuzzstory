/** Logs OTP like local dev. No third-party email service. */
export async function sendEmailOtpMessage(email: string, code: string): Promise<void> {
  console.log(`\n[EMAIL MOCK] OTP for ${email}: ${code}\n`);
}
