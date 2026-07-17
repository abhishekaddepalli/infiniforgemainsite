import { createFileRoute } from "@tanstack/react-router";
import { Server, Activity, Cpu, HardDrive, Plus, Search, Pencil, Trash2, Loader2, Zap, RefreshCw, Download } from "lucide-react";
import { useMemo, useState } from "react";
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
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";
import { downloadCsv } from "@/lib/download";

export const Route = createFileRoute("/admin/servers")({
  head: () => ({ meta: [{ title: "Servers — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Servers"><Page /></AdminShell>,
});

const STATUSES = ["healthy", "degraded", "down", "maintenance", "provisioning"];

type SrvRecord = {
  id: string;
  title: string;
  subtitle: string | null;
  status: string;
  amount_inr: number | null;
  due_at: string | null;
  tags: string[] | null;
  metadata: Record<string, unknown> & {
    hostname?: string; ip?: string; region?: string; role?: string; provider?: string;
    os?: string; cpu_pct?: number; mem_pct?: number; disk_pct?: number; uptime_days?: number;
    notes?: string; owner?: string;
  };
  created_at: string; updated_at: string;
};

type FormState = {
  id?: string;
  hostname: string; ip: string; region: string; role: string;
  provider: string; os: string; owner: string; status: string;
  cpu_pct: string; mem_pct: string; disk_pct: string; uptime_days: string;
  monthly_cost_inr: string; renewal_date: string; notes: string;
};

function empty(): FormState {
  return {
    hostname: "", ip: "", region: "", role: "Web · Nginx",
    provider: "AWS", os: "Ubuntu 22.04 LTS", owner: "", status: "healthy",
    cpu_pct: "0", mem_pct: "0", disk_pct: "0", uptime_days: "0",
    monthly_cost_inr: "", renewal_date: "", notes: "",
  };
}

function tone(v: number) {
  return v > 85 ? "bg-destructive" : v > 65 ? "bg-amber-500" : "bg-emerald-500";
}
function bar(v: number) {
  return (
    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
      <div className={"h-full " + tone(v)} style={{ width: Math.max(0, Math.min(100, v)) + "%" }} />
    </div>
  );
}
function statusBadge(s: string) {
  const map: Record<string, string> = {
    healthy: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    degraded: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    down: "bg-rose-500/15 text-rose-600 border-rose-500/30",
    maintenance: "bg-primary/15 text-primary border-primary/30",
    provisioning: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  };
  return map[s] ?? "bg-muted";
}

function Page() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);

  const { data: rows = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["module_records", "servers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("module_records").select("*")
        .eq("module", "servers").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as SrvRecord[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      const m = r.metadata ?? {};
      return r.title.toLowerCase().includes(q) ||
        (m.hostname as string | undefined)?.toLowerCase().includes(q) ||
        (m.ip as string | undefined)?.toLowerCase().includes(q) ||
        (m.region as string | undefined)?.toLowerCase().includes(q);
    });
  }, [rows, search, statusFilter]);

  const stats = useMemo(() => {
    if (rows.length === 0) return { total: 0, healthy: 0, cpu: 0, disk: 0, mem: 0, uptimePct: 0 };
    const healthy = rows.filter((r) => r.status === "healthy").length;
    const avg = (k: "cpu_pct" | "mem_pct" | "disk_pct") =>
      rows.reduce((s, r) => s + Number((r.metadata?.[k] as number) ?? 0), 0) / rows.length;
    return {
      total: rows.length,
      healthy,
      cpu: Math.round(avg("cpu_pct")),
      mem: Math.round(avg("mem_pct")),
      disk: Math.round(avg("disk_pct")),
      uptimePct: rows.length ? Math.round((healthy / rows.length) * 1000) / 10 : 0,
    };
  }, [rows]);

  const upsert = useMutation({
    mutationFn: async (f: FormState) => {
      const metadata = {
        hostname: f.hostname, ip: f.ip, region: f.region, role: f.role,
        provider: f.provider, os: f.os, owner: f.owner,
        cpu_pct: Number(f.cpu_pct) || 0, mem_pct: Number(f.mem_pct) || 0,
        disk_pct: Number(f.disk_pct) || 0, uptime_days: Number(f.uptime_days) || 0,
        notes: f.notes,
      };
      const payload = {
        module: "servers",
        title: f.hostname.trim() || "server",
        subtitle: `${f.role} · ${f.region}`,
        status: f.status,
        amount_inr: f.monthly_cost_inr ? Number(f.monthly_cost_inr) : 0,
        due_at: f.renewal_date ? new Date(f.renewal_date).toISOString() : null,
        tags: [f.provider, f.region].filter(Boolean),
        metadata,
      };
      if (f.id) {
        const { error } = await supabase.from("module_records").update(payload).eq("id", f.id);
        if (error) throw error;
        await logAudit({ action: "update", resource: "settings", resource_id: f.id, details: { module: "servers", host: f.hostname } });
      } else {
        const { error } = await supabase.from("module_records").insert(payload);
        if (error) throw error;
        await logAudit({ action: "create", resource: "settings", details: { module: "servers", host: f.hostname } });
      }
    },
    onSuccess: () => {
      toast.success(form.id ? "Server updated" : "Server added");
      setOpen(false); setForm(empty());
      qc.invalidateQueries({ queryKey: ["module_records", "servers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("module_records").delete().eq("id", id);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "settings", resource_id: id, details: { module: "servers" } });
    },
    onSuccess: () => {
      toast.success("Server removed");
      qc.invalidateQueries({ queryKey: ["module_records", "servers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openEdit(r: SrvRecord) {
    const m = r.metadata ?? {};
    setForm({
      id: r.id,
      hostname: (m.hostname as string) ?? r.title,
      ip: (m.ip as string) ?? "",
      region: (m.region as string) ?? "",
      role: (m.role as string) ?? "",
      provider: (m.provider as string) ?? "",
      os: (m.os as string) ?? "",
      owner: (m.owner as string) ?? "",
      status: r.status,
      cpu_pct: String(m.cpu_pct ?? 0),
      mem_pct: String(m.mem_pct ?? 0),
      disk_pct: String(m.disk_pct ?? 0),
      uptime_days: String(m.uptime_days ?? 0),
      monthly_cost_inr: r.amount_inr != null ? String(r.amount_inr) : "",
      renewal_date: r.due_at ? r.due_at.slice(0, 10) : "",
      notes: (m.notes as string) ?? "",
    });
    setOpen(true);
  }

  function exportCsv() {
    const header = ["hostname", "ip", "region", "role", "provider", "os", "status", "cpu_%", "mem_%", "disk_%", "uptime_days", "monthly_cost_inr", "renewal_date"];
    const rows2 = filtered.map((r) => {
      const m = r.metadata ?? {};
      return [m.hostname ?? r.title, m.ip ?? "", m.region ?? "", m.role ?? "", m.provider ?? "", m.os ?? "",
        r.status, m.cpu_pct ?? "", m.mem_pct ?? "", m.disk_pct ?? "", m.uptime_days ?? "",
        r.amount_inr ?? "", r.due_at ? r.due_at.slice(0, 10) : ""];
    });
    downloadCsv([header, ...rows2], "servers.csv");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Server className="h-6 w-6" /> Server fleet</h2>
          <p className="text-sm text-muted-foreground mt-1">Register and monitor infrastructure across regions and providers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={"h-4 w-4 mr-2 " + (isFetching ? "animate-spin" : "")} /> Refresh
          </Button>
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
          <Button className="bg-gradient-brand text-white" onClick={() => { setForm(empty()); setOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add server
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Kpi icon={Server} label="Total nodes" value={String(stats.total)} />
        <Kpi icon={Activity} label="Healthy" value={`${stats.healthy}/${stats.total}`} />
        <Kpi icon={Cpu} label="Avg CPU" value={`${stats.cpu}%`} />
        <Kpi icon={HardDrive} label="Avg Disk" value={`${stats.disk}%`} />
        <Kpi icon={Zap} label="Fleet uptime" value={`${stats.uptimePct}%`} />
      </div>

      <div className="glass rounded-2xl p-4 space-y-4 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-0 flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search hostname, IP, region…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No servers registered yet. Click <b>Add server</b> to register your first node.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="min-w-[820px] w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left py-2 px-2">Node</th>
                  <th className="text-left py-2 px-2">Role</th>
                  <th className="text-left py-2 px-2 w-36">CPU</th>
                  <th className="text-left py-2 px-2 w-36">Memory</th>
                  <th className="text-left py-2 px-2 w-36">Disk</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-right py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const m = r.metadata ?? {};
                  const cpu = Number(m.cpu_pct ?? 0), mem = Number(m.mem_pct ?? 0), disk = Number(m.disk_pct ?? 0);
                  return (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="px-2 py-3">
                        <div className="font-mono text-xs break-all">{m.hostname ?? r.title}</div>
                        <div className="text-xs text-muted-foreground break-all">{m.region ?? ""} · {(m.provider as string) ?? ""} · {(m.ip as string) ?? ""}</div>
                      </td>
                      <td className="px-2 py-3">{m.role ?? "—"}</td>
                      <td className="px-2 py-3"><div className="text-xs mb-1">{cpu}%</div>{bar(cpu)}</td>
                      <td className="px-2 py-3"><div className="text-xs mb-1">{mem}%</div>{bar(mem)}</td>
                      <td className="px-2 py-3"><div className="text-xs mb-1">{disk}%</div>{bar(disk)}</td>
                      <td className="px-2 py-3"><Badge variant="outline" className={statusBadge(r.status)}>{r.status}</Badge></td>
                      <td className="px-2 py-3 text-right">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => {
                          if (confirm(`Delete server "${m.hostname ?? r.title}"?`)) remove.mutate(r.id);
                        }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit server" : "Register server"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 md:grid-cols-2 mt-2">
            <F label="Hostname"><Input value={form.hostname} onChange={(e) => setForm({ ...form, hostname: e.target.value })} required /></F>
            <F label="IP address"><Input value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} /></F>
            <F label="Region"><Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} /></F>
            <F label="Provider"><Input value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} /></F>
            <F label="Role"><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></F>
            <F label="Operating system"><Input value={form.os} onChange={(e) => setForm({ ...form, os: e.target.value })} /></F>
            <F label="Owner / team"><Input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></F>
            <F label="Status">
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="CPU %"><Input type="number" min={0} max={100} value={form.cpu_pct} onChange={(e) => setForm({ ...form, cpu_pct: e.target.value })} /></F>
            <F label="Memory %"><Input type="number" min={0} max={100} value={form.mem_pct} onChange={(e) => setForm({ ...form, mem_pct: e.target.value })} /></F>
            <F label="Disk %"><Input type="number" min={0} max={100} value={form.disk_pct} onChange={(e) => setForm({ ...form, disk_pct: e.target.value })} /></F>
            <F label="Uptime (days)"><Input type="number" min={0} value={form.uptime_days} onChange={(e) => setForm({ ...form, uptime_days: e.target.value })} /></F>
            <F label="Monthly cost (INR)"><Input type="number" min={0} step="0.01" value={form.monthly_cost_inr} onChange={(e) => setForm({ ...form, monthly_cost_inr: e.target.value })} /></F>
            <F label="Renewal date"><Input type="date" value={form.renewal_date} onChange={(e) => setForm({ ...form, renewal_date: e.target.value })} /></F>
            <F label="Notes" span2><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></F>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => upsert.mutate(form)} disabled={upsert.isPending || !form.hostname.trim()}>
              {upsert.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {form.id ? "Save changes" : "Add server"}
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

function Kpi({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0"><Icon className="h-5 w-5 text-white" /></div>
      <div className="min-w-0"><div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div><div className="text-lg font-bold truncate">{value}</div></div>
    </div>
  );
}
