import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, Mail, Lock, ArrowRight, Shield, User, Phone, Building2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Infiniforge Technologies" },
      { name: "description", content: "Sign in or create your Infiniforge account to manage subscriptions, licenses, hosting and services." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const SETTINGS_LS = "infiniforge.settings";

function useGoogleEnabled(): boolean {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_LS);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.google_auth_enabled === "boolean") setEnabled(s.google_auth_enabled);
      }
    } catch { /* noop */ }
  }, []);
  return enabled;
}

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const googleEnabled = useGoogleEnabled();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-secondary/40">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-dashboard text-white">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center"><Zap className="h-5 w-5" strokeWidth={2.5} /></span>
          <div><div className="font-bold">Infiniforge</div><div className="text-[10px] uppercase tracking-[0.18em] text-white/60">Technologies</div></div>
        </Link>
        <div>
          <h1 className="text-4xl font-bold leading-tight">India's unified enterprise platform for SaaS, IT & AI.</h1>
          <p className="mt-4 text-white/70 max-w-md">Hosting, licenses, subscriptions, wallets, tickets and affiliate — all from one premium control plane.</p>
          <div className="mt-8 grid grid-cols-3 gap-6 text-center">
            <Stat label="Uptime" value="99.99%" />
            <Stat label="Customers" value="8,900+" />
            <Stat label="Data centers" value="7" />
          </div>
        </div>
        <div className="text-xs text-white/50">© {new Date().getFullYear()} Infiniforge Technologies Pvt. Ltd.</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <span className="h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center"><Zap className="h-4 w-4 text-white" strokeWidth={2.5} /></span>
            <span className="font-bold">Infiniforge</span>
          </Link>

          <h2 className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Sign in to your Infiniforge workspace." : "The very first account becomes the Super Admin."}
          </p>

          {googleEnabled && (
            <>
              <Button
                variant="outline"
                className="w-full mt-6 h-11"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
                  if (result.error) { toast.error(result.error.message ?? "Google sign-in failed"); setBusy(false); }
                }}
              >
                <GoogleIcon /> Continue with Google
              </Button>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> or with email <div className="h-px flex-1 bg-border" />
              </div>
            </>
          )}

          <EmailForm mode={mode} busy={busy} setBusy={setBusy} />

          <div className="mt-6 text-sm text-center text-muted-foreground">
            {mode === "signin" ? (
              <>Don't have an account? <button className="text-primary font-medium hover:underline" onClick={() => setMode("signup")}>Sign up</button></>
            ) : (
              <>Already have an account? <button className="text-primary font-medium hover:underline" onClick={() => setMode("signin")}>Sign in</button></>
            )}
          </div>
          <div className="mt-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Shield className="h-3 w-3" /> Protected by TLS 1.3, HIBP checks and optional 2FA
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><div className="text-2xl font-bold">{value}</div><div className="text-[11px] uppercase tracking-wider text-white/50 mt-0.5">{label}</div></div>;
}

function EmailForm({ mode, busy, setBusy }: { mode: "signin" | "signup"; busy: boolean; setBusy: (v: boolean) => void }) {
  const [form, setForm] = useState({
    full_name: "", email: "", password: "", phone: "", company: "",
    address_line1: "", city: "", state: "", postal_code: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const navigate = useNavigate();

  function set<K extends keyof typeof form>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function completeMfa(e: React.FormEvent) {
    e.preventDefault();
    if (!mfaFactorId) return;
    setBusy(true);
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
      if (challenge.error) throw challenge.error;
      const verify = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: challenge.data.id,
        code: otpCode.trim(),
      });
      if (verify.error) throw verify.error;
      toast.success("Signed in");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid 2FA code");
    } finally { setBusy(false); }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data: signUp, error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { emailRedirectTo: `${window.location.origin}/`, data: { full_name: form.full_name } },
        });
        if (error) throw error;
        toast.success("Account created. Signing you in…");
        // Fill profile fields if a session was minted.
        const uid = signUp.user?.id;
        if (uid) {
          await supabase.from("profiles").update({
            full_name: form.full_name.trim() || null,
            phone: form.phone.trim() || null,
            company: form.company.trim() || null,
            address_line1: form.address_line1.trim() || null,
            city: form.city.trim() || null,
            state: form.state.trim() || null,
            postal_code: form.postal_code.trim() || null,
            country: "India",
          }).eq("id", uid);
        }
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;

        // If 2FA (TOTP) is enrolled & verified, aal2 is required.
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
          const { data: factors } = await supabase.auth.mfa.listFactors();
          const totp = factors?.totp?.find((f) => f.status === "verified");
          if (totp) {
            setMfaFactorId(totp.id);
            toast.info("Enter the 6-digit code from your authenticator app");
            return;
          }
        }
        toast.success("Signed in");
        navigate({ to: "/dashboard" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally { setBusy(false); }
  }

  if (mfaFactorId) {
    return (
      <form className="space-y-3 mt-4" onSubmit={completeMfa}>
        <div className="rounded-lg border border-primary/25 bg-primary/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
          <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>Two-step verification is enabled. Open your Google Authenticator (or any TOTP app) and enter the 6-digit code for Infiniforge.</span>
        </div>
        <div>
          <Label htmlFor="mfa">Authenticator code</Label>
          <Input id="mfa" inputMode="numeric" maxLength={6} required value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))} placeholder="123456" className="mt-1.5 tracking-widest text-center text-lg" />
        </div>
        <Button type="submit" disabled={busy || otpCode.length < 6} className="w-full h-11 bg-gradient-brand text-white">
          {busy ? "Verifying…" : "Verify & continue"}
        </Button>
        <button type="button" className="w-full text-xs text-muted-foreground hover:underline" onClick={async () => { await supabase.auth.signOut(); setMfaFactorId(null); setOtpCode(""); }}>
          Use a different account
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-3 mt-2" onSubmit={onSubmit}>
      {mode === "signup" && (
        <>
          <FieldIcon icon={User} label="Full name" required value={form.full_name} onChange={(v) => set("full_name", v)} placeholder="Arjun Sharma" />
          <FieldIcon icon={Phone} label="Mobile number" required value={form.phone} onChange={(v) => set("phone", v)} placeholder="+91 98xxxxxxxx" type="tel" />
          <FieldIcon icon={Building2} label="Company (optional)" value={form.company} onChange={(v) => set("company", v)} placeholder="Acme Pvt Ltd" />
        </>
      )}
      <FieldIcon icon={Mail} label="Email" required type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="you@company.in" />
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          {mode === "signin" && <ForgotLink email={form.email} />}
        </div>
        <div className="relative mt-1.5">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="password" type="password" required minLength={8} value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 8 characters" className="pl-9" />
        </div>
      </div>
      {mode === "signup" && (
        <>
          <FieldIcon icon={MapPin} label="Address" required value={form.address_line1} onChange={(v) => set("address_line1", v)} placeholder="Flat / Street" />
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="City" required value={form.city} onChange={(e) => set("city", e.target.value)} />
            <Input placeholder="State" required value={form.state} onChange={(e) => set("state", e.target.value)} />
            <Input placeholder="PIN" required value={form.postal_code} onChange={(e) => set("postal_code", e.target.value)} />
          </div>
        </>
      )}
      <Button type="submit" disabled={busy} className="w-full h-11 bg-gradient-brand text-white">
        {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"} <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    </form>
  );
}

function FieldIcon({ icon: Icon, label, value, onChange, placeholder, required, type = "text" }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-1.5">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" />
      </div>
    </div>
  );
}

function ForgotLink({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className="text-xs text-primary hover:underline disabled:opacity-50"
      onClick={async () => {
        if (!email) return toast.error("Enter your email above first");
        setBusy(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        setBusy(false);
        if (error) toast.error(error.message);
        else toast.success("Password reset email sent");
      }}
    >Forgot?</button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1Z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.56-2.77c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.29 9.14 5.38 12 5.38Z"/>
    </svg>
  );
}
