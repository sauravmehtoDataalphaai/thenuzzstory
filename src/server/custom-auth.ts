import { createServerFn } from "@tanstack/react-start";
import { normalizePhone } from "@/lib/phone";
import {
  MAX_VERIFY_ATTEMPTS,
  generateOtpCode,
  hashOtp,
  otpExpiresAt,
  verifyOtpHash,
} from "@/lib/otp";
import { sendEmailOtpMessage } from "@/lib/mailer";
import { sendSms } from "@/lib/sms";
import { createServiceSupabase } from "@/server/supabase";
import { WELCOME_LOYALTY_POINTS } from "@/lib/loyalty";

const MAX_SENDS_PER_WINDOW = 3;
const SEND_WINDOW_MS = 10 * 60 * 1000;

/** Return OTP in the API so signup/login works the same on Netlify as locally. */
function withDevOtp<T extends Record<string, unknown>>(
  payload: T,
  code: string,
): T & { devOtp?: string } {
  return { ...payload, devOtp: code };
}

async function countRecentOtpSends(
  targetType: "phone" | "email",
  targetValue: string,
): Promise<number> {
  const admin = createServiceSupabase();
  const since = new Date(Date.now() - SEND_WINDOW_MS).toISOString();
  const { count, error } = await admin
    .from("otp_requests")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_value", targetValue)
    .gte("created_at", since);
  if (error) throw error;
  return count ?? 0;
}

async function findProfileByEmail(email: string) {
  const admin = createServiceSupabase();
  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .ilike("email", email.trim().toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function findProfileByPhone(phone: string) {
  const admin = createServiceSupabase();
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .eq("phone", normalized)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  const admin = createServiceSupabase();
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const found = data?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  return found?.id ?? null;
}

async function createSessionForEmail(email: string) {
  const admin = createServiceSupabase();
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkError || !linkData?.properties?.email_otp) {
    throw new Error("Could not start session. Please try again.");
  }

  const { data: sessionData, error: sessionError } = await admin.auth.verifyOtp({
    email,
    token: linkData.properties.email_otp,
    type: "email",
  });
  if (sessionError || !sessionData.session) {
    throw new Error("Could not sign you in. Please try again.");
  }

  return {
    access_token: sessionData.session.access_token,
    refresh_token: sessionData.session.refresh_token,
    userId: sessionData.user?.id ?? sessionData.session.user.id,
  };
}

async function consumeOtp(params: {
  targetType: "email" | "phone";
  targetValue: string;
  purpose: "signup" | "login";
  code: string;
}) {
  const admin = createServiceSupabase();
  const { data: rows, error } = await admin
    .from("otp_requests")
    .select("*")
    .eq("target_type", params.targetType)
    .eq("target_value", params.targetValue)
    .eq("purpose", params.purpose)
    .eq("is_used", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  const row = rows?.[0];
  if (!row) throw new Error("Invalid or expired OTP. Request a new code.");

  if (row.attempts >= MAX_VERIFY_ATTEMPTS) {
    await admin.from("otp_requests").update({ is_used: true }).eq("id", row.id);
    throw new Error("Too many attempts. Request a new OTP.");
  }

  if (!verifyOtpHash(params.code.trim(), row.otp_hash)) {
    await admin
      .from("otp_requests")
      .update({ attempts: row.attempts + 1 })
      .eq("id", row.id);
    throw new Error("Invalid or expired OTP. Please try again.");
  }

  await admin.from("otp_requests").update({ is_used: true }).eq("id", row.id);
}

async function issueAndSendOtp(params: {
  targetType: "email" | "phone";
  targetValue: string;
  purpose: "signup" | "login";
}) {
  const recent = await countRecentOtpSends(params.targetType, params.targetValue);
  if (recent >= MAX_SENDS_PER_WINDOW) {
    throw new Error("Too many OTP requests. Please wait a few minutes and try again.");
  }

  const code = generateOtpCode();
  const admin = createServiceSupabase();
  const { error } = await admin.from("otp_requests").insert({
    target_type: params.targetType,
    target_value: params.targetValue,
    otp_hash: hashOtp(code),
    purpose: params.purpose,
    expires_at: otpExpiresAt(10),
  });
  if (error) throw error;

  if (params.targetType === "email") {
    await sendEmailOtpMessage(params.targetValue, code);
  } else {
    await sendSms(params.targetValue, code);
  }

  return code;
}

export const validateSignup = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; phone: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const phone = normalizePhone(data.phone);
    if (!phone) throw new Error("Enter a valid 10-digit phone number");

    const [byEmail, byPhone] = await Promise.all([
      findProfileByEmail(email),
      findProfileByPhone(phone),
    ]);

    if (byEmail) throw new Error("An account with this email already exists. Try logging in.");
    if (byPhone) throw new Error("An account with this phone number already exists.");

    return { ok: true as const, phone };
  });

export const checkLoginIdentifier = createServerFn({ method: "POST" })
  .inputValidator((data: { method: "email" | "phone"; value: string }) => data)
  .handler(async ({ data }) => {
    if (data.method === "email") {
      const email = data.value.trim().toLowerCase();
      if (!email.includes("@")) throw new Error("Enter a valid email address");
      const profile = await findProfileByEmail(email);
      if (!profile) {
        throw new Error("No account found. Please sign up first.");
      }
      return { ok: true as const, email: profile.email };
    }

    const phone = normalizePhone(data.value);
    if (!phone) throw new Error("Enter a valid 10-digit phone number");
    const profile = await findProfileByPhone(phone);
    if (!profile) {
      throw new Error("No account found. Please sign up first.");
    }
    return { ok: true as const, phone };
  });

export const startEmailSignup = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; phone: string; name: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const phone = normalizePhone(data.phone);
    if (!phone) throw new Error("Enter a valid 10-digit phone number");
    if (!data.name.trim()) throw new Error("Enter your full name");

    const [byEmail, byPhone] = await Promise.all([
      findProfileByEmail(email),
      findProfileByPhone(phone),
    ]);
    if (byEmail) throw new Error("An account with this email already exists. Try logging in.");
    if (byPhone) throw new Error("An account with this phone number already exists.");

    const code = await issueAndSendOtp({
      targetType: "email",
      targetValue: email,
      purpose: "signup",
    });
    return withDevOtp({ ok: true as const, email, phone }, code);
  });

export const verifyEmailSignup = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { email: string; phone: string; name: string; code: string }) => data,
  )
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const phone = normalizePhone(data.phone);
    if (!phone) throw new Error("Invalid signup request");

    await consumeOtp({
      targetType: "email",
      targetValue: email,
      purpose: "signup",
      code: data.code,
    });

    const admin = createServiceSupabase();
    let userId = await findAuthUserIdByEmail(email);

    if (!userId) {
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          full_name: data.name.trim(),
          phone,
        },
      });
      if (createError || !created.user) {
        throw new Error(createError?.message ?? "Could not create account");
      }
      userId = created.user.id;
    }

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: userId,
        email,
        name: data.name.trim() || email.split("@")[0] || "Pet Parent",
        phone,
        loyalty_points: WELCOME_LOYALTY_POINTS,
        role: "customer",
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (profileError) throw profileError;

    const session = await createSessionForEmail(email);
    return { ...session, userId };
  });

export const startEmailLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    if (!email.includes("@")) throw new Error("Enter a valid email address");

    const profile = await findProfileByEmail(email);
    if (!profile) throw new Error("No account found. Please sign up first.");

    const code = await issueAndSendOtp({
      targetType: "email",
      targetValue: email,
      purpose: "login",
    });
    return withDevOtp({ ok: true as const, email }, code);
  });

export const verifyEmailLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; code: string }) => data)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const profile = await findProfileByEmail(email);
    if (!profile) throw new Error("No account found. Please sign up first.");

    await consumeOtp({
      targetType: "email",
      targetValue: email,
      purpose: "login",
      code: data.code,
    });

    const session = await createSessionForEmail(email);
    return { ...session, userId: profile.id };
  });

export const startPhoneLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { phone: string }) => data)
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) throw new Error("Enter a valid 10-digit phone number");

    const profile = await findProfileByPhone(phone);
    if (!profile) {
      throw new Error("No account found. Please sign up first.");
    }

    const code = await issueAndSendOtp({
      targetType: "phone",
      targetValue: phone,
      purpose: "login",
    });
    return withDevOtp({ ok: true as const, phone }, code);
  });

export const verifyPhoneLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { phone: string; code: string }) => data)
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) throw new Error("Invalid verification request");

    const profile = await findProfileByPhone(phone);
    if (!profile?.email) {
      throw new Error("No account found. Please sign up first.");
    }

    await consumeOtp({
      targetType: "phone",
      targetValue: phone,
      purpose: "login",
      code: data.code,
    });

    const session = await createSessionForEmail(profile.email);
    return { ...session, userId: profile.id };
  });
