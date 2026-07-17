import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Gt as Handshake, H as Send, R as ShieldCheck, Sn as Clock, St as Mail, Tn as CircleX, Y as Rocket, Zn as ArrowLeft, cn as ExternalLink, gt as MessageSquare, j as Sparkles, o as Wallet, pt as MousePointerClick, qn as BadgeCheck, tn as FileText, v as TrendingUp, vn as Copy, w as Target } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.affiliate-bUtYIjmh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_COMMISSION = 15;
function AffiliatePage() {
	const { user, profile, roles, loading } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		user,
		loading,
		navigate
	]);
	const isAffiliate = roles.includes("affiliate");
	const { data: application } = useQuery({
		queryKey: ["aff-application", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("module_records").select("*").eq("module", "affiliate_applications").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
			return data;
		}
	});
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-sm text-muted-foreground",
		children: "Loading…"
	});
	if (isAffiliate) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AffiliateDashboard, {});
	if (application?.status === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingCard, { application });
	if (application?.status === "denied") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeniedCard, {
		application: { metadata: application.metadata ?? {} },
		onReapply: () => qc.invalidateQueries({ queryKey: ["aff-application"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplyCard, {
		onSubmitted: () => qc.invalidateQueries({ queryKey: ["aff-application"] }),
		profile,
		userEmail: user.email ?? ""
	});
}
function ApplyCard({ onSubmitted, profile, userEmail }) {
	const { user } = useAuth();
	const [audience, setAudience] = (0, import_react.useState)("");
	const [channels, setChannels] = (0, import_react.useState)("");
	const [website, setWebsite] = (0, import_react.useState)("");
	const [social, setSocial] = (0, import_react.useState)("");
	const [experience, setExperience] = (0, import_react.useState)("");
	const [expected, setExpected] = (0, import_react.useState)("");
	const [payout, setPayout] = (0, import_react.useState)("UPI");
	const [payoutId, setPayoutId] = (0, import_react.useState)("");
	const submit = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("Not signed in");
			if (!audience || !channels) throw new Error("Tell us about your audience and channels");
			const { error } = await supabase.from("module_records").insert({
				module: "affiliate_applications",
				customer_id: user.id,
				title: profile?.full_name ?? userEmail,
				subtitle: `Applied ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}`,
				status: "pending",
				amount_inr: 0,
				tags: ["application"],
				metadata: {
					email: userEmail,
					audience,
					channels,
					website,
					social,
					experience,
					expected_monthly_referrals: expected,
					payout_method: payout,
					payout_identifier: payoutId
				}
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Application submitted — we'll review within 48 hours");
			onSubmitted();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 lg:px-6 py-8 space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					className: "w-fit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/portal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), " Portal"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 lg:p-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 mr-1" }), " Partner Program"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight",
								children: [
									"Earn up to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "30%"
									}),
									" lifetime commission"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm lg:text-base text-muted-foreground mt-2 max-w-2xl",
								children: "Join the Infiniforge Affiliate Program. Refer businesses to our cloud, hosting, SaaS and IT services — earn recurring commissions on every paid customer, forever."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 grid gap-4 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perk, {
										icon: Target,
										title: "Category-based rates",
										desc: "Higher % on hosting, licenses & SaaS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perk, {
										icon: ShieldCheck,
										title: "Lifetime tracking",
										desc: "Cookie-less, first-touch attribution"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perk, {
										icon: Rocket,
										title: "Marketing kit",
										desc: "Ready templates, banners & pitch decks"
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 lg:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: "Apply to become an affiliate"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mb-6",
							children: "Tell us how you'll promote Infiniforge. Approval usually within 48 hours."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Primary audience *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: audience,
										onChange: (e) => setAudience(e.target.value),
										placeholder: "e.g. Indian SMB owners, developers, agencies"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Promotion channels *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: channels,
										onChange: (e) => setChannels(e.target.value),
										placeholder: "YouTube, Blog, WhatsApp, Instagram…"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Website / Blog",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: website,
										onChange: (e) => setWebsite(e.target.value),
										placeholder: "https://…"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Social handles",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: social,
										onChange: (e) => setSocial(e.target.value),
										placeholder: "@handle, links…"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Expected monthly referrals",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: expected,
										onChange: (e) => setExpected(e.target.value),
										placeholder: "e.g. 20-50"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Preferred payout",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "h-9 w-full rounded-md border border-input bg-background px-3 text-sm",
										value: payout,
										onChange: (e) => setPayout(e.target.value),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "UPI" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Bank Transfer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Wallet Credit" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "UPI ID / Account number",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: payoutId,
										onChange: (e) => setPayoutId(e.target.value),
										placeholder: "you@upi or account no."
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "md:col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Why should we partner with you?",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											rows: 4,
											value: experience,
											onChange: (e) => setExperience(e.target.value),
											placeholder: "Tell us about your experience, past partnerships, content strategy…"
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center justify-between flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"By applying you agree to our ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://docs.infiniforge.cloud/affiliates",
										target: "_blank",
										rel: "noreferrer",
										className: "text-primary hover:underline",
										children: "Affiliate Terms"
									}),
									"."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								onClick: () => submit.mutate(),
								disabled: submit.isPending,
								children: submit.isPending ? "Submitting…" : "Submit application"
							})]
						})
					]
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs font-medium",
			children: label
		}), children]
	});
}
function Perk({ icon: Icon, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-background/60 backdrop-blur p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center mb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: desc
			})
		]
	});
}
function PendingCard({ application }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-secondary/40 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md w-full rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto h-14 w-14 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-7 w-7 text-amber-500" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold",
					children: "Application under review"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground mt-2",
					children: [
						"Submitted on ",
						new Date(application.created_at).toLocaleDateString("en-IN"),
						". Our team typically approves within 48 hours — we'll notify you by email."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "mt-5",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/portal",
						children: "Back to portal"
					})
				})
			]
		})
	});
}
function DeniedCard({ application, onReapply }) {
	const reason = application.metadata?.denial_reason ?? "Please contact support for details.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-secondary/40 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md w-full rounded-2xl border border-rose-500/30 bg-rose-500/[0.04] p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto h-14 w-14 rounded-2xl bg-rose-500/15 flex items-center justify-center mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-7 w-7 text-rose-500" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold",
					children: "Application not approved"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-2",
					children: reason
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex gap-2 justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/portal",
							children: "Back"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: onReapply,
						children: "Reapply"
					})]
				})
			]
		})
	});
}
function AffiliateDashboard() {
	const { user, profile } = useAuth();
	const qc = useQueryClient();
	const affiliateCode = user?.id.slice(0, 8).toUpperCase() ?? "";
	const affLink = typeof window !== "undefined" ? `${window.location.origin}/?aff=${affiliateCode}` : `/?aff=${affiliateCode}`;
	const { data: conversions = [] } = useQuery({
		queryKey: ["aff-conversions", user?.id],
		enabled: !!user,
		queryFn: async () => (await supabase.from("module_records").select("*").eq("module", "affiliates").eq("customer_id", user.id).order("created_at", { ascending: false })).data ?? []
	});
	const { data: wallet } = useQuery({
		queryKey: ["aff-wallet", user?.id],
		enabled: !!user,
		queryFn: async () => (await supabase.from("wallets").select("*").eq("user_id", user.id).maybeSingle()).data
	});
	const { data: rules = [] } = useQuery({
		queryKey: ["aff-rules"],
		queryFn: async () => (await supabase.from("module_records").select("*").eq("module", "affiliate_rules").eq("status", "active").order("amount_inr", { ascending: false })).data ?? []
	});
	const { data: templates = [] } = useQuery({
		queryKey: ["aff-templates"],
		queryFn: async () => (await supabase.from("module_records").select("*").eq("module", "affiliate_templates").eq("status", "active").order("created_at", { ascending: false })).data ?? []
	});
	const stats = (0, import_react.useMemo)(() => {
		const clicks = conversions.filter((c) => c.tags?.includes("click")).length;
		const paid = conversions.filter((c) => c.status === "paid" || c.status === "converted");
		const pending = conversions.filter((c) => c.status === "pending");
		return {
			clicks,
			conversions: paid.length,
			commissionEarned: paid.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0),
			commissionPending: pending.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0)
		};
	}, [conversions]);
	const requestPayout = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("Not signed in");
			if (stats.commissionEarned < 1e3) throw new Error("Minimum payout is ₹1,000");
			const { error } = await supabase.from("tickets").insert({
				customer_id: user.id,
				subject: `Affiliate payout — ${formatINR(stats.commissionEarned)}`,
				description: `Affiliate ${affiliateCode} requesting payout of ${formatINR(stats.commissionEarned)}.`,
				status: "open",
				priority: "high",
				department: "billing"
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Payout request submitted");
			qc.invalidateQueries({ queryKey: ["portal-tickets"] });
		},
		onError: (e) => toast.error(e.message)
	});
	function copy(text, label = "Copied") {
		navigator.clipboard?.writeText(text).then(() => toast.success(label)).catch(() => {});
	}
	function renderTemplate(body) {
		return body.replace(/\{\{link\}\}/g, affLink).replace(/\{\{code\}\}/g, affiliateCode).replace(/\{\{name\}\}/g, profile?.full_name ?? "");
	}
	function shareTemplate(body, channel) {
		const msg = renderTemplate(body);
		if (channel === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
		else if (channel === "email") window.location.href = `mailto:?subject=${encodeURIComponent("Try Infiniforge")}&body=${encodeURIComponent(msg)}`;
		else copy(msg, "Copied to clipboard");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 lg:px-6 py-8 space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					className: "w-fit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/portal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), " Portal"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "mb-2 inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-3 w-3" }), " Affiliate Partner"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2 truncate",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: "Affiliate dashboard"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-muted-foreground mt-1",
								children: "Track clicks, conversions, commissions and share marketing templates."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "shrink-0 sm:size-default",
						onClick: () => requestPayout.mutate(),
						disabled: requestPayout.isPending || stats.commissionEarned < 1e3,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 sm:mr-1.5" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Request payout"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: MousePointerClick,
							label: "Clicks",
							value: String(stats.clicks)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: TrendingUp,
							label: "Conversions",
							value: String(stats.conversions)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: Wallet,
							label: "Commission earned",
							value: formatINR(stats.commissionEarned),
							accent: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							icon: Clock,
							label: "Pending",
							value: formatINR(stats.commissionPending)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-primary/20 bg-primary/[0.04] p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-4 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-[240px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: "Your affiliate link"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Cookie-less lifetime attribution. Every paid signup earns commission."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "flex-1 min-w-[240px] text-xs font-mono bg-background rounded-lg px-3 py-2.5 border border-border truncate",
											children: affLink
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => copy(affLink, "Link copied"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5 mr-1.5" }), " Copy"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => shareTemplate(`Check out Infiniforge — cloud, hosting & SaaS: ${affLink}`, "whatsapp"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5 mr-1.5" }), " WhatsApp"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 text-xs text-muted-foreground",
									children: ["Code: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "font-mono text-foreground",
										children: affiliateCode
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-background p-4 min-w-[200px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Wallet balance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-bold mt-1",
									children: formatINR(Number(wallet?.balance_inr ?? 0))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "mt-2 w-full",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/portal/wallet",
										children: "Manage"
									})
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-base font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-primary" }), " Commission rates"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Category / product-specific rates set by admin."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-0 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border",
						children: rules.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6 text-sm text-muted-foreground col-span-full text-center",
							children: [
								"Default: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
									className: "text-foreground",
									children: [DEFAULT_COMMISSION, "%"]
								}),
								" on all paid orders."
							]
						}) : rules.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: r.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: r.subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 text-xl font-bold text-primary",
									children: [Number(r.amount_inr ?? 0), "%"]
								})
							]
						}, r.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-base font-semibold",
								children: "Conversion history"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "All tracked clicks, signups and paid conversions"
							})]
						}), conversions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-10 text-center text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointerClick, { className: "h-8 w-8 mx-auto mb-2 opacity-40" }), "No activity yet. Share your link to start earning."]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border max-h-[420px] overflow-y-auto",
							children: conversions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 flex items-center gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-9 w-9 rounded-lg bg-secondary flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-primary" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium truncate",
											children: c.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: c.subtitle ?? new Date(c.created_at).toLocaleString("en-IN")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-semibold",
											children: formatINR(Number(c.amount_inr ?? 0))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-[10px] capitalize",
											children: c.status
										})]
									})
								]
							}, c.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 border-b border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-base font-semibold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), " Marketing templates"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Copy-paste, or share instantly."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 space-y-3 max-h-[420px] overflow-y-auto",
								children: templates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground text-center py-6",
									children: "No templates yet. Admin can add attractive templates for you to share."
								}) : templates.map((t) => {
									const meta = t.metadata ?? {};
									const body = meta.body ?? t.subtitle ?? "";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-background/60 p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 mb-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-primary" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-sm font-semibold truncate flex-1",
														children: t.title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "secondary",
														className: "text-[10px] capitalize",
														children: meta.channel ?? "post"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4",
												children: renderTemplate(body)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex flex-wrap gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "outline",
														className: "h-7 text-xs",
														onClick: () => shareTemplate(body, "copy"),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3 mr-1" }), " Copy"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "outline",
														className: "h-7 text-xs",
														onClick: () => shareTemplate(body, "whatsapp"),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3 w-3 mr-1" }), " WhatsApp"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "outline",
														className: "h-7 text-xs",
														onClick: () => shareTemplate(body, "email"),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3 mr-1" }), " Email"]
													})
												]
											})
										]
									}, t.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-border p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "https://docs.infiniforge.cloud/affiliates",
									target: "_blank",
									rel: "noreferrer",
									className: "text-xs text-primary hover:underline inline-flex items-center gap-1",
									children: ["Affiliate handbook ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
								})
							})
						]
					})]
				})
			]
		})
	});
}
function Stat({ icon: Icon, label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `h-8 w-8 rounded-lg flex items-center justify-center ${accent ? "bg-primary/15" : "bg-secondary"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${accent ? "text-primary" : "text-primary"}` })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 text-2xl font-bold tracking-tight",
			children: value
		})]
	});
}
//#endregion
export { AffiliatePage as component };
