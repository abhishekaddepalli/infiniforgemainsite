import { useMemo, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
  useNodesInitialized,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type WFTone = "saffron" | "green" | "brand" | "blue" | "violet" | "rose";

const toneGrad: Record<WFTone, string> = {
  saffron: "from-amber-500 to-orange-600",
  green: "from-emerald-500 to-teal-600",
  brand: "from-primary to-accent",
  blue: "from-sky-500 to-indigo-600",
  violet: "from-fuchsia-500 to-purple-600",
  rose: "from-rose-500 to-pink-600",
};

const toneStroke: Record<WFTone, string> = {
  saffron: "rgb(245,158,11)",
  green: "rgb(16,185,129)",
  brand: "rgb(234,88,12)",
  blue: "rgb(14,165,233)",
  violet: "rgb(217,70,239)",
  rose: "rgb(244,63,94)",
};

/* ---------- Node kinds ---------- */

type BaseData = {
  label: string;
  sub?: string;
  icon: LucideIcon;
  tone: WFTone;
};

function NodeHandles() {
  return (
    <>
      <Handle type="target" position={Position.Left} id="l" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Right} id="r" className="!opacity-0 !w-1 !h-1" />
      <Handle type="target" position={Position.Top} id="t" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} id="b" className="!opacity-0 !w-1 !h-1" />
    </>
  );
}

function DeviceNode({ data }: NodeProps) {
  const d = data as unknown as BaseData;
  const Icon = d.icon;
  return (
    <div className="group relative">
      <NodeHandles />
      <div
        className={cn("w-[160px] rounded-2xl p-[1.5px] bg-gradient-to-br transition-transform group-hover:scale-[1.05]", toneGrad[d.tone])}
        style={{ boxShadow: `0 14px 40px -18px ${toneStroke[d.tone]}` }}
      >
        <div className="rounded-[15px] bg-card/95 backdrop-blur px-3 py-2.5 flex items-center gap-2.5">
          <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br shadow", toneGrad[d.tone])}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-bold leading-tight truncate">{d.label}</div>
            {d.sub && <div className="text-[10px] text-muted-foreground leading-tight truncate mt-0.5">{d.sub}</div>}
          </div>
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16,185,129)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function HubNode({ data }: NodeProps) {
  const d = data as unknown as BaseData;
  const Icon = d.icon;
  return (
    <div className="group relative">
      <NodeHandles />
      <div
        className={cn("w-[180px] rounded-2xl p-[2px] bg-gradient-to-br animate-shimmer", toneGrad[d.tone])}
        style={{ boxShadow: `0 20px 60px -20px ${toneStroke[d.tone]}, 0 0 0 4px ${toneStroke[d.tone]}22` }}
      >
        <div className="rounded-[14px] bg-card/95 backdrop-blur px-3 py-3 flex flex-col items-center gap-1.5 text-center">
          <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg", toneGrad[d.tone])}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-[13px] font-black leading-tight">{d.label}</div>
          {d.sub && <div className="text-[10px] text-muted-foreground leading-tight">{d.sub}</div>}
        </div>
      </div>
    </div>
  );
}

function ChipNode({ data }: NodeProps) {
  const d = data as unknown as BaseData;
  const Icon = d.icon;
  return (
    <div className="group relative">
      <NodeHandles />
      <div
        className={cn("inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 bg-background/95 backdrop-blur border transition-transform group-hover:scale-105")}
        style={{ borderColor: `${toneStroke[d.tone]}66`, boxShadow: `0 8px 24px -14px ${toneStroke[d.tone]}` }}
      >
        <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center text-white bg-gradient-to-br", toneGrad[d.tone])}>
          <Icon className="h-3 w-3" />
        </div>
        <span className="text-[11px] font-semibold whitespace-nowrap pr-1">{d.label}</span>
      </div>
    </div>
  );
}

function CloudNode({ data }: NodeProps) {
  const d = data as unknown as BaseData;
  const Icon = d.icon;
  return (
    <div className="group relative">
      <NodeHandles />
      <div
        className="w-[150px] rounded-[28px] px-3 py-2.5 border-2 border-dashed flex items-center gap-2 bg-background/60 backdrop-blur transition-transform group-hover:scale-[1.05]"
        style={{ borderColor: `${toneStroke[d.tone]}88` }}
      >
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0 bg-gradient-to-br", toneGrad[d.tone])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[11.5px] font-bold leading-tight truncate">{d.label}</div>
          {d.sub && <div className="text-[9.5px] text-muted-foreground leading-tight truncate">{d.sub}</div>}
        </div>
      </div>
    </div>
  );
}

const nodeTypes = { device: DeviceNode, hub: HubNode, chip: ChipNode, cloud: CloudNode };

/* ---------- Topology types ---------- */

export type DiagramNode = {
  id: string;
  kind: "device" | "hub" | "chip" | "cloud";
  label: string;
  sub?: string;
  icon: LucideIcon;
  x: number;
  y: number;
  /** vertical layer index for mobile stacking (0 = top) */
  layer?: number;
};

export type DiagramEdge = {
  from: string;
  to: string;
  /** handles: 'r'->'l' default; use 'b'/'t' for vertical */
  fromSide?: "r" | "b";
  toSide?: "l" | "t";
  dashed?: boolean;
  label?: string;
};

export type Topology = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

/* ---------- Component ---------- */

export function WorkflowReactFlow({
  topology,
  tone,
}: {
  topology: Topology;
  tone: WFTone;
}) {
  const isMobile = useIsMobile();
  const stroke = toneStroke[tone];

  const { nodes, edges } = useMemo(() => {
    // Mobile: auto-relayout by layer into a vertical stack
    let placed: DiagramNode[] = topology.nodes;
    if (isMobile) {
      const byLayer = new Map<number, DiagramNode[]>();
      topology.nodes.forEach((n) => {
        const l = n.layer ?? 0;
        if (!byLayer.has(l)) byLayer.set(l, []);
        byLayer.get(l)!.push(n);
      });
      const layers = [...byLayer.keys()].sort((a, b) => a - b);
      const rowH = 100;
      const colW = 180;
      placed = [];
      let y = 0;
      layers.forEach((l) => {
        const items = byLayer.get(l)!;
        const perRow = items.length <= 2 ? items.length : 2;
        items.forEach((n, i) => {
          const row = Math.floor(i / perRow);
          const col = i % perRow;
          const totalCols = Math.min(perRow, items.length - row * perRow);
          const offsetX = (2 - totalCols) * (colW / 2);
          placed.push({ ...n, x: offsetX + col * colW, y: y + row * rowH });
        });
        const rows = Math.ceil(items.length / perRow);
        y += rows * rowH + 20;
      });
    }

    const dims: Record<string, { w: number; h: number }> = {
      device: { w: 160, h: 60 },
      hub:    { w: 180, h: 84 },
      chip:   { w: 140, h: 34 },
      cloud:  { w: 150, h: 56 },
    };

    const ns: Node[] = placed.map((n) => ({
      id: n.id,
      type: n.kind,
      position: { x: n.x, y: n.y },
      data: { label: n.label, sub: n.sub, icon: n.icon, tone },
      width: dims[n.kind].w,
      height: dims[n.kind].h,
      draggable: false,
      selectable: false,
    }));

    const es: Edge[] = topology.edges.map((e, i) => {
      // On mobile, force vertical handles for readable flow
      const fs = isMobile ? "b" : e.fromSide;
      const ts = isMobile ? "t" : e.toSide;
      return {
        id: `e-${i}-${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        sourceHandle: fs === "b" ? "b" : "r",
        targetHandle: ts === "t" ? "t" : "l",
        type: "smoothstep",
        animated: true,
        label: e.label,
        labelStyle: { fontSize: 10, fontWeight: 600, fill: stroke },
        labelBgStyle: { fill: "hsl(var(--background))", fillOpacity: 0.85 },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 6,
        style: {
          stroke,
          strokeWidth: 2,
          opacity: 0.85,
          strokeDasharray: e.dashed ? "6 4" : undefined,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 16, height: 16 },
      } as Edge;
    });

    return { nodes: ns, edges: es };
  }, [topology, tone, isMobile, stroke]);

  const height = isMobile ? 620 : 500;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden ring-1 ring-border/60 bg-gradient-to-br from-background/60 to-background/20"
      style={{ height }}
    >
      <ReactFlowProvider>
        <FlowInner nodes={nodes} edges={edges} />
      </ReactFlowProvider>
    </div>
  );
}

function FlowInner({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const rf = useReactFlow();
  const initialized = useNodesInitialized();

  useEffect(() => {
    if (!initialized) return;
    const t = setTimeout(() => {
      rf.fitView({ padding: 0.22, minZoom: 0.15, maxZoom: 1.2, duration: 300 });
    }, 30);
    return () => clearTimeout(t);
  }, [initialized, nodes, rf]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.22, minZoom: 0.15, maxZoom: 1.2 }}
      minZoom={0.15}
      maxZoom={1.5}
      defaultEdgeOptions={{ type: "smoothstep" }}
      proOptions={{ hideAttribution: true }}
      panOnDrag={false}
      panOnScroll={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="opacity-40" />
    </ReactFlow>
  );
}
