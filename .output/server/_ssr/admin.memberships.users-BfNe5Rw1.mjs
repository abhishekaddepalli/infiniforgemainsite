import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { u as Users } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { c as listMembershipAssignableUsers, d as listUserMemberships, p as revokeMembership, t as assignMembership } from "./memberships.functions-C2eeCH5c.mjs";
import { t as MembershipBadge } from "./MembershipBadge-vyy4IIJ-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.memberships.users-BfNe5Rw1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const list = useServerFn(listUserMemberships);
	const listUsers = useServerFn(listMembershipAssignableUsers);
	const assign = useServerFn(assignMembership);
	const revoke = useServerFn(revokeMembership);
	const [assigning, setAssigning] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		tier_id: "",
		starts_at: "",
		expires_at: "",
		notes: ""
	});
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["admin-user-memberships"],
		queryFn: async () => await list()
	});
	const { data: tiers = [] } = useQuery({
		queryKey: ["tier-options"],
		queryFn: async () => (await supabase.from("membership_tiers").select("id,name,rank,slug,duration_days").order("rank")).data ?? []
	});
	const { data: users = [] } = useQuery({
		queryKey: ["all-profiles"],
		queryFn: async () => await listUsers()
	});
	async function submitAssign() {
		if (!assigning || !form.tier_id) return;
		try {
			await assign({ data: {
				user_id: assigning.user_id,
				tier_id: form.tier_id,
				starts_at: form.starts_at || null,
				expires_at: form.expires_at || null,
				notes: form.notes
			} });
			toast.success("Membership assigned");
			setAssigning(null);
			setForm({
				tier_id: "",
				starts_at: "",
				expires_at: "",
				notes: ""
			});
			qc.invalidateQueries({ queryKey: ["admin-user-memberships"] });
		} catch (e) {
			toast.error(e.message);
		}
	}
	async function handleRevoke(id) {
		if (!confirm("Revoke this membership?")) return;
		try {
			await revoke({ data: { membership_id: id } });
			toast.success("Revoked");
			qc.invalidateQueries({ queryKey: ["admin-user-memberships"] });
		} catch (e) {
			toast.error(e.message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 sm:p-6 space-y-4 min-w-0 max-w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-xl sm:text-2xl font-bold flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6 shrink-0" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 break-words",
							children: "User Memberships"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/memberships",
						children: "Back to tiers"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold mb-2",
					children: "Assign membership"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					onValueChange: (v) => {
						const u = users.find((x) => x.id === v);
						setAssigning({
							user_id: v,
							name: u?.full_name ?? void 0,
							email: u?.email ?? void 0
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pick a user…" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
						className: "max-h-72",
						children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: u.id,
							children: u.full_name || u.email || u.id
						}, u.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "min-w-[860px] w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary/50 text-xs uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left p-3",
								children: "User"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left p-3",
								children: "Tier"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left p-3",
								children: "Source"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left p-3",
								children: "Starts"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left p-3",
								children: "Expires"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-left p-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right p-3",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "p-4 text-center text-muted-foreground",
						children: "Loading…"
					}) }) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium break-words",
									children: r.profile?.full_name || "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground break-all",
									children: r.profile?.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: r.tier ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembershipBadge, {
									slug: r.tier.slug,
									name: r.tier.name
								}) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 capitalize",
								children: r.source
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-xs",
								children: new Date(r.starts_at).toLocaleDateString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-xs",
								children: r.expires_at ? new Date(r.expires_at).toLocaleString() : "Lifetime"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: r.status === "active" ? "text-emerald-500" : "text-muted-foreground",
									children: r.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-right",
								children: r.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => handleRevoke(r.id),
									children: "Revoke"
								})
							})
						]
					}, r.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!assigning,
				onOpenChange: (o) => !o && setAssigning(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Assign to ", assigning?.name ?? assigning?.email] }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tier" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.tier_id,
								onValueChange: (v) => {
									const t = tiers.find((x) => x.id === v);
									const exp = t?.duration_days ? new Date(Date.now() + t.duration_days * 864e5).toISOString().slice(0, 16) : "";
									setForm({
										...form,
										tier_id: v,
										expires_at: exp
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pick a tier…" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: tiers.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: t.id,
									children: [
										t.name,
										" (rank ",
										t.rank,
										")"
									]
								}, t.id)) })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Starts at" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "datetime-local",
									value: form.starts_at,
									onChange: (e) => setForm({
										...form,
										starts_at: e.target.value
									})
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Expires at" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "datetime-local",
									value: form.expires_at,
									onChange: (e) => setForm({
										...form,
										expires_at: e.target.value
									})
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.notes,
								onChange: (e) => setForm({
									...form,
									notes: e.target.value
								})
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setAssigning(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: submitAssign,
						children: "Assign"
					})] })
				] })
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "User Memberships",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
