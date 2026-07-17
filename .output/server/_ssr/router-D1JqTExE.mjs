import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, m as lazyRouteComponent, p as Outlet, s as Scripts, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as AuthProvider } from "./use-auth-07FyFxK7.mjs";
import { M as Smartphone, fn as Download, r as X } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { o as recordLoginAlert } from "./alerts.functions-BIA4cKEy.mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$81 } from "./admin.courses._id-DXHe7XAg.mjs";
import { t as CartProvider } from "./cart-B06bdZ_b.mjs";
import { t as Route$82 } from "./courses._slug.index-CdQNDstf.mjs";
import { t as Route$83 } from "./courses._slug.learn-BHi1lCcN.mjs";
import { t as Route$84 } from "./products._slug-PYokAdWO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D1JqTExE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CKgANGNL.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var DISMISSED_KEY = "infiniforge:pwa-install-dismissed";
function InstallPWA() {
	const [deferred, setDeferred] = (0, import_react.useState)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [enabled, setEnabled] = (0, import_react.useState)(true);
	const [brand, setBrand] = (0, import_react.useState)({
		name: "Infiniforge Technologies",
		short: "Install the app for a faster, app-like experience.",
		icon: "/pwa-192.png"
	});
	(0, import_react.useEffect)(() => {
		supabase.from("module_records").select("metadata").eq("module", "pwa_settings").eq("title", "config").maybeSingle().then(({ data }) => {
			const m = data?.metadata ?? {};
			if (m.install_prompt_enabled === false) setEnabled(false);
			setBrand((b) => ({
				name: m.name || b.name,
				short: m.install_prompt_text || b.short,
				icon: m.icon_url || b.icon
			}));
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		if (typeof window === "undefined") return;
		if (window.matchMedia("(display-mode: standalone)").matches) return;
		if (localStorage.getItem(DISMISSED_KEY)) return;
		const onPrompt = (e) => {
			e.preventDefault();
			setDeferred(e);
			setVisible(true);
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		window.addEventListener("appinstalled", () => setVisible(false));
		return () => window.removeEventListener("beforeinstallprompt", onPrompt);
	}, [enabled]);
	if (!visible || !enabled) return null;
	const dismiss = () => {
		localStorage.setItem(DISMISSED_KEY, Date.now().toString());
		setVisible(false);
	};
	const install = async () => {
		if (!deferred) return;
		await deferred.prompt();
		await deferred.userChoice;
		setVisible(false);
		setDeferred(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-24 right-4 left-4 sm:left-auto sm:bottom-24 sm:right-5 z-50 sm:max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-primary/95 via-primary to-accent shadow-2xl backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/20 blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: dismiss,
					"aria-label": "Dismiss install prompt",
					className: "absolute top-2 right-2 h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative p-4 pr-10 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: brand.icon,
						alt: "App icon",
						width: 56,
						height: 56,
						className: "h-14 w-14 rounded-xl shadow-lg ring-2 ring-white/30 shrink-0"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3 w-3" }), " Install App"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-sm font-bold text-white leading-tight truncate",
								children: brand.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-white/85 leading-snug line-clamp-2",
								children: brand.short
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: install,
									className: "h-8 bg-white text-primary hover:bg-white/90 font-semibold shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1.5" }), " Install"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: dismiss,
									className: "h-8 text-white/90 hover:text-white hover:bg-white/10",
									children: "Not now"
								})]
							})
						]
					})]
				})
			]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$80 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Infiniforge Technologies — Enterprise SaaS, IT & AI Platform" },
			{
				name: "description",
				content: "India's unified enterprise platform for SaaS, IT services, hosting, licenses, and AI automation."
			},
			{
				name: "author",
				content: "Infiniforge Technologies"
			},
			{
				name: "theme-color",
				content: "#FF9933"
			},
			{
				name: "background-color",
				content: "#FFF7ED"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Infiniforge"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:title",
				content: "Infiniforge Technologies — Enterprise SaaS, IT & AI Platform"
			},
			{
				name: "twitter:title",
				content: "Infiniforge Technologies — Enterprise SaaS, IT & AI Platform"
			},
			{
				property: "og:description",
				content: "India's unified enterprise platform for SaaS, IT services, hosting, licenses, and AI automation."
			},
			{
				name: "twitter:description",
				content: "India's unified enterprise platform for SaaS, IT services, hosting, licenses, and AI automation."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2ca9a6f-0792-443a-b4b5-fa54adcaa58f/id-preview-e295699b--bc073b55-ba9e-45fb-b46e-1ff78dec7809.lovable.app-1782921071069.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2ca9a6f-0792-443a-b4b5-fa54adcaa58f/id-preview-e295699b--bc073b55-ba9e-45fb-b46e-1ff78dec7809.lovable.app-1782921071069.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "64x64",
				href: "/favicon.png"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "192x192",
				href: "/pwa-192.png"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "512x512",
				href: "/pwa-512.png"
			},
			{
				rel: "shortcut icon",
				type: "image/png",
				href: "/favicon.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$80.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const LOGIN_ALERT_KEY = "infiniforge.login-alert.uid";
		const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event === "SIGNED_OUT") {
				try {
					sessionStorage.removeItem(LOGIN_ALERT_KEY);
				} catch {}
				return;
			}
			queryClient.invalidateQueries();
			if (event === "SIGNED_IN" && session?.user?.id) {
				try {
					if (sessionStorage.getItem(LOGIN_ALERT_KEY) === session.user.id) return;
					sessionStorage.setItem(LOGIN_ALERT_KEY, session.user.id);
				} catch {}
				recordLoginAlert({ data: { at: (/* @__PURE__ */ new Date()).toISOString() } }).catch(() => void 0);
			}
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CartProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallPWA, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		] }) })
	});
}
var $$splitComponentImporter$79 = () => import("./workflows-YbLhQ6mH.mjs");
var Route$79 = createFileRoute("/workflows")({
	head: () => ({ meta: [
		{ title: "Workflows — ISP, LAN, CCTV, Servers, Web, IoT, Courses · Infiniforge" },
		{
			name: "description",
			content: "Interactive device-level workflow diagrams for every Infiniforge service — ISP & multi-WAN, LAN & OS, CCTV & DVR, servers, web dev, IoT, courses and subscriptions."
		},
		{
			property: "og:title",
			content: "Infiniforge Service Workflows"
		},
		{
			property: "og:description",
			content: "Device-level flow diagrams for how we deliver internet, networks, surveillance, servers, software, IoT, courses and subscriptions."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$79, "component")
});
var $$splitComponentImporter$78 = () => import("./services-Bn-6vP58.mjs");
var Route$78 = createFileRoute("/services")({
	head: () => ({ meta: [
		{ title: "Services — Websites, Servers, CCTV, IT Solutions · Infiniforge" },
		{
			name: "description",
			content: "End-to-end IT services: website & app development, ERP/CRM, hosting & VPS, CCTV & networks, AI automation, monitoring, AMC and consulting for Indian businesses."
		},
		{
			property: "og:title",
			content: "Infiniforge Services"
		},
		{
			property: "og:description",
			content: "One partner for your servers, sites, networks and support — with GST invoicing and 24×7 NOC."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$78, "component")
});
var $$splitComponentImporter$77 = () => import("./reset-password-DYGCXV35.mjs");
var Route$77 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$77, "component")
});
var $$splitComponentImporter$76 = () => import("./products-C7F03LXy.mjs");
var Route$76 = createFileRoute("/products")({ component: lazyRouteComponent($$splitComponentImporter$76, "component") });
var $$splitComponentImporter$75 = () => import("./pricing-BL18_9oD.mjs");
var Route$75 = createFileRoute("/pricing")({
	head: () => ({ meta: [
		{ title: "Care Plans & Memberships — Websites, Servers, CCTV, IT Services · Infiniforge" },
		{
			name: "description",
			content: "Transparent care plans and memberships for websites, servers, networks, CCTV and IT services. GST invoicing, 24×7 NOC support, cancel anytime."
		},
		{
			property: "og:title",
			content: "Infiniforge Care Plans & Memberships"
		},
		{
			property: "og:description",
			content: "Fixed-price service plans for startups, SMBs and enterprises."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$75, "component")
});
var $$splitComponentImporter$74 = () => import("./portal-CN-_C_NG.mjs");
var Route$74 = createFileRoute("/portal")({
	head: () => ({ meta: [{ title: "My Portal — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$74, "component")
});
var $$splitComponentImporter$73 = () => import("./hosting-B1H9I7Sh.mjs");
var Route$73 = createFileRoute("/hosting")({
	head: () => ({ meta: [
		{ title: "Hosting & VPS Plans — Infiniforge Technologies" },
		{
			name: "description",
			content: "Blazing-fast SSD shared hosting, cloud VPS, dedicated servers and reseller plans in India. Live pricing calculator, 99.99% uptime, 24×7 NOC support."
		},
		{
			property: "og:title",
			content: "Hosting & VPS Plans — Infiniforge"
		},
		{
			property: "og:description",
			content: "Enterprise-grade cloud hosting, VPS and dedicated servers with live calculator and instant WhatsApp enquiry."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$73, "component")
});
var $$splitComponentImporter$72 = () => import("./deployments-CP4MGmx8.mjs");
var Route$72 = createFileRoute("/deployments")({
	head: () => ({ meta: [
		{ title: "One-Click App Deployments — Infiniforge Technologies" },
		{
			name: "description",
			content: "Deploy Coolify, n8n, WordPress, ERPNext, Odoo, Nextcloud, Ghost, Metabase, Supabase self-host and 70+ prebuilt applications on managed VPS with 24×7 support."
		},
		{
			property: "og:title",
			content: "One-Click App Deployments — Infiniforge"
		},
		{
			property: "og:description",
			content: "Managed deployments of 70+ popular open-source and SaaS applications on your own cloud with backups, SSL and monitoring."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$72, "component")
});
var $$splitComponentImporter$71 = () => import("./dashboard-DJJVxfUL.mjs");
var Route$71 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$71, "component")
});
var $$splitComponentImporter$70 = () => import("./courses-CpxS_IJr.mjs");
var Route$70 = createFileRoute("/courses")({ component: lazyRouteComponent($$splitComponentImporter$70, "component") });
var $$splitComponentImporter$69 = () => import("./contact-BY23t7wc.mjs");
var Route$69 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact Sales — Websites, Servers, CCTV, IT Services · Infiniforge" },
		{
			name: "description",
			content: "Talk to Infiniforge for demos, quotes, AMC, CCTV, servers, hosting and enterprise deployments. Reply within 4 business hours across India."
		},
		{
			property: "og:title",
			content: "Contact Infiniforge"
		},
		{
			property: "og:description",
			content: "GST-invoiced quotes for websites, apps, servers, CCTV and IT services."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$69, "component")
});
var $$splitComponentImporter$68 = () => import("./checkout-B15uhif1.mjs");
var Route$68 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Checkout — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$68, "component")
});
var $$splitComponentImporter$67 = () => import("./auth-Dy69gZXG.mjs");
var Route$67 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — Infiniforge Technologies" },
		{
			name: "description",
			content: "Sign in or create your Infiniforge account to manage subscriptions, licenses, hosting and services."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$67, "component")
});
var $$splitComponentImporter$66 = () => import("./routes-BPRF97Pq.mjs");
var Route$66 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Infiniforge Technologies — Enterprise SaaS, IT Services & AI Automation" }, {
		name: "description",
		content: "India's unified enterprise platform for SaaS, IT services, hosting, VPS, domains, SSL, licenses, ERP/CRM and AI automation."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$66, "component")
});
var $$splitComponentImporter$65 = () => import("./products.index-R65ciInt.mjs");
var Route$65 = createFileRoute("/products/")({
	head: () => ({ meta: [
		{ title: "Products — Hosting, SaaS, Licenses & More — Infiniforge" },
		{
			name: "description",
			content: "Browse VPS hosting, shared hosting, domains, SSL certificates, SaaS platforms, software licenses and AI services. GST invoices included."
		},
		{
			property: "og:title",
			content: "Infiniforge Products & Plans"
		},
		{
			property: "og:description",
			content: "Hosting, SaaS, licenses and services — priced in INR with GST."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$65, "component")
});
var $$splitComponentImporter$64 = () => import("./portal.index-DPMtn7D-.mjs");
var Route$64 = createFileRoute("/portal/")({
	head: () => ({ meta: [{ title: "Dashboard — My Portal" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$64, "component")
});
var $$splitComponentImporter$63 = () => import("./courses.index-DCmE7wHv.mjs");
var Route$63 = createFileRoute("/courses/")({
	head: () => ({ meta: [
		{ title: "Courses — Learn with Infiniforge" },
		{
			name: "description",
			content: "Video-based courses on hosting, domains, marketing and building your online business — free and premium tracks."
		},
		{
			property: "og:title",
			content: "Courses — Infiniforge"
		},
		{
			property: "og:description",
			content: "Guided video courses to grow your online business."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$63, "component")
});
var $$splitComponentImporter$62 = () => import("./admin.index-2H3oqbaL.mjs");
var Route$62 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "Admin Dashboard — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$62, "component")
});
var $$splitComponentImporter$61 = () => import("./portal.wallet-DsZdZXFn.mjs");
var Route$61 = createFileRoute("/portal/wallet")({
	head: () => ({ meta: [{ title: "Wallet — Infiniforge Portal" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$61, "component")
});
var $$splitComponentImporter$60 = () => import("./portal.vps-CSI1Tesx.mjs");
var Route$60 = createFileRoute("/portal/vps")({
	head: () => ({ meta: [{ title: "My VPS — Infiniforge Portal" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$60, "component")
});
var $$splitComponentImporter$59 = () => import("./portal.tickets-DMhSYmla.mjs");
var Route$59 = createFileRoute("/portal/tickets")({ component: lazyRouteComponent($$splitComponentImporter$59, "component") });
var $$splitComponentImporter$58 = () => import("./portal.subscriptions-Ci3Lp6Tl.mjs");
var Route$58 = createFileRoute("/portal/subscriptions")({
	head: () => ({ meta: [{ title: "My Subscriptions — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$58, "component")
});
var $$splitComponentImporter$57 = () => import("./portal.profile-BPtMmSdV.mjs");
var Route$57 = createFileRoute("/portal/profile")({
	head: () => ({ meta: [{ title: "My Profile — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$57, "component")
});
var $$splitComponentImporter$56 = () => import("./portal.orders-vKEa301Y.mjs");
var Route$56 = createFileRoute("/portal/orders")({
	head: () => ({ meta: [{ title: "My Orders — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$56, "component")
});
var $$splitComponentImporter$55 = () => import("./portal.membership-MBBVZisB.mjs");
var Route$55 = createFileRoute("/portal/membership")({
	head: () => ({ meta: [{ title: "My Membership — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$55, "component")
});
var $$splitComponentImporter$54 = () => import("./portal.licenses-BrXrh45r.mjs");
var Route$54 = createFileRoute("/portal/licenses")({
	head: () => ({ meta: [{ title: "License Portal — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$54, "component")
});
var $$splitComponentImporter$53 = () => import("./portal.downloads-DRAN-CQM.mjs");
var Route$53 = createFileRoute("/portal/downloads")({
	head: () => ({ meta: [{ title: "My Downloads — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$53, "component")
});
var $$splitComponentImporter$52 = () => import("./portal.courses-DW8u0Uof.mjs");
var Route$52 = createFileRoute("/portal/courses")({
	head: () => ({ meta: [{ title: "My Courses — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$52, "component")
});
var $$splitComponentImporter$51 = () => import("./portal.affiliate-bUtYIjmh.mjs");
var Route$51 = createFileRoute("/portal/affiliate")({
	head: () => ({ meta: [{ title: "Affiliate — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
var $$splitComponentImporter$50 = () => import("./p._slug-Dcri-ymQ.mjs");
var Route$50 = createFileRoute("/p/$slug")({ component: lazyRouteComponent($$splitComponentImporter$50, "component") });
var $$splitComponentImporter$49 = () => import("./courses._slug-DdzaHw6E.mjs");
var Route$49 = createFileRoute("/courses/$slug")({ component: lazyRouteComponent($$splitComponentImporter$49, "component") });
var $$splitComponentImporter$48 = () => import("./certificates.verify-o6t3m5cb.mjs");
var Route$48 = createFileRoute("/certificates/verify")({
	head: () => ({ meta: [
		{ title: "Verify Certificate — Infiniforge" },
		{
			name: "description",
			content: "Verify an Infiniforge course completion certificate by certificate number."
		},
		{
			property: "og:title",
			content: "Verify Certificate — Infiniforge"
		},
		{
			property: "og:description",
			content: "Check whether an Infiniforge course certificate is valid."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("./admin.whatsapp-orders-xdIrKC8O.mjs");
var Route$47 = createFileRoute("/admin/whatsapp-orders")({
	head: () => ({ meta: [{ title: "WhatsApp Orders — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
var $$splitComponentImporter$46 = () => import("./admin.whatsapp-Q0vEMENI.mjs");
var Route$46 = createFileRoute("/admin/whatsapp")({
	head: () => ({ meta: [{ title: "WhatsApp — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("./admin.wallets-BJWeBAZH.mjs");
var Route$45 = createFileRoute("/admin/wallets")({
	head: () => ({ meta: [{ title: "Wallets — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("./admin.vps-4UFQ9nox.mjs");
var Route$44 = createFileRoute("/admin/vps")({
	head: () => ({ meta: [{ title: "VPS Instances — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
var $$splitComponentImporter$43 = () => import("./admin.users-BfvYo_9M.mjs");
var Route$43 = createFileRoute("/admin/users")({
	head: () => ({ meta: [{ title: "User Management — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("./admin.tickets-Bl-HKaLF.mjs");
var Route$42 = createFileRoute("/admin/tickets")({ component: lazyRouteComponent($$splitComponentImporter$42, "component") });
var $$splitComponentImporter$41 = () => import("./admin.ticket-workflows-XugFu-66.mjs");
var Route$41 = createFileRoute("/admin/ticket-workflows")({
	head: () => ({ meta: [{ title: "Ticket Workflows — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("./admin.subscriptions-Dpb3cwo9.mjs");
var Route$40 = createFileRoute("/admin/subscriptions")({
	head: () => ({ meta: [{ title: "Subscriptions — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("./admin.ssl-CxKkNdDA.mjs");
var Route$39 = createFileRoute("/admin/ssl")({
	head: () => ({ meta: [{ title: "SSL Certificates — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./admin.settings-2dlyIU5X.mjs");
var Route$38 = createFileRoute("/admin/settings")({
	head: () => ({ meta: [{ title: "Settings — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("./admin.services-BwHBkYcO.mjs");
var Route$37 = createFileRoute("/admin/services")({
	head: () => ({ meta: [{ title: "Services — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("./admin.servers-eaPFqXAm.mjs");
var Route$36 = createFileRoute("/admin/servers")({
	head: () => ({ meta: [{ title: "Servers — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("./admin.roles-DzQNlnM4.mjs");
var Route$35 = createFileRoute("/admin/roles")({
	head: () => ({ meta: [
		{ title: "Roles & Permissions — Infiniforge Admin" },
		{
			name: "description",
			content: "Configure role based access control across every module of Infiniforge — Super Admin, Admin, Sales, Support, Finance, Reseller, Customer, Affiliate and Employee."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./admin.reports-DxSinKNd.mjs");
var Route$34 = createFileRoute("/admin/reports")({
	head: () => ({ meta: [{ title: "Reports — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("./admin.pwa-DJ6ktwh5.mjs");
var Route$33 = createFileRoute("/admin/pwa")({ component: lazyRouteComponent($$splitComponentImporter$33, "component") });
var $$splitComponentImporter$32 = () => import("./admin.products-H6wuRPlT.mjs");
var Route$32 = createFileRoute("/admin/products")({
	head: () => ({ meta: [{ title: "Products — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./admin.payments-CS09ehP9.mjs");
var Route$31 = createFileRoute("/admin/payments")({
	head: () => ({ meta: [{ title: "Payments — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./admin.orders-CcCJbaw6.mjs");
var Route$30 = createFileRoute("/admin/orders")({
	head: () => ({ meta: [{ title: "Orders — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./admin.monitoring-6VQz5ohO.mjs");
var Route$29 = createFileRoute("/admin/monitoring")({
	head: () => ({ meta: [{ title: "Monitoring — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./admin.memberships-DCM1dSHw.mjs");
var Route$28 = createFileRoute("/admin/memberships")({
	head: () => ({ meta: [{ title: "Memberships — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./admin.marketing-CYlLehUq.mjs");
var Route$27 = createFileRoute("/admin/marketing")({
	head: () => ({ meta: [{ title: "Marketing — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./admin.licenses-BcODlbsD.mjs");
var Route$26 = createFileRoute("/admin/licenses")({
	head: () => ({ meta: [{ title: "Software Licenses — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./admin.invoices-2udOJMTa.mjs");
var Route$25 = createFileRoute("/admin/invoices")({
	head: () => ({ meta: [{ title: "Invoices — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./admin.infrastructure-reports-DKnyOZhO.mjs");
var Route$24 = createFileRoute("/admin/infrastructure-reports")({
	head: () => ({ meta: [{ title: "Infrastructure Reports — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./admin.hosting-5Ws-jMQ_.mjs");
var Route$23 = createFileRoute("/admin/hosting")({
	head: () => ({ meta: [{ title: "Hosting — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./admin.employees-3bhQ2L9m.mjs");
var Route$22 = createFileRoute("/admin/employees")({
	head: () => ({ meta: [{ title: "Employees & Team — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./admin.domains-CKVgVT_h.mjs");
var Route$21 = createFileRoute("/admin/domains")({
	head: () => ({ meta: [{ title: "Domains — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./admin.digital-products-wBIvBZzG.mjs");
var Route$20 = createFileRoute("/admin/digital-products")({
	head: () => ({ meta: [{ title: "Digital Products — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./admin.crm-EBxNRhBK.mjs");
var Route$19 = createFileRoute("/admin/crm")({
	head: () => ({ meta: [{ title: "CRM — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./admin.courses-Bz-mN09E.mjs");
var Route$18 = createFileRoute("/admin/courses")({
	head: () => ({ meta: [{ title: "Courses — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./admin.coupons-BCTMLV5D.mjs");
var Route$17 = createFileRoute("/admin/coupons")({
	head: () => ({ meta: [{ title: "Coupons — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./admin.contact-submissions-Diykyiod.mjs");
var Route$16 = createFileRoute("/admin/contact-submissions")({
	head: () => ({ meta: [{ title: "Contact submissions — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./admin.cms-B85pcA6F.mjs");
var Route$15 = createFileRoute("/admin/cms")({
	head: () => ({ meta: [{ title: "Site CMS — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./admin.categories-CiD_hlV_.mjs");
var Route$14 = createFileRoute("/admin/categories")({
	head: () => ({ meta: [{ title: "Categories — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./admin.backup-TnU2TXEB.mjs");
var Route$13 = createFileRoute("/admin/backup")({
	head: () => ({ meta: [{ title: "Backup & Restore — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin.audit-logs-B1oAslHC.mjs");
var Route$12 = createFileRoute("/admin/audit-logs")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./admin.amc-DLyLxGhE.mjs");
var Route$11 = createFileRoute("/admin/amc")({
	head: () => ({ meta: [{ title: "AMC Contracts — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./admin.affiliates-Q-HLgMdg.mjs");
var Route$10 = createFileRoute("/admin/affiliates")({
	head: () => ({ meta: [{ title: "Affiliates — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.affiliate-templates-DDv2kKLH.mjs");
var Route$9 = createFileRoute("/admin/affiliate-templates")({
	head: () => ({ meta: [{ title: "Affiliate Marketing Templates — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin.affiliate-rules-BZ1Fb62G.mjs");
var Route$8 = createFileRoute("/admin/affiliate-rules")({
	head: () => ({ meta: [{ title: "Affiliate Commission Rules — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.affiliate-applications-CVdi-dAo.mjs");
var Route$7 = createFileRoute("/admin/affiliate-applications")({
	head: () => ({ meta: [{ title: "Affiliate Applications — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./portal.tickets.index-DpmD3cFp.mjs");
var Route$6 = createFileRoute("/portal/tickets/")({
	head: () => ({ meta: [{ title: "Support tickets — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.tickets.index-CJblPPtQ.mjs");
var Route$5 = createFileRoute("/admin/tickets/")({
	head: () => ({ meta: [{ title: "Support Tickets — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.memberships.index-C5yUwE_3.mjs");
var Route$4 = createFileRoute("/admin/memberships/")({
	head: () => ({ meta: [{ title: "Memberships — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.courses.index-CBXTJ_gQ.mjs");
var Route$3 = createFileRoute("/admin/courses/")({
	head: () => ({ meta: [{ title: "Courses — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./portal.tickets._id-CytC4SdX.mjs");
var Route$2 = createFileRoute("/portal/tickets/$id")({
	head: () => ({ meta: [{ title: "Ticket — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.tickets._id-BoXvVZvA.mjs");
var Route$1 = createFileRoute("/admin/tickets/$id")({
	head: () => ({ meta: [{ title: "Ticket — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.memberships.users-BfNe5Rw1.mjs");
var Route = createFileRoute("/admin/memberships/users")({
	head: () => ({ meta: [{ title: "User Memberships — Infiniforge Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var WorkflowsRoute = Route$79.update({
	id: "/workflows",
	path: "/workflows",
	getParentRoute: () => Route$80
});
var ServicesRoute = Route$78.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => Route$80
});
var ResetPasswordRoute = Route$77.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$80
});
var ProductsRoute = Route$76.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => Route$80
});
var PricingRoute = Route$75.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$80
});
var PortalRoute = Route$74.update({
	id: "/portal",
	path: "/portal",
	getParentRoute: () => Route$80
});
var HostingRoute = Route$73.update({
	id: "/hosting",
	path: "/hosting",
	getParentRoute: () => Route$80
});
var DeploymentsRoute = Route$72.update({
	id: "/deployments",
	path: "/deployments",
	getParentRoute: () => Route$80
});
var DashboardRoute = Route$71.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$80
});
var CoursesRoute = Route$70.update({
	id: "/courses",
	path: "/courses",
	getParentRoute: () => Route$80
});
var ContactRoute = Route$69.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$80
});
var CheckoutRoute = Route$68.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$80
});
var AuthRoute = Route$67.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$80
});
var IndexRoute = Route$66.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$80
});
var ProductsIndexRoute = Route$65.update({
	id: "/",
	path: "/",
	getParentRoute: () => ProductsRoute
});
var PortalIndexRoute = Route$64.update({
	id: "/",
	path: "/",
	getParentRoute: () => PortalRoute
});
var CoursesIndexRoute = Route$63.update({
	id: "/",
	path: "/",
	getParentRoute: () => CoursesRoute
});
var AdminIndexRoute = Route$62.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$80
});
var ProductsSlugRoute = Route$84.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => ProductsRoute
});
var PortalWalletRoute = Route$61.update({
	id: "/wallet",
	path: "/wallet",
	getParentRoute: () => PortalRoute
});
var PortalVpsRoute = Route$60.update({
	id: "/vps",
	path: "/vps",
	getParentRoute: () => PortalRoute
});
var PortalTicketsRoute = Route$59.update({
	id: "/tickets",
	path: "/tickets",
	getParentRoute: () => PortalRoute
});
var PortalSubscriptionsRoute = Route$58.update({
	id: "/subscriptions",
	path: "/subscriptions",
	getParentRoute: () => PortalRoute
});
var PortalProfileRoute = Route$57.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => PortalRoute
});
var PortalOrdersRoute = Route$56.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => PortalRoute
});
var PortalMembershipRoute = Route$55.update({
	id: "/membership",
	path: "/membership",
	getParentRoute: () => PortalRoute
});
var PortalLicensesRoute = Route$54.update({
	id: "/licenses",
	path: "/licenses",
	getParentRoute: () => PortalRoute
});
var PortalDownloadsRoute = Route$53.update({
	id: "/downloads",
	path: "/downloads",
	getParentRoute: () => PortalRoute
});
var PortalCoursesRoute = Route$52.update({
	id: "/courses",
	path: "/courses",
	getParentRoute: () => PortalRoute
});
var PortalAffiliateRoute = Route$51.update({
	id: "/affiliate",
	path: "/affiliate",
	getParentRoute: () => PortalRoute
});
var PSlugRoute = Route$50.update({
	id: "/p/$slug",
	path: "/p/$slug",
	getParentRoute: () => Route$80
});
var CoursesSlugRoute = Route$49.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => CoursesRoute
});
var CertificatesVerifyRoute = Route$48.update({
	id: "/certificates/verify",
	path: "/certificates/verify",
	getParentRoute: () => Route$80
});
var AdminWhatsappOrdersRoute = Route$47.update({
	id: "/admin/whatsapp-orders",
	path: "/admin/whatsapp-orders",
	getParentRoute: () => Route$80
});
var AdminWhatsappRoute = Route$46.update({
	id: "/admin/whatsapp",
	path: "/admin/whatsapp",
	getParentRoute: () => Route$80
});
var AdminWalletsRoute = Route$45.update({
	id: "/admin/wallets",
	path: "/admin/wallets",
	getParentRoute: () => Route$80
});
var AdminVpsRoute = Route$44.update({
	id: "/admin/vps",
	path: "/admin/vps",
	getParentRoute: () => Route$80
});
var AdminUsersRoute = Route$43.update({
	id: "/admin/users",
	path: "/admin/users",
	getParentRoute: () => Route$80
});
var AdminTicketsRoute = Route$42.update({
	id: "/admin/tickets",
	path: "/admin/tickets",
	getParentRoute: () => Route$80
});
var AdminTicketWorkflowsRoute = Route$41.update({
	id: "/admin/ticket-workflows",
	path: "/admin/ticket-workflows",
	getParentRoute: () => Route$80
});
var AdminSubscriptionsRoute = Route$40.update({
	id: "/admin/subscriptions",
	path: "/admin/subscriptions",
	getParentRoute: () => Route$80
});
var AdminSslRoute = Route$39.update({
	id: "/admin/ssl",
	path: "/admin/ssl",
	getParentRoute: () => Route$80
});
var AdminSettingsRoute = Route$38.update({
	id: "/admin/settings",
	path: "/admin/settings",
	getParentRoute: () => Route$80
});
var AdminServicesRoute = Route$37.update({
	id: "/admin/services",
	path: "/admin/services",
	getParentRoute: () => Route$80
});
var AdminServersRoute = Route$36.update({
	id: "/admin/servers",
	path: "/admin/servers",
	getParentRoute: () => Route$80
});
var AdminRolesRoute = Route$35.update({
	id: "/admin/roles",
	path: "/admin/roles",
	getParentRoute: () => Route$80
});
var AdminReportsRoute = Route$34.update({
	id: "/admin/reports",
	path: "/admin/reports",
	getParentRoute: () => Route$80
});
var AdminPwaRoute = Route$33.update({
	id: "/admin/pwa",
	path: "/admin/pwa",
	getParentRoute: () => Route$80
});
var AdminProductsRoute = Route$32.update({
	id: "/admin/products",
	path: "/admin/products",
	getParentRoute: () => Route$80
});
var AdminPaymentsRoute = Route$31.update({
	id: "/admin/payments",
	path: "/admin/payments",
	getParentRoute: () => Route$80
});
var AdminOrdersRoute = Route$30.update({
	id: "/admin/orders",
	path: "/admin/orders",
	getParentRoute: () => Route$80
});
var AdminMonitoringRoute = Route$29.update({
	id: "/admin/monitoring",
	path: "/admin/monitoring",
	getParentRoute: () => Route$80
});
var AdminMembershipsRoute = Route$28.update({
	id: "/admin/memberships",
	path: "/admin/memberships",
	getParentRoute: () => Route$80
});
var AdminMarketingRoute = Route$27.update({
	id: "/admin/marketing",
	path: "/admin/marketing",
	getParentRoute: () => Route$80
});
var AdminLicensesRoute = Route$26.update({
	id: "/admin/licenses",
	path: "/admin/licenses",
	getParentRoute: () => Route$80
});
var AdminInvoicesRoute = Route$25.update({
	id: "/admin/invoices",
	path: "/admin/invoices",
	getParentRoute: () => Route$80
});
var AdminInfrastructureReportsRoute = Route$24.update({
	id: "/admin/infrastructure-reports",
	path: "/admin/infrastructure-reports",
	getParentRoute: () => Route$80
});
var AdminHostingRoute = Route$23.update({
	id: "/admin/hosting",
	path: "/admin/hosting",
	getParentRoute: () => Route$80
});
var AdminEmployeesRoute = Route$22.update({
	id: "/admin/employees",
	path: "/admin/employees",
	getParentRoute: () => Route$80
});
var AdminDomainsRoute = Route$21.update({
	id: "/admin/domains",
	path: "/admin/domains",
	getParentRoute: () => Route$80
});
var AdminDigitalProductsRoute = Route$20.update({
	id: "/admin/digital-products",
	path: "/admin/digital-products",
	getParentRoute: () => Route$80
});
var AdminCrmRoute = Route$19.update({
	id: "/admin/crm",
	path: "/admin/crm",
	getParentRoute: () => Route$80
});
var AdminCoursesRoute = Route$18.update({
	id: "/admin/courses",
	path: "/admin/courses",
	getParentRoute: () => Route$80
});
var AdminCouponsRoute = Route$17.update({
	id: "/admin/coupons",
	path: "/admin/coupons",
	getParentRoute: () => Route$80
});
var AdminContactSubmissionsRoute = Route$16.update({
	id: "/admin/contact-submissions",
	path: "/admin/contact-submissions",
	getParentRoute: () => Route$80
});
var AdminCmsRoute = Route$15.update({
	id: "/admin/cms",
	path: "/admin/cms",
	getParentRoute: () => Route$80
});
var AdminCategoriesRoute = Route$14.update({
	id: "/admin/categories",
	path: "/admin/categories",
	getParentRoute: () => Route$80
});
var AdminBackupRoute = Route$13.update({
	id: "/admin/backup",
	path: "/admin/backup",
	getParentRoute: () => Route$80
});
var AdminAuditLogsRoute = Route$12.update({
	id: "/admin/audit-logs",
	path: "/admin/audit-logs",
	getParentRoute: () => Route$80
});
var AdminAmcRoute = Route$11.update({
	id: "/admin/amc",
	path: "/admin/amc",
	getParentRoute: () => Route$80
});
var AdminAffiliatesRoute = Route$10.update({
	id: "/admin/affiliates",
	path: "/admin/affiliates",
	getParentRoute: () => Route$80
});
var AdminAffiliateTemplatesRoute = Route$9.update({
	id: "/admin/affiliate-templates",
	path: "/admin/affiliate-templates",
	getParentRoute: () => Route$80
});
var AdminAffiliateRulesRoute = Route$8.update({
	id: "/admin/affiliate-rules",
	path: "/admin/affiliate-rules",
	getParentRoute: () => Route$80
});
var AdminAffiliateApplicationsRoute = Route$7.update({
	id: "/admin/affiliate-applications",
	path: "/admin/affiliate-applications",
	getParentRoute: () => Route$80
});
var PortalTicketsIndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => PortalTicketsRoute
});
var CoursesSlugIndexRoute = Route$82.update({
	id: "/",
	path: "/",
	getParentRoute: () => CoursesSlugRoute
});
var AdminTicketsIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminTicketsRoute
});
var AdminMembershipsIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminMembershipsRoute
});
var AdminCoursesIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminCoursesRoute
});
var PortalTicketsIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => PortalTicketsRoute
});
var CoursesSlugLearnRoute = Route$83.update({
	id: "/learn",
	path: "/learn",
	getParentRoute: () => CoursesSlugRoute
});
var AdminTicketsIdRoute = Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminTicketsRoute
});
var AdminMembershipsUsersRoute = Route.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminMembershipsRoute
});
var AdminCoursesIdRoute = Route$81.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminCoursesRoute
});
var CoursesSlugRouteChildren = {
	CoursesSlugLearnRoute,
	CoursesSlugIndexRoute
};
var CoursesRouteChildren = {
	CoursesSlugRoute: CoursesSlugRoute._addFileChildren(CoursesSlugRouteChildren),
	CoursesIndexRoute
};
var CoursesRouteWithChildren = CoursesRoute._addFileChildren(CoursesRouteChildren);
var PortalTicketsRouteChildren = {
	PortalTicketsIdRoute,
	PortalTicketsIndexRoute
};
var PortalRouteChildren = {
	PortalAffiliateRoute,
	PortalCoursesRoute,
	PortalDownloadsRoute,
	PortalLicensesRoute,
	PortalMembershipRoute,
	PortalOrdersRoute,
	PortalProfileRoute,
	PortalSubscriptionsRoute,
	PortalTicketsRoute: PortalTicketsRoute._addFileChildren(PortalTicketsRouteChildren),
	PortalVpsRoute,
	PortalWalletRoute,
	PortalIndexRoute
};
var PortalRouteWithChildren = PortalRoute._addFileChildren(PortalRouteChildren);
var ProductsRouteChildren = {
	ProductsSlugRoute,
	ProductsIndexRoute
};
var ProductsRouteWithChildren = ProductsRoute._addFileChildren(ProductsRouteChildren);
var AdminCoursesRouteChildren = {
	AdminCoursesIdRoute,
	AdminCoursesIndexRoute
};
var AdminCoursesRouteWithChildren = AdminCoursesRoute._addFileChildren(AdminCoursesRouteChildren);
var AdminMembershipsRouteChildren = {
	AdminMembershipsUsersRoute,
	AdminMembershipsIndexRoute
};
var AdminMembershipsRouteWithChildren = AdminMembershipsRoute._addFileChildren(AdminMembershipsRouteChildren);
var AdminTicketsRouteChildren = {
	AdminTicketsIdRoute,
	AdminTicketsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthRoute,
	CheckoutRoute,
	ContactRoute,
	CoursesRoute: CoursesRouteWithChildren,
	DashboardRoute,
	DeploymentsRoute,
	HostingRoute,
	PortalRoute: PortalRouteWithChildren,
	PricingRoute,
	ProductsRoute: ProductsRouteWithChildren,
	ResetPasswordRoute,
	ServicesRoute,
	WorkflowsRoute,
	AdminAffiliateApplicationsRoute,
	AdminAffiliateRulesRoute,
	AdminAffiliateTemplatesRoute,
	AdminAffiliatesRoute,
	AdminAmcRoute,
	AdminAuditLogsRoute,
	AdminBackupRoute,
	AdminCategoriesRoute,
	AdminCmsRoute,
	AdminContactSubmissionsRoute,
	AdminCouponsRoute,
	AdminCoursesRoute: AdminCoursesRouteWithChildren,
	AdminCrmRoute,
	AdminDigitalProductsRoute,
	AdminDomainsRoute,
	AdminEmployeesRoute,
	AdminHostingRoute,
	AdminInfrastructureReportsRoute,
	AdminInvoicesRoute,
	AdminLicensesRoute,
	AdminMarketingRoute,
	AdminMembershipsRoute: AdminMembershipsRouteWithChildren,
	AdminMonitoringRoute,
	AdminOrdersRoute,
	AdminPaymentsRoute,
	AdminProductsRoute,
	AdminPwaRoute,
	AdminReportsRoute,
	AdminRolesRoute,
	AdminServersRoute,
	AdminServicesRoute,
	AdminSettingsRoute,
	AdminSslRoute,
	AdminSubscriptionsRoute,
	AdminTicketWorkflowsRoute,
	AdminTicketsRoute: AdminTicketsRoute._addFileChildren(AdminTicketsRouteChildren),
	AdminUsersRoute,
	AdminVpsRoute,
	AdminWalletsRoute,
	AdminWhatsappRoute,
	AdminWhatsappOrdersRoute,
	CertificatesVerifyRoute,
	PSlugRoute,
	AdminIndexRoute
};
var routeTree = Route$80._addFileChildren(rootRouteChildren)._addFileTypes();
function BrandLoader({ label = "Loading Infiniforge…" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex items-center justify-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-32 w-32 rounded-full border-2 border-primary/20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-32 w-32 rounded-full border-t-2 border-primary animate-spin" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-40 w-40 rounded-full bg-gradient-to-br from-[#FF9933]/20 via-transparent to-[#138808]/20 blur-2xl animate-pulse" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/pwa-192.png",
					alt: "Infiniforge Technologies",
					className: "relative h-20 w-20 rounded-2xl shadow-xl animate-[pulse_2s_ease-in-out_infinite]"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold tracking-wide bg-gradient-to-r from-[#FF9933] via-primary to-[#138808] bg-clip-text text-transparent",
				children: "Infiniforge Technologies"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: label
			})]
		})]
	});
}
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		defaultPendingComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLoader, {}),
		defaultPendingMs: 200
	});
};
//#endregion
export { getRouter };
