import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, ArrowRight, Infinity as InfinityIcon } from "lucide-react";
import { MembershipBadge } from "./MembershipBadge";
import { cn } from "@/lib/utils";

type Tier = {
  slug: string;
  name: string;
  gradient_from?: string | null;
  gradient_to?: string | null;
};

type Membership = {
  starts_at: string;
  expires_at: string | null;
  tier: Tier;
} | null;

function pad(n: number) { return String(n).padStart(2, "0"); }

export function ExpirationBar({ membership, compact = false }: { membership: Membership; compact?: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!membership) return null;

  const isLifetime = !membership.expires_at;
  const start = new Date(membership.starts_at).getTime();
  const end = membership.expires_at ? new Date(membership.expires_at).getTime() : 0;
  const total = Math.max(1, end - start);
  const remaining = Math.max(0, end - now);
  const pct = isLifetime ? 100 : Math.max(0, Math.min(100, (remaining / total) * 100));

  const { color, glow } = useMemo(() => {
    if (isLifetime) return { color: "from-emerald-400 via-teal-400 to-cyan-400", glow: "shadow-[0_0_24px_rgba(16,185,129,0.35)]" };
    if (pct > 50) return { color: "from-emerald-400 via-emerald-500 to-teal-500", glow: "shadow-[0_0_20px_rgba(16,185,129,0.35)]" };
    if (pct > 20) return { color: "from-amber-400 via-orange-500 to-amber-600", glow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]" };
    return { color: "from-red-500 via-rose-500 to-red-600", glow: "shadow-[0_0_24px_rgba(239,68,68,0.5)]" };
  }, [pct, isLifetime]);

  const d = Math.floor(remaining / 86400000);
  const h = Math.floor((remaining % 86400000) / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  const urgent = !isLifetime && pct < 20;
  const expired = !isLifetime && remaining <= 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-secondary/40",
        "border-border/70 backdrop-blur",
        compact ? "p-3" : "p-4 sm:p-5"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <MembershipBadge
            slug={membership.tier.slug}
            name={membership.tier.name}
            gradientFrom={membership.tier.gradient_from}
            gradientTo={membership.tier.gradient_to}
            size={compact ? "md" : "lg"}
          />
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {expired ? "Expired" : isLifetime ? "Lifetime access" : "Time remaining"}
            </div>
            {isLifetime ? (
              <div className="text-base font-bold flex items-center gap-1.5 text-emerald-500">
                <InfinityIcon className="h-4 w-4" /> Never expires
              </div>
            ) : expired ? (
              <div className="text-base font-bold text-red-500">Membership ended</div>
            ) : (
              <div className={cn("font-mono text-base sm:text-lg font-bold tabular-nums", urgent && "text-red-500 animate-pulse")}>
                {d}d {pad(h)}h {pad(m)}m <span className="text-muted-foreground text-sm">{pad(s)}s</span>
              </div>
            )}
          </div>
        </div>
        <Link
          to="/portal/membership"
          className={cn(
            "text-xs font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-full",
            "bg-primary text-primary-foreground hover:opacity-90 transition"
          )}
        >
          {expired || membership.tier.slug === "free" ? "Upgrade" : "Manage"}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {!isLifetime && (
        <>
          <div className="relative h-2.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-1000 ease-out", color, glow)}
              style={{ width: `${pct}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Started {new Date(membership.starts_at).toLocaleDateString()}</span>
            <span className={cn(urgent && "text-red-500 font-semibold")}>
              Expires {new Date(membership.expires_at!).toLocaleString()}
            </span>
          </div>
        </>
      )}

      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}
