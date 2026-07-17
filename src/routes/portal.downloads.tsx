import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Download, Package, FileText, KeyRound, Cloud, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { getMyBenefits } from "@/lib/memberships.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/downloads")({
  head: () => ({ meta: [{ title: "My Downloads — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: DownloadsPage,
});

const DELIVERABLE_TYPES = new Set(["digital", "license", "subscription", "service", "software", "saas"]);

type OrderWithProduct = {
  id: string; product_name: string; invoice_number: string | null; order_number: string;
  notes: string | null; product_id: string | null;
  products?: { product_type: string | null; metadata: Record<string, unknown> | null } | null;
};

function DownloadsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  const { data: orders = [] } = useQuery({
    queryKey: ["portal-downloads", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<OrderWithProduct[]> => {
      const { data } = await supabase.from("orders")
        .select("id, product_name, invoice_number, order_number, notes, product_id, products(product_type, metadata)")
        .eq("customer_id", user!.id).eq("status", "paid")
        .order("created_at", { ascending: false });
      const rows = (data ?? []) as unknown as OrderWithProduct[];
      return rows.filter((o) => DELIVERABLE_TYPES.has(String(o.products?.product_type ?? "digital").toLowerCase()));
    },
  });
  const benefitsFn = useServerFn(getMyBenefits);
  const { data: benefits } = useQuery({
    queryKey: ["my-benefits"],
    enabled: !!user,
    queryFn: () => benefitsFn() as Promise<{ products: Array<{ id: string; slug: string; name: string; description: string | null; product_type: string | null; thumbnail_url: string | null }> }>,
  });
  const membershipProducts = benefits?.products ?? [];

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto max-w-5xl px-4 lg:px-6 py-8 space-y-6">
        <Button variant="ghost" size="sm" asChild><Link to="/portal"><ArrowLeft className="h-4 w-4 mr-1.5" /> Portal</Link></Button>
        <div>
          <Badge variant="secondary" className="mb-2">Deliveries</Badge>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Download className="h-6 w-6 text-primary" /> My downloads & keys
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Digital products, license keys and access credentials from your paid orders.</p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
            No digital deliveries yet. Paid digital products, licenses and subscriptions will appear here.
            <div className="mt-4"><Button size="sm" asChild><Link to="/products">Browse catalog</Link></Button></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((o) => {
              const meta = { ...(o.products?.metadata ?? {}), ...(safeJson(o.notes)) } as Record<string, unknown>;
              const licenseKey = String(meta.license_key ?? meta.key ?? "");
              const downloadUrl = String(meta.download_url ?? "");
              const accessUrl = String(meta.access_url ?? "");
              const credentials = meta.credentials as { username?: string; password?: string } | undefined;
              const type = String(o.products?.product_type ?? "digital").toLowerCase();
              const Icon = type === "license" ? KeyRound : type === "subscription" ? Cloud : FileText;

              return (
                <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center"><Icon className="h-5 w-5 text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{o.product_name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{o.invoice_number ?? o.order_number}</div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] capitalize">{type}</Badge>
                  </div>
                  <div className="mt-4 space-y-2 text-xs">
                    {licenseKey && (
                      <Row label="License key">
                        <code className="font-mono bg-secondary px-2 py-1 rounded flex-1 truncate">{licenseKey}</code>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { navigator.clipboard?.writeText(licenseKey); toast.success("Key copied"); }}><Download className="h-3.5 w-3.5" /></Button>
                      </Row>
                    )}
                    {downloadUrl && (
                      <Row label="Download">
                        <a href={downloadUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate flex-1">{downloadUrl}</a>
                      </Row>
                    )}
                    {accessUrl && (
                      <Row label="Access URL">
                        <a href={accessUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate flex-1">{accessUrl}</a>
                      </Row>
                    )}
                    {credentials?.username && (
                      <Row label="Username"><code className="font-mono bg-secondary px-2 py-1 rounded flex-1 truncate">{credentials.username}</code></Row>
                    )}
                    {credentials?.password && (
                      <Row label="Password"><code className="font-mono bg-secondary px-2 py-1 rounded flex-1 truncate">••••••••</code>
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => { navigator.clipboard?.writeText(credentials.password!); toast.success("Password copied"); }}>Copy</Button>
                      </Row>
                    )}
                    {!licenseKey && !downloadUrl && !accessUrl && !credentials && (
                      <div className="text-muted-foreground text-xs italic">Delivery is being provisioned. You'll receive an email when ready.</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {membershipProducts.length > 0 && (
          <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-background to-background p-4 sm:p-6 space-y-4">
            <header>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Included with your membership
              </div>
              <h2 className="text-lg sm:text-xl font-bold mt-1">Unlocked digital products</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Access these at no additional cost with your active plan.</p>
            </header>
            <div className="grid gap-3 sm:grid-cols-2">
              {membershipProducts.map((p) => (
                <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }}
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-primary transition">
                  <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-secondary flex items-center justify-center">
                    {p.thumbnail_url
                      ? <img src={p.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                      : <Package className="h-5 w-5 text-primary/60" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate group-hover:text-primary">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground capitalize truncate">{p.product_type ?? "digital"}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function safeJson(s: string | null): Record<string, unknown> {
  if (!s) return {};
  try { const v = JSON.parse(s); return typeof v === "object" && v ? (v as Record<string, unknown>) : {}; } catch { return {}; }
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-muted-foreground uppercase text-[10px] tracking-wider">{label}</span>
      {children}
    </div>
  );
}
