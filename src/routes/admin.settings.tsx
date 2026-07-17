import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Settings as SettingsIcon, Building2, CreditCard, Bell, Shield, Wallet, LayoutTemplate, ExternalLink, Info, Mail, MessageCircle, Send, CalendarClock, LogIn, ShoppingCart, Phone, CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { logAudit } from "@/lib/audit";
import { WALLET_ELIGIBLE_TYPES_KEY, DEFAULT_WALLET_ELIGIBLE_TYPES } from "@/lib/cart";
import { sendTestSms } from "@/lib/phone-auth.functions";
import { sendTestEmail, sendTestWhatsApp, testSmtpConnection, testWhatsAppConnection, testTwilioConnection } from "@/lib/notifications.functions";
import { getPlatformAlertSettings, savePlatformAlertSettings } from "@/lib/alerts.functions";
import { WA_DEFAULTS, buildWhatsAppLink, normalizeWhatsAppNumber, formatOrderMessage, WHATSAPP_TEMPLATES, type WhatsAppTemplate } from "@/lib/whatsapp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";


export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Settings"><Page /></AdminShell>,
});

const LS_KEY = "infiniforge.settings";

interface PlatformSettings {
  brand_name: string;
  support_email: string;
  whatsapp_number: string;
  gst_number: string;
  gst_percent: number;
  razorpay_key_id: string;
  razorpay_key_secret: string;
  razorpay_webhook_secret: string;
  razorpay_test_mode: boolean;
  default_currency: string;
  notif_new_order: boolean;
  notif_new_ticket: boolean;
  notif_low_stock: boolean;
  require_2fa_staff: boolean;
  session_timeout_min: number;
  // SMTP
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
  smtp_secure: boolean;
  smtp_enabled: boolean;
  // WhatsApp automation
  wa_provider: string; // "twilio" | "gupshup" | "meta" | "custom"
  wa_api_url: string;
  wa_api_key: string;
  wa_from_number: string;
  wa_enabled: boolean;
  // Alert triggers
  alert_on_sale: boolean;
  alert_on_login: boolean;
  alert_on_wallet: boolean;
  alert_weekly_report: boolean;
  alert_monthly_report: boolean;
  alert_recipient_email: string;
  alert_recipient_whatsapp: string;
  alert_recipient_sms: string;
  // Twilio (Phone OTP + SMS)
  twilio_enabled: boolean;
  twilio_account_sid: string;
  twilio_auth_token: string;
  twilio_from_number: string;
  twilio_test_recipient: string;
  // WhatsApp Ordering (customer-facing "Order on WhatsApp" buttons)
  wa_ordering_enabled: boolean;
  wa_ordering_number: string;
  wa_ordering_label: string;
  wa_ordering_greeting: string;
  wa_ordering_template?: WhatsAppTemplate;
  wa_ordering_show_products: boolean;
  wa_ordering_show_checkout: boolean;
  wa_ordering_show_header: boolean;
  // Auth
  google_auth_enabled: boolean;
  require_2fa_customers: boolean;
}

const DEFAULTS: PlatformSettings = {
  brand_name: "Infiniforge Technologies",
  support_email: "support@infiniforge.cloud",
  whatsapp_number: "+91 98765 43210",
  gst_number: "27ABCDE1234F1Z5",
  gst_percent: 18,
  razorpay_key_id: "",
  razorpay_key_secret: "",
  razorpay_webhook_secret: "",
  razorpay_test_mode: true,
  default_currency: "INR",
  notif_new_order: true,
  notif_new_ticket: true,
  notif_low_stock: true,
  require_2fa_staff: false,
  session_timeout_min: 60,
  smtp_host: "",
  smtp_port: 587,
  smtp_username: "",
  smtp_password: "",
  smtp_from_email: "",
  smtp_from_name: "Infiniforge Technologies",
  smtp_secure: true,
  smtp_enabled: false,
  wa_provider: "twilio",
  wa_api_url: "",
  wa_api_key: "",
  wa_from_number: "",
  wa_enabled: false,
  alert_on_sale: true,
  alert_on_login: false,
  alert_on_wallet: true,
  alert_weekly_report: true,
  alert_monthly_report: true,
  alert_recipient_email: "",
  alert_recipient_whatsapp: "",
  alert_recipient_sms: "",
  twilio_enabled: false,
  twilio_account_sid: "",
  twilio_auth_token: "",
  twilio_from_number: "",
  twilio_test_recipient: "",
  ...WA_DEFAULTS,
  google_auth_enabled: true,
  require_2fa_customers: false,
};


const ALL_WALLET_TYPES = [
  "subscription", "license", "digital", "service", "software",
  "hosting", "vps", "domain", "ssl", "consultation", "custom_dev",
  "ai", "monitoring", "amc", "physical",
];

type SiteContent = {
  hero_eyebrow?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_primary?: string;
  hero_cta_secondary?: string;
  extra_services?: { title: string; description: string }[];
};

const DEFAULT_SITE: SiteContent = {
  hero_eyebrow: "Made in India · GST-ready",
  hero_title: "Enterprise business management, engineered for growth",
  hero_subtitle: "Sell IT services, SaaS, subscriptions, licenses, hosting, domains, SSL, monitoring, AMC and physical products from a single platform.",
  hero_cta_primary: "Explore services",
  hero_cta_secondary: "Talk to sales",
  extra_services: [
    { title: "Internet & Leased Line", description: "Enterprise fiber, business broadband and dedicated internet with 99.9% SLA." },
    { title: "24×7 Monitoring", description: "Server, website and API monitoring with WhatsApp/SMS alerts and public status pages." },
  ],
};

function Page() {
  const { user, profile, refresh } = useAuth();
  const [s, setS] = useState<PlatformSettings>(DEFAULTS);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [company, setCompany] = useState(profile?.company ?? "");
  const [walletTypes, setWalletTypes] = useState<string[]>(DEFAULT_WALLET_ELIGIBLE_TYPES);
  const [site, setSite] = useState<SiteContent>(DEFAULT_SITE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setS({ ...DEFAULTS, ...JSON.parse(raw) });
      const wt = localStorage.getItem(WALLET_ELIGIBLE_TYPES_KEY);
      if (wt) setWalletTypes(JSON.parse(wt));
    } catch { /* noop */ }
  }, []);
  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
    setCompany(profile?.company ?? "");
  }, [profile]);

  const { data: siteRow } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data } = await supabase.from("module_records").select("id,metadata").eq("module", "site_content").eq("title", "homepage").maybeSingle();
      return data;
    },
  });
  useEffect(() => {
    if (siteRow?.metadata) setSite({ ...DEFAULT_SITE, ...(siteRow.metadata as SiteContent) });
  }, [siteRow]);

  type TestResult = {
    open: boolean;
    kind: "email" | "whatsapp" | "sms";
    status: "idle" | "loading" | "success" | "error";
    title: string;
    to?: string;
    detail?: string;
    meta?: Record<string, string | number | undefined>;
  };
  const [testResult, setTestResult] = useState<TestResult>({ open: false, kind: "email", status: "idle", title: "" });
  const isTesting = testResult.open && testResult.status === "loading";
  const openTest = (r: Omit<TestResult, "open">) => setTestResult({ ...r, open: true });
  const closeTest = () => setTestResult((r) => ({ ...r, open: false, status: r.status === "loading" ? "idle" : r.status }));

  async function withClientTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out. Please check credentials/network and try again.`)), 18_000);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  const testEmailFn = useServerFn(sendTestEmail);
  const testWaFn = useServerFn(sendTestWhatsApp);
  const testSms = useServerFn(sendTestSms);
  const testSmtpConn = useServerFn(testSmtpConnection);
  const testWaConn = useServerFn(testWhatsAppConnection);
  const testTwilioConn = useServerFn(testTwilioConnection);
  const getAlertSettingsFn = useServerFn(getPlatformAlertSettings);
  const saveAlertSettingsFn = useServerFn(savePlatformAlertSettings);

  const { data: persistedAlertSettings } = useQuery({
    queryKey: ["platform-alert-settings"],
    queryFn: () => getAlertSettingsFn(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Hydrate the form from the server ONCE. Later refetches must not overwrite
  // fields the admin is currently editing — that was silently wiping SMTP
  // credentials before the Save button was clicked.
  const hydratedAlertsRef = useRef(false);
  useEffect(() => {
    if (!persistedAlertSettings || hydratedAlertsRef.current) return;
    hydratedAlertsRef.current = true;
    setS((prev) => ({
      ...prev,
      ...persistedAlertSettings,
      alert_recipient_sms: persistedAlertSettings.alert_recipient_sms || prev.alert_recipient_sms || persistedAlertSettings.alert_recipient_whatsapp || "",
    }));
  }, [persistedAlertSettings]);

  function smtpCfg() {
    return {
      host: s.smtp_host, port: s.smtp_port, secure: s.smtp_secure,
      username: s.smtp_username, password: s.smtp_password,
      from_email: s.smtp_from_email || s.smtp_username, from_name: s.smtp_from_name,
    };
  }

  async function testSmtpConnectionBtn() {
    if (!s.smtp_host) return toast.error("Enter SMTP host first");
    openTest({ kind: "email", status: "loading", title: "Testing SMTP connection…" });
    try {
      const r = await withClientTimeout(testSmtpConn({ data: smtpCfg() }), "SMTP connection test");
      await saveAlertSettingsFn({ data: s });
      toast.success(`Connected in ${r.latency_ms}ms`);
      openTest({
        kind: "email", status: "success",
        title: "SMTP credentials verified",
        detail: "Your server accepted authentication. You can now send a test email or enable alerts.",
        meta: { Host: r.host, Encryption: r.encryption, Latency: `${r.latency_ms} ms` },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      toast.error(msg);
      openTest({ kind: "email", status: "error", title: "SMTP connection failed", detail: msg });
    }
  }

  async function testWaConnectionBtn() {
    openTest({ kind: "whatsapp", status: "loading", title: "Testing WhatsApp connection…" });
    try {
      const r = await withClientTimeout(testWaConn({
        data: { provider: s.wa_provider, api_url: s.wa_api_url, api_key: s.wa_api_key, from_number: s.wa_from_number },
      }), "WhatsApp connection test");
      await saveAlertSettingsFn({ data: s });
      toast.success(`Connected in ${r.latency_ms}ms`);
      openTest({
        kind: "whatsapp", status: "success",
        title: "WhatsApp provider reachable",
        detail: "Credentials/endpoint verified. Send a test message to confirm end-to-end delivery.",
        meta: { Provider: r.provider, Latency: `${r.latency_ms} ms` },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      toast.error(msg);
      openTest({ kind: "whatsapp", status: "error", title: "WhatsApp connection failed", detail: msg });
    }
  }

  async function testTwilioConnBtn() {
    openTest({ kind: "sms", status: "loading", title: "Testing Twilio connection…" });
    try {
      const r = await withClientTimeout(testTwilioConn({ data: { sid: s.twilio_account_sid, token: s.twilio_auth_token } }), "Twilio connection test");
      await saveAlertSettingsFn({ data: s });
      toast.success(`Connected in ${r.latency_ms}ms`);
      openTest({
        kind: "sms", status: "success",
        title: "Twilio credentials verified",
        detail: "Your Account SID / Auth Token were accepted by Twilio.",
        meta: { "Account SID": `••••${r.account_sid_last4}`, Latency: `${r.latency_ms} ms` },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      toast.error(msg);
      openTest({ kind: "sms", status: "error", title: "Twilio connection failed", detail: msg });
    }
  }

  async function testEmail() {
    if (!s.smtp_host) return toast.error("Enter SMTP host first");
    if (!s.alert_recipient_email) return toast.error("Enter an alerts email recipient below");
    openTest({ kind: "email", status: "loading", title: "Sending test email…", to: s.alert_recipient_email });
    try {
      const r = await withClientTimeout(testEmailFn({ data: { ...smtpCfg(), to: s.alert_recipient_email } }), "SMTP email test");
      await saveAlertSettingsFn({ data: s });
      toast.success(`Email delivered in ${r.latency_ms}ms`);
      openTest({
        kind: "email", status: "success",
        title: "SMTP integration is live",
        to: s.alert_recipient_email,
        detail: `Message accepted by ${s.smtp_host}. Check your inbox in a moment.`,
        meta: { Host: r.host, Latency: `${r.latency_ms} ms` },
      });
      await logAudit({ action: "update", resource: "settings", details: { test: "smtp", to: s.alert_recipient_email, ok: true } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "SMTP test failed";
      toast.error(msg);
      openTest({ kind: "email", status: "error", title: "SMTP test failed", to: s.alert_recipient_email, detail: msg });
    }
  }

  async function testWhatsApp() {
    if (!s.alert_recipient_whatsapp) return toast.error("Enter a WhatsApp recipient below");
    openTest({ kind: "whatsapp", status: "loading", title: "Sending test WhatsApp…", to: s.alert_recipient_whatsapp });
    try {
      const r = await withClientTimeout(testWaFn({
        data: {
          provider: s.wa_provider, api_url: s.wa_api_url, api_key: s.wa_api_key,
          from_number: s.wa_from_number, to: s.alert_recipient_whatsapp,
        },
      }), "WhatsApp message test");
      await saveAlertSettingsFn({ data: s });
      toast.success(`WhatsApp delivered in ${r.latency_ms}ms`);
      openTest({
        kind: "whatsapp", status: "success",
        title: "WhatsApp integration is live",
        to: s.alert_recipient_whatsapp,
        detail: `Message accepted by ${r.provider}. Check the recipient's WhatsApp.`,
        meta: { Provider: r.provider, Latency: `${r.latency_ms} ms` },
      });
      await logAudit({ action: "update", resource: "settings", details: { test: "whatsapp", to: s.alert_recipient_whatsapp, ok: true } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "WhatsApp test failed";
      toast.error(msg);
      openTest({ kind: "whatsapp", status: "error", title: "WhatsApp test failed", to: s.alert_recipient_whatsapp, detail: msg });
    }
  }

  async function handleTestSms() {
    if (!s.twilio_test_recipient) return toast.error("Enter a test recipient number");
    openTest({ kind: "sms", status: "loading", title: "Sending test SMS…", to: s.twilio_test_recipient });
    try {
      await withClientTimeout(testSms({
        data: {
          phone: s.twilio_test_recipient,
          sid: s.twilio_account_sid,
          token: s.twilio_auth_token,
          from: s.twilio_from_number,
        },
      }), "SMS test");
      await saveAlertSettingsFn({ data: { ...s, alert_recipient_sms: s.alert_recipient_sms || s.twilio_test_recipient } });
      toast.success(`Test SMS sent to ${s.twilio_test_recipient}`);
      openTest({
        kind: "sms", status: "success",
        title: "Twilio SMS is live",
        to: s.twilio_test_recipient,
        detail: "SMS handed off to Twilio for delivery.",
        meta: { Provider: "Twilio" },
      });
      await logAudit({ action: "update", resource: "settings", details: { test: "twilio", to: s.twilio_test_recipient } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Twilio test failed";
      toast.error(msg);
      openTest({ kind: "sms", status: "error", title: "Twilio SMS failed", to: s.twilio_test_recipient, detail: msg });
    }
  }


  const savePlatform = useMutation({
    mutationFn: async () => {
      localStorage.setItem(LS_KEY, JSON.stringify(s));
      localStorage.setItem(WALLET_ELIGIBLE_TYPES_KEY, JSON.stringify(walletTypes));
      const saved = await saveAlertSettingsFn({ data: s });

      // Mirror WhatsApp ordering config into Site CMS so it applies to
      // every visitor (not only this admin's browser).
      const waPayload = {
        enabled: !!s.wa_ordering_enabled,
        number: s.wa_ordering_number ?? "",
        greeting: s.wa_ordering_greeting ?? "",
        label: s.wa_ordering_label ?? "Order on WhatsApp",
        template: (s.wa_ordering_template ?? "premium") as "premium" | "concise" | "invoice" | "enquiry",
        show_products: !!s.wa_ordering_show_products,
        show_checkout: !!s.wa_ordering_show_checkout,
        show_header: !!s.wa_ordering_show_header,
      };
      const { data: existing } = await supabase
        .from("module_records")
        .select("id")
        .eq("module", "site_cms")
        .eq("title", "whatsapp")
        .maybeSingle();
      if (existing?.id) {
        await supabase.from("module_records").update({ metadata: waPayload as never }).eq("id", existing.id);
      } else {
        await supabase.from("module_records").insert({
          module: "site_cms", title: "whatsapp", status: "published", metadata: waPayload as never,
        });
      }

      await logAudit({ action: "update", resource: "settings", details: { brand: s.brand_name } });
      return saved;
    },
    onSuccess: (saved) => {
      const smtpOk = !!saved?.smtp_host && !!(saved.smtp_from_email || saved.smtp_username);
      if (smtpOk) {
        toast.success(`Platform settings saved · SMTP: ${saved.smtp_host}`);
      } else {
        toast.warning(
          "Settings saved, but SMTP is not configured — emails for orders, logins and alerts will NOT be sent until you fill the SMTP host, username, password and From email above.",
          { duration: 8000 },
        );
      }
    },
    onError: (e: Error) => toast.error(e.message || "Failed to save platform settings"),
  });

  const saveSite = useMutation({
    mutationFn: async () => {
      if (siteRow?.id) {
        const { error } = await supabase.from("module_records").update({ metadata: site as never }).eq("id", siteRow.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("module_records").insert({
          module: "site_content", title: "homepage", status: "published", metadata: site as never,
        });
        if (error) throw error;
      }
      await logAudit({ action: "update", resource: "site_content", details: { key: "homepage" } });
    },
    onSuccess: () => toast.success("Homepage content published"),
    onError: (e: Error) => toast.error(e.message),
  });

  const saveProfile = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("profiles").update({ full_name: fullName, phone, company }).eq("id", user.id);
      if (error) throw error;
      await refresh();
    },
    onSuccess: () => toast.success("Profile updated"),
    onError: (e: Error) => toast.error(e.message),
  });

  function toggleWallet(t: string) {
    setWalletTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      <div className="min-w-0">
        <h2 className="flex min-w-0 items-center gap-2 break-words text-xl font-bold sm:text-2xl"><SettingsIcon className="h-6 w-6 shrink-0" /> <span className="min-w-0 break-words">Platform settings</span></h2>
        <p className="mt-1 break-words text-sm text-muted-foreground">Branding, tax, payments, wallet gating, notifications and homepage content.</p>
      </div>

      <Section icon={Building2} title="Brand & contact">
        <Field label="Brand name"><Input value={s.brand_name} onChange={(e) => setS({ ...s, brand_name: e.target.value })} /></Field>
        <Field label="Support email"><Input type="email" value={s.support_email} onChange={(e) => setS({ ...s, support_email: e.target.value })} /></Field>
        <Field label="WhatsApp number"><Input value={s.whatsapp_number} onChange={(e) => setS({ ...s, whatsapp_number: e.target.value })} /></Field>
        <Field label="Default currency"><Input value={s.default_currency} onChange={(e) => setS({ ...s, default_currency: e.target.value.toUpperCase() })} /></Field>
      </Section>

      <Section icon={CreditCard} title="Tax & Razorpay gateway">
        <Field label="GSTIN"><Input value={s.gst_number} onChange={(e) => setS({ ...s, gst_number: e.target.value })} /></Field>
        <Field label="Default GST %"><Input type="number" value={s.gst_percent} onChange={(e) => setS({ ...s, gst_percent: Number(e.target.value) })} /></Field>
        <Field label="Razorpay Key ID"><Input placeholder="rzp_live_xxxxxxxx or rzp_test_xxxxxxxx" value={s.razorpay_key_id} onChange={(e) => setS({ ...s, razorpay_key_id: e.target.value })} /></Field>
        <Field label="Razorpay Key Secret"><Input type="password" placeholder="••••••••••••••••" value={s.razorpay_key_secret} onChange={(e) => setS({ ...s, razorpay_key_secret: e.target.value })} /></Field>
        <Field label="Razorpay Webhook Secret"><Input type="password" placeholder="Set in Razorpay → Webhooks" value={s.razorpay_webhook_secret} onChange={(e) => setS({ ...s, razorpay_webhook_secret: e.target.value })} /></Field>
        <div className="flex items-center justify-between rounded-lg border border-border p-3 md:mt-6">
          <span className="text-sm">Use Razorpay test mode</span>
          <Switch checked={s.razorpay_test_mode} onCheckedChange={(v) => setS({ ...s, razorpay_test_mode: v })} />
        </div>
        <div className="md:col-span-2 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm space-y-2">
          <div className="flex items-center gap-2 font-semibold text-primary"><Info className="h-4 w-4" /> Razorpay setup checklist</div>
          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground [&_code]:break-all [&_code]:inline-block [&_code]:max-w-full">
            <li>Create a Razorpay account at <a className="text-primary underline inline-flex items-center gap-1" href="https://dashboard.razorpay.com" target="_blank" rel="noreferrer">dashboard.razorpay.com <ExternalLink className="h-3 w-3" /></a> and complete KYC.</li>
            <li>Go to <b>Settings → API Keys</b> and generate a key pair. Paste the Key ID above and store the secret in your server env (<code className="text-xs bg-secondary px-1 rounded">RAZORPAY_KEY_SECRET</code>).</li>
            <li>In <b>Settings → Webhooks</b>, add <code className="text-xs bg-secondary px-1 rounded">{typeof window !== "undefined" ? window.location.origin : ""}/api/razorpay/webhook</code> with events <code className="text-xs bg-secondary px-1 rounded">payment.captured</code>, <code className="text-xs bg-secondary px-1 rounded">payment.failed</code>, <code className="text-xs bg-secondary px-1 rounded">order.paid</code>. Copy the webhook secret above.</li>
            <li>Enable payment methods (UPI, Cards, Netbanking, Wallets) under <b>Payment Methods</b>.</li>
            <li>Turn off test mode once verified — checkout will switch to live keys automatically.</li>
          </ol>
        </div>
      </Section>

      <Section icon={Wallet} title="Wallet & payment eligibility">
        <div className="md:col-span-2 text-sm text-muted-foreground">
          Choose which product types customers can pay for using wallet balance. Physical products should typically require the gateway to keep GST reconciliation clean.
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-2">
          {ALL_WALLET_TYPES.map((t) => {
            const on = walletTypes.includes(t);
            return (
              <button key={t} type="button" onClick={() => toggleWallet(t)}
                className={`px-3 py-1.5 rounded-full text-xs border transition ${on ? "bg-gradient-brand text-white border-transparent" : "border-border hover:bg-secondary"}`}>
                {on ? "✓ " : "+ "}{t}
              </button>
            );
          })}
        </div>
      </Section>

      <Section icon={Mail} title="SMTP email integration">
        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border p-3 min-w-0">
          <div className="min-w-0 flex-1"><div className="text-sm font-medium break-words">Enable SMTP for outbound email</div><div className="text-xs text-muted-foreground break-words">Used for order receipts, GST invoices, alerts and reports.</div></div>
          <div className="shrink-0"><Switch checked={s.smtp_enabled} onCheckedChange={(v) => setS({ ...s, smtp_enabled: v })} /></div>
        </div>
        <Field label="SMTP host"><Input placeholder="smtp.gmail.com" value={s.smtp_host} onChange={(e) => setS({ ...s, smtp_host: e.target.value })} /></Field>
        <Field label="SMTP port"><Input type="number" value={s.smtp_port} onChange={(e) => setS({ ...s, smtp_port: Number(e.target.value) })} /></Field>
        <Field label="Username"><Input value={s.smtp_username} onChange={(e) => setS({ ...s, smtp_username: e.target.value })} /></Field>
        <Field label="Password / App key"><Input type="password" value={s.smtp_password} onChange={(e) => setS({ ...s, smtp_password: e.target.value })} /></Field>
        <Field label="From email"><Input type="email" placeholder="alerts@infiniforge.cloud" value={s.smtp_from_email} onChange={(e) => setS({ ...s, smtp_from_email: e.target.value })} /></Field>
        <Field label="From name"><Input value={s.smtp_from_name} onChange={(e) => setS({ ...s, smtp_from_name: e.target.value })} /></Field>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <span className="text-sm">Use TLS/SSL</span>
          <Switch checked={s.smtp_secure} onCheckedChange={(v) => setS({ ...s, smtp_secure: v })} />
        </div>
        <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-end sm:justify-end gap-2 flex-wrap [&>*]:w-full sm:[&>*]:w-auto">
          <Field label="Send test to">
            <Input
              type="email"
              placeholder="you@example.com"
              value={s.alert_recipient_email}
              onChange={(e) => setS({ ...s, alert_recipient_email: e.target.value })}
            />
          </Field>
          <Button variant="secondary" onClick={testSmtpConnectionBtn} disabled={!s.smtp_host || isTesting}>
            {testResult.kind === "email" && isTesting && !testResult.to
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <Shield className="h-4 w-4 mr-2" />}
            Test connection
          </Button>
          <Button
            variant="default"
            onClick={() => testEmail()}
            disabled={!s.smtp_host || isTesting}
            className="bg-gradient-brand text-white"
          >
            {testResult.kind === "email" && isTesting && testResult.to
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <Send className="h-4 w-4 mr-2" />}
            Send test email
          </Button>
        </div>
      </Section>

      <Section icon={MessageCircle} title="WhatsApp automation">
        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border p-3 min-w-0">
          <div className="min-w-0 flex-1"><div className="text-sm font-medium break-words">Enable WhatsApp automation</div><div className="text-xs text-muted-foreground break-words">Send order, login, wallet and report alerts to admin & customers.</div></div>
          <div className="shrink-0"><Switch checked={s.wa_enabled} onCheckedChange={(v) => setS({ ...s, wa_enabled: v })} /></div>
        </div>
        <Field label="Provider">
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={s.wa_provider} onChange={(e) => setS({ ...s, wa_provider: e.target.value })}>
            <option value="twilio">Twilio WhatsApp</option>
            <option value="gupshup">Gupshup</option>
            <option value="meta">Meta Cloud API</option>
            <option value="wati">Wati</option>
            <option value="custom">Custom webhook</option>
          </select>
        </Field>
        <Field label="From WhatsApp number"><Input placeholder="+91XXXXXXXXXX" value={s.wa_from_number} onChange={(e) => setS({ ...s, wa_from_number: e.target.value })} /></Field>
        <Field label="API URL / endpoint"><Input placeholder="https://api.provider.com/messages" value={s.wa_api_url} onChange={(e) => setS({ ...s, wa_api_url: e.target.value })} /></Field>
        <Field label="API key / Bearer token"><Input type="password" value={s.wa_api_key} onChange={(e) => setS({ ...s, wa_api_key: e.target.value })} /></Field>
        <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-end sm:justify-end gap-2 flex-wrap [&>*]:w-full sm:[&>*]:w-auto">
          <Field label="Send test to (WhatsApp)">
            <Input
              placeholder="+91XXXXXXXXXX"
              value={s.alert_recipient_whatsapp}
              onChange={(e) => setS({ ...s, alert_recipient_whatsapp: e.target.value })}
            />
          </Field>
          <Button variant="secondary" onClick={testWaConnectionBtn} disabled={isTesting}>
            {testResult.kind === "whatsapp" && isTesting && !testResult.to
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <Shield className="h-4 w-4 mr-2" />}
            Test connection
          </Button>
          <Button
            variant="default"
            onClick={() => testWhatsApp()}
            disabled={isTesting}
            className="bg-gradient-brand text-white"
          >
            {testResult.kind === "whatsapp" && isTesting && testResult.to
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <Send className="h-4 w-4 mr-2" />}
            Send test WhatsApp
          </Button>
        </div>
      </Section>

      <Section icon={MessageCircle} title="WhatsApp Ordering (customer buttons)">
        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border p-3 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium break-words">Enable "Order on WhatsApp" buttons</div>
            <div className="text-xs text-muted-foreground break-words">Adds instant-order buttons on product cards, checkout and the site header. Uses your business WhatsApp number below.</div>
          </div>
          <div className="shrink-0"><Switch checked={s.wa_ordering_enabled} onCheckedChange={(v) => setS({ ...s, wa_ordering_enabled: v })} /></div>
        </div>
        <Field label="Business WhatsApp number (with country code)">
          <Input placeholder="+919876543210" value={s.wa_ordering_number} onChange={(e) => setS({ ...s, wa_ordering_number: e.target.value })} />
        </Field>
        <Field label="Button label">
          <Input placeholder="Order on WhatsApp" value={s.wa_ordering_label} onChange={(e) => setS({ ...s, wa_ordering_label: e.target.value })} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Greeting / opening line">
            <Textarea rows={2} value={s.wa_ordering_greeting} onChange={(e) => setS({ ...s, wa_ordering_greeting: e.target.value })}
              placeholder="Hello Infiniforge Technologies 👋" />
          </Field>
          <div className="text-[11px] text-muted-foreground mt-1">Only used by the Premium template. Products, totals, contact and reference are appended automatically.</div>
        </div>
        <div className="md:col-span-2">
          <Field label="Message template style">
            <Select
              value={s.wa_ordering_template ?? "premium"}
              onValueChange={(v) => setS({ ...s, wa_ordering_template: v as WhatsAppTemplate })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WHATSAPP_TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label} — <span className="text-muted-foreground">{t.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="md:col-span-2">
          <div className="rounded-xl border border-dashed border-primary/30 bg-gradient-to-br from-emerald-500/5 to-primary/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary">Live message preview</div>
              <div className="text-[10px] text-muted-foreground">as it will appear in WhatsApp</div>
            </div>
            <pre className="whitespace-pre-wrap break-words text-[12px] leading-relaxed font-sans bg-background/60 rounded-lg p-3 border border-border max-h-72 overflow-auto">
{formatOrderMessage(s.wa_ordering_greeting, [
  { name: "Cloud Hosting — Starter", qty: 1, price_inr: 1499 },
  { name: "SSL Certificate (1 yr)", qty: 2, price_inr: 799 },
], {
  total_inr: 1499 + 799 * 2,
  customer_name: "Priya Sharma",
  customer_phone: "+91 98765 43210",
  note: "Please deliver credentials by Monday.",
  template: s.wa_ordering_template ?? "premium",
  reference: "IF-PREVIEW-DEMO",
})}
            </pre>
          </div>
        </div>

        <Toggle label="Show on product cards" v={s.wa_ordering_show_products} onChange={(v) => setS({ ...s, wa_ordering_show_products: v })} />
        <Toggle label="Show on checkout page" v={s.wa_ordering_show_checkout} onChange={(v) => setS({ ...s, wa_ordering_show_checkout: v })} />
        <Toggle label="Show floating button in site header" v={s.wa_ordering_show_header} onChange={(v) => setS({ ...s, wa_ordering_show_header: v })} />
        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/25 bg-primary/5 p-3 text-xs min-w-0">
          <div className="text-muted-foreground min-w-0 w-full sm:w-auto sm:flex-1">
            Live link preview: {normalizeWhatsAppNumber(s.wa_ordering_number) ? (
              <code className="bg-secondary px-1.5 py-0.5 rounded break-all inline-block max-w-full align-bottom">{buildWhatsAppLink(s.wa_ordering_number, s.wa_ordering_greeting).slice(0, 80)}…</code>
            ) : <span className="text-destructive">Enter a valid number</span>}
          </div>
          <Button variant="outline" size="sm" disabled={!s.wa_ordering_enabled || !s.wa_ordering_number}
            onClick={() => window.open(buildWhatsAppLink(s.wa_ordering_number, s.wa_ordering_greeting), "_blank", "noopener,noreferrer")}>
            <Send className="h-3.5 w-3.5 mr-1.5" /> Open test chat
          </Button>
        </div>
      </Section>



      <Section icon={Phone} title="Twilio SMS alerts">
        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border p-3 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium break-words">Enable Twilio SMS delivery</div>
            <div className="text-xs text-muted-foreground break-words">Powers transactional SMS alerts (orders, wallet, reports). Phone-OTP sign-in has been removed — email + password + Google are used instead.</div>
          </div>
          <div className="shrink-0"><Switch checked={s.twilio_enabled} onCheckedChange={(v) => setS({ ...s, twilio_enabled: v })} /></div>
        </div>
        <Field label="Twilio Account SID">
          <Input placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" value={s.twilio_account_sid} onChange={(e) => setS({ ...s, twilio_account_sid: e.target.value })} />
        </Field>
        <Field label="Twilio Auth Token">
          <Input type="password" placeholder="••••••••••••••••" value={s.twilio_auth_token} onChange={(e) => setS({ ...s, twilio_auth_token: e.target.value })} />
        </Field>
        <Field label="From number (E.164)">
          <Input placeholder="+15558675310" value={s.twilio_from_number} onChange={(e) => setS({ ...s, twilio_from_number: e.target.value })} />
        </Field>
        <Field label="Test recipient (E.164)">
          <Input placeholder="+919876543210" value={s.twilio_test_recipient} onChange={(e) => setS({ ...s, twilio_test_recipient: e.target.value })} />
        </Field>
        <div className="flex flex-col items-stretch justify-end gap-2 sm:flex-row sm:items-end sm:flex-wrap">
          <Button variant="secondary" onClick={testTwilioConnBtn} disabled={isTesting}>
            {testResult.kind === "sms" && isTesting && !testResult.to
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <Shield className="h-4 w-4 mr-2" />}
            Test connection
          </Button>
          <Button
            variant="default"
            onClick={handleTestSms}
            disabled={isTesting}
            className="bg-gradient-brand text-white"
          >
            {testResult.kind === "sms" && isTesting && testResult.to
              ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              : <Send className="h-4 w-4 mr-2" />}
            Send test SMS
          </Button>
        </div>
        <div className="md:col-span-2 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm space-y-2">
          <div className="flex items-center gap-2 font-semibold text-primary"><Info className="h-4 w-4" /> Twilio SMS setup checklist</div>
          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
            <li>Create an account at <a className="text-primary underline inline-flex items-center gap-1" href="https://console.twilio.com" target="_blank" rel="noreferrer">console.twilio.com <ExternalLink className="h-3 w-3" /></a> and buy a phone number that supports SMS to your target countries.</li>
            <li>Turn on <b>SMS Pumping Protection</b> and configure <b>SMS Geo Permissions</b> to only your target countries.</li>
            <li>Paste the Account SID, Auth Token and From number above, then use <b>Test connection</b> before sending a live SMS.</li>
            <li>Use <b>Send test SMS</b> above to confirm delivery. Once verified, alerts can use this channel.</li>
          </ol>
        </div>
      </Section>



      <Section icon={Bell} title="Alerts & scheduled reports">
        <Field label="Alerts email recipient"><Input type="email" placeholder="admin@infiniforge.cloud" value={s.alert_recipient_email} onChange={(e) => setS({ ...s, alert_recipient_email: e.target.value })} /></Field>
        <Field label="Alerts WhatsApp recipient"><Input placeholder="+91XXXXXXXXXX" value={s.alert_recipient_whatsapp} onChange={(e) => setS({ ...s, alert_recipient_whatsapp: e.target.value })} /></Field>
        <Field label="Alerts SMS recipient"><Input placeholder="+91XXXXXXXXXX" value={s.alert_recipient_sms} onChange={(e) => setS({ ...s, alert_recipient_sms: e.target.value })} /></Field>
        <ToggleIcon icon={ShoppingCart} label="Every new sale / order" v={s.alert_on_sale} onChange={(v) => setS({ ...s, alert_on_sale: v })} />
        <ToggleIcon icon={LogIn} label="Every user login" v={s.alert_on_login} onChange={(v) => setS({ ...s, alert_on_login: v })} />
        <ToggleIcon icon={Wallet} label="Wallet top-ups & debits" v={s.alert_on_wallet} onChange={(v) => setS({ ...s, alert_on_wallet: v })} />
        <ToggleIcon icon={CalendarClock} label="Weekly summary report (Mon 9 AM)" v={s.alert_weekly_report} onChange={(v) => setS({ ...s, alert_weekly_report: v })} />
        <ToggleIcon icon={CalendarClock} label="Monthly summary report (1st, 9 AM)" v={s.alert_monthly_report} onChange={(v) => setS({ ...s, alert_monthly_report: v })} />
        <Toggle label="Email on new order (legacy)" v={s.notif_new_order} onChange={(v) => setS({ ...s, notif_new_order: v })} />
        <Toggle label="Email on new ticket" v={s.notif_new_ticket} onChange={(v) => setS({ ...s, notif_new_ticket: v })} />
        <Toggle label="Alert on low stock" v={s.notif_low_stock} onChange={(v) => setS({ ...s, notif_low_stock: v })} />
      </Section>


      <Section icon={Shield} title="Authentication & 2-step verification">
        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border p-3 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">Enable “Continue with Google” on sign-in</div>
            <div className="text-xs text-muted-foreground">Shows the Google button on the auth page. Turn off to use email + password only.</div>
          </div>
          <div className="shrink-0"><Switch checked={s.google_auth_enabled} onCheckedChange={(v) => setS({ ...s, google_auth_enabled: v })} /></div>
        </div>
        <Toggle label="Require 2FA (Google Authenticator) for staff" v={s.require_2fa_staff} onChange={(v) => setS({ ...s, require_2fa_staff: v })} />
        <Toggle label="Encourage 2FA for customers" v={s.require_2fa_customers} onChange={(v) => setS({ ...s, require_2fa_customers: v })} />
        <Field label="Session timeout (minutes)"><Input type="number" value={s.session_timeout_min} onChange={(e) => setS({ ...s, session_timeout_min: Number(e.target.value) })} /></Field>
        <div className="md:col-span-2 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm space-y-2">
          <div className="flex items-center gap-2 font-semibold text-primary"><Info className="h-4 w-4" /> How 2-step verification works</div>
          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
            <li>Each user enrols a TOTP factor from <b>Portal → Profile → Two-step verification</b> using Google Authenticator, Authy, 1Password or any RFC 6238 app.</li>
            <li>On the next sign-in they will be prompted for the 6-digit code before reaching the dashboard.</li>
            <li>Staff accounts flagged above are strongly encouraged to enrol; enforcement is checked at sign-in.</li>
          </ol>
        </div>
      </Section>


      <div className="flex justify-end">
        <Button onClick={() => savePlatform.mutate()} disabled={savePlatform.isPending} className="w-full bg-gradient-brand text-white sm:w-auto">Save platform settings</Button>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5 space-y-2 border border-primary/20 min-w-0">
        <div className="text-sm font-medium">Website content moved</div>
        <p className="text-xs text-muted-foreground">Homepage, header, footer, services, pricing, contact form and legal pages are now edited in the full <a href="/admin/cms" className="text-primary underline">Site CMS</a>.</p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5 space-y-4 min-w-0">
        <h3 className="font-semibold">Your profile</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name"><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></Field>
          <Field label="Phone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
          <Field label="Company"><Input value={company} onChange={(e) => setCompany(e.target.value)} /></Field>
          <Field label="Email"><Input value={user?.email ?? ""} disabled /></Field>
        </div>
        <div className="flex justify-end"><Button className="w-full sm:w-auto" onClick={() => saveProfile.mutate()} disabled={saveProfile.isPending}>Save profile</Button></div>
      </div>

      <Dialog open={testResult.open} onOpenChange={(o) => !o && closeTest()}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md overflow-hidden p-0">
          <div className={`px-6 pt-6 pb-5 text-white ${
            testResult.status === "success"
              ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
              : testResult.status === "error"
              ? "bg-gradient-to-br from-rose-500 via-red-500 to-orange-500"
              : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
          }`}>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
                {testResult.status === "loading" && <Loader2 className="h-6 w-6 animate-spin" />}
                {testResult.status === "success" && <CheckCircle2 className="h-6 w-6" />}
                {testResult.status === "error" && <XCircle className="h-6 w-6" />}
              </div>
              <div className="min-w-0">
                <DialogHeader className="text-left space-y-0.5">
                  <DialogTitle className="text-white text-lg flex items-center gap-2 break-words">
                    {testResult.title}
                    {testResult.status === "success" && <Sparkles className="h-4 w-4 opacity-90" />}
                  </DialogTitle>
                  {testResult.to && (
                    <DialogDescription className="text-white/85 text-xs">
                      {testResult.kind === "email" ? "Recipient" : "Sent to"}: <span className="font-medium">{testResult.to}</span>
                    </DialogDescription>
                  )}
                </DialogHeader>
              </div>
            </div>
          </div>
          <div className="px-6 py-5 space-y-3">
            {testResult.detail && (
              <p className="text-sm text-muted-foreground leading-relaxed">{testResult.detail}</p>
            )}
            {testResult.meta && (
              <div className="rounded-xl border border-border bg-secondary/40 divide-y divide-border text-xs">
                {Object.entries(testResult.meta).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-3 px-3 py-2">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-mono text-right break-all max-w-[65%]">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
            {testResult.status === "success" && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Alerts triggered from your app will now be delivered through this channel automatically.</span>
              </div>
            )}
            {testResult.status === "error" && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300 flex gap-2">
                <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Double-check credentials, port &amp; TLS setting, and that the recipient number/email is valid.</span>
              </div>
            )}
          </div>
          <DialogFooter className="px-6 pb-5">
            <Button onClick={closeTest} className="w-full">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof SettingsIcon; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-5 min-w-0 max-w-full">
      <div className="flex min-w-0 items-center gap-2 mb-4"><Icon className="h-4 w-4 shrink-0 text-primary" /><h3 className="min-w-0 break-words font-semibold">{title}</h3></div>
      <div className="grid min-w-0 gap-4 md:grid-cols-2 [&>*]:min-w-0">{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="min-w-0"><Label className="mb-1.5 block break-words text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>{children}</div>;
}
function Toggle({ label, v, onChange }: { label: string; v: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <span className="min-w-0 flex-1 text-sm break-words">{label}</span>
      <div className="shrink-0"><Switch checked={v} onCheckedChange={onChange} /></div>
    </div>
  );
}
function ToggleIcon({ icon: Icon, label, v, onChange }: { icon: typeof SettingsIcon; label: string; v: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <span className="min-w-0 flex-1 text-sm flex items-center gap-2 break-words"><Icon className="h-4 w-4 shrink-0 text-primary" /><span className="min-w-0 break-words">{label}</span></span>
      <div className="shrink-0"><Switch checked={v} onCheckedChange={onChange} /></div>
    </div>
  );
}

