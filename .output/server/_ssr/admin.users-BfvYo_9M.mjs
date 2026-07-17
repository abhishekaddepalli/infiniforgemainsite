import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { An as ChevronRight, Pt as KeyRound, R as ShieldCheck, Sn as Clock, St as Mail, U as Search, Zt as Funnel, b as Trash2, f as UserPlus, fn as Download, u as Users, un as Ellipsis } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CDoe66ii.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as downloadCsv } from "./download-DhKjMGgD.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as ROLE_TONE_CLASS, i as ROLES } from "./rbac-DxfTD6GS.mjs";
import { n as deleteUser, r as inviteUser, t as adminSetPassword } from "./admin-users.functions-BqAIPDmH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users-BfvYo_9M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UsersPage() {
	const qc = useQueryClient();
	const [query, setQuery] = (0, import_react.useState)("");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [inviteOpen, setInviteOpen] = (0, import_react.useState)(false);
	const [pwUser, setPwUser] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const invite = useServerFn(inviteUser);
	const doDelete = useServerFn(deleteUser);
	const setPw = useServerFn(adminSetPassword);
	const { data: profiles = [], isLoading } = useQuery({
		queryKey: ["profiles"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const { data: rolesData = [] } = useQuery({
		queryKey: ["user_roles_all"],
		queryFn: async () => {
			const { data, error } = await supabase.from("user_roles").select("user_id, role");
			if (error) throw error;
			return data;
		}
	});
	const rolesByUser = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		rolesData.forEach((r) => {
			const arr = map.get(r.user_id) ?? [];
			arr.push(r.role);
			map.set(r.user_id, arr);
		});
		return map;
	}, [rolesData]);
	function primaryRole(userId) {
		const rs = rolesByUser.get(userId) ?? ["customer"];
		if (rs.includes("super_admin")) return "super_admin";
		if (rs.includes("admin")) return "admin";
		return rs[0] ?? "customer";
	}
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return profiles.filter((u) => {
			const role = primaryRole(u.id);
			if (roleFilter !== "all" && role !== roleFilter) return false;
			if (statusFilter !== "all" && u.status !== statusFilter) return false;
			if (q && !((u.full_name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q))) return false;
			return true;
		});
	}, [
		profiles,
		query,
		roleFilter,
		statusFilter,
		rolesByUser
	]);
	const stats = (0, import_react.useMemo)(() => ({
		total: profiles.length,
		staff: profiles.filter((p) => [
			"super_admin",
			"admin",
			"sales_manager",
			"support",
			"finance",
			"employee"
		].includes(primaryRole(p.id))).length,
		customers: profiles.filter((p) => primaryRole(p.id) === "customer").length,
		active: profiles.filter((p) => p.status === "active").length
	}), [profiles, rolesByUser]);
	const updateRole = useMutation({
		mutationFn: async ({ userId, role }) => {
			await supabase.from("user_roles").delete().eq("user_id", userId);
			const toInsert = [{
				user_id: userId,
				role
			}];
			if (role !== "customer") toInsert.push({
				user_id: userId,
				role: "customer"
			});
			const { error } = await supabase.from("user_roles").insert(toInsert);
			if (error) throw error;
			await logAudit({
				action: "role.assign",
				resource: "users",
				resource_id: userId,
				target_user_id: userId,
				details: { role }
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["user_roles_all"] });
			toast.success("Role updated");
		},
		onError: (e) => toast.error(e.message)
	});
	const updateStatus = useMutation({
		mutationFn: async ({ userId, status }) => {
			const { error } = await supabase.from("profiles").update({ status }).eq("id", userId);
			if (error) throw error;
			await logAudit({
				action: "status.change",
				resource: "users",
				resource_id: userId,
				target_user_id: userId,
				details: { status }
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["profiles"] });
			toast.success("Status updated");
		},
		onError: (e) => toast.error(e.message)
	});
	const saveEdit = useMutation({
		mutationFn: async (p) => {
			const { error } = await supabase.from("profiles").update({
				full_name: p.full_name,
				phone: p.phone,
				location: p.location,
				two_fa_enabled: p.two_fa_enabled
			}).eq("id", p.id);
			if (error) throw error;
			await logAudit({
				action: "update",
				resource: "users",
				resource_id: p.id,
				target_user_id: p.id,
				details: { full_name: p.full_name }
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["profiles"] });
			setEditing(null);
			toast.success("Profile saved");
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Users" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6 text-primary" }), " User Management"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1 max-w-2xl",
					children: "Assign roles, invite new team members, control 2FA and suspend accounts. All 9 roles supported."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => {
						downloadCsv([[
							"Name",
							"Email",
							"Phone",
							"Role",
							"Status",
							"2FA",
							"Created"
						], ...filtered.map((u) => [
							u.full_name ?? "",
							u.email ?? "",
							u.phone ?? "",
							primaryRole(u.id),
							u.status,
							u.two_fa_enabled ? "yes" : "no",
							new Date(u.created_at).toLocaleDateString("en-IN")
						])], `infiniforge-users-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
						toast.success(`Exported ${filtered.length} users`);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1.5" }), " Export"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "bg-gradient-brand text-white",
					onClick: () => setInviteOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5 mr-1.5" }), " Invite user"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					icon: Users,
					label: "Total users",
					value: stats.total,
					hint: "Across every role"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					icon: ShieldCheck,
					label: "Staff",
					value: stats.staff,
					hint: "Internal team members"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					icon: Users,
					label: "Customers",
					value: stats.customers,
					hint: "End users"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					icon: Clock,
					label: "Active",
					value: stats.active,
					hint: "Currently active"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-stretch gap-3 p-4 border-b border-border sm:flex-row sm:flex-wrap sm:items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1 sm:flex-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search…",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							className: "pl-9 h-9 w-full sm:w-64"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "hidden h-4 w-4 text-muted-foreground sm:block" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: roleFilter,
						onValueChange: (v) => setRoleFilter(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-full sm:w-[180px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Role" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All roles"
						}), ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: r.key,
							children: r.name
						}, r.key))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-full sm:w-[160px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "suspended",
								children: "Suspended"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "invited",
								children: "Invited"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground sm:ml-auto",
						children: [
							"Showing ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: filtered.length
							}),
							" of ",
							profiles.length
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "min-w-[900px] w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 font-medium",
								children: "User"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Role"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "2FA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Location"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Joined"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "pl-3 pr-5 py-3 font-medium w-10" })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border",
						children: [
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "p-10 text-center text-muted-foreground",
								children: "Loading users…"
							}) }),
							!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "p-10 text-center text-muted-foreground",
								children: "No users match your filters."
							}) }),
							filtered.map((u) => {
								const role = primaryRole(u.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-secondary/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0", ROLE_TONE_CLASS[ROLES.find((r) => r.key === role).tone]),
													children: (u.full_name ?? u.email ?? "?").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-medium truncate",
														children: u.full_name ?? "—"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-xs text-muted-foreground flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3 shrink-0" }),
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "break-all",
																children: u.email
															})
														]
													})]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: role,
												onValueChange: (v) => updateRole.mutate({
													userId: u.id,
													role: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 w-[160px]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: r.key,
													children: r.name
												}, r.key)) })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: u.status,
												onValueChange: (v) => updateStatus.mutate({
													userId: u.id,
													status: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 w-[130px]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "active",
														children: "Active"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "suspended",
														children: "Suspended"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "invited",
														children: "Invited"
													})
												] })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: u.two_fa_enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-accent/15 text-accent border-0",
												children: "Enabled"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												children: "Off"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3 text-xs text-muted-foreground",
											children: u.location ?? "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3 text-xs text-muted-foreground",
											children: new Date(u.created_at).toLocaleDateString("en-IN")
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
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
														onClick: () => setEditing(u),
														children: "Edit profile"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => setPwUser(u),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-3.5 w-3.5 mr-2" }), " Change password"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
														onClick: () => updateStatus.mutate({
															userId: u.id,
															status: u.status === "suspended" ? "active" : "suspended"
														}),
														children: u.status === "suspended" ? "Reactivate" : "Suspend"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														className: "text-destructive focus:text-destructive",
														onClick: () => setDeleteTarget(u),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 mr-2" }), " Delete user"]
													})
												]
											})] })
										})
									]
								}, u.id);
							})
						]
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editing,
			onOpenChange: (v) => !v && setEditing(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit profile" }) }), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					saveEdit.mutate(editing);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.full_name ?? "",
						onChange: (e) => setEditing({
							...editing,
							full_name: e.target.value
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.phone ?? "",
						onChange: (e) => setEditing({
							...editing,
							phone: e.target.value
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editing.location ?? "",
						onChange: (e) => setEditing({
							...editing,
							location: e.target.value
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: editing.two_fa_enabled,
							onChange: (e) => setEditing({
								...editing,
								two_fa_enabled: e.target.checked
							})
						}), "Require Two-Factor Authentication"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => setEditing(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "bg-gradient-brand text-white",
						disabled: saveEdit.isPending,
						children: saveEdit.isPending ? "Saving…" : "Save"
					})] })
				]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteDialog, {
			open: inviteOpen,
			onOpenChange: setInviteOpen,
			onInvite: async (payload) => {
				try {
					await invite({ data: payload });
					toast.success(`Invitation sent to ${payload.email}`);
					qc.invalidateQueries({ queryKey: ["profiles"] });
					qc.invalidateQueries({ queryKey: ["user_roles_all"] });
					setInviteOpen(false);
				} catch (e) {
					toast.error(e instanceof Error ? e.message : "Invite failed");
				}
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordDialog, {
			user: pwUser,
			onOpenChange: (v) => !v && setPwUser(null),
			onSubmit: async (password) => {
				if (!pwUser) return;
				try {
					await setPw({ data: {
						userId: pwUser.id,
						password
					} });
					toast.success("Password updated");
					await logAudit({
						action: "password.reset",
						resource: "users",
						resource_id: pwUser.id,
						target_user_id: pwUser.id
					});
					setPwUser(null);
				} catch (e) {
					toast.error(e instanceof Error ? e.message : "Failed");
				}
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!deleteTarget,
			onOpenChange: (v) => !v && setDeleteTarget(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Delete user?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				"This permanently removes ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: deleteTarget?.full_name ?? deleteTarget?.email }),
				" and all their account access. This cannot be undone."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setDeleteTarget(null),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "destructive",
				onClick: async () => {
					if (!deleteTarget) return;
					try {
						await doDelete({ data: { userId: deleteTarget.id } });
						await logAudit({
							action: "delete",
							resource: "users",
							resource_id: deleteTarget.id,
							target_user_id: deleteTarget.id
						});
						toast.success("User deleted");
						qc.invalidateQueries({ queryKey: ["profiles"] });
						qc.invalidateQueries({ queryKey: ["user_roles_all"] });
						setDeleteTarget(null);
					} catch (e) {
						toast.error(e instanceof Error ? e.message : "Delete failed");
					}
				},
				children: "Delete permanently"
			})] })] })
		})
	] });
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
				children: value.toLocaleString("en-IN")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function InviteDialog({ open, onOpenChange, onInvite }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("customer");
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Invite user" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "They'll receive an email to set their password and sign in." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: async (e) => {
				e.preventDefault();
				setBusy(true);
				try {
					await onInvite({
						email: email.trim(),
						full_name: name.trim(),
						role
					});
					setEmail("");
					setName("");
					setRole("customer");
				} finally {
					setBusy(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					required: true,
					value: email,
					onChange: (e) => setEmail(e.target.value),
					className: "mt-1.5",
					placeholder: "user@company.com"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					className: "mt-1.5",
					placeholder: "Optional"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: role,
					onValueChange: (v) => setRole(v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "mt-1.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: r.key,
						children: r.name
					}, r.key)) })]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "bg-gradient-brand text-white",
					disabled: busy || !email,
					children: busy ? "Sending…" : "Send invite"
				})] })
			]
		})] })
	});
}
function PasswordDialog({ user, onOpenChange, onSubmit }) {
	const [pw, setPw] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!user,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Set new password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
			"Set a password for ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: user?.full_name ?? user?.email }),
			". They'll use it on next sign in."
		] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: async (e) => {
				e.preventDefault();
				setBusy(true);
				try {
					await onSubmit(pw);
					setPw("");
				} finally {
					setBusy(false);
				}
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "password",
				required: true,
				minLength: 8,
				value: pw,
				onChange: (e) => setPw(e.target.value),
				className: "mt-1.5",
				placeholder: "Min 8 characters"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				onClick: () => onOpenChange(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "bg-gradient-brand text-white",
				disabled: busy || pw.length < 8,
				children: busy ? "Updating…" : "Set password"
			})] })]
		})] })
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Users",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersPage, {})
});
//#endregion
export { SplitComponent as component };
