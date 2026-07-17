import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { U as Search, Z as RefreshCw, b as Trash2, ot as Pencil, rt as Plus } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.subscriptions-Dpb3cwo9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"active",
	"trialing",
	"past_due",
	"cancelled",
	"expired"
];
var CYCLES = [
	"monthly",
	"quarterly",
	"yearly",
	"one_time"
];
var emptyForm = {
	customer_id: "",
	plan: "",
	amount_inr: "0",
	billing_cycle: "monthly",
	status: "active",
	current_period_end: ""
};
function Page() {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data = [], isLoading } = useQuery({
		queryKey: ["subs"],
		queryFn: async () => {
			const { data, error } = await supabase.from("subscriptions").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const update = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("subscriptions").update({ status }).eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "update",
				resource: "subscription",
				resource_id: id,
				details: { status }
			});
		},
		onSuccess: () => {
			toast.success("Subscription updated");
			qc.invalidateQueries({ queryKey: ["subs"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const save = useMutation({
		mutationFn: async (form) => {
			const payload = {
				customer_id: form.customer_id.trim(),
				plan: form.plan.trim(),
				amount_inr: Number(form.amount_inr) || 0,
				billing_cycle: form.billing_cycle,
				status: form.status,
				current_period_end: form.current_period_end ? new Date(form.current_period_end).toISOString() : null
			};
			if (!payload.customer_id) throw new Error("Customer ID required");
			if (!payload.plan) throw new Error("Plan name required");
			if (form.id) {
				const { error } = await supabase.from("subscriptions").update(payload).eq("id", form.id);
				if (error) throw error;
				await logAudit({
					action: "update",
					resource: "subscription",
					resource_id: form.id,
					details: payload
				});
			} else {
				const { data, error } = await supabase.from("subscriptions").insert(payload).select().single();
				if (error) throw error;
				await logAudit({
					action: "create",
					resource: "subscription",
					resource_id: data.id,
					details: payload
				});
			}
		},
		onSuccess: () => {
			toast.success(editing?.id ? "Subscription updated" : "Subscription created");
			setEditing(null);
			qc.invalidateQueries({ queryKey: ["subs"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("subscriptions").delete().eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "delete",
				resource: "subscription",
				resource_id: id
			});
		},
		onSuccess: () => {
			toast.success("Subscription deleted");
			qc.invalidateQueries({ queryKey: ["subs"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const filtered = data.filter((s) => (status === "all" || s.status === status) && (!q || s.plan.toLowerCase().includes(q.toLowerCase()) || s.customer_id.includes(q)));
	const mrr = data.filter((s) => s.status === "active" && s.billing_cycle === "monthly").reduce((a, s) => a + Number(s.amount_inr), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-6 w-6" }), " Subscriptions"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: ["Recurring revenue across all customers. MRR: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: formatINR(mrr)
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setEditing({ ...emptyForm }),
					className: "bg-gradient-brand text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1.5" }), " New subscription"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-4 sm:p-5 space-y-4 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search plan or customer id",
							value: q,
							onChange: (e) => setQ(e.target.value),
							className: "pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: setStatus,
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-[880px] w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs uppercase text-muted-foreground bg-secondary/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Plan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Cycle"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Renews"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-5 py-3",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "px-5 py-10 text-center text-muted-foreground",
								children: "Loading…"
							}) }),
							!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "px-5 py-10 text-center text-muted-foreground",
								children: "No subscriptions yet."
							}) }),
							filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border hover:bg-secondary/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 font-medium break-words",
										children: s.plan
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-5 py-3 text-xs text-muted-foreground font-mono",
										children: [s.customer_id.slice(0, 8), "…"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: formatINR(Number(s.amount_inr))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 capitalize",
										children: s.billing_cycle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: s.status,
											onValueChange: (v) => update.mutate({
												id: s.id,
												status: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "w-[130px] h-8",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: x,
												children: x
											}, x)) })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: s.current_period_end ? new Date(s.current_period_end).toLocaleDateString("en-IN") : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "ghost",
												className: "h-8 w-8",
												onClick: () => setEditing({
													id: s.id,
													customer_id: s.customer_id,
													plan: s.plan,
													amount_inr: String(s.amount_inr),
													billing_cycle: s.billing_cycle,
													status: s.status,
													current_period_end: s.current_period_end ? s.current_period_end.slice(0, 10) : ""
												}),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "icon",
												variant: "ghost",
												className: "h-8 w-8 text-destructive",
												onClick: () => {
													if (confirm(`Delete subscription "${s.plan}"?`)) del.mutate(s.id);
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
											})]
										})
									})
								]
							}, s.id))
						] })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (o) => !o && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "Edit subscription" : "New subscription" }) }),
						editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Customer ID (user UUID)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editing.customer_id,
										onChange: (e) => setEditing({
											...editing,
											customer_id: e.target.value
										}),
										placeholder: "uuid…"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Plan name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editing.plan,
										onChange: (e) => setEditing({
											...editing,
											plan: e.target.value
										}),
										placeholder: "e.g. Managed Hosting Pro"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (INR)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: editing.amount_inr,
											onChange: (e) => setEditing({
												...editing,
												amount_inr: e.target.value
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Billing cycle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: editing.billing_cycle,
											onValueChange: (v) => setEditing({
												...editing,
												billing_cycle: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CYCLES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: c,
												children: c
											}, c)) })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: editing.status,
											onValueChange: (v) => setEditing({
												...editing,
												status: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: s,
												children: s
											}, s)) })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Renews on" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: editing.current_period_end,
											onChange: (e) => setEditing({
												...editing,
												current_period_end: e.target.value
											})
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setEditing(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => editing && save.mutate(editing),
							disabled: save.isPending,
							children: save.isPending ? "Saving…" : "Save"
						})] })
					]
				})
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Subscriptions",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
