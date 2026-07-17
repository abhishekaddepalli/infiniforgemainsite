import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, u as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { At as LayoutDashboard, Bt as Heart, Ct as LogOut, F as ShoppingCart, St as Mail, Xn as ArrowRight, at as Phone, d as User, j as Sparkles, o as Wallet, r as X, vt as Menu, xt as MapPin, yt as Megaphone } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CDoe66ii.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { a as useCms, n as CmsIcon, r as CmsSeo } from "./cms-BQLw1hye.mjs";
import { a as useCart } from "./cart-B06bdZ_b.mjs";
import { a as formatOrderMessage, o as getWhatsAppConfig, r as buildWhatsAppLink } from "./whatsapp-Bfedub3g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteLayout-CrNCfqpS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user, profile, isStaff, signOut, loading } = useAuth();
	const navigate = useNavigate();
	const { count } = useCart();
	const branding = useCms("branding");
	const header = useCms("header");
	const nav = header.nav ?? [];
	const initials = (profile?.full_name ?? user?.email ?? "?").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
	const brandName = branding.brand_name || "Infiniforge";
	const brandParts = brandName.split(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass border-b border-border/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2.5 group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: branding.logo_url || "/pwa-192.png",
							alt: brandName,
							className: "h-10 w-10 rounded-xl object-contain shadow-elegant ring-1 ring-border/60 bg-white/60"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex flex-col leading-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-bold tracking-tight text-foreground",
								children: brandParts[0]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
								children: brandParts.slice(1).join(" ") || branding.tagline
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden lg:flex items-center gap-1",
						children: nav.map((item) => {
							const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								className: cn("px-3.5 py-2 rounded-lg text-sm font-medium transition-colors", active ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"),
								children: item.label
							}, item.to + item.label);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden lg:flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/checkout",
							className: "relative inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary transition-colors",
							"aria-label": "Cart",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-gradient-brand text-white text-[10px] font-bold flex items-center justify-center",
								children: count
							})]
						}), loading ? null : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-secondary transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-8 w-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-semibold",
									children: initials
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: profile?.full_name?.split(" ")[0] ?? "Account"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-56",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: user.email }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/admin",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4 mr-2" }), " Admin console"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/portal",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 mr-2" }), " My portal"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/portal/wallet",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 mr-2" }), " Wallet"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									className: "text-destructive",
									onClick: async () => {
										await signOut();
										navigate({ to: "/" });
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 mr-2" }), " Sign out"]
								})
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								children: "Sign in"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "bg-gradient-brand text-white shadow-elegant hover:opacity-95",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: header.cta_link || "/auth",
								children: header.cta_label || "Get started"
							})
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background",
						onClick: () => setOpen((v) => !v),
						"aria-label": "Toggle menu",
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
					})
				]
			}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:hidden border-t border-border/60 bg-background/95 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-3 space-y-1",
					children: [
						nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							onClick: () => setOpen(false),
							className: "block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
							children: item.label
						}, item.to + item.label)),
						user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border/60 mt-2 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/portal",
									onClick: () => setOpen(false),
									className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), " My portal"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/portal/wallet",
									onClick: () => setOpen(false),
									className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }), " Wallet"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/checkout",
									onClick: () => setOpen(false),
									className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }),
										" Cart ",
										count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-auto h-5 min-w-5 px-1.5 rounded-full bg-gradient-brand text-white text-[10px] font-bold flex items-center justify-center",
											children: count
										})
									]
								}),
								isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/admin",
									onClick: () => setOpen(false),
									className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" }), " Admin console"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 grid grid-cols-2 gap-2",
							children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "col-span-2",
								onClick: async () => {
									setOpen(false);
									await signOut();
									navigate({ to: "/" });
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 mr-2" }), " Sign out"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									children: "Sign in"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "bg-gradient-brand text-white",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: header.cta_link || "/auth",
									children: header.cta_label || "Get started"
								})
							})] })
						})
					]
				})
			})]
		})
	});
}
function SiteFooter() {
	const branding = useCms("branding");
	const footer = useCms("footer");
	const brandName = branding.brand_name || "Infiniforge Technologies";
	const copyright = (footer.copyright || "© {year}").replace("{year}", String((/* @__PURE__ */ new Date()).getFullYear()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-24 border-t border-border bg-gradient-dashboard text-sidebar-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 md:grid-cols-2 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: branding.logo_url || "/pwa-192.png",
								alt: brandName,
								className: "h-10 w-10 rounded-xl object-contain bg-white/90 p-0.5 ring-1 ring-white/20"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "leading-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-white",
									children: brandName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-[0.18em] text-white/50",
									children: branding.tagline
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-white/60 max-w-sm",
							children: footer.tagline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-sm text-white/70",
							children: [
								footer.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }),
										" ",
										footer.email
									]
								}),
								footer.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }),
										" ",
										footer.phone
									]
								}),
								footer.address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" }),
										" ",
										footer.address
									]
								})
							]
						})
					]
				}), (footer.columns ?? []).map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wider text-white/80 mb-4",
					children: col.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2.5 text-sm",
					children: (col.links ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: "text-white/60 hover:text-white transition-colors",
						children: l.label
					}) }, l.label + l.to))
				})] }, col.title))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					copyright,
					" ",
					footer.gstin && `· ${footer.gstin}`
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.06]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -inset-px rounded-full bg-gradient-to-r from-[#ff9933]/40 via-fuchsia-500/30 to-[#138808]/40 opacity-0 blur-sm transition-opacity group-hover:opacity-100",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "relative h-3.5 w-3.5 text-[#ffb266] animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative text-[11px] tracking-wide text-white/70",
							children: [
								"Developed with",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "inline h-3 w-3 -mt-0.5 fill-[#ff4d6d] text-[#ff4d6d] animate-pulse" }),
								" ",
								"by",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://www.linkedin.com/in/abhishek-addepalli",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "font-bold bg-gradient-to-r from-[#ff9933] via-[#ffd699] to-[#7bd67b] bg-clip-text text-transparent hover:underline underline-offset-2",
									children: "Abhishek Addepalli"
								})
							]
						})
					]
				})]
			})]
		})
	});
}
function AnnouncementTicker() {
	const cfg = useCms("announcements");
	const [closed, setClosed] = (0, import_react.useState)(false);
	const items = (cfg.items ?? []).filter((i) => i.enabled !== false);
	if (!cfg.enabled || closed || items.length === 0) return null;
	const speed = Math.max(15, Math.min(cfg.speed_seconds ?? 40, 120));
	const loop = [...items, ...items];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full overflow-hidden border-b border-white/20 bg-gradient-to-r from-primary via-primary to-accent text-white",
		role: "region",
		"aria-label": "Site announcements",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-[100vw] items-center gap-3 px-3 py-2 text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-3.5 w-3.5 animate-pulse" }), cfg.badge_label || "Live"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex whitespace-nowrap will-change-transform",
							style: { animation: `ticker-marquee ${speed}s linear infinite` },
							children: loop.map((it, i) => {
								const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mx-6 inline-flex items-center gap-2 text-sm font-medium",
									children: [
										it.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsIcon, {
											name: it.icon,
											className: "h-4 w-4 opacity-90"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: it.text }),
										it.link && it.cta_label && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
											children: [
												it.cta_label,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })
											]
										})
									]
								});
								return it.link ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: it.link,
									className: "hover:underline",
									children: inner
								}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inner }, i);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-primary to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-accent to-transparent" })
					]
				}),
				cfg.dismissible !== false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setClosed(true),
					"aria-label": "Dismiss announcements",
					className: "shrink-0 rounded-full p-1 text-white/90 transition hover:bg-white/20 hover:text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes ticker-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="ticker-marquee"] { animation-duration: 240s !important; }
        }
      ` })]
	});
}
function makeRef() {
	const d = /* @__PURE__ */ new Date();
	return `WA-${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
function WhatsAppFloatButton() {
	const cfg = getWhatsAppConfig();
	const [hover, setHover] = (0, import_react.useState)(false);
	if (!cfg.wa_ordering_enabled || !cfg.wa_ordering_show_header) return null;
	function handleClick() {
		if (!cfg.wa_ordering_number) {
			toast.error("WhatsApp ordering number is not configured yet.");
			return;
		}
		const reference = makeRef();
		const message = formatOrderMessage(cfg.wa_ordering_greeting, [{ name: "General enquiry" }], {
			template: cfg.wa_ordering_template ?? "premium",
			reference
		});
		toast.success(`Opening WhatsApp · ${reference}`);
		window.open(buildWhatsAppLink(cfg.wa_ordering_number, message), "_blank", "noopener,noreferrer");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-6 right-6 z-40 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `hidden sm:flex items-center gap-2 rounded-full bg-background/95 backdrop-blur border border-border shadow-lg pl-4 pr-3 py-2 text-sm font-medium text-foreground transition-all duration-300 ${hover ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3 pointer-events-none"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "relative flex h-2 w-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-[#25D366]" })]
			}), "Chat with us on WhatsApp"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: handleClick,
			onMouseEnter: () => setHover(true),
			onMouseLeave: () => setHover(false),
			"aria-label": "Chat on WhatsApp",
			className: "group relative h-14 w-14 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] flex items-center justify-center transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 rounded-full ring-1 ring-white/30" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 32 32",
					fill: "currentColor",
					className: "relative h-7 w-7 drop-shadow-sm",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.11 17.29c-.29-.15-1.71-.85-1.97-.94-.26-.1-.46-.15-.65.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.48-.65-.49l-.55-.01c-.19 0-.5.07-.77.36-.26.29-1 1-1 2.42s1.03 2.81 1.17 3c.14.19 2.02 3.09 4.9 4.33.69.3 1.22.47 1.64.6.69.22 1.32.19 1.81.11.55-.08 1.71-.7 1.95-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34zM16.03 5.33c-5.9 0-10.7 4.8-10.7 10.7 0 1.88.49 3.72 1.42 5.34L5 27.33l6.09-1.6a10.66 10.66 0 0 0 4.94 1.26h.01c5.9 0 10.7-4.8 10.7-10.7s-4.81-10.96-10.71-10.96zm0 19.6c-1.55 0-3.08-.42-4.42-1.2l-.32-.19-3.62.95.97-3.53-.21-.34a8.9 8.9 0 0 1-1.36-4.72c0-4.9 3.99-8.89 8.89-8.89s8.89 3.99 8.89 8.89-4 9.03-8.82 9.03z" })
				})
			]
		})]
	});
}
function SiteLayout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsSeo, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementTicker, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppFloatButton, {})
		]
	});
}
//#endregion
export { SiteLayout as t };
