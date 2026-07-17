import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { $ as Receipt, U as Search, fn as Download, tn as FileText, ut as Palette } from "../_libs/lucide-react.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { n as downloadCsv } from "./download-DhKjMGgD.mjs";
import { a as saveLogo, i as getSavedTemplate, n as downloadInvoicePdf, o as saveTemplate, r as getSavedLogo } from "./invoice-CHhlY2Nm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.invoices-2udOJMTa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function downloadInvoice(o) {
	downloadCsv([
		["Invoice", o.order_number],
		["Date", new Date(o.created_at).toLocaleDateString("en-IN")],
		["Customer", o.customer_name ?? ""],
		["Email", o.customer_email ?? ""],
		["Item", o.product_name],
		["Subtotal (INR)", String(o.amount_inr)],
		["GST (INR)", String(o.gst_inr)],
		["Total (INR)", String(o.total_inr)],
		["Status", o.status],
		["Payment", o.payment_method ?? ""]
	], `${o.order_number}.csv`);
}
function exportAllInvoices(orders) {
	downloadCsv([[
		"Invoice #",
		"Date",
		"Customer",
		"Email",
		"Item",
		"Subtotal",
		"GST",
		"Total",
		"Status",
		"Payment"
	], ...orders.map((o) => [
		o.order_number,
		new Date(o.created_at).toLocaleDateString("en-IN"),
		o.customer_name ?? "",
		o.customer_email ?? "",
		o.product_name,
		Number(o.amount_inr),
		Number(o.gst_inr),
		Number(o.total_inr),
		o.status,
		o.payment_method ?? ""
	])], `infiniforge-invoices-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
}
function Page() {
	const [q, setQ] = (0, import_react.useState)("");
	const [template, setTemplate] = (0, import_react.useState)("modern");
	const [logo, setLogo] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setTemplate(getSavedTemplate());
		setLogo(getSavedLogo());
	}, []);
	const { data = [], isLoading } = useQuery({
		queryKey: ["invoices"],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("*").in("status", ["paid", "refunded"]).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const filtered = data.filter((o) => {
		if (!q) return true;
		const s = q.toLowerCase();
		return o.order_number.toLowerCase().includes(s) || (o.customer_email ?? "").toLowerCase().includes(s);
	});
	const gstTotal = data.reduce((a, o) => a + Number(o.gst_inr), 0);
	const revenue = data.filter((o) => o.status === "paid").reduce((a, o) => a + Number(o.total_inr), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-2xl font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-6 w-6" }), " GST Invoices"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: [
							"Revenue: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: formatINR(revenue)
							}),
							" · GST collected: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: formatINR(gstTotal)
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => exportAllInvoices(filtered),
					disabled: filtered.length === 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }),
						" Export ",
						filtered.length,
						" to CSV"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-4 grid min-w-0 gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-4 w-4 text-primary" }), " Invoice template"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: template,
							onValueChange: (v) => {
								const t = v;
								setTemplate(t);
								saveTemplate(t);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[160px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "modern",
									children: "Modern (Saffron)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "classic",
									children: "Classic (Navy)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "minimal",
									children: "Minimal (B&W)"
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Logo URL (optional, PNG)",
							value: logo,
							onChange: (e) => {
								setLogo(e.target.value);
								saveLogo(e.target.value);
							},
							className: "min-w-0 w-full max-w-md flex-1"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Saved for this browser"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-5 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search invoice number or email",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-[900px] w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs uppercase text-muted-foreground bg-secondary/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Invoice #"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Item"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-5 py-3",
									children: "Subtotal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-5 py-3",
									children: "GST"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-5 py-3",
									children: "Total"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left px-5 py-3",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right px-5 py-3",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 8,
								className: "px-5 py-10 text-center text-muted-foreground",
								children: "Loading…"
							}) }),
							!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 8,
								className: "px-5 py-10 text-center text-muted-foreground",
								children: [
									"No invoices yet. ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/orders",
										className: "text-primary underline",
										children: "Create an order"
									}),
									"."
								]
							}) }),
							filtered.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border hover:bg-secondary/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 font-mono text-xs",
										children: o.order_number
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-5 py-3",
										children: [o.customer_name ?? "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: o.customer_email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: o.product_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-right",
										children: formatINR(Number(o.amount_inr))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-right",
										children: formatINR(Number(o.gst_inr))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-right font-semibold",
										children: formatINR(Number(o.total_inr))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: new Date(o.created_at).toLocaleDateString("en-IN")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => downloadInvoicePdf(o),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 mr-1" }), " PDF"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => downloadInvoice(o),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1" }), " CSV"]
											})]
										})
									})
								]
							}, o.id))
						] })]
					})
				})]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Invoices",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
