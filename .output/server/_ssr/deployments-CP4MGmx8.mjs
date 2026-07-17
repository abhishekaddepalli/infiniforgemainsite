import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { C as Terminal, Hn as Boxes, R as ShieldCheck, U as Search, V as Server, Xn as ArrowRight, Y as Rocket, _n as Cpu, dn as Earth, er as Activity, j as Sparkles, n as Zap, xn as Cloud } from "../_libs/lucide-react.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { a as useCms } from "./cms-BQLw1hye.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { t as WhatsAppOrderButton } from "./WhatsAppOrderButton-COEOsE3v.mjs";
import { t as Reveal } from "./Reveal-CUxnlK3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deployments-CP4MGmx8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeploymentsPage() {
	const cms = useCms("deployments_page");
	const [q, setQ] = (0, import_react.useState)("");
	const [stack, setStack] = (0, import_react.useState)("all");
	const apps = (cms.apps ?? []).filter((a) => a.enabled !== false);
	const stacks = cms.stacks ?? [{
		key: "all",
		name: "All"
	}];
	const filtered = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return apps.filter((a) => {
			if (stack !== "all" && a.stack !== stack) return false;
			if (!query) return true;
			return [
				a.name,
				a.tagline,
				a.description,
				...a.tags ?? []
			].join(" ").toLowerCase().includes(query);
		});
	}, [
		q,
		stack,
		apps
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden bg-gradient-hero",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-hero-blob pointer-events-none" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl animate-hero-blob pointer-events-none",
					style: { animationDelay: "-4s" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(circle_at_20%_10%,theme(colors.primary/25),transparent_40%),radial-gradient(circle_at_80%_60%,theme(colors.accent/25),transparent_45%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "rounded-full border-accent/30 bg-accent/10 text-accent",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "mr-1.5 h-3.5 w-3.5" }),
								" ",
								cms.eyebrow
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl",
							children: cms.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed",
							children: cms.subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "bg-gradient-brand text-white shadow-elegant",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/contact",
									children: ["Talk to a deployment engineer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppOrderButton, {
								size: "lg",
								variant: "outline",
								surface: "header",
								label: "Order on WhatsApp",
								items: [{ name: "Managed App Deployment — Consultation" }],
								note: "I'd like a quote for prebuilt app deployment."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }),
										" ",
										apps.length,
										"+ apps ready"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-3.5 w-3.5 text-primary" }), " Mumbai · Delhi · Singapore · Frankfurt"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-accent" }), " GST invoiced"]
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 120,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mx-auto w-full max-w-md aspect-square",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-4 rounded-full border border-dashed border-primary/30 animate-hero-orbit-rev" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-14 rounded-full border border-dashed border-accent/30 animate-hero-orbit" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-1/4 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-elegant flex flex-col items-center justify-center p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 self-start text-[10px] text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-red-400" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-yellow-400" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-2 uppercase tracking-wider font-semibold",
													children: "deploy · live"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 h-11 w-11 rounded-2xl bg-gradient-brand text-white flex items-center justify-center shadow-elegant animate-glow-pulse",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-5 w-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 text-xs font-semibold",
											children: "99.98% uptime"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-[10px] text-muted-foreground",
											children: "Auto SSL · Backups · NOC"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex gap-0.5 items-end h-6",
											children: [
												6,
												10,
												14,
												8,
												18,
												12,
												16,
												9,
												20,
												11
											].map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-1 rounded-sm bg-gradient-to-t from-primary to-accent",
												style: {
													height: `${h * 4}%`,
													animation: `hero-float ${2 + i % 3}s ease-in-out ${i * .15}s infinite`
												}
											}, i))
										})
									]
								}),
								[
									{
										i: Boxes,
										label: "Coolify",
										angle: 0,
										delay: "0s"
									},
									{
										i: Activity,
										label: "n8n",
										angle: 45,
										delay: "-1s"
									},
									{
										i: Server,
										label: "ERPNext",
										angle: 90,
										delay: "-2s"
									},
									{
										i: Terminal,
										label: "Odoo",
										angle: 135,
										delay: "-3s"
									},
									{
										i: Cloud,
										label: "Nextcloud",
										angle: 180,
										delay: "-4s"
									},
									{
										i: Cpu,
										label: "Supabase",
										angle: 225,
										delay: "-5s"
									},
									{
										i: Earth,
										label: "WordPress",
										angle: 270,
										delay: "-6s"
									},
									{
										i: Zap,
										label: "Ghost",
										angle: 315,
										delay: "-7s"
									}
								].map(({ i: Icon, label, angle, delay }) => {
									const r = 44;
									const x = 50 + r * Math.cos(angle * Math.PI / 180);
									const y = 50 + r * Math.sin(angle * Math.PI / 180);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/60 bg-card/90 backdrop-blur px-2 py-1.5 shadow-card flex items-center gap-1.5 animate-hero-float",
										style: {
											left: `${x}%`,
											top: `${y}%`,
											animationDelay: delay
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "h-6 w-6 rounded-md bg-gradient-brand text-white flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-semibold",
											children: label
										})]
									}, label);
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							{
								icon: Zap,
								title: "1-click install",
								desc: "Live in under 30 minutes."
							},
							{
								icon: ShieldCheck,
								title: "Auto SSL & backups",
								desc: "Let's Encrypt + daily snapshots."
							},
							{
								icon: Cpu,
								title: "Right-sized VPS",
								desc: "Tuned CPU / RAM / NVMe per app."
							},
							{
								icon: Cloud,
								title: "24×7 NOC",
								desc: "Uptime, patching & incident response."
							}
						].map(({ icon: Icon, title, desc }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 80,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-4 flex items-start gap-3 transition-all hover:-translate-y-1 hover:shadow-elegant hover:border-primary/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-10 w-10 shrink-0 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-elegant",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-sm",
									children: title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: desc
								})] })]
							})
						}, title))
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col lg:flex-row lg:items-center gap-4 justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full lg:max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: `Search ${apps.length}+ apps…`,
						className: "pl-9 h-11 rounded-xl"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: stacks.map((s) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setStack(s.key),
							className: "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all " + (s.key === stack ? "bg-gradient-brand text-white border-transparent shadow-elegant" : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"),
							children: s.name
						}, s.key);
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10",
			children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-dashed border-border p-14 text-center text-muted-foreground",
				children: "No apps match your search. Try a different keyword or stack."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: filtered.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i % 6 * 60,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppCard, { app: a })
				}, a.slug))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-border bg-card p-10 lg:p-14 shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid lg:grid-cols-2 gap-10 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "rounded-full border-primary/30 bg-primary/10 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-3.5 w-3.5" }), " How it works"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-3xl font-bold tracking-tight",
							children: "From order to live URL — in one afternoon."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-muted-foreground leading-relaxed",
							children: "Send us the app, domain and preferred region. We provision a hardened VPS, install and configure the stack, wire up SSL, backups and monitoring, and hand over the credentials."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-gradient-brand text-white",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									children: "Get a custom quote"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppOrderButton, {
								surface: "header",
								variant: "outline",
								label: "Chat on WhatsApp",
								items: [{ name: "Deployment enquiry" }],
								note: "Please share deployment options and pricing."
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-4",
						children: [
							{
								t: "Pick the app & plan",
								d: `Choose from Coolify, n8n, Odoo, WordPress and ${apps.length}+ more.`
							},
							{
								t: "Choose the region & VPS",
								d: "Mumbai, Delhi, Singapore, Frankfurt or your own cloud."
							},
							{
								t: "We install & harden",
								d: "SSL, firewall, backups, monitoring — production-grade defaults."
							},
							{
								t: "Handover & 24×7 support",
								d: "Root/admin credentials + WhatsApp + ticket support."
							}
						].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 h-9 w-9 rounded-lg bg-gradient-brand text-white flex items-center justify-center font-semibold text-sm",
								children: i + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: s.t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground mt-0.5",
								children: s.d
							})] })]
						}, s.t))
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-gradient-brand p-10 lg:p-14 text-white shadow-elegant relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl lg:text-3xl font-bold",
							children: cms.cta_title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-white/90 max-w-xl",
							children: cms.cta_subtitle
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								className: "bg-white text-primary hover:bg-white/90",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									children: "Request a custom deployment"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppOrderButton, {
								size: "lg",
								variant: "outline",
								surface: "header",
								className: "bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white",
								label: "WhatsApp us",
								items: [{ name: "Custom app deployment" }],
								note: "I have a custom app to deploy."
							})]
						})]
					})
				]
			})
		})
	] });
}
function AppCard({ app }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-x-0 -top-24 h-40 bg-gradient-to-br ${app.color} opacity-10 blur-2xl pointer-events-none` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-12 w-12 rounded-xl bg-gradient-to-br ${app.color} text-white flex items-center justify-center text-2xl shadow-elegant`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						children: app.emoji
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-1",
					children: [app.popular && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "bg-primary/15 text-primary border-transparent",
						children: "Popular"
					}), app.new && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "bg-accent/15 text-accent border-transparent",
						children: "New"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-base font-semibold flex items-center gap-2",
					children: [app.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-3.5 w-3.5 text-muted-foreground" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: app.tagline
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[3.75rem]",
				children: app.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mt-3 flex flex-wrap gap-1.5",
				children: (app.tags ?? []).slice(0, 3).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-wide font-medium bg-secondary text-muted-foreground rounded px-1.5 py-0.5",
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4 pt-4 border-t border-border flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-wide text-muted-foreground",
					children: "From"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-base font-bold",
					children: [formatINR(app.from_inr), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-normal text-muted-foreground",
						children: "/mo"
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppOrderButton, {
						size: "sm",
						variant: "outline",
						surface: "product",
						label: "WhatsApp",
						items: [{
							name: `Deploy: ${app.name}`,
							qty: 1,
							price_inr: app.from_inr
						}],
						total_inr: app.from_inr,
						note: `Please deploy ${app.name} for me.`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						className: "bg-gradient-brand text-white",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/contact",
							children: ["Deploy ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3.5 w-3.5" })]
						})
					})]
				})]
			})
		]
	});
}
//#endregion
export { DeploymentsPage as component };
