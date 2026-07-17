import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { An as ChevronRight, E as Tag, b as Trash2, rt as Plus, st as PenLine, un as Ellipsis, vn as Copy } from "../_libs/lucide-react.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CDoe66ii.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.coupons-BCTMLV5D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CouponsPage() {
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: coupons = [], isLoading } = useQuery({
		queryKey: ["coupons"],
		queryFn: async () => {
			const { data, error } = await supabase.from("coupons").select("*").order("valid_until", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const save = useMutation({
		mutationFn: async (c) => {
			const payload = {
				code: c.code.toUpperCase(),
				description: c.description ?? null,
				discount_type: c.discount_type ?? "percent",
				discount_value: Number(c.discount_value ?? 0),
				max_uses: c.max_uses ? Number(c.max_uses) : null,
				valid_from: c.valid_from || null,
				valid_until: c.valid_until || null,
				status: c.status ?? "active"
			};
			if (c.id) {
				const { error } = await supabase.from("coupons").update(payload).eq("id", c.id);
				if (error) throw error;
				await logAudit({
					action: "update",
					resource: "coupons",
					resource_id: c.id,
					details: { code: payload.code }
				});
			} else {
				const { data, error } = await supabase.from("coupons").insert(payload).select("id").single();
				if (error) throw error;
				await logAudit({
					action: "create",
					resource: "coupons",
					resource_id: data?.id,
					details: { code: payload.code }
				});
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["coupons"] });
			setEditing(null);
			toast.success("Saved");
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("coupons").delete().eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "delete",
				resource: "coupons",
				resource_id: id
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["coupons"] });
			toast.success("Deleted");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-end sm:justify-between sm:flex-wrap sm:gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "hover:text-foreground",
							children: "Dashboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: "Coupons"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2 truncate",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: "Coupons & Promo Codes"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "bg-gradient-brand text-white shrink-0",
				onClick: () => setEditing({
					discount_type: "percent",
					discount_value: 10,
					status: "active"
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 sm:mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: "New coupon"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden md:block rounded-2xl border border-border bg-card shadow-card overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm min-w-[720px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Code"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Discount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Uses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Valid until"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "pl-3 pr-5 py-3 w-10" })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border",
						children: [isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "p-10 text-center text-muted-foreground",
							children: "Loading…"
						}) }), coupons.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-secondary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded",
											children: c.code
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "text-muted-foreground hover:text-foreground",
											onClick: () => {
												navigator.clipboard.writeText(c.code);
												toast.success("Copied");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground mt-1",
										children: c.description
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 font-semibold",
									children: c.discount_type === "percent" ? `${c.discount_value}%` : formatINR(Number(c.discount_value))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-3 text-xs",
									children: [
										c.uses,
										" / ",
										c.max_uses ?? "∞"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-xs text-muted-foreground",
									children: c.valid_until ? new Date(c.valid_until).toLocaleDateString("en-IN") : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: c.status === "active" ? "bg-accent/15 text-accent border-0" : "bg-secondary",
										children: c.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "pl-3 pr-5 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "h-8 w-8 rounded-md hover:bg-secondary flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
										align: "end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => setEditing(c),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4 mr-2" }), " Edit"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											className: "text-destructive",
											onClick: () => confirm(`Delete "${c.code}"?`) && del.mutate(c.id),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-2" }), " Delete"]
										})]
									})] })
								})
							]
						}, c.id))]
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:hidden space-y-3",
			children: [
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground text-sm",
					children: "Loading…"
				}),
				!isLoading && coupons.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground text-sm",
					children: "No coupons yet."
				}),
				coupons.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card p-4 shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded text-xs",
											children: c.code
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "text-muted-foreground hover:text-foreground",
											onClick: () => {
												navigator.clipboard.writeText(c.code);
												toast.success("Copied");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: c.status === "active" ? "bg-accent/15 text-accent border-0" : "bg-secondary",
											children: c.status
										})
									]
								}),
								c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1 line-clamp-2",
									children: c.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Discount:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: c.discount_type === "percent" ? `${c.discount_value}%` : formatINR(Number(c.discount_value))
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Uses:"
											}),
											" ",
											c.uses,
											" / ",
											c.max_uses ?? "∞"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-span-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Valid until:"
												}),
												" ",
												c.valid_until ? new Date(c.valid_until).toLocaleDateString("en-IN") : "—"
											]
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-8 px-2",
								onClick: () => setEditing(c),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5 mr-1" }), " Edit"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-8 px-2 text-destructive",
								onClick: () => confirm(`Delete "${c.code}"?`) && del.mutate(c.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 mr-1" }), " Delete"]
							})]
						})]
					})
				}, c.id))
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editing,
			onOpenChange: (v) => !v && setEditing(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "Edit coupon" : "New coupon" }) }), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate(editing);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: editing.code ?? "",
						onChange: (e) => setEditing({
							...editing,
							code: e.target.value.toUpperCase()
						}),
						className: "mt-1.5 font-mono uppercase"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 2,
						value: editing.description ?? "",
						onChange: (e) => setEditing({
							...editing,
							description: e.target.value
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: editing.discount_type,
							onValueChange: (v) => setEditing({
								...editing,
								discount_type: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "percent",
								children: "Percentage"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "flat",
								children: "Flat ₹"
							})] })]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Value" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							step: "0.01",
							required: true,
							value: editing.discount_value ?? 0,
							onChange: (e) => setEditing({
								...editing,
								discount_value: Number(e.target.value)
							}),
							className: "mt-1.5"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Max uses" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							value: editing.max_uses ?? "",
							onChange: (e) => setEditing({
								...editing,
								max_uses: e.target.value ? Number(e.target.value) : null
							}),
							className: "mt-1.5",
							placeholder: "Unlimited"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: editing.status,
							onValueChange: (v) => setEditing({
								...editing,
								status: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "active",
									children: "Active"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "paused",
									children: "Paused"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "expired",
									children: "Expired"
								})
							] })]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Valid until" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "datetime-local",
						value: editing.valid_until ? new Date(editing.valid_until).toISOString().slice(0, 16) : "",
						onChange: (e) => setEditing({
							...editing,
							valid_until: e.target.value ? new Date(e.target.value).toISOString() : null
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => setEditing(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "bg-gradient-brand text-white",
						disabled: save.isPending,
						children: "Save"
					})] })
				]
			})] })
		})
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Coupons",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CouponsPage, {})
});
//#endregion
export { SplitComponent as component };
