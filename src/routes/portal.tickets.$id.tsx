import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Send, User as UserIcon, Shield, Download, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { downloadCsv, downloadBlob } from "@/lib/download";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/tickets/$id")({
  head: () => ({ meta: [{ title: "Ticket — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: TicketDetail,
});

function TicketDetail() {
  const { id } = useParams({ from: "/portal/tickets/$id" });
  const { user, profile, loading, isStaff } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [msg, setMsg] = useState("");

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ["ticket", id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("tickets").select("*").eq("id", id).maybeSingle()).data,
  });
  const { data: replies } = useQuery({
    queryKey: ["ticket-replies", id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("ticket_replies").select("*").eq("ticket_id", id).order("created_at", { ascending: true })).data ?? [],
  });

  const post = useMutation({
    mutationFn: async () => {
      if (!msg.trim()) throw new Error("Message empty");
      const { error } = await supabase.from("ticket_replies").insert({
        ticket_id: id, author_id: user!.id, author_name: profile?.full_name ?? user!.email ?? "User",
        is_staff: !!isStaff, message: msg,
      });
      if (error) throw error;
    },
    onSuccess: () => { setMsg(""); qc.invalidateQueries({ queryKey: ["ticket-replies", id] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!ticketLoading && !ticket) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-muted-foreground/60" />
      <div className="text-sm text-muted-foreground">Ticket not found or you don't have access.</div>
      <Button size="sm" variant="outline" asChild><Link to="/portal/tickets"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back to tickets</Link></Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="h-16 border-b border-border bg-background/85 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-3xl h-full px-4 flex items-center gap-3">
          <Button size="icon" variant="ghost" asChild><Link to="/portal/tickets"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{ticket?.subject ?? "Loading…"}</div>
            <div className="text-[11px] text-muted-foreground font-mono">{ticket?.ticket_number}</div>
          </div>
          {ticket && <Badge className="capitalize">{ticket.status.replace("_", " ")}</Badge>}
          {ticket && <SlaChip due={ticket.sla_due_at} resolvedAt={ticket.resolved_at} />}
          {ticket && (replies?.length ?? 0) > 0 && (
            <Button size="sm" variant="outline" onClick={() => exportThread(ticket, replies ?? [])}>
              <Download className="h-3.5 w-3.5 mr-1" /> Transcript
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        {ticket?.description && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Original request</div>
            <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
          </div>
        )}

        <div className="space-y-3">
          {(replies ?? []).map((r) => (
            <div key={r.id} className={cn("flex gap-3", r.author_id === user.id ? "flex-row-reverse" : "")}>
              <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-white",
                r.is_staff ? "bg-gradient-green" : "bg-gradient-brand")}>
                {r.is_staff ? <Shield className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
              </div>
              <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5",
                r.author_id === user.id ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
                <div className="text-[11px] font-medium mb-0.5 opacity-75">{r.author_name} {r.is_staff && "· Support"}</div>
                <div className="text-sm whitespace-pre-wrap">{r.message}</div>
                <div className="text-[10px] opacity-60 mt-1">{new Date(r.created_at).toLocaleString("en-IN")}</div>
              </div>
            </div>
          ))}
          {(replies ?? []).length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No replies yet — post the first message below.
            </div>
          )}
        </div>

        <div className="sticky bottom-4 rounded-2xl border border-border bg-card p-3 shadow-elegant">
          <Textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Write a reply…" className="border-0 focus-visible:ring-0 resize-none" />
          <div className="flex justify-end">
            <Button size="sm" className="bg-gradient-brand text-white" onClick={() => post.mutate()} disabled={post.isPending}>
              {post.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1.5" /> Send</>}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

type ReplyRow = { id: string; author_name: string | null; is_staff: boolean; message: string; created_at: string };
type TicketRow = { ticket_number: string; subject: string; department: string; priority: string; status: string; created_at: string; sla_due_at: string | null; resolved_at: string | null; description: string | null };

function SlaChip({ due, resolvedAt }: { due: string | null; resolvedAt: string | null }) {
  if (!due || resolvedAt) return null;
  const diff = new Date(due).getTime() - Date.now();
  if (diff < 0) return <Badge className="bg-destructive/15 text-destructive border-0"><AlertTriangle className="h-3 w-3 mr-1" /> Overdue</Badge>;
  const h = Math.floor(diff / 3600_000); const m = Math.floor((diff % 3600_000) / 60_000);
  return <Badge className={cn("border-0", diff < 3600_000 ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" : "bg-secondary text-muted-foreground")}><Clock className="h-3 w-3 mr-1" /> {h}h {m}m</Badge>;
}

function exportThread(t: TicketRow, replies: ReplyRow[]) {
  const base = `ticket-${t.ticket_number}`;
  downloadCsv([
    ["Ticket", t.ticket_number], ["Subject", t.subject], ["Status", t.status], ["Priority", t.priority], [],
    ["Author", "Role", "Message", "At"],
    ...replies.map((r) => [r.author_name ?? "", r.is_staff ? "Support" : "You", r.message, r.created_at]),
  ], `${base}.csv`);
  const txt = [`Ticket ${t.ticket_number}`, `Subject: ${t.subject}`, "", t.description ?? "", "", "── Conversation ──",
    ...replies.map((r) => `\n[${new Date(r.created_at).toLocaleString("en-IN")}] ${r.author_name} (${r.is_staff ? "Support" : "You"}):\n${r.message}`),
  ].join("\n");
  downloadBlob(new Blob([txt], { type: "text/plain;charset=utf-8" }), `${base}.txt`);
}

