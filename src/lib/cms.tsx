import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ============ Types ============
export type NavLink = { label: string; to: string };
export type FooterColumn = { title: string; links: NavLink[] };
export type StatItem = { label: string; value: string; icon?: string };
export type FeatureCard = { icon?: string; title: string; description: string };
export type Testimonial = { name: string; role: string; company?: string; quote: string; avatar_url?: string };
export type ServiceCard = { icon?: string; name: string; description: string; price: string };
export type PricingPlan = { name: string; tag: string; monthly: number; yearly: number; features: string[]; cta_label: string; cta_link: string; highlight: boolean };
export type ContactCard = { icon?: string; title: string; lines: string[]; accent?: boolean };
export type LegalPage = { slug: string; title: string; meta_description: string; body: string };
export type AnnouncementItem = { text: string; icon?: string; link?: string; cta_label?: string; enabled?: boolean };
export type BannerSlide = { eyebrow?: string; title: string; subtitle?: string; image_url?: string; cta_label?: string; cta_link?: string; cta2_label?: string; cta2_link?: string; enabled?: boolean };
export type DeploymentStack = { key: string; name: string };
export type DeploymentApp = {
  slug: string; name: string; tagline: string; description: string;
  stack: string; emoji: string; color: string; from_inr: number;
  popular?: boolean; new?: boolean; tags: string[]; enabled?: boolean;
};

export type CmsData = {
  branding: {
    brand_name: string;
    tagline: string;
    logo_url: string;
    favicon_url: string;
  };
  header: {
    nav: NavLink[];
    cta_label: string;
    cta_link: string;
  };
  footer: {
    tagline: string;
    email: string;
    phone: string;
    address: string;
    columns: FooterColumn[];
    copyright: string;
    gstin: string;
  };
  home: {
    hero_eyebrow: string;
    hero_title: string;
    hero_subtitle: string;
    hero_cta_primary: { label: string; link: string };
    hero_cta_secondary: { label: string; link: string };
    hero_checks: string[];
    stats: StatItem[];
    categories_title: string;
    categories_subtitle: string;
    features: FeatureCard[];
    featured_title: string;
    featured_eyebrow: string;
    testimonials_title: string;
    testimonials: Testimonial[];
    cta_title: string;
    cta_subtitle: string;
    cta_primary: { label: string; link: string };
    cta_secondary: { label: string; link: string };
  };
  services_page: {
    eyebrow: string;
    title: string;
    subtitle: string;
    services: ServiceCard[];
    process_title: string;
    process_subtitle: string;
    process_steps: { title: string; description: string }[];
  };
  products_page: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  product_detail: {
    features_title: string;
    description_title: string;
    gallery_title: string;
    related_title: string;
    related_subtitle: string;
    show_related: boolean;
    demo_button_label: string;
    buy_now_label: string;
    add_to_cart_label: string;
    trust_badges: { icon?: string; label: string }[];
    tabs: { key: string; label: string }[];
  };
  pricing_page: {
    eyebrow: string;
    title: string;
    subtitle: string;
    plans: PricingPlan[];
    footnote: string;
  };
  contact_page: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: ContactCard[];
    form_submit_label: string;
    form_success_message: string;
    form_recipient_email: string;
  };
  legal: {
    pages: LegalPage[];
  };
  deployments_page: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta_title: string;
    cta_subtitle: string;
    stacks: DeploymentStack[];
    apps: DeploymentApp[];
  };
  announcements: {
    enabled: boolean;
    dismissible: boolean;
    speed_seconds: number;
    badge_label: string;
    items: AnnouncementItem[];
  };
  banners: {
    enabled: boolean;
    autoplay: boolean;
    autoplay_seconds: number;
    slides: BannerSlide[];
  };
  seo: {
    site_url: string;
    default_title: string;
    default_description: string;
    default_keywords: string;
    default_og_image: string;
    twitter_handle: string;
    twitter_site: string;
    facebook_app_id: string;
    google_site_verification: string;
    bing_site_verification: string;
    robots: string;
    canonical_base: string;
    organization_name: string;
    organization_logo: string;
    organization_sameas: string[];
    ga_measurement_id: string;
    gtm_id: string;
    fb_pixel_id: string;
    hotjar_id: string;
    json_ld_enabled: boolean;
    sitemap_url: string;
    pages: {
      path: string;
      title: string;
      description: string;
      keywords: string;
      og_image: string;
      noindex: boolean;
    }[];
  };
  hosting_page: {
    eyebrow: string;
    badge: string;
    title: string;
    title_gradient: string;
    subtitle: string;
    cta_primary: { label: string; link: string };
    cta_secondary: { label: string; link: string };
    cta_tertiary: { label: string; link: string };
    stats: StatItem[];
    plans_title: string;
    plans_subtitle: string;
    datacenters_title: string;
    datacenters_subtitle: string;
    migration_title: string;
    migration_subtitle: string;
    testimonials_title: string;
    faq_title: string;
    final_cta_title: string;
    final_cta_subtitle: string;
    whatsapp_number: string;
    whatsapp_greeting: string;
  };
  whatsapp: {
    enabled: boolean;
    number: string;
    greeting: string;
    label: string;
    template: "premium" | "concise" | "invoice" | "enquiry";
    show_products: boolean;
    show_checkout: boolean;
    show_header: boolean;
  };
};

// ============ Defaults ============
export const CMS_DEFAULTS: CmsData = {
  branding: {
    brand_name: "Infiniforge Technologies",
    tagline: "Enterprise SaaS · IT · AI",
    logo_url: "/inficon.png",
    favicon_url: "/favicon.png",
  },
  header: {
    nav: [
      { label: "Home", to: "/" },
      { label: "Services", to: "/services" },
      { label: "Products", to: "/products" },
      { label: "Deployments", to: "/deployments" },
      { label: "Hosting", to: "/hosting" },
      { label: "Workflows", to: "/workflows" },
      { label: "Pricing", to: "/pricing" },
      { label: "Contact", to: "/contact" },
    ],
    cta_label: "Get started",
    cta_link: "/auth",
  },
  footer: {
    tagline: "India's unified platform for SaaS, IT services, hosting, licenses, and AI automation — built for enterprises, agencies and resellers.",
    email: "sales@infiniforge.cloud",
    phone: "+91 88888 12345",
    address: "Bengaluru · Mumbai · Delhi NCR",
    columns: [
      { title: "Platform", links: [{ label: "Services", to: "/services" }, { label: "Products", to: "/products" }, { label: "Pricing", to: "/pricing" }] },
      { title: "Solutions", links: [{ label: "Hosting & VPS", to: "/products" }, { label: "AI Automation", to: "/services" }, { label: "Website Dev", to: "/services" }] },
      { title: "Company", links: [{ label: "About", to: "/contact" }, { label: "Contact", to: "/contact" }, { label: "Terms", to: "/p/terms" }, { label: "Privacy", to: "/p/privacy" }] },
    ],
    copyright: "© {year} Infiniforge Technologies Pvt. Ltd.",
    gstin: "GSTIN 29ABCDE1234F1Z5",
  },
  home: {
    hero_eyebrow: "Your one-stop IT partner · Startups to Enterprises",
    hero_title: "Websites, software, servers, networks & IT services — engineered by Infiniforge.",
    hero_subtitle: "We design, build, host and maintain the technology that runs your business — websites, custom software, servers, CCTV, routers, internet, digital products, courses and 24×7 monitoring. One team, one invoice, one accountable partner.",
    hero_cta_primary: { label: "Explore services", link: "/services" },
    hero_cta_secondary: { label: "Talk to an engineer", link: "/contact" },
    hero_checks: ["GST-compliant invoicing", "Fixed timelines & quotes", "24×7 NOC & support", "Made in India"],
    stats: [
      { label: "Clients delivered", value: "1,200+", icon: "Users" },
      { label: "Infrastructure uptime", value: "99.99%", icon: "ShieldCheck" },
      { label: "Projects shipped", value: "8,400+", icon: "Rocket" },
      { label: "Repeat customers", value: "92%", icon: "TrendingUp" },
    ],
    categories_title: "Every service your business needs — under one roof.",
    categories_subtitle: "From your first website to enterprise cloud migration, from a single router to a 200-camera CCTV rollout — we deliver, install and maintain it with fixed pricing and GST invoices.",
    features: [
      { icon: "Wifi", title: "Internet & Leased Line", description: "Enterprise fiber, business broadband and dedicated internet with 99.9% SLA." },
      { icon: "Activity", title: "24×7 NOC Monitoring", description: "Server, website, network and CCTV monitoring with WhatsApp/SMS alerts and on-site response." },
    ],
    featured_eyebrow: "What we deliver",
    featured_title: "Popular products & services",
    testimonials_title: "Trusted by businesses across India",
    testimonials: [
      { name: "Priya Sharma", role: "CTO", company: "Kalpana Retail", quote: "Infiniforge rebuilt our website, migrated hosting and rolled out CCTV across 12 stores in a month. Single point of accountability, zero hassle." },
      { name: "Rahul Menon", role: "Founder", company: "CloudPeak Ventures", quote: "From domain to server to custom software — they delivered our SaaS in 6 weeks. AMC support has been rock solid." },
      { name: "Anjali Reddy", role: "Head of Ops", company: "Nexora Fintech", quote: "Leased-line, firewall, 24×7 NOC and app monitoring — all from one team. Finance loves the consolidated GST invoices." },
    ],
    cta_title: "Have a project, network rollout or software idea?",
    cta_subtitle: "Get a free consultation and a fixed-price quote within 24 hours. From a ₹25K website to a ₹2Cr enterprise deployment — we scope it, build it, deliver it.",
    cta_primary: { label: "Get a free quote", link: "/contact" },
    cta_secondary: { label: "See memberships", link: "/pricing" },
  },
  services_page: {
    eyebrow: "Enterprise services",
    title: "End-to-end IT services engineered for India-first enterprises.",
    subtitle: "From your first website to a fully-managed multi-cloud deployment — one accountable partner, fixed timelines, GST invoices, and 24×7 support.",
    services: [
      { icon: "FileCode2", name: "Website Development", description: "Corporate, ecommerce, portals — built on modern stacks.", price: "Starts at ₹24,999" },
      { icon: "MonitorSmartphone", name: "Android & iOS Apps", description: "Native and cross-platform apps with store publishing.", price: "Starts at ₹89,999" },
      { icon: "Boxes", name: "ERP Development", description: "Custom ERP for manufacturing, retail, logistics.", price: "Starts at ₹2,49,999" },
      { icon: "Briefcase", name: "CRM Development", description: "Sales, support and marketing CRM tailored to you.", price: "Starts at ₹1,49,999" },
      { icon: "Bot", name: "AI Automation", description: "Custom AI agents, RAG chatbots, workflow automations.", price: "Starts at ₹14,999/mo" },
      { icon: "Server", name: "Server Setup", description: "Linux/Windows server provisioning & hardening.", price: "Starts at ₹4,999" },
      { icon: "Cloud", name: "Cloud Migration", description: "AWS, Azure, GCP migration with zero downtime.", price: "On request" },
      { icon: "GitBranch", name: "Network Setup", description: "Enterprise LAN/WAN, firewalls, Wi-Fi & VPN.", price: "On request" },
      { icon: "Activity", name: "24×7 Monitoring", description: "Uptime, application & network monitoring.", price: "Starts at ₹2,999/mo" },
      { icon: "Package", name: "Consulting", description: "IT strategy, DevOps, security & compliance.", price: "₹4,999/hr" },
      { icon: "Headphones", name: "AMC Packages", description: "Silver, Gold & Platinum annual maintenance.", price: "Starts at ₹49,999/yr" },
      { icon: "Shield", name: "Cyber Security", description: "VAPT, security audits & incident response.", price: "On request" },
    ],
    process_title: "How we deliver, every single time.",
    process_subtitle: "A proven delivery framework used across 1,200+ enterprise engagements — with milestone-based billing, weekly demos and a dedicated project manager.",
    process_steps: [
      { title: "Discovery", description: "Requirements workshop, scope, timeline and quotation." },
      { title: "Design", description: "UX flows, architecture diagrams and click-through prototype." },
      { title: "Build", description: "Sprint-based delivery with weekly demos and staging access." },
      { title: "Launch", description: "Go-live, training, documentation and handover." },
      { title: "Support", description: "AMC with 24×7 monitoring and prioritised tickets." },
    ],
  },
  products_page: {
    eyebrow: "Product catalog",
    title: "All Infiniforge products",
    subtitle: "Browse SaaS, hosting, licenses, digital products and services. Buy with wallet, UPI or Razorpay.",
  },
  product_detail: {
    features_title: "What's included",
    description_title: "Overview",
    gallery_title: "Screenshots",
    related_title: "You may also like",
    related_subtitle: "Handpicked products in the same category",
    show_related: true,
    demo_button_label: "Live Preview",
    buy_now_label: "Buy now",
    add_to_cart_label: "Add to cart",
    trust_badges: [
      { icon: "ShieldCheck", label: "GST invoice included" },
      { icon: "Zap", label: "Instant activation" },
      { icon: "Headphones", label: "24×7 support" },
      { icon: "RefreshCw", label: "7-day money-back" },
    ],
    tabs: [
      { key: "overview", label: "Overview" },
      { key: "features", label: "Features" },
      { key: "specs", label: "Specifications" },
    ],
  },
  pricing_page: {
    eyebrow: "Care plans & memberships",
    title: "Membership plans built around your business.",
    subtitle: "Pick a care plan that covers your website, servers, network and support — or subscribe to a membership for priority delivery, discounted rates and dedicated engineers. All plans include GST invoices and cancel-anytime billing.",
    plans: [
      { name: "Startup Care", tag: "Startups & small businesses", monthly: 1499, yearly: 14990, features: ["1 website hosting + SSL + backups", "1 business email domain", "Monthly maintenance & updates", "Basic uptime monitoring", "Email + WhatsApp support (business hours)", "10% off any new project"], cta_label: "Get started", cta_link: "/contact", highlight: false },
      { name: "Business Growth", tag: "Most popular · SMBs & agencies", monthly: 4999, yearly: 49990, features: ["Everything in Startup Care", "Up to 3 websites / apps managed", "Server & VPS management (Linux/Windows)", "Router / CCTV / network AMC support", "Priority ticket SLA + phone support", "20% off new projects & digital products"], cta_label: "Get started", cta_link: "/contact", highlight: true },
      { name: "Enterprise Partner", tag: "Enterprises · ISPs · System integrators", monthly: 14999, yearly: 149990, features: ["Everything in Business Growth", "Dedicated engineer + success manager", "24×7 NOC monitoring & incident response", "Custom software / IT solutions retainer", "On-site visits & leased-line billing", "99.99% uptime SLA + DPA + on-site"], cta_label: "Talk to sales", cta_link: "/contact", highlight: false },
    ],
    footnote: "Every plan is a service agreement, not a software subscription — real engineers, real deliverables, real GST invoices.",
  },
  contact_page: {
    eyebrow: "Let's talk",
    title: "Get a personalised demo of Infiniforge.",
    subtitle: "Sales, partnerships or support — we typically reply within 4 business hours.",
    cards: [
      { icon: "Mail", title: "Sales", lines: ["sales@infiniforge.cloud", "Response within 4 hrs"] },
      { icon: "Phone", title: "Phone", lines: ["+91 88888 12345", "Mon–Sat · 9 AM – 8 PM IST"] },
      { icon: "MessageCircle", title: "WhatsApp", lines: ["+91 88888 12345", "Order & support 24×7"], accent: true },
      { icon: "MapPin", title: "Offices", lines: ["Bengaluru · HSR Layout", "Mumbai · BKC", "Delhi NCR · Sector 62"] },
    ],
    form_submit_label: "Send message",
    form_success_message: "Thanks! Our team will reach out within 4 business hours.",
    form_recipient_email: "sales@infiniforge.cloud",
  },
  legal: {
    pages: [
      { slug: "terms", title: "Terms of Service", meta_description: "Infiniforge Technologies terms of service.", body: "## Terms of Service\n\nBy using Infiniforge Technologies you agree to our terms. Update this content in Admin → Site CMS → Legal pages." },
      { slug: "privacy", title: "Privacy Policy", meta_description: "How Infiniforge handles your data.", body: "## Privacy Policy\n\nWe respect your privacy. Update this content in Admin → Site CMS → Legal pages." },
      { slug: "refund", title: "Refund Policy", meta_description: "Refund and cancellation policy.", body: "## Refund Policy\n\nUpdate this in Admin → Site CMS." },
      { slug: "sla", title: "Service Level Agreement", meta_description: "Uptime SLA and support response times.", body: "## SLA\n\n99.99% uptime for hosting and infrastructure services." },
    ],
  },
  deployments_page: {
    eyebrow: "Managed one-click deployments",
    title: "Deploy Coolify-style prebuilt apps on your own cloud.",
    subtitle: "Pick from 70+ battle-tested open-source and SaaS applications. We install, secure, back up and monitor them on a VPS of your choice — you keep 100% ownership of the data.",
    cta_title: "Don't see the app you need?",
    cta_subtitle: "We deploy any Docker-based or open-source application. Send us the GitHub link — we'll take it from there.",
    stacks: [
      { key: "all", name: "All" },
      { key: "automation", name: "Automation & Ops" },
      { key: "cms", name: "CMS & Websites" },
      { key: "erp", name: "ERP & Business" },
      { key: "collab", name: "Collaboration" },
      { key: "monitoring", name: "Monitoring & Analytics" },
      { key: "devops", name: "DevOps & Hosting" },
      { key: "database", name: "Databases & Storage" },
      { key: "media", name: "Media & Cloud" },
      { key: "security", name: "Security & Privacy" },
      { key: "ecommerce", name: "eCommerce" },
      { key: "lowcode", name: "Low-code & Internal Tools" },
    ],
    apps: [
      { slug: "coolify", name: "Coolify", tagline: "Self-hosted Heroku / Vercel alternative", description: "Deploy any Docker app, database or static site with git push, auto-SSL, previews and one-click rollbacks on your own VPS.", stack: "devops", emoji: "🚀", color: "from-fuchsia-500 to-purple-600", from_inr: 1499, popular: true, tags: ["Docker", "Git deploy", "Auto SSL"], enabled: true },
      { slug: "dokploy", name: "Dokploy", tagline: "Modern PaaS for Docker & Compose", description: "Deploy apps, databases and templates with one click. Backups, monitoring and multi-server support built in.", stack: "devops", emoji: "🐳", color: "from-blue-500 to-indigo-600", from_inr: 1299, new: true, tags: ["PaaS", "Compose", "Backups"], enabled: true },
      { slug: "caprover", name: "CapRover", tagline: "One-click PaaS on your server", description: "Simple PaaS with 100+ one-click apps, custom domains and auto SSL — great for solo devs and small teams.", stack: "devops", emoji: "⚓", color: "from-cyan-500 to-blue-600", from_inr: 999, tags: ["PaaS", "One-click", "Nginx"], enabled: true },
      { slug: "n8n", name: "n8n", tagline: "Workflow automation with 400+ integrations", description: "Self-hosted alternative to Zapier/Make with AI nodes, webhooks, cron and unlimited executions on your infra.", stack: "automation", emoji: "🔗", color: "from-rose-500 to-orange-500", from_inr: 999, popular: true, tags: ["No-code", "AI nodes", "Webhooks"], enabled: true },
      { slug: "activepieces", name: "Activepieces", tagline: "Open Zapier alternative with AI", description: "Visual automation with typed pieces, AI copilot and unlimited runs. Perfect for internal ops.", stack: "automation", emoji: "🧩", color: "from-violet-500 to-purple-600", from_inr: 1099, new: true, tags: ["AI", "Automation", "Open source"], enabled: true },
      { slug: "windmill", name: "Windmill", tagline: "Workflow engine + internal apps", description: "Turn scripts into workflows, endpoints and UIs. Great for DevOps and data teams.", stack: "lowcode", emoji: "🌬️", color: "from-sky-500 to-blue-600", from_inr: 1299, tags: ["Scripts", "APIs", "Apps"], enabled: true },
      { slug: "trigger-dev", name: "Trigger.dev", tagline: "Background jobs & scheduled tasks", description: "Long-running background jobs with retries, delays and observability. Self-host on your infra.", stack: "automation", emoji: "⏱️", color: "from-orange-500 to-red-600", from_inr: 1299, new: true, tags: ["Jobs", "Cron", "Queues"], enabled: true },
      { slug: "wordpress", name: "WordPress", tagline: "The world's most popular CMS", description: "LiteSpeed-tuned WordPress with WooCommerce, Elementor, free SSL, daily backups and staging.", stack: "cms", emoji: "🅆", color: "from-sky-500 to-blue-600", from_inr: 499, tags: ["WooCommerce", "LiteSpeed", "Staging"], enabled: true },
      { slug: "ghost", name: "Ghost", tagline: "Modern publishing & newsletters", description: "Managed Ghost with Mailgun, memberships, Stripe and custom themes. Perfect for blogs and paid newsletters.", stack: "cms", emoji: "👻", color: "from-slate-600 to-slate-800", from_inr: 899, tags: ["Newsletter", "Memberships", "SEO"], enabled: true },
      { slug: "strapi", name: "Strapi", tagline: "Headless CMS for developers", description: "Node headless CMS with PostgreSQL, media library, roles and REST/GraphQL APIs. Great for JAMstack sites.", stack: "cms", emoji: "🧩", color: "from-indigo-500 to-violet-600", from_inr: 1299, tags: ["Headless", "GraphQL", "REST"], enabled: true },
      { slug: "directus", name: "Directus", tagline: "Instant API on any SQL database", description: "Data platform that turns any Postgres/MySQL schema into an admin app + REST/GraphQL API.", stack: "cms", emoji: "🗂️", color: "from-emerald-500 to-teal-600", from_inr: 1299, tags: ["Postgres", "Admin app", "API"], enabled: true },
      { slug: "payloadcms", name: "Payload CMS", tagline: "TypeScript-first headless CMS", description: "Code-defined collections, auth, media and admin UI. Self-host with Postgres or Mongo.", stack: "cms", emoji: "📦", color: "from-amber-500 to-orange-600", from_inr: 1399, new: true, tags: ["TypeScript", "Admin UI", "Auth"], enabled: true },
      { slug: "wagtail", name: "Wagtail", tagline: "Python/Django CMS", description: "Editor-friendly Django CMS used by Google, NASA and Mozilla. Great for content-heavy sites.", stack: "cms", emoji: "🐦", color: "from-teal-500 to-emerald-600", from_inr: 1199, tags: ["Django", "Editorial", "Search"], enabled: true },
      { slug: "mediawiki", name: "MediaWiki", tagline: "The engine behind Wikipedia", description: "Enterprise wiki with rich extensions, ACLs and full-text search — ideal for internal knowledge.", stack: "collab", emoji: "📖", color: "from-slate-500 to-gray-700", from_inr: 999, tags: ["Wiki", "Extensions", "ACL"], enabled: true },
      { slug: "odoo", name: "Odoo Community", tagline: "All-in-one open-source ERP", description: "Sales, CRM, inventory, POS, accounting, HR — 30+ modules with Indian GST localisation.", stack: "erp", emoji: "🧠", color: "from-purple-600 to-indigo-600", from_inr: 2499, popular: true, tags: ["GST ready", "CRM", "POS"], enabled: true },
      { slug: "erpnext", name: "ERPNext", tagline: "Frappe-based open ERP for India", description: "Manufacturing, retail, services, education — fully GST-compliant ERP with unlimited users.", stack: "erp", emoji: "📊", color: "from-blue-600 to-cyan-600", from_inr: 2299, tags: ["GST", "Manufacturing", "Unlimited users"], enabled: true },
      { slug: "invoice-ninja", name: "Invoice Ninja", tagline: "Invoicing, quoting & payments", description: "Self-hosted invoicing with Stripe, PayPal, recurring, projects and time tracking.", stack: "erp", emoji: "🥷", color: "from-blue-500 to-indigo-600", from_inr: 899, tags: ["Invoicing", "Stripe", "Recurring"], enabled: true },
      { slug: "kimai", name: "Kimai", tagline: "Time tracking for teams", description: "Track billable hours, projects and expenses. Perfect for agencies and freelancers.", stack: "erp", emoji: "⏳", color: "from-emerald-500 to-teal-600", from_inr: 799, tags: ["Timesheets", "Invoicing", "Teams"], enabled: true },
      { slug: "snipe-it", name: "Snipe-IT", tagline: "IT asset management", description: "Track laptops, licenses, accessories and consumables with check-in/out and QR labels.", stack: "erp", emoji: "🏷️", color: "from-red-500 to-rose-600", from_inr: 1099, tags: ["Assets", "Licenses", "QR"], enabled: true },
      { slug: "zammad", name: "Zammad", tagline: "Modern helpdesk & ticketing", description: "Multi-channel helpdesk with email, chat, Telegram, Twitter and SLAs.", stack: "collab", emoji: "🎫", color: "from-orange-500 to-red-600", from_inr: 1299, tags: ["Helpdesk", "SLA", "Multi-channel"], enabled: true },
      { slug: "mautic", name: "Mautic", tagline: "Open-source marketing automation", description: "Email campaigns, landing pages, lead scoring and drip workflows — a self-hosted HubSpot alternative.", stack: "automation", emoji: "📣", color: "from-amber-500 to-orange-600", from_inr: 1199, tags: ["Email", "Lead scoring", "Landing pages"], enabled: true },
      { slug: "listmonk", name: "Listmonk", tagline: "High-performance newsletter engine", description: "Send millions of emails with lists, segments, campaigns and analytics. Blazing fast (Go).", stack: "automation", emoji: "✉️", color: "from-indigo-500 to-violet-600", from_inr: 999, tags: ["Newsletter", "Bulk email", "SMTP"], enabled: true },
      { slug: "formbricks", name: "Formbricks", tagline: "Open-source surveys & feedback", description: "In-app surveys, NPS, product feedback and link surveys — a Typeform alternative.", stack: "automation", emoji: "🧱", color: "from-pink-500 to-rose-600", from_inr: 899, new: true, tags: ["Surveys", "NPS", "Feedback"], enabled: true },
      { slug: "chatwoot", name: "Chatwoot", tagline: "Omnichannel customer support", description: "Live chat, WhatsApp, Instagram, Facebook, email — one inbox for your whole team.", stack: "collab", emoji: "💬", color: "from-emerald-500 to-green-600", from_inr: 1499, new: true, tags: ["WhatsApp", "Live chat", "Helpdesk"], enabled: true },
      { slug: "cal-com", name: "Cal.com", tagline: "Open-source scheduling like Calendly", description: "Bookings, round-robin, workflows, payments and team scheduling on your own domain.", stack: "collab", emoji: "📅", color: "from-fuchsia-500 to-pink-600", from_inr: 999, tags: ["Bookings", "Stripe", "Workflows"], enabled: true },
      { slug: "rocketchat", name: "Rocket.Chat", tagline: "Enterprise team messaging", description: "Slack-style chat, video, threads, LDAP/SAML SSO, mobile apps and channels.", stack: "collab", emoji: "🚀", color: "from-red-500 to-rose-600", from_inr: 1799, tags: ["SSO", "Video", "Mobile"], enabled: true },
      { slug: "mattermost", name: "Mattermost", tagline: "Secure collaboration for teams", description: "Messaging + playbooks + boards. Ideal for DevOps and regulated industries.", stack: "collab", emoji: "🛰️", color: "from-blue-500 to-indigo-600", from_inr: 1799, tags: ["Playbooks", "Boards", "Secure"], enabled: true },
      { slug: "zulip", name: "Zulip", tagline: "Threaded team chat", description: "Topic-based threaded chat used by Rust, Wikimedia and Recurse. Better for async teams.", stack: "collab", emoji: "💭", color: "from-emerald-500 to-teal-600", from_inr: 1299, tags: ["Threads", "Async", "Search"], enabled: true },
      { slug: "element", name: "Element / Matrix", tagline: "Federated secure messaging", description: "End-to-end encrypted chat and voice on the Matrix protocol. Bridges to Slack, Discord, WhatsApp.", stack: "collab", emoji: "🧬", color: "from-teal-500 to-cyan-600", from_inr: 1499, tags: ["E2EE", "Federated", "Bridges"], enabled: true },
      { slug: "jitsi", name: "Jitsi Meet", tagline: "Secure open video conferencing", description: "Unlimited HD meetings on your own domain — no accounts required.", stack: "collab", emoji: "🎦", color: "from-blue-500 to-sky-600", from_inr: 1299, tags: ["Video", "Rooms", "Recording"], enabled: true },
      { slug: "bigbluebutton", name: "BigBlueButton", tagline: "Virtual classroom platform", description: "Purpose-built for online teaching with whiteboards, polls, breakout rooms and recording.", stack: "collab", emoji: "🎓", color: "from-blue-600 to-indigo-700", from_inr: 1999, tags: ["Classroom", "Whiteboard", "Recording"], enabled: true },
      { slug: "bookstack", name: "BookStack", tagline: "Wiki & knowledge base", description: "Beautiful docs for teams — shelves, books, chapters and pages with RBAC.", stack: "collab", emoji: "📚", color: "from-teal-500 to-cyan-600", from_inr: 899, tags: ["Wiki", "Docs", "RBAC"], enabled: true },
      { slug: "outline", name: "Outline", tagline: "Modern team wiki", description: "Notion-style knowledge base with collaboration, slash commands and integrations.", stack: "collab", emoji: "📝", color: "from-indigo-500 to-purple-600", from_inr: 1199, tags: ["Wiki", "Slack", "Notion-like"], enabled: true },
      { slug: "hedgedoc", name: "HedgeDoc", tagline: "Collaborative markdown notes", description: "Real-time collaborative markdown editor with slides, diagrams and history.", stack: "collab", emoji: "🦔", color: "from-emerald-500 to-green-600", from_inr: 699, tags: ["Markdown", "Real-time", "Slides"], enabled: true },
      { slug: "etherpad", name: "Etherpad", tagline: "Real-time collaborative editor", description: "Simple, fast collaborative editor with authorship colours and revision history.", stack: "collab", emoji: "📄", color: "from-amber-500 to-orange-600", from_inr: 599, tags: ["Docs", "Real-time", "Plugins"], enabled: true },
      { slug: "wekan", name: "Wekan", tagline: "Open-source kanban boards", description: "Trello-style boards with swimlanes, checklists and integrations.", stack: "collab", emoji: "📋", color: "from-blue-500 to-cyan-600", from_inr: 799, tags: ["Kanban", "Boards", "Teams"], enabled: true },
      { slug: "focalboard", name: "Focalboard", tagline: "Project & task management", description: "Notion/Trello alternative with boards, tables and Gantt views. Great for engineering teams.", stack: "collab", emoji: "🎯", color: "from-indigo-500 to-blue-600", from_inr: 899, tags: ["Kanban", "Gantt", "Tables"], enabled: true },
      { slug: "vikunja", name: "Vikunja", tagline: "The to-do app to end all to-do apps", description: "Fast open-source task manager with lists, teams, filters and mobile apps.", stack: "collab", emoji: "✅", color: "from-orange-500 to-red-500", from_inr: 699, tags: ["Tasks", "Teams", "Mobile"], enabled: true },
      { slug: "nextcloud", name: "Nextcloud", tagline: "Private file sync, share & office", description: "Drive-style file sync, calendar, contacts, video calls and Collabora office on your infra.", stack: "media", emoji: "☁️", color: "from-sky-500 to-blue-600", from_inr: 1299, popular: true, tags: ["Files", "Office", "Calendar"], enabled: true },
      { slug: "seafile", name: "Seafile", tagline: "Enterprise file sync & share", description: "Fast reliable file sync with client-side encryption and Windows drive.", stack: "media", emoji: "📁", color: "from-blue-500 to-indigo-600", from_inr: 1199, tags: ["Sync", "Encryption", "Teams"], enabled: true },
      { slug: "immich", name: "Immich", tagline: "Google Photos alternative", description: "Self-hosted photo & video backup with AI face/object search and mobile apps.", stack: "media", emoji: "🖼️", color: "from-indigo-500 to-purple-600", from_inr: 1099, new: true, tags: ["AI search", "Backup", "Mobile"], enabled: true },
      { slug: "photoprism", name: "PhotoPrism", tagline: "AI-powered photo management", description: "Browse and organize photos with AI tagging, faces and geo-search.", stack: "media", emoji: "📷", color: "from-amber-500 to-orange-600", from_inr: 999, tags: ["AI tagging", "Geo", "Faces"], enabled: true },
      { slug: "jellyfin", name: "Jellyfin", tagline: "Personal media streaming server", description: "Stream movies, shows, music and photos to any device — 100% free & open source.", stack: "media", emoji: "🎬", color: "from-violet-500 to-purple-600", from_inr: 999, tags: ["Streaming", "Transcoding", "Multi-user"], enabled: true },
      { slug: "peertube", name: "PeerTube", tagline: "Decentralised video platform", description: "Host your own YouTube with federation, live streaming and P2P delivery.", stack: "media", emoji: "🎥", color: "from-orange-500 to-red-600", from_inr: 1499, tags: ["Video", "Live", "Federation"], enabled: true },
      { slug: "owncast", name: "Owncast", tagline: "Self-hosted live streaming", description: "Twitch-like live video and chat on your own domain. No ads, no fees.", stack: "media", emoji: "📡", color: "from-red-500 to-pink-600", from_inr: 999, new: true, tags: ["Live", "RTMP", "Chat"], enabled: true },
      { slug: "supabase", name: "Supabase (Self-host)", tagline: "Open Firebase alternative", description: "Postgres + Auth + Storage + Realtime + Edge Functions on your own VPS.", stack: "devops", emoji: "⚡", color: "from-emerald-500 to-green-600", from_inr: 1999, popular: true, tags: ["Postgres", "Auth", "Realtime"], enabled: true },
      { slug: "appwrite", name: "Appwrite", tagline: "Backend-as-a-Service for apps", description: "Auth, DB, storage, functions and messaging for web, mobile and Flutter apps.", stack: "devops", emoji: "🧱", color: "from-pink-500 to-rose-600", from_inr: 1799, tags: ["Auth", "Functions", "Flutter"], enabled: true },
      { slug: "pocketbase", name: "PocketBase", tagline: "Backend in a single file", description: "SQLite-backed BaaS with realtime, auth, admin UI and REST API. Perfect for MVPs.", stack: "devops", emoji: "🪶", color: "from-slate-500 to-slate-700", from_inr: 799, new: true, tags: ["SQLite", "Auth", "Realtime"], enabled: true },
      { slug: "gitea", name: "Gitea", tagline: "Lightweight self-hosted Git", description: "GitHub-style repos, PRs, issues, packages and Actions on modest hardware.", stack: "devops", emoji: "🍵", color: "from-teal-500 to-emerald-600", from_inr: 799, tags: ["Git", "CI", "Packages"], enabled: true },
      { slug: "gitlab", name: "GitLab CE", tagline: "Complete DevOps platform", description: "Git repos, CI/CD, container registry, security scanning and issue tracking.", stack: "devops", emoji: "🦊", color: "from-orange-500 to-red-600", from_inr: 2299, tags: ["Git", "CI/CD", "Registry"], enabled: true },
      { slug: "forgejo", name: "Forgejo", tagline: "Community-run Gitea fork", description: "Self-hosted Git with Actions, packages and federation on the roadmap.", stack: "devops", emoji: "🌱", color: "from-emerald-500 to-teal-600", from_inr: 799, new: true, tags: ["Git", "Actions", "Community"], enabled: true },
      { slug: "drone", name: "Drone CI", tagline: "Container-native CI/CD", description: "YAML pipelines that run each step in its own container — fast and reproducible.", stack: "devops", emoji: "🛠️", color: "from-slate-500 to-gray-700", from_inr: 1299, tags: ["CI/CD", "Docker", "Pipelines"], enabled: true },
      { slug: "woodpecker", name: "Woodpecker CI", tagline: "Simple, YAML-based CI", description: "Lightweight Drone-compatible CI with plugins and multi-runner support.", stack: "devops", emoji: "🐦", color: "from-lime-500 to-green-600", from_inr: 999, tags: ["CI", "YAML", "Plugins"], enabled: true },
      { slug: "jenkins", name: "Jenkins", tagline: "The battle-tested CI server", description: "1800+ plugins, distributed builds and pipelines as code — the industry standard.", stack: "devops", emoji: "🧰", color: "from-red-500 to-orange-600", from_inr: 1499, tags: ["CI/CD", "Plugins", "Pipelines"], enabled: true },
      { slug: "portainer", name: "Portainer", tagline: "Docker & Kubernetes UI", description: "Manage containers, stacks, images and clusters visually with RBAC.", stack: "devops", emoji: "⛴️", color: "from-blue-500 to-sky-600", from_inr: 899, tags: ["Docker", "K8s", "RBAC"], enabled: true },
      { slug: "traefik", name: "Traefik", tagline: "Modern reverse proxy & load balancer", description: "Auto-discovery for Docker/K8s with Let's Encrypt, middlewares and dashboards.", stack: "devops", emoji: "🚦", color: "from-cyan-500 to-blue-600", from_inr: 799, tags: ["Reverse proxy", "SSL", "K8s"], enabled: true },
      { slug: "nginx-proxy-manager", name: "Nginx Proxy Manager", tagline: "Reverse proxy with a GUI", description: "Manage proxy hosts, SSL certs and streams from a beautiful web UI.", stack: "devops", emoji: "🔀", color: "from-emerald-500 to-teal-600", from_inr: 599, tags: ["Proxy", "SSL", "GUI"], enabled: true },
      { slug: "grafana", name: "Grafana + Prometheus", tagline: "Observability stack", description: "Beautiful dashboards, alerts and log exploration for servers, apps and networks.", stack: "monitoring", emoji: "📈", color: "from-orange-500 to-amber-600", from_inr: 1499, tags: ["Dashboards", "Alerts", "Logs"], enabled: true },
      { slug: "uptime-kuma", name: "Uptime Kuma", tagline: "Self-hosted status & uptime", description: "Beautiful uptime monitoring with public status pages and 90+ notification channels.", stack: "monitoring", emoji: "🟢", color: "from-emerald-500 to-teal-600", from_inr: 599, popular: true, tags: ["Uptime", "Status page", "Alerts"], enabled: true },
      { slug: "metabase", name: "Metabase", tagline: "Business intelligence, simple", description: "Ask questions of your database in plain English, dashboards and email reports.", stack: "monitoring", emoji: "📊", color: "from-blue-500 to-indigo-600", from_inr: 1299, tags: ["BI", "Dashboards", "SQL"], enabled: true },
      { slug: "superset", name: "Apache Superset", tagline: "Enterprise BI & data exploration", description: "Rich dashboards, SQL Lab and 40+ visualisations for analytics teams.", stack: "monitoring", emoji: "🧮", color: "from-indigo-500 to-purple-600", from_inr: 1599, tags: ["BI", "SQL", "Charts"], enabled: true },
      { slug: "redash", name: "Redash", tagline: "SQL-based dashboards", description: "Query, visualise and share data from 50+ databases and APIs.", stack: "monitoring", emoji: "🔴", color: "from-red-500 to-rose-600", from_inr: 1299, tags: ["SQL", "Dashboards", "Alerts"], enabled: true },
      { slug: "matomo", name: "Matomo Analytics", tagline: "Privacy-first Google Analytics", description: "100% data ownership, GDPR compliant, heatmaps, funnels and A/B testing.", stack: "monitoring", emoji: "🔎", color: "from-purple-500 to-pink-600", from_inr: 1099, tags: ["GDPR", "Heatmaps", "Funnels"], enabled: true },
      { slug: "plausible", name: "Plausible", tagline: "Lightweight web analytics", description: "Cookieless, GDPR-friendly analytics with a single-page dashboard.", stack: "monitoring", emoji: "📉", color: "from-indigo-500 to-blue-600", from_inr: 899, tags: ["Cookieless", "GDPR", "Fast"], enabled: true },
      { slug: "umami", name: "Umami", tagline: "Simple, privacy-friendly analytics", description: "Fast, cookieless web analytics with a clean dashboard. Under 2KB tracker.", stack: "monitoring", emoji: "🍥", color: "from-teal-500 to-cyan-600", from_inr: 799, new: true, tags: ["Analytics", "Privacy", "Fast"], enabled: true },
      { slug: "posthog", name: "PostHog", tagline: "Product analytics & session replay", description: "Events, funnels, feature flags, A/B tests and session recordings — all in one.", stack: "monitoring", emoji: "🦔", color: "from-orange-500 to-amber-600", from_inr: 1799, tags: ["Product", "Replay", "Flags"], enabled: true },
      { slug: "sentry", name: "Sentry", tagline: "Error & performance monitoring", description: "Real-time error tracking, tracing and release health for web, mobile and backend.", stack: "monitoring", emoji: "🛎️", color: "from-purple-500 to-indigo-600", from_inr: 1999, tags: ["Errors", "Tracing", "Releases"], enabled: true },
      { slug: "postgres", name: "PostgreSQL", tagline: "Managed Postgres cluster", description: "Tuned Postgres with PITR backups, replication and pgAdmin.", stack: "database", emoji: "🐘", color: "from-blue-600 to-indigo-700", from_inr: 999, tags: ["Backups", "Replication", "pgAdmin"], enabled: true },
      { slug: "mysql", name: "MySQL / MariaDB", tagline: "Managed relational database", description: "Optimised MySQL/MariaDB with automated backups, Percona toolkit and phpMyAdmin.", stack: "database", emoji: "🐬", color: "from-sky-500 to-blue-600", from_inr: 899, tags: ["Backups", "Percona", "phpMyAdmin"], enabled: true },
      { slug: "redis", name: "Redis", tagline: "In-memory data & cache", description: "Persisted Redis with replication and Sentinel for HA.", stack: "database", emoji: "🧠", color: "from-red-500 to-rose-600", from_inr: 699, tags: ["Cache", "Pub/Sub", "HA"], enabled: true },
      { slug: "minio", name: "MinIO", tagline: "S3-compatible object storage", description: "High-performance S3 alternative for backups, media and data lakes.", stack: "database", emoji: "🪣", color: "from-amber-500 to-orange-600", from_inr: 1299, tags: ["S3 API", "Buckets", "Versioning"], enabled: true },
      { slug: "mongodb", name: "MongoDB", tagline: "Managed document database", description: "Replicated MongoDB with backups and Compass access.", stack: "database", emoji: "🍃", color: "from-emerald-500 to-green-700", from_inr: 1199, tags: ["Replica set", "Compass", "Backups"], enabled: true },
      { slug: "clickhouse", name: "ClickHouse", tagline: "Blazing-fast OLAP database", description: "Columnar analytics DB for billions of rows and sub-second queries.", stack: "database", emoji: "🏎️", color: "from-yellow-500 to-orange-500", from_inr: 1599, new: true, tags: ["OLAP", "Analytics", "Columnar"], enabled: true },
      { slug: "elastic", name: "Elasticsearch + Kibana", tagline: "Search & log analytics", description: "Full-text search and log analytics with beautiful Kibana dashboards.", stack: "database", emoji: "🔍", color: "from-teal-500 to-cyan-600", from_inr: 1799, tags: ["Search", "Logs", "Kibana"], enabled: true },
      { slug: "meilisearch", name: "Meilisearch", tagline: "Lightning-fast search API", description: "Typo-tolerant instant search for apps, sites and docs — Algolia alternative.", stack: "database", emoji: "🔎", color: "from-pink-500 to-rose-600", from_inr: 899, new: true, tags: ["Search", "API", "Fast"], enabled: true },
      { slug: "typesense", name: "Typesense", tagline: "Open-source instant search", description: "Sub-50ms search with typo tolerance, faceting and geo-search.", stack: "database", emoji: "⚡", color: "from-indigo-500 to-blue-600", from_inr: 999, tags: ["Search", "Faceting", "Geo"], enabled: true },
      { slug: "qdrant", name: "Qdrant", tagline: "Vector database for AI", description: "High-performance vector search for RAG, recommendations and semantic search.", stack: "database", emoji: "🧬", color: "from-purple-500 to-fuchsia-600", from_inr: 1499, new: true, tags: ["Vector", "AI", "RAG"], enabled: true },
      { slug: "vaultwarden", name: "Vaultwarden", tagline: "Self-hosted Bitwarden server", description: "Team password manager with browser & mobile apps, TOTP, and org sharing.", stack: "security", emoji: "🔐", color: "from-blue-600 to-indigo-700", from_inr: 799, tags: ["Passwords", "TOTP", "Teams"], enabled: true },
      { slug: "passbolt", name: "Passbolt", tagline: "Password manager for teams", description: "Open-source password manager built for teams with granular sharing and audit.", stack: "security", emoji: "🗝️", color: "from-red-500 to-rose-600", from_inr: 999, tags: ["Passwords", "Teams", "Audit"], enabled: true },
      { slug: "pihole", name: "Pi-hole", tagline: "Network-wide ad blocker & DNS", description: "Block ads, trackers and malware for your whole office/home network.", stack: "security", emoji: "🕳️", color: "from-red-500 to-rose-600", from_inr: 599, tags: ["DNS", "Ad-block", "Privacy"], enabled: true },
      { slug: "adguard", name: "AdGuard Home", tagline: "Network-wide DNS & ad blocker", description: "Modern DNS-based ad & tracker blocker with a beautiful admin UI.", stack: "security", emoji: "🛡️", color: "from-emerald-500 to-green-600", from_inr: 599, tags: ["DNS", "Ad-block", "Privacy"], enabled: true },
      { slug: "wireguard", name: "WireGuard VPN", tagline: "Fast, modern site-to-site VPN", description: "Managed WireGuard with wg-easy UI, multi-peer and split tunneling.", stack: "security", emoji: "🛡️", color: "from-slate-600 to-slate-800", from_inr: 999, tags: ["VPN", "Split tunnel", "wg-easy"], enabled: true },
      { slug: "openvpn", name: "OpenVPN", tagline: "Battle-tested VPN server", description: "Managed OpenVPN with a friendly admin UI and per-user certificates.", stack: "security", emoji: "🔒", color: "from-orange-500 to-red-600", from_inr: 999, tags: ["VPN", "Certificates", "Admin UI"], enabled: true },
      { slug: "headscale", name: "Headscale", tagline: "Self-hosted Tailscale control", description: "Open control server for Tailscale — build your own zero-config mesh VPN.", stack: "security", emoji: "🌐", color: "from-indigo-500 to-blue-600", from_inr: 899, new: true, tags: ["Mesh VPN", "Tailscale", "Zero-config"], enabled: true },
      { slug: "authentik", name: "Authentik", tagline: "Open-source SSO & Identity", description: "OIDC / SAML / LDAP identity provider with MFA, flows and outposts.", stack: "security", emoji: "🪪", color: "from-emerald-500 to-teal-600", from_inr: 1499, tags: ["SSO", "OIDC", "MFA"], enabled: true },
      { slug: "keycloak", name: "Keycloak", tagline: "Enterprise identity & access", description: "OAuth2, OIDC, SAML SSO with user federation and social logins.", stack: "security", emoji: "🗝️", color: "from-red-500 to-orange-600", from_inr: 1699, tags: ["SSO", "SAML", "OIDC"], enabled: true },
      { slug: "wazuh", name: "Wazuh", tagline: "SIEM & security monitoring", description: "Threat detection, compliance and endpoint monitoring — open-source SIEM.", stack: "security", emoji: "🛰️", color: "from-blue-500 to-indigo-700", from_inr: 1999, tags: ["SIEM", "Compliance", "EDR"], enabled: true },
      { slug: "crowdsec", name: "CrowdSec", tagline: "Collaborative security engine", description: "Detect and block attackers using a global crowd-sourced IP reputation network.", stack: "security", emoji: "🐺", color: "from-orange-500 to-rose-600", from_inr: 999, new: true, tags: ["IPS", "Firewall", "Reputation"], enabled: true },
      { slug: "docuseal", name: "DocuSeal", tagline: "Open-source e-signatures", description: "DocuSign alternative — send, sign and manage PDF documents legally.", stack: "collab", emoji: "✍️", color: "from-blue-500 to-cyan-600", from_inr: 1099, new: true, tags: ["e-signature", "PDF", "Legal"], enabled: true },
      { slug: "home-assistant", name: "Home Assistant", tagline: "IoT & smart-space automation", description: "Automate 2000+ devices with dashboards, voice and Node-RED integration.", stack: "automation", emoji: "🏠", color: "from-sky-500 to-blue-600", from_inr: 1199, tags: ["IoT", "Dashboards", "Voice"], enabled: true },
      { slug: "typebot", name: "Typebot", tagline: "Conversational forms & chatbots", description: "Build WhatsApp / web chatbots visually with branching, AI and integrations.", stack: "automation", emoji: "🤖", color: "from-fuchsia-500 to-pink-600", from_inr: 1099, new: true, tags: ["Chatbots", "WhatsApp", "AI"], enabled: true },
      { slug: "baserow", name: "Baserow", tagline: "Open Airtable alternative", description: "No-code database with rich fields, forms, views and API — self-host any workflow.", stack: "lowcode", emoji: "🗃️", color: "from-emerald-500 to-teal-600", from_inr: 999, tags: ["No-code", "Database", "Forms"], enabled: true },
      { slug: "nocodb", name: "NocoDB", tagline: "Turn any DB into a smart spreadsheet", description: "Airtable-like UI over Postgres / MySQL with automations, views and APIs.", stack: "lowcode", emoji: "🧾", color: "from-indigo-500 to-purple-600", from_inr: 999, tags: ["No-code", "Airtable", "APIs"], enabled: true },
      { slug: "appsmith", name: "Appsmith", tagline: "Build internal tools fast", description: "Drag-and-drop UI, 20+ data sources and JS — Retool alternative you self-host.", stack: "lowcode", emoji: "🛠️", color: "from-orange-500 to-amber-600", from_inr: 1299, tags: ["Internal tools", "Retool", "JS"], enabled: true },
      { slug: "tooljet", name: "ToolJet", tagline: "Open low-code internal tools", description: "Build apps, dashboards and forms visually, connect to any DB or API.", stack: "lowcode", emoji: "🧰", color: "from-blue-500 to-indigo-600", from_inr: 1299, tags: ["Low-code", "Dashboards", "APIs"], enabled: true },
      { slug: "budibase", name: "Budibase", tagline: "Low-code app builder", description: "Design apps, connect to data and deploy — perfect for ops teams.", stack: "lowcode", emoji: "🌱", color: "from-emerald-500 to-green-600", from_inr: 1199, tags: ["Low-code", "Forms", "Automations"], enabled: true },
      { slug: "medusa", name: "Medusa", tagline: "Headless commerce engine", description: "Composable commerce with admin, plugins and Next.js storefront.", stack: "ecommerce", emoji: "🛍️", color: "from-fuchsia-500 to-purple-600", from_inr: 1499, new: true, tags: ["Headless", "Next.js", "Composable"], enabled: true },
      { slug: "bagisto", name: "Bagisto", tagline: "Laravel eCommerce framework", description: "Multi-vendor, multi-warehouse Laravel storefront with GST support.", stack: "ecommerce", emoji: "🛒", color: "from-amber-500 to-orange-600", from_inr: 1299, tags: ["Laravel", "Multi-vendor", "GST"], enabled: true },
      { slug: "prestashop", name: "PrestaShop", tagline: "Popular open eCommerce", description: "Feature-rich storefront with 5000+ modules and multi-currency.", stack: "ecommerce", emoji: "🏬", color: "from-pink-500 to-rose-600", from_inr: 1199, tags: ["Storefront", "Modules", "Multi-currency"], enabled: true },
      { slug: "magento", name: "Magento OpenSource", tagline: "Enterprise-grade eCommerce", description: "Powerful B2B/B2C storefront — best for large catalogues and complex pricing.", stack: "ecommerce", emoji: "🛆", color: "from-orange-600 to-red-700", from_inr: 2499, tags: ["B2B", "Catalogue", "Enterprise"], enabled: true },
      { slug: "opencart", name: "OpenCart", tagline: "Lightweight PHP eCommerce", description: "Simple, fast open-source storefront with a huge extensions marketplace.", stack: "ecommerce", emoji: "🛒", color: "from-sky-500 to-blue-600", from_inr: 999, tags: ["PHP", "Extensions", "Storefront"], enabled: true },
      { slug: "discourse", name: "Discourse", tagline: "Modern community forums", description: "Beautiful, mobile-first forums with trust levels, badges and plugins.", stack: "collab", emoji: "💡", color: "from-orange-500 to-amber-600", from_inr: 1499, tags: ["Forum", "Community", "Plugins"], enabled: true },
      { slug: "flarum", name: "Flarum", tagline: "Fast, simple forum software", description: "Modern PHP forum with beautiful UI and extensions.", stack: "collab", emoji: "🔥", color: "from-indigo-500 to-blue-600", from_inr: 999, tags: ["Forum", "PHP", "Extensions"], enabled: true },
      { slug: "kanboard", name: "Kanboard", tagline: "Minimalist project management", description: "Simple kanban boards with subtasks, gantt and time tracking.", stack: "collab", emoji: "📊", color: "from-teal-500 to-emerald-600", from_inr: 699, tags: ["Kanban", "Gantt", "Time"], enabled: true },
    ],
  },
  announcements: {
    enabled: true,
    dismissible: true,
    speed_seconds: 40,
    badge_label: "Live",
    items: [
      { text: "🎉 Independence Sale — Flat 20% OFF on all annual SaaS plans. Use code INDIA20", icon: "Tag", link: "/pricing", cta_label: "Grab deal", enabled: true },
      { text: "🚀 New: AI Automation packs starting ₹14,999/mo — book a free demo today", icon: "Bot", link: "/contact", cta_label: "Book demo", enabled: true },
      { text: "🛡️ 99.99% uptime SLA · GST invoicing · Razorpay & UPI · WhatsApp ordering", icon: "ShieldCheck", enabled: true },
    ],
  },
  banners: {
    enabled: true,
    autoplay: true,
    autoplay_seconds: 6,
    slides: [
      {
        eyebrow: "Flagship offer",
        title: "Launch your SaaS business in 7 days.",
        subtitle: "Managed hosting, billing, subscriptions, GST invoices, courses & memberships — production-ready from day one.",
        image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80",
        cta_label: "See pricing",
        cta_link: "/pricing",
        cta2_label: "Book a demo",
        cta2_link: "/contact",
        enabled: true,
      },
      {
        eyebrow: "New",
        title: "AI Automation & RAG Chatbots.",
        subtitle: "Custom AI agents trained on your data — reduce support load by 60%.",
        image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
        cta_label: "Explore AI",
        cta_link: "/services",
        enabled: true,
      },
      {
        eyebrow: "Hosting",
        title: "Enterprise VPS from ₹499/mo.",
        subtitle: "NVMe SSD · 99.99% uptime · Mumbai & Bengaluru data centres.",
        image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
        cta_label: "View plans",
        cta_link: "/products",
        enabled: true,
      },
    ],
  },
  seo: {
    site_url: "",
    default_title: "Infiniforge Technologies — Enterprise SaaS, IT & AI Platform",
    default_description: "India's unified enterprise platform for SaaS, IT services, hosting, licenses, and AI automation.",
    default_keywords: "saas, it services, hosting, cloud, ai, automation, gst invoicing, infiniforge",
    default_og_image: "",
    twitter_handle: "@infiniforge",
    twitter_site: "@infiniforge",
    facebook_app_id: "",
    google_site_verification: "",
    bing_site_verification: "",
    robots: "index, follow",
    canonical_base: "",
    organization_name: "Infiniforge Technologies",
    organization_logo: "",
    organization_sameas: [],
    ga_measurement_id: "",
    gtm_id: "",
    fb_pixel_id: "",
    hotjar_id: "",
    json_ld_enabled: true,
    sitemap_url: "/sitemap.xml",
    pages: [
      { path: "/", title: "", description: "", keywords: "", og_image: "", noindex: false },
      { path: "/services", title: "", description: "", keywords: "", og_image: "", noindex: false },
      { path: "/products", title: "", description: "", keywords: "", og_image: "", noindex: false },
      { path: "/deployments", title: "", description: "", keywords: "", og_image: "", noindex: false },
      { path: "/pricing", title: "", description: "", keywords: "", og_image: "", noindex: false },
      { path: "/contact", title: "", description: "", keywords: "", og_image: "", noindex: false },
    ],
  },
  hosting_page: {
    eyebrow: "India-first cloud hosting",
    badge: "🚀 India-first cloud hosting",
    title: "Hosting & VPS that",
    title_gradient: "just works",
    subtitle: "Shared hosting, cloud VPS, dedicated servers & reseller plans — powered by NVMe SSDs, LiteSpeed & 24×7 NOC across 12 global data centers.",
    cta_primary: { label: "Explore plans", link: "#plans" },
    cta_secondary: { label: "Build your own", link: "#calculator" },
    cta_tertiary: { label: "See data centers", link: "#datacenters" },
    stats: [
      { value: "99.99%", label: "Uptime SLA" },
      { value: "24×7", label: "NOC Support" },
      { value: "<20ms", label: "Mumbai latency" },
      { value: "12", label: "Global data centers" },
    ],
    plans_title: "Pick the perfect plan",
    plans_subtitle: "Transparent pricing. No hidden fees. Cancel anytime.",
    datacenters_title: "12 Data Centers. One Cloud.",
    datacenters_subtitle: "Deploy in the region closest to your users — Mumbai, Singapore, Frankfurt, NYC & more.",
    migration_title: "Move to Infiniforge in 4 steps",
    migration_subtitle: "Free white-glove migration by our engineers — zero downtime, zero stress.",
    testimonials_title: "Trusted by founders & agencies",
    faq_title: "Answers before you ask",
    final_cta_title: "Not sure which plan fits?",
    final_cta_subtitle: "Chat with our hosting engineers on WhatsApp — we'll recommend the right plan for your workload.",
    whatsapp_number: "",
    whatsapp_greeting: "Hello Infiniforge Hosting 👋",
  },
  whatsapp: {
    enabled: true,
    number: "",
    greeting: "Hello Infiniforge Technologies 👋",
    label: "Order on WhatsApp",
    template: "premium",
    show_products: true,
    show_checkout: true,
    show_header: true,
  },
};


export type CmsSectionKey = keyof CmsData;

// ============ Icon helper ============
export function CmsIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;
  const Comp = (Icons as unknown as Record<string, LucideIcon>)[name];
  if (!Comp) return null;
  return <Comp className={className} />;
}

// ============ Data hooks ============
async function fetchSection<K extends CmsSectionKey>(key: K): Promise<CmsData[K]> {
  const { data } = await supabase
    .from("module_records")
    .select("metadata")
    .eq("module", "site_cms")
    .eq("title", key)
    .maybeSingle();
  const saved = (data?.metadata as Partial<CmsData[K]> | null) ?? null;
  return { ...(CMS_DEFAULTS[key] as object), ...(saved ?? {}) } as CmsData[K];
}

export function useCms<K extends CmsSectionKey>(key: K): CmsData[K] {
  const { data } = useQuery<CmsData[K]>({
    queryKey: ["cms", key],
    queryFn: () => fetchSection(key),
    staleTime: 60_000,
  });
  return (data ?? CMS_DEFAULTS[key]) as CmsData[K];
}

export async function fetchAllSections(): Promise<Partial<CmsData>> {
  const { data } = await supabase
    .from("module_records")
    .select("title, metadata")
    .eq("module", "site_cms");
  const out: Record<string, unknown> = {};
  (data ?? []).forEach((row) => { out[row.title as string] = row.metadata; });
  return out as Partial<CmsData>;
}

type SaveArgs = { key: CmsSectionKey; value: CmsData[CmsSectionKey] };

export function useSaveCmsSection() {
  const qc = useQueryClient();
  return useMutation<{ key: CmsSectionKey }, Error, SaveArgs>({
    mutationFn: async ({ key, value }) => {
      const { data: existing } = await supabase
        .from("module_records").select("id").eq("module", "site_cms").eq("title", key).maybeSingle();
      if (existing?.id) {
        const { error } = await supabase.from("module_records").update({ metadata: value as never, status: "published" }).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("module_records").insert({
          module: "site_cms", title: key, status: "published", metadata: value as never,
        });
        if (error) throw error;
      }
      return { key };
    },
    onSuccess: (v) => {
      qc.invalidateQueries({ queryKey: ["cms", v.key] });
    },
  });
}

// ============ SEO helper — syncs document meta + JSON-LD from CMS ============
function setMeta(sel: string, attr: string, key: string, value: string) {
  if (!value) return;
  let el = document.head.querySelector<HTMLMetaElement>(sel);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}
function setLink(rel: string, href: string) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
  el.setAttribute("href", href);
}
function setJsonLd(id: string, data: unknown) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.id = id;
  s.text = JSON.stringify(data);
  document.head.appendChild(s);
}

export function CmsSeo() {
  const seo = useCms("seo");
  const branding = useCms("branding");
  const loc = useLocation();
  useEffect(() => {
    if (typeof document === "undefined") return;
    const path = loc.pathname;
    const page = seo.pages?.find((p) => p.path === path);
    const title = page?.title || seo.default_title;
    const description = page?.description || seo.default_description;
    const keywords = page?.keywords || seo.default_keywords;
    const ogImage = page?.og_image || seo.default_og_image;
    const base = (seo.canonical_base || seo.site_url || "").replace(/\/$/, "");
    const url = base ? `${base}${path}` : path;

    if (title) document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="keywords"]', "name", "keywords", keywords);
    setMeta('meta[name="robots"]', "name", "robots", page?.noindex ? "noindex, nofollow" : seo.robots || "index, follow");
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", branding.brand_name);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);
    setMeta('meta[name="twitter:site"]', "name", "twitter:site", seo.twitter_site);
    setMeta('meta[name="twitter:creator"]', "name", "twitter:creator", seo.twitter_handle);
    setMeta('meta[name="google-site-verification"]', "name", "google-site-verification", seo.google_site_verification);
    setMeta('meta[name="msvalidate.01"]', "name", "msvalidate.01", seo.bing_site_verification);
    if (seo.facebook_app_id) setMeta('meta[property="fb:app_id"]', "property", "fb:app_id", seo.facebook_app_id);
    if (base) setLink("canonical", url);

    if (seo.json_ld_enabled) {
      setJsonLd("ld-org", {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: seo.organization_name || branding.brand_name,
        url: base || undefined,
        logo: seo.organization_logo || branding.logo_url || undefined,
        sameAs: (seo.organization_sameas ?? []).filter(Boolean),
      });
      setJsonLd("ld-website", {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: branding.brand_name,
        url: base || undefined,
      });
    }
  }, [seo, branding, loc.pathname]);
  return null;
}
