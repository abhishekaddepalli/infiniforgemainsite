import { Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const RANK_NAMES: Record<number, string> = { 0: "Free", 1: "Silver", 2: "Gold", 3: "Platinum" };

export function AccessGateOverlay({
  requiredRank,
  userRank,
  reason,
}: {
  requiredRank: number;
  userRank: number;
  reason?: string;
}) {
  if (userRank >= requiredRank) return null;
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-background/85 backdrop-blur-sm p-6 text-center">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg">
        <Lock className="h-6 w-6 text-white" />
      </div>
      <div>
        <div className="text-sm font-bold">Requires {RANK_NAMES[requiredRank] ?? "higher"} membership</div>
        <div className="text-xs text-muted-foreground mt-1">
          {reason ?? `You have ${RANK_NAMES[userRank] ?? "no"} tier. Upgrade to unlock.`}
        </div>
      </div>
      <Button asChild size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <Link to="/portal/membership">Upgrade now</Link>
      </Button>
    </div>
  );
}

export function LockedCardBadge({ requiredRank }: { requiredRank: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
      <Lock className="h-3 w-3" /> {RANK_NAMES[requiredRank] ?? "Premium"}
    </span>
  );
}
