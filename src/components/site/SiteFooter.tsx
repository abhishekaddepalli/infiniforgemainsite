import { Link } from "@tanstack/react-router";
import { Zap, Mail, Phone, MapPin, Heart, Sparkles } from "lucide-react";
import { useCms } from "@/lib/cms";

export function SiteFooter() {
  const branding = useCms("branding");
  const footer = useCms("footer");
  const brandName = branding.brand_name || "Infiniforge Technologies";
  const copyright = (footer.copyright || "© {year}").replace("{year}", String(new Date().getFullYear()));

  return (
    <footer className="mt-24 border-t border-border bg-gradient-dashboard text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src={branding.logo_url || "/pwa-192.png"}
                alt={brandName}
                className="h-10 w-10 rounded-xl object-contain bg-white/90 p-0.5 ring-1 ring-white/20"
              />

              <div className="leading-none">
                <div className="font-bold text-white">{brandName}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/50">{branding.tagline}</div>
              </div>
            </div>
            <p className="text-sm text-white/60 max-w-sm">{footer.tagline}</p>
            <div className="space-y-2 text-sm text-white/70">
              {footer.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {footer.email}</div>}
              {footer.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {footer.phone}</div>}
              {footer.address && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {footer.address}</div>}
            </div>
          </div>

          {(footer.columns ?? []).map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/80 mb-4">{col.title}</div>
              <ul className="space-y-2.5 text-sm">
                {(col.links ?? []).map((l) => (
                  <li key={l.label + l.to}>
                    <Link to={l.to} className="text-white/60 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>{copyright} {footer.gstin && `· ${footer.gstin}`}</div>
          <div className="group relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.06]">
            <span className="absolute -inset-px rounded-full bg-gradient-to-r from-[#ff9933]/40 via-fuchsia-500/30 to-[#138808]/40 opacity-0 blur-sm transition-opacity group-hover:opacity-100" aria-hidden />
            <Sparkles className="relative h-3.5 w-3.5 text-[#ffb266] animate-pulse" />
            <span className="relative text-[11px] tracking-wide text-white/70">
              Developed with{" "}
              <Heart className="inline h-3 w-3 -mt-0.5 fill-[#ff4d6d] text-[#ff4d6d] animate-pulse" />{" "}
              by{" "}
              <a
                href="https://www.linkedin.com/in/abhishek-addepalli"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold bg-gradient-to-r from-[#ff9933] via-[#ffd699] to-[#7bd67b] bg-clip-text text-transparent hover:underline underline-offset-2"
              >
                Abhishek Addepalli
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
