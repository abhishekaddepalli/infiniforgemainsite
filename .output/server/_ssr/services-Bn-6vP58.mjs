import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Nn as Check, R as ShieldCheck, Sn as Clock, Xn as ArrowRight, Y as Rocket, j as Sparkles, jt as Layers, n as Zap } from "../_libs/lucide-react.mjs";
import { a as useCms, n as CmsIcon } from "./cms-BQLw1hye.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { t as Reveal } from "./Reveal-CUxnlK3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-Bn-6vP58.js
var import_jsx_runtime = require_jsx_runtime();
var TONE_MAP = [
	"from-primary/15 to-primary/5 text-primary",
	"from-accent/15 to-accent/5 text-accent",
	"from-primary/10 to-accent/10 text-primary"
];
var GRADIENTS = [
	"bg-gradient-brand",
	"bg-gradient-green",
	"bg-gradient-saffron"
];
var HIGHLIGHTS = [
	{
		icon: Rocket,
		title: "Ship in days, not months",
		desc: "Fixed scope, fixed timeline, fixed price — with weekly demos."
	},
	{
		icon: ShieldCheck,
		title: "GST-invoiced & compliant",
		desc: "Signed SLAs, DPA, and 18% GST invoices for every rupee."
	},
	{
		icon: Clock,
		title: "24×7 NOC & on-site",
		desc: "Human engineers on chat, phone and site across India."
	},
	{
		icon: Layers,
		title: "One partner, full stack",
		desc: "Websites, servers, CCTV, networks, software and support."
	}
];
function ServicesPage() {
	const page = useCms("services_page");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative bg-gradient-hero overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-hero-blob" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-hero-blob",
					style: { animationDelay: "-6s" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
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
									className: "mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]",
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
									className: "mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed",
									children: page.subtitle
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								delay: 280,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex flex-wrap gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										className: "h-12 bg-gradient-brand text-white px-6",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/contact",
											children: ["Get a free quote ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										className: "h-12 px-6",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/pricing",
											children: "See care plans"
										})
									})]
								})
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 200,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-[340px] hidden lg:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 rounded-3xl bg-gradient-dashboard shadow-elegant overflow-hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 opacity-30",
										style: { backgroundImage: "radial-gradient(circle at 30% 30%, oklch(0.74 0.17 55 / 0.5), transparent 50%), radial-gradient(circle at 70% 70%, oklch(0.68 0.18 145 / 0.5), transparent 50%)" }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute inset-0 p-6",
										children: [(page.services ?? []).slice(0, 6).map((s, i) => {
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: cn("absolute glass !bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-xs font-medium flex items-center gap-2 shadow-elegant", [
													"top-4 left-4",
													"top-6 right-6",
													"top-1/2 left-2 -translate-y-1/2",
													"top-1/2 right-4 -translate-y-1/2",
													"bottom-6 left-8",
													"bottom-4 right-10"
												][i]),
												style: {
													animation: `hero-float ${5 + i * .7}s ease-in-out infinite`,
													animationDelay: `${i * -.6}s`
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("h-6 w-6 rounded-md flex items-center justify-center", GRADIENTS[i % GRADIENTS.length]),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsIcon, {
														name: s.icon,
														className: "h-3.5 w-3.5 text-white"
													})
												}), s.name]
											}, s.name + i);
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-x-10 top-1/2 -translate-y-1/2 h-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-center",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] uppercase tracking-widest text-white/60",
														children: "Infiniforge"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-white font-bold text-lg mt-1",
														children: "One-stop IT partner"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2 flex items-center justify-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-accent animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] text-white/70",
															children: "Live · 99.98% uptime"
														})]
													})
												]
											})
										})]
									})]
								})
							})
						})]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: HIGHLIGHTS.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5 flex items-start gap-3 transition-all hover:-translate-y-1 hover:shadow-elegant",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-10 w-10 rounded-xl bg-gradient-brand text-white flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(h.icon, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold text-sm",
						children: h.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground mt-1 leading-relaxed",
						children: h.desc
					})] })]
				}, i))
			}) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-2xl mx-auto mb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wider text-primary",
					children: "What we do"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl sm:text-4xl font-bold tracking-tight",
					children: "Every service your business needs — under one roof."
				})]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: page.services.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i % 3 * 80,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("group relative h-full rounded-2xl border border-border bg-card p-6 shadow-card overflow-hidden", "transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity", TONE_MAP[i % TONE_MAP.length]) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-brand opacity-0 blur-2xl group-hover:opacity-20 transition-opacity" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-elegant transition-transform group-hover:scale-110 group-hover:rotate-3", GRADIENTS[i % GRADIENTS.length]),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsIcon, {
											name: s.icon,
											className: "h-5 w-5"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-5 font-semibold text-lg",
										children: s.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground leading-relaxed",
										children: s.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 pt-5 border-t border-border/70 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-semibold",
											children: s.price
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											className: "text-primary hover:text-primary group/btn",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/contact",
												children: ["Enquire", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" })]
											})
										})]
									})
								]
							})
						]
					})
				}, s.name + i))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl border border-border bg-card p-10 lg:p-14 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-hero-blob" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-hero-blob",
						style: { animationDelay: "-5s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:sticky lg:top-24",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "rounded-full border-accent/30 bg-accent/10 text-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3 mr-1.5" }), " How we work"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-4 text-3xl sm:text-4xl font-bold tracking-tight",
									children: page.process_title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-muted-foreground leading-relaxed",
									children: page.process_subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "mt-6 bg-gradient-brand text-white h-11 px-5",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/contact",
										children: ["Talk to a solution architect ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
									})
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "relative space-y-6 border-l-2 border-dashed border-border pl-8",
							children: page.process_steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								delay: i * 100,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("absolute -left-[42px] top-0 h-9 w-9 rounded-xl text-white flex items-center justify-center font-semibold text-sm shadow-elegant animate-glow-pulse", GRADIENTS[i % GRADIENTS.length]),
										style: { animationDelay: `${i * .3}s` },
										children: i + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background/50 backdrop-blur p-5 transition-all hover:-translate-y-0.5 hover:shadow-card",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-semibold flex items-center gap-2",
											children: [step.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-accent" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm text-muted-foreground mt-1 leading-relaxed",
											children: step.description
										})]
									})]
								})
							}, step.title + i))
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl bg-gradient-dashboard p-10 lg:p-14 text-white shadow-elegant",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-brand opacity-40 blur-3xl animate-hero-blob" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-green opacity-30 blur-3xl animate-hero-blob",
						style: { animationDelay: "-4s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-bold tracking-tight",
							children: "Have a project in mind?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-white/70 max-w-xl leading-relaxed",
							children: "Share your requirement — we'll come back within 4 business hours with a scoped quote and timeline."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "bg-white text-foreground hover:bg-white/90 h-12 px-6",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/contact",
									children: ["Start a project ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
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
						})]
					})
				]
			}) })
		})
	] });
}
//#endregion
export { ServicesPage as component };
