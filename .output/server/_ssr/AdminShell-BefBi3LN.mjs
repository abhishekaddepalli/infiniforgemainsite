import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, u as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { $ as Receipt, At as LayoutDashboard, B as Settings, Ct as LogOut, E as Tag, F as ShoppingCart, Fn as ChartColumn, Gt as Handshake, Hn as Boxes, Kt as GraduationCap, L as Shield, M as Smartphone, Pt as KeyRound, Qt as FolderTree, S as Ticket, Tt as Lock, U as Search, V as Server, W as ScrollText, Z as RefreshCw, _n as Cpu, _t as MessageCircle, dt as Package, er as Activity, gn as CreditCard, i as Wrench, j as Sparkles, jt as Layers, mn as DatabaseBackup, n as Zap, o as Wallet, qt as Globe, tn as FileText, u as Users, vt as Menu, xn as Cloud, yt as Megaphone, z as Share2 } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CDoe66ii.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as NotificationBell, t as BrandFooter } from "./NotificationBell-BCzh6Rtq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminShell-BefBi3LN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAFF = [
	"super_admin",
	"admin",
	"sales_manager",
	"support",
	"finance",
	"employee"
];
var SALES = [
	"super_admin",
	"admin",
	"sales_manager"
];
var FIN = [
	"super_admin",
	"admin",
	"finance"
];
var OPS = ["super_admin", "admin"];
var ADMIN_ROUTE_ROLES = {
	"/admin": STAFF,
	"/admin/orders": [
		"super_admin",
		"admin",
		"sales_manager",
		"finance"
	],
	"/admin/invoices": FIN,
	"/admin/payments": FIN,
	"/admin/products": SALES,
	"/admin/digital-products": SALES,
	"/admin/licenses": SALES,
	"/admin/services": SALES,
	"/admin/categories": SALES,
	"/admin/coupons": SALES,
	"/admin/courses": SALES,
	"/admin/memberships": OPS,
	"/admin/memberships/users": OPS,
	"/admin/subscriptions": [
		"super_admin",
		"admin",
		"sales_manager",
		"finance"
	],
	"/admin/wallets": FIN,
	"/admin/users": OPS,
	"/admin/roles": ["super_admin"],
	"/admin/audit-logs": OPS,
	"/admin/tickets": [
		"super_admin",
		"admin",
		"support"
	],
	"/admin/ticket-workflows": ["super_admin", "admin"],
	"/admin/employees": OPS,
	"/admin/servers": OPS,
	"/admin/vps": OPS,
	"/admin/hosting": OPS,
	"/admin/domains": OPS,
	"/admin/ssl": OPS,
	"/admin/monitoring": OPS,
	"/admin/amc": OPS,
	"/admin/infrastructure-reports": OPS,
	"/admin/crm": [
		"super_admin",
		"admin",
		"sales_manager"
	],
	"/admin/affiliates": [
		"super_admin",
		"admin",
		"sales_manager",
		"finance"
	],
	"/admin/affiliate-applications": [
		"super_admin",
		"admin",
		"sales_manager"
	],
	"/admin/affiliate-rules": [
		"super_admin",
		"admin",
		"sales_manager",
		"finance"
	],
	"/admin/affiliate-templates": [
		"super_admin",
		"admin",
		"sales_manager"
	],
	"/admin/marketing": [
		"super_admin",
		"admin",
		"sales_manager"
	],
	"/admin/whatsapp": [
		"super_admin",
		"admin",
		"sales_manager",
		"support"
	],
	"/admin/whatsapp-orders": [
		"super_admin",
		"admin",
		"sales_manager",
		"support"
	],
	"/admin/cms": OPS,
	"/admin/contact-submissions": [
		"super_admin",
		"admin",
		"sales_manager",
		"support"
	],
	"/admin/reports": [
		"super_admin",
		"admin",
		"finance"
	],
	"/admin/backup": ["super_admin"],
	"/admin/pwa": ["super_admin"],
	"/admin/settings": OPS
};
var navGroups = [
	{
		label: "Overview",
		items: [{
			label: "Dashboard",
			icon: LayoutDashboard,
			to: "/admin"
		}, {
			label: "Reports",
			icon: ChartColumn,
			to: "/admin/reports"
		}]
	},
	{
		label: "Catalog",
		items: [
			{
				label: "Products",
				icon: Package,
				to: "/admin/products"
			},
			{
				label: "Digital Products",
				icon: Layers,
				to: "/admin/digital-products"
			},
			{
				label: "Licenses",
				icon: KeyRound,
				to: "/admin/licenses"
			},
			{
				label: "Services",
				icon: Boxes,
				to: "/admin/services"
			},
			{
				label: "Categories",
				icon: FolderTree,
				to: "/admin/categories"
			},
			{
				label: "Coupons",
				icon: Tag,
				to: "/admin/coupons"
			},
			{
				label: "Courses",
				icon: GraduationCap,
				to: "/admin/courses"
			},
			{
				label: "Memberships",
				icon: Sparkles,
				to: "/admin/memberships"
			},
			{
				label: "Membership Users",
				icon: Users,
				to: "/admin/memberships/users"
			}
		]
	},
	{
		label: "Sales & Billing",
		items: [
			{
				label: "Orders",
				icon: ShoppingCart,
				to: "/admin/orders"
			},
			{
				label: "Subscriptions",
				icon: RefreshCw,
				to: "/admin/subscriptions"
			},
			{
				label: "Invoices",
				icon: Receipt,
				to: "/admin/invoices"
			},
			{
				label: "Payments",
				icon: CreditCard,
				to: "/admin/payments"
			},
			{
				label: "Wallets",
				icon: Wallet,
				to: "/admin/wallets"
			}
		]
	},
	{
		label: "Infrastructure",
		items: [
			{
				label: "Servers",
				icon: Server,
				to: "/admin/servers"
			},
			{
				label: "VPS Instances",
				icon: Cpu,
				to: "/admin/vps"
			},
			{
				label: "Hosting",
				icon: Cloud,
				to: "/admin/hosting"
			},
			{
				label: "Domains",
				icon: Globe,
				to: "/admin/domains"
			},
			{
				label: "SSL Certificates",
				icon: Lock,
				to: "/admin/ssl"
			},
			{
				label: "Monitoring",
				icon: Activity,
				to: "/admin/monitoring"
			},
			{
				label: "AMC",
				icon: Wrench,
				to: "/admin/amc"
			},
			{
				label: "Infra Reports",
				icon: ChartColumn,
				to: "/admin/infrastructure-reports"
			}
		]
	},
	{
		label: "Growth",
		items: [
			{
				label: "CRM",
				icon: Handshake,
				to: "/admin/crm"
			},
			{
				label: "Affiliates",
				icon: Share2,
				to: "/admin/affiliates"
			},
			{
				label: "Affiliate Applications",
				icon: Handshake,
				to: "/admin/affiliate-applications"
			},
			{
				label: "Commission Rules",
				icon: Sparkles,
				to: "/admin/affiliate-rules"
			},
			{
				label: "Marketing Templates",
				icon: Megaphone,
				to: "/admin/affiliate-templates"
			},
			{
				label: "Marketing",
				icon: Megaphone,
				to: "/admin/marketing"
			},
			{
				label: "WhatsApp",
				icon: MessageCircle,
				to: "/admin/whatsapp"
			},
			{
				label: "WhatsApp Orders",
				icon: MessageCircle,
				to: "/admin/whatsapp-orders"
			},
			{
				label: "Site CMS",
				icon: FileText,
				to: "/admin/cms"
			},
			{
				label: "Contact Inbox",
				icon: MessageCircle,
				to: "/admin/contact-submissions"
			}
		]
	},
	{
		label: "Support",
		items: [{
			label: "Tickets",
			icon: Ticket,
			to: "/admin/tickets"
		}, {
			label: "Ticket Workflows",
			icon: Wrench,
			to: "/admin/ticket-workflows"
		}]
	},
	{
		label: "Administration",
		items: [
			{
				label: "Users",
				icon: Users,
				to: "/admin/users"
			},
			{
				label: "Employees",
				icon: Handshake,
				to: "/admin/employees"
			},
			{
				label: "Roles & Access",
				icon: Shield,
				to: "/admin/roles"
			},
			{
				label: "Audit Logs",
				icon: ScrollText,
				to: "/admin/audit-logs"
			},
			{
				label: "Backup & Restore",
				icon: DatabaseBackup,
				to: "/admin/backup"
			},
			{
				label: "PWA / Install App",
				icon: Smartphone,
				to: "/admin/pwa"
			},
			{
				label: "Settings",
				icon: Settings,
				to: "/admin/settings"
			}
		]
	}
];
function AdminShell({ title, requiredRoles, children }) {
	const { user, profile, loading, isStaff, roles, signOut } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [openNav, setOpenNav] = (0, import_react.useState)(false);
	const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
	const allowed = requiredRoles ?? ADMIN_ROUTE_ROLES[normalizedPathname];
	const hasRouteAccess = !allowed || roles.some((r) => allowed.includes(r));
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user) {
			navigate({ to: "/auth" });
			return;
		}
		if (!isStaff) {
			toast.error("You don't have permission to access the admin console.");
			navigate({ to: "/" });
			return;
		}
		if (!hasRouteAccess) {
			toast.error("Your role can't access this page.");
			navigate({ to: "/admin" });
		}
	}, [
		user,
		isStaff,
		hasRouteAccess,
		loading,
		navigate
	]);
	if (loading || !user || !isStaff || !hasRouteAccess) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center animate-pulse mb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5 text-white" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading admin console…"
			})]
		})
	});
	const initials = (profile?.full_name ?? user.email ?? "?").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "admin-shell flex min-h-screen w-full max-w-full bg-secondary/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed lg:sticky top-0 left-0 z-50 h-screen w-72 max-w-[85vw] shrink-0 bg-gradient-dashboard text-sidebar-foreground transition-transform flex flex-col", openNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-16 items-center gap-2.5 px-6 border-b border-white/10 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/pwa-192.png",
						alt: "Infiniforge",
						className: "h-10 w-10 rounded-xl object-contain bg-white/90 p-0.5 ring-1 ring-white/20"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 leading-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-bold text-white text-sm",
							children: "Infiniforge"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-[10px] uppercase tracking-[0.18em] text-white/50",
							children: "Admin Console"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex-1 overflow-y-auto p-3 space-y-4",
					children: [navGroups.map((group) => {
						const visible = group.items.filter((n) => {
							const need = ADMIN_ROUTE_ROLES[n.to];
							return !need || roles.some((r) => need.includes(r));
						});
						if (visible.length === 0) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-3 py-1 text-[10px] uppercase font-semibold tracking-wider text-white/40",
								children: group.label
							}), visible.map((n) => {
								const active = n.to === "/admin" ? pathname === "/admin" : pathname.startsWith(n.to);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: n.to,
									onClick: () => setOpenNav(false),
									className: cn("w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors", active ? "bg-white/10 text-white shadow-sm" : "text-white/60 hover:text-white hover:bg-white/5"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate text-left",
										children: n.label
									})]
								}, n.to);
							})]
						}, group.label);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass !bg-white/5 border-white/10 rounded-2xl p-4 mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-primary-glow text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Enterprise plan"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-white/60 leading-relaxed",
							children: "All modules unlocked. White-label ready."
						})]
					})]
				})]
			}),
			openNav && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 bg-black/40 lg:hidden",
				onClick: () => setOpenNav(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0 max-w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "lg:hidden h-9 w-9 rounded-lg border border-border flex items-center justify-center shrink-0",
								onClick: () => setOpenNav(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1 min-w-0 max-w-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search…",
									className: "pl-9 h-9 bg-secondary border-transparent"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "hidden md:flex shrink-0",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									children: "View site"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBell, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "flex min-w-0 items-center gap-2 pl-2 border-l border-border hover:opacity-80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 shrink-0 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-semibold",
										children: initials
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden min-w-0 max-w-40 sm:block leading-tight text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-xs font-semibold",
											children: profile?.full_name ?? user.email?.split("@")[0]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-[10px] text-muted-foreground",
											children: user.email
										})]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-56",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "My account" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin",
											children: "Dashboard"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/users",
											children: "Users"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/roles",
											children: "Roles"
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
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 min-w-0 max-w-full",
						children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "sr-only",
							children: title
						}), children]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandFooter, {})
				]
			})
		]
	});
}
//#endregion
export { AdminShell as t };
