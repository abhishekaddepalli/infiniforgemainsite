import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Z as RefreshCw, _t as MessageCircle, cn as ExternalLink } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { r as playAlertTone } from "./NotificationBell-BCzh6Rtq.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { r as buildWhatsAppLink } from "./whatsapp-Bfedub3g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.whatsapp-orders-xdIrKC8O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"pending",
	"contacted",
	"confirmed",
	"paid",
	"fulfilled",
	"cancelled"
];
var statusColor = {
	pending: "bg-amber-500/15 text-amber-500",
	contacted: "bg-blue-500/15 text-blue-500",
	confirmed: "bg-primary/15 text-primary",
	paid: "bg-accent/15 text-accent",
	fulfilled: "bg-emerald-500/15 text-emerald-500",
	cancelled: "bg-destructive/15 text-destructive"
};
function WhatsAppOrders() {
	const qc = useQueryClient();
	const { data, isFetching, refetch } = useQuery({
		queryKey: ["whatsapp_orders"],
		queryFn: async () => {
			const { data, error } = await supabase.from("module_records").select("*").eq("module", "whatsapp_orders").order("created_at", { ascending: false }).limit(500);
			if (error) throw error;
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("wa-orders-live").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "module_records",
			filter: "module=eq.whatsapp_orders"
		}, (payload) => {
			qc.invalidateQueries({ queryKey: ["whatsapp_orders"] });
			if (payload.eventType === "INSERT") {
				playAlertTone();
				toast.success("New WhatsApp order received");
			}
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [qc]);
	const updateStatus = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("module_records").update({ status }).eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "status.change",
				resource: "orders",
				resource_id: id,
				details: {
					module: "whatsapp_orders",
					status
				}
			});
		},
		onSuccess: () => {
			toast.success("Status updated");
			qc.invalidateQueries({ queryKey: ["whatsapp_orders"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed")
	});
	const rows = data ?? [];
	const stats = STATUSES.map((s) => ({
		s,
		n: rows.filter((r) => r.status === s).length
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "WhatsApp Orders",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold",
							children: "WhatsApp Orders"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Every click on an \"Order on WhatsApp\" button is logged here."
						})] })]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						disabled: isFetching,
						onClick: async () => {
							await refetch();
							toast.success("Refreshed");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}` }), isFetching ? "Refreshing…" : "Refresh"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 grid-cols-2 md:grid-cols-6",
					children: stats.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass rounded-xl p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wide text-muted-foreground",
							children: x.s
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold mt-1",
							children: x.n
						})]
					}, x.s))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "glass rounded-2xl overflow-hidden min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "min-w-[860px] w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Ref / Created"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Items"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Customer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Value"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Surface"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
								isFetching && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "px-4 py-8 text-center text-muted-foreground",
									children: "Loading…"
								}) }),
								!isFetching && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "px-4 py-8 text-center text-muted-foreground",
									children: "No WhatsApp orders yet."
								}) }),
								rows.map((r) => {
									const m = r.metadata ?? {};
									const items = Array.isArray(m.items) ? m.items : [];
									const phone = m.customer_phone ?? "";
									const name = m.customer_name ?? "";
									const ref = m.reference ?? r.id.slice(0, 8);
									const surface = m.surface ?? "—";
									const number = m.business_number ?? "";
									const message = m.message ?? "";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border/60",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 py-3 align-top",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono text-xs break-all",
													children: ref
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[11px] text-muted-foreground mt-1",
													children: new Date(r.created_at).toLocaleString("en-IN")
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 py-3 align-top max-w-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium break-words",
													children: r.title
												}), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
													className: "mt-1 space-y-0.5 text-xs text-muted-foreground",
													children: [items.slice(0, 4).map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														"· ",
														it.name,
														" × ",
														it.qty ?? 1
													] }, i)), items.length > 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
														"+ ",
														items.length - 4,
														" more"
													] })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 py-3 align-top",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: name || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Guest"
												}) }), phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground",
													children: phone
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 align-top font-medium",
												children: r.amount_inr != null ? formatINR(Number(r.amount_inr)) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 align-top",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[10px]",
													children: surface
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 align-top",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-col gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														className: `w-fit ${statusColor[r.status] ?? ""}`,
														children: r.status
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: r.status,
														onValueChange: (v) => updateStatus.mutate({
															id: r.id,
															status: v
														}),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															className: "h-7 w-[130px] text-xs",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: s,
															children: s
														}, s)) })]
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 align-top",
												children: number && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
														href: buildWhatsAppLink(number, message),
														target: "_blank",
														rel: "noopener noreferrer",
														children: ["Reopen ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 ml-1" })]
													})
												})
											})
										]
									}, r.id);
								})
							] })]
						})
					})
				})
			]
		})
	});
}
//#endregion
export { WhatsAppOrders as component };
