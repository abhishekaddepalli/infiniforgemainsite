import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: DashboardRedirect,
});

function DashboardRedirect() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth" }); return; }

    const staff = ["super_admin", "admin", "sales_manager", "support", "finance", "employee"] as const;
    if (roles.some((r) => (staff as readonly string[]).includes(r))) {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/portal" });
    }
  }, [user, roles, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/40">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center animate-pulse mb-3">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
      </div>
    </div>
  );
}
