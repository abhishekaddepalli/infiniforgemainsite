import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Globe2, Router as RouterIcon, Network, Shield, Server, Wifi, MonitorSmartphone,
  HardDrive, Cctv, Camera, Video, Cloud, Code2, Cpu, GraduationCap, Download,
  Repeat, ArrowRight, CheckCircle2, Sparkles, Layers, Building2, Boxes,
  Users, Laptop, Smartphone, Tv, Database, KeyRound, Rocket, Zap, Package,
  CreditCard, Mail, Award, MessageCircle, Bot, Fingerprint, Radio, Thermometer,
  Gauge, GitBranch, Figma, Bell, FileCode2, Antenna, ScrollText, Star, Lock,
  Signal, Fan, RefreshCw, Headphones,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkflowReactFlow, type Topology, type WFTone } from "@/components/site/WorkflowReactFlow";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    meta: [
      { title: "Workflows — ISP, LAN, CCTV, Servers, Web, IoT, Courses · Infiniforge" },
      { name: "description", content: "Interactive device-level workflow diagrams for every Infiniforge service — ISP & multi-WAN, LAN & OS, CCTV & DVR, servers, web dev, IoT, courses and subscriptions." },
      { property: "og:title", content: "Infiniforge Service Workflows" },
      { property: "og:description", content: "Device-level flow diagrams for how we deliver internet, networks, surveillance, servers, software, IoT, courses and subscriptions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkflowsPage,
});

const TONE: Record<WFTone, { chip: string; ring: string; dot: string; grad: string; soft: string }> = {
  saffron: { chip: "bg-primary/10 text-primary", ring: "ring-primary/30", dot: "bg-primary", grad: "bg-gradient-saffron", soft: "from-primary/10 to-primary/0" },
  green:   { chip: "bg-accent/10 text-accent",   ring: "ring-accent/30",  dot: "bg-accent",  grad: "bg-gradient-green",   soft: "from-accent/10 to-accent/0" },
  brand:   { chip: "bg-primary/10 text-primary", ring: "ring-primary/30", dot: "bg-primary", grad: "bg-gradient-brand",   soft: "from-primary/10 to-accent/5" },
  blue:    { chip: "bg-info/10 text-info",       ring: "ring-info/30",    dot: "bg-info",    grad: "bg-gradient-brand",   soft: "from-info/10 to-info/0" },
  violet:  { chip: "bg-primary/10 text-primary", ring: "ring-primary/30", dot: "bg-primary", grad: "bg-gradient-brand",   soft: "from-primary/10 to-accent/5" },
  rose:    { chip: "bg-destructive/10 text-destructive", ring: "ring-destructive/30", dot: "bg-destructive", grad: "bg-gradient-saffron", soft: "from-destructive/10 to-destructive/0" },
};

type Step = { icon: LucideIcon; title: string; desc: string };
type Flow = {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  tone: WFTone;
  steps: Step[];
  perks: string[];
  topology: Topology;
};

/* ---------- Topology helpers ---------- */
const R = 260; // horizontal step between layers
const H = 110; // vertical step

const FLOWS: Flow[] = [
  /* ---------------- 1. ISP Multi-WAN ---------------- */
  {
    id: "isp",
    eyebrow: "Internet Service Provider & Management",
    title: "Multi-WAN + Load Balancing Flow",
    desc: "Blend multiple ISPs into one reliable pipe with automatic failover, per-app routing and live bandwidth shaping.",
    icon: Globe2,
    tone: "saffron",
    steps: [
      { icon: Globe2, title: "ISP-1 Fiber", desc: "Primary uplink with SLA and static IP." },
      { icon: Signal, title: "ISP-2 5G / Wireless", desc: "Diverse-path secondary uplink." },
      { icon: RouterIcon, title: "Edge Router + LB", desc: "Multi-WAN bonding, weighted balance & health checks." },
      { icon: Shield, title: "Firewall / UTM", desc: "IDS/IPS, DNS filter, VPN gateway." },
      { icon: Network, title: "Core Switch", desc: "VLANs, QoS for voice & video." },
      { icon: Wifi, title: "APs · Servers · Users", desc: "Wi-Fi, wired endpoints & servers." },
    ],
    perks: ["Zero-downtime failover", "Per-user bandwidth policy", "24×7 NOC monitoring", "GST-billed circuits"],
    topology: {
      nodes: [
        { id: "isp1", kind: "cloud", label: "ISP-1 Fiber", sub: "SLA 99.9%", icon: Globe2, x: 0, y: 20, layer: 0 },
        { id: "isp2", kind: "cloud", label: "ISP-2 5G", sub: "Wireless", icon: Signal, x: 0, y: 120, layer: 0 },
        { id: "isp3", kind: "cloud", label: "ISP-3 Backup", sub: "Failover", icon: Antenna, x: 0, y: 220, layer: 0 },
        { id: "router", kind: "hub", label: "Edge Router + LB", sub: "Multi-WAN bond", icon: RouterIcon, x: R, y: 110, layer: 1 },
        { id: "fw", kind: "device", label: "Firewall / UTM", sub: "IDS · VPN · DNS", icon: Shield, x: R * 2, y: 110, layer: 2 },
        { id: "core", kind: "hub", label: "Core Switch", sub: "VLAN · QoS", icon: Network, x: R * 3, y: 110, layer: 3 },
        { id: "ap", kind: "chip", label: "Wi-Fi APs", icon: Wifi, x: R * 4, y: 20, layer: 4 },
        { id: "srv", kind: "chip", label: "Servers", icon: Server, x: R * 4, y: 110, layer: 4 },
        { id: "usr", kind: "chip", label: "Users", icon: Users, x: R * 4, y: 200, layer: 4 },
      ],
      edges: [
        { from: "isp1", to: "router", label: "Primary" },
        { from: "isp2", to: "router", label: "Secondary" },
        { from: "isp3", to: "router", dashed: true, label: "Backup" },
        { from: "router", to: "fw" },
        { from: "fw", to: "core" },
        { from: "core", to: "ap" },
        { from: "core", to: "srv" },
        { from: "core", to: "usr" },
      ],
    },
  },

  /* ---------------- 2. LAN & OS ---------------- */
  {
    id: "lan",
    eyebrow: "Internal LAN & OS Management",
    title: "Endpoint, Server & OS Flow",
    desc: "Structured onboarding for every laptop, desktop and server — from imaging to patching, backups and access control.",
    icon: Network,
    tone: "green",
    steps: [
      { icon: Fingerprint, title: "Identity / AD", desc: "Domain, SSO & role-based access." },
      { icon: Cpu, title: "OS Deploy", desc: "Windows / Linux golden images via PXE." },
      { icon: MonitorSmartphone, title: "MDM & Agents", desc: "Patching, AV & remote support." },
      { icon: HardDrive, title: "Backup", desc: "3-2-1 backup with offsite copy." },
      { icon: Laptop, title: "Endpoints", desc: "Laptops, desktops, mobiles." },
      { icon: Server, title: "Servers", desc: "File, app and DB servers." },
    ],
    perks: ["Asset & license register", "Group policies", "Encrypted backups", "On-site + remote AMC"],
    topology: {
      nodes: [
        { id: "ad", kind: "hub", label: "AD / Identity", sub: "SSO · RBAC", icon: Fingerprint, x: R, y: 130, layer: 1 },
        { id: "os", kind: "device", label: "OS Deploy", sub: "Golden images", icon: Cpu, x: 0, y: 30, layer: 0 },
        { id: "mdm", kind: "device", label: "MDM & Patch", sub: "Agents · AV", icon: MonitorSmartphone, x: 0, y: 230, layer: 0 },
        { id: "backup", kind: "device", label: "Backup Server", sub: "3-2-1 offsite", icon: HardDrive, x: R * 2, y: 30, layer: 2 },
        { id: "mon", kind: "device", label: "Monitoring", sub: "Logs · Alerts", icon: Gauge, x: R * 2, y: 230, layer: 2 },
        { id: "pc", kind: "chip", label: "Windows PCs", icon: Laptop, x: R * 3, y: 10, layer: 3 },
        { id: "mac", kind: "chip", label: "MacBooks", icon: Laptop, x: R * 3, y: 80, layer: 3 },
        { id: "lin", kind: "chip", label: "Linux Workstations", icon: Cpu, x: R * 3, y: 150, layer: 3 },
        { id: "srv", kind: "chip", label: "App Servers", icon: Server, x: R * 3, y: 220, layer: 3 },
        { id: "db", kind: "chip", label: "DB Server", icon: Database, x: R * 3, y: 290, layer: 3 },
      ],
      edges: [
        { from: "os", to: "ad" },
        { from: "mdm", to: "ad" },
        { from: "ad", to: "backup" },
        { from: "ad", to: "mon" },
        { from: "backup", to: "pc" }, { from: "backup", to: "mac" }, { from: "backup", to: "lin" },
        { from: "mon", to: "srv" }, { from: "mon", to: "db" },
      ],
    },
  },

  /* ---------------- 3. CCTV ---------------- */
  {
    id: "cctv",
    eyebrow: "CCTV Cameras & DVR Management",
    title: "Surveillance Design → Live Ops",
    desc: "End-to-end CCTV: site design, IP/analog cameras, NVR/DVR storage, remote view and health monitoring.",
    icon: Cctv,
    tone: "rose",
    steps: [
      { icon: Camera, title: "IP / PTZ Cameras", desc: "Indoor, outdoor & PTZ mounting." },
      { icon: Network, title: "PoE Switch", desc: "Powered feeds & VLAN isolation." },
      { icon: Video, title: "NVR / DVR", desc: "RAID storage + retention policy." },
      { icon: Cloud, title: "Cloud Relay", desc: "Secure remote view on mobile." },
      { icon: Smartphone, title: "Mobile View", desc: "Push alerts & live playback." },
      { icon: Tv, title: "Control Room", desc: "Wall of screens & audit." },
    ],
    perks: ["4K & night vision", "Mobile live view", "30–90 day retention", "AMC & spares"],
    topology: {
      nodes: [
        { id: "c1", kind: "chip", label: "Cam 1 · Entrance", icon: Camera, x: 0, y: 0, layer: 0 },
        { id: "c2", kind: "chip", label: "Cam 2 · Parking", icon: Camera, x: 0, y: 70, layer: 0 },
        { id: "c3", kind: "chip", label: "Cam 3 · Corridor", icon: Camera, x: 0, y: 140, layer: 0 },
        { id: "c4", kind: "chip", label: "Cam 4 · PTZ Rooftop", icon: Cctv, x: 0, y: 210, layer: 0 },
        { id: "c5", kind: "chip", label: "Cam 5 · Warehouse", icon: Camera, x: 0, y: 280, layer: 0 },
        { id: "poe", kind: "device", label: "PoE Switch", sub: "16 × Gigabit", icon: Network, x: R, y: 140, layer: 1 },
        { id: "nvr", kind: "hub", label: "NVR / DVR", sub: "RAID · 30 day", icon: Video, x: R * 2, y: 140, layer: 2 },
        { id: "stg", kind: "device", label: "Storage", sub: "8 TB × 4", icon: HardDrive, x: R * 3, y: 30, layer: 3 },
        { id: "cloud", kind: "cloud", label: "Cloud Relay", sub: "TLS · Auth", icon: Cloud, x: R * 3, y: 140, layer: 3 },
        { id: "mob", kind: "chip", label: "Mobile View", icon: Smartphone, x: R * 4, y: 60, layer: 4 },
        { id: "tv", kind: "chip", label: "Control Room", icon: Tv, x: R * 4, y: 140, layer: 4 },
        { id: "alert", kind: "chip", label: "Alerts", icon: Bell, x: R * 4, y: 220, layer: 4 },
      ],
      edges: [
        { from: "c1", to: "poe" }, { from: "c2", to: "poe" }, { from: "c3", to: "poe" },
        { from: "c4", to: "poe" }, { from: "c5", to: "poe" },
        { from: "poe", to: "nvr" },
        { from: "nvr", to: "stg" }, { from: "nvr", to: "cloud" },
        { from: "cloud", to: "mob" }, { from: "cloud", to: "tv" }, { from: "cloud", to: "alert" },
      ],
    },
  },

  /* ---------------- 4. Servers ---------------- */
  {
    id: "servers",
    eyebrow: "File Transfer & Server Provisioning",
    title: "File, Storage & Application Servers",
    desc: "Purpose-built servers for file sharing, SFTP, NAS, backups and internal apps — hardened and monitored.",
    icon: Server,
    tone: "blue",
    steps: [
      { icon: Users, title: "Users & Teams", desc: "Local + remote workforce." },
      { icon: Lock, title: "VPN + Firewall", desc: "TLS, MFA, IP allowlist." },
      { icon: Server, title: "File Server", desc: "SMB / NFS / SFTP with quotas." },
      { icon: HardDrive, title: "NAS Storage", desc: "RAID pools + snapshots." },
      { icon: Repeat, title: "Backup / Sync", desc: "Offsite replication." },
      { icon: Gauge, title: "Monitoring", desc: "Metrics, logs & alerts 24×7." },
    ],
    perks: ["Encrypted transit", "Role-based shares", "Versioned backups", "SLA-backed uptime"],
    topology: {
      nodes: [
        { id: "u1", kind: "chip", label: "Office Users", icon: Users, x: 0, y: 40, layer: 0 },
        { id: "u2", kind: "chip", label: "Remote Users", icon: Laptop, x: 0, y: 130, layer: 0 },
        { id: "u3", kind: "chip", label: "Partners (SFTP)", icon: KeyRound, x: 0, y: 220, layer: 0 },
        { id: "vpn", kind: "device", label: "VPN Gateway", sub: "WireGuard · MFA", icon: Lock, x: R, y: 60, layer: 1 },
        { id: "fw", kind: "device", label: "Firewall", sub: "TLS · Allowlist", icon: Shield, x: R, y: 190, layer: 1 },
        { id: "app", kind: "hub", label: "File / App Server", sub: "SMB · NFS · SFTP", icon: Server, x: R * 2, y: 130, layer: 2 },
        { id: "nas", kind: "device", label: "NAS Storage", sub: "RAID · Snapshots", icon: HardDrive, x: R * 3, y: 20, layer: 3 },
        { id: "bak", kind: "cloud", label: "Offsite Backup", sub: "S3-compatible", icon: Cloud, x: R * 3, y: 130, layer: 3 },
        { id: "mon", kind: "device", label: "Monitoring", sub: "Prom · Alerts", icon: Gauge, x: R * 3, y: 240, layer: 3 },
      ],
      edges: [
        { from: "u1", to: "vpn" }, { from: "u2", to: "vpn" }, { from: "u3", to: "fw" },
        { from: "vpn", to: "app" }, { from: "fw", to: "app" },
        { from: "app", to: "nas" }, { from: "app", to: "bak", dashed: true }, { from: "app", to: "mon" },
      ],
    },
  },

  /* ---------------- 5. Web Dev ---------------- */
  {
    id: "web",
    eyebrow: "Website & Application Development",
    title: "Design → Build → Ship → Grow",
    desc: "Modern websites, portals and web apps for Enterprises, Schools, Colleges, Startups, SMBs, Govt & NGOs — from Figma to production with SEO, analytics and lifetime support.",
    icon: Code2,
    tone: "brand",
    steps: [
      { icon: Building2, title: "Discovery", desc: "Requirements from enterprises, schools, colleges & startups." },
      { icon: Figma, title: "Design", desc: "UI kit, prototypes, brand system." },
      { icon: GitBranch, title: "Repo + CI/CD", desc: "Version, review, test, deploy." },
      { icon: Rocket, title: "Deploy", desc: "Edge origin + CDN + SSL." },
      { icon: Database, title: "Database + API", desc: "Backend, auth, RLS." },
      { icon: Users, title: "Users on any device", desc: "Web, mobile, tablet." },
    ],
    perks: ["Fixed timeline", "Weekly demos", "SEO-ready", "Post-launch AMC"],
    topology: {
      nodes: (() => {
        const W = 210; // compact horizontal step for this wide 7-layer flow
        return [
          // Layer 0 — Client segments we build for
          { id: "ent", kind: "chip" as const, label: "Enterprises", icon: Building2, x: 0, y: 0, layer: 0 },
          { id: "sch", kind: "chip" as const, label: "Schools", icon: GraduationCap, x: 0, y: 55, layer: 0 },
          { id: "col", kind: "chip" as const, label: "Colleges", icon: Award, x: 0, y: 110, layer: 0 },
          { id: "stp", kind: "chip" as const, label: "Startups", icon: Rocket, x: 0, y: 165, layer: 0 },
          { id: "smb", kind: "chip" as const, label: "SMB / Retail", icon: Boxes, x: 0, y: 220, layer: 0 },
          { id: "gov", kind: "chip" as const, label: "Govt · NGO", icon: ScrollText, x: 0, y: 275, layer: 0 },

          // Layer 1 — Discovery
          { id: "disc", kind: "hub" as const, label: "Discovery & Scope", sub: "Requirements · SOW", icon: Sparkles, x: W, y: 130, layer: 1 },

          // Layer 2 — Design + Code
          { id: "fig", kind: "device" as const, label: "Figma Design", sub: "UI kit · Proto", icon: Figma, x: W * 2, y: 55, layer: 2 },
          { id: "code", kind: "device" as const, label: "Code Editor", sub: "React · TS", icon: FileCode2, x: W * 2, y: 210, layer: 2 },

          // Layer 3 — CI/CD
          { id: "git", kind: "hub" as const, label: "Repo + CI/CD", sub: "Test · Build", icon: GitBranch, x: W * 3, y: 130, layer: 3 },

          // Layer 4 — Runtime
          { id: "origin", kind: "device" as const, label: "Origin / Edge", sub: "Server functions", icon: Rocket, x: W * 4, y: 30, layer: 4 },
          { id: "db", kind: "device" as const, label: "Database", sub: "RLS · Auth", icon: Database, x: W * 4, y: 130, layer: 4 },
          { id: "storage", kind: "device" as const, label: "Storage / Assets", sub: "Images · Files", icon: HardDrive, x: W * 4, y: 230, layer: 4 },

          // Layer 5 — Delivery
          { id: "cdn", kind: "cloud" as const, label: "Global CDN", sub: "TLS · DDoS", icon: Cloud, x: W * 5, y: 130, layer: 5 },

          // Layer 6 — Users
          { id: "u1", kind: "chip" as const, label: "Desktop Users", icon: Laptop, x: W * 6, y: 35, layer: 6 },
          { id: "u2", kind: "chip" as const, label: "Mobile Users", icon: Smartphone, x: W * 6, y: 110, layer: 6 },
          { id: "u3", kind: "chip" as const, label: "Tablet / Kiosk", icon: MonitorSmartphone, x: W * 6, y: 185, layer: 6 },
          { id: "u4", kind: "chip" as const, label: "Search & Bots", icon: Bot, x: W * 6, y: 260, layer: 6 },
        ];
      })(),
      edges: [
        { from: "ent", to: "disc" }, { from: "sch", to: "disc" }, { from: "col", to: "disc" },
        { from: "stp", to: "disc" }, { from: "smb", to: "disc" }, { from: "gov", to: "disc" },
        { from: "disc", to: "fig" }, { from: "disc", to: "code" },
        { from: "fig", to: "git" }, { from: "code", to: "git" },
        { from: "git", to: "origin" }, { from: "git", to: "db" }, { from: "git", to: "storage" },
        { from: "origin", to: "cdn" }, { from: "db", to: "cdn" }, { from: "storage", to: "cdn" },
        { from: "cdn", to: "u1" }, { from: "cdn", to: "u2" }, { from: "cdn", to: "u3" }, { from: "cdn", to: "u4" },
      ],
    },
  },

  /* ---------------- 6. Networking Devices Selling ---------------- */
  {
    id: "iot",
    eyebrow: "Networking Hardware & Integration",
    title: "Networking Device Selling & Deployment",
    desc: "Routers, managed switches, Wi-Fi access points, CCTV cameras, NVRs and structured cabling — sourced, configured, installed and supported end-to-end.",
    icon: RouterIcon,
    tone: "violet",
    steps: [
      { icon: Package, title: "Product Catalog", desc: "Routers, switches, APs, CCTV, NVR, PoE." },
      { icon: CheckCircle2, title: "Site Survey & BoQ", desc: "Coverage, ports, cabling plan." },
      { icon: Boxes, title: "Sourcing & Stock", desc: "Genuine brands, GST invoice, warranty." },
      { icon: RouterIcon, title: "Config & Staging", desc: "VLANs, SSIDs, firmware, security." },
      { icon: Network, title: "On-site Install", desc: "Rack, cable, mount, label, test." },
      { icon: Headphones, title: "AMC & Support", desc: "Monitoring, spares, RMA, upgrades." },
    ],
    perks: ["Brand-authorised stock", "Free site survey", "Structured cabling", "AMC & 24×7 support"],
    topology: {
      nodes: [
        { id: "cust", kind: "chip", label: "Customer", sub: "Enquiry", icon: Users, x: 0, y: 20, layer: 0 },
        { id: "survey", kind: "chip", label: "Site Survey", sub: "Coverage · BoQ", icon: CheckCircle2, x: 0, y: 110, layer: 0 },
        { id: "quote", kind: "chip", label: "Quote & PO", sub: "GST Invoice", icon: ScrollText, x: 0, y: 200, layer: 0 },

        { id: "cat", kind: "hub", label: "Product Catalog", sub: "Routers · Switches · APs · CCTV", icon: Package, x: R, y: 110, layer: 1 },

        { id: "rtr", kind: "device", label: "Routers", sub: "Edge · Multi-WAN", icon: RouterIcon, x: R * 2, y: -20, layer: 2 },
        { id: "sw", kind: "device", label: "Managed Switch", sub: "PoE · VLAN", icon: Network, x: R * 2, y: 70, layer: 2 },
        { id: "ap", kind: "device", label: "Wi-Fi APs", sub: "Wi-Fi 6 · Mesh", icon: Wifi, x: R * 2, y: 160, layer: 2 },
        { id: "cam", kind: "device", label: "CCTV Cameras", sub: "IP · Dome · Bullet", icon: Cctv, x: R * 2, y: 250, layer: 2 },
        { id: "nvr", kind: "device", label: "NVR / DVR", sub: "Storage · PoE", icon: HardDrive, x: R * 2, y: 340, layer: 2 },
        { id: "cab", kind: "device", label: "Cabling & Racks", sub: "Cat6 · Fiber", icon: Layers, x: R * 2, y: 430, layer: 2 },

        { id: "stage", kind: "hub", label: "Config & Staging", sub: "Firmware · Security", icon: Cpu, x: R * 3, y: 180, layer: 3 },

        { id: "install", kind: "device", label: "On-site Install", sub: "Mount · Test", icon: Rocket, x: R * 4, y: 90, layer: 4 },
        { id: "handover", kind: "device", label: "Handover & Docs", sub: "As-built · Passwords", icon: FileCode2, x: R * 4, y: 200, layer: 4 },
        { id: "amc", kind: "cloud", label: "AMC & Support", sub: "24×7 · Spares · RMA", icon: Headphones, x: R * 4, y: 310, layer: 4 },
      ],
      edges: [
        { from: "cust", to: "cat" }, { from: "survey", to: "cat" }, { from: "quote", to: "cat" },
        { from: "cat", to: "rtr" }, { from: "cat", to: "sw" }, { from: "cat", to: "ap" },
        { from: "cat", to: "cam" }, { from: "cat", to: "nvr" }, { from: "cat", to: "cab" },
        { from: "rtr", to: "stage" }, { from: "sw", to: "stage" }, { from: "ap", to: "stage" },
        { from: "cam", to: "stage" }, { from: "nvr", to: "stage" }, { from: "cab", to: "stage" },
        { from: "stage", to: "install" }, { from: "install", to: "handover" }, { from: "handover", to: "amc" },
      ],
    },
  },


  /* ---------------- 7. Courses ---------------- */
  {
    id: "courses",
    eyebrow: "Courses & Learning",
    title: "Enroll → Learn → Certify",
    desc: "Structured courses with videos, resources, quizzes and shareable certificates.",
    icon: GraduationCap,
    tone: "green",
    steps: [
      { icon: Users, title: "Student", desc: "Browse & enroll in a track." },
      { icon: GraduationCap, title: "LMS Portal", desc: "Progress, notes & mentor chat." },
      { icon: Video, title: "Video CDN", desc: "HD video streaming & captions." },
      { icon: ScrollText, title: "Quizzes", desc: "Assignments & auto-grading." },
      { icon: Award, title: "Certificate", desc: "Signed & verifiable." },
      { icon: MessageCircle, title: "Community", desc: "Alumni & mentor support." },
    ],
    perks: ["Lifetime access", "Certificate verify", "Mobile learning", "Live doubt clearing"],
    topology: {
      nodes: [
        { id: "st1", kind: "chip", label: "Web Student", icon: Laptop, x: 0, y: 60, layer: 0 },
        { id: "st2", kind: "chip", label: "Mobile Student", icon: Smartphone, x: 0, y: 200, layer: 0 },
        { id: "lms", kind: "hub", label: "LMS Portal", sub: "Progress · Notes", icon: GraduationCap, x: R, y: 130, layer: 1 },
        { id: "video", kind: "device", label: "Video CDN", sub: "HD · Captions", icon: Video, x: R * 2, y: 20, layer: 2 },
        { id: "quiz", kind: "device", label: "Quiz Engine", sub: "Auto-grade", icon: ScrollText, x: R * 2, y: 130, layer: 2 },
        { id: "chat", kind: "device", label: "Mentor Chat", sub: "Live doubts", icon: MessageCircle, x: R * 2, y: 240, layer: 2 },
        { id: "cert", kind: "cloud", label: "Certificate", sub: "Signed · Verify", icon: Award, x: R * 3, y: 60, layer: 3 },
        { id: "review", kind: "cloud", label: "Alumni Reviews", sub: "5★ Ratings", icon: Star, x: R * 3, y: 200, layer: 3 },
      ],
      edges: [
        { from: "st1", to: "lms" }, { from: "st2", to: "lms" },
        { from: "lms", to: "video" }, { from: "lms", to: "quiz" }, { from: "lms", to: "chat" },
        { from: "quiz", to: "cert" }, { from: "chat", to: "review" },
      ],
    },
  },

  /* ---------------- 8. Digital Subscriptions ---------------- */
  {
    id: "digital",
    eyebrow: "Digital Products & Subscriptions",
    title: "Buy → Download → Renew",
    desc: "Templates, licenses and subscription services with automatic delivery and renewals.",
    icon: Download,
    tone: "saffron",
    steps: [
      { icon: Users, title: "Customer", desc: "Chooses plan on website." },
      { icon: CreditCard, title: "Checkout", desc: "Secure payment + GST invoice." },
      { icon: KeyRound, title: "License Server", desc: "Issues keys & seats." },
      { icon: Download, title: "Delivery", desc: "Instant download links." },
      { icon: RefreshCw, title: "Auto-Renew", desc: "Reminders & one-tap renewals." },
      { icon: Headphones, title: "Support", desc: "Priority helpdesk included." },
    ],
    perks: ["Instant delivery", "License manager", "Auto renewals", "GST invoices"],
    topology: {
      nodes: [
        { id: "cust", kind: "chip", label: "Customer", icon: Users, x: 0, y: 130, layer: 0 },
        { id: "shop", kind: "device", label: "Storefront", sub: "Plans & Pricing", icon: Package, x: R, y: 30, layer: 1 },
        { id: "pay", kind: "device", label: "Payment", sub: "UPI · Card · GST", icon: CreditCard, x: R, y: 130, layer: 1 },
        { id: "sub", kind: "device", label: "Subscription", sub: "Cycles · Trials", icon: RefreshCw, x: R, y: 230, layer: 1 },
        { id: "lic", kind: "hub", label: "License Server", sub: "Keys · Seats", icon: KeyRound, x: R * 2, y: 130, layer: 2 },
        { id: "dl", kind: "cloud", label: "Downloads", sub: "Signed URLs", icon: Download, x: R * 3, y: 20, layer: 3 },
        { id: "mail", kind: "cloud", label: "Emails", sub: "Invoice · Reminders", icon: Mail, x: R * 3, y: 130, layer: 3 },
        { id: "portal", kind: "cloud", label: "Customer Portal", sub: "Manage · Renew", icon: MonitorSmartphone, x: R * 3, y: 240, layer: 3 },
        { id: "help", kind: "chip", label: "Priority Support", icon: Headphones, x: R * 4, y: 130, layer: 4 },
      ],
      edges: [
        { from: "cust", to: "shop" }, { from: "cust", to: "pay" }, { from: "cust", to: "sub" },
        { from: "shop", to: "lic" }, { from: "pay", to: "lic" }, { from: "sub", to: "lic" },
        { from: "lic", to: "dl" }, { from: "lic", to: "mail" }, { from: "lic", to: "portal" },
        { from: "portal", to: "help" },
      ],
    },
  },
];

function WorkflowsPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 -z-10 opacity-60">
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-hero-blob" />
          <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-hero-blob" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <Reveal>
            <Badge className="mb-4 bg-gradient-brand text-white border-0">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Live Device Workflows
            </Badge>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              Real <span className="text-gradient-brand">device-level</span> flow diagrams — for every service.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base lg:text-lg text-muted-foreground">
              Not just numbered steps — interactive topology diagrams showing the actual devices,
              routers, servers, sensors and users behind each Infiniforge service. Mobile-friendly and animated.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
              {FLOWS.map((f) => (
                <a
                  key={f.id}
                  href={`#${f.id}`}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium ring-1 transition-all hover:scale-[1.03]",
                    TONE[f.tone].chip, TONE[f.tone].ring,
                  )}
                >
                  <f.icon className="h-3.5 w-3.5" />
                  {f.eyebrow.split("&")[0].trim()}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Flows */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14 sm:space-y-20">
        {FLOWS.map((flow, idx) => (
          <FlowBlock key={flow.id} flow={flow} index={idx} />
        ))}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-6 sm:p-10 lg:p-14 text-white shadow-elegant">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black">Ready to start your workflow?</h2>
                <p className="mt-2 sm:mt-3 text-white/90 max-w-2xl text-sm sm:text-base">
                  Tell us your goals — we'll map the right stack, timeline and budget with a signed SLA.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="font-semibold">
                  <Link to="/contact">Talk to us <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10">
                  <Link to="/services">Explore services</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

function FlowBlock({ flow, index }: { flow: Flow; index: number }) {
  const tone = TONE[flow.tone];
  return (
    <div id={flow.id} className="scroll-mt-24">
      <Reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5 sm:mb-8">
          <div className="min-w-0">
            <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1", tone.chip, tone.ring)}>
              <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <span className="truncate">{flow.eyebrow}</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {flow.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">{flow.desc}</p>
          </div>
          <div className={cn("hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-elegant", tone.grad)}>
            <flow.icon className="h-7 w-7" />
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className={cn("relative rounded-3xl border bg-card p-4 sm:p-6 lg:p-8 shadow-card overflow-hidden")}>
          <div className={cn("absolute inset-0 -z-10 opacity-70 bg-gradient-to-br", tone.soft)} />

          {/* Interactive device topology */}
          <WorkflowReactFlow topology={flow.topology} tone={flow.tone} />

          {/* Legend / device list */}
          <ol className="mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {flow.steps.map((s, i) => (
              <li key={s.title} className={cn(
                "group rounded-xl border bg-background/70 backdrop-blur p-2.5 sm:p-3 transition-all hover:-translate-y-0.5 hover:shadow-elegant",
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white shadow", tone.grad)}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="text-xs sm:text-sm font-bold leading-tight truncate">{s.title}</div>
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground line-clamp-2">{s.desc}</p>
              </li>
            ))}
          </ol>

          {/* Perks */}
          <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">
            {flow.perks.map((p) => (
              <span key={p} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 bg-background/70", tone.chip, tone.ring)}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                {p}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
