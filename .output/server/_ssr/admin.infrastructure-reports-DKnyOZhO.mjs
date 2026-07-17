import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Fn as ChartColumn, Lt as IndianRupee, Tt as Lock, V as Server, Z as RefreshCw, _ as TriangleAlert, er as Activity, fn as Download, i as Wrench, qt as Globe, xn as Cloud, zn as CalendarClock } from "../_libs/lucide-react.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { n as downloadCsv } from "./download-DhKjMGgD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.infrastructure-reports-DKnyOZhO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODULES = [
	{
		key: "servers",
		label: "Servers",
		icon: Server
	},
	{
		key: "hosting",
		label: "Hosting",
		icon: Cloud
	},
	{
		key: "domains",
		label: "Domains",
		icon: Globe
	},
	{
		key: "ssl",
		label: "SSL",
		icon: Lock
	},
	{
		key: "amc",
		label: "AMC",
		icon: Wrench
	},
	{
		key: "monitoring",
		label: "Monitoring",
		icon: Activity
	}
];
var RANGES = [
	{
		key: "30",
		label: "Next 30 days"
	},
	{
		key: "60",
		label: "Next 60 days"
	},
	{
		key: "90",
		label: "Next 90 days"
	},
	{
		key: "365",
		label: "Next 12 months"
	}
];
function Page() {
	const [range, setRange] = (0, import_react.useState)("90");
	const { data: rows = [], isLoading, refetch, isFetching } = useQuery({
		queryKey: ["module_records", "infra-all"],
		queryFn: async () => {
			const { data, error } = await supabase.from("module_records").select("id, module, title, subtitle, status, amount_inr, due_at, tags, metadata, created_at").in("module", MODULES.map((m) => m.key)).order("due_at", {
				ascending: true,
				nullsFirst: false
			});
			if (error) throw error;
			return data ?? [];
		}
	});
	const now = Date.now();
	const horizon = now + Number(range) * 864e5;
	const byModule = (0, import_react.useMemo)(() => {
		const map = {};
		for (const m of MODULES) map[m.key] = [];
		for (const r of rows) if (map[r.module]) map[r.module].push(r);
		return map;
	}, [rows]);
	const totalSpend = rows.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0);
	const expiring = rows.filter((r) => r.due_at && new Date(r.due_at).getTime() <= horizon && new Date(r.due_at).getTime() >= now);
	const overdue = rows.filter((r) => r.due_at && new Date(r.due_at).getTime() < now);
	const atRisk = rows.filter((r) => [
		"degraded",
		"down",
		"expired",
		"pending_renewal"
	].includes(r.status));
	const serverAvg = (k) => {
		const s = byModule.servers ?? [];
		if (s.length === 0) return 0;
		const sum = s.reduce((a, r) => a + Number(r.metadata?.[k] ?? 0), 0);
		return Math.round(sum / s.length);
	};
	const healthyPct = (() => {
		const s = byModule.servers ?? [];
		if (s.length === 0) return 0;
		return Math.round(s.filter((r) => r.status === "healthy").length / s.length * 1e3) / 10;
	})();
	function exportAllCsv() {
		downloadCsv([[
			"module",
			"title",
			"status",
			"amount_inr",
			"due_at",
			"tags",
			"created_at"
		], ...rows.map((r) => [
			r.module,
			r.title,
			r.status,
			r.amount_inr ?? "",
			r.due_at ?? "",
			(r.tags ?? []).join("|"),
			r.created_at
		])], `infrastructure-report-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
	}
	function exportExpiringCsv() {
		downloadCsv([[
			"module",
			"title",
			"status",
			"amount_inr",
			"due_at",
			"days_left"
		], ...expiring.map((r) => {
			const daysLeft = Math.max(0, Math.round((new Date(r.due_at).getTime() - now) / 864e5));
			return [
				r.module,
				r.title,
				r.status,
				r.amount_inr ?? "",
				r.due_at,
				daysLeft
			];
		})], `infra-expiring-${range}d.csv`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 min-w-0 max-w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-6 w-6 text-white" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold",
						children: "Infrastructure reports"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1 max-w-2xl",
						children: "Unified view across servers, hosting, domains, SSL certificates, AMC contracts and monitoring."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: range,
							onValueChange: setRange,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-full sm:w-[180px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: RANGES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: r.key,
								children: r.label
							}, r.key)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => refetch(),
							disabled: isFetching,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-2 " + (isFetching ? "animate-spin" : "") }), " Refresh"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: exportExpiringCsv,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), " Expiring CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "bg-gradient-brand text-white",
							onClick: exportAllCsv,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), " Full CSV"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Server,
						label: "Infra assets",
						value: String(rows.length),
						sub: "tracked records"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: IndianRupee,
						label: "Portfolio value",
						value: formatINR(totalSpend),
						sub: "incl. AMC + recurring",
						tone: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: CalendarClock,
						label: `Expiring ≤ ${range}d`,
						value: String(expiring.length),
						sub: `${overdue.length} already overdue`,
						tone: "saffron"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: TriangleAlert,
						label: "At-risk records",
						value: String(atRisk.length),
						sub: "degraded / expired / renewal",
						tone: "green"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: MODULES.map((m) => {
					const list = byModule[m.key] ?? [];
					const value = list.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0);
					const active = list.filter((r) => ["active", "healthy"].includes(r.status)).length;
					const risk = list.filter((r) => [
						"expired",
						"pending_renewal",
						"degraded",
						"down"
					].includes(r.status)).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-2xl p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-10 w-10 rounded-xl bg-secondary flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.icon, { className: "h-5 w-5 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: m.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [list.length, " records"]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-emerald-500/10 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Active"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-emerald-600",
										children: active
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-amber-500/10 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Risk"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-amber-600",
										children: risk
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-primary/10 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Value"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-primary text-xs",
										children: formatINR(value)
									})]
								})
							]
						})]
					}, m.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-sm",
							children: "Server fleet health"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Healthy nodes",
								value: `${healthyPct}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Avg CPU",
								value: `${serverAvg("cpu_pct")}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Avg Memory",
								value: `${serverAvg("mem_pct")}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Avg Disk",
								value: `${serverAvg("disk_pct")}%`
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm",
								children: "Upcoming renewals"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: [
								expiring.length,
								" in ",
								range,
								"d"
							]
						})]
					}), expiring.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground py-6 text-center",
						children: "Nothing expiring in this window. 🎉"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 max-h-72 overflow-y-auto",
						children: expiring.slice(0, 12).map((r) => {
							const days = Math.max(0, Math.round((new Date(r.due_at).getTime() - now) / 864e5));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium truncate",
										children: r.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground capitalize",
										children: [
											r.module,
											" · ",
											r.status
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right shrink-0 ml-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs",
										children: new Date(r.due_at).toLocaleDateString("en-IN")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: days <= 7 ? "bg-rose-500/15 text-rose-600 border-rose-500/30" : days <= 30 ? "bg-amber-500/15 text-amber-600 border-amber-500/30" : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
										children: [days, "d"]
									})]
								})]
							}, r.id);
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-4 sm:p-5 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold text-sm",
							children: "All infrastructure records"
						}), isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Loading…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "min-w-[680px] w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-xs uppercase text-muted-foreground border-b border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left py-2 px-2",
										children: "Module"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left py-2 px-2",
										children: "Title"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left py-2 px-2",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right py-2 px-2",
										children: "Value"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left py-2 px-2",
										children: "Due"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "py-8 text-center text-sm text-muted-foreground",
								children: "No infrastructure records yet."
							}) }) : rows.slice(0, 50).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 capitalize",
										children: r.module
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 break-words",
										children: r.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: r.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 text-right tabular-nums",
										children: r.amount_inr ? formatINR(Number(r.amount_inr)) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2",
										children: r.due_at ? new Date(r.due_at).toLocaleDateString("en-IN") : "—"
									})
								]
							}, r.id)) })]
						})
					}),
					rows.length > 50 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground mt-2",
						children: [
							"Showing 50 of ",
							rows.length,
							" — export CSV for full report."
						]
					})
				]
			})
		]
	});
}
function Kpi({ icon: Icon, label, value, sub, tone }) {
	const bg = tone === "green" ? "bg-gradient-green" : tone === "saffron" ? "bg-gradient-saffron" : tone === "brand" ? "bg-gradient-brand" : "bg-secondary";
	const cls = tone ? "text-white" : "text-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-2xl p-4 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-10 w-10 rounded-xl ${bg} flex items-center justify-center shrink-0`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-5 w-5 ${cls}` })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] uppercase tracking-wider text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-lg font-bold truncate",
					children: value
				}),
				sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted-foreground truncate",
					children: sub
				})
			]
		})]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-secondary/50 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-lg font-bold",
			children: value
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Infrastructure Reports",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
