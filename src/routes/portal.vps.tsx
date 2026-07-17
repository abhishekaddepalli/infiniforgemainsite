import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Server, Cpu, HardDrive, Wifi, MapPin, Globe, Copy, Eye, EyeOff,
  Terminal, ExternalLink, ShieldCheck, Clock, Activity, MessageCircle,
  KeyRound, Power, RefreshCcw, LifeBuoy, RotateCw, AlertTriangle, FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useCms } from "@/lib/cms";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import {
  CYCLE_LABEL, CYCLE_MONTHS, PAYMENT_METHOD_LABEL, addMonthsISO, computeTotals,
  createVpsOrder, debitWalletForOrder, notifyCustomerVps,
  type BillingCycle, type PaymentMethod,
} from "@/lib/vps-billing";

export const Route = createFileRoute("/portal/vps")({
  head: () => ({
    meta: [
      { title: "My VPS — Infiniforge Portal" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortalVpsPage,
});

type VpsMetadata = {
  hostname?: string; ip_address?: string; ipv6?: string; ssh_port?: string;
  os?: string; cpu_cores?: string; ram_gb?: string; storage_gb?: string;
  bandwidth_gb?: string; datacenter?: string; plan?: string;
  root_user?: string; root_password?: string;
  panel_url?: string; panel_user?: string; panel_password?: string;
  provisioned_at?: string; notes?: string;
  billing_cycle?: BillingCycle; payment_method?: PaymentMethod;
  auto_renew?: boolean; gst_percent?: number;
  last_invoice_id?: string; last_invoice_number?: string;
};

type VpsRow = {
  id: string;
  title: string;
  subtitle: string | null;
  status: string;
  amount_inr: number | null;
  due_at: string | null;
  metadata: VpsMetadata | null;
  created_at: string;
};

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

function copy(text: string, label: string) {
  navigator.clipboard.writeText(text).then(
    () => toast.success(`${label} copied`),
    () => toast.error("Copy failed"),
  );
}

function statusRing(s: string) {
  const k = s.toLowerCase();
  if (k === "active") return "ring-emerald-500/40 shadow-emerald-500/20";
  if (k === "provisioning") return "ring-sky-500/40 shadow-sky-500/20";
  if (k === "suspended") return "ring-amber-500/40 shadow-amber-500/20";
  return "ring-rose-500/40 shadow-rose-500/20";
}

function statusDot(s: string) {
  const k = s.toLowerCase();
  if (k === "active") return "bg-emerald-500";
  if (k === "provisioning") return "bg-sky-500 animate-pulse";
  if (k === "suspended") return "bg-amber-500";
  return "bg-rose-500";
}

function PortalVpsPage() {
  const { user } = useAuth();
  const wa = useCms("whatsapp");
  const footer = useCms("footer");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["portal-vps", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_records")
        .select("id, title, subtitle, status, amount_inr, due_at, metadata, created_at")
        .eq("module", "vps_instance")
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as VpsRow[];
    },
  });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 sm:p-6 lg:p-8">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="h-11 w-11 sm:h-14 sm:w-14 shrink-0 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/30">
              <Server className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">My VPS</h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl">
                Your cloud infrastructure at a glance — IPs, credentials, plan specs and renewal status. Managed by Infiniforge's NOC.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <MiniStat label="Instances" value={rows.length.toString()} />
            <MiniStat label="Active" value={rows.filter((r) => r.status === "active").length.toString()} />
            <MiniStat label="Uptime" value="99.99%" />
          </div>
        </div>
      </div>

      <ExpiryAlertBanner rows={rows} />

      {isLoading ? (
        <div className="glass rounded-2xl p-16 text-center text-muted-foreground">Loading your VPS instances…</div>
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {rows.map((r) => (
            <VpsCard key={r.id} vps={r} waNumber={wa.number || footer.phone || ""} />
          ))}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 px-2.5 py-2 sm:px-4 backdrop-blur">
      <div className="text-base sm:text-xl font-bold text-foreground">{value}</div>
      <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass rounded-2xl p-12 text-center">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <Server className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold">No VPS instances yet</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        Once our team provisions a VPS for you, it will appear here with all access details — IP, root credentials, control panel, and renewal reminders.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild className="bg-gradient-brand text-white">
          <Link to="/hosting">Explore hosting plans</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/portal/tickets">Open a ticket</Link>
        </Button>
      </div>
    </div>
  );
}

function VpsCard({ vps, waNumber }: { vps: VpsRow; waNumber: string }) {
  const m = vps.metadata ?? {};
  const [showPw, setShowPw] = useState(false);
  const [showPanelPw, setShowPanelPw] = useState(false);
  const [renewOpen, setRenewOpen] = useState(false);
  const renewal = daysUntil(vps.due_at);
  const sshCmd = m.ip_address ? `ssh -p ${m.ssh_port || "22"} ${m.root_user || "root"}@${m.ip_address}` : "";
  const cycleLabel = m.billing_cycle ? CYCLE_LABEL[m.billing_cycle] : null;

  function requestAction(action: string) {
    const text = `Hello Infiniforge NOC 👋%0A%0AI'd like to ${action} my VPS:%0A• Label: ${vps.title}%0A• Hostname: ${m.hostname || "—"}%0A• IP: ${m.ip_address || "—"}%0A%0APlease confirm and proceed.`;
    if (waNumber) {
      window.open(buildWhatsAppLink(waNumber, decodeURIComponent(text)), "_blank", "noopener,noreferrer");
    } else {
      toast.info("Reach us via Support Tickets — WhatsApp number not configured yet.");
    }
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur shadow-lg ring-1",
      statusRing(vps.status),
    )}>
      {/* Top strip */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-border bg-background/40 px-3 sm:px-5 py-3">
        <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", statusDot(vps.status))} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">{vps.title}</h3>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{vps.status}</Badge>
            {m.plan && <Badge variant="outline" className="text-[10px]">{m.plan}</Badge>}
            {cycleLabel && <Badge variant="outline" className="text-[10px]">{cycleLabel}</Badge>}
            {m.auto_renew && <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Auto-renew</Badge>}
          </div>
          {vps.subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{vps.subtitle}</p>}
        </div>
        {renewal != null && (
          <div className={cn(
            "text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full border font-medium inline-flex items-center gap-1.5 shrink-0",
            renewal < 0 ? "border-rose-500/40 text-rose-500 bg-rose-500/10" :
            renewal <= 7 ? "border-amber-500/40 text-amber-500 bg-amber-500/10 animate-pulse" :
            "border-emerald-500/40 text-emerald-500 bg-emerald-500/10",
          )}>
            <Clock className="h-3 w-3" />
            {renewal < 0 ? `Expired ${Math.abs(renewal)}d ago` : `${renewal}d left`}
          </div>
        )}
      </div>

      {/* Billing strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/30 px-3 sm:px-5 py-2.5">
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          {vps.amount_inr ? (
            <span>
              <span className="text-foreground font-semibold">₹{Number(vps.amount_inr).toLocaleString("en-IN")}</span>
              {m.billing_cycle && m.billing_cycle !== "one_time" ? ` / ${m.billing_cycle}` : ""}
            </span>
          ) : null}
          {vps.due_at && <span>Next renewal · <span className="text-foreground">{vps.due_at.slice(0, 10)}</span></span>}
          {m.last_invoice_number && (
            <Link to="/portal/orders" className="text-primary hover:underline inline-flex items-center gap-1">
              <FileText className="h-3 w-3" /> {m.last_invoice_number}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <AutoRenewToggle vps={vps} />
          <Button size="sm" onClick={() => setRenewOpen(true)} className="bg-gradient-brand text-white">
            <RotateCw className="h-3.5 w-3.5 mr-1.5" /> Renew
          </Button>
        </div>
      </div>

      <RenewDialog vps={vps} open={renewOpen} onOpenChange={setRenewOpen} />


      {/* Spec strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-border">
        <Spec icon={Cpu} label="vCPU" value={m.cpu_cores ? `${m.cpu_cores} cores` : "—"} />
        <Spec icon={HardDrive} label="RAM" value={m.ram_gb ? `${m.ram_gb} GB` : "—"} />
        <Spec icon={HardDrive} label="SSD" value={m.storage_gb ? `${m.storage_gb} GB` : "—"} />
        <Spec icon={Wifi} label="Bandwidth" value={m.bandwidth_gb ? `${m.bandwidth_gb} GB` : "—"} />
      </div>

      <Tabs defaultValue="overview" className="px-3 sm:px-5 pt-4 pb-5">
        <TabsList className="grid grid-cols-4 w-full h-auto">
          <TabsTrigger value="overview" className="text-[11px] sm:text-sm px-1 sm:px-3">Overview</TabsTrigger>
          <TabsTrigger value="access" className="text-[11px] sm:text-sm px-1 sm:px-3">Access</TabsTrigger>
          <TabsTrigger value="panel" className="text-[11px] sm:text-sm px-1 sm:px-3">Panel</TabsTrigger>
          <TabsTrigger value="support" className="text-[11px] sm:text-sm px-1 sm:px-3">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Info icon={Globe} label="Hostname" value={m.hostname || "—"} copyable />
            <Info icon={MapPin} label="Datacenter" value={m.datacenter || "—"} />
            <Info icon={Server} label="Operating System" value={m.os || "—"} />
            <Info icon={ShieldCheck} label="Provisioned" value={m.provisioned_at || vps.created_at.slice(0, 10)} />
          </div>
          {m.notes && (
            <div className="rounded-xl bg-muted/40 border border-border p-3 text-sm text-muted-foreground">
              <div className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1">Notes from your NOC</div>
              {m.notes}
            </div>
          )}
        </TabsContent>

        <TabsContent value="access" className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Info icon={Globe} label="IPv4 Address" value={m.ip_address || "—"} copyable mono />
            {m.ipv6 && <Info icon={Globe} label="IPv6" value={m.ipv6} copyable mono />}
            <Info icon={Terminal} label="SSH Port" value={m.ssh_port || "22"} mono />
            <Info icon={KeyRound} label="SSH User" value={m.root_user || "root"} mono />
          </div>
          {m.root_password && (
            <div className="rounded-xl border border-border bg-background/50 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Root password</div>
                  <div className="font-mono text-sm truncate">
                    {showPw ? m.root_password : "•".repeat(Math.min(m.root_password.length, 14))}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button size="icon" variant="ghost" onClick={() => setShowPw((v) => !v)}>
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => copy(m.root_password!, "Password")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          {sshCmd && (
            <div className="rounded-xl border border-border bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400">Quick SSH</div>
                  <code className="font-mono text-sm block truncate">{sshCmd}</code>
                </div>
                <Button size="sm" variant="secondary" onClick={() => copy(sshCmd, "SSH command")}>
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="panel" className="mt-4 space-y-3">
          {m.panel_url ? (
            <>
              <div className="rounded-xl border border-border bg-background/50 p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Control panel</div>
                  <a href={m.panel_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all">
                    {m.panel_url}
                  </a>
                </div>
                <Button asChild size="sm" className="bg-gradient-brand text-white">
                  <a href={m.panel_url} target="_blank" rel="noopener noreferrer">
                    Open <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {m.panel_user && <Info icon={KeyRound} label="Username" value={m.panel_user} copyable mono />}
                {m.panel_password && (
                  <div className="rounded-xl border border-border bg-background/50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Password</div>
                        <div className="font-mono text-sm truncate">
                          {showPanelPw ? m.panel_password : "•".repeat(Math.min(m.panel_password.length, 14))}
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="icon" variant="ghost" onClick={() => setShowPanelPw((v) => !v)}>
                          {showPanelPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => copy(m.panel_password!, "Password")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground py-4">No control panel configured for this VPS.</div>
          )}
        </TabsContent>

        <TabsContent value="support" className="mt-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <ActionButton icon={Power} label="Request reboot" onClick={() => requestAction("reboot")} />
            <ActionButton icon={RefreshCcw} label="Reinstall OS" onClick={() => requestAction("reinstall OS on")} />
            <ActionButton icon={Activity} label="Check status" onClick={() => requestAction("check status of")} />
            <ActionButton icon={MessageCircle} label="Chat on WhatsApp" onClick={() => requestAction("get support for")} />
          </div>
          <Button asChild variant="outline" className="mt-3 w-full sm:w-auto">
            <Link to="/portal/tickets">
              <LifeBuoy className="h-4 w-4 mr-2" /> Open support ticket
            </Link>
          </Button>
        </TabsContent>
      </Tabs>

      {vps.amount_inr ? (
        <div className="border-t border-border bg-background/40 px-5 py-2.5 text-xs text-muted-foreground flex items-center justify-between">
          <span>Monthly cost</span>
          <span className="font-semibold text-foreground">₹{Number(vps.amount_inr).toLocaleString("en-IN")}</span>
        </div>
      ) : null}
    </div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Info({ icon: Icon, label, value, copyable, mono }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; copyable?: boolean; mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className={cn("truncate text-sm", mono && "font-mono")}>{value}</span>
        {copyable && value !== "—" && (
          <button
            type="button"
            onClick={() => copy(value, label)}
            className="text-muted-foreground hover:text-foreground shrink-0"
            aria-label={`Copy ${label}`}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick} className="justify-start">
      <Icon className="h-4 w-4 mr-2 text-primary" /> {label}
    </Button>
  );
}

// ============ Expiry banner ============
function ExpiryAlertBanner({ rows }: { rows: VpsRow[] }) {
  const alerts = useMemo(() => {
    return rows
      .map((r) => ({ r, d: daysUntil(r.due_at) }))
      .filter((x) => x.d != null && x.d <= 7)
      .sort((a, b) => (a.d ?? 0) - (b.d ?? 0));
  }, [rows]);
  if (alerts.length === 0) return null;
  const worst = alerts[0].d ?? 0;
  const expired = worst < 0;
  return (
    <div className={cn(
      "rounded-2xl border p-4 sm:p-5 flex flex-wrap items-start gap-4",
      expired
        ? "border-rose-500/40 bg-rose-500/10"
        : "border-amber-500/40 bg-amber-500/10",
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
          {alerts.slice(0, 4).map(({ r, d }) => (
            <li key={r.id} className="truncate">
              <span className="font-medium text-foreground">{r.title}</span> —{" "}
              {d! < 0 ? `expired ${Math.abs(d!)}d ago` : d === 0 ? "expires today" : `${d}d left`}
              {r.due_at && <span className="ml-1">· {r.due_at.slice(0, 10)}</span>}
            </li>
          ))}
        </ul>
      </div>
      <Button asChild size="sm" className="bg-gradient-brand text-white shrink-0">
        <Link to="/portal/orders">
          <FileText className="h-4 w-4 mr-1.5" /> View invoices
        </Link>
      </Button>
    </div>
  );
}

// ============ Renew dialog ============
function RenewDialog({
  vps, open, onOpenChange,
}: { vps: VpsRow; open: boolean; onOpenChange: (v: boolean) => void }) {
  const qc = useQueryClient();
  const { user, profile } = useAuth();
  const m = vps.metadata ?? {};
  const [cycle, setCycle] = useState<BillingCycle>(m.billing_cycle ?? "monthly");
  const [method, setMethod] = useState<PaymentMethod>("razorpay");
  const amount = Number(vps.amount_inr ?? 0);
  const gstPct = Number(m.gst_percent ?? 18);
  const months = CYCLE_MONTHS[cycle] || 1;
  const cycleAmount = amount * (months || 1);
  const totals = computeTotals(cycleAmount, gstPct);
  const nextDue = addMonthsISO(vps.due_at, months || 1);

  const renew = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in again.");
      if (cycleAmount <= 0) throw new Error("This VPS has no billing amount set — contact support.");
      const order = await createVpsOrder({
        customerId: user.id,
        customerName: profile?.full_name ?? null,
        customerEmail: profile?.email ?? user.email ?? null,
        vpsTitle: vps.title,
        plan: m.plan,
        hostname: m.hostname,
        amountInr: cycleAmount,
        gstPercent: gstPct,
        billingCycle: cycle,
        paymentMethod: method,
        notes: `Renewal for ${vps.title} (${CYCLE_LABEL[cycle]})`,
      });
      if (method === "wallet") {
        try {
          await debitWalletForOrder({
            customerId: user.id,
            amount: Number(order.total_inr),
            orderId: order.id,
            description: `VPS renewal — ${vps.title} (${order.invoice_number || order.order_number})`,
          });
        } catch (e) {
          await supabase.from("orders").update({ status: "pending", paid_at: null, payment_method: "razorpay" }).eq("id", order.id);
          throw e;
        }
      }
      // Extend due date only when marked paid at creation
      const shouldExtend = method === "wallet";
      if (shouldExtend) {
        const meta = { ...(m ?? {}), billing_cycle: cycle, last_invoice_id: order.id, last_invoice_number: order.invoice_number || order.order_number };
        await supabase.from("module_records").update({ due_at: nextDue, metadata: meta as never }).eq("id", vps.id);
      }
      await notifyCustomerVps({
        customerId: user.id,
        title: shouldExtend ? "VPS renewed" : "Renewal invoice created",
        body: shouldExtend
          ? `${vps.title} has been renewed until ${nextDue.slice(0, 10)} for ₹${totals.total.toLocaleString("en-IN")}.`
          : `Invoice ${order.invoice_number || order.order_number} for ₹${totals.total.toLocaleString("en-IN")} is waiting for payment.`,
        href: shouldExtend ? "/portal/vps" : "/portal/orders",
      });
      return { paid: shouldExtend, invoice: order.invoice_number || order.order_number };
    },
    onSuccess: (res) => {
      toast.success(res.paid ? `VPS renewed · ${res.invoice}` : `Invoice ${res.invoice} created — pay to activate renewal`);
      onOpenChange(false);
      qc.invalidateQueries({ queryKey: ["portal-vps"] });
      qc.invalidateQueries({ queryKey: ["portal-orders"] });
      qc.invalidateQueries({ queryKey: ["portal-vps-dash"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Renew {vps.title}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs mb-1.5 block">Billing cycle</Label>
            <Select value={cycle} onValueChange={(v) => setCycle(v as BillingCycle)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["monthly", "quarterly", "yearly"] as BillingCycle[]).map((c) => (
                  <SelectItem key={c} value={c}>{CYCLE_LABEL[c]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Payment method</Label>
            <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="razorpay">{PAYMENT_METHOD_LABEL.razorpay}</SelectItem>
                <SelectItem value="wallet">{PAYMENT_METHOD_LABEL.wallet}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs space-y-1">
            <Row label={`Base × ${months}mo`} value={`₹${totals.base.toLocaleString("en-IN")}`} />
            <Row label={`GST ${gstPct}%`} value={`₹${totals.gst.toLocaleString("en-IN")}`} />
            <div className="border-t border-border pt-1 flex justify-between font-semibold text-foreground">
              <span>Total</span><span>₹{totals.total.toLocaleString("en-IN")}</span>
            </div>
            <div className="text-muted-foreground pt-1">Next renewal: {nextDue.slice(0, 10)}</div>
          </div>
          {method === "razorpay" && (
            <p className="text-xs text-muted-foreground">
              An invoice will be created in your Orders. Pay it to complete the renewal — your VPS renewal date will update once payment is confirmed.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => renew.mutate()} disabled={renew.isPending} className="bg-gradient-brand text-white">
            {renew.isPending ? "Processing…" : method === "wallet" ? "Pay from wallet & renew" : "Create renewal invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>;
}

// ============ Auto-renew toggle for a card ============
function AutoRenewToggle({ vps }: { vps: VpsRow }) {
  const qc = useQueryClient();
  const m = vps.metadata ?? {};
  const mut = useMutation({
    mutationFn: async (v: boolean) => {
      const meta = { ...(m ?? {}), auto_renew: v };
      const { error } = await supabase.from("module_records").update({ metadata: meta as never }).eq("id", vps.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Auto-renew updated");
      qc.invalidateQueries({ queryKey: ["portal-vps"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs text-muted-foreground">Auto-renew</Label>
      <Switch checked={!!m.auto_renew} onCheckedChange={(v) => mut.mutate(v)} disabled={mut.isPending} />
    </div>
  );
}
