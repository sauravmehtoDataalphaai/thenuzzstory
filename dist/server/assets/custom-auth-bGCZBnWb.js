import { t as createServerFn } from "../server.js";
import { r as normalizePhone, t as formatPhoneDisplay } from "./phone-CFJuizgH.js";
import { n as createServerRpc, t as createServiceSupabase } from "./supabase-BNLNooLQ.js";
import { createHash, randomInt } from "node:crypto";
//#region src/lib/otp.ts
var OTP_LENGTH = 6;
function pepper() {
	return process.env["OTP_PEPPER"] || process.env["SUPABASE_SECRET_KEY"] || "dev-otp-pepper-change-in-production";
}
function generateOtpCode() {
	return String(randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
}
function hashOtp(code) {
	return createHash("sha256").update(`${code.trim()}:${pepper()}`).digest("hex");
}
function verifyOtpHash(code, hash) {
	return hashOtp(code) === hash;
}
function otpExpiresAt(minutes = 10) {
	return new Date(Date.now() + minutes * 60 * 1e3).toISOString();
}
//#endregion
//#region src/lib/mailer.ts
/** Logs OTP like local dev. No third-party email service. */
async function sendEmailOtpMessage(email, code) {
	console.log(`\n[EMAIL MOCK] OTP for ${email}: ${code}\n`);
}
//#endregion
//#region src/lib/sms.ts
/** Logs OTP like local dev. No third-party SMS service. */
async function sendSms(phone, code) {
	console.log(`\n[SMS MOCK] OTP for ${formatPhoneDisplay(phone)}: ${code}\n`);
}
//#endregion
//#region src/server/custom-auth.ts?tss-serverfn-split
var MAX_SENDS_PER_WINDOW = 3;
var SEND_WINDOW_MS = 6e5;
/** Return OTP in the API so signup/login works the same on Netlify as locally. */
function withDevOtp(payload, code) {
	return {
		...payload,
		devOtp: code
	};
}
async function countRecentOtpSends(targetType, targetValue) {
	const admin = createServiceSupabase();
	const since = (/* @__PURE__ */ new Date(Date.now() - SEND_WINDOW_MS)).toISOString();
	const { count, error } = await admin.from("otp_requests").select("*", {
		count: "exact",
		head: true
	}).eq("target_type", targetType).eq("target_value", targetValue).gte("created_at", since);
	if (error) throw error;
	return count ?? 0;
}
async function findProfileByEmail(email) {
	const { data, error } = await createServiceSupabase().from("profiles").select("*").ilike("email", email.trim().toLowerCase()).maybeSingle();
	if (error) throw error;
	return data;
}
async function findProfileByPhone(phone) {
	const admin = createServiceSupabase();
	const normalized = normalizePhone(phone);
	if (!normalized) return null;
	const { data, error } = await admin.from("profiles").select("*").eq("phone", normalized).maybeSingle();
	if (error) throw error;
	return data;
}
async function findAuthUserIdByEmail(email) {
	const { data } = await createServiceSupabase().auth.admin.listUsers({
		page: 1,
		perPage: 200
	});
	return (data?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase()))?.id ?? null;
}
async function createSessionForEmail(email) {
	const admin = createServiceSupabase();
	const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
		type: "magiclink",
		email
	});
	if (linkError || !linkData?.properties?.email_otp) throw new Error("Could not start session. Please try again.");
	const { data: sessionData, error: sessionError } = await admin.auth.verifyOtp({
		email,
		token: linkData.properties.email_otp,
		type: "email"
	});
	if (sessionError || !sessionData.session) throw new Error("Could not sign you in. Please try again.");
	return {
		access_token: sessionData.session.access_token,
		refresh_token: sessionData.session.refresh_token,
		userId: sessionData.user?.id ?? sessionData.session.user.id
	};
}
async function consumeOtp(params) {
	const admin = createServiceSupabase();
	const { data: rows, error } = await admin.from("otp_requests").select("*").eq("target_type", params.targetType).eq("target_value", params.targetValue).eq("purpose", params.purpose).eq("is_used", false).gt("expires_at", (/* @__PURE__ */ new Date()).toISOString()).order("created_at", { ascending: false }).limit(1);
	if (error) throw error;
	const row = rows?.[0];
	if (!row) throw new Error("Invalid or expired OTP. Request a new code.");
	if (row.attempts >= 5) {
		await admin.from("otp_requests").update({ is_used: true }).eq("id", row.id);
		throw new Error("Too many attempts. Request a new OTP.");
	}
	if (!verifyOtpHash(params.code.trim(), row.otp_hash)) {
		await admin.from("otp_requests").update({ attempts: row.attempts + 1 }).eq("id", row.id);
		throw new Error("Invalid or expired OTP. Please try again.");
	}
	await admin.from("otp_requests").update({ is_used: true }).eq("id", row.id);
}
async function issueAndSendOtp(params) {
	if (await countRecentOtpSends(params.targetType, params.targetValue) >= MAX_SENDS_PER_WINDOW) throw new Error("Too many OTP requests. Please wait a few minutes and try again.");
	const code = generateOtpCode();
	const { error } = await createServiceSupabase().from("otp_requests").insert({
		target_type: params.targetType,
		target_value: params.targetValue,
		otp_hash: hashOtp(code),
		purpose: params.purpose,
		expires_at: otpExpiresAt(10)
	});
	if (error) throw error;
	if (params.targetType === "email") await sendEmailOtpMessage(params.targetValue, code);
	else await sendSms(params.targetValue, code);
	return code;
}
var validateSignup_createServerFn_handler = createServerRpc({
	id: "51333916b8cbc887baca5c890374b8ed23ef5bbfed8f3af789033ac6d6b14458",
	name: "validateSignup",
	filename: "src/server/custom-auth.ts"
}, (opts) => validateSignup.__executeServer(opts));
var validateSignup = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(validateSignup_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	const phone = normalizePhone(data.phone);
	if (!phone) throw new Error("Enter a valid 10-digit phone number");
	const [byEmail, byPhone] = await Promise.all([findProfileByEmail(email), findProfileByPhone(phone)]);
	if (byEmail) throw new Error("An account with this email already exists. Try logging in.");
	if (byPhone) throw new Error("An account with this phone number already exists.");
	return {
		ok: true,
		phone
	};
});
var checkLoginIdentifier_createServerFn_handler = createServerRpc({
	id: "1031b6a6156af529eb96ab8cc6c3ff2c6dcbf6bfb0a1f4b686a6ceba4ff4b55e",
	name: "checkLoginIdentifier",
	filename: "src/server/custom-auth.ts"
}, (opts) => checkLoginIdentifier.__executeServer(opts));
var checkLoginIdentifier = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(checkLoginIdentifier_createServerFn_handler, async ({ data }) => {
	if (data.method === "email") {
		const email = data.value.trim().toLowerCase();
		if (!email.includes("@")) throw new Error("Enter a valid email address");
		const profile = await findProfileByEmail(email);
		if (!profile) throw new Error("No account found. Please sign up first.");
		return {
			ok: true,
			email: profile.email
		};
	}
	const phone = normalizePhone(data.value);
	if (!phone) throw new Error("Enter a valid 10-digit phone number");
	if (!await findProfileByPhone(phone)) throw new Error("No account found. Please sign up first.");
	return {
		ok: true,
		phone
	};
});
var startEmailSignup_createServerFn_handler = createServerRpc({
	id: "19193ef29ac313da8a4d566c443c6d2d4b6718a2ea4bcd8f125a17ebfdd59a5b",
	name: "startEmailSignup",
	filename: "src/server/custom-auth.ts"
}, (opts) => startEmailSignup.__executeServer(opts));
var startEmailSignup = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(startEmailSignup_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	const phone = normalizePhone(data.phone);
	if (!phone) throw new Error("Enter a valid 10-digit phone number");
	if (!data.name.trim()) throw new Error("Enter your full name");
	const [byEmail, byPhone] = await Promise.all([findProfileByEmail(email), findProfileByPhone(phone)]);
	if (byEmail) throw new Error("An account with this email already exists. Try logging in.");
	if (byPhone) throw new Error("An account with this phone number already exists.");
	const code = await issueAndSendOtp({
		targetType: "email",
		targetValue: email,
		purpose: "signup"
	});
	return withDevOtp({
		ok: true,
		email,
		phone
	}, code);
});
var verifyEmailSignup_createServerFn_handler = createServerRpc({
	id: "504bdfbc15aa4adebef07904a4271120e93a85b2f7ee72bfc4dc8edbd2509f64",
	name: "verifyEmailSignup",
	filename: "src/server/custom-auth.ts"
}, (opts) => verifyEmailSignup.__executeServer(opts));
var verifyEmailSignup = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(verifyEmailSignup_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	const phone = normalizePhone(data.phone);
	if (!phone) throw new Error("Invalid signup request");
	await consumeOtp({
		targetType: "email",
		targetValue: email,
		purpose: "signup",
		code: data.code
	});
	const admin = createServiceSupabase();
	let userId = await findAuthUserIdByEmail(email);
	if (!userId) {
		const { data: created, error: createError } = await admin.auth.admin.createUser({
			email,
			email_confirm: true,
			user_metadata: {
				full_name: data.name.trim(),
				phone
			}
		});
		if (createError || !created.user) throw new Error(createError?.message ?? "Could not create account");
		userId = created.user.id;
	}
	const { error: profileError } = await admin.from("profiles").upsert({
		id: userId,
		email,
		name: data.name.trim() || email.split("@")[0] || "Pet Parent",
		phone,
		loyalty_points: 100,
		role: "customer",
		is_active: true,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "id" });
	if (profileError) throw profileError;
	return {
		...await createSessionForEmail(email),
		userId
	};
});
var startEmailLogin_createServerFn_handler = createServerRpc({
	id: "2fdaaa87f4c1bbbb0c334beea72dce018724f6c4f12898deac804e33fb312ad6",
	name: "startEmailLogin",
	filename: "src/server/custom-auth.ts"
}, (opts) => startEmailLogin.__executeServer(opts));
var startEmailLogin = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(startEmailLogin_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	if (!email.includes("@")) throw new Error("Enter a valid email address");
	if (!await findProfileByEmail(email)) throw new Error("No account found. Please sign up first.");
	const code = await issueAndSendOtp({
		targetType: "email",
		targetValue: email,
		purpose: "login"
	});
	return withDevOtp({
		ok: true,
		email
	}, code);
});
var verifyEmailLogin_createServerFn_handler = createServerRpc({
	id: "7d88c2b36d2a9457f6a70d9c760f3f2feb8dae795d360c67de4232cf16aaeb92",
	name: "verifyEmailLogin",
	filename: "src/server/custom-auth.ts"
}, (opts) => verifyEmailLogin.__executeServer(opts));
var verifyEmailLogin = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(verifyEmailLogin_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	const profile = await findProfileByEmail(email);
	if (!profile) throw new Error("No account found. Please sign up first.");
	await consumeOtp({
		targetType: "email",
		targetValue: email,
		purpose: "login",
		code: data.code
	});
	return {
		...await createSessionForEmail(email),
		userId: profile.id
	};
});
var startPhoneLogin_createServerFn_handler = createServerRpc({
	id: "92d652fd8652a98bf0248244122b6de376d97792b8c35794d6d0c4d73137b1e1",
	name: "startPhoneLogin",
	filename: "src/server/custom-auth.ts"
}, (opts) => startPhoneLogin.__executeServer(opts));
var startPhoneLogin = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(startPhoneLogin_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	if (!phone) throw new Error("Enter a valid 10-digit phone number");
	if (!await findProfileByPhone(phone)) throw new Error("No account found. Please sign up first.");
	const code = await issueAndSendOtp({
		targetType: "phone",
		targetValue: phone,
		purpose: "login"
	});
	return withDevOtp({
		ok: true,
		phone
	}, code);
});
var verifyPhoneLogin_createServerFn_handler = createServerRpc({
	id: "8de23f63be456b522d70b512c214cb0d577d13c34e720b231674767b0c33574c",
	name: "verifyPhoneLogin",
	filename: "src/server/custom-auth.ts"
}, (opts) => verifyPhoneLogin.__executeServer(opts));
var verifyPhoneLogin = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(verifyPhoneLogin_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	if (!phone) throw new Error("Invalid verification request");
	const profile = await findProfileByPhone(phone);
	if (!profile?.email) throw new Error("No account found. Please sign up first.");
	await consumeOtp({
		targetType: "phone",
		targetValue: phone,
		purpose: "login",
		code: data.code
	});
	return {
		...await createSessionForEmail(profile.email),
		userId: profile.id
	};
});
//#endregion
export { checkLoginIdentifier_createServerFn_handler, startEmailLogin_createServerFn_handler, startEmailSignup_createServerFn_handler, startPhoneLogin_createServerFn_handler, validateSignup_createServerFn_handler, verifyEmailLogin_createServerFn_handler, verifyEmailSignup_createServerFn_handler, verifyPhoneLogin_createServerFn_handler };
