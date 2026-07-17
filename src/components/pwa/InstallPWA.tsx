import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "infiniforge:pwa-install-dismissed";

export function InstallPWA() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [brand, setBrand] = useState({
    name: "Infiniforge Technologies",
    short: "Install the app for a faster, app-like experience.",
    icon: "/pwa-192.png",
  });

  useEffect(() => {
    supabase
      .from("module_records")
      .select("metadata")
      .eq("module", "pwa_settings")
      .eq("title", "config")
      .maybeSingle()
      .then(({ data }) => {
        const m = (data?.metadata ?? {}) as Record<string, unknown>;
        if (m.install_prompt_enabled === false) setEnabled(false);
        setBrand((b) => ({
          name: (m.name as string) || b.name,
          short: (m.install_prompt_text as string) || b.short,
          icon: (m.icon_url as string) || b.icon,
        }));
      });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setVisible(false));
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, [enabled]);

  if (!visible || !enabled) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  };

  return (
    <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:bottom-24 sm:right-5 z-50 sm:max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-primary/95 via-primary to-accent shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="relative p-4 pr-10 flex gap-3">
          <img
            src={brand.icon}
            alt="App icon"
            width={56}
            height={56}
            className="h-14 w-14 rounded-xl shadow-lg ring-2 ring-white/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
              <Smartphone className="h-3 w-3" /> Install App
            </div>
            <div className="mt-0.5 text-sm font-bold text-white leading-tight truncate">{brand.name}</div>
            <p className="mt-1 text-xs text-white/85 leading-snug line-clamp-2">{brand.short}</p>
            <div className="mt-2.5 flex gap-2">
              <Button
                size="sm"
                onClick={install}
                className="h-8 bg-white text-primary hover:bg-white/90 font-semibold shadow-md"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" /> Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={dismiss}
                className="h-8 text-white/90 hover:text-white hover:bg-white/10"
              >
                Not now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
