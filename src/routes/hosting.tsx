import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Server, Cloud, Cpu, HardDrive, Wifi, Shield, Zap, Globe, Check,
  Sparkles, Database, Rocket, Activity, Users, ArrowRight, MessageCircle,
  MapPin, Gauge, Lock, Layers, Radio, Terminal, GitBranch, Boxes,
  Star, Quote, Headphones, Timer, RefreshCw, Award, TrendingUp,
  Minus,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatINR } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import {
  buildWhatsAppLink,
  formatOrderMessage,
  getWhatsAppConfig,
  type WhatsAppLineItem,
} from "@/lib/whatsapp";

import { toast } from "sonner";
import { useCms } from "@/lib/cms";

// WhatsApp number is fully driven by Site CMS → "WhatsApp ordering" (with
// an optional per-page override in the "Hosting page" CMS tab). If neither
// is configured we fall back to the footer phone number, and finally show
// a helpful toast so ordering never silently goes to a wrong number.

function makeRef() {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HOST-${y}${m}${day}-${rand}`;
}

type HostWABtnProps = {
  items: WhatsAppLineItem[];
  total_inr?: number;
  note?: string;
  label?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
};

function HostingWhatsAppButton({
  items, total_inr, note, label = "Order on WhatsApp",
  className, variant = "default", size = "default",
}: HostWABtnProps) {
  const cms = useCms("hosting_page");
  const wa = useCms("whatsapp");
  const footer = useCms("footer");
  function handleClick() {
    const cfg = getWhatsAppConfig();
    const fromFooter = (footer.phone || "").replace(/[^\d+]/g, "");
    const number = (cms.whatsapp_number || wa.number || cfg.wa_ordering_number || fromFooter || "").trim();
    if (!number) {
      toast.error("WhatsApp number is not configured yet. Set it in Admin → Site CMS → WhatsApp ordering.");
      return;
    }
    if (wa.enabled === false) {
      toast.error("WhatsApp ordering is currently disabled. Enable it in Admin → Site CMS → WhatsApp ordering.");
      return;
    }
    const reference = makeRef();
    const message = formatOrderMessage(
      cms.whatsapp_greeting || wa.greeting || cfg.wa_ordering_greeting || "Hello Infiniforge Hosting 👋",
      items,
      { total_inr, note, template: wa.template ?? cfg.wa_ordering_template ?? "premium", reference },
    );


    // Do not auto-create a WhatsApp order record on click — opening
    // WhatsApp does not confirm the customer actually sent the enquiry.
    toast.success(`Opening WhatsApp · ${reference}`);
    window.open(buildWhatsAppLink(number, message), "_blank", "noopener,noreferrer");
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleClick}
      className={cn("gap-2", className)}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </Button>
  );
}

export const Route = createFileRoute("/hosting")({
  head: () => ({
    meta: [
      { title: "Hosting & VPS Plans — Infiniforge Technologies" },
      { name: "description", content: "Blazing-fast SSD shared hosting, cloud VPS, dedicated servers and reseller plans in India. Live pricing calculator, 99.99% uptime, 24×7 NOC support." },
      { property: "og:title", content: "Hosting & VPS Plans — Infiniforge" },
      { property: "og:description", content: "Enterprise-grade cloud hosting, VPS and dedicated servers with live calculator and instant WhatsApp enquiry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HostingPage,
});

type Plan = {
  id: string;
  name: string;
  tag?: string;
  tagline: string;
  price: number;
  cpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  sites: string;
  icon: typeof Server;
  gradient: string;
  featured?: boolean;
};

const SHARED: Plan[] = [
  { id: "shared-starter", name: "Starter", tagline: "Perfect for personal sites & blogs", price: 149, cpu: 1, ram: 1, storage: 20, bandwidth: 500, sites: "1 website", icon: Globe, gradient: "from-sky-500 to-cyan-500" },
  { id: "shared-business", name: "Business", tag: "Popular", tagline: "Small businesses & portfolios", price: 349, cpu: 2, ram: 2, storage: 60, bandwidth: 1000, sites: "10 websites", icon: Cloud, gradient: "from-orange-500 to-pink-500", featured: true },
  { id: "shared-pro", name: "Pro", tagline: "Agencies & high-traffic sites", price: 799, cpu: 4, ram: 4, storage: 150, bandwidth: 3000, sites: "Unlimited", icon: Sparkles, gradient: "from-violet-500 to-fuchsia-500" },
];

const VPS: Plan[] = [
  { id: "vps-lite", name: "VPS Lite", tagline: "Dev & staging workloads", price: 599, cpu: 2, ram: 4, storage: 80, bandwidth: 2000, sites: "Root access", icon: Server, gradient: "from-emerald-500 to-teal-500" },
  { id: "vps-pro", name: "VPS Pro", tag: "Best Value", tagline: "Production apps & SaaS", price: 1799, cpu: 4, ram: 8, storage: 160, bandwidth: 4000, sites: "Snapshots included", icon: Cpu, gradient: "from-blue-600 to-indigo-600", featured: true },
  { id: "vps-scale", name: "VPS Scale", tagline: "High-traffic apps & DB nodes", price: 3499, cpu: 8, ram: 16, storage: 320, bandwidth: 8000, sites: "Private network", icon: Rocket, gradient: "from-rose-500 to-orange-500" },
];

const DEDICATED: Plan[] = [
  { id: "ded-e3", name: "Dedicated E3", tagline: "Entry dedicated hardware", price: 8999, cpu: 4, ram: 32, storage: 1000, bandwidth: 10000, sites: "Full hardware", icon: HardDrive, gradient: "from-slate-600 to-slate-800" },
  { id: "ded-xeon", name: "Dedicated Xeon", tag: "Enterprise", tagline: "Enterprise mission-critical", price: 15999, cpu: 12, ram: 64, storage: 2000, bandwidth: 20000, sites: "IPMI + iLO", icon: Database, gradient: "from-amber-600 to-red-600", featured: true },
  { id: "ded-epyc", name: "Dedicated EPYC", tagline: "AI, GPU & big-data workloads", price: 24999, cpu: 24, ram: 128, storage: 4000, bandwidth: 40000, sites: "10 Gbps uplink", icon: Zap, gradient: "from-purple-600 to-indigo-700" },
];

const FEATURES = [
  { icon: Shield, title: "DDoS Protection", desc: "Enterprise-grade mitigation on every plan." },
  { icon: Activity, title: "99.99% Uptime SLA", desc: "Redundant power, network & storage." },
  { icon: Zap, title: "NVMe SSD Storage", desc: "Blazing-fast reads with LiteSpeed cache." },
  { icon: Users, title: "24×7 NOC Support", desc: "Real engineers on WhatsApp & tickets." },
  { icon: Globe, title: "Free .in Domain", desc: "Included on annual billing plans." },
  { icon: Database, title: "Daily Backups", desc: "One-click restore for 30 days." },
];

function PlanCard({ plan }: { plan: Plan }) {
  const Icon = plan.icon;
  return (
    <Card
      className={cn(
        "relative overflow-hidden p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group",
        plan.featured && "ring-2 ring-primary shadow-elegant scale-[1.02]",
      )}
    >
      <div className={cn("absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 bg-gradient-to-br", plan.gradient)} />
      {plan.tag && (
        <Badge className="absolute top-4 right-4 bg-gradient-brand text-white border-0">{plan.tag}</Badge>
      )}
      <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-elegant mb-4", plan.gradient)}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold">{plan.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{plan.tagline}</p>
      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-3xl font-extrabold tracking-tight">{formatINR(plan.price)}</span>
        <span className="text-sm text-muted-foreground">/mo</span>
      </div>
      <ul className="space-y-2 text-sm mb-6">
        <li className="flex items-center gap-2"><Cpu className="h-4 w-4 text-primary" /> {plan.cpu} vCPU cores</li>
        <li className="flex items-center gap-2"><Server className="h-4 w-4 text-primary" /> {plan.ram} GB RAM</li>
        <li className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-primary" /> {plan.storage} GB NVMe SSD</li>
        <li className="flex items-center gap-2"><Wifi className="h-4 w-4 text-primary" /> {plan.bandwidth} GB Bandwidth</li>
        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {plan.sites}</li>
      </ul>
      <div className="flex flex-col gap-2">
        <Button asChild className="w-full bg-gradient-brand text-white">
          <Link to="/checkout">Order now</Link>
        </Button>
        <HostingWhatsAppButton
          items={[{ name: `${plan.name} Hosting`, qty: 1, price_inr: plan.price }]}
          total_inr={plan.price}
          variant="outline"
          className="w-full border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10"
          label="Enquire on WhatsApp"
        />
      </div>
    </Card>
  );
}

function Calculator() {
  const [cpu, setCpu] = useState(4);
  const [ram, setRam] = useState(8);
  const [storage, setStorage] = useState(160);
  const [bandwidth, setBandwidth] = useState(4000);
  const [backups, setBackups] = useState(true);
  const [managed, setManaged] = useState(true);

  const price = useMemo(() => {
    let p = 199;
    p += cpu * 120;
    p += ram * 80;
    p += storage * 2.2;
    p += bandwidth * 0.08;
    if (backups) p += 199;
    if (managed) p += 999;
    return Math.round(p);
  }, [cpu, ram, storage, bandwidth, backups, managed]);

  const spec = `${cpu} vCPU · ${ram} GB RAM · ${storage} GB NVMe · ${bandwidth} GB BW${backups ? " · Backups" : ""}${managed ? " · Managed" : ""}`;

  const bar = (val: number, max: number, gradient: string) => (
    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
      <div
        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", gradient)}
        style={{ width: `${Math.min(100, (val / max) * 100)}%` }}
      />
    </div>
  );

  return (
    <Card className="relative overflow-hidden p-6 md:p-8">
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-brand opacity-10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-500 opacity-10 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">Build your own</Badge>
            <h3 className="text-2xl md:text-3xl font-bold">Custom Cloud Configurator</h3>
            <p className="text-muted-foreground">Slide to size — pricing updates live. Send the exact spec to us on WhatsApp with one tap.</p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="flex items-center gap-2"><Cpu className="h-4 w-4 text-primary" /> vCPU Cores</span><span className="font-semibold">{cpu}</span></div>
              <Slider value={[cpu]} onValueChange={(v) => setCpu(v[0])} min={1} max={32} step={1} />
              {bar(cpu, 32, "from-sky-500 to-indigo-500")}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="flex items-center gap-2"><Server className="h-4 w-4 text-primary" /> RAM (GB)</span><span className="font-semibold">{ram} GB</span></div>
              <Slider value={[ram]} onValueChange={(v) => setRam(v[0])} min={1} max={128} step={1} />
              {bar(ram, 128, "from-emerald-500 to-teal-500")}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-primary" /> NVMe Storage (GB)</span><span className="font-semibold">{storage} GB</span></div>
              <Slider value={[storage]} onValueChange={(v) => setStorage(v[0])} min={20} max={2000} step={20} />
              {bar(storage, 2000, "from-orange-500 to-pink-500")}
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2"><span className="flex items-center gap-2"><Wifi className="h-4 w-4 text-primary" /> Bandwidth (GB)</span><span className="font-semibold">{bandwidth} GB</span></div>
              <Slider value={[bandwidth]} onValueChange={(v) => setBandwidth(v[0])} min={500} max={20000} step={500} />
              {bar(bandwidth, 20000, "from-violet-500 to-fuchsia-500")}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => setBackups(!backups)} className={cn("px-3 py-2 rounded-lg text-sm border transition-all", backups ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-secondary")}>
                <Check className={cn("h-3.5 w-3.5 inline mr-1.5", !backups && "opacity-30")} /> Daily Backups
              </button>
              <button onClick={() => setManaged(!managed)} className={cn("px-3 py-2 rounded-lg text-sm border transition-all", managed ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-secondary")}>
                <Shield className={cn("h-3.5 w-3.5 inline mr-1.5", !managed && "opacity-30")} /> Fully Managed
              </button>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl border bg-gradient-to-br from-background to-secondary/40 p-5 sm:p-6 flex flex-col">
          <div className="text-sm text-muted-foreground">Estimated monthly</div>
          <div className="mt-1 text-4xl font-extrabold bg-gradient-brand bg-clip-text text-transparent">
            {formatINR(price)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">+ GST · Billed monthly</div>
          <div className="mt-5 p-3 rounded-lg bg-background/60 border text-xs leading-relaxed">
            <div className="font-semibold mb-1">Your configuration</div>
            {spec}
          </div>
          <div className="mt-auto pt-5 space-y-2">
            <HostingWhatsAppButton
              items={[{ name: `Custom Cloud (${spec})`, qty: 1, price_inr: price }]}
              total_inr={price}
              variant="default"
              className="w-full bg-[#25D366] hover:bg-[#1ebe5c] text-white border-0 shadow-elegant animate-glow-pulse"
              label="Send spec on WhatsApp"
            />
            <Button asChild variant="outline" className="w-full">
              <Link to="/contact">Request quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

type DC = {
  code: string;
  city: string;
  country: string;
  coords: [number, number]; // [lng, lat]
  tier: string;
  latency: string;
  status: "live" | "soon";
};

const DATA_CENTERS: DC[] = [
  { code: "BOM", city: "Mumbai",     country: "India",     coords: [72.8777, 19.0760],  tier: "Tier IV",  latency: "<20ms",  status: "live" },
  { code: "DEL", city: "New Delhi",  country: "India",     coords: [77.1025, 28.7041],  tier: "Tier IV",  latency: "<25ms",  status: "live" },
  { code: "BLR", city: "Bengaluru",  country: "India",     coords: [77.5946, 12.9716],  tier: "Tier III", latency: "<30ms",  status: "live" },
  { code: "SIN", city: "Singapore",  country: "Singapore", coords: [103.8198, 1.3521],  tier: "Tier IV",  latency: "<60ms",  status: "live" },
  { code: "DXB", city: "Dubai",      country: "UAE",       coords: [55.2708, 25.2048],  tier: "Tier IV",  latency: "<45ms",  status: "live" },
  { code: "FRA", city: "Frankfurt",  country: "Germany",   coords: [8.6821, 50.1109],   tier: "Tier IV",  latency: "<110ms", status: "live" },
  { code: "LHR", city: "London",     country: "UK",        coords: [-0.1276, 51.5074],  tier: "Tier III", latency: "<120ms", status: "live" },
  { code: "NYC", city: "New York",   country: "USA",       coords: [-74.0060, 40.7128], tier: "Tier IV",  latency: "<180ms", status: "live" },
  { code: "SFO", city: "San Jose",   country: "USA",       coords: [-121.8863, 37.3382],tier: "Tier III", latency: "<220ms", status: "live" },
  { code: "TYO", city: "Tokyo",      country: "Japan",     coords: [139.6917, 35.6895], tier: "Tier IV",  latency: "<150ms", status: "soon" },
  { code: "SYD", city: "Sydney",     country: "Australia", coords: [151.2093, -33.8688],tier: "Tier III", latency: "<140ms", status: "soon" },
  { code: "GRU", city: "São Paulo",  country: "Brazil",    coords: [-46.6333, -23.5505],tier: "Tier III", latency: "<260ms", status: "soon" },
];

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function DataCentersMap() {
  const [active, setActive] = useState<DC>(DATA_CENTERS[0]);
  // Lazy-load react-simple-maps only on the client to avoid SSR issues
  const [MapMod, setMapMod] = useState<any>(null);
  useEffect(() => {
    let mounted = true;
    import("react-simple-maps").then((m) => { if (mounted) setMapMod(m); });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/30" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-gradient-brand text-white border-0">🌍 Global Edge Network</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">12 Data Centers. One Cloud.</h2>
          <p className="text-muted-foreground mt-2">Deploy where your users are — Tier III &amp; IV facilities across 4 continents.</p>
        </div>

        <Card className="relative overflow-hidden p-3 sm:p-4 md:p-8 border-primary/20">
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
               style={{ backgroundImage: "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Map */}
            <div className="relative aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-elegant">
              {/* soft glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,153,51,0.18),transparent_60%)] pointer-events-none z-10" />
              {/* dot overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                   style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />

              {MapMod ? (
                <MapMod.ComposableMap
                  projection="geoEqualEarth"
                  projectionConfig={{ scale: 155 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <MapMod.Geographies geography={GEO_URL}>
                    {({ geographies }: any) =>
                      geographies.map((geo: any) => {
                        const hasDC = DATA_CENTERS.some(
                          (d) => d.country === geo.properties.name ||
                                 (d.country === "USA" && geo.properties.name === "United States of America") ||
                                 (d.country === "UK" && geo.properties.name === "United Kingdom")
                        );
                        return (
                          <MapMod.Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={hasDC ? "rgba(255,153,51,0.22)" : "rgba(148,163,184,0.10)"}
                            stroke="rgba(148,163,184,0.35)"
                            strokeWidth={0.4}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "rgba(255,153,51,0.35)", outline: "none" },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </MapMod.Geographies>

                  {/* Connection arcs from active DC */}
                  {DATA_CENTERS.filter((d) => d.code !== active.code).map((d) => {
                    // simple straight line in projection space using Line component
                    return (
                      <MapMod.Line
                        key={d.code}
                        from={active.coords}
                        to={d.coords}
                        stroke="rgba(255,153,51,0.55)"
                        strokeWidth={0.6}
                        strokeLinecap="round"
                        strokeDasharray="2,2"
                        className="animate-pulse"
                      />
                    );
                  })}

                  {DATA_CENTERS.map((d) => {
                    const isActive = d.code === active.code;
                    const color = isActive ? "hsl(var(--primary))" : d.status === "live" ? "#34d399" : "#fbbf24";
                    return (
                      <MapMod.Marker key={d.code} coordinates={d.coords} onClick={() => setActive(d)} style={{ default: { cursor: "pointer" } }}>
                        {/* pulse ring */}
                        <circle r={isActive ? 8 : 6} fill={color} fillOpacity={0.25}>
                          <animate attributeName="r" values={`${isActive ? 8 : 6};${isActive ? 16 : 12};${isActive ? 8 : 6}`} dur="2s" repeatCount="indefinite" />
                          <animate attributeName="fill-opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle r={isActive ? 4 : 3} fill={color} stroke="#fff" strokeWidth={0.8} />
                        <text
                          textAnchor="middle"
                          y={-8}
                          style={{
                            fontFamily: "inherit",
                            fontSize: isActive ? 7 : 5.5,
                            fontWeight: 700,
                            fill: "#fff",
                            paintOrder: "stroke",
                            stroke: "rgba(0,0,0,0.65)",
                            strokeWidth: 1.5,
                            strokeLinejoin: "round",
                          }}
                        >
                          {d.city}
                        </text>
                      </MapMod.Marker>
                    );
                  })}
                </MapMod.ComposableMap>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/60 text-xs">Loading world map…</div>
              )}

              {/* Legend */}
              <div className="absolute bottom-3 left-3 z-20 flex gap-3 text-[10px] text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded-md">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Live</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Coming soon</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Selected</span>
              </div>
              <div className="absolute top-3 right-3 z-20 text-[10px] text-white/80 bg-black/40 backdrop-blur px-2 py-1 rounded-md">
                {DATA_CENTERS.length} regions · 4 continents
              </div>
            </div>

            {/* Active DC panel */}
            <div className="relative rounded-2xl border bg-gradient-to-br from-background to-secondary/40 p-4 sm:p-5 flex flex-col">
              <Badge variant="secondary" className="w-fit mb-2">{active.tier}</Badge>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <MapPin className="h-5 w-5 text-primary" />
                {active.city}
              </div>
              <div className="text-sm text-muted-foreground">{active.country} · {active.code}</div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/60 p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Latency</div>
                  <div className="font-bold text-lg flex items-center gap-1"><Gauge className="h-4 w-4 text-primary" /> {active.latency}</div>
                </div>
                <div className="rounded-lg bg-secondary/60 p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Uptime</div>
                  <div className="font-bold text-lg flex items-center gap-1"><Activity className="h-4 w-4 text-emerald-500" /> 99.99%</div>
                </div>
                <div className="rounded-lg bg-secondary/60 p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Network</div>
                  <div className="font-bold text-lg flex items-center gap-1"><Radio className="h-4 w-4 text-primary" /> 10 Gbps</div>
                </div>
                <div className="rounded-lg bg-secondary/60 p-3">
                  <div className="text-[10px] uppercase text-muted-foreground">Security</div>
                  <div className="font-bold text-lg flex items-center gap-1"><Lock className="h-4 w-4 text-primary" /> ISO 27001</div>
                </div>
              </div>

              {/* Live traffic bars */}
              <div className="mt-4">
                <div className="text-[10px] uppercase text-muted-foreground mb-2">Live traffic</div>
                <div className="flex items-end gap-1 h-12">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary to-accent rounded-sm animate-hero-bar origin-bottom"
                      style={{ animationDelay: `${i * 0.08}s`, animationDuration: `${1.2 + (i % 5) * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4">
                <HostingWhatsAppButton
                  items={[{ name: `Provision in ${active.city} (${active.code})`, qty: 1 }]}
                  className="w-full bg-[#25D366] hover:bg-[#1ebe5c] text-white border-0"
                  label={`Deploy in ${active.city}`}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* DC chip row */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {DATA_CENTERS.map((d) => (
            <button
              key={d.code}
              onClick={() => setActive(d)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover-scale",
                d.code === active.code ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-secondary",
                d.status === "soon" && "opacity-75",
              )}
            >
              {d.code} · {d.city}, {d.country} {d.status === "soon" && "•"}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const TECH_STACK = [
  { name: "LiteSpeed",  icon: Zap },
  { name: "cPanel",     icon: Layers },
  { name: "Docker",     icon: Boxes },
  { name: "Kubernetes", icon: Cloud },
  { name: "Node.js",    icon: Terminal },
  { name: "Nginx",      icon: Server },
  { name: "MySQL",      icon: Database },
  { name: "Redis",      icon: Activity },
  { name: "PostgreSQL", icon: Database },
  { name: "Git",        icon: GitBranch },
  { name: "WordPress",  icon: Globe },
  { name: "Cloudflare", icon: Shield },
];

function TechMarquee() {
  return (
    <section className="py-12 border-y bg-gradient-to-r from-secondary/20 via-transparent to-secondary/20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">
          Pre-tuned for the stacks you already love
        </p>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex gap-8 animate-[hostmarquee_28s_linear_infinite] whitespace-nowrap will-change-transform">
            {[...TECH_STACK, ...TECH_STACK].map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="flex items-center gap-2 px-5 py-3 rounded-full border bg-card/60 backdrop-blur shrink-0 hover-scale">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{t.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`@keyframes hostmarquee { to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}

// ─── Live deployment terminal ───────────────────────────────────────────────
const TERMINAL_LINES = [
  { t: "$ infiniforge deploy --plan vps-pro --region BOM", c: "text-white" },
  { t: "✓ Provisioning NVMe volume (160 GB)…", c: "text-emerald-400" },
  { t: "✓ Booting Ubuntu 24.04 LTS on 4 vCPU · 8 GB RAM", c: "text-emerald-400" },
  { t: "✓ Attaching 10 Gbps uplink · anti-DDoS layer", c: "text-emerald-400" },
  { t: "✓ Installing LiteSpeed + Redis + PostgreSQL", c: "text-emerald-400" },
  { t: "→ Issuing free Let's Encrypt SSL…", c: "text-sky-400" },
  { t: "✓ Live at https://your-app.infiniforge.cloud", c: "text-primary" },
  { t: "  Total time: 47 seconds ⚡", c: "text-amber-300" },
];

function LiveTerminal() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % (TERMINAL_LINES.length + 3)), 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 shadow-2xl overflow-hidden max-w-2xl mx-auto text-left">
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-slate-900/80 border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shrink-0" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
        <span className="ml-2 sm:ml-3 text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">infiniforge@cloud ~ deploy.sh</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          LIVE
        </span>
      </div>
      <div className="p-3 sm:p-5 font-mono text-[10.5px] sm:text-[12.5px] leading-relaxed min-h-[220px] overflow-x-auto">
        {TERMINAL_LINES.slice(0, Math.min(step, TERMINAL_LINES.length)).map((l, i) => (
          <div key={i} className={cn("animate-fade-in whitespace-nowrap sm:whitespace-normal", l.c)}>{l.t}</div>
        ))}
        {step < TERMINAL_LINES.length && (
          <div className="text-white/60">
            <span className="inline-block w-2 h-4 bg-primary animate-pulse align-middle" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Live status ticker ─────────────────────────────────────────────────────
function StatusTicker() {
  const [t, setT] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setT(Date.now()), 2000);
    return () => clearInterval(id);
  }, []);
  const now = new Date(t);
  const rows = DATA_CENTERS.slice(0, 6).map((d, i) => ({
    ...d,
    ping: 8 + ((t / 1000 + i * 13) % 40 | 0),
    load: 20 + ((t / 700 + i * 17) % 55 | 0),
  }));
  return (
    <section className="py-10 border-y bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-semibold">All systems operational</span>
            <span className="text-xs text-muted-foreground">· updated {now.toLocaleTimeString()}</span>
          </div>
          <a href="#datacenters" className="text-xs font-medium text-primary hover:underline story-link">View full status →</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {rows.map((r) => (
            <div key={r.code} className="rounded-xl border bg-card p-3 hover-scale">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">{r.code}</span>
                <span className="text-emerald-500">● {r.ping}ms</span>
              </div>
              <div className="text-[11px] text-muted-foreground truncate">{r.city}</div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-primary to-fuchsia-500 transition-all duration-1000" style={{ width: `${r.load}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Comparison table ───────────────────────────────────────────────────────
const COMPARE_ROWS: { label: string; shared: boolean | string; vps: boolean | string; dedicated: boolean | string }[] = [
  { label: "NVMe SSD storage",       shared: true,  vps: true,  dedicated: true },
  { label: "Free .in domain",        shared: true,  vps: true,  dedicated: true },
  { label: "Free SSL (Let's Encrypt)", shared: true, vps: true, dedicated: true },
  { label: "Root / SSH access",      shared: false, vps: true,  dedicated: true },
  { label: "Dedicated IP",           shared: false, vps: true,  dedicated: true },
  { label: "Snapshots & backups",    shared: "Daily", vps: "Hourly", dedicated: "Custom" },
  { label: "DDoS protection",        shared: "Basic", vps: "Advanced", dedicated: "Enterprise" },
  { label: "Uptime SLA",             shared: "99.9%", vps: "99.99%", dedicated: "99.995%" },
  { label: "IPMI / iLO access",      shared: false, vps: false, dedicated: true },
  { label: "Custom kernel",          shared: false, vps: true,  dedicated: true },
];

function ComparisonTable() {
  const cell = (v: boolean | string) =>
    v === true ? <Check className="mx-auto h-5 w-5 text-emerald-500" />
    : v === false ? <Minus className="mx-auto h-5 w-5 text-muted-foreground/50" />
    : <span className="font-semibold text-sm">{v}</span>;
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">Side-by-side</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Which plan is right for you?</h2>
          <p className="text-muted-foreground mt-2">Compare shared, VPS and dedicated at a glance.</p>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="text-left px-3 sm:px-5 py-4 font-semibold">Feature</th>
                  <th className="text-center px-3 sm:px-5 py-4 font-semibold">
                    <Cloud className="mx-auto h-5 w-5 text-sky-500 mb-1" /> Shared
                  </th>
                  <th className="text-center px-3 sm:px-5 py-4 font-semibold bg-primary/5">
                    <Server className="mx-auto h-5 w-5 text-primary mb-1" /> Cloud VPS
                    <div className="text-[10px] font-normal text-primary mt-0.5">MOST POPULAR</div>
                  </th>
                  <th className="text-center px-3 sm:px-5 py-4 font-semibold">
                    <HardDrive className="mx-auto h-5 w-5 text-amber-600 mb-1" /> Dedicated
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r, i) => (
                  <tr key={r.label} className={cn("border-t transition-colors hover:bg-secondary/30", i % 2 === 1 && "bg-secondary/10")}>
                    <td className="px-3 sm:px-5 py-3.5 font-medium">{r.label}</td>
                    <td className="px-3 sm:px-5 py-3.5 text-center">{cell(r.shared)}</td>
                    <td className="px-3 sm:px-5 py-3.5 text-center bg-primary/5">{cell(r.vps)}</td>
                    <td className="px-3 sm:px-5 py-3.5 text-center">{cell(r.dedicated)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden text-center text-[11px] text-muted-foreground py-2 border-t">← swipe to compare →</div>
        </Card>
      </div>
    </section>
  );
}

// ─── Migration steps ────────────────────────────────────────────────────────
const MIGRATION_STEPS = [
  { icon: MessageCircle, title: "Ping us on WhatsApp", desc: "Share your current hosting details — no forms, no calls." },
  { icon: RefreshCw,     title: "We migrate everything",    desc: "Files, databases, emails, DNS — moved by our engineers." },
  { icon: Shield,        title: "Zero-downtime cutover",    desc: "We test on staging, then flip DNS at your convenience." },
  { icon: Rocket,        title: "Live in 24 hours",         desc: "Faster site, lower bill, and full 30-day money-back." },
];

function MigrationSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-secondary/30 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge className="mb-3 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0">✨ Free white-glove migration</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Move to Infiniforge in 4 steps</h2>
          <p className="text-muted-foreground mt-2">On any plan. No credit card. No downtime. No cost.</p>
        </div>
        <div className="relative grid gap-6 md:grid-cols-4">
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {MIGRATION_STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="relative text-center animate-reveal-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="relative mx-auto h-16 w-16 rounded-2xl bg-gradient-brand text-white flex items-center justify-center shadow-elegant animate-glow-pulse">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border-2 border-primary text-xs font-bold flex items-center justify-center text-primary">{i + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <HostingWhatsAppButton
            items={[{ name: "Free hosting migration", qty: 1 }]}
            note="I would like a free migration from my current hosting."
            className="bg-[#25D366] hover:bg-[#1ebe5c] text-white border-0 shadow-elegant animate-glow-pulse"
            label="Start free migration on WhatsApp"
            size="lg"
          />
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Rahul Sharma",  role: "Founder, Kirana.io",       quote: "Moved 12 client sites overnight. Page loads dropped from 3.2s to 0.7s. My bill dropped 40%.", avatar: "RS", rating: 5 },
  { name: "Priya Menon",   role: "CTO, Nexbill SaaS",        quote: "The VPS Pro handles 40k daily users effortlessly. Their NOC replied on WhatsApp in 90 seconds at 2am.", avatar: "PM", rating: 5 },
  { name: "Arjun Kapoor",  role: "Agency Owner, Pixelcraft", quote: "Reseller panel is the cleanest I've seen. White-label branding, per-client resource limits — everything just works.", avatar: "AK", rating: 5 },
  { name: "Sneha Iyer",    role: "Ops Head, LogiTrack",      quote: "Dedicated EPYC + 10 Gbps uplink powers our route-optimisation. Zero downtime in 14 months.", avatar: "SI", rating: 5 },
];

function Testimonials() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
            <span className="text-sm font-semibold">4.9 / 5 · 2,400+ businesses</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Trusted by founders & agencies</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <Card key={t.name} className="p-6 relative overflow-hidden group hover-scale animate-reveal-up" style={{ animationDelay: `${i * 80}ms` }}>
              <Quote className="absolute -top-2 -right-2 h-20 w-20 text-primary/5" />
              <div className="flex gap-0.5 mb-3">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 pt-4 border-t flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-brand text-white flex items-center justify-center text-xs font-bold shadow-elegant">{t.avatar}</div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Do you offer a money-back guarantee?", a: "Yes — every shared, VPS and dedicated plan comes with a 30-day no-questions-asked refund. Domain renewals and third-party licenses are non-refundable." },
  { q: "How fast can you migrate my existing website?", a: "Most WordPress or PHP sites are migrated within 4-6 hours. Complex apps with custom stacks are typically live within 24 hours, with zero downtime." },
  { q: "Which control panel do you provide?", a: "Shared and reseller plans include cPanel or DirectAdmin. VPS and dedicated plans support cPanel, Plesk, CyberPanel or plain SSH — your choice." },
  { q: "Can I upgrade my plan later?", a: "Absolutely. Scale CPU, RAM and storage anytime — most upgrades apply within minutes with no downtime and pro-rated billing." },
  { q: "Do you charge for SSL, backups or DDoS protection?", a: "No. Free Let's Encrypt SSL, daily backups (30-day retention) and enterprise DDoS protection are included on every plan." },
  { q: "Where are your servers physically located?", a: "We operate from 12 Tier III & IV facilities across Mumbai, Delhi, Bengaluru, Singapore, Dubai, Frankfurt, London, New York, San Jose and more." },
];

function FAQSection() {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">FAQ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Answers before you ask</h2>
          <p className="text-muted-foreground mt-2">Still curious? Ping us on WhatsApp — we reply in minutes.</p>
        </div>
        <Card className="p-2 md:p-4">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`i-${i}`} className="border-b last:border-0">
                <AccordionTrigger className="text-left font-semibold hover:no-underline px-3">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed px-3">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </section>
  );
}

// ─── Trust bar ──────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Award,       label: "ISO 27001 Certified" },
  { icon: Shield,      label: "PCI-DSS Compliant" },
  { icon: Timer,       label: "30-day Money-back" },
  { icon: Headphones,  label: "24×7 NOC Support" },
  { icon: TrendingUp,  label: "99.99% Uptime SLA" },
];

function TrustBar() {
  return (
    <div className="mx-auto max-w-6xl px-4 mt-10">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-80">
        {TRUST_BADGES.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground animate-reveal-up" style={{ animationDelay: `${i * 60}ms` }}>
              <Icon className="h-4 w-4 text-primary" />
              {b.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HostingPage() {
  const cms = useCms("hosting_page");
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-brand opacity-20 blur-3xl animate-hero-blob" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 opacity-20 blur-3xl animate-hero-float-slow" />
          <div className="absolute inset-0 opacity-[0.04]"
               style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        </div>

        {/* Orbiting icons */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative h-[520px] w-[520px]">
            {[Server, Cloud, Database, Cpu, Shield, Globe].map((Ic, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 -ml-6 -mt-6 h-12 w-12 rounded-2xl glass shadow-elegant flex items-center justify-center animate-hero-orbit"
                style={{ ["--r" as any]: `${210 + (i % 2) * 40}px`, animationDelay: `${i * -3}s`, animationDuration: `${18 + i * 2}s` }}
              >
                <Ic className="h-5 w-5 text-primary" />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center animate-fade-in relative">
          <Badge className="mb-4 bg-gradient-brand text-white border-0 animate-glow-pulse">{cms.badge}</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            {cms.title} <span className="bg-gradient-brand bg-clip-text text-transparent animate-gradient">{cms.title_gradient}</span>
          </h1>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {cms.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 max-w-md sm:max-w-none mx-auto">
            <Button size="lg" className="bg-gradient-brand text-white shadow-elegant hover-scale animate-glow-pulse w-full sm:w-auto" asChild>
              <a href={cms.cta_primary.link}>{cms.cta_primary.label} <ArrowRight className="h-4 w-4 ml-1" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <a href={cms.cta_secondary.link}>{cms.cta_secondary.label}</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto border-emerald-500/40 text-emerald-700 dark:text-emerald-400">
              <a href={cms.cta_tertiary.link}><MapPin className="h-4 w-4 mr-1" /> {cms.cta_tertiary.label}</a>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {cms.stats.map((s, i) => (
              <div
                key={s.label + i}
                className="rounded-xl border bg-card/60 backdrop-blur px-4 py-3 hover-scale animate-reveal-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-2xl font-extrabold bg-gradient-brand bg-clip-text text-transparent">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <TrustBar />

          <div className="mt-14 relative">
            <LiveTerminal />
          </div>
        </div>
      </section>

      <StatusTicker />

      <TechMarquee />

      <div id="datacenters">
        <DataCentersMap />
      </div>


      {/* Plans */}
      <section id="plans" className="py-16 md:py-20 bg-gradient-to-b from-transparent to-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Pick the perfect plan</h2>
            <p className="text-muted-foreground mt-2">Shared, VPS or Dedicated — scale anytime with zero downtime.</p>
          </div>

          <Tabs defaultValue="vps" className="w-full">
            <TabsList className="mx-auto flex w-full max-w-md h-auto">
              <TabsTrigger value="shared" className="flex-1 text-xs sm:text-sm py-2">Shared</TabsTrigger>
              <TabsTrigger value="vps" className="flex-1 text-xs sm:text-sm py-2">Cloud VPS</TabsTrigger>
              <TabsTrigger value="dedicated" className="flex-1 text-xs sm:text-sm py-2">Dedicated</TabsTrigger>
            </TabsList>
            {[
              { v: "shared", plans: SHARED },
              { v: "vps", plans: VPS },
              { v: "dedicated", plans: DEDICATED },
            ].map((t) => (
              <TabsContent key={t.v} value={t.v} className="mt-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                  {t.plans.map((p) => <PlanCard key={p.id} plan={p} />)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <ComparisonTable />

      {/* Calculator */}
      <section id="calculator" className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Calculator />
        </div>
      </section>

      <MigrationSection />


      {/* Features */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Everything included, nothing hidden</h2>
            <p className="text-muted-foreground mt-2">Enterprise features at startup pricing.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="p-5 hover-scale group">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-elegant mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related categories */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Complete your stack</h2>
            <p className="text-muted-foreground mt-2">Bundle domains, SSL & managed services with your hosting.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { slug: "domains", title: "Domains & SSL", desc: ".com, .in & wildcard SSL", icon: Globe, gradient: "from-sky-500 to-blue-600" },
              { slug: "it-services", title: "Managed IT", desc: "Server admin & security", icon: Shield, gradient: "from-emerald-500 to-teal-600" },
              { slug: "monitoring", title: "Monitoring & AMC", desc: "24×7 uptime alerts", icon: Activity, gradient: "from-orange-500 to-red-500" },
              { slug: "saas", title: "SaaS Applications", desc: "ERP, CRM & more", icon: Rocket, gradient: "from-fuchsia-500 to-violet-600" },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.slug}
                  to="/products"
                  search={{ category: c.slug } as any}
                  className="group block"
                >
                  <Card className="p-5 h-full transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-elegant mb-3 group-hover:scale-110 transition-transform", c.gradient)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold flex items-center justify-between">
                      {c.title}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Testimonials />

      <FAQSection />

      {/* CTA */}
      <section className="py-16 md:py-24">

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden p-6 sm:p-8 md:p-12 text-center border-0 bg-gradient-brand shadow-elegant animate-gradient">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/20 blur-3xl animate-hero-blob" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-hero-float-slow" />
            <div className="relative">
              <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur">💬 Instant WhatsApp support</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">{cms.final_cta_title}</h2>
              <p className="mt-3 text-white/95 max-w-2xl mx-auto">{cms.final_cta_subtitle}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <HostingWhatsAppButton
                  items={[{ name: "Hosting consultation", qty: 1 }]}
                  variant="default"
                  className="bg-[#25D366] hover:bg-[#1ebe5c] text-white border-0 shadow-elegant animate-glow-pulse"
                  label="Chat on WhatsApp"
                />
                <Button asChild variant="outline" className="bg-white/10 text-white border-white/60 hover:bg-white/20 hover:text-white backdrop-blur">
                  <Link to="/contact">Request callback</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
