import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Fn as ChartColumn, Lt as IndianRupee, Rn as Calendar, S as Ticket, dt as Package, fn as Download, o as Wallet, u as Users, v as TrendingUp } from "../_libs/lucide-react.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { n as downloadCsv } from "./download-DhKjMGgD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reports-DxSinKNd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRESETS = [
	{
		value: "7",
		label: "Last 7 days"
	},
	{
		value: "30",
		label: "Last 30 days"
	},
	{
		value: "90",
		label: "Last 90 days"
	},
	{
		value: "365",
		label: "Last 12 months"
	},
	{
		value: "all",
		label: "All time"
	},
	{
		value: "custom",
		label: "Custom range"
	}
];
function toISODate(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function ReportsPage() {
	const [preset, setPreset] = (0, import_react.useState)("30");
	const today = /* @__PURE__ */ new Date();
	const defaultFrom = /* @__PURE__ */ new Date();
	defaultFrom.setDate(today.getDate() - 30);
	const [fromStr, setFromStr] = (0, import_react.useState)(toISODate(defaultFrom));
	const [toStr, setToStr] = (0, import_react.useState)(toISODate(today));
	const { from, to } = (0, import_react.useMemo)(() => {
		if (preset === "custom") return {
			from: /* @__PURE__ */ new Date(fromStr + "T00:00:00"),
			to: /* @__PURE__ */ new Date(toStr + "T23:59:59")
		};
		if (preset === "all") return {
			from: /* @__PURE__ */ new Date(0),
			to: /* @__PURE__ */ new Date()
		};
		const days = Number(preset);
		const f = /* @__PURE__ */ new Date();
		f.setDate(f.getDate() - days);
		f.setHours(0, 0, 0, 0);
		return {
			from: f,
			to: /* @__PURE__ */ new Date()
		};
	}, [
		preset,
		fromStr,
		toStr
	]);
	const { data: orders = [], isLoading, refetch, isFetching } = useQuery({
		queryKey: ["report-orders"],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("id,total_inr,gst_inr,status,product_name,product_id,created_at,paid_at,customer_id").order("created_at", { ascending: false }).limit(5e3);
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: subs = [] } = useQuery({
		queryKey: ["report-subs"],
		queryFn: async () => {
			const { data, error } = await supabase.from("subscriptions").select("id,amount_inr,status,plan,billing_cycle").limit(5e3);
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: tickets = [] } = useQuery({
		queryKey: ["report-tickets"],
		queryFn: async () => {
			const { data, error } = await supabase.from("tickets").select("id,status,priority,subject,created_at").limit(5e3);
			if (error) throw error;
			return data ?? [];
		}
	});
	const scopedOrders = (0, import_react.useMemo)(() => orders.filter((o) => {
		const d = new Date(o.paid_at ?? o.created_at);
		return d >= from && d <= to;
	}), [
		orders,
		from,
		to
	]);
	const scopedTickets = (0, import_react.useMemo)(() => tickets.filter((t) => {
		const d = new Date(t.created_at);
		return d >= from && d <= to;
	}), [
		tickets,
		from,
		to
	]);
	const paidOrders = scopedOrders.filter((o) => o.status === "paid");
	const revenue = paidOrders.reduce((s, o) => s + Number(o.total_inr ?? 0), 0);
	const gstCollected = paidOrders.reduce((s, o) => s + Number(o.gst_inr ?? 0), 0);
	const pending = scopedOrders.filter((o) => o.status === "pending").length;
	const activeSubs = subs.filter((s) => s.status === "active").length;
	const mrr = subs.filter((s) => s.status === "active" && (s.billing_cycle === "monthly" || s.billing_cycle === "mo")).reduce((s, x) => s + Number(x.amount_inr ?? 0), 0);
	const arr = subs.filter((s) => s.status === "active" && (s.billing_cycle === "yearly" || s.billing_cycle === "yr")).reduce((s, x) => s + Number(x.amount_inr ?? 0), 0);
	const openTickets = scopedTickets.filter((t) => !["closed", "resolved"].includes(t.status)).length;
	const customerSet = new Set(scopedOrders.map((o) => o.customer_id).filter(Boolean));
	const byProduct = {};
	paidOrders.forEach((o) => {
		const k = o.product_id ?? o.product_name;
		if (!byProduct[k]) byProduct[k] = {
			name: o.product_name,
			revenue: 0,
			orders: 0
		};
		byProduct[k].revenue += Number(o.total_inr ?? 0);
		byProduct[k].orders += 1;
	});
	const topProducts = Object.values(byProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
	const rangeDays = Math.max(1, Math.round((to.getTime() - from.getTime()) / 864e5));
	const useMonthly = rangeDays > 90;
	const buckets = (0, import_react.useMemo)(() => {
		if (useMonthly) {
			const list = [];
			const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
			const end = new Date(to.getFullYear(), to.getMonth(), 1);
			while (cursor <= end) {
				list.push({
					label: cursor.toLocaleDateString("en-IN", {
						month: "short",
						year: "2-digit"
					}),
					key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
					revenue: 0,
					date: new Date(cursor)
				});
				cursor.setMonth(cursor.getMonth() + 1);
			}
			paidOrders.forEach((o) => {
				const d = new Date(o.paid_at ?? o.created_at);
				const k = `${d.getFullYear()}-${d.getMonth()}`;
				const b = list.find((x) => x.key === k);
				if (b) b.revenue += Number(o.total_inr ?? 0);
			});
			return list;
		} else {
			const list = [];
			const cursor = new Date(from);
			cursor.setHours(0, 0, 0, 0);
			const end = new Date(to);
			end.setHours(0, 0, 0, 0);
			while (cursor <= end) {
				list.push({
					label: cursor.toLocaleDateString("en-IN", {
						day: "2-digit",
						month: "short"
					}),
					key: toISODate(cursor),
					revenue: 0,
					date: new Date(cursor)
				});
				cursor.setDate(cursor.getDate() + 1);
			}
			paidOrders.forEach((o) => {
				const k = toISODate(new Date(o.paid_at ?? o.created_at));
				const b = list.find((x) => x.key === k);
				if (b) b.revenue += Number(o.total_inr ?? 0);
			});
			return list;
		}
	}, [
		paidOrders,
		from,
		to,
		useMonthly
	]);
	const maxBucket = Math.max(1, ...buckets.map((m) => m.revenue));
	const bucketTotal = buckets.reduce((s, m) => s + m.revenue, 0);
	function exportCsv() {
		const rangeLabel = preset === "custom" ? `${fromStr}_to_${toStr}` : preset === "all" ? "all-time" : `last-${preset}d`;
		downloadCsv([
			["Infiniforge Report", ""],
			["Range", `${toISODate(from)} to ${toISODate(to)}`],
			[],
			["Metric", "Value"],
			["Revenue (paid)", revenue.toFixed(2)],
			["GST collected", gstCollected.toFixed(2)],
			["Paid orders", String(paidOrders.length)],
			["Pending orders", String(pending)],
			["Active subscriptions", String(activeSubs)],
			["MRR", mrr.toFixed(2)],
			["ARR", arr.toFixed(2)],
			["Open tickets", String(openTickets)],
			["Unique customers", String(customerSet.size)],
			[],
			[useMonthly ? "Month" : "Day", "Revenue"],
			...buckets.map((b) => [b.label, b.revenue.toFixed(2)]),
			[],
			[
				"Top products",
				"Revenue",
				"Orders"
			],
			...topProducts.map((p) => [
				p.name,
				p.revenue.toFixed(2),
				String(p.orders)
			]),
			[],
			["Paid orders detail", ""],
			[
				"Order date",
				"Product",
				"Total INR",
				"GST INR"
			],
			...paidOrders.map((o) => [
				new Date(o.paid_at ?? o.created_at).toLocaleString("en-IN"),
				o.product_name,
				Number(o.total_inr).toFixed(2),
				Number(o.gst_inr).toFixed(2)
			])
		], `infiniforge-report-${rangeLabel}.csv`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 min-w-0 max-w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 sm:gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5 sm:h-6 sm:w-6 text-white" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl sm:text-2xl font-bold truncate",
							children: "Reports & Analytics"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs sm:text-sm text-muted-foreground mt-1 break-words",
							children: [
								toISODate(from),
								" → ",
								toISODate(to),
								" · ",
								rangeDays,
								" day",
								rangeDays !== 1 ? "s" : "",
								" · ",
								useMonthly ? "monthly" : "daily",
								" view"
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: preset,
							onValueChange: (v) => {
								const p = v;
								setPreset(p);
								if (p !== "custom" && p !== "all") {
									const days = Number(p);
									const f = /* @__PURE__ */ new Date();
									f.setDate(f.getDate() - days);
									setFromStr(toISODate(f));
									setToStr(toISODate(/* @__PURE__ */ new Date()));
								}
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
								className: "w-full sm:w-[170px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4 mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: p.value,
								children: p.label
							}, p.value)) })]
						}),
						preset === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: fromStr,
								max: toStr,
								onChange: (e) => setFromStr(e.target.value),
								className: "w-full sm:w-[160px]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-sm hidden sm:inline",
								children: "to"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: toStr,
								min: fromStr,
								max: toISODate(/* @__PURE__ */ new Date()),
								onChange: (e) => setToStr(e.target.value),
								className: "w-full sm:w-[160px]"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => refetch(),
							disabled: isFetching,
							children: "Refresh"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: exportCsv,
							variant: "outline",
							size: "sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), " Export CSV"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: IndianRupee,
						label: "Revenue (paid)",
						value: formatINR(revenue),
						tone: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: IndianRupee,
						label: "GST collected",
						value: formatINR(gstCollected),
						tone: "green"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Package,
						label: "Paid / Pending",
						value: `${paidOrders.length} / ${pending}`,
						tone: "saffron"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Users,
						label: "Unique customers",
						value: String(customerSet.size)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: TrendingUp,
						label: "MRR",
						value: formatINR(mrr),
						tone: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: TrendingUp,
						label: "ARR (from yearly)",
						value: formatINR(arr),
						tone: "green"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Wallet,
						label: "Active subscriptions",
						value: String(activeSubs)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Ticket,
						label: "Open tickets",
						value: String(openTickets),
						tone: "saffron"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-4 sm:p-5 lg:col-span-2 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs uppercase tracking-wider text-muted-foreground",
							children: [useMonthly ? "Monthly" : "Daily", " revenue"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-semibold",
							children: "Revenue trend"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "bg-accent/15 text-accent border-0",
							children: formatINR(bucketTotal)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end gap-1 h-40 overflow-x-auto",
						children: buckets.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-[14px] flex-1 flex flex-col items-center gap-1.5",
							title: `${m.label}: ${formatINR(m.revenue)}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full rounded-t-md bg-gradient-brand",
								style: {
									height: `${m.revenue / maxBucket * 100}%`,
									minHeight: 2
								}
							}), (buckets.length <= 20 || i % Math.ceil(buckets.length / 20) === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[9px] text-muted-foreground whitespace-nowrap",
								children: m.label
							})]
						}, i))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-4 sm:p-5 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wider text-muted-foreground mb-1",
							children: "Top products"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-semibold mb-4",
							children: "By revenue"
						}),
						isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "Loading…"
						}) : topProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "No paid orders in this range."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: topProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate pr-2",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold tabular-nums",
											children: formatINR(p.revenue)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 rounded-full bg-secondary mt-1 overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-gradient-brand",
											style: { width: `${p.revenue / topProducts[0].revenue * 100}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground mt-0.5",
										children: [
											p.orders,
											" order",
											p.orders !== 1 ? "s" : ""
										]
									})
								]
							}, p.name))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider text-muted-foreground mb-1",
						children: "Recent activity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-semibold mb-4",
						children: "Paid orders in range"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "min-w-[640px] w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-xs uppercase text-muted-foreground border-b border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left py-2 px-2",
										children: "Product"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left py-2 px-2",
										children: "Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right py-2 px-2",
										children: "Total"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right py-2 px-2",
										children: "GST"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [paidOrders.slice(0, 15).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 break-words",
										children: o.product_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-muted-foreground",
										children: new Date(o.paid_at ?? o.created_at).toLocaleDateString("en-IN")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-right tabular-nums",
										children: formatINR(Number(o.total_inr))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 px-2 text-right tabular-nums text-muted-foreground",
										children: formatINR(Number(o.gst_inr))
									})
								]
							}, o.id)), paidOrders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 4,
								className: "py-6 text-center text-muted-foreground",
								children: "No paid orders in this range."
							}) })] })]
						})
					})
				]
			})
		]
	});
}
function Kpi({ icon: Icon, label, value, tone }) {
	const bg = tone === "green" ? "bg-gradient-green" : tone === "saffron" ? "bg-gradient-saffron" : tone === "brand" ? "bg-gradient-brand" : "bg-secondary";
	const iconCls = tone ? "text-white" : "text-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-9 w-9 sm:h-10 sm:w-10 rounded-xl ${bg} flex items-center justify-center shrink-0`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 sm:h-5 sm:w-5 ${iconCls}` })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground truncate",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm sm:text-lg font-bold truncate",
				children: value
			})]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Reports & Analytics",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsPage, {})
});
//#endregion
export { SplitComponent as component };
