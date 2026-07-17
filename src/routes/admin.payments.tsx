import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Search } from "lucide-react";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Payments"><Page /></AdminShell>,
});

type Order = {
  id: string; order_number: string; customer_email: string | null;
  total_inr: number; status: string; payment_method: string | null; created_at: string;
};

function Page() {
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("all");
  const { data = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("id,order_number,customer_email,total_inr,status,payment_method,created_at").order("created_at", { ascending: false });
      if (error) throw error; return data as Order[];
    },
  });
  const filtered = data.filter((o) => {
    if (method !== "all" && (o.payment_method ?? "") !== method) return false;
    if (!q) return true; const s = q.toLowerCase();
    return o.order_number.toLowerCase().includes(s) || (o.customer_email ?? "").toLowerCase().includes(s);
  });
  const paid = data.filter((o) => o.status === "paid").reduce((a, o) => a + Number(o.total_inr), 0);
  const pending = data.filter((o) => o.status === "pending").reduce((a, o) => a + Number(o.total_inr), 0);
  const failed = data.filter((o) => o.status === "failed").reduce((a, o) => a + Number(o.total_inr), 0);
  const methods = Array.from(new Set(data.map((o) => o.payment_method).filter(Boolean))) as string[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="h-6 w-6" /> Payments</h2>
        <p className="text-sm text-muted-foreground mt-1">Live transaction ledger across Razorpay, UPI, wallets and offline settlements.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Collected" value={formatINR(paid)} tone="emerald" />
        <Stat label="Pending" value={formatINR(pending)} tone="amber" />
        <Stat label="Failed" value={formatINR(failed)} tone="red" />
      </div>
      <div className="glass rounded-2xl p-4 sm:p-5 space-y-4 min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search order or email" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All methods</SelectItem>
              {methods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="min-w-[760px] w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground bg-secondary/50">
              <tr>
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Method</th>
                <th className="text-right px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">Loading…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No payments yet.</td></tr>}
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-5 py-3 font-mono text-xs break-all">{o.order_number}</td>
                  <td className="px-5 py-3 break-all">{o.customer_email ?? "—"}</td>
                  <td className="px-5 py-3 capitalize">{o.payment_method ?? "—"}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatINR(Number(o.total_inr))}</td>
                  <td className="px-5 py-3"><span className={"inline-flex px-2 py-1 rounded text-xs font-medium " + statusTone(o.status)}>{o.status}</span></td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "emerald" | "amber" | "red" }) {
  const map = { emerald: "text-emerald-600 bg-emerald-500/10", amber: "text-amber-600 bg-amber-500/10", red: "text-destructive bg-destructive/10" };
  return (
    <div className="glass rounded-2xl p-5">
      <div className={"inline-flex px-2 py-1 rounded text-[10px] uppercase font-semibold " + map[tone]}>{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
function statusTone(s: string) {
  if (s === "paid") return "bg-emerald-500/15 text-emerald-600";
  if (s === "pending") return "bg-amber-500/15 text-amber-600";
  if (s === "failed" || s === "cancelled") return "bg-destructive/15 text-destructive";
  return "bg-secondary text-muted-foreground";
}
