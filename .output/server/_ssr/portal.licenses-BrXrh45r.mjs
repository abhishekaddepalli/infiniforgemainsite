import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Bn as Building2, It as Infinity$1, Kn as Ban, Nn as Check, Pt as KeyRound, R as ShieldCheck, Sn as Clock, U as Search, Z as RefreshCw, Zn as ArrowLeft, _ as TriangleAlert, j as Sparkles, n as Zap, vn as Copy, zn as CalendarClock } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-CiapfthD.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.licenses-BrXrh45r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BRAND_KEY = "infg_license_brand";
function useBrand() {
	const [brand, setBrand] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return {
			name: "Infiniforge",
			color: "#FF9933"
		};
		try {
			const raw = window.localStorage.getItem(BRAND_KEY);
			if (raw) return JSON.parse(raw);
		} catch {}
		return {
			name: "Infiniforge",
			color: "#FF9933"
		};
	});
	(0, import_react.useEffect)(() => {
		try {
			window.localStorage.setItem(BRAND_KEY, JSON.stringify(brand));
		} catch {}
	}, [brand]);
	return [brand, setBrand];
}
function daysUntil(iso) {
	if (!iso) return null;
	const ms = new Date(iso).getTime() - Date.now();
	return Math.ceil(ms / (1e3 * 60 * 60 * 24));
}
function statusTone(s) {
	const k = s.toLowerCase();
	if (["active"].includes(k)) return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
	if (["trial"].includes(k)) return "bg-sky-500/15 text-sky-500 border-sky-500/30";
	if (["suspended"].includes(k)) return "bg-amber-500/15 text-amber-500 border-amber-500/30";
	if ([
		"expired",
		"revoked",
		"cancelled"
	].includes(k)) return "bg-rose-500/15 text-rose-500 border-rose-500/30";
	return "bg-primary/15 text-primary border-primary/30";
}
function LicensesPortal() {
	const { user, roles, loading } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [brand, setBrand] = useBrand();
	const [brandOpen, setBrandOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [renewFor, setRenewFor] = (0, import_react.useState)(null);
	const [renewNote, setRenewNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		user,
		loading,
		navigate
	]);
	const isReseller = roles.includes("reseller");
	const { data: licenses = [], isLoading } = useQuery({
		queryKey: ["portal-licenses", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("module_records").select("*").eq("module", "licenses").eq("customer_id", user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return licenses.filter((l) => {
			if (statusFilter !== "all" && l.status !== statusFilter) return false;
			if (!q) return true;
			const key = String(l.metadata?.["license_key"] ?? "").toLowerCase();
			const domain = String(l.metadata?.["bound_domain"] ?? "").toLowerCase();
			return l.title.toLowerCase().includes(q) || key.includes(q) || domain.includes(q);
		});
	}, [
		licenses,
		search,
		statusFilter
	]);
	const kpis = (0, import_react.useMemo)(() => {
		return {
			active: licenses.filter((l) => l.status === "active").length,
			trial: licenses.filter((l) => l.status === "trial").length,
			expiring: licenses.filter((l) => {
				const d = daysUntil(l.due_at);
				return d !== null && d >= 0 && d <= 30 && l.status !== "expired";
			}).length,
			expired: licenses.filter((l) => l.status === "expired" || l.status === "revoked").length
		};
	}, [licenses]);
	const requestRenewal = useMutation({
		mutationFn: async ({ license, note }) => {
			const licenseKey = String(license.metadata?.["license_key"] ?? "—");
			const description = [
				`License renewal request`,
				`Product: ${license.title}`,
				`Key: ${licenseKey}`,
				`Current status: ${license.status}`,
				license.due_at ? `Expires: ${new Date(license.due_at).toLocaleDateString("en-IN")}` : null,
				"",
				note ? `Customer note:\n${note}` : "Please initiate renewal at earliest."
			].filter(Boolean).join("\n");
			const { error } = await supabase.from("tickets").insert({
				customer_id: user.id,
				subject: `Renewal request — ${license.title}`,
				description,
				department: "sales",
				priority: "high",
				status: "open"
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Renewal request submitted", { description: "Our team will contact you shortly." });
			qc.invalidateQueries({ queryKey: ["portal-tickets"] });
			setRenewFor(null);
			setRenewNote("");
		},
		onError: (e) => toast.error(e.message)
	});
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border bg-card/60 backdrop-blur sticky top-0 z-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/portal",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), " Portal"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden md:flex items-center gap-2 pl-3 border-l border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm",
								style: { background: brand.color },
								children: brand.name.charAt(0).toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold leading-tight",
								children: brand.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "License Portal"
							})] })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [isReseller && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
							open: brandOpen,
							onOpenChange: setBrandOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 mr-1.5" }), " White-label"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "White-label branding" }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Brand name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: brand.name,
											onChange: (e) => setBrand({
												...brand,
												name: e.target.value
											}),
											placeholder: "Your company"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Accent colour" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "color",
											value: brand.color,
											onChange: (e) => setBrand({
												...brand,
												color: e.target.value
											}),
											className: "h-10 w-24 p-1"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Applied to your customer-facing licence portal view. Stored locally on your device."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setBrandOpen(false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 mr-1.5" }), " Save"]
								}) })
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => qc.invalidateQueries({ queryKey: ["portal-licenses"] }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-1.5" }), " Refresh"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-start justify-between flex-wrap gap-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-3.5 w-3.5" }), " Licenses"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-bold tracking-tight mt-1",
								children: "Manage your license keys"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground mt-1.5 max-w-2xl text-sm",
								children: "Activate, monitor and renew software licenses bound to your domains and devices. Request renewal any time — our team will process it within 1 business day."
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
								label: "Active",
								value: kpis.active,
								icon: ShieldCheck,
								tone: "text-emerald-500 bg-emerald-500/10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
								label: "Trial",
								value: kpis.trial,
								icon: Sparkles,
								tone: "text-sky-500 bg-sky-500/10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
								label: "Expiring ≤ 30d",
								value: kpis.expiring,
								icon: Clock,
								tone: "text-amber-500 bg-amber-500/10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
								label: "Expired / Revoked",
								value: kpis.expired,
								icon: TriangleAlert,
								tone: "text-rose-500 bg-rose-500/10"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 flex flex-wrap items-center gap-3 border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1 min-w-[220px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Search by name, key or domain",
									className: "pl-9"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: statusFilter,
								onValueChange: setStatusFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-[180px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All statuses"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "trial",
										children: "Trial"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "suspended",
										children: "Suspended"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "expired",
										children: "Expired"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "revoked",
										children: "Revoked"
									})
								] })]
							})]
						}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-12 text-center text-sm text-muted-foreground",
							children: "Loading licenses…"
						}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-12 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-10 w-10 mx-auto opacity-30 mb-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "No licenses found"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: licenses.length === 0 ? "You don't have any licenses yet. Purchase a product to receive your first key." : "Try changing filters."
								}),
								licenses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "mt-4",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/products",
										children: "Browse products"
									})
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border",
							children: filtered.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LicenseRow, {
								license: l,
								onRenew: () => setRenewFor(l),
								brandColor: brand.color
							}, l.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!renewFor,
				onOpenChange: (o) => !o && setRenewFor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Request renewal" }) }),
					renewFor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-secondary/40 p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: renewFor.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground font-mono mt-0.5",
									children: String(renewFor.metadata?.["license_key"] ?? "—")
								}),
								renewFor.due_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground mt-1 flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-3 w-3" }),
										" Expires ",
										new Date(renewFor.due_at).toLocaleDateString("en-IN")
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes for our team (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: renewNote,
							onChange: (e) => setRenewNote(e.target.value),
							placeholder: "e.g. extend for 1 year, add 5 more seats…",
							rows: 4
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setRenewFor(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => renewFor && requestRenewal.mutate({
							license: renewFor,
							note: renewNote
						}),
						disabled: requestRenewal.isPending,
						children: requestRenewal.isPending ? "Submitting…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-1.5" }), " Submit request"] })
					})] })
				] })
			})
		]
	});
}
function Kpi({ label, value, icon: Icon, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-8 w-8 rounded-lg flex items-center justify-center", tone),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 text-2xl font-bold tracking-tight",
			children: value
		})]
	});
}
function LicenseRow({ license, onRenew, brandColor }) {
	const key = String(license.metadata?.["license_key"] ?? "");
	const domain = String(license.metadata?.["bound_domain"] ?? "");
	const tier = String(license.metadata?.["tier"] ?? "");
	const days = daysUntil(license.due_at);
	const expiringSoon = days !== null && days >= 0 && days <= 30 && license.status !== "expired";
	const overdue = days !== null && days < 0;
	const copyKey = async () => {
		if (!key) return toast.error("No key on record");
		try {
			await navigator.clipboard.writeText(key);
			toast.success("License key copied");
		} catch {
			toast.error("Copy failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-5 hover:bg-secondary/20 transition-colors",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-4 flex-wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white",
					style: { background: brandColor },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-[240px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-[15px]",
									children: license.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: cn("capitalize text-[10px]", statusTone(license.status)),
									children: license.status
								}),
								tier && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] capitalize",
									children: tier
								}),
								expiringSoon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/30",
									children: [
										"Expires in ",
										days,
										"d"
									]
								}),
								overdue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/30",
									children: "Overdue"
								})
							]
						}),
						license.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: license.subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 grid sm:grid-cols-2 gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground shrink-0",
											children: "Key"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono text-[11px] bg-secondary rounded px-1.5 py-0.5 truncate flex-1",
											children: key || "—"
										}),
										key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											className: "h-6 w-6",
											onClick: copyKey,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground shrink-0",
										children: "Bound to"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: domain || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
											className: "text-muted-foreground",
											children: "unbound"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground shrink-0",
										children: "Fee"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: license.amount_inr ? formatINR(Number(license.amount_inr)) : "—" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground shrink-0",
										children: "Expires"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: license.due_at ? new Date(license.due_at).toLocaleDateString("en-IN") : "Lifetime" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpiryCountdown, {
							startIso: String(license.metadata?.["issued_at"] ?? license.created_at),
							endIso: license.due_at,
							status: license.status
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [license.status === "expired" || license.status === "suspended" || expiringSoon || overdue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: onRenew,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 mr-1.5" }), " Request renewal"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: onRenew,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 mr-1.5" }), " Renew"]
					}), license.status === "revoked" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3 w-3 mr-1" }), " Revoked"]
					})]
				})
			]
		})
	});
}
function pad(n) {
	return String(n).padStart(2, "0");
}
function ExpiryCountdown({ startIso, endIso, status }) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(id);
	}, []);
	if (!endIso) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 px-3 py-2 flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-semibold text-emerald-500",
			children: "Lifetime — never expires"
		})]
	});
	const start = new Date(startIso).getTime();
	const end = new Date(endIso).getTime();
	const total = Math.max(1, end - start);
	const remaining = Math.max(0, end - now);
	const pct = Math.max(0, Math.min(100, remaining / total * 100));
	const expired = remaining <= 0 || status === "expired" || status === "revoked";
	const d = Math.floor(remaining / 864e5);
	const h = Math.floor(remaining % 864e5 / 36e5);
	const m = Math.floor(remaining % 36e5 / 6e4);
	const s = Math.floor(remaining % 6e4 / 1e3);
	let barGradient = "from-emerald-400 via-emerald-500 to-teal-500";
	let glow = "shadow-[0_0_18px_rgba(16,185,129,0.35)]";
	let textTone = "text-emerald-500";
	let urgent = false;
	if (expired) {
		barGradient = "from-rose-500 via-red-500 to-rose-600";
		glow = "shadow-[0_0_20px_rgba(244,63,94,0.45)]";
		textTone = "text-rose-500";
	} else if (pct < 20) {
		barGradient = "from-rose-500 via-red-500 to-rose-600";
		glow = "shadow-[0_0_20px_rgba(244,63,94,0.45)]";
		textTone = "text-rose-500";
		urgent = true;
	} else if (pct < 50) {
		barGradient = "from-amber-400 via-orange-500 to-amber-600";
		glow = "shadow-[0_0_18px_rgba(245,158,11,0.4)]";
		textTone = "text-amber-500";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-xl border border-border bg-secondary/30 px-3 py-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 mb-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), expired ? "Expired" : "Time remaining"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("font-mono text-xs sm:text-sm font-bold tabular-nums flex items-center gap-1", textTone, urgent && "animate-pulse"),
					children: [urgent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3" }), expired ? "00d 00h 00m 00s" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						d,
						"d ",
						pad(h),
						"h ",
						pad(m),
						"m ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "opacity-70",
							children: [pad(s), "s"]
						})
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-2 w-full rounded-full bg-background/70 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-1000 ease-linear", barGradient, glow),
					style: { width: `${expired ? 100 : pct}%` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200%_100%] animate-[licshimmer_2s_linear_infinite]" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes licshimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }` })
		]
	});
}
//#endregion
export { LicensesPortal as component };
