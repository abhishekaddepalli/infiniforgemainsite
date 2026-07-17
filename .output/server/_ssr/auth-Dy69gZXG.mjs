import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Bn as Building2, L as Shield, St as Mail, Tt as Lock, Xn as ArrowRight, at as Phone, d as User, n as Zap, xt as MapPin } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Dy69gZXG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
var SETTINGS_LS = "infiniforge.settings";
function useGoogleEnabled() {
	const [enabled, setEnabled] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(SETTINGS_LS);
			if (raw) {
				const s = JSON.parse(raw);
				if (typeof s.google_auth_enabled === "boolean") setEnabled(s.google_auth_enabled);
			}
		} catch {}
	}, []);
	return enabled;
}
function AuthPage() {
	const navigate = useNavigate();
	const { user, loading } = useAuth();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const googleEnabled = useGoogleEnabled();
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({ to: "/dashboard" });
	}, [
		user,
		loading,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen grid lg:grid-cols-2 bg-secondary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden lg:flex flex-col justify-between p-12 bg-gradient-dashboard text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
							className: "h-5 w-5",
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-bold",
						children: "Infiniforge"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.18em] text-white/60",
						children: "Technologies"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl font-bold leading-tight",
						children: "India's unified enterprise platform for SaaS, IT & AI."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-white/70 max-w-md",
						children: "Hosting, licenses, subscriptions, wallets, tickets and affiliate — all from one premium control plane."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid grid-cols-3 gap-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Uptime",
								value: "99.99%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Customers",
								value: "8,900+"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Data centers",
								value: "7"
							})
						]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-white/50",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Infiniforge Technologies Pvt. Ltd."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center p-6 lg:p-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "lg:hidden flex items-center gap-2 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
								className: "h-4 w-4 text-white",
								strokeWidth: 2.5
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: "Infiniforge"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold",
						children: mode === "signin" ? "Welcome back" : "Create your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: mode === "signin" ? "Sign in to your Infiniforge workspace." : "The very first account becomes the Super Admin."
					}),
					googleEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "w-full mt-6 h-11",
						disabled: busy,
						onClick: async () => {
							setBusy(true);
							const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
							if (result.error) {
								toast.error(result.error.message ?? "Google sign-in failed");
								setBusy(false);
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, {}), " Continue with Google"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 flex items-center gap-3 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
							" or with email ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailForm, {
						mode,
						busy,
						setBusy
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 text-sm text-center text-muted-foreground",
						children: mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Don't have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-primary font-medium hover:underline",
							onClick: () => setMode("signup"),
							children: "Sign up"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Already have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-primary font-medium hover:underline",
							onClick: () => setMode("signin"),
							children: "Sign in"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3" }), " Protected by TLS 1.3, HIBP checks and optional 2FA"]
					})
				]
			})
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-2xl font-bold",
		children: value
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[11px] uppercase tracking-wider text-white/50 mt-0.5",
		children: label
	})] });
}
function EmailForm({ mode, busy, setBusy }) {
	const [form, setForm] = (0, import_react.useState)({
		full_name: "",
		email: "",
		password: "",
		phone: "",
		company: "",
		address_line1: "",
		city: "",
		state: "",
		postal_code: ""
	});
	const [otpCode, setOtpCode] = (0, import_react.useState)("");
	const [mfaFactorId, setMfaFactorId] = (0, import_react.useState)(null);
	const navigate = useNavigate();
	function set(k, v) {
		setForm((f) => ({
			...f,
			[k]: v
		}));
	}
	async function completeMfa(e) {
		e.preventDefault();
		if (!mfaFactorId) return;
		setBusy(true);
		try {
			const challenge = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
			if (challenge.error) throw challenge.error;
			const verify = await supabase.auth.mfa.verify({
				factorId: mfaFactorId,
				challengeId: challenge.data.id,
				code: otpCode.trim()
			});
			if (verify.error) throw verify.error;
			toast.success("Signed in");
			navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Invalid 2FA code");
		} finally {
			setBusy(false);
		}
	}
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "signup") {
				const { data: signUp, error } = await supabase.auth.signUp({
					email: form.email,
					password: form.password,
					options: {
						emailRedirectTo: `${window.location.origin}/`,
						data: { full_name: form.full_name }
					}
				});
				if (error) throw error;
				toast.success("Account created. Signing you in…");
				const uid = signUp.user?.id;
				if (uid) await supabase.from("profiles").update({
					full_name: form.full_name.trim() || null,
					phone: form.phone.trim() || null,
					company: form.company.trim() || null,
					address_line1: form.address_line1.trim() || null,
					city: form.city.trim() || null,
					state: form.state.trim() || null,
					postal_code: form.postal_code.trim() || null,
					country: "India"
				}).eq("id", uid);
				navigate({ to: "/dashboard" });
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email: form.email,
					password: form.password
				});
				if (error) throw error;
				const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
				if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
					const { data: factors } = await supabase.auth.mfa.listFactors();
					const totp = factors?.totp?.find((f) => f.status === "verified");
					if (totp) {
						setMfaFactorId(totp.id);
						toast.info("Enter the 6-digit code from your authenticator app");
						return;
					}
				}
				toast.success("Signed in");
				navigate({ to: "/dashboard" });
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Something went wrong";
			toast.error(msg);
		} finally {
			setBusy(false);
		}
	}
	if (mfaFactorId) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3 mt-4",
		onSubmit: completeMfa,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-primary/25 bg-primary/5 p-3 text-xs text-muted-foreground flex items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Two-step verification is enabled. Open your Google Authenticator (or any TOTP app) and enter the 6-digit code for Infiniforge." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "mfa",
				children: "Authenticator code"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "mfa",
				inputMode: "numeric",
				maxLength: 6,
				required: true,
				value: otpCode,
				onChange: (e) => setOtpCode(e.target.value.replace(/\D/g, "")),
				placeholder: "123456",
				className: "mt-1.5 tracking-widest text-center text-lg"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: busy || otpCode.length < 6,
				className: "w-full h-11 bg-gradient-brand text-white",
				children: busy ? "Verifying…" : "Verify & continue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "w-full text-xs text-muted-foreground hover:underline",
				onClick: async () => {
					await supabase.auth.signOut();
					setMfaFactorId(null);
					setOtpCode("");
				},
				children: "Use a different account"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3 mt-2",
		onSubmit,
		children: [
			mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldIcon, {
					icon: User,
					label: "Full name",
					required: true,
					value: form.full_name,
					onChange: (v) => set("full_name", v),
					placeholder: "Arjun Sharma"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldIcon, {
					icon: Phone,
					label: "Mobile number",
					required: true,
					value: form.phone,
					onChange: (v) => set("phone", v),
					placeholder: "+91 98xxxxxxxx",
					type: "tel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldIcon, {
					icon: Building2,
					label: "Company (optional)",
					value: form.company,
					onChange: (v) => set("company", v),
					placeholder: "Acme Pvt Ltd"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldIcon, {
				icon: Mail,
				label: "Email",
				required: true,
				type: "email",
				value: form.email,
				onChange: (v) => set("email", v),
				placeholder: "you@company.in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "password",
					children: "Password"
				}), mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForgotLink, { email: form.email })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "password",
					type: "password",
					required: true,
					minLength: 8,
					value: form.password,
					onChange: (e) => set("password", e.target.value),
					placeholder: "Min 8 characters",
					className: "pl-9"
				})]
			})] }),
			mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldIcon, {
				icon: MapPin,
				label: "Address",
				required: true,
				value: form.address_line1,
				onChange: (v) => set("address_line1", v),
				placeholder: "Flat / Street"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "City",
						required: true,
						value: form.city,
						onChange: (e) => set("city", e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "State",
						required: true,
						value: form.state,
						onChange: (e) => set("state", e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "PIN",
						required: true,
						value: form.postal_code,
						onChange: (e) => set("postal_code", e.target.value)
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: busy,
				className: "w-full h-11 bg-gradient-brand text-white",
				children: [
					busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })
				]
			})
		]
	});
}
function FieldIcon({ icon: Icon, label, value, onChange, placeholder, required, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mt-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type,
			required,
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "pl-9"
		})]
	})] });
}
function ForgotLink({ email }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled: busy,
		className: "text-xs text-primary hover:underline disabled:opacity-50",
		onClick: async () => {
			if (!email) return toast.error("Enter your email above first");
			setBusy(true);
			const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
			setBusy(false);
			if (error) toast.error(error.message);
			else toast.success("Password reset email sent");
		},
		children: "Forgot?"
	});
}
function GoogleIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "h-4 w-4 mr-1",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4285F4",
				d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M12 23c2.97 0 5.46-.98 7.28-2.65l-3.56-2.77c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.29 9.14 5.38 12 5.38Z"
			})
		]
	});
}
//#endregion
export { AuthPage as component };
