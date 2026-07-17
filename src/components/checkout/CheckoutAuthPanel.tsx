import { useState } from "react";
import { Loader2, LogIn, UserPlus, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Mode = "signin" | "signup" | "guest";

/**
 * Inline auth surface for the checkout page.
 * - signin: existing account
 * - signup: create account with password
 * - guest: enter email → we create the account with a random password and
 *          email a password-setup link (via resetPasswordForEmail).
 * Calls `onAuthenticated` once a session exists so checkout can proceed.
 */
export function CheckoutAuthPanel({
  defaultEmail = "",
  defaultName = "",
  defaultPhone = "",
  onAuthenticated,
}: {
  defaultEmail?: string;
  defaultName?: string;
  defaultPhone?: string;
  onAuthenticated: () => void;
}) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [busy, setBusy] = useState(false);
  const [guestSent, setGuestSent] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error("Enter email and password");
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in — you can complete your order");
      onAuthenticated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || password.length < 8) return toast.error("Password must be at least 8 characters");
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/checkout`,
          data: { full_name: name || undefined, phone: phone || undefined },
        },
      });
      if (error) throw error;
      if (data.session) {
        toast.success("Account created — completing your order");
        onAuthenticated();
      } else {
        toast.success("Check your inbox to verify your email, then return to complete payment.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Enter your email to continue");
    setBusy(true);
    try {
      // Random strong password — user will set their own via reset link.
      const rand = crypto.getRandomValues(new Uint8Array(24));
      const tempPassword = Array.from(rand).map((b) => b.toString(36)).join("") + "Aa1!";
      const { data, error } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/checkout`,
          data: { full_name: name || undefined, phone: phone || undefined },
        },
      });
      // Ignore "already registered" — just send password setup link.
      if (error && !/already|registered|exists/i.test(error.message)) throw error;

      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (data?.session) {
        toast.success("Account created — password setup link sent to your email");
        onAuthenticated();
      } else {
        setGuestSent(true);
        toast.success("Password setup link sent — check your email");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start guest checkout");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-accent/[0.04] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Sign in to complete your order</h3>
        </div>
        <div className="inline-flex rounded-full border border-border bg-background p-0.5 text-xs">
          {(["signin", "signup", "guest"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setGuestSent(false); }}
              className={`px-3 py-1.5 rounded-full transition ${mode === m ? "bg-gradient-brand text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              {m === "signin" ? "Sign in" : m === "signup" ? "Create account" : "Guest checkout"}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        {mode === "signin" && "Use your existing Infiniforge account."}
        {mode === "signup" && "Create a new account — required for order history, wallet & invoices."}
        {mode === "guest" && "Enter your email — we'll create your account and email a link to set your password. Your order will be linked to it."}
      </p>

      {mode === "signin" && (
        <form onSubmit={handleSignIn} className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-1"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="sm:col-span-1"><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <Button type="submit" disabled={busy} className="sm:col-span-2 bg-gradient-brand text-white">
            {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogIn className="h-4 w-4 mr-2" />} Sign in & continue
          </Button>
        </form>
      )}

      {mode === "signup" && (
        <form onSubmit={handleSignUp} className="mt-4 grid gap-3 sm:grid-cols-2">
          <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98xxxxxxxx" /></div>
          <div><Label>Email *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div><Label>Password *</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} placeholder="Min 8 characters" required /></div>
          <Button type="submit" disabled={busy} className="sm:col-span-2 bg-gradient-brand text-white">
            {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />} Create account & continue
          </Button>
        </form>
      )}

      {mode === "guest" && (
        guestSent ? (
          <div className="mt-4 rounded-xl border border-accent/30 bg-accent/[0.06] p-4 flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold">Password setup link sent to {email}</div>
              <p className="text-muted-foreground text-xs mt-1">
                Open the email, set a password, then return here to complete your payment. Your billing details will be pre-filled.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGuest} className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98xxxxxxxx" /></div>
            <div className="sm:col-span-2"><Label>Email *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@company.com" /></div>
            <Button type="submit" disabled={busy} className="sm:col-span-2 bg-gradient-brand text-white">
              {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />} Send password setup link
            </Button>
          </form>
        )
      )}
    </div>
  );
}
