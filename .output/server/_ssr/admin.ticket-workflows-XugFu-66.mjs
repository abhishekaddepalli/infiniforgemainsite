import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { $t as Flag, An as ChevronRight, Bn as Building2, Et as LoaderCircle, G as Save, Jt as GitBranch, Sn as Clock, b as Trash2, i as Wrench, rt as Plus } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.ticket-workflows-XugFu-66.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"open",
	"in_progress",
	"waiting",
	"resolved",
	"closed"
];
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "hover:text-foreground",
					children: "Dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/tickets",
					className: "hover:text-foreground",
					children: "Tickets"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Workflows" })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-6 w-6 text-primary" }), " Ticket Workflows"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: "Configure departments, priorities, SLA targets, and auto-routing rules used across the admin and customer portals."
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "departments",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid grid-cols-3 max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "departments",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 mr-1.5" }), " Departments"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "priorities",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4 mr-1.5" }), " Priorities & SLA"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "routing",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "h-4 w-4 mr-1.5" }), " Routing"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "departments",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentsTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "priorities",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrioritiesTab, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "routing",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoutingTab, {})
				})
			]
		})
	] });
}
function useStaffOptions() {
	return useQuery({
		queryKey: ["ticket-workflow-staff"],
		queryFn: async () => {
			const { data: rs } = await supabase.from("user_roles").select("user_id, role").in("role", [
				"super_admin",
				"admin",
				"sales_manager",
				"support",
				"finance",
				"employee"
			]);
			const ids = [...new Set((rs ?? []).map((r) => r.user_id))];
			if (!ids.length) return [];
			const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
			return (data ?? []).map((p) => ({
				id: p.id,
				label: p.full_name ?? p.email ?? p.id
			}));
		}
	});
}
function DepartmentsTab() {
	const qc = useQueryClient();
	const { data: staff = [] } = useStaffOptions();
	const { data = [], isLoading } = useQuery({
		queryKey: ["ticket_departments"],
		queryFn: async () => (await supabase.from("ticket_departments").select("*").order("sort_order")).data ?? []
	});
	const save = useMutation({
		mutationFn: async (d) => {
			if (d.id) {
				const { id, ...rest } = d;
				const { error } = await supabase.from("ticket_departments").update({
					...rest,
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				}).eq("id", id);
				if (error) throw error;
				await logAudit({
					action: "update",
					resource: "ticket_departments",
					resource_id: id
				});
			} else {
				const { error, data: ins } = await supabase.from("ticket_departments").insert(d).select("id").single();
				if (error) throw error;
				await logAudit({
					action: "create",
					resource: "ticket_departments",
					resource_id: ins?.id
				});
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["ticket_departments"] });
			toast.success("Saved");
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("ticket_departments").delete().eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "delete",
				resource: "ticket_departments",
				resource_id: id
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["ticket_departments"] });
			toast.success("Deleted");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-semibold text-sm mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add department"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewDepartment, {
					onSave: (d) => save.mutate(d),
					staff,
					pending: save.isPending
				})]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center text-sm text-muted-foreground p-6",
				children: "Loading…"
			}),
			data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentRow, {
				dept: d,
				staff,
				onSave: (patch) => save.mutate({
					id: d.id,
					...patch
				}),
				onDelete: () => del.mutate(d.id)
			}, d.id))
		]
	});
}
function NewDepartment({ onSave, staff, pending }) {
	const [f, setF] = (0, import_react.useState)({
		slug: "",
		name: "",
		description: "",
		default_assignee: "",
		email: "",
		sort_order: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 md:grid-cols-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "slug (e.g. billing)",
				value: f.slug,
				onChange: (e) => setF({
					...f,
					slug: e.target.value.toLowerCase().replace(/\s+/g, "-")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Name",
				value: f.name,
				onChange: (e) => setF({
					...f,
					name: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Notification email",
				value: f.email,
				onChange: (e) => setF({
					...f,
					email: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: f.default_assignee || "none",
				onValueChange: (v) => setF({
					...f,
					default_assignee: v === "none" ? "" : v
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Default agent" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "none",
					children: "— none —"
				}), staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: s.id,
					children: s.label
				}, s.id))] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Description",
				value: f.description,
				onChange: (e) => setF({
					...f,
					description: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: pending || !f.slug || !f.name,
				onClick: () => {
					onSave({
						slug: f.slug,
						name: f.name,
						description: f.description || null,
						email: f.email || null,
						default_assignee: f.default_assignee || null,
						active: true,
						sort_order: f.sort_order
					});
					setF({
						slug: "",
						name: "",
						description: "",
						default_assignee: "",
						email: "",
						sort_order: 0
					});
				},
				className: "bg-gradient-brand text-white",
				children: pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " Add"] })
			})
		]
	});
}
function DepartmentRow({ dept, staff, onSave, onDelete }) {
	const [f, setF] = (0, import_react.useState)(dept);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4 grid gap-3 md:grid-cols-6 items-end",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Slug"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: f.slug,
				onChange: (e) => setF({
					...f,
					slug: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Name"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: f.name,
				onChange: (e) => setF({
					...f,
					name: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Email"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: f.email ?? "",
				onChange: (e) => setF({
					...f,
					email: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Default agent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: f.default_assignee ?? "none",
				onValueChange: (v) => setF({
					...f,
					default_assignee: v === "none" ? null : v
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "— none —" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "none",
					children: "— none —"
				}), staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: s.id,
					children: s.label
				}, s.id))] })]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Active"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: f.active,
						onCheckedChange: (v) => setF({
							...f,
							active: v
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Sort"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: f.sort_order,
						onChange: (e) => setF({
							...f,
							sort_order: Number(e.target.value) || 0
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => onSave(f),
					className: "flex-1 bg-gradient-brand text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5 mr-1" }), " Save"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: onDelete,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
				})]
			})
		]
	});
}
function PrioritiesTab() {
	const qc = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["ticket_priorities"],
		queryFn: async () => (await supabase.from("ticket_priorities").select("*").order("sort_order")).data ?? []
	});
	const save = useMutation({
		mutationFn: async (d) => {
			if (d.id) {
				const { id, ...rest } = d;
				const { error } = await supabase.from("ticket_priorities").update({
					...rest,
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				}).eq("id", id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("ticket_priorities").insert(d);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["ticket_priorities"] });
			toast.success("Saved");
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("ticket_priorities").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["ticket_priorities"] }),
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-semibold text-sm mb-2 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }), " SLA is measured in minutes"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mb-4",
						children: "Response = target time until first staff reply. Resolve = target time until the ticket is marked resolved/closed. When a ticket is created, its SLA due-at is auto-computed from the resolve target."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewPriority, {
						onSave: (d) => save.mutate(d),
						pending: save.isPending
					})
				]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center text-sm text-muted-foreground p-6",
				children: "Loading…"
			}),
			data.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityRow, {
				p,
				onSave: (patch) => save.mutate({
					id: p.id,
					...patch
				}),
				onDelete: () => del.mutate(p.id)
			}, p.id))
		]
	});
}
function NewPriority({ onSave, pending }) {
	const [f, setF] = (0, import_react.useState)({
		slug: "",
		name: "",
		color: "#3b82f6",
		sla_response_mins: 240,
		sla_resolve_mins: 1440,
		sort_order: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 md:grid-cols-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "slug",
				value: f.slug,
				onChange: (e) => setF({
					...f,
					slug: e.target.value.toLowerCase()
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Name",
				value: f.name,
				onChange: (e) => setF({
					...f,
					name: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "color",
				value: f.color,
				onChange: (e) => setF({
					...f,
					color: e.target.value
				}),
				className: "h-10 p-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				placeholder: "Response mins",
				value: f.sla_response_mins,
				onChange: (e) => setF({
					...f,
					sla_response_mins: Number(e.target.value) || 0
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				placeholder: "Resolve mins",
				value: f.sla_resolve_mins,
				onChange: (e) => setF({
					...f,
					sla_resolve_mins: Number(e.target.value) || 0
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				placeholder: "Sort",
				value: f.sort_order,
				onChange: (e) => setF({
					...f,
					sort_order: Number(e.target.value) || 0
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				disabled: pending || !f.slug || !f.name,
				onClick: () => {
					onSave({
						...f,
						active: true
					});
					setF({
						slug: "",
						name: "",
						color: "#3b82f6",
						sla_response_mins: 240,
						sla_resolve_mins: 1440,
						sort_order: 0
					});
				},
				className: "bg-gradient-brand text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " Add"]
			})
		]
	});
}
function PriorityRow({ p, onSave, onDelete }) {
	const [f, setF] = (0, import_react.useState)(p);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4 grid gap-3 md:grid-cols-8 items-end",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-8 w-8 rounded-lg shrink-0",
					style: { background: f.color }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Name / slug"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: f.name,
						onChange: (e) => setF({
							...f,
							name: e.target.value
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Slug"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: f.slug,
				onChange: (e) => setF({
					...f,
					slug: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Color"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "color",
				value: f.color,
				onChange: (e) => setF({
					...f,
					color: e.target.value
				}),
				className: "p-1"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Response mins"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				value: f.sla_response_mins,
				onChange: (e) => setF({
					...f,
					sla_response_mins: Number(e.target.value) || 0
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Resolve mins"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				value: f.sla_resolve_mins,
				onChange: (e) => setF({
					...f,
					sla_resolve_mins: Number(e.target.value) || 0
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: f.active,
					onCheckedChange: (v) => setF({
						...f,
						active: v
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs",
					children: "Active"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => onSave(f),
					className: "flex-1 bg-gradient-brand text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5 mr-1" }), " Save"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: onDelete,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
				})]
			})
		]
	});
}
function RoutingTab() {
	const qc = useQueryClient();
	const { data: staff = [] } = useStaffOptions();
	const { data: depts = [] } = useQuery({
		queryKey: ["ticket_departments"],
		queryFn: async () => (await supabase.from("ticket_departments").select("*").order("sort_order")).data ?? []
	});
	const { data: prios = [] } = useQuery({
		queryKey: ["ticket_priorities"],
		queryFn: async () => (await supabase.from("ticket_priorities").select("*").order("sort_order")).data ?? []
	});
	const { data: rules = [], isLoading } = useQuery({
		queryKey: ["ticket_routing_rules"],
		queryFn: async () => (await supabase.from("ticket_routing_rules").select("*").order("sort_order")).data ?? []
	});
	const save = useMutation({
		mutationFn: async (d) => {
			if (d.id) {
				const { id, ...rest } = d;
				const { error } = await supabase.from("ticket_routing_rules").update({
					...rest,
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				}).eq("id", id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("ticket_routing_rules").insert(d);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["ticket_routing_rules"] });
			toast.success("Saved");
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("ticket_routing_rules").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["ticket_routing_rules"] }),
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-semibold text-sm mb-2 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "h-4 w-4" }), " Auto-routing rules"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mb-4",
						children: "Applied on ticket creation, in order. First matching rule wins. Leave a match empty to skip that condition. Use “Set …” fields to override the incoming values."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewRule, {
						onSave: (d) => save.mutate(d),
						depts,
						prios,
						staff,
						pending: save.isPending
					})
				]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center text-sm text-muted-foreground p-6",
				children: "Loading…"
			}),
			rules.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleRow, {
				rule: r,
				depts,
				prios,
				staff,
				onSave: (patch) => save.mutate({
					id: r.id,
					...patch
				}),
				onDelete: () => del.mutate(r.id)
			}, r.id))
		]
	});
}
function NewRule({ onSave, depts, prios, staff, pending }) {
	const empty = {
		name: "",
		match_department: null,
		match_priority: null,
		match_keyword: null,
		assign_to: null,
		set_priority: null,
		set_status: null,
		active: true,
		sort_order: 0
	};
	const [f, setF] = (0, import_react.useState)(empty);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 md:grid-cols-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Rule name",
				value: f.name ?? "",
				onChange: (e) => setF({
					...f,
					name: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerSelect, {
				label: "Match dept",
				value: f.match_department,
				onChange: (v) => setF({
					...f,
					match_department: v
				}),
				options: depts.map((d) => ({
					v: d.slug,
					l: d.name
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerSelect, {
				label: "Match priority",
				value: f.match_priority,
				onChange: (v) => setF({
					...f,
					match_priority: v
				}),
				options: prios.map((p) => ({
					v: p.slug,
					l: p.name
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Match keyword",
				value: f.match_keyword ?? "",
				onChange: (e) => setF({
					...f,
					match_keyword: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerSelect, {
				label: "Assign to",
				value: f.assign_to,
				onChange: (v) => setF({
					...f,
					assign_to: v
				}),
				options: staff.map((s) => ({
					v: s.id,
					l: s.label
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerSelect, {
				label: "Set priority",
				value: f.set_priority,
				onChange: (v) => setF({
					...f,
					set_priority: v
				}),
				options: prios.map((p) => ({
					v: p.slug,
					l: p.name
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerSelect, {
				label: "Set status",
				value: f.set_status,
				onChange: (v) => setF({
					...f,
					set_status: v
				}),
				options: STATUSES.map((s) => ({
					v: s,
					l: s.replace("_", " ")
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				disabled: pending || !f.name,
				onClick: () => {
					onSave(f);
					setF(empty);
				},
				className: "bg-gradient-brand text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " Add rule"]
			})
		]
	});
}
function RuleRow({ rule, depts, prios, staff, onSave, onDelete }) {
	const [f, setF] = (0, import_react.useState)(rule);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4 grid gap-3 md:grid-cols-5 items-end",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: f.name,
					onChange: (e) => setF({
						...f,
						name: e.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerSelect, {
				label: "Match dept",
				value: f.match_department,
				onChange: (v) => setF({
					...f,
					match_department: v
				}),
				options: depts.map((d) => ({
					v: d.slug,
					l: d.name
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerSelect, {
				label: "Match priority",
				value: f.match_priority,
				onChange: (v) => setF({
					...f,
					match_priority: v
				}),
				options: prios.map((p) => ({
					v: p.slug,
					l: p.name
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Match keyword"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: f.match_keyword ?? "",
				onChange: (e) => setF({
					...f,
					match_keyword: e.target.value
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerSelect, {
				label: "Assign to",
				value: f.assign_to,
				onChange: (v) => setF({
					...f,
					assign_to: v
				}),
				options: staff.map((s) => ({
					v: s.id,
					l: s.label
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerSelect, {
				label: "Set priority",
				value: f.set_priority,
				onChange: (v) => setF({
					...f,
					set_priority: v
				}),
				options: prios.map((p) => ({
					v: p.slug,
					l: p.name
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickerSelect, {
				label: "Set status",
				value: f.set_status,
				onChange: (v) => setF({
					...f,
					set_status: v
				}),
				options: STATUSES.map((s) => ({
					v: s,
					l: s.replace("_", " ")
				}))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs",
				children: "Sort"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				value: f.sort_order,
				onChange: (e) => setF({
					...f,
					sort_order: Number(e.target.value) || 0
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: f.active,
					onCheckedChange: (v) => setF({
						...f,
						active: v
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs",
					children: "Active"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 md:col-span-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => onSave(f),
					className: "bg-gradient-brand text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5 mr-1" }), " Save"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: onDelete,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-destructive mr-1" }), " Delete"]
				})]
			})
		]
	});
}
function PickerSelect({ label, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "text-xs",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: value ?? "any",
		onValueChange: (v) => onChange(v === "any" ? null : v),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "— any —" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: "any",
			children: "— any —"
		}), options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: o.v,
			children: o.l
		}, o.v))] })]
	})] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Ticket Workflows",
	requiredRoles: ["super_admin", "admin"],
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
