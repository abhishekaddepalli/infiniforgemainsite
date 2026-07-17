import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCart, Check, ChevronRight, ExternalLink, Package, ArrowLeft,
  Star, Share2, Loader2, Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { useCms, CmsIcon } from "@/lib/cms";
import { WhatsAppOrderButton } from "@/components/WhatsAppOrderButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$slug")({
  head: ({ loaderData }) => {
    const p = loaderData as { name?: string; description?: string; thumbnail_url?: string | null } | undefined;
    const title = p?.name ? `${p.name} — Infiniforge` : "Product — Infiniforge";
    const desc = p?.description ?? "Buy Infiniforge products with GST invoice, wallet or Razorpay.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p?.thumbnail_url ? [{ property: "og:image", content: p.thumbnail_url }] : []),
      ],
    };
  },
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, thumbnail_url")
      .eq("slug", params.slug)
      .eq("status", "active")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data;
  },
  errorComponent: ({ error }) => (
    <SiteLayout><div className="mx-auto max-w-3xl p-16 text-center text-muted-foreground">{error.message}</div></SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl p-20 text-center">
        <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button asChild className="mt-5"><Link to="/products">Back to catalog</Link></Button>
      </div>
    </SiteLayout>
  ),
  component: ProductDetail,
});

type DbProduct = {
  id: string; slug: string; name: string; description: string | null; long_description: string | null;
  price_inr: number; gst_percent: number; billing: string; product_type: string;
  featured: boolean; popular: boolean; thumbnail_url: string | null;
  features: string[] | null; category_id: string | null; sku: string | null;
  demo_url: string | null; demo_enabled: boolean; gallery_urls: string[] | null; stock: number | null;
};

function ProductDetail() {
  const { slug } = Route.useParams();
  const cms = useCms("product_detail");
  const navigate = useNavigate();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("status", "active").maybeSingle();
      if (error) throw error;
      return data as unknown as DbProduct | null;
    },
  });

  const { data: related = [] } = useQuery({
    queryKey: ["product-related", product?.category_id, product?.id],
    enabled: !!product && cms.show_related,
    queryFn: async () => {
      const q = supabase.from("products").select("id,slug,name,thumbnail_url,price_inr,billing,product_type")
        .eq("status", "active").neq("id", product!.id).limit(4);
      if (product!.category_id) q.eq("category_id", product!.category_id);
      const { data } = await q;
      return (data ?? []) as { id: string; slug: string; name: string; thumbnail_url: string | null; price_inr: number; billing: string; product_type: string }[];
    },
  });

  if (isLoading || !product) {
    return <SiteLayout><div className="py-32 flex items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…</div></SiteLayout>;
  }

  const gallery = [product.thumbnail_url, ...(Array.isArray(product.gallery_urls) ? product.gallery_urls : [])].filter(Boolean) as string[];
  const primaryImg = gallery[activeImg] ?? gallery[0] ?? null;
  const features = Array.isArray(product.features) ? product.features : [];
  const priceLine = product.billing === "one-time" ? `one-time · +${product.gst_percent}% GST` : `per ${product.billing} · +${product.gst_percent}% GST`;
  const gst = (Number(product.price_inr) * Number(product.gst_percent)) / 100;
  const total = Number(product.price_inr) + gst;

  const cartItem = {
    id: product.id, name: product.name, price_inr: Number(product.price_inr),
    gst_percent: Number(product.gst_percent), billing: product.billing,
    thumbnail_url: product.thumbnail_url ?? null, product_type: product.product_type,
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-[220px]">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-secondary/20 overflow-hidden shadow-card">
              {primaryImg ? (
                <img src={primaryImg} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center">
                  <Package className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                {product.popular && <Badge className="bg-primary text-primary-foreground shadow-md">Popular</Badge>}
                {product.featured && <Badge variant="secondary" className="shadow-md"><Star className="h-3 w-3 mr-1 fill-current" /> Featured</Badge>}
                {product.demo_enabled && product.demo_url && <Badge className="bg-emerald-500 text-white shadow-md">Live demo available</Badge>}
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {gallery.map((g, i) => (
                  <button
                    key={i} onClick={() => setActiveImg(i)}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      i === activeImg ? "border-primary shadow-elegant" : "border-border hover:border-primary/40"
                    )}
                  >
                    <img src={g} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="text-[11px] uppercase tracking-wider text-primary font-semibold">{product.product_type}</div>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{product.name}</h1>
            {product.description && <p className="mt-3 text-base text-muted-foreground leading-relaxed">{product.description}</p>}

            <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold">{formatINR(Number(product.price_inr))}</span>
                <span className="text-sm text-muted-foreground">{priceLine}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Total incl. GST: <b className="text-foreground">{formatINR(total)}</b></div>

              {product.stock !== null && (
                <div className="mt-3 text-xs">
                  {product.stock > 0
                    ? <span className="text-emerald-600 font-medium">✓ In stock ({product.stock} available)</span>
                    : <span className="text-destructive font-medium">Out of stock</span>}
                </div>
              )}

              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <div className="flex items-center rounded-lg border border-border overflow-hidden">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 hover:bg-secondary text-lg">−</button>
                  <span className="h-10 w-12 grid place-items-center font-semibold tabular-nums">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => q + 1)} className="h-10 w-10 hover:bg-secondary text-lg">+</button>
                </div>
                <Button
                  size="lg" className="bg-gradient-brand text-white flex-1 min-w-[140px]"
                  onClick={() => { for (let i = 0; i < qty; i++) add(cartItem); navigate({ to: "/checkout" }); }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> {cms.buy_now_label}
                </Button>
                <Button
                  size="lg" variant="outline"
                  onClick={() => { for (let i = 0; i < qty; i++) add(cartItem); toast.success(`${qty} × ${product.name} added`); }}
                >
                  {cms.add_to_cart_label}
                </Button>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.demo_enabled && product.demo_url && (
                  <Button asChild size="lg" variant="outline" className="border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10">
                    <a href={product.demo_url} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> {cms.demo_button_label}
                    </a>
                  </Button>
                )}
                <WhatsAppOrderButton
                  surface="product" size="lg"
                  className="border-[#25D366]/40 hover:bg-[#25D366]/10 w-full"
                  items={[{ name: product.name, qty, price_inr: Number(product.price_inr) }]}
                  total_inr={Number(product.price_inr) * qty}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2">
                {(cms.trust_badges ?? []).map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                      <CmsIcon name={b.icon} className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => {
                  const url = typeof window !== "undefined" ? window.location.href : "";
                  if (navigator.share) navigator.share({ title: product.name, url }).catch(() => {});
                  else { navigator.clipboard?.writeText(url); toast.success("Link copied"); }
                }}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                <Share2 className="h-3 w-3" /> Share
              </button>
              {product.sku && <span>· SKU: <span className="font-mono">{product.sku}</span></span>}
            </div>
          </div>
        </div>

        {/* Overview + Features */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> {cms.description_title}</h2>
            <div className="mt-4 prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {product.long_description || product.description || "Detailed overview coming soon."}
            </div>
          </div>
          {features.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="text-xl font-bold">{cms.features_title}</h2>
              <ul className="mt-4 space-y-2.5">
                {features.map((f, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{String(f)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Related */}
        {cms.show_related && related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-bold">{cms.related_title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{cms.related_subtitle}</p>
              </div>
              <Button variant="ghost" size="sm" asChild><Link to="/products"><ArrowLeft className="h-4 w-4 mr-1 rotate-180" /> View all</Link></Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <Link
                  key={r.id} to="/products/$slug" params={{ slug: r.slug }}
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-elegant transition-all"
                >
                  <div className="aspect-video bg-secondary overflow-hidden">
                    {r.thumbnail_url
                      ? <img src={r.thumbnail_url} alt={r.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                      : <div className="h-full w-full grid place-items-center"><Package className="h-8 w-8 text-muted-foreground/40" /></div>}
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.product_type}</div>
                    <div className="mt-1 font-semibold text-sm line-clamp-2">{r.name}</div>
                    <div className="mt-2 text-primary font-bold">{formatINR(Number(r.price_inr))}<span className="text-[10px] font-normal text-muted-foreground ml-1">/{r.billing}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
