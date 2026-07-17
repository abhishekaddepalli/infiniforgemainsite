import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Smartphone, Download, Palette, Sparkles, CheckCircle2, Zap,
  ImageIcon, Info, Rocket, MonitorSmartphone,
} from "lucide-react";


export const Route = createFileRoute("/admin/pwa")({
  component: PwaSettingsPage,
});

type PwaConfig = {
  name: string;
  short_name: string;
  description: string;
  theme_color: string;
  background_color: string;
  display: "standalone" | "fullscreen" | "minimal-ui" | "browser";
  orientation: "any" | "portrait" | "landscape";
  start_url: string;
  icon_url: string;
  install_prompt_enabled: boolean;
  install_prompt_text: string;
};

const DEFAULTS: PwaConfig = {
  name: "Infiniforge Technologies",
  short_name: "Infiniforge",
  description: "India's unified enterprise platform for SaaS, IT, hosting & AI automation.",
  theme_color: "#FF9933",
  background_color: "#0F172A",
  display: "standalone",
  orientation: "portrait",
  start_url: "/",
  icon_url: "/pwa-512.png",
  install_prompt_enabled: true,
  install_prompt_text: "Install the app for a faster, app-like experience.",
};

function PwaSettingsPage() {
  const qc = useQueryClient();
  const [cfg, setCfg] = useState<PwaConfig>(DEFAULTS);
  

  const { data, isLoading } = useQuery({
    queryKey: ["pwa-config"],
    queryFn: async () => {
      const { data } = await supabase
        .from("module_records")
        .select("id, metadata")
        .eq("module", "pwa_settings")
        .eq("title", "config")
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (data?.metadata) setCfg({ ...DEFAULTS, ...(data.metadata as Partial<PwaConfig>) });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (data?.id) {
        const { error } = await supabase
          .from("module_records")
          .update({ metadata: cfg })
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("module_records").insert({
          module: "pwa_settings",
          title: "config",
          status: "published",
          metadata: cfg,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("PWA settings saved. Reload the app to see changes.");
      qc.invalidateQueries({ queryKey: ["pwa-config"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });


  const set = <K extends keyof PwaConfig>(k: K, v: PwaConfig[K]) => setCfg((c) => ({ ...c, [k]: v }));

  return (
    <AdminShell title="Progressive Web App">
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 lg:p-8">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Progressive Web App
              </div>
              <h2 className="mt-2 text-2xl lg:text-3xl font-bold">Installable App Experience</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                Let customers install Infiniforge to their home screen with your branding, colors, and icon.
                Delivers an app-like experience on Android, iOS, and desktop.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-xl border border-border bg-card/60 backdrop-blur px-3 py-2 text-xs">
                <div className="flex items-center gap-1.5 text-primary font-semibold"><CheckCircle2 className="h-3.5 w-3.5" /> Home-screen install</div>
              </div>
              <div className="rounded-xl border border-border bg-card/60 backdrop-blur px-3 py-2 text-xs">
                <div className="flex items-center gap-1.5 text-primary font-semibold"><CheckCircle2 className="h-3.5 w-3.5" /> Splash & theme</div>
              </div>
              <div className="rounded-xl border border-border bg-card/60 backdrop-blur px-3 py-2 text-xs">
                <div className="flex items-center gap-1.5 text-primary font-semibold"><CheckCircle2 className="h-3.5 w-3.5" /> Custom icon</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="h-4 w-4 text-primary" /> App identity</CardTitle>
                <CardDescription>Names shown under the installed app icon and in the install prompt.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full name</Label>
                    <Input value={cfg.name} onChange={(e) => set("name", e.target.value)} maxLength={45} />
                  </div>
                  <div>
                    <Label>Short name <span className="text-muted-foreground text-xs">(home screen)</span></Label>
                    <Input value={cfg.short_name} onChange={(e) => set("short_name", e.target.value)} maxLength={12} />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea rows={2} value={cfg.description} onChange={(e) => set("description", e.target.value)} maxLength={200} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Start URL</Label>
                    <Input value={cfg.start_url} onChange={(e) => set("start_url", e.target.value)} placeholder="/" />
                  </div>
                  <div>
                    <Label>Orientation</Label>
                    <select
                      className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={cfg.orientation}
                      onChange={(e) => set("orientation", e.target.value as PwaConfig["orientation"])}
                    >
                      <option value="any">Any</option>
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Display mode</Label>
                  <div className="mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["standalone", "fullscreen", "minimal-ui", "browser"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => set("display", m)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize transition ${
                          cfg.display === m
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        {m.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Branding & colors</CardTitle>
                <CardDescription>Theme color paints the status bar; background shows during launch splash.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Theme color</Label>
                    <div className="mt-1.5 flex gap-2">
                      <input type="color" className="h-10 w-16 rounded-md border border-input cursor-pointer" value={cfg.theme_color} onChange={(e) => set("theme_color", e.target.value)} />
                      <Input value={cfg.theme_color} onChange={(e) => set("theme_color", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label>Background color</Label>
                    <div className="mt-1.5 flex gap-2">
                      <input type="color" className="h-10 w-16 rounded-md border border-input cursor-pointer" value={cfg.background_color} onChange={(e) => set("background_color", e.target.value)} />
                      <Input value={cfg.background_color} onChange={(e) => set("background_color", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> App icon URL (512×512 recommended)</Label>
                  <div className="mt-2 flex items-center gap-4 rounded-xl border border-dashed border-border p-4">
                    <img src={cfg.icon_url} alt="Icon preview" width={72} height={72} className="h-18 w-18 rounded-xl shadow-md ring-1 ring-border object-cover" />
                    <div className="flex-1 space-y-1.5">
                      <Input value={cfg.icon_url} onChange={(e) => set("icon_url", e.target.value)} placeholder="/pwa-512.png or https://…" />
                      <p className="text-xs text-muted-foreground">Use the default <code className="text-primary">/pwa-512.png</code> or paste any public image URL.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Download className="h-4 w-4 text-primary" /> Install prompt</CardTitle>
                <CardDescription>Floating card shown to eligible visitors inviting them to install.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="text-sm font-semibold">Show install prompt</div>
                    <div className="text-xs text-muted-foreground">Disable to hide the on-site install banner.</div>
                  </div>
                  <Switch checked={cfg.install_prompt_enabled} onCheckedChange={(v) => set("install_prompt_enabled", v)} />
                </div>
                <div>
                  <Label>Prompt message</Label>
                  <Textarea rows={2} value={cfg.install_prompt_text} onChange={(e) => set("install_prompt_text", e.target.value)} maxLength={140} />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => save.mutate()}
                disabled={save.isPending || isLoading}
                className="bg-gradient-brand text-white shadow-md"
                size="lg"
              >
                <Rocket className="h-4 w-4 mr-2" />
                {save.isPending ? "Saving…" : "Save PWA settings"}
              </Button>
              <Button variant="outline" size="lg" onClick={() => setCfg(DEFAULTS)}>
                Reset to defaults
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><MonitorSmartphone className="h-4 w-4 text-primary" /> Live preview</CardTitle>
                <CardDescription>Install prompt & splash</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Install card mock */}
                <div className="relative overflow-hidden rounded-2xl p-4 shadow-lg" style={{ background: `linear-gradient(135deg, ${cfg.theme_color}, ${cfg.background_color})` }}>
                  <div className="flex gap-3">
                    <img src={cfg.icon_url} alt="Preview" width={48} height={48} className="h-12 w-12 rounded-xl ring-2 ring-white/30" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-white/80 font-semibold">Install App</div>
                      <div className="text-sm font-bold text-white truncate">{cfg.name}</div>
                      <p className="text-xs text-white/85 line-clamp-2 mt-0.5">{cfg.install_prompt_text}</p>
                    </div>
                  </div>
                </div>

                {/* Home screen icon mock */}
                <div className="rounded-xl border border-border p-4" style={{ background: cfg.background_color }}>
                  <div className="text-center">
                    <img src={cfg.icon_url} alt="Home preview" width={64} height={64} className="mx-auto h-16 w-16 rounded-2xl shadow-2xl" />
                    <div className="mt-2 text-xs font-medium text-white truncate">{cfg.short_name}</div>
                  </div>
                </div>

                {/* Theme swatches */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg p-3 text-center" style={{ background: cfg.theme_color }}>
                    <div className="text-[10px] uppercase text-white/80 font-semibold">Theme</div>
                    <div className="text-xs text-white font-mono">{cfg.theme_color}</div>
                  </div>
                  <div className="rounded-lg p-3 text-center border border-border" style={{ background: cfg.background_color }}>
                    <div className="text-[10px] uppercase text-white/80 font-semibold">Splash</div>
                    <div className="text-xs text-white font-mono">{cfg.background_color}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><Zap className="h-4 w-4 text-primary" /> Install tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex gap-2"><Smartphone className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> <span><b>Android/Chrome:</b> auto-detects install eligibility and shows the branded card.</span></div>
                <div className="flex gap-2"><Smartphone className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> <span><b>iOS Safari:</b> users tap Share → Add to Home Screen.</span></div>
                <div className="flex gap-2"><Smartphone className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> <span><b>Desktop:</b> install icon appears in the browser address bar.</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
