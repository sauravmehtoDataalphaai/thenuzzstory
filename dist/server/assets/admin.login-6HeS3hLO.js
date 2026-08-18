import { t as createServerFn } from "../server.js";
import { l as isSupabaseConfigured } from "./catalog-db-CghLbik8.js";
import { c as fetchProfile, d as sendEmailOtp, h as verifyEmailOtp, m as upsertProfile, n as applySupabaseSession, u as profileToAppUser } from "./auth-D9i6D0LJ.js";
import { u as useStore } from "./router-Cn9sBPaq.js";
import { t as createSsrRpc } from "./createSsrRpc-BdB2e2iw.js";
import { o as isStaffRole } from "./roles-DGja2QmC.js";
import { n as DEV_ADMIN_OTP, r as isDevAdminEmail, t as DEV_ADMIN_EMAIL } from "./dev-login-Cmmqsqb8.js";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/server/dev-admin.ts
/**
* Dev-only admin login: admin@gmail.com + fixed OTP → real Supabase session.
* Ensures auth user + profiles.role = super_admin.
*/
var verifyDevAdminLogin = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("76aa430e79abe3487ee16fdf661ba7f20ff81f55c369f56f1d13a27d4cf570da"));
//#endregion
//#region src/routes/admin.login.tsx?tsr-split=component
function AdminLogin() {
	const navigate = useNavigate();
	const { setUserFromAuth, refreshUser } = useStore();
	const [step, setStep] = useState("form");
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
				toast.success("Dev admin OTP ready", { description: `Use OTP ${DEV_ADMIN_OTP} (no email sent)` });
				return;
			}
			const { error } = await sendEmailOtp({
				email,
				createUser: false
			});
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
				const result = await verifyDevAdminLogin({ data: {
					email,
					code: otp
				} });
				const { error: sessionError } = await applySupabaseSession({
					access_token: result.access_token,
					refresh_token: result.refresh_token
				});
				if (sessionError) throw sessionError;
				const profile = await fetchProfile(result.userId);
				if (!profile || !isStaffRole(profile.role)) throw new Error("Admin profile missing staff role");
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
					role: "customer"
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
	return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-screen place-items-center bg-[#f6f4ef] px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-xs font-bold uppercase tracking-wide text-primary",
					children: "Staff only"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-2 font-display text-2xl font-extrabold",
					children: "Admin login"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: step === "otp" ? isDevAdminEmail(email) ? `Dev mode: enter OTP ${DEV_ADMIN_OTP}` : `Enter the OTP sent to ${email}` : "Sign in with your staff email. No password — email OTP only."
				}),
				step === "form" ? /* @__PURE__ */ jsxs("form", {
					className: "mt-5 grid gap-4",
					onSubmit: (e) => {
						e.preventDefault();
						sendOtp();
					},
					children: [/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Staff email"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
						})]
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: busy,
						className: "rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60",
						children: busy ? "Sending…" : "Send OTP"
					})]
				}) : /* @__PURE__ */ jsxs("form", {
					className: "mt-5 grid gap-4",
					onSubmit: (e) => {
						e.preventDefault();
						confirmOtp();
					},
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "6-digit OTP"
							}), /* @__PURE__ */ jsx("input", {
								required: true,
								inputMode: "numeric",
								maxLength: 6,
								value: otp,
								onChange: (e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)),
								className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-center text-lg tracking-[0.4em] outline-none focus:border-primary"
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: busy || otp.length < 6,
							className: "rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60",
							children: busy ? "Verifying…" : "Enter admin"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "text-sm text-muted-foreground",
							onClick: () => {
								setStep("form");
								setOtp("");
							},
							children: "Change email"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { AdminLogin as component };
