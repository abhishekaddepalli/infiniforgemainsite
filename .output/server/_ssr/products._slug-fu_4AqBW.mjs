import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { An as ChevronRight, Et as LoaderCircle, F as ShoppingCart, Nn as Check, O as Star, Zn as ArrowLeft, cn as ExternalLink, dt as Package, j as Sparkles, z as Share2 } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { a as useCms, n as CmsIcon } from "./cms-BQLw1hye.mjs";
import { a as useCart } from "./cart-B06bdZ_b.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { t as WhatsAppOrderButton } from "./WhatsAppOrderButton-COEOsE3v.mjs";
import { t as Route } from "./products._slug-PYokAdWO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products._slug-fu_4AqBW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductDetail() {
	const { slug } = Route.useParams();
	const cms = useCms("product_detail");
	const navigate = useNavigate();
	const { add } = useCart();
	const [qty, setQty] = (0, import_react.useState)(1);
	const [activeImg, setActiveImg] = (0, import_react.useState)(0);
	const { data: product, isLoading } = useQuery({
		queryKey: ["product-detail", slug],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("status", "active").maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const { data: related = [] } = useQuery({
		queryKey: [
			"product-related",
			product?.category_id,
			product?.id
		],
		enabled: !!product && cms.show_related,
		queryFn: async () => {
			const q = supabase.from("products").select("id,slug,name,thumbnail_url,price_inr,billing,product_type").eq("status", "active").neq("id", product.id).limit(4);
			if (product.category_id) q.eq("category_id", product.category_id);
			const { data } = await q;
			return data ?? [];
		}
	});
	if (isLoading || !product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-32 flex items-center justify-center text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin mr-2" }), " Loading…"]
	}) });
	const gallery = [product.thumbnail_url, ...Array.isArray(product.gallery_urls) ? product.gallery_urls : []].filter(Boolean);
	const primaryImg = gallery[activeImg] ?? gallery[0] ?? null;
	const features = Array.isArray(product.features) ? product.features : [];
	const priceLine = product.billing === "one-time" ? `one-time · +${product.gst_percent}% GST` : `per ${product.billing} · +${product.gst_percent}% GST`;
	const gst = Number(product.price_inr) * Number(product.gst_percent) / 100;
	const total = Number(product.price_inr) + gst;
	const cartItem = {
		id: product.id,
		name: product.name,
		price_inr: Number(product.price_inr),
		gst_percent: Number(product.gst_percent),
		billing: product.billing,
		thumbnail_url: product.thumbnail_url ?? null,
		product_type: product.product_type
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-foreground",
						children: "Home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products",
						className: "hover:text-foreground",
						children: "Products"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground font-medium truncate max-w-[220px]",
						children: product.name
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-square rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-secondary/20 overflow-hidden shadow-card",
						children: [primaryImg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: primaryImg,
							alt: product.name,
							className: "h-full w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full w-full grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-24 w-24 text-muted-foreground/30" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-4 left-4 flex gap-2 flex-wrap",
							children: [
								product.popular && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-primary text-primary-foreground shadow-md",
									children: "Popular"
								}),
								product.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 mr-1 fill-current" }), " Featured"]
								}),
								product.demo_enabled && product.demo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-emerald-500 text-white shadow-md",
									children: "Live demo available"
								})
							]
						})]
					}), gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-5 gap-2",
						children: gallery.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveImg(i),
							className: cn("aspect-square rounded-lg overflow-hidden border-2 transition-all", i === activeImg ? "border-primary shadow-elegant" : "border-border hover:border-primary/40"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: g,
								alt: "",
								className: "h-full w-full object-cover"
							})
						}, i))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wider text-primary font-semibold",
							children: product.product_type
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-3xl sm:text-4xl font-bold tracking-tight leading-tight",
							children: product.name
						}),
						product.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-base text-muted-foreground leading-relaxed",
							children: product.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 rounded-2xl border border-border bg-card p-5 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-3 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-4xl font-bold",
										children: formatINR(Number(product.price_inr))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted-foreground",
										children: priceLine
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: ["Total incl. GST: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "text-foreground",
										children: formatINR(total)
									})]
								}),
								product.stock !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 text-xs",
									children: product.stock > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-600 font-medium",
										children: [
											"✓ In stock (",
											product.stock,
											" available)"
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive font-medium",
										children: "Out of stock"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex items-center gap-3 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center rounded-lg border border-border overflow-hidden",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setQty((q) => Math.max(1, q - 1)),
													className: "h-10 w-10 hover:bg-secondary text-lg",
													children: "−"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "h-10 w-12 grid place-items-center font-semibold tabular-nums",
													children: qty
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setQty((q) => q + 1),
													className: "h-10 w-10 hover:bg-secondary text-lg",
													children: "+"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "lg",
											className: "bg-gradient-brand text-white flex-1 min-w-[140px]",
											onClick: () => {
												for (let i = 0; i < qty; i++) add(cartItem);
												navigate({ to: "/checkout" });
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4 mr-2" }),
												" ",
												cms.buy_now_label
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											variant: "outline",
											onClick: () => {
												for (let i = 0; i < qty; i++) add(cartItem);
												toast.success(`${qty} × ${product.name} added`);
											},
											children: cms.add_to_cart_label
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2",
									children: [product.demo_enabled && product.demo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										variant: "outline",
										className: "border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: product.demo_url,
											target: "_blank",
											rel: "noreferrer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4 mr-2" }),
												" ",
												cms.demo_button_label
											]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppOrderButton, {
										surface: "product",
										size: "lg",
										className: "border-[#25D366]/40 hover:bg-[#25D366]/10 w-full",
										items: [{
											name: product.name,
											qty,
											price_inr: Number(product.price_inr)
										}],
										total_inr: Number(product.price_inr) * qty
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2",
									children: (cms.trust_badges ?? []).map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-7 w-7 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsIcon, {
												name: b.icon,
												className: "h-3.5 w-3.5"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: b.label
										})]
									}, i))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									const url = typeof window !== "undefined" ? window.location.href : "";
									if (navigator.share) navigator.share({
										title: product.name,
										url
									}).catch(() => {});
									else {
										navigator.clipboard?.writeText(url);
										toast.success("Link copied");
									}
								},
								className: "inline-flex items-center gap-1 hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3 w-3" }), " Share"]
							}), product.sku && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· SKU: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: product.sku
							})] })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-14 grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-xl font-bold flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary" }),
							" ",
							cms.description_title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed",
						children: product.long_description || product.description || "Detailed overview coming soon."
					})]
				}), features.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: cms.features_title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2.5",
						children: features.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-500 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(f) })]
						}, i))
					})]
				})]
			}),
			cms.show_related && related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between flex-wrap gap-3 mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold",
						children: cms.related_title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: cms.related_subtitle
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/products",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1 rotate-180" }), " View all"]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/products/$slug",
						params: { slug: r.slug },
						className: "group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-elegant transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-video bg-secondary overflow-hidden",
							children: r.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: r.thumbnail_url,
								alt: r.name,
								className: "h-full w-full object-cover group-hover:scale-105 transition-transform"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full w-full grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-8 w-8 text-muted-foreground/40" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground",
									children: r.product_type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 font-semibold text-sm line-clamp-2",
									children: r.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 text-primary font-bold",
									children: [formatINR(Number(r.price_inr)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] font-normal text-muted-foreground ml-1",
										children: ["/", r.billing]
									})]
								})
							]
						})]
					}, r.id))
				})]
			})
		]
	}) });
}
//#endregion
export { ProductDetail as component };
