import { o as __toESM } from "../_runtime.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { B as Settings, Bn as Building2, Et as LoaderCircle, F as ShoppingCart, Ft as Info, Gn as Bell, H as Send, L as Shield, On as CircleCheck, St as Mail, Tn as CircleX, _t as MessageCircle, at as Phone, cn as ExternalLink, gn as CreditCard, j as Sparkles, o as Wallet, wt as LogIn, zn as CalendarClock } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as createSsrRpc } from "./createSsrRpc-gkzqXpg7.mjs";
import { s as savePlatformAlertSettings, t as getPlatformAlertSettings } from "./alerts.functions-BIA4cKEy.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
import { n as DEFAULT_WALLET_ELIGIBLE_TYPES, r as WALLET_ELIGIBLE_TYPES_KEY } from "./cart-B06bdZ_b.mjs";
import { a as formatOrderMessage, n as WHATSAPP_TEMPLATES, r as buildWhatsAppLink, s as normalizeWhatsAppNumber, t as WA_DEFAULTS } from "./whatsapp-Bfedub3g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-2dlyIU5X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
createServerFn({ method: "POST" }).inputValidator((input) => input).handler(createSsrRpc("08aff47ebd9cbf127f46404715b8a1745039ac262242331d6bbbfea15b25ca03"));
createServerFn({ method: "POST" }).inputValidator((input) => input).handler(createSsrRpc("6b774b38f83400c50ae6cf6d6a5f73d88a5561b8001abbf345bfc4052108ef62"));
var sendTestSms = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("0fd230ee0ba13746d95aa0f1b9bf11f7817bfa5c600576e1536ade4f9b9ac214"));
var testSmtpConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("f7773e12bfd5d23689acf5aa012b10f745497291ece12f01bfb87b0515e0c297"));
var sendTestEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("2ad56757ed649cc17a526efa58e6efe6bb08b32ef13e8d016df3a6ecf8a92f87"));
var sendTestWhatsApp = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("543c450e268e54a00ac8c0bc66e3158b1d23dc24a974efd689b89e673587ea7a"));
var testWhatsAppConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("33ad59285366355a99d00262b9798d26de1b4024d9cc32ceab70471604ac0c8c"));
var testTwilioConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {}).handler(createSsrRpc("4595a5ff77c1f086daa46e888cac377a2aa9748d55166aa6e04b3998c9e2f3f2"));
var LS_KEY = "infiniforge.settings";
var DEFAULTS = {
	brand_name: "Infiniforge Technologies",
	support_email: "support@infiniforge.cloud",
	whatsapp_number: "+91 98765 43210",
	gst_number: "27ABCDE1234F1Z5",
	gst_percent: 18,
	razorpay_key_id: "",
	razorpay_key_secret: "",
	razorpay_webhook_secret: "",
	razorpay_test_mode: true,
	default_currency: "INR",
	notif_new_order: true,
	notif_new_ticket: true,
	notif_low_stock: true,
	require_2fa_staff: false,
	session_timeout_min: 60,
	smtp_host: "",
	smtp_port: 587,
	smtp_username: "",
	smtp_password: "",
	smtp_from_email: "",
	smtp_from_name: "Infiniforge Technologies",
	smtp_secure: true,
	smtp_enabled: false,
	wa_provider: "twilio",
	wa_api_url: "",
	wa_api_key: "",
	wa_from_number: "",
	wa_enabled: false,
	alert_on_sale: true,
	alert_on_login: false,
	alert_on_wallet: true,
	alert_weekly_report: true,
	alert_monthly_report: true,
	alert_recipient_email: "",
	alert_recipient_whatsapp: "",
	alert_recipient_sms: "",
	twilio_enabled: false,
	twilio_account_sid: "",
	twilio_auth_token: "",
	twilio_from_number: "",
	twilio_test_recipient: "",
	...WA_DEFAULTS,
	google_auth_enabled: true,
	require_2fa_customers: false
};
var ALL_WALLET_TYPES = [
	"subscription",
	"license",
	"digital",
	"service",
	"software",
	"hosting",
	"vps",
	"domain",
	"ssl",
	"consultation",
	"custom_dev",
	"ai",
	"monitoring",
	"amc",
	"physical"
];
var DEFAULT_SITE = {
	hero_eyebrow: "Made in India · GST-ready",
	hero_title: "Enterprise business management, engineered for growth",
	hero_subtitle: "Sell IT services, SaaS, subscriptions, licenses, hosting, domains, SSL, monitoring, AMC and physical products from a single platform.",
	hero_cta_primary: "Explore services",
	hero_cta_secondary: "Talk to sales",
	extra_services: [{
		title: "Internet & Leased Line",
		description: "Enterprise fiber, business broadband and dedicated internet with 99.9% SLA."
	}, {
		title: "24×7 Monitoring",
		description: "Server, website and API monitoring with WhatsApp/SMS alerts and public status pages."
	}]
};
function Page() {
	const { user, profile, refresh } = useAuth();
	const [s, setS] = (0, import_react.useState)(DEFAULTS);
	const [fullName, setFullName] = (0, import_react.useState)(profile?.full_name ?? "");
	const [phone, setPhone] = (0, import_react.useState)(profile?.phone ?? "");
	const [company, setCompany] = (0, import_react.useState)(profile?.company ?? "");
	const [walletTypes, setWalletTypes] = (0, import_react.useState)(DEFAULT_WALLET_ELIGIBLE_TYPES);
	const [site, setSite] = (0, import_react.useState)(DEFAULT_SITE);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(LS_KEY);
			if (raw) setS({
				...DEFAULTS,
				...JSON.parse(raw)
			});
			const wt = localStorage.getItem(WALLET_ELIGIBLE_TYPES_KEY);
			if (wt) setWalletTypes(JSON.parse(wt));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		setFullName(profile?.full_name ?? "");
		setPhone(profile?.phone ?? "");
		setCompany(profile?.company ?? "");
	}, [profile]);
	const { data: siteRow } = useQuery({
		queryKey: ["site-content"],
		queryFn: async () => {
			const { data } = await supabase.from("module_records").select("id,metadata").eq("module", "site_content").eq("title", "homepage").maybeSingle();
			return data;
		}
	});
	(0, import_react.useEffect)(() => {
		if (siteRow?.metadata) setSite({
			...DEFAULT_SITE,
			...siteRow.metadata
		});
	}, [siteRow]);
	const [testResult, setTestResult] = (0, import_react.useState)({
		open: false,
		kind: "email",
		status: "idle",
		title: ""
	});
	const isTesting = testResult.open && testResult.status === "loading";
	const openTest = (r) => setTestResult({
		...r,
		open: true
	});
	const closeTest = () => setTestResult((r) => ({
		...r,
		open: false,
		status: r.status === "loading" ? "idle" : r.status
	}));
	async function withClientTimeout(promise, label) {
		let timer;
		const timeout = new Promise((_, reject) => {
			timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`${label} timed out. Please check credentials/network and try again.`)), 18e3);
		});
		try {
			return await Promise.race([promise, timeout]);
		} finally {
			if (timer) clearTimeout(timer);
		}
	}
	const testEmailFn = useServerFn(sendTestEmail);
	const testWaFn = useServerFn(sendTestWhatsApp);
	const testSms = useServerFn(sendTestSms);
	const testSmtpConn = useServerFn(testSmtpConnection);
	const testWaConn = useServerFn(testWhatsAppConnection);
	const testTwilioConn = useServerFn(testTwilioConnection);
	const getAlertSettingsFn = useServerFn(getPlatformAlertSettings);
	const saveAlertSettingsFn = useServerFn(savePlatformAlertSettings);
	const { data: persistedAlertSettings } = useQuery({
		queryKey: ["platform-alert-settings"],
		queryFn: () => getAlertSettingsFn(),
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnMount: false
	});
	const hydratedAlertsRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!persistedAlertSettings || hydratedAlertsRef.current) return;
		hydratedAlertsRef.current = true;
		setS((prev) => ({
			...prev,
			...persistedAlertSettings,
			alert_recipient_sms: persistedAlertSettings.alert_recipient_sms || prev.alert_recipient_sms || persistedAlertSettings.alert_recipient_whatsapp || ""
		}));
	}, [persistedAlertSettings]);
	function smtpCfg() {
		return {
			host: s.smtp_host,
			port: s.smtp_port,
			secure: s.smtp_secure,
			username: s.smtp_username,
			password: s.smtp_password,
			from_email: s.smtp_from_email || s.smtp_username,
			from_name: s.smtp_from_name
		};
	}
	async function testSmtpConnectionBtn() {
		if (!s.smtp_host) return toast.error("Enter SMTP host first");
		openTest({
			kind: "email",
			status: "loading",
			title: "Testing SMTP connection…"
		});
		try {
			const r = await withClientTimeout(testSmtpConn({ data: smtpCfg() }), "SMTP connection test");
			await saveAlertSettingsFn({ data: s });
			toast.success(`Connected in ${r.latency_ms}ms`);
			openTest({
				kind: "email",
				status: "success",
				title: "SMTP credentials verified",
				detail: "Your server accepted authentication. You can now send a test email or enable alerts.",
				meta: {
					Host: r.host,
					Encryption: r.encryption,
					Latency: `${r.latency_ms} ms`
				}
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Connection failed";
			toast.error(msg);
			openTest({
				kind: "email",
				status: "error",
				title: "SMTP connection failed",
				detail: msg
			});
		}
	}
	async function testWaConnectionBtn() {
		openTest({
			kind: "whatsapp",
			status: "loading",
			title: "Testing WhatsApp connection…"
		});
		try {
			const r = await withClientTimeout(testWaConn({ data: {
				provider: s.wa_provider,
				api_url: s.wa_api_url,
				api_key: s.wa_api_key,
				from_number: s.wa_from_number
			} }), "WhatsApp connection test");
			await saveAlertSettingsFn({ data: s });
			toast.success(`Connected in ${r.latency_ms}ms`);
			openTest({
				kind: "whatsapp",
				status: "success",
				title: "WhatsApp provider reachable",
				detail: "Credentials/endpoint verified. Send a test message to confirm end-to-end delivery.",
				meta: {
					Provider: r.provider,
					Latency: `${r.latency_ms} ms`
				}
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Connection failed";
			toast.error(msg);
			openTest({
				kind: "whatsapp",
				status: "error",
				title: "WhatsApp connection failed",
				detail: msg
			});
		}
	}
	async function testTwilioConnBtn() {
		openTest({
			kind: "sms",
			status: "loading",
			title: "Testing Twilio connection…"
		});
		try {
			const r = await withClientTimeout(testTwilioConn({ data: {
				sid: s.twilio_account_sid,
				token: s.twilio_auth_token
			} }), "Twilio connection test");
			await saveAlertSettingsFn({ data: s });
			toast.success(`Connected in ${r.latency_ms}ms`);
			openTest({
				kind: "sms",
				status: "success",
				title: "Twilio credentials verified",
				detail: "Your Account SID / Auth Token were accepted by Twilio.",
				meta: {
					"Account SID": `••••${r.account_sid_last4}`,
					Latency: `${r.latency_ms} ms`
				}
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Connection failed";
			toast.error(msg);
			openTest({
				kind: "sms",
				status: "error",
				title: "Twilio connection failed",
				detail: msg
			});
		}
	}
	async function testEmail() {
		if (!s.smtp_host) return toast.error("Enter SMTP host first");
		if (!s.alert_recipient_email) return toast.error("Enter an alerts email recipient below");
		openTest({
			kind: "email",
			status: "loading",
			title: "Sending test email…",
			to: s.alert_recipient_email
		});
		try {
			const r = await withClientTimeout(testEmailFn({ data: {
				...smtpCfg(),
				to: s.alert_recipient_email
			} }), "SMTP email test");
			await saveAlertSettingsFn({ data: s });
			toast.success(`Email delivered in ${r.latency_ms}ms`);
			openTest({
				kind: "email",
				status: "success",
				title: "SMTP integration is live",
				to: s.alert_recipient_email,
				detail: `Message accepted by ${s.smtp_host}. Check your inbox in a moment.`,
				meta: {
					Host: r.host,
					Latency: `${r.latency_ms} ms`
				}
			});
			await logAudit({
				action: "update",
				resource: "settings",
				details: {
					test: "smtp",
					to: s.alert_recipient_email,
					ok: true
				}
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "SMTP test failed";
			toast.error(msg);
			openTest({
				kind: "email",
				status: "error",
				title: "SMTP test failed",
				to: s.alert_recipient_email,
				detail: msg
			});
		}
	}
	async function testWhatsApp() {
		if (!s.alert_recipient_whatsapp) return toast.error("Enter a WhatsApp recipient below");
		openTest({
			kind: "whatsapp",
			status: "loading",
			title: "Sending test WhatsApp…",
			to: s.alert_recipient_whatsapp
		});
		try {
			const r = await withClientTimeout(testWaFn({ data: {
				provider: s.wa_provider,
				api_url: s.wa_api_url,
				api_key: s.wa_api_key,
				from_number: s.wa_from_number,
				to: s.alert_recipient_whatsapp
			} }), "WhatsApp message test");
			await saveAlertSettingsFn({ data: s });
			toast.success(`WhatsApp delivered in ${r.latency_ms}ms`);
			openTest({
				kind: "whatsapp",
				status: "success",
				title: "WhatsApp integration is live",
				to: s.alert_recipient_whatsapp,
				detail: `Message accepted by ${r.provider}. Check the recipient's WhatsApp.`,
				meta: {
					Provider: r.provider,
					Latency: `${r.latency_ms} ms`
				}
			});
			await logAudit({
				action: "update",
				resource: "settings",
				details: {
					test: "whatsapp",
					to: s.alert_recipient_whatsapp,
					ok: true
				}
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "WhatsApp test failed";
			toast.error(msg);
			openTest({
				kind: "whatsapp",
				status: "error",
				title: "WhatsApp test failed",
				to: s.alert_recipient_whatsapp,
				detail: msg
			});
		}
	}
	async function handleTestSms() {
		if (!s.twilio_test_recipient) return toast.error("Enter a test recipient number");
		openTest({
			kind: "sms",
			status: "loading",
			title: "Sending test SMS…",
			to: s.twilio_test_recipient
		});
		try {
			await withClientTimeout(testSms({ data: {
				phone: s.twilio_test_recipient,
				sid: s.twilio_account_sid,
				token: s.twilio_auth_token,
				from: s.twilio_from_number
			} }), "SMS test");
			await saveAlertSettingsFn({ data: {
				...s,
				alert_recipient_sms: s.alert_recipient_sms || s.twilio_test_recipient
			} });
			toast.success(`Test SMS sent to ${s.twilio_test_recipient}`);
			openTest({
				kind: "sms",
				status: "success",
				title: "Twilio SMS is live",
				to: s.twilio_test_recipient,
				detail: "SMS handed off to Twilio for delivery.",
				meta: { Provider: "Twilio" }
			});
			await logAudit({
				action: "update",
				resource: "settings",
				details: {
					test: "twilio",
					to: s.twilio_test_recipient
				}
			});
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Twilio test failed";
			toast.error(msg);
			openTest({
				kind: "sms",
				status: "error",
				title: "Twilio SMS failed",
				to: s.twilio_test_recipient,
				detail: msg
			});
		}
	}
	const savePlatform = useMutation({
		mutationFn: async () => {
			localStorage.setItem(LS_KEY, JSON.stringify(s));
			localStorage.setItem(WALLET_ELIGIBLE_TYPES_KEY, JSON.stringify(walletTypes));
			const saved = await saveAlertSettingsFn({ data: s });
			const waPayload = {
				enabled: !!s.wa_ordering_enabled,
				number: s.wa_ordering_number ?? "",
				greeting: s.wa_ordering_greeting ?? "",
				label: s.wa_ordering_label ?? "Order on WhatsApp",
				template: s.wa_ordering_template ?? "premium",
				show_products: !!s.wa_ordering_show_products,
				show_checkout: !!s.wa_ordering_show_checkout,
				show_header: !!s.wa_ordering_show_header
			};
			const { data: existing } = await supabase.from("module_records").select("id").eq("module", "site_cms").eq("title", "whatsapp").maybeSingle();
			if (existing?.id) await supabase.from("module_records").update({ metadata: waPayload }).eq("id", existing.id);
			else await supabase.from("module_records").insert({
				module: "site_cms",
				title: "whatsapp",
				status: "published",
				metadata: waPayload
			});
			await logAudit({
				action: "update",
				resource: "settings",
				details: { brand: s.brand_name }
			});
			return saved;
		},
		onSuccess: (saved) => {
			if (!!saved?.smtp_host && !!(saved.smtp_from_email || saved.smtp_username)) toast.success(`Platform settings saved · SMTP: ${saved.smtp_host}`);
			else toast.warning("Settings saved, but SMTP is not configured — emails for orders, logins and alerts will NOT be sent until you fill the SMTP host, username, password and From email above.", { duration: 8e3 });
		},
		onError: (e) => toast.error(e.message || "Failed to save platform settings")
	});
	useMutation({
		mutationFn: async () => {
			if (siteRow?.id) {
				const { error } = await supabase.from("module_records").update({ metadata: site }).eq("id", siteRow.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("module_records").insert({
					module: "site_content",
					title: "homepage",
					status: "published",
					metadata: site
				});
				if (error) throw error;
			}
			await logAudit({
				action: "update",
				resource: "site_content",
				details: { key: "homepage" }
			});
		},
		onSuccess: () => toast.success("Homepage content published"),
		onError: (e) => toast.error(e.message)
	});
	const saveProfile = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("Not signed in");
			const { error } = await supabase.from("profiles").update({
				full_name: fullName,
				phone,
				company
			}).eq("id", user.id);
			if (error) throw error;
			await refresh();
		},
		onSuccess: () => toast.success("Profile updated"),
		onError: (e) => toast.error(e.message)
	});
	function toggleWallet(t) {
		setWalletTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 min-w-0 max-w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex min-w-0 items-center gap-2 break-words text-xl font-bold sm:text-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-6 w-6 shrink-0" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 break-words",
							children: "Platform settings"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 break-words text-sm text-muted-foreground",
					children: "Branding, tax, payments, wallet gating, notifications and homepage content."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: Building2,
				title: "Brand & contact",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Brand name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: s.brand_name,
							onChange: (e) => setS({
								...s,
								brand_name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Support email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: s.support_email,
							onChange: (e) => setS({
								...s,
								support_email: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "WhatsApp number",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: s.whatsapp_number,
							onChange: (e) => setS({
								...s,
								whatsapp_number: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Default currency",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: s.default_currency,
							onChange: (e) => setS({
								...s,
								default_currency: e.target.value.toUpperCase()
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: CreditCard,
				title: "Tax & Razorpay gateway",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "GSTIN",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: s.gst_number,
							onChange: (e) => setS({
								...s,
								gst_number: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Default GST %",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: s.gst_percent,
							onChange: (e) => setS({
								...s,
								gst_percent: Number(e.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Razorpay Key ID",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "rzp_live_xxxxxxxx or rzp_test_xxxxxxxx",
							value: s.razorpay_key_id,
							onChange: (e) => setS({
								...s,
								razorpay_key_id: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Razorpay Key Secret",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							placeholder: "••••••••••••••••",
							value: s.razorpay_key_secret,
							onChange: (e) => setS({
								...s,
								razorpay_key_secret: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Razorpay Webhook Secret",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							placeholder: "Set in Razorpay → Webhooks",
							value: s.razorpay_webhook_secret,
							onChange: (e) => setS({
								...s,
								razorpay_webhook_secret: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg border border-border p-3 md:mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Use Razorpay test mode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: s.razorpay_test_mode,
							onCheckedChange: (v) => setS({
								...s,
								razorpay_test_mode: v
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-semibold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4" }), " Razorpay setup checklist"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "list-decimal pl-5 space-y-1 text-muted-foreground [&_code]:break-all [&_code]:inline-block [&_code]:max-w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Create a Razorpay account at ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										className: "text-primary underline inline-flex items-center gap-1",
										href: "https://dashboard.razorpay.com",
										target: "_blank",
										rel: "noreferrer",
										children: ["dashboard.razorpay.com ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
									}),
									" and complete KYC."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Go to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Settings → API Keys" }),
									" and generate a key pair. Paste the Key ID above and store the secret in your server env (",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "text-xs bg-secondary px-1 rounded",
										children: "RAZORPAY_KEY_SECRET"
									}),
									")."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"In ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Settings → Webhooks" }),
									", add ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
										className: "text-xs bg-secondary px-1 rounded",
										children: [typeof window !== "undefined" ? window.location.origin : "", "/api/razorpay/webhook"]
									}),
									" with events ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "text-xs bg-secondary px-1 rounded",
										children: "payment.captured"
									}),
									", ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "text-xs bg-secondary px-1 rounded",
										children: "payment.failed"
									}),
									", ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "text-xs bg-secondary px-1 rounded",
										children: "order.paid"
									}),
									". Copy the webhook secret above."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Enable payment methods (UPI, Cards, Netbanking, Wallets) under ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Payment Methods" }),
									"."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Turn off test mode once verified — checkout will switch to live keys automatically." })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: Wallet,
				title: "Wallet & payment eligibility",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2 text-sm text-muted-foreground",
					children: "Choose which product types customers can pay for using wallet balance. Physical products should typically require the gateway to keep GST reconciliation clean."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2 flex flex-wrap gap-2",
					children: ALL_WALLET_TYPES.map((t) => {
						const on = walletTypes.includes(t);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => toggleWallet(t),
							className: `px-3 py-1.5 rounded-full text-xs border transition ${on ? "bg-gradient-brand text-white border-transparent" : "border-border hover:bg-secondary"}`,
							children: [on ? "✓ " : "+ ", t]
						}, t);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: Mail,
				title: "SMTP email integration",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border p-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium break-words",
								children: "Enable SMTP for outbound email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground break-words",
								children: "Used for order receipts, GST invoices, alerts and reports."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: s.smtp_enabled,
								onCheckedChange: (v) => setS({
									...s,
									smtp_enabled: v
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "SMTP host",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "smtp.gmail.com",
							value: s.smtp_host,
							onChange: (e) => setS({
								...s,
								smtp_host: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "SMTP port",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: s.smtp_port,
							onChange: (e) => setS({
								...s,
								smtp_port: Number(e.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Username",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: s.smtp_username,
							onChange: (e) => setS({
								...s,
								smtp_username: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Password / App key",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: s.smtp_password,
							onChange: (e) => setS({
								...s,
								smtp_password: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "From email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							placeholder: "alerts@infiniforge.cloud",
							value: s.smtp_from_email,
							onChange: (e) => setS({
								...s,
								smtp_from_email: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "From name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: s.smtp_from_name,
							onChange: (e) => setS({
								...s,
								smtp_from_name: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Use TLS/SSL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: s.smtp_secure,
							onCheckedChange: (v) => setS({
								...s,
								smtp_secure: v
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 flex flex-col sm:flex-row sm:items-end sm:justify-end gap-2 flex-wrap [&>*]:w-full sm:[&>*]:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Send test to",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									placeholder: "you@example.com",
									value: s.alert_recipient_email,
									onChange: (e) => setS({
										...s,
										alert_recipient_email: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: testSmtpConnectionBtn,
								disabled: !s.smtp_host || isTesting,
								children: [testResult.kind === "email" && isTesting && !testResult.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 mr-2" }), "Test connection"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "default",
								onClick: () => testEmail(),
								disabled: !s.smtp_host || isTesting,
								className: "bg-gradient-brand text-white",
								children: [testResult.kind === "email" && isTesting && testResult.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 mr-2" }), "Send test email"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: MessageCircle,
				title: "WhatsApp automation",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border p-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium break-words",
								children: "Enable WhatsApp automation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground break-words",
								children: "Send order, login, wallet and report alerts to admin & customers."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: s.wa_enabled,
								onCheckedChange: (v) => setS({
									...s,
									wa_enabled: v
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Provider",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm",
							value: s.wa_provider,
							onChange: (e) => setS({
								...s,
								wa_provider: e.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "twilio",
									children: "Twilio WhatsApp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "gupshup",
									children: "Gupshup"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "meta",
									children: "Meta Cloud API"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "wati",
									children: "Wati"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "custom",
									children: "Custom webhook"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "From WhatsApp number",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "+91XXXXXXXXXX",
							value: s.wa_from_number,
							onChange: (e) => setS({
								...s,
								wa_from_number: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "API URL / endpoint",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "https://api.provider.com/messages",
							value: s.wa_api_url,
							onChange: (e) => setS({
								...s,
								wa_api_url: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "API key / Bearer token",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: s.wa_api_key,
							onChange: (e) => setS({
								...s,
								wa_api_key: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 flex flex-col sm:flex-row sm:items-end sm:justify-end gap-2 flex-wrap [&>*]:w-full sm:[&>*]:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Send test to (WhatsApp)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "+91XXXXXXXXXX",
									value: s.alert_recipient_whatsapp,
									onChange: (e) => setS({
										...s,
										alert_recipient_whatsapp: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: testWaConnectionBtn,
								disabled: isTesting,
								children: [testResult.kind === "whatsapp" && isTesting && !testResult.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 mr-2" }), "Test connection"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "default",
								onClick: () => testWhatsApp(),
								disabled: isTesting,
								className: "bg-gradient-brand text-white",
								children: [testResult.kind === "whatsapp" && isTesting && testResult.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 mr-2" }), "Send test WhatsApp"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: MessageCircle,
				title: "WhatsApp Ordering (customer buttons)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border p-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium break-words",
								children: "Enable \"Order on WhatsApp\" buttons"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground break-words",
								children: "Adds instant-order buttons on product cards, checkout and the site header. Uses your business WhatsApp number below."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: s.wa_ordering_enabled,
								onCheckedChange: (v) => setS({
									...s,
									wa_ordering_enabled: v
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Business WhatsApp number (with country code)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "+919876543210",
							value: s.wa_ordering_number,
							onChange: (e) => setS({
								...s,
								wa_ordering_number: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Button label",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Order on WhatsApp",
							value: s.wa_ordering_label,
							onChange: (e) => setS({
								...s,
								wa_ordering_label: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Greeting / opening line",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: s.wa_ordering_greeting,
								onChange: (e) => setS({
									...s,
									wa_ordering_greeting: e.target.value
								}),
								placeholder: "Hello Infiniforge Technologies 👋"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground mt-1",
							children: "Only used by the Premium template. Products, totals, contact and reference are appended automatically."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Message template style",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: s.wa_ordering_template ?? "premium",
								onValueChange: (v) => setS({
									...s,
									wa_ordering_template: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: WHATSAPP_TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: t.id,
									children: [
										t.label,
										" — ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: t.description
										})
									]
								}, t.id)) })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-dashed border-primary/30 bg-gradient-to-br from-emerald-500/5 to-primary/5 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-semibold uppercase tracking-wide text-primary",
									children: "Live message preview"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: "as it will appear in WhatsApp"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "whitespace-pre-wrap break-words text-[12px] leading-relaxed font-sans bg-background/60 rounded-lg p-3 border border-border max-h-72 overflow-auto",
								children: formatOrderMessage(s.wa_ordering_greeting, [{
									name: "Cloud Hosting — Starter",
									qty: 1,
									price_inr: 1499
								}, {
									name: "SSL Certificate (1 yr)",
									qty: 2,
									price_inr: 799
								}], {
									total_inr: 3097,
									customer_name: "Priya Sharma",
									customer_phone: "+91 98765 43210",
									note: "Please deliver credentials by Monday.",
									template: s.wa_ordering_template ?? "premium",
									reference: "IF-PREVIEW-DEMO"
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Show on product cards",
						v: s.wa_ordering_show_products,
						onChange: (v) => setS({
							...s,
							wa_ordering_show_products: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Show on checkout page",
						v: s.wa_ordering_show_checkout,
						onChange: (v) => setS({
							...s,
							wa_ordering_show_checkout: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Show floating button in site header",
						v: s.wa_ordering_show_header,
						onChange: (v) => setS({
							...s,
							wa_ordering_show_header: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/25 bg-primary/5 p-3 text-xs min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground min-w-0 w-full sm:w-auto sm:flex-1",
							children: ["Live link preview: ", normalizeWhatsAppNumber(s.wa_ordering_number) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
								className: "bg-secondary px-1.5 py-0.5 rounded break-all inline-block max-w-full align-bottom",
								children: [buildWhatsAppLink(s.wa_ordering_number, s.wa_ordering_greeting).slice(0, 80), "…"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-destructive",
								children: "Enter a valid number"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							disabled: !s.wa_ordering_enabled || !s.wa_ordering_number,
							onClick: () => window.open(buildWhatsAppLink(s.wa_ordering_number, s.wa_ordering_greeting), "_blank", "noopener,noreferrer"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5 mr-1.5" }), " Open test chat"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: Phone,
				title: "Twilio SMS alerts",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border p-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium break-words",
								children: "Enable Twilio SMS delivery"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground break-words",
								children: "Powers transactional SMS alerts (orders, wallet, reports). Phone-OTP sign-in has been removed — email + password + Google are used instead."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: s.twilio_enabled,
								onCheckedChange: (v) => setS({
									...s,
									twilio_enabled: v
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Twilio Account SID",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
							value: s.twilio_account_sid,
							onChange: (e) => setS({
								...s,
								twilio_account_sid: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Twilio Auth Token",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							placeholder: "••••••••••••••••",
							value: s.twilio_auth_token,
							onChange: (e) => setS({
								...s,
								twilio_auth_token: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "From number (E.164)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "+15558675310",
							value: s.twilio_from_number,
							onChange: (e) => setS({
								...s,
								twilio_from_number: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Test recipient (E.164)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "+919876543210",
							value: s.twilio_test_recipient,
							onChange: (e) => setS({
								...s,
								twilio_test_recipient: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-stretch justify-end gap-2 sm:flex-row sm:items-end sm:flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: testTwilioConnBtn,
							disabled: isTesting,
							children: [testResult.kind === "sms" && isTesting && !testResult.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 mr-2" }), "Test connection"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "default",
							onClick: handleTestSms,
							disabled: isTesting,
							className: "bg-gradient-brand text-white",
							children: [testResult.kind === "sms" && isTesting && testResult.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 mr-2" }), "Send test SMS"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-semibold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4" }), " Twilio SMS setup checklist"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "list-decimal pl-5 space-y-1 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Create an account at ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										className: "text-primary underline inline-flex items-center gap-1",
										href: "https://console.twilio.com",
										target: "_blank",
										rel: "noreferrer",
										children: ["console.twilio.com ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
									}),
									" and buy a phone number that supports SMS to your target countries."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Turn on ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "SMS Pumping Protection" }),
									" and configure ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "SMS Geo Permissions" }),
									" to only your target countries."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Paste the Account SID, Auth Token and From number above, then use ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Test connection" }),
									" before sending a live SMS."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Use ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Send test SMS" }),
									" above to confirm delivery. Once verified, alerts can use this channel."
								] })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: Bell,
				title: "Alerts & scheduled reports",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Alerts email recipient",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							placeholder: "admin@infiniforge.cloud",
							value: s.alert_recipient_email,
							onChange: (e) => setS({
								...s,
								alert_recipient_email: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Alerts WhatsApp recipient",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "+91XXXXXXXXXX",
							value: s.alert_recipient_whatsapp,
							onChange: (e) => setS({
								...s,
								alert_recipient_whatsapp: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Alerts SMS recipient",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "+91XXXXXXXXXX",
							value: s.alert_recipient_sms,
							onChange: (e) => setS({
								...s,
								alert_recipient_sms: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleIcon, {
						icon: ShoppingCart,
						label: "Every new sale / order",
						v: s.alert_on_sale,
						onChange: (v) => setS({
							...s,
							alert_on_sale: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleIcon, {
						icon: LogIn,
						label: "Every user login",
						v: s.alert_on_login,
						onChange: (v) => setS({
							...s,
							alert_on_login: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleIcon, {
						icon: Wallet,
						label: "Wallet top-ups & debits",
						v: s.alert_on_wallet,
						onChange: (v) => setS({
							...s,
							alert_on_wallet: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleIcon, {
						icon: CalendarClock,
						label: "Weekly summary report (Mon 9 AM)",
						v: s.alert_weekly_report,
						onChange: (v) => setS({
							...s,
							alert_weekly_report: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleIcon, {
						icon: CalendarClock,
						label: "Monthly summary report (1st, 9 AM)",
						v: s.alert_monthly_report,
						onChange: (v) => setS({
							...s,
							alert_monthly_report: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Email on new order (legacy)",
						v: s.notif_new_order,
						onChange: (v) => setS({
							...s,
							notif_new_order: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Email on new ticket",
						v: s.notif_new_ticket,
						onChange: (v) => setS({
							...s,
							notif_new_ticket: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Alert on low stock",
						v: s.notif_low_stock,
						onChange: (v) => setS({
							...s,
							notif_low_stock: v
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				icon: Shield,
				title: "Authentication & 2-step verification",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border p-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: "Enable “Continue with Google” on sign-in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "Shows the Google button on the auth page. Turn off to use email + password only."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: s.google_auth_enabled,
								onCheckedChange: (v) => setS({
									...s,
									google_auth_enabled: v
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Require 2FA (Google Authenticator) for staff",
						v: s.require_2fa_staff,
						onChange: (v) => setS({
							...s,
							require_2fa_staff: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Encourage 2FA for customers",
						v: s.require_2fa_customers,
						onChange: (v) => setS({
							...s,
							require_2fa_customers: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Session timeout (minutes)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: s.session_timeout_min,
							onChange: (e) => setS({
								...s,
								session_timeout_min: Number(e.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-semibold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4" }), " How 2-step verification works"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "list-decimal pl-5 space-y-1 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Each user enrols a TOTP factor from ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Portal → Profile → Two-step verification" }),
									" using Google Authenticator, Authy, 1Password or any RFC 6238 app."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "On the next sign-in they will be prompted for the 6-digit code before reaching the dashboard." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Staff accounts flagged above are strongly encouraged to enrol; enforcement is checked at sign-in." })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => savePlatform.mutate(),
					disabled: savePlatform.isPending,
					className: "w-full bg-gradient-brand text-white sm:w-auto",
					children: "Save platform settings"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-4 sm:p-5 space-y-2 border border-primary/20 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium",
					children: "Website content moved"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Homepage, header, footer, services, pricing, contact form and legal pages are now edited in the full ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/admin/cms",
							className: "text-primary underline",
							children: "Site CMS"
						}),
						"."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-4 sm:p-5 space-y-4 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold",
						children: "Your profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: fullName,
									onChange: (e) => setFullName(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: phone,
									onChange: (e) => setPhone(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Company",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: company,
									onChange: (e) => setCompany(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: user?.email ?? "",
									disabled: true
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full sm:w-auto",
							onClick: () => saveProfile.mutate(),
							disabled: saveProfile.isPending,
							children: "Save profile"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: testResult.open,
				onOpenChange: (o) => !o && closeTest(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "w-[calc(100vw-2rem)] sm:max-w-md overflow-hidden p-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `px-6 pt-6 pb-5 text-white ${testResult.status === "success" ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500" : testResult.status === "error" ? "bg-gradient-to-br from-rose-500 via-red-500 to-orange-500" : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-white/30",
									children: [
										testResult.status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin" }),
										testResult.status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" }),
										testResult.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-6 w-6" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-w-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
										className: "text-left space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
											className: "text-white text-lg flex items-center gap-2 break-words",
											children: [testResult.title, testResult.status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 opacity-90" })]
										}), testResult.to && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
											className: "text-white/85 text-xs",
											children: [
												testResult.kind === "email" ? "Recipient" : "Sent to",
												": ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: testResult.to
												})
											]
										})]
									})
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-6 py-5 space-y-3",
							children: [
								testResult.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground leading-relaxed",
									children: testResult.detail
								}),
								testResult.meta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border bg-secondary/40 divide-y divide-border text-xs",
									children: Object.entries(testResult.meta).filter(([, v]) => v !== void 0 && v !== "").map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3 px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: k
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-right break-all max-w-[65%]",
											children: String(v)
										})]
									}, k))
								}),
								testResult.status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Alerts triggered from your app will now be delivered through this channel automatically." })]
								}),
								testResult.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Double-check credentials, port & TLS setting, and that the recipient number/email is valid." })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "px-6 pb-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: closeTest,
								className: "w-full",
								children: "Close"
							})
						})
					]
				})
			})
		]
	});
}
function Section({ icon: Icon, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-2xl p-4 sm:p-5 min-w-0 max-w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-center gap-2 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "min-w-0 break-words font-semibold",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid min-w-0 gap-4 md:grid-cols-2 [&>*]:min-w-0",
			children
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "mb-1.5 block break-words text-xs uppercase tracking-wide text-muted-foreground",
			children: label
		}), children]
	});
}
function Toggle({ label, v, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 rounded-lg border border-border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 flex-1 text-sm break-words",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: v,
				onCheckedChange: onChange
			})
		})]
	});
}
function ToggleIcon({ icon: Icon, label, v, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 rounded-lg border border-border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1 text-sm flex items-center gap-2 break-words",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 break-words",
				children: label
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: v,
				onCheckedChange: onChange
			})
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Settings",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
