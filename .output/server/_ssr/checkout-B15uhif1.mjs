import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Et as LoaderCircle, I as ShoppingBag, On as CircleCheck, R as ShieldCheck, St as Mail, b as Trash2, f as UserPlus, ht as Minus, j as Sparkles, nn as FileDown, o as Wallet, rt as Plus, tn as FileText, wt as LogIn } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { t as Checkbox } from "./checkbox-B1AjkRkB.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { n as downloadInvoicePdf, t as downloadInvoiceCsv } from "./invoice-CHhlY2Nm.mjs";
import { a as useCart, i as getWalletEligibleTypes } from "./cart-B06bdZ_b.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { i as verifyPayment, n as createCheckout, t as confirmDemoPayment } from "./payments.functions-C2aKgYFM.mjs";
import { t as WhatsAppOrderButton } from "./WhatsAppOrderButton-COEOsE3v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-B15uhif1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INDIAN_STATES = [
	"Andhra Pradesh",
	"Arunachal Pradesh",
	"Assam",
	"Bihar",
	"Chhattisgarh",
	"Goa",
	"Gujarat",
	"Haryana",
	"Himachal Pradesh",
	"Jharkhand",
	"Karnataka",
	"Kerala",
	"Madhya Pradesh",
	"Maharashtra",
	"Manipur",
	"Meghalaya",
	"Mizoram",
	"Nagaland",
	"Odisha",
	"Punjab",
	"Rajasthan",
	"Sikkim",
	"Tamil Nadu",
	"Telangana",
	"Tripura",
	"Uttar Pradesh",
	"Uttarakhand",
	"West Bengal",
	"Andaman and Nicobar Islands",
	"Chandigarh",
	"Dadra and Nagar Haveli and Daman and Diu",
	"Delhi",
	"Jammu and Kashmir",
	"Ladakh",
	"Lakshadweep",
	"Puducherry"
];
/**
* Inline auth surface for the checkout page.
* - signin: existing account
* - signup: create account with password
* - guest: enter email → we create the account with a random password and
*          email a password-setup link (via resetPasswordForEmail).
* Calls `onAuthenticated` once a session exists so checkout can proceed.
*/
function CheckoutAuthPanel({ defaultEmail = "", defaultName = "", defaultPhone = "", onAuthenticated }) {
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)(defaultEmail);
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)(defaultName);
	const [phone, setPhone] = (0, import_react.useState)(defaultPhone);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [guestSent, setGuestSent] = (0, import_react.useState)(false);
	async function handleSignIn(e) {
		e.preventDefault();
		if (!email || !password) return toast.error("Enter email and password");
		setBusy(true);
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (error) throw error;
			toast.success("Signed in — you can complete your order");
			onAuthenticated();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Sign-in failed");
		} finally {
			setBusy(false);
		}
	}
	async function handleSignUp(e) {
		e.preventDefault();
		if (!email || !password || password.length < 8) return toast.error("Password must be at least 8 characters");
		setBusy(true);
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/checkout`,
					data: {
						full_name: name || void 0,
						phone: phone || void 0
					}
				}
			});
			if (error) throw error;
			if (data.session) {
				toast.success("Account created — completing your order");
				onAuthenticated();
			} else toast.success("Check your inbox to verify your email, then return to complete payment.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Sign-up failed");
		} finally {
			setBusy(false);
		}
	}
	async function handleGuest(e) {
		e.preventDefault();
		if (!email) return toast.error("Enter your email to continue");
		setBusy(true);
		try {
			const rand = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(24));
			const tempPassword = Array.from(rand).map((b) => b.toString(36)).join("") + "Aa1!";
			const { data, error } = await supabase.auth.signUp({
				email,
				password: tempPassword,
				options: {
					emailRedirectTo: `${window.location.origin}/checkout`,
					data: {
						full_name: name || void 0,
						phone: phone || void 0
					}
				}
			});
			if (error && !/already|registered|exists/i.test(error.message)) throw error;
			await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
			if (data?.session) {
				toast.success("Account created — password setup link sent to your email");
				onAuthenticated();
			} else {
				setGuestSent(true);
				toast.success("Password setup link sent — check your email");
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not start guest checkout");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-accent/[0.04] p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold",
						children: "Sign in to complete your order"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex rounded-full border border-border bg-background p-0.5 text-xs",
					children: [
						"signin",
						"signup",
						"guest"
					].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setMode(m);
							setGuestSent(false);
						},
						className: `px-3 py-1.5 rounded-full transition ${mode === m ? "bg-gradient-brand text-white" : "text-muted-foreground hover:text-foreground"}`,
						children: m === "signin" ? "Sign in" : m === "signup" ? "Create account" : "Guest checkout"
					}, m))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground mt-2",
				children: [
					mode === "signin" && "Use your existing Infiniforge account.",
					mode === "signup" && "Create a new account — required for order history, wallet & invoices.",
					mode === "guest" && "Enter your email — we'll create your account and email a link to set your password. Your order will be linked to it."
				]
			}),
			mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSignIn,
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: busy,
						className: "sm:col-span-2 bg-gradient-brand text-white",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4 mr-2" }), " Sign in & continue"]
					})
				]
			}),
			mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSignUp,
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						placeholder: "+91 98xxxxxxxx"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						minLength: 8,
						placeholder: "Min 8 characters",
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: busy,
						className: "sm:col-span-2 bg-gradient-brand text-white",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4 mr-2" }), " Create account & continue"]
					})
				]
			}),
			mode === "guest" && (guestSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl border border-accent/30 bg-accent/[0.06] p-4 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-semibold",
						children: ["Password setup link sent to ", email]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-xs mt-1",
						children: "Open the email, set a password, then return here to complete your payment. Your billing details will be pre-filled."
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleGuest,
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						placeholder: "+91 98xxxxxxxx"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true,
							placeholder: "you@company.com"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: busy,
						className: "sm:col-span-2 bg-gradient-brand text-white",
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 mr-2" }), " Send password setup link"]
					})
				]
			}))
		]
	});
}
function loadRazorpay() {
	return new Promise((resolve) => {
		if (typeof window === "undefined") return resolve(false);
		if (window.Razorpay) return resolve(true);
		const s = document.createElement("script");
		s.src = "https://checkout.razorpay.com/v1/checkout.js";
		s.onload = () => resolve(true);
		s.onerror = () => resolve(false);
		document.body.appendChild(s);
	});
}
function CheckoutPage() {
	const { items, setQty, remove, subtotal, gst, total, clear } = useCart();
	const { user, profile, loading: authLoading } = useAuth();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [gstin, setGstin] = (0, import_react.useState)("");
	const [addr1, setAddr1] = (0, import_react.useState)("");
	const [addr2, setAddr2] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [stateName, setStateName] = (0, import_react.useState)("");
	const [postal, setPostal] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("India");
	const [saveProfile, setSaveProfile] = (0, import_react.useState)(true);
	const [coupon, setCoupon] = (0, import_react.useState)("");
	const [useWallet, setUseWallet] = (0, import_react.useState)(false);
	const [walletBal, setWalletBal] = (0, import_react.useState)(0);
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const [successOrders, setSuccessOrders] = (0, import_react.useState)(null);
	async function loadOrders(ids) {
		if (!ids.length) return [];
		const { data } = await supabase.from("orders").select("*").in("id", ids);
		return data ?? [];
	}
	(0, import_react.useEffect)(() => {
		if (profile?.full_name) setName(profile.full_name);
		if (user?.email) setEmail(user.email);
		if (profile?.phone) setPhone(profile.phone);
		if (profile?.gstin) setGstin(profile.gstin);
		if (profile?.address_line1) setAddr1(profile.address_line1);
		if (profile?.address_line2) setAddr2(profile.address_line2);
		if (profile?.city) setCity(profile.city);
		if (profile?.state) setStateName(profile.state);
		if (profile?.postal_code) setPostal(profile.postal_code);
		if (profile?.country) setCountry(profile.country);
	}, [profile, user]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		supabase.from("wallets").select("balance_inr").eq("user_id", user.id).maybeSingle().then(({ data }) => setWalletBal(Number(data?.balance_inr ?? 0)));
	}, [user]);
	const eligibleTypes = getWalletEligibleTypes();
	const ineligibleItems = items.filter((i) => i.product_type && !eligibleTypes.includes(i.product_type));
	const walletAllowed = ineligibleItems.length === 0;
	const walletApply = useWallet && walletAllowed ? Math.min(walletBal, total) : 0;
	const payable = Math.max(0, total - walletApply);
	async function handlePay() {
		if (!user) {
			toast.info("Sign in, create an account, or use guest checkout above to continue");
			document.getElementById("checkout-auth-panel")?.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
			return;
		}
		if (items.length === 0) {
			toast.error("Your cart is empty");
			return;
		}
		if (!name.trim() || !email.trim()) {
			toast.error("Name and email required");
			return;
		}
		if (!addr1.trim() || !city.trim() || !stateName.trim() || !postal.trim()) {
			toast.error("Billing address, city, state and PIN code are required for GST invoicing");
			return;
		}
		setProcessing(true);
		try {
			const res = await createCheckout({ data: {
				items: items.map((i) => ({
					id: i.id,
					name: i.name,
					price_inr: i.price_inr,
					gst_percent: i.gst_percent,
					qty: i.qty,
					billing: i.billing
				})),
				customer_name: name,
				customer_email: email,
				customer_phone: phone || void 0,
				gstin: gstin || void 0,
				coupon_code: coupon || void 0,
				use_wallet: useWallet,
				billing_address_line1: addr1 || void 0,
				billing_address_line2: addr2 || void 0,
				billing_city: city || void 0,
				billing_state: stateName || void 0,
				billing_postal_code: postal || void 0,
				billing_country: country || void 0,
				save_to_profile: saveProfile
			} });
			if (res.fully_wallet) {
				const orders = await loadOrders(res.order_ids);
				clear();
				setSuccessOrders(orders);
				toast.success("Order placed — paid with wallet");
				return;
			}
			if (res.demo && !res.razorpay_key_id) {
				await confirmDemoPayment({ data: {
					order_ids: res.order_ids,
					order_group: res.order_group
				} });
				const orders = await loadOrders(res.order_ids);
				clear();
				setSuccessOrders(orders);
				toast.success(`Payment successful (demo). Invoice ${res.invoice_number}`);
				return;
			}
			if (!await loadRazorpay() || !window.Razorpay) throw new Error("Razorpay SDK failed to load");
			new window.Razorpay({
				key: res.razorpay_key_id,
				order_id: res.razorpay_order_id,
				amount: Math.round(res.payable_inr * 100),
				currency: "INR",
				name: "Infiniforge Technologies",
				description: `Order ${res.order_group}`,
				prefill: {
					name,
					email,
					contact: phone
				},
				theme: { color: "#FF9933" },
				handler: async (resp) => {
					try {
						await verifyPayment({ data: {
							...resp,
							order_ids: res.order_ids
						} });
						const orders = await loadOrders(res.order_ids);
						clear();
						setSuccessOrders(orders);
						toast.success(`Payment successful. Invoice ${res.invoice_number}`);
					} catch (e) {
						toast.error(e instanceof Error ? e.message : "Payment verification failed");
					}
				},
				modal: { ondismiss: () => setProcessing(false) }
			}).open();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Checkout failed");
		} finally {
			setProcessing(false);
		}
	}
	if (successOrders) {
		const grandTotal = successOrders.reduce((s, o) => s + Number(o.total_inr), 0);
		const gstTotal = successOrders.reduce((s, o) => s + Number(o.gst_inr), 0);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-accent/30 bg-accent/[0.05] p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto h-14 w-14 rounded-full bg-accent/15 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8 text-accent" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-2xl sm:text-3xl font-bold",
						children: "Payment successful"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground mt-2",
						children: [
							"Your GST invoice",
							successOrders.length > 1 ? "s are" : " is",
							" ready. Download a copy for your records."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-3 text-left",
						children: successOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-4 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 rounded-lg bg-gradient-brand/10 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-primary" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold truncate",
										children: o.product_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] font-mono text-muted-foreground",
										children: [
											o.invoice_number ?? o.order_number,
											" · GST ",
											formatINR(Number(o.gst_inr))
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: formatINR(Number(o.total_inr))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => downloadInvoicePdf(o),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 mr-1.5" }), " PDF"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => downloadInvoiceCsv(o),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-3.5 w-3.5 mr-1.5" }), " CSV"]
								})
							]
						}, o.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 text-xs text-muted-foreground",
						children: [
							"Total paid ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: formatINR(grandTotal)
							}),
							" · GST included ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: formatINR(gstTotal)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "bg-gradient-brand text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/portal",
								children: "Go to my portal"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/products",
								children: "Continue shopping"
							})
						})]
					})
				]
			})
		}) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "rounded-full border-primary/30 bg-primary/10 text-primary",
					children: "Secure checkout"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-3xl sm:text-4xl font-bold",
					children: "Review your order"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-2",
					children: "GST-compliant invoice sent instantly to your email — PDF & CSV download after payment."
				})
			]
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-dashed border-border p-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-10 w-10 mx-auto text-muted-foreground/60 mb-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold",
					children: "Your cart is empty"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Add products to continue."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-5 bg-gradient-brand text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products",
						children: "Browse products"
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 space-y-6",
				children: [
					!user && !authLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "checkout-auth-panel",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutAuthPanel, {
							defaultEmail: email,
							defaultName: name,
							defaultPhone: phone,
							onAuthenticated: () => {}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border bg-card divide-y divide-border",
						children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 grid gap-3 grid-cols-[auto_minmax(0,1fr)_auto] sm:flex sm:items-center sm:gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-12 w-12 shrink-0 rounded-xl bg-gradient-brand/10 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-5 w-5 text-primary" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 sm:flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium truncate",
										children: i.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground truncate",
										children: [
											formatINR(i.price_inr),
											" · ",
											i.billing === "one-time" ? "one-time" : `per ${i.billing}`,
											" · GST ",
											i.gst_percent,
											"%"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "text-destructive shrink-0 sm:order-last",
									onClick: () => remove(i.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:contents",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 shrink-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "outline",
												className: "h-8 w-8",
												onClick: () => setQty(i.id, i.qty - 1),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-8 text-center text-sm font-semibold",
												children: i.qty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "outline",
												className: "h-8 w-8",
												onClick: () => setQty(i.id, i.qty + 1),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-right sm:w-28",
										children: formatINR(i.price_inr * i.qty)
									})]
								})
							]
						}, i.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: "Billing details"
								}), user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/portal/profile",
									className: "text-xs text-primary hover:underline",
									children: "Edit saved profile →"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: name,
										onChange: (e) => setName(e.target.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: phone,
										onChange: (e) => setPhone(e.target.value),
										placeholder: "+91 98xxxxxxxx"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GSTIN (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: gstin,
										onChange: (e) => setGstin(e.target.value.toUpperCase()),
										placeholder: "22AAAAA0000A1Z5"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-border/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3",
									children: "Billing address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address line 1 *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: addr1,
												onChange: (e) => setAddr1(e.target.value),
												placeholder: "Flat / Building / Street"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address line 2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: addr2,
												onChange: (e) => setAddr2(e.target.value),
												placeholder: "Area / Landmark"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: city,
											onChange: (e) => setCity(e.target.value)
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm",
											value: stateName,
											onChange: (e) => setStateName(e.target.value),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Select state…"
											}), INDIAN_STATES.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: st,
												children: st
											}, st))]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PIN code *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: postal,
											onChange: (e) => setPostal(e.target.value),
											placeholder: "560001"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Country" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: country,
											onChange: (e) => setCountry(e.target.value)
										})] })
									]
								})]
							}),
							user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-xs text-muted-foreground cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: saveProfile,
									onCheckedChange: (v) => setSaveProfile(!!v)
								}), "Save these details to my profile for faster checkout next time"]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 h-fit sticky top-20 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: "Order summary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Subtotal",
								value: formatINR(subtotal)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "GST",
								value: formatINR(gst)
							}),
							walletApply > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Wallet applied",
								value: `− ${formatINR(walletApply)}`,
								accent: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 mt-2 border-t border-border flex justify-between font-semibold text-base",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payable" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR(payable) })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Coupon code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: coupon,
							onChange: (e) => setCoupon(e.target.value.toUpperCase()),
							placeholder: "WELCOME10"
						})]
					}),
					user && walletBal > 0 && walletAllowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm p-3 rounded-lg bg-secondary cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: useWallet,
								onCheckedChange: (v) => setUseWallet(!!v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Use wallet (",
								formatINR(walletBal),
								")"
							] })
						]
					}),
					user && walletBal > 0 && !walletAllowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] rounded-lg bg-amber-500/10 border border-amber-500/25 p-2.5 text-amber-700 dark:text-amber-300",
						children: [
							"Wallet cannot be used — your cart contains items (",
							ineligibleItems.map((i) => i.product_type).join(", "),
							") that require a payment gateway. Wallet is available for subscriptions, licenses, digital products & services only."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full bg-gradient-brand text-white h-11",
						onClick: handlePay,
						disabled: processing || authLoading,
						children: processing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }), " Processing…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Pay ", formatINR(payable)] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppOrderButton, {
						surface: "checkout",
						className: "w-full h-11 border-[#25D366]/40 hover:bg-[#25D366]/10",
						items: items.map((i) => ({
							name: i.name,
							qty: i.qty,
							price_inr: i.price_inr
						})),
						total_inr: payable,
						customer_name: name,
						customer_phone: phone,
						note: gstin ? `GSTIN: ${gstin}` : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-accent" }), " Secure payments · Razorpay · UPI/Cards/Netbanking"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] rounded-lg bg-primary/[0.06] border border-primary/15 p-2.5 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Running in ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "demo mode" }),
							" until ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "RAZORPAY_KEY_ID" }),
							" and ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "RAZORPAY_KEY_SECRET" }),
							" are set — payments are simulated but orders, invoices, wallet flows all persist."
						] })]
					})
				]
			})]
		})]
	}) });
}
function Row({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: accent ? "text-accent font-medium" : "",
			children: value
		})]
	});
}
//#endregion
export { CheckoutPage as component };
