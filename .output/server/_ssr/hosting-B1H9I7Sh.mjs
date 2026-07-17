import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { C as Terminal, Hn as Boxes, Ht as HardDrive, Jn as Award, Jt as GitBranch, L as Shield, Nn as Check, O as Star, Tt as Lock, V as Server, Vt as Headphones, Xn as ArrowRight, Xt as Gauge, Y as Rocket, Z as RefreshCw, _n as Cpu, _t as MessageCircle, a as Wifi, er as Activity, et as Radio, ht as Minus, j as Sparkles, jt as Layers, n as Zap, pn as Database, qt as Globe, tt as Quote, u as Users, v as TrendingUp, x as Timer, xn as Cloud, xt as MapPin } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { a as useCms } from "./cms-BQLw1hye.mjs";
import { t as Card } from "./card-CfEwGGLW.mjs";
import { a as formatOrderMessage, o as getWhatsAppConfig, r as buildWhatsAppLink } from "./whatsapp-Bfedub3g.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { t as Slider } from "./slider-lX4rQHvT.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-DMoxE41r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hosting-B1H9I7Sh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function makeRef() {
	const d = /* @__PURE__ */ new Date();
	return `HOST-${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
function HostingWhatsAppButton({ items, total_inr, note, label = "Order on WhatsApp", className, variant = "default", size = "default" }) {
	const cms = useCms("hosting_page");
	const wa = useCms("whatsapp");
	const footer = useCms("footer");
	function handleClick() {
		const cfg = getWhatsAppConfig();
		const fromFooter = (footer.phone || "").replace(/[^\d+]/g, "");
		const number = (cms.whatsapp_number || wa.number || cfg.wa_ordering_number || fromFooter || "").trim();
		if (!number) {
			toast.error("WhatsApp number is not configured yet. Set it in Admin → Site CMS → WhatsApp ordering.");
			return;
		}
		if (wa.enabled === false) {
			toast.error("WhatsApp ordering is currently disabled. Enable it in Admin → Site CMS → WhatsApp ordering.");
			return;
		}
		const reference = makeRef();
		const message = formatOrderMessage(cms.whatsapp_greeting || wa.greeting || cfg.wa_ordering_greeting || "Hello Infiniforge Hosting 👋", items, {
			total_inr,
			note,
			template: wa.template ?? cfg.wa_ordering_template ?? "premium",
			reference
		});
		toast.success(`Opening WhatsApp · ${reference}`);
		window.open(buildWhatsAppLink(number, message), "_blank", "noopener,noreferrer");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		size,
		variant,
		onClick: handleClick,
		className: cn("gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), label]
	});
}
var SHARED = [
	{
		id: "shared-starter",
		name: "Starter",
		tagline: "Perfect for personal sites & blogs",
		price: 149,
		cpu: 1,
		ram: 1,
		storage: 20,
		bandwidth: 500,
		sites: "1 website",
		icon: Globe,
		gradient: "from-sky-500 to-cyan-500"
	},
	{
		id: "shared-business",
		name: "Business",
		tag: "Popular",
		tagline: "Small businesses & portfolios",
		price: 349,
		cpu: 2,
		ram: 2,
		storage: 60,
		bandwidth: 1e3,
		sites: "10 websites",
		icon: Cloud,
		gradient: "from-orange-500 to-pink-500",
		featured: true
	},
	{
		id: "shared-pro",
		name: "Pro",
		tagline: "Agencies & high-traffic sites",
		price: 799,
		cpu: 4,
		ram: 4,
		storage: 150,
		bandwidth: 3e3,
		sites: "Unlimited",
		icon: Sparkles,
		gradient: "from-violet-500 to-fuchsia-500"
	}
];
var VPS = [
	{
		id: "vps-lite",
		name: "VPS Lite",
		tagline: "Dev & staging workloads",
		price: 599,
		cpu: 2,
		ram: 4,
		storage: 80,
		bandwidth: 2e3,
		sites: "Root access",
		icon: Server,
		gradient: "from-emerald-500 to-teal-500"
	},
	{
		id: "vps-pro",
		name: "VPS Pro",
		tag: "Best Value",
		tagline: "Production apps & SaaS",
		price: 1799,
		cpu: 4,
		ram: 8,
		storage: 160,
		bandwidth: 4e3,
		sites: "Snapshots included",
		icon: Cpu,
		gradient: "from-blue-600 to-indigo-600",
		featured: true
	},
	{
		id: "vps-scale",
		name: "VPS Scale",
		tagline: "High-traffic apps & DB nodes",
		price: 3499,
		cpu: 8,
		ram: 16,
		storage: 320,
		bandwidth: 8e3,
		sites: "Private network",
		icon: Rocket,
		gradient: "from-rose-500 to-orange-500"
	}
];
var DEDICATED = [
	{
		id: "ded-e3",
		name: "Dedicated E3",
		tagline: "Entry dedicated hardware",
		price: 8999,
		cpu: 4,
		ram: 32,
		storage: 1e3,
		bandwidth: 1e4,
		sites: "Full hardware",
		icon: HardDrive,
		gradient: "from-slate-600 to-slate-800"
	},
	{
		id: "ded-xeon",
		name: "Dedicated Xeon",
		tag: "Enterprise",
		tagline: "Enterprise mission-critical",
		price: 15999,
		cpu: 12,
		ram: 64,
		storage: 2e3,
		bandwidth: 2e4,
		sites: "IPMI + iLO",
		icon: Database,
		gradient: "from-amber-600 to-red-600",
		featured: true
	},
	{
		id: "ded-epyc",
		name: "Dedicated EPYC",
		tagline: "AI, GPU & big-data workloads",
		price: 24999,
		cpu: 24,
		ram: 128,
		storage: 4e3,
		bandwidth: 4e4,
		sites: "10 Gbps uplink",
		icon: Zap,
		gradient: "from-purple-600 to-indigo-700"
	}
];
var FEATURES = [
	{
		icon: Shield,
		title: "DDoS Protection",
		desc: "Enterprise-grade mitigation on every plan."
	},
	{
		icon: Activity,
		title: "99.99% Uptime SLA",
		desc: "Redundant power, network & storage."
	},
	{
		icon: Zap,
		title: "NVMe SSD Storage",
		desc: "Blazing-fast reads with LiteSpeed cache."
	},
	{
		icon: Users,
		title: "24×7 NOC Support",
		desc: "Real engineers on WhatsApp & tickets."
	},
	{
		icon: Globe,
		title: "Free .in Domain",
		desc: "Included on annual billing plans."
	},
	{
		icon: Database,
		title: "Daily Backups",
		desc: "One-click restore for 30 days."
	}
];
function PlanCard({ plan }) {
	const Icon = plan.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: cn("relative overflow-hidden p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group", plan.featured && "ring-2 ring-primary shadow-elegant scale-[1.02]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 bg-gradient-to-br", plan.gradient) }),
			plan.tag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "absolute top-4 right-4 bg-gradient-brand text-white border-0",
				children: plan.tag
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-elegant mb-4", plan.gradient),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-bold",
				children: plan.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mb-4",
				children: plan.tagline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline gap-1 mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-3xl font-extrabold tracking-tight",
					children: formatINR(plan.price)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted-foreground",
					children: "/mo"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2 text-sm mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-4 w-4 text-primary" }),
							" ",
							plan.cpu,
							" vCPU cores"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-4 w-4 text-primary" }),
							" ",
							plan.ram,
							" GB RAM"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-4 w-4 text-primary" }),
							" ",
							plan.storage,
							" GB NVMe SSD"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-4 w-4 text-primary" }),
							" ",
							plan.bandwidth,
							" GB Bandwidth"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary" }),
							" ",
							plan.sites
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "w-full bg-gradient-brand text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/checkout",
						children: "Order now"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HostingWhatsAppButton, {
					items: [{
						name: `${plan.name} Hosting`,
						qty: 1,
						price_inr: plan.price
					}],
					total_inr: plan.price,
					variant: "outline",
					className: "w-full border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10",
					label: "Enquire on WhatsApp"
				})]
			})
		]
	});
}
function Calculator() {
	const [cpu, setCpu] = (0, import_react.useState)(4);
	const [ram, setRam] = (0, import_react.useState)(8);
	const [storage, setStorage] = (0, import_react.useState)(160);
	const [bandwidth, setBandwidth] = (0, import_react.useState)(4e3);
	const [backups, setBackups] = (0, import_react.useState)(true);
	const [managed, setManaged] = (0, import_react.useState)(true);
	const price = (0, import_react.useMemo)(() => {
		let p = 199;
		p += cpu * 120;
		p += ram * 80;
		p += storage * 2.2;
		p += bandwidth * .08;
		if (backups) p += 199;
		if (managed) p += 999;
		return Math.round(p);
	}, [
		cpu,
		ram,
		storage,
		bandwidth,
		backups,
		managed
	]);
	const spec = `${cpu} vCPU · ${ram} GB RAM · ${storage} GB NVMe · ${bandwidth} GB BW${backups ? " · Backups" : ""}${managed ? " · Managed" : ""}`;
	const bar = (val, max, gradient) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 w-full rounded-full bg-secondary overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", gradient),
			style: { width: `${Math.min(100, val / max * 100)}%` }
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "relative overflow-hidden p-6 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-brand opacity-10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-500 opacity-10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative grid gap-8 lg:grid-cols-[1fr_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "mb-2",
							children: "Build your own"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl md:text-3xl font-bold",
							children: "Custom Cloud Configurator"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Slide to size — pricing updates live. Send the exact spec to us on WhatsApp with one tap."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-4 w-4 text-primary" }), " vCPU Cores"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: cpu
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									value: [cpu],
									onValueChange: (v) => setCpu(v[0]),
									min: 1,
									max: 32,
									step: 1
								}),
								bar(cpu, 32, "from-sky-500 to-indigo-500")
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-4 w-4 text-primary" }), " RAM (GB)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold",
										children: [ram, " GB"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									value: [ram],
									onValueChange: (v) => setRam(v[0]),
									min: 1,
									max: 128,
									step: 1
								}),
								bar(ram, 128, "from-emerald-500 to-teal-500")
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-4 w-4 text-primary" }), " NVMe Storage (GB)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold",
										children: [storage, " GB"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									value: [storage],
									onValueChange: (v) => setStorage(v[0]),
									min: 20,
									max: 2e3,
									step: 20
								}),
								bar(storage, 2e3, "from-orange-500 to-pink-500")
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-4 w-4 text-primary" }), " Bandwidth (GB)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold",
										children: [bandwidth, " GB"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									value: [bandwidth],
									onValueChange: (v) => setBandwidth(v[0]),
									min: 500,
									max: 2e4,
									step: 500
								}),
								bar(bandwidth, 2e4, "from-violet-500 to-fuchsia-500")
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setBackups(!backups),
									className: cn("px-3 py-2 rounded-lg text-sm border transition-all", backups ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-secondary"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("h-3.5 w-3.5 inline mr-1.5", !backups && "opacity-30") }), " Daily Backups"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setManaged(!managed),
									className: cn("px-3 py-2 rounded-lg text-sm border transition-all", managed ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-secondary"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: cn("h-3.5 w-3.5 inline mr-1.5", !managed && "opacity-30") }), " Fully Managed"]
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative rounded-2xl border bg-gradient-to-br from-background to-secondary/40 p-5 sm:p-6 flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "Estimated monthly"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-4xl font-extrabold bg-gradient-brand bg-clip-text text-transparent",
							children: formatINR(price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mt-1",
							children: "+ GST · Billed monthly"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 p-3 rounded-lg bg-background/60 border text-xs leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold mb-1",
								children: "Your configuration"
							}), spec]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto pt-5 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HostingWhatsAppButton, {
								items: [{
									name: `Custom Cloud (${spec})`,
									qty: 1,
									price_inr: price
								}],
								total_inr: price,
								variant: "default",
								className: "w-full bg-[#25D366] hover:bg-[#1ebe5c] text-white border-0 shadow-elegant animate-glow-pulse",
								label: "Send spec on WhatsApp"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									children: "Request quote"
								})
							})]
						})
					]
				})]
			})
		]
	});
}
var DATA_CENTERS = [
	{
		code: "BOM",
		city: "Mumbai",
		country: "India",
		coords: [72.8777, 19.076],
		tier: "Tier IV",
		latency: "<20ms",
		status: "live"
	},
	{
		code: "DEL",
		city: "New Delhi",
		country: "India",
		coords: [77.1025, 28.7041],
		tier: "Tier IV",
		latency: "<25ms",
		status: "live"
	},
	{
		code: "BLR",
		city: "Bengaluru",
		country: "India",
		coords: [77.5946, 12.9716],
		tier: "Tier III",
		latency: "<30ms",
		status: "live"
	},
	{
		code: "SIN",
		city: "Singapore",
		country: "Singapore",
		coords: [103.8198, 1.3521],
		tier: "Tier IV",
		latency: "<60ms",
		status: "live"
	},
	{
		code: "DXB",
		city: "Dubai",
		country: "UAE",
		coords: [55.2708, 25.2048],
		tier: "Tier IV",
		latency: "<45ms",
		status: "live"
	},
	{
		code: "FRA",
		city: "Frankfurt",
		country: "Germany",
		coords: [8.6821, 50.1109],
		tier: "Tier IV",
		latency: "<110ms",
		status: "live"
	},
	{
		code: "LHR",
		city: "London",
		country: "UK",
		coords: [-.1276, 51.5074],
		tier: "Tier III",
		latency: "<120ms",
		status: "live"
	},
	{
		code: "NYC",
		city: "New York",
		country: "USA",
		coords: [-74.006, 40.7128],
		tier: "Tier IV",
		latency: "<180ms",
		status: "live"
	},
	{
		code: "SFO",
		city: "San Jose",
		country: "USA",
		coords: [-121.8863, 37.3382],
		tier: "Tier III",
		latency: "<220ms",
		status: "live"
	},
	{
		code: "TYO",
		city: "Tokyo",
		country: "Japan",
		coords: [139.6917, 35.6895],
		tier: "Tier IV",
		latency: "<150ms",
		status: "soon"
	},
	{
		code: "SYD",
		city: "Sydney",
		country: "Australia",
		coords: [151.2093, -33.8688],
		tier: "Tier III",
		latency: "<140ms",
		status: "soon"
	},
	{
		code: "GRU",
		city: "São Paulo",
		country: "Brazil",
		coords: [-46.6333, -23.5505],
		tier: "Tier III",
		latency: "<260ms",
		status: "soon"
	}
];
var GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
function DataCentersMap() {
	const [active, setActive] = (0, import_react.useState)(DATA_CENTERS[0]);
	const [MapMod, setMapMod] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		import("../_libs/react-simple-maps+[...].mjs").then((n) => n.t).then((m) => {
			if (mounted) setMapMod(m);
		});
		return () => {
			mounted = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative py-16 md:py-20 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mb-3 bg-gradient-brand text-white border-0",
							children: "🌍 Global Edge Network"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl md:text-4xl font-bold",
							children: "12 Data Centers. One Cloud."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mt-2",
							children: "Deploy where your users are — Tier III & IV facilities across 4 continents."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "relative overflow-hidden p-3 sm:p-4 md:p-8 border-primary/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 opacity-[0.15] pointer-events-none",
						style: {
							backgroundImage: "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
							backgroundSize: "40px 40px"
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 lg:grid-cols-[1fr_320px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-elegant",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,153,51,0.18),transparent_60%)] pointer-events-none z-10" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 opacity-20 pointer-events-none",
									style: {
										backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
										backgroundSize: "18px 18px"
									}
								}),
								MapMod ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapMod.ComposableMap, {
									projection: "geoEqualEarth",
									projectionConfig: { scale: 155 },
									style: {
										width: "100%",
										height: "100%"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapMod.Geographies, {
											geography: GEO_URL,
											children: ({ geographies }) => geographies.map((geo) => {
												const hasDC = DATA_CENTERS.some((d) => d.country === geo.properties.name || d.country === "USA" && geo.properties.name === "United States of America" || d.country === "UK" && geo.properties.name === "United Kingdom");
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapMod.Geography, {
													geography: geo,
													fill: hasDC ? "rgba(255,153,51,0.22)" : "rgba(148,163,184,0.10)",
													stroke: "rgba(148,163,184,0.35)",
													strokeWidth: .4,
													style: {
														default: { outline: "none" },
														hover: {
															fill: "rgba(255,153,51,0.35)",
															outline: "none"
														},
														pressed: { outline: "none" }
													}
												}, geo.rsmKey);
											})
										}),
										DATA_CENTERS.filter((d) => d.code !== active.code).map((d) => {
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapMod.Line, {
												from: active.coords,
												to: d.coords,
												stroke: "rgba(255,153,51,0.55)",
												strokeWidth: .6,
												strokeLinecap: "round",
												strokeDasharray: "2,2",
												className: "animate-pulse"
											}, d.code);
										}),
										DATA_CENTERS.map((d) => {
											const isActive = d.code === active.code;
											const color = isActive ? "hsl(var(--primary))" : d.status === "live" ? "#34d399" : "#fbbf24";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapMod.Marker, {
												coordinates: d.coords,
												onClick: () => setActive(d),
												style: { default: { cursor: "pointer" } },
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("circle", {
														r: isActive ? 8 : 6,
														fill: color,
														fillOpacity: .25,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
															attributeName: "r",
															values: `${isActive ? 8 : 6};${isActive ? 16 : 12};${isActive ? 8 : 6}`,
															dur: "2s",
															repeatCount: "indefinite"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
															attributeName: "fill-opacity",
															values: "0.5;0;0.5",
															dur: "2s",
															repeatCount: "indefinite"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
														r: isActive ? 4 : 3,
														fill: color,
														stroke: "#fff",
														strokeWidth: .8
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
														textAnchor: "middle",
														y: -8,
														style: {
															fontFamily: "inherit",
															fontSize: isActive ? 7 : 5.5,
															fontWeight: 700,
															fill: "#fff",
															paintOrder: "stroke",
															stroke: "rgba(0,0,0,0.65)",
															strokeWidth: 1.5,
															strokeLinejoin: "round"
														},
														children: d.city
													})
												]
											}, d.code);
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center justify-center text-white/60 text-xs",
									children: "Loading world map…"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-3 left-3 z-20 flex gap-3 text-[10px] text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded-md",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-400" }), " Live"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-amber-400" }), " Coming soon"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-primary" }), " Selected"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute top-3 right-3 z-20 text-[10px] text-white/80 bg-black/40 backdrop-blur px-2 py-1 rounded-md",
									children: [DATA_CENTERS.length, " regions · 4 continents"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative rounded-2xl border bg-gradient-to-br from-background to-secondary/40 p-4 sm:p-5 flex flex-col",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "w-fit mb-2",
									children: active.tier
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-2xl font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5 text-primary" }), active.city]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm text-muted-foreground",
									children: [
										active.country,
										" · ",
										active.code
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid grid-cols-2 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-secondary/60 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase text-muted-foreground",
												children: "Latency"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold text-lg flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-4 w-4 text-primary" }),
													" ",
													active.latency
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-secondary/60 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase text-muted-foreground",
												children: "Uptime"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold text-lg flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-emerald-500" }), " 99.99%"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-secondary/60 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase text-muted-foreground",
												children: "Network"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold text-lg flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-4 w-4 text-primary" }), " 10 Gbps"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg bg-secondary/60 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase text-muted-foreground",
												children: "Security"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-bold text-lg flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-primary" }), " ISO 27001"]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase text-muted-foreground mb-2",
										children: "Live traffic"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-end gap-1 h-12",
										children: Array.from({ length: 24 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1 bg-gradient-to-t from-primary to-accent rounded-sm animate-hero-bar origin-bottom",
											style: {
												animationDelay: `${i * .08}s`,
												animationDuration: `${1.2 + i % 5 * .15}s`
											}
										}, i))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-auto pt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HostingWhatsAppButton, {
										items: [{
											name: `Provision in ${active.city} (${active.code})`,
											qty: 1
										}],
										className: "w-full bg-[#25D366] hover:bg-[#1ebe5c] text-white border-0",
										label: `Deploy in ${active.city}`
									})
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: DATA_CENTERS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActive(d),
						className: cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover-scale", d.code === active.code ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-secondary", d.status === "soon" && "opacity-75"),
						children: [
							d.code,
							" · ",
							d.city,
							", ",
							d.country,
							" ",
							d.status === "soon" && "•"
						]
					}, d.code))
				})
			]
		})]
	});
}
var TECH_STACK = [
	{
		name: "LiteSpeed",
		icon: Zap
	},
	{
		name: "cPanel",
		icon: Layers
	},
	{
		name: "Docker",
		icon: Boxes
	},
	{
		name: "Kubernetes",
		icon: Cloud
	},
	{
		name: "Node.js",
		icon: Terminal
	},
	{
		name: "Nginx",
		icon: Server
	},
	{
		name: "MySQL",
		icon: Database
	},
	{
		name: "Redis",
		icon: Activity
	},
	{
		name: "PostgreSQL",
		icon: Database
	},
	{
		name: "Git",
		icon: GitBranch
	},
	{
		name: "WordPress",
		icon: Globe
	},
	{
		name: "Cloudflare",
		icon: Shield
	}
];
function TechMarquee() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "py-12 border-y bg-gradient-to-r from-secondary/20 via-transparent to-secondary/20 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs uppercase tracking-widest text-muted-foreground mb-6",
				children: "Pre-tuned for the stacks you already love"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-8 animate-[hostmarquee_28s_linear_infinite] whitespace-nowrap will-change-transform",
						children: [...TECH_STACK, ...TECH_STACK].map((t, i) => {
							const Icon = t.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 px-5 py-3 rounded-full border bg-card/60 backdrop-blur shrink-0 hover-scale",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-sm",
									children: t.name
								})]
							}, i);
						})
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes hostmarquee { to { transform: translateX(-50%); } }` })]
	});
}
var TERMINAL_LINES = [
	{
		t: "$ infiniforge deploy --plan vps-pro --region BOM",
		c: "text-white"
	},
	{
		t: "✓ Provisioning NVMe volume (160 GB)…",
		c: "text-emerald-400"
	},
	{
		t: "✓ Booting Ubuntu 24.04 LTS on 4 vCPU · 8 GB RAM",
		c: "text-emerald-400"
	},
	{
		t: "✓ Attaching 10 Gbps uplink · anti-DDoS layer",
		c: "text-emerald-400"
	},
	{
		t: "✓ Installing LiteSpeed + Redis + PostgreSQL",
		c: "text-emerald-400"
	},
	{
		t: "→ Issuing free Let's Encrypt SSL…",
		c: "text-sky-400"
	},
	{
		t: "✓ Live at https://your-app.infiniforge.cloud",
		c: "text-primary"
	},
	{
		t: "  Total time: 47 seconds ⚡",
		c: "text-amber-300"
	}
];
function LiveTerminal() {
	const [step, setStep] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setStep((s) => (s + 1) % (TERMINAL_LINES.length + 3)), 1200);
		return () => clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-white/10 bg-slate-950 shadow-2xl overflow-hidden max-w-2xl mx-auto text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-slate-900/80 border-b border-white/10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-yellow-500 shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 sm:ml-3 text-[10px] sm:text-[11px] text-slate-400 font-mono truncate",
					children: "infiniforge@cloud ~ deploy.sh"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex h-2 w-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-emerald-400" })]
					}), "LIVE"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-3 sm:p-5 font-mono text-[10.5px] sm:text-[12.5px] leading-relaxed min-h-[220px] overflow-x-auto",
			children: [TERMINAL_LINES.slice(0, Math.min(step, TERMINAL_LINES.length)).map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("animate-fade-in whitespace-nowrap sm:whitespace-normal", l.c),
				children: l.t
			}, i)), step < TERMINAL_LINES.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-white/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-2 h-4 bg-primary animate-pulse align-middle" })
			})]
		})]
	});
}
function StatusTicker() {
	const [t, setT] = (0, import_react.useState)(Date.now());
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setT(Date.now()), 2e3);
		return () => clearInterval(id);
	}, []);
	const now = new Date(t);
	const rows = DATA_CENTERS.slice(0, 6).map((d, i) => ({
		...d,
		ping: 8 + ((t / 1e3 + i * 13) % 40 | 0),
		load: 20 + ((t / 700 + i * 17) % 55 | 0)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-10 border-y bg-secondary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex h-2.5 w-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "All systems operational"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: ["· updated ", now.toLocaleTimeString()]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#datacenters",
					className: "text-xs font-medium text-primary hover:underline story-link",
					children: "View full status →"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-3 hover-scale",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold",
								children: r.code
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-emerald-500",
								children: [
									"● ",
									r.ping,
									"ms"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground truncate",
							children: r.city
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-1.5 rounded-full bg-secondary overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-gradient-to-r from-emerald-500 via-primary to-fuchsia-500 transition-all duration-1000",
								style: { width: `${r.load}%` }
							})
						})
					]
				}, r.code))
			})]
		})
	});
}
var COMPARE_ROWS = [
	{
		label: "NVMe SSD storage",
		shared: true,
		vps: true,
		dedicated: true
	},
	{
		label: "Free .in domain",
		shared: true,
		vps: true,
		dedicated: true
	},
	{
		label: "Free SSL (Let's Encrypt)",
		shared: true,
		vps: true,
		dedicated: true
	},
	{
		label: "Root / SSH access",
		shared: false,
		vps: true,
		dedicated: true
	},
	{
		label: "Dedicated IP",
		shared: false,
		vps: true,
		dedicated: true
	},
	{
		label: "Snapshots & backups",
		shared: "Daily",
		vps: "Hourly",
		dedicated: "Custom"
	},
	{
		label: "DDoS protection",
		shared: "Basic",
		vps: "Advanced",
		dedicated: "Enterprise"
	},
	{
		label: "Uptime SLA",
		shared: "99.9%",
		vps: "99.99%",
		dedicated: "99.995%"
	},
	{
		label: "IPMI / iLO access",
		shared: false,
		vps: false,
		dedicated: true
	},
	{
		label: "Custom kernel",
		shared: false,
		vps: true,
		dedicated: true
	}
];
function ComparisonTable() {
	const cell = (v) => v === true ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mx-auto h-5 w-5 text-emerald-500" }) : v === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "mx-auto h-5 w-5 text-muted-foreground/50" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "font-semibold text-sm",
		children: v
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16 md:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "mb-3",
						children: "Side-by-side"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-bold",
						children: "Which plan is right for you?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mt-2",
						children: "Compare shared, VPS and dedicated at a glance."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[640px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-3 sm:px-5 py-4 font-semibold",
									children: "Feature"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
									className: "text-center px-3 sm:px-5 py-4 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "mx-auto h-5 w-5 text-sky-500 mb-1" }), " Shared"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
									className: "text-center px-3 sm:px-5 py-4 font-semibold bg-primary/5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "mx-auto h-5 w-5 text-primary mb-1" }),
										" Cloud VPS",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] font-normal text-primary mt-0.5",
											children: "MOST POPULAR"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
									className: "text-center px-3 sm:px-5 py-4 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "mx-auto h-5 w-5 text-amber-600 mb-1" }), " Dedicated"]
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: COMPARE_ROWS.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: cn("border-t transition-colors hover:bg-secondary/30", i % 2 === 1 && "bg-secondary/10"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 sm:px-5 py-3.5 font-medium",
									children: r.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 sm:px-5 py-3.5 text-center",
									children: cell(r.shared)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 sm:px-5 py-3.5 text-center bg-primary/5",
									children: cell(r.vps)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 sm:px-5 py-3.5 text-center",
									children: cell(r.dedicated)
								})
							]
						}, r.label)) })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:hidden text-center text-[11px] text-muted-foreground py-2 border-t",
					children: "← swipe to compare →"
				})]
			})]
		})
	});
}
var MIGRATION_STEPS = [
	{
		icon: MessageCircle,
		title: "Ping us on WhatsApp",
		desc: "Share your current hosting details — no forms, no calls."
	},
	{
		icon: RefreshCw,
		title: "We migrate everything",
		desc: "Files, databases, emails, DNS — moved by our engineers."
	},
	{
		icon: Shield,
		title: "Zero-downtime cutover",
		desc: "We test on staging, then flip DNS at your convenience."
	},
	{
		icon: Rocket,
		title: "Live in 24 hours",
		desc: "Faster site, lower bill, and full 30-day money-back."
	}
];
function MigrationSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16 md:py-20 bg-gradient-to-b from-secondary/30 to-transparent",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mb-3 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0",
							children: "✨ Free white-glove migration"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl md:text-4xl font-bold",
							children: "Move to Infiniforge in 4 steps"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground mt-2",
							children: "On any plan. No credit card. No downtime. No cost."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid gap-6 md:grid-cols-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" }), MIGRATION_STEPS.map((s, i) => {
						const Icon = s.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative text-center animate-reveal-up",
							style: { animationDelay: `${i * 100}ms` },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mx-auto h-16 w-16 rounded-2xl bg-gradient-brand text-white flex items-center justify-center shadow-elegant animate-glow-pulse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-7 w-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border-2 border-primary text-xs font-bold flex items-center justify-center text-primary",
										children: i + 1
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 font-semibold",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-1",
									children: s.desc
								})
							]
						}, s.title);
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HostingWhatsAppButton, {
						items: [{
							name: "Free hosting migration",
							qty: 1
						}],
						note: "I would like a free migration from my current hosting.",
						className: "bg-[#25D366] hover:bg-[#1ebe5c] text-white border-0 shadow-elegant animate-glow-pulse",
						label: "Start free migration on WhatsApp",
						size: "lg"
					})
				})
			]
		})
	});
}
var TESTIMONIALS = [
	{
		name: "Rahul Sharma",
		role: "Founder, Kirana.io",
		quote: "Moved 12 client sites overnight. Page loads dropped from 3.2s to 0.7s. My bill dropped 40%.",
		avatar: "RS",
		rating: 5
	},
	{
		name: "Priya Menon",
		role: "CTO, Nexbill SaaS",
		quote: "The VPS Pro handles 40k daily users effortlessly. Their NOC replied on WhatsApp in 90 seconds at 2am.",
		avatar: "PM",
		rating: 5
	},
	{
		name: "Arjun Kapoor",
		role: "Agency Owner, Pixelcraft",
		quote: "Reseller panel is the cleanest I've seen. White-label branding, per-client resource limits — everything just works.",
		avatar: "AK",
		rating: 5
	},
	{
		name: "Sneha Iyer",
		role: "Ops Head, LogiTrack",
		quote: "Dedicated EPYC + 10 Gbps uplink powers our route-optimisation. Zero downtime in 14 months.",
		avatar: "SI",
		rating: 5
	}
];
function Testimonials() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16 md:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex",
						children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold",
						children: "4.9 / 5 · 2,400+ businesses"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl md:text-4xl font-bold",
					children: "Trusted by founders & agencies"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 md:grid-cols-2 lg:grid-cols-4",
				children: TESTIMONIALS.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 relative overflow-hidden group hover-scale animate-reveal-up",
					style: { animationDelay: `${i * 80}ms` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "absolute -top-2 -right-2 h-20 w-20 text-primary/5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-0.5 mb-3",
							children: [...Array(t.rating)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm leading-relaxed",
							children: [
								"\"",
								t.quote,
								"\""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 pt-4 border-t flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-full bg-gradient-brand text-white flex items-center justify-center text-xs font-bold shadow-elegant",
								children: t.avatar
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: t.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: t.role
							})] })]
						})
					]
				}, t.name))
			})]
		})
	});
}
var FAQS = [
	{
		q: "Do you offer a money-back guarantee?",
		a: "Yes — every shared, VPS and dedicated plan comes with a 30-day no-questions-asked refund. Domain renewals and third-party licenses are non-refundable."
	},
	{
		q: "How fast can you migrate my existing website?",
		a: "Most WordPress or PHP sites are migrated within 4-6 hours. Complex apps with custom stacks are typically live within 24 hours, with zero downtime."
	},
	{
		q: "Which control panel do you provide?",
		a: "Shared and reseller plans include cPanel or DirectAdmin. VPS and dedicated plans support cPanel, Plesk, CyberPanel or plain SSH — your choice."
	},
	{
		q: "Can I upgrade my plan later?",
		a: "Absolutely. Scale CPU, RAM and storage anytime — most upgrades apply within minutes with no downtime and pro-rated billing."
	},
	{
		q: "Do you charge for SSL, backups or DDoS protection?",
		a: "No. Free Let's Encrypt SSL, daily backups (30-day retention) and enterprise DDoS protection are included on every plan."
	},
	{
		q: "Where are your servers physically located?",
		a: "We operate from 12 Tier III & IV facilities across Mumbai, Delhi, Bengaluru, Singapore, Dubai, Frankfurt, London, New York, San Jose and more."
	}
];
function FAQSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16 md:py-20 bg-secondary/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "mb-3",
						children: "FAQ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-bold",
						children: "Answers before you ask"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mt-2",
						children: "Still curious? Ping us on WhatsApp — we reply in minutes."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-2 md:p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "single",
					collapsible: true,
					className: "w-full",
					children: FAQS.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
						value: `i-${i}`,
						className: "border-b last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
							className: "text-left font-semibold hover:no-underline px-3",
							children: f.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
							className: "text-muted-foreground leading-relaxed px-3",
							children: f.a
						})]
					}, i))
				})
			})]
		})
	});
}
var TRUST_BADGES = [
	{
		icon: Award,
		label: "ISO 27001 Certified"
	},
	{
		icon: Shield,
		label: "PCI-DSS Compliant"
	},
	{
		icon: Timer,
		label: "30-day Money-back"
	},
	{
		icon: Headphones,
		label: "24×7 NOC Support"
	},
	{
		icon: TrendingUp,
		label: "99.99% Uptime SLA"
	}
];
function TrustBar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 mt-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-80",
			children: TRUST_BADGES.map((b, i) => {
				const Icon = b.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs font-medium text-muted-foreground animate-reveal-up",
					style: { animationDelay: `${i * 60}ms` },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" }), b.label]
				}, i);
			})
		})
	});
}
function HostingPage() {
	const cms = useCms("hosting_page");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden py-12 sm:py-16 md:py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 -z-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-brand opacity-20 blur-3xl animate-hero-blob" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 opacity-20 blur-3xl animate-hero-float-slow" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 opacity-[0.04]",
							style: {
								backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
								backgroundSize: "44px 44px"
							}
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative h-[520px] w-[520px]",
						children: [
							Server,
							Cloud,
							Database,
							Cpu,
							Shield,
							Globe
						].map((Ic, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute left-1/2 top-1/2 -ml-6 -mt-6 h-12 w-12 rounded-2xl glass shadow-elegant flex items-center justify-center animate-hero-orbit",
							style: {
								["--r"]: `${210 + i % 2 * 40}px`,
								animationDelay: `${i * -3}s`,
								animationDuration: `${18 + i * 2}s`
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ic, { className: "h-5 w-5 text-primary" })
						}, i))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mb-4 bg-gradient-brand text-white border-0 animate-glow-pulse",
							children: cms.badge
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]",
							children: [
								cms.title,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-gradient-brand bg-clip-text text-transparent animate-gradient",
									children: cms.title_gradient
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2",
							children: cms.subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 max-w-md sm:max-w-none mx-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									className: "bg-gradient-brand text-white shadow-elegant hover-scale animate-glow-pulse w-full sm:w-auto",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: cms.cta_primary.link,
										children: [
											cms.cta_primary.label,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 ml-1" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									variant: "outline",
									asChild: true,
									className: "w-full sm:w-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: cms.cta_secondary.link,
										children: cms.cta_secondary.label
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									variant: "outline",
									asChild: true,
									className: "w-full sm:w-auto border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: cms.cta_tertiary.link,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 mr-1" }),
											" ",
											cms.cta_tertiary.label
										]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto",
							children: cms.stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border bg-card/60 backdrop-blur px-4 py-3 hover-scale animate-reveal-up",
								style: { animationDelay: `${i * 100}ms` },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-extrabold bg-gradient-brand bg-clip-text text-transparent",
									children: s.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: s.label
								})]
							}, s.label + i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustBar, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-14 relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTerminal, {})
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusTicker, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechMarquee, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "datacenters",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataCentersMap, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "plans",
			className: "py-16 md:py-20 bg-gradient-to-b from-transparent to-secondary/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-bold",
						children: "Pick the perfect plan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mt-2",
						children: "Shared, VPS or Dedicated — scale anytime with zero downtime."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "vps",
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "mx-auto flex w-full max-w-md h-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "shared",
								className: "flex-1 text-xs sm:text-sm py-2",
								children: "Shared"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "vps",
								className: "flex-1 text-xs sm:text-sm py-2",
								children: "Cloud VPS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "dedicated",
								className: "flex-1 text-xs sm:text-sm py-2",
								children: "Dedicated"
							})
						]
					}), [
						{
							v: "shared",
							plans: SHARED
						},
						{
							v: "vps",
							plans: VPS
						},
						{
							v: "dedicated",
							plans: DEDICATED
						}
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: t.v,
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in",
							children: t.plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanCard, { plan: p }, p.id))
						})
					}, t.v))]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparisonTable, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "calculator",
			className: "py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, {})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MigrationSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-16 md:py-20 bg-secondary/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-bold",
						children: "Everything included, nothing hidden"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mt-2",
						children: "Enterprise features at startup pricing."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
					children: FEATURES.map((f) => {
						const Icon = f.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5 hover-scale group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-elegant mb-3 group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold",
									children: f.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-1",
									children: f.desc
								})
							]
						}, f.title);
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-bold",
						children: "Complete your stack"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mt-2",
						children: "Bundle domains, SSL & managed services with your hosting."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						{
							slug: "domains",
							title: "Domains & SSL",
							desc: ".com, .in & wildcard SSL",
							icon: Globe,
							gradient: "from-sky-500 to-blue-600"
						},
						{
							slug: "it-services",
							title: "Managed IT",
							desc: "Server admin & security",
							icon: Shield,
							gradient: "from-emerald-500 to-teal-600"
						},
						{
							slug: "monitoring",
							title: "Monitoring & AMC",
							desc: "24×7 uptime alerts",
							icon: Activity,
							gradient: "from-orange-500 to-red-500"
						},
						{
							slug: "saas",
							title: "SaaS Applications",
							desc: "ERP, CRM & more",
							icon: Rocket,
							gradient: "from-fuchsia-500 to-violet-600"
						}
					].map((c) => {
						const Icon = c.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/products",
							search: { category: c.slug },
							className: "group block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-5 h-full transition-all hover:-translate-y-1 hover:shadow-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-elegant mb-3 group-hover:scale-110 transition-transform", c.gradient),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-semibold flex items-center justify-between",
										children: [c.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground mt-1",
										children: c.desc
									})
								]
							})
						}, c.slug);
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Testimonials, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-16 md:py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "relative overflow-hidden p-6 sm:p-8 md:p-12 text-center border-0 bg-gradient-brand shadow-elegant animate-gradient",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/20 blur-3xl animate-hero-blob" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-hero-float-slow" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "mb-4 bg-white/20 text-white border-white/30 backdrop-blur",
									children: "💬 Instant WhatsApp support"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl md:text-4xl font-extrabold text-white drop-shadow",
									children: cms.final_cta_title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-white/95 max-w-2xl mx-auto",
									children: cms.final_cta_subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap justify-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HostingWhatsAppButton, {
										items: [{
											name: "Hosting consultation",
											qty: 1
										}],
										variant: "default",
										className: "bg-[#25D366] hover:bg-[#1ebe5c] text-white border-0 shadow-elegant animate-glow-pulse",
										label: "Chat on WhatsApp"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										className: "bg-white/10 text-white border-white/60 hover:bg-white/20 hover:text-white backdrop-blur",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/contact",
											children: "Request callback"
										})
									})]
								})
							]
						})
					]
				})
			})
		})
	] });
}
//#endregion
export { HostingPage as component };
