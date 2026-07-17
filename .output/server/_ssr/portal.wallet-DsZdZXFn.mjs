import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Et as LoaderCircle, R as ShieldCheck, Zn as ArrowLeft, o as Wallet, rt as Plus, v as TrendingUp, y as TrendingDown } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { a as verifyWalletTopup, r as createWalletTopup } from "./payments.functions-C2aKgYFM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.wallet-DsZdZXFn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function loadRzp() {
	return new Promise((r) => {
		if (typeof window === "undefined") return r(false);
		if (window.Razorpay) return r(true);
		const s = document.createElement("script");
		s.src = "https://checkout.razorpay.com/v1/checkout.js";
		s.onload = () => r(true);
		s.onerror = () => r(false);
		document.body.appendChild(s);
	});
}
var QUICK = [
	500,
	1e3,
	2500,
	5e3,
	1e4
];
function WalletPage() {
	const { user, profile, loading } = useAuth();
	const navigate = useNavigate();
	const [amount, setAmount] = (0, import_react.useState)(1e3);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [reloadKey, setReloadKey] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	const { data: wallet, refetch: refetchWallet } = useQuery({
		queryKey: [
			"wallet",
			user?.id,
			reloadKey
		],
		enabled: !!user,
		queryFn: async () => (await supabase.from("wallets").select("*").eq("user_id", user.id).maybeSingle()).data
	});
	const { data: txns, refetch: refetchTxns } = useQuery({
		queryKey: [
			"wallet-txns",
			user?.id,
			reloadKey
		],
		enabled: !!user,
		queryFn: async () => (await supabase.from("wallet_transactions").select("*").eq("wallet_id", (await supabase.from("wallets").select("id").eq("user_id", user.id).maybeSingle()).data?.id ?? "").order("created_at", { ascending: false }).limit(30)).data ?? []
	});
	async function handleTopup() {
		if (!user) return;
		if (amount < 100) {
			toast.error("Minimum ₹100");
			return;
		}
		setBusy(true);
		try {
			const res = await createWalletTopup({ data: { amount_inr: amount } });
			if (res.demo) {
				toast.success(`₹${amount} credited (demo mode)`);
				setReloadKey((k) => k + 1);
				refetchWallet();
				refetchTxns();
				return;
			}
			if (!await loadRzp() || !window.Razorpay) throw new Error("Razorpay SDK failed");
			new window.Razorpay({
				key: res.razorpay_key_id,
				order_id: res.razorpay_order_id,
				amount: res.amount_inr * 100,
				currency: "INR",
				name: "Infiniforge Wallet",
				description: "Wallet top-up",
				prefill: {
					name: profile?.full_name ?? "",
					email: user.email ?? ""
				},
				theme: { color: "#FF9933" },
				handler: async (r) => {
					try {
						await verifyWalletTopup({ data: {
							...r,
							amount_inr: res.amount_inr
						} });
						toast.success(`Wallet credited ${formatINR(res.amount_inr)}`);
						setReloadKey((k) => k + 1);
						refetchWallet();
						refetchTxns();
					} catch (e) {
						toast.error(e instanceof Error ? e.message : "Verification failed");
					}
				},
				modal: { ondismiss: () => setBusy(false) }
			}).open();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Top-up failed");
		} finally {
			setBusy(false);
		}
	}
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-secondary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "h-16 border-b border-border bg-background/85 backdrop-blur sticky top-0 z-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-4xl h-full px-4 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/portal",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: "Wallet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted-foreground",
					children: "Top up and use credit at checkout"
				})] })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-4xl px-4 py-8 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-gradient-brand text-white p-8 flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-wider text-white/80",
								children: "Current balance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-4xl font-bold mt-1",
								children: formatINR(Number(wallet?.balance_inr ?? 0))
							}),
							wallet?.frozen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "mt-2 bg-white/25 text-white border-0",
								children: "Frozen"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add funds"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: QUICK.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setAmount(q),
								className: cn("px-4 py-2 rounded-lg text-sm font-medium border transition-colors", amount === q ? "bg-gradient-brand text-white border-transparent" : "bg-background border-border hover:border-primary/40"),
								children: ["₹", q.toLocaleString("en-IN")]
							}, q))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Custom amount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 100,
									value: amount,
									onChange: (e) => setAmount(Number(e.target.value) || 0)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-gradient-brand text-white h-11 px-8",
								onClick: handleTopup,
								disabled: busy || wallet?.frozen,
								children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : `Add ${formatINR(amount)}`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-muted-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-accent" }), " Secured by Razorpay · UPI / Cards / Netbanking"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-5 border-b border-border font-semibold",
						children: "Transaction history"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [(txns ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-8 text-center text-sm text-muted-foreground",
							children: "No transactions yet"
						}), (txns ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("h-9 w-9 rounded-lg flex items-center justify-center", t.type === "credit" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"),
									children: t.type === "credit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium truncate",
										children: t.note ?? t.description ?? t.type
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: new Date(t.created_at).toLocaleString("en-IN")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("font-semibold", t.type === "credit" ? "text-accent" : "text-destructive"),
									children: [t.type === "credit" ? "+" : "", formatINR(Number(t.amount_inr))]
								})
							]
						}, t.id))]
					})]
				})
			]
		})]
	});
}
//#endregion
export { WalletPage as component };
