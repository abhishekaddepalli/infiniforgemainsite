import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { En as CircleQuestionMark, Nn as Check, O as Star, R as ShieldCheck, Vt as Headphones, Xn as ArrowRight, Y as Rocket, Z as RefreshCw, hn as Crown, j as Sparkles, n as Zap, u as Users, v as TrendingUp } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { a as useCms } from "./cms-BQLw1hye.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { u as listTiers } from "./memberships.functions-C2eeCH5c.mjs";
import { t as MembershipBadge } from "./MembershipBadge-vyy4IIJ-.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { t as Reveal } from "./Reveal-CUxnlK3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-BL18_9oD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TRUST_STRIP = [
	{
		icon: ShieldCheck,
		label: "GST invoicing"
	},
	{
		icon: Zap,
		label: "Fixed timelines"
	},
	{
		icon: RefreshCw,
		label: "7-day money-back"
	},
	{
		icon: Headphones,
		label: "24×7 human support"
	}
];
var FAQS = [
	{
		q: "What exactly do care plans include?",
		a: "Every care plan bundles hosting, updates, monitoring and support hours for your website, servers or network — so you pay one predictable monthly fee instead of hourly bills. Growth and Enterprise add router/CCTV/NOC coverage and on-site visits."
	},
	{
		q: "Are memberships different from care plans?",
		a: "Care plans cover managed services (uptime, patching, tickets). Memberships (Silver/Gold/Platinum) unlock discounts on new projects, priority delivery, exclusive courses and access to premium digital products in your portal."
	},
	{
		q: "Do prices include GST?",
		a: "All prices are exclusive of 18% GST. You'll receive a compliant GST invoice with your GSTIN for every payment."
	},
	{
		q: "How do I pay?",
		a: "Razorpay (cards, netbanking, UPI), wallet top-ups, international cards, and NEFT/RTGS for enterprise annual contracts."
	},
	{
		q: "Do you cover networking, CCTV & internet?",
		a: "Yes — Growth and Enterprise plans include AMC for routers, switches, CCTV, NVRs, firewalls and leased-line/ISP escalations with 24×7 NOC."
	},
	{
		q: "Can you build custom software or a full website?",
		a: "Absolutely — we quote every project separately with fixed price and timeline. Members get 10–20% off and priority delivery slots."
	}
];
function PricingPage() {
	const [yearly, setYearly] = (0, import_react.useState)(true);
	const page = useCms("pricing_page");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative bg-gradient-hero overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-hero-blob" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-hero-blob",
					style: { animationDelay: "-5s" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-14 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "rounded-full border-primary/30 bg-primary/10 text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 mr-1.5" }),
								" ",
								page.eyebrow
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 100,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.05]",
								children: [
									page.title.split(" ").slice(0, -2).join(" "),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient-brand animate-gradient bg-clip-text",
										children: page.title.split(" ").slice(-2).join(" ")
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 200,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed",
								children: page.subtitle
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 280,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setYearly(false),
									className: cn("px-5 py-2 rounded-full text-sm font-medium transition-all", !yearly ? "bg-gradient-brand text-white shadow-elegant" : "text-muted-foreground hover:text-foreground"),
									children: "Monthly"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setYearly(true),
									className: cn("px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2", yearly ? "bg-gradient-brand text-white shadow-elegant" : "text-muted-foreground hover:text-foreground"),
									children: ["Yearly", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] bg-accent/20 text-accent rounded-full px-2 py-0.5 font-semibold",
										children: "Save 17%"
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 360,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground",
								children: TRUST_STRIP.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-6 w-6 rounded-full bg-accent/15 flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "h-3 w-3 text-accent" })
									}), t.label]
								}, i))
							})
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: page.plans.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 120,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("group relative h-full rounded-3xl p-8 flex flex-col transition-all duration-500", p.highlight ? "bg-gradient-dashboard text-white shadow-elegant border border-primary/30 lg:-translate-y-3 hover:-translate-y-4" : "bg-card border border-border shadow-card hover:-translate-y-1 hover:shadow-elegant"),
						children: [
							p.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -inset-px rounded-3xl bg-gradient-brand opacity-20 blur-xl group-hover:opacity-40 transition-opacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-brand text-white border-0 shadow-elegant animate-glow-pulse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 mr-1 fill-current" }), " Most popular"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("relative text-xs font-semibold uppercase tracking-wider", p.highlight ? "text-primary-glow" : "text-primary"),
								children: p.tag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: cn("relative mt-2 text-2xl font-bold", p.highlight && "text-white"),
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("text-5xl font-bold tracking-tight tabular-nums", p.highlight && "text-white"),
										children: formatINR(yearly ? Math.round(p.yearly / 12) : p.monthly)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("text-xs mt-2", p.highlight ? "text-white/60" : "text-muted-foreground"),
										children: [
											"per month · billed ",
											yearly ? `yearly at ${formatINR(p.yearly)}` : "monthly",
											" · +18% GST"
										]
									}),
									yearly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("mt-2 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full", p.highlight ? "bg-white/10 text-primary-glow" : "bg-accent/10 text-accent"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }),
											" Save ",
											formatINR(p.monthly * 12 - p.yearly),
											"/year"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: cn("relative mt-8 space-y-3 flex-1", p.highlight ? "text-white/85" : "text-foreground"),
								children: p.features.map((f, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 text-sm animate-reveal-up",
									style: { animationDelay: `${j * 60}ms` },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0", p.highlight ? "bg-white/10" : "bg-accent/15"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("h-3 w-3", p.highlight ? "text-white" : "text-accent") })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "leading-relaxed",
										children: f
									})]
								}, f + j))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: cn("relative mt-8 h-12 group/btn", p.highlight ? "bg-white text-foreground hover:bg-white/90" : "bg-gradient-brand text-white"),
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: p.cta_link || "/contact",
									children: [p.cta_label || "Get started", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" })]
								})
							})
						]
					})
				}, p.name + i))
			}), page.footnote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-center text-sm text-muted-foreground",
				children: page.footnote
			}) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					{
						icon: Users,
						value: "1,200+",
						label: "Clients delivered"
					},
					{
						icon: Rocket,
						value: "8,400+",
						label: "Projects shipped"
					},
					{
						icon: ShieldCheck,
						value: "99.99%",
						label: "Infra uptime"
					},
					{
						icon: TrendingUp,
						value: "92%",
						label: "Repeat customers"
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-6 text-center transition-all hover:-translate-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-6 w-6 text-primary mx-auto mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl font-bold tracking-tight tabular-nums",
							children: s.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mt-1",
							children: s.label
						})
					]
				}, i))
			}) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembershipsSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-2xl mx-auto mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: "Care plan comparison"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-3xl sm:text-4xl font-bold tracking-tight",
						children: "Every deliverable, side by side."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: "See exactly what's included so you can choose with confidence."
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-2xl border border-border bg-card shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border bg-secondary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left font-semibold p-5",
							children: "Included"
						}), page.plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-center font-semibold p-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("inline-block", p.highlight && "text-primary"),
								children: p.name
							})
						}, p.name))]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
						[
							"Website hosting, SSL & daily backups",
							true,
							true,
							true
						],
						[
							"Business email domain",
							true,
							true,
							true
						],
						[
							"Monthly updates & maintenance",
							true,
							true,
							true
						],
						[
							"GST invoices & Razorpay/UPI billing",
							true,
							true,
							true
						],
						[
							"Uptime monitoring (basic)",
							true,
							true,
							true
						],
						[
							"Server / VPS management (Linux + Windows)",
							false,
							true,
							true
						],
						[
							"Router · switch · firewall AMC",
							false,
							true,
							true
						],
						[
							"CCTV / NVR / IP camera support",
							false,
							true,
							true
						],
						[
							"Priority ticket SLA + phone support",
							false,
							true,
							true
						],
						[
							"Discount on new projects",
							"10%",
							"20%",
							"Custom"
						],
						[
							"Dedicated engineer + success manager",
							false,
							false,
							true
						],
						[
							"24×7 NOC monitoring & incident response",
							false,
							false,
							true
						],
						[
							"On-site visits + leased-line escalations",
							false,
							false,
							true
						],
						[
							"Custom software / IT retainer",
							false,
							false,
							true
						],
						[
							"99.99% uptime SLA + DPA",
							false,
							false,
							true
						]
					].map((row, ri) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60 last:border-0 hover:bg-secondary/30 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-5 font-medium",
							children: row[0]
						}), row.slice(1).map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-5 text-center",
							children: typeof v === "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5",
								children: v
							}) : v ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/15",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-accent" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground/50",
								children: "—"
							})
						}, i))]
					}, ri)) })]
				})
			}) })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wider text-primary",
					children: "Questions, answered"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl sm:text-4xl font-bold tracking-tight",
					children: "Frequently asked"
				})]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: FAQS.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 60,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: f.q
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground leading-relaxed",
								children: f.a
							})] })]
						})
					})
				}, i))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl bg-gradient-dashboard p-10 lg:p-16 text-white shadow-elegant",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-brand opacity-40 blur-3xl animate-hero-blob" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-green opacity-30 blur-3xl animate-hero-blob",
						style: { animationDelay: "-4s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-white/10 text-white border-white/20 mb-5",
								children: "Not sure which plan?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl font-bold tracking-tight",
								children: "Book a 20-minute strategy call."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-white/70 leading-relaxed max-w-xl",
								children: "We'll map your workflow, recommend the right plan, and migrate you from WHMCS, Zoho or spreadsheets in under a week — with a signed SLA."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									className: "bg-white text-foreground hover:bg-white/90 h-12 px-6",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/contact",
										children: ["Book a demo ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									variant: "outline",
									className: "border-white/30 text-white bg-transparent hover:bg-white/10 h-12 px-6",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/products",
										children: "Browse products"
									})
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass !bg-white/5 border-white/10 rounded-2xl p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-wider text-white/60 mb-4",
								children: "What you get on the call"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-3 text-sm",
								children: [
									"Custom pricing recommendation",
									"Live product walkthrough",
									"Migration plan & timeline",
									"GST-compliant proposal by email"
								].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary-glow mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-white/85",
										children: t
									})]
								}, t))
							})]
						})]
					})
				]
			}) })
		})
	] });
}
function MembershipsSection() {
	const list = useServerFn(listTiers);
	const { data: tiers = [] } = useQuery({
		queryKey: ["pricing-tiers-public"],
		queryFn: () => list(),
		staleTime: 6e4
	});
	const visible = tiers.filter((t) => t.slug !== "free");
	if (visible.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center max-w-2xl mx-auto mb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3.5 w-3.5" }), " Client memberships"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl sm:text-4xl font-bold tracking-tight",
					children: "Unlock priority delivery, discounts & premium content."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted-foreground leading-relaxed",
					children: "Memberships stack on top of any care plan — get discounted rates on new projects, priority engineer time, exclusive courses and premium digital downloads inside your portal."
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
			children: visible.map((t, i) => {
				const from = t.gradient_from ?? "#64748b";
				const to = t.gradient_to ?? "#475569";
				const highlight = (t.rank ?? 0) >= 2;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 80,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative h-full rounded-3xl p-7 flex flex-col bg-card border shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant",
						style: { borderColor: `${from}55` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity",
								style: { background: `linear-gradient(135deg, ${from}12, ${to}08)` }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembershipBadge, {
									slug: t.slug,
									name: t.name,
									gradientFrom: from,
									gradientTo: to,
									size: "lg"
								}), highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase tracking-wide text-white rounded-full px-2 py-0.5",
									style: { background: `linear-gradient(135deg, ${from}, ${to})` },
									children: "Popular"
								})]
							}),
							t.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "relative mt-4 text-sm text-muted-foreground leading-relaxed",
								children: t.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-4xl font-black tracking-tight",
									children: ["₹", Number(t.price_inr).toLocaleString()]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground ml-1",
									children: ["/ ", t.duration_days ? `${t.duration_days} days` : "lifetime"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "relative mt-5 space-y-2 text-sm flex-1",
								children: (t.features ?? []).map((f, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0",
										style: { background: `linear-gradient(135deg, ${from}30, ${to}20)` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: "h-3 w-3",
											style: { color: from }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "leading-relaxed",
										children: f
									})]
								}, j))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "relative mt-6 w-full text-white h-11",
								style: { background: `linear-gradient(135deg, ${from}, ${to})` },
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/portal/membership",
									children: [
										"Get ",
										t.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })
									]
								})
							})
						]
					})
				}, t.id);
			})
		})]
	});
}
//#endregion
export { PricingPage as component };
