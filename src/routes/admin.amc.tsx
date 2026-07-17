import { createFileRoute } from "@tanstack/react-router";
import { Wrench, Plus, Search, Pencil, Trash2, FileText, FileDown, Signature, Loader2, ShieldCheck, CalendarClock, IndianRupee, CheckCircle2, Upload, X, Image as ImageIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";
import { formatINR } from "@/lib/catalog";
import { SignaturePad } from "@/components/SignaturePad";
import { useCms } from "@/lib/cms";
import { downloadAmcPdf, downloadAmcDocx, type AmcContractData } from "@/lib/amc-contract";

export const Route = createFileRoute("/admin/amc")({
  head: () => ({ meta: [{ title: "AMC Contracts — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="AMC Contracts"><Page /></AdminShell>,
});

type AmcRecord = {
  id: string;
  module: string;
  title: string;
  subtitle: string | null;
  status: string;
  amount_inr: number | null;
  due_at: string | null;
  tags: string[] | null;
  metadata: Record<string, unknown> & Partial<AmcContractData>;
  created_at: string;
  updated_at: string;
};

const STATUSES = ["draft", "active", "pending_renewal", "expired", "cancelled"];
const DEFAULT_RULES = `Service provider will respond to reported incidents within the agreed SLA window.
Preventive maintenance visits will be scheduled at mutually agreed intervals.
Emergency on-site support beyond scope will be billed additionally at standard rates.
Client will provide safe access, power and network connectivity for on-site work.
Spare parts and hardware replacements are excluded unless explicitly listed in scope.`;
const DEFAULT_TERMS = `This contract is valid from the start date through the end date stated above.
Renewal is subject to mutual agreement 30 days prior to expiry.
Either party may terminate with a 30-day written notice; pro-rata refunds apply on unused period.
All disputes shall be governed by the laws of India and subject to jurisdiction of the courts in the seller's registered state.
Payment terms: contract value payable in advance / as per invoice schedule. GST applicable extra.`;

type FormState = {
  id?: string;
  contract_no: string;
  title: string;
  subtitle: string;
  status: string;
  amount_inr: string;
  start_date: string;
  end_date: string;
  client_name: string;
  client_email: string;
  client_address: string;
  client_gstin: string;
  sla_response_hours: string;
  visits_per_year: string;
  coverage_scope: string;
  rules: string;
  terms: string;
  signature_mode: "digital" | "physical";
  signatory_provider_name: string;
  signatory_provider_title: string;
  signatory_provider_signature: string | null;
  signatory_provider_signed_at: string;
  signatory_client_name: string;
  signatory_client_title: string;
  signatory_client_signature: string | null;
  signatory_client_signed_at: string;
  logo_url: string | null;
};

function empty(): FormState {
  const today = new Date();
  const next = new Date(); next.setFullYear(today.getFullYear() + 1);
  return {
    contract_no: `AMC-${Date.now().toString().slice(-8)}`,
    title: "", subtitle: "", status: "draft", amount_inr: "",
    start_date: today.toISOString().slice(0, 10), end_date: next.toISOString().slice(0, 10),
    client_name: "", client_email: "", client_address: "", client_gstin: "",
    sla_response_hours: "8", visits_per_year: "4",
    coverage_scope: "Preventive maintenance, incident response, remote support and quarterly reviews.",
    rules: DEFAULT_RULES, terms: DEFAULT_TERMS,
    signature_mode: "digital",
    signatory_provider_name: "", signatory_provider_title: "Authorised signatory",
    signatory_provider_signature: null, signatory_provider_signed_at: "",
    signatory_client_name: "", signatory_client_title: "Authorised signatory",
    signatory_client_signature: null, signatory_client_signed_at: "",
    logo_url: null,
  };
}

function statusTone(s: string) {
  if (s === "active") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
  if (s === "pending_renewal") return "bg-amber-500/15 text-amber-500 border-amber-500/30";
  if (s === "expired" || s === "cancelled") return "bg-rose-500/15 text-rose-500 border-rose-500/30";
  return "bg-primary/15 text-primary border-primary/30";
}

function toContract(r: AmcRecord, fallbackLogo?: string | null): AmcContractData {
  const m = r.metadata ?? {};
  return {
    contract_no: (m.contract_no as string) ?? r.id.slice(0, 8).toUpperCase(),
    title: r.title,
    subtitle: r.subtitle,
    client_name: m.client_name as string, client_address: m.client_address as string,
    client_email: m.client_email as string, client_gstin: m.client_gstin as string,
    contract_value_inr: r.amount_inr ?? undefined,
    status: r.status,
    start_date: m.start_date as string, end_date: (m.end_date as string) ?? (r.due_at ? r.due_at.slice(0, 10) : undefined),
    sla_response_hours: m.sla_response_hours as string,
    visits_per_year: m.visits_per_year as string,
    coverage_scope: m.coverage_scope as string,
    rules: m.rules as string, terms: m.terms as string,
    signature_mode: (m.signature_mode as "digital" | "physical") ?? "digital",
    signatory_provider_name: m.signatory_provider_name as string,
    signatory_provider_title: m.signatory_provider_title as string,
    signatory_provider_signature: (m.signatory_provider_signature as string) ?? null,
    signatory_provider_signed_at: m.signatory_provider_signed_at as string,
    signatory_client_name: m.signatory_client_name as string,
    signatory_client_title: m.signatory_client_title as string,
    signatory_client_signature: (m.signatory_client_signature as string) ?? null,
    signatory_client_signed_at: m.signatory_client_signed_at as string,
    logo_url: (m.logo_url as string) ?? fallbackLogo ?? null,
  };
}

function Page() {
  const qc = useQueryClient();
  const branding = useCms("branding");
  const brandLogoFallback = branding?.logo_url || null;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["module_records", "amc"],
    queryFn: async () => {
      const { data, error } = await supabase.from("module_records").select("*")
        .eq("module", "amc").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as AmcRecord[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      const meta = r.metadata ?? {};
      return r.title.toLowerCase().includes(q) ||
        (meta.client_name as string | undefined)?.toLowerCase().includes(q) ||
        (meta.contract_no as string | undefined)?.toLowerCase().includes(q);
    });
  }, [records, search, statusFilter]);

  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter((r) => r.status === "active").length;
    const renew = records.filter((r) => r.status === "pending_renewal").length;
    const value = records.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0);
    return { total, active, renew, value };
  }, [records]);

  const upsert = useMutation({
    mutationFn: async (f: FormState) => {
      const metadata = {
        contract_no: f.contract_no,
        client_name: f.client_name, client_email: f.client_email,
        client_address: f.client_address, client_gstin: f.client_gstin,
        start_date: f.start_date, end_date: f.end_date,
        sla_response_hours: f.sla_response_hours, visits_per_year: f.visits_per_year,
        coverage_scope: f.coverage_scope, rules: f.rules, terms: f.terms,
        signature_mode: f.signature_mode,
        signatory_provider_name: f.signatory_provider_name,
        signatory_provider_title: f.signatory_provider_title,
        signatory_provider_signature: f.signatory_provider_signature,
        signatory_provider_signed_at: f.signatory_provider_signed_at,
        signatory_client_name: f.signatory_client_name,
        signatory_client_title: f.signatory_client_title,
        signatory_client_signature: f.signatory_client_signature,
        signatory_client_signed_at: f.signatory_client_signed_at,
        logo_url: f.logo_url,
      };
      const payload = {
        module: "amc", title: f.title.trim(),
        subtitle: f.subtitle.trim() || null,
        status: f.status,
        amount_inr: f.amount_inr ? Number(f.amount_inr) : 0,
        due_at: f.end_date ? new Date(f.end_date).toISOString() : null,
        tags: [f.signature_mode, f.status],
        metadata,
      };
      if (f.id) {
        const { error } = await supabase.from("module_records").update(payload).eq("id", f.id);
        if (error) throw error;
        await logAudit({ action: "update", resource: "settings", resource_id: f.id, details: { module: "amc", title: payload.title } });
      } else {
        const { error } = await supabase.from("module_records").insert(payload);
        if (error) throw error;
        await logAudit({ action: "create", resource: "settings", details: { module: "amc", title: payload.title } });
      }
    },
    onSuccess: () => {
      toast.success(form.id ? "Contract updated" : "Contract created");
      setOpen(false); setForm(empty());
      qc.invalidateQueries({ queryKey: ["module_records", "amc"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("module_records").delete().eq("id", id);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "settings", resource_id: id, details: { module: "amc" } });
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["module_records", "amc"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openNew() { setForm(empty()); setOpen(true); }
  function openEdit(r: AmcRecord) {
    const m = r.metadata ?? {};
    setForm({
      id: r.id,
      contract_no: (m.contract_no as string) ?? `AMC-${r.id.slice(0, 8).toUpperCase()}`,
      title: r.title, subtitle: r.subtitle ?? "", status: r.status,
      amount_inr: r.amount_inr != null ? String(r.amount_inr) : "",
      start_date: (m.start_date as string) ?? "",
      end_date: (m.end_date as string) ?? (r.due_at ? r.due_at.slice(0, 10) : ""),
      client_name: (m.client_name as string) ?? "",
      client_email: (m.client_email as string) ?? "",
      client_address: (m.client_address as string) ?? "",
      client_gstin: (m.client_gstin as string) ?? "",
      sla_response_hours: (m.sla_response_hours as string) ?? "",
      visits_per_year: (m.visits_per_year as string) ?? "",
      coverage_scope: (m.coverage_scope as string) ?? "",
      rules: (m.rules as string) ?? DEFAULT_RULES,
      terms: (m.terms as string) ?? DEFAULT_TERMS,
      signature_mode: ((m.signature_mode as "digital" | "physical") ?? "digital"),
      signatory_provider_name: (m.signatory_provider_name as string) ?? "",
      signatory_provider_title: (m.signatory_provider_title as string) ?? "Authorised signatory",
      signatory_provider_signature: (m.signatory_provider_signature as string) ?? null,
      signatory_provider_signed_at: (m.signatory_provider_signed_at as string) ?? "",
      signatory_client_name: (m.signatory_client_name as string) ?? "",
      signatory_client_title: (m.signatory_client_title as string) ?? "Authorised signatory",
      signatory_client_signature: (m.signatory_client_signature as string) ?? null,
      signatory_client_signed_at: (m.signatory_client_signed_at as string) ?? "",
      logo_url: (m.logo_url as string) ?? null,
    });
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AMC Contracts</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Draft, sign and export Annual Maintenance Contracts with rules, SLA terms and dual-party signatures (digital or physical).
            </p>
          </div>
        </div>
        <Button onClick={openNew} className="bg-gradient-brand text-white">
          <Plus className="h-4 w-4 mr-2" /> New AMC contract
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Kpi icon={ShieldCheck} label="Total contracts" value={String(stats.total)} />
        <Kpi icon={CheckCircle2} label="Active" value={String(stats.active)} tone="green" />
        <Kpi icon={CalendarClock} label="Pending renewal" value={String(stats.renew)} tone="saffron" />
        <Kpi icon={IndianRupee} label="Portfolio value" value={formatINR(stats.value)} tone="brand" />
      </div>

      <div className="glass rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by title, client, contract no…" className="pl-9"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No contracts yet. Click <b>New AMC contract</b> to create one.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="min-w-[860px] w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-2 px-2">Contract</th>
                  <th className="text-left py-2 px-2">Client</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-right py-2 px-2">Value</th>
                  <th className="text-left py-2 px-2">End date</th>
                  <th className="text-left py-2 px-2">Signatures</th>
                  <th className="text-right py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const m = r.metadata ?? {};
                  const providerSigned = !!m.signatory_provider_signature;
                  const clientSigned = !!m.signatory_client_signature;
                  return (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-2">
                        <div className="font-medium break-words">{r.title}</div>
                        <div className="text-xs text-muted-foreground break-all">{(m.contract_no as string) ?? r.id.slice(0, 8)}</div>
                      </td>
                      <td className="py-3 px-2">{(m.client_name as string) ?? "—"}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={statusTone(r.status)}>{r.status.replace("_", " ")}</Badge>
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">
                        {r.amount_inr ? formatINR(Number(r.amount_inr)) : "—"}
                      </td>
                      <td className="py-3 px-2">
                        {(m.end_date as string) ?? (r.due_at ? new Date(r.due_at).toLocaleDateString("en-IN") : "—")}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <Badge variant="outline" className={providerSigned ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-muted"}>
                            {providerSigned ? "Provider ✓" : "Provider …"}
                          </Badge>
                          <Badge variant="outline" className={clientSigned ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-muted"}>
                            {clientSigned ? "Client ✓" : "Client …"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="inline-flex gap-1">
                          <Button size="icon" variant="ghost" title="Export PDF"
                            onClick={() => downloadAmcPdf(toContract(r, brandLogoFallback))}>
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" title="Export Word"
                            onClick={() => downloadAmcDocx(toContract(r, brandLogoFallback))}>
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => {
                            if (confirm(`Delete contract "${r.title}"?`)) remove.mutate(r.id);
                          }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit AMC contract" : "New AMC contract"}</DialogTitle></DialogHeader>
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="rules">Rules &amp; Terms</TabsTrigger>
              <TabsTrigger value="sign">Signatures</TabsTrigger>
              <TabsTrigger value="preview">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="md:col-span-2 glass rounded-2xl p-4 flex flex-wrap items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-white/60 dark:bg-white/10 border border-border/60 flex items-center justify-center overflow-hidden shrink-0">
                  {form.logo_url || brandLogoFallback ? (
                    <img src={form.logo_url || brandLogoFallback || ""} alt="Contract logo" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-[220px]">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Contract logo</div>
                  <div className="text-sm font-medium">{form.logo_url ? "Custom logo attached" : brandLogoFallback ? "Using website brand logo" : "No logo — will show text header"}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">PNG/JPG, transparent works best. Max ~1MB.</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      if (file.size > 1024 * 1024 * 2) { toast.error("Logo too large (max 2MB)"); return; }
                      const reader = new FileReader();
                      reader.onload = () => setForm((f) => ({ ...f, logo_url: String(reader.result || "") }));
                      reader.readAsDataURL(file);
                      e.target.value = "";
                    }} />
                  <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" /> Upload logo
                  </Button>
                  {brandLogoFallback && (
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, logo_url: brandLogoFallback }))}>
                      Use website logo
                    </Button>
                  )}
                  {form.logo_url && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setForm((f) => ({ ...f, logo_url: null }))}>
                      <X className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  )}
                </div>
              </div>
              <F label="Contract number"><Input value={form.contract_no} onChange={(e) => setForm({ ...form, contract_no: e.target.value })} /></F>
              <F label="Status">
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Contract title" span2><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></F>
              <F label="Short description / notes" span2><Textarea rows={2} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></F>
              <F label="Client / Company"><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} /></F>
              <F label="Client email"><Input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} /></F>
              <F label="Client GSTIN"><Input value={form.client_gstin} onChange={(e) => setForm({ ...form, client_gstin: e.target.value })} /></F>
              <F label="Contract value (INR)"><Input type="number" min={0} step="0.01" value={form.amount_inr} onChange={(e) => setForm({ ...form, amount_inr: e.target.value })} /></F>
              <F label="Client address" span2><Textarea rows={2} value={form.client_address} onChange={(e) => setForm({ ...form, client_address: e.target.value })} /></F>
              <F label="Start date"><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></F>
              <F label="End date"><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></F>
              <F label="SLA response (hours)"><Input type="number" value={form.sla_response_hours} onChange={(e) => setForm({ ...form, sla_response_hours: e.target.value })} /></F>
              <F label="Visits per year"><Input type="number" value={form.visits_per_year} onChange={(e) => setForm({ ...form, visits_per_year: e.target.value })} /></F>
              <F label="Coverage scope" span2><Textarea rows={3} value={form.coverage_scope} onChange={(e) => setForm({ ...form, coverage_scope: e.target.value })} /></F>
            </TabsContent>

            <TabsContent value="rules" className="grid gap-4 mt-4">
              <F label="Rules & conditions (one per line — auto numbered on export)">
                <Textarea rows={8} value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} />
              </F>
              <F label="Terms & conditions (one per line — auto numbered on export)">
                <Textarea rows={8} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
              </F>
              <div className="text-xs text-muted-foreground">Tip: keep each clause on its own line. Blank lines are ignored.</div>
            </TabsContent>

            <TabsContent value="sign" className="grid gap-6 mt-4">
              <div className="flex items-center gap-3">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Signing mode</Label>
                <Select value={form.signature_mode} onValueChange={(v: "digital" | "physical") => setForm({ ...form, signature_mode: v })}>
                  <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital (draw signature)</SelectItem>
                    <SelectItem value="physical">Physical (print &amp; sign)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="glass rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 font-semibold"><Signature className="h-4 w-4 text-primary" /> Service Provider</div>
                  <F label="Signatory name"><Input value={form.signatory_provider_name} onChange={(e) => setForm({ ...form, signatory_provider_name: e.target.value })} /></F>
                  <F label="Designation"><Input value={form.signatory_provider_title} onChange={(e) => setForm({ ...form, signatory_provider_title: e.target.value })} /></F>
                  {form.signature_mode === "digital" ? (
                    <SignaturePad value={form.signatory_provider_signature} onChange={(url) =>
                      setForm({ ...form, signatory_provider_signature: url, signatory_provider_signed_at: url ? new Date().toISOString() : "" })} />
                  ) : (
                    <div className="text-xs text-muted-foreground rounded-lg bg-muted p-3">
                      Physical mode: the exported document leaves a signature box for wet-ink signature after printing.
                    </div>
                  )}
                </div>

                <div className="glass rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2 font-semibold"><Signature className="h-4 w-4 text-primary" /> Client</div>
                  <F label="Signatory name"><Input value={form.signatory_client_name} onChange={(e) => setForm({ ...form, signatory_client_name: e.target.value })} /></F>
                  <F label="Designation"><Input value={form.signatory_client_title} onChange={(e) => setForm({ ...form, signatory_client_title: e.target.value })} /></F>
                  {form.signature_mode === "digital" ? (
                    <SignaturePad value={form.signatory_client_signature} onChange={(url) =>
                      setForm({ ...form, signatory_client_signature: url, signatory_client_signed_at: url ? new Date().toISOString() : "" })} />
                  ) : (
                    <div className="text-xs text-muted-foreground rounded-lg bg-muted p-3">
                      Physical mode: the exported document leaves a signature box for wet-ink signature after printing.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Save the contract first, then export as PDF or Word. Both formats include your rules, terms and signatures.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => downloadAmcPdf(toContract({
                  id: form.id ?? "preview", module: "amc", title: form.title, subtitle: form.subtitle,
                  status: form.status, amount_inr: form.amount_inr ? Number(form.amount_inr) : 0,
                  due_at: form.end_date ? new Date(form.end_date).toISOString() : null,
                  tags: [], metadata: { ...form } as unknown as AmcRecord["metadata"], created_at: "", updated_at: "",
                }, brandLogoFallback))}>
                  <FileText className="h-4 w-4 mr-2" /> Preview PDF
                </Button>
                <Button variant="outline" onClick={() => downloadAmcDocx(toContract({
                  id: form.id ?? "preview", module: "amc", title: form.title, subtitle: form.subtitle,
                  status: form.status, amount_inr: form.amount_inr ? Number(form.amount_inr) : 0,
                  due_at: form.end_date ? new Date(form.end_date).toISOString() : null,
                  tags: [], metadata: { ...form } as unknown as AmcRecord["metadata"], created_at: "", updated_at: "",
                }, brandLogoFallback))}>
                  <FileDown className="h-4 w-4 mr-2" /> Preview Word (.doc)
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => upsert.mutate(form)} disabled={upsert.isPending || !form.title.trim()}>
              {upsert.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {form.id ? "Save changes" : "Create contract"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function F({ label, span2, children }: { label: string; span2?: boolean; children: React.ReactNode }) {
  return (
    <div className={span2 ? "md:col-span-2" : ""}>
      <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: typeof Wrench; label: string; value: string; tone?: "brand" | "green" | "saffron" }) {
  const bg = tone === "green" ? "bg-gradient-green" : tone === "saffron" ? "bg-gradient-saffron" : tone === "brand" ? "bg-gradient-brand" : "bg-secondary";
  const cls = tone ? "text-white" : "text-primary";
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}><Icon className={`h-5 w-5 ${cls}`} /></div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-lg font-bold truncate">{value}</div>
      </div>
    </div>
  );
}
