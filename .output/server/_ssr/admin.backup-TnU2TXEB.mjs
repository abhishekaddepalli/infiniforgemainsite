import { o as __toESM } from "../_runtime.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Et as LoaderCircle, On as CircleCheck, R as ShieldCheck, Ut as HardDriveUpload, Wt as HardDriveDownload, _ as TriangleAlert, fn as Download, h as Upload, in as FileBraces, mn as DatabaseBackup } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as createSsrRpc } from "./createSsrRpc-gkzqXpg7.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as downloadBlob } from "./download-DhKjMGgD.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CfEwGGLW.mjs";
import { t as Progress } from "./progress-Crx1Tb8I.mjs";
import { t as formatBytes } from "./image-optimizer-CQy1cW-0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.backup-TnU2TXEB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var exportBackup = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("32c075db7961294993b3aa50cf59712ee6995c9ce710e14d6a23434d9748f55f"));
var importBackup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("2b3f35f6071efb66ec2b3b3ec6762f07ffb1befb37d060b6a6d0567581d28168"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("beb33d1d6fdde3a9e0438650ed8b4d7a78ea9e1b8efd1836729b5037f212da62"));
function BackupPage() {
	const doExport = useServerFn(exportBackup);
	const doImport = useServerFn(importBackup);
	const [exportProgress, setExportProgress] = (0, import_react.useState)(0);
	const [lastExport, setLastExport] = (0, import_react.useState)(null);
	const [importMode, setImportMode] = (0, import_react.useState)("merge");
	const [importFile, setImportFile] = (0, import_react.useState)(null);
	const [importProgress, setImportProgress] = (0, import_react.useState)(0);
	const [importResults, setImportResults] = (0, import_react.useState)(null);
	const exportMut = useMutation({
		mutationFn: async () => {
			setExportProgress(15);
			const res = await doExport();
			setExportProgress(70);
			const blob = new Blob([res.json], { type: "application/json" });
			downloadBlob(blob, `infiniforge-backup-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.json`);
			setExportProgress(100);
			await logAudit({
				action: "backup_export",
				resource: "system",
				details: {
					size: blob.size,
					counts: res.counts
				}
			});
			setLastExport({
				at: res.generated_at,
				size: blob.size,
				counts: res.counts
			});
			return res;
		},
		onSuccess: () => toast.success("Backup downloaded"),
		onError: (e) => toast.error(e.message),
		onSettled: () => setTimeout(() => setExportProgress(0), 1200)
	});
	const importMut = useMutation({
		mutationFn: async () => {
			if (!importFile) throw new Error("Choose a backup file first");
			setImportProgress(20);
			const json = await importFile.text();
			setImportProgress(40);
			const res = await doImport({ data: {
				json,
				mode: importMode
			} });
			setImportProgress(100);
			await logAudit({
				action: "backup_import",
				resource: "system",
				details: {
					mode: importMode,
					results: res.results
				}
			});
			setImportResults(res.results);
			return res;
		},
		onSuccess: () => toast.success("Backup restored"),
		onError: (e) => toast.error(e.message),
		onSettled: () => setTimeout(() => setImportProgress(0), 1200)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-6 border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-14 w-14 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatabaseBackup, { className: "h-7 w-7 text-white" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl lg:text-2xl font-bold tracking-tight",
						children: "Database & Application Backup"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1 max-w-2xl",
						children: "One-click export of every application table — users, products, orders, wallets, tickets, CMS, licenses, hosting & more. Store the JSON file offsite and restore in seconds if anything goes wrong."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "secondary",
					className: "gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Encrypted at rest"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "bg-gradient-to-br from-primary/5 to-transparent border-b",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDriveDownload, { className: "h-5 w-5 text-primary" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Export full backup"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Downloads a single portable JSON file"
						})] })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "text-sm text-muted-foreground space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }), " Users, roles & profiles"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }), " Products, categories & coupons"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }), " Orders, invoices, payments & wallets"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }), " Licenses, hosting, tickets & CRM"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }), " Audit logs & module records"]
								})
							]
						}),
						exportMut.isPending || exportProgress > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: exportProgress,
								className: "h-2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground tabular-nums",
								children: [
									"Building snapshot… ",
									exportProgress,
									"%"
								]
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "w-full bg-gradient-brand text-white",
							onClick: () => exportMut.mutate(),
							disabled: exportMut.isPending,
							children: [exportMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), exportMut.isPending ? "Preparing backup…" : "Download backup now"]
						}),
						lastExport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-secondary/40 p-3 text-xs space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBraces, { className: "h-3.5 w-3.5" }), " Last snapshot"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: new Date(lastExport.at).toLocaleString()
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground",
								children: [
									formatBytes(lastExport.size),
									" · ",
									Object.values(lastExport.counts).reduce((a, b) => a + b, 0),
									" rows across ",
									Object.keys(lastExport.counts).length,
									" tables"
								]
							})]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "bg-gradient-to-br from-accent/10 to-transparent border-b",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDriveUpload, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Restore from backup"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Upload a previously exported backup JSON"
						})] })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 mx-auto text-muted-foreground mb-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: importFile ? importFile.name : "Click to choose backup file"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: importFile ? formatBytes(importFile.size) : "JSON files only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "application/json,.json",
									className: "hidden",
									onChange: (e) => {
										setImportResults(null);
										setImportFile(e.target.files?.[0] ?? null);
									}
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setImportMode("merge"),
								className: `rounded-xl border p-3 text-left text-sm transition-all ${importMode === "merge" ? "border-primary bg-primary/5" : "hover:border-primary/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold flex items-center gap-1.5",
									children: ["Merge ", importMode === "merge" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-primary" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Upsert rows — keep newer data"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setImportMode("replace"),
								className: `rounded-xl border p-3 text-left text-sm transition-all ${importMode === "replace" ? "border-destructive bg-destructive/5" : "hover:border-destructive/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold flex items-center gap-1.5",
									children: ["Replace ", importMode === "replace" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-destructive" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: "Wipe & restore (keeps admin users)"
								})]
							})]
						}),
						importMode === "replace" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }), "Replace mode deletes existing rows in every table before restoring. Only do this on a fresh environment or after taking a fresh export."]
						}),
						(importMut.isPending || importProgress > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: importProgress,
								className: "h-2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground tabular-nums",
								children: [
									"Restoring data… ",
									importProgress,
									"%"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "w-full",
							variant: importMode === "replace" ? "destructive" : "default",
							disabled: !importFile || importMut.isPending,
							onClick: () => importMut.mutate(),
							children: [importMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 mr-2" }), importMut.isPending ? "Restoring…" : `Restore (${importMode})`]
						}),
						importResults && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-secondary/40 divide-y",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 text-xs font-semibold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-primary" }), " Restore complete"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2.5 space-y-1 text-xs max-h-52 overflow-y-auto",
								children: Object.entries(importResults).map(([table, r]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-muted-foreground",
										children: table
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: r.error ? "text-destructive" : "text-primary tabular-nums",
										children: r.error ? r.error : `${r.restored} restored`
									})]
								}, table))
							})]
						})
					]
				})]
			})]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Backup & Restore",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackupPage, {})
});
//#endregion
export { SplitComponent as component };
