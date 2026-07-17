import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Et as LoaderCircle, F as ShoppingCart, Hn as Boxes, Nn as Check, Pt as KeyRound, R as ShieldCheck, U as Search, Un as Bot, V as Server, Xn as ArrowRight, cn as ExternalLink, dn as Earth, dt as Package, j as Sparkles, n as Zap, xn as Cloud } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { a as useCart } from "./cart-B06bdZ_b.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { t as WhatsAppOrderButton } from "./WhatsAppOrderButton-COEOsE3v.mjs";
import { t as Reveal } from "./Reveal-CUxnlK3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products.index-R65ciInt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPE_LABEL = {
	physical: "Physical",
	digital: "Digital",
	service: "Service",
	subscription: "SaaS",
	license: "License",
	hosting: "Hosting",
	vps: "VPS",
	domain: "Domain",
	ssl: "SSL"
};
function ProductsPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("all");
	const { add } = useCart();
	const { data: products, isLoading } = useQuery({
		queryKey: ["public-products"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("id, slug, name, description, price_inr, gst_percent, billing, product_type, featured, popular, thumbnail_url, features, category_id, demo_url, demo_enabled").eq("status", "active").order("popular", { ascending: false }).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const types = (0, import_react.useMemo)(() => {
		const s = /* @__PURE__ */ new Set();
		(products ?? []).forEach((p) => s.add(p.product_type));
		return Array.from(s);
	}, [products]);
	const filtered = (0, import_react.useMemo)(() => {
		return (products ?? []).filter((p) => {
			const matchesType = type === "all" || p.product_type === type;
			const matchesQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.description ?? "").toLowerCase().includes(q.toLowerCase());
			return matchesType && matchesQ;
		});
	}, [
		products,
		q,
		type
	]);
	const gradientFor = (t) => t === "vps" || t === "hosting" || t === "domain" ? "green" : t === "license" || t === "service" ? "saffron" : "brand";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-gradient-hero",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-hero-blob pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl animate-hero-blob pointer-events-none",
				style: { animationDelay: "-4s" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "rounded-full border-primary/30 bg-primary/10 text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-3.5 w-3.5" }), " Product catalog"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl",
						children: [
							"Every product your business needs — ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gradient-brand animate-gradient",
								children: "in one catalog"
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed",
						children: "Hosting, VPS, domains, SSL, SaaS, licenses, AI and enterprise services. Instant delivery, GST-compliant invoices and 24×7 support."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search VPS, ERP, SSL, CRM…",
								value: q,
								onChange: (e) => setQ(e.target.value),
								className: "pl-10 h-12 bg-card shadow-card"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }),
									" ",
									(products ?? []).length,
									"+ products live"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 text-primary" }), " Instant delivery"]
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-6 rounded-[2rem] border border-dashed border-primary/25 animate-hero-orbit-rev" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-16 rounded-full border border-dashed border-accent/25 animate-hero-orbit" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-1/3 rounded-2xl bg-gradient-brand text-white shadow-elegant flex flex-col items-center justify-center animate-glow-pulse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[10px] uppercase tracking-wider font-bold",
									children: "Catalog"
								})]
							}),
							[
								{
									i: Server,
									label: "VPS",
									tone: "from-emerald-500 to-teal-500",
									angle: 0,
									d: "0s"
								},
								{
									i: Cloud,
									label: "Hosting",
									tone: "from-sky-500 to-indigo-500",
									angle: 45,
									d: "-1s"
								},
								{
									i: Earth,
									label: "Domains",
									tone: "from-orange-500 to-rose-500",
									angle: 90,
									d: "-2s"
								},
								{
									i: ShieldCheck,
									label: "SSL",
									tone: "from-emerald-500 to-lime-500",
									angle: 135,
									d: "-3s"
								},
								{
									i: Boxes,
									label: "SaaS",
									tone: "from-violet-500 to-fuchsia-500",
									angle: 180,
									d: "-4s"
								},
								{
									i: KeyRound,
									label: "Licenses",
									tone: "from-amber-500 to-orange-500",
									angle: 225,
									d: "-5s"
								},
								{
									i: Bot,
									label: "AI",
									tone: "from-cyan-500 to-blue-500",
									angle: 270,
									d: "-6s"
								},
								{
									i: Zap,
									label: "Services",
									tone: "from-pink-500 to-rose-500",
									angle: 315,
									d: "-7s"
								}
							].map(({ i: Icon, label, tone, angle, d }) => {
								const r = 44;
								const x = 50 + r * Math.cos(angle * Math.PI / 180);
								const y = 50 + r * Math.sin(angle * Math.PI / 180);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/60 bg-card/90 backdrop-blur px-2 py-1.5 shadow-card flex items-center gap-1.5 animate-hero-float",
									style: {
										left: `${x}%`,
										top: `${y}%`,
										animationDelay: d
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("h-6 w-6 rounded-md text-white flex items-center justify-center bg-gradient-to-br", tone),
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
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2 mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CatChip, {
				active: type === "all",
				onClick: () => setType("all"),
				children: [
					"All (",
					(products ?? []).length,
					")"
				]
			}), types.map((t) => {
				const count = (products ?? []).filter((p) => p.product_type === t).length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CatChip, {
					active: type === t,
					onClick: () => setType(t),
					children: [
						TYPE_LABEL[t] ?? t,
						" (",
						count,
						")"
					]
				}, t);
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-24 flex items-center justify-center text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin mr-2" }), " Loading catalog…"]
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground",
			children: "No products match your search."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: filtered.map((p, idx) => {
				const grad = gradientFor(p.product_type);
				const feats = Array.isArray(p.features) ? p.features.slice(0, 4) : [];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: idx % 6 * 60,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "group relative rounded-2xl border border-border bg-card overflow-hidden shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant hover:border-primary/40 flex flex-col h-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/products/$slug",
							params: { slug: p.slug },
							className: "block aspect-video bg-gradient-to-br from-secondary/60 to-secondary/20 relative overflow-hidden",
							children: [
								p.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.thumbnail_url,
									alt: p.name,
									className: "h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full w-full grid place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white", grad === "brand" && "bg-gradient-brand", grad === "green" && "bg-gradient-green", grad === "saffron" && "bg-gradient-saffron"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute top-3 left-3 flex gap-1.5",
									children: [p.popular && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-primary text-primary-foreground shadow",
										children: "Popular"
									}), !p.popular && p.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-accent text-accent-foreground shadow",
										children: "Featured"
									})]
								}),
								p.demo_enabled && p.demo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-3 right-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										className: "bg-emerald-500 text-white shadow",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 mr-1" }), " Live demo"]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5 flex flex-col flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground font-semibold",
									children: TYPE_LABEL[p.product_type] ?? p.product_type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/products/$slug",
									params: { slug: p.slug },
									className: "mt-1 font-semibold text-lg leading-tight hover:text-primary transition-colors",
									children: p.name
								}),
								p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2",
									children: p.description
								}),
								feats.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-1",
									children: feats.slice(0, 3).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "text-xs text-muted-foreground flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-accent shrink-0" }),
											" ",
											String(f)
										]
									}, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-auto pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline gap-2 mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl font-bold leading-none",
												children: formatINR(Number(p.price_inr))
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-muted-foreground",
												children: p.billing === "one-time" ? `+${p.gst_percent}% GST` : `/${p.billing}`
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												asChild: true,
												className: "flex-1 bg-gradient-brand text-white",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
													to: "/products/$slug",
													params: { slug: p.slug },
													children: ["View details ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 ml-1" })]
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "outline",
												"aria-label": "Add to cart",
												onClick: () => {
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
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppOrderButton, {
											surface: "product",
											size: "sm",
											className: "mt-2 w-full border-[#25D366]/40 hover:bg-[#25D366]/10",
											items: [{
												name: p.name,
												qty: 1,
												price_inr: Number(p.price_inr)
											}],
											total_inr: Number(p.price_inr)
										})
									]
								})
							]
						})]
					})
				}, p.id);
			})
		})]
	})] });
}
function CatChip({ active, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: cn("px-4 py-2 rounded-full text-sm font-medium border transition-all", active ? "bg-gradient-brand text-white border-transparent shadow-elegant" : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40"),
		children
	});
}
//#endregion
export { ProductsPage as component };
