import { Sparkles, Heart } from "lucide-react";

export function BrandFooter() {
  return (
    <footer
      className="relative mt-10 mx-4 lg:mx-8 mb-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#0b1220] via-[#111827] to-[#0b1220] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)]"
      aria-label="Application footer"
    >
      {/* Saffron / green glow accents */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-[#ff9933]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-[#138808]/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_60%)]" />

      <div className="relative flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 px-6 py-5 text-center">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ff9933] to-[#138808] shadow-lg shadow-[#ff9933]/20">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm md:text-base font-semibold tracking-wide text-white">
            Powered by{" "}
            <span className="bg-gradient-to-r from-[#ffb266] via-[#ffffff] to-[#7bd67b] bg-clip-text text-transparent font-bold">
              Infiniforge Technologies
            </span>
          </span>
        </div>

        <span className="hidden md:inline h-4 w-px bg-white/20" />

        <div className="flex items-center gap-1.5 text-xs md:text-sm text-white/80">
          <span>Developed with</span>
          <Heart className="h-3.5 w-3.5 fill-[#ff4d6d] text-[#ff4d6d] animate-pulse" />
          <span>
            by{" "}
            <span className="font-semibold bg-gradient-to-r from-[#ff9933] to-[#ffd699] bg-clip-text text-transparent">
              Abhishek Addepalli
            </span>
          </span>
        </div>
      </div>

      <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative px-6 py-2 text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
        © {new Date().getFullYear()} Infiniforge Technologies · All rights reserved
      </div>
    </footer>
  );
}

export default BrandFooter;
