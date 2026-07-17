import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Wallet as WalletIcon, Search, Plus, Minus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";

export const Route = createFileRoute("/admin/wallets")({
  head: () => ({ meta: [{ title: "Wallets — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Wallets"><Page /></AdminShell>,
});

type Wallet = { id: string; user_id: string; balance_inr: number; frozen: boolean; created_at: string };
type Profile = { id: string; full_name: string | null; email: string | null };

function Page() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [adjust, setAdjust] = useState<{ wallet: Wallet; type: "credit" | "debit"; amount: string; description: string } | null>(null);

  const { data: wallets = [], isLoading } = useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("wallets").select("*").order("balance_inr", { ascending: false });
      if (error) throw error; return data as Wallet[];
    },
  });
  const { data: profiles = [] } = useQuery({
    queryKey: ["wallet-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id,full_name,email");
      if (error) throw error; return data as Profile[];
    },
  });
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  const toggleFreeze = useMutation({
    mutationFn: async (w: Wallet) => {
      const { error } = await supabase.from("wallets").update({ frozen: !w.frozen }).eq("id", w.id);
      if (error) throw error;
      await logAudit({ action: "status.change", resource: "wallet", resource_id: w.id, details: { frozen: !w.frozen } });
    },
    onSuccess: () => { toast.success("Wallet updated"); qc.invalidateQueries({ queryKey: ["wallets"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const applyAdjust = useMutation({
    mutationFn: async () => {
      if (!adjust) return;
      const amt = Number(adjust.amount);
      if (!Number.isFinite(amt) || amt <= 0) throw new Error("Enter a positive amount");
      const delta = adjust.type === "credit" ? amt : -amt;
      const newBalance = Number(adjust.wallet.balance_inr) + delta;
      if (newBalance < 0) throw new Error("Insufficient balance");
      const { error: e1 } = await supabase.from("wallets").update({ balance_inr: newBalance }).eq("id", adjust.wallet.id);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("wallet_transactions").insert({
        wallet_id: adjust.wallet.id, amount_inr: amt, type: adjust.type, description: adjust.description || `${adjust.type} by admin`,
      });
      if (e2) throw e2;
      await logAudit({ action: "update", resource: "wallet", resource_id: adjust.wallet.id, details: { type: adjust.type, amount: amt } });
    },
    onSuccess: () => { toast.success("Wallet adjusted"); setAdjust(null); qc.invalidateQueries({ queryKey: ["wallets"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = wallets.filter((w) => {
    if (!q) return true;
    const p = profileMap.get(w.user_id);
    const s = q.toLowerCase();
    return (p?.full_name ?? "").toLowerCase().includes(s) || (p?.email ?? "").toLowerCase().includes(s) || w.user_id.includes(q);
  });
  const total = wallets.reduce((a, w) => a + Number(w.balance_inr), 0);

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><WalletIcon className="h-6 w-6 shrink-0" /> Wallets</h2>
        <p className="text-sm text-muted-foreground mt-1 break-words">Total liabilities across customer wallets: <span className="font-semibold text-foreground">{formatINR(total)}</span></p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5 space-y-4 min-w-0">
        <div className="relative max-w-md min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customer" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="min-w-[680px] w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground bg-secondary/50">
              <tr>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Balance</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">Loading…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">No wallets found.</td></tr>}
              {filtered.map((w) => {
                const p = profileMap.get(w.user_id);
                return (
                  <tr key={w.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="px-5 py-3">
                      <div className="font-medium break-words">{p?.full_name ?? "Unknown"}</div>
                      <div className="text-xs text-muted-foreground break-all">{p?.email ?? w.user_id.slice(0, 8)}</div>
                    </td>
                    <td className="px-5 py-3 font-semibold">{formatINR(Number(w.balance_inr))}</td>
                    <td className="px-5 py-3">
                      <span className={"inline-flex px-2 py-1 rounded text-xs font-medium " + (w.frozen ? "bg-destructive/15 text-destructive" : "bg-emerald-500/15 text-emerald-600")}>{w.frozen ? "Frozen" : "Active"}</span>
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setAdjust({ wallet: w, type: "credit", amount: "", description: "" })}><Plus className="h-3.5 w-3.5 mr-1" /> Credit</Button>
                      <Button size="sm" variant="outline" onClick={() => setAdjust({ wallet: w, type: "debit", amount: "", description: "" })}><Minus className="h-3.5 w-3.5 mr-1" /> Debit</Button>
                      <Button size="sm" variant="ghost" onClick={() => toggleFreeze.mutate(w)}>{w.frozen ? "Unfreeze" : "Freeze"}</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!adjust} onOpenChange={(o) => !o && setAdjust(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{adjust?.type === "credit" ? "Credit wallet" : "Debit wallet"}</DialogTitle></DialogHeader>
          {adjust && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">Current balance: <span className="font-semibold text-foreground">{formatINR(Number(adjust.wallet.balance_inr))}</span></div>
              <div>
                <Label>Type</Label>
                <Select value={adjust.type} onValueChange={(v) => setAdjust({ ...adjust, type: v as "credit" | "debit" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="credit">Credit (+)</SelectItem><SelectItem value="debit">Debit (−)</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Amount (INR)</Label><Input type="number" min="1" value={adjust.amount} onChange={(e) => setAdjust({ ...adjust, amount: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={2} value={adjust.description} onChange={(e) => setAdjust({ ...adjust, description: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjust(null)}>Cancel</Button>
            <Button onClick={() => applyAdjust.mutate()} disabled={applyAdjust.isPending}>{applyAdjust.isPending ? "Applying…" : "Apply"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
