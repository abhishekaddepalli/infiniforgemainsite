import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { InstallPWA } from "@/components/pwa/InstallPWA";
import { recordLoginAlert } from "@/lib/alerts.functions";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Try again</button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Infiniforge Technologies — Enterprise SaaS, IT & AI Platform" },
      { name: "description", content: "India's unified enterprise platform for SaaS, IT services, hosting, licenses, and AI automation." },
      { name: "author", content: "Infiniforge Technologies" },
      { name: "theme-color", content: "#FF9933" },
      { name: "background-color", content: "#FFF7ED" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Infiniforge" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Infiniforge Technologies — Enterprise SaaS, IT & AI Platform" },
      { name: "twitter:title", content: "Infiniforge Technologies — Enterprise SaaS, IT & AI Platform" },
      { property: "og:description", content: "India's unified enterprise platform for SaaS, IT services, hosting, licenses, and AI automation." },
      { name: "twitter:description", content: "India's unified enterprise platform for SaaS, IT services, hosting, licenses, and AI automation." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2ca9a6f-0792-443a-b4b5-fa54adcaa58f/id-preview-e295699b--bc073b55-ba9e-45fb-b46e-1ff78dec7809.lovable.app-1782921071069.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2ca9a6f-0792-443a-b4b5-fa54adcaa58f/id-preview-e295699b--bc073b55-ba9e-45fb-b46e-1ff78dec7809.lovable.app-1782921071069.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/pwa-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/pwa-512.png" },
      { rel: "shortcut icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const LOGIN_ALERT_KEY = "infiniforge.login-alert.uid";
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event === "SIGNED_OUT") {
        try { sessionStorage.removeItem(LOGIN_ALERT_KEY); } catch { /* ignore */ }
        return;
      }
      queryClient.invalidateQueries();
      if (event === "SIGNED_IN" && session?.user?.id) {
        // Supabase fires SIGNED_IN on every tab load/refresh when the session
        // is restored from storage. Only trigger the login alert once per
        // real sign-in per browser tab session.
        try {
          const last = sessionStorage.getItem(LOGIN_ALERT_KEY);
          if (last === session.user.id) return;
          sessionStorage.setItem(LOGIN_ALERT_KEY, session.user.id);
        } catch { /* ignore */ }
        void recordLoginAlert({ data: { at: new Date().toISOString() } }).catch(() => undefined);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Outlet />
          <InstallPWA />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
