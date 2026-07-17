import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Et as LoaderCircle, On as CircleCheck, U as Search, b as Trash2, ot as Pencil, r as X, rt as Plus } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Checkbox } from "./checkbox-B1AjkRkB.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ModuleCrud-CRDW5ors.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_STATUSES = [
	"active",
	"pending",
	"suspended",
	"expired",
	"cancelled"
];
function emptyForm(statuses, metaFields) {
	return {
		title: "",
		subtitle: "",
		status: statuses[0] ?? "active",
		amount_inr: "",
		due_at: "",
		tags: "",
		metadata: Object.fromEntries(metaFields.map((f) => [f.key, ""]))
	};
}
function statusTone(s) {
	const k = s.toLowerCase();
	if ([
		"active",
		"paid",
		"delivered",
		"resolved",
		"published"
	].includes(k)) return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
	if ([
		"pending",
		"processing",
		"draft"
	].includes(k)) return "bg-amber-500/15 text-amber-500 border-amber-500/30";
	if ([
		"suspended",
		"expired",
		"cancelled",
		"failed"
	].includes(k)) return "bg-rose-500/15 text-rose-500 border-rose-500/30";
	return "bg-primary/15 text-primary border-primary/30";
}
function ModuleCrud({ module, title, subtitle, icon: Icon, features, metaFields = [], statuses = DEFAULT_STATUSES, amountLabel = "Amount (INR)", showDueDate = true, addLabel = "Add record", titleLabel = "Title" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrudBody, {
			module,
			title,
			subtitle,
			icon: Icon,
			features,
			metaFields,
			statuses,
			amountLabel,
			showDueDate,
			addLabel,
			titleLabel
		})
	});
}
function ModuleCrudBody({ module, title, subtitle, icon: Icon, features, metaFields, statuses, amountLabel, showDueDate, addLabel, titleLabel }) {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(() => emptyForm(statuses, metaFields));
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bulkStatus, setBulkStatus] = (0, import_react.useState)(statuses[0] ?? "active");
	const { data: records = [], isLoading } = useQuery({
		queryKey: ["module_records", module],
		queryFn: async () => {
			const { data, error } = await supabase.from("module_records").select("*").eq("module", module).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return records.filter((r) => {
			if (statusFilter !== "all" && r.status !== statusFilter) return false;
			if (!q) return true;
			return r.title.toLowerCase().includes(q) || (r.subtitle ?? "").toLowerCase().includes(q);
		});
	}, [
		records,
		search,
		statusFilter
	]);
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: records.length,
			active: records.filter((r) => [
				"active",
				"paid",
				"published",
				"delivered"
			].includes(r.status)).length,
			pending: records.filter((r) => [
				"pending",
				"processing",
				"draft"
			].includes(r.status)).length,
			revenue: records.reduce((sum, r) => sum + Number(r.amount_inr ?? 0), 0)
		};
	}, [records]);
	const upsert = useMutation({
		mutationFn: async (f) => {
			const payload = {
				module,
				title: f.title.trim(),
				subtitle: f.subtitle.trim() || null,
				status: f.status,
				amount_inr: f.amount_inr ? Number(f.amount_inr) : 0,
				due_at: f.due_at ? new Date(f.due_at).toISOString() : null,
				tags: f.tags ? f.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
				metadata: f.metadata
			};
			if (f.id) {
				const { error } = await supabase.from("module_records").update(payload).eq("id", f.id);
				if (error) throw error;
				await logAudit({
					action: "update",
					resource: "settings",
					resource_id: f.id,
					details: {
						module,
						title: payload.title
					}
				});
			} else {
				const { error } = await supabase.from("module_records").insert(payload);
				if (error) throw error;
				await logAudit({
					action: "create",
					resource: "settings",
					details: {
						module,
						title: payload.title
					}
				});
			}
		},
		onSuccess: () => {
			toast.success(form.id ? "Record updated" : "Record created");
			setDialogOpen(false);
			setForm(emptyForm(statuses, metaFields));
			qc.invalidateQueries({ queryKey: ["module_records", module] });
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
				details: { module }
			});
		},
		onSuccess: () => {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["module_records", module] });
		},
		onError: (e) => toast.error(e.message)
	});
	const bulkDelete = useMutation({
		mutationFn: async (ids) => {
			const { error } = await supabase.from("module_records").delete().in("id", ids);
			if (error) throw error;
			await logAudit({
				action: "delete",
				resource: "settings",
				details: {
					module,
					count: ids.length,
					bulk: true
				}
			});
		},
		onSuccess: (_d, ids) => {
			toast.success(`Deleted ${ids.length} record${ids.length === 1 ? "" : "s"}`);
			setSelected(/* @__PURE__ */ new Set());
			qc.invalidateQueries({ queryKey: ["module_records", module] });
		},
		onError: (e) => toast.error(e.message)
	});
	const bulkUpdateStatus = useMutation({
		mutationFn: async ({ ids, status }) => {
			const { error } = await supabase.from("module_records").update({ status }).in("id", ids);
			if (error) throw error;
			await logAudit({
				action: "update",
				resource: "settings",
				details: {
					module,
					count: ids.length,
					status,
					bulk: true
				}
			});
		},
		onSuccess: (_d, v) => {
			toast.success(`Updated ${v.ids.length} record${v.ids.length === 1 ? "" : "s"}`);
			setSelected(/* @__PURE__ */ new Set());
			qc.invalidateQueries({ queryKey: ["module_records", module] });
		},
		onError: (e) => toast.error(e.message)
	});
	function openNew() {
		setForm(emptyForm(statuses, metaFields));
		setDialogOpen(true);
	}
	function openEdit(r) {
		const meta = r.metadata ?? {};
		setForm({
			id: r.id,
			title: r.title,
			subtitle: r.subtitle ?? "",
			status: r.status,
			amount_inr: r.amount_inr != null ? String(r.amount_inr) : "",
			due_at: r.due_at ? r.due_at.slice(0, 10) : "",
			tags: (r.tags ?? []).join(", "),
			metadata: Object.fromEntries(metaFields.map((f) => [f.key, String(meta[f.key] ?? "")]))
		});
		setDialogOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 min-w-0 max-w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-start gap-3 sm:gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6 text-white" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "break-words text-xl font-bold sm:text-2xl",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-2xl break-words text-sm text-muted-foreground",
							children: subtitle
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: dialogOpen,
					onOpenChange: setDialogOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: openNew,
							className: "w-full bg-gradient-brand text-white sm:w-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }),
								" ",
								addLabel
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "w-[calc(100vw-2rem)] max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
								className: "px-6 pt-6 pb-3 border-b border-border sticky top-0 bg-background z-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Edit record" : addLabel })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 md:grid-cols-2 px-6 py-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: titleLabel,
										className: "md:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.title,
											onChange: (e) => setForm({
												...form,
												title: e.target.value
											}),
											required: true
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Description / Notes",
										className: "md:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											rows: 2,
											value: form.subtitle,
											onChange: (e) => setForm({
												...form,
												subtitle: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Status",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.status,
											onValueChange: (v) => setForm({
												...form,
												status: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: statuses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: s,
												children: s
											}, s)) })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: amountLabel,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: 0,
											step: "0.01",
											value: form.amount_inr,
											onChange: (e) => setForm({
												...form,
												amount_inr: e.target.value
											})
										})
									}),
									showDueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Due / Expiry date",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: form.due_at,
											onChange: (e) => setForm({
												...form,
												due_at: e.target.value
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Tags (comma separated)",
										className: showDueDate ? "" : "md:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.tags,
											onChange: (e) => setForm({
												...form,
												tags: e.target.value
											}),
											placeholder: "premium, enterprise"
										})
									}),
									metaFields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: f.label,
										className: f.type === "textarea" ? "md:col-span-2" : "",
										children: f.type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											rows: 2,
											value: form.metadata[f.key] ?? "",
											placeholder: f.placeholder,
											onChange: (e) => setForm({
												...form,
												metadata: {
													...form.metadata,
													[f.key]: e.target.value
												}
											})
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: f.type === "number" ? "number" : "text",
											value: form.metadata[f.key] ?? "",
											placeholder: f.placeholder,
											onChange: (e) => setForm({
												...form,
												metadata: {
													...form.metadata,
													[f.key]: e.target.value
												}
											})
										})
									}, f.key))
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "px-6 py-4 border-t border-border sticky bottom-0 bg-background gap-2 flex-col sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setDialogOpen(false),
									className: "w-full sm:w-auto",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => upsert.mutate(form),
									disabled: upsert.isPending || !form.title.trim(),
									className: "w-full sm:w-auto",
									children: [upsert.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }), form.id ? "Save changes" : "Create"]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total records",
						value: stats.total.toString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active",
						value: stats.active.toString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending",
						value: stats.pending.toString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Value",
						value: `₹${stats.revenue.toLocaleString("en-IN")}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-3 sm:p-4 space-y-4 min-w-0 max-w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search…",
								className: "pl-9",
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
							}), statuses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s))] })]
						})]
					}),
					selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-2 sm:p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium px-2",
								children: [selected.size, " selected"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: bulkStatus,
								onValueChange: setBulkStatus,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-full sm:w-[150px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: statuses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: bulkUpdateStatus.isPending,
								onClick: () => bulkUpdateStatus.mutate({
									ids: Array.from(selected),
									status: bulkStatus
								}),
								children: bulkUpdateStatus.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Apply status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "destructive",
								disabled: bulkDelete.isPending,
								onClick: () => {
									const ids = Array.from(selected);
									if (confirm(`Delete ${ids.length} record${ids.length === 1 ? "" : "s"}?`)) bulkDelete.mutate(ids);
								},
								children: bulkDelete.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-1" }), " Delete"] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => setSelected(/* @__PURE__ */ new Set()),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						]
					}),
					isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-16 text-center text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin inline mr-2" }), " Loading…"]
					}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-16 text-center text-sm text-muted-foreground",
						children: [
							"No records yet. Click ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: addLabel }),
							" to create your first entry."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "min-w-[720px] w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-xs uppercase text-muted-foreground border-b border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-8 py-2 px-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: filtered.length > 0 && filtered.every((r) => selected.has(r.id)),
											onCheckedChange: (v) => {
												const next = new Set(selected);
												if (v) filtered.forEach((r) => next.add(r.id));
												else filtered.forEach((r) => next.delete(r.id));
												setSelected(next);
											},
											"aria-label": "Select all"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left py-2 px-2",
										children: titleLabel
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left py-2 px-2",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right py-2 px-2",
										children: "Amount"
									}),
									showDueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left py-2 px-2",
										children: "Due"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left py-2 px-2",
										children: "Tags"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right py-2 px-2",
										children: "Actions"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((r) => {
								const isSel = selected.has(r.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: `border-b border-border/50 hover:bg-muted/30 ${isSel ? "bg-primary/5" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked: isSel,
												onCheckedChange: (v) => {
													const next = new Set(selected);
													if (v) next.add(r.id);
													else next.delete(r.id);
													setSelected(next);
												},
												"aria-label": `Select ${r.title}`
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-3 px-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium break-words",
												children: r.title
											}), r.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground line-clamp-1",
												children: r.subtitle
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: statusTone(r.status),
												children: r.status
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-2 text-right tabular-nums",
											children: r.amount_inr ? `₹${Number(r.amount_inr).toLocaleString("en-IN")}` : "—"
										}),
										showDueDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-2",
											children: r.due_at ? new Date(r.due_at).toLocaleDateString("en-IN") : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-1",
												children: (r.tags ?? []).slice(0, 3).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] px-1.5 py-0.5 rounded bg-muted",
													children: t
												}, t))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3 px-2 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "inline-flex gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													onClick: () => openEdit(r),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													onClick: () => {
														if (confirm(`Delete "${r.title}"?`)) remove.mutate(r.id);
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
												})]
											})
										})
									]
								}, r.id);
							}) })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3",
				children: features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-xl p-3 flex min-w-0 items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 break-words text-xs",
						children: f
					})]
				}, f))
			})
		]
	});
}
function StatCard({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-2xl p-4 min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 break-words text-2xl font-bold",
			children: value
		})]
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("min-w-0", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { ModuleCrud as t };
