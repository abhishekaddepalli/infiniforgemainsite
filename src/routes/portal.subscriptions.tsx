import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, Calendar, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/catalog";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/subscriptions")({
  head: () => ({ meta: [{ title: "My Subscriptions — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: SubsPage,
});

function SubsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);

  const { data: subs } = useQuery({
    queryKey: ["my-subs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("subscriptions").select("*").eq("customer_id", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subscriptions").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Subscription cancelled"); qc.invalidateQueries({ queryKey: ["my-subs"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <Button variant="ghost" size="sm" asChild><Link to="/portal"><ArrowLeft className="h-4 w-4 mr-1.5" /> Portal</Link></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My subscriptions</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your recurring services and renewals.</p>
        </div>

        <div className="grid gap-4">
          {(subs ?? []).length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              <RefreshCw className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No subscriptions yet.</p>
            </div>
          )}
          {(subs ?? []).map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{s.plan}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="h-4 text-[10px]">{s.billing_cycle}</Badge>
                  {s.current_period_end && (
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> renews {new Date(s.current_period_end).toLocaleDateString("en-IN")}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatINR(Number(s.amount_inr))}</div>
                <Badge className={s.status === "active" ? "bg-accent/15 text-accent border-0" : "bg-secondary text-muted-foreground border-0"}>{s.status}</Badge>
              </div>
              {s.status === "active" && (
                <Button size="sm" variant="outline" onClick={() => cancel.mutate(s.id)} disabled={cancel.isPending}>
                  <X className="h-3.5 w-3.5 mr-1" /> Cancel
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
