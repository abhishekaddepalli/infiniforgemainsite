import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCheck, Search, Check, X, Clock, Handshake, Mail, Globe, Sparkles } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";

export const Route = createFileRoute("/admin/affiliate-applications")({
  head: () => ({ meta: [{ title: "Affiliate Applications — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: AffiliateApplicationsPage,
});

type App = {
  id: string; title: string; subtitle: string | null; status: string;
  customer_id: string | null; created_at: string;
  metadata: Record<string, unknown>;
};

function AffiliateApplicationsPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"pending" | "approved" | "denied" | "all">("pending");
  const [selected, setSelected] = useState<App | null>(null);
  const [denyOpen, setDenyOpen] = useState<App | null>(null);
  const [denyReason, setDenyReason] = useState("");
  const [customCommission, setCustomCommission] = useState("15");
  const [adminNote, setAdminNote] = useState("");

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["aff-apps"],
    queryFn: async () => {
      const { data } = await supabase.from("module_records").select("*")
        .eq("module", "affiliate_applications").order("created_at", { ascending: false });
      return (data ?? []) as App[];
    },
  });

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (tab !== "all" && a.status !== tab) return false;
      if (!q) return true;
      const hay = `${a.title} ${a.subtitle} ${JSON.stringify(a.metadata)}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [apps, q, tab]);

  const counts = useMemo(() => ({
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    denied: apps.filter((a) => a.status === "denied").length,
    all: apps.length,
  }), [apps]);

  const approve = useMutation({
    mutationFn: async ({ app, commission, note }: { app: App; commission: number; note: string }) => {
      if (!app.customer_id) throw new Error("No customer id");
      const { error: rerr } = await supabase.from("user_roles").insert({ user_id: app.customer_id, role: "affiliate" }).select();
      // ignore unique conflict — user might already be affiliate
      if (rerr && !`${rerr.message}`.toLowerCase().includes("duplicate")) throw rerr;
      const { error } = await supabase.from("module_records").update({
        status: "approved",
        amount_inr: commission,
        metadata: { ...(app.metadata ?? {}), approved_at: new Date().toISOString(), commission_percent: commission, admin_note: note },
      }).eq("id", app.id);
      if (error) throw error;
      await logAudit({ action: "role.assign", resource: "roles", target_user_id: app.customer_id, details: { role: "affiliate", commission } });
    },
    onSuccess: () => { toast.success("Affiliate approved"); setSelected(null); qc.invalidateQueries({ queryKey: ["aff-apps"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deny = useMutation({
    mutationFn: async ({ app, reason }: { app: App; reason: string }) => {
      const { error } = await supabase.from("module_records").update({
        status: "denied",
        metadata: { ...(app.metadata ?? {}), denial_reason: reason, denied_at: new Date().toISOString() },
      }).eq("id", app.id);
      if (error) throw error;
      await logAudit({ action: "status.change", resource: "users", target_user_id: app.customer_id, details: { affiliate_denied: true, reason } });
    },
    onSuccess: () => { toast.success("Application denied"); setDenyOpen(null); setDenyReason(""); qc.invalidateQueries({ queryKey: ["aff-apps"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const statusTone = (s: string) => s === "approved" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
    : s === "pending" ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
    : "bg-rose-500/15 text-rose-500 border-rose-500/30";

  return (
    <AdminShell title="Affiliate Applications">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><UserCheck className="h-6 w-6 text-primary" /> Affiliate Applications</h1>
            <p className="text-sm text-muted-foreground mt-1">Review, approve or deny partner applications. Approving assigns the affiliate role automatically.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {([["pending", "Pending", Clock], ["approved", "Approved", Check], ["denied", "Denied", X], ["all", "Total", Sparkles]] as const).map(([k, l, Icon]) => (
            <button key={k} onClick={() => setTab(k as typeof tab)} className={`rounded-xl border p-4 text-left transition ${tab === k ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
              <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{l}</span><Icon className="h-4 w-4 text-primary" /></div>
              <div className="text-2xl font-bold mt-1">{counts[k as keyof typeof counts]}</div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search applicant, channel…" className="pl-9" /></div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {isLoading ? <div className="p-10 text-center text-sm text-muted-foreground">Loading…</div>
          : filtered.length === 0 ? <div className="p-10 text-center text-sm text-muted-foreground">No {tab === "all" ? "" : tab} applications.</div>
          : (
            <div className="divide-y divide-border">
              {filtered.map((a) => (
                <div key={a.id} className="p-4 flex items-center gap-4 hover:bg-secondary/40 cursor-pointer" onClick={() => { setSelected(a); setCustomCommission(String(a.metadata?.commission_percent ?? 15)); setAdminNote((a.metadata?.admin_note as string) ?? ""); }}>
                  <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center"><Handshake className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{a.title}</div>
                    <div className="text-[11px] text-muted-foreground truncate flex items-center gap-2">
                      <Mail className="h-3 w-3" /> {(a.metadata?.email as string) ?? "—"}
                      {(a.metadata?.website as string) && <><Globe className="h-3 w-3 ml-2" /> {a.metadata.website as string}</>}
                    </div>
                  </div>
                  <Badge variant="outline" className={`capitalize ${statusTone(a.status)}`}>{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail dialog */}
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selected && (
              <>
                <DialogHeader><DialogTitle className="flex items-center gap-2"><Handshake className="h-5 w-5 text-primary" /> {selected.title}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    {(["email", "audience", "channels", "website", "social", "experience", "expected_monthly_referrals", "payout_method", "payout_identifier"] as const).map((k) => (
                      <div key={k} className="space-y-0.5">
                        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{k.replace(/_/g, " ")}</div>
                        <div className="text-sm">{(selected.metadata?.[k] as string) || <span className="text-muted-foreground italic">—</span>}</div>
                      </div>
                    ))}
                  </div>

                  {selected.status === "pending" && (
                    <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-4 space-y-3">
                      <div className="text-sm font-semibold">Approval settings</div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div><Label className="text-xs">Commission %</Label><Input type="number" value={customCommission} onChange={(e) => setCustomCommission(e.target.value)} /></div>
                      </div>
                      <div><Label className="text-xs">Internal note (optional)</Label><Textarea rows={2} value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Any custom rules or notes for this partner…" /></div>
                    </div>
                  )}
                </div>
                <DialogFooter className="gap-2">
                  {selected.status === "pending" ? (
                    <>
                      <Button variant="outline" onClick={() => { setDenyOpen(selected); setSelected(null); }}><X className="h-4 w-4 mr-1.5" /> Deny</Button>
                      <Button onClick={() => approve.mutate({ app: selected, commission: Number(customCommission) || 15, note: adminNote })} disabled={approve.isPending}>
                        <Check className="h-4 w-4 mr-1.5" /> Approve & assign role
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Deny reason */}
        <Dialog open={!!denyOpen} onOpenChange={(o) => !o && setDenyOpen(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Deny application</DialogTitle></DialogHeader>
            <div className="space-y-2"><Label className="text-xs">Reason (shown to applicant)</Label>
              <Textarea rows={3} value={denyReason} onChange={(e) => setDenyReason(e.target.value)} placeholder="e.g. Audience doesn't match our target segment." />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDenyOpen(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => denyOpen && deny.mutate({ app: denyOpen, reason: denyReason || "Application not approved." })} disabled={deny.isPending}>Deny</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminShell>
  );
}
