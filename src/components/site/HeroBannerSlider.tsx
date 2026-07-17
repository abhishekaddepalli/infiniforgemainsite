import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCms } from "@/lib/cms";
import { Button } from "@/components/ui/button";

export function HeroBannerSlider() {
  const cfg = useCms("banners");
  const slides = (cfg.slides ?? []).filter((s) => s.enabled !== false);
  const [i, setI] = useState(0);
  const count = slides.length;
  const interval = Math.max(2, Math.min(cfg.autoplay_seconds ?? 6, 30)) * 1000;

  const next = useCallback(() => setI((v) => (v + 1) % Math.max(count, 1)), [count]);
  const prev = () => setI((v) => (v - 1 + count) % Math.max(count, 1));

  useEffect(() => {
    if (!cfg.enabled || !cfg.autoplay || count < 2) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [cfg.enabled, cfg.autoplay, count, interval, next]);

  if (!cfg.enabled || count === 0) return null;
  const s = slides[i % count];

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
      <div className="relative overflow-hidden rounded-2xl border border-border shadow-elegant">
        {/* Slides */}
        <div className="relative min-h-[360px] sm:aspect-[16/6] sm:min-h-[260px] w-full">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === i % count ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              style={{
                backgroundImage: slide.image_url
                  ? `linear-gradient(90deg, rgba(10,10,15,0.82) 0%, rgba(10,10,15,0.55) 60%, rgba(10,10,15,0.25) 100%), url(${slide.image_url})`
                  : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex h-full flex-col justify-center gap-3 px-5 pb-14 pt-6 sm:px-16 sm:py-10 lg:px-20 lg:py-14 max-w-2xl text-white">
                {slide.eyebrow && (
                  <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
                    {slide.eyebrow}
                  </span>
                )}
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight drop-shadow">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xl">
                    {slide.subtitle}
                  </p>
                )}
                <div className="mt-2 flex flex-col sm:flex-row flex-wrap gap-2">
                  {slide.cta_label && slide.cta_link && (
                    <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 h-11 w-full sm:w-auto">
                      <Link to={slide.cta_link}>
                        {slide.cta_label} <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {slide.cta2_label && slide.cta2_link && (
                    <Button asChild size="lg" variant="outline" className="h-11 w-full sm:w-auto border-white/60 bg-white/10 text-white hover:bg-white/20">
                      <Link to={slide.cta2_link}>{slide.cta2_label}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60 sm:inline-flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60 sm:inline-flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === i % count ? "w-8 bg-white" : "w-3 bg-white/50 hover:bg-white/80"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
