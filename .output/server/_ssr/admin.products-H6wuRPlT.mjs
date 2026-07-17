import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { A as SquareCheckBig, An as ChevronRight, Et as LoaderCircle, O as Star, U as Search, b as Trash2, dt as Package, h as Upload, j as Sparkles, r as X, rt as Plus, st as PenLine, un as Ellipsis, zt as Image$1 } from "../_libs/lucide-react.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CDoe66ii.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Checkbox } from "./checkbox-B1AjkRkB.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { t as Progress } from "./progress-Crx1Tb8I.mjs";
import { n as optimizeImage, t as formatBytes } from "./image-optimizer-CQy1cW-0.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products-H6wuRPlT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRODUCT_TYPES = [
	"physical",
	"digital",
	"software",
	"license",
	"subscription",
	"hosting",
	"vps",
	"domain",
	"ssl",
	"service",
	"consultation",
	"custom_dev",
	"ai",
	"monitoring",
	"amc"
];
var BILLING = [
	"one-time",
	"monthly",
	"quarterly",
	"half-yearly",
	"yearly",
	"lifetime"
];
var STATUSES = [
	"active",
	"draft",
	"archived"
];
var BUCKET = "product-images";
var SIGNED_URL_TTL = 3600 * 24 * 365 * 10;
function slugify(v) {
	return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function featurePlaceholder(type) {
	return {
		hosting: "4 vCPU · 8 GB RAM\nNVMe SSD storage\nFree SSL & daily backups\n24×7 NOC support",
		vps: "Dedicated cores\nRoot access\nSnapshot & clone\n99.99% SLA",
		domain: "Free WHOIS privacy\nAuto-renewal\nDomain lock\nEmail forwarding",
		ssl: "256-bit encryption\nUnlimited subdomains\nFree reissuance\n₹1.75 Cr warranty",
		license: "Genuine key delivery\nDomain / device binding\nLifetime activation\nInvoice included",
		subscription: "Cancel anytime\nUnlimited users\nGST invoicing\nPriority support",
		digital: "Instant download\nLifetime updates\nSource files included",
		service: "Dedicated engineer\nSLA-backed delivery\nQuarterly reviews",
		monitoring: "1-minute checks\nWhatsApp/SMS alerts\nSSL expiry warnings\nPublic status page",
		amc: "Priority tickets\nQuarterly audits\nFree minor upgrades",
		ai: "Trained on your data\nRAG + tools\nPrivate deployment"
	}[type] ?? "One feature per line";
}
function typeHint(type) {
	return {
		physical: "Physical goods require gateway checkout (wallet payments not allowed).",
		subscription: "Subscriptions auto-renew on the billing cycle; customer can cancel from the portal.",
		license: "License is auto-issued in Licenses module on payment; add key format in module metadata.",
		hosting: "Auto-creates a Hosting module record on purchase; track provisioning there.",
		vps: "Provisioning tracked via Hosting module; wallet-eligible.",
		domain: "Registration is tracked in Domains module.",
		ssl: "SSL issuance tracked in SSL module.",
		amc: "AMC is tracked with renewal reminders in AMC module.",
		monitoring: "Endpoint monitoring added to Monitoring module.",
		service: "Manual delivery — an order ticket is created for the support team.",
		ai: "AI Automation deliverable — tracked in CRM/Reports."
	}[type] ?? "Product-type specific delivery flows apply automatically on payment.";
}
function ProductsPage() {
	const qc = useQueryClient();
	const [query, setQuery] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bulkStatus, setBulkStatus] = (0, import_react.useState)("active");
	const { data: products = [], isLoading } = useQuery({
		queryKey: ["admin-products"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const { data: categories = [] } = useQuery({
		queryKey: ["admin-categories"],
		queryFn: async () => {
			const { data, error } = await supabase.from("categories").select("id,name,slug").order("sort_order");
			if (error) throw error;
			return data;
		}
	});
	const filtered = (0, import_react.useMemo)(() => products.filter((p) => {
		if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !(p.sku ?? "").toLowerCase().includes(query.toLowerCase())) return false;
		if (categoryFilter !== "all" && p.category_id !== categoryFilter) return false;
		if (typeFilter !== "all" && p.product_type !== typeFilter) return false;
		if (statusFilter !== "all" && p.status !== statusFilter) return false;
		return true;
	}), [
		products,
		query,
		categoryFilter,
		typeFilter,
		statusFilter
	]);
	const save = useMutation({
		mutationFn: async (p) => {
			const featureList = (p.features_text ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
			const payload = {
				name: p.name,
				slug: p.slug,
				sku: p.sku ?? null,
				category_id: p.category_id ?? null,
				product_type: p.product_type ?? "physical",
				description: p.description ?? null,
				long_description: p.long_description ?? null,
				price_inr: Number(p.price_inr ?? 0),
				billing: p.billing ?? "one-time",
				gst_percent: Number(p.gst_percent ?? 18),
				stock: p.stock ? Number(p.stock) : null,
				status: p.status ?? "active",
				featured: !!p.featured,
				popular: !!p.popular,
				thumbnail_url: p.thumbnail_url ?? null,
				demo_url: p.demo_url ?? null,
				demo_enabled: !!p.demo_enabled,
				gallery_urls: Array.isArray(p.gallery_urls) ? p.gallery_urls : [],
				features: featureList.length ? featureList : Array.isArray(p.features) ? p.features : []
			};
			if (p.id) {
				const { error } = await supabase.from("products").update(payload).eq("id", p.id);
				if (error) throw error;
				await logAudit({
					action: "update",
					resource: "products",
					resource_id: p.id,
					details: { name: payload.name }
				});
			} else {
				const { data, error } = await supabase.from("products").insert(payload).select("id").single();
				if (error) throw error;
				await logAudit({
					action: "create",
					resource: "products",
					resource_id: data?.id,
					details: { name: payload.name }
				});
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			setEditing(null);
			toast.success("Product saved");
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("products").delete().eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "delete",
				resource: "products",
				resource_id: id
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			toast.success("Deleted");
		},
		onError: (e) => toast.error(e.message)
	});
	const bulkDel = useMutation({
		mutationFn: async (ids) => {
			const { error } = await supabase.from("products").delete().in("id", ids);
			if (error) throw error;
			await logAudit({
				action: "delete",
				resource: "products",
				details: {
					count: ids.length,
					bulk: true
				}
			});
		},
		onSuccess: (_d, ids) => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			toast.success(`Deleted ${ids.length} product${ids.length === 1 ? "" : "s"}`);
			setSelected(/* @__PURE__ */ new Set());
		},
		onError: (e) => toast.error(e.message)
	});
	const bulkStatusMut = useMutation({
		mutationFn: async ({ ids, status }) => {
			const { error } = await supabase.from("products").update({ status }).in("id", ids);
			if (error) throw error;
			await logAudit({
				action: "update",
				resource: "products",
				details: {
					count: ids.length,
					status,
					bulk: true
				}
			});
		},
		onSuccess: (_d, v) => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			toast.success(`Updated ${v.ids.length} product${v.ids.length === 1 ? "" : "s"}`);
			setSelected(/* @__PURE__ */ new Set());
		},
		onError: (e) => toast.error(e.message)
	});
	const [uploadError, setUploadError] = (0, import_react.useState)(null);
	const [dragActive, setDragActive] = (0, import_react.useState)(false);
	const [uploadProgress, setUploadProgress] = (0, import_react.useState)(0);
	const [uploadPhase, setUploadPhase] = (0, import_react.useState)("idle");
	const [savings, setSavings] = (0, import_react.useState)(null);
	const ALLOWED_TYPES = [
		"image/png",
		"image/jpeg",
		"image/webp",
		"image/gif"
	];
	const ALLOWED_EXT = [
		"png",
		"jpg",
		"jpeg",
		"webp",
		"gif"
	];
	const MAX_BYTES = 5 * 1024 * 1024;
	const MIN_DIM = 200;
	const MAX_DIM = 4e3;
	function loadDimensions(file) {
		return new Promise((resolve, reject) => {
			const url = URL.createObjectURL(file);
			const img = new Image();
			img.onload = () => {
				URL.revokeObjectURL(url);
				resolve({
					w: img.naturalWidth,
					h: img.naturalHeight
				});
			};
			img.onerror = () => {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("This file isn't a readable image. Try PNG, JPG, or WebP."));
			};
			img.src = url;
		});
	}
	async function handleFileUpload(file) {
		if (!editing) return;
		setUploadError(null);
		setSavings(null);
		const ext = (file.name.split(".").pop() ?? "").toLowerCase();
		if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXT.includes(ext)) {
			const msg = "Unsupported format. Use PNG, JPG, WebP, or GIF.";
			setUploadError(msg);
			toast.error(msg);
			return;
		}
		if (file.size === 0) {
			const msg = "This file is empty.";
			setUploadError(msg);
			toast.error(msg);
			return;
		}
		if (file.size > MAX_BYTES) {
			const msg = `Image is ${(file.size / 1024 / 1024).toFixed(1)}MB — max allowed is 5MB.`;
			setUploadError(msg);
			toast.error(msg);
			return;
		}
		setUploading(true);
		setUploadProgress(0);
		setUploadPhase("optimize");
		try {
			const { w, h } = await loadDimensions(file);
			if (w < MIN_DIM || h < MIN_DIM) throw new Error(`Image is too small (${w}×${h}). Minimum is ${MIN_DIM}×${MIN_DIM}px.`);
			if (w > MAX_DIM || h > MAX_DIM) throw new Error(`Image is too large (${w}×${h}). Maximum is ${MAX_DIM}×${MAX_DIM}px.`);
			const result = await optimizeImage(file, {
				maxDimension: 1920,
				quality: .85,
				mimeType: "image/webp"
			}, (p) => {
				setUploadProgress(Math.round(p.progress * .4));
			});
			setSavings({
				original: result.originalBytes,
				optimized: result.outputBytes,
				savedPct: result.savedPct
			});
			setUploadPhase("upload");
			const outExt = result.file.name.split(".").pop() ?? ext;
			const path = `${crypto.randomUUID()}.${outExt}`;
			const { data: signedUp, error: signErr } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
			if (signErr) throw new Error(signErr.message.includes("row-level") ? "You don't have permission to upload images." : signErr.message);
			await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open("PUT", signedUp.signedUrl, true);
				xhr.setRequestHeader("x-upsert", "false");
				xhr.setRequestHeader("cache-control", "31536000");
				xhr.upload.onprogress = (ev) => {
					if (ev.lengthComputable) setUploadProgress(40 + Math.round(ev.loaded / ev.total * 60));
				};
				xhr.onload = () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						setUploadProgress(100);
						resolve();
					} else reject(/* @__PURE__ */ new Error(`Upload failed (${xhr.status}). Please try again.`));
				};
				xhr.onerror = () => reject(/* @__PURE__ */ new Error("Network error during upload. Please try again."));
				xhr.send(result.file);
			});
			const { data: signed, error: sErr } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
			if (sErr) throw sErr;
			setEditing({
				...editing,
				thumbnail_url: signed.signedUrl
			});
			setUploadPhase("done");
			toast.success(result.converted ? `Image optimized & uploaded — saved ${result.savedPct}% (${formatBytes(result.originalBytes)} → ${formatBytes(result.outputBytes)})` : "Image uploaded");
		} catch (e) {
			const msg = e.message || "Upload failed. Please try again.";
			setUploadError(msg);
			toast.error(msg);
		} finally {
			setUploading(false);
			setTimeout(() => {
				setUploadProgress(0);
				setUploadPhase("idle");
			}, 1200);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	}
	const activeFilterCount = (categoryFilter !== "all" ? 1 : 0) + (typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Products" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6 text-primary" }), " Products"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Manage every product type — physical, digital, SaaS, hosting, VPS, licenses, AMC."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "bg-gradient-brand text-white",
				onClick: () => setEditing({
					product_type: "subscription",
					billing: "monthly",
					status: "active",
					gst_percent: 18,
					featured: false,
					popular: false,
					price_inr: 0
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1.5" }), " New product"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 p-4 border-b border-border flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search name or SKU…",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								className: "pl-9 h-9 w-64"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: categoryFilter,
							onValueChange: setCategoryFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 w-44",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Category" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All categories"
							}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c.id,
								children: c.name
							}, c.id))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: typeFilter,
							onValueChange: setTypeFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 w-40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Type" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All types"
							}), PRODUCT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t,
								children: t
							}, t))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: statusFilter,
							onValueChange: setStatusFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 w-36",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All statuses"
							}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s))] })]
						}),
						activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								setCategoryFilter("all");
								setTypeFilter("all");
								setStatusFilter("all");
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5 mr-1" }),
								" Clear (",
								activeFilterCount,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground ml-auto",
							children: [
								"Showing ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: filtered.length
								}),
								" of ",
								products.length
							]
						})
					]
				}),
				selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-border bg-primary/5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm font-medium",
							children: [selected.size, " selected"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: bulkStatus,
							onValueChange: setBulkStatus,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 w-32",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: bulkStatusMut.isPending,
							onClick: () => bulkStatusMut.mutate({
								ids: Array.from(selected),
								status: bulkStatus
							}),
							children: bulkStatusMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Apply status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "destructive",
							disabled: bulkDel.isPending,
							onClick: () => {
								const ids = Array.from(selected);
								if (confirm(`Delete ${ids.length} product${ids.length === 1 ? "" : "s"}?`)) bulkDel.mutate(ids);
							},
							children: bulkDel.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 mr-1" }), " Delete"] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => setSelected(/* @__PURE__ */ new Set()),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-[920px] w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pl-5 pr-2 py-3 w-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: filtered.length > 0 && filtered.every((p) => selected.has(p.id)),
										onCheckedChange: (v) => {
											const next = new Set(selected);
											if (v) filtered.forEach((p) => next.add(p.id));
											else filtered.forEach((p) => next.delete(p.id));
											setSelected(next);
										},
										"aria-label": "Select all"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 text-right",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3",
									children: "Billing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "pl-3 pr-5 py-3 w-10" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-border",
							children: [
								isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 8,
									className: "p-10 text-center text-muted-foreground",
									children: "Loading products…"
								}) }),
								!isLoading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 8,
									className: "p-10 text-center text-muted-foreground",
									children: "No products match these filters."
								}) }),
								filtered.map((p) => {
									const isSel = selected.has(p.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: cn("hover:bg-secondary/30", isSel && "bg-primary/5"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "pl-5 pr-2 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
													checked: isSel,
													onCheckedChange: (v) => {
														const next = new Set(selected);
														if (v) next.add(p.id);
														else next.delete(p.id);
														setSelected(next);
													},
													"aria-label": `Select ${p.name}`
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-10 w-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border",
														children: p.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src: p.thumbnail_url,
															alt: p.name,
															className: "h-full w-full object-cover"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "h-4 w-4 text-muted-foreground" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "font-medium flex items-center gap-2 truncate",
															children: [
																p.name,
																" ",
																p.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 text-primary fill-primary shrink-0" })
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-xs text-muted-foreground font-mono truncate",
															children: [
																p.sku ?? "—",
																" · /",
																p.slug
															]
														})]
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "secondary",
													className: "text-[10px] uppercase",
													children: p.product_type
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-xs text-muted-foreground",
												children: categories.find((c) => c.id === p.category_id)?.name ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-right font-semibold",
												children: formatINR(Number(p.price_inr))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-xs text-muted-foreground",
												children: p.billing
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("inline-flex text-[11px] font-semibold rounded-full px-2.5 py-1 capitalize", p.status === "active" ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"),
													children: p.status
												})
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
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => setEditing(p),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4 mr-2" }), " Edit"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														className: "text-destructive",
														onClick: () => confirm(`Delete "${p.name}"?`) && del.mutate(p.id),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-2" }), " Delete"]
													})]
												})] })
											})
										]
									}, p.id);
								})
							]
						})]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editing,
			onOpenChange: (v) => !v && setEditing(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "Edit product" : "New product" }) }), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto pr-1",
					onSubmit: (e) => {
						e.preventDefault();
						save.mutate(editing);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Thumbnail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onDragEnter: (e) => {
									e.preventDefault();
									e.stopPropagation();
									if (!uploading) setDragActive(true);
								},
								onDragOver: (e) => {
									e.preventDefault();
									e.stopPropagation();
									if (!uploading) setDragActive(true);
								},
								onDragLeave: (e) => {
									e.preventDefault();
									e.stopPropagation();
									setDragActive(false);
								},
								onDrop: (e) => {
									e.preventDefault();
									e.stopPropagation();
									setDragActive(false);
									if (uploading) return;
									const file = e.dataTransfer.files?.[0];
									if (!file) return;
									if (e.dataTransfer.files.length > 1) {
										const msg = "Drop one image at a time.";
										setUploadError(msg);
										toast.error(msg);
										return;
									}
									handleFileUpload(file);
								},
								className: `mt-1.5 flex items-center gap-4 rounded-xl border-2 border-dashed p-3 transition-colors ${dragActive ? "border-primary bg-primary/5" : uploadError ? "border-destructive/40" : "border-border bg-secondary/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "h-20 w-20 rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden shrink-0 relative",
									children: [editing.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: editing.thumbnail_url,
										alt: "",
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "h-6 w-6 text-muted-foreground" }), uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: fileInputRef,
											type: "file",
											accept: "image/png,image/jpeg,image/webp,image/gif",
											className: "hidden",
											onChange: (e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2 flex-wrap items-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "button",
													size: "sm",
													variant: "outline",
													disabled: uploading,
													onClick: () => {
														setUploadError(null);
														fileInputRef.current?.click();
													},
													children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5 mr-1.5" }), uploading ? `${uploadPhase === "optimize" ? "Optimizing" : "Uploading"}… ${uploadProgress}%` : editing.thumbnail_url ? "Replace image" : "Upload image"]
												}),
												editing.thumbnail_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "button",
													size: "sm",
													variant: "ghost",
													onClick: () => {
														setUploadError(null);
														setEditing({
															...editing,
															thumbnail_url: null
														});
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5 mr-1" }), " Remove"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground",
													children: dragActive ? "Drop to upload" : "or drag & drop — auto-converted to WebP"
												})
											]
										}),
										uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											role: "progressbar",
											"aria-valuenow": uploadProgress,
											"aria-valuemin": 0,
											"aria-valuemax": 100,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
												value: uploadProgress,
												className: "h-2"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground tabular-nums flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-primary" }),
													uploadPhase === "optimize" ? "Compressing to WebP without quality loss" : uploadPhase === "upload" ? "Uploading optimized file to secure storage" : "Finalizing",
													"… ",
													uploadProgress,
													"%"
												]
											})]
										}),
										!uploading && savings && savings.savedPct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[11px] text-primary flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }),
												" Saved ",
												savings.savedPct,
												"% · ",
												formatBytes(savings.original),
												" → ",
												formatBytes(savings.optimized),
												" (WebP)"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "PNG, JPG, WebP, or GIF · 200×200–4000×4000 · up to 5MB. Auto-converted to WebP."
										}),
										uploadError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-destructive font-medium flex items-start gap-1.5",
											role: "alert",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3 mt-0.5 shrink-0" }),
												" ",
												uploadError
											]
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: editing.name ?? "",
								onChange: (e) => {
									const name = e.target.value;
									setEditing({
										...editing,
										name,
										slug: editing.id || editing.slug ? editing.slug : slugify(name)
									});
								},
								className: "mt-1.5"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: editing.slug ?? "",
							onChange: (e) => setEditing({
								...editing,
								slug: e.target.value
							}),
							className: "mt-1.5",
							placeholder: "my-product"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SKU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: editing.sku ?? "",
							onChange: (e) => setEditing({
								...editing,
								sku: e.target.value
							}),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: editing.category_id ?? "",
							onValueChange: (v) => setEditing({
								...editing,
								category_id: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select category" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c.id,
								children: c.name
							}, c.id)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: editing.product_type,
							onValueChange: (v) => setEditing({
								...editing,
								product_type: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRODUCT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t,
								children: t
							}, t)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price (INR)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							step: "0.01",
							required: true,
							value: editing.price_inr ?? 0,
							onChange: (e) => setEditing({
								...editing,
								price_inr: Number(e.target.value)
							}),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Billing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: editing.billing,
							onValueChange: (v) => setEditing({
								...editing,
								billing: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: BILLING.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: b,
								children: b
							}, b)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GST %" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							step: "0.01",
							value: editing.gst_percent ?? 18,
							onChange: (e) => setEditing({
								...editing,
								gst_percent: Number(e.target.value)
							}),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Stock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							value: editing.stock ?? "",
							onChange: (e) => setEditing({
								...editing,
								stock: e.target.value ? Number(e.target.value) : null
							}),
							className: "mt-1.5",
							placeholder: "Unlimited"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: editing.status,
							onValueChange: (v) => setEditing({
								...editing,
								status: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								className: "capitalize",
								children: s
							}, s)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Short description ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs font-normal",
								children: "(shown on catalog cards)"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: editing.description ?? "",
								onChange: (e) => setEditing({
									...editing,
									description: e.target.value
								}),
								className: "mt-1.5"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Long description ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs font-normal",
								children: "(shown on product detail page — supports line breaks)"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 5,
								value: editing.long_description ?? "",
								onChange: (e) => setEditing({
									...editing,
									long_description: e.target.value
								}),
								className: "mt-1.5",
								placeholder: "Rich, detailed overview shown on the single-product page."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Features ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground text-xs font-normal",
									children: "(one per line — shown on the storefront card)"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 4,
									className: "mt-1.5",
									placeholder: featurePlaceholder(editing.product_type ?? "physical"),
									value: Array.isArray(editing.features) ? editing.features.join("\n") : "",
									onChange: (e) => setEditing({
										...editing,
										features: e.target.value.split("\n")
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-1.5",
									children: typeHint(editing.product_type ?? "physical")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-sm font-semibold",
									children: "Live Preview / Demo link"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Enable to show a \"Live Preview\" button on the product page (opens in a new tab)."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: !!editing.demo_enabled,
									onCheckedChange: (v) => setEditing({
										...editing,
										demo_enabled: v
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "url",
								placeholder: "https://demo.example.com",
								value: editing.demo_url ?? "",
								disabled: !editing.demo_enabled,
								onChange: (e) => setEditing({
									...editing,
									demo_url: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 flex items-center gap-6 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: !!editing.featured,
									onCheckedChange: (v) => setEditing({
										...editing,
										featured: v
									})
								}), " Featured"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: !!editing.popular,
									onCheckedChange: (v) => setEditing({
										...editing,
										popular: v
									})
								}), " Popular"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setEditing(null),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "bg-gradient-brand text-white",
								disabled: save.isPending || uploading,
								children: save.isPending ? "Saving…" : "Save product"
							})]
						})
					]
				})]
			})
		})
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Products",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsPage, {})
});
//#endregion
export { SplitComponent as component };
