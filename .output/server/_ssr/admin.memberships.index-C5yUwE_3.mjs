import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { At as LayoutDashboard, B as Settings, T as Tags, Tt as Lock, U as Search, Wn as BookOpen, b as Trash2, dt as Package, hn as Crown, j as Sparkles, rt as Plus, ut as Palette } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Checkbox } from "./checkbox-B1AjkRkB.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
import { g as upsertTier, l as listTierAccessSelections, m as saveTierAccessSelections, r as deleteTier, s as listAccessibleResources } from "./memberships.functions-C2eeCH5c.mjs";
import { t as MembershipBadge } from "./MembershipBadge-vyy4IIJ-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.memberships.index-C5yUwE_3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPES = [
	{
		key: "course",
		label: "Courses",
		icon: BookOpen,
		listKey: "courses",
		nameField: "title"
	},
	{
		key: "product",
		label: "Products",
		icon: Package,
		listKey: "products",
		nameField: "name"
	},
	{
		key: "category",
		label: "Categories",
		icon: Tags,
		listKey: "categories",
		nameField: "name"
	},
	{
		key: "portal_section",
		label: "Portal",
		icon: LayoutDashboard,
		listKey: "portal_sections",
		nameField: "name"
	}
];
function TierAccessTab({ tierRank, value, onChange }) {
	const listRes = useServerFn(listAccessibleResources);
	const listSel = useServerFn(listTierAccessSelections);
	const [resources, setResources] = (0, import_react.useState)({
		courses: [],
		products: [],
		categories: [],
		portal_sections: []
	});
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		(async () => {
			const [r, s] = await Promise.all([listRes(), listSel({ data: { tier_rank: tierRank } })]);
			setResources(r);
			if (!value || value.length === 0) onChange(s.map((row) => ({
				resource_type: row.resource_type,
				resource_id: row.resource_id ?? ""
			})));
			setLoaded(true);
		})().catch(() => setLoaded(true));
	}, [tierRank]);
	const selectedSet = (0, import_react.useMemo)(() => new Set(value.map((s) => `${s.resource_type}::${s.resource_id}`)), [value]);
	function toggle(type, id) {
		const key = `${type}::${id}`;
		if (selectedSet.has(key)) onChange(value.filter((s) => `${s.resource_type}::${s.resource_id}` !== key));
		else onChange([...value, {
			resource_type: type,
			resource_id: id
		}]);
	}
	function toggleAll(type, ids, select) {
		const others = value.filter((s) => s.resource_type !== type || !ids.includes(s.resource_id));
		onChange(select ? [...others, ...ids.map((id) => ({
			resource_type: type,
			resource_id: id
		}))] : others);
	}
	const totalSelected = value.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Content unlocked at this tier"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							children: [totalSelected, " selected"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-8 h-9 w-56",
						placeholder: "Search...",
						value: query,
						onChange: (e) => setQuery(e.target.value)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "course",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "grid grid-cols-4 w-full",
					children: TYPES.map((t) => {
						const items = resources[t.listKey] ?? [];
						const selCount = value.filter((v) => v.resource_type === t.key).length;
						const Icon = t.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: t.key,
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: t.label
								}),
								selCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 text-[10px] rounded-full bg-primary text-primary-foreground px-1.5 py-0.5",
									children: [
										selCount,
										"/",
										items.length
									]
								})
							]
						}, t.key);
					})
				}), TYPES.map((t) => {
					const items = (resources[t.listKey] ?? []).filter((it) => {
						const name = String(it[t.nameField] ?? it.name ?? "").toLowerCase();
						return !query || name.includes(query.toLowerCase());
					});
					const allSelected = items.length > 0 && items.every((it) => selectedSet.has(`${t.key}::${it.id}`));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: t.key,
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-3 py-2 border-b bg-muted/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: loaded ? `${items.length} ${t.label.toLowerCase()}` : "Loading..."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => toggleAll(t.key, items.map((i) => i.id), !allSelected),
										children: allSelected ? "Clear all" : "Select all"
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-64 overflow-y-auto divide-y",
								children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-4 text-sm text-muted-foreground text-center",
									children: "Nothing to show."
								}) : items.map((it) => {
									const key = `${t.key}::${it.id}`;
									const checked = selectedSet.has(key);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: `flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/40 ${checked ? "bg-primary/5" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked,
											onCheckedChange: () => toggle(t.key, it.id)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium truncate",
												children: it[t.nameField] ?? it.name
											}), it.slug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground truncate",
												children: it.slug
											})]
										})]
									}, it.id);
								})
							})]
						})
					}, t.key);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Selected items require this tier's rank or higher. Categories gate every product/course tagged to them."
			})
		]
	});
}
function Page() {
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [access, setAccess] = (0, import_react.useState)([]);
	const save = useServerFn(upsertTier);
	const saveAccess = useServerFn(saveTierAccessSelections);
	const del = useServerFn(deleteTier);
	const { data: tiers = [], isLoading, error } = useQuery({
		queryKey: ["admin-tiers"],
		queryFn: async () => {
			const { data, error } = await supabase.from("membership_tiers").select("*").order("rank");
			if (error) throw error;
			return data;
		}
	});
	function openEditor(t) {
		setAccess([]);
		setEditing(t);
	}
	async function handleSave() {
		if (!editing) return;
		try {
			await save({ data: {
				...editing,
				features: editing.features ?? []
			} });
			await saveAccess({ data: {
				tier_rank: editing.rank,
				selections: access
			} });
			toast.success("Tier saved");
			setEditing(null);
			qc.invalidateQueries({ queryKey: ["admin-tiers"] });
		} catch (e) {
			toast.error(e.message);
		}
	}
	async function handleDelete(id) {
		if (!confirm("Delete this tier?")) return;
		try {
			await del({ data: { id } });
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["admin-tiers"] });
		} catch (e) {
			toast.error(e.message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 sm:p-6 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-6 w-6 text-amber-500" }), " Membership Tiers"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Configure plans, pricing, and content access per tier."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/memberships/users",
							children: "Manage Users"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => openEditor({
							slug: "",
							name: "",
							rank: 1,
							color: "#6366f1",
							gradient_from: "#6366f1",
							gradient_to: "#8b5cf6",
							price_inr: 0,
							duration_days: 30,
							features: [],
							description: "",
							is_active: true,
							sort_order: 0
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " New tier"]
					})]
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive",
				children: error.message
			}) : null,
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "Loading…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: tiers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border p-4 space-y-3 bg-card relative overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-x-0 top-0 h-1",
							style: { background: `linear-gradient(90deg, ${t.gradient_from}, ${t.gradient_to})` }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembershipBadge, {
								slug: t.slug,
								name: t.name,
								gradientFrom: t.gradient_from,
								gradientTo: t.gradient_to,
								size: "lg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: ["Rank ", t.rank]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground min-h-[2.5rem]",
							children: t.description || "No description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-lg",
								children: ["₹", Number(t.price_inr).toLocaleString()]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: t.duration_days ? `${t.duration_days} days` : "Lifetime"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "text-xs text-muted-foreground space-y-0.5",
							children: (t.features ?? []).slice(0, 4).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", f] }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "flex-1",
								onClick: () => openEditor({
									...t,
									features: t.features ?? []
								}),
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => handleDelete(t.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-red-500" })
							})]
						})
					]
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editing,
				onOpenChange: (o) => !o && setEditing(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [editing?.id ? "Edit tier" : "New tier", editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembershipBadge, {
								slug: editing.slug || "custom",
								name: editing.name || "Preview",
								gradientFrom: editing.gradient_from,
								gradientTo: editing.gradient_to,
								size: "sm"
							})]
						}) }),
						editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							defaultValue: "basic",
							className: "w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "grid grid-cols-4 w-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "basic",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4 mr-1.5" }), "Basic"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "design",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-4 w-4 mr-1.5" }), "Design"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "access",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 mr-1.5" }), "Access"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
											value: "features",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 mr-1.5" }), "Features"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "basic",
									className: "space-y-3 mt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: editing.slug,
													onChange: (e) => setEditing({
														...editing,
														slug: e.target.value
													})
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: editing.name,
													onChange: (e) => setEditing({
														...editing,
														name: e.target.value
													})
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rank (0=lowest)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													value: editing.rank,
													onChange: (e) => setEditing({
														...editing,
														rank: Number(e.target.value)
													})
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sort order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													value: editing.sort_order,
													onChange: (e) => setEditing({
														...editing,
														sort_order: Number(e.target.value)
													})
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price (INR)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													value: editing.price_inr,
													onChange: (e) => setEditing({
														...editing,
														price_inr: Number(e.target.value)
													})
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duration (days, blank=lifetime)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													value: editing.duration_days ?? "",
													onChange: (e) => setEditing({
														...editing,
														duration_days: e.target.value ? Number(e.target.value) : null
													})
												})] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: editing.description ?? "",
											onChange: (e) => setEditing({
												...editing,
												description: e.target.value
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
												checked: editing.is_active,
												onCheckedChange: (v) => setEditing({
													...editing,
													is_active: v
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "design",
									className: "space-y-3 mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gradient from" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "color",
											value: editing.gradient_from,
											onChange: (e) => setEditing({
												...editing,
												gradient_from: e.target.value,
												color: e.target.value
											})
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gradient to" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "color",
											value: editing.gradient_to,
											onChange: (e) => setEditing({
												...editing,
												gradient_to: e.target.value
											})
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl p-6 text-white text-center shadow-lg",
										style: { background: `linear-gradient(135deg, ${editing.gradient_from}, ${editing.gradient_to})` },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs uppercase tracking-wider opacity-80",
												children: "Preview"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-2xl font-bold mt-1",
												children: editing.name || "Tier name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-sm opacity-90 mt-1",
												children: [
													"₹",
													Number(editing.price_inr).toLocaleString(),
													" · ",
													editing.duration_days ? `${editing.duration_days} days` : "Lifetime"
												]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "access",
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierAccessTab, {
										tierRank: editing.rank,
										value: access,
										onChange: setAccess
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "features",
									className: "space-y-3 mt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Features (one per line, shown on the pricing card)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											rows: 10,
											value: (editing.features ?? []).join("\n"),
											onChange: (e) => setEditing({
												...editing,
												features: e.target.value.split("\n").filter(Boolean)
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border p-4 bg-muted/30",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-medium mb-2 text-muted-foreground",
												children: "Preview"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "space-y-1 text-sm",
												children: (editing.features ?? []).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }), f]
												}, i))
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setEditing(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleSave,
							children: "Save tier"
						})] })
					]
				})
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Membership Tiers",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
