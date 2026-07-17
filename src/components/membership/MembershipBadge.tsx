import { Crown, Sparkles, Award, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  free: Shield,
  silver: Award,
  gold: Sparkles,
  platinum: Crown,
};

export function MembershipBadge({
  slug,
  name,
  gradientFrom,
  gradientTo,
  className,
  size = "md",
}: {
  slug: string;
  name: string;
  gradientFrom?: string | null;
  gradientTo?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = ICONS[slug] ?? Shield;
  const from = gradientFrom ?? "#64748b";
  const to = gradientTo ?? "#475569";
  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  };
  const icons = { sm: "h-3 w-3", md: "h-3.5 w-3.5", lg: "h-4 w-4" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold text-white shadow-sm tracking-wide uppercase",
        sizes[size],
        className
      )}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <Icon className={icons[size]} />
      {name}
    </span>
  );
}
