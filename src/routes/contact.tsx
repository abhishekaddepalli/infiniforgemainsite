import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, CheckCircle2, Sparkles, MessageCircle, ShieldCheck, Clock, Zap, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCms, CmsIcon } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";
import { buildWhatsAppLink, formatContactEnquiryMessage, getWhatsAppConfig } from "@/lib/whatsapp";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Sales — Websites, Servers, CCTV, IT Services · Infiniforge" },
      { name: "description", content: "Talk to Infiniforge for demos, quotes, AMC, CCTV, servers, hosting and enterprise deployments. Reply within 4 business hours across India." },
      { property: "og:title", content: "Contact Infiniforge" },
      { property: "og:description", content: "GST-invoiced quotes for websites, apps, servers, CCTV and IT services." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

const REASONS = [
  { icon: Clock, title: "Reply in 4 business hours", desc: "Real engineers respond — not a bot queue." },
  { icon: ShieldCheck, title: "GST-invoiced quotes", desc: "Signed SLA and DPA on every engagement." },
  { icon: Zap, title: "Scoped in one call", desc: "20-minute discovery → fixed price & timeline." },
];

function ContactPage() {
  const page = useCms("contact_page");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", interest: "Book a demo", message: "" });

  const wa = getWhatsAppConfig();
  const [lastRef, setLastRef] = useState<string>("");
  const [waLink, setWaLink] = useState<string>("");

  function makeRef() {
    const d = new Date();
    const s = `${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    return `IF-${s}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const reference = makeRef();
      const { error } = await supabase.from("module_records").insert({
        module: "contact_submissions",
        title: form.name || form.email || "Enquiry",
        status: "new",
        metadata: { ...form, reference, recipient: page.form_recipient_email } as never,
      });
      if (error) throw error;
      setLastRef(reference);
      if (wa.wa_ordering_enabled && wa.wa_ordering_number) {
        const msg = formatContactEnquiryMessage(form, reference);
        const link = buildWhatsAppLink(wa.wa_ordering_number, msg);
        setWaLink(link);
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        setWaLink("");
      }
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-hero-blob" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-hero-blob" style={{ animationDelay: "-5s" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
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
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              {REASONS.map((r, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <span className="h-6 w-6 rounded-full bg-accent/15 flex items-center justify-center">
                    <r.icon className="h-3 w-3 text-accent" />
                  </span>
                  {r.title}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FORM + CARDS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-5 gap-8">
          <Reveal className="lg:col-span-3">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-brand opacity-30 blur-xl" />
              <div className="relative rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-elegant">
                {sent ? (
                  <div className="text-center py-16 animate-reveal-up">
                    <div className="mx-auto h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center animate-glow-pulse">
                      <CheckCircle2 className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="mt-5 text-2xl font-bold">Message received</h3>
                    <p className="mt-2 text-muted-foreground">{page.form_success_message}</p>
                    {lastRef && <p className="mt-2 text-xs text-muted-foreground">Reference: <span className="font-mono">{lastRef}</span></p>}
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      {waLink && (
                        <Button asChild className="bg-[#25D366] hover:bg-[#1ebe57] text-white">
                          <a href={waLink} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 h-4 w-4" /> Continue on WhatsApp
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => { setSent(false); setWaLink(""); setLastRef(""); setForm({ name: "", email: "", phone: "", company: "", interest: "Book a demo", message: "" }); }}>Send another</Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-5">
                    <div className="flex items-center gap-2 pb-2">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Sales · online now</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Full name"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Arjun Sharma" /></Field>
                      <Field label="Work email"><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="arjun@company.in" /></Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Phone (with +91)"><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" /></Field>
                      <Field label="Company"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company Pvt. Ltd." /></Field>
                    </div>
                    <Field label="What are you interested in?">
                      <div className="flex flex-wrap gap-2">
                        {["Book a demo", "Website / App", "Hosting / VPS", "CCTV / Network", "AI automation", "AMC / Support"].map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => setForm({ ...form, interest: opt })}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                              form.interest === opt
                                ? "bg-gradient-brand text-white border-transparent shadow-elegant"
                                : "border-border bg-background hover:border-primary/40 hover:text-primary",
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Message"><Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your project, timelines and budget…" /></Field>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button type="submit" disabled={busy} className="h-12 bg-gradient-brand text-white px-8 group">
                        {busy ? "Sending…" : page.form_submit_label}
                        <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Button>
                      {wa.wa_ordering_enabled && wa.wa_ordering_number && (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 px-6 border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10"
                          onClick={() => {
                            const ref = makeRef();
                            const msg = formatContactEnquiryMessage(form, ref);
                            window.open(buildWhatsAppLink(wa.wa_ordering_number, msg), "_blank", "noopener,noreferrer");
                          }}
                        >
                          <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" /> Send via WhatsApp
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Submitting also opens WhatsApp with your enquiry pre-filled for instant response.</p>
                  </form>
                )}
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-2 space-y-4">
            {page.cards.map((c, i) => (
              <Reveal key={c.title + i} delay={i * 90}>
                <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-card flex gap-4 items-start overflow-hidden transition-all hover:-translate-y-1 hover:shadow-elegant">
                  <div className={cn(
                    "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity",
                    c.accent ? "bg-gradient-green" : "bg-gradient-brand",
                  )} />
                  <div className={cn("relative h-11 w-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-elegant transition-transform group-hover:scale-110 group-hover:rotate-3", c.accent ? "bg-gradient-green" : "bg-gradient-brand")}>
                    <CmsIcon name={c.icon} className="h-5 w-5" />
                  </div>
                  <div className="relative">
                    <div className="font-semibold">{c.title}</div>
                    {c.lines.map((l, j) => <div key={l + j} className="text-sm text-muted-foreground">{l}</div>)}
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={page.cards.length * 90}>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-dashboard p-6 text-white shadow-elegant">
                <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-brand opacity-40 blur-3xl animate-hero-blob" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
                    <MapPin className="h-3.5 w-3.5" /> Serving pan-India
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    {["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Ahmedabad", "Kolkata", "Jaipur"].map((city) => (
                      <span key={city} className="rounded-md bg-white/10 border border-white/10 px-2 py-1 text-center backdrop-blur">
                        {city}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-white/70 leading-relaxed">On-site support engineers available across 40+ Indian cities. Remote NOC operates 24×7.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
