import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Sparkles, Cpu, Server, Globe, ShieldCheck, Package, ShoppingCart, Camera, Router, Wifi, Code2, Cloud, Activity, HeadphonesIcon, Radio, Zap, Clock, Award, Users, TrendingUp, Layers, Lock, Rocket, Star, PlayCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HeroBannerSlider } from "@/components/site/HeroBannerSlider";
import { EcosystemFlow } from "@/components/site/EcosystemFlow";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories, products as staticProducts, formatINR } from "@/lib/catalog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { useCms, CmsIcon } from "@/lib/cms";

type DbFeatured = {
  id: string; slug: string; name: string; description: string | null; price_inr: number;
  gst_percent: number; billing: string; product_type: string; popular: boolean;
  featured: boolean; thumbnail_url: string | null; features: string[] | null;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Infiniforge Technologies — Enterprise SaaS, IT Services & AI Automation" },
      { name: "description", content: "India's unified enterprise platform for SaaS, IT services, hosting, VPS, domains, SSL, licenses, ERP/CRM and AI automation." },
    ],
  }),
  component: HomePage,
});

const featuredFallback = staticProducts.slice(0, 6);

function HomePage() {
  const navigate = useNavigate();
  const { add } = useCart();
  const home = useCms("home");

  const { data: dbFeatured } = useQuery({
    queryKey: ["public-featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, description, price_inr, gst_percent, billing, product_type, popular, featured, thumbnail_url, features")
        .eq("status", "active")
        .order("popular", { ascending: false })
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return (data ?? []) as unknown as DbFeatured[];
    },
    staleTime: 60_000,
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        {/* Animated grid backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-0 opacity-[0.06]"
             style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)" }} />
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-hero-blob" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-accent/25 blur-3xl animate-hero-float-slow" />
        <div className="pointer-events-none absolute top-1/2 left-1/3 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl animate-hero-blob" style={{ animationDelay: "-4s" }} />

        {/* Floating particle dots */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          {[
            { top: "18%", left: "12%", d: "0s" },
            { top: "32%", left: "88%", d: "1.2s" },
            { top: "68%", left: "8%", d: "0.6s" },
            { top: "78%", left: "76%", d: "2s" },
            { top: "22%", left: "62%", d: "1.5s" },
            { top: "55%", left: "40%", d: "0.9s" },
          ].map((p, i) => (
            <span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-primary/70 shadow-[0_0_10px_currentColor] animate-hero-float" style={{ top: p.top, left: p.left, animationDelay: p.d }} />
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28 relative">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur px-3 py-1 text-[11px] sm:text-xs font-medium text-primary animate-glow-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-70 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> <span className="truncate max-w-[220px] sm:max-w-none">{home.hero_eyebrow}</span>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="font-bold leading-[1.15] tracking-tight text-balance text-[18px] xs:text-[20px] sm:text-2xl md:text-3xl lg:text-[34px] xl:text-4xl">
                  <span className="block text-foreground">Build. Scale. Automate</span>
                  <span className="block text-foreground">with <span className="text-gradient-brand animate-gradient bg-clip-text">{home.hero_title}</span></span>
                </h1>
              </Reveal>
              <Reveal delay={180}>
                <div className="flex justify-center lg:justify-start">
                  <RotatingTagline
                    words={["Enterprise SaaS", "IT Services", "AI Automation", "Managed Hosting", "CCTV & Networking"]}
                  />
                </div>
              </Reveal>
              <Reveal delay={220}>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {home.hero_subtitle}
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3">
                  <Button size="lg" className="relative bg-gradient-brand text-white shadow-elegant hover:opacity-95 h-11 sm:h-12 px-5 sm:px-6 group overflow-hidden animate-glow-pulse w-full sm:w-auto" asChild>
                    <Link to={home.hero_cta_primary.link || "/pricing"}>
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                      <Rocket className="mr-1.5 h-4 w-4" />
                      {home.hero_cta_primary.label}
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-11 sm:h-12 px-5 sm:px-6 group backdrop-blur bg-background/50 w-full sm:w-auto" asChild>
                    <Link to={home.hero_cta_secondary.link || "/admin"}>
                      <PlayCircle className="mr-1.5 h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                      {home.hero_cta_secondary.label}
                    </Link>
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={400}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3 pt-1 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {["bg-gradient-brand","bg-gradient-green","bg-gradient-saffron","bg-primary"].map((c,i)=>(
                        <span key={i} className={`h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-background ${c}`} />
                      ))}
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="flex items-center gap-0.5">
                        {Array.from({length:5}).map((_,i)=>(<Star key={i} className="h-3 w-3 fill-accent text-accent" />))}
                      </span>
                      <span className="text-[11px] sm:text-xs">1,200+ businesses trust us</span>
                    </div>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-border" />
                  {home.hero_checks.map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 shrink-0"><Check className="h-3 w-3 text-accent" /></span> {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Hero visual — animated Enterprise Command Center */}
            <div className="lg:col-span-5 order-first lg:order-none">
              <HeroCommandCenter />
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {home.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="group relative glass rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:-translate-y-1 hover:shadow-elegant h-full overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/10 to-accent/10" />
                  <div className="relative h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0 text-white shadow-elegant transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <CmsIcon name={s.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="relative min-w-0">
                    <div className="text-lg sm:text-2xl font-bold leading-none tabular-nums text-gradient-brand truncate">{s.value}</div>
                    <div className="text-[11px] sm:text-xs text-muted-foreground mt-1 truncate">{s.label}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

      </section>


      {/* BANNER SLIDER — after hero */}
      <HeroBannerSlider />

      {/* TRUST / TECH MARQUEE */}
      <TechMarquee />



      {/* ECOSYSTEM MAP — animated React Flow of everything we deliver */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary">One platform · Every service</div>
            <h2 className="mt-2 text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              A live map of the{" "}
              <span className="text-gradient-brand animate-gradient bg-clip-text">Infiniforge ecosystem</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed px-2 sm:px-0">
              From routers and CCTV to courses, memberships, digital products and internet services — everything you buy from us is orchestrated from a single command center.
            </p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <EcosystemFlow />
        </Reveal>
      </section>



      {/* CATEGORIES */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <Reveal>
          <SectionHeader
            eyebrow="Everything under one roof"
            title={home.categories_title}
            subtitle={home.categories_subtitle}
          />
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <Link
                to="/products"
                className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant hover:border-primary/30"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-elegant ${
                  c.gradient === "brand" ? "bg-gradient-brand" : c.gradient === "green" ? "bg-gradient-green" : "bg-gradient-saffron"
                }`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="relative mt-5 font-semibold text-base group-hover:text-primary transition-colors">{c.name}</h3>
                <p className="relative mt-1.5 text-sm text-muted-foreground leading-relaxed">{c.tagline}</p>
                <div className="relative mt-4 inline-flex items-center text-xs font-medium text-primary translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  Explore <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY INFINIFORGE — bento grid */}
      <WhyBento />



      {/* HIGHLIGHTED FEATURE CARDS (editable in CMS) */}
      {home.features.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid gap-5 md:grid-cols-2">
            {home.features.map((svc, i) => (
              <Reveal key={svc.title + i} delay={i * 80}>
                <div className="glass rounded-2xl p-6 flex items-start gap-4 transition-all hover:-translate-y-1 hover:shadow-elegant h-full">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-elegant ${i % 2 === 0 ? "bg-gradient-green" : "bg-gradient-brand"}`}>
                    <CmsIcon name={svc.icon} className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg">{svc.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">{svc.description}</p>
                    <Link to="/products" className="text-xs font-medium text-primary inline-flex items-center gap-1 mt-3 group">
                      Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {home.testimonials?.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <Reveal>
            <SectionHeader eyebrow="Loved by operators" title={home.testimonials_title} />
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {home.testimonials.map((t, i) => (
              <Reveal key={t.name + i} delay={i * 100}>
                <figure className="group relative h-full rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
                  <div className="absolute top-6 right-6 text-6xl font-serif leading-none text-primary/15 select-none">"</div>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Sparkles key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-foreground">"{t.quote}"</blockquote>
                  <figcaption className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-semibold">
                      {t.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}{t.company ? ` · ${t.company}` : ""}</div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}



      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">

        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">{home.featured_eyebrow}</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">{home.featured_title}</h2>
          </div>
          <Button variant="outline" asChild><Link to="/products">View all products <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>

        {dbFeatured && dbFeatured.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dbFeatured.map((p) => {
              const feats = Array.isArray(p.features) ? p.features.slice(0, 3) : [];
              const handleOrder = () => {
                add({
                  id: p.id, name: p.name, price_inr: Number(p.price_inr),
                  gst_percent: Number(p.gst_percent), billing: p.billing,
                  thumbnail_url: p.thumbnail_url ?? null, product_type: p.product_type,
                });
                toast.success(`${p.name} added to cart`);
                navigate({ to: "/checkout" });
              };
              return (
                <article key={p.id} className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant flex flex-col">
                  <Link to="/products/$slug" params={{ slug: p.slug }} className="absolute inset-0 z-0" aria-label={`View ${p.name}`} />
                  <div className="relative z-10 flex flex-col flex-1 pointer-events-none">
                    <div className="flex items-start justify-between mb-5">
                      <div className="h-11 w-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
                        <Package className="h-5 w-5" />
                      </div>
                      {p.popular && <Badge className="bg-primary/15 text-primary border-0">Popular</Badge>}
                      {!p.popular && p.featured && <Badge className="bg-accent/15 text-accent border-0">Featured</Badge>}
                    </div>
                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{p.name}</h3>
                    {p.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.description}</p>}
                    {feats.length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {feats.map((f, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-accent shrink-0" /> {String(f)}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-6 pt-5 border-t border-border flex items-center justify-between pointer-events-auto">
                      <div>
                        <div className="text-2xl font-bold leading-none">{formatINR(Number(p.price_inr))}</div>
                        <div className="text-[11px] text-muted-foreground mt-1">
                          {p.billing === "one-time" ? `one-time · +${p.gst_percent}% GST` : `per ${p.billing} · +${p.gst_percent}% GST`}
                        </div>
                      </div>
                      <Button size="sm" className="bg-gradient-brand text-white relative z-10" onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleOrder(); }}>
                        <ShoppingCart className="h-4 w-4 mr-1" /> Order
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFallback.map((p) => (
              <article key={p.id} className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="flex items-start justify-between mb-5">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-white ${
                    p.gradient === "brand" ? "bg-gradient-brand" : p.gradient === "green" ? "bg-gradient-green" : "bg-gradient-saffron"
                  }`}>
                    <p.icon className="h-5 w-5" />
                  </div>
                  {p.badge && <Badge className="bg-primary/15 text-primary border-0">{p.badge}</Badge>}
                </div>
                <h3 className="font-semibold text-lg leading-tight">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="text-xs text-muted-foreground flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-accent shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold leading-none">{formatINR(p.price)}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {p.billing === "one-time" ? "one-time" : `per ${p.billing === "mo" ? "month" : "year"}`}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild><Link to="/products">View catalog</Link></Button>
                </div>
              </article>
            ))}
          </div>
        )}

      </section>

      {/* FAQ */}
      <HomeFAQ />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-dashboard p-10 lg:p-16 text-white shadow-elegant">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-brand opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-green opacity-30 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="bg-white/10 text-white border-white/20 mb-5">For enterprises & resellers</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{home.cta_title}</h2>
              <p className="mt-4 text-white/70 leading-relaxed">{home.cta_subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90 h-12 px-6" asChild>
                  <Link to={home.cta_primary.link || "/contact"}>{home.cta_primary.label}</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white bg-transparent hover:bg-white/10 h-12 px-6" asChild>
                  <Link to={home.cta_secondary.link || "/pricing"}>{home.cta_secondary.label}</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Globe, label: "Domains & DNS" },
                { icon: Server, label: "Managed hosting & VPS" },
                { icon: Camera, label: "CCTV & IP surveillance" },
                { icon: ShieldCheck, label: "GST + 24×7 NOC" },
              ].map((f) => (
                <div key={f.label} className="glass !bg-white/5 border-white/10 rounded-2xl p-5">
                  <f.icon className="h-5 w-5 text-primary-glow mb-3" />
                  <div className="font-medium text-sm">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function RotatingTagline({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <div className="flex items-center gap-2 text-base sm:text-lg font-medium">
      <span className="text-muted-foreground">One partner for</span>
      <span className="relative inline-flex h-7 overflow-hidden">
        <span key={i} className="inline-block text-gradient-brand animate-reveal-up font-semibold">
          {words[i]}
        </span>
      </span>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function MiniChart() {
  const points = [12, 18, 15, 24, 22, 30, 28, 38, 34, 46, 42, 58];
  const max = Math.max(...points);
  const w = 100, h = 40;
  const step = w / (points.length - 1);
  const path = points.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${h - (v / max) * h}`).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.74 0.17 55)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.74 0.17 55)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={path} fill="none" stroke="oklch(0.74 0.17 55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function HeroCommandCenter() {
  const trafficBars = [40, 68, 52, 82, 60, 90, 55, 78, 46, 88];
  const orbitChips = [
    { label: "CCTV", icon: Camera },
    { label: "Routers", icon: Router },
    { label: "Websites", icon: Code2 },
    { label: "VPS / Cloud", icon: Cloud },
    { label: "Internet / WISP", icon: Wifi },
    { label: "IT Support", icon: HeadphonesIcon },
    { label: "Software", icon: Package },
    { label: "Monitoring", icon: Activity },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px] px-2 sm:px-0">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-10 -left-8 h-56 w-56 rounded-full bg-primary/30 blur-3xl animate-hero-blob" />
      <div className="pointer-events-none absolute -bottom-12 -right-6 h-64 w-64 rounded-full bg-accent/30 blur-3xl animate-hero-blob" style={{ animationDelay: "-6s" }} />

      {/* Rotating dashed rings — global network feel */}
      <div className="absolute inset-2 rounded-full border border-dashed border-primary/25 animate-hero-spin-slow" />
      <div className="absolute inset-6 sm:inset-10 rounded-full border border-dashed border-accent/30 animate-hero-spin-slow" style={{ animationDirection: "reverse", animationDuration: "34s" }} />
      <div className="absolute inset-12 sm:inset-20 rounded-full border border-dotted border-primary/20 animate-hero-spin-slow" style={{ animationDuration: "48s" }} />

      {/* Signal pulse rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-32 sm:h-44 sm:w-44 rounded-full bg-gradient-brand/20 animate-hero-pulse-ring" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-32 sm:h-44 sm:w-44 rounded-full bg-gradient-brand/20 animate-hero-pulse-ring" style={{ animationDelay: "1.3s" }} />
      </div>

      {/* Orbiting service chips */}
      <div className="absolute inset-0">
        {orbitChips.map((c, i) => {
          const angle = (360 / orbitChips.length) * i;
          const outer = i % 2 === 0;
          return (
            <div
              key={c.label}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
            >
              <div
                className={outer ? "animate-hero-orbit" : "animate-hero-orbit-rev"}
                style={{
                  ["--r" as string]: outer
                    ? "clamp(88px, 30vw, 185px)"
                    : "clamp(112px, 38vw, 225px)",
                  animationDelay: `${-i * 2.2}s`,
                }}
              >
                <div className="glass rounded-xl sm:rounded-2xl border border-primary/20 px-2 py-1 sm:px-3 sm:py-2 shadow-elegant flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                  <span className={`h-5 w-5 sm:h-6 sm:w-6 rounded-md sm:rounded-lg text-white flex items-center justify-center ${outer ? "bg-gradient-brand" : "bg-gradient-green"}`}>
                    <c.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold">{c.label}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_currentColor]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center NOC / Globe console */}
      <div className="absolute left-1/2 top-1/2 w-[74%] -translate-x-1/2 -translate-y-1/2 animate-hero-float-slow">
        <div className="relative glass rounded-3xl shadow-elegant p-5 overflow-hidden">
          {/* moving shine */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -inset-y-4 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-hero-shine" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-70 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                NOC · Live
              </div>
              <div className="text-2xl font-bold mt-1 text-gradient-brand">99.98% Uptime</div>
            </div>
            <Badge className="bg-accent/15 text-accent border-0">24×7</Badge>
          </div>

          {/* Mini globe with orbit dots */}
          <div className="mt-3 relative h-24 flex items-center justify-center">
            <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 overflow-hidden animate-hero-spin-slow">
              <Globe className="absolute inset-0 m-auto h-14 w-14 text-primary/70" strokeWidth={1.2} />
              {/* meridian lines */}
              <div className="absolute inset-0 rounded-full border-t border-b border-primary/20" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-primary/20" />
            </div>
            {/* satellite dots */}
            <div className="absolute inset-0 animate-hero-spin-slow" style={{ animationDuration: "14s" }}>
              <span className="absolute left-1/2 top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_currentColor]" />
            </div>
            <div className="absolute inset-0 animate-hero-spin-slow" style={{ animationDuration: "20s", animationDirection: "reverse" }}>
              <span className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_8px_currentColor]" />
            </div>
          </div>

          {/* Traffic bars — bandwidth */}
          <div className="mt-3 flex items-end gap-1 h-12">
            {trafficBars.map((h, i) => (
              <div key={i} className="flex-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-primary to-accent origin-bottom animate-hero-bar"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                />
              </div>
            ))}
          </div>

          {/* KPI trio — service-centric */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: "Cameras", val: "1.2k", icon: Camera },
              { label: "Nodes", val: "417", icon: Cpu },
              { label: "Tickets", val: "24", icon: HeadphonesIcon },
            ].map((k, i) => (
              <div
                key={k.label}
                className="rounded-xl border border-border/60 bg-card/70 backdrop-blur p-2.5 animate-hero-float"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <k.icon className="h-3.5 w-3.5 text-primary mb-1" />
                <div className="text-sm font-bold leading-none">{k.val}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute top-2 right-2 glass rounded-xl px-2.5 py-1.5 border border-accent/30 flex items-center gap-1.5 animate-hero-float" style={{ animationDelay: "0.6s" }}>
        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
        <span className="text-[10px] font-semibold">GST Invoiced</span>
      </div>
      <div className="absolute bottom-4 left-2 glass rounded-xl px-2.5 py-1.5 border border-primary/30 flex items-center gap-1.5 animate-hero-float" style={{ animationDelay: "1.2s" }}>
        <Radio className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] font-semibold">On-site + Remote</span>
      </div>
      <div className="absolute top-1/2 -left-2 glass rounded-xl px-2.5 py-1.5 border border-accent/30 flex items-center gap-1.5 animate-hero-float" style={{ animationDelay: "1.8s" }}>
        <Server className="h-3.5 w-3.5 text-accent" />
        <span className="text-[10px] font-semibold">Servers Live</span>
      </div>
    </div>
  );
}

/* ============ TRUST / TECH MARQUEE ============ */
function TechMarquee() {
  const tech = [
    "AWS", "Google Cloud", "Azure", "Cloudflare", "DigitalOcean", "Hetzner",
    "Coolify", "n8n", "WordPress", "Next.js", "Supabase", "PostgreSQL",
    "Docker", "Kubernetes", "Nginx", "LiteSpeed", "Redis", "MongoDB",
    "Razorpay", "Stripe", "Twilio", "Meta", "WhatsApp Business",
  ];
  const row = [...tech, ...tech];
  return (
    <section className="border-y border-border/60 bg-secondary/30 py-6 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        Trusted stack — 1,200+ deployments across India
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex gap-3 animate-[marquee_40s_linear_infinite] w-max">
          {row.map((t, i) => (
            <div key={t + i} className="flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-4 py-2 text-sm font-medium whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_currentColor]" />
              {t}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }`}</style>
    </section>
  );
}

/* ============ WHY INFINIFORGE — BENTO ============ */
function WhyBento() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <Reveal>
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Why teams choose Infiniforge</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Enterprise capability, startup speed.</h2>
          <p className="mt-3 text-muted-foreground">One accountable partner for every layer of your business tech — with fixed pricing, GST invoices and 24×7 humans on call.</p>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-6 md:auto-rows-[minmax(180px,1fr)]">
        {/* Big feature */}
        <Reveal delay={0} className="md:col-span-3 md:row-span-2">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 h-full min-h-[380px] flex flex-col justify-between">
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-elegant"><Rocket className="h-6 w-6" /></div>
              <h3 className="mt-6 text-2xl font-bold leading-tight">One team. One invoice. Every layer of your stack.</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Websites, apps, ERP, hosting, VPS, domains, SSL, CCTV, routers, internet, monitoring, courses & AI — delivered and maintained by a single accountable partner.</p>
            </div>
            <div className="relative grid grid-cols-3 gap-2 pt-6">
              {[{i:Layers,l:"12 verticals"},{i:Users,l:"40+ engineers"},{i:Award,l:"ISO 27001"}].map((x)=> (
                <div key={x.l} className="rounded-xl border border-border bg-card/70 backdrop-blur p-3">
                  <x.i className="h-4 w-4 text-primary" />
                  <div className="mt-2 text-xs font-semibold">{x.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="md:col-span-3">
          <div className="rounded-3xl border border-border bg-card p-6 h-full flex flex-col justify-between">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-green text-white"><Zap className="h-5 w-5" /></div>
              <h3 className="mt-4 font-semibold text-lg">Fixed timelines & quotes</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">Milestone-based delivery with weekly demos. No scope-creep surprises.</p>
            </div>
            <div className="mt-5 flex items-end gap-3">
              <div className="text-4xl font-extrabold text-gradient-brand tabular-nums">7d</div>
              <div className="text-xs text-muted-foreground pb-1.5">avg first-milestone</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150} className="md:col-span-2">
          <div className="rounded-3xl border border-border bg-card p-6 h-full flex flex-col">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-saffron text-white"><Clock className="h-5 w-5" /></div>
            <h3 className="mt-4 font-semibold">24×7 NOC</h3>
            <p className="mt-1 text-xs text-muted-foreground">WhatsApp + SMS + phone alerts.</p>
          </div>
        </Reveal>

        <Reveal delay={200} className="md:col-span-1">
          <div className="rounded-3xl border border-border bg-card p-6 h-full flex flex-col items-start">
            <Lock className="h-5 w-5 text-primary" />
            <div className="mt-4 text-2xl font-bold">DPA</div>
            <div className="text-[11px] text-muted-foreground mt-1">Data protection agreement included</div>
          </div>
        </Reveal>
      </div>

    </section>
  );
}

/* ============ HOME FAQ ============ */
function HomeFAQ() {
  const items = [
    { q: "Do you offer GST-compliant invoices?", a: "Yes. Every product, service and hosting plan ships with a full GST tax invoice. B2B customers get GSTIN capture at checkout for input credit." },
    { q: "How fast can you deliver a website or app?", a: "Corporate websites go live in 7–14 days. Complex ERP/CRM builds run 6–12 weeks with weekly demos and staging access. Every project has a fixed timeline." },
    { q: "Which regions do you cover for on-site services (CCTV, routers, network)?", a: "Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune and Chennai directly. Other cities via our partner network — same SLA, same GST invoicing." },
    { q: "Can I white-label / resell Infiniforge hosting & products?", a: "Yes. We have a dedicated reseller program with wallet credits, sub-accounts and API access. Talk to our team for wholesale pricing." },
    { q: "What happens after a project goes live?", a: "You can add an AMC (Silver / Gold / Platinum) for ongoing monitoring, updates and 24×7 support. No lock-in — cancel anytime." },
  ];
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Answers before you ask</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Frequently asked</h2>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`f-${i}`} className="border-0 px-5">
              <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">{it.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

