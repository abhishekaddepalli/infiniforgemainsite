import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Handshake, Copy, ArrowLeft, MousePointerClick, TrendingUp, Wallet, Download,
  FileText, ExternalLink, BadgeCheck, Send, Sparkles, Target, ShieldCheck,
  Rocket, CheckCircle2, Clock, XCircle, MessageSquare, Mail, Share2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/catalog";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/affiliate")({
  head: () => ({ meta: [{ title: "Affiliate — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: AffiliatePage,
});

const DEFAULT_COMMISSION = 15;

function AffiliatePage() {
  const { user, profile, roles, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  const isAffiliate = roles.includes("affiliate");

  const { data: application } = useQuery({
    queryKey: ["aff-application", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("module_records").select("*")
        .eq("module", "affiliate_applications").eq("customer_id", user!.id)
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
  });

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading…</div>;

  if (isAffiliate) return <AffiliateDashboard />;
  if (application?.status === "pending") return <PendingCard application={application} />;
  if (application?.status === "denied") return <DeniedCard application={{ metadata: (application.metadata as Record<string, unknown>) ?? {} }} onReapply={() => qc.invalidateQueries({ queryKey: ["aff-application"] })} />;
  return <ApplyCard onSubmitted={() => qc.invalidateQueries({ queryKey: ["aff-application"] })} profile={profile} userEmail={user.email ?? ""} />;
}

/* ---------------- Apply ---------------- */

function ApplyCard({ onSubmitted, profile, userEmail }: { onSubmitted: () => void; profile: { full_name?: string | null } | null; userEmail: string }) {
  const { user } = useAuth();
  const [audience, setAudience] = useState("");
  const [channels, setChannels] = useState("");
  const [website, setWebsite] = useState("");
  const [social, setSocial] = useState("");
  const [experience, setExperience] = useState("");
  const [expected, setExpected] = useState("");
  const [payout, setPayout] = useState("UPI");
  const [payoutId, setPayoutId] = useState("");

  const submit = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (!audience || !channels) throw new Error("Tell us about your audience and channels");
      const { error } = await supabase.from("module_records").insert({
        module: "affiliate_applications",
        customer_id: user.id,
        title: profile?.full_name ?? userEmail,
        subtitle: `Applied ${new Date().toLocaleDateString("en-IN")}`,
        status: "pending",
        amount_inr: 0,
        tags: ["application"],
        metadata: {
          email: userEmail, audience, channels, website, social,
          experience, expected_monthly_referrals: expected,
          payout_method: payout, payout_identifier: payoutId,
        },
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Application submitted — we'll review within 48 hours"); onSubmitted(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto max-w-5xl px-4 lg:px-6 py-8 space-y-8">
        <Button variant="ghost" size="sm" asChild className="w-fit"><Link to="/portal"><ArrowLeft className="h-4 w-4 mr-1.5" /> Portal</Link></Button>

        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 lg:p-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <Badge variant="secondary" className="mb-3"><Sparkles className="h-3 w-3 mr-1" /> Partner Program</Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Earn up to <span className="text-primary">30%</span> lifetime commission</h1>
            <p className="text-sm lg:text-base text-muted-foreground mt-2 max-w-2xl">
              Join the Infiniforge Affiliate Program. Refer businesses to our cloud, hosting, SaaS and IT services — earn recurring commissions on every paid customer, forever.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Perk icon={Target} title="Category-based rates" desc="Higher % on hosting, licenses & SaaS" />
              <Perk icon={ShieldCheck} title="Lifetime tracking" desc="Cookie-less, first-touch attribution" />
              <Perk icon={Rocket} title="Marketing kit" desc="Ready templates, banners & pitch decks" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-1"><Handshake className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Apply to become an affiliate</h2></div>
          <p className="text-sm text-muted-foreground mb-6">Tell us how you'll promote Infiniforge. Approval usually within 48 hours.</p>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Primary audience *"><Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Indian SMB owners, developers, agencies" /></Field>
            <Field label="Promotion channels *"><Input value={channels} onChange={(e) => setChannels(e.target.value)} placeholder="YouTube, Blog, WhatsApp, Instagram…" /></Field>
            <Field label="Website / Blog"><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" /></Field>
            <Field label="Social handles"><Input value={social} onChange={(e) => setSocial(e.target.value)} placeholder="@handle, links…" /></Field>
            <Field label="Expected monthly referrals"><Input value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="e.g. 20-50" /></Field>
            <Field label="Preferred payout">
              <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={payout} onChange={(e) => setPayout(e.target.value)}>
                <option>UPI</option><option>Bank Transfer</option><option>Wallet Credit</option>
              </select>
            </Field>
            <Field label="UPI ID / Account number"><Input value={payoutId} onChange={(e) => setPayoutId(e.target.value)} placeholder="you@upi or account no." /></Field>
            <div className="md:col-span-2">
              <Field label="Why should we partner with you?"><Textarea rows={4} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Tell us about your experience, past partnerships, content strategy…" /></Field>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-muted-foreground">By applying you agree to our <a href="https://docs.infiniforge.cloud/affiliates" target="_blank" rel="noreferrer" className="text-primary hover:underline">Affiliate Terms</a>.</p>
            <Button size="lg" onClick={() => submit.mutate()} disabled={submit.isPending}>
              {submit.isPending ? "Submitting…" : "Submit application"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs font-medium">{label}</Label>{children}</div>;
}
function Perk({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 backdrop-blur p-4">
      <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center mb-2"><Icon className="h-4 w-4 text-primary" /></div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
    </div>
  );
}

/* ---------------- Pending / Denied ---------------- */

function PendingCard({ application }: { application: { created_at: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/40 px-4">
      <div className="max-w-md w-full rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-4"><Clock className="h-7 w-7 text-amber-500" /></div>
        <h1 className="text-xl font-bold">Application under review</h1>
        <p className="text-sm text-muted-foreground mt-2">Submitted on {new Date(application.created_at).toLocaleDateString("en-IN")}. Our team typically approves within 48 hours — we'll notify you by email.</p>
        <Button variant="outline" className="mt-5" asChild><Link to="/portal">Back to portal</Link></Button>
      </div>
    </div>
  );
}

function DeniedCard({ application, onReapply }: { application: { metadata: Record<string, unknown> }; onReapply: () => void }) {
  const reason = (application.metadata?.denial_reason as string) ?? "Please contact support for details.";
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/40 px-4">
      <div className="max-w-md w-full rounded-2xl border border-rose-500/30 bg-rose-500/[0.04] p-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-500/15 flex items-center justify-center mb-4"><XCircle className="h-7 w-7 text-rose-500" /></div>
        <h1 className="text-xl font-bold">Application not approved</h1>
        <p className="text-sm text-muted-foreground mt-2">{reason}</p>
        <div className="mt-5 flex gap-2 justify-center">
          <Button variant="outline" asChild><Link to="/portal">Back</Link></Button>
          <Button onClick={onReapply}>Reapply</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

function AffiliateDashboard() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const affiliateCode = user?.id.slice(0, 8).toUpperCase() ?? "";
  const affLink = typeof window !== "undefined" ? `${window.location.origin}/?aff=${affiliateCode}` : `/?aff=${affiliateCode}`;

  const { data: conversions = [] } = useQuery({
    queryKey: ["aff-conversions", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("module_records").select("*")
      .eq("module", "affiliates").eq("customer_id", user!.id)
      .order("created_at", { ascending: false })).data ?? [],
  });

  const { data: wallet } = useQuery({
    queryKey: ["aff-wallet", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("wallets").select("*").eq("user_id", user!.id).maybeSingle()).data,
  });

  const { data: rules = [] } = useQuery({
    queryKey: ["aff-rules"],
    queryFn: async () => (await supabase.from("module_records").select("*")
      .eq("module", "affiliate_rules").eq("status", "active")
      .order("amount_inr", { ascending: false })).data ?? [],
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["aff-templates"],
    queryFn: async () => (await supabase.from("module_records").select("*")
      .eq("module", "affiliate_templates").eq("status", "active")
      .order("created_at", { ascending: false })).data ?? [],
  });

  const stats = useMemo(() => {
    const clicks = conversions.filter((c) => c.tags?.includes("click")).length;
    const paid = conversions.filter((c) => c.status === "paid" || c.status === "converted");
    const pending = conversions.filter((c) => c.status === "pending");
    return {
      clicks, conversions: paid.length,
      commissionEarned: paid.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0),
      commissionPending: pending.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0),
    };
  }, [conversions]);

  const requestPayout = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (stats.commissionEarned < 1000) throw new Error("Minimum payout is ₹1,000");
      const { error } = await supabase.from("tickets").insert({
        customer_id: user.id,
        subject: `Affiliate payout — ${formatINR(stats.commissionEarned)}`,
        description: `Affiliate ${affiliateCode} requesting payout of ${formatINR(stats.commissionEarned)}.`,
        status: "open", priority: "high", department: "billing",
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Payout request submitted"); qc.invalidateQueries({ queryKey: ["portal-tickets"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  function copy(text: string, label = "Copied") { navigator.clipboard?.writeText(text).then(() => toast.success(label)).catch(() => {}); }

  function renderTemplate(body: string) {
    return body.replace(/\{\{link\}\}/g, affLink).replace(/\{\{code\}\}/g, affiliateCode).replace(/\{\{name\}\}/g, profile?.full_name ?? "");
  }

  function shareTemplate(body: string, channel: "whatsapp" | "email" | "copy") {
    const msg = renderTemplate(body);
    if (channel === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    else if (channel === "email") window.location.href = `mailto:?subject=${encodeURIComponent("Try Infiniforge")}&body=${encodeURIComponent(msg)}`;
    else copy(msg, "Copied to clipboard");
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-8 space-y-8">
        <Button variant="ghost" size="sm" asChild className="w-fit"><Link to="/portal"><ArrowLeft className="h-4 w-4 mr-1.5" /> Portal</Link></Button>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <Badge variant="secondary" className="mb-2 inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Affiliate Partner</Badge>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2 truncate"><Handshake className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" /> <span className="truncate">Affiliate dashboard</span></h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Track clicks, conversions, commissions and share marketing templates.</p>
          </div>
          <Button size="sm" className="shrink-0 sm:size-default" onClick={() => requestPayout.mutate()} disabled={requestPayout.isPending || stats.commissionEarned < 1000}>
            <Send className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Request payout</span>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={MousePointerClick} label="Clicks" value={String(stats.clicks)} />
          <Stat icon={TrendingUp} label="Conversions" value={String(stats.conversions)} />
          <Stat icon={Wallet} label="Commission earned" value={formatINR(stats.commissionEarned)} accent />
          <Stat icon={Clock} label="Pending" value={formatINR(stats.commissionPending)} />
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[240px]">
              <div className="text-sm font-semibold">Your affiliate link</div>
              <p className="text-xs text-muted-foreground mt-0.5">Cookie-less lifetime attribution. Every paid signup earns commission.</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <code className="flex-1 min-w-[240px] text-xs font-mono bg-background rounded-lg px-3 py-2.5 border border-border truncate">{affLink}</code>
                <Button size="sm" variant="outline" onClick={() => copy(affLink, "Link copied")}><Copy className="h-3.5 w-3.5 mr-1.5" /> Copy</Button>
                <Button size="sm" variant="outline" onClick={() => shareTemplate(`Check out Infiniforge — cloud, hosting & SaaS: ${affLink}`, "whatsapp")}><MessageSquare className="h-3.5 w-3.5 mr-1.5" /> WhatsApp</Button>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Code: <b className="font-mono text-foreground">{affiliateCode}</b></div>
            </div>
            <div className="rounded-xl border border-border bg-background p-4 min-w-[200px]">
              <div className="text-xs text-muted-foreground">Wallet balance</div>
              <div className="text-2xl font-bold mt-1">{formatINR(Number(wallet?.balance_inr ?? 0))}</div>
              <Button variant="ghost" size="sm" className="mt-2 w-full" asChild><Link to="/portal/wallet">Manage</Link></Button>
            </div>
          </div>
        </div>

        {/* Commission rules */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="text-base font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Commission rates</div>
            <div className="text-xs text-muted-foreground">Category / product-specific rates set by admin.</div>
          </div>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {rules.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground col-span-full text-center">Default: <b className="text-foreground">{DEFAULT_COMMISSION}%</b> on all paid orders.</div>
            ) : rules.map((r) => (
              <div key={r.id} className="p-4">
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="text-[11px] text-muted-foreground">{r.subtitle}</div>
                <div className="mt-2 text-xl font-bold text-primary">{Number(r.amount_inr ?? 0)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* History */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-5 border-b border-border">
              <div className="text-base font-semibold">Conversion history</div>
              <div className="text-xs text-muted-foreground">All tracked clicks, signups and paid conversions</div>
            </div>
            {conversions.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                <MousePointerClick className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No activity yet. Share your link to start earning.
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                {conversions.map((c) => (
                  <div key={c.id} className="p-4 flex items-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center"><TrendingUp className="h-4 w-4 text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.title}</div>
                      <div className="text-[11px] text-muted-foreground">{c.subtitle ?? new Date(c.created_at).toLocaleString("en-IN")}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{formatINR(Number(c.amount_inr ?? 0))}</div>
                      <Badge variant="secondary" className="text-[10px] capitalize">{c.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Templates */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-5 border-b border-border">
              <div className="text-base font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Marketing templates</div>
              <div className="text-xs text-muted-foreground">Copy-paste, or share instantly.</div>
            </div>
            <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
              {templates.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-6">No templates yet. Admin can add attractive templates for you to share.</div>
              ) : templates.map((t) => {
                const meta = (t.metadata as Record<string, unknown>) ?? {};
                const body = (meta.body as string) ?? t.subtitle ?? "";
                return (
                <div key={t.id} className="rounded-xl border border-border bg-background/60 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <div className="text-sm font-semibold truncate flex-1">{t.title}</div>
                    <Badge variant="secondary" className="text-[10px] capitalize">{(meta.channel as string) ?? "post"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4">{renderTemplate(body)}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => shareTemplate(body, "copy")}><Copy className="h-3 w-3 mr-1" /> Copy</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => shareTemplate(body, "whatsapp")}><MessageSquare className="h-3 w-3 mr-1" /> WhatsApp</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => shareTemplate(body, "email")}><Mail className="h-3 w-3 mr-1" /> Email</Button>
                  </div>
                </div>
                );
              })}
            </div>
            <div className="border-t border-border p-3">
              <a href="https://docs.infiniforge.cloud/affiliates" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                Affiliate handbook <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${accent ? "bg-primary/15" : "bg-secondary"}`}>
          <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-primary"}`} />
        </div>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
