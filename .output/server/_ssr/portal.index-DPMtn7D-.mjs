import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Ht as HardDrive, I as ShoppingBag, S as Ticket, Sn as Clock, V as Server, Yn as ArrowUpRight, Yt as Gift, Z as RefreshCw, _ as TriangleAlert, _n as Cpu, cn as ExternalLink, dt as Package, j as Sparkles, nn as FileDown, o as Wallet, tn as FileText, v as TrendingUp, z as Share2 } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as getMyMembership } from "./memberships.functions-C2eeCH5c.mjs";
import { n as downloadInvoicePdf, t as downloadInvoiceCsv } from "./invoice-CHhlY2Nm.mjs";
import { t as ExpirationBar } from "./ExpirationBar-BUuZVN4O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.index-DPMtn7D-.js
var import_jsx_runtime = require_jsx_runtime();
var ROLE_LABEL = {
	super_admin: "Super Admin",
	admin: "Admin",
	sales_manager: "Sales Manager",
	support: "Support",
	finance: "Finance",
	employee: "Employee",
	reseller: "Reseller Partner",
	customer: "Customer",
	affiliate: "Affiliate Partner"
};
function PortalDashboard() {
	const { user, profile, roles } = useAuth();
	const navigate = useNavigate();
	const primaryRole = roles.includes("affiliate") ? "affiliate" : "customer";
	const { data: myOrders } = useQuery({
		queryKey: ["portal-orders", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("orders").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(5);
			return data ?? [];
		}
	});
	const { data: myTickets } = useQuery({
		queryKey: ["portal-tickets", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("tickets").select("*").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(5);
			return data ?? [];
		}
	});
	const { data: wallet } = useQuery({
		queryKey: ["portal-wallet", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("wallets").select("*").eq("user_id", user.id).maybeSingle();
			return data;
		}
	});
	const { data: mySubs } = useQuery({
		queryKey: ["portal-subs", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("subscriptions").select("*").eq("customer_id", user.id).eq("status", "active");
			return data ?? [];
		}
	});
	const { data: myVps = [] } = useQuery({
		queryKey: ["portal-vps-dash", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("module_records").select("id,title,subtitle,status,amount_inr,due_at,metadata,created_at").eq("module", "vps_instance").eq("customer_id", user.id).order("due_at", {
				ascending: true,
				nullsFirst: false
			});
			return data ?? [];
		}
	});
	if (!user) return null;
	const totalSpend = (myOrders ?? []).filter((o) => o.status === "paid").reduce((s, o) => s + Number(o.total_inr ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 lg:px-6 py-8 space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					className: "mb-2",
					children: ROLE_LABEL[primaryRole]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl lg:text-3xl font-bold tracking-tight",
					children: [
						"Welcome back, ",
						(profile?.full_name ?? "there").split(" ")[0],
						" 👋"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: [primaryRole === "affiliate" && "Track referrals, commissions and share your unique link.", primaryRole === "customer" && "Your subscriptions, invoices, wallet and support tickets — all in one place."]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembershipStrip, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Wallet balance",
						value: formatINR(Number(wallet?.balance_inr ?? 0)),
						icon: Wallet
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Total spend",
						value: formatINR(totalSpend),
						icon: TrendingUp
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Active subscriptions",
						value: String(mySubs?.length ?? 0),
						icon: RefreshCw
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Open tickets",
						value: String((myTickets ?? []).filter((t) => t.status === "open").length),
						icon: Ticket
					})
				]
			}),
			myVps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpsExpiryBanner, { vps: myVps }),
			myVps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpsDashStrip, { vps: myVps }),
			primaryRole === "affiliate" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 flex items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "Your referral link"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Share and earn commission on every paid signup."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
								className: "flex-1 text-xs font-mono bg-background rounded-lg px-3 py-2 border border-border truncate",
								children: [
									typeof window !== "undefined" ? window.location.origin : "https://infiniforge.cloud",
									"/?ref=",
									user.id.slice(0, 8)
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									navigator.clipboard?.writeText(`${window.location.origin}/?ref=${user.id.slice(0, 8)}`).catch(() => {});
									toast.success("Referral link copied");
								},
								children: "Copy"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-5 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-wider text-primary",
							children: "Recent orders"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base font-semibold mt-0.5",
							children: "Your purchases"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => navigate({ to: "/products" }),
							children: ["Shop ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "ml-1 h-3.5 w-3.5" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [(myOrders ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 text-center text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-8 w-8 mx-auto mb-2 opacity-40" }), "No orders yet. Browse the catalog to place your first order."]
						}), (myOrders ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 p-4 hover:bg-secondary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-9 w-9 rounded-lg bg-secondary flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4 text-primary" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium truncate",
										children: o.product_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground font-mono",
										children: o.invoice_number ?? o.order_number
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold",
										children: formatINR(Number(o.total_inr))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: o.status })]
								}),
								o.status === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 ml-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-8 w-8",
										title: "Download PDF invoice",
										onClick: () => downloadInvoicePdf(o),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-8 w-8",
										title: "Download CSV",
										onClick: () => downloadInvoiceCsv(o),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4" })
									})]
								})
							]
						}, o.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-5 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-wider text-primary",
							children: "Support"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base font-semibold mt-0.5",
							children: "Recent tickets"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/portal/tickets",
								children: ["All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "ml-1 h-3.5 w-3.5" })]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [(myTickets ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 text-center text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-8 w-8 mx-auto mb-2 opacity-40" }), "No support tickets."]
						}), (myTickets ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 hover:bg-secondary/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium flex-1 truncate",
									children: t.subject
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: t.status })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground mt-1 font-mono",
								children: t.ticket_number
							})]
						}, t.id))]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-gradient-brand p-6 lg:p-8 text-white flex items-start gap-4 flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-[240px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold",
							children: "Unlock more with Infiniforge"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-white/85 mt-1 max-w-lg",
							children: "Add AI Automation, VPS Hosting, or become a reseller. Wallet top-ups get 5% bonus credits this month."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/products",
								children: "Browse"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							className: "bg-transparent border-white/40 text-white hover:bg-white/10",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/pricing",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-3.5 w-3.5 mr-1.5" }), " View plans"]
							})
						})]
					})
				]
			})
		]
	});
}
function KpiCard({ label, value, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-8 w-8 rounded-lg bg-secondary flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 text-2xl font-bold tracking-tight",
			children: value
		})]
	});
}
function MembershipStrip() {
	const getMine = useServerFn(getMyMembership);
	const { data } = useQuery({
		queryKey: ["my-membership"],
		queryFn: () => getMine()
	});
	if (!data) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpirationBar, { membership: data });
}
function StatusPill({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex text-[10px] font-semibold rounded-full px-2 py-0.5 capitalize", {
			paid: "bg-accent/15 text-accent",
			pending: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
			open: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
			closed: "bg-secondary text-muted-foreground",
			resolved: "bg-accent/15 text-accent",
			active: "bg-accent/15 text-accent",
			cancelled: "bg-destructive/15 text-destructive",
			failed: "bg-destructive/15 text-destructive"
		}[status] || "bg-secondary text-muted-foreground"),
		children: status
	});
}
function daysUntil(iso) {
	if (!iso) return null;
	return Math.ceil((new Date(iso).getTime() - Date.now()) / 864e5);
}
function VpsDashStrip({ vps }) {
	const active = vps.filter((v) => v.status === "active").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-border/70",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 w-10 shrink-0 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-lg shadow-primary/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: "My cloud"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-base font-semibold truncate",
						children: [
							vps.length,
							" VPS instance",
							vps.length > 1 ? "s" : "",
							" · ",
							active,
							" active"
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/portal/vps",
					children: ["Manage ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "ml-1 h-3.5 w-3.5" })]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 p-3 sm:p-4 sm:grid-cols-2 lg:grid-cols-3",
			children: vps.slice(0, 3).map((v) => {
				const d = daysUntil(v.due_at);
				const m = v.metadata ?? {};
				const tone = d == null ? "border-border text-muted-foreground bg-background/60" : d < 0 ? "border-rose-500/40 text-rose-500 bg-rose-500/10" : d <= 7 ? "border-amber-500/40 text-amber-500 bg-amber-500/10" : "border-emerald-500/40 text-emerald-500 bg-emerald-500/10";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/portal/vps",
					className: "group rounded-xl border border-border bg-background/70 backdrop-blur p-3 sm:p-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold truncate",
									children: v.title
								}), (m.hostname || m.ip_address) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-mono text-muted-foreground truncate",
									children: m.hostname || m.ip_address
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("text-[10px] font-medium px-2 py-0.5 rounded-full border inline-flex items-center gap-1 shrink-0", tone),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-2.5 w-2.5" }), d == null ? "—" : d < 0 ? `${Math.abs(d)}d ago` : `${d}d`]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-3 text-[11px] text-muted-foreground",
							children: [
								m.cpu_cores && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-3 w-3" }),
										m.cpu_cores,
										"c"
									]
								}),
								m.ram_gb && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-3 w-3" }),
										m.ram_gb,
										"GB"
									]
								}),
								m.storage_gb && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-3 w-3" }),
										m.storage_gb,
										"GB SSD"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: v.status }), m.panel_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition",
								children: ["Panel ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
							})]
						})
					]
				}, v.id);
			})
		})]
	});
}
function VpsExpiryBanner({ vps }) {
	const alerts = vps.map((v) => ({
		v,
		d: daysUntil(v.due_at)
	})).filter((x) => x.d != null && x.d <= 7).sort((a, b) => (a.d ?? 0) - (b.d ?? 0));
	if (alerts.length === 0) return null;
	const expired = (alerts[0].d ?? 0) < 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl border p-4 sm:p-5 flex flex-wrap items-start gap-4", expired ? "border-rose-500/40 bg-rose-500/10" : "border-amber-500/40 bg-amber-500/10"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-10 w-10 shrink-0 rounded-xl flex items-center justify-center", expired ? "bg-rose-500/20 text-rose-500" : "bg-amber-500/20 text-amber-500"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("font-semibold", expired ? "text-rose-500" : "text-amber-600 dark:text-amber-400"),
					children: expired ? "VPS renewal overdue" : `${alerts.length} VPS renewing within 7 days`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1 space-y-0.5 text-xs text-muted-foreground",
					children: alerts.slice(0, 3).map(({ v, d }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "truncate",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: v.title
							}),
							" —",
							" ",
							d < 0 ? `expired ${Math.abs(d)}d ago` : d === 0 ? "expires today" : `${d}d left`
						]
					}, v.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/portal/orders",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-1.5" }), " Invoices"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					className: "bg-gradient-brand text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/portal/vps",
						children: "Renew now"
					})
				})]
			})
		]
	});
}
//#endregion
export { PortalDashboard as component };
