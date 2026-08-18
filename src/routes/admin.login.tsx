import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  applySupabaseSession,
  sendEmailOtp,
  verifyEmailOtp,
  fetchProfile,
  upsertProfile,
  profileToAppUser,
} from "@/lib/auth";
import { isStaffRole } from "@/lib/admin/roles";
import {
  DEV_ADMIN_EMAIL,
  DEV_ADMIN_OTP,
  isDevAdminEmail,
} from "@/lib/admin/dev-login";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useStore } from "@/store/StoreContext";
import { verifyDevAdminLogin } from "@/server/dev-admin";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { setUserFromAuth, refreshUser } = useStore();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [email, setEmail] = useState(DEV_ADMIN_EMAIL);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendOtp() {
    if (!isSupabaseConfigured) {
      toast.error("Supabase is not configured");
      return;
    }
    setBusy(true);
    try {
      if (isDevAdminEmail(email)) {
        setStep("otp");
        toast.success("Dev admin OTP ready", {
          description: `Use OTP ${DEV_ADMIN_OTP} (no email sent)`,
        });
        return;
      }

      const { error } = await sendEmailOtp({ email, createUser: false });
      if (error) throw error;
      setStep("otp");
      toast.success("OTP sent", { description: `Check ${email}` });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setBusy(false);
    }
  }

  async function confirmOtp() {
    setBusy(true);
    try {
      if (isDevAdminEmail(email)) {
        const result = await verifyDevAdminLogin({
          data: { email, code: otp },
        });
        const { error: sessionError } = await applySupabaseSession({
          access_token: result.access_token,
          refresh_token: result.refresh_token,
        });
        if (sessionError) throw sessionError;

        const profile = await fetchProfile(result.userId);
        if (!profile || !isStaffRole(profile.role)) {
          throw new Error("Admin profile missing staff role");
        }
        setUserFromAuth(profileToAppUser(profile));
        await refreshUser();
        toast.success("Welcome to admin");
        navigate({ to: "/admin/dashboard" });
        return;
      }

      const { data, error } = await verifyEmailOtp(email, otp, { isSignup: false });
      if (error) throw error;
      const authUser = data?.user;
      if (!authUser) throw new Error("Verification failed");

      let profile = await fetchProfile(authUser.id);
      if (!profile) {
        await upsertProfile({
          id: authUser.id,
          name: authUser.email?.split("@")[0] || "Admin",
          email: authUser.email ?? email,
          phone: "",
          loyaltyPoints: 0,
          role: "customer",
        });
        profile = await fetchProfile(authUser.id);
      }

      if (!profile || profile.is_active === false || !isStaffRole(profile.role)) {
        toast.error("This account is not an admin. Ask a super_admin to grant access.");
        return;
      }

      setUserFromAuth(profileToAppUser(profile));
      await refreshUser();
      toast.success("Welcome to admin");
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f6f4ef] px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Staff only</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold">Admin login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === "otp"
            ? isDevAdminEmail(email)
              ? `Dev mode: enter OTP ${DEV_ADMIN_OTP}`
              : `Enter the OTP sent to ${email}`
            : "Sign in with your staff email. No password — email OTP only."}
        </p>

        {step === "form" ? (
          <form
            className="mt-5 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              void sendOtp();
            }}
          >
            <label className="text-sm">
              <span className="text-xs font-semibold text-muted-foreground">Staff email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send OTP"}
            </button>
          </form>
        ) : (
          <form
            className="mt-5 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              void confirmOtp();
            }}
          >
            <label className="text-sm">
              <span className="text-xs font-semibold text-muted-foreground">6-digit OTP</span>
              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-center text-lg tracking-[0.4em] outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              disabled={busy || otp.length < 6}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Verifying…" : "Enter admin"}
            </button>
            <button
              type="button"
              className="text-sm text-muted-foreground"
              onClick={() => {
                setStep("form");
                setOtp("");
              }}
            >
              Change email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
