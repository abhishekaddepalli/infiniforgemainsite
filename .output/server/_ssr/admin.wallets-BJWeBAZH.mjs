import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { U as Search, ht as Minus, o as Wallet, rt as Plus } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.wallets-BJWeBAZH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [adjust, setAdjust] = (0, import_react.useState)(null);
	const { data: wallets = [], isLoading } = useQuery({
		queryKey: ["wallets"],
		queryFn: async () => {
			const { data, error } = await supabase.from("wallets").select("*").order("balance_inr", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const { data: profiles = [] } = useQuery({
		queryKey: ["wallet-profiles"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("id,full_name,email");
			if (error) throw error;
			return data;
		}
	});
	const profileMap = new Map(profiles.map((p) => [p.id, p]));
	const toggleFreeze = useMutation({
		mutationFn: async (w) => {
			const { error } = await supabase.from("wallets").update({ frozen: !w.frozen }).eq("id", w.id);
			if (error) throw error;
			await logAudit({
				action: "status.change",
				resource: "wallet",
				resource_id: w.id,
				details: { frozen: !w.frozen }
			});
		},
		onSuccess: () => {
			toast.success("Wallet updated");
			qc.invalidateQueries({ queryKey: ["wallets"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const applyAdjust = useMutation({
		mutationFn: async () => {
			if (!adjust) return;
			const amt = Number(adjust.amount);
			if (!Number.isFinite(amt) || amt <= 0) throw new Error("Enter a positive amount");
			const delta = adjust.type === "credit" ? amt : -amt;
			const newBalance = Number(adjust.wallet.balance_inr) + delta;
			if (newBalance < 0) throw new Error("Insufficient balance");
			const { error: e1 } = await supabase.from("wallets").update({ balance_inr: newBalance }).eq("id", adjust.wallet.id);
			if (e1) throw e1;
			const { error: e2 } = await supabase.from("wallet_transactions").insert({
				wallet_id: adjust.wallet.id,
				amount_inr: amt,
				type: adjust.type,
				description: adjust.description || `${adjust.type} by admin`
			});
			if (e2) throw e2;
			await logAudit({
				action: "update",
				resource: "wallet",
				resource_id: adjust.wallet.id,
				details: {
					type: adjust.type,
					amount: amt
				}
			});
		},
		onSuccess: () => {
			toast.success("Wallet adjusted");
			setAdjust(null);
			qc.invalidateQueries({ queryKey: ["wallets"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const filtered = wallets.filter((w) => {
		if (!q) return true;
		const p = profileMap.get(w.user_id);
		const s = q.toLowerCase();
		return (p?.full_name ?? "").toLowerCase().includes(s) || (p?.email ?? "").toLowerCase().includes(s) || w.user_id.includes(q);
	});
	const total = wallets.reduce((a, w) => a + Number(w.balance_inr), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 min-w-0 max-w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl sm:text-2xl font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-6 w-6 shrink-0" }), " Wallets"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground mt-1 break-words",
					children: ["Total liabilities across customer wallets: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: formatINR(total)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-4 sm:p-5 space-y-4 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-md min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search customer",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-[680px] w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs uppercase text-muted-foreground bg-secondary/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Balance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-5 py-3",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 4,
								className: "px-5 py-10 text-center text-muted-foreground",
								children: "Loading…"
							}) }),
							!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 4,
								className: "px-5 py-10 text-center text-muted-foreground",
								children: "No wallets found."
							}) }),
							filtered.map((w) => {
								const p = profileMap.get(w.user_id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border hover:bg-secondary/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-5 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium break-words",
												children: p?.full_name ?? "Unknown"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground break-all",
												children: p?.email ?? w.user_id.slice(0, 8)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3 font-semibold",
											children: formatINR(Number(w.balance_inr))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "inline-flex px-2 py-1 rounded text-xs font-medium " + (w.frozen ? "bg-destructive/15 text-destructive" : "bg-emerald-500/15 text-emerald-600"),
												children: w.frozen ? "Frozen" : "Active"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-5 py-3 text-right space-x-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => setAdjust({
														wallet: w,
														type: "credit",
														amount: "",
														description: ""
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), " Credit"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => setAdjust({
														wallet: w,
														type: "debit",
														amount: "",
														description: ""
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5 mr-1" }), " Debit"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													onClick: () => toggleFreeze.mutate(w),
													children: w.frozen ? "Unfreeze" : "Freeze"
												})
											]
										})
									]
								}, w.id);
							})
						] })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!adjust,
				onOpenChange: (o) => !o && setAdjust(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: adjust?.type === "credit" ? "Credit wallet" : "Debit wallet" }) }),
					adjust && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-muted-foreground",
								children: ["Current balance: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: formatINR(Number(adjust.wallet.balance_inr))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: adjust.type,
								onValueChange: (v) => setAdjust({
									...adjust,
									type: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "credit",
									children: "Credit (+)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "debit",
									children: "Debit (−)"
								})] })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (INR)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "1",
								value: adjust.amount,
								onChange: (e) => setAdjust({
									...adjust,
									amount: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: adjust.description,
								onChange: (e) => setAdjust({
									...adjust,
									description: e.target.value
								})
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setAdjust(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => applyAdjust.mutate(),
						disabled: applyAdjust.isPending,
						children: applyAdjust.isPending ? "Applying…" : "Apply"
					})] })
				] })
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Wallets",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
