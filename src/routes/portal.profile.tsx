import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Loader2, User, MapPin, Shield, Save, KeyRound, Smartphone, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { notifyProfileUpdated } from "@/lib/alerts.functions";

export const Route = createFileRoute("/portal/profile")({
  head: () => ({ meta: [{ title: "My Profile — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, loading, refresh } = useAuth();
  const notifyProfile = useServerFn(notifyProfileUpdated);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "", phone: "", company: "", gstin: "",
    address_line1: "", address_line2: "", city: "", state: "",
    postal_code: "", country: "India",
  });

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      company: profile.company ?? "",
      gstin: profile.gstin ?? "",
      address_line1: profile.address_line1 ?? "",
      address_line2: profile.address_line2 ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      postal_code: profile.postal_code ?? "",
      country: profile.country ?? "India",
    });
  }, [profile]);

  function set<K extends keyof typeof form>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function save() {
    if (!user) return;
    if (!form.full_name.trim()) { toast.error("Full name is required"); return; }
    const changed = Object.entries(form)
      .filter(([key, value]) => String(value ?? "").trim() !== String(profile?.[key as keyof typeof form] ?? "").trim())
      .map(([key]) => key.replace(/_/g, " "));
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name.trim() || null,
      phone: form.phone.trim() || null,
      company: form.company.trim() || null,
      gstin: form.gstin.trim().toUpperCase() || null,
      address_line1: form.address_line1.trim() || null,
      address_line2: form.address_line2.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      postal_code: form.postal_code.trim() || null,
      country: form.country.trim() || null,
    }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
    void notifyProfile({ data: { changed } }).catch(() => undefined);
    await refresh();
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-4xl h-full px-4 lg:px-6 flex items-center gap-3">
          <Button size="icon" variant="ghost" asChild><Link to="/portal"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div>
            <div className="font-semibold text-sm">My Profile</div>
            <div className="text-[11px] text-muted-foreground">Billing & contact details for orders and GST invoices</div>
          </div>
          <Button size="sm" className="ml-auto bg-gradient-brand text-white" onClick={save} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : <><Save className="h-4 w-4 mr-2" /> Save changes</>}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 lg:px-6 py-8 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <SectionHeader icon={User} title="Personal information" desc="Used on invoices, order confirmations and support." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name *"><Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} /></Field>
            <Field label="Email"><Input value={user.email ?? ""} disabled /></Field>
            <Field label="Phone number"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98xxxxxxxx" /></Field>
            <Field label="Company (optional)"><Input value={form.company} onChange={(e) => set("company", e.target.value)} /></Field>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <SectionHeader icon={MapPin} title="Billing address" desc="Required for GST-compliant invoicing and product delivery." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2" label="Address line 1"><Input value={form.address_line1} onChange={(e) => set("address_line1", e.target.value)} placeholder="Flat / Building / Street" /></Field>
            <Field className="sm:col-span-2" label="Address line 2"><Input value={form.address_line2} onChange={(e) => set("address_line2", e.target.value)} placeholder="Area / Landmark" /></Field>
            <Field label="City"><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
            <Field label="State"><Input value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="e.g. Karnataka" /></Field>
            <Field label="PIN code"><Input value={form.postal_code} onChange={(e) => set("postal_code", e.target.value)} placeholder="560001" /></Field>
            <Field label="Country"><Input value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <SectionHeader icon={Shield} title="Tax details" desc="Add your GSTIN to receive input-tax-credit-eligible invoices." />
          <Field label="GSTIN (optional)">
            <Input value={form.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} />
          </Field>
          {form.gstin && form.gstin.length !== 15 && (
            <Badge variant="outline" className="text-amber-600 border-amber-500/40">GSTIN must be 15 characters</Badge>
          )}
        </div>

        <PasswordCard />

        <TwoFactorCard />




        <div className="flex justify-end">
          <Button className="bg-gradient-brand text-white h-11 px-6" onClick={save} disabled={saving}>
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : <><Save className="h-4 w-4 mr-2" /> Save changes</>}
          </Button>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-primary" /></div>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function PasswordCard() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  async function change() {
    if (pw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (pw !== confirm) { toast.error("Passwords do not match"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setPw(""); setConfirm("");
    toast.success("Password updated");
  }
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <SectionHeader icon={KeyRound} title="Change password" desc="Choose a strong password. You'll stay signed in on this device." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="New password"><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Min 8 characters" /></Field>
        <Field label="Confirm password"><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></Field>
      </div>
      <div className="flex justify-end">
        <Button onClick={change} disabled={busy || !pw} className="bg-gradient-brand text-white">
          {busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating…</> : <><KeyRound className="h-4 w-4 mr-2" /> Update password</>}
        </Button>
      </div>
    </div>
  );
}

function TwoFactorCard() {
  const [factors, setFactors] = useState<{ id: string; status: string; friendly_name?: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<{ factorId: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setLoading(true);
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors((data?.totp ?? []).map((f) => ({ id: f.id, status: f.status, friendly_name: f.friendly_name })));
    setLoading(false);
  }
  useEffect(() => { void refresh(); }, []);

  const verified = factors.find((f) => f.status === "verified");

  async function startEnroll() {
    setBusy(true);
    try {
      // Clean up any stale unverified factor first.
      const stale = factors.find((f) => f.status === "unverified");
      if (stale) await supabase.auth.mfa.unenroll({ factorId: stale.id });
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Infiniforge Authenticator" });
      if (error) throw error;
      setEnrolling({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start enrolment");
    } finally { setBusy(false); }
  }

  async function verifyEnroll() {
    if (!enrolling) return;
    setBusy(true);
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId: enrolling.factorId });
      if (challenge.error) throw challenge.error;
      const verify = await supabase.auth.mfa.verify({
        factorId: enrolling.factorId, challengeId: challenge.data.id, code: code.trim(),
      });
      if (verify.error) throw verify.error;
      toast.success("Two-step verification enabled");
      setEnrolling(null); setCode("");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid code");
    } finally { setBusy(false); }
  }

  async function disable(factorId: string) {
    if (!confirm("Disable two-step verification? Your account will be less secure.")) return;
    setBusy(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Two-step verification disabled");
    await refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <SectionHeader icon={Smartphone} title="Two-step verification (2FA)" desc="Add a second layer of protection using Google Authenticator, Authy, 1Password or any TOTP app." />
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : verified && !enrolling ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">2FA is active</div>
            <div className="text-xs text-muted-foreground">You'll be asked for a 6-digit code on every sign-in.</div>
          </div>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => disable(verified.id)}>
            <XCircle className="h-4 w-4 mr-1.5" /> Disable
          </Button>
        </div>
      ) : enrolling ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 grid gap-4 sm:grid-cols-[auto_1fr] items-start">
            <div className="rounded-lg bg-white p-2 border border-border" dangerouslySetInnerHTML={{ __html: enrolling.qr }} />
            <div className="space-y-2 min-w-0">
              <div className="text-sm font-semibold">Scan the QR in your authenticator app</div>
              <p className="text-xs text-muted-foreground">Google Authenticator, Microsoft Authenticator, Authy, 1Password — anything that supports TOTP.</p>
              <div className="text-[11px] text-muted-foreground">Can't scan? Enter this secret manually:</div>
              <code className="block break-all text-xs font-mono bg-background border border-border rounded-lg px-2 py-1.5">{enrolling.secret}</code>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
            <Field label="6-digit code from the app">
              <Input inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="123456" className="tracking-widest text-center" />
            </Field>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setEnrolling(null); setCode(""); }}>Cancel</Button>
              <Button className="bg-gradient-brand text-white" onClick={verifyEnroll} disabled={busy || code.length < 6}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & enable"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px] text-sm text-muted-foreground">
            Not enabled. Set up an authenticator app to secure your account with a rotating 6-digit code.
          </div>
          <Button className="bg-gradient-brand text-white" onClick={startEnroll} disabled={busy}>
            <Smartphone className="h-4 w-4 mr-2" /> Enable 2FA
          </Button>
        </div>
      )}
    </div>
  );
}
