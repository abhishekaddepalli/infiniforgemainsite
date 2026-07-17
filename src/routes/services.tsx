import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles, Zap, ShieldCheck, Rocket, Clock, Layers } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCms, CmsIcon } from "@/lib/cms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Websites, Servers, CCTV, IT Solutions · Infiniforge" },
      { name: "description", content: "End-to-end IT services: website & app development, ERP/CRM, hosting & VPS, CCTV & networks, AI automation, monitoring, AMC and consulting for Indian businesses." },
      { property: "og:title", content: "Infiniforge Services" },
      { property: "og:description", content: "One partner for your servers, sites, networks and support — with GST invoicing and 24×7 NOC." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const TONE_MAP = [
  "from-primary/15 to-primary/5 text-primary",
  "from-accent/15 to-accent/5 text-accent",
  "from-primary/10 to-accent/10 text-primary",
] as const;

const GRADIENTS = ["bg-gradient-brand", "bg-gradient-green", "bg-gradient-saffron"] as const;

const HIGHLIGHTS = [
  { icon: Rocket, title: "Ship in days, not months", desc: "Fixed scope, fixed timeline, fixed price — with weekly demos." },
  { icon: ShieldCheck, title: "GST-invoiced & compliant", desc: "Signed SLAs, DPA, and 18% GST invoices for every rupee." },
  { icon: Clock, title: "24×7 NOC & on-site", desc: "Human engineers on chat, phone and site across India." },
  { icon: Layers, title: "One partner, full stack", desc: "Websites, servers, CCTV, networks, software and support." },
];

function ServicesPage() {
  const page = useCms("services_page");

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-hero-blob" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-hero-blob" style={{ animationDelay: "-6s" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-20">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
            <div>
              <Reveal>
                <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
                  <Sparkles className="h-3 w-3 mr-1.5" /> {page.eyebrow}
                </Badge>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                  {page.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className="text-gradient-brand animate-gradient bg-clip-text">
                    {page.title.split(" ").slice(-2).join(" ")}
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">{page.subtitle}</p>
              </Reveal>
              <Reveal delay={280}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" className="h-12 bg-gradient-brand text-white px-6" asChild>
                    <Link to="/contact">Get a free quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-6" asChild>
                    <Link to="/pricing">See care plans</Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Floating stack visual */}
            <Reveal delay={200}>
              <div className="relative h-[340px] hidden lg:block">
                <div className="absolute inset-0 rounded-3xl bg-gradient-dashboard shadow-elegant overflow-hidden">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, oklch(0.74 0.17 55 / 0.5), transparent 50%), radial-gradient(circle at 70% 70%, oklch(0.68 0.18 145 / 0.5), transparent 50%)" }} />
                  <div className="absolute inset-0 p-6">
                    {(page.services ?? []).slice(0, 6).map((s, i) => {
                      const positions = [
                        "top-4 left-4", "top-6 right-6", "top-1/2 left-2 -translate-y-1/2",
                        "top-1/2 right-4 -translate-y-1/2", "bottom-6 left-8", "bottom-4 right-10",
                      ];
                      return (
                        <div
                          key={s.name + i}
                          className={cn("absolute glass !bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-xs font-medium flex items-center gap-2 shadow-elegant", positions[i])}
                          style={{ animation: `hero-float ${5 + i * 0.7}s ease-in-out infinite`, animationDelay: `${i * -0.6}s` }}
                        >
                          <span className={cn("h-6 w-6 rounded-md flex items-center justify-center", GRADIENTS[i % GRADIENTS.length])}>
                            <CmsIcon name={s.icon} className="h-3.5 w-3.5 text-white" />
                          </span>
                          {s.name}
                        </div>
                      );
                    })}
                    <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 h-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-widest text-white/60">Infiniforge</div>
                        <div className="text-white font-bold text-lg mt-1">One-stop IT partner</div>
                        <div className="mt-2 flex items-center justify-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                          <span className="text-[10px] text-white/70">Live · 99.98% uptime</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HIGHLIGHT STRIP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="glass rounded-2xl p-5 flex items-start gap-3 transition-all hover:-translate-y-1 hover:shadow-elegant">
                <span className="h-10 w-10 rounded-xl bg-gradient-brand text-white flex items-center justify-center shrink-0">
                  <h.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold text-sm">{h.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SERVICES GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">What we do</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Every service your business needs — under one roof.</h2>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.services.map((s, i) => (
            <Reveal key={s.name + i} delay={(i % 3) * 80}>
              <div className={cn(
                "group relative h-full rounded-2xl border border-border bg-card p-6 shadow-card overflow-hidden",
                "transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant",
              )}>
                <div className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
                  TONE_MAP[i % TONE_MAP.length],
                )} />
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-brand opacity-0 blur-2xl group-hover:opacity-20 transition-opacity" />

                <div className="relative">
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-elegant transition-transform group-hover:scale-110 group-hover:rotate-3", GRADIENTS[i % GRADIENTS.length])}>
                    <CmsIcon name={s.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-semibold text-lg">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                  <div className="mt-6 pt-5 border-t border-border/70 flex items-center justify-between">
                    <div className="text-sm font-semibold">{s.price}</div>
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary group/btn" asChild>
                      <Link to="/contact">
                        Enquire
                        <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 lg:p-14 shadow-card">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-hero-blob" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-hero-blob" style={{ animationDelay: "-5s" }} />

          <div className="relative grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
            <Reveal>
              <div className="lg:sticky lg:top-24">
                <Badge variant="outline" className="rounded-full border-accent/30 bg-accent/10 text-accent">
                  <Zap className="h-3 w-3 mr-1.5" /> How we work
                </Badge>
                <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">{page.process_title}</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">{page.process_subtitle}</p>
                <Button className="mt-6 bg-gradient-brand text-white h-11 px-5" asChild>
                  <Link to="/contact">
                    Talk to a solution architect <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <ol className="relative space-y-6 border-l-2 border-dashed border-border pl-8">
              {page.process_steps.map((step, i) => (
                <Reveal key={step.title + i} delay={i * 100}>
                  <li className="relative">
                    <div className={cn(
                      "absolute -left-[42px] top-0 h-9 w-9 rounded-xl text-white flex items-center justify-center font-semibold text-sm shadow-elegant animate-glow-pulse",
                      GRADIENTS[i % GRADIENTS.length],
                    )}
                    style={{ animationDelay: `${i * 0.3}s` }}>
                      {i + 1}
                    </div>
                    <div className="rounded-2xl border border-border bg-background/50 backdrop-blur p-5 transition-all hover:-translate-y-0.5 hover:shadow-card">
                      <div className="font-semibold flex items-center gap-2">
                        {step.title}
                        <Check className="h-4 w-4 text-accent" />
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-dashboard p-10 lg:p-14 text-white shadow-elegant">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-brand opacity-40 blur-3xl animate-hero-blob" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-green opacity-30 blur-3xl animate-hero-blob" style={{ animationDelay: "-4s" }} />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Have a project in mind?</h2>
                <p className="mt-3 text-white/70 max-w-xl leading-relaxed">
                  Share your requirement — we'll come back within 4 business hours with a scoped quote and timeline.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90 h-12 px-6" asChild>
                  <Link to="/contact">Start a project <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white bg-transparent hover:bg-white/10 h-12 px-6" asChild>
                  <Link to="/products">Browse products</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
