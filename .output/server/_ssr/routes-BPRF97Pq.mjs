import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { An as ChevronRight, D as Store, Dn as CirclePlay, F as ShoppingCart, Ht as HardDrive, Jn as Award, K as Router, Kt as GraduationCap, Ln as Camera, Nn as Check, O as Star, R as ShieldCheck, Sn as Clock, Tt as Lock, V as Server, Vt as Headphones, Xn as ArrowRight, Y as Rocket, _n as Cpu, a as Wifi, bn as CodeXml, dt as Package, er as Activity, et as Radio, j as Sparkles, jn as ChevronLeft, jt as Layers, n as Zap, qt as Globe, u as Users, xn as Cloud } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as formatINR, r as products, t as categories } from "./catalog-0WyprjD8.mjs";
import { a as useCms, n as CmsIcon } from "./cms-BQLw1hye.mjs";
import { a as useCart } from "./cart-B06bdZ_b.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { t as Reveal } from "./Reveal-CUxnlK3o.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-DMoxE41r.mjs";
import { a as index, c as MarkerType, l as Position, n as BackgroundVariant, r as Handle, t as Background } from "../_libs/@xyflow/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BPRF97Pq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HeroBannerSlider() {
	const cfg = useCms("banners");
	const slides = (cfg.slides ?? []).filter((s) => s.enabled !== false);
	const [i, setI] = (0, import_react.useState)(0);
	const count = slides.length;
	const interval = Math.max(2, Math.min(cfg.autoplay_seconds ?? 6, 30)) * 1e3;
	const next = (0, import_react.useCallback)(() => setI((v) => (v + 1) % Math.max(count, 1)), [count]);
	const prev = () => setI((v) => (v - 1 + count) % Math.max(count, 1));
	(0, import_react.useEffect)(() => {
		if (!cfg.enabled || !cfg.autoplay || count < 2) return;
		const t = setInterval(next, interval);
		return () => clearInterval(t);
	}, [
		cfg.enabled,
		cfg.autoplay,
		count,
		interval,
		next
	]);
	if (!cfg.enabled || count === 0) return null;
	slides[i % count];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-2xl border border-border shadow-elegant",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-h-[360px] sm:aspect-[16/6] sm:min-h-[260px] w-full",
				children: slides.map((slide, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `absolute inset-0 transition-opacity duration-700 ${idx === i % count ? "opacity-100" : "opacity-0 pointer-events-none"}`,
					style: {
						backgroundImage: slide.image_url ? `linear-gradient(90deg, rgba(10,10,15,0.82) 0%, rgba(10,10,15,0.55) 60%, rgba(10,10,15,0.25) 100%), url(${slide.image_url})` : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
						backgroundSize: "cover",
						backgroundPosition: "center"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full flex-col justify-center gap-3 px-5 pb-14 pt-6 sm:px-16 sm:py-10 lg:px-20 lg:py-14 max-w-2xl text-white",
						children: [
							slide.eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur",
								children: slide.eyebrow
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight drop-shadow",
								children: slide.title
							}),
							slide.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base lg:text-lg text-white/90 max-w-xl",
								children: slide.subtitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-col sm:flex-row flex-wrap gap-2",
								children: [slide.cta_label && slide.cta_link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "bg-white text-primary hover:bg-white/90 h-11 w-full sm:w-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: slide.cta_link,
										children: [
											slide.cta_label,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })
										]
									})
								}), slide.cta2_label && slide.cta2_link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "outline",
									className: "h-11 w-full sm:w-auto border-white/60 bg-white/10 text-white hover:bg-white/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: slide.cta2_link,
										children: slide.cta2_label
									})
								})]
							})
						]
					})
				}, idx))
			}), count > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: prev,
					"aria-label": "Previous slide",
					className: "absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60 sm:inline-flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: next,
					"aria-label": "Next slide",
					className: "absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60 sm:inline-flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5",
					children: slides.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": `Go to slide ${idx + 1}`,
						onClick: () => setI(idx),
						className: `h-1.5 rounded-full transition-all ${idx === i % count ? "w-8 bg-white" : "w-3 bg-white/50 hover:bg-white/80"}`
					}, idx))
				})
			] })]
		})
	});
}
var toneGrad = {
	saffron: "from-amber-500 to-orange-600",
	green: "from-emerald-500 to-teal-600",
	sky: "from-sky-500 to-indigo-600",
	violet: "from-fuchsia-500 to-purple-600",
	core: "from-primary via-accent to-primary"
};
var toneStroke = {
	saffron: "rgb(245,158,11)",
	green: "rgb(16,185,129)",
	sky: "rgb(14,165,233)",
	violet: "rgb(217,70,239)",
	core: "hsl(var(--primary))"
};
function ServiceNode({ id, data }) {
	const d = data;
	const Icon = d.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative animate-hero-float",
		style: { animationDuration: `${5 + String(id ?? d.label ?? "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 30 / 10}s` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
				type: "target",
				position: Position.Top,
				className: "!opacity-0 !w-1 !h-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
				type: "source",
				position: Position.Bottom,
				className: "!opacity-0 !w-1 !h-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("relative w-[172px] rounded-2xl p-[1.5px] bg-gradient-to-br transition-all duration-500 group-hover:scale-[1.06] group-hover:-translate-y-1", toneGrad[d.tone]),
				style: { boxShadow: `0 12px 40px -14px ${toneStroke[d.tone]}` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[15px] bg-card/95 backdrop-blur px-3.5 py-3 flex items-center gap-3 relative overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br shadow-lg", toneGrad[d.tone]),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[13px] font-semibold leading-tight truncate",
								children: d.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground leading-tight truncate mt-0.5",
								children: d.sub
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16,185,129)] animate-pulse" })
					]
				})
			})
		]
	});
}
function HubNode({ data }) {
	const d = data;
	const Icon = d.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
				type: "target",
				position: Position.Top,
				className: "!opacity-0 !w-1 !h-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
				type: "source",
				position: Position.Bottom,
				className: "!opacity-0 !w-1 !h-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("relative h-[92px] w-[92px] rounded-2xl bg-gradient-to-br text-white flex flex-col items-center justify-center shadow-xl border-2 border-background", toneGrad[d.tone]),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute -inset-2 rounded-2xl blur-xl opacity-40 bg-gradient-to-br", toneGrad[d.tone]) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 mb-0.5 relative" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-bold relative",
						children: d.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[8px] opacity-80 relative",
						children: d.sub
					})
				]
			})
		]
	});
}
function CoreNode({ data }) {
	const d = data;
	const Icon = d.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
				type: "target",
				position: Position.Top,
				className: "!opacity-0 !w-1 !h-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
				type: "source",
				position: Position.Bottom,
				className: "!opacity-0 !w-1 !h-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border-2 border-primary/40 animate-hero-pulse-ring" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 rounded-full border-2 border-accent/40 animate-hero-pulse-ring",
				style: { animationDelay: "0.9s" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-10 rounded-full bg-gradient-brand/30 blur-3xl animate-pulse pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-6 rounded-full border border-dashed border-primary/50 animate-hero-spin-slow pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -inset-12 rounded-full border border-dashed border-accent/40 pointer-events-none",
				style: { animation: "hero-spin-slow 32s linear infinite reverse" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-[148px] w-[148px] rounded-full bg-gradient-brand text-white flex flex-col items-center justify-center shadow-elegant border-4 border-background overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_55%)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-8 w-8 mb-1 relative" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-bold relative",
						children: d.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] opacity-90 relative",
						children: d.sub
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-1 relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgb(110,231,183)] animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] uppercase tracking-wider opacity-90",
							children: "Live"
						})]
					})
				]
			})
		]
	});
}
var nodeTypes = {
	service: ServiceNode,
	hub: HubNode,
	core: CoreNode
};
var HUBS = [
	{
		id: "hub-cloud",
		label: "Cloud",
		sub: "& Hosting",
		icon: Cloud,
		tone: "saffron",
		services: [
			{
				id: "vps",
				label: "VPS & Servers",
				sub: "KVM · NVMe · India POPs",
				icon: Server
			},
			{
				id: "domains",
				label: "Domains & SSL",
				sub: "Registrar · Wildcard",
				icon: Globe
			},
			{
				id: "backup",
				label: "Backups & DR",
				sub: "Snapshots · Off-site",
				icon: HardDrive
			}
		]
	},
	{
		id: "hub-network",
		label: "Network",
		sub: "& ISP",
		icon: Wifi,
		tone: "green",
		services: [
			{
				id: "wisp",
				label: "WISP Deployment",
				sub: "Hotspots · Multi-WAN",
				icon: Router
			},
			{
				id: "internet",
				label: "Internet Services",
				sub: "Broadband · Leased",
				icon: Wifi
			},
			{
				id: "cctv",
				label: "CCTV & NVR",
				sub: "IP surveillance",
				icon: Camera
			}
		]
	},
	{
		id: "hub-software",
		label: "Software",
		sub: "& SaaS",
		icon: CodeXml,
		tone: "sky",
		services: [
			{
				id: "web",
				label: "Websites & Apps",
				sub: "React · Next · WP",
				icon: CodeXml
			},
			{
				id: "saas",
				label: "SaaS Subscriptions",
				sub: "POS · ERP · CRM",
				icon: Cpu
			},
			{
				id: "stores",
				label: "E-Commerce Stores",
				sub: "Ready storefronts",
				icon: Store
			}
		]
	},
	{
		id: "hub-support",
		label: "Support",
		sub: "& NOC",
		icon: ShieldCheck,
		tone: "violet",
		services: [
			{
				id: "noc",
				label: "24×7 Monitoring",
				sub: "NOC · Alerts",
				icon: Activity
			},
			{
				id: "helpdesk",
				label: "IT Helpdesk",
				sub: "On-site + Remote",
				icon: Headphones
			},
			{
				id: "courses",
				label: "Courses & Training",
				sub: "LMS · Certification",
				icon: GraduationCap
			}
		]
	}
];
function EcosystemFlow() {
	const { nodes, edges } = (0, import_react.useMemo)(() => {
		const cx = 520;
		const cy = 360;
		const hubR = 210;
		const leafR = 200;
		const nodes = [];
		const edges = [];
		nodes.push({
			id: "core",
			type: "core",
			position: {
				x: cx - 74,
				y: cy - 74
			},
			data: {
				label: "Infiniforge",
				sub: "Unified Cloud",
				icon: Zap,
				tone: "core",
				kind: "core"
			},
			draggable: false,
			selectable: false
		});
		HUBS.forEach((hub, i) => {
			const angle = i / HUBS.length * Math.PI * 2 - Math.PI / 2;
			const hx = cx + Math.cos(angle) * hubR;
			const hy = cy + Math.sin(angle) * hubR;
			nodes.push({
				id: hub.id,
				type: "hub",
				position: {
					x: hx - 46,
					y: hy - 46
				},
				data: {
					label: hub.label,
					sub: hub.sub,
					icon: hub.icon,
					tone: hub.tone,
					kind: "hub"
				},
				draggable: false,
				selectable: false
			});
			edges.push({
				id: `core-${hub.id}`,
				source: "core",
				target: hub.id,
				animated: true,
				style: {
					stroke: toneStroke[hub.tone],
					strokeWidth: 2,
					opacity: .85
				},
				markerEnd: {
					type: MarkerType.ArrowClosed,
					color: toneStroke[hub.tone]
				}
			});
			const spread = Math.PI / 2.2;
			hub.services.forEach((s, j) => {
				const a = angle + (hub.services.length === 1 ? 0 : j / (hub.services.length - 1) - .5) * spread;
				const lx = hx + Math.cos(a) * leafR;
				const ly = hy + Math.sin(a) * leafR;
				nodes.push({
					id: s.id,
					type: "service",
					position: {
						x: lx - 86,
						y: ly - 30
					},
					data: {
						label: s.label,
						sub: s.sub,
						icon: s.icon,
						tone: hub.tone,
						kind: "service"
					},
					draggable: false,
					selectable: false
				});
				edges.push({
					id: `${hub.id}-${s.id}`,
					source: hub.id,
					target: s.id,
					animated: true,
					style: {
						stroke: toneStroke[hub.tone],
						strokeWidth: 1.4,
						opacity: .55,
						strokeDasharray: "4 3"
					}
				});
			});
		});
		return {
			nodes,
			edges
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative rounded-2xl sm:rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary/40 shadow-elegant overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.12),transparent_60%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-hero-blob pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-hero-blob pointer-events-none",
				style: { animationDelay: "3s" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center justify-between gap-3 px-3 sm:px-5 py-3 border-b border-border/60 bg-background/40 backdrop-blur",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-medium min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative flex h-2 w-2 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-emerald-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground truncate",
								children: "Infiniforge Ecosystem"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground hidden sm:inline",
								children: "· Live Map"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden lg:flex items-center gap-4 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-amber-500" }), " Cloud"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }), " Network"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-sky-500" }), " Software"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-fuchsia-500" }), " Support"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-[11px] text-muted-foreground shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "99.98% uptime" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block h-[560px] lg:h-[640px] relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(index, {
					nodes,
					edges,
					nodeTypes,
					fitView: true,
					fitViewOptions: { padding: .12 },
					nodesDraggable: false,
					nodesConnectable: false,
					elementsSelectable: false,
					zoomOnScroll: false,
					zoomOnPinch: false,
					zoomOnDoubleClick: false,
					panOnDrag: false,
					panOnScroll: false,
					preventScrolling: false,
					proOptions: { hideAttribution: true },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background, {
						variant: BackgroundVariant.Dots,
						gap: 24,
						size: 1.2,
						color: "hsl(var(--muted-foreground) / 0.18)"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:hidden relative p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto mb-5 flex flex-col items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-3 rounded-full bg-gradient-brand/25 blur-2xl animate-pulse pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-20 w-20 rounded-full bg-gradient-brand text-white flex flex-col items-center justify-center shadow-elegant border-4 border-background",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-bold mt-0.5",
									children: "Infiniforge"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[8px] opacity-90 -mt-0.5",
									children: "Unified Cloud"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), "Live · connected"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: HUBS.map((hub) => {
						const HubIcon = hub.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative rounded-2xl border border-border bg-card/80 backdrop-blur p-4 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute inset-0 rounded-2xl bg-gradient-to-br opacity-[0.08] pointer-events-none", toneGrad[hub.tone]) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-center gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("h-11 w-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md bg-gradient-to-br", toneGrad[hub.tone]),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HubIcon, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm font-semibold leading-tight truncate",
											children: [
												hub.label,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground font-normal",
													children: hub.sub
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground mt-0.5",
											children: [hub.services.length, " services · orchestrated"]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative grid grid-cols-1 gap-2",
									children: hub.services.map((s) => {
										const SIcon = s.icon;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5 rounded-xl border border-border/70 bg-background/60 px-2.5 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cn("h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0 bg-gradient-to-br", toneGrad[hub.tone]),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SIcon, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[12px] font-medium leading-tight truncate",
													children: s.label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] text-muted-foreground leading-tight truncate mt-0.5",
													children: s.sub
												})]
											})]
										}, s.id);
									})
								})
							]
						}, hub.id);
					})
				})]
			})
		]
	});
}
var featuredFallback = products.slice(0, 6);
function HomePage() {
	const navigate = useNavigate();
	const { add } = useCart();
	const home = useCms("home");
	const { data: dbFeatured } = useQuery({
		queryKey: ["public-featured-products"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("id, slug, name, description, price_inr, gst_percent, billing, product_type, popular, featured, thumbnail_url, features").eq("status", "active").order("popular", { ascending: false }).order("featured", { ascending: false }).order("created_at", { ascending: false }).limit(6);
			if (error) throw error;
			return data ?? [];
		},
		staleTime: 6e4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden bg-gradient-hero",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 -z-0 opacity-[0.06]",
					style: {
						backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
						backgroundSize: "48px 48px",
						maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-hero-blob" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-accent/25 blur-3xl animate-hero-float-slow" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute top-1/2 left-1/3 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl animate-hero-blob",
					style: { animationDelay: "-4s" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 -z-0",
					children: [
						{
							top: "18%",
							left: "12%",
							d: "0s"
						},
						{
							top: "32%",
							left: "88%",
							d: "1.2s"
						},
						{
							top: "68%",
							left: "8%",
							d: "0.6s"
						},
						{
							top: "78%",
							left: "76%",
							d: "2s"
						},
						{
							top: "22%",
							left: "62%",
							d: "1.5s"
						},
						{
							top: "55%",
							left: "40%",
							d: "0.9s"
						}
					].map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute h-1.5 w-1.5 rounded-full bg-primary/70 shadow-[0_0_10px_currentColor] animate-hero-float",
						style: {
							top: p.top,
							left: p.left,
							animationDelay: p.d
						}
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28 relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid lg:grid-cols-12 gap-8 lg:gap-12 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur px-3 py-1 text-[11px] sm:text-xs font-medium text-primary animate-glow-pulse",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "relative flex h-2 w-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full rounded-full bg-primary opacity-70 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-primary" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate max-w-[220px] sm:max-w-none",
											children: home.hero_eyebrow
										})
									]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
									delay: 100,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "font-bold leading-[1.15] tracking-tight text-balance text-[18px] xs:text-[20px] sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-foreground",
											children: "Build. Scale. Automate"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-foreground",
											children: ["with ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gradient-brand animate-gradient bg-clip-text",
												children: home.hero_title
											})]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
									delay: 180,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-center lg:justify-start",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotatingTagline, { words: [
											"Enterprise SaaS",
											"IT Services",
											"AI Automation",
											"Managed Hosting",
											"CCTV & Networking"
										] })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
									delay: 220,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed",
										children: home.hero_subtitle
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
									delay: 300,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											className: "relative bg-gradient-brand text-white shadow-elegant hover:opacity-95 h-11 sm:h-12 px-5 sm:px-6 group overflow-hidden animate-glow-pulse w-full sm:w-auto",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: home.hero_cta_primary.link || "/pricing",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-700" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "mr-1.5 h-4 w-4" }),
													home.hero_cta_primary.label,
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" })
												]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											variant: "outline",
											className: "h-11 sm:h-12 px-5 sm:px-6 group backdrop-blur bg-background/50 w-full sm:w-auto",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: home.hero_cta_secondary.link || "/admin",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "mr-1.5 h-4 w-4 text-primary transition-transform group-hover:scale-110" }), home.hero_cta_secondary.label]
											})
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
									delay: 400,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3 pt-1 text-xs sm:text-sm text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex -space-x-2",
													children: [
														"bg-gradient-brand",
														"bg-gradient-green",
														"bg-gradient-saffron",
														"bg-primary"
													].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-background ${c}` }, i))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col leading-tight",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "flex items-center gap-0.5",
														children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-accent text-accent" }, i))
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] sm:text-xs",
														children: "1,200+ businesses trust us"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden sm:block h-8 w-px bg-border" }),
											home.hero_checks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 shrink-0",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-accent" })
													}),
													" ",
													t
												]
											}, t))
										]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-5 order-first lg:order-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroCommandCenter, {})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4",
						children: home.stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 100,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group relative glass rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 hover:shadow-elegant h-full overflow-hidden",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/10 to-accent/10" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0 text-white shadow-elegant transition-transform group-hover:scale-110 group-hover:rotate-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsIcon, {
											name: s.icon,
											className: "h-4 w-4 sm:h-5 sm:w-5"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg sm:text-2xl font-bold leading-none tabular-nums text-gradient-brand truncate",
											children: s.value
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] sm:text-xs text-muted-foreground mt-1 truncate",
											children: s.label
										})]
									})
								]
							})
						}, s.label))
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroBannerSlider, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechMarquee, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-3xl mx-auto mb-6 sm:mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary",
						children: "One platform · Every service"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-2 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight",
						children: [
							"A live map of the",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient-brand animate-gradient bg-clip-text",
								children: "Infiniforge ecosystem"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed px-2 sm:px-0",
						children: "From routers and CCTV to courses, memberships, digital products and internet services — everything you buy from us is orchestrated from a single command center."
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: 150,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EcosystemFlow, {})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				eyebrow: "Everything under one roof",
				title: home.categories_title,
				subtitle: home.categories_subtitle
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: categories.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 60,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/products",
						className: "group relative block h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant hover:border-primary/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/5 to-accent/5" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-elegant ${c.gradient === "brand" ? "bg-gradient-brand" : c.gradient === "green" ? "bg-gradient-green" : "bg-gradient-saffron"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "relative mt-5 font-semibold text-base group-hover:text-primary transition-colors",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "relative mt-1.5 text-sm text-muted-foreground leading-relaxed",
								children: c.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-4 inline-flex items-center text-xs font-medium text-primary translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all",
								children: ["Explore ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3 w-3" })]
							})
						]
					})
				}, c.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyBento, {}),
		home.features.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 md:grid-cols-2",
				children: home.features.map((svc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 80,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-2xl p-6 flex items-start gap-4 transition-all hover:-translate-y-1 hover:shadow-elegant h-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-elegant ${i % 2 === 0 ? "bg-gradient-green" : "bg-gradient-brand"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsIcon, {
								name: svc.icon,
								className: "h-6 w-6"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-lg",
									children: svc.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground leading-relaxed mt-1",
									children: svc.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/products",
									className: "text-xs font-medium text-primary inline-flex items-center gap-1 mt-3 group",
									children: ["Explore ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 transition-transform group-hover:translate-x-0.5" })]
								})
							]
						})]
					})
				}, svc.title + i))
			})
		}),
		home.testimonials?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				eyebrow: "Loved by operators",
				title: home.testimonials_title
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-5 md:grid-cols-3",
				children: home.testimonials.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 100,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "group relative h-full rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-6 right-6 text-6xl font-serif leading-none text-primary/15 select-none",
								children: "\""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-0.5 mb-4",
								children: Array.from({ length: 5 }).map((_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 fill-primary text-primary" }, j))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
								className: "text-sm leading-relaxed text-foreground",
								children: [
									"\"",
									t.quote,
									"\""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
								className: "mt-6 pt-5 border-t border-border flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-semibold",
									children: t.name.split(" ").map((s) => s[0]).slice(0, 2).join("")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [t.role, t.company ? ` · ${t.company}` : ""]
								})] })]
							})
						]
					})
				}, t.name + i))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between flex-wrap gap-4 mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wider text-primary",
					children: home.featured_eyebrow
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl sm:text-4xl font-bold tracking-tight mt-2",
					children: home.featured_title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/products",
						children: ["View all products ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
					})
				})]
			}), dbFeatured && dbFeatured.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: dbFeatured.map((p) => {
					const feats = Array.isArray(p.features) ? p.features.slice(0, 3) : [];
					const handleOrder = () => {
						add({
							id: p.id,
							name: p.name,
							price_inr: Number(p.price_inr),
							gst_percent: Number(p.gst_percent),
							billing: p.billing,
							thumbnail_url: p.thumbnail_url ?? null,
							product_type: p.product_type
						});
						toast.success(`${p.name} added to cart`);
						navigate({ to: "/checkout" });
					};
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/products/$slug",
							params: { slug: p.slug },
							className: "absolute inset-0 z-0",
							"aria-label": `View ${p.name}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 flex flex-col flex-1 pointer-events-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between mb-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5" })
										}),
										p.popular && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-primary/15 text-primary border-0",
											children: "Popular"
										}),
										!p.popular && p.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-accent/15 text-accent border-0",
											children: "Featured"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-lg leading-tight group-hover:text-primary transition-colors",
									children: p.name
								}),
								p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3",
									children: p.description
								}),
								feats.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-4 space-y-1.5",
									children: feats.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "text-xs text-muted-foreground flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-accent shrink-0" }),
											" ",
											String(f)
										]
									}, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 pt-5 border-t border-border flex items-center justify-between pointer-events-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-bold leading-none",
										children: formatINR(Number(p.price_inr))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground mt-1",
										children: p.billing === "one-time" ? `one-time · +${p.gst_percent}% GST` : `per ${p.billing} · +${p.gst_percent}% GST`
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "bg-gradient-brand text-white relative z-10",
										onClick: (e) => {
											e.stopPropagation();
											e.preventDefault();
											handleOrder();
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4 mr-1" }), " Order"]
									})]
								})
							]
						})]
					}, p.id);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: featuredFallback.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-11 w-11 rounded-xl flex items-center justify-center text-white ${p.gradient === "brand" ? "bg-gradient-brand" : p.gradient === "green" ? "bg-gradient-green" : "bg-gradient-saffron"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "h-5 w-5" })
							}), p.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-primary/15 text-primary border-0",
								children: p.badge
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-lg leading-tight",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground leading-relaxed",
							children: p.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-1.5",
							children: p.features.slice(0, 3).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-xs text-muted-foreground flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-accent shrink-0" }),
									" ",
									f
								]
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 pt-5 border-t border-border flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-bold leading-none",
								children: formatINR(p.price)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground mt-1",
								children: p.billing === "one-time" ? "one-time" : `per ${p.billing === "mo" ? "month" : "year"}`
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/products",
									children: "View catalog"
								})
							})]
						})
					]
				}, p.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeFAQ, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl bg-gradient-dashboard p-10 lg:p-16 text-white shadow-elegant",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-brand opacity-40 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-green opacity-30 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid lg:grid-cols-2 gap-10 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-white/10 text-white border-white/20 mb-5",
								children: "For enterprises & resellers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl font-bold tracking-tight",
								children: home.cta_title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-white/70 leading-relaxed",
								children: home.cta_subtitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									className: "bg-white text-foreground hover:bg-white/90 h-12 px-6",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: home.cta_primary.link || "/contact",
										children: home.cta_primary.label
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									variant: "outline",
									className: "border-white/30 text-white bg-transparent hover:bg-white/10 h-12 px-6",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: home.cta_secondary.link || "/pricing",
										children: home.cta_secondary.label
									})
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								{
									icon: Globe,
									label: "Domains & DNS"
								},
								{
									icon: Server,
									label: "Managed hosting & VPS"
								},
								{
									icon: Camera,
									label: "CCTV & IP surveillance"
								},
								{
									icon: ShieldCheck,
									label: "GST + 24×7 NOC"
								}
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass !bg-white/5 border-white/10 rounded-2xl p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5 text-primary-glow mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium text-sm",
									children: f.label
								})]
							}, f.label))
						})]
					})
				]
			})
		})
	] });
}
function RotatingTagline({ words }) {
	const [i, setI] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setI((p) => (p + 1) % words.length), 2200);
		return () => clearInterval(id);
	}, [words.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 text-base sm:text-lg font-medium",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: "One partner for"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative inline-flex h-7 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-block text-gradient-brand animate-reveal-up font-semibold",
				children: words[i]
			}, i)
		})]
	});
}
function SectionHeader({ eyebrow, title, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold uppercase tracking-wider text-primary",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-3xl sm:text-4xl font-bold tracking-tight mt-2",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted-foreground leading-relaxed",
				children: subtitle
			})
		]
	});
}
function HeroCommandCenter() {
	const trafficBars = [
		40,
		68,
		52,
		82,
		60,
		90,
		55,
		78,
		46,
		88
	];
	const orbitChips = [
		{
			label: "CCTV",
			icon: Camera
		},
		{
			label: "Routers",
			icon: Router
		},
		{
			label: "Websites",
			icon: CodeXml
		},
		{
			label: "VPS / Cloud",
			icon: Cloud
		},
		{
			label: "Internet / WISP",
			icon: Wifi
		},
		{
			label: "IT Support",
			icon: Headphones
		},
		{
			label: "Software",
			icon: Package
		},
		{
			label: "Monitoring",
			icon: Activity
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto aspect-square w-full max-w-[540px] px-2 sm:px-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-10 -left-8 h-56 w-56 rounded-full bg-primary/30 blur-3xl animate-hero-blob" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -bottom-12 -right-6 h-64 w-64 rounded-full bg-accent/30 blur-3xl animate-hero-blob",
				style: { animationDelay: "-6s" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-2 rounded-full border border-dashed border-primary/25 animate-hero-spin-slow" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-6 sm:inset-10 rounded-full border border-dashed border-accent/30 animate-hero-spin-slow",
				style: {
					animationDirection: "reverse",
					animationDuration: "34s"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-12 sm:inset-20 rounded-full border border-dotted border-primary/20 animate-hero-spin-slow",
				style: { animationDuration: "48s" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 w-32 sm:h-44 sm:w-44 rounded-full bg-gradient-brand/20 animate-hero-pulse-ring" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-32 w-32 sm:h-44 sm:w-44 rounded-full bg-gradient-brand/20 animate-hero-pulse-ring",
					style: { animationDelay: "1.3s" }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				children: orbitChips.map((c, i) => {
					const angle = 360 / orbitChips.length * i;
					const outer = i % 2 === 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
						style: { transform: `translate(-50%, -50%) rotate(${angle}deg)` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: outer ? "animate-hero-orbit" : "animate-hero-orbit-rev",
							style: {
								["--r"]: outer ? "clamp(88px, 30vw, 185px)" : "clamp(112px, 38vw, 225px)",
								animationDelay: `${-i * 2.2}s`
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass rounded-xl sm:rounded-2xl border border-primary/20 px-2 py-1 sm:px-3 sm:py-2 shadow-elegant flex items-center gap-1.5 sm:gap-2 whitespace-nowrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `h-5 w-5 sm:h-6 sm:w-6 rounded-md sm:rounded-lg text-white flex items-center justify-center ${outer ? "bg-gradient-brand" : "bg-gradient-green"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] sm:text-xs font-semibold",
										children: c.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_currentColor]" })
								]
							})
						})
					}, c.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-1/2 top-1/2 w-[74%] -translate-x-1/2 -translate-y-1/2 animate-hero-float-slow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative glass rounded-3xl shadow-elegant p-5 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pointer-events-none absolute inset-0 overflow-hidden rounded-3xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-y-4 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-hero-shine" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex h-2 w-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full rounded-full bg-accent opacity-70 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-accent" })]
								}), "NOC · Live"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-bold mt-1 text-gradient-brand",
								children: "99.98% Uptime"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-accent/15 text-accent border-0",
								children: "24×7"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 relative h-24 flex items-center justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 overflow-hidden animate-hero-spin-slow",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
											className: "absolute inset-0 m-auto h-14 w-14 text-primary/70",
											strokeWidth: 1.2
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border-t border-b border-primary/20" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-1/2 w-px bg-primary/20" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 animate-hero-spin-slow",
									style: { animationDuration: "14s" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1/2 top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_currentColor]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 animate-hero-spin-slow",
									style: {
										animationDuration: "20s",
										animationDirection: "reverse"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_8px_currentColor]" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex items-end gap-1 h-12",
							children: trafficBars.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full rounded-t bg-gradient-to-t from-primary to-accent origin-bottom animate-hero-bar",
									style: {
										height: `${h}%`,
										animationDelay: `${i * .1}s`
									}
								})
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2 mt-3",
							children: [
								{
									label: "Cameras",
									val: "1.2k",
									icon: Camera
								},
								{
									label: "Nodes",
									val: "417",
									icon: Cpu
								},
								{
									label: "Tickets",
									val: "24",
									icon: Headphones
								}
							].map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/60 bg-card/70 backdrop-blur p-2.5 animate-hero-float",
								style: { animationDelay: `${i * .4}s` },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.icon, { className: "h-3.5 w-3.5 text-primary mb-1" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold leading-none",
										children: k.val
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground mt-0.5",
										children: k.label
									})
								]
							}, k.label))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-2 right-2 glass rounded-xl px-2.5 py-1.5 border border-accent/30 flex items-center gap-1.5 animate-hero-float",
				style: { animationDelay: "0.6s" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-semibold",
					children: "GST Invoiced"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-4 left-2 glass rounded-xl px-2.5 py-1.5 border border-primary/30 flex items-center gap-1.5 animate-hero-float",
				style: { animationDelay: "1.2s" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-semibold",
					children: "On-site + Remote"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-1/2 -left-2 glass rounded-xl px-2.5 py-1.5 border border-accent/30 flex items-center gap-1.5 animate-hero-float",
				style: { animationDelay: "1.8s" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-3.5 w-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-semibold",
					children: "Servers Live"
				})]
			})
		]
	});
}
function TechMarquee() {
	const tech = [
		"AWS",
		"Google Cloud",
		"Azure",
		"Cloudflare",
		"DigitalOcean",
		"Hetzner",
		"Coolify",
		"n8n",
		"WordPress",
		"Next.js",
		"Supabase",
		"PostgreSQL",
		"Docker",
		"Kubernetes",
		"Nginx",
		"LiteSpeed",
		"Redis",
		"MongoDB",
		"Razorpay",
		"Stripe",
		"Twilio",
		"Meta",
		"WhatsApp Business"
	];
	const row = [...tech, ...tech];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-y border-border/60 bg-secondary/30 py-6 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }), "Trusted stack — 1,200+ deployments across India"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-3 animate-[marquee_40s_linear_infinite] w-max",
						children: row.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-4 py-2 text-sm font-medium whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_currentColor]" }), t]
						}, t + i))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }` })
		]
	});
}
function WhyBento() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl mb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wider text-primary",
					children: "Why teams choose Infiniforge"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl sm:text-4xl font-bold tracking-tight",
					children: "Enterprise capability, startup speed."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted-foreground",
					children: "One accountable partner for every layer of your business tech — with fixed pricing, GST invoices and 24×7 humans on call."
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-6 md:auto-rows-[minmax(180px,1fr)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 0,
					className: "md:col-span-3 md:row-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 h-full min-h-[380px] flex flex-col justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/25 blur-3xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-elegant",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-6 w-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-6 text-2xl font-bold leading-tight",
										children: "One team. One invoice. Every layer of your stack."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm text-muted-foreground leading-relaxed",
										children: "Websites, apps, ERP, hosting, VPS, domains, SSL, CCTV, routers, internet, monitoring, courses & AI — delivered and maintained by a single accountable partner."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative grid grid-cols-3 gap-2 pt-6",
								children: [
									{
										i: Layers,
										l: "12 verticals"
									},
									{
										i: Users,
										l: "40+ engineers"
									},
									{
										i: Award,
										l: "ISO 27001"
									}
								].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/70 backdrop-blur p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(x.i, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 text-xs font-semibold",
										children: x.l
									})]
								}, x.l))
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 100,
					className: "md:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-border bg-card p-6 h-full flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-green text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-semibold text-lg",
								children: "Fixed timelines & quotes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: "Milestone-based delivery with weekly demos. No scope-creep surprises."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-4xl font-extrabold text-gradient-brand tabular-nums",
								children: "7d"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground pb-1.5",
								children: "avg first-milestone"
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 150,
					className: "md:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-border bg-card p-6 h-full flex flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-saffron text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-semibold",
								children: "24×7 NOC"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "WhatsApp + SMS + phone alerts."
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 200,
					className: "md:col-span-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-border bg-card p-6 h-full flex flex-col items-start",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 text-2xl font-bold",
								children: "DPA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground mt-1",
								children: "Data protection agreement included"
							})
						]
					})
				})
			]
		})]
	});
}
function HomeFAQ() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center max-w-2xl mx-auto mb-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold uppercase tracking-wider text-primary",
				children: "Answers before you ask"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-3xl sm:text-4xl font-bold tracking-tight",
				children: "Frequently asked"
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: 100,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
				type: "single",
				collapsible: true,
				className: "rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden",
				children: [
					{
						q: "Do you offer GST-compliant invoices?",
						a: "Yes. Every product, service and hosting plan ships with a full GST tax invoice. B2B customers get GSTIN capture at checkout for input credit."
					},
					{
						q: "How fast can you deliver a website or app?",
						a: "Corporate websites go live in 7–14 days. Complex ERP/CRM builds run 6–12 weeks with weekly demos and staging access. Every project has a fixed timeline."
					},
					{
						q: "Which regions do you cover for on-site services (CCTV, routers, network)?",
						a: "Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune and Chennai directly. Other cities via our partner network — same SLA, same GST invoicing."
					},
					{
						q: "Can I white-label / resell Infiniforge hosting & products?",
						a: "Yes. We have a dedicated reseller program with wallet credits, sub-accounts and API access. Talk to our team for wholesale pricing."
					},
					{
						q: "What happens after a project goes live?",
						a: "You can add an AMC (Silver / Gold / Platinum) for ongoing monitoring, updates and 24×7 support. No lock-in — cancel anytime."
					}
				].map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
					value: `f-${i}`,
					className: "border-0 px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
						className: "text-left font-medium py-4 hover:no-underline",
						children: it.q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
						className: "text-sm text-muted-foreground leading-relaxed pb-5",
						children: it.a
					})]
				}, i))
			})
		})]
	});
}
//#endregion
export { HomePage as component };
