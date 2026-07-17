import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Check, ShoppingCart, Package, Loader2, ExternalLink, ArrowRight, Sparkles, ShieldCheck, Zap, Boxes, Server, Cloud, Globe2, KeyRound, Bot } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { WhatsAppOrderButton } from "@/components/WhatsAppOrderButton";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — Hosting, SaaS, Licenses & More — Infiniforge" },
      { name: "description", content: "Browse VPS hosting, shared hosting, domains, SSL certificates, SaaS platforms, software licenses and AI services. GST invoices included." },
      { property: "og:title", content: "Infiniforge Products & Plans" },
      { property: "og:description", content: "Hosting, SaaS, licenses and services — priced in INR with GST." },
    ],
  }),
  component: ProductsPage,
});

type DbProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_inr: number;
  gst_percent: number;
  billing: string;
  product_type: string;
  featured: boolean;
  popular: boolean;
  thumbnail_url: string | null;
  features: string[] | null;
  category_id: string | null;
  demo_url: string | null;
  demo_enabled: boolean;
};

const TYPE_LABEL: Record<string, string> = {
  physical: "Physical",
  digital: "Digital",
  service: "Service",
  subscription: "SaaS",
  license: "License",
  hosting: "Hosting",
  vps: "VPS",
  domain: "Domain",
  ssl: "SSL",
};

function ProductsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const { add } = useCart();

  const { data: products, isLoading } = useQuery({
    queryKey: ["public-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, description, price_inr, gst_percent, billing, product_type, featured, popular, thumbnail_url, features, category_id, demo_url, demo_enabled")
        .eq("status", "active")
        .order("popular", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as DbProduct[];
    },
  });

  const types = useMemo(() => {
    const s = new Set<string>();
    (products ?? []).forEach((p) => s.add(p.product_type));
    return Array.from(s);
  }, [products]);

  const filtered = useMemo(() => {
    return (products ?? []).filter((p) => {
      const matchesType = type === "all" || p.product_type === type;
      const matchesQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.description ?? "").toLowerCase().includes(q.toLowerCase());
      return matchesType && matchesQ;
    });
  }, [products, q, type]);

  const gradientFor = (t: string): "brand" | "green" | "saffron" =>
    t === "vps" || t === "hosting" || t === "domain" ? "green"
      : t === "license" || t === "service" ? "saffron" : "brand";

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-hero-blob pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl animate-hero-blob pointer-events-none" style={{ animationDelay: "-4s" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <Reveal>
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Product catalog
            </Badge>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
              Every product your business needs — <span className="text-gradient-brand animate-gradient">in one catalog</span>.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Hosting, VPS, domains, SSL, SaaS, licenses, AI and enterprise services. Instant delivery, GST-compliant invoices and 24×7 support.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search VPS, ERP, SSL, CRM…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10 h-12 bg-card shadow-card" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> {(products ?? []).length}+ products live</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" /> Instant delivery</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> GST invoiced</span>
            </div>
          </Reveal>

          {/* Animated collage of category tiles */}
          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-md aspect-square">
              <div className="absolute inset-6 rounded-[2rem] border border-dashed border-primary/25 animate-hero-orbit-rev" />
              <div className="absolute inset-16 rounded-full border border-dashed border-accent/25 animate-hero-orbit" />
              <div className="absolute inset-1/3 rounded-2xl bg-gradient-brand text-white shadow-elegant flex flex-col items-center justify-center animate-glow-pulse">
                <Package className="h-6 w-6" />
                <div className="mt-1 text-[10px] uppercase tracking-wider font-bold">Catalog</div>
              </div>
              {[
                { i: Server, label: "VPS", tone: "from-emerald-500 to-teal-500", angle: 0, d: "0s" },
                { i: Cloud, label: "Hosting", tone: "from-sky-500 to-indigo-500", angle: 45, d: "-1s" },
                { i: Globe2, label: "Domains", tone: "from-orange-500 to-rose-500", angle: 90, d: "-2s" },
                { i: ShieldCheck, label: "SSL", tone: "from-emerald-500 to-lime-500", angle: 135, d: "-3s" },
                { i: Boxes, label: "SaaS", tone: "from-violet-500 to-fuchsia-500", angle: 180, d: "-4s" },
                { i: KeyRound, label: "Licenses", tone: "from-amber-500 to-orange-500", angle: 225, d: "-5s" },
                { i: Bot, label: "AI", tone: "from-cyan-500 to-blue-500", angle: 270, d: "-6s" },
                { i: Zap, label: "Services", tone: "from-pink-500 to-rose-500", angle: 315, d: "-7s" },
              ].map(({ i: Icon, label, tone, angle, d }) => {
                const r = 44;
                const x = 50 + r * Math.cos((angle * Math.PI) / 180);
                const y = 50 + r * Math.sin((angle * Math.PI) / 180);
                return (
                  <div
                    key={label}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/60 bg-card/90 backdrop-blur px-2 py-1.5 shadow-card flex items-center gap-1.5 animate-hero-float"
                    style={{ left: `${x}%`, top: `${y}%`, animationDelay: d }}
                  >
                    <span className={cn("h-6 w-6 rounded-md text-white flex items-center justify-center bg-gradient-to-br", tone)}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[10px] font-semibold">{label}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-wrap gap-2 mb-8">
          <CatChip active={type === "all"} onClick={() => setType("all")}>All ({(products ?? []).length})</CatChip>
          {types.map((t) => {
            const count = (products ?? []).filter((p) => p.product_type === t).length;
            return (
              <CatChip key={t} active={type === t} onClick={() => setType(t)}>
                {TYPE_LABEL[t] ?? t} ({count})
              </CatChip>
            );
          })}
        </div>

        {isLoading ? (
          <div className="py-24 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading catalog…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            No products match your search.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, idx) => {
              const grad = gradientFor(p.product_type);
              const feats = Array.isArray(p.features) ? p.features.slice(0, 4) : [];
              return (
                <Reveal key={p.id} delay={(idx % 6) * 60}>
                <article className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant hover:border-primary/40 flex flex-col h-full">

                  <Link to="/products/$slug" params={{ slug: p.slug }} className="block aspect-video bg-gradient-to-br from-secondary/60 to-secondary/20 relative overflow-hidden">
                    {p.thumbnail_url ? (
                      <img src={p.thumbnail_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="h-full w-full grid place-items-center">
                        <div className={cn(
                          "h-14 w-14 rounded-2xl flex items-center justify-center text-white",
                          grad === "brand" && "bg-gradient-brand",
                          grad === "green" && "bg-gradient-green",
                          grad === "saffron" && "bg-gradient-saffron",
                        )}>
                          <Package className="h-6 w-6" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {p.popular && <Badge className="bg-primary text-primary-foreground shadow">Popular</Badge>}
                      {!p.popular && p.featured && <Badge className="bg-accent text-accent-foreground shadow">Featured</Badge>}
                    </div>
                    {p.demo_enabled && p.demo_url && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-emerald-500 text-white shadow"><ExternalLink className="h-3 w-3 mr-1" /> Live demo</Badge>
                      </div>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {TYPE_LABEL[p.product_type] ?? p.product_type}
                    </div>
                    <Link to="/products/$slug" params={{ slug: p.slug }} className="mt-1 font-semibold text-lg leading-tight hover:text-primary transition-colors">{p.name}</Link>
                    {p.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{p.description}</p>}
                    {feats.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {feats.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-accent shrink-0" /> {String(f)}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto pt-4">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold leading-none">{formatINR(Number(p.price_inr))}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {p.billing === "one-time" ? `+${p.gst_percent}% GST` : `/${p.billing}`}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Button size="sm" asChild className="flex-1 bg-gradient-brand text-white">
                          <Link to="/products/$slug" params={{ slug: p.slug }}>View details <ArrowRight className="h-3 w-3 ml-1" /></Link>
                        </Button>
                        <Button size="icon" variant="outline" aria-label="Add to cart" onClick={() => {
                          add({ id: p.id, name: p.name, price_inr: Number(p.price_inr), gst_percent: Number(p.gst_percent), billing: p.billing, thumbnail_url: p.thumbnail_url ?? null, product_type: p.product_type });
                          toast.success(`${p.name} added to cart`);
                        }}><ShoppingCart className="h-4 w-4" /></Button>
                      </div>
                      <WhatsAppOrderButton
                        surface="product"
                        size="sm"
                        className="mt-2 w-full border-[#25D366]/40 hover:bg-[#25D366]/10"
                        items={[{ name: p.name, qty: 1, price_inr: Number(p.price_inr) }]}
                        total_inr={Number(p.price_inr)}
                      />
                    </div>
                  </div>
                </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function CatChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium border transition-all",
        active
          ? "bg-gradient-brand text-white border-transparent shadow-elegant"
          : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}