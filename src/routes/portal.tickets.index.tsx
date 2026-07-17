import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Plus, Ticket as TicketIcon, Search, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { notifyTicketCreated } from "@/lib/alerts.functions";

export const Route = createFileRoute("/portal/tickets/")({
  head: () => ({ meta: [{ title: "Support tickets — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: TicketsPage,
});

type Ticket = { id: string; ticket_number: string; subject: string; department: string; priority: string; status: string; created_at: string; sla_due_at: string | null; resolved_at: string | null };

function TicketsPage() {
  const { user, loading } = useAuth();
  const notifyTicket = useServerFn(notifyTicketCreated);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("support");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);

  const { data: depts = [] } = useQuery({
    queryKey: ["public-ticket-departments"],
    enabled: !!user,
    queryFn: async () => (await supabase.from("ticket_departments").select("slug,name").eq("active", true).order("sort_order")).data ?? [],
  });
  const { data: prios = [] } = useQuery({
    queryKey: ["public-ticket-priorities"],
    enabled: !!user,
    queryFn: async () => (await supabase.from("ticket_priorities").select("slug,name,color").eq("active", true).order("sort_order")).data ?? [],
  });

  useEffect(() => { if (depts.length && !depts.find((d) => d.slug === department)) setDepartment(depts[0].slug); }, [depts, department]);
  useEffect(() => { if (prios.length && !prios.find((p) => p.slug === priority)) setPriority(prios[Math.floor(prios.length / 2)]?.slug ?? prios[0].slug); }, [prios, priority]);

  const { data: tickets = [] } = useQuery({
    queryKey: ["my-tickets", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("tickets").select("*").eq("customer_id", user!.id).order("created_at", { ascending: false })).data as Ticket[] ?? [],
  });

  const filtered = useMemo(() => tickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    return !q || t.subject.toLowerCase().includes(q.toLowerCase()) || t.ticket_number.toLowerCase().includes(q.toLowerCase());
  }), [tickets, statusFilter, q]);

  const priosBySlug = useMemo(() => Object.fromEntries(prios.map((p) => [p.slug, p])), [prios]);

  const create = useMutation({
    mutationFn: async () => {
      if (!subject.trim()) throw new Error("Subject required");
      const { error, data } = await supabase.from("tickets").insert({
        customer_id: user!.id, subject, description, department, priority, status: "open",
      }).select("id").single();
      if (error) throw error;
      void notifyTicket({ data: { ticket_id: data.id } }).catch(() => undefined);
      return data;
    },
    onSuccess: () => {
      toast.success("Ticket submitted — our team will respond soon");
      setOpen(false); setSubject(""); setDescription("");
      qc.invalidateQueries({ queryKey: ["my-tickets"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to submit"),
  });

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  const stats = {
    open: tickets.filter((t) => !["resolved", "closed"].includes(t.status)).length,
    resolved: tickets.filter((t) => ["resolved", "closed"].includes(t.status)).length,
    total: tickets.length,
  };

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="h-16 border-b border-border bg-background/85 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-5xl h-full px-4 flex items-center gap-3">
          <Button size="icon" variant="ghost" asChild><Link to="/portal"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">Support tickets</div>
            <div className="text-[11px] text-muted-foreground">Get help from our team</div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm" className="bg-gradient-brand text-white"><Plus className="h-4 w-4 mr-1" /> New ticket</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New support ticket</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Subject *</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Department</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{depts.map((d) => <SelectItem key={d.slug} value={d.slug}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{prios.map((p) => <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Describe the issue</Label><Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className="bg-gradient-brand text-white" onClick={() => create.mutate()} disabled={create.isPending}>
                  {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit ticket"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <MiniStat label="Total tickets" value={stats.total} />
          <MiniStat label="Open" value={stats.open} accent="warning" />
          <MiniStat label="Resolved" value={stats.resolved} accent="success" />
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-border flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 h-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {["open", "in_progress", "waiting", "resolved", "closed"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <TicketIcon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <div className="font-medium">No tickets yet</div>
              <p className="text-sm text-muted-foreground mt-1">Open a ticket and our team will respond shortly.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((t) => (
                <Link key={t.id} to="/portal/tickets/$id" params={{ id: t.id }} className="block p-4 hover:bg-secondary/40 transition-colors">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{t.subject}</div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{t.ticket_number} · {t.department} · {new Date(t.created_at).toLocaleDateString("en-IN")}</div>
                    </div>
                    <PriorityPill p={t.priority} color={priosBySlug[t.priority]?.color} />
                    <StatusPill s={t.status} />
                    <PortalSla t={t} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: number; accent?: "warning" | "success" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className={cn("text-2xl font-bold", accent === "warning" ? "text-[color:var(--warning)]" : accent === "success" ? "text-accent" : "")}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    open: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    in_progress: "bg-primary/15 text-primary",
    waiting: "bg-secondary text-muted-foreground",
    resolved: "bg-accent/15 text-accent",
    closed: "bg-secondary text-muted-foreground",
  };
  return <span className={cn("text-[10px] rounded-full px-2 py-0.5 font-semibold capitalize", map[s] || "bg-secondary text-muted-foreground")}>{s.replace("_", " ")}</span>;
}
function PriorityPill({ p, color }: { p: string; color?: string }) {
  return <Badge className="border-0 text-[10px] capitalize" style={color ? { background: `${color}20`, color } : undefined}>{p}</Badge>;
}
function PortalSla({ t }: { t: Ticket }) {
  if (!t.sla_due_at || t.resolved_at) return null;
  const diff = new Date(t.sla_due_at).getTime() - Date.now();
  if (diff < 0) return <span className="text-[10px] font-semibold text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Overdue</span>;
  if (diff < 3600_000) return <span className="text-[10px] font-medium text-[color:var(--warning)] flex items-center gap-1"><Clock className="h-3 w-3" /> Due soon</span>;
  return null;
}
