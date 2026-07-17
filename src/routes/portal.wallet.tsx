import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Wallet, ArrowLeft, Plus, Loader2, TrendingUp, TrendingDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { createWalletTopup, verifyWalletTopup } from "@/lib/payments.functions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/wallet")({
  head: () => ({ meta: [{ title: "Wallet — Infiniforge Portal" }, { name: "robots", content: "noindex" }] }),
  component: WalletPage,
});

declare global {
  interface Window { Razorpay?: new (o: Record<string, unknown>) => { open: () => void }; }
}
function loadRzp(): Promise<boolean> {
  return new Promise((r) => {
    if (typeof window === "undefined") return r(false);
    if (window.Razorpay) return r(true);
    const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => r(true); s.onerror = () => r(false); document.body.appendChild(s);
  });
}

const QUICK = [500, 1000, 2500, 5000, 10000];

function WalletPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(1000);
  const [busy, setBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);

  const { data: wallet, refetch: refetchWallet } = useQuery({
    queryKey: ["wallet", user?.id, reloadKey],
    enabled: !!user,
    queryFn: async () => (await supabase.from("wallets").select("*").eq("user_id", user!.id).maybeSingle()).data,
  });
  const { data: txns, refetch: refetchTxns } = useQuery({
    queryKey: ["wallet-txns", user?.id, reloadKey],
    enabled: !!user,
    queryFn: async () => (await supabase.from("wallet_transactions").select("*").eq("wallet_id", (await supabase.from("wallets").select("id").eq("user_id", user!.id).maybeSingle()).data?.id ?? "").order("created_at", { ascending: false }).limit(30)).data ?? [],
  });

  async function handleTopup() {
    if (!user) return;
    if (amount < 100) { toast.error("Minimum ₹100"); return; }
    setBusy(true);
    try {
      const res = await createWalletTopup({ data: { amount_inr: amount } });
      if (res.demo) {
        toast.success(`₹${amount} credited (demo mode)`);
        setReloadKey((k) => k + 1); refetchWallet(); refetchTxns();
        return;
      }
      const ok = await loadRzp();
      if (!ok || !window.Razorpay) throw new Error("Razorpay SDK failed");
      const rzp = new window.Razorpay({
        key: res.razorpay_key_id,
        order_id: res.razorpay_order_id,
        amount: res.amount_inr * 100, currency: "INR",
        name: "Infiniforge Wallet",
        description: "Wallet top-up",
        prefill: { name: profile?.full_name ?? "", email: user.email ?? "" },
        theme: { color: "#FF9933" },
        handler: async (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verifyWalletTopup({ data: { ...r, amount_inr: res.amount_inr } });
            toast.success(`Wallet credited ${formatINR(res.amount_inr)}`);
            setReloadKey((k) => k + 1); refetchWallet(); refetchTxns();
          } catch (e) { toast.error(e instanceof Error ? e.message : "Verification failed"); }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Top-up failed");
    } finally { setBusy(false); }
  }

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="h-16 border-b border-border bg-background/85 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-4xl h-full px-4 flex items-center gap-3">
          <Button size="icon" variant="ghost" asChild><Link to="/portal"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div>
            <div className="text-sm font-semibold">Wallet</div>
            <div className="text-[11px] text-muted-foreground">Top up and use credit at checkout</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="rounded-2xl bg-gradient-brand text-white p-8 flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center"><Wallet className="h-6 w-6" /></div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-white/80">Current balance</div>
            <div className="text-4xl font-bold mt-1">{formatINR(Number(wallet?.balance_inr ?? 0))}</div>
            {wallet?.frozen && <Badge className="mt-2 bg-white/25 text-white border-0">Frozen</Badge>}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add funds</div>
          <div className="flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <button key={q} onClick={() => setAmount(q)}
                className={cn("px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                  amount === q ? "bg-gradient-brand text-white border-transparent" : "bg-background border-border hover:border-primary/40")}>
                ₹{q.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1"><Label>Custom amount (₹)</Label><Input type="number" min={100} value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} /></div>
            <Button className="bg-gradient-brand text-white h-11 px-8" onClick={handleTopup} disabled={busy || wallet?.frozen}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : `Add ${formatINR(amount)}`}
            </Button>
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> Secured by Razorpay · UPI / Cards / Netbanking</div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border font-semibold">Transaction history</div>
          <div className="divide-y divide-border">
            {(txns ?? []).length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">No transactions yet</div>}
            {(txns ?? []).map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-4">
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", t.type === "credit" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive")}>
                  {t.type === "credit" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.note ?? t.description ?? t.type}</div>
                  <div className="text-[11px] text-muted-foreground">{new Date(t.created_at).toLocaleString("en-IN")}</div>
                </div>
                <div className={cn("font-semibold", t.type === "credit" ? "text-accent" : "text-destructive")}>
                  {t.type === "credit" ? "+" : ""}{formatINR(Number(t.amount_inr))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
