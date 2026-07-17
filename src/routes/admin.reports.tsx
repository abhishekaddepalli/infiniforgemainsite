import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, Package, Wallet, Ticket, IndianRupee, Download, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadCsv } from "@/lib/download";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Reports & Analytics"><ReportsPage /></AdminShell>,
});

type OrderRow = { id: string; total_inr: number; gst_inr: number; status: string; product_name: string; product_id: string | null; created_at: string; paid_at: string | null; customer_id: string | null };
type SubRow = { id: string; amount_inr: number; status: string; plan: string; billing_cycle: string };
type TicketRow = { id: string; status: string; priority: string; subject: string; created_at: string };

type PresetKey = "7" | "30" | "90" | "365" | "all" | "custom";

const PRESETS: { value: PresetKey; label: string }[] = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 12 months" },
  { value: "all", label: "All time" },
  { value: "custom", label: "Custom range" },
];

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function ReportsPage() {
  const [preset, setPreset] = useState<PresetKey>("30");
  const today = new Date();
  const defaultFrom = new Date(); defaultFrom.setDate(today.getDate() - 30);
  const [fromStr, setFromStr] = useState<string>(toISODate(defaultFrom));
  const [toStr, setToStr] = useState<string>(toISODate(today));

  const { from, to } = useMemo(() => {
    if (preset === "custom") {
      const f = new Date(fromStr + "T00:00:00");
      const t = new Date(toStr + "T23:59:59");
      return { from: f, to: t };
    }
    if (preset === "all") return { from: new Date(0), to: new Date() };
    const days = Number(preset);
    const f = new Date(); f.setDate(f.getDate() - days); f.setHours(0, 0, 0, 0);
    return { from: f, to: new Date() };
  }, [preset, fromStr, toStr]);

  const { data: orders = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["report-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders")
        .select("id,total_inr,gst_inr,status,product_name,product_id,created_at,paid_at,customer_id")
        .order("created_at", { ascending: false }).limit(5000);
      if (error) throw error; return (data ?? []) as OrderRow[];
    },
  });
  const { data: subs = [] } = useQuery({
    queryKey: ["report-subs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscriptions").select("id,amount_inr,status,plan,billing_cycle").limit(5000);
      if (error) throw error; return (data ?? []) as SubRow[];
    },
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ["report-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tickets").select("id,status,priority,subject,created_at").limit(5000);
      if (error) throw error; return (data ?? []) as TicketRow[];
    },
  });

  const scopedOrders = useMemo(() => orders.filter((o) => {
    const d = new Date(o.paid_at ?? o.created_at);
    return d >= from && d <= to;
  }), [orders, from, to]);
  const scopedTickets = useMemo(() => tickets.filter((t) => {
    const d = new Date(t.created_at);
    return d >= from && d <= to;
  }), [tickets, from, to]);

  const paidOrders = scopedOrders.filter((o) => o.status === "paid");
  const revenue = paidOrders.reduce((s, o) => s + Number(o.total_inr ?? 0), 0);
  const gstCollected = paidOrders.reduce((s, o) => s + Number(o.gst_inr ?? 0), 0);
  const pending = scopedOrders.filter((o) => o.status === "pending").length;

  const activeSubs = subs.filter((s) => s.status === "active").length;
  const mrr = subs.filter((s) => s.status === "active" && (s.billing_cycle === "monthly" || s.billing_cycle === "mo"))
    .reduce((s, x) => s + Number(x.amount_inr ?? 0), 0);
  const arr = subs.filter((s) => s.status === "active" && (s.billing_cycle === "yearly" || s.billing_cycle === "yr"))
    .reduce((s, x) => s + Number(x.amount_inr ?? 0), 0);

  const openTickets = scopedTickets.filter((t) => !["closed", "resolved"].includes(t.status)).length;
  const customerSet = new Set(scopedOrders.map((o) => o.customer_id).filter(Boolean));

  const byProduct: Record<string, { name: string; revenue: number; orders: number }> = {};
  paidOrders.forEach((o) => {
    const k = o.product_id ?? o.product_name;
    if (!byProduct[k]) byProduct[k] = { name: o.product_name, revenue: 0, orders: 0 };
    byProduct[k].revenue += Number(o.total_inr ?? 0);
    byProduct[k].orders += 1;
  });
  const topProducts = Object.values(byProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  // Daily buckets between from..to (cap to 60 for chart readability; if range is bigger, aggregate by month)
  const rangeDays = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000));
  const useMonthly = rangeDays > 90;

  const buckets = useMemo(() => {
    if (useMonthly) {
      const list: { label: string; key: string; revenue: number; date: Date }[] = [];
      const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
      const end = new Date(to.getFullYear(), to.getMonth(), 1);
      while (cursor <= end) {
        list.push({
          label: cursor.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
          key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
          revenue: 0,
          date: new Date(cursor),
        });
        cursor.setMonth(cursor.getMonth() + 1);
      }
      paidOrders.forEach((o) => {
        const d = new Date(o.paid_at ?? o.created_at);
        const k = `${d.getFullYear()}-${d.getMonth()}`;
        const b = list.find((x) => x.key === k);
        if (b) b.revenue += Number(o.total_inr ?? 0);
      });
      return list;
    } else {
      const list: { label: string; key: string; revenue: number; date: Date }[] = [];
      const cursor = new Date(from); cursor.setHours(0, 0, 0, 0);
      const end = new Date(to); end.setHours(0, 0, 0, 0);
      while (cursor <= end) {
        list.push({
          label: cursor.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
          key: toISODate(cursor),
          revenue: 0,
          date: new Date(cursor),
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      paidOrders.forEach((o) => {
        const d = new Date(o.paid_at ?? o.created_at);
        const k = toISODate(d);
        const b = list.find((x) => x.key === k);
        if (b) b.revenue += Number(o.total_inr ?? 0);
      });
      return list;
    }
  }, [paidOrders, from, to, useMonthly]);

  const maxBucket = Math.max(1, ...buckets.map((m) => m.revenue));
  const bucketTotal = buckets.reduce((s, m) => s + m.revenue, 0);

  function exportCsv() {
    const rangeLabel = preset === "custom" ? `${fromStr}_to_${toStr}` : preset === "all" ? "all-time" : `last-${preset}d`;
    const rows: (string | number)[][] = [
      ["Infiniforge Report", ""],
      ["Range", `${toISODate(from)} to ${toISODate(to)}`],
      [],
      ["Metric", "Value"],
      ["Revenue (paid)", revenue.toFixed(2)],
      ["GST collected", gstCollected.toFixed(2)],
      ["Paid orders", String(paidOrders.length)],
      ["Pending orders", String(pending)],
      ["Active subscriptions", String(activeSubs)],
      ["MRR", mrr.toFixed(2)],
      ["ARR", arr.toFixed(2)],
      ["Open tickets", String(openTickets)],
      ["Unique customers", String(customerSet.size)],
      [],
      [useMonthly ? "Month" : "Day", "Revenue"],
      ...buckets.map((b) => [b.label, b.revenue.toFixed(2)]),
      [],
      ["Top products", "Revenue", "Orders"],
      ...topProducts.map((p) => [p.name, p.revenue.toFixed(2), String(p.orders)]),
      [],
      ["Paid orders detail", ""],
      ["Order date", "Product", "Total INR", "GST INR"],
      ...paidOrders.map((o) => [
        new Date(o.paid_at ?? o.created_at).toLocaleString("en-IN"),
        o.product_name,
        Number(o.total_inr).toFixed(2),
        Number(o.gst_inr).toFixed(2),
      ]),
    ];
    downloadCsv(rows, `infiniforge-report-${rangeLabel}.csv`);
  }

  return (
      <div className="space-y-6 min-w-0 max-w-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 sm:gap-4">
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold truncate">Reports & Analytics</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
              {toISODate(from)} → {toISODate(to)} · {rangeDays} day{rangeDays !== 1 ? "s" : ""} · {useMonthly ? "monthly" : "daily"} view
            </p>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Select value={preset} onValueChange={(v) => {
            const p = v as PresetKey;
            setPreset(p);
            if (p !== "custom" && p !== "all") {
              const days = Number(p);
              const f = new Date(); f.setDate(f.getDate() - days);
              setFromStr(toISODate(f)); setToStr(toISODate(new Date()));
            }
          }}>
            <SelectTrigger className="w-full sm:w-[170px]"><Calendar className="h-4 w-4 mr-1.5" /><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRESETS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {preset === "custom" && (
            <>
              <Input type="date" value={fromStr} max={toStr} onChange={(e) => setFromStr(e.target.value)} className="w-full sm:w-[160px]" />
              <span className="text-muted-foreground text-sm hidden sm:inline">to</span>
              <Input type="date" value={toStr} min={fromStr} max={toISODate(new Date())} onChange={(e) => setToStr(e.target.value)} className="w-full sm:w-[160px]" />
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching}>Refresh</Button>
          <Button onClick={exportCsv} variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Kpi icon={IndianRupee} label="Revenue (paid)" value={formatINR(revenue)} tone="brand" />
        <Kpi icon={IndianRupee} label="GST collected" value={formatINR(gstCollected)} tone="green" />
        <Kpi icon={Package} label="Paid / Pending" value={`${paidOrders.length} / ${pending}`} tone="saffron" />
        <Kpi icon={Users} label="Unique customers" value={String(customerSet.size)} />
        <Kpi icon={TrendingUp} label="MRR" value={formatINR(mrr)} tone="brand" />
        <Kpi icon={TrendingUp} label="ARR (from yearly)" value={formatINR(arr)} tone="green" />
        <Kpi icon={Wallet} label="Active subscriptions" value={String(activeSubs)} />
        <Kpi icon={Ticket} label="Open tickets" value={String(openTickets)} tone="saffron" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-4 sm:p-5 lg:col-span-2 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{useMonthly ? "Monthly" : "Daily"} revenue</div>
              <div className="text-lg font-semibold">Revenue trend</div>
            </div>
            <Badge className="bg-accent/15 text-accent border-0">{formatINR(bucketTotal)}</Badge>
          </div>
          <div className="flex items-end gap-1 h-40 overflow-x-auto">
            {buckets.map((m, i) => (
              <div key={i} className="min-w-[14px] flex-1 flex flex-col items-center gap-1.5" title={`${m.label}: ${formatINR(m.revenue)}`}>
                <div className="w-full rounded-t-md bg-gradient-brand" style={{ height: `${(m.revenue / maxBucket) * 100}%`, minHeight: 2 }} />
                {(buckets.length <= 20 || i % Math.ceil(buckets.length / 20) === 0) && (
                  <div className="text-[9px] text-muted-foreground whitespace-nowrap">{m.label}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-5 min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Top products</div>
          <div className="text-lg font-semibold mb-4">By revenue</div>
          {isLoading ? <div className="text-sm text-muted-foreground">Loading…</div> :
            topProducts.length === 0 ? <div className="text-sm text-muted-foreground">No paid orders in this range.</div> : (
            <div className="space-y-2.5">
              {topProducts.map((p) => (
                <div key={p.name} className="text-sm">
                  <div className="flex justify-between">
                    <span className="truncate pr-2">{p.name}</span>
                    <span className="font-semibold tabular-nums">{formatINR(p.revenue)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary mt-1 overflow-hidden">
                    <div className="h-full bg-gradient-brand" style={{ width: `${(p.revenue / topProducts[0].revenue) * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{p.orders} order{p.orders !== 1 ? "s" : ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Recent activity</div>
        <div className="text-lg font-semibold mb-4">Paid orders in range</div>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b border-border">
              <tr><th className="text-left py-2 px-2">Product</th><th className="text-left py-2 px-2">Date</th><th className="text-right py-2 px-2">Total</th><th className="text-right py-2 px-2">GST</th></tr>
            </thead>
            <tbody>
              {paidOrders.slice(0, 15).map((o) => (
                <tr key={o.id} className="border-b border-border/50">
                  <td className="py-2 px-2 break-words">{o.product_name}</td>
                  <td className="py-2 px-2 text-muted-foreground">{new Date(o.paid_at ?? o.created_at).toLocaleDateString("en-IN")}</td>
                  <td className="py-2 px-2 text-right tabular-nums">{formatINR(Number(o.total_inr))}</td>
                  <td className="py-2 px-2 text-right tabular-nums text-muted-foreground">{formatINR(Number(o.gst_inr))}</td>
                </tr>
              ))}
              {paidOrders.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No paid orders in this range.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: typeof BarChart3; label: string; value: string; tone?: "brand" | "green" | "saffron" }) {
  const bg = tone === "green" ? "bg-gradient-green" : tone === "saffron" ? "bg-gradient-saffron" : tone === "brand" ? "bg-gradient-brand" : "bg-secondary";
  const iconCls = tone ? "text-white" : "text-primary";
  return (
    <div className="glass rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 min-w-0">
      <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}><Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconCls}`} /></div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground truncate">{label}</div>
        <div className="text-sm sm:text-lg font-bold truncate">{value}</div>
      </div>
    </div>
  );
}
