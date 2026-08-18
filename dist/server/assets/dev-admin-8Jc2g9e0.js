import { t as createServerFn } from "../server.js";
import { i as isDevAdminOtp, n as DEV_ADMIN_OTP, r as isDevAdminEmail, t as DEV_ADMIN_EMAIL } from "./dev-login-Cmmqsqb8.js";
import { n as createServerRpc, t as createServiceSupabase } from "./supabase-BNLNooLQ.js";
//#region src/server/dev-admin.ts?tss-serverfn-split
/**
* Dev-only admin login: admin@gmail.com + fixed OTP → real Supabase session.
* Ensures auth user + profiles.role = super_admin.
*/
var verifyDevAdminLogin_createServerFn_handler = createServerRpc({
	id: "76aa430e79abe3487ee16fdf661ba7f20ff81f55c369f56f1d13a27d4cf570da",
	name: "verifyDevAdminLogin",
	filename: "src/server/dev-admin.ts"
}, (opts) => verifyDevAdminLogin.__executeServer(opts));
var verifyDevAdminLogin = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(verifyDevAdminLogin_createServerFn_handler, async ({ data }) => {
	if (!isDevAdminEmail(data.email) || !isDevAdminOtp(data.code)) throw new Error("Invalid email or OTP");
	const admin = createServiceSupabase();
	const email = DEV_ADMIN_EMAIL;
	let userId = null;
	const { data: listed } = await admin.auth.admin.listUsers({
		page: 1,
		perPage: 200
	});
	const existing = listed?.users?.find((u) => u.email?.toLowerCase() === email);
	if (existing) userId = existing.id;
	else {
		const { data: created, error: createError } = await admin.auth.admin.createUser({
			email,
			email_confirm: true,
			user_metadata: { full_name: "Admin" }
		});
		if (createError || !created.user) throw new Error(createError?.message ?? "Could not create admin user");
		userId = created.user.id;
	}
	const { error: upsertError } = await admin.from("profiles").upsert({
		id: userId,
		email,
		name: "Admin",
		phone: "",
		role: "super_admin",
		is_active: true,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "id" });
	if (upsertError) throw upsertError;
	const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
		type: "magiclink",
		email
	});
	if (linkError || !linkData?.properties?.email_otp) throw new Error("Could not start admin session");
	const { data: sessionData, error: sessionError } = await admin.auth.verifyOtp({
		email,
		token: linkData.properties.email_otp,
		type: "email"
	});
	if (sessionError || !sessionData.session) throw new Error("Could not sign in admin");
	return {
		access_token: sessionData.session.access_token,
		refresh_token: sessionData.session.refresh_token,
		userId,
		email,
		note: `Dev OTP is always ${DEV_ADMIN_OTP}`
	};
});
//#endregion
export { verifyDevAdminLogin_createServerFn_handler };
