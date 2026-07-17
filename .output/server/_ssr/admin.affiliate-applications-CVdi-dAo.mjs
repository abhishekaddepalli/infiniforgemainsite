import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Gt as Handshake, Nn as Check, Sn as Clock, St as Mail, U as Search, j as Sparkles, m as UserCheck, qt as Globe, r as X } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.affiliate-applications-CVdi-dAo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AffiliateApplicationsPage() {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("pending");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [denyOpen, setDenyOpen] = (0, import_react.useState)(null);
	const [denyReason, setDenyReason] = (0, import_react.useState)("");
	const [customCommission, setCustomCommission] = (0, import_react.useState)("15");
	const [adminNote, setAdminNote] = (0, import_react.useState)("");
	const { data: apps = [], isLoading } = useQuery({
		queryKey: ["aff-apps"],
		queryFn: async () => {
			const { data } = await supabase.from("module_records").select("*").eq("module", "affiliate_applications").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		return apps.filter((a) => {
			if (tab !== "all" && a.status !== tab) return false;
			if (!q) return true;
			return `${a.title} ${a.subtitle} ${JSON.stringify(a.metadata)}`.toLowerCase().includes(q.toLowerCase());
		});
	}, [
		apps,
		q,
		tab
	]);
	const counts = (0, import_react.useMemo)(() => ({
		pending: apps.filter((a) => a.status === "pending").length,
		approved: apps.filter((a) => a.status === "approved").length,
		denied: apps.filter((a) => a.status === "denied").length,
		all: apps.length
	}), [apps]);
	const approve = useMutation({
		mutationFn: async ({ app, commission, note }) => {
			if (!app.customer_id) throw new Error("No customer id");
			const { error: rerr } = await supabase.from("user_roles").insert({
				user_id: app.customer_id,
				role: "affiliate"
			}).select();
			if (rerr && !`${rerr.message}`.toLowerCase().includes("duplicate")) throw rerr;
			const { error } = await supabase.from("module_records").update({
				status: "approved",
				amount_inr: commission,
				metadata: {
					...app.metadata ?? {},
					approved_at: (/* @__PURE__ */ new Date()).toISOString(),
					commission_percent: commission,
					admin_note: note
				}
			}).eq("id", app.id);
			if (error) throw error;
			await logAudit({
				action: "role.assign",
				resource: "roles",
				target_user_id: app.customer_id,
				details: {
					role: "affiliate",
					commission
				}
			});
		},
		onSuccess: () => {
			toast.success("Affiliate approved");
			setSelected(null);
			qc.invalidateQueries({ queryKey: ["aff-apps"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const deny = useMutation({
		mutationFn: async ({ app, reason }) => {
			const { error } = await supabase.from("module_records").update({
				status: "denied",
				metadata: {
					...app.metadata ?? {},
					denial_reason: reason,
					denied_at: (/* @__PURE__ */ new Date()).toISOString()
				}
			}).eq("id", app.id);
			if (error) throw error;
			await logAudit({
				action: "status.change",
				resource: "users",
				target_user_id: app.customer_id,
				details: {
					affiliate_denied: true,
					reason
				}
			});
		},
		onSuccess: () => {
			toast.success("Application denied");
			setDenyOpen(null);
			setDenyReason("");
			qc.invalidateQueries({ queryKey: ["aff-apps"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const statusTone = (s) => s === "approved" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : s === "pending" ? "bg-amber-500/15 text-amber-500 border-amber-500/30" : "bg-rose-500/15 text-rose-500 border-rose-500/30";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Affiliate Applications",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-start justify-between gap-4 flex-wrap",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl font-bold tracking-tight flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-6 w-6 text-primary" }), " Affiliate Applications"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Review, approve or deny partner applications. Approving assigns the affiliate role automatically."
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-4",
					children: [
						[
							"pending",
							"Pending",
							Clock
						],
						[
							"approved",
							"Approved",
							Check
						],
						[
							"denied",
							"Denied",
							X
						],
						[
							"all",
							"Total",
							Sparkles
						]
					].map(([k, l, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setTab(k),
						className: `rounded-xl border p-4 text-left transition ${tab === k ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: l
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold mt-1",
							children: counts[k]
						})]
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search applicant, channel…",
							className: "pl-9"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card overflow-hidden",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-10 text-center text-sm text-muted-foreground",
						children: "Loading…"
					}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-10 text-center text-sm text-muted-foreground",
						children: [
							"No ",
							tab === "all" ? "" : tab,
							" applications."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border",
						children: filtered.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 flex items-center gap-4 hover:bg-secondary/40 cursor-pointer",
							onClick: () => {
								setSelected(a);
								setCustomCommission(String(a.metadata?.commission_percent ?? 15));
								setAdminNote(a.metadata?.admin_note ?? "");
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "h-5 w-5 text-primary" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold truncate",
										children: a.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground truncate flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
											" ",
											a.metadata?.email ?? "—",
											a.metadata?.website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3 ml-2" }),
												" ",
												a.metadata.website
											] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `capitalize ${statusTone(a.status)}`,
									children: a.status
								})
							]
						}, a.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!selected,
					onOpenChange: (o) => !o && setSelected(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
						className: "max-w-2xl max-h-[90vh] overflow-y-auto",
						children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "h-5 w-5 text-primary" }),
									" ",
									selected.title
								]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-3 sm:grid-cols-2 text-sm",
									children: [
										"email",
										"audience",
										"channels",
										"website",
										"social",
										"experience",
										"expected_monthly_referrals",
										"payout_method",
										"payout_identifier"
									].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] uppercase tracking-wide text-muted-foreground",
											children: k.replace(/_/g, " ")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm",
											children: selected.metadata?.[k] || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground italic",
												children: "—"
											})
										})]
									}, k))
								}), selected.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-primary/30 bg-primary/[0.04] p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-semibold",
											children: "Approval settings"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid gap-3 sm:grid-cols-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Commission %"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: customCommission,
												onChange: (e) => setCustomCommission(e.target.value)
											})] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Internal note (optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											rows: 2,
											value: adminNote,
											onChange: (e) => setAdminNote(e.target.value),
											placeholder: "Any custom rules or notes for this partner…"
										})] })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
								className: "gap-2",
								children: selected.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => {
										setDenyOpen(selected);
										setSelected(null);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 mr-1.5" }), " Deny"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => approve.mutate({
										app: selected,
										commission: Number(customCommission) || 15,
										note: adminNote
									}),
									disabled: approve.isPending,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 mr-1.5" }), " Approve & assign role"]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setSelected(null),
									children: "Close"
								})
							})
						] })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!denyOpen,
					onOpenChange: (o) => !o && setDenyOpen(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Deny application" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Reason (shown to applicant)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: denyReason,
								onChange: (e) => setDenyReason(e.target.value),
								placeholder: "e.g. Audience doesn't match our target segment."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setDenyOpen(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							onClick: () => denyOpen && deny.mutate({
								app: denyOpen,
								reason: denyReason || "Application not approved."
							}),
							disabled: deny.isPending,
							children: "Deny"
						})] })
					] })
				})
			]
		})
	});
}
//#endregion
export { AffiliateApplicationsPage as component };
