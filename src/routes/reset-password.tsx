import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Infiniforge" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/40 p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-card">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center"><Zap className="h-4 w-4 text-white" strokeWidth={2.5}/></span>
          <span className="font-bold">Infiniforge</span>
        </div>
        <h1 className="text-xl font-bold">Set a new password</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose a strong password with at least 8 characters.</p>
        <form className="mt-5 space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const { error } = await supabase.auth.updateUser({ password: pw });
          setBusy(false);
          if (error) toast.error(error.message);
          else { toast.success("Password updated"); navigate({ to: "/auth" }); }
        }}>
          <div>
            <Label htmlFor="pw">New password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="pw" type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} className="pl-9" />
            </div>
          </div>
          <Button className="w-full bg-gradient-brand text-white" disabled={busy || pw.length < 8}>{busy ? "Updating…" : "Update password"}</Button>
        </form>
      </div>
    </div>
  );
}
