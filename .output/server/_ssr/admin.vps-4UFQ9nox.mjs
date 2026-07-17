import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Et as LoaderCircle, Ht as HardDrive, L as Shield, U as Search, V as Server, _n as Cpu, a as Wifi, b as Trash2, d as User, ot as Pencil, rt as Plus, xt as MapPin } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
import { a as addMonthsISO, c as debitWalletForOrder, i as PAYMENT_METHOD_LABEL, l as notifyCustomerVps, n as CYCLE_MONTHS, o as computeTotals, r as HOSTING_VPS_PRESETS, s as createVpsOrder, t as CYCLE_LABEL } from "./vps-billing-DmHiUlI3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.vps-4UFQ9nox.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"active",
	"provisioning",
	"suspended",
	"expired",
	"terminated"
];
var OS_OPTIONS = [
	"Ubuntu 24.04 LTS",
	"Ubuntu 22.04 LTS",
	"Debian 12",
	"AlmaLinux 9",
	"Rocky Linux 9",
	"CentOS Stream 9",
	"Windows Server 2022",
	"Custom"
];
var PLAN_OPTIONS = [
	"VPS Starter",
	"VPS Pro",
	"VPS Business",
	"VPS Enterprise",
	"Cloud CPU-Optimized",
	"Cloud RAM-Optimized",
	"Dedicated Server",
	"Custom"
];
var DC_OPTIONS = [
	"Mumbai · IN",
	"Bengaluru · IN",
	"Chennai · IN",
	"Delhi NCR · IN",
	"Singapore · SG",
	"Frankfurt · DE",
	"Amsterdam · NL",
	"London · UK",
	"New York · US",
	"San Francisco · US",
	"Dubai · AE",
	"Sydney · AU"
];
function emptyForm() {
	return {
		title: "",
		subtitle: "",
		status: "active",
		amount_inr: "",
		due_at: "",
		customer_id: "",
		metadata: {
			hostname: "",
			ip_address: "",
			ipv6: "",
			ssh_port: "22",
			os: "Ubuntu 24.04 LTS",
			cpu_cores: "",
			ram_gb: "",
			storage_gb: "",
			bandwidth_gb: "",
			datacenter: "Mumbai · IN",
			plan: "VPS Pro",
			root_user: "root",
			root_password: "",
			panel_url: "",
			panel_user: "",
			panel_password: "",
			provisioned_at: "",
			notes: "",
			billing_cycle: "monthly",
			payment_method: "razorpay",
			auto_renew: false,
			gst_percent: 18,
			last_invoice_id: "",
			last_invoice_number: ""
		},
		generate_invoice: true,
		send_notification: true
	};
}
function statusTone(s) {
	const k = s.toLowerCase();
	if (k === "active") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
	if (k === "provisioning") return "bg-sky-500/15 text-sky-500 border-sky-500/30";
	if (k === "suspended") return "bg-amber-500/15 text-amber-500 border-amber-500/30";
	return "bg-rose-500/15 text-rose-500 border-rose-500/30";
}
function AdminVpsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "VPS Instances",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VpsBody, {})
	});
}
function VpsBody() {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(() => emptyForm());
	const [customerSearch, setCustomerSearch] = (0, import_react.useState)("");
	const { data: profiles = [] } = useQuery({
		queryKey: ["profiles-lite"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("id, full_name, email").order("full_name", { ascending: true }).limit(500);
			if (error) throw error;
			return data ?? [];
		}
	});
	const profileById = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		profiles.forEach((p) => m.set(p.id, p));
		return m;
	}, [profiles]);
	const filteredCustomers = (0, import_react.useMemo)(() => {
		const q = customerSearch.trim().toLowerCase();
		if (!q) return profiles.slice(0, 50);
		return profiles.filter((p) => (p.full_name ?? "").toLowerCase().includes(q) || (p.email ?? "").toLowerCase().includes(q)).slice(0, 50);
	}, [profiles, customerSearch]);
	const { data: rows = [], isLoading } = useQuery({
		queryKey: ["module_records", "vps_instance"],
		queryFn: async () => {
			const { data, error } = await supabase.from("module_records").select("id, title, subtitle, status, amount_inr, due_at, customer_id, metadata, created_at, updated_at").eq("module", "vps_instance").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return rows.filter((r) => {
			if (statusFilter !== "all" && r.status !== statusFilter) return false;
			if (!q) return true;
			const p = r.customer_id ? profileById.get(r.customer_id) : null;
			return [
				r.title,
				r.subtitle ?? "",
				r.metadata?.hostname ?? "",
				r.metadata?.ip_address ?? "",
				p?.full_name ?? "",
				p?.email ?? ""
			].join(" ").toLowerCase().includes(q);
		});
	}, [
		rows,
		search,
		statusFilter,
		profileById
	]);
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: rows.length,
			active: rows.filter((r) => r.status === "active").length,
			suspended: rows.filter((r) => r.status === "suspended").length,
			monthly: rows.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0)
		};
	}, [rows]);
	const upsert = useMutation({
		mutationFn: async (f) => {
			if (!f.customer_id) throw new Error("Select the customer this VPS belongs to.");
			if (!f.title.trim()) throw new Error("Enter a label for the VPS.");
			const cycle = f.metadata.billing_cycle ?? "monthly";
			const months = CYCLE_MONTHS[cycle];
			const dueAtIso = f.due_at ? new Date(f.due_at).toISOString() : !f.id && months > 0 ? addMonthsISO(null, months) : null;
			const amount = f.amount_inr ? Number(f.amount_inr) : 0;
			const metadata = { ...f.metadata };
			let invoiceId = null;
			let invoiceNumber = null;
			const shouldInvoice = !f.id && f.generate_invoice && amount > 0;
			const profile = profileById.get(f.customer_id);
			if (shouldInvoice) {
				const order = await createVpsOrder({
					customerId: f.customer_id,
					customerName: profile?.full_name ?? null,
					customerEmail: profile?.email ?? null,
					vpsTitle: f.title.trim(),
					plan: metadata.plan,
					hostname: metadata.hostname,
					amountInr: amount,
					gstPercent: Number(metadata.gst_percent ?? 18),
					billingCycle: cycle,
					paymentMethod: metadata.payment_method ?? "razorpay"
				});
				invoiceId = order.id;
				invoiceNumber = order.invoice_number ?? order.order_number;
				metadata.last_invoice_id = invoiceId ?? "";
				metadata.last_invoice_number = invoiceNumber ?? "";
				if (metadata.payment_method === "wallet") try {
					await debitWalletForOrder({
						customerId: f.customer_id,
						amount: Number(order.total_inr),
						orderId: order.id,
						description: `VPS ${f.title.trim()} — ${invoiceNumber}`
					});
				} catch (e) {
					await supabase.from("orders").update({
						status: "pending",
						paid_at: null,
						payment_method: "razorpay"
					}).eq("id", order.id);
					throw e;
				}
			}
			const payload = {
				module: "vps_instance",
				title: f.title.trim(),
				subtitle: f.subtitle.trim() || null,
				status: f.status,
				amount_inr: amount,
				due_at: dueAtIso,
				customer_id: f.customer_id,
				metadata
			};
			if (f.id) {
				const { error } = await supabase.from("module_records").update(payload).eq("id", f.id);
				if (error) throw error;
				await logAudit({
					action: "update",
					resource: "settings",
					resource_id: f.id,
					details: { title: payload.title }
				});
			} else {
				const { error } = await supabase.from("module_records").insert(payload);
				if (error) throw error;
				await logAudit({
					action: "create",
					resource: "settings",
					details: {
						title: payload.title,
						invoice: invoiceNumber
					}
				});
			}
			if (!f.id && f.send_notification) try {
				const parts = [];
				parts.push(`Your ${metadata.plan || "VPS"} "${f.title.trim()}" is ready.`);
				if (metadata.hostname) parts.push(`Hostname: ${metadata.hostname}.`);
				if (dueAtIso) parts.push(`Next renewal: ${dueAtIso.slice(0, 10)}.`);
				if (invoiceNumber) {
					const paid = metadata.payment_method === "wallet" || metadata.payment_method === "complimentary";
					parts.push(paid ? `Invoice ${invoiceNumber} — paid.` : `Invoice ${invoiceNumber} — please pay to activate billing.`);
				}
				await notifyCustomerVps({
					customerId: f.customer_id,
					title: shouldInvoice ? "New VPS provisioned & invoiced" : "New VPS provisioned",
					body: parts.join(" "),
					href: "/portal/vps"
				});
			} catch {}
			return { invoiceNumber };
		},
		onSuccess: (res) => {
			toast.success(form.id ? "VPS updated" : res?.invoiceNumber ? `VPS provisioned · Invoice ${res.invoiceNumber}` : "VPS added for client");
			setDialogOpen(false);
			setForm(emptyForm());
			qc.invalidateQueries({ queryKey: ["module_records", "vps_instance"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("module_records").delete().eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "delete",
				resource: "settings",
				resource_id: id
			});
		},
		onSuccess: () => {
			toast.success("VPS deleted");
			qc.invalidateQueries({ queryKey: ["module_records", "vps_instance"] });
		},
		onError: (e) => toast.error(e.message)
	});
	function openNew() {
		setForm(emptyForm());
		setCustomerSearch("");
		setDialogOpen(true);
	}
	function openEdit(r) {
		const meta = {
			...emptyForm().metadata,
			...r.metadata ?? {}
		};
		setForm({
			id: r.id,
			title: r.title,
			subtitle: r.subtitle ?? "",
			status: STATUSES.includes(r.status) ? r.status : "active",
			amount_inr: r.amount_inr != null ? String(r.amount_inr) : "",
			due_at: r.due_at ? r.due_at.slice(0, 10) : "",
			customer_id: r.customer_id ?? "",
			metadata: meta,
			generate_invoice: false,
			send_notification: false
		});
		setCustomerSearch("");
		setDialogOpen(true);
	}
	function setMeta(patch) {
		setForm((f) => ({
			...f,
			metadata: {
				...f.metadata,
				...patch
			}
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 min-w-0 max-w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-start gap-3 sm:gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "h-6 w-6 text-white" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold sm:text-2xl",
							children: "VPS Instances"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 max-w-2xl text-sm text-muted-foreground",
							children: [
								"Manually provision a VPS for any client. Details you enter here appear instantly on the client's ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "Portal → My VPS"
								}),
								" dashboard."
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: dialogOpen,
					onOpenChange: setDialogOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: openNew,
							className: "w-full bg-gradient-brand text-white sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), " Add VPS for client"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "w-[calc(100vw-2rem)] max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
								className: "px-6 pt-6 pb-3 border-b border-border sticky top-0 bg-background z-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Edit VPS" : "Add VPS for a client" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-6 py-4 space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
										title: "Client & label",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
												label: "Client (customer)",
												className: "md:col-span-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Search by name or email…",
														value: customerSearch,
														onChange: (e) => setCustomerSearch(e.target.value)
													}),
													form.customer_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2 text-xs text-muted-foreground",
														children: ["Assigned to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium text-foreground",
															children: profileById.get(form.customer_id)?.full_name || profileById.get(form.customer_id)?.email || form.customer_id
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2 max-h-40 overflow-y-auto rounded-md border border-border divide-y divide-border",
														children: [filteredCustomers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "p-3 text-xs text-muted-foreground",
															children: "No matching clients."
														}), filteredCustomers.map((p) => {
															return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																type: "button",
																onClick: () => setForm({
																	...form,
																	customer_id: p.id
																}),
																className: cn("w-full text-left px-3 py-2 text-xs hover:bg-muted", form.customer_id === p.id && "bg-primary/10"),
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "font-medium text-foreground",
																	children: p.full_name || "(no name)"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "text-muted-foreground truncate",
																	children: p.email
																})]
															}, p.id);
														})]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Label (shown to client)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: form.title,
													onChange: (e) => setForm({
														...form,
														title: e.target.value
													}),
													placeholder: "Production VPS"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Status",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.status,
													onValueChange: (v) => setForm({
														...form,
														status: v
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: s,
														children: s
													}, s)) })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Short description",
												className: "md:col-span-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													rows: 2,
													value: form.subtitle,
													onChange: (e) => setForm({
														...form,
														subtitle: e.target.value
													}),
													placeholder: "Purpose, workload, notes shown to the client…"
												})
											})
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
										title: "Plan & specifications",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] uppercase tracking-wide text-muted-foreground",
												children: "Quick fill from Hosting page:"
											}), HOSTING_VPS_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setForm((f) => ({
														...f,
														amount_inr: String(p.price),
														metadata: {
															...f.metadata,
															plan: p.plan,
															cpu_cores: String(p.cpu),
															ram_gb: String(p.ram),
															storage_gb: String(p.storage),
															bandwidth_gb: String(p.bandwidth)
														}
													}));
													toast.success(`${p.name} specs applied — ₹${p.price}/mo`);
												},
												className: "rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 text-xs font-medium px-3 py-1 text-primary",
												children: [
													p.name,
													" · ₹",
													p.price
												]
											}, p.id))]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Plan",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.metadata.plan,
													onValueChange: (v) => setMeta({ plan: v }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PLAN_OPTIONS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: p,
														children: p
													}, p)) })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Datacenter",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.metadata.datacenter,
													onValueChange: (v) => setMeta({ datacenter: v }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DC_OPTIONS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: d,
														children: d
													}, d)) })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Operating system",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.metadata.os,
													onValueChange: (v) => setMeta({ os: v }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: OS_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: o,
														children: o
													}, o)) })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Hostname",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: form.metadata.hostname,
													onChange: (e) => setMeta({ hostname: e.target.value }),
													placeholder: "vps01.client.com"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "CPU cores",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 1,
													value: form.metadata.cpu_cores,
													onChange: (e) => setMeta({ cpu_cores: e.target.value }),
													placeholder: "4"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "RAM (GB)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 1,
													value: form.metadata.ram_gb,
													onChange: (e) => setMeta({ ram_gb: e.target.value }),
													placeholder: "8"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Storage (GB)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 10,
													value: form.metadata.storage_gb,
													onChange: (e) => setMeta({ storage_gb: e.target.value }),
													placeholder: "120"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Bandwidth (GB / month)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 0,
													value: form.metadata.bandwidth_gb,
													onChange: (e) => setMeta({ bandwidth_gb: e.target.value }),
													placeholder: "2000"
												})
											})
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
										title: "Network & access",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "IPv4 address",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: form.metadata.ip_address,
													onChange: (e) => setMeta({ ip_address: e.target.value }),
													placeholder: "103.21.xx.xx"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "IPv6 (optional)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: form.metadata.ipv6,
													onChange: (e) => setMeta({ ipv6: e.target.value }),
													placeholder: "2400:xxxx::1"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "SSH port",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 1,
													max: 65535,
													value: form.metadata.ssh_port,
													onChange: (e) => setMeta({ ssh_port: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "SSH / root user",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: form.metadata.root_user,
													onChange: (e) => setMeta({ root_user: e.target.value }),
													placeholder: "root"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Root password",
												className: "md:col-span-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: form.metadata.root_password,
													onChange: (e) => setMeta({ root_password: e.target.value }),
													placeholder: "Strong password — client will see this masked"
												})
											})
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
										title: "Control panel (optional)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Panel URL",
												className: "md:col-span-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: form.metadata.panel_url,
													onChange: (e) => setMeta({ panel_url: e.target.value }),
													placeholder: "https://panel.infiniforge.cloud"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Panel username",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: form.metadata.panel_user,
													onChange: (e) => setMeta({ panel_user: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Panel password",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: form.metadata.panel_password,
													onChange: (e) => setMeta({ panel_password: e.target.value })
												})
											})
										] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
										title: "Billing & renewal",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: form.metadata.billing_cycle === "one_time" ? "Amount (INR)" : "Cost per cycle (INR)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 0,
													step: "0.01",
													value: form.amount_inr,
													onChange: (e) => setForm({
														...form,
														amount_inr: e.target.value
													})
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "GST %",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													min: 0,
													max: 100,
													step: "0.01",
													value: String(form.metadata.gst_percent ?? 18),
													onChange: (e) => setMeta({ gst_percent: Number(e.target.value) })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Billing cycle",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.metadata.billing_cycle ?? "monthly",
													onValueChange: (v) => setMeta({ billing_cycle: v }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.keys(CYCLE_LABEL).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: c,
														children: CYCLE_LABEL[c]
													}, c)) })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Payment method",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.metadata.payment_method ?? "razorpay",
													onValueChange: (v) => setMeta({ payment_method: v }),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.keys(PAYMENT_METHOD_LABEL).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: m,
														children: PAYMENT_METHOD_LABEL[m]
													}, m)) })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Renewal / expiry date (auto if empty)",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "date",
													value: form.due_at,
													onChange: (e) => setForm({
														...form,
														due_at: e.target.value
													})
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Provisioned on",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "date",
													value: form.metadata.provisioned_at,
													onChange: (e) => setMeta({ provisioned_at: e.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "md:col-span-2 space-y-3 rounded-xl border border-border bg-muted/30 p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-sm font-medium",
															children: "Auto-renew"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xs text-muted-foreground",
															children: "Attempt to auto-charge on the renewal date."
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
															checked: !!form.metadata.auto_renew,
															onCheckedChange: (v) => setMeta({ auto_renew: v })
														})]
													}),
													!form.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-3 border-t border-border pt-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-sm font-medium",
															children: "Generate invoice"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xs text-muted-foreground",
															children: "Create an invoice in the customer's Orders on save."
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
															checked: form.generate_invoice,
															onCheckedChange: (v) => setForm({
																...form,
																generate_invoice: v
															})
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-3 border-t border-border pt-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-sm font-medium",
															children: "Notify customer"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xs text-muted-foreground",
															children: "Send an in-app notification with details & pay link."
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
															checked: form.send_notification,
															onCheckedChange: (v) => setForm({
																...form,
																send_notification: v
															})
														})]
													})] }),
													form.amount_inr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "border-t border-border pt-3 text-xs text-muted-foreground",
														children: (() => {
															const t = computeTotals(Number(form.amount_inr) || 0, Number(form.metadata.gst_percent ?? 18));
															return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex flex-wrap items-center gap-x-4 gap-y-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Base ₹", t.base.toLocaleString("en-IN")] }),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["+ GST ₹", t.gst.toLocaleString("en-IN")] }),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																		className: "text-foreground font-semibold",
																		children: ["= ₹", t.total.toLocaleString("en-IN")]
																	})
																]
															});
														})()
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Internal notes",
												className: "md:col-span-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													rows: 2,
													value: form.metadata.notes,
													onChange: (e) => setMeta({ notes: e.target.value }),
													placeholder: "Only visible to staff (also shown to client as info)."
												})
											})
										] })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "px-6 py-4 border-t border-border sticky bottom-0 bg-background gap-2 flex-col sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setDialogOpen(false),
									className: "w-full sm:w-auto",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => upsert.mutate(form),
									disabled: upsert.isPending,
									className: "w-full sm:w-auto bg-gradient-brand text-white",
									children: [upsert.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }), form.id ? "Save changes" : "Provision for client"]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total VPS",
						value: stats.total.toString(),
						icon: Server
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active",
						value: stats.active.toString(),
						icon: Shield,
						tone: "emerald"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Suspended",
						value: stats.suspended.toString(),
						icon: Cpu,
						tone: "amber"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Monthly MRR",
						value: `₹${stats.monthly.toLocaleString("en-IN")}`,
						icon: HardDrive
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-3 sm:p-4 space-y-4 min-w-0 max-w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search hostname, IP, client…",
							className: "pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-full sm:w-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s))] })]
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin inline mr-2" }), " Loading…"]
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-muted-foreground",
					children: [
						"No VPS instances yet. Click ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: "Add VPS for client"
						}),
						" to provision one manually."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3",
					children: filtered.map((r) => {
						const p = r.customer_id ? profileById.get(r.customer_id) : null;
						const m = r.metadata ?? {};
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card/60 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold text-foreground truncate",
												children: r.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: cn("text-xs", statusTone(r.status)),
												children: r.status
											}),
											m.plan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-xs",
												children: m.plan
											}),
											m.billing_cycle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-xs capitalize",
												children: String(m.billing_cycle).replace("_", " ")
											}),
											m.auto_renew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
												children: "Auto-renew"
											}),
											m.last_invoice_number && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "text-xs font-mono",
												children: m.last_invoice_number
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }),
													" ",
													p?.full_name || p?.email || "Unassigned"
												]
											}),
											m.hostname && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", m.hostname] }),
											m.ip_address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", m.ip_address] }),
											m.datacenter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), m.datacenter]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => openEdit(r),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => confirm(`Delete ${r.title}?`) && remove.mutate(r.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-rose-500" })
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniSpec, {
										icon: Cpu,
										label: `${m.cpu_cores || "—"} vCPU`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniSpec, {
										icon: HardDrive,
										label: `${m.ram_gb || "—"} GB RAM`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniSpec, {
										icon: HardDrive,
										label: `${m.storage_gb || "—"} GB SSD`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniSpec, {
										icon: Wifi,
										label: `${m.bandwidth_gb || "—"} GB BW`
									})
								]
							})]
						}, r.id);
					})
				})]
			})
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium",
		children: title
	}), children] });
}
function Grid({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 md:grid-cols-2",
		children
	});
}
function Field({ label, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-1.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: label
		}), children]
	});
}
function StatCard({ label, value, icon: Icon, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "glass rounded-2xl p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-10 w-10 rounded-xl flex items-center justify-center", tone === "emerald" ? "text-emerald-500 bg-emerald-500/10" : tone === "amber" ? "text-amber-500 bg-amber-500/10" : "text-primary bg-primary/10"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-lg font-bold text-foreground",
				children: value
			})] })]
		})
	});
}
function MiniSpec({ icon: Icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-foreground",
			children: label
		})]
	});
}
//#endregion
export { AdminVpsPage as component };
