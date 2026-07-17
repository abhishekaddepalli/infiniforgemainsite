import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Megaphone, X, ArrowRight } from "lucide-react";
import { useCms, CmsIcon } from "@/lib/cms";

export function AnnouncementTicker() {
  const cfg = useCms("announcements");
  const [closed, setClosed] = useState(false);
  const items = (cfg.items ?? []).filter((i) => i.enabled !== false);
  if (!cfg.enabled || closed || items.length === 0) return null;

  const speed = Math.max(15, Math.min(cfg.speed_seconds ?? 40, 120));

  // Duplicate content so the marquee loops seamlessly
  const loop = [...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden border-b border-white/20 bg-gradient-to-r from-primary via-primary to-accent text-white"
      role="region"
      aria-label="Site announcements"
    >
      <div className="mx-auto flex max-w-[100vw] items-center gap-3 px-3 py-2 text-white">

        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
          <Megaphone className="h-3.5 w-3.5 animate-pulse" />
          {cfg.badge_label || "Live"}
        </span>

        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex whitespace-nowrap will-change-transform"
            style={{ animation: `ticker-marquee ${speed}s linear infinite` }}
          >
            {loop.map((it, i) => {
              const inner = (
                <span className="mx-6 inline-flex items-center gap-2 text-sm font-medium">
                  {it.icon && <CmsIcon name={it.icon} className="h-4 w-4 opacity-90" />}
                  <span>{it.text}</span>
                  {it.link && it.cta_label && (
                    <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                      {it.cta_label} <ArrowRight className="h-3 w-3" />
                    </span>
                  )}
                </span>
              );
              return it.link ? (
                <Link key={i} to={it.link} className="hover:underline">
                  {inner}
                </Link>
              ) : (
                <span key={i}>{inner}</span>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-primary to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-accent to-transparent" />

        </div>

        {cfg.dismissible !== false && (
          <button
            onClick={() => setClosed(true)}
            aria-label="Dismiss announcements"
            className="shrink-0 rounded-full p-1 text-white/90 transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <style>{`
        @keyframes ticker-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="ticker-marquee"] { animation-duration: 240s !important; }
        }
      `}</style>
    </div>
  );
}
