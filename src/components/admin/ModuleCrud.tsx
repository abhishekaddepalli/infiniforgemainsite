import { useMemo, useState, type ReactNode } from "react";
import { type LucideIcon, Plus, Search, Pencil, Trash2, Loader2, Sparkles, CheckCircle2, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";
import { cn } from "@/lib/utils";

export interface MetaFieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number";
  placeholder?: string;
}

export interface ModuleRecord {
  id: string;
  module: string;
  title: string;
  subtitle: string | null;
  status: string;
  amount_inr: number | null;
  due_at: string | null;
  tags: string[] | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface FormState {
  id?: string;
  title: string;
  subtitle: string;
  status: string;
  amount_inr: string;
  due_at: string;
  tags: string;
  metadata: Record<string, string>;
}

const DEFAULT_STATUSES = ["active", "pending", "suspended", "expired", "cancelled"];

function emptyForm(statuses: string[], metaFields: MetaFieldDef[]): FormState {
  return {
    title: "",
    subtitle: "",
    status: statuses[0] ?? "active",
    amount_inr: "",
    due_at: "",
    tags: "",
    metadata: Object.fromEntries(metaFields.map((f) => [f.key, ""])),
  };
}

function statusTone(s: string) {
  const k = s.toLowerCase();
  if (["active", "paid", "delivered", "resolved", "published"].includes(k)) return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
  if (["pending", "processing", "draft"].includes(k)) return "bg-amber-500/15 text-amber-500 border-amber-500/30";
  if (["suspended", "expired", "cancelled", "failed"].includes(k)) return "bg-rose-500/15 text-rose-500 border-rose-500/30";
  return "bg-primary/15 text-primary border-primary/30";
}

export function ModuleCrud({
  module,
  title,
  subtitle,
  icon: Icon,
  features,
  metaFields = [],
  statuses = DEFAULT_STATUSES,
  amountLabel = "Amount (INR)",
  showDueDate = true,
  addLabel = "Add record",
  titleLabel = "Title",
}: {
  module: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  features: string[];
  metaFields?: MetaFieldDef[];
  statuses?: string[];
  amountLabel?: string;
  showDueDate?: boolean;
  addLabel?: string;
  titleLabel?: string;
}) {
  return (
    <AdminShell title={title}>
      <ModuleCrudBody
        module={module} title={title} subtitle={subtitle} icon={Icon}
        features={features} metaFields={metaFields} statuses={statuses}
        amountLabel={amountLabel} showDueDate={showDueDate} addLabel={addLabel} titleLabel={titleLabel}
      />
    </AdminShell>
  );
}

function ModuleCrudBody({
  module, title, subtitle, icon: Icon, features, metaFields, statuses,
  amountLabel, showDueDate, addLabel, titleLabel,
}: {
  module: string; title: string; subtitle: string; icon: LucideIcon;
  features: string[]; metaFields: MetaFieldDef[]; statuses: string[];
  amountLabel: string; showDueDate: boolean; addLabel: string; titleLabel: string;
}) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => emptyForm(statuses, metaFields));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>(statuses[0] ?? "active");

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["module_records", module],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_records").select("*").eq("module", module).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ModuleRecord[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return r.title.toLowerCase().includes(q) || (r.subtitle ?? "").toLowerCase().includes(q);
    });
  }, [records, search, statusFilter]);

  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter((r) => ["active", "paid", "published", "delivered"].includes(r.status)).length;
    const pending = records.filter((r) => ["pending", "processing", "draft"].includes(r.status)).length;
    const revenue = records.reduce((sum, r) => sum + Number(r.amount_inr ?? 0), 0);
    return { total, active, pending, revenue };
  }, [records]);

  const upsert = useMutation({
    mutationFn: async (f: FormState) => {
      const payload = {
        module,
        title: f.title.trim(),
        subtitle: f.subtitle.trim() || null,
        status: f.status,
        amount_inr: f.amount_inr ? Number(f.amount_inr) : 0,
        due_at: f.due_at ? new Date(f.due_at).toISOString() : null,
        tags: f.tags ? f.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        metadata: f.metadata,
      };
      if (f.id) {
        const { error } = await supabase.from("module_records").update(payload).eq("id", f.id);
        if (error) throw error;
        await logAudit({ action: "update", resource: "settings", resource_id: f.id, details: { module, title: payload.title } });
      } else {
        const { error } = await supabase.from("module_records").insert(payload);
        if (error) throw error;
        await logAudit({ action: "create", resource: "settings", details: { module, title: payload.title } });
      }
    },
    onSuccess: () => {
      toast.success(form.id ? "Record updated" : "Record created");
      setDialogOpen(false); setForm(emptyForm(statuses, metaFields));
      qc.invalidateQueries({ queryKey: ["module_records", module] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("module_records").delete().eq("id", id);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "settings", resource_id: id, details: { module } });
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["module_records", module] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkDelete = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("module_records").delete().in("id", ids);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "settings", details: { module, count: ids.length, bulk: true } });
    },
    onSuccess: (_d, ids) => {
      toast.success(`Deleted ${ids.length} record${ids.length === 1 ? "" : "s"}`);
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ["module_records", module] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkUpdateStatus = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      const { error } = await supabase.from("module_records").update({ status }).in("id", ids);
      if (error) throw error;
      await logAudit({ action: "update", resource: "settings", details: { module, count: ids.length, status, bulk: true } });
    },
    onSuccess: (_d, v) => {
      toast.success(`Updated ${v.ids.length} record${v.ids.length === 1 ? "" : "s"}`);
      setSelected(new Set());
      qc.invalidateQueries({ queryKey: ["module_records", module] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openNew() { setForm(emptyForm(statuses, metaFields)); setDialogOpen(true); }
  function openEdit(r: ModuleRecord) {
    const meta = (r.metadata ?? {}) as Record<string, unknown>;
    setForm({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle ?? "",
      status: r.status,
      amount_inr: r.amount_inr != null ? String(r.amount_inr) : "",
      due_at: r.due_at ? r.due_at.slice(0, 10) : "",
      tags: (r.tags ?? []).join(", "),
      metadata: Object.fromEntries(metaFields.map((f) => [f.key, String(meta[f.key] ?? "")])),
    });
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="break-words text-xl font-bold sm:text-2xl">{title}</h2>
            <p className="mt-1 max-w-2xl break-words text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="w-full bg-gradient-brand text-white sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> {addLabel}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
            <DialogHeader className="px-6 pt-6 pb-3 border-b border-border sticky top-0 bg-background z-10">
              <DialogTitle>{form.id ? "Edit record" : addLabel}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-2 px-6 py-4">
              <Field label={titleLabel} className="md:col-span-2">
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </Field>
              <Field label="Description / Notes" className="md:col-span-2">
                <Textarea rows={2} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              </Field>
              <Field label="Status">
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label={amountLabel}>
                <Input type="number" min={0} step="0.01" value={form.amount_inr}
                  onChange={(e) => setForm({ ...form, amount_inr: e.target.value })} />
              </Field>
              {showDueDate && (
                <Field label="Due / Expiry date">
                  <Input type="date" value={form.due_at} onChange={(e) => setForm({ ...form, due_at: e.target.value })} />
                </Field>
              )}
              <Field label="Tags (comma separated)" className={showDueDate ? "" : "md:col-span-2"}>
                <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="premium, enterprise" />
              </Field>
              {metaFields.map((f) => (
                <Field key={f.key} label={f.label} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                  {f.type === "textarea" ? (
                    <Textarea rows={2} value={form.metadata[f.key] ?? ""} placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, metadata: { ...form.metadata, [f.key]: e.target.value } })} />
                  ) : (
                    <Input type={f.type === "number" ? "number" : "text"} value={form.metadata[f.key] ?? ""} placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, metadata: { ...form.metadata, [f.key]: e.target.value } })} />
                  )}
                </Field>
              ))}
            </div>
            <DialogFooter className="px-6 py-4 border-t border-border sticky bottom-0 bg-background gap-2 flex-col sm:flex-row">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={() => upsert.mutate(form)} disabled={upsert.isPending || !form.title.trim()} className="w-full sm:w-auto">
                {upsert.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {form.id ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total records" value={stats.total.toString()} />
        <StatCard label="Active" value={stats.active.toString()} />
        <StatCard label="Pending" value={stats.pending.toString()} />
        <StatCard label="Value" value={`₹${stats.revenue.toLocaleString("en-IN")}`} />
      </div>

      <div className="glass rounded-2xl p-3 sm:p-4 space-y-4 min-w-0 max-w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-0 flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-2 sm:p-3">
            <span className="text-sm font-medium px-2">
              {selected.size} selected
            </span>
            <div className="flex-1" />
            <Select value={bulkStatus} onValueChange={setBulkStatus}>
              <SelectTrigger className="h-9 w-full sm:w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" disabled={bulkUpdateStatus.isPending}
              onClick={() => bulkUpdateStatus.mutate({ ids: Array.from(selected), status: bulkStatus })}>
              {bulkUpdateStatus.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply status"}
            </Button>
            <Button size="sm" variant="destructive" disabled={bulkDelete.isPending}
              onClick={() => {
                const ids = Array.from(selected);
                if (confirm(`Delete ${ids.length} record${ids.length === 1 ? "" : "s"}?`)) bulkDelete.mutate(ids);
              }}>
              {bulkDelete.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Trash2 className="h-4 w-4 mr-1" /> Delete</>}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No records yet. Click <b>{addLabel}</b> to create your first entry.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="w-8 py-2 px-2">
                    <Checkbox
                      checked={filtered.length > 0 && filtered.every((r) => selected.has(r.id))}
                      onCheckedChange={(v) => {
                        const next = new Set(selected);
                        if (v) filtered.forEach((r) => next.add(r.id));
                        else filtered.forEach((r) => next.delete(r.id));
                        setSelected(next);
                      }}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="text-left py-2 px-2">{titleLabel}</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-right py-2 px-2">Amount</th>
                  {showDueDate && <th className="text-left py-2 px-2">Due</th>}
                  <th className="text-left py-2 px-2">Tags</th>
                  <th className="text-right py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const isSel = selected.has(r.id);
                  return (
                  <tr key={r.id} className={`border-b border-border/50 hover:bg-muted/30 ${isSel ? "bg-primary/5" : ""}`}>
                    <td className="py-3 px-2">
                      <Checkbox
                        checked={isSel}
                        onCheckedChange={(v) => {
                          const next = new Set(selected);
                          if (v) next.add(r.id); else next.delete(r.id);
                          setSelected(next);
                        }}
                        aria-label={`Select ${r.title}`}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-medium break-words">{r.title}</div>
                      {r.subtitle && <div className="text-xs text-muted-foreground line-clamp-1">{r.subtitle}</div>}
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={statusTone(r.status)}>{r.status}</Badge>
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums">
                      {r.amount_inr ? `₹${Number(r.amount_inr).toLocaleString("en-IN")}` : "—"}
                    </td>
                    {showDueDate && (
                      <td className="py-3 px-2">{r.due_at ? new Date(r.due_at).toLocaleDateString("en-IN") : "—"}</td>
                    )}
                    <td className="py-3 px-2">
                      <div className="flex flex-wrap gap-1">
                        {(r.tags ?? []).slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="inline-flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => {
                          if (confirm(`Delete "${r.title}"?`)) remove.mutate(r.id);
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


      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f} className="glass rounded-xl p-3 flex min-w-0 items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span className="min-w-0 break-words text-xs">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4 min-w-0">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-2xl font-bold">{value}</div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

// Re-export for convenience
export { Sparkles };
