import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Et as LoaderCircle, G as Save, L as Shield, M as Smartphone, On as CircleCheck, Pt as KeyRound, Tn as CircleX, Zn as ArrowLeft, d as User, xt as MapPin } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { i as notifyProfileUpdated } from "./alerts.functions-BIA4cKEy.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.profile-BPtMmSdV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { user, profile, loading, refresh } = useAuth();
	const notifyProfile = useServerFn(notifyProfileUpdated);
	const navigate = useNavigate();
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		full_name: "",
		phone: "",
		company: "",
		gstin: "",
		address_line1: "",
		address_line2: "",
		city: "",
		state: "",
		postal_code: "",
		country: "India"
	});
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!profile) return;
		setForm({
			full_name: profile.full_name ?? "",
			phone: profile.phone ?? "",
			company: profile.company ?? "",
			gstin: profile.gstin ?? "",
			address_line1: profile.address_line1 ?? "",
			address_line2: profile.address_line2 ?? "",
			city: profile.city ?? "",
			state: profile.state ?? "",
			postal_code: profile.postal_code ?? "",
			country: profile.country ?? "India"
		});
	}, [profile]);
	function set(k, v) {
		setForm((f) => ({
			...f,
			[k]: v
		}));
	}
	async function save() {
		if (!user) return;
		if (!form.full_name.trim()) {
			toast.error("Full name is required");
			return;
		}
		const changed = Object.entries(form).filter(([key, value]) => String(value ?? "").trim() !== String(profile?.[key] ?? "").trim()).map(([key]) => key.replace(/_/g, " "));
		setSaving(true);
		const { error } = await supabase.from("profiles").update({
			full_name: form.full_name.trim() || null,
			phone: form.phone.trim() || null,
			company: form.company.trim() || null,
			gstin: form.gstin.trim().toUpperCase() || null,
			address_line1: form.address_line1.trim() || null,
			address_line2: form.address_line2.trim() || null,
			city: form.city.trim() || null,
			state: form.state.trim() || null,
			postal_code: form.postal_code.trim() || null,
			country: form.country.trim() || null
		}).eq("id", user.id);
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Profile updated");
		notifyProfile({ data: { changed } }).catch(() => void 0);
		await refresh();
	}
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-secondary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-4xl h-full px-4 lg:px-6 flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/portal",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold text-sm",
						children: "My Profile"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "Billing & contact details for orders and GST invoices"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						className: "ml-auto bg-gradient-brand text-white",
						onClick: save,
						disabled: saving,
						children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }), " Saving…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4 mr-2" }), " Save changes"] })
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-4xl px-4 lg:px-6 py-8 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
						icon: User,
						title: "Personal information",
						desc: "Used on invoices, order confirmations and support."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full name *",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.full_name,
									onChange: (e) => set("full_name", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: user.email ?? "",
									disabled: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone number",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.phone,
									onChange: (e) => set("phone", e.target.value),
									placeholder: "+91 98xxxxxxxx"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Company (optional)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.company,
									onChange: (e) => set("company", e.target.value)
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
						icon: MapPin,
						title: "Billing address",
						desc: "Required for GST-compliant invoicing and product delivery."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								className: "sm:col-span-2",
								label: "Address line 1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.address_line1,
									onChange: (e) => set("address_line1", e.target.value),
									placeholder: "Flat / Building / Street"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								className: "sm:col-span-2",
								label: "Address line 2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.address_line2,
									onChange: (e) => set("address_line2", e.target.value),
									placeholder: "Area / Landmark"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "City",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.city,
									onChange: (e) => set("city", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "State",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.state,
									onChange: (e) => set("state", e.target.value),
									placeholder: "e.g. Karnataka"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "PIN code",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.postal_code,
									onChange: (e) => set("postal_code", e.target.value),
									placeholder: "560001"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Country",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.country,
									onChange: (e) => set("country", e.target.value)
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
							icon: Shield,
							title: "Tax details",
							desc: "Add your GSTIN to receive input-tax-credit-eligible invoices."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "GSTIN (optional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.gstin,
								onChange: (e) => set("gstin", e.target.value.toUpperCase()),
								placeholder: "22AAAAA0000A1Z5",
								maxLength: 15
							})
						}),
						form.gstin && form.gstin.length !== 15 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-amber-600 border-amber-500/40",
							children: "GSTIN must be 15 characters"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TwoFactorCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "bg-gradient-brand text-white h-11 px-6",
						onClick: save,
						disabled: saving,
						children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }), " Saving…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4 mr-2" }), " Save changes"] })
					})
				})
			]
		})]
	});
}
function SectionHeader({ icon: Icon, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-semibold text-sm",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground mt-0.5",
			children: desc
		})] })]
	});
}
function Field({ label, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1.5",
			children
		})]
	});
}
function PasswordCard() {
	const [pw, setPw] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function change() {
		if (pw.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		if (pw !== confirm) {
			toast.error("Passwords do not match");
			return;
		}
		setBusy(true);
		const { error } = await supabase.auth.updateUser({ password: pw });
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		setPw("");
		setConfirm("");
		toast.success("Password updated");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				icon: KeyRound,
				title: "Change password",
				desc: "Choose a strong password. You'll stay signed in on this device."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "New password",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: pw,
						onChange: (e) => setPw(e.target.value),
						placeholder: "Min 8 characters"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Confirm password",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: confirm,
						onChange: (e) => setConfirm(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: change,
					disabled: busy || !pw,
					className: "bg-gradient-brand text-white",
					children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }), " Updating…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 mr-2" }), " Update password"] })
				})
			})
		]
	});
}
function TwoFactorCard() {
	const [factors, setFactors] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [enrolling, setEnrolling] = (0, import_react.useState)(null);
	const [code, setCode] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function refresh() {
		setLoading(true);
		const { data } = await supabase.auth.mfa.listFactors();
		setFactors((data?.totp ?? []).map((f) => ({
			id: f.id,
			status: f.status,
			friendly_name: f.friendly_name
		})));
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		refresh();
	}, []);
	const verified = factors.find((f) => f.status === "verified");
	async function startEnroll() {
		setBusy(true);
		try {
			const stale = factors.find((f) => f.status === "unverified");
			if (stale) await supabase.auth.mfa.unenroll({ factorId: stale.id });
			const { data, error } = await supabase.auth.mfa.enroll({
				factorType: "totp",
				friendlyName: "Infiniforge Authenticator"
			});
			if (error) throw error;
			setEnrolling({
				factorId: data.id,
				qr: data.totp.qr_code,
				secret: data.totp.secret
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not start enrolment");
		} finally {
			setBusy(false);
		}
	}
	async function verifyEnroll() {
		if (!enrolling) return;
		setBusy(true);
		try {
			const challenge = await supabase.auth.mfa.challenge({ factorId: enrolling.factorId });
			if (challenge.error) throw challenge.error;
			const verify = await supabase.auth.mfa.verify({
				factorId: enrolling.factorId,
				challengeId: challenge.data.id,
				code: code.trim()
			});
			if (verify.error) throw verify.error;
			toast.success("Two-step verification enabled");
			setEnrolling(null);
			setCode("");
			await refresh();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Invalid code");
		} finally {
			setBusy(false);
		}
	}
	async function disable(factorId) {
		if (!confirm("Disable two-step verification? Your account will be less secure.")) return;
		setBusy(true);
		const { error } = await supabase.auth.mfa.unenroll({ factorId });
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Two-step verification disabled");
		await refresh();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-6 space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			icon: Smartphone,
			title: "Two-step verification (2FA)",
			desc: "Add a second layer of protection using Google Authenticator, Authy, 1Password or any TOTP app."
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading…"]
		}) : verified && !enrolling ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "2FA is active"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "You'll be asked for a 6-digit code on every sign-in."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					disabled: busy,
					onClick: () => disable(verified.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 mr-1.5" }), " Disable"]
				})
			]
		}) : enrolling ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-primary/25 bg-primary/5 p-4 grid gap-4 sm:grid-cols-[auto_1fr] items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg bg-white p-2 border border-border",
					dangerouslySetInnerHTML: { __html: enrolling.qr }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "Scan the QR in your authenticator app"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Google Authenticator, Microsoft Authenticator, Authy, 1Password — anything that supports TOTP."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: "Can't scan? Enter this secret manually:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "block break-all text-xs font-mono bg-background border border-border rounded-lg px-2 py-1.5",
							children: enrolling.secret
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-[1fr_auto] items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "6-digit code from the app",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "numeric",
						maxLength: 6,
						value: code,
						onChange: (e) => setCode(e.target.value.replace(/\D/g, "")),
						placeholder: "123456",
						className: "tracking-widest text-center"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							setEnrolling(null);
							setCode("");
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "bg-gradient-brand text-white",
						onClick: verifyEnroll,
						disabled: busy || code.length < 6,
						children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Verify & enable"
					})]
				})]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 min-w-[220px] text-sm text-muted-foreground",
				children: "Not enabled. Set up an authenticator app to secure your account with a rotating 6-digit code."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "bg-gradient-brand text-white",
				onClick: startEnroll,
				disabled: busy,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4 mr-2" }), " Enable 2FA"]
			})]
		})]
	});
}
//#endregion
export { ProfilePage as component };
