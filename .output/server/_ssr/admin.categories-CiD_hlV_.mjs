import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { An as ChevronRight, Qt as FolderTree, b as Trash2, rt as Plus, st as PenLine, un as Ellipsis } from "../_libs/lucide-react.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CDoe66ii.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-CiD_hlV_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoriesPage() {
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: categories = [], isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const { data, error } = await supabase.from("categories").select("*").order("sort_order");
			if (error) throw error;
			return data;
		}
	});
	const save = useMutation({
		mutationFn: async (c) => {
			const payload = {
				name: c.name,
				slug: c.slug,
				description: c.description ?? null,
				icon: c.icon ?? null,
				sort_order: Number(c.sort_order ?? 0)
			};
			if (c.id) {
				const { error } = await supabase.from("categories").update(payload).eq("id", c.id);
				if (error) throw error;
				await logAudit({
					action: "update",
					resource: "categories",
					resource_id: c.id,
					details: { name: payload.name }
				});
			} else {
				const { data, error } = await supabase.from("categories").insert(payload).select("id").single();
				if (error) throw error;
				await logAudit({
					action: "create",
					resource: "categories",
					resource_id: data?.id,
					details: { name: payload.name }
				});
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["categories"] });
			setEditing(null);
			toast.success("Saved");
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("categories").delete().eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "delete",
				resource: "categories",
				resource_id: id
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["categories"] });
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
							children: "Categories"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2 truncate",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, { className: "h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: "Categories"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "bg-gradient-brand text-white shrink-0",
				onClick: () => setEditing({ sort_order: categories.length + 1 }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 sm:mr-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: "New category"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden md:block rounded-2xl border border-border bg-card shadow-card overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm min-w-[640px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Slug"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Icon"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Sort"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "pl-3 pr-5 py-3 w-10" })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border",
						children: [isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "p-10 text-center text-muted-foreground",
							children: "Loading…"
						}) }), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-secondary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: c.description
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-3 font-mono text-xs",
									children: ["/", c.slug]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-xs text-muted-foreground",
									children: c.icon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-xs",
									children: c.sort_order
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
											onClick: () => confirm(`Delete "${c.name}"?`) && del.mutate(c.id),
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
				!isLoading && categories.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground text-sm",
					children: "No categories yet."
				}),
				categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card p-4 shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold truncate",
									children: c.name
								}),
								c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground line-clamp-2 mt-0.5",
									children: c.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono",
											children: ["/", c.slug]
										}),
										c.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Icon: ", c.icon] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Sort: ", c.sort_order] })
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
								onClick: () => confirm(`Delete "${c.name}"?`) && del.mutate(c.id),
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
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "Edit category" : "New category" }) }), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate(editing);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: editing.name ?? "",
						onChange: (e) => setEditing({
							...editing,
							name: e.target.value
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: editing.slug ?? "",
						onChange: (e) => setEditing({
							...editing,
							slug: e.target.value
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Icon (Lucide name)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.icon ?? "",
						onChange: (e) => setEditing({
							...editing,
							icon: e.target.value
						}),
						className: "mt-1.5",
						placeholder: "Server"
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sort order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: editing.sort_order ?? 0,
						onChange: (e) => setEditing({
							...editing,
							sort_order: Number(e.target.value)
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
	title: "Categories",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesPage, {})
});
//#endregion
export { SplitComponent as component };
