import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Rocket, ShieldCheck, Cpu, Cloud, ArrowRight, Sparkles, Server, Zap, Activity, Terminal, Boxes, Globe2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { WhatsAppOrderButton } from "@/components/WhatsAppOrderButton";
import { Reveal } from "@/components/site/Reveal";
import { formatINR } from "@/lib/catalog";
import { useCms, type DeploymentApp } from "@/lib/cms";

export const Route = createFileRoute("/deployments")({
  head: () => ({
    meta: [
      { title: "One-Click App Deployments — Infiniforge Technologies" },
      { name: "description", content: "Deploy Coolify, n8n, WordPress, ERPNext, Odoo, Nextcloud, Ghost, Metabase, Supabase self-host and 70+ prebuilt applications on managed VPS with 24×7 support." },
      { property: "og:title", content: "One-Click App Deployments — Infiniforge" },
      { property: "og:description", content: "Managed deployments of 70+ popular open-source and SaaS applications on your own cloud with backups, SSL and monitoring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeploymentsPage,
});

function DeploymentsPage() {
  const cms = useCms("deployments_page");
  const [q, setQ] = useState("");
  const [stack, setStack] = useState<string>("all");

  const apps = (cms.apps ?? []).filter((a) => a.enabled !== false);
  const stacks = cms.stacks ?? [{ key: "all", name: "All" }];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return apps.filter((a) => {
      if (stack !== "all" && a.stack !== stack) return false;
      if (!query) return true;
      return [a.name, a.tagline, a.description, ...(a.tags ?? [])].join(" ").toLowerCase().includes(query);
    });
  }, [q, stack, apps]);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-hero-blob pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl animate-hero-blob pointer-events-none" style={{ animationDelay: "-4s" }} />
        <div className="absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(circle_at_20%_10%,theme(colors.primary/25),transparent_40%),radial-gradient(circle_at_80%_60%,theme(colors.accent/25),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <Reveal>
            <Badge variant="outline" className="rounded-full border-accent/30 bg-accent/10 text-accent">
              <Rocket className="mr-1.5 h-3.5 w-3.5" /> {cms.eyebrow}
            </Badge>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">
              {cms.title}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {cms.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="bg-gradient-brand text-white shadow-elegant" asChild>
                <Link to="/contact">Talk to a deployment engineer <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <WhatsAppOrderButton
                size="lg"
                variant="outline"
                surface="header"
                label="Order on WhatsApp"
                items={[{ name: "Managed App Deployment — Consultation" }]}
                note="I'd like a quote for prebuilt app deployment."
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> {apps.length}+ apps ready</span>
              <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-primary" /> Mumbai · Delhi · Singapore · Frankfurt</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> GST invoiced</span>
            </div>
          </Reveal>

          {/* Animated hero visual — deploy console */}
          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-md aspect-square">
              {/* Rotating dashed ring */}
              <div className="absolute inset-4 rounded-full border border-dashed border-primary/30 animate-hero-orbit-rev" />
              <div className="absolute inset-14 rounded-full border border-dashed border-accent/30 animate-hero-orbit" />

              {/* Central console */}
              <div className="absolute inset-1/4 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-elegant flex flex-col items-center justify-center p-4">
                <div className="flex items-center gap-1.5 self-start text-[10px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="ml-2 uppercase tracking-wider font-semibold">deploy · live</span>
                </div>
                <div className="mt-2 h-11 w-11 rounded-2xl bg-gradient-brand text-white flex items-center justify-center shadow-elegant animate-glow-pulse">
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="mt-2 text-xs font-semibold">99.98% uptime</div>
                <div className="mt-1 text-[10px] text-muted-foreground">Auto SSL · Backups · NOC</div>
                <div className="mt-2 flex gap-0.5 items-end h-6">
                  {[6, 10, 14, 8, 18, 12, 16, 9, 20, 11].map((h, i) => (
                    <span key={i} className="w-1 rounded-sm bg-gradient-to-t from-primary to-accent" style={{ height: `${h * 4}%`, animation: `hero-float ${2 + (i % 3)}s ease-in-out ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>

              {/* Orbiting app chips */}
              {[
                { i: Boxes, label: "Coolify", angle: 0, delay: "0s" },
                { i: Activity, label: "n8n", angle: 45, delay: "-1s" },
                { i: Server, label: "ERPNext", angle: 90, delay: "-2s" },
                { i: Terminal, label: "Odoo", angle: 135, delay: "-3s" },
                { i: Cloud, label: "Nextcloud", angle: 180, delay: "-4s" },
                { i: Cpu, label: "Supabase", angle: 225, delay: "-5s" },
                { i: Globe2, label: "WordPress", angle: 270, delay: "-6s" },
                { i: Zap, label: "Ghost", angle: 315, delay: "-7s" },
              ].map(({ i: Icon, label, angle, delay }) => {
                const r = 44; // %
                const x = 50 + r * Math.cos((angle * Math.PI) / 180);
                const y = 50 + r * Math.sin((angle * Math.PI) / 180);
                return (
                  <div
                    key={label}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/60 bg-card/90 backdrop-blur px-2 py-1.5 shadow-card flex items-center gap-1.5 animate-hero-float"
                    style={{ left: `${x}%`, top: `${y}%`, animationDelay: delay }}
                  >
                    <span className="h-6 w-6 rounded-md bg-gradient-brand text-white flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[10px] font-semibold">{label}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Feature strip */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Zap, title: "1-click install", desc: "Live in under 30 minutes." },
              { icon: ShieldCheck, title: "Auto SSL & backups", desc: "Let's Encrypt + daily snapshots." },
              { icon: Cpu, title: "Right-sized VPS", desc: "Tuned CPU / RAM / NVMe per app." },
              { icon: Cloud, title: "24×7 NOC", desc: "Uptime, patching & incident response." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-4 flex items-start gap-3 transition-all hover:-translate-y-1 hover:shadow-elegant hover:border-primary/40">
                  <span className="h-10 w-10 shrink-0 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-elegant">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${apps.length}+ apps…`} className="pl-9 h-11 rounded-xl" />
          </div>
          <div className="flex flex-wrap gap-2">
            {stacks.map((s) => {
              const active = s.key === stack;
              return (
                <button
                  key={s.key}
                  onClick={() => setStack(s.key)}
                  className={
                    "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all " +
                    (active
                      ? "bg-gradient-brand text-white border-transparent shadow-elegant"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40")
                  }
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Apps grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-14 text-center text-muted-foreground">
            No apps match your search. Try a different keyword or stack.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 6) * 60}>
                <AppCard app={a} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-border bg-card p-10 lg:p-14 shadow-card">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> How it works
              </Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">From order to live URL — in one afternoon.</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Send us the app, domain and preferred region. We provision a hardened VPS, install and configure the stack, wire up SSL, backups and monitoring, and hand over the credentials.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="bg-gradient-brand text-white" asChild>
                  <Link to="/contact">Get a custom quote</Link>
                </Button>
                <WhatsAppOrderButton
                  surface="header"
                  variant="outline"
                  label="Chat on WhatsApp"
                  items={[{ name: "Deployment enquiry" }]}
                  note="Please share deployment options and pricing."
                />
              </div>
            </div>
            <ol className="space-y-4">
              {[
                { t: "Pick the app & plan", d: `Choose from Coolify, n8n, Odoo, WordPress and ${apps.length}+ more.` },
                { t: "Choose the region & VPS", d: "Mumbai, Delhi, Singapore, Frankfurt or your own cloud." },
                { t: "We install & harden", d: "SSL, firewall, backups, monitoring — production-grade defaults." },
                { t: "Handover & 24×7 support", d: "Root/admin credentials + WhatsApp + ticket support." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <div className="shrink-0 h-9 w-9 rounded-lg bg-gradient-brand text-white flex items-center justify-center font-semibold text-sm">{i + 1}</div>
                  <div>
                    <div className="font-semibold">{s.t}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl bg-gradient-brand p-10 lg:p-14 text-white shadow-elegant relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold">{cms.cta_title}</h3>
              <p className="mt-2 text-white/90 max-w-xl">{cms.cta_subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/contact">Request a custom deployment</Link>
              </Button>
              <WhatsAppOrderButton
                size="lg"
                variant="outline"
                surface="header"
                className="bg-white/10 border-white/40 text-white hover:bg-white/20 hover:text-white"
                label="WhatsApp us"
                items={[{ name: "Custom app deployment" }]}
                note="I have a custom app to deploy."
              />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function AppCard({ app }: { app: DeploymentApp }) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 overflow-hidden">
      <div className={`absolute inset-x-0 -top-24 h-40 bg-gradient-to-br ${app.color} opacity-10 blur-2xl pointer-events-none`} />
      <div className="relative flex items-start justify-between gap-3">
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${app.color} text-white flex items-center justify-center text-2xl shadow-elegant`}>
          <span aria-hidden>{app.emoji}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          {app.popular && <Badge className="bg-primary/15 text-primary border-transparent">Popular</Badge>}
          {app.new && <Badge className="bg-accent/15 text-accent border-transparent">New</Badge>}
        </div>
      </div>
      <div className="relative mt-4">
        <div className="text-base font-semibold flex items-center gap-2">
          {app.name}
          <Server className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{app.tagline}</div>
      </div>
      <p className="relative mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[3.75rem]">{app.description}</p>
      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {(app.tags ?? []).slice(0, 3).map((t) => (
          <span key={t} className="text-[10px] uppercase tracking-wide font-medium bg-secondary text-muted-foreground rounded px-1.5 py-0.5">{t}</span>
        ))}
      </div>
      <div className="relative mt-4 pt-4 border-t border-border flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">From</div>
          <div className="text-base font-bold">{formatINR(app.from_inr)}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
        </div>
        <div className="flex items-center gap-1.5">
          <WhatsAppOrderButton
            size="sm"
            variant="outline"
            surface="product"
            label="WhatsApp"
            items={[{ name: `Deploy: ${app.name}`, qty: 1, price_inr: app.from_inr }]}
            total_inr={app.from_inr}
            note={`Please deploy ${app.name} for me.`}
          />
          <Button size="sm" className="bg-gradient-brand text-white" asChild>
            <Link to="/contact">
              Deploy <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
