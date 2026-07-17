import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";

export const Route = createFileRoute("/admin/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Subscriptions"><Page /></AdminShell>,
});

type Sub = {
  id: string; customer_id: string; product_id: string | null; plan: string; status: string;
  amount_inr: number; billing_cycle: string; current_period_end: string | null; cancel_at: string | null; created_at: string;
};

const STATUSES = ["active", "trialing", "past_due", "cancelled", "expired"];
const CYCLES = ["monthly", "quarterly", "yearly", "one_time"];

type FormState = {
  id?: string;
  customer_id: string;
  plan: string;
  amount_inr: string;
  billing_cycle: string;
  status: string;
  current_period_end: string;
};

const emptyForm: FormState = {
  customer_id: "", plan: "", amount_inr: "0", billing_cycle: "monthly",
  status: "active", current_period_end: "",
};

function Page() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<FormState | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["subs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscriptions").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data as Sub[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("subscriptions").update({ status }).eq("id", id);
      if (error) throw error;
      await logAudit({ action: "update", resource: "subscription", resource_id: id, details: { status } });
    },
    onSuccess: () => { toast.success("Subscription updated"); qc.invalidateQueries({ queryKey: ["subs"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const save = useMutation({
    mutationFn: async (form: FormState) => {
      const payload = {
        customer_id: form.customer_id.trim(),
        plan: form.plan.trim(),
        amount_inr: Number(form.amount_inr) || 0,
        billing_cycle: form.billing_cycle,
        status: form.status,
        current_period_end: form.current_period_end ? new Date(form.current_period_end).toISOString() : null,
      };
      if (!payload.customer_id) throw new Error("Customer ID required");
      if (!payload.plan) throw new Error("Plan name required");
      if (form.id) {
        const { error } = await supabase.from("subscriptions").update(payload).eq("id", form.id);
        if (error) throw error;
        await logAudit({ action: "update", resource: "subscription", resource_id: form.id, details: payload });
      } else {
        const { data, error } = await supabase.from("subscriptions").insert(payload).select().single();
        if (error) throw error;
        await logAudit({ action: "create", resource: "subscription", resource_id: data.id, details: payload });
      }
    },
    onSuccess: () => {
      toast.success(editing?.id ? "Subscription updated" : "Subscription created");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["subs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subscriptions").delete().eq("id", id);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "subscription", resource_id: id });
    },
    onSuccess: () => { toast.success("Subscription deleted"); qc.invalidateQueries({ queryKey: ["subs"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = data.filter((s) => (status === "all" || s.status === status) && (!q || s.plan.toLowerCase().includes(q.toLowerCase()) || s.customer_id.includes(q)));
  const mrr = data.filter((s) => s.status === "active" && s.billing_cycle === "monthly").reduce((a, s) => a + Number(s.amount_inr), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><RefreshCw className="h-6 w-6" /> Subscriptions</h2>
          <p className="text-sm text-muted-foreground mt-1">Recurring revenue across all customers. MRR: <span className="font-semibold text-foreground">{formatINR(mrr)}</span></p>
        </div>
        <Button onClick={() => setEditing({ ...emptyForm })} className="bg-gradient-brand text-white">
          <Plus className="h-4 w-4 mr-1.5" /> New subscription
        </Button>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5 space-y-4 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search plan or customer id" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="min-w-[880px] w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground bg-secondary/50">
              <tr>
                <th className="text-left px-5 py-3">Plan</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Cycle</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Renews</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">Loading…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">No subscriptions yet.</td></tr>}
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-5 py-3 font-medium break-words">{s.plan}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{s.customer_id.slice(0, 8)}…</td>
                  <td className="px-5 py-3">{formatINR(Number(s.amount_inr))}</td>
                  <td className="px-5 py-3 capitalize">{s.billing_cycle}</td>
                  <td className="px-5 py-3">
                    <Select value={s.status} onValueChange={(v) => update.mutate({ id: s.id, status: v })}>
                      <SelectTrigger className="w-[130px] h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{s.current_period_end ? new Date(s.current_period_end).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing({
                        id: s.id, customer_id: s.customer_id, plan: s.plan,
                        amount_inr: String(s.amount_inr), billing_cycle: s.billing_cycle,
                        status: s.status,
                        current_period_end: s.current_period_end ? s.current_period_end.slice(0, 10) : "",
                      })}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"
                        onClick={() => { if (confirm(`Delete subscription "${s.plan}"?`)) del.mutate(s.id); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit subscription" : "New subscription"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label>Customer ID (user UUID)</Label>
                <Input value={editing.customer_id} onChange={(e) => setEditing({ ...editing, customer_id: e.target.value })} placeholder="uuid…" />
              </div>
              <div className="grid gap-1.5">
                <Label>Plan name</Label>
                <Input value={editing.plan} onChange={(e) => setEditing({ ...editing, plan: e.target.value })} placeholder="e.g. Managed Hosting Pro" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Amount (INR)</Label>
                  <Input type="number" value={editing.amount_inr} onChange={(e) => setEditing({ ...editing, amount_inr: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Billing cycle</Label>
                  <Select value={editing.billing_cycle} onValueChange={(v) => setEditing({ ...editing, billing_cycle: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CYCLES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Renews on</Label>
                  <Input type="date" value={editing.current_period_end} onChange={(e) => setEditing({ ...editing, current_period_end: e.target.value })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && save.mutate(editing)} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
