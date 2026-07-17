import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Server, Plus, Pencil, Trash2, Loader2, Search, Cpu, HardDrive,
  Wifi, MapPin, Shield, User as UserIcon,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";
import { cn } from "@/lib/utils";
import {
  CYCLE_LABEL, CYCLE_MONTHS, PAYMENT_METHOD_LABEL, HOSTING_VPS_PRESETS,
  addMonthsISO, computeTotals, createVpsOrder, debitWalletForOrder, notifyCustomerVps,
  type BillingCycle, type PaymentMethod,
} from "@/lib/vps-billing";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/vps")({
  head: () => ({
    meta: [
      { title: "VPS Instances — Infiniforge Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminVpsPage,
});

type ProfileRow = { id: string; full_name: string | null; email: string | null };

type VpsMetadata = {
  hostname?: string;
  ip_address?: string;
  ipv6?: string;
  ssh_port?: string;
  os?: string;
  cpu_cores?: string;
  ram_gb?: string;
  storage_gb?: string;
  bandwidth_gb?: string;
  datacenter?: string;
  plan?: string;
  root_user?: string;
  root_password?: string;
  panel_url?: string;
  panel_user?: string;
  panel_password?: string;
  provisioned_at?: string;
  notes?: string;
  billing_cycle?: BillingCycle;
  payment_method?: PaymentMethod;
  auto_renew?: boolean;
  gst_percent?: number;
  last_invoice_id?: string;
  last_invoice_number?: string;
};

type VpsRow = {
  id: string;
  title: string;
  subtitle: string | null;
  status: string;
  amount_inr: number | null;
  due_at: string | null;
  customer_id: string | null;
  metadata: VpsMetadata | null;
  created_at: string;
  updated_at: string;
};

const STATUSES = ["active", "provisioning", "suspended", "expired", "terminated"] as const;
type Status = (typeof STATUSES)[number];

const OS_OPTIONS = [
  "Ubuntu 24.04 LTS", "Ubuntu 22.04 LTS", "Debian 12", "AlmaLinux 9",
  "Rocky Linux 9", "CentOS Stream 9", "Windows Server 2022", "Custom",
];

const PLAN_OPTIONS = [
  "VPS Starter", "VPS Pro", "VPS Business", "VPS Enterprise",
  "Cloud CPU-Optimized", "Cloud RAM-Optimized", "Dedicated Server", "Custom",
];

const DC_OPTIONS = [
  "Mumbai · IN", "Bengaluru · IN", "Chennai · IN", "Delhi NCR · IN",
  "Singapore · SG", "Frankfurt · DE", "Amsterdam · NL", "London · UK",
  "New York · US", "San Francisco · US", "Dubai · AE", "Sydney · AU",
];

type FormState = {
  id?: string;
  title: string;
  subtitle: string;
  status: Status;
  amount_inr: string;
  due_at: string;
  customer_id: string;
  metadata: Required<VpsMetadata>;
  // billing controls (not persisted directly, drive order creation)
  generate_invoice: boolean;
  send_notification: boolean;
};

function emptyForm(): FormState {
  return {
    title: "",
    subtitle: "",
    status: "active",
    amount_inr: "",
    due_at: "",
    customer_id: "",
    metadata: {
      hostname: "", ip_address: "", ipv6: "", ssh_port: "22",
      os: "Ubuntu 24.04 LTS", cpu_cores: "", ram_gb: "", storage_gb: "",
      bandwidth_gb: "", datacenter: "Mumbai · IN", plan: "VPS Pro",
      root_user: "root", root_password: "", panel_url: "",
      panel_user: "", panel_password: "", provisioned_at: "", notes: "",
      billing_cycle: "monthly", payment_method: "razorpay",
      auto_renew: false, gst_percent: 18,
      last_invoice_id: "", last_invoice_number: "",
    },
    generate_invoice: true,
    send_notification: true,
  };
}

function statusTone(s: string) {
  const k = s.toLowerCase();
  if (k === "active") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
  if (k === "provisioning") return "bg-sky-500/15 text-sky-500 border-sky-500/30";
  if (k === "suspended") return "bg-amber-500/15 text-amber-500 border-amber-500/30";
  return "bg-rose-500/15 text-rose-500 border-rose-500/30";
}

function AdminVpsPage() {
  return (
    <AdminShell title="VPS Instances">
      <VpsBody />
    </AdminShell>
  );
}

function VpsBody() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => emptyForm());
  const [customerSearch, setCustomerSearch] = useState("");

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles-lite"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name", { ascending: true })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as ProfileRow[];
    },
  });

  const profileById = useMemo(() => {
    const m = new Map<string, ProfileRow>();
    profiles.forEach((p) => m.set(p.id, p));
    return m;
  }, [profiles]);

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return profiles.slice(0, 50);
    return profiles.filter((p) =>
      (p.full_name ?? "").toLowerCase().includes(q) ||
      (p.email ?? "").toLowerCase().includes(q),
    ).slice(0, 50);
  }, [profiles, customerSearch]);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["module_records", "vps_instance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_records")
        .select("id, title, subtitle, status, amount_inr, due_at, customer_id, metadata, created_at, updated_at")
        .eq("module", "vps_instance")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as VpsRow[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      const p = r.customer_id ? profileById.get(r.customer_id) : null;
      const bag = [
        r.title, r.subtitle ?? "", r.metadata?.hostname ?? "",
        r.metadata?.ip_address ?? "", p?.full_name ?? "", p?.email ?? "",
      ].join(" ").toLowerCase();
      return bag.includes(q);
    });
  }, [rows, search, statusFilter, profileById]);

  const stats = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => r.status === "active").length;
    const suspended = rows.filter((r) => r.status === "suspended").length;
    const monthly = rows.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0);
    return { total, active, suspended, monthly };
  }, [rows]);

  const upsert = useMutation({
    mutationFn: async (f: FormState) => {
      if (!f.customer_id) throw new Error("Select the customer this VPS belongs to.");
      if (!f.title.trim()) throw new Error("Enter a label for the VPS.");

      // Auto-fill renewal date from billing cycle if empty and cycle is recurring
      const cycle = f.metadata.billing_cycle ?? "monthly";
      const months = CYCLE_MONTHS[cycle];
      const dueAtIso = f.due_at
        ? new Date(f.due_at).toISOString()
        : (!f.id && months > 0 ? addMonthsISO(null, months) : null);

      const amount = f.amount_inr ? Number(f.amount_inr) : 0;
      const metadata = { ...f.metadata } as Required<VpsMetadata>;

      let invoiceId: string | null = null;
      let invoiceNumber: string | null = null;
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
          paymentMethod: metadata.payment_method ?? "razorpay",
        });
        invoiceId = order.id;
        invoiceNumber = order.invoice_number ?? order.order_number;
        metadata.last_invoice_id = invoiceId ?? "";
        metadata.last_invoice_number = invoiceNumber ?? "";

        if (metadata.payment_method === "wallet") {
          try {
            await debitWalletForOrder({
              customerId: f.customer_id,
              amount: Number(order.total_inr),
              orderId: order.id,
              description: `VPS ${f.title.trim()} — ${invoiceNumber}`,
            });
          } catch (e) {
            // Roll back order to pending if wallet debit fails
            await supabase.from("orders").update({ status: "pending", paid_at: null, payment_method: "razorpay" }).eq("id", order.id);
            throw e;
          }
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
        metadata: metadata as never,
      };
      if (f.id) {
        const { error } = await supabase.from("module_records").update(payload).eq("id", f.id);
        if (error) throw error;
        await logAudit({ action: "update", resource: "settings", resource_id: f.id, details: { title: payload.title } });
      } else {
        const { error } = await supabase.from("module_records").insert(payload);
        if (error) throw error;
        await logAudit({ action: "create", resource: "settings", details: { title: payload.title, invoice: invoiceNumber } });
      }

      // Send in-app notification to the customer
      if (!f.id && f.send_notification) {
        try {
          const parts: string[] = [];
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
            href: "/portal/vps",
          });
        } catch { /* notification failure must not block VPS create */ }
      }

      return { invoiceNumber };
    },
    onSuccess: (res) => {
      toast.success(form.id
        ? "VPS updated"
        : res?.invoiceNumber
          ? `VPS provisioned · Invoice ${res.invoiceNumber}`
          : "VPS added for client");
      setDialogOpen(false);
      setForm(emptyForm());
      qc.invalidateQueries({ queryKey: ["module_records", "vps_instance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("module_records").delete().eq("id", id);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "settings", resource_id: id });
    },
    onSuccess: () => {
      toast.success("VPS deleted");
      qc.invalidateQueries({ queryKey: ["module_records", "vps_instance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openNew() { setForm(emptyForm()); setCustomerSearch(""); setDialogOpen(true); }
  function openEdit(r: VpsRow) {
    const meta = { ...emptyForm().metadata, ...(r.metadata ?? {}) };
    setForm({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle ?? "",
      status: (STATUSES as readonly string[]).includes(r.status) ? (r.status as Status) : "active",
      amount_inr: r.amount_inr != null ? String(r.amount_inr) : "",
      due_at: r.due_at ? r.due_at.slice(0, 10) : "",
      customer_id: r.customer_id ?? "",
      metadata: meta,
      generate_invoice: false,
      send_notification: false,
    });
    setCustomerSearch("");
    setDialogOpen(true);
  }

  function setMeta(patch: Partial<VpsMetadata>) {
    setForm((f) => ({ ...f, metadata: { ...f.metadata, ...patch } as Required<VpsMetadata> }));
  }

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Header */}
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0">
            <Server className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold sm:text-2xl">VPS Instances</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Manually provision a VPS for any client. Details you enter here appear instantly on the client's <span className="font-medium text-foreground">Portal → My VPS</span> dashboard.
            </p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="w-full bg-gradient-brand text-white sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Add VPS for client
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0">
            <DialogHeader className="px-6 pt-6 pb-3 border-b border-border sticky top-0 bg-background z-10">
              <DialogTitle>{form.id ? "Edit VPS" : "Add VPS for a client"}</DialogTitle>
            </DialogHeader>
            <div className="px-6 py-4 space-y-6">
              {/* Client + label */}
              <Section title="Client & label">
                <Grid>
                  <Field label="Client (customer)" className="md:col-span-2">
                    <Input
                      placeholder="Search by name or email…"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                    {form.customer_id && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Assigned to <span className="font-medium text-foreground">
                          {profileById.get(form.customer_id)?.full_name || profileById.get(form.customer_id)?.email || form.customer_id}
                        </span>
                      </div>
                    )}
                    <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-border divide-y divide-border">
                      {filteredCustomers.length === 0 && (
                        <div className="p-3 text-xs text-muted-foreground">No matching clients.</div>
                      )}
                      {filteredCustomers.map((p) => {
                        const selected = form.customer_id === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setForm({ ...form, customer_id: p.id })}
                            className={cn(
                              "w-full text-left px-3 py-2 text-xs hover:bg-muted",
                              selected && "bg-primary/10",
                            )}
                          >
                            <div className="font-medium text-foreground">{p.full_name || "(no name)"}</div>
                            <div className="text-muted-foreground truncate">{p.email}</div>
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                  <Field label="Label (shown to client)">
                    <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Production VPS" />
                  </Field>
                  <Field label="Status">
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Status })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Short description" className="md:col-span-2">
                    <Textarea rows={2} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Purpose, workload, notes shown to the client…" />
                  </Field>
                </Grid>
              </Section>

              {/* Plan & specs */}
              <Section title="Plan & specifications">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Quick fill from Hosting page:</span>
                  {HOSTING_VPS_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setForm((f) => ({
                          ...f,
                          amount_inr: String(p.price),
                          metadata: {
                            ...f.metadata,
                            plan: p.plan,
                            cpu_cores: String(p.cpu),
                            ram_gb: String(p.ram),
                            storage_gb: String(p.storage),
                            bandwidth_gb: String(p.bandwidth),
                          },
                        }));
                        toast.success(`${p.name} specs applied — ₹${p.price}/mo`);
                      }}
                      className="rounded-full border border-primary/30 bg-primary/5 hover:bg-primary/10 text-xs font-medium px-3 py-1 text-primary"
                    >
                      {p.name} · ₹{p.price}
                    </button>
                  ))}
                </div>
                <Grid>
                  <Field label="Plan">
                    <Select value={form.metadata.plan} onValueChange={(v) => setMeta({ plan: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{PLAN_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Datacenter">
                    <Select value={form.metadata.datacenter} onValueChange={(v) => setMeta({ datacenter: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{DC_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Operating system">
                    <Select value={form.metadata.os} onValueChange={(v) => setMeta({ os: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{OS_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Hostname"><Input value={form.metadata.hostname} onChange={(e) => setMeta({ hostname: e.target.value })} placeholder="vps01.client.com" /></Field>
                  <Field label="CPU cores"><Input type="number" min={1} value={form.metadata.cpu_cores} onChange={(e) => setMeta({ cpu_cores: e.target.value })} placeholder="4" /></Field>
                  <Field label="RAM (GB)"><Input type="number" min={1} value={form.metadata.ram_gb} onChange={(e) => setMeta({ ram_gb: e.target.value })} placeholder="8" /></Field>
                  <Field label="Storage (GB)"><Input type="number" min={10} value={form.metadata.storage_gb} onChange={(e) => setMeta({ storage_gb: e.target.value })} placeholder="120" /></Field>
                  <Field label="Bandwidth (GB / month)"><Input type="number" min={0} value={form.metadata.bandwidth_gb} onChange={(e) => setMeta({ bandwidth_gb: e.target.value })} placeholder="2000" /></Field>
                </Grid>
              </Section>

              {/* Network & access */}
              <Section title="Network & access">
                <Grid>
                  <Field label="IPv4 address"><Input value={form.metadata.ip_address} onChange={(e) => setMeta({ ip_address: e.target.value })} placeholder="103.21.xx.xx" /></Field>
                  <Field label="IPv6 (optional)"><Input value={form.metadata.ipv6} onChange={(e) => setMeta({ ipv6: e.target.value })} placeholder="2400:xxxx::1" /></Field>
                  <Field label="SSH port"><Input type="number" min={1} max={65535} value={form.metadata.ssh_port} onChange={(e) => setMeta({ ssh_port: e.target.value })} /></Field>
                  <Field label="SSH / root user"><Input value={form.metadata.root_user} onChange={(e) => setMeta({ root_user: e.target.value })} placeholder="root" /></Field>
                  <Field label="Root password" className="md:col-span-2"><Input value={form.metadata.root_password} onChange={(e) => setMeta({ root_password: e.target.value })} placeholder="Strong password — client will see this masked" /></Field>
                </Grid>
              </Section>

              {/* Control panel */}
              <Section title="Control panel (optional)">
                <Grid>
                  <Field label="Panel URL" className="md:col-span-2"><Input value={form.metadata.panel_url} onChange={(e) => setMeta({ panel_url: e.target.value })} placeholder="https://panel.infiniforge.cloud" /></Field>
                  <Field label="Panel username"><Input value={form.metadata.panel_user} onChange={(e) => setMeta({ panel_user: e.target.value })} /></Field>
                  <Field label="Panel password"><Input value={form.metadata.panel_password} onChange={(e) => setMeta({ panel_password: e.target.value })} /></Field>
                </Grid>
              </Section>

              {/* Billing */}
              <Section title="Billing & renewal">
                <Grid>
                  <Field label={form.metadata.billing_cycle === "one_time" ? "Amount (INR)" : "Cost per cycle (INR)"}>
                    <Input type="number" min={0} step="0.01" value={form.amount_inr} onChange={(e) => setForm({ ...form, amount_inr: e.target.value })} />
                  </Field>
                  <Field label="GST %">
                    <Input type="number" min={0} max={100} step="0.01" value={String(form.metadata.gst_percent ?? 18)} onChange={(e) => setMeta({ gst_percent: Number(e.target.value) })} />
                  </Field>
                  <Field label="Billing cycle">
                    <Select value={form.metadata.billing_cycle ?? "monthly"} onValueChange={(v) => setMeta({ billing_cycle: v as BillingCycle })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(CYCLE_LABEL) as BillingCycle[]).map((c) => (
                          <SelectItem key={c} value={c}>{CYCLE_LABEL[c]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Payment method">
                    <Select value={form.metadata.payment_method ?? "razorpay"} onValueChange={(v) => setMeta({ payment_method: v as PaymentMethod })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(PAYMENT_METHOD_LABEL) as PaymentMethod[]).map((m) => (
                          <SelectItem key={m} value={m}>{PAYMENT_METHOD_LABEL[m]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Renewal / expiry date (auto if empty)">
                    <Input type="date" value={form.due_at} onChange={(e) => setForm({ ...form, due_at: e.target.value })} />
                  </Field>
                  <Field label="Provisioned on">
                    <Input type="date" value={form.metadata.provisioned_at} onChange={(e) => setMeta({ provisioned_at: e.target.value })} />
                  </Field>
                  <div className="md:col-span-2 space-y-3 rounded-xl border border-border bg-muted/30 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">Auto-renew</div>
                        <div className="text-xs text-muted-foreground">Attempt to auto-charge on the renewal date.</div>
                      </div>
                      <Switch checked={!!form.metadata.auto_renew} onCheckedChange={(v) => setMeta({ auto_renew: v })} />
                    </div>
                    {!form.id && (
                      <>
                        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                          <div>
                            <div className="text-sm font-medium">Generate invoice</div>
                            <div className="text-xs text-muted-foreground">Create an invoice in the customer's Orders on save.</div>
                          </div>
                          <Switch checked={form.generate_invoice} onCheckedChange={(v) => setForm({ ...form, generate_invoice: v })} />
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                          <div>
                            <div className="text-sm font-medium">Notify customer</div>
                            <div className="text-xs text-muted-foreground">Send an in-app notification with details & pay link.</div>
                          </div>
                          <Switch checked={form.send_notification} onCheckedChange={(v) => setForm({ ...form, send_notification: v })} />
                        </div>
                      </>
                    )}
                    {form.amount_inr && (
                      <div className="border-t border-border pt-3 text-xs text-muted-foreground">
                        {(() => {
                          const t = computeTotals(Number(form.amount_inr) || 0, Number(form.metadata.gst_percent ?? 18));
                          return (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span>Base ₹{t.base.toLocaleString("en-IN")}</span>
                              <span>+ GST ₹{t.gst.toLocaleString("en-IN")}</span>
                              <span className="text-foreground font-semibold">= ₹{t.total.toLocaleString("en-IN")}</span>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <Field label="Internal notes" className="md:col-span-2">
                    <Textarea rows={2} value={form.metadata.notes} onChange={(e) => setMeta({ notes: e.target.value })} placeholder="Only visible to staff (also shown to client as info)." />
                  </Field>
                </Grid>
              </Section>
            </div>
            <DialogFooter className="px-6 py-4 border-t border-border sticky bottom-0 bg-background gap-2 flex-col sm:flex-row">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={() => upsert.mutate(form)} disabled={upsert.isPending} className="w-full sm:w-auto bg-gradient-brand text-white">
                {upsert.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {form.id ? "Save changes" : "Provision for client"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total VPS" value={stats.total.toString()} icon={Server} />
        <StatCard label="Active" value={stats.active.toString()} icon={Shield} tone="emerald" />
        <StatCard label="Suspended" value={stats.suspended.toString()} icon={Cpu} tone="amber" />
        <StatCard label="Monthly MRR" value={`₹${stats.monthly.toLocaleString("en-IN")}`} icon={HardDrive} />
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-3 sm:p-4 space-y-4 min-w-0 max-w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-0 flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search hostname, IP, client…" className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            No VPS instances yet. Click <span className="font-medium text-foreground">Add VPS for client</span> to provision one manually.
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((r) => {
              const p = r.customer_id ? profileById.get(r.customer_id) : null;
              const m = r.metadata ?? {};
              return (
                <div key={r.id} className="rounded-xl border border-border bg-card/60 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground truncate">{r.title}</h3>
                        <Badge variant="outline" className={cn("text-xs", statusTone(r.status))}>{r.status}</Badge>
                        {m.plan && <Badge variant="outline" className="text-xs">{m.plan}</Badge>}
                        {m.billing_cycle && <Badge variant="outline" className="text-xs capitalize">{String(m.billing_cycle).replace("_", " ")}</Badge>}
                        {m.auto_renew && <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Auto-renew</Badge>}
                        {m.last_invoice_number && <Badge variant="outline" className="text-xs font-mono">{m.last_invoice_number}</Badge>}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><UserIcon className="h-3.5 w-3.5" /> {p?.full_name || p?.email || "Unassigned"}</span>
                        {m.hostname && <span>· {m.hostname}</span>}
                        {m.ip_address && <span>· {m.ip_address}</span>}
                        {m.datacenter && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{m.datacenter}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => confirm(`Delete ${r.title}?`) && remove.mutate(r.id)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <MiniSpec icon={Cpu} label={`${m.cpu_cores || "—"} vCPU`} />
                    <MiniSpec icon={HardDrive} label={`${m.ram_gb || "—"} GB RAM`} />
                    <MiniSpec icon={HardDrive} label={`${m.storage_gb || "—"} GB SSD`} />
                    <MiniSpec icon={Wifi} label={`${m.bandwidth_gb || "—"} GB BW`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ helpers ============
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">{title}</div>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone }: {
  label: string; value: string; icon: React.ComponentType<{ className?: string }>; tone?: "emerald" | "amber";
}) {
  const iconTone = tone === "emerald" ? "text-emerald-500 bg-emerald-500/10" :
                   tone === "amber" ? "text-amber-500 bg-amber-500/10" :
                   "text-primary bg-primary/10";
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", iconTone)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-lg font-bold text-foreground">{value}</div>
        </div>
      </div>
    </div>
  );
}

function MiniSpec({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-2.5 py-1.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-foreground">{label}</span>
    </div>
  );
}
