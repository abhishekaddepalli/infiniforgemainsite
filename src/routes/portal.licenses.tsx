import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Zap, Infinity as InfinityIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  KeyRound, Search, Copy, RefreshCw, ShieldCheck, Clock, AlertTriangle,
  Sparkles, ArrowLeft, Building2, Check, Ban, CalendarClock,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatINR } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/licenses")({
  head: () => ({ meta: [{ title: "License Portal — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: LicensesPortal,
});

interface LicenseRecord {
  id: string;
  title: string;
  subtitle: string | null;
  status: string;
  amount_inr: number | null;
  due_at: string | null;
  tags: string[] | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

const BRAND_KEY = "infg_license_brand";

function useBrand() {
  const [brand, setBrand] = useState<{ name: string; color: string }>(() => {
    if (typeof window === "undefined") return { name: "Infiniforge", color: "#FF9933" };
    try {
      const raw = window.localStorage.getItem(BRAND_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { name: "Infiniforge", color: "#FF9933" };
  });
  useEffect(() => {
    try { window.localStorage.setItem(BRAND_KEY, JSON.stringify(brand)); } catch {}
  }, [brand]);
  return [brand, setBrand] as const;
}

function daysUntil(iso: string | null) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function statusTone(s: string) {
  const k = s.toLowerCase();
  if (["active"].includes(k)) return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
  if (["trial"].includes(k)) return "bg-sky-500/15 text-sky-500 border-sky-500/30";
  if (["suspended"].includes(k)) return "bg-amber-500/15 text-amber-500 border-amber-500/30";
  if (["expired", "revoked", "cancelled"].includes(k)) return "bg-rose-500/15 text-rose-500 border-rose-500/30";
  return "bg-primary/15 text-primary border-primary/30";
}

function LicensesPortal() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [brand, setBrand] = useBrand();
  const [brandOpen, setBrandOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [renewFor, setRenewFor] = useState<LicenseRecord | null>(null);
  const [renewNote, setRenewNote] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const isReseller = roles.includes("reseller");

  const { data: licenses = [], isLoading } = useQuery({
    queryKey: ["portal-licenses", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_records")
        .select("*")
        .eq("module", "licenses")
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as LicenseRecord[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return licenses.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      const key = String(l.metadata?.["license_key"] ?? "").toLowerCase();
      const domain = String(l.metadata?.["bound_domain"] ?? "").toLowerCase();
      return l.title.toLowerCase().includes(q) || key.includes(q) || domain.includes(q);
    });
  }, [licenses, search, statusFilter]);

  const kpis = useMemo(() => {
    const active = licenses.filter((l) => l.status === "active").length;
    const trial = licenses.filter((l) => l.status === "trial").length;
    const expiring = licenses.filter((l) => {
      const d = daysUntil(l.due_at);
      return d !== null && d >= 0 && d <= 30 && l.status !== "expired";
    }).length;
    const expired = licenses.filter((l) => l.status === "expired" || l.status === "revoked").length;
    return { active, trial, expiring, expired };
  }, [licenses]);

  const requestRenewal = useMutation({
    mutationFn: async ({ license, note }: { license: LicenseRecord; note: string }) => {
      const licenseKey = String(license.metadata?.["license_key"] ?? "—");
      const description = [
        `License renewal request`,
        `Product: ${license.title}`,
        `Key: ${licenseKey}`,
        `Current status: ${license.status}`,
        license.due_at ? `Expires: ${new Date(license.due_at).toLocaleDateString("en-IN")}` : null,
        "",
        note ? `Customer note:\n${note}` : "Please initiate renewal at earliest.",
      ].filter(Boolean).join("\n");
      const { error } = await supabase.from("tickets").insert({
        customer_id: user!.id,
        subject: `Renewal request — ${license.title}`,
        description,
        department: "sales",
        priority: "high",
        status: "open",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Renewal request submitted", { description: "Our team will contact you shortly." });
      qc.invalidateQueries({ queryKey: ["portal-tickets"] });
      setRenewFor(null);
      setRenewNote("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (loading || !user) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild><Link to="/portal"><ArrowLeft className="h-4 w-4 mr-1.5" /> Portal</Link></Button>
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-border">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: brand.color }}>
                {brand.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">{brand.name}</div>
                <div className="text-[10px] text-muted-foreground">License Portal</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isReseller && (
              <Dialog open={brandOpen} onOpenChange={setBrandOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm"><Building2 className="h-4 w-4 mr-1.5" /> White-label</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>White-label branding</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Brand name</Label>
                      <Input value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} placeholder="Your company" />
                    </div>
                    <div>
                      <Label>Accent colour</Label>
                      <Input type="color" value={brand.color} onChange={(e) => setBrand({ ...brand, color: e.target.value })} className="h-10 w-24 p-1" />
                    </div>
                    <p className="text-xs text-muted-foreground">Applied to your customer-facing licence portal view. Stored locally on your device.</p>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setBrandOpen(false)}><Check className="h-4 w-4 mr-1.5" /> Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button size="sm" variant="ghost" onClick={() => qc.invalidateQueries({ queryKey: ["portal-licenses"] })}>
              <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5" /> Licenses
            </div>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Manage your license keys</h1>
            <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm">
              Activate, monitor and renew software licenses bound to your domains and devices. Request renewal any time — our team will process it within 1 business day.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi label="Active" value={kpis.active} icon={ShieldCheck} tone="text-emerald-500 bg-emerald-500/10" />
          <Kpi label="Trial" value={kpis.trial} icon={Sparkles} tone="text-sky-500 bg-sky-500/10" />
          <Kpi label="Expiring ≤ 30d" value={kpis.expiring} icon={Clock} tone="text-amber-500 bg-amber-500/10" />
          <Kpi label="Expired / Revoked" value={kpis.expired} icon={AlertTriangle} tone="text-rose-500 bg-rose-500/10" />
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="p-4 flex flex-wrap items-center gap-3 border-b border-border">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, key or domain" className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-sm text-muted-foreground">Loading licenses…</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <KeyRound className="h-10 w-10 mx-auto opacity-30 mb-3" />
              <div className="text-sm font-medium">No licenses found</div>
              <p className="text-xs text-muted-foreground mt-1">
                {licenses.length === 0 ? "You don't have any licenses yet. Purchase a product to receive your first key." : "Try changing filters."}
              </p>
              {licenses.length === 0 && (
                <Button size="sm" className="mt-4" asChild><Link to="/products">Browse products</Link></Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((l) => <LicenseRow key={l.id} license={l} onRenew={() => setRenewFor(l)} brandColor={brand.color} />)}
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!renewFor} onOpenChange={(o) => !o && setRenewFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request renewal</DialogTitle></DialogHeader>
          {renewFor && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-secondary/40 p-3 text-sm">
                <div className="font-medium">{renewFor.title}</div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">{String(renewFor.metadata?.["license_key"] ?? "—")}</div>
                {renewFor.due_at && (
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <CalendarClock className="h-3 w-3" /> Expires {new Date(renewFor.due_at).toLocaleDateString("en-IN")}
                  </div>
                )}
              </div>
              <div>
                <Label>Notes for our team (optional)</Label>
                <Textarea value={renewNote} onChange={(e) => setRenewNote(e.target.value)} placeholder="e.g. extend for 1 year, add 5 more seats…" rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenewFor(null)}>Cancel</Button>
            <Button
              onClick={() => renewFor && requestRenewal.mutate({ license: renewFor, note: renewNote })}
              disabled={requestRenewal.isPending}
            >
              {requestRenewal.isPending ? "Submitting…" : (<><RefreshCw className="h-4 w-4 mr-1.5" /> Submit request</>)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Kpi({ label, value, icon: Icon, tone }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; tone: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", tone)}><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

function LicenseRow({ license, onRenew, brandColor }: { license: LicenseRecord; onRenew: () => void; brandColor: string }) {
  const key = String(license.metadata?.["license_key"] ?? "");
  const domain = String(license.metadata?.["bound_domain"] ?? "");
  const tier = String(license.metadata?.["tier"] ?? "");
  const days = daysUntil(license.due_at);
  const expiringSoon = days !== null && days >= 0 && days <= 30 && license.status !== "expired";
  const overdue = days !== null && days < 0;

  const copyKey = async () => {
    if (!key) return toast.error("No key on record");
    try { await navigator.clipboard.writeText(key); toast.success("License key copied"); }
    catch { toast.error("Copy failed"); }
  };

  return (
    <div className="p-5 hover:bg-secondary/20 transition-colors">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: brandColor }}>
          <KeyRound className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-semibold text-[15px]">{license.title}</div>
            <Badge variant="outline" className={cn("capitalize text-[10px]", statusTone(license.status))}>{license.status}</Badge>
            {tier && <Badge variant="outline" className="text-[10px] capitalize">{tier}</Badge>}
            {expiringSoon && <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/30">Expires in {days}d</Badge>}
            {overdue && <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/30">Overdue</Badge>}
          </div>
          {license.subtitle && <div className="text-xs text-muted-foreground mt-0.5">{license.subtitle}</div>}
          <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-muted-foreground shrink-0">Key</span>
              <code className="font-mono text-[11px] bg-secondary rounded px-1.5 py-0.5 truncate flex-1">{key || "—"}</code>
              {key && <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copyKey}><Copy className="h-3 w-3" /></Button>}
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-muted-foreground shrink-0">Bound to</span>
              <span className="truncate">{domain || <em className="text-muted-foreground">unbound</em>}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground shrink-0">Fee</span>
              <span>{license.amount_inr ? formatINR(Number(license.amount_inr)) : "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground shrink-0">Expires</span>
              <span>{license.due_at ? new Date(license.due_at).toLocaleDateString("en-IN") : "Lifetime"}</span>
            </div>
          </div>
          <ExpiryCountdown
            startIso={String(license.metadata?.["issued_at"] ?? license.created_at)}
            endIso={license.due_at}
            status={license.status}
          />

        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(license.status === "expired" || license.status === "suspended" || expiringSoon || overdue) ? (
            <Button size="sm" onClick={onRenew}><RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Request renewal</Button>
          ) : (
            <Button size="sm" variant="outline" onClick={onRenew}><RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Renew</Button>
          )}
          {license.status === "revoked" && (
            <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/30"><Ban className="h-3 w-3 mr-1" /> Revoked</Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function ExpiryCountdown({ startIso, endIso, status }: { startIso: string; endIso: string | null; status: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!endIso) {
    return (
      <div className="mt-3 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 px-3 py-2 flex items-center gap-2">
        <InfinityIcon className="h-4 w-4 text-emerald-500" />
        <div className="text-xs font-semibold text-emerald-500">Lifetime — never expires</div>
      </div>
    );
  }

  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  const total = Math.max(1, end - start);
  const remaining = Math.max(0, end - now);
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
  const expired = remaining <= 0 || status === "expired" || status === "revoked";

  const d = Math.floor(remaining / 86400000);
  const h = Math.floor((remaining % 86400000) / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);

  let barGradient = "from-emerald-400 via-emerald-500 to-teal-500";
  let glow = "shadow-[0_0_18px_rgba(16,185,129,0.35)]";
  let textTone = "text-emerald-500";
  let urgent = false;
  if (expired) {
    barGradient = "from-rose-500 via-red-500 to-rose-600";
    glow = "shadow-[0_0_20px_rgba(244,63,94,0.45)]";
    textTone = "text-rose-500";
  } else if (pct < 20) {
    barGradient = "from-rose-500 via-red-500 to-rose-600";
    glow = "shadow-[0_0_20px_rgba(244,63,94,0.45)]";
    textTone = "text-rose-500";
    urgent = true;
  } else if (pct < 50) {
    barGradient = "from-amber-400 via-orange-500 to-amber-600";
    glow = "shadow-[0_0_18px_rgba(245,158,11,0.4)]";
    textTone = "text-amber-500";
  }

  return (
    <div className="mt-3 rounded-xl border border-border bg-secondary/30 px-3 py-2.5">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          <Clock className="h-3 w-3" />
          {expired ? "Expired" : "Time remaining"}
        </div>
        <div className={cn("font-mono text-xs sm:text-sm font-bold tabular-nums flex items-center gap-1", textTone, urgent && "animate-pulse")}>
          {urgent && <Zap className="h-3 w-3" />}
          {expired ? "00d 00h 00m 00s" : <>{d}d {pad(h)}h {pad(m)}m <span className="opacity-70">{pad(s)}s</span></>}
        </div>
      </div>
      <div className="relative h-2 w-full rounded-full bg-background/70 overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-1000 ease-linear", barGradient, glow)}
          style={{ width: `${expired ? 100 : pct}%` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200%_100%] animate-[licshimmer_2s_linear_infinite]" />
        </div>
      </div>
      <style>{`@keyframes licshimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
    </div>
  );
}
