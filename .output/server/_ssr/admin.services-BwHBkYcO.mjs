import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { Hn as Boxes, rt as Plus } from "../_libs/lucide-react.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.services-BwHBkYcO.js
var import_jsx_runtime = require_jsx_runtime();
var SERVICE_TYPES = [
	"service",
	"saas",
	"hosting",
	"domain",
	"ssl",
	"amc",
	"monitoring"
];
function Page() {
	const { data: products = [] } = useQuery({
		queryKey: ["services-products"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("id,name,slug,price_inr,product_type,billing,status,category_id").in("product_type", SERVICE_TYPES).order("name");
			if (error) throw error;
			return data;
		}
	});
	const { data: cats = [] } = useQuery({
		queryKey: ["services-cats"],
		queryFn: async () => {
			const { data, error } = await supabase.from("categories").select("id,name");
			if (error) throw error;
			return data;
		}
	});
	const catMap = new Map(cats.map((c) => [c.id, c.name]));
	const grouped = SERVICE_TYPES.map((t) => ({
		type: t,
		items: products.filter((p) => p.product_type === t)
	})).filter((g) => g.items.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-between sm:gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-xl sm:text-2xl font-bold flex items-center gap-2 truncate",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-5 w-5 sm:h-6 sm:w-6 shrink-0" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "Services catalog"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-sm text-muted-foreground mt-1",
						children: "All recurring & professional services sold on the platform."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/products",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 sm:mr-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "New service"
						})]
					})
				})]
			}),
			grouped.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-10 text-center text-muted-foreground",
				children: [
					"No services yet. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/products",
						className: "text-primary underline",
						children: "Add one"
					}),
					"."
				]
			}),
			grouped.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold uppercase tracking-wide text-muted-foreground truncate",
						children: g.type
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground shrink-0",
						children: [g.items.length, " items"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: g.items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/products",
						className: "rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold truncate",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-0.5 truncate",
									children: p.category_id ? catMap.get(p.category_id) ?? "—" : "Uncategorised"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex px-2 py-0.5 rounded text-[10px] font-medium shrink-0 " + (p.status === "active" ? "bg-emerald-500/15 text-emerald-600" : "bg-secondary text-muted-foreground"),
								children: p.status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-baseline gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-bold",
								children: formatINR(Number(p.price_inr))
							}), p.billing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: ["/ ", p.billing]
							})]
						})]
					}, p.id))
				})]
			}, g.type))
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Services",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
