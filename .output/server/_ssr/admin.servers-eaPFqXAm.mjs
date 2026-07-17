import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Et as LoaderCircle, Ht as HardDrive, U as Search, V as Server, Z as RefreshCw, _n as Cpu, b as Trash2, er as Activity, fn as Download, n as Zap, ot as Pencil, rt as Plus } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as downloadCsv } from "./download-DhKjMGgD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.servers-eaPFqXAm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"healthy",
	"degraded",
	"down",
	"maintenance",
	"provisioning"
];
function empty() {
	return {
		hostname: "",
		ip: "",
		region: "",
		role: "Web · Nginx",
		provider: "AWS",
		os: "Ubuntu 22.04 LTS",
		owner: "",
		status: "healthy",
		cpu_pct: "0",
		mem_pct: "0",
		disk_pct: "0",
		uptime_days: "0",
		monthly_cost_inr: "",
		renewal_date: "",
		notes: ""
	};
}
function tone(v) {
	return v > 85 ? "bg-destructive" : v > 65 ? "bg-amber-500" : "bg-emerald-500";
}
function bar(v) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 rounded-full bg-secondary overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full " + tone(v),
			style: { width: Math.max(0, Math.min(100, v)) + "%" }
		})
	});
}
function statusBadge(s) {
	return {
		healthy: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
		degraded: "bg-amber-500/15 text-amber-600 border-amber-500/30",
		down: "bg-rose-500/15 text-rose-600 border-rose-500/30",
		maintenance: "bg-primary/15 text-primary border-primary/30",
		provisioning: "bg-blue-500/15 text-blue-600 border-blue-500/30"
	}[s] ?? "bg-muted";
}
function Page() {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(empty);
	const { data: rows = [], isLoading, refetch, isFetching } = useQuery({
		queryKey: ["module_records", "servers"],
		queryFn: async () => {
			const { data, error } = await supabase.from("module_records").select("*").eq("module", "servers").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return rows.filter((r) => {
			if (statusFilter !== "all" && r.status !== statusFilter) return false;
			if (!q) return true;
			const m = r.metadata ?? {};
			return r.title.toLowerCase().includes(q) || m.hostname?.toLowerCase().includes(q) || m.ip?.toLowerCase().includes(q) || m.region?.toLowerCase().includes(q);
		});
	}, [
		rows,
		search,
		statusFilter
	]);
	const stats = (0, import_react.useMemo)(() => {
		if (rows.length === 0) return {
			total: 0,
			healthy: 0,
			cpu: 0,
			disk: 0,
			mem: 0,
			uptimePct: 0
		};
		const healthy = rows.filter((r) => r.status === "healthy").length;
		const avg = (k) => rows.reduce((s, r) => s + Number(r.metadata?.[k] ?? 0), 0) / rows.length;
		return {
			total: rows.length,
			healthy,
			cpu: Math.round(avg("cpu_pct")),
			mem: Math.round(avg("mem_pct")),
			disk: Math.round(avg("disk_pct")),
			uptimePct: rows.length ? Math.round(healthy / rows.length * 1e3) / 10 : 0
		};
	}, [rows]);
	const upsert = useMutation({
		mutationFn: async (f) => {
			const metadata = {
				hostname: f.hostname,
				ip: f.ip,
				region: f.region,
				role: f.role,
				provider: f.provider,
				os: f.os,
				owner: f.owner,
				cpu_pct: Number(f.cpu_pct) || 0,
				mem_pct: Number(f.mem_pct) || 0,
				disk_pct: Number(f.disk_pct) || 0,
				uptime_days: Number(f.uptime_days) || 0,
				notes: f.notes
			};
			const payload = {
				module: "servers",
				title: f.hostname.trim() || "server",
				subtitle: `${f.role} · ${f.region}`,
				status: f.status,
				amount_inr: f.monthly_cost_inr ? Number(f.monthly_cost_inr) : 0,
				due_at: f.renewal_date ? new Date(f.renewal_date).toISOString() : null,
				tags: [f.provider, f.region].filter(Boolean),
				metadata
			};
			if (f.id) {
				const { error } = await supabase.from("module_records").update(payload).eq("id", f.id);
				if (error) throw error;
				await logAudit({
					action: "update",
					resource: "settings",
					resource_id: f.id,
					details: {
						module: "servers",
						host: f.hostname
					}
				});
			} else {
				const { error } = await supabase.from("module_records").insert(payload);
				if (error) throw error;
				await logAudit({
					action: "create",
					resource: "settings",
					details: {
						module: "servers",
						host: f.hostname
					}
				});
			}
		},
		onSuccess: () => {
			toast.success(form.id ? "Server updated" : "Server added");
			setOpen(false);
			setForm(empty());
			qc.invalidateQueries({ queryKey: ["module_records", "servers"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("module_records").delete().eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "delete",
				resource: "settings",
				resource_id: id,
				details: { module: "servers" }
			});
		},
		onSuccess: () => {
			toast.success("Server removed");
			qc.invalidateQueries({ queryKey: ["module_records", "servers"] });
		},
		onError: (e) => toast.error(e.message)
	});
	function openEdit(r) {
		const m = r.metadata ?? {};
		setForm({
			id: r.id,
			hostname: m.hostname ?? r.title,
			ip: m.ip ?? "",
			region: m.region ?? "",
			role: m.role ?? "",
			provider: m.provider ?? "",
			os: m.os ?? "",
			owner: m.owner ?? "",
			status: r.status,
			cpu_pct: String(m.cpu_pct ?? 0),
			mem_pct: String(m.mem_pct ?? 0),
			disk_pct: String(m.disk_pct ?? 0),
			uptime_days: String(m.uptime_days ?? 0),
			monthly_cost_inr: r.amount_inr != null ? String(r.amount_inr) : "",
			renewal_date: r.due_at ? r.due_at.slice(0, 10) : "",
			notes: m.notes ?? ""
		});
		setOpen(true);
	}
	function exportCsv() {
		downloadCsv([[
			"hostname",
			"ip",
			"region",
			"role",
			"provider",
			"os",
			"status",
			"cpu_%",
			"mem_%",
			"disk_%",
			"uptime_days",
			"monthly_cost_inr",
			"renewal_date"
		], ...filtered.map((r) => {
			const m = r.metadata ?? {};
			return [
				m.hostname ?? r.title,
				m.ip ?? "",
				m.region ?? "",
				m.role ?? "",
				m.provider ?? "",
				m.os ?? "",
				r.status,
				m.cpu_pct ?? "",
				m.mem_pct ?? "",
				m.disk_pct ?? "",
				m.uptime_days ?? "",
				r.amount_inr ?? "",
				r.due_at ? r.due_at.slice(0, 10) : ""
			];
		})], "servers.csv");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-6 w-6" }), " Server fleet"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Register and monitor infrastructure across regions and providers."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => refetch(),
							disabled: isFetching,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-2 " + (isFetching ? "animate-spin" : "") }), " Refresh"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: exportCsv,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), " Export CSV"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "bg-gradient-brand text-white",
							onClick: () => {
								setForm(empty());
								setOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), " Add server"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Server,
						label: "Total nodes",
						value: String(stats.total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Activity,
						label: "Healthy",
						value: `${stats.healthy}/${stats.total}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Cpu,
						label: "Avg CPU",
						value: `${stats.cpu}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: HardDrive,
						label: "Avg Disk",
						value: `${stats.disk}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: Zap,
						label: "Fleet uptime",
						value: `${stats.uptimePct}%`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-4 space-y-4 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "pl-9",
							placeholder: "Search hostname, IP, region…",
							value: search,
							onChange: (e) => setSearch(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-full sm:w-[180px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s))] })]
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin inline mr-2" }), " Loading…"]
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: [
						"No servers registered yet. Click ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Add server" }),
						" to register your first node."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-[820px] w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs uppercase text-muted-foreground border-b border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2",
									children: "Node"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2",
									children: "Role"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2 w-36",
									children: "CPU"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2 w-36",
									children: "Memory"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2 w-36",
									children: "Disk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right py-2 px-2",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((r) => {
							const m = r.metadata ?? {};
							const cpu = Number(m.cpu_pct ?? 0), mem = Number(m.mem_pct ?? 0), disk = Number(m.disk_pct ?? 0);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/50 hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-2 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-xs break-all",
											children: m.hostname ?? r.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground break-all",
											children: [
												m.region ?? "",
												" · ",
												m.provider ?? "",
												" · ",
												m.ip ?? ""
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-3",
										children: m.role ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-2 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs mb-1",
											children: [cpu, "%"]
										}), bar(cpu)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-2 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs mb-1",
											children: [mem, "%"]
										}), bar(mem)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-2 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs mb-1",
											children: [disk, "%"]
										}), bar(disk)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: statusBadge(r.status),
											children: r.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-2 py-3 text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => openEdit(r),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => {
												if (confirm(`Delete server "${m.hostname ?? r.title}"?`)) remove.mutate(r.id);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
										})]
									})
								]
							}, r.id);
						}) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Edit server" : "Register server" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 md:grid-cols-2 mt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Hostname",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.hostname,
										onChange: (e) => setForm({
											...form,
											hostname: e.target.value
										}),
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "IP address",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.ip,
										onChange: (e) => setForm({
											...form,
											ip: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Region",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.region,
										onChange: (e) => setForm({
											...form,
											region: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Provider",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.provider,
										onChange: (e) => setForm({
											...form,
											provider: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Role",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.role,
										onChange: (e) => setForm({
											...form,
											role: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Operating system",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.os,
										onChange: (e) => setForm({
											...form,
											os: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Owner / team",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.owner,
										onChange: (e) => setForm({
											...form,
											owner: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Status",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.status,
										onValueChange: (v) => setForm({
											...form,
											status: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: s,
											children: s
										}, s)) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "CPU %",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										max: 100,
										value: form.cpu_pct,
										onChange: (e) => setForm({
											...form,
											cpu_pct: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Memory %",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										max: 100,
										value: form.mem_pct,
										onChange: (e) => setForm({
											...form,
											mem_pct: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Disk %",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										max: 100,
										value: form.disk_pct,
										onChange: (e) => setForm({
											...form,
											disk_pct: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Uptime (days)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										value: form.uptime_days,
										onChange: (e) => setForm({
											...form,
											uptime_days: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Monthly cost (INR)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										step: "0.01",
										value: form.monthly_cost_inr,
										onChange: (e) => setForm({
											...form,
											monthly_cost_inr: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Renewal date",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: form.renewal_date,
										onChange: (e) => setForm({
											...form,
											renewal_date: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Notes",
									span2: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										value: form.notes,
										onChange: (e) => setForm({
											...form,
											notes: e.target.value
										})
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => upsert.mutate(form),
							disabled: upsert.isPending || !form.hostname.trim(),
							children: [upsert.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }), form.id ? "Save changes" : "Add server"]
						})] })
					]
				})
			})
		]
	});
}
function F({ label, span2, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: span2 ? "md:col-span-2" : "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground",
			children: label
		}), children]
	});
}
function Kpi({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-2xl p-4 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-white" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] uppercase tracking-wider text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-lg font-bold truncate",
				children: value
			})]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Servers",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
