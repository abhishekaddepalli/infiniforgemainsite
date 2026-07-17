import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { $ as Receipt, An as ChevronRight, F as ShoppingCart, Hn as Boxes, Nn as Check, Pn as CheckCheck, Pt as KeyRound, Qn as ArrowDownRight, Rt as Inbox, S as Ticket, St as Mail, V as Server, Yn as ArrowUpRight, Z as RefreshCw, at as Phone, dt as Package, i as Wrench, j as Sparkles, jt as Layers, o as Wallet, qt as Globe, tn as FileText, u as Users, v as TrendingUp } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { n as downloadCsv } from "./download-DhKjMGgD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-2H3oqbaL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Dashboard",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardInner, {})
	});
}
var RANGE_DAYS = {
	"7": 7,
	"30": 30,
	"90": 90,
	"365": 365,
	all: null
};
function DashboardInner() {
	const qc = useQueryClient();
	const [range, setRange] = (0, import_react.useState)("30");
	const sinceIso = (() => {
		const d = RANGE_DAYS[range];
		if (!d) return null;
		const t = /* @__PURE__ */ new Date();
		t.setDate(t.getDate() - d);
		return t.toISOString();
	})();
	const { data: stats, refetch: refetchStats } = useQuery({
		queryKey: ["admin-stats", range],
		queryFn: async () => {
			const ordersQ = supabase.from("orders").select("*", {
				count: "exact",
				head: true
			});
			const revenueQ = supabase.from("orders").select("total_inr,created_at").eq("status", "paid");
			const usersQ = supabase.from("profiles").select("*", {
				count: "exact",
				head: true
			});
			if (sinceIso) {
				ordersQ.gte("created_at", sinceIso);
				revenueQ.gte("created_at", sinceIso);
				usersQ.gte("created_at", sinceIso);
			}
			const [orders, products, tickets, users, revenueAgg, subs, licensesActive, licensesTotal, digitalProducts, hostingActive, domainsActive, amcActive, activeServices, walletsAgg, invoicesUnpaid, affiliatesActive, newContactSubs] = await Promise.all([
				ordersQ,
				supabase.from("products").select("*", {
					count: "exact",
					head: true
				}),
				supabase.from("tickets").select("*", {
					count: "exact",
					head: true
				}).eq("status", "open"),
				usersQ,
				revenueQ,
				supabase.from("subscriptions").select("*", {
					count: "exact",
					head: true
				}).eq("status", "active"),
				supabase.from("module_records").select("*", {
					count: "exact",
					head: true
				}).eq("module", "licenses").eq("status", "active"),
				supabase.from("module_records").select("*", {
					count: "exact",
					head: true
				}).eq("module", "licenses"),
				supabase.from("products").select("*", {
					count: "exact",
					head: true
				}).eq("product_type", "digital"),
				supabase.from("module_records").select("*", {
					count: "exact",
					head: true
				}).eq("module", "hosting").eq("status", "active"),
				supabase.from("module_records").select("*", {
					count: "exact",
					head: true
				}).eq("module", "domains").eq("status", "active"),
				supabase.from("module_records").select("*", {
					count: "exact",
					head: true
				}).eq("module", "amc").eq("status", "active"),
				supabase.from("products").select("*", {
					count: "exact",
					head: true
				}).in("product_type", [
					"service",
					"saas",
					"hosting",
					"domain",
					"ssl",
					"amc",
					"monitoring"
				]).eq("status", "active"),
				supabase.from("wallets").select("balance_inr"),
				supabase.from("orders").select("*", {
					count: "exact",
					head: true
				}).eq("status", "pending"),
				supabase.from("user_roles").select("*", {
					count: "exact",
					head: true
				}).eq("role", "affiliate"),
				supabase.from("module_records").select("*", {
					count: "exact",
					head: true
				}).eq("module", "contact_submissions").eq("status", "new")
			]);
			const revenue = (revenueAgg.data ?? []).reduce((s, r) => s + Number(r.total_inr ?? 0), 0);
			const walletTotal = (walletsAgg.data ?? []).reduce((s, r) => s + Number(r.balance_inr ?? 0), 0);
			return {
				orders: orders.count ?? 0,
				products: products.count ?? 0,
				openTickets: tickets.count ?? 0,
				users: users.count ?? 0,
				subs: subs.count ?? 0,
				revenue,
				rawRevenueRows: revenueAgg.data ?? [],
				licensesActive: licensesActive.count ?? 0,
				licensesTotal: licensesTotal.count ?? 0,
				digitalProducts: digitalProducts.count ?? 0,
				hostingActive: hostingActive.count ?? 0,
				domainsActive: domainsActive.count ?? 0,
				amcActive: amcActive.count ?? 0,
				activeServices: activeServices.count ?? 0,
				walletTotal,
				invoicesUnpaid: invoicesUnpaid.count ?? 0,
				affiliatesActive: affiliatesActive.count ?? 0,
				newContactSubs: newContactSubs.count ?? 0
			};
		},
		refetchInterval: 3e4
	});
	const { data: recentOrders, refetch: refetchRecent } = useQuery({
		queryKey: ["admin-recent-orders"],
		queryFn: async () => {
			const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6);
			return data ?? [];
		},
		refetchInterval: 2e4
	});
	const { data: newEnquiries, refetch: refetchEnquiries } = useQuery({
		queryKey: ["admin-new-enquiries"],
		queryFn: async () => {
			const { data } = await supabase.from("module_records").select("id,title,metadata,created_at,status").eq("module", "contact_submissions").eq("status", "new").order("created_at", { ascending: false }).limit(6);
			return data ?? [];
		},
		refetchInterval: 3e4
	});
	const markRead = useMutation({
		mutationFn: async (ids) => {
			const { error } = await supabase.from("module_records").update({ status: "read" }).in("id", ids).eq("module", "contact_submissions");
			if (error) throw error;
		},
		onSuccess: (_d, ids) => {
			toast.success(`Marked ${ids.length} enquir${ids.length === 1 ? "y" : "ies"} as read`);
			qc.invalidateQueries({ queryKey: ["admin-new-enquiries"] });
			qc.invalidateQueries({ queryKey: ["admin-stats"] });
			qc.invalidateQueries({ queryKey: ["contact-submissions"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to mark as read")
	});
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("admin-dashboard-live").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "orders"
		}, () => {
			qc.invalidateQueries({ queryKey: ["admin-stats"] });
			qc.invalidateQueries({ queryKey: ["admin-recent-orders"] });
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "tickets"
		}, () => qc.invalidateQueries({ queryKey: ["admin-stats"] })).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "profiles"
		}, () => qc.invalidateQueries({ queryKey: ["admin-stats"] })).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "module_records"
		}, () => qc.invalidateQueries({ queryKey: ["admin-stats"] })).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "subscriptions"
		}, () => qc.invalidateQueries({ queryKey: ["admin-stats"] })).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "wallets"
		}, () => qc.invalidateQueries({ queryKey: ["admin-stats"] })).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "products"
		}, () => qc.invalidateQueries({ queryKey: ["admin-stats"] })).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [qc]);
	function exportReport() {
		const rows = stats?.rawRevenueRows ?? [];
		if (!rows.length && !recentOrders?.length) {
			toast.info("No data available to export");
			return;
		}
		const buckets = /* @__PURE__ */ new Map();
		for (const r of rows) {
			const d = new Date(r.created_at).toISOString().slice(0, 10);
			buckets.set(d, (buckets.get(d) ?? 0) + Number(r.total_inr ?? 0));
		}
		const csv = [["date", "revenue_inr"]];
		for (const [date, revenue] of Array.from(buckets.entries()).sort(([a], [b]) => a < b ? -1 : 1)) csv.push([date, revenue.toFixed(2)]);
		csv.push(["TOTAL", (stats?.revenue ?? 0).toFixed(2)]);
		downloadCsv(csv, `infiniforge-dashboard-${range}d-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
		toast.success("Report exported");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:flex-wrap sm:gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dashboard" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Overview" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mt-1",
						children: "Welcome back 👋"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-sm text-muted-foreground mt-1",
						children: "Live overview of Infiniforge — auto-refreshing every 30s."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: range,
						onValueChange: (v) => setRange(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-full sm:w-[140px] min-w-[130px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "7",
								children: "Last 7 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "30",
								children: "Last 30 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "90",
								children: "Last 90 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "365",
								children: "Last year"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All time"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							refetchStats();
							refetchRecent();
							toast.success("Refreshed");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 sm:mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Refresh"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "bg-gradient-brand text-white",
						onClick: exportReport,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-3.5 w-3.5 sm:mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Export report"
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: `Revenue (${range === "all" ? "all time" : `last ${range}d`})`,
					value: formatINR(stats?.revenue ?? 0),
					change: "live",
					up: true,
					icon: TrendingUp
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Orders",
					value: (stats?.orders ?? 0).toLocaleString("en-IN"),
					change: "live",
					up: true,
					icon: ShoppingCart
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Active subscriptions",
					value: (stats?.subs ?? 0).toLocaleString("en-IN"),
					change: "live",
					up: true,
					icon: RefreshCw
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Open tickets",
					value: (stats?.openTickets ?? 0).toLocaleString("en-IN"),
					change: "awaiting reply",
					icon: Ticket
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2",
				children: ["Live operations ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-accent animate-pulse" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] text-muted-foreground",
				children: "Auto-updating"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Active services",
					value: stats?.activeServices ?? 0,
					to: "/admin/services",
					icon: Boxes
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Active licenses",
					value: stats?.licensesActive ?? 0,
					to: "/admin/licenses",
					icon: KeyRound
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Digital products",
					value: stats?.digitalProducts ?? 0,
					to: "/admin/digital-products",
					icon: Layers
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Hosting active",
					value: stats?.hostingActive ?? 0,
					to: "/admin/hosting",
					icon: Server
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Domains active",
					value: stats?.domainsActive ?? 0,
					to: "/admin/domains",
					icon: Globe
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "AMC contracts",
					value: stats?.amcActive ?? 0,
					to: "/admin/amc",
					icon: Wrench
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Unpaid invoices",
					value: stats?.invoicesUnpaid ?? 0,
					to: "/admin/invoices",
					icon: FileText
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Wallet balances",
					value: Math.round(stats?.walletTotal ?? 0),
					to: "/admin/wallets",
					icon: Wallet
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Affiliates",
					value: stats?.affiliatesActive ?? 0,
					to: "/admin/affiliates",
					icon: Users
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Products",
					value: stats?.products ?? 0,
					to: "/admin/products",
					icon: Package
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Customers",
					value: stats?.users ?? 0,
					to: "/admin/users",
					icon: Users
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Orders",
					value: stats?.orders ?? 0,
					to: "/admin/orders",
					icon: ShoppingCart
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "Open tickets",
					value: stats?.openTickets ?? 0,
					to: "/admin/tickets",
					icon: Ticket
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TinyCard, {
					label: "New enquiries",
					value: stats?.newContactSubs ?? 0,
					to: "/admin/contact-submissions",
					icon: Inbox
				})
			]
		})] }),
		(newEnquiries?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.04] via-card to-accent/[0.04] shadow-card overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-5 pb-3 flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: "New contact enquiries"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-semibold",
						children: [newEnquiries?.length ?? 0, " unread"]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								refetchEnquiries();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 sm:mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Refresh"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "bg-gradient-brand text-white",
							disabled: markRead.isPending,
							onClick: () => markRead.mutate((newEnquiries ?? []).map((e) => e.id)),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-3.5 w-3.5 sm:mr-1.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Mark all as read"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sm:hidden",
									children: "All read"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/contact-submissions",
								children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5 ml-1" })]
							})
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: (newEnquiries ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 px-5 py-3 hover:bg-secondary/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-sm truncate",
									children: e.title ?? "Contact enquiry"
								}), e.metadata?.interest && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] rounded-full px-2 py-0.5 bg-primary/10 text-primary font-medium",
									children: e.metadata.interest
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5",
								children: [
									e.metadata?.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), e.metadata.email]
									}),
									e.metadata?.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }), e.metadata.phone]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(e.created_at).toLocaleString() })
								]
							}),
							e.metadata?.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-1 line-clamp-2",
								children: e.metadata.message
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						disabled: markRead.isPending,
						onClick: () => markRead.mutate([e.id]),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 mr-1.5" }), " Mark read"]
					})]
				}, e.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 rounded-2xl border border-border bg-card shadow-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-6 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: "Recent orders"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-semibold mt-0.5",
						children: "Latest transactions"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/orders",
							children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "ml-1 h-3.5 w-3.5" })]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-[760px] w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-xs text-muted-foreground border-y border-border bg-secondary/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-2.5 font-medium",
									children: "Order"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2.5 font-medium text-right",
									children: "Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-2.5 font-medium",
									children: "Status"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-border",
							children: [(recentOrders ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "px-6 py-10 text-center text-sm text-muted-foreground",
								children: "No orders yet. Orders placed by customers will appear here."
							}) }), (recentOrders ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-secondary/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3 font-mono text-xs break-all",
										children: o.order_number
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-3 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: o.customer_name ?? "—"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground break-all",
											children: o.customer_email ?? ""
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3 text-muted-foreground break-words",
										children: o.product_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3 text-right font-semibold",
										children: formatINR(Number(o.total_inr))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: o.status })
									})
								]
							}, o.id))]
						})]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: "System health"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-xl font-bold flex items-center gap-2",
						children: ["All systems normal ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-accent animate-pulse" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-4",
						children: [
							{
								label: "API gateway",
								value: 99.99
							},
							{
								label: "Payment (Razorpay)",
								value: 99.98
							},
							{
								label: "VPS pool (Mumbai)",
								value: 99.94
							},
							{
								label: "Email delivery",
								value: 98.72
							},
							{
								label: "AI gateway",
								value: 99.86
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold",
								children: [s.value, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 rounded-full bg-secondary overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-accent",
								style: { width: `${s.value}%` }
							})
						})] }, s.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Enable auto-scale on Mumbai VPS pool to keep 99.99% during peak traffic." })]
					})
				]
			})]
		})
	] });
}
function KpiCard({ label, value, change, up, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-8 w-8 rounded-lg bg-secondary flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-2xl font-bold tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-2 text-xs font-medium flex items-center gap-1", up ? "text-accent" : "text-muted-foreground"),
				children: [up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3.5 w-3.5" }), change]
			})
		]
	});
}
function TinyCard({ label, value, to, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xl font-bold",
			children: value.toLocaleString("en-IN")
		})] })]
	});
}
function StatusPill({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex text-[11px] font-semibold rounded-full px-2.5 py-1 capitalize", {
			paid: "bg-accent/15 text-accent",
			pending: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
			refunded: "bg-secondary text-muted-foreground",
			active: "bg-accent/15 text-accent",
			cancelled: "bg-destructive/15 text-destructive",
			failed: "bg-destructive/15 text-destructive"
		}[status] || "bg-secondary"),
		children: status
	});
}
//#endregion
export { AdminDashboard as component };
