import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { An as ChevronRight, Et as LoaderCircle, R as ShieldCheck, U as Search, b as Trash2, f as UserPlus, u as Users } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as downloadCsv } from "./download-DhKjMGgD.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as ROLE_TONE_CLASS, i as ROLES } from "./rbac-DxfTD6GS.mjs";
import { n as deleteUser, r as inviteUser } from "./admin-users.functions-BqAIPDmH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.employees-3bhQ2L9m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_MAP = Object.fromEntries(ROLES.map((r) => [r.key, r]));
var STAFF_ROLES = [
	"super_admin",
	"admin",
	"sales_manager",
	"support",
	"finance",
	"employee"
];
function EmployeesPage() {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [invite, setInvite] = (0, import_react.useState)(null);
	const [addRoleFor, setAddRoleFor] = (0, import_react.useState)(null);
	const inviteFn = useServerFn(inviteUser);
	const delFn = useServerFn(deleteUser);
	const { data: rolesData = [] } = useQuery({
		queryKey: ["staff-user-roles"],
		queryFn: async () => (await supabase.from("user_roles").select("user_id, role").in("role", STAFF_ROLES)).data ?? []
	});
	const staffIds = (0, import_react.useMemo)(() => [...new Set(rolesData.map((r) => r.user_id))], [rolesData]);
	const { data: profiles = [] } = useQuery({
		queryKey: ["staff-profiles", staffIds.join(",")],
		enabled: staffIds.length > 0,
		queryFn: async () => (await supabase.from("profiles").select("id, full_name, email, phone, status, created_at").in("id", staffIds)).data ?? []
	});
	const rolesByUser = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		rolesData.forEach((r) => {
			const a = m.get(r.user_id) ?? [];
			a.push(r.role);
			m.set(r.user_id, a);
		});
		return m;
	}, [rolesData]);
	const rows = (0, import_react.useMemo)(() => profiles.map((p) => ({
		...p,
		roles: rolesByUser.get(p.id) ?? []
	})).filter((p) => {
		if (filter !== "all" && !p.roles.includes(filter)) return false;
		if (!q) return true;
		return (p.full_name ?? "").toLowerCase().includes(q.toLowerCase()) || (p.email ?? "").toLowerCase().includes(q.toLowerCase());
	}), [
		profiles,
		rolesByUser,
		filter,
		q
	]);
	const stats = (0, import_react.useMemo)(() => {
		const s = { total: profiles.length };
		STAFF_ROLES.forEach((r) => {
			s[r] = 0;
		});
		rolesByUser.forEach((rs) => rs.forEach((r) => {
			s[r] = (s[r] ?? 0) + 1;
		}));
		return s;
	}, [profiles, rolesByUser]);
	const addRole = useMutation({
		mutationFn: async ({ id, role }) => {
			const { error } = await supabase.from("user_roles").insert({
				user_id: id,
				role
			});
			if (error) throw error;
			await logAudit({
				action: "role.assign",
				resource: "roles",
				resource_id: id,
				details: { role }
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["staff-user-roles"] });
			setAddRoleFor(null);
			toast.success("Role added");
		},
		onError: (e) => toast.error(e.message)
	});
	const removeRole = useMutation({
		mutationFn: async ({ id, role }) => {
			const { error } = await supabase.from("user_roles").delete().eq("user_id", id).eq("role", role);
			if (error) throw error;
			await logAudit({
				action: "role.remove",
				resource: "roles",
				resource_id: id,
				details: { role }
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["staff-user-roles"] });
			toast.success("Role removed");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Employees" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6 text-primary" }), " Team & Employees"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Manage internal staff — Admins, Sales, Support, Finance, Employees."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => downloadCsv([[
						"Name",
						"Email",
						"Phone",
						"Roles",
						"Status",
						"Joined"
					], ...rows.map((r) => [
						r.full_name ?? "",
						r.email ?? "",
						r.phone ?? "",
						r.roles.join("|"),
						r.status ?? "",
						r.created_at
					])], "employees.csv"),
					children: "Export CSV"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "bg-gradient-brand text-white",
					onClick: () => setInvite({
						email: "",
						full_name: "",
						role: "employee"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5 mr-1.5" }), " Invite team member"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Total staff",
				value: stats.total
			}), STAFF_ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: ROLE_MAP[r]?.name ?? r,
				value: stats[r] ?? 0
			}, r))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-stretch gap-3 p-4 border-b border-border sm:flex-row sm:flex-wrap sm:items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1 sm:flex-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search name or email…",
							value: q,
							onChange: (e) => setQ(e.target.value),
							className: "pl-9 h-9 w-full sm:w-72"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: filter,
						onValueChange: (v) => setFilter(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-full sm:w-[180px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All staff roles"
						}), STAFF_ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r,
							children: ROLE_MAP[r]?.name ?? r
						}, r))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground sm:ml-auto",
						children: [
							rows.length,
							" of ",
							profiles.length
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
								children: "Employee"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Contact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Roles"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Joined"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-right",
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border",
						children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "p-10 text-center text-muted-foreground",
							children: "No staff yet — invite your first team member."
						}) }), rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-secondary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: p.full_name ?? "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground font-mono",
										children: p.id.slice(0, 8)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "break-all",
										children: p.email
									}), p.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground",
										children: p.phone
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1",
										children: [p.roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											className: cn("gap-1 capitalize", ROLE_TONE_CLASS[ROLE_MAP[r]?.tone ?? "slate"]),
											children: [ROLE_MAP[r]?.name ?? r, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => removeRole.mutate({
													id: p.id,
													role: r
												}),
												className: "ml-1 opacity-70 hover:opacity-100",
												children: "×"
											})]
										}, r)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-6 px-2 text-[10px]",
											onClick: () => setAddRoleFor({
												id: p.id,
												role: "employee"
											}),
											children: "+ Add role"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: p.status === "active" ? "default" : "outline",
										className: "capitalize",
										children: p.status ?? "active"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-xs text-muted-foreground",
									children: new Date(p.created_at).toLocaleDateString("en-IN")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										className: "text-destructive",
										onClick: async () => {
											if (!confirm(`Remove ${p.full_name ?? p.email} completely?`)) return;
											try {
												await delFn({ data: { userId: p.id } });
												toast.success("Deleted");
												qc.invalidateQueries({ queryKey: ["staff-user-roles"] });
											} catch (e) {
												toast.error(e instanceof Error ? e.message : "Failed");
											}
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								})
							]
						}, p.id))]
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!invite,
			onOpenChange: (v) => !v && setInvite(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), " Invite team member"]
			}) }), invite && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: async (e) => {
					e.preventDefault();
					try {
						await inviteFn({ data: invite });
						toast.success("Invitation sent");
						setInvite(null);
						qc.invalidateQueries({ queryKey: ["staff-user-roles"] });
					} catch (err) {
						toast.error(err instanceof Error ? err.message : "Failed");
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: invite.full_name,
						onChange: (e) => setInvite({
							...invite,
							full_name: e.target.value
						}),
						className: "mt-1.5",
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Work email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: invite.email,
						onChange: (e) => setInvite({
							...invite,
							email: e.target.value
						}),
						className: "mt-1.5",
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: invite.role,
						onValueChange: (v) => setInvite({
							...invite,
							role: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "mt-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STAFF_ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r,
							children: ROLE_MAP[r]?.name ?? r
						}, r)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "bg-gradient-brand text-white",
						children: "Send invite"
					}) })
				]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!addRoleFor,
			onOpenChange: (v) => !v && setAddRoleFor(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add role" }) }), addRoleFor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: addRoleFor.role,
					onValueChange: (v) => setAddRoleFor({
						...addRoleFor,
						role: v
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STAFF_ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r,
						children: ROLE_MAP[r]?.name ?? r
					}, r)) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "bg-gradient-brand text-white",
					disabled: addRole.isPending,
					onClick: () => addRole.mutate(addRoleFor),
					children: addRole.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Add role"
				}) })]
			})] })
		})
	] });
}
function StatCard({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wider text-muted-foreground truncate",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xl font-bold mt-1",
			children: value
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Employees",
	requiredRoles: ["super_admin", "admin"],
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesPage, {})
});
//#endregion
export { SplitComponent as component };
