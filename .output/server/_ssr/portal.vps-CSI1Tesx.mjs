import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { C as Terminal, Ht as HardDrive, Ot as LifeBuoy, Pt as KeyRound, Q as RefreshCcw, R as ShieldCheck, Sn as Clock, V as Server, _ as TriangleAlert, _n as Cpu, _t as MessageCircle, a as Wifi, cn as ExternalLink, er as Activity, nt as Power, on as Eye, q as RotateCw, qt as Globe, sn as EyeOff, tn as FileText, vn as Copy, xt as MapPin } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { a as useCms } from "./cms-BQLw1hye.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
import { r as buildWhatsAppLink } from "./whatsapp-Bfedub3g.mjs";
import { a as addMonthsISO, c as debitWalletForOrder, i as PAYMENT_METHOD_LABEL, l as notifyCustomerVps, n as CYCLE_MONTHS, o as computeTotals, s as createVpsOrder, t as CYCLE_LABEL } from "./vps-billing-DmHiUlI3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.vps-CSI1Tesx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function daysUntil(iso) {
	if (!iso) return null;
	const diff = new Date(iso).getTime() - Date.now();
	return Math.ceil(diff / (1440 * 60 * 1e3));
}
function copy(text, label) {
	navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied`), () => toast.error("Copy failed"));
}
function statusRing(s) {
	const k = s.toLowerCase();
	if (k === "active") return "ring-emerald-500/40 shadow-emerald-500/20";
	if (k === "provisioning") return "ring-sky-500/40 shadow-sky-500/20";
	if (k === "suspended") return "ring-amber-500/40 shadow-amber-500/20";
	return "ring-rose-500/40 shadow-rose-500/20";
}
function statusDot(s) {
	const k = s.toLowerCase();
	if (k === "active") return "bg-emerald-500";
	if (k === "provisioning") return "bg-sky-500 animate-pulse";
	if (k === "suspended") return "bg-amber-500";
	return "bg-rose-500";
}
function PortalVpsPage() {
	const { user } = useAuth();
	const wa = useCms("whatsapp");
	const footer = useCms("footer");
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["portal-vps", user?.id],
		enabled: !!user?.id,
		queryFn: async () => {
			const { data, error } = await supabase.from("module_records").select("id, title, subtitle, status, amount_inr, due_at, metadata, created_at").eq("module", "vps_instance").eq("customer_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 sm:p-6 lg:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 sm:gap-4 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-11 w-11 sm:h-14 sm:w-14 shrink-0 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-5 w-5 sm:h-7 sm:w-7 text-white" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl sm:text-2xl lg:text-3xl font-bold",
									children: "My VPS"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl",
									children: "Your cloud infrastructure at a glance — IPs, credentials, plan specs and renewal status. Managed by Infiniforge's NOC."
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 sm:gap-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Instances",
									value: rows.length.toString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Active",
									value: rows.filter((r) => r.status === "active").length.toString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
									label: "Uptime",
									value: "99.99%"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpiryAlertBanner, { rows }),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass rounded-2xl p-16 text-center text-muted-foreground",
				children: "Loading your VPS instances…"
			}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpsCard, {
					vps: r,
					waNumber: wa.number || footer.phone || ""
				}, r.id))
			})
		]
	});
}
function MiniStat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-background/60 px-2.5 py-2 sm:px-4 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-base sm:text-xl font-bold text-foreground",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground",
			children: label
		})]
	});
}
function EmptyState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-2xl p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold",
				children: "No VPS instances yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground max-w-md mx-auto",
				children: "Once our team provisions a VPS for you, it will appear here with all access details — IP, root credentials, control panel, and renewal reminders."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "bg-gradient-brand text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/hosting",
						children: "Explore hosting plans"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/portal/tickets",
						children: "Open a ticket"
					})
				})]
			})
		]
	});
}
function VpsCard({ vps, waNumber }) {
	const m = vps.metadata ?? {};
	const [showPw, setShowPw] = (0, import_react.useState)(false);
	const [showPanelPw, setShowPanelPw] = (0, import_react.useState)(false);
	const [renewOpen, setRenewOpen] = (0, import_react.useState)(false);
	const renewal = daysUntil(vps.due_at);
	const sshCmd = m.ip_address ? `ssh -p ${m.ssh_port || "22"} ${m.root_user || "root"}@${m.ip_address}` : "";
	const cycleLabel = m.billing_cycle ? CYCLE_LABEL[m.billing_cycle] : null;
	function requestAction(action) {
		const text = `Hello Infiniforge NOC 👋%0A%0AI'd like to ${action} my VPS:%0A• Label: ${vps.title}%0A• Hostname: ${m.hostname || "—"}%0A• IP: ${m.ip_address || "—"}%0A%0APlease confirm and proceed.`;
		if (waNumber) window.open(buildWhatsAppLink(waNumber, decodeURIComponent(text)), "_blank", "noopener,noreferrer");
		else toast.info("Reach us via Support Tickets — WhatsApp number not configured yet.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur shadow-lg ring-1", statusRing(vps.status)),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 sm:gap-3 border-b border-border bg-background/40 px-3 sm:px-5 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2.5 w-2.5 shrink-0 rounded-full", statusDot(vps.status)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-foreground truncate text-sm sm:text-base",
									children: vps.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] uppercase tracking-wider",
									children: vps.status
								}),
								m.plan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px]",
									children: m.plan
								}),
								cycleLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px]",
									children: cycleLabel
								}),
								m.auto_renew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
									children: "Auto-renew"
								})
							]
						}), vps.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5 truncate",
							children: vps.subtitle
						})]
					}),
					renewal != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full border font-medium inline-flex items-center gap-1.5 shrink-0", renewal < 0 ? "border-rose-500/40 text-rose-500 bg-rose-500/10" : renewal <= 7 ? "border-amber-500/40 text-amber-500 bg-amber-500/10 animate-pulse" : "border-emerald-500/40 text-emerald-500 bg-emerald-500/10"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), renewal < 0 ? `Expired ${Math.abs(renewal)}d ago` : `${renewal}d left`]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/30 px-3 sm:px-5 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 text-xs text-muted-foreground flex-wrap",
					children: [
						vps.amount_inr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-foreground font-semibold",
							children: ["₹", Number(vps.amount_inr).toLocaleString("en-IN")]
						}), m.billing_cycle && m.billing_cycle !== "one_time" ? ` / ${m.billing_cycle}` : ""] }) : null,
						vps.due_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Next renewal · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: vps.due_at.slice(0, 10)
						})] }),
						m.last_invoice_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/portal/orders",
							className: "text-primary hover:underline inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3 w-3" }),
								" ",
								m.last_invoice_number
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutoRenewToggle, { vps }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setRenewOpen(true),
						className: "bg-gradient-brand text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-3.5 w-3.5 mr-1.5" }), " Renew"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenewDialog, {
				vps,
				open: renewOpen,
				onOpenChange: setRenewOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
						icon: Cpu,
						label: "vCPU",
						value: m.cpu_cores ? `${m.cpu_cores} cores` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
						icon: HardDrive,
						label: "RAM",
						value: m.ram_gb ? `${m.ram_gb} GB` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
						icon: HardDrive,
						label: "SSD",
						value: m.storage_gb ? `${m.storage_gb} GB` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
						icon: Wifi,
						label: "Bandwidth",
						value: m.bandwidth_gb ? `${m.bandwidth_gb} GB` : "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "overview",
				className: "px-3 sm:px-5 pt-4 pb-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "grid grid-cols-4 w-full h-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "overview",
								className: "text-[11px] sm:text-sm px-1 sm:px-3",
								children: "Overview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "access",
								className: "text-[11px] sm:text-sm px-1 sm:px-3",
								children: "Access"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "panel",
								className: "text-[11px] sm:text-sm px-1 sm:px-3",
								children: "Panel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "support",
								className: "text-[11px] sm:text-sm px-1 sm:px-3",
								children: "Actions"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "overview",
						className: "mt-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
									icon: Globe,
									label: "Hostname",
									value: m.hostname || "—",
									copyable: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
									icon: MapPin,
									label: "Datacenter",
									value: m.datacenter || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
									icon: Server,
									label: "Operating System",
									value: m.os || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
									icon: ShieldCheck,
									label: "Provisioned",
									value: m.provisioned_at || vps.created_at.slice(0, 10)
								})
							]
						}), m.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-muted/40 border border-border p-3 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold text-foreground uppercase tracking-wide mb-1",
								children: "Notes from your NOC"
							}), m.notes]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "access",
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
										icon: Globe,
										label: "IPv4 Address",
										value: m.ip_address || "—",
										copyable: true,
										mono: true
									}),
									m.ipv6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
										icon: Globe,
										label: "IPv6",
										value: m.ipv6,
										copyable: true,
										mono: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
										icon: Terminal,
										label: "SSH Port",
										value: m.ssh_port || "22",
										mono: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
										icon: KeyRound,
										label: "SSH User",
										value: m.root_user || "root",
										mono: true
									})
								]
							}),
							m.root_password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-background/50 p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] uppercase tracking-wider text-muted-foreground",
											children: "Root password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-sm truncate",
											children: showPw ? m.root_password : "•".repeat(Math.min(m.root_password.length, 14))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => setShowPw((v) => !v),
											children: showPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => copy(m.root_password, "Password"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
										})]
									})]
								})
							}),
							sshCmd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100 p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] uppercase tracking-wider text-slate-400",
											children: "Quick SSH"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono text-sm block truncate",
											children: sshCmd
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "secondary",
										onClick: () => copy(sshCmd, "SSH command"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4 mr-1" }), " Copy"]
									})]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "panel",
						className: "mt-4 space-y-3",
						children: m.panel_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-background/50 p-4 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wider text-muted-foreground",
								children: "Control panel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: m.panel_url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "text-primary hover:underline font-medium break-all",
								children: m.panel_url
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								className: "bg-gradient-brand text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: m.panel_url,
									target: "_blank",
									rel: "noopener noreferrer",
									children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4 ml-1" })]
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [m.panel_user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
								icon: KeyRound,
								label: "Username",
								value: m.panel_user,
								copyable: true,
								mono: true
							}), m.panel_password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-background/50 p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] uppercase tracking-wider text-muted-foreground",
											children: "Password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-sm truncate",
											children: showPanelPw ? m.panel_password : "•".repeat(Math.min(m.panel_password.length, 14))
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => setShowPanelPw((v) => !v),
											children: showPanelPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => copy(m.panel_password, "Password"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
										})]
									})]
								})
							})]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground py-4",
							children: "No control panel configured for this VPS."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "support",
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									icon: Power,
									label: "Request reboot",
									onClick: () => requestAction("reboot")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									icon: RefreshCcw,
									label: "Reinstall OS",
									onClick: () => requestAction("reinstall OS on")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									icon: Activity,
									label: "Check status",
									onClick: () => requestAction("check status of")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									icon: MessageCircle,
									label: "Chat on WhatsApp",
									onClick: () => requestAction("get support for")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "mt-3 w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/portal/tickets",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-4 w-4 mr-2" }), " Open support ticket"]
							})
						})]
					})
				]
			}),
			vps.amount_inr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border bg-background/40 px-5 py-2.5 text-xs text-muted-foreground flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold text-foreground",
					children: ["₹", Number(vps.amount_inr).toLocaleString("en-IN")]
				})]
			}) : null
		]
	});
}
function Spec({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-background/40 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3" }),
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-semibold text-foreground",
			children: value
		})]
	});
}
function Info$1({ icon: Icon, label, value, copyable, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-background/50 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3" }),
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-1 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("truncate text-sm", mono && "font-mono"),
				children: value
			}), copyable && value !== "—" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => copy(value, label),
				className: "text-muted-foreground hover:text-foreground shrink-0",
				"aria-label": `Copy ${label}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
			})]
		})]
	});
}
function ActionButton({ icon: Icon, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		onClick,
		className: "justify-start",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 mr-2 text-primary" }),
			" ",
			label
		]
	});
}
function ExpiryAlertBanner({ rows }) {
	const alerts = (0, import_react.useMemo)(() => {
		return rows.map((r) => ({
			r,
			d: daysUntil(r.due_at)
		})).filter((x) => x.d != null && x.d <= 7).sort((a, b) => (a.d ?? 0) - (b.d ?? 0));
	}, [rows]);
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
					children: alerts.slice(0, 4).map(({ r, d }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "truncate",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: r.title
							}),
							" —",
							" ",
							d < 0 ? `expired ${Math.abs(d)}d ago` : d === 0 ? "expires today" : `${d}d left`,
							r.due_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1",
								children: ["· ", r.due_at.slice(0, 10)]
							})
						]
					}, r.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "sm",
				className: "bg-gradient-brand text-white shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/portal/orders",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-1.5" }), " View invoices"]
				})
			})
		]
	});
}
function RenewDialog({ vps, open, onOpenChange }) {
	const qc = useQueryClient();
	const { user, profile } = useAuth();
	const m = vps.metadata ?? {};
	const [cycle, setCycle] = (0, import_react.useState)(m.billing_cycle ?? "monthly");
	const [method, setMethod] = (0, import_react.useState)("razorpay");
	const amount = Number(vps.amount_inr ?? 0);
	const gstPct = Number(m.gst_percent ?? 18);
	const months = CYCLE_MONTHS[cycle] || 1;
	const cycleAmount = amount * (months || 1);
	const totals = computeTotals(cycleAmount, gstPct);
	const nextDue = addMonthsISO(vps.due_at, months || 1);
	const renew = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("Please sign in again.");
			if (cycleAmount <= 0) throw new Error("This VPS has no billing amount set — contact support.");
			const order = await createVpsOrder({
				customerId: user.id,
				customerName: profile?.full_name ?? null,
				customerEmail: profile?.email ?? user.email ?? null,
				vpsTitle: vps.title,
				plan: m.plan,
				hostname: m.hostname,
				amountInr: cycleAmount,
				gstPercent: gstPct,
				billingCycle: cycle,
				paymentMethod: method,
				notes: `Renewal for ${vps.title} (${CYCLE_LABEL[cycle]})`
			});
			if (method === "wallet") try {
				await debitWalletForOrder({
					customerId: user.id,
					amount: Number(order.total_inr),
					orderId: order.id,
					description: `VPS renewal — ${vps.title} (${order.invoice_number || order.order_number})`
				});
			} catch (e) {
				await supabase.from("orders").update({
					status: "pending",
					paid_at: null,
					payment_method: "razorpay"
				}).eq("id", order.id);
				throw e;
			}
			const shouldExtend = method === "wallet";
			if (shouldExtend) {
				const meta = {
					...m ?? {},
					billing_cycle: cycle,
					last_invoice_id: order.id,
					last_invoice_number: order.invoice_number || order.order_number
				};
				await supabase.from("module_records").update({
					due_at: nextDue,
					metadata: meta
				}).eq("id", vps.id);
			}
			await notifyCustomerVps({
				customerId: user.id,
				title: shouldExtend ? "VPS renewed" : "Renewal invoice created",
				body: shouldExtend ? `${vps.title} has been renewed until ${nextDue.slice(0, 10)} for ₹${totals.total.toLocaleString("en-IN")}.` : `Invoice ${order.invoice_number || order.order_number} for ₹${totals.total.toLocaleString("en-IN")} is waiting for payment.`,
				href: shouldExtend ? "/portal/vps" : "/portal/orders"
			});
			return {
				paid: shouldExtend,
				invoice: order.invoice_number || order.order_number
			};
		},
		onSuccess: (res) => {
			toast.success(res.paid ? `VPS renewed · ${res.invoice}` : `Invoice ${res.invoice} created — pay to activate renewal`);
			onOpenChange(false);
			qc.invalidateQueries({ queryKey: ["portal-vps"] });
			qc.invalidateQueries({ queryKey: ["portal-orders"] });
			qc.invalidateQueries({ queryKey: ["portal-vps-dash"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Renew ", vps.title] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs mb-1.5 block",
							children: "Billing cycle"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: cycle,
							onValueChange: (v) => setCycle(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"monthly",
								"quarterly",
								"yearly"
							].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c,
								children: CYCLE_LABEL[c]
							}, c)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs mb-1.5 block",
							children: "Payment method"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: method,
							onValueChange: (v) => setMethod(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "razorpay",
								children: PAYMENT_METHOD_LABEL.razorpay
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "wallet",
								children: PAYMENT_METHOD_LABEL.wallet
							})] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: `Base × ${months}mo`,
									value: `₹${totals.base.toLocaleString("en-IN")}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: `GST ${gstPct}%`,
									value: `₹${totals.gst.toLocaleString("en-IN")}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-1 flex justify-between font-semibold text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", totals.total.toLocaleString("en-IN")] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-muted-foreground pt-1",
									children: ["Next renewal: ", nextDue.slice(0, 10)]
								})
							]
						}),
						method === "razorpay" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "An invoice will be created in your Orders. Pay it to complete the renewal — your VPS renewal date will update once payment is confirmed."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => renew.mutate(),
					disabled: renew.isPending,
					className: "bg-gradient-brand text-white",
					children: renew.isPending ? "Processing…" : method === "wallet" ? "Pay from wallet & renew" : "Create renewal invoice"
				})] })
			]
		})
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value })]
	});
}
function AutoRenewToggle({ vps }) {
	const qc = useQueryClient();
	const m = vps.metadata ?? {};
	const mut = useMutation({
		mutationFn: async (v) => {
			const meta = {
				...m ?? {},
				auto_renew: v
			};
			const { error } = await supabase.from("module_records").update({ metadata: meta }).eq("id", vps.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Auto-renew updated");
			qc.invalidateQueries({ queryKey: ["portal-vps"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs text-muted-foreground",
			children: "Auto-renew"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked: !!m.auto_renew,
			onCheckedChange: (v) => mut.mutate(v),
			disabled: mut.isPending
		})]
	});
}
//#endregion
export { PortalVpsPage as component };
