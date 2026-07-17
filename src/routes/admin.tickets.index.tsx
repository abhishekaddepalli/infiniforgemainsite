import { logAudit } from "@/lib/audit";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ticket as TicketIcon, Plus, ChevronRight, Search, Download, AlertTriangle, Clock } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { downloadCsv } from "@/lib/download";

export const Route = createFileRoute("/admin/tickets/")({
  head: () => ({ meta: [{ title: "Support Tickets — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Tickets"><TicketsPage /></AdminShell>,
});

type Ticket = {
  id: string; ticket_number: string; subject: string; description: string | null;
  department: string; priority: string; status: string; created_at: string;
  sla_due_at: string | null; first_response_at: string | null; resolved_at: string | null;
  assigned_to: string | null;
};

const STATUSES = ["open", "in_progress", "waiting", "resolved", "closed"];

function TicketsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [prioFilter, setPrioFilter] = useState("all");
  const [creating, setCreating] = useState<{ subject: string; description: string; department: string; priority: string } | null>(null);

  const { data: depts = [] } = useQuery({
    queryKey: ["ticket_departments"],
    queryFn: async () => (await supabase.from("ticket_departments").select("slug,name,active").eq("active", true).order("sort_order")).data ?? [],
  });
  const { data: prios = [] } = useQuery({
    queryKey: ["ticket_priorities"],
    queryFn: async () => (await supabase.from("ticket_priorities").select("slug,name,color,active").eq("active", true).order("sort_order")).data ?? [],
  });

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tickets").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data as Ticket[];
    },
  });

  const filtered = useMemo(() => tickets.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (deptFilter !== "all" && t.department !== deptFilter) return false;
    if (prioFilter !== "all" && t.priority !== prioFilter) return false;
    return !query || t.subject.toLowerCase().includes(query.toLowerCase()) || t.ticket_number.toLowerCase().includes(query.toLowerCase());
  }), [tickets, filter, deptFilter, prioFilter, query]);

  const priosBySlug = useMemo(() => Object.fromEntries(prios.map((p) => [p.slug, p])), [prios]);

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("tickets").update({ status }).eq("id", id);
      if (error) throw error;
      await logAudit({ action: "status.change", resource: "tickets", resource_id: id, details: { status } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tickets"] }); toast.success("Updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const setPriority = useMutation({
    mutationFn: async ({ id, priority }: { id: string; priority: string }) => {
      const { error } = await supabase.from("tickets").update({ priority }).eq("id", id);
      if (error) throw error;
      await logAudit({ action: "update", resource: "tickets", resource_id: id, details: { priority } });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
    onError: (e: Error) => toast.error(e.message),
  });
  const create = useMutation({
    mutationFn: async (p: NonNullable<typeof creating>) => {
      const { data: user } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("tickets").insert({ ...p, customer_id: user.user!.id }).select("id").single();
      if (error) throw error;
      await logAudit({ action: "create", resource: "tickets", resource_id: data?.id, details: { subject: p.subject } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tickets"] }); setCreating(null); toast.success("Ticket created"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportCsv = () => {
    const rows: (string | number | null | undefined)[][] = [
      ["Ticket", "Subject", "Department", "Priority", "Status", "Created", "SLA Due", "First Response", "Resolved"],
      ...filtered.map((t) => [
        t.ticket_number, t.subject, t.department, t.priority, t.status,
        t.created_at, t.sla_due_at ?? "", t.first_response_at ?? "", t.resolved_at ?? "",
      ]),
    ];
    downloadCsv(rows, `tickets-${new Date().toISOString().slice(0, 10)}.csv`);
    void logAudit({ action: "export", resource: "tickets", details: { count: filtered.length } });
  };

  const stats = useMemo(() => {
    const open = tickets.filter((t) => !["resolved", "closed"].includes(t.status)).length;
    const breached = tickets.filter((t) => t.sla_due_at && !["resolved", "closed"].includes(t.status) && new Date(t.sla_due_at) < new Date()).length;
    const dueSoon = tickets.filter((t) => t.sla_due_at && !["resolved", "closed"].includes(t.status) && new Date(t.sla_due_at) >= new Date() && new Date(t.sla_due_at).getTime() - Date.now() < 3600_000).length;
    return { open, breached, dueSoon };
  }, [tickets]);

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">Dashboard</Link><ChevronRight className="h-3 w-3" /><span>Tickets</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2"><TicketIcon className="h-6 w-6 text-primary" /> Support Tickets</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={exportCsv}><Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV</Button>
          <Button size="sm" variant="outline" asChild><Link to="/admin/ticket-workflows">Workflows</Link></Button>
          <Button size="sm" className="bg-gradient-brand text-white" onClick={() => setCreating({ subject: "", description: "", department: depts[0]?.slug ?? "support", priority: prios[1]?.slug ?? "medium" })}><Plus className="h-3.5 w-3.5 mr-1.5" /> New ticket</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Open" value={stats.open} icon={TicketIcon} />
        <StatCard label="SLA due within 1h" value={stats.dueSoon} icon={Clock} accent="warning" />
        <StatCard label="SLA breached" value={stats.breached} icon={AlertTriangle} accent="destructive" />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search subject or ID…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-9 w-72" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {depts.map((d) => <SelectItem key={d.slug} value={d.slug}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={prioFilter} onValueChange={setPrioFilter}>
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {prios.map((p) => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground sm:ml-auto">{filtered.length} of {tickets.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border">
                <th className="px-5 py-3">Ticket</th>
                <th className="px-3 py-3">Department</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">SLA</th>
                <th className="px-3 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">Loading…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No tickets match.</td></tr>}
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/30 cursor-pointer" onClick={(e) => {
                  if ((e.target as HTMLElement).closest('[data-no-nav]')) return;
                  navigate({ to: "/admin/tickets/$id", params: { id: t.id } });
                }}>
                  <td className="px-5 py-3">
                    <div className="font-mono text-xs text-muted-foreground break-all">{t.ticket_number}</div>
                    <div className="font-medium hover:text-primary break-words">{t.subject}</div>
                    {t.description && <div className="text-xs text-muted-foreground line-clamp-1 max-w-md">{t.description}</div>}
                  </td>
                  <td className="px-3 py-3 text-xs uppercase text-muted-foreground">{t.department}</td>
                  <td className="px-3 py-3" data-no-nav>
                    <Select value={t.priority} onValueChange={(v) => setPriority.mutate({ id: t.id, priority: v })}>
                      <SelectTrigger className="h-8 w-[130px] capitalize" style={{ color: priosBySlug[t.priority]?.color }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>{prios.map((p) => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-3" data-no-nav>
                    <Select value={t.status} onValueChange={(v) => setStatus.mutate({ id: t.id, status: v })}>
                      <SelectTrigger className="h-8 w-[140px] capitalize"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-3"><SlaBadge t={t} /></td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!creating} onOpenChange={(v) => !v && setCreating(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>New ticket</DialogTitle></DialogHeader>
          {creating && (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); create.mutate(creating); }}>
              <div><Label>Subject</Label><Input required value={creating.subject} onChange={(e) => setCreating({ ...creating, subject: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Description</Label><Textarea rows={4} value={creating.description} onChange={(e) => setCreating({ ...creating, description: e.target.value })} className="mt-1.5" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Department</Label>
                  <Select value={creating.department} onValueChange={(v) => setCreating({ ...creating, department: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{depts.map((d) => <SelectItem key={d.slug} value={d.slug}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Priority</Label>
                  <Select value={creating.priority} onValueChange={(v) => setCreating({ ...creating, priority: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{prios.map((p) => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setCreating(null)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-brand text-white" disabled={create.isPending}>Create</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number; icon: typeof TicketIcon; accent?: "warning" | "destructive" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center",
        accent === "destructive" ? "bg-destructive/10 text-destructive" :
        accent === "warning" ? "bg-[color:var(--warning)]/10 text-[color:var(--warning)]" :
        "bg-primary/10 text-primary")}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function SlaBadge({ t }: { t: Ticket }) {
  if (!t.sla_due_at) return <span className="text-xs text-muted-foreground">—</span>;
  const closed = t.status === "resolved" || t.status === "closed";
  if (closed) return <span className="text-xs text-accent">Met</span>;
  const due = new Date(t.sla_due_at).getTime();
  const diff = due - Date.now();
  if (diff < 0) return <span className="text-xs font-semibold text-destructive">Breached</span>;
  const h = Math.floor(diff / 3600_000);
  const m = Math.floor((diff % 3600_000) / 60_000);
  return <span className={cn("text-xs font-medium", diff < 3600_000 ? "text-[color:var(--warning)]" : "text-muted-foreground")}>{h}h {m}m left</span>;
}
