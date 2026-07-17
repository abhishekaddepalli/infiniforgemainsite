import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FileText, Save, RotateCcw, Plus, Trash2, ExternalLink, ImageIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  CMS_DEFAULTS, type CmsData, type CmsSectionKey,
  fetchAllSections, useSaveCmsSection, CmsIcon,
} from "@/lib/cms";
import { useQuery } from "@tanstack/react-query";
import { logAudit } from "@/lib/audit";

export const Route = createFileRoute("/admin/cms")({
  head: () => ({ meta: [{ title: "Site CMS — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Site CMS"><Page /></AdminShell>,
});

const TABS: { key: CmsSectionKey; label: string }[] = [
  { key: "branding", label: "Branding" },
  { key: "header", label: "Header" },
  { key: "footer", label: "Footer" },
  { key: "home", label: "Home page" },
  { key: "services_page", label: "Services page" },
  { key: "products_page", label: "Products page" },
  { key: "product_detail", label: "Product detail" },
  { key: "pricing_page", label: "Pricing page" },
  { key: "contact_page", label: "Contact page" },
  { key: "announcements", label: "Ticker" },
  { key: "banners", label: "Banner slider" },
  { key: "deployments_page", label: "Deployments" },
  { key: "hosting_page", label: "Hosting page" },
  { key: "whatsapp", label: "WhatsApp ordering" },
  { key: "legal", label: "Legal pages" },
  { key: "seo", label: "SEO" },
];

function Page() {
  const { data: all, refetch, isLoading } = useQuery({ queryKey: ["cms-all"], queryFn: fetchAllSections });
  const [draft, setDraft] = useState<Partial<CmsData>>({});
  const save = useSaveCmsSection();

  useEffect(() => {
    if (!all) return;
    const merged: Partial<CmsData> = {};
    (Object.keys(CMS_DEFAULTS) as CmsSectionKey[]).forEach((k) => {
      merged[k] = { ...(CMS_DEFAULTS[k] as object), ...((all[k] as object) ?? {}) } as never;
    });
    setDraft(merged);
  }, [all]);

  function update<K extends CmsSectionKey>(key: K, val: CmsData[K]) {
    setDraft((d) => ({ ...d, [key]: val }));
  }
  async function persist(key: CmsSectionKey) {
    const value = (draft[key] ?? CMS_DEFAULTS[key]) as CmsData[CmsSectionKey];
    try {
      await save.mutateAsync({ key, value });
      await logAudit({ action: "update", resource: "site_cms", details: { section: key } });
      toast.success(`${key} saved & published`);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }
  function reset(key: CmsSectionKey) {
    update(key, CMS_DEFAULTS[key] as never);
    toast.info(`${key} reset to defaults (not yet saved)`);
  }

  if (isLoading || !draft.branding) {
    return <div className="p-8 text-sm text-muted-foreground">Loading CMS…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6" /> Site CMS</h2>
          <p className="text-sm text-muted-foreground mt-1">Edit every page, image, icon, plan and content block used by the public website. Changes publish instantly.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild><a href="/" target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4 mr-1.5" /> View site</a></Button>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          {TABS.map((t) => <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>)}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent key={t.key} value={t.key} className="space-y-4">
            <SectionEditor
              sectionKey={t.key}
              value={(draft[t.key] ?? CMS_DEFAULTS[t.key]) as never}
              onChange={(v) => update(t.key, v as never)}
              onSave={() => persist(t.key)}
              onReset={() => reset(t.key)}
              saving={save.isPending}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// ============ Section editor router ============
function SectionEditor({ sectionKey, value, onChange, onSave, onReset, saving }: {
  sectionKey: CmsSectionKey; value: unknown; onChange: (v: unknown) => void;
  onSave: () => void; onReset: () => void; saving: boolean;
}) {
  const Body = SECTION_FORMS[sectionKey] as (p: { value: unknown; onChange: (v: unknown) => void }) => ReactNode;
  return (
    <Card className="p-6 space-y-6">
      <Body value={value} onChange={onChange} />
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="ghost" size="sm" onClick={onReset}><RotateCcw className="h-4 w-4 mr-1.5" /> Reset defaults</Button>
        <Button onClick={onSave} disabled={saving} className="bg-gradient-brand text-white"><Save className="h-4 w-4 mr-1.5" /> {saving ? "Saving…" : "Save & publish"}</Button>
      </div>
    </Card>
  );
}

// ============ Reusable UI ============
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  return <div className={`grid gap-4 ${cols === 1 ? "" : cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>{children}</div>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-primary flex items-center gap-2"><Sparkles className="h-4 w-4" /> {title}</div>
      {children}
    </div>
  );
}
function ImageField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <Field label={label} hint={hint ?? "Paste any image URL (Unsplash, Cloudinary, your CDN, etc)"}>
      <div className="flex gap-2 items-start">
        <div className="h-14 w-14 rounded-lg border border-border bg-secondary/40 flex items-center justify-center overflow-hidden shrink-0">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
        </div>
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
      </div>
    </Field>
  );
}

type ArrayItem = Record<string, unknown>;
function ArrayEditor<T extends ArrayItem>({ items, onChange, factory, render, label, addLabel = "Add item" }: {
  items: T[]; onChange: (v: T[]) => void; factory: () => T;
  render: (it: T, i: number, update: (patch: Partial<T>) => void) => React.ReactNode;
  label: string; addLabel?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
        <Button size="sm" variant="outline" onClick={() => onChange([...items, factory()])}>
          <Plus className="h-3.5 w-3.5 mr-1" /> {addLabel}
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-lg border border-border p-4 space-y-3 bg-secondary/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" disabled={i === 0} onClick={() => {
                  const next = [...items]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next);
                }}>↑</Button>
                <Button size="sm" variant="ghost" disabled={i === items.length - 1} onClick={() => {
                  const next = [...items]; [next[i + 1], next[i]] = [next[i], next[i + 1]]; onChange(next);
                }}>↓</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                  const next = [...items]; next.splice(i, 1); onChange(next);
                }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            {render(it, i, (patch) => {
              const next = [...items]; next[i] = { ...it, ...patch }; onChange(next);
            })}
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No items yet.</p>}
      </div>
    </div>
  );
}

function StringListEditor({ items, onChange, label, placeholder }: { items: string[]; onChange: (v: string[]) => void; label: string; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
        <Button size="sm" variant="outline" onClick={() => onChange([...items, ""])}><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
      </div>
      {items.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input value={v} placeholder={placeholder} onChange={(e) => { const n = [...items]; n[i] = e.target.value; onChange(n); }} />
          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => { const n = [...items]; n.splice(i, 1); onChange(n); }}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
    </div>
  );
}

function IconField({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <Field label="Icon (lucide-react name)" hint="e.g. Rocket, Server, Users, Wifi. Browse at lucide.dev">
      <div className="flex gap-2 items-center">
        <div className="h-10 w-10 rounded-lg bg-gradient-brand text-white flex items-center justify-center shrink-0">
          <CmsIcon name={value} className="h-5 w-5" />
        </div>
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Rocket" />
      </div>
    </Field>
  );
}

// ============ Per-section forms ============
type Any = Record<string, unknown>;
const SECTION_FORMS: Record<CmsSectionKey, (p: { value: unknown; onChange: (v: unknown) => void }) => ReactNode> = {
  branding: ({ value, onChange }) => {
    const v = value as CmsData["branding"];
    const set = (patch: Partial<CmsData["branding"]>) => onChange({ ...v, ...patch } as never);
    return (
      <Grid>
        <Field label="Brand name"><Input value={v.brand_name} onChange={(e) => set({ brand_name: e.target.value })} /></Field>
        <Field label="Tagline"><Input value={v.tagline} onChange={(e) => set({ tagline: e.target.value })} /></Field>
        <ImageField label="Logo URL" value={v.logo_url} onChange={(x) => set({ logo_url: x })} hint="Shown in header & footer. Leave blank for default lightning bolt icon." />
        <ImageField label="Favicon URL" value={v.favicon_url} onChange={(x) => set({ favicon_url: x })} />
      </Grid>
    );
  },
  header: ({ value, onChange }) => {
    const v = value as CmsData["header"];
    const set = (patch: Partial<CmsData["header"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-6">
        <ArrayEditor
          label="Navigation links" addLabel="Add link"
          items={v.nav as unknown as Any[]} onChange={(x) => set({ nav: x as CmsData["header"]["nav"] })}
          factory={() => ({ label: "", to: "" })}
          render={(it, _i, up) => (
            <Grid>
              <Field label="Label"><Input value={String(it.label ?? "")} onChange={(e) => up({ label: e.target.value })} /></Field>
              <Field label="URL"><Input value={String(it.to ?? "")} onChange={(e) => up({ to: e.target.value })} placeholder="/services" /></Field>
            </Grid>
          )}
        />
        <Grid>
          <Field label="CTA button label"><Input value={v.cta_label} onChange={(e) => set({ cta_label: e.target.value })} /></Field>
          <Field label="CTA button link"><Input value={v.cta_link} onChange={(e) => set({ cta_link: e.target.value })} /></Field>
        </Grid>
      </div>
    );
  },
  footer: ({ value, onChange }) => {
    const v = value as CmsData["footer"];
    const set = (patch: Partial<CmsData["footer"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-6">
        <Grid>
          <div className="md:col-span-2"><Field label="Tagline"><Textarea rows={2} value={v.tagline} onChange={(e) => set({ tagline: e.target.value })} /></Field></div>
          <Field label="Contact email"><Input value={v.email} onChange={(e) => set({ email: e.target.value })} /></Field>
          <Field label="Contact phone"><Input value={v.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
          <Field label="Address"><Input value={v.address} onChange={(e) => set({ address: e.target.value })} /></Field>
          <Field label="GSTIN"><Input value={v.gstin} onChange={(e) => set({ gstin: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="Copyright line" hint="Use {year} for the current year"><Input value={v.copyright} onChange={(e) => set({ copyright: e.target.value })} /></Field></div>
        </Grid>
        <ArrayEditor
          label="Footer link columns" addLabel="Add column"
          items={v.columns as unknown as Any[]} onChange={(x) => set({ columns: x as CmsData["footer"]["columns"] })}
          factory={() => ({ title: "", links: [] })}
          render={(it, _i, up) => (
            <div className="space-y-3">
              <Field label="Column title"><Input value={String(it.title ?? "")} onChange={(e) => up({ title: e.target.value })} /></Field>
              <ArrayEditor
                label="Links" addLabel="Add link"
                items={(it.links as Any[]) ?? []} onChange={(x) => up({ links: x })}
                factory={() => ({ label: "", to: "" })}
                render={(l, _i2, upl) => (
                  <Grid>
                    <Field label="Label"><Input value={String(l.label ?? "")} onChange={(e) => upl({ label: e.target.value })} /></Field>
                    <Field label="URL"><Input value={String(l.to ?? "")} onChange={(e) => upl({ to: e.target.value })} /></Field>
                  </Grid>
                )}
              />
            </div>
          )}
        />
      </div>
    );
  },
  home: ({ value, onChange }) => {
    const v = value as CmsData["home"];
    const set = (patch: Partial<CmsData["home"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-8">
        <Section title="Hero">
          <Grid>
            <Field label="Eyebrow"><Input value={v.hero_eyebrow} onChange={(e) => set({ hero_eyebrow: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Title"><Input value={v.hero_title} onChange={(e) => set({ hero_title: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Subtitle"><Textarea rows={3} value={v.hero_subtitle} onChange={(e) => set({ hero_subtitle: e.target.value })} /></Field></div>
            <Field label="Primary CTA label"><Input value={v.hero_cta_primary.label} onChange={(e) => set({ hero_cta_primary: { ...v.hero_cta_primary, label: e.target.value } })} /></Field>
            <Field label="Primary CTA link"><Input value={v.hero_cta_primary.link} onChange={(e) => set({ hero_cta_primary: { ...v.hero_cta_primary, link: e.target.value } })} /></Field>
            <Field label="Secondary CTA label"><Input value={v.hero_cta_secondary.label} onChange={(e) => set({ hero_cta_secondary: { ...v.hero_cta_secondary, label: e.target.value } })} /></Field>
            <Field label="Secondary CTA link"><Input value={v.hero_cta_secondary.link} onChange={(e) => set({ hero_cta_secondary: { ...v.hero_cta_secondary, link: e.target.value } })} /></Field>
          </Grid>
          <StringListEditor label="Trust checks (small line under CTAs)" items={v.hero_checks} onChange={(x) => set({ hero_checks: x })} placeholder="GST-ready invoicing" />
        </Section>

        <Section title="Stats strip">
          <ArrayEditor
            label="Stats" items={v.stats as unknown as Any[]} onChange={(x) => set({ stats: x as CmsData["home"]["stats"] })}
            factory={() => ({ label: "", value: "", icon: "TrendingUp" })}
            render={(it, _i, up) => (
              <Grid cols={3}>
                <Field label="Value"><Input value={String(it.value ?? "")} onChange={(e) => up({ value: e.target.value })} /></Field>
                <Field label="Label"><Input value={String(it.label ?? "")} onChange={(e) => up({ label: e.target.value })} /></Field>
                <IconField value={it.icon as string} onChange={(x) => up({ icon: x })} />
              </Grid>
            )}
          />
        </Section>

        <Section title="Category / features intro">
          <Grid>
            <div className="md:col-span-2"><Field label="Section title"><Input value={v.categories_title} onChange={(e) => set({ categories_title: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Section subtitle"><Textarea rows={2} value={v.categories_subtitle} onChange={(e) => set({ categories_subtitle: e.target.value })} /></Field></div>
          </Grid>
          <ArrayEditor
            label="Highlighted feature cards" items={v.features as unknown as Any[]} onChange={(x) => set({ features: x as CmsData["home"]["features"] })}
            factory={() => ({ title: "", description: "", icon: "Sparkles" })}
            render={(it, _i, up) => (
              <div className="space-y-3">
                <Grid>
                  <Field label="Title"><Input value={String(it.title ?? "")} onChange={(e) => up({ title: e.target.value })} /></Field>
                  <IconField value={it.icon as string} onChange={(x) => up({ icon: x })} />
                </Grid>
                <Field label="Description"><Textarea rows={2} value={String(it.description ?? "")} onChange={(e) => up({ description: e.target.value })} /></Field>
              </div>
            )}
          />
        </Section>

        <Section title="Featured products header">
          <Grid>
            <Field label="Eyebrow"><Input value={v.featured_eyebrow} onChange={(e) => set({ featured_eyebrow: e.target.value })} /></Field>
            <Field label="Title"><Input value={v.featured_title} onChange={(e) => set({ featured_title: e.target.value })} /></Field>
          </Grid>
        </Section>

        <Section title="Testimonials">
          <Field label="Section title"><Input value={v.testimonials_title} onChange={(e) => set({ testimonials_title: e.target.value })} /></Field>
          <ArrayEditor
            label="Testimonials" items={v.testimonials as unknown as Any[]} onChange={(x) => set({ testimonials: x as CmsData["home"]["testimonials"] })}
            factory={() => ({ name: "", role: "", quote: "" })}
            render={(it, _i, up) => (
              <div className="space-y-3">
                <Grid cols={3}>
                  <Field label="Name"><Input value={String(it.name ?? "")} onChange={(e) => up({ name: e.target.value })} /></Field>
                  <Field label="Role"><Input value={String(it.role ?? "")} onChange={(e) => up({ role: e.target.value })} /></Field>
                  <Field label="Company"><Input value={String(it.company ?? "")} onChange={(e) => up({ company: e.target.value })} /></Field>
                </Grid>
                <Field label="Quote"><Textarea rows={2} value={String(it.quote ?? "")} onChange={(e) => up({ quote: e.target.value })} /></Field>
                <ImageField label="Avatar URL (optional)" value={String(it.avatar_url ?? "")} onChange={(x) => up({ avatar_url: x })} />
              </div>
            )}
          />
        </Section>

        <Section title="Bottom CTA banner">
          <Grid>
            <div className="md:col-span-2"><Field label="Title"><Input value={v.cta_title} onChange={(e) => set({ cta_title: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Subtitle"><Textarea rows={2} value={v.cta_subtitle} onChange={(e) => set({ cta_subtitle: e.target.value })} /></Field></div>
            <Field label="Primary label"><Input value={v.cta_primary.label} onChange={(e) => set({ cta_primary: { ...v.cta_primary, label: e.target.value } })} /></Field>
            <Field label="Primary link"><Input value={v.cta_primary.link} onChange={(e) => set({ cta_primary: { ...v.cta_primary, link: e.target.value } })} /></Field>
            <Field label="Secondary label"><Input value={v.cta_secondary.label} onChange={(e) => set({ cta_secondary: { ...v.cta_secondary, label: e.target.value } })} /></Field>
            <Field label="Secondary link"><Input value={v.cta_secondary.link} onChange={(e) => set({ cta_secondary: { ...v.cta_secondary, link: e.target.value } })} /></Field>
          </Grid>
        </Section>
      </div>
    );
  },
  services_page: ({ value, onChange }) => {
    const v = value as CmsData["services_page"];
    const set = (patch: Partial<CmsData["services_page"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-8">
        <Section title="Page header">
          <Grid>
            <Field label="Eyebrow"><Input value={v.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Title"><Input value={v.title} onChange={(e) => set({ title: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Subtitle"><Textarea rows={2} value={v.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field></div>
          </Grid>
        </Section>
        <Section title="Service cards">
          <ArrayEditor
            label="Services" items={v.services as unknown as Any[]} onChange={(x) => set({ services: x as CmsData["services_page"]["services"] })}
            factory={() => ({ name: "", description: "", price: "", icon: "Package" })}
            render={(it, _i, up) => (
              <div className="space-y-3">
                <Grid cols={3}>
                  <Field label="Name"><Input value={String(it.name ?? "")} onChange={(e) => up({ name: e.target.value })} /></Field>
                  <Field label="Price / starting from"><Input value={String(it.price ?? "")} onChange={(e) => up({ price: e.target.value })} /></Field>
                  <IconField value={it.icon as string} onChange={(x) => up({ icon: x })} />
                </Grid>
                <Field label="Description"><Textarea rows={2} value={String(it.description ?? "")} onChange={(e) => up({ description: e.target.value })} /></Field>
              </div>
            )}
          />
        </Section>
        <Section title="Delivery process">
          <Grid>
            <div className="md:col-span-2"><Field label="Section title"><Input value={v.process_title} onChange={(e) => set({ process_title: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Section subtitle"><Textarea rows={2} value={v.process_subtitle} onChange={(e) => set({ process_subtitle: e.target.value })} /></Field></div>
          </Grid>
          <ArrayEditor
            label="Process steps" items={v.process_steps as unknown as Any[]} onChange={(x) => set({ process_steps: x as CmsData["services_page"]["process_steps"] })}
            factory={() => ({ title: "", description: "" })}
            render={(it, _i, up) => (
              <div className="space-y-3">
                <Field label="Step title"><Input value={String(it.title ?? "")} onChange={(e) => up({ title: e.target.value })} /></Field>
                <Field label="Description"><Textarea rows={2} value={String(it.description ?? "")} onChange={(e) => up({ description: e.target.value })} /></Field>
              </div>
            )}
          />
        </Section>
      </div>
    );
  },
  products_page: ({ value, onChange }) => {
    const v = value as CmsData["products_page"];
    const set = (patch: Partial<CmsData["products_page"]>) => onChange({ ...v, ...patch } as never);
    return (
      <Grid>
        <Field label="Eyebrow"><Input value={v.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
        <div className="md:col-span-2"><Field label="Title"><Input value={v.title} onChange={(e) => set({ title: e.target.value })} /></Field></div>
        <div className="md:col-span-2"><Field label="Subtitle"><Textarea rows={2} value={v.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field></div>
      </Grid>
    );
  },
  product_detail: ({ value, onChange }) => {
    const v = value as CmsData["product_detail"];
    const set = (patch: Partial<CmsData["product_detail"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-6">
        <Grid>
          <Field label="Buy now button label"><Input value={v.buy_now_label} onChange={(e) => set({ buy_now_label: e.target.value })} /></Field>
          <Field label="Add to cart button label"><Input value={v.add_to_cart_label} onChange={(e) => set({ add_to_cart_label: e.target.value })} /></Field>
          <Field label="Live Preview button label"><Input value={v.demo_button_label} onChange={(e) => set({ demo_button_label: e.target.value })} /></Field>
          <Field label="Overview section title"><Input value={v.description_title} onChange={(e) => set({ description_title: e.target.value })} /></Field>
          <Field label="Features section title"><Input value={v.features_title} onChange={(e) => set({ features_title: e.target.value })} /></Field>
          <Field label="Gallery section title"><Input value={v.gallery_title} onChange={(e) => set({ gallery_title: e.target.value })} /></Field>
          <Field label="Related section title"><Input value={v.related_title} onChange={(e) => set({ related_title: e.target.value })} /></Field>
          <Field label="Related section subtitle"><Input value={v.related_subtitle} onChange={(e) => set({ related_subtitle: e.target.value })} /></Field>
          <div className="md:col-span-2 flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3">
            <Switch checked={v.show_related} onCheckedChange={(x) => set({ show_related: x })} />
            <span className="text-sm">Show "You may also like" related products</span>
          </div>
        </Grid>
        <ArrayEditor
          label="Trust badges (shown under price)" items={v.trust_badges as unknown as Any[]} onChange={(x) => set({ trust_badges: x as CmsData["product_detail"]["trust_badges"] })}
          factory={() => ({ icon: "ShieldCheck", label: "" })}
          render={(it, _i, up) => (
            <Grid>
              <IconField value={(it as Any).icon as string} onChange={(x) => up({ icon: x } as Any)} />
              <Field label="Label"><Input value={(it as Any).label as string} onChange={(e) => up({ label: e.target.value } as Any)} /></Field>
            </Grid>
          )}
        />
      </div>
    );
  },
  pricing_page: ({ value, onChange }) => {
    const v = value as CmsData["pricing_page"];
    const set = (patch: Partial<CmsData["pricing_page"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-8">
        <Section title="Page header">
          <Grid>
            <Field label="Eyebrow"><Input value={v.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Title"><Input value={v.title} onChange={(e) => set({ title: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Subtitle"><Textarea rows={2} value={v.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Footnote"><Input value={v.footnote} onChange={(e) => set({ footnote: e.target.value })} /></Field></div>
          </Grid>
        </Section>
        <Section title="Plans">
          <ArrayEditor
            label="Plans" items={v.plans as unknown as Any[]} onChange={(x) => set({ plans: x as CmsData["pricing_page"]["plans"] })}
            factory={() => ({ name: "", tag: "", monthly: 0, yearly: 0, features: [], cta_label: "Get started", cta_link: "/contact", highlight: false })}
            render={(it, _i, up) => (
              <div className="space-y-3">
                <Grid cols={3}>
                  <Field label="Plan name"><Input value={String(it.name ?? "")} onChange={(e) => up({ name: e.target.value })} /></Field>
                  <Field label="Tagline"><Input value={String(it.tag ?? "")} onChange={(e) => up({ tag: e.target.value })} /></Field>
                  <div className="flex items-end gap-2">
                    <div className="flex-1"><Field label="Highlight"><div className="pt-2"><Switch checked={Boolean(it.highlight)} onCheckedChange={(x) => up({ highlight: x })} /></div></Field></div>
                  </div>
                </Grid>
                <Grid>
                  <Field label="Monthly (₹)"><Input type="number" value={Number(it.monthly ?? 0)} onChange={(e) => up({ monthly: Number(e.target.value) })} /></Field>
                  <Field label="Yearly (₹)"><Input type="number" value={Number(it.yearly ?? 0)} onChange={(e) => up({ yearly: Number(e.target.value) })} /></Field>
                  <Field label="CTA label"><Input value={String(it.cta_label ?? "")} onChange={(e) => up({ cta_label: e.target.value })} /></Field>
                  <Field label="CTA link"><Input value={String(it.cta_link ?? "")} onChange={(e) => up({ cta_link: e.target.value })} /></Field>
                </Grid>
                <StringListEditor label="Features" items={(it.features as string[]) ?? []} onChange={(x) => up({ features: x })} placeholder="Up to 100 customers" />
              </div>
            )}
          />
        </Section>
      </div>
    );
  },
  contact_page: ({ value, onChange }) => {
    const v = value as CmsData["contact_page"];
    const set = (patch: Partial<CmsData["contact_page"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-8">
        <Section title="Page header">
          <Grid>
            <Field label="Eyebrow"><Input value={v.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Title"><Input value={v.title} onChange={(e) => set({ title: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Subtitle"><Textarea rows={2} value={v.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field></div>
          </Grid>
        </Section>
        <Section title="Contact cards (sidebar)">
          <ArrayEditor
            label="Cards" items={v.cards as unknown as Any[]} onChange={(x) => set({ cards: x as CmsData["contact_page"]["cards"] })}
            factory={() => ({ title: "", lines: [""], icon: "Mail", accent: false })}
            render={(it, _i, up) => (
              <div className="space-y-3">
                <Grid cols={3}>
                  <Field label="Title"><Input value={String(it.title ?? "")} onChange={(e) => up({ title: e.target.value })} /></Field>
                  <IconField value={it.icon as string} onChange={(x) => up({ icon: x })} />
                  <div className="flex items-end"><Field label="Green accent"><div className="pt-2"><Switch checked={Boolean(it.accent)} onCheckedChange={(x) => up({ accent: x })} /></div></Field></div>
                </Grid>
                <StringListEditor label="Lines of text" items={(it.lines as string[]) ?? []} onChange={(x) => up({ lines: x })} />
              </div>
            )}
          />
        </Section>
        <Section title="Form">
          <Grid>
            <Field label="Submit button label"><Input value={v.form_submit_label} onChange={(e) => set({ form_submit_label: e.target.value })} /></Field>
            <Field label="Recipient email (for notifications)"><Input value={v.form_recipient_email} onChange={(e) => set({ form_recipient_email: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Success message"><Textarea rows={2} value={v.form_success_message} onChange={(e) => set({ form_success_message: e.target.value })} /></Field></div>
          </Grid>
        </Section>
      </div>
    );
  },
  legal: ({ value, onChange }) => {
    const v = value as CmsData["legal"];
    const set = (patch: Partial<CmsData["legal"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Each page is served at <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">/p/&lt;slug&gt;</code>. Supports Markdown-ish content.</p>
        <ArrayEditor
          label="Legal / info pages" addLabel="Add page"
          items={v.pages as unknown as Any[]} onChange={(x) => set({ pages: x as CmsData["legal"]["pages"] })}
          factory={() => ({ slug: "", title: "", meta_description: "", body: "" })}
          render={(it, _i, up) => (
            <div className="space-y-3">
              <Grid>
                <Field label="Slug"><Input value={String(it.slug ?? "")} onChange={(e) => up({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="terms" /></Field>
                <Field label="Page title"><Input value={String(it.title ?? "")} onChange={(e) => up({ title: e.target.value })} /></Field>
              </Grid>
              <Field label="Meta description"><Input value={String(it.meta_description ?? "")} onChange={(e) => up({ meta_description: e.target.value })} /></Field>
              <Field label="Body (Markdown)"><Textarea rows={10} value={String(it.body ?? "")} onChange={(e) => up({ body: e.target.value })} /></Field>
              <a href={`/p/${it.slug}`} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Preview /p/{String(it.slug)}</a>
            </div>
          )}
        />
      </div>
    );
  },
  seo: ({ value, onChange }) => {
    const v = value as CmsData["seo"];
    const set = (patch: Partial<CmsData["seo"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-8">
        <Section title="Site defaults">
          <Grid>
            <Field label="Site URL (production)" hint="e.g. https://infiniforge.com — used for canonical & absolute OG URLs"><Input value={v.site_url} onChange={(e) => set({ site_url: e.target.value })} placeholder="https://infiniforge.com" /></Field>
            <Field label="Canonical base override (optional)"><Input value={v.canonical_base} onChange={(e) => set({ canonical_base: e.target.value })} placeholder="https://www.infiniforge.com" /></Field>
            <div className="md:col-span-2"><Field label="Default title"><Input value={v.default_title} onChange={(e) => set({ default_title: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Default meta description" hint="≤160 chars recommended"><Textarea rows={2} value={v.default_description} onChange={(e) => set({ default_description: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Default keywords (comma-separated)"><Input value={v.default_keywords} onChange={(e) => set({ default_keywords: e.target.value })} /></Field></div>
            <ImageField label="Default OpenGraph image" value={v.default_og_image} onChange={(x) => set({ default_og_image: x })} hint="Used when a page doesn't set its own. 1200×630 recommended." />
            <Field label="Robots"><Input value={v.robots} onChange={(e) => set({ robots: e.target.value })} placeholder="index, follow" /></Field>
            <Field label="Sitemap URL"><Input value={v.sitemap_url} onChange={(e) => set({ sitemap_url: e.target.value })} placeholder="/sitemap.xml" /></Field>
          </Grid>
        </Section>

        <Section title="Social">
          <Grid cols={3}>
            <Field label="Twitter site handle"><Input value={v.twitter_site} onChange={(e) => set({ twitter_site: e.target.value })} placeholder="@infiniforge" /></Field>
            <Field label="Twitter creator handle"><Input value={v.twitter_handle} onChange={(e) => set({ twitter_handle: e.target.value })} placeholder="@founder" /></Field>
            <Field label="Facebook App ID"><Input value={v.facebook_app_id} onChange={(e) => set({ facebook_app_id: e.target.value })} /></Field>
          </Grid>
        </Section>

        <Section title="Verification & analytics">
          <Grid>
            <Field label="Google Search Console token"><Input value={v.google_site_verification} onChange={(e) => set({ google_site_verification: e.target.value })} /></Field>
            <Field label="Bing Webmaster token (msvalidate.01)"><Input value={v.bing_site_verification} onChange={(e) => set({ bing_site_verification: e.target.value })} /></Field>
            <Field label="GA4 Measurement ID"><Input value={v.ga_measurement_id} onChange={(e) => set({ ga_measurement_id: e.target.value })} placeholder="G-XXXXXXX" /></Field>
            <Field label="Google Tag Manager ID"><Input value={v.gtm_id} onChange={(e) => set({ gtm_id: e.target.value })} placeholder="GTM-XXXXXX" /></Field>
            <Field label="Facebook Pixel ID"><Input value={v.fb_pixel_id} onChange={(e) => set({ fb_pixel_id: e.target.value })} /></Field>
            <Field label="Hotjar ID"><Input value={v.hotjar_id} onChange={(e) => set({ hotjar_id: e.target.value })} /></Field>
          </Grid>
        </Section>

        <Section title="Structured data (JSON-LD)">
          <Grid>
            <Field label="Enable Organization / WebSite JSON-LD">
              <div className="flex items-center gap-2 h-10"><Switch checked={v.json_ld_enabled} onCheckedChange={(x) => set({ json_ld_enabled: x })} /><span className="text-sm">{v.json_ld_enabled ? "Injected on every page" : "Disabled"}</span></div>
            </Field>
            <Field label="Organization name"><Input value={v.organization_name} onChange={(e) => set({ organization_name: e.target.value })} /></Field>
            <ImageField label="Organization logo URL" value={v.organization_logo} onChange={(x) => set({ organization_logo: x })} />
          </Grid>
          <StringListEditor label="sameAs profile URLs (social links)" items={v.organization_sameas ?? []} onChange={(x) => set({ organization_sameas: x })} placeholder="https://twitter.com/infiniforge" />
        </Section>

        <Section title="Per-page SEO overrides">
          <ArrayEditor
            label="Pages" addLabel="Add page"
            items={v.pages as unknown as Any[]} onChange={(x) => set({ pages: x as CmsData["seo"]["pages"] })}
            factory={() => ({ path: "/", title: "", description: "", keywords: "", og_image: "", noindex: false })}
            render={(it, _i, up) => (
              <div className="space-y-3">
                <Grid cols={3}>
                  <Field label="Path"><Input value={String(it.path ?? "")} onChange={(e) => up({ path: e.target.value })} placeholder="/services" /></Field>
                  <div className="md:col-span-2"><Field label="Title"><Input value={String(it.title ?? "")} onChange={(e) => up({ title: e.target.value })} /></Field></div>
                </Grid>
                <Field label="Meta description"><Textarea rows={2} value={String(it.description ?? "")} onChange={(e) => up({ description: e.target.value })} /></Field>
                <Grid>
                  <Field label="Keywords"><Input value={String(it.keywords ?? "")} onChange={(e) => up({ keywords: e.target.value })} /></Field>
                  <ImageField label="OG image URL" value={String(it.og_image ?? "")} onChange={(x) => up({ og_image: x })} />
                </Grid>
                <label className="flex items-center gap-2"><Switch checked={Boolean(it.noindex)} onCheckedChange={(x) => up({ noindex: x })} /><span className="text-xs text-muted-foreground">noindex (hide from search engines)</span></label>
              </div>
            )}
          />
        </Section>
      </div>
    );
  },
  announcements: ({ value, onChange }) => {
    const v = value as CmsData["announcements"];
    const set = (patch: Partial<CmsData["announcements"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-6">
        <Grid cols={3}>
          <Field label="Enabled">
            <div className="flex items-center gap-2 h-10"><Switch checked={v.enabled} onCheckedChange={(x) => set({ enabled: x })} /><span className="text-sm">{v.enabled ? "Live on site" : "Hidden"}</span></div>
          </Field>
          <Field label="Dismissible">
            <div className="flex items-center gap-2 h-10"><Switch checked={v.dismissible} onCheckedChange={(x) => set({ dismissible: x })} /><span className="text-sm">Show close (×) button</span></div>
          </Field>
          <Field label="Badge label" hint="Small pill on the left (e.g. Live, News, Offer)"><Input value={v.badge_label} onChange={(e) => set({ badge_label: e.target.value })} /></Field>
          <Field label="Scroll speed (seconds)" hint="Lower = faster. 15–120s"><Input type="number" min={15} max={120} value={v.speed_seconds} onChange={(e) => set({ speed_seconds: Number(e.target.value) || 40 })} /></Field>
        </Grid>
        <ArrayEditor
          label="Ticker messages" addLabel="Add message"
          items={v.items as unknown as Any[]} onChange={(x) => set({ items: x as CmsData["announcements"]["items"] })}
          factory={() => ({ text: "", icon: "", link: "", cta_label: "", enabled: true })}
          render={(it, _i, up) => (
            <>
              <Field label="Message text"><Input value={String(it.text ?? "")} onChange={(e) => up({ text: e.target.value })} placeholder="🎉 Flash sale — 20% off today" /></Field>
              <Grid cols={3}>
                <IconField value={it.icon as string} onChange={(x) => up({ icon: x })} />
                <Field label="Link (optional)"><Input value={String(it.link ?? "")} onChange={(e) => up({ link: e.target.value })} placeholder="/pricing" /></Field>
                <Field label="CTA label (optional)"><Input value={String(it.cta_label ?? "")} onChange={(e) => up({ cta_label: e.target.value })} placeholder="Grab deal" /></Field>
              </Grid>
              <div className="flex items-center gap-2"><Switch checked={it.enabled !== false} onCheckedChange={(x) => up({ enabled: x })} /><span className="text-xs text-muted-foreground">Show this message</span></div>
            </>
          )}
        />
      </div>
    );
  },
  banners: ({ value, onChange }) => {
    const v = value as CmsData["banners"];
    const set = (patch: Partial<CmsData["banners"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-6">
        <Grid cols={3}>
          <Field label="Enabled">
            <div className="flex items-center gap-2 h-10"><Switch checked={v.enabled} onCheckedChange={(x) => set({ enabled: x })} /><span className="text-sm">{v.enabled ? "Shown on homepage" : "Hidden"}</span></div>
          </Field>
          <Field label="Autoplay">
            <div className="flex items-center gap-2 h-10"><Switch checked={v.autoplay} onCheckedChange={(x) => set({ autoplay: x })} /><span className="text-sm">Auto-advance slides</span></div>
          </Field>
          <Field label="Autoplay interval (seconds)"><Input type="number" min={2} max={30} value={v.autoplay_seconds} onChange={(e) => set({ autoplay_seconds: Number(e.target.value) || 6 })} /></Field>
        </Grid>
        <ArrayEditor
          label="Banner slides" addLabel="Add slide"
          items={v.slides as unknown as Any[]} onChange={(x) => set({ slides: x as CmsData["banners"]["slides"] })}
          factory={() => ({ eyebrow: "", title: "", subtitle: "", image_url: "", cta_label: "", cta_link: "", cta2_label: "", cta2_link: "", enabled: true })}
          render={(it, _i, up) => (
            <>
              <Grid>
                <Field label="Eyebrow (small label)"><Input value={String(it.eyebrow ?? "")} onChange={(e) => up({ eyebrow: e.target.value })} placeholder="New · Offer · Featured" /></Field>
                <Field label="Title"><Input value={String(it.title ?? "")} onChange={(e) => up({ title: e.target.value })} placeholder="Big headline" /></Field>
              </Grid>
              <Field label="Subtitle"><Textarea rows={2} value={String(it.subtitle ?? "")} onChange={(e) => up({ subtitle: e.target.value })} /></Field>
              <ImageField label="Background image URL" value={String(it.image_url ?? "")} onChange={(x) => up({ image_url: x })} hint="Wide 16:6 image works best. Leave blank for a brand gradient." />
              <Grid>
                <Field label="Primary button label"><Input value={String(it.cta_label ?? "")} onChange={(e) => up({ cta_label: e.target.value })} placeholder="Shop now" /></Field>
                <Field label="Primary button link"><Input value={String(it.cta_link ?? "")} onChange={(e) => up({ cta_link: e.target.value })} placeholder="/pricing" /></Field>
                <Field label="Secondary button label"><Input value={String(it.cta2_label ?? "")} onChange={(e) => up({ cta2_label: e.target.value })} placeholder="Learn more" /></Field>
                <Field label="Secondary button link"><Input value={String(it.cta2_link ?? "")} onChange={(e) => up({ cta2_link: e.target.value })} placeholder="/services" /></Field>
              </Grid>
              <div className="flex items-center gap-2"><Switch checked={it.enabled !== false} onCheckedChange={(x) => up({ enabled: x })} /><span className="text-xs text-muted-foreground">Show this slide</span></div>
            </>
          )}
        />
      </div>
    );
  },
  deployments_page: ({ value, onChange }) => {
    const v = value as CmsData["deployments_page"];
    const set = (patch: Partial<CmsData["deployments_page"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-6">
        <Grid>
          <Field label="Eyebrow"><Input value={v.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
          <Field label="Title"><Input value={v.title} onChange={(e) => set({ title: e.target.value })} /></Field>
        </Grid>
        <Field label="Subtitle"><Textarea rows={2} value={v.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field>
        <Grid>
          <Field label="CTA title"><Input value={v.cta_title} onChange={(e) => set({ cta_title: e.target.value })} /></Field>
          <Field label="CTA subtitle"><Input value={v.cta_subtitle} onChange={(e) => set({ cta_subtitle: e.target.value })} /></Field>
        </Grid>
        <ArrayEditor
          label="Stack categories (filters)" addLabel="Add category"
          items={v.stacks as unknown as Any[]} onChange={(x) => set({ stacks: x as CmsData["deployments_page"]["stacks"] })}
          factory={() => ({ key: "", name: "" })}
          render={(it, _i, up) => (
            <Grid>
              <Field label="Key (slug)"><Input value={String(it.key ?? "")} onChange={(e) => up({ key: e.target.value })} placeholder="devops" /></Field>
              <Field label="Display name"><Input value={String(it.name ?? "")} onChange={(e) => up({ name: e.target.value })} placeholder="DevOps" /></Field>
            </Grid>
          )}
        />
        <ArrayEditor
          label="Applications" addLabel="Add application"
          items={v.apps as unknown as Any[]} onChange={(x) => set({ apps: x as CmsData["deployments_page"]["apps"] })}
          factory={() => ({ slug: "", name: "", tagline: "", description: "", stack: "devops", emoji: "🚀", color: "from-primary to-accent", from_inr: 999, tags: [], enabled: true })}
          render={(it, _i, up) => (
            <>
              <Grid cols={3}>
                <Field label="Slug"><Input value={String(it.slug ?? "")} onChange={(e) => up({ slug: e.target.value })} placeholder="coolify" /></Field>
                <Field label="Name"><Input value={String(it.name ?? "")} onChange={(e) => up({ name: e.target.value })} placeholder="Coolify" /></Field>
                <Field label="Stack (category key)"><Input value={String(it.stack ?? "")} onChange={(e) => up({ stack: e.target.value })} placeholder="devops" /></Field>
              </Grid>
              <Field label="Tagline"><Input value={String(it.tagline ?? "")} onChange={(e) => up({ tagline: e.target.value })} /></Field>
              <Field label="Description"><Textarea rows={2} value={String(it.description ?? "")} onChange={(e) => up({ description: e.target.value })} /></Field>
              <Grid cols={3}>
                <Field label="Emoji / icon"><Input value={String(it.emoji ?? "")} onChange={(e) => up({ emoji: e.target.value })} placeholder="🚀" /></Field>
                <Field label="Gradient (tailwind)"><Input value={String(it.color ?? "")} onChange={(e) => up({ color: e.target.value })} placeholder="from-primary to-accent" /></Field>
                <Field label="From ₹ / month"><Input type="number" value={Number(it.from_inr ?? 0)} onChange={(e) => up({ from_inr: Number(e.target.value) || 0 })} /></Field>
              </Grid>
              <Field label="Tags (comma separated)">
                <Input
                  value={Array.isArray(it.tags) ? (it.tags as string[]).join(", ") : ""}
                  onChange={(e) => up({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                  placeholder="docker, self-host, open-source"
                />
              </Field>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2"><Switch checked={it.enabled !== false} onCheckedChange={(x) => up({ enabled: x })} /><span className="text-xs text-muted-foreground">Visible</span></label>
                <label className="flex items-center gap-2"><Switch checked={it.popular === true} onCheckedChange={(x) => up({ popular: x })} /><span className="text-xs text-muted-foreground">Popular badge</span></label>
                <label className="flex items-center gap-2"><Switch checked={it.new === true} onCheckedChange={(x) => up({ new: x })} /><span className="text-xs text-muted-foreground">New badge</span></label>
              </div>
            </>
          )}
        />
      </div>
    );
  },
  hosting_page: ({ value, onChange }) => {
    const v = value as CmsData["hosting_page"];
    const set = (patch: Partial<CmsData["hosting_page"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-8">
        <Section title="Hero">
          <Grid>
            <Field label="Eyebrow"><Input value={v.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
            <Field label="Badge (top pill)"><Input value={v.badge} onChange={(e) => set({ badge: e.target.value })} /></Field>
            <Field label="Title (main)"><Input value={v.title} onChange={(e) => set({ title: e.target.value })} /></Field>
            <Field label="Title (gradient word)"><Input value={v.title_gradient} onChange={(e) => set({ title_gradient: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Subtitle"><Textarea rows={3} value={v.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field></div>
            <Field label="Primary CTA label"><Input value={v.cta_primary.label} onChange={(e) => set({ cta_primary: { ...v.cta_primary, label: e.target.value } })} /></Field>
            <Field label="Primary CTA link"><Input value={v.cta_primary.link} onChange={(e) => set({ cta_primary: { ...v.cta_primary, link: e.target.value } })} /></Field>
            <Field label="Secondary CTA label"><Input value={v.cta_secondary.label} onChange={(e) => set({ cta_secondary: { ...v.cta_secondary, label: e.target.value } })} /></Field>
            <Field label="Secondary CTA link"><Input value={v.cta_secondary.link} onChange={(e) => set({ cta_secondary: { ...v.cta_secondary, link: e.target.value } })} /></Field>
            <Field label="Tertiary CTA label"><Input value={v.cta_tertiary.label} onChange={(e) => set({ cta_tertiary: { ...v.cta_tertiary, label: e.target.value } })} /></Field>
            <Field label="Tertiary CTA link"><Input value={v.cta_tertiary.link} onChange={(e) => set({ cta_tertiary: { ...v.cta_tertiary, link: e.target.value } })} /></Field>
          </Grid>
        </Section>

        <Section title="Hero stats">
          <ArrayEditor
            label="Stats" items={v.stats as unknown as Any[]} onChange={(x) => set({ stats: x as CmsData["hosting_page"]["stats"] })}
            factory={() => ({ value: "", label: "", icon: "TrendingUp" })}
            render={(it, _i, up) => (
              <Grid cols={2}>
                <Field label="Value"><Input value={String(it.value ?? "")} onChange={(e) => up({ value: e.target.value })} /></Field>
                <Field label="Label"><Input value={String(it.label ?? "")} onChange={(e) => up({ label: e.target.value })} /></Field>
              </Grid>
            )}
          />
        </Section>

        <Section title="Section headings">
          <Grid>
            <Field label="Plans title"><Input value={v.plans_title} onChange={(e) => set({ plans_title: e.target.value })} /></Field>
            <Field label="Plans subtitle"><Input value={v.plans_subtitle} onChange={(e) => set({ plans_subtitle: e.target.value })} /></Field>
            <Field label="Data centers title"><Input value={v.datacenters_title} onChange={(e) => set({ datacenters_title: e.target.value })} /></Field>
            <Field label="Data centers subtitle"><Input value={v.datacenters_subtitle} onChange={(e) => set({ datacenters_subtitle: e.target.value })} /></Field>
            <Field label="Migration title"><Input value={v.migration_title} onChange={(e) => set({ migration_title: e.target.value })} /></Field>
            <Field label="Migration subtitle"><Input value={v.migration_subtitle} onChange={(e) => set({ migration_subtitle: e.target.value })} /></Field>
            <Field label="Testimonials title"><Input value={v.testimonials_title} onChange={(e) => set({ testimonials_title: e.target.value })} /></Field>
            <Field label="FAQ title"><Input value={v.faq_title} onChange={(e) => set({ faq_title: e.target.value })} /></Field>
            <Field label="Final CTA title"><Input value={v.final_cta_title} onChange={(e) => set({ final_cta_title: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Final CTA subtitle"><Textarea rows={2} value={v.final_cta_subtitle} onChange={(e) => set({ final_cta_subtitle: e.target.value })} /></Field></div>
          </Grid>
        </Section>

        <Section title="WhatsApp ordering">
          <Grid>
            <Field label="WhatsApp number override" hint="Leave blank to use global WhatsApp settings. Include country code, e.g. +919999999999"><Input value={v.whatsapp_number} onChange={(e) => set({ whatsapp_number: e.target.value })} placeholder="+91…" /></Field>
            <Field label="Greeting line"><Input value={v.whatsapp_greeting} onChange={(e) => set({ whatsapp_greeting: e.target.value })} /></Field>
          </Grid>
        </Section>
      </div>
    );
  },
  whatsapp: ({ value, onChange }) => {
    const v = value as CmsData["whatsapp"];
    const set = (patch: Partial<CmsData["whatsapp"]>) => onChange({ ...v, ...patch } as never);
    return (
      <div className="space-y-6">
        <Section title="Global WhatsApp ordering">
          <p className="text-xs text-muted-foreground -mt-2 mb-2">Used on every page (hosting, products, header float, checkout). Saved in the database so it applies to all visitors — not just this browser.</p>
          <Grid>
            <Field label="WhatsApp business number" hint="Include country code, e.g. +919876543210">
              <Input value={v.number} onChange={(e) => set({ number: e.target.value })} placeholder="+91…" />
            </Field>
            <Field label="Button label"><Input value={v.label} onChange={(e) => set({ label: e.target.value })} /></Field>
            <div className="md:col-span-2">
              <Field label="Greeting line"><Input value={v.greeting} onChange={(e) => set({ greeting: e.target.value })} /></Field>
            </div>
            <Field label="Message template">
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={v.template}
                onChange={(e) => set({ template: e.target.value as CmsData["whatsapp"]["template"] })}
              >
                <option value="premium">Premium</option>
                <option value="invoice">Invoice</option>
                <option value="concise">Concise</option>
                <option value="enquiry">Enquiry</option>
              </select>
            </Field>
          </Grid>
        </Section>
        <Section title="Visibility">
          <Grid cols={2}>
            <Field label="Ordering enabled">
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={String(v.enabled)} onChange={(e) => set({ enabled: e.target.value === "true" })}>
                <option value="true">Enabled</option><option value="false">Disabled</option>
              </select>
            </Field>
            <Field label="Show on header/float">
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={String(v.show_header)} onChange={(e) => set({ show_header: e.target.value === "true" })}>
                <option value="true">Show</option><option value="false">Hide</option>
              </select>
            </Field>
            <Field label="Show on product cards">
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={String(v.show_products)} onChange={(e) => set({ show_products: e.target.value === "true" })}>
                <option value="true">Show</option><option value="false">Hide</option>
              </select>
            </Field>
            <Field label="Show on checkout">
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={String(v.show_checkout)} onChange={(e) => set({ show_checkout: e.target.value === "true" })}>
                <option value="true">Show</option><option value="false">Hide</option>
              </select>
            </Field>
          </Grid>
        </Section>
      </div>
    );
  },
};


