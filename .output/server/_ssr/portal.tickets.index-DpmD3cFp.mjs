import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Et as LoaderCircle, S as Ticket, Sn as Clock, U as Search, Zn as ArrowLeft, _ as TriangleAlert, rt as Plus } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-CiapfthD.mjs";
import { a as notifyTicketCreated } from "./alerts.functions-BIA4cKEy.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.tickets.index-DpmD3cFp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TicketsPage() {
	const { user, loading } = useAuth();
	const notifyTicket = useServerFn(notifyTicketCreated);
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [subject, setSubject] = (0, import_react.useState)("");
	const [department, setDepartment] = (0, import_react.useState)("support");
	const [priority, setPriority] = (0, import_react.useState)("medium");
	const [description, setDescription] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	const { data: depts = [] } = useQuery({
		queryKey: ["public-ticket-departments"],
		enabled: !!user,
		queryFn: async () => (await supabase.from("ticket_departments").select("slug,name").eq("active", true).order("sort_order")).data ?? []
	});
	const { data: prios = [] } = useQuery({
		queryKey: ["public-ticket-priorities"],
		enabled: !!user,
		queryFn: async () => (await supabase.from("ticket_priorities").select("slug,name,color").eq("active", true).order("sort_order")).data ?? []
	});
	(0, import_react.useEffect)(() => {
		if (depts.length && !depts.find((d) => d.slug === department)) setDepartment(depts[0].slug);
	}, [depts, department]);
	(0, import_react.useEffect)(() => {
		if (prios.length && !prios.find((p) => p.slug === priority)) setPriority(prios[Math.floor(prios.length / 2)]?.slug ?? prios[0].slug);
	}, [prios, priority]);
	const { data: tickets = [] } = useQuery({
		queryKey: ["my-tickets", user?.id],
		enabled: !!user,
		queryFn: async () => (await supabase.from("tickets").select("*").eq("customer_id", user.id).order("created_at", { ascending: false })).data ?? []
	});
	const filtered = (0, import_react.useMemo)(() => tickets.filter((t) => {
		if (statusFilter !== "all" && t.status !== statusFilter) return false;
		return !q || t.subject.toLowerCase().includes(q.toLowerCase()) || t.ticket_number.toLowerCase().includes(q.toLowerCase());
	}), [
		tickets,
		statusFilter,
		q
	]);
	const priosBySlug = (0, import_react.useMemo)(() => Object.fromEntries(prios.map((p) => [p.slug, p])), [prios]);
	const create = useMutation({
		mutationFn: async () => {
			if (!subject.trim()) throw new Error("Subject required");
			const { error, data } = await supabase.from("tickets").insert({
				customer_id: user.id,
				subject,
				description,
				department,
				priority,
				status: "open"
			}).select("id").single();
			if (error) throw error;
			notifyTicket({ data: { ticket_id: data.id } }).catch(() => void 0);
			return data;
		},
		onSuccess: () => {
			toast.success("Ticket submitted — our team will respond soon");
			setOpen(false);
			setSubject("");
			setDescription("");
			qc.invalidateQueries({ queryKey: ["my-tickets"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to submit")
	});
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" })
	});
	const stats = {
		open: tickets.filter((t) => !["resolved", "closed"].includes(t.status)).length,
		resolved: tickets.filter((t) => ["resolved", "closed"].includes(t.status)).length,
		total: tickets.length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-secondary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "h-16 border-b border-border bg-background/85 backdrop-blur sticky top-0 z-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-5xl h-full px-4 flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/portal",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "Support tickets"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: "Get help from our team"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "bg-gradient-brand text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " New ticket"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New support ticket" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: subject,
										onChange: (e) => setSubject(e.target.value),
										placeholder: "Short summary"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Department" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: department,
											onValueChange: setDepartment,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: depts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: d.slug,
												children: d.name
											}, d.slug)) })]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: priority,
											onValueChange: setPriority,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: prios.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: p.slug,
												children: p.name
											}, p.slug)) })]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Describe the issue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 5,
										value: description,
										onChange: (e) => setDescription(e.target.value)
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-gradient-brand text-white",
								onClick: () => create.mutate(),
								disabled: create.isPending,
								children: create.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Submit ticket"
							})] })
						] })]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-5xl px-4 py-8 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						label: "Total tickets",
						value: stats.total
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						label: "Open",
						value: stats.open,
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						label: "Resolved",
						value: stats.resolved,
						accent: "success"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 p-4 border-b border-border flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 min-w-[200px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search…",
							value: q,
							onChange: (e) => setQ(e.target.value),
							className: "pl-9 h-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-[150px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}), [
							"open",
							"in_progress",
							"waiting",
							"resolved",
							"closed"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							className: "capitalize",
							children: s.replace("_", " ")
						}, s))] })]
					})]
				}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-10 w-10 mx-auto text-muted-foreground/50 mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: "No tickets yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "Open a ticket and our team will respond shortly."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/portal/tickets/$id",
						params: { id: t.id },
						className: "block p-4 hover:bg-secondary/40 transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium truncate",
										children: t.subject
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground font-mono mt-0.5",
										children: [
											t.ticket_number,
											" · ",
											t.department,
											" · ",
											new Date(t.created_at).toLocaleDateString("en-IN")
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityPill, {
									p: t.priority,
									color: priosBySlug[t.priority]?.color
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: t.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalSla, { t })
							]
						})
					}, t.id))
				})]
			})]
		})]
	});
}
function MiniStat({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("text-2xl font-bold", accent === "warning" ? "text-[color:var(--warning)]" : accent === "success" ? "text-accent" : ""),
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		})]
	});
}
function StatusPill({ s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("text-[10px] rounded-full px-2 py-0.5 font-semibold capitalize", {
			open: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
			in_progress: "bg-primary/15 text-primary",
			waiting: "bg-secondary text-muted-foreground",
			resolved: "bg-accent/15 text-accent",
			closed: "bg-secondary text-muted-foreground"
		}[s] || "bg-secondary text-muted-foreground"),
		children: s.replace("_", " ")
	});
}
function PriorityPill({ p, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "border-0 text-[10px] capitalize",
		style: color ? {
			background: `${color}20`,
			color
		} : void 0,
		children: p
	});
}
function PortalSla({ t }) {
	if (!t.sla_due_at || t.resolved_at) return null;
	const diff = new Date(t.sla_due_at).getTime() - Date.now();
	if (diff < 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "text-[10px] font-semibold text-destructive flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), " Overdue"]
	});
	if (diff < 36e5) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "text-[10px] font-medium text-[color:var(--warning)] flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Due soon"]
	});
	return null;
}
//#endregion
export { TicketsPage as component };
