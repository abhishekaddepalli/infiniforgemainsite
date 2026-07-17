import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet, ShoppingBag, Ticket, TrendingUp, Sparkles, RefreshCw, Gift, Share2,
  ArrowUpRight, Package, FileDown, FileText, Server, Cpu, HardDrive, Clock, ExternalLink, AlertTriangle,
} from "lucide-react";
import { useAuth, type RoleKey } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { downloadInvoicePdf, downloadInvoiceCsv } from "@/lib/invoice";
import { ExpirationBar } from "@/components/membership/ExpirationBar";
import { useServerFn } from "@tanstack/react-start";
import { getMyMembership } from "@/lib/memberships.functions";

export const Route = createFileRoute("/portal/")({
  head: () => ({ meta: [{ title: "Dashboard — My Portal" }, { name: "robots", content: "noindex" }] }),
  component: PortalDashboard,
});

const ROLE_LABEL: Record<RoleKey, string> = {
  super_admin: "Super Admin", admin: "Admin", sales_manager: "Sales Manager",
  support: "Support", finance: "Finance", employee: "Employee",
  reseller: "Reseller Partner", customer: "Customer", affiliate: "Affiliate Partner",
};

function PortalDashboard() {
  const { user, profile, roles } = useAuth();
  const navigate = useNavigate();
  const primaryRole: RoleKey = roles.includes("affiliate") ? "affiliate" : "customer";

  const { data: myOrders } = useQuery({
    queryKey: ["portal-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").eq("customer_id", user!.id).order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const { data: myTickets } = useQuery({
    queryKey: ["portal-tickets", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("tickets").select("*").eq("customer_id", user!.id).order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const { data: wallet } = useQuery({
    queryKey: ["portal-wallet", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("wallets").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: mySubs } = useQuery({
    queryKey: ["portal-subs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("subscriptions").select("*").eq("customer_id", user!.id).eq("status", "active");
      return data ?? [];
    },
  });

  const { data: myVps = [] } = useQuery({
    queryKey: ["portal-vps-dash", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("module_records")
        .select("id,title,subtitle,status,amount_inr,due_at,metadata,created_at")
        .eq("module", "vps_instance")
        .eq("customer_id", user!.id)
        .order("due_at", { ascending: true, nullsFirst: false });
      return data ?? [];
    },
  });

  if (!user) return null;
  const totalSpend = (myOrders ?? []).filter((o) => o.status === "paid").reduce((s, o) => s + Number(o.total_inr ?? 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-6 py-8 space-y-8">
      <div>
        <Badge variant="secondary" className="mb-2">{ROLE_LABEL[primaryRole]}</Badge>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Welcome back, {(profile?.full_name ?? "there").split(" ")[0]} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {primaryRole === "affiliate" && "Track referrals, commissions and share your unique link."}
          {primaryRole === "customer" && "Your subscriptions, invoices, wallet and support tickets — all in one place."}
        </p>
      </div>

      <MembershipStrip />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Wallet balance" value={formatINR(Number(wallet?.balance_inr ?? 0))} icon={Wallet} />
        <KpiCard label="Total spend" value={formatINR(totalSpend)} icon={TrendingUp} />
        <KpiCard label="Active subscriptions" value={String(mySubs?.length ?? 0)} icon={RefreshCw} />
        <KpiCard label="Open tickets" value={String((myTickets ?? []).filter((t) => t.status === "open").length)} icon={Ticket} />
      </div>

      {myVps.length > 0 && <VpsExpiryBanner vps={myVps as any[]} />}
      {myVps.length > 0 && <VpsDashStrip vps={myVps as any[]} />}



      {primaryRole === "affiliate" && (
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white shrink-0">
            <Share2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Your referral link</div>
            <p className="text-xs text-muted-foreground mt-0.5">Share and earn commission on every paid signup.</p>
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 text-xs font-mono bg-background rounded-lg px-3 py-2 border border-border truncate">
                {typeof window !== "undefined" ? window.location.origin : "https://infiniforge.cloud"}/?ref={user.id.slice(0, 8)}
              </code>
              <Button size="sm" variant="outline" onClick={() => {
                navigator.clipboard?.writeText(`${window.location.origin}/?ref=${user.id.slice(0, 8)}`).catch(() => {});
                toast.success("Referral link copied");
              }}>Copy</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Recent orders</div>
              <div className="text-base font-semibold mt-0.5">Your purchases</div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate({ to: "/products" })}>Shop <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Button>
          </div>
          <div className="divide-y divide-border">
            {(myOrders ?? []).length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No orders yet. Browse the catalog to place your first order.
              </div>
            )}
            {(myOrders ?? []).map((o) => (
              <div key={o.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30">
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center"><ShoppingBag className="h-4 w-4 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{o.product_name}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">{o.invoice_number ?? o.order_number}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatINR(Number(o.total_inr))}</div>
                  <StatusPill status={o.status} />
                </div>
                {o.status === "paid" && (
                  <div className="flex items-center gap-1 ml-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8" title="Download PDF invoice" onClick={() => downloadInvoicePdf(o)}>
                      <FileText className="h-4 w-4 text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" title="Download CSV" onClick={() => downloadInvoiceCsv(o)}>
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Support</div>
              <div className="text-base font-semibold mt-0.5">Recent tickets</div>
            </div>
            <Button size="sm" variant="ghost" asChild><Link to="/portal/tickets">All <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </div>
          <div className="divide-y divide-border">
            {(myTickets ?? []).length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Ticket className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No support tickets.
              </div>
            )}
            {(myTickets ?? []).map((t) => (
              <div key={t.id} className="p-4 hover:bg-secondary/30">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium flex-1 truncate">{t.subject}</div>
                  <StatusPill status={t.status} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 font-mono">{t.ticket_number}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-brand p-6 lg:p-8 text-white flex items-start gap-4 flex-wrap">
        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0"><Sparkles className="h-6 w-6" /></div>
        <div className="flex-1 min-w-[240px]">
          <div className="text-xl font-bold">Unlock more with Infiniforge</div>
          <p className="text-sm text-white/85 mt-1 max-w-lg">Add AI Automation, VPS Hosting, or become a reseller. Wallet top-ups get 5% bonus credits this month.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" asChild><Link to="/products">Browse</Link></Button>
          <Button variant="outline" size="sm" className="bg-transparent border-white/40 text-white hover:bg-white/10" asChild>
            <Link to="/pricing"><Gift className="h-3.5 w-3.5 mr-1.5" /> View plans</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center"><Icon className="h-4 w-4 text-primary" /></div>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

function MembershipStrip() {
  const getMine = useServerFn(getMyMembership);
  const { data } = useQuery({ queryKey: ["my-membership"], queryFn: () => getMine() as any });
  if (!data) return null;
  return <ExpirationBar membership={data as any} />;
}


function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-accent/15 text-accent",
    pending: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    open: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    closed: "bg-secondary text-muted-foreground",
    resolved: "bg-accent/15 text-accent",
    active: "bg-accent/15 text-accent",
    cancelled: "bg-destructive/15 text-destructive",
    failed: "bg-destructive/15 text-destructive",
  };
  return <span className={cn("inline-flex text-[10px] font-semibold rounded-full px-2 py-0.5 capitalize", map[status] || "bg-secondary text-muted-foreground")}>{status}</span>;
}

type VpsRow = {
  id: string; title: string; subtitle: string | null; status: string;
  amount_inr: number | null; due_at: string | null;
  metadata: { hostname?: string; ip_address?: string; plan?: string; cpu_cores?: string; ram_gb?: string; storage_gb?: string; panel_url?: string } | null;
};

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function VpsDashStrip({ vps }: { vps: VpsRow[] }) {
  const active = vps.filter((v) => v.status === "active").length;
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-border/70">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Server className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">My cloud</div>
            <div className="text-base font-semibold truncate">{vps.length} VPS instance{vps.length > 1 ? "s" : ""} · {active} active</div>
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link to="/portal/vps">Manage <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link>
        </Button>
      </div>
      <div className="grid gap-3 p-3 sm:p-4 sm:grid-cols-2 lg:grid-cols-3">
        {vps.slice(0, 3).map((v) => {
          const d = daysUntil(v.due_at);
          const m = v.metadata ?? {};
          const tone =
            d == null ? "border-border text-muted-foreground bg-background/60" :
            d < 0 ? "border-rose-500/40 text-rose-500 bg-rose-500/10" :
            d <= 7 ? "border-amber-500/40 text-amber-500 bg-amber-500/10" :
            "border-emerald-500/40 text-emerald-500 bg-emerald-500/10";
          return (
            <Link
              key={v.id}
              to="/portal/vps"
              className="group rounded-xl border border-border bg-background/70 backdrop-blur p-3 sm:p-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{v.title}</div>
                  {(m.hostname || m.ip_address) && (
                    <div className="text-[11px] font-mono text-muted-foreground truncate">{m.hostname || m.ip_address}</div>
                  )}
                </div>
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border inline-flex items-center gap-1 shrink-0", tone)}>
                  <Clock className="h-2.5 w-2.5" />
                  {d == null ? "—" : d < 0 ? `${Math.abs(d)}d ago` : `${d}d`}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                {m.cpu_cores && <span className="inline-flex items-center gap-1"><Cpu className="h-3 w-3" />{m.cpu_cores}c</span>}
                {m.ram_gb && <span className="inline-flex items-center gap-1"><HardDrive className="h-3 w-3" />{m.ram_gb}GB</span>}
                {m.storage_gb && <span className="inline-flex items-center gap-1"><HardDrive className="h-3 w-3" />{m.storage_gb}GB SSD</span>}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <StatusPill status={v.status} />
                {m.panel_url && (
                  <span className="text-[11px] text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    Panel <ExternalLink className="h-3 w-3" />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


function VpsExpiryBanner({ vps }: { vps: VpsRow[] }) {
  const alerts = vps
    .map((v) => ({ v, d: daysUntil(v.due_at) }))
    .filter((x) => x.d != null && x.d <= 7)
    .sort((a, b) => (a.d ?? 0) - (b.d ?? 0));
  if (alerts.length === 0) return null;
  const expired = (alerts[0].d ?? 0) < 0;
  return (
    <div className={cn(
      "rounded-2xl border p-4 sm:p-5 flex flex-wrap items-start gap-4",
      expired ? "border-rose-500/40 bg-rose-500/10" : "border-amber-500/40 bg-amber-500/10",
    )}>
      <div className={cn(
        "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center",
        expired ? "bg-rose-500/20 text-rose-500" : "bg-amber-500/20 text-amber-500",
      )}>
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn("font-semibold", expired ? "text-rose-500" : "text-amber-600 dark:text-amber-400")}>
          {expired ? "VPS renewal overdue" : `${alerts.length} VPS renewing within 7 days`}
        </div>
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {alerts.slice(0, 3).map(({ v, d }) => (
            <li key={v.id} className="truncate">
              <span className="font-medium text-foreground">{v.title}</span> —{" "}
              {d! < 0 ? `expired ${Math.abs(d!)}d ago` : d === 0 ? "expires today" : `${d}d left`}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button asChild size="sm" variant="outline">
          <Link to="/portal/orders"><FileText className="h-4 w-4 mr-1.5" /> Invoices</Link>
        </Button>
        <Button asChild size="sm" className="bg-gradient-brand text-white">
          <Link to="/portal/vps">Renew now</Link>
        </Button>
      </div>
    </div>
  );
}
