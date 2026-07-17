import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { An as ChevronRight, Et as LoaderCircle, H as Send, L as Shield, Sn as Clock, Zn as ArrowLeft, _ as TriangleAlert, d as User, fn as Download } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as downloadCsv, t as downloadBlob } from "./download-DhKjMGgD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.tickets._id-BoXvVZvA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"open",
	"in_progress",
	"waiting",
	"resolved",
	"closed"
];
var PRIORITIES = [
	"low",
	"medium",
	"high",
	"urgent"
];
function TicketAdminDetail() {
	const { id } = useParams({ from: "/admin/tickets/$id" });
	const { user, profile } = useAuth();
	const qc = useQueryClient();
	const [msg, setMsg] = (0, import_react.useState)("");
	const [internal, setInternal] = (0, import_react.useState)(false);
	const { data: ticket, isLoading: ticketLoading } = useQuery({
		queryKey: ["admin-ticket", id],
		queryFn: async () => (await supabase.from("tickets").select("*").eq("id", id).maybeSingle()).data
	});
	const { data: customer } = useQuery({
		queryKey: ["admin-ticket-customer", ticket?.customer_id],
		enabled: !!ticket?.customer_id,
		queryFn: async () => (await supabase.from("profiles").select("id, full_name, email, phone").eq("id", ticket.customer_id).maybeSingle()).data
	});
	const { data: replies = [] } = useQuery({
		queryKey: ["admin-ticket-replies", id],
		queryFn: async () => (await supabase.from("ticket_replies").select("*").eq("ticket_id", id).order("created_at", { ascending: true })).data ?? []
	});
	const { data: staff = [] } = useQuery({
		queryKey: ["staff-list"],
		queryFn: async () => {
			const { data: roles } = await supabase.from("user_roles").select("user_id, role").in("role", [
				"super_admin",
				"admin",
				"sales_manager",
				"support",
				"finance",
				"employee"
			]);
			const ids = [...new Set((roles ?? []).map((r) => r.user_id))];
			if (!ids.length) return [];
			const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
			return data ?? [];
		}
	});
	const update = useMutation({
		mutationFn: async (patch) => {
			const { error } = await supabase.from("tickets").update(patch).eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "update",
				resource: "tickets",
				resource_id: id,
				details: patch
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-ticket", id] });
			toast.success("Updated");
		},
		onError: (e) => toast.error(e.message)
	});
	const post = useMutation({
		mutationFn: async () => {
			const text = internal ? `🔒 Internal note: ${msg}` : msg;
			if (!text.trim()) throw new Error("Message empty");
			const { error } = await supabase.from("ticket_replies").insert({
				ticket_id: id,
				author_id: user.id,
				author_name: profile?.full_name ?? user.email ?? "Support",
				is_staff: true,
				message: text
			});
			if (error) throw error;
		},
		onSuccess: () => {
			setMsg("");
			qc.invalidateQueries({ queryKey: ["admin-ticket-replies", id] });
			toast.success("Reply sent");
		},
		onError: (e) => toast.error(e.message)
	});
	if (ticketLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 text-center text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin inline mr-2" }), " Loading ticket…"]
	});
	if (!ticket) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-10 text-center space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "Ticket not found or you don't have access."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			variant: "outline",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/tickets",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), " Back to tickets"]
			})
		})]
	});
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono",
					children: ticket.ticket_number
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 flex-wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/tickets",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), " Back"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl lg:text-2xl font-bold tracking-tight flex-1 min-w-0 truncate",
					children: ticket.subject
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "capitalize",
					children: ticket.status.replace("_", " ")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "capitalize",
					children: ticket.priority
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlaChip, { ticket }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => exportThread(ticket, replies, "csv"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1.5" }), " CSV"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => exportThread(ticket, replies, "txt"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1.5" }), " Transcript"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[1fr_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					ticket.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2",
							children: "Original request"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm whitespace-pre-wrap",
							children: ticket.description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [replies.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex gap-3", r.is_staff ? "flex-row-reverse" : ""),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-white", r.is_staff ? "bg-gradient-green" : "bg-gradient-brand"),
								children: r.is_staff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("max-w-[75%] rounded-2xl px-4 py-2.5", r.is_staff ? "bg-primary text-primary-foreground" : "bg-card border border-border"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] font-medium mb-0.5 opacity-75",
										children: [
											r.author_name,
											" ",
											r.is_staff && "· Staff"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm whitespace-pre-wrap",
										children: r.message
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] opacity-60 mt-1",
										children: new Date(r.created_at).toLocaleString("en-IN")
									})
								]
							})]
						}, r.id)), replies.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground",
							children: "No replies yet. Send the first reply below."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-3 shadow-elegant",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 4,
							value: msg,
							onChange: (e) => setMsg(e.target.value),
							placeholder: "Write a reply to the customer…",
							className: "border-0 focus-visible:ring-0 resize-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-xs text-muted-foreground cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: internal,
									onChange: (e) => setInternal(e.target.checked),
									className: "rounded"
								}), "Internal note (marked 🔒)"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "bg-gradient-brand text-white",
								onClick: () => post.mutate(),
								disabled: post.isPending,
								children: post.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 mr-1.5" }), " Send reply"] })
							})]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3",
						children: "Customer"
					}), customer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: customer.full_name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground text-xs",
								children: customer.email
							}),
							customer.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground text-xs",
								children: customer.phone
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Unknown"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider",
							children: "Manage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground",
							children: "Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: ticket.status,
							onValueChange: (v) => update.mutate({ status: v }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1 capitalize",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								className: "capitalize",
								children: s.replace("_", " ")
							}, s)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground",
							children: "Priority"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: ticket.priority,
							onValueChange: (v) => update.mutate({ priority: v }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1 capitalize",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: p,
								className: "capitalize",
								children: p
							}, p)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-muted-foreground",
							children: "Assigned to"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: ticket.assigned_to ?? "unassigned",
							onValueChange: (v) => update.mutate({ assigned_to: v === "unassigned" ? null : v }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Unassigned" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "unassigned",
								children: "Unassigned"
							}), staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s.id,
								children: s.full_name ?? s.email
							}, s.id))] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-muted-foreground pt-2 border-t border-border space-y-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Dept: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "capitalize",
									children: ticket.department
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Opened: ", new Date(ticket.created_at).toLocaleString("en-IN")] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Updated: ", new Date(ticket.updated_at).toLocaleString("en-IN")] }),
								ticket.sla_due_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["SLA due: ", new Date(ticket.sla_due_at).toLocaleString("en-IN")] }),
								ticket.first_response_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["First response: ", new Date(ticket.first_response_at).toLocaleString("en-IN")] }),
								ticket.resolved_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Resolved: ", new Date(ticket.resolved_at).toLocaleString("en-IN")] })
							]
						})
					]
				})]
			})]
		})
	] });
}
function SlaChip({ ticket }) {
	if (!ticket.sla_due_at) return null;
	if (ticket.status === "resolved" || ticket.status === "closed") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		className: "bg-accent/15 text-accent border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 mr-1" }), " SLA met"]
	});
	const diff = new Date(ticket.sla_due_at).getTime() - Date.now();
	if (diff < 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		className: "bg-destructive/15 text-destructive border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 mr-1" }), " SLA breached"]
	});
	const h = Math.floor(diff / 36e5);
	const m = Math.floor(diff % 36e5 / 6e4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		className: cn("border-0", diff < 36e5 ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" : "bg-secondary text-muted-foreground"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 mr-1" }),
			" ",
			h,
			"h ",
			m,
			"m left"
		]
	});
}
function exportThread(t, replies, fmt) {
	const base = `ticket-${t.ticket_number}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`;
	if (fmt === "csv") {
		downloadCsv([
			["Ticket", t.ticket_number],
			["Subject", t.subject],
			["Status", t.status],
			["Priority", t.priority],
			["Department", t.department],
			[],
			[
				"Author",
				"Role",
				"Message",
				"At"
			],
			...replies.map((r) => [
				r.author_name ?? "",
				r.is_staff ? "Staff" : "Customer",
				r.message,
				r.created_at
			])
		], `${base}.csv`);
		return;
	}
	const lines = [
		`Ticket: ${t.ticket_number}`,
		`Subject: ${t.subject}`,
		`Status: ${t.status}   Priority: ${t.priority}   Dept: ${t.department}`,
		`Opened: ${new Date(t.created_at).toLocaleString("en-IN")}`,
		"",
		"── Original request ──",
		t.description ?? "(none)",
		"",
		"── Conversation ──",
		...replies.map((r) => `\n[${new Date(r.created_at).toLocaleString("en-IN")}] ${r.author_name ?? ""} (${r.is_staff ? "Staff" : "Customer"}):\n${r.message}`)
	];
	downloadBlob(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }), `${base}.txt`);
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Ticket",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketAdminDetail, {})
});
//#endregion
export { SplitComponent as component };
