import {
  Server, Cloud, Globe, Shield, Cpu, Boxes, Wrench, Bot, Activity,
  MonitorSmartphone, Database, Package, KeyRound, FileCode2, LayoutGrid,
  Headphones, Briefcase, GitBranch, Layers, Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  gradient: "saffron" | "green" | "brand";
};

export const categories: Category[] = [
  { slug: "it-services", name: "IT Services", tagline: "End-to-end managed IT for growing enterprises", icon: Wrench, gradient: "brand" },
  { slug: "saas", name: "SaaS Applications", tagline: "White-label ready SaaS built for scale", icon: LayoutGrid, gradient: "saffron" },
  { slug: "hosting", name: "Hosting & VPS", tagline: "Blazing-fast SSD hosting, VPS & dedicated servers", icon: Server, gradient: "green" },
  { slug: "domains", name: "Domains & SSL", tagline: ".com, .in, .co & wildcard SSL certificates", icon: Globe, gradient: "brand" },
  { slug: "development", name: "Website & App Dev", tagline: "Websites, Android & iOS apps, ERPs, CRMs", icon: FileCode2, gradient: "saffron" },
  { slug: "ai-automation", name: "AI Automation", tagline: "Custom AI agents, workflows & integrations", icon: Bot, gradient: "green" },
  { slug: "monitoring", name: "Monitoring & AMC", tagline: "24×7 uptime, network monitoring & AMCs", icon: Activity, gradient: "brand" },
  { slug: "internet", name: "Internet & Leased Line", tagline: "Enterprise leased lines, fiber & business broadband", icon: Wifi, gradient: "green" },
  { slug: "licenses", name: "Software Licenses", tagline: "Genuine licenses with instant activation", icon: KeyRound, gradient: "saffron" },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  billing: "one-time" | "mo" | "yr";
  badge?: "Popular" | "New" | "Featured" | "Best Value";
  description: string;
  features: string[];
  icon: LucideIcon;
  gradient: "saffron" | "green" | "brand";
};

export const products: Product[] = [
  { id: "vps-starter", name: "VPS Cloud — Starter", category: "hosting", price: 599, billing: "mo", badge: "Popular",
    description: "2 vCPU · 4 GB RAM · 80 GB NVMe · 2 TB bandwidth in Mumbai region.",
    features: ["Free daily backups", "DDoS protection", "1-click OS deploy", "24×7 NOC support"],
    icon: Server, gradient: "brand" },
  { id: "vps-pro", name: "VPS Cloud — Pro", category: "hosting", price: 1799, billing: "mo",
    description: "4 vCPU · 8 GB RAM · 160 GB NVMe · 4 TB bandwidth. Enterprise-grade.",
    features: ["Snapshot & clone", "Private networking", "Free migration", "99.99% SLA"],
    icon: Cpu, gradient: "green" },
  { id: "shared-hosting", name: "Shared Hosting — Business", category: "hosting", price: 199, billing: "mo",
    description: "Unlimited SSD storage, free .in domain, LiteSpeed powered.",
    features: ["cPanel included", "Free SSL", "Unlimited email", "Softaculous 400+ apps"],
    icon: Cloud, gradient: "saffron" },
  { id: "domain-in", name: ".IN Domain Registration", category: "domains", price: 499, billing: "yr",
    description: "Register or transfer .in / .co.in domains with free WHOIS privacy.",
    features: ["Free DNS management", "Auto-renewal", "Domain lock", "Email forwarding"],
    icon: Globe, gradient: "brand" },
  { id: "ssl-wildcard", name: "Wildcard SSL Certificate", category: "domains", price: 4999, billing: "yr", badge: "Best Value",
    description: "Sectigo Wildcard SSL — secure your root & unlimited subdomains.",
    features: ["256-bit encryption", "₹1.75 Cr warranty", "SHA-2 & ECC", "Free reissuance"],
    icon: Shield, gradient: "green" },
  { id: "website-dev", name: "Website Development Package", category: "development", price: 24999, billing: "one-time", badge: "Featured",
    description: "Custom 8-page responsive website with CMS, SEO and 3 months support.",
    features: ["Next.js + Tailwind", "On-page SEO", "Analytics setup", "Dedicated PM"],
    icon: FileCode2, gradient: "saffron" },
  { id: "erp-suite", name: "Infiniforge ERP Suite", category: "saas", price: 2499, billing: "mo", badge: "New",
    description: "Modular ERP — inventory, HR, accounts, GST invoicing, projects.",
    features: ["GST compliant", "Multi-branch", "Role-based access", "Open API"],
    icon: Boxes, gradient: "brand" },
  { id: "crm-pro", name: "Infiniforge CRM Pro", category: "saas", price: 999, billing: "mo",
    description: "Sales pipeline, WhatsApp CRM, lead scoring and automations.",
    features: ["WhatsApp integration", "Kanban pipelines", "Email sequences", "Reports & forecasts"],
    icon: Briefcase, gradient: "green" },
  { id: "ai-agent", name: "AI Automation Agent", category: "ai-automation", price: 14999, billing: "mo", badge: "New",
    description: "Custom AI agent trained on your data — chat, voice or workflow.",
    features: ["LLM-agnostic", "RAG + tools", "n8n / Zapier ready", "Private deployment"],
    icon: Bot, gradient: "saffron" },
  { id: "server-mgmt", name: "Server Management (Linux)", category: "it-services", price: 3999, billing: "mo",
    description: "Full-stack Linux server management — patching, security, backups.",
    features: ["24×7 monitoring", "Security hardening", "Root cause reports", "Unlimited tickets"],
    icon: Wrench, gradient: "brand" },
  { id: "network-monitor", name: "Network Monitoring Suite", category: "monitoring", price: 2999, billing: "mo",
    description: "Real-time network health, SNMP, uptime & alerting for 100 devices.",
    features: ["Custom dashboards", "SMS / WhatsApp alerts", "SLA reports", "Multi-site"],
    icon: Activity, gradient: "green" },
  { id: "amc-gold", name: "Annual Maintenance — Gold AMC", category: "monitoring", price: 49999, billing: "yr", badge: "Popular",
    description: "Annual maintenance contract with 4-hour on-site response.",
    features: ["Priority tickets", "Quarterly audits", "Free minor upgrades", "Dedicated engineer"],
    icon: Headphones, gradient: "saffron" },
  { id: "whitelabel-saas", name: "White Label SaaS Platform", category: "saas", price: 199000, billing: "one-time", badge: "Featured",
    description: "Launch your own SaaS with our multi-tenant billing engine.",
    features: ["Your brand, your domain", "Razorpay billing", "Reseller module", "Source access"],
    icon: Layers, gradient: "brand" },
  { id: "android-app", name: "Android App Development", category: "development", price: 89999, billing: "one-time",
    description: "Native Android app — design, build, Play Store publish.",
    features: ["Kotlin / Jetpack", "Push notifications", "In-app purchase", "3 months support"],
    icon: MonitorSmartphone, gradient: "green" },
  { id: "windows-license", name: "Windows Server 2022 License", category: "licenses", price: 32999, billing: "one-time",
    description: "Genuine Microsoft Windows Server 2022 Standard, 16-core license.",
    features: ["Instant delivery", "Lifetime validity", "Original invoice", "Activation support"],
    icon: KeyRound, gradient: "saffron" },
  { id: "cpanel-license", name: "cPanel Admin License", category: "licenses", price: 2199, billing: "mo",
    description: "cPanel/WHM Admin license for up to 5 accounts on VPS.",
    features: ["Instant activation", "Auto-renewal", "IP change support", "24×7 support"],
    icon: Database, gradient: "brand" },
];

export const services = [
  { name: "Website Development", desc: "Corporate, ecommerce, portals — built on modern stacks.", icon: FileCode2, price: "Starts at ₹24,999" },
  { name: "Android & iOS Apps", desc: "Native and cross-platform apps with store publishing.", icon: MonitorSmartphone, price: "Starts at ₹89,999" },
  { name: "ERP Development", desc: "Custom ERP for manufacturing, retail, logistics.", icon: Boxes, price: "Starts at ₹2,49,999" },
  { name: "CRM Development", desc: "Sales, support and marketing CRM tailored to you.", icon: Briefcase, price: "Starts at ₹1,49,999" },
  { name: "AI Automation", desc: "Custom AI agents, RAG chatbots, workflow automations.", icon: Bot, price: "Starts at ₹14,999/mo" },
  { name: "Server Setup", desc: "Linux/Windows server provisioning & hardening.", icon: Server, price: "Starts at ₹4,999" },
  { name: "Cloud Migration", desc: "AWS, Azure, GCP migration with zero downtime.", icon: Cloud, price: "On request" },
  { name: "Network Setup", desc: "Enterprise LAN/WAN, firewalls, Wi-Fi & VPN.", icon: GitBranch, price: "On request" },
  { name: "24×7 Monitoring", desc: "Uptime, application & network monitoring.", icon: Activity, price: "Starts at ₹2,999/mo" },
  { name: "Consulting", desc: "IT strategy, DevOps, security & compliance.", icon: Package, price: "₹4,999/hr" },
  { name: "AMC Packages", desc: "Silver, Gold & Platinum annual maintenance.", icon: Headphones, price: "Starts at ₹49,999/yr" },
  { name: "Cyber Security", desc: "VAPT, security audits & incident response.", icon: Shield, price: "On request" },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
