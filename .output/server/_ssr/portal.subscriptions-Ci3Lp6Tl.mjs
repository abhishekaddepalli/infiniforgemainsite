import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Rn as Calendar, Z as RefreshCw, Zn as ArrowLeft, r as X } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.subscriptions-Ci3Lp6Tl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SubsPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	const { data: subs } = useQuery({
		queryKey: ["my-subs", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("subscriptions").select("*").eq("customer_id", user.id).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const cancel = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("subscriptions").update({ status: "cancelled" }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Subscription cancelled");
			qc.invalidateQueries({ queryKey: ["my-subs"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 py-8 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/portal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), " Portal"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "My subscriptions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Manage your recurring services and renewals."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4",
					children: [(subs ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-8 w-8 mx-auto mb-3 opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: "No subscriptions yet."
						})]
					}), (subs ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 flex items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: s.plan
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground flex items-center gap-2 mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "h-4 text-[10px]",
										children: s.billing_cycle
									}), s.current_period_end && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
											" renews ",
											new Date(s.current_period_end).toLocaleDateString("en-IN")
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: formatINR(Number(s.amount_inr))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: s.status === "active" ? "bg-accent/15 text-accent border-0" : "bg-secondary text-muted-foreground border-0",
									children: s.status
								})]
							}),
							s.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => cancel.mutate(s.id),
								disabled: cancel.isPending,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5 mr-1" }), " Cancel"]
							})
						]
					}, s.id))]
				})
			]
		})
	});
}
//#endregion
export { SubsPage as component };
