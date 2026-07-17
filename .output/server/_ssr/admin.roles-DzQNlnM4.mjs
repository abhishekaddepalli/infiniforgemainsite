import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { An as ChevronRight, G as Save, J as RotateCcw, L as Shield, R as ShieldCheck, Tt as Lock, U as Search, b as Trash2, rt as Plus, u as Users, vn as Copy } from "../_libs/lucide-react.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Checkbox } from "./checkbox-B1AjkRkB.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
import { a as ROLE_TONE_CLASS, i as ROLES, n as DEFAULT_MATRIX, r as PERMISSION_GROUPS, t as ACTION_LABEL } from "./rbac-DxfTD6GS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.roles-DzQNlnM4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RolesPermissions() {
	const [openNav, setOpenNav] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)("admin");
	const [matrix, setMatrix] = (0, import_react.useState)(() => JSON.parse(JSON.stringify(DEFAULT_MATRIX)));
	const [query, setQuery] = (0, import_react.useState)("");
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const role = ROLES.find((r) => r.key === selected);
	const isSuper = role.key === "super_admin";
	const groups = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return PERMISSION_GROUPS;
		return PERMISSION_GROUPS.map((g) => ({
			...g,
			permissions: g.permissions.filter((p) => p.label.toLowerCase().includes(q) || p.key.toLowerCase().includes(q) || g.label.toLowerCase().includes(q))
		})).filter((g) => g.permissions.length > 0);
	}, [query]);
	const stats = (0, import_react.useMemo)(() => {
		const perms = matrix[selected] ?? {};
		let granted = 0, total = 0;
		for (const g of PERMISSION_GROUPS) for (const p of g.permissions) {
			total += (p.actions ?? ["view"]).length;
			granted += (perms[p.key] ?? []).length;
		}
		return {
			granted,
			total
		};
	}, [matrix, selected]);
	function toggleAction(permKey, action, allActions) {
		if (isSuper) return;
		setDirty(true);
		setMatrix((prev) => {
			const next = {
				...prev,
				[selected]: { ...prev[selected] }
			};
			const current = new Set(next[selected][permKey] ?? []);
			if (current.has(action)) current.delete(action);
			else current.add(action);
			const ordered = allActions.filter((a) => current.has(a));
			if (ordered.length === 0) delete next[selected][permKey];
			else next[selected][permKey] = ordered;
			return next;
		});
	}
	function toggleAllInGroup(groupKey, grant) {
		if (isSuper) return;
		setDirty(true);
		setMatrix((prev) => {
			const next = {
				...prev,
				[selected]: { ...prev[selected] }
			};
			const g = PERMISSION_GROUPS.find((x) => x.key === groupKey);
			for (const p of g.permissions) if (grant) next[selected][p.key] = [...p.actions ?? ["view"]];
			else delete next[selected][p.key];
			return next;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Roles & Permissions",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-3 mb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search permissions…",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						className: "pl-9 h-9 bg-secondary border-transparent"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between flex-wrap gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								className: "hover:text-foreground",
								children: "Dashboard"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Roles & permissions" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-6 w-6 text-primary" }), " Roles & Permissions"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1 max-w-2xl",
						children: "Fine-grained, module-level access control across Infiniforge. Every action can be toggled per role, with system roles safely locked."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => {
							setMatrix(JSON.parse(JSON.stringify(DEFAULT_MATRIX)));
							setDirty(false);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5 mr-1.5" }), " Reset defaults"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "bg-gradient-brand text-white",
						disabled: !dirty,
						onClick: () => setDirty(false),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5 mr-1.5" }), " Save changes"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						icon: Shield,
						label: "Total roles",
						value: String(ROLES.length),
						hint: "2 system, 7 custom"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						icon: Users,
						label: "Assigned users",
						value: ROLES.reduce((s, r) => s + r.users, 0).toLocaleString("en-IN"),
						hint: "Across all roles"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						icon: Lock,
						label: "Permission scopes",
						value: String(PERMISSION_GROUPS.reduce((s, g) => s + g.permissions.length, 0)),
						hint: `${PERMISSION_GROUPS.length} modules`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						icon: ShieldCheck,
						label: `${role.name} coverage`,
						value: `${stats.granted} / ${stats.total}`,
						hint: `${Math.round(stats.granted / stats.total * 100)}% of actions granted`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-w-0 gap-6 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden h-fit min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-5 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-wider text-primary",
							children: "Roles"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-semibold mt-0.5",
							children: "All roles"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "h-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), " New"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-3 space-y-1",
						children: ROLES.map((r) => {
							const active = r.key === selected;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelected(r.key),
								className: cn("w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors border", active ? "bg-secondary border-border shadow-sm" : "border-transparent hover:bg-secondary/60"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("h-9 w-9 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold", ROLE_TONE_CLASS[r.tone]),
										children: r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-semibold truncate",
												children: r.name
											}), r.system && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 text-muted-foreground" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-[11px] text-muted-foreground",
											children: [r.users.toLocaleString("en-IN"), " users"]
										})]
									}),
									active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
								]
							}, r.key);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-6 shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-4 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold", ROLE_TONE_CLASS[role.tone]),
										children: role.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "text-xl font-bold",
												children: role.name
											}),
											role.system && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												className: "text-[10px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-2.5 w-2.5 mr-1" }), " System"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												className: "bg-accent/15 text-accent hover:bg-accent/20 text-[10px]",
												children: [role.users.toLocaleString("en-IN"), " users"]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground mt-1 max-w-xl",
										children: role.description
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5 mr-1.5" }), " Duplicate"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										disabled: role.system,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 mr-1.5" }), " Delete"]
									})]
								})]
							}), isSuper && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: "Super Admin has unrestricted access"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground text-xs mt-0.5",
										children: "All permissions are always granted and cannot be reduced. To limit access, assign a different role."
									})]
								})]
							})]
						}),
						groups.map((g) => {
							const total = g.permissions.reduce((s, p) => s + (p.actions ?? ["view"]).length, 0);
							const granted = g.permissions.reduce((s, p) => s + (matrix[selected][p.key]?.length ?? 0), 0);
							const allGranted = granted === total;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-4 p-5 pb-4 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-semibold flex items-center gap-2",
										children: [g.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-normal text-muted-foreground",
											children: [
												"· ",
												granted,
												"/",
												total,
												" actions"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: g.description
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Grant all in module"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: isSuper || allGranted,
											disabled: isSuper,
											onCheckedChange: (v) => toggleAllInGroup(g.key, v)
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "border-t border-border overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "min-w-[760px] w-full text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-5 py-2.5 font-medium",
												children: "Permission"
											}), [
												"view",
												"create",
												"edit",
												"delete",
												"approve",
												"export"
											].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2.5 font-medium text-center w-20",
												children: ACTION_LABEL[a]
											}, a))]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border",
											children: g.permissions.map((p) => {
												const actions = p.actions ?? ["view"];
												const grants = new Set(isSuper ? actions : matrix[selected][p.key] ?? []);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-secondary/30",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "px-5 py-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-medium",
															children: p.label
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[11px] font-mono text-muted-foreground break-all",
															children: p.key
														})]
													}), [
														"view",
														"create",
														"edit",
														"delete",
														"approve",
														"export"
													].map((a) => {
														const available = actions.includes(a);
														const checked = grants.has(a);
														return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-3 py-3 text-center",
															children: available ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
																checked,
																disabled: isSuper,
																onCheckedChange: () => toggleAction(p.key, a, actions),
																"aria-label": `${ACTION_LABEL[a]} ${p.label}`
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground/40 text-xs",
																children: "—"
															})
														}, a);
													})]
												}, p.key);
											})
										})]
									})
								})]
							}, g.key);
						}),
						groups.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground",
							children: [
								"No permissions match \"",
								query,
								"\"."
							]
						})
					]
				})]
			})
		] })
	});
}
function MiniStat({ icon: Icon, label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-8 w-8 rounded-lg bg-secondary flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-2xl font-bold tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { RolesPermissions as component };
