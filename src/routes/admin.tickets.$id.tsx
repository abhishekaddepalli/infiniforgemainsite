import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Send, User as UserIcon, Shield, ChevronRight, Download, Clock, AlertTriangle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { logAudit } from "@/lib/audit";
import { cn } from "@/lib/utils";
import { downloadCsv, downloadBlob } from "@/lib/download";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tickets/$id")({
  head: () => ({ meta: [{ title: "Ticket — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AdminShell title="Ticket">
      <TicketAdminDetail />
    </AdminShell>
  ),
});

const STATUSES = ["open", "in_progress", "waiting", "resolved", "closed"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

function TicketAdminDetail() {
  const { id } = useParams({ from: "/admin/tickets/$id" });
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const [msg, setMsg] = useState("");
  const [internal, setInternal] = useState(false);

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ["admin-ticket", id],
    queryFn: async () => (await supabase.from("tickets").select("*").eq("id", id).maybeSingle()).data,
  });
  const { data: customer } = useQuery({
    queryKey: ["admin-ticket-customer", ticket?.customer_id],
    enabled: !!ticket?.customer_id,
    queryFn: async () => (await supabase.from("profiles").select("id, full_name, email, phone").eq("id", ticket!.customer_id!).maybeSingle()).data,
  });
  const { data: replies = [] } = useQuery({
    queryKey: ["admin-ticket-replies", id],
    queryFn: async () => (await supabase.from("ticket_replies").select("*").eq("ticket_id", id).order("created_at", { ascending: true })).data ?? [],
  });
  const { data: staff = [] } = useQuery({
    queryKey: ["staff-list"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id, role")
        .in("role", ["super_admin", "admin", "sales_manager", "support", "finance", "employee"]);
      const ids = [...new Set((roles ?? []).map((r) => r.user_id))];
      if (!ids.length) return [];
      const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
      return data ?? [];
    },
  });

  type Patch = { status?: string; priority?: string; assigned_to?: string | null };
  const update = useMutation({
    mutationFn: async (patch: Patch) => {
      const { error } = await supabase.from("tickets").update(patch).eq("id", id);
      if (error) throw error;
      await logAudit({ action: "update", resource: "tickets", resource_id: id, details: patch });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-ticket", id] }); toast.success("Updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const post = useMutation({
    mutationFn: async () => {
      const text = internal ? `🔒 Internal note: ${msg}` : msg;
      if (!text.trim()) throw new Error("Message empty");
      const { error } = await supabase.from("ticket_replies").insert({
        ticket_id: id, author_id: user!.id,
        author_name: profile?.full_name ?? user!.email ?? "Support",
        is_staff: true, message: text,
      });
      if (error) throw error;
    },
    onSuccess: () => { setMsg(""); qc.invalidateQueries({ queryKey: ["admin-ticket-replies", id] }); toast.success("Reply sent"); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (ticketLoading) return <div className="p-8 text-center text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading ticket…</div>;
  if (!ticket) return (
    <div className="p-10 text-center space-y-3">
      <div className="text-sm text-muted-foreground">Ticket not found or you don't have access.</div>
      <Button size="sm" variant="outline" asChild><Link to="/admin/tickets"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back to tickets</Link></Button>
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/admin" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/admin/tickets" className="hover:text-foreground">Tickets</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-mono">{ticket.ticket_number}</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Button size="sm" variant="outline" asChild><Link to="/admin/tickets"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back</Link></Button>
        <h1 className="text-xl lg:text-2xl font-bold tracking-tight flex-1 min-w-0 truncate">{ticket.subject}</h1>
        <Badge className="capitalize">{ticket.status.replace("_", " ")}</Badge>
        <Badge variant="outline" className="capitalize">{ticket.priority}</Badge>
        <SlaChip ticket={ticket} />
        <Button size="sm" variant="outline" onClick={() => exportThread(ticket, replies, "csv")}><Download className="h-3.5 w-3.5 mr-1.5" /> CSV</Button>
        <Button size="sm" variant="outline" onClick={() => exportThread(ticket, replies, "txt")}><Download className="h-3.5 w-3.5 mr-1.5" /> Transcript</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {ticket.description && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Original request</div>
              <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
            </div>
          )}

          <div className="space-y-3">
            {replies.map((r) => (
              <div key={r.id} className={cn("flex gap-3", r.is_staff ? "flex-row-reverse" : "")}>
                <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-white",
                  r.is_staff ? "bg-gradient-green" : "bg-gradient-brand")}>
                  {r.is_staff ? <Shield className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                </div>
                <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5",
                  r.is_staff ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
                  <div className="text-[11px] font-medium mb-0.5 opacity-75">{r.author_name} {r.is_staff && "· Staff"}</div>
                  <div className="text-sm whitespace-pre-wrap">{r.message}</div>
                  <div className="text-[10px] opacity-60 mt-1">{new Date(r.created_at).toLocaleString("en-IN")}</div>
                </div>
              </div>
            ))}
            {replies.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No replies yet. Send the first reply below.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-3 shadow-elegant">
            <Textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Write a reply to the customer…" className="border-0 focus-visible:ring-0 resize-none" />
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} className="rounded" />
                Internal note (marked 🔒)
              </label>
              <Button size="sm" className="bg-gradient-brand text-white" onClick={() => post.mutate()} disabled={post.isPending}>
                {post.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1.5" /> Send reply</>}
              </Button>
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Customer</div>
            {customer ? (
              <div className="space-y-1 text-sm">
                <div className="font-medium">{customer.full_name ?? "—"}</div>
                <div className="text-muted-foreground text-xs">{customer.email}</div>
                {customer.phone && <div className="text-muted-foreground text-xs">{customer.phone}</div>}
              </div>
            ) : <div className="text-xs text-muted-foreground">Unknown</div>}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Manage</div>
            <div>
              <label className="text-xs text-muted-foreground">Status</label>
              <Select value={ticket.status} onValueChange={(v) => update.mutate({ status: v })}>
                <SelectTrigger className="mt-1 capitalize"><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Priority</label>
              <Select value={ticket.priority} onValueChange={(v) => update.mutate({ priority: v })}>
                <SelectTrigger className="mt-1 capitalize"><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Assigned to</label>
              <Select value={ticket.assigned_to ?? "unassigned"} onValueChange={(v) => update.mutate({ assigned_to: v === "unassigned" ? null : v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name ?? s.email}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="text-[11px] text-muted-foreground pt-2 border-t border-border space-y-0.5">
              <div>Dept: <span className="capitalize">{ticket.department}</span></div>
              <div>Opened: {new Date(ticket.created_at).toLocaleString("en-IN")}</div>
              <div>Updated: {new Date(ticket.updated_at).toLocaleString("en-IN")}</div>
              {ticket.sla_due_at && <div>SLA due: {new Date(ticket.sla_due_at).toLocaleString("en-IN")}</div>}
              {ticket.first_response_at && <div>First response: {new Date(ticket.first_response_at).toLocaleString("en-IN")}</div>}
              {ticket.resolved_at && <div>Resolved: {new Date(ticket.resolved_at).toLocaleString("en-IN")}</div>}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

type ReplyRow = { id: string; author_name: string | null; is_staff: boolean; message: string; created_at: string };
type TicketRow = { ticket_number: string; subject: string; department: string; priority: string; status: string; created_at: string; updated_at: string; sla_due_at: string | null; first_response_at: string | null; resolved_at: string | null; description: string | null };

function SlaChip({ ticket }: { ticket: TicketRow }) {
  if (!ticket.sla_due_at) return null;
  const closed = ticket.status === "resolved" || ticket.status === "closed";
  if (closed) return <Badge className="bg-accent/15 text-accent border-0"><Clock className="h-3 w-3 mr-1" /> SLA met</Badge>;
  const diff = new Date(ticket.sla_due_at).getTime() - Date.now();
  if (diff < 0) return <Badge className="bg-destructive/15 text-destructive border-0"><AlertTriangle className="h-3 w-3 mr-1" /> SLA breached</Badge>;
  const h = Math.floor(diff / 3600_000); const m = Math.floor((diff % 3600_000) / 60_000);
  return <Badge className={cn("border-0", diff < 3600_000 ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" : "bg-secondary text-muted-foreground")}><Clock className="h-3 w-3 mr-1" /> {h}h {m}m left</Badge>;
}

function exportThread(t: TicketRow, replies: ReplyRow[], fmt: "csv" | "txt") {
  const base = `ticket-${t.ticket_number}-${new Date().toISOString().slice(0, 10)}`;
  if (fmt === "csv") {
    downloadCsv([
      ["Ticket", t.ticket_number], ["Subject", t.subject], ["Status", t.status], ["Priority", t.priority], ["Department", t.department], [], 
      ["Author", "Role", "Message", "At"],
      ...replies.map((r) => [r.author_name ?? "", r.is_staff ? "Staff" : "Customer", r.message, r.created_at]),
    ], `${base}.csv`);
    return;
  }
  const lines = [
    `Ticket: ${t.ticket_number}`, `Subject: ${t.subject}`, `Status: ${t.status}   Priority: ${t.priority}   Dept: ${t.department}`,
    `Opened: ${new Date(t.created_at).toLocaleString("en-IN")}`, "", "── Original request ──", t.description ?? "(none)", "",
    "── Conversation ──",
    ...replies.map((r) => `\n[${new Date(r.created_at).toLocaleString("en-IN")}] ${r.author_name ?? ""} (${r.is_staff ? "Staff" : "Customer"}):\n${r.message}`),
  ];
  downloadBlob(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }), `${base}.txt`);
}

