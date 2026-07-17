import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, ShoppingCart, RefreshCw, Receipt,
  Package, Ticket, Users, ChevronRight, Sparkles,
  KeyRound, Layers, Server, Globe, Wallet, FileText, Boxes, Wrench, Inbox,
  Check, CheckCheck, Mail, Phone,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadCsv } from "@/lib/download";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <AdminShell title="Dashboard">
      <DashboardInner />
    </AdminShell>
  );
}

const RANGE_DAYS: Record<string, number | null> = { "7": 7, "30": 30, "90": 90, "365": 365, all: null };

function DashboardInner() {
  const qc = useQueryClient();
  const [range, setRange] = useState<keyof typeof RANGE_DAYS>("30");
  const sinceIso = (() => {
    const d = RANGE_DAYS[range];
    if (!d) return null;
    const t = new Date(); t.setDate(t.getDate() - d); return t.toISOString();
  })();

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["admin-stats", range],
    queryFn: async () => {
      const ordersQ = supabase.from("orders").select("*", { count: "exact", head: true });
      const revenueQ = supabase.from("orders").select("total_inr,created_at").eq("status", "paid");
      const usersQ = supabase.from("profiles").select("*", { count: "exact", head: true });
      if (sinceIso) { ordersQ.gte("created_at", sinceIso); revenueQ.gte("created_at", sinceIso); usersQ.gte("created_at", sinceIso); }
      const SERVICE_TYPES = ["service", "saas", "hosting", "domain", "ssl", "amc", "monitoring"];
      const [
        orders, products, tickets, users, revenueAgg, subs,
        licensesActive, licensesTotal, digitalProducts, hostingActive,
        domainsActive, amcActive, activeServices, walletsAgg, invoicesUnpaid, affiliatesActive, newContactSubs,
      ] = await Promise.all([
        ordersQ,
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
        usersQ,
        revenueQ,
        supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("module_records").select("*", { count: "exact", head: true }).eq("module", "licenses").eq("status", "active"),
        supabase.from("module_records").select("*", { count: "exact", head: true }).eq("module", "licenses"),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("product_type", "digital"),
        supabase.from("module_records").select("*", { count: "exact", head: true }).eq("module", "hosting").eq("status", "active"),
        supabase.from("module_records").select("*", { count: "exact", head: true }).eq("module", "domains").eq("status", "active"),
        supabase.from("module_records").select("*", { count: "exact", head: true }).eq("module", "amc").eq("status", "active"),
        supabase.from("products").select("*", { count: "exact", head: true }).in("product_type", SERVICE_TYPES).eq("status", "active"),
        supabase.from("wallets").select("balance_inr"),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "affiliate"),
        supabase.from("module_records").select("*", { count: "exact", head: true }).eq("module", "contact_submissions").eq("status", "new"),
      ]);
      const revenue = (revenueAgg.data ?? []).reduce((s, r) => s + Number(r.total_inr ?? 0), 0);
      const walletTotal = (walletsAgg.data ?? []).reduce((s, r) => s + Number(r.balance_inr ?? 0), 0);
      return {
        orders: orders.count ?? 0,
        products: products.count ?? 0,
        openTickets: tickets.count ?? 0,
        users: users.count ?? 0,
        subs: subs.count ?? 0,
        revenue,
        rawRevenueRows: revenueAgg.data ?? [],
        licensesActive: licensesActive.count ?? 0,
        licensesTotal: licensesTotal.count ?? 0,
        digitalProducts: digitalProducts.count ?? 0,
        hostingActive: hostingActive.count ?? 0,
        domainsActive: domainsActive.count ?? 0,
        amcActive: amcActive.count ?? 0,
        activeServices: activeServices.count ?? 0,
        walletTotal,
        invoicesUnpaid: invoicesUnpaid.count ?? 0,
        affiliatesActive: affiliatesActive.count ?? 0,
        newContactSubs: newContactSubs.count ?? 0,
      };
    },
    refetchInterval: 30000,
  });

  const { data: recentOrders, refetch: refetchRecent } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6);
      return data ?? [];
    },
    refetchInterval: 20000,
  });

  const { data: newEnquiries, refetch: refetchEnquiries } = useQuery({
    queryKey: ["admin-new-enquiries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("module_records")
        .select("id,title,metadata,created_at,status")
        .eq("module", "contact_submissions")
        .eq("status", "new")
        .order("created_at", { ascending: false })
        .limit(6);
      return (data ?? []) as Array<{ id: string; title: string | null; metadata: { email?: string; phone?: string; interest?: string; message?: string } | null; created_at: string; status: string }>;
    },
    refetchInterval: 30000,
  });

  const markRead = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from("module_records")
        .update({ status: "read" })
        .in("id", ids)
        .eq("module", "contact_submissions");
      if (error) throw error;
    },
    onSuccess: (_d, ids) => {
      toast.success(`Marked ${ids.length} enquir${ids.length === 1 ? "y" : "ies"} as read`);
      qc.invalidateQueries({ queryKey: ["admin-new-enquiries"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      qc.invalidateQueries({ queryKey: ["contact-submissions"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to mark as read"),
  });

  // Live updates via Supabase realtime
  useEffect(() => {
    const channel = supabase
      .channel("admin-dashboard-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-stats"] });
        qc.invalidateQueries({ queryKey: ["admin-recent-orders"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, () => qc.invalidateQueries({ queryKey: ["admin-stats"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => qc.invalidateQueries({ queryKey: ["admin-stats"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "module_records" }, () => qc.invalidateQueries({ queryKey: ["admin-stats"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "subscriptions" }, () => qc.invalidateQueries({ queryKey: ["admin-stats"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "wallets" }, () => qc.invalidateQueries({ queryKey: ["admin-stats"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => qc.invalidateQueries({ queryKey: ["admin-stats"] }))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  function exportReport() {
    const rows = stats?.rawRevenueRows ?? [];
    if (!rows.length && !recentOrders?.length) { toast.info("No data available to export"); return; }
    const buckets = new Map<string, number>();
    for (const r of rows) {
      const d = new Date(r.created_at as string).toISOString().slice(0, 10);
      buckets.set(d, (buckets.get(d) ?? 0) + Number(r.total_inr ?? 0));
    }
    const csv: (string | number)[][] = [["date", "revenue_inr"]];
    for (const [date, revenue] of Array.from(buckets.entries()).sort(([a],[b]) => a < b ? -1 : 1)) {
      csv.push([date, revenue.toFixed(2)]);
    }
    csv.push(["TOTAL", (stats?.revenue ?? 0).toFixed(2)]);
    downloadCsv(csv, `infiniforge-dashboard-${range}d-${new Date().toISOString().slice(0,10)}.csv`);
    toast.success("Report exported");
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:flex-wrap sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Dashboard</span><ChevronRight className="h-3 w-3 shrink-0" /><span>Overview</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mt-1">Welcome back 👋</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Live overview of Infiniforge — auto-refreshing every 30s.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={range} onValueChange={(v) => setRange(v as keyof typeof RANGE_DAYS)}>
            <SelectTrigger className="h-9 w-full sm:w-[140px] min-w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => { refetchStats(); refetchRecent(); toast.success("Refreshed"); }}>
            <RefreshCw className="h-3.5 w-3.5 sm:mr-1.5" /><span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button size="sm" className="bg-gradient-brand text-white" onClick={exportReport}>
            <Receipt className="h-3.5 w-3.5 sm:mr-1.5" /><span className="hidden sm:inline">Export report</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={`Revenue (${range === "all" ? "all time" : `last ${range}d`})`} value={formatINR(stats?.revenue ?? 0)} change="live" up icon={TrendingUp} />
        <KpiCard label="Orders" value={(stats?.orders ?? 0).toLocaleString("en-IN")} change="live" up icon={ShoppingCart} />
        <KpiCard label="Active subscriptions" value={(stats?.subs ?? 0).toLocaleString("en-IN")} change="live" up icon={RefreshCw} />
        <KpiCard label="Open tickets" value={(stats?.openTickets ?? 0).toLocaleString("en-IN")} change="awaiting reply" icon={Ticket} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
            Live operations <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <span className="text-[11px] text-muted-foreground">Auto-updating</span>
        </div>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <TinyCard label="Active services" value={stats?.activeServices ?? 0} to="/admin/services" icon={Boxes} />
          <TinyCard label="Active licenses" value={stats?.licensesActive ?? 0} to="/admin/licenses" icon={KeyRound} />
          <TinyCard label="Digital products" value={stats?.digitalProducts ?? 0} to="/admin/digital-products" icon={Layers} />
          <TinyCard label="Hosting active" value={stats?.hostingActive ?? 0} to="/admin/hosting" icon={Server} />
          <TinyCard label="Domains active" value={stats?.domainsActive ?? 0} to="/admin/domains" icon={Globe} />
          <TinyCard label="AMC contracts" value={stats?.amcActive ?? 0} to="/admin/amc" icon={Wrench} />
          <TinyCard label="Unpaid invoices" value={stats?.invoicesUnpaid ?? 0} to="/admin/invoices" icon={FileText} />
          <TinyCard label="Wallet balances" value={Math.round(stats?.walletTotal ?? 0)} to="/admin/wallets" icon={Wallet} />
          <TinyCard label="Affiliates" value={stats?.affiliatesActive ?? 0} to="/admin/affiliates" icon={Users} />
          <TinyCard label="Products" value={stats?.products ?? 0} to="/admin/products" icon={Package} />
          <TinyCard label="Customers" value={stats?.users ?? 0} to="/admin/users" icon={Users} />
          <TinyCard label="Orders" value={stats?.orders ?? 0} to="/admin/orders" icon={ShoppingCart} />
          <TinyCard label="Open tickets" value={stats?.openTickets ?? 0} to="/admin/tickets" icon={Ticket} />
          <TinyCard label="New enquiries" value={stats?.newContactSubs ?? 0} to="/admin/contact-submissions" icon={Inbox} />
        </div>
      </div>



      {(newEnquiries?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.04] via-card to-accent/[0.04] shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white"><Inbox className="h-4 w-4" /></div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">New contact enquiries</div>
                <div className="text-sm font-semibold">{newEnquiries?.length ?? 0} unread</div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => { refetchEnquiries(); }}>
                <RefreshCw className="h-3.5 w-3.5 sm:mr-1.5" /><span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                size="sm"
                className="bg-gradient-brand text-white"
                disabled={markRead.isPending}
                onClick={() => markRead.mutate((newEnquiries ?? []).map((e) => e.id))}
              >
                <CheckCheck className="h-3.5 w-3.5 sm:mr-1.5" /><span className="hidden sm:inline">Mark all as read</span><span className="sm:hidden">All read</span>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link to="/admin/contact-submissions">View all <ArrowUpRight className="h-3.5 w-3.5 ml-1" /></Link>
              </Button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {(newEnquiries ?? []).map((e) => (
              <div key={e.id} className="flex items-start gap-3 px-5 py-3 hover:bg-secondary/40">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">{e.title ?? "Contact enquiry"}</span>
                    {e.metadata?.interest && (
                      <span className="text-[10px] rounded-full px-2 py-0.5 bg-primary/10 text-primary font-medium">{e.metadata.interest}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                    {e.metadata?.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{e.metadata.email}</span>}
                    {e.metadata?.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{e.metadata.phone}</span>}
                    <span>{new Date(e.created_at).toLocaleString()}</span>
                  </div>
                  {e.metadata?.message && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{e.metadata.message}</div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={markRead.isPending}
                  onClick={() => markRead.mutate([e.id])}
                >
                  <Check className="h-3.5 w-3.5 mr-1.5" /> Mark read
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Recent orders</div>
              <div className="text-lg font-semibold mt-0.5">Latest transactions</div>
            </div>
            <Button variant="ghost" size="sm" asChild><Link to="/admin/orders">View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-y border-border bg-secondary/40">
                  <th className="px-6 py-2.5 font-medium">Order</th>
                  <th className="px-3 py-2.5 font-medium">Customer</th>
                  <th className="px-3 py-2.5 font-medium">Product</th>
                  <th className="px-3 py-2.5 font-medium text-right">Amount</th>
                  <th className="px-6 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(recentOrders ?? []).length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">No orders yet. Orders placed by customers will appear here.</td></tr>
                )}
                {(recentOrders ?? []).map((o) => (
                  <tr key={o.id} className="hover:bg-secondary/30">
                    <td className="px-6 py-3 font-mono text-xs break-all">{o.order_number}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium">{o.customer_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground break-all">{o.customer_email ?? ""}</div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground break-words">{o.product_name}</td>
                    <td className="px-3 py-3 text-right font-semibold">{formatINR(Number(o.total_inr))}</td>
                    <td className="px-6 py-3"><StatusPill status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">System health</div>
          <div className="mt-2 text-xl font-bold flex items-center gap-2">All systems normal <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /></div>
          <div className="mt-5 space-y-4">
            {[
              { label: "API gateway", value: 99.99 },
              { label: "Payment (Razorpay)", value: 99.98 },
              { label: "VPS pool (Mumbai)", value: 99.94 },
              { label: "Email delivery", value: 98.72 },
              { label: "AI gateway", value: 99.86 },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold">{s.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs flex gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <div>Enable auto-scale on Mumbai VPS pool to keep 99.99% during peak traffic.</div>
          </div>
        </div>
      </div>
    </>
  );
}

function KpiCard({ label, value, change, up, icon: Icon }: { label: string; value: string; change: string; up?: boolean; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center"><Icon className="h-4 w-4 text-primary" /></div>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
      <div className={cn("mt-2 text-xs font-medium flex items-center gap-1", up ? "text-accent" : "text-muted-foreground")}>
        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{change}
      </div>
    </div>
  );
}

function TinyCard({ label, value, to, icon: Icon }: { label: string; value: number; to: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Link to={to} className="rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 transition-colors flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white"><Icon className="h-5 w-5" /></div>
      <div><div className="text-xs text-muted-foreground">{label}</div><div className="text-xl font-bold">{value.toLocaleString("en-IN")}</div></div>
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-accent/15 text-accent",
    pending: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    refunded: "bg-secondary text-muted-foreground",
    active: "bg-accent/15 text-accent",
    cancelled: "bg-destructive/15 text-destructive",
    failed: "bg-destructive/15 text-destructive",
  };
  return <span className={cn("inline-flex text-[11px] font-semibold rounded-full px-2.5 py-1 capitalize", map[status] || "bg-secondary")}>{status}</span>;
}
