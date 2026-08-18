import { createServerFn } from "@tanstack/react-start";
import {
  DEV_ADMIN_EMAIL,
  DEV_ADMIN_OTP,
  isDevAdminEmail,
  isDevAdminOtp,
} from "@/lib/admin/dev-login";
import { createServiceSupabase } from "@/server/supabase";

/**
 * Dev-only admin login: admin@gmail.com + fixed OTP → real Supabase session.
 * Ensures auth user + profiles.role = super_admin.
 */
export const verifyDevAdminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; code: string }) => data)
  .handler(async ({ data }) => {
    if (!isDevAdminEmail(data.email) || !isDevAdminOtp(data.code)) {
      throw new Error("Invalid email or OTP");
    }

    const admin = createServiceSupabase();
    const email = DEV_ADMIN_EMAIL;

    // Find existing user by listing (email filter) or create
    let userId: string | null = null;
    const { data: listed } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = listed?.users?.find((u) => u.email?.toLowerCase() === email);
    if (existing) {
      userId = existing.id;
    } else {
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: "Admin" },
      });
      if (createError || !created.user) {
        throw new Error(createError?.message ?? "Could not create admin user");
      }
      userId = created.user.id;
    }

    // Promote to super_admin (profile may auto-create via trigger)
    const { error: upsertError } = await admin.from("profiles").upsert(
      {
        id: userId,
        email,
        name: "Admin",
        phone: "",
        role: "super_admin",
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (upsertError) throw upsertError;

    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkError || !linkData?.properties?.email_otp) {
      throw new Error("Could not start admin session");
    }

    const { data: sessionData, error: sessionError } = await admin.auth.verifyOtp({
      email,
      token: linkData.properties.email_otp,
      type: "email",
    });
    if (sessionError || !sessionData.session) {
      throw new Error("Could not sign in admin");
    }

    return {
      access_token: sessionData.session.access_token,
      refresh_token: sessionData.session.refresh_token,
      userId,
      email,
      note: `Dev OTP is always ${DEV_ADMIN_OTP}`,
    };
  });
