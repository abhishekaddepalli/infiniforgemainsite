import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Inbox, Mail, Phone, Building2, Trash2, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/admin/contact-submissions")({
  head: () => ({ meta: [{ title: "Contact submissions — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Contact submissions"><Page /></AdminShell>,
});

type Submission = {
  id: string;
  created_at: string;
  status: string;
  metadata: {
    name?: string; email?: string; phone?: string;
    company?: string; interest?: string; message?: string;
  } | null;
};

function Page() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_records")
        .select("id, created_at, status, metadata")
        .eq("module", "contact_submissions")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as Submission[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("module_records").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["contact-submissions"] }); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("module_records").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["contact-submissions"] }); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><Inbox className="h-6 w-6" /> Contact submissions</h2>
        <p className="text-sm text-muted-foreground mt-1">Every enquiry submitted through the public contact form.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : data.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">No submissions yet.</Card>
      ) : (
        <div className="grid gap-4">
          {data.map((s) => {
            const m = s.metadata ?? {};
            return (
              <Card key={s.id} className="p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{m.name ?? "Anonymous"}</h3>
                      <Badge variant="outline" className="text-[10px]">{s.status}</Badge>
                      {m.interest && <Badge className="text-[10px] bg-primary/15 text-primary border-0">{m.interest}</Badge>}
                      <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {m.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> <a href={`mailto:${m.email}`} className="hover:text-primary">{m.email}</a></span>}
                      {m.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {m.phone}</span>}
                      {m.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {m.company}</span>}
                    </div>
                    {m.message && <p className="text-sm bg-secondary/40 rounded-lg p-3 whitespace-pre-wrap">{m.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {m.email && <Button size="sm" variant="outline" asChild><a href={`mailto:${m.email}`}><ExternalLink className="h-3.5 w-3.5 mr-1" /> Reply</a></Button>}
                    <select className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                      value={s.status} onChange={(e) => setStatus.mutate({ id: s.id, status: e.target.value })}>
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="qualified">qualified</option>
                      <option value="closed">closed</option>
                      <option value="spam">spam</option>
                    </select>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Delete this submission?")) del.mutate(s.id); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
