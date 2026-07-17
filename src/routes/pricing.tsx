import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check, Sparkles, ShieldCheck, Zap, Headphones, RefreshCw, Star,
  ArrowRight, HelpCircle, TrendingUp, Users, Rocket, Crown,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MembershipBadge } from "@/components/membership/MembershipBadge";
import { listTiers } from "@/lib/memberships.functions";
import { formatINR } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { useCms } from "@/lib/cms";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Care Plans & Memberships — Websites, Servers, CCTV, IT Services · Infiniforge" },
      { name: "description", content: "Transparent care plans and memberships for websites, servers, networks, CCTV and IT services. GST invoicing, 24×7 NOC support, cancel anytime." },
      { property: "og:title", content: "Infiniforge Care Plans & Memberships" },
      { property: "og:description", content: "Fixed-price service plans for startups, SMBs and enterprises." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const TRUST_STRIP = [
  { icon: ShieldCheck, label: "GST invoicing" },
  { icon: Zap, label: "Fixed timelines" },
  { icon: RefreshCw, label: "7-day money-back" },
  { icon: Headphones, label: "24×7 human support" },
];

const FAQS = [
  {
    q: "What exactly do care plans include?",
    a: "Every care plan bundles hosting, updates, monitoring and support hours for your website, servers or network — so you pay one predictable monthly fee instead of hourly bills. Growth and Enterprise add router/CCTV/NOC coverage and on-site visits.",
  },
  {
    q: "Are memberships different from care plans?",
    a: "Care plans cover managed services (uptime, patching, tickets). Memberships (Silver/Gold/Platinum) unlock discounts on new projects, priority delivery, exclusive courses and access to premium digital products in your portal.",
  },
  {
    q: "Do prices include GST?",
    a: "All prices are exclusive of 18% GST. You'll receive a compliant GST invoice with your GSTIN for every payment.",
  },
  {
    q: "How do I pay?",
    a: "Razorpay (cards, netbanking, UPI), wallet top-ups, international cards, and NEFT/RTGS for enterprise annual contracts.",
  },
  {
    q: "Do you cover networking, CCTV & internet?",
    a: "Yes — Growth and Enterprise plans include AMC for routers, switches, CCTV, NVRs, firewalls and leased-line/ISP escalations with 24×7 NOC.",
  },
  {
    q: "Can you build custom software or a full website?",
    a: "Absolutely — we quote every project separately with fixed price and timeline. Members get 10–20% off and priority delivery slots.",
  },
];

function PricingPage() {
  const [yearly, setYearly] = useState(true);
  const page = useCms("pricing_page");

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-hero-blob" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-hero-blob" style={{ animationDelay: "-5s" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-14 text-center">
          <Reveal>
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="h-3 w-3 mr-1.5" /> {page.eyebrow}
            </Badge>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.05]">
              {page.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-gradient-brand animate-gradient bg-clip-text">
                {page.title.split(" ").slice(-2).join(" ")}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{page.subtitle}</p>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-card">
              <button
                onClick={() => setYearly(false)}
                className={cn("px-5 py-2 rounded-full text-sm font-medium transition-all", !yearly ? "bg-gradient-brand text-white shadow-elegant" : "text-muted-foreground hover:text-foreground")}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={cn("px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2", yearly ? "bg-gradient-brand text-white shadow-elegant" : "text-muted-foreground hover:text-foreground")}
              >
                Yearly
                <span className="text-[10px] bg-accent/20 text-accent rounded-full px-2 py-0.5 font-semibold">Save 17%</span>
              </button>
            </div>
          </Reveal>

          {/* Trust strip */}
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              {TRUST_STRIP.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <span className="h-6 w-6 rounded-full bg-accent/15 flex items-center justify-center">
                    <t.icon className="h-3 w-3 text-accent" />
                  </span>
                  {t.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PLANS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {page.plans.map((p, i) => (
            <Reveal key={p.name + i} delay={i * 120}>
              <div
                className={cn(
                  "group relative h-full rounded-3xl p-8 flex flex-col transition-all duration-500",
                  p.highlight
                    ? "bg-gradient-dashboard text-white shadow-elegant border border-primary/30 lg:-translate-y-3 hover:-translate-y-4"
                    : "bg-card border border-border shadow-card hover:-translate-y-1 hover:shadow-elegant",
                )}
              >
                {p.highlight && (
                  <>
                    <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-brand opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-brand text-white border-0 shadow-elegant animate-glow-pulse">
                      <Star className="h-3 w-3 mr-1 fill-current" /> Most popular
                    </Badge>
                  </>
                )}
                <div className={cn("relative text-xs font-semibold uppercase tracking-wider", p.highlight ? "text-primary-glow" : "text-primary")}>
                  {p.tag}
                </div>
                <h3 className={cn("relative mt-2 text-2xl font-bold", p.highlight && "text-white")}>{p.name}</h3>
                <div className="relative mt-6">
                  <div className={cn("text-5xl font-bold tracking-tight tabular-nums", p.highlight && "text-white")}>
                    {formatINR(yearly ? Math.round(p.yearly / 12) : p.monthly)}
                  </div>
                  <div className={cn("text-xs mt-2", p.highlight ? "text-white/60" : "text-muted-foreground")}>
                    per month · billed {yearly ? `yearly at ${formatINR(p.yearly)}` : "monthly"} · +18% GST
                  </div>
                  {yearly && (
                    <div className={cn("mt-2 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
                      p.highlight ? "bg-white/10 text-primary-glow" : "bg-accent/10 text-accent")}>
                      <TrendingUp className="h-3 w-3" /> Save {formatINR(p.monthly * 12 - p.yearly)}/year
                    </div>
                  )}
                </div>
                <ul className={cn("relative mt-8 space-y-3 flex-1", p.highlight ? "text-white/85" : "text-foreground")}>
                  {p.features.map((f, j) => (
                    <li key={f + j} className="flex items-start gap-3 text-sm animate-reveal-up" style={{ animationDelay: `${j * 60}ms` }}>
                      <span className={cn("mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                        p.highlight ? "bg-white/10" : "bg-accent/15")}>
                        <Check className={cn("h-3 w-3", p.highlight ? "text-white" : "text-accent")} />
                      </span>
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={cn("relative mt-8 h-12 group/btn",
                    p.highlight ? "bg-white text-foreground hover:bg-white/90" : "bg-gradient-brand text-white")}
                  asChild
                >
                  <Link to={p.cta_link || "/contact"}>
                    {p.cta_label || "Get started"}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        {page.footnote && (
          <Reveal>
            <p className="mt-10 text-center text-sm text-muted-foreground">{page.footnote}</p>
          </Reveal>
        )}
      </section>

      {/* SOCIAL PROOF STRIP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, value: "1,200+", label: "Clients delivered" },
              { icon: Rocket, value: "8,400+", label: "Projects shipped" },
              { icon: ShieldCheck, value: "99.99%", label: "Infra uptime" },
              { icon: TrendingUp, value: "92%", label: "Repeat customers" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center transition-all hover:-translate-y-1">
                <s.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold tracking-tight tabular-nums">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* MEMBERSHIPS */}
      <MembershipsSection />

      {/* COMPARISON */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Care plan comparison</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Every deliverable, side by side.</h2>
            <p className="mt-4 text-muted-foreground">See exactly what's included so you can choose with confidence.</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="text-left font-semibold p-5">Included</th>
                  {page.plans.map((p) => (
                    <th key={p.name} className="text-center font-semibold p-5">
                      <div className={cn("inline-block", p.highlight && "text-primary")}>{p.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Website hosting, SSL & daily backups", true, true, true],
                  ["Business email domain", true, true, true],
                  ["Monthly updates & maintenance", true, true, true],
                  ["GST invoices & Razorpay/UPI billing", true, true, true],
                  ["Uptime monitoring (basic)", true, true, true],
                  ["Server / VPS management (Linux + Windows)", false, true, true],
                  ["Router · switch · firewall AMC", false, true, true],
                  ["CCTV / NVR / IP camera support", false, true, true],
                  ["Priority ticket SLA + phone support", false, true, true],
                  ["Discount on new projects", "10%", "20%", "Custom"],
                  ["Dedicated engineer + success manager", false, false, true],
                  ["24×7 NOC monitoring & incident response", false, false, true],
                  ["On-site visits + leased-line escalations", false, false, true],
                  ["Custom software / IT retainer", false, false, true],
                  ["99.99% uptime SLA + DPA", false, false, true],
                ].map((row, ri) => (
                  <tr key={ri} className="border-b border-border/60 last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="p-5 font-medium">{row[0]}</td>
                    {row.slice(1).map((v, i) => (
                      <td key={i} className="p-5 text-center">
                        {typeof v === "string" ? (
                          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5">{v}</span>
                        ) : v ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/15">
                            <Check className="h-3.5 w-3.5 text-accent" />
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24">
        <Reveal>
          <div className="text-center mb-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Questions, answered</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Frequently asked</h2>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant h-full">
                <div className="flex items-start gap-3">
                  <span className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white shrink-0">
                    <HelpCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{f.q}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-dashboard p-10 lg:p-16 text-white shadow-elegant">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-brand opacity-40 blur-3xl animate-hero-blob" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-green opacity-30 blur-3xl animate-hero-blob" style={{ animationDelay: "-4s" }} />
            <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
              <div>
                <Badge className="bg-white/10 text-white border-white/20 mb-5">Not sure which plan?</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Book a 20-minute strategy call.</h2>
                <p className="mt-4 text-white/70 leading-relaxed max-w-xl">
                  We'll map your workflow, recommend the right plan, and migrate you from WHMCS, Zoho or spreadsheets in under a week — with a signed SLA.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" className="bg-white text-foreground hover:bg-white/90 h-12 px-6" asChild>
                    <Link to="/contact">Book a demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white bg-transparent hover:bg-white/10 h-12 px-6" asChild>
                    <Link to="/products">Browse products</Link>
                  </Button>
                </div>
              </div>
              <div className="glass !bg-white/5 border-white/10 rounded-2xl p-6">
                <div className="text-xs uppercase tracking-wider text-white/60 mb-4">What you get on the call</div>
                <ul className="space-y-3 text-sm">
                  {[
                    "Custom pricing recommendation",
                    "Live product walkthrough",
                    "Migration plan & timeline",
                    "GST-compliant proposal by email",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary-glow mt-0.5 shrink-0" />
                      <span className="text-white/85">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

function MembershipsSection() {
  const list = useServerFn(listTiers);
  const { data: tiers = [] } = useQuery({
    queryKey: ["pricing-tiers-public"],
    queryFn: () => list() as any,
    staleTime: 60_000,
  });

  const visible = (tiers as any[]).filter((t) => t.slug !== "free");
  if (visible.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-1.5">
            <Crown className="h-3.5 w-3.5" /> Client memberships
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            Unlock priority delivery, discounts & premium content.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Memberships stack on top of any care plan — get discounted rates on new projects, priority engineer time, exclusive courses and premium digital downloads inside your portal.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((t: any, i: number) => {
          const from = t.gradient_from ?? "#64748b";
          const to = t.gradient_to ?? "#475569";
          const highlight = (t.rank ?? 0) >= 2;
          return (
            <Reveal key={t.id} delay={i * 80}>
              <div
                className="group relative h-full rounded-3xl p-7 flex flex-col bg-card border shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant"
                style={{ borderColor: `${from}55` }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${from}12, ${to}08)` }}
                />
                <div className="relative flex items-start justify-between">
                  <MembershipBadge slug={t.slug} name={t.name} gradientFrom={from} gradientTo={to} size="lg" />
                  {highlight && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-white rounded-full px-2 py-0.5"
                          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
                      Popular
                    </span>
                  )}
                </div>
                {t.description && (
                  <p className="relative mt-4 text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                )}
                <div className="relative mt-5">
                  <span className="text-4xl font-black tracking-tight">₹{Number(t.price_inr).toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    / {t.duration_days ? `${t.duration_days} days` : "lifetime"}
                  </span>
                </div>
                <ul className="relative mt-5 space-y-2 text-sm flex-1">
                  {(t.features ?? []).map((f: string, j: number) => (
                    <li key={j} className="flex items-start gap-2">
                      <span
                        className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `linear-gradient(135deg, ${from}30, ${to}20)` }}
                      >
                        <Check className="h-3 w-3" style={{ color: from }} />
                      </span>
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="relative mt-6 w-full text-white h-11"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                  asChild
                >
                  <Link to="/portal/membership">
                    Get {t.name} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
