import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Server, Cloud, Globe, Lock, Wrench, Activity, Download, RefreshCw, AlertTriangle, IndianRupee, CalendarClock } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadCsv } from "@/lib/download";
import { formatINR } from "@/lib/catalog";

export const Route = createFileRoute("/admin/infrastructure-reports")({
  head: () => ({ meta: [{ title: "Infrastructure Reports — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Infrastructure Reports"><Page /></AdminShell>,
});

type InfraRow = {
  id: string; module: string; title: string; subtitle: string | null;
  status: string; amount_inr: number | null; due_at: string | null;
  tags: string[] | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

const MODULES = [
  { key: "servers", label: "Servers", icon: Server },
  { key: "hosting", label: "Hosting", icon: Cloud },
  { key: "domains", label: "Domains", icon: Globe },
  { key: "ssl", label: "SSL", icon: Lock },
  { key: "amc", label: "AMC", icon: Wrench },
  { key: "monitoring", label: "Monitoring", icon: Activity },
] as const;

const RANGES = [
  { key: "30", label: "Next 30 days" },
  { key: "60", label: "Next 60 days" },
  { key: "90", label: "Next 90 days" },
  { key: "365", label: "Next 12 months" },
];

function Page() {
  const [range, setRange] = useState("90");
  const { data: rows = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["module_records", "infra-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("module_records")
        .select("id, module, title, subtitle, status, amount_inr, due_at, tags, metadata, created_at")
        .in("module", MODULES.map((m) => m.key))
        .order("due_at", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as unknown as InfraRow[];
    },
  });

  const now = Date.now();
  const horizon = now + Number(range) * 86400_000;

  const byModule = useMemo(() => {
    const map: Record<string, InfraRow[]> = {};
    for (const m of MODULES) map[m.key] = [];
    for (const r of rows) if (map[r.module]) map[r.module].push(r);
    return map;
  }, [rows]);

  const totalSpend = rows.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0);
  const expiring = rows.filter((r) => r.due_at && new Date(r.due_at).getTime() <= horizon && new Date(r.due_at).getTime() >= now);
  const overdue = rows.filter((r) => r.due_at && new Date(r.due_at).getTime() < now);
  const atRisk = rows.filter((r) => ["degraded", "down", "expired", "pending_renewal"].includes(r.status));

  const serverAvg = (k: string) => {
    const s = byModule.servers ?? [];
    if (s.length === 0) return 0;
    const sum = s.reduce((a, r) => a + Number((r.metadata as Record<string, unknown>)?.[k] as number ?? 0), 0);
    return Math.round(sum / s.length);
  };
  const healthyPct = (() => {
    const s = byModule.servers ?? [];
    if (s.length === 0) return 0;
    return Math.round((s.filter((r) => r.status === "healthy").length / s.length) * 1000) / 10;
  })();

  function exportAllCsv() {
    const header = ["module", "title", "status", "amount_inr", "due_at", "tags", "created_at"];
    const data = rows.map((r) => [r.module, r.title, r.status, r.amount_inr ?? "", r.due_at ?? "", (r.tags ?? []).join("|"), r.created_at]);
    downloadCsv([header, ...data], `infrastructure-report-${new Date().toISOString().slice(0, 10)}.csv`);
  }
  function exportExpiringCsv() {
    const header = ["module", "title", "status", "amount_inr", "due_at", "days_left"];
    const data = expiring.map((r) => {
      const daysLeft = Math.max(0, Math.round((new Date(r.due_at!).getTime() - now) / 86400_000));
      return [r.module, r.title, r.status, r.amount_inr ?? "", r.due_at, daysLeft];
    });
    downloadCsv([header, ...data], `infra-expiring-${range}d.csv`);
  }

  return (
      <div className="space-y-6 min-w-0 max-w-full">
       <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Infrastructure reports</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Unified view across servers, hosting, domains, SSL certificates, AMC contracts and monitoring.
            </p>
          </div>
        </div>
         <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>{RANGES.map((r) => <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={"h-4 w-4 mr-2 " + (isFetching ? "animate-spin" : "")} /> Refresh
          </Button>
          <Button variant="outline" onClick={exportExpiringCsv}><Download className="h-4 w-4 mr-2" /> Expiring CSV</Button>
          <Button className="bg-gradient-brand text-white" onClick={exportAllCsv}><Download className="h-4 w-4 mr-2" /> Full CSV</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Kpi icon={Server} label="Infra assets" value={String(rows.length)} sub="tracked records" />
        <Kpi icon={IndianRupee} label="Portfolio value" value={formatINR(totalSpend)} sub="incl. AMC + recurring" tone="brand" />
        <Kpi icon={CalendarClock} label={`Expiring ≤ ${range}d`} value={String(expiring.length)} sub={`${overdue.length} already overdue`} tone="saffron" />
        <Kpi icon={AlertTriangle} label="At-risk records" value={String(atRisk.length)} sub="degraded / expired / renewal" tone="green" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {MODULES.map((m) => {
          const list = byModule[m.key] ?? [];
          const value = list.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0);
          const active = list.filter((r) => ["active", "healthy"].includes(r.status)).length;
          const risk = list.filter((r) => ["expired", "pending_renewal", "degraded", "down"].includes(r.status)).length;
          return (
            <div key={m.key} className="glass rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center"><m.icon className="h-5 w-5 text-primary" /></div>
                <div>
                  <div className="text-sm font-semibold">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{list.length} records</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-emerald-500/10 py-2">
                  <div className="text-xs text-muted-foreground">Active</div>
                  <div className="font-bold text-emerald-600">{active}</div>
                </div>
                <div className="rounded-lg bg-amber-500/10 py-2">
                  <div className="text-xs text-muted-foreground">Risk</div>
                  <div className="font-bold text-amber-600">{risk}</div>
                </div>
                <div className="rounded-lg bg-primary/10 py-2">
                  <div className="text-xs text-muted-foreground">Value</div>
                  <div className="font-bold text-primary text-xs">{formatINR(value)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Server className="h-4 w-4 text-primary" />
            <div className="font-semibold text-sm">Server fleet health</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Healthy nodes" value={`${healthyPct}%`} />
            <Metric label="Avg CPU" value={`${serverAvg("cpu_pct")}%`} />
            <Metric label="Avg Memory" value={`${serverAvg("mem_pct")}%`} />
            <Metric label="Avg Disk" value={`${serverAvg("disk_pct")}%`} />
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /><div className="font-semibold text-sm">Upcoming renewals</div></div>
            <Badge variant="outline">{expiring.length} in {range}d</Badge>
          </div>
          {expiring.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">Nothing expiring in this window. 🎉</div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {expiring.slice(0, 12).map((r) => {
                const days = Math.max(0, Math.round((new Date(r.due_at!).getTime() - now) / 86400_000));
                return (
                  <div key={r.id} className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{r.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">{r.module} · {r.status}</div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="text-xs">{new Date(r.due_at!).toLocaleDateString("en-IN")}</div>
                      <Badge variant="outline" className={days <= 7 ? "bg-rose-500/15 text-rose-600 border-rose-500/30" : days <= 30 ? "bg-amber-500/15 text-amber-600 border-amber-500/30" : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"}>
                        {days}d
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5 min-w-0">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold text-sm">All infrastructure records</div>
          {isLoading && <span className="text-xs text-muted-foreground">Loading…</span>}
        </div>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="min-w-[680px] w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left py-2 px-2">Module</th>
                <th className="text-left py-2 px-2">Title</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-right py-2 px-2">Value</th>
                <th className="text-left py-2 px-2">Due</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No infrastructure records yet.</td></tr>
              ) : rows.slice(0, 50).map((r) => (
                <tr key={r.id} className="border-b border-border/50">
                  <td className="px-2 py-2 capitalize">{r.module}</td>
                  <td className="px-2 py-2 break-words">{r.title}</td>
                  <td className="px-2 py-2"><Badge variant="outline">{r.status}</Badge></td>
                  <td className="px-2 py-2 text-right tabular-nums">{r.amount_inr ? formatINR(Number(r.amount_inr)) : "—"}</td>
                  <td className="px-2 py-2">{r.due_at ? new Date(r.due_at).toLocaleDateString("en-IN") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > 50 && (
          <div className="text-xs text-muted-foreground mt-2">Showing 50 of {rows.length} — export CSV for full report.</div>
        )}
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, sub, tone }: { icon: typeof Server; label: string; value: string; sub?: string; tone?: "brand" | "green" | "saffron" }) {
  const bg = tone === "green" ? "bg-gradient-green" : tone === "saffron" ? "bg-gradient-saffron" : tone === "brand" ? "bg-gradient-brand" : "bg-secondary";
  const cls = tone ? "text-white" : "text-primary";
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}><Icon className={`h-5 w-5 ${cls}`} /></div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-lg font-bold truncate">{value}</div>
        {sub && <div className="text-[11px] text-muted-foreground truncate">{sub}</div>}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
