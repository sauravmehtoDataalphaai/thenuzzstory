import { formatPhoneDisplay } from "@/lib/phone";

export type SmsSender = (phone: string, code: string) => Promise<void>;

/** Logs OTP like local dev. No third-party SMS service. */
export async function sendSms(phone: string, code: string): Promise<void> {
  console.log(`\n[SMS MOCK] OTP for ${formatPhoneDisplay(phone)}: ${code}\n`);
}
