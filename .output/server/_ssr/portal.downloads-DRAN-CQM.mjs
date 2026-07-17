import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Pt as KeyRound, Xn as ArrowRight, Zn as ArrowLeft, dt as Package, fn as Download, j as Sparkles, tn as FileText, xn as Cloud } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { i as getMyBenefits } from "./memberships.functions-C2eeCH5c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.downloads-DRAN-CQM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DELIVERABLE_TYPES = /* @__PURE__ */ new Set([
	"digital",
	"license",
	"subscription",
	"service",
	"software",
	"saas"
]);
function DownloadsPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		user,
		loading,
		navigate
	]);
	const { data: orders = [] } = useQuery({
		queryKey: ["portal-downloads", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("orders").select("id, product_name, invoice_number, order_number, notes, product_id, products(product_type, metadata)").eq("customer_id", user.id).eq("status", "paid").order("created_at", { ascending: false });
			return (data ?? []).filter((o) => DELIVERABLE_TYPES.has(String(o.products?.product_type ?? "digital").toLowerCase()));
		}
	});
	const benefitsFn = useServerFn(getMyBenefits);
	const { data: benefits } = useQuery({
		queryKey: ["my-benefits"],
		enabled: !!user,
		queryFn: () => benefitsFn()
	});
	const membershipProducts = benefits?.products ?? [];
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-sm text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 lg:px-6 py-8 space-y-6",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "mb-2",
						children: "Deliveries"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-6 w-6 text-primary" }), " My downloads & keys"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Digital products, license keys and access credentials from your paid orders."
					})
				] }),
				orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-8 w-8 mx-auto mb-2 opacity-40" }),
						"No digital deliveries yet. Paid digital products, licenses and subscriptions will appear here.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/products",
									children: "Browse catalog"
								})
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: orders.map((o) => {
						const meta = {
							...o.products?.metadata ?? {},
							...safeJson(o.notes)
						};
						const licenseKey = String(meta.license_key ?? meta.key ?? "");
						const downloadUrl = String(meta.download_url ?? "");
						const accessUrl = String(meta.access_url ?? "");
						const credentials = meta.credentials;
						const type = String(o.products?.product_type ?? "digital").toLowerCase();
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-xl bg-secondary flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(type === "license" ? KeyRound : type === "subscription" ? Cloud : FileText, { className: "h-5 w-5 text-primary" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-semibold truncate",
											children: o.product_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground font-mono",
											children: o.invoice_number ?? o.order_number
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "text-[10px] capitalize",
										children: type
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-2 text-xs",
								children: [
									licenseKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, {
										label: "License key",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono bg-secondary px-2 py-1 rounded flex-1 truncate",
											children: licenseKey
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											className: "h-7 w-7",
											onClick: () => {
												navigator.clipboard?.writeText(licenseKey);
												toast.success("Key copied");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
										})]
									}),
									downloadUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Download",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: downloadUrl,
											target: "_blank",
											rel: "noreferrer",
											className: "text-primary hover:underline truncate flex-1",
											children: downloadUrl
										})
									}),
									accessUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Access URL",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: accessUrl,
											target: "_blank",
											rel: "noreferrer",
											className: "text-primary hover:underline truncate flex-1",
											children: accessUrl
										})
									}),
									credentials?.username && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Username",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono bg-secondary px-2 py-1 rounded flex-1 truncate",
											children: credentials.username
										})
									}),
									credentials?.password && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, {
										label: "Password",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono bg-secondary px-2 py-1 rounded flex-1 truncate",
											children: "••••••••"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-7",
											onClick: () => {
												navigator.clipboard?.writeText(credentials.password);
												toast.success("Password copied");
											},
											children: "Copy"
										})]
									}),
									!licenseKey && !downloadUrl && !accessUrl && !credentials && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground text-xs italic",
										children: "Delivery is being provisioned. You'll receive an email when ready."
									})
								]
							})]
						}, o.id);
					})
				}),
				membershipProducts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-background to-background p-4 sm:p-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-primary flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Included with your membership"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg sm:text-xl font-bold mt-1",
							children: "Unlocked digital products"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Access these at no additional cost with your active plan."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: membershipProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/products/$slug",
							params: { slug: p.slug },
							className: "group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-primary transition",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-secondary flex items-center justify-center",
									children: p.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.thumbnail_url,
										alt: "",
										className: "h-full w-full object-cover",
										loading: "lazy"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5 text-primary/60" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold truncate group-hover:text-primary",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground capitalize truncate",
										children: p.product_type ?? "digital"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" })
							]
						}, p.id))
					})]
				})
			]
		})
	});
}
function safeJson(s) {
	if (!s) return {};
	try {
		const v = JSON.parse(s);
		return typeof v === "object" && v ? v : {};
	} catch {
		return {};
	}
}
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-20 shrink-0 text-muted-foreground uppercase text-[10px] tracking-wider",
			children: label
		}), children]
	});
}
//#endregion
export { DownloadsPage as component };
