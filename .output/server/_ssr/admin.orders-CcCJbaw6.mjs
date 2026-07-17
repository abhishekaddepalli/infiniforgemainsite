import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { $ as Receipt, An as ChevronRight, F as ShoppingCart, Rn as Calendar, St as Mail, U as Search, at as Phone, d as User, dt as Package, fn as Download, gn as CreditCard, rt as Plus, tn as FileText, vn as Copy, xt as MapPin } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CiapfthD.mjs";
import { c as updateOrderStatusWithAlert, r as notifyOrderCreated } from "./alerts.functions-BIA4cKEy.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as downloadInvoicePdf, t as downloadInvoiceCsv } from "./invoice-CHhlY2Nm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders-CcCJbaw6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"pending",
	"paid",
	"refunded",
	"cancelled",
	"failed"
];
var STATUS_STYLE = {
	paid: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
	pending: "bg-amber-500/15 text-amber-600 border-amber-500/30",
	refunded: "bg-blue-500/15 text-blue-600 border-blue-500/30",
	cancelled: "bg-zinc-500/15 text-zinc-600 border-zinc-500/30",
	failed: "bg-red-500/15 text-red-600 border-red-500/30"
};
function OrdersPage() {
	const qc = useQueryClient();
	const updateStatusFn = useServerFn(updateOrderStatusWithAlert);
	const notifyOrderFn = useServerFn(notifyOrderCreated);
	const [query, setQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [creating, setCreating] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [savingNotes, setSavingNotes] = (0, import_react.useState)(false);
	const [notesDraft, setNotesDraft] = (0, import_react.useState)("");
	const { data: orders = [], isLoading } = useQuery({
		queryKey: ["orders"],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const { data: products = [] } = useQuery({
		queryKey: ["admin-products-list"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("id,name,price_inr,gst_percent").eq("status", "active").order("name");
			if (error) throw error;
			return data;
		}
	});
	const filtered = orders.filter((o) => {
		if (statusFilter !== "all" && o.status !== statusFilter) return false;
		const q = query.toLowerCase();
		return !q || o.order_number.toLowerCase().includes(q) || (o.customer_email ?? "").toLowerCase().includes(q) || o.product_name.toLowerCase().includes(q);
	});
	const setStatus = useMutation({
		mutationFn: async ({ id, status }) => {
			await updateStatusFn({ data: {
				id,
				status
			} });
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["orders"] });
			toast.success("Status updated");
		},
		onError: (e) => toast.error(e.message)
	});
	const create = useMutation({
		mutationFn: async (payload) => {
			const product = products.find((p) => p.id === payload.product_id);
			if (!product) throw new Error("Select a product");
			const amount = Number(product.price_inr);
			const gst = +(amount * Number(product.gst_percent) / 100).toFixed(2);
			const total = +(amount + gst).toFixed(2);
			const { data, error } = await supabase.from("orders").insert({
				customer_name: payload.customer_name,
				customer_email: payload.customer_email,
				product_id: product.id,
				product_name: product.name,
				amount_inr: amount,
				gst_inr: gst,
				total_inr: total,
				status: "pending",
				payment_method: payload.payment_method
			}).select("id").single();
			if (error) throw error;
			await logAudit({
				action: "create",
				resource: "orders",
				resource_id: data?.id,
				details: {
					customer_email: payload.customer_email,
					total_inr: total
				}
			});
			if (data?.id) notifyOrderFn({ data: { order_id: data.id } }).catch(() => void 0);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["orders"] });
			setCreating(null);
			toast.success("Order created");
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Orders" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-6 w-6 text-primary" }), " Orders & Invoices"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "GST-compliant invoices with Razorpay-ready checkout data."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "bg-gradient-brand text-white",
				onClick: () => setCreating({
					customer_name: "",
					customer_email: "",
					product_id: "",
					payment_method: "razorpay"
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1.5" }), " New order"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-stretch gap-3 p-4 border-b border-border sm:flex-row sm:flex-wrap sm:items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1 sm:flex-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search order, customer or product…",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							className: "pl-9 h-9 w-full sm:w-72"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-full sm:w-[160px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground sm:ml-auto",
						children: [
							filtered.length,
							" of ",
							orders.length
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
								className: "px-5 py-3",
								children: "Order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-right",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-right",
								children: "GST"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-right",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Status"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border",
						children: [
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "p-10 text-center text-muted-foreground",
								children: "Loading orders…"
							}) }),
							!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "p-10 text-center text-muted-foreground",
								children: "No orders yet."
							}) }),
							filtered.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-secondary/30 cursor-pointer",
								onClick: () => {
									setDetail(o);
									setNotesDraft(o.notes ?? "");
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-5 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-xs break-all",
											children: o.order_number
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: new Date(o.created_at).toLocaleString("en-IN")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-3 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-sm",
											children: o.customer_name ?? "—"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground break-all",
											children: o.customer_email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3 text-sm break-words",
										children: o.product_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3 text-right",
										children: formatINR(Number(o.amount_inr))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3 text-right text-muted-foreground",
										children: formatINR(Number(o.gst_inr))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3 text-right font-semibold",
										children: formatINR(Number(o.total_inr))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3",
										onClick: (e) => e.stopPropagation(),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: o.status,
											onValueChange: (v) => setStatus.mutate({
												id: o.id,
												status: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: cn("h-8 w-[130px] capitalize", o.status === "paid" ? "text-accent" : o.status === "pending" ? "text-[color:var(--warning)]" : ""),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: s,
												children: s
											}, s)) })]
										})
									})
								]
							}, o.id))
						]
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!creating,
			onOpenChange: (v) => !v && setCreating(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create manual order" }) }), creating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					create.mutate(creating);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Customer name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: creating.customer_name,
						onChange: (e) => setCreating({
							...creating,
							customer_name: e.target.value
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Customer email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						required: true,
						value: creating.customer_email,
						onChange: (e) => setCreating({
							...creating,
							customer_email: e.target.value
						}),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: creating.product_id,
						onValueChange: (v) => setCreating({
							...creating,
							product_id: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "mt-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select product" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: p.id,
							children: [
								p.name,
								" — ",
								formatINR(Number(p.price_inr))
							]
						}, p.id)) })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment method" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: creating.payment_method,
						onValueChange: (v) => setCreating({
							...creating,
							payment_method: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "mt-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "razorpay",
								children: "Razorpay"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "upi",
								children: "UPI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "card",
								children: "Card"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "netbanking",
								children: "Net Banking"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "wallet",
								children: "Wallet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "bank_transfer",
								children: "Bank Transfer"
							})
						] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => setCreating(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "bg-gradient-brand text-white",
						disabled: create.isPending,
						children: "Create order"
					})] })
				]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!detail,
			onOpenChange: (v) => !v && setDetail(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "max-w-3xl max-h-[90vh] overflow-y-auto",
				children: detail && (() => {
					const o = detail;
					const copy = (t) => {
						navigator.clipboard.writeText(t);
						toast.success("Copied");
					};
					const addr = [
						o.billing_address_line1,
						o.billing_address_line2,
						[
							o.billing_city,
							o.billing_state,
							o.billing_postal_code
						].filter(Boolean).join(", "),
						o.billing_country
					].filter(Boolean).join("\n");
					async function saveNotes() {
						setSavingNotes(true);
						try {
							const { error } = await supabase.from("orders").update({ notes: notesDraft }).eq("id", o.id);
							if (error) throw error;
							toast.success("Notes saved");
							qc.invalidateQueries({ queryKey: ["orders"] });
							setDetail({
								...o,
								notes: notesDraft
							});
						} catch (e) {
							toast.error(e instanceof Error ? e.message : "Save failed");
						} finally {
							setSavingNotes(false);
						}
					}
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-3 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-5 w-5 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: o.order_number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: cn("capitalize border", STATUS_STYLE[o.status] ?? ""),
									children: o.status
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "flex items-center gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
								" ",
								new Date(o.created_at).toLocaleString("en-IN"),
								o.paid_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["· ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-emerald-600",
									children: ["Paid ", new Date(o.paid_at).toLocaleString("en-IN")]
								})] })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-4 bg-secondary/30 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }), " Customer"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-sm",
										children: o.customer_name ?? "—"
									}),
									o.customer_email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground",
										onClick: () => copy(o.customer_email),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
											" ",
											o.customer_email,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
										]
									}),
									o.customer_phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground",
										onClick: () => copy(o.customer_phone),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }),
											" ",
											o.customer_phone,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
										]
									}),
									o.customer_gstin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "GSTIN:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: o.customer_gstin
											})
										]
									}),
									addr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground flex items-start gap-2 pt-1 whitespace-pre-line",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 mt-0.5 shrink-0" }),
											" ",
											addr
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-4 bg-secondary/30 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-3.5 w-3.5" }), " Payment"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Method:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold uppercase",
												children: o.payment_method ?? "—"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Invoice:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: o.invoice_number ?? "—"
											})
										]
									}),
									o.razorpay_order_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "RZP Order:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono break-all",
												children: o.razorpay_order_id
											})
										]
									}),
									o.razorpay_payment_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "text-xs flex items-center gap-1 hover:text-foreground",
										onClick: () => copy(o.razorpay_payment_id),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "RZP Pay:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono break-all",
												children: o.razorpay_payment_id
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
										]
									}),
									o.payment_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Payment ID:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: o.payment_id
											})
										]
									}),
									Number(o.wallet_applied_inr ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-emerald-600",
										children: ["Wallet used: ", formatINR(Number(o.wallet_applied_inr))]
									}),
									o.coupon_code && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: ["Coupon: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold",
											children: o.coupon_code
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-gradient-brand text-white px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" }), " Line item"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-4 items-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: o.product_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: [
											"Qty: ",
											o.quantity ?? 1,
											" · ",
											o.billing_cycle ?? "one-time",
											" · GST ",
											o.gst_percent,
											"%"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg font-bold",
											children: formatINR(Number(o.total_inr))
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t pt-2 grid grid-cols-3 gap-2 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "Subtotal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold",
											children: formatINR(Number(o.amount_inr))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "GST"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold",
											children: formatINR(Number(o.gst_inr))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "Grand total"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-primary",
											children: formatINR(Number(o.total_inr))
										})] })
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs uppercase tracking-wider text-primary font-bold",
									children: "Admin notes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									value: notesDraft,
									onChange: (e) => setNotesDraft(e.target.value),
									placeholder: "Internal notes about this order…"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2 justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: saveNotes,
										disabled: savingNotes || notesDraft === (o.notes ?? ""),
										children: savingNotes ? "Saving…" : "Save notes"
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex-wrap gap-2 sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: o.status,
									onValueChange: (v) => {
										setStatus.mutate({
											id: o.id,
											status: v
										});
										setDetail({
											...o,
											status: v
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-9 w-[140px] capitalize",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s
									}, s)) })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => downloadInvoiceCsv(o),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1.5" }), " CSV"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "bg-gradient-brand text-white",
									onClick: () => downloadInvoicePdf(o),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 mr-1.5" }), " Invoice PDF"]
								})]
							})]
						})
					] });
				})()
			})
		})
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Orders",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersPage, {})
});
//#endregion
export { SplitComponent as component };
