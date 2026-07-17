import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { An as ChevronRight, S as Ticket, Sn as Clock, U as Search, _ as TriangleAlert, fn as Download, rt as Plus } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as downloadCsv } from "./download-DhKjMGgD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.tickets.index-CJblPPtQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"open",
	"in_progress",
	"waiting",
	"resolved",
	"closed"
];
function TicketsPage() {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [deptFilter, setDeptFilter] = (0, import_react.useState)("all");
	const [prioFilter, setPrioFilter] = (0, import_react.useState)("all");
	const [creating, setCreating] = (0, import_react.useState)(null);
	const { data: depts = [] } = useQuery({
		queryKey: ["ticket_departments"],
		queryFn: async () => (await supabase.from("ticket_departments").select("slug,name,active").eq("active", true).order("sort_order")).data ?? []
	});
	const { data: prios = [] } = useQuery({
		queryKey: ["ticket_priorities"],
		queryFn: async () => (await supabase.from("ticket_priorities").select("slug,name,color,active").eq("active", true).order("sort_order")).data ?? []
	});
	const { data: tickets = [], isLoading } = useQuery({
		queryKey: ["tickets"],
		queryFn: async () => {
			const { data, error } = await supabase.from("tickets").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const filtered = (0, import_react.useMemo)(() => tickets.filter((t) => {
		if (filter !== "all" && t.status !== filter) return false;
		if (deptFilter !== "all" && t.department !== deptFilter) return false;
		if (prioFilter !== "all" && t.priority !== prioFilter) return false;
		return !query || t.subject.toLowerCase().includes(query.toLowerCase()) || t.ticket_number.toLowerCase().includes(query.toLowerCase());
	}), [
		tickets,
		filter,
		deptFilter,
		prioFilter,
		query
	]);
	const priosBySlug = (0, import_react.useMemo)(() => Object.fromEntries(prios.map((p) => [p.slug, p])), [prios]);
	const setStatus = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("tickets").update({ status }).eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "status.change",
				resource: "tickets",
				resource_id: id,
				details: { status }
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["tickets"] });
			toast.success("Updated");
		},
		onError: (e) => toast.error(e.message)
	});
	const setPriority = useMutation({
		mutationFn: async ({ id, priority }) => {
			const { error } = await supabase.from("tickets").update({ priority }).eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "update",
				resource: "tickets",
				resource_id: id,
				details: { priority }
			});
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
		onError: (e) => toast.error(e.message)
	});
	const create = useMutation({
		mutationFn: async (p) => {
			const { data: user } = await supabase.auth.getUser();
			const { data, error } = await supabase.from("tickets").insert({
				...p,
				customer_id: user.user.id
			}).select("id").single();
			if (error) throw error;
			await logAudit({
				action: "create",
				resource: "tickets",
				resource_id: data?.id,
				details: { subject: p.subject }
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["tickets"] });
			setCreating(null);
			toast.success("Ticket created");
		},
		onError: (e) => toast.error(e.message)
	});
	const exportCsv = () => {
		downloadCsv([[
			"Ticket",
			"Subject",
			"Department",
			"Priority",
			"Status",
			"Created",
			"SLA Due",
			"First Response",
			"Resolved"
		], ...filtered.map((t) => [
			t.ticket_number,
			t.subject,
			t.department,
			t.priority,
			t.status,
			t.created_at,
			t.sla_due_at ?? "",
			t.first_response_at ?? "",
			t.resolved_at ?? ""
		])], `tickets-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
		logAudit({
			action: "export",
			resource: "tickets",
			details: { count: filtered.length }
		});
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			open: tickets.filter((t) => !["resolved", "closed"].includes(t.status)).length,
			breached: tickets.filter((t) => t.sla_due_at && !["resolved", "closed"].includes(t.status) && new Date(t.sla_due_at) < /* @__PURE__ */ new Date()).length,
			dueSoon: tickets.filter((t) => t.sla_due_at && !["resolved", "closed"].includes(t.status) && new Date(t.sla_due_at) >= /* @__PURE__ */ new Date() && new Date(t.sla_due_at).getTime() - Date.now() < 36e5).length
		};
	}, [tickets]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between flex-wrap gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "hover:text-foreground",
						children: "Dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tickets" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-6 w-6 text-primary" }), " Support Tickets"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: exportCsv,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1.5" }), " Export CSV"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/ticket-workflows",
							children: "Workflows"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "bg-gradient-brand text-white",
						onClick: () => setCreating({
							subject: "",
							description: "",
							department: depts[0]?.slug ?? "support",
							priority: prios[1]?.slug ?? "medium"
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1.5" }), " New ticket"]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Open",
					value: stats.open,
					icon: Ticket
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "SLA due within 1h",
					value: stats.dueSoon,
					icon: Clock,
					accent: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "SLA breached",
					value: stats.breached,
					icon: TriangleAlert,
					accent: "destructive"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 p-4 border-b border-border flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search subject or ID…",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							className: "pl-9 h-9 w-72"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: filter,
						onValueChange: setFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-[150px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							className: "capitalize",
							children: s.replace("_", " ")
						}, s))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: deptFilter,
						onValueChange: setDeptFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-[150px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All departments"
						}), depts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: d.slug,
							children: d.name
						}, d.slug))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: prioFilter,
						onValueChange: setPrioFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-[140px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All priorities"
						}), prios.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: p.slug,
							children: p.name
						}, p.slug))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground sm:ml-auto",
						children: [
							filtered.length,
							" of ",
							tickets.length
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "min-w-[860px] w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Ticket"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Department"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Priority"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "SLA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Created"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border",
						children: [
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "p-10 text-center text-muted-foreground",
								children: "Loading…"
							}) }),
							!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "p-10 text-center text-muted-foreground",
								children: "No tickets match."
							}) }),
							filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-secondary/30 cursor-pointer",
								onClick: (e) => {
									if (e.target.closest("[data-no-nav]")) return;
									navigate({
										to: "/admin/tickets/$id",
										params: { id: t.id }
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-5 py-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono text-xs text-muted-foreground break-all",
												children: t.ticket_number
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium hover:text-primary break-words",
												children: t.subject
											}),
											t.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground line-clamp-1 max-w-md",
												children: t.description
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3 text-xs uppercase text-muted-foreground",
										children: t.department
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3",
										"data-no-nav": true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: t.priority,
											onValueChange: (v) => setPriority.mutate({
												id: t.id,
												priority: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-8 w-[130px] capitalize",
												style: { color: priosBySlug[t.priority]?.color },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: prios.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: p.slug,
												children: p.name
											}, p.slug)) })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3",
										"data-no-nav": true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: t.status,
											onValueChange: (v) => setStatus.mutate({
												id: t.id,
												status: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-8 w-[140px] capitalize",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: s,
												className: "capitalize",
												children: s.replace("_", " ")
											}, s)) })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlaBadge, { t })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3 text-xs text-muted-foreground",
										children: new Date(t.created_at).toLocaleString("en-IN")
									})
								]
							}, t.id))
						]
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!creating,
			onOpenChange: (v) => !v && setCreating(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New ticket" }) }), creating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					create.mutate(creating);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: creating.subject,
						onChange: (e) => setCreating({
							...creating,
							subject: e.target.value
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 4,
						value: creating.description,
						onChange: (e) => setCreating({
							...creating,
							description: e.target.value
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Department" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: creating.department,
							onValueChange: (v) => setCreating({
								...creating,
								department: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: depts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: d.slug,
								children: d.name
							}, d.slug)) })]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: creating.priority,
							onValueChange: (v) => setCreating({
								...creating,
								priority: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: prios.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: p.slug,
								children: p.name
							}, p.slug)) })]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => setCreating(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "bg-gradient-brand text-white",
						disabled: create.isPending,
						children: "Create"
					})] })
				]
			})] })
		})
	] });
}
function StatCard({ label, value, icon: Icon, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-10 w-10 rounded-xl flex items-center justify-center", accent === "destructive" ? "bg-destructive/10 text-destructive" : accent === "warning" ? "bg-[color:var(--warning)]/10 text-[color:var(--warning)]" : "bg-primary/10 text-primary"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-2xl font-bold",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		})] })]
	});
}
function SlaBadge({ t }) {
	if (!t.sla_due_at) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted-foreground",
		children: "—"
	});
	if (t.status === "resolved" || t.status === "closed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-accent",
		children: "Met"
	});
	const diff = new Date(t.sla_due_at).getTime() - Date.now();
	if (diff < 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs font-semibold text-destructive",
		children: "Breached"
	});
	const h = Math.floor(diff / 36e5);
	const m = Math.floor(diff % 36e5 / 6e4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("text-xs font-medium", diff < 36e5 ? "text-[color:var(--warning)]" : "text-muted-foreground"),
		children: [
			h,
			"h ",
			m,
			"m left"
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Tickets",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketsPage, {})
});
//#endregion
export { SplitComponent as component };
