import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { $n as Antenna, Bn as Building2, Gn as Bell, Hn as Boxes, Ht as HardDrive, In as Cctv, Jn as Award, Jt as GitBranch, K as Router, Kt as GraduationCap, L as Shield, Ln as Camera, M as Smartphone, Mt as Laptop, O as Star, On as CircleCheck, P as Signal, Pt as KeyRound, St as Mail, Tt as Lock, Un as Bot, V as Server, Vt as Headphones, W as ScrollText, X as Repeat, Xn as ArrowRight, Xt as Gauge, Y as Rocket, Z as RefreshCw, _n as Cpu, _t as MessageCircle, a as Wifi, an as Figma, bn as CodeXml, dn as Earth, dt as Package, en as FingerprintPattern, fn as Download, ft as Network, g as Tv, gn as CreditCard, j as Sparkles, jt as Layers, l as Video, mt as MonitorSmartphone, pn as Database, rn as FileCodeCorner, u as Users, xn as Cloud } from "../_libs/lucide-react.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { t as Reveal } from "./Reveal-CUxnlK3o.mjs";
import { t as useIsMobile } from "./use-mobile-DM96sOa1.mjs";
import { a as index, c as MarkerType, i as ReactFlowProvider, l as Position, n as BackgroundVariant, o as useNodesInitialized, r as Handle, s as useReactFlow, t as Background } from "../_libs/@xyflow/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workflows-YbLhQ6mH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var toneGrad = {
	saffron: "from-amber-500 to-orange-600",
	green: "from-emerald-500 to-teal-600",
	brand: "from-primary to-accent",
	blue: "from-sky-500 to-indigo-600",
	violet: "from-fuchsia-500 to-purple-600",
	rose: "from-rose-500 to-pink-600"
};
var toneStroke = {
	saffron: "rgb(245,158,11)",
	green: "rgb(16,185,129)",
	brand: "rgb(234,88,12)",
	blue: "rgb(14,165,233)",
	violet: "rgb(217,70,239)",
	rose: "rgb(244,63,94)"
};
function NodeHandles() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
			type: "target",
			position: Position.Left,
			id: "l",
			className: "!opacity-0 !w-1 !h-1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
			type: "source",
			position: Position.Right,
			id: "r",
			className: "!opacity-0 !w-1 !h-1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
			type: "target",
			position: Position.Top,
			id: "t",
			className: "!opacity-0 !w-1 !h-1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
			type: "source",
			position: Position.Bottom,
			id: "b",
			className: "!opacity-0 !w-1 !h-1"
		})
	] });
}
function DeviceNode({ data }) {
	const d = data;
	const Icon = d.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeHandles, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("w-[160px] rounded-2xl p-[1.5px] bg-gradient-to-br transition-transform group-hover:scale-[1.05]", toneGrad[d.tone]),
			style: { boxShadow: `0 14px 40px -18px ${toneStroke[d.tone]}` },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[15px] bg-card/95 backdrop-blur px-3 py-2.5 flex items-center gap-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br shadow", toneGrad[d.tone]),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] font-bold leading-tight truncate",
							children: d.label
						}), d.sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground leading-tight truncate mt-0.5",
							children: d.sub
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16,185,129)] animate-pulse" })
				]
			})
		})]
	});
}
function HubNode({ data }) {
	const d = data;
	const Icon = d.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeHandles, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("w-[180px] rounded-2xl p-[2px] bg-gradient-to-br animate-shimmer", toneGrad[d.tone]),
			style: { boxShadow: `0 20px 60px -20px ${toneStroke[d.tone]}, 0 0 0 4px ${toneStroke[d.tone]}22` },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] bg-card/95 backdrop-blur px-3 py-3 flex flex-col items-center gap-1.5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("h-11 w-11 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg", toneGrad[d.tone]),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[13px] font-black leading-tight",
						children: d.label
					}),
					d.sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-muted-foreground leading-tight",
						children: d.sub
					})
				]
			})
		})]
	});
}
function ChipNode({ data }) {
	const d = data;
	const Icon = d.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeHandles, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 bg-background/95 backdrop-blur border transition-transform group-hover:scale-105"),
			style: {
				borderColor: `${toneStroke[d.tone]}66`,
				boxShadow: `0 8px 24px -14px ${toneStroke[d.tone]}`
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-6 w-6 rounded-lg flex items-center justify-center text-white bg-gradient-to-br", toneGrad[d.tone]),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] font-semibold whitespace-nowrap pr-1",
				children: d.label
			})]
		})]
	});
}
function CloudNode({ data }) {
	const d = data;
	const Icon = d.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeHandles, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-[150px] rounded-[28px] px-3 py-2.5 border-2 border-dashed flex items-center gap-2 bg-background/60 backdrop-blur transition-transform group-hover:scale-[1.05]",
			style: { borderColor: `${toneStroke[d.tone]}88` },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0 bg-gradient-to-br", toneGrad[d.tone]),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11.5px] font-bold leading-tight truncate",
					children: d.label
				}), d.sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[9.5px] text-muted-foreground leading-tight truncate",
					children: d.sub
				})]
			})]
		})]
	});
}
var nodeTypes = {
	device: DeviceNode,
	hub: HubNode,
	chip: ChipNode,
	cloud: CloudNode
};
function WorkflowReactFlow({ topology, tone }) {
	const isMobile = useIsMobile();
	const stroke = toneStroke[tone];
	const { nodes, edges } = (0, import_react.useMemo)(() => {
		let placed = topology.nodes;
		if (isMobile) {
			const byLayer = /* @__PURE__ */ new Map();
			topology.nodes.forEach((n) => {
				const l = n.layer ?? 0;
				if (!byLayer.has(l)) byLayer.set(l, []);
				byLayer.get(l).push(n);
			});
			const layers = [...byLayer.keys()].sort((a, b) => a - b);
			const rowH = 100;
			const colW = 180;
			placed = [];
			let y = 0;
			layers.forEach((l) => {
				const items = byLayer.get(l);
				const perRow = items.length <= 2 ? items.length : 2;
				items.forEach((n, i) => {
					const row = Math.floor(i / perRow);
					const col = i % perRow;
					const offsetX = (2 - Math.min(perRow, items.length - row * perRow)) * (colW / 2);
					placed.push({
						...n,
						x: offsetX + col * colW,
						y: y + row * rowH
					});
				});
				const rows = Math.ceil(items.length / perRow);
				y += rows * rowH + 20;
			});
		}
		const dims = {
			device: {
				w: 160,
				h: 60
			},
			hub: {
				w: 180,
				h: 84
			},
			chip: {
				w: 140,
				h: 34
			},
			cloud: {
				w: 150,
				h: 56
			}
		};
		return {
			nodes: placed.map((n) => ({
				id: n.id,
				type: n.kind,
				position: {
					x: n.x,
					y: n.y
				},
				data: {
					label: n.label,
					sub: n.sub,
					icon: n.icon,
					tone
				},
				width: dims[n.kind].w,
				height: dims[n.kind].h,
				draggable: false,
				selectable: false
			})),
			edges: topology.edges.map((e, i) => {
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
					labelStyle: {
						fontSize: 10,
						fontWeight: 600,
						fill: stroke
					},
					labelBgStyle: {
						fill: "hsl(var(--background))",
						fillOpacity: .85
					},
					labelBgPadding: [4, 2],
					labelBgBorderRadius: 6,
					style: {
						stroke,
						strokeWidth: 2,
						opacity: .85,
						strokeDasharray: e.dashed ? "6 4" : void 0
					},
					markerEnd: {
						type: MarkerType.ArrowClosed,
						color: stroke,
						width: 16,
						height: 16
					}
				};
			})
		};
	}, [
		topology,
		tone,
		isMobile,
		stroke
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative w-full rounded-2xl overflow-hidden ring-1 ring-border/60 bg-gradient-to-br from-background/60 to-background/20",
		style: { height: isMobile ? 620 : 500 },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactFlowProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowInner, {
			nodes,
			edges
		}) })
	});
}
function FlowInner({ nodes, edges }) {
	const rf = useReactFlow();
	const initialized = useNodesInitialized();
	(0, import_react.useEffect)(() => {
		if (!initialized) return;
		const t = setTimeout(() => {
			rf.fitView({
				padding: .22,
				minZoom: .15,
				maxZoom: 1.2,
				duration: 300
			});
		}, 30);
		return () => clearTimeout(t);
	}, [
		initialized,
		nodes,
		rf
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(index, {
		nodes,
		edges,
		nodeTypes,
		fitView: true,
		fitViewOptions: {
			padding: .22,
			minZoom: .15,
			maxZoom: 1.2
		},
		minZoom: .15,
		maxZoom: 1.5,
		defaultEdgeOptions: { type: "smoothstep" },
		proOptions: { hideAttribution: true },
		panOnDrag: false,
		panOnScroll: false,
		zoomOnScroll: false,
		zoomOnPinch: false,
		zoomOnDoubleClick: false,
		preventScrolling: false,
		nodesDraggable: false,
		nodesConnectable: false,
		elementsSelectable: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background, {
			variant: BackgroundVariant.Dots,
			gap: 20,
			size: 1,
			className: "opacity-40"
		})
	});
}
var TONE = {
	saffron: {
		chip: "bg-primary/10 text-primary",
		ring: "ring-primary/30",
		dot: "bg-primary",
		grad: "bg-gradient-saffron",
		soft: "from-primary/10 to-primary/0"
	},
	green: {
		chip: "bg-accent/10 text-accent",
		ring: "ring-accent/30",
		dot: "bg-accent",
		grad: "bg-gradient-green",
		soft: "from-accent/10 to-accent/0"
	},
	brand: {
		chip: "bg-primary/10 text-primary",
		ring: "ring-primary/30",
		dot: "bg-primary",
		grad: "bg-gradient-brand",
		soft: "from-primary/10 to-accent/5"
	},
	blue: {
		chip: "bg-info/10 text-info",
		ring: "ring-info/30",
		dot: "bg-info",
		grad: "bg-gradient-brand",
		soft: "from-info/10 to-info/0"
	},
	violet: {
		chip: "bg-primary/10 text-primary",
		ring: "ring-primary/30",
		dot: "bg-primary",
		grad: "bg-gradient-brand",
		soft: "from-primary/10 to-accent/5"
	},
	rose: {
		chip: "bg-destructive/10 text-destructive",
		ring: "ring-destructive/30",
		dot: "bg-destructive",
		grad: "bg-gradient-saffron",
		soft: "from-destructive/10 to-destructive/0"
	}
};
var R = 260;
var FLOWS = [
	{
		id: "isp",
		eyebrow: "Internet Service Provider & Management",
		title: "Multi-WAN + Load Balancing Flow",
		desc: "Blend multiple ISPs into one reliable pipe with automatic failover, per-app routing and live bandwidth shaping.",
		icon: Earth,
		tone: "saffron",
		steps: [
			{
				icon: Earth,
				title: "ISP-1 Fiber",
				desc: "Primary uplink with SLA and static IP."
			},
			{
				icon: Signal,
				title: "ISP-2 5G / Wireless",
				desc: "Diverse-path secondary uplink."
			},
			{
				icon: Router,
				title: "Edge Router + LB",
				desc: "Multi-WAN bonding, weighted balance & health checks."
			},
			{
				icon: Shield,
				title: "Firewall / UTM",
				desc: "IDS/IPS, DNS filter, VPN gateway."
			},
			{
				icon: Network,
				title: "Core Switch",
				desc: "VLANs, QoS for voice & video."
			},
			{
				icon: Wifi,
				title: "APs · Servers · Users",
				desc: "Wi-Fi, wired endpoints & servers."
			}
		],
		perks: [
			"Zero-downtime failover",
			"Per-user bandwidth policy",
			"24×7 NOC monitoring",
			"GST-billed circuits"
		],
		topology: {
			nodes: [
				{
					id: "isp1",
					kind: "cloud",
					label: "ISP-1 Fiber",
					sub: "SLA 99.9%",
					icon: Earth,
					x: 0,
					y: 20,
					layer: 0
				},
				{
					id: "isp2",
					kind: "cloud",
					label: "ISP-2 5G",
					sub: "Wireless",
					icon: Signal,
					x: 0,
					y: 120,
					layer: 0
				},
				{
					id: "isp3",
					kind: "cloud",
					label: "ISP-3 Backup",
					sub: "Failover",
					icon: Antenna,
					x: 0,
					y: 220,
					layer: 0
				},
				{
					id: "router",
					kind: "hub",
					label: "Edge Router + LB",
					sub: "Multi-WAN bond",
					icon: Router,
					x: R,
					y: 110,
					layer: 1
				},
				{
					id: "fw",
					kind: "device",
					label: "Firewall / UTM",
					sub: "IDS · VPN · DNS",
					icon: Shield,
					x: R * 2,
					y: 110,
					layer: 2
				},
				{
					id: "core",
					kind: "hub",
					label: "Core Switch",
					sub: "VLAN · QoS",
					icon: Network,
					x: R * 3,
					y: 110,
					layer: 3
				},
				{
					id: "ap",
					kind: "chip",
					label: "Wi-Fi APs",
					icon: Wifi,
					x: R * 4,
					y: 20,
					layer: 4
				},
				{
					id: "srv",
					kind: "chip",
					label: "Servers",
					icon: Server,
					x: R * 4,
					y: 110,
					layer: 4
				},
				{
					id: "usr",
					kind: "chip",
					label: "Users",
					icon: Users,
					x: R * 4,
					y: 200,
					layer: 4
				}
			],
			edges: [
				{
					from: "isp1",
					to: "router",
					label: "Primary"
				},
				{
					from: "isp2",
					to: "router",
					label: "Secondary"
				},
				{
					from: "isp3",
					to: "router",
					dashed: true,
					label: "Backup"
				},
				{
					from: "router",
					to: "fw"
				},
				{
					from: "fw",
					to: "core"
				},
				{
					from: "core",
					to: "ap"
				},
				{
					from: "core",
					to: "srv"
				},
				{
					from: "core",
					to: "usr"
				}
			]
		}
	},
	{
		id: "lan",
		eyebrow: "Internal LAN & OS Management",
		title: "Endpoint, Server & OS Flow",
		desc: "Structured onboarding for every laptop, desktop and server — from imaging to patching, backups and access control.",
		icon: Network,
		tone: "green",
		steps: [
			{
				icon: FingerprintPattern,
				title: "Identity / AD",
				desc: "Domain, SSO & role-based access."
			},
			{
				icon: Cpu,
				title: "OS Deploy",
				desc: "Windows / Linux golden images via PXE."
			},
			{
				icon: MonitorSmartphone,
				title: "MDM & Agents",
				desc: "Patching, AV & remote support."
			},
			{
				icon: HardDrive,
				title: "Backup",
				desc: "3-2-1 backup with offsite copy."
			},
			{
				icon: Laptop,
				title: "Endpoints",
				desc: "Laptops, desktops, mobiles."
			},
			{
				icon: Server,
				title: "Servers",
				desc: "File, app and DB servers."
			}
		],
		perks: [
			"Asset & license register",
			"Group policies",
			"Encrypted backups",
			"On-site + remote AMC"
		],
		topology: {
			nodes: [
				{
					id: "ad",
					kind: "hub",
					label: "AD / Identity",
					sub: "SSO · RBAC",
					icon: FingerprintPattern,
					x: R,
					y: 130,
					layer: 1
				},
				{
					id: "os",
					kind: "device",
					label: "OS Deploy",
					sub: "Golden images",
					icon: Cpu,
					x: 0,
					y: 30,
					layer: 0
				},
				{
					id: "mdm",
					kind: "device",
					label: "MDM & Patch",
					sub: "Agents · AV",
					icon: MonitorSmartphone,
					x: 0,
					y: 230,
					layer: 0
				},
				{
					id: "backup",
					kind: "device",
					label: "Backup Server",
					sub: "3-2-1 offsite",
					icon: HardDrive,
					x: R * 2,
					y: 30,
					layer: 2
				},
				{
					id: "mon",
					kind: "device",
					label: "Monitoring",
					sub: "Logs · Alerts",
					icon: Gauge,
					x: R * 2,
					y: 230,
					layer: 2
				},
				{
					id: "pc",
					kind: "chip",
					label: "Windows PCs",
					icon: Laptop,
					x: R * 3,
					y: 10,
					layer: 3
				},
				{
					id: "mac",
					kind: "chip",
					label: "MacBooks",
					icon: Laptop,
					x: R * 3,
					y: 80,
					layer: 3
				},
				{
					id: "lin",
					kind: "chip",
					label: "Linux Workstations",
					icon: Cpu,
					x: R * 3,
					y: 150,
					layer: 3
				},
				{
					id: "srv",
					kind: "chip",
					label: "App Servers",
					icon: Server,
					x: R * 3,
					y: 220,
					layer: 3
				},
				{
					id: "db",
					kind: "chip",
					label: "DB Server",
					icon: Database,
					x: R * 3,
					y: 290,
					layer: 3
				}
			],
			edges: [
				{
					from: "os",
					to: "ad"
				},
				{
					from: "mdm",
					to: "ad"
				},
				{
					from: "ad",
					to: "backup"
				},
				{
					from: "ad",
					to: "mon"
				},
				{
					from: "backup",
					to: "pc"
				},
				{
					from: "backup",
					to: "mac"
				},
				{
					from: "backup",
					to: "lin"
				},
				{
					from: "mon",
					to: "srv"
				},
				{
					from: "mon",
					to: "db"
				}
			]
		}
	},
	{
		id: "cctv",
		eyebrow: "CCTV Cameras & DVR Management",
		title: "Surveillance Design → Live Ops",
		desc: "End-to-end CCTV: site design, IP/analog cameras, NVR/DVR storage, remote view and health monitoring.",
		icon: Cctv,
		tone: "rose",
		steps: [
			{
				icon: Camera,
				title: "IP / PTZ Cameras",
				desc: "Indoor, outdoor & PTZ mounting."
			},
			{
				icon: Network,
				title: "PoE Switch",
				desc: "Powered feeds & VLAN isolation."
			},
			{
				icon: Video,
				title: "NVR / DVR",
				desc: "RAID storage + retention policy."
			},
			{
				icon: Cloud,
				title: "Cloud Relay",
				desc: "Secure remote view on mobile."
			},
			{
				icon: Smartphone,
				title: "Mobile View",
				desc: "Push alerts & live playback."
			},
			{
				icon: Tv,
				title: "Control Room",
				desc: "Wall of screens & audit."
			}
		],
		perks: [
			"4K & night vision",
			"Mobile live view",
			"30–90 day retention",
			"AMC & spares"
		],
		topology: {
			nodes: [
				{
					id: "c1",
					kind: "chip",
					label: "Cam 1 · Entrance",
					icon: Camera,
					x: 0,
					y: 0,
					layer: 0
				},
				{
					id: "c2",
					kind: "chip",
					label: "Cam 2 · Parking",
					icon: Camera,
					x: 0,
					y: 70,
					layer: 0
				},
				{
					id: "c3",
					kind: "chip",
					label: "Cam 3 · Corridor",
					icon: Camera,
					x: 0,
					y: 140,
					layer: 0
				},
				{
					id: "c4",
					kind: "chip",
					label: "Cam 4 · PTZ Rooftop",
					icon: Cctv,
					x: 0,
					y: 210,
					layer: 0
				},
				{
					id: "c5",
					kind: "chip",
					label: "Cam 5 · Warehouse",
					icon: Camera,
					x: 0,
					y: 280,
					layer: 0
				},
				{
					id: "poe",
					kind: "device",
					label: "PoE Switch",
					sub: "16 × Gigabit",
					icon: Network,
					x: R,
					y: 140,
					layer: 1
				},
				{
					id: "nvr",
					kind: "hub",
					label: "NVR / DVR",
					sub: "RAID · 30 day",
					icon: Video,
					x: R * 2,
					y: 140,
					layer: 2
				},
				{
					id: "stg",
					kind: "device",
					label: "Storage",
					sub: "8 TB × 4",
					icon: HardDrive,
					x: R * 3,
					y: 30,
					layer: 3
				},
				{
					id: "cloud",
					kind: "cloud",
					label: "Cloud Relay",
					sub: "TLS · Auth",
					icon: Cloud,
					x: R * 3,
					y: 140,
					layer: 3
				},
				{
					id: "mob",
					kind: "chip",
					label: "Mobile View",
					icon: Smartphone,
					x: R * 4,
					y: 60,
					layer: 4
				},
				{
					id: "tv",
					kind: "chip",
					label: "Control Room",
					icon: Tv,
					x: R * 4,
					y: 140,
					layer: 4
				},
				{
					id: "alert",
					kind: "chip",
					label: "Alerts",
					icon: Bell,
					x: R * 4,
					y: 220,
					layer: 4
				}
			],
			edges: [
				{
					from: "c1",
					to: "poe"
				},
				{
					from: "c2",
					to: "poe"
				},
				{
					from: "c3",
					to: "poe"
				},
				{
					from: "c4",
					to: "poe"
				},
				{
					from: "c5",
					to: "poe"
				},
				{
					from: "poe",
					to: "nvr"
				},
				{
					from: "nvr",
					to: "stg"
				},
				{
					from: "nvr",
					to: "cloud"
				},
				{
					from: "cloud",
					to: "mob"
				},
				{
					from: "cloud",
					to: "tv"
				},
				{
					from: "cloud",
					to: "alert"
				}
			]
		}
	},
	{
		id: "servers",
		eyebrow: "File Transfer & Server Provisioning",
		title: "File, Storage & Application Servers",
		desc: "Purpose-built servers for file sharing, SFTP, NAS, backups and internal apps — hardened and monitored.",
		icon: Server,
		tone: "blue",
		steps: [
			{
				icon: Users,
				title: "Users & Teams",
				desc: "Local + remote workforce."
			},
			{
				icon: Lock,
				title: "VPN + Firewall",
				desc: "TLS, MFA, IP allowlist."
			},
			{
				icon: Server,
				title: "File Server",
				desc: "SMB / NFS / SFTP with quotas."
			},
			{
				icon: HardDrive,
				title: "NAS Storage",
				desc: "RAID pools + snapshots."
			},
			{
				icon: Repeat,
				title: "Backup / Sync",
				desc: "Offsite replication."
			},
			{
				icon: Gauge,
				title: "Monitoring",
				desc: "Metrics, logs & alerts 24×7."
			}
		],
		perks: [
			"Encrypted transit",
			"Role-based shares",
			"Versioned backups",
			"SLA-backed uptime"
		],
		topology: {
			nodes: [
				{
					id: "u1",
					kind: "chip",
					label: "Office Users",
					icon: Users,
					x: 0,
					y: 40,
					layer: 0
				},
				{
					id: "u2",
					kind: "chip",
					label: "Remote Users",
					icon: Laptop,
					x: 0,
					y: 130,
					layer: 0
				},
				{
					id: "u3",
					kind: "chip",
					label: "Partners (SFTP)",
					icon: KeyRound,
					x: 0,
					y: 220,
					layer: 0
				},
				{
					id: "vpn",
					kind: "device",
					label: "VPN Gateway",
					sub: "WireGuard · MFA",
					icon: Lock,
					x: R,
					y: 60,
					layer: 1
				},
				{
					id: "fw",
					kind: "device",
					label: "Firewall",
					sub: "TLS · Allowlist",
					icon: Shield,
					x: R,
					y: 190,
					layer: 1
				},
				{
					id: "app",
					kind: "hub",
					label: "File / App Server",
					sub: "SMB · NFS · SFTP",
					icon: Server,
					x: R * 2,
					y: 130,
					layer: 2
				},
				{
					id: "nas",
					kind: "device",
					label: "NAS Storage",
					sub: "RAID · Snapshots",
					icon: HardDrive,
					x: R * 3,
					y: 20,
					layer: 3
				},
				{
					id: "bak",
					kind: "cloud",
					label: "Offsite Backup",
					sub: "S3-compatible",
					icon: Cloud,
					x: R * 3,
					y: 130,
					layer: 3
				},
				{
					id: "mon",
					kind: "device",
					label: "Monitoring",
					sub: "Prom · Alerts",
					icon: Gauge,
					x: R * 3,
					y: 240,
					layer: 3
				}
			],
			edges: [
				{
					from: "u1",
					to: "vpn"
				},
				{
					from: "u2",
					to: "vpn"
				},
				{
					from: "u3",
					to: "fw"
				},
				{
					from: "vpn",
					to: "app"
				},
				{
					from: "fw",
					to: "app"
				},
				{
					from: "app",
					to: "nas"
				},
				{
					from: "app",
					to: "bak",
					dashed: true
				},
				{
					from: "app",
					to: "mon"
				}
			]
		}
	},
	{
		id: "web",
		eyebrow: "Website & Application Development",
		title: "Design → Build → Ship → Grow",
		desc: "Modern websites, portals and web apps for Enterprises, Schools, Colleges, Startups, SMBs, Govt & NGOs — from Figma to production with SEO, analytics and lifetime support.",
		icon: CodeXml,
		tone: "brand",
		steps: [
			{
				icon: Building2,
				title: "Discovery",
				desc: "Requirements from enterprises, schools, colleges & startups."
			},
			{
				icon: Figma,
				title: "Design",
				desc: "UI kit, prototypes, brand system."
			},
			{
				icon: GitBranch,
				title: "Repo + CI/CD",
				desc: "Version, review, test, deploy."
			},
			{
				icon: Rocket,
				title: "Deploy",
				desc: "Edge origin + CDN + SSL."
			},
			{
				icon: Database,
				title: "Database + API",
				desc: "Backend, auth, RLS."
			},
			{
				icon: Users,
				title: "Users on any device",
				desc: "Web, mobile, tablet."
			}
		],
		perks: [
			"Fixed timeline",
			"Weekly demos",
			"SEO-ready",
			"Post-launch AMC"
		],
		topology: {
			nodes: (() => {
				const W = 210;
				return [
					{
						id: "ent",
						kind: "chip",
						label: "Enterprises",
						icon: Building2,
						x: 0,
						y: 0,
						layer: 0
					},
					{
						id: "sch",
						kind: "chip",
						label: "Schools",
						icon: GraduationCap,
						x: 0,
						y: 55,
						layer: 0
					},
					{
						id: "col",
						kind: "chip",
						label: "Colleges",
						icon: Award,
						x: 0,
						y: 110,
						layer: 0
					},
					{
						id: "stp",
						kind: "chip",
						label: "Startups",
						icon: Rocket,
						x: 0,
						y: 165,
						layer: 0
					},
					{
						id: "smb",
						kind: "chip",
						label: "SMB / Retail",
						icon: Boxes,
						x: 0,
						y: 220,
						layer: 0
					},
					{
						id: "gov",
						kind: "chip",
						label: "Govt · NGO",
						icon: ScrollText,
						x: 0,
						y: 275,
						layer: 0
					},
					{
						id: "disc",
						kind: "hub",
						label: "Discovery & Scope",
						sub: "Requirements · SOW",
						icon: Sparkles,
						x: W,
						y: 130,
						layer: 1
					},
					{
						id: "fig",
						kind: "device",
						label: "Figma Design",
						sub: "UI kit · Proto",
						icon: Figma,
						x: W * 2,
						y: 55,
						layer: 2
					},
					{
						id: "code",
						kind: "device",
						label: "Code Editor",
						sub: "React · TS",
						icon: FileCodeCorner,
						x: W * 2,
						y: 210,
						layer: 2
					},
					{
						id: "git",
						kind: "hub",
						label: "Repo + CI/CD",
						sub: "Test · Build",
						icon: GitBranch,
						x: W * 3,
						y: 130,
						layer: 3
					},
					{
						id: "origin",
						kind: "device",
						label: "Origin / Edge",
						sub: "Server functions",
						icon: Rocket,
						x: W * 4,
						y: 30,
						layer: 4
					},
					{
						id: "db",
						kind: "device",
						label: "Database",
						sub: "RLS · Auth",
						icon: Database,
						x: W * 4,
						y: 130,
						layer: 4
					},
					{
						id: "storage",
						kind: "device",
						label: "Storage / Assets",
						sub: "Images · Files",
						icon: HardDrive,
						x: W * 4,
						y: 230,
						layer: 4
					},
					{
						id: "cdn",
						kind: "cloud",
						label: "Global CDN",
						sub: "TLS · DDoS",
						icon: Cloud,
						x: W * 5,
						y: 130,
						layer: 5
					},
					{
						id: "u1",
						kind: "chip",
						label: "Desktop Users",
						icon: Laptop,
						x: W * 6,
						y: 35,
						layer: 6
					},
					{
						id: "u2",
						kind: "chip",
						label: "Mobile Users",
						icon: Smartphone,
						x: W * 6,
						y: 110,
						layer: 6
					},
					{
						id: "u3",
						kind: "chip",
						label: "Tablet / Kiosk",
						icon: MonitorSmartphone,
						x: W * 6,
						y: 185,
						layer: 6
					},
					{
						id: "u4",
						kind: "chip",
						label: "Search & Bots",
						icon: Bot,
						x: W * 6,
						y: 260,
						layer: 6
					}
				];
			})(),
			edges: [
				{
					from: "ent",
					to: "disc"
				},
				{
					from: "sch",
					to: "disc"
				},
				{
					from: "col",
					to: "disc"
				},
				{
					from: "stp",
					to: "disc"
				},
				{
					from: "smb",
					to: "disc"
				},
				{
					from: "gov",
					to: "disc"
				},
				{
					from: "disc",
					to: "fig"
				},
				{
					from: "disc",
					to: "code"
				},
				{
					from: "fig",
					to: "git"
				},
				{
					from: "code",
					to: "git"
				},
				{
					from: "git",
					to: "origin"
				},
				{
					from: "git",
					to: "db"
				},
				{
					from: "git",
					to: "storage"
				},
				{
					from: "origin",
					to: "cdn"
				},
				{
					from: "db",
					to: "cdn"
				},
				{
					from: "storage",
					to: "cdn"
				},
				{
					from: "cdn",
					to: "u1"
				},
				{
					from: "cdn",
					to: "u2"
				},
				{
					from: "cdn",
					to: "u3"
				},
				{
					from: "cdn",
					to: "u4"
				}
			]
		}
	},
	{
		id: "iot",
		eyebrow: "Networking Hardware & Integration",
		title: "Networking Device Selling & Deployment",
		desc: "Routers, managed switches, Wi-Fi access points, CCTV cameras, NVRs and structured cabling — sourced, configured, installed and supported end-to-end.",
		icon: Router,
		tone: "violet",
		steps: [
			{
				icon: Package,
				title: "Product Catalog",
				desc: "Routers, switches, APs, CCTV, NVR, PoE."
			},
			{
				icon: CircleCheck,
				title: "Site Survey & BoQ",
				desc: "Coverage, ports, cabling plan."
			},
			{
				icon: Boxes,
				title: "Sourcing & Stock",
				desc: "Genuine brands, GST invoice, warranty."
			},
			{
				icon: Router,
				title: "Config & Staging",
				desc: "VLANs, SSIDs, firmware, security."
			},
			{
				icon: Network,
				title: "On-site Install",
				desc: "Rack, cable, mount, label, test."
			},
			{
				icon: Headphones,
				title: "AMC & Support",
				desc: "Monitoring, spares, RMA, upgrades."
			}
		],
		perks: [
			"Brand-authorised stock",
			"Free site survey",
			"Structured cabling",
			"AMC & 24×7 support"
		],
		topology: {
			nodes: [
				{
					id: "cust",
					kind: "chip",
					label: "Customer",
					sub: "Enquiry",
					icon: Users,
					x: 0,
					y: 20,
					layer: 0
				},
				{
					id: "survey",
					kind: "chip",
					label: "Site Survey",
					sub: "Coverage · BoQ",
					icon: CircleCheck,
					x: 0,
					y: 110,
					layer: 0
				},
				{
					id: "quote",
					kind: "chip",
					label: "Quote & PO",
					sub: "GST Invoice",
					icon: ScrollText,
					x: 0,
					y: 200,
					layer: 0
				},
				{
					id: "cat",
					kind: "hub",
					label: "Product Catalog",
					sub: "Routers · Switches · APs · CCTV",
					icon: Package,
					x: R,
					y: 110,
					layer: 1
				},
				{
					id: "rtr",
					kind: "device",
					label: "Routers",
					sub: "Edge · Multi-WAN",
					icon: Router,
					x: R * 2,
					y: -20,
					layer: 2
				},
				{
					id: "sw",
					kind: "device",
					label: "Managed Switch",
					sub: "PoE · VLAN",
					icon: Network,
					x: R * 2,
					y: 70,
					layer: 2
				},
				{
					id: "ap",
					kind: "device",
					label: "Wi-Fi APs",
					sub: "Wi-Fi 6 · Mesh",
					icon: Wifi,
					x: R * 2,
					y: 160,
					layer: 2
				},
				{
					id: "cam",
					kind: "device",
					label: "CCTV Cameras",
					sub: "IP · Dome · Bullet",
					icon: Cctv,
					x: R * 2,
					y: 250,
					layer: 2
				},
				{
					id: "nvr",
					kind: "device",
					label: "NVR / DVR",
					sub: "Storage · PoE",
					icon: HardDrive,
					x: R * 2,
					y: 340,
					layer: 2
				},
				{
					id: "cab",
					kind: "device",
					label: "Cabling & Racks",
					sub: "Cat6 · Fiber",
					icon: Layers,
					x: R * 2,
					y: 430,
					layer: 2
				},
				{
					id: "stage",
					kind: "hub",
					label: "Config & Staging",
					sub: "Firmware · Security",
					icon: Cpu,
					x: R * 3,
					y: 180,
					layer: 3
				},
				{
					id: "install",
					kind: "device",
					label: "On-site Install",
					sub: "Mount · Test",
					icon: Rocket,
					x: R * 4,
					y: 90,
					layer: 4
				},
				{
					id: "handover",
					kind: "device",
					label: "Handover & Docs",
					sub: "As-built · Passwords",
					icon: FileCodeCorner,
					x: R * 4,
					y: 200,
					layer: 4
				},
				{
					id: "amc",
					kind: "cloud",
					label: "AMC & Support",
					sub: "24×7 · Spares · RMA",
					icon: Headphones,
					x: R * 4,
					y: 310,
					layer: 4
				}
			],
			edges: [
				{
					from: "cust",
					to: "cat"
				},
				{
					from: "survey",
					to: "cat"
				},
				{
					from: "quote",
					to: "cat"
				},
				{
					from: "cat",
					to: "rtr"
				},
				{
					from: "cat",
					to: "sw"
				},
				{
					from: "cat",
					to: "ap"
				},
				{
					from: "cat",
					to: "cam"
				},
				{
					from: "cat",
					to: "nvr"
				},
				{
					from: "cat",
					to: "cab"
				},
				{
					from: "rtr",
					to: "stage"
				},
				{
					from: "sw",
					to: "stage"
				},
				{
					from: "ap",
					to: "stage"
				},
				{
					from: "cam",
					to: "stage"
				},
				{
					from: "nvr",
					to: "stage"
				},
				{
					from: "cab",
					to: "stage"
				},
				{
					from: "stage",
					to: "install"
				},
				{
					from: "install",
					to: "handover"
				},
				{
					from: "handover",
					to: "amc"
				}
			]
		}
	},
	{
		id: "courses",
		eyebrow: "Courses & Learning",
		title: "Enroll → Learn → Certify",
		desc: "Structured courses with videos, resources, quizzes and shareable certificates.",
		icon: GraduationCap,
		tone: "green",
		steps: [
			{
				icon: Users,
				title: "Student",
				desc: "Browse & enroll in a track."
			},
			{
				icon: GraduationCap,
				title: "LMS Portal",
				desc: "Progress, notes & mentor chat."
			},
			{
				icon: Video,
				title: "Video CDN",
				desc: "HD video streaming & captions."
			},
			{
				icon: ScrollText,
				title: "Quizzes",
				desc: "Assignments & auto-grading."
			},
			{
				icon: Award,
				title: "Certificate",
				desc: "Signed & verifiable."
			},
			{
				icon: MessageCircle,
				title: "Community",
				desc: "Alumni & mentor support."
			}
		],
		perks: [
			"Lifetime access",
			"Certificate verify",
			"Mobile learning",
			"Live doubt clearing"
		],
		topology: {
			nodes: [
				{
					id: "st1",
					kind: "chip",
					label: "Web Student",
					icon: Laptop,
					x: 0,
					y: 60,
					layer: 0
				},
				{
					id: "st2",
					kind: "chip",
					label: "Mobile Student",
					icon: Smartphone,
					x: 0,
					y: 200,
					layer: 0
				},
				{
					id: "lms",
					kind: "hub",
					label: "LMS Portal",
					sub: "Progress · Notes",
					icon: GraduationCap,
					x: R,
					y: 130,
					layer: 1
				},
				{
					id: "video",
					kind: "device",
					label: "Video CDN",
					sub: "HD · Captions",
					icon: Video,
					x: R * 2,
					y: 20,
					layer: 2
				},
				{
					id: "quiz",
					kind: "device",
					label: "Quiz Engine",
					sub: "Auto-grade",
					icon: ScrollText,
					x: R * 2,
					y: 130,
					layer: 2
				},
				{
					id: "chat",
					kind: "device",
					label: "Mentor Chat",
					sub: "Live doubts",
					icon: MessageCircle,
					x: R * 2,
					y: 240,
					layer: 2
				},
				{
					id: "cert",
					kind: "cloud",
					label: "Certificate",
					sub: "Signed · Verify",
					icon: Award,
					x: R * 3,
					y: 60,
					layer: 3
				},
				{
					id: "review",
					kind: "cloud",
					label: "Alumni Reviews",
					sub: "5★ Ratings",
					icon: Star,
					x: R * 3,
					y: 200,
					layer: 3
				}
			],
			edges: [
				{
					from: "st1",
					to: "lms"
				},
				{
					from: "st2",
					to: "lms"
				},
				{
					from: "lms",
					to: "video"
				},
				{
					from: "lms",
					to: "quiz"
				},
				{
					from: "lms",
					to: "chat"
				},
				{
					from: "quiz",
					to: "cert"
				},
				{
					from: "chat",
					to: "review"
				}
			]
		}
	},
	{
		id: "digital",
		eyebrow: "Digital Products & Subscriptions",
		title: "Buy → Download → Renew",
		desc: "Templates, licenses and subscription services with automatic delivery and renewals.",
		icon: Download,
		tone: "saffron",
		steps: [
			{
				icon: Users,
				title: "Customer",
				desc: "Chooses plan on website."
			},
			{
				icon: CreditCard,
				title: "Checkout",
				desc: "Secure payment + GST invoice."
			},
			{
				icon: KeyRound,
				title: "License Server",
				desc: "Issues keys & seats."
			},
			{
				icon: Download,
				title: "Delivery",
				desc: "Instant download links."
			},
			{
				icon: RefreshCw,
				title: "Auto-Renew",
				desc: "Reminders & one-tap renewals."
			},
			{
				icon: Headphones,
				title: "Support",
				desc: "Priority helpdesk included."
			}
		],
		perks: [
			"Instant delivery",
			"License manager",
			"Auto renewals",
			"GST invoices"
		],
		topology: {
			nodes: [
				{
					id: "cust",
					kind: "chip",
					label: "Customer",
					icon: Users,
					x: 0,
					y: 130,
					layer: 0
				},
				{
					id: "shop",
					kind: "device",
					label: "Storefront",
					sub: "Plans & Pricing",
					icon: Package,
					x: R,
					y: 30,
					layer: 1
				},
				{
					id: "pay",
					kind: "device",
					label: "Payment",
					sub: "UPI · Card · GST",
					icon: CreditCard,
					x: R,
					y: 130,
					layer: 1
				},
				{
					id: "sub",
					kind: "device",
					label: "Subscription",
					sub: "Cycles · Trials",
					icon: RefreshCw,
					x: R,
					y: 230,
					layer: 1
				},
				{
					id: "lic",
					kind: "hub",
					label: "License Server",
					sub: "Keys · Seats",
					icon: KeyRound,
					x: R * 2,
					y: 130,
					layer: 2
				},
				{
					id: "dl",
					kind: "cloud",
					label: "Downloads",
					sub: "Signed URLs",
					icon: Download,
					x: R * 3,
					y: 20,
					layer: 3
				},
				{
					id: "mail",
					kind: "cloud",
					label: "Emails",
					sub: "Invoice · Reminders",
					icon: Mail,
					x: R * 3,
					y: 130,
					layer: 3
				},
				{
					id: "portal",
					kind: "cloud",
					label: "Customer Portal",
					sub: "Manage · Renew",
					icon: MonitorSmartphone,
					x: R * 3,
					y: 240,
					layer: 3
				},
				{
					id: "help",
					kind: "chip",
					label: "Priority Support",
					icon: Headphones,
					x: R * 4,
					y: 130,
					layer: 4
				}
			],
			edges: [
				{
					from: "cust",
					to: "shop"
				},
				{
					from: "cust",
					to: "pay"
				},
				{
					from: "cust",
					to: "sub"
				},
				{
					from: "shop",
					to: "lic"
				},
				{
					from: "pay",
					to: "lic"
				},
				{
					from: "sub",
					to: "lic"
				},
				{
					from: "lic",
					to: "dl"
				},
				{
					from: "lic",
					to: "mail"
				},
				{
					from: "lic",
					to: "portal"
				},
				{
					from: "portal",
					to: "help"
				}
			]
		}
	}
];
function WorkflowsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden bg-gradient-hero",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 -z-10 opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-hero-blob" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-hero-blob" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						className: "mb-4 bg-gradient-brand text-white border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 mr-1.5" }), " Live Device Workflows"]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 80,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight",
							children: [
								"Real ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient-brand",
									children: "device-level"
								}),
								" flow diagrams — for every service."
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 140,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base lg:text-lg text-muted-foreground",
							children: "Not just numbered steps — interactive topology diagrams showing the actual devices, routers, servers, sensors and users behind each Infiniforge service. Mobile-friendly and animated."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 200,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3",
							children: FLOWS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `#${f.id}`,
								className: cn("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium ring-1 transition-all hover:scale-[1.03]", TONE[f.tone].chip, TONE[f.tone].ring),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-3.5 w-3.5" }), f.eyebrow.split("&")[0].trim()]
							}, f.id))
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14 sm:space-y-20",
			children: FLOWS.map((flow, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowBlock, {
				flow,
				index: idx
			}, flow.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl bg-gradient-brand p-6 sm:p-10 lg:p-14 text-white shadow-elegant",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl sm:text-3xl lg:text-4xl font-black",
						children: "Ready to start your workflow?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 sm:mt-3 text-white/90 max-w-2xl text-sm sm:text-base",
						children: "Tell us your goals — we'll map the right stack, timeline and budget with a signed SLA."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "secondary",
							className: "font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/contact",
								children: ["Talk to us ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "bg-transparent border-white/40 text-white hover:bg-white/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/services",
								children: "Explore services"
							})
						})]
					})]
				})]
			}) })
		})
	] });
}
function FlowBlock({ flow, index }) {
	const tone = TONE[flow.tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: flow.id,
		className: "scroll-mt-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5 sm:mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1", tone.chip, tone.ring),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: String(index + 1).padStart(2, "0")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: flow.eyebrow
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight",
						children: flow.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl",
						children: flow.desc
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-elegant", tone.grad),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(flow.icon, { className: "h-7 w-7" })
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: 80,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("relative rounded-3xl border bg-card p-4 sm:p-6 lg:p-8 shadow-card overflow-hidden"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute inset-0 -z-10 opacity-70 bg-gradient-to-br", tone.soft) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowReactFlow, {
						topology: flow.topology,
						tone: flow.tone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3",
						children: flow.steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("group rounded-xl border bg-background/70 backdrop-blur p-2.5 sm:p-3 transition-all hover:-translate-y-0.5 hover:shadow-elegant"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white shadow", tone.grad),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
										children: String(i + 1).padStart(2, "0")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs sm:text-sm font-bold leading-tight truncate",
										children: s.title
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-[11px] sm:text-xs text-muted-foreground line-clamp-2",
								children: s.desc
							})]
						}, s.title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 sm:mt-5 flex flex-wrap gap-2",
						children: flow.perks.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 bg-background/70", tone.chip, tone.ring),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), p]
						}, p))
					})
				]
			})
		})]
	});
}
//#endregion
export { WorkflowsPage as component };
