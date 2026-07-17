import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Globe, Router, GraduationCap, Camera, Package, Code2,
  Cpu, Wifi, Activity, Sparkles, Server, ShieldCheck,
  Cloud, HardDrive, Headphones, Store, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "saffron" | "green" | "sky" | "violet" | "core";

const toneGrad: Record<Tone, string> = {
  saffron: "from-amber-500 to-orange-600",
  green: "from-emerald-500 to-teal-600",
  sky: "from-sky-500 to-indigo-600",
  violet: "from-fuchsia-500 to-purple-600",
  core: "from-primary via-accent to-primary",
};

const toneStroke: Record<Tone, string> = {
  saffron: "rgb(245,158,11)",
  green: "rgb(16,185,129)",
  sky: "rgb(14,165,233)",
  violet: "rgb(217,70,239)",
  core: "hsl(var(--primary))",
};

type ServiceData = {
  label: string;
  sub: string;
  icon: LucideIcon;
  tone: Tone;
  kind: "service" | "hub" | "core";
};

function ServiceNode({ id, data }: NodeProps) {
  const d = data as unknown as ServiceData;
  const Icon = d.icon;
  // Deterministic per-node duration to avoid SSR/CSR hydration mismatch
  const seed = String(id ?? d.label ?? "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const duration = 5 + ((seed % 30) / 10);
  return (
    <div className="group relative animate-hero-float" style={{ animationDuration: `${duration}s` }}>

      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
      <div
        className={cn(
          "relative w-[172px] rounded-2xl p-[1.5px] bg-gradient-to-br transition-all duration-500 group-hover:scale-[1.06] group-hover:-translate-y-1",
          toneGrad[d.tone],
        )}
        style={{ boxShadow: `0 12px 40px -14px ${toneStroke[d.tone]}` }}
      >
        <div className="rounded-[15px] bg-card/95 backdrop-blur px-3.5 py-3 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer pointer-events-none" />
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br shadow-lg", toneGrad[d.tone])}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold leading-tight truncate">{d.label}</div>
            <div className="text-[10px] text-muted-foreground leading-tight truncate mt-0.5">{d.sub}</div>
          </div>
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16,185,129)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function HubNode({ data }: NodeProps) {
  const d = data as unknown as ServiceData;
  const Icon = d.icon;
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
      <div className={cn("relative h-[92px] w-[92px] rounded-2xl bg-gradient-to-br text-white flex flex-col items-center justify-center shadow-xl border-2 border-background", toneGrad[d.tone])}>
        <div className={cn("absolute -inset-2 rounded-2xl blur-xl opacity-40 bg-gradient-to-br", toneGrad[d.tone])} />
        <Icon className="h-5 w-5 mb-0.5 relative" />
        <div className="text-[10px] font-bold relative">{d.label}</div>
        <div className="text-[8px] opacity-80 relative">{d.sub}</div>
      </div>
    </div>
  );
}

function CoreNode({ data }: NodeProps) {
  const d = data as unknown as ServiceData;
  const Icon = d.icon;
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
      {/* Pulse rings */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-hero-pulse-ring" />
      <div className="absolute inset-0 rounded-full border-2 border-accent/40 animate-hero-pulse-ring" style={{ animationDelay: "0.9s" }} />
      <div className="absolute -inset-10 rounded-full bg-gradient-brand/30 blur-3xl animate-pulse pointer-events-none" />
      {/* Rotating dashed rings */}
      <div className="absolute -inset-6 rounded-full border border-dashed border-primary/50 animate-hero-spin-slow pointer-events-none" />
      <div className="absolute -inset-12 rounded-full border border-dashed border-accent/40 pointer-events-none" style={{ animation: "hero-spin-slow 32s linear infinite reverse" }} />
      {/* Core disc */}
      <div className="relative h-[148px] w-[148px] rounded-full bg-gradient-brand text-white flex flex-col items-center justify-center shadow-elegant border-4 border-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_55%)]" />
        <Icon className="h-8 w-8 mb-1 relative" />
        <div className="text-sm font-bold relative">{d.label}</div>
        <div className="text-[10px] opacity-90 relative">{d.sub}</div>
        <div className="mt-1 flex items-center gap-1 relative">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgb(110,231,183)] animate-pulse" />
          <span className="text-[9px] uppercase tracking-wider opacity-90">Live</span>
        </div>
      </div>
    </div>
  );
}

const nodeTypes = { service: ServiceNode, hub: HubNode, core: CoreNode };

type HubDef = { id: string; label: string; sub: string; icon: LucideIcon; tone: Tone; services: Array<{ id: string; label: string; sub: string; icon: LucideIcon }> };

const HUBS: HubDef[] = [
  {
    id: "hub-cloud", label: "Cloud", sub: "& Hosting", icon: Cloud, tone: "saffron",
    services: [
      { id: "vps", label: "VPS & Servers", sub: "KVM · NVMe · India POPs", icon: Server },
      { id: "domains", label: "Domains & SSL", sub: "Registrar · Wildcard", icon: Globe },
      { id: "backup", label: "Backups & DR", sub: "Snapshots · Off-site", icon: HardDrive },
    ],
  },
  {
    id: "hub-network", label: "Network", sub: "& ISP", icon: Wifi, tone: "green",
    services: [
      { id: "wisp", label: "WISP Deployment", sub: "Hotspots · Multi-WAN", icon: Router },
      { id: "internet", label: "Internet Services", sub: "Broadband · Leased", icon: Wifi },
      { id: "cctv", label: "CCTV & NVR", sub: "IP surveillance", icon: Camera },
    ],
  },
  {
    id: "hub-software", label: "Software", sub: "& SaaS", icon: Code2, tone: "sky",
    services: [
      { id: "web", label: "Websites & Apps", sub: "React · Next · WP", icon: Code2 },
      { id: "saas", label: "SaaS Subscriptions", sub: "POS · ERP · CRM", icon: Cpu },
      { id: "stores", label: "E-Commerce Stores", sub: "Ready storefronts", icon: Store },
    ],
  },
  {
    id: "hub-support", label: "Support", sub: "& NOC", icon: ShieldCheck, tone: "violet",
    services: [
      { id: "noc", label: "24×7 Monitoring", sub: "NOC · Alerts", icon: Activity },
      { id: "helpdesk", label: "IT Helpdesk", sub: "On-site + Remote", icon: Headphones },
      { id: "courses", label: "Courses & Training", sub: "LMS · Certification", icon: GraduationCap },
    ],
  },
];

export function EcosystemFlow() {
  const { nodes, edges } = useMemo(() => {
    const cx = 520;
    const cy = 360;
    const hubR = 210;
    const leafR = 200;

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Core
    nodes.push({
      id: "core",
      type: "core",
      position: { x: cx - 74, y: cy - 74 },
      data: { label: "Infiniforge", sub: "Unified Cloud", icon: Zap, tone: "core", kind: "core" },
      draggable: false, selectable: false,
    });

    HUBS.forEach((hub, i) => {
      const angle = (i / HUBS.length) * Math.PI * 2 - Math.PI / 2;
      const hx = cx + Math.cos(angle) * hubR;
      const hy = cy + Math.sin(angle) * hubR;

      nodes.push({
        id: hub.id,
        type: "hub",
        position: { x: hx - 46, y: hy - 46 },
        data: { label: hub.label, sub: hub.sub, icon: hub.icon, tone: hub.tone, kind: "hub" },
        draggable: false, selectable: false,
      });

      edges.push({
        id: `core-${hub.id}`,
        source: "core", target: hub.id, animated: true,
        style: { stroke: toneStroke[hub.tone], strokeWidth: 2, opacity: 0.85 },
        markerEnd: { type: MarkerType.ArrowClosed, color: toneStroke[hub.tone] },
      });

      // Fan out leaves
      const spread = Math.PI / 2.2;
      hub.services.forEach((s, j) => {
        const t = hub.services.length === 1 ? 0 : (j / (hub.services.length - 1)) - 0.5;
        const a = angle + t * spread;
        const lx = hx + Math.cos(a) * leafR;
        const ly = hy + Math.sin(a) * leafR;
        nodes.push({
          id: s.id,
          type: "service",
          position: { x: lx - 86, y: ly - 30 },
          data: { label: s.label, sub: s.sub, icon: s.icon, tone: hub.tone, kind: "service" },
          draggable: false, selectable: false,
        });
        edges.push({
          id: `${hub.id}-${s.id}`,
          source: hub.id, target: s.id, animated: true,
          style: { stroke: toneStroke[hub.tone], strokeWidth: 1.4, opacity: 0.55, strokeDasharray: "4 3" },
        });
      });
    });

    return { nodes, edges };
  }, []);

  return (
    <div className="relative rounded-2xl sm:rounded-3xl border border-border bg-gradient-to-br from-card via-card to-secondary/40 shadow-elegant overflow-hidden">
      {/* Ambient glow layers */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.12),transparent_60%)]" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-hero-blob pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-hero-blob pointer-events-none" style={{ animationDelay: "3s" }} />

      {/* Top status bar */}
      <div className="relative flex items-center justify-between gap-3 px-3 sm:px-5 py-3 border-b border-border/60 bg-background/40 backdrop-blur">
        <div className="flex items-center gap-2 text-xs font-medium min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-foreground truncate">Infiniforge Ecosystem</span>
          <span className="text-muted-foreground hidden sm:inline">· Live Map</span>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Cloud</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Network</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500" /> Software</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-fuchsia-500" /> Support</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground shrink-0">
          <Sparkles className="h-3 w-3 text-primary" />
          <span>99.98% uptime</span>
        </div>
      </div>

      {/* Desktop / tablet: interactive flow map */}
      <div className="hidden md:block h-[560px] lg:h-[640px] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnDrag={false}
          panOnScroll={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="hsl(var(--muted-foreground) / 0.18)" />
        </ReactFlow>
      </div>

      {/* Mobile: compact hub + services stack (fully visible, no clipping) */}
      <div className="md:hidden relative p-4 sm:p-5">
        <div className="relative mx-auto mb-5 flex flex-col items-center">
          <div className="absolute -inset-3 rounded-full bg-gradient-brand/25 blur-2xl animate-pulse pointer-events-none" />
          <div className="relative h-20 w-20 rounded-full bg-gradient-brand text-white flex flex-col items-center justify-center shadow-elegant border-4 border-background">
            <Zap className="h-5 w-5" />
            <div className="text-[11px] font-bold mt-0.5">Infiniforge</div>
            <div className="text-[8px] opacity-90 -mt-0.5">Unified Cloud</div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live · connected
          </div>
        </div>

        <div className="space-y-4">
          {HUBS.map((hub) => {
            const HubIcon = hub.icon;
            return (
              <div key={hub.id} className="relative rounded-2xl border border-border bg-card/80 backdrop-blur p-4 shadow-card">
                <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br opacity-[0.08] pointer-events-none", toneGrad[hub.tone])} />
                <div className="relative flex items-center gap-3 mb-3">
                  <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md bg-gradient-to-br", toneGrad[hub.tone])}>
                    <HubIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight truncate">{hub.label} <span className="text-muted-foreground font-normal">{hub.sub}</span></div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{hub.services.length} services · orchestrated</div>
                  </div>
                </div>
                <div className="relative grid grid-cols-1 gap-2">
                  {hub.services.map((s) => {
                    const SIcon = s.icon;
                    return (
                      <div key={s.id} className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-background/60 px-2.5 py-2">
                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0 bg-gradient-to-br", toneGrad[hub.tone])}>
                          <SIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[12px] font-medium leading-tight truncate">{s.label}</div>
                          <div className="text-[10px] text-muted-foreground leading-tight truncate mt-0.5">{s.sub}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
