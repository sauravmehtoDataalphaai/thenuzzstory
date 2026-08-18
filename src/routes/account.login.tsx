import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { applySupabaseSession, profileToAppUser, fetchProfile } from "@/lib/auth";
import { formatPhoneDisplay, isValidPhone } from "@/lib/phone";
import { useStore } from "@/store/StoreContext";
import {
  startEmailLogin,
  startEmailSignup,
  startPhoneLogin,
  verifyEmailLogin,
  verifyEmailSignup,
  verifyPhoneLogin,
} from "@/server/custom-auth";

export const Route = createFileRoute("/account/login")({
  component: Login,
});

type Step = "form" | "otp";
type LoginMethod = "email" | "phone";

function Login() {
  const { user, setUserFromAuth, refreshUser, isSupabaseConfigured } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [step, setStep] = useState<Step>("form");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  if (user) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8">
        <h1 className="font-display text-2xl font-extrabold">You're signed in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as {user.name} · {user.email}
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/account/profile" })}
          className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Go to profile
        </button>
      </div>
    );
  }

  const otpTargetLabel =
    mode === "signup" || loginMethod === "email" ? email : formatPhoneDisplay(phone);

  async function sendOtp() {
    if (!isSupabaseConfigured) {
      toast.error("Add your Supabase URL and anon key to .env first");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!isValidPhone(phone)) {
          throw new Error("Enter a valid 10-digit phone number");
        }
        const result = await startEmailSignup({ data: { email, phone, name } });
        setStep("otp");
        if (result.devOtp) {
          setDevOtpHint(result.devOtp);
          setOtp(result.devOtp);
          toast.success(`Dev OTP: ${result.devOtp}`, {
            description: "Prefilled for local testing — remove before production",
          });
        } else {
          setDevOtpHint(null);
          toast.success("OTP sent to your email");
        }
        return;
      }

      if (loginMethod === "email") {
        const result = await startEmailLogin({ data: { email } });
        setStep("otp");
        if (result.devOtp) {
          setDevOtpHint(result.devOtp);
          setOtp(result.devOtp);
          toast.success(`Dev OTP: ${result.devOtp}`, {
            description: "Prefilled for local testing — remove before production",
          });
        } else {
          setDevOtpHint(null);
          toast.success("OTP sent to your email");
        }
        return;
      }

      if (!isValidPhone(phone)) {
        throw new Error("Enter a valid 10-digit phone number");
      }
      const result = await startPhoneLogin({ data: { phone } });
      setStep("otp");
      if (result.devOtp) {
        setDevOtpHint(result.devOtp);
        setOtp(result.devOtp);
        toast.success(`Dev OTP: ${result.devOtp}`, {
          description: "Prefilled for local testing — remove before production",
        });
      } else {
        setDevOtpHint(null);
        toast.success("OTP sent via SMS");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setBusy(false);
    }
  }

  async function finishWithSession(result: {
    access_token: string;
    refresh_token: string;
    userId: string;
  }, successMessage: string) {
    const { error: sessionError } = await applySupabaseSession({
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    });
    if (sessionError) throw sessionError;

    const profile = await fetchProfile(result.userId);
    if (profile) setUserFromAuth(profileToAppUser(profile));
    await refreshUser();
    toast.success(successMessage);
    navigate({ to: "/account/profile" });
  }

  async function confirmOtp() {
    setBusy(true);
    try {
      if (mode === "signup") {
        const result = await verifyEmailSignup({
          data: { email, phone, name, code: otp },
        });
        await finishWithSession(result, "Signed up successfully · +100 loyalty points");
        return;
      }

      if (loginMethod === "phone") {
        const result = await verifyPhoneLogin({ data: { phone, code: otp } });
        await finishWithSession(result, "Welcome back");
        return;
      }

      const result = await verifyEmailLogin({ data: { email, code: otp } });
      await finishWithSession(result, "Welcome back");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setBusy(false);
    }
  }

  function resetFlow() {
    setStep("form");
    setOtp("");
    setDevOtpHint(null);
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-8">
      <div className="flex gap-2 rounded-xl bg-secondary p-1">
        {(["signup", "login"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              resetFlow();
            }}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold ${
              mode === m ? "bg-card shadow-sm" : "text-muted-foreground"
            }`}
          >
            {m === "signup" ? "Sign up" : "Login"}
          </button>
        ))}
      </div>

      <h1 className="mt-5 font-display text-xl font-extrabold sm:mt-6 sm:text-2xl">
        {step === "otp" ? "Enter OTP" : mode === "signup" ? "Join The Nuzz Story" : "Welcome back"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {step === "otp"
          ? `Enter the OTP for ${otpTargetLabel}${devOtpHint ? ` · Dev OTP: ${devOtpHint}` : ""}.`
          : mode === "signup"
            ? "We'll send an email OTP. Your phone is saved for future SMS login."
            : "Log in with email or phone — one OTP on that channel."}
      </p>

      {step === "form" ? (
        <form
          className="mt-5 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void sendOtp();
          }}
        >
          {mode === "signup" ? (
            <>
              <label className="text-sm">
                <span className="text-xs font-semibold text-muted-foreground">Full name</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="text-sm">
                <span className="text-xs font-semibold text-muted-foreground">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="text-sm">
                <span className="text-xs font-semibold text-muted-foreground">Phone number</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send email OTP"}
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
                <button
                  type="button"
                  onClick={() => setLoginMethod("email")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${
                    loginMethod === "email" ? "bg-card shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Mail size={16} /> Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("phone")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${
                    loginMethod === "phone" ? "bg-card shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Phone size={16} /> Phone
                </button>
              </div>

              {loginMethod === "email" ? (
                <label className="text-sm">
                  <span className="text-xs font-semibold text-muted-foreground">Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
              ) : (
                <label className="text-sm">
                  <span className="text-xs font-semibold text-muted-foreground">Phone number</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
              )}

              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow disabled:opacity-60"
              >
                {busy
                  ? "Sending…"
                  : loginMethod === "email"
                    ? "Send email OTP"
                    : "Send SMS OTP"}
              </button>
            </>
          )}
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
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-center text-lg tracking-[0.4em] outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            disabled={busy || otp.length < 6}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow disabled:opacity-60"
          >
            {busy ? "Verifying…" : mode === "signup" ? "Verify & sign up" : "Verify & login"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void sendOtp()}
            className="text-sm font-semibold text-primary"
          >
            Resend OTP
          </button>
          <button type="button" onClick={resetFlow} className="text-sm text-muted-foreground">
            {mode === "signup" || loginMethod === "email" ? "Change email" : "Change phone"}
          </button>
        </form>
      )}
    </div>
  );
}
