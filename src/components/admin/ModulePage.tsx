import { type ReactNode } from "react";
import { type LucideIcon, Sparkles, CheckCircle2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";

export function ModulePage({
  title, subtitle, icon: Icon, features, primaryAction, children,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  features: string[];
  primaryAction?: { label: string; onClick?: () => void };
  children?: ReactNode;
}) {
  return (
    <AdminShell title={title}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>
            </div>
          </div>
          {primaryAction && (
            <Button onClick={primaryAction.onClick} className="bg-gradient-brand text-white">
              <Sparkles className="h-4 w-4 mr-2" /> {primaryAction.label}
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f} className="glass rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>

        {children}

        <div className="glass rounded-2xl p-6 border-dashed">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Module ready
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            This module is wired into the platform. Data models and API endpoints will populate with live activity as your team starts using it. Configure defaults in Settings.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
