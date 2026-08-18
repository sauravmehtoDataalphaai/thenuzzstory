import { t as createServerFn } from "../server.js";
import { c as fetchProfile, n as applySupabaseSession, u as profileToAppUser } from "./auth-D9i6D0LJ.js";
import { u as useStore } from "./router-Cn9sBPaq.js";
import { n as isValidPhone, t as formatPhoneDisplay } from "./phone-CFJuizgH.js";
import { t as createSsrRpc } from "./createSsrRpc-BdB2e2iw.js";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("51333916b8cbc887baca5c890374b8ed23ef5bbfed8f3af789033ac6d6b14458"));
createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("1031b6a6156af529eb96ab8cc6c3ff2c6dcbf6bfb0a1f4b686a6ceba4ff4b55e"));
var startEmailSignup = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("19193ef29ac313da8a4d566c443c6d2d4b6718a2ea4bcd8f125a17ebfdd59a5b"));
var verifyEmailSignup = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("504bdfbc15aa4adebef07904a4271120e93a85b2f7ee72bfc4dc8edbd2509f64"));
var startEmailLogin = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("2fdaaa87f4c1bbbb0c334beea72dce018724f6c4f12898deac804e33fb312ad6"));
var verifyEmailLogin = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("7d88c2b36d2a9457f6a70d9c760f3f2feb8dae795d360c67de4232cf16aaeb92"));
var startPhoneLogin = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("92d652fd8652a98bf0248244122b6de376d97792b8c35794d6d0c4d73137b1e1"));
var verifyPhoneLogin = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("8de23f63be456b522d70b512c214cb0d577d13c34e720b231674767b0c33574c"));
//#endregion
//#region src/routes/account.login.tsx?tsr-split=component
function Login() {
	const { user, setUserFromAuth, refreshUser, isSupabaseConfigured } = useStore();
	const navigate = useNavigate();
	const [mode, setMode] = useState("signup");
	const [step, setStep] = useState("form");
	const [loginMethod, setLoginMethod] = useState("email");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [busy, setBusy] = useState(false);
	const [devOtpHint, setDevOtpHint] = useState(null);
	if (user) return /* @__PURE__ */ jsxs("div", {
		className: "rounded-3xl border border-border bg-card p-8",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-extrabold",
				children: "You're signed in"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"Signed in as ",
					user.name,
					" · ",
					user.email
				]
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => navigate({ to: "/account/profile" }),
				className: "mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground",
				children: "Go to profile"
			})
		]
	});
	const otpTargetLabel = mode === "signup" || loginMethod === "email" ? email : formatPhoneDisplay(phone);
	async function sendOtp() {
		if (!isSupabaseConfigured) {
			toast.error("Add your Supabase URL and anon key to .env first");
			return;
		}
		setBusy(true);
		try {
			if (mode === "signup") {
				if (!isValidPhone(phone)) throw new Error("Enter a valid 10-digit phone number");
				const result = await startEmailSignup({ data: {
					email,
					phone,
					name
				} });
				setStep("otp");
				if (result.devOtp) {
					setDevOtpHint(result.devOtp);
					setOtp(result.devOtp);
					toast.success(`Dev OTP: ${result.devOtp}`, { description: "Prefilled for local testing — remove before production" });
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
					toast.success(`Dev OTP: ${result.devOtp}`, { description: "Prefilled for local testing — remove before production" });
				} else {
					setDevOtpHint(null);
					toast.success("OTP sent to your email");
				}
				return;
			}
			if (!isValidPhone(phone)) throw new Error("Enter a valid 10-digit phone number");
			const result = await startPhoneLogin({ data: { phone } });
			setStep("otp");
			if (result.devOtp) {
				setDevOtpHint(result.devOtp);
				setOtp(result.devOtp);
				toast.success(`Dev OTP: ${result.devOtp}`, { description: "Prefilled for local testing — remove before production" });
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
	async function finishWithSession(result, successMessage) {
		const { error: sessionError } = await applySupabaseSession({
			access_token: result.access_token,
			refresh_token: result.refresh_token
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
				await finishWithSession(await verifyEmailSignup({ data: {
					email,
					phone,
					name,
					code: otp
				} }), "Signed up successfully · +100 loyalty points");
				return;
			}
			if (loginMethod === "phone") {
				await finishWithSession(await verifyPhoneLogin({ data: {
					phone,
					code: otp
				} }), "Welcome back");
				return;
			}
			await finishWithSession(await verifyEmailLogin({ data: {
				email,
				code: otp
			} }), "Welcome back");
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
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-md rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-8",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex gap-2 rounded-xl bg-secondary p-1",
				children: ["signup", "login"].map((m) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => {
						setMode(m);
						resetFlow();
					},
					className: `flex-1 rounded-lg px-3 py-2 text-sm font-bold ${mode === m ? "bg-card shadow-sm" : "text-muted-foreground"}`,
					children: m === "signup" ? "Sign up" : "Login"
				}, m))
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "mt-5 font-display text-xl font-extrabold sm:mt-6 sm:text-2xl",
				children: step === "otp" ? "Enter OTP" : mode === "signup" ? "Join The Nuzz Story" : "Welcome back"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: step === "otp" ? `Enter the OTP for ${otpTargetLabel}${devOtpHint ? ` · Dev OTP: ${devOtpHint}` : ""}.` : mode === "signup" ? "We'll send an email OTP. Your phone is saved for future SMS login." : "Log in with email or phone — one OTP on that channel."
			}),
			step === "form" ? /* @__PURE__ */ jsx("form", {
				className: "mt-5 grid gap-4",
				onSubmit: (e) => {
					e.preventDefault();
					sendOtp();
				},
				children: mode === "signup" ? /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Full name"
						}), /* @__PURE__ */ jsx("input", {
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Email"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Phone number"
						}), /* @__PURE__ */ jsx("input", {
							type: "tel",
							required: true,
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							placeholder: "10-digit mobile",
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: busy,
						className: "rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow disabled:opacity-60",
						children: busy ? "Sending…" : "Send email OTP"
					})
				] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setLoginMethod("email"),
							className: `flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${loginMethod === "email" ? "bg-card shadow-sm" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ jsx(Mail, { size: 16 }), " Email"]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setLoginMethod("phone"),
							className: `flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${loginMethod === "phone" ? "bg-card shadow-sm" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ jsx(Phone, { size: 16 }), " Phone"]
						})]
					}),
					loginMethod === "email" ? /* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Email"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
						})]
					}) : /* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Phone number"
						}), /* @__PURE__ */ jsx("input", {
							type: "tel",
							required: true,
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							placeholder: "10-digit mobile",
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: busy,
						className: "rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow disabled:opacity-60",
						children: busy ? "Sending…" : loginMethod === "email" ? "Send email OTP" : "Send SMS OTP"
					})
				] })
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
							pattern: "[0-9]{6}",
							maxLength: 6,
							value: otp,
							onChange: (e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-center text-lg tracking-[0.4em] outline-none focus:border-primary"
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: busy || otp.length < 6,
						className: "rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow disabled:opacity-60",
						children: busy ? "Verifying…" : mode === "signup" ? "Verify & sign up" : "Verify & login"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						disabled: busy,
						onClick: () => void sendOtp(),
						className: "text-sm font-semibold text-primary",
						children: "Resend OTP"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: resetFlow,
						className: "text-sm text-muted-foreground",
						children: mode === "signup" || loginMethod === "email" ? "Change email" : "Change phone"
					})
				]
			})
		]
	});
}
//#endregion
export { Login as component };
