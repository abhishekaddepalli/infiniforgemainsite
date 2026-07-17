import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, ShoppingBag, FileText, FileDown, Package, KeyRound, Copy,
  Calendar, CreditCard, Building2, Sparkles, ShieldCheck, Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatINR } from "@/lib/catalog";
import { downloadInvoicePdf, downloadInvoiceCsv, type InvoiceOrder } from "@/lib/invoice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/orders")({
  head: () => ({ meta: [{ title: "My Orders — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: OrdersPage,
});

type LicenseRow = {
  id: string;
  title: string;
  status: string;
  due_at: string | null;
  amount_inr: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

function timeLeft(iso: string | null) {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return { expired: true, label: "Expired" };
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return { expired: false, label: `${d}d ${h}h ${m}m` };
  if (h > 0) return { expired: false, label: `${h}h ${m}m` };
  return { expired: false, label: `${m}m` };
}

function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<InvoiceOrder | null>(null);
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [loading, user, navigate]);

  const { data: orders } = useQuery({
    queryKey: ["my-orders-all", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").eq("customer_id", user!.id).order("created_at", { ascending: false });
      return (data ?? []) as unknown as InvoiceOrder[];
    },
  });

  const { data: licenses } = useQuery({
    queryKey: ["my-licenses-all", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("module_records").select("*")
        .eq("module", "licenses").eq("customer_id", user!.id);
      return (data ?? []) as unknown as LicenseRow[];
    },
  });

  const licenseByOrderId = useMemo(() => {
    const m = new Map<string, LicenseRow>();
    (licenses ?? []).forEach((l) => {
      const oid = (l.metadata as { order_id?: string })?.order_id;
      if (oid) m.set(oid, l);
    });
    return m;
  }, [licenses]);

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <Button variant="ghost" size="sm" asChild><Link to="/portal"><ArrowLeft className="h-4 w-4 mr-1.5" /> Portal</Link></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Click any order to view full details, invoice and license.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {(orders ?? []).length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No orders yet.</p>
              <Button className="mt-4 bg-gradient-brand text-white" size="sm" asChild><Link to="/products">Browse products</Link></Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {(orders ?? []).map((o) => {
                const lic = licenseByOrderId.get(o.id);
                const left = lic ? timeLeft(lic.due_at) : null;
                return (
                  <button
                    key={o.id}
                    onClick={() => setSelected(o)}
                    className="w-full text-left flex items-center gap-4 p-4 hover:bg-secondary/40 transition"
                  >
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{o.product_name}</div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[11px] text-muted-foreground font-mono">{o.invoice_number ?? o.order_number}</span>
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">{o.billing_cycle ?? "one-time"}</Badge>
                        {lic && (
                          <Badge className={cn("text-[10px] h-4 px-1.5",
                            left?.expired ? "bg-rose-500/15 text-rose-500" : "bg-emerald-500/15 text-emerald-600")}>
                            <KeyRound className="h-2.5 w-2.5 mr-0.5" />
                            {left?.expired ? "Expired" : `Expires in ${left?.label}`}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{formatINR(Number(o.total_inr))}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{o.status}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <OrderDetailDialog
        order={selected}
        license={selected ? licenseByOrderId.get(selected.id) ?? null : null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function OrderDetailDialog({
  order, license, onClose,
}: { order: InvoiceOrder | null; license: LicenseRow | null; onClose: () => void }) {
  if (!order) return null;
  const meta = (license?.metadata ?? {}) as Record<string, unknown>;
  const licenseKey = meta.license_key as string | undefined;
  const tier = meta.tier as string | undefined;
  const activationLimit = (meta.activation_limit as number | undefined) ?? 0;
  const activations = (meta.activations as number | undefined) ?? 0;
  const left = license ? timeLeft(license.due_at) : null;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Dialog open={!!order} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Order details
          </DialogTitle>
        </DialogHeader>

        {license && (
          <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-primary/15 via-accent/10 to-emerald-500/10 border border-primary/20">
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Your license</div>
                    <div className="text-sm font-semibold">{license.title}</div>
                  </div>
                </div>
                <Badge className={cn("text-[10px]",
                  left?.expired ? "bg-rose-500/20 text-rose-600" : "bg-emerald-500/20 text-emerald-600")}>
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  {left?.expired ? "Expired" : "Active"}
                </Badge>
              </div>

              <div className="rounded-lg bg-background/70 backdrop-blur border border-border/60 p-3 flex items-center justify-between gap-2">
                <code className="text-sm font-mono font-bold tracking-wider truncate">
                  {licenseKey ?? "—"}
                </code>
                {licenseKey && (
                  <Button size="sm" variant="ghost" onClick={() => copy(licenseKey)}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
                <div className="rounded-lg bg-background/60 p-2.5">
                  <div className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> Expires in</div>
                  <div className="font-semibold mt-1">{left?.label ?? "—"}</div>
                </div>
                <div className="rounded-lg bg-background/60 p-2.5">
                  <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" /> Valid until</div>
                  <div className="font-semibold mt-1">{license.due_at ? new Date(license.due_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}</div>
                </div>
                <div className="rounded-lg bg-background/60 p-2.5">
                  <div className="flex items-center gap-1 text-muted-foreground"><Sparkles className="h-3 w-3" /> Tier</div>
                  <div className="font-semibold mt-1 capitalize">{tier ?? "standard"}</div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-muted-foreground">
                Activations {activations}/{activationLimit} · Issued {new Date(license.created_at).toLocaleDateString("en-IN")}
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Order</div>
              <div className="font-mono text-sm font-semibold">{order.order_number}</div>
            </div>
            <Badge variant="outline" className="uppercase text-[10px]">{order.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Row icon={<Package className="h-3.5 w-3.5" />} label="Product" value={order.product_name} />
            <Row icon={<CreditCard className="h-3.5 w-3.5" />} label="Billing" value={order.billing_cycle ?? "one-time"} />
            <Row icon={<FileText className="h-3.5 w-3.5" />} label="Invoice #" value={order.invoice_number ?? "—"} />
            <Row icon={<Calendar className="h-3.5 w-3.5" />} label="Date" value={new Date(order.created_at).toLocaleString("en-IN")} />
            <Row icon={<CreditCard className="h-3.5 w-3.5" />} label="Payment" value={order.payment_method ?? "—"} />
            <Row icon={<CreditCard className="h-3.5 w-3.5" />} label="Payment ID" value={order.razorpay_payment_id ?? order.payment_id ?? "—"} mono />
          </div>

          <div className="border-t border-border pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(Number(order.amount_inr))}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST ({order.gst_percent ?? 0}%)</span><span>{formatINR(Number(order.gst_inr))}</span></div>
            {Number(order.wallet_applied_inr ?? 0) > 0 && (
              <div className="flex justify-between text-emerald-600"><span>Wallet applied</span><span>− {formatINR(Number(order.wallet_applied_inr))}</span></div>
            )}
            <div className="flex justify-between font-semibold text-base pt-1"><span>Total</span><span>{formatINR(Number(order.total_inr))}</span></div>
          </div>
        </div>

        {(order.customer_name || order.billing_address_line1) && (
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              <Building2 className="h-3 w-3" /> Billed to
            </div>
            <div className="text-sm font-semibold">{order.customer_name}</div>
            <div className="text-xs text-muted-foreground">{order.customer_email}</div>
            {order.customer_phone && <div className="text-xs text-muted-foreground">{order.customer_phone}</div>}
            {order.customer_gstin && <div className="text-xs text-muted-foreground">GSTIN: {order.customer_gstin}</div>}
            {order.billing_address_line1 && (
              <div className="text-xs text-muted-foreground mt-1">
                {order.billing_address_line1}
                {order.billing_address_line2 ? `, ${order.billing_address_line2}` : ""}
                {order.billing_city ? `, ${order.billing_city}` : ""}
                {order.billing_state ? `, ${order.billing_state}` : ""}
                {order.billing_postal_code ? ` ${order.billing_postal_code}` : ""}
                {order.billing_country ? `, ${order.billing_country}` : ""}
              </div>
            )}
          </div>
        )}

        {order.status === "paid" && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => downloadInvoicePdf(order)}>
              <FileText className="h-4 w-4 mr-1.5" /> Download invoice (PDF)
            </Button>
            <Button size="sm" variant="outline" onClick={() => downloadInvoiceCsv(order)}>
              <FileDown className="h-4 w-4 mr-1.5" /> CSV
            </Button>
            {license && (
              <Button size="sm" variant="outline" asChild>
                <Link to="/portal/licenses"><KeyRound className="h-4 w-4 mr-1.5" /> Manage licenses</Link>
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">{icon} {label}</div>
      <div className={cn("mt-0.5 truncate", mono && "font-mono text-xs")}>{value}</div>
    </div>
  );
}
