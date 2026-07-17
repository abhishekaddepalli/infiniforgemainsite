import { logAudit } from "@/lib/audit";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ShoppingCart, Search, ChevronRight, Plus, FileText, Download, Copy, Mail, Phone, MapPin, CreditCard, Package, Receipt, Calendar, User } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { notifyOrderCreated, updateOrderStatusWithAlert } from "@/lib/alerts.functions";
import { downloadInvoicePdf, downloadInvoiceCsv, type InvoiceOrder } from "@/lib/invoice";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Orders"><OrdersPage /></AdminShell>,
});

type Order = InvoiceOrder;
type Product = { id: string; name: string; price_inr: number; gst_percent: number };

const STATUSES = ["pending","paid","refunded","cancelled","failed"];

const STATUS_STYLE: Record<string, string> = {
  paid: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  refunded: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  cancelled: "bg-zinc-500/15 text-zinc-600 border-zinc-500/30",
  failed: "bg-red-500/15 text-red-600 border-red-500/30",
};

function OrdersPage() {
  const qc = useQueryClient();
  const updateStatusFn = useServerFn(updateOrderStatusWithAlert);
  const notifyOrderFn = useServerFn(notifyOrderCreated);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [creating, setCreating] = useState<{ customer_name: string; customer_email: string; product_id: string; payment_method: string } | null>(null);
  const [detail, setDetail] = useState<Order | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");


  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data as Order[];
    },
  });
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id,name,price_inr,gst_percent").eq("status", "active").order("name");
      if (error) throw error; return data as Product[];
    },
  });

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    const q = query.toLowerCase();
    return !q || o.order_number.toLowerCase().includes(q) || (o.customer_email ?? "").toLowerCase().includes(q) || o.product_name.toLowerCase().includes(q);
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await updateStatusFn({ data: { id, status } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); toast.success("Status updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const create = useMutation({
    mutationFn: async (payload: NonNullable<typeof creating>) => {
      const product = products.find((p) => p.id === payload.product_id);
      if (!product) throw new Error("Select a product");
      const amount = Number(product.price_inr);
      const gst = +(amount * Number(product.gst_percent) / 100).toFixed(2);
      const total = +(amount + gst).toFixed(2);
      const { data, error } = await supabase.from("orders").insert({
        customer_name: payload.customer_name, customer_email: payload.customer_email,
        product_id: product.id, product_name: product.name, amount_inr: amount, gst_inr: gst,
        total_inr: total, status: "pending", payment_method: payload.payment_method,
      }).select("id").single();
      if (error) throw error;
      await logAudit({ action: "create", resource: "orders", resource_id: data?.id, details: { customer_email: payload.customer_email, total_inr: total } });
      if (data?.id) void notifyOrderFn({ data: { order_id: data.id } }).catch(() => undefined);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); setCreating(null); toast.success("Order created"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">Dashboard</Link><ChevronRight className="h-3 w-3" /><span>Orders</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2"><ShoppingCart className="h-6 w-6 text-primary" /> Orders & Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">GST-compliant invoices with Razorpay-ready checkout data.</p>
        </div>
        <Button size="sm" className="bg-gradient-brand text-white" onClick={() => setCreating({ customer_name: "", customer_email: "", product_id: "", payment_method: "razorpay" })}><Plus className="h-3.5 w-3.5 mr-1.5" /> New order</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden min-w-0">
        <div className="flex flex-col items-stretch gap-3 p-4 border-b border-border sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search order, customer or product…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-9 w-full sm:w-72" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground sm:ml-auto">{filtered.length} of {orders.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border">
                <th className="px-5 py-3">Order</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3 text-right">Amount</th>
                <th className="px-3 py-3 text-right">GST</th>
                <th className="px-3 py-3 text-right">Total</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">Loading orders…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No orders yet.</td></tr>}
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => { setDetail(o); setNotesDraft(o.notes ?? ""); }}>
                  <td className="px-5 py-3">
                    <div className="font-mono text-xs break-all">{o.order_number}</div>
                    <div className="text-[11px] text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-sm">{o.customer_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground break-all">{o.customer_email}</div>
                  </td>
                  <td className="px-3 py-3 text-sm break-words">{o.product_name}</td>
                  <td className="px-3 py-3 text-right">{formatINR(Number(o.amount_inr))}</td>
                  <td className="px-3 py-3 text-right text-muted-foreground">{formatINR(Number(o.gst_inr))}</td>
                  <td className="px-3 py-3 text-right font-semibold">{formatINR(Number(o.total_inr))}</td>
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <Select value={o.status} onValueChange={(v) => setStatus.mutate({ id: o.id, status: v })}>
                      <SelectTrigger className={cn("h-8 w-[130px] capitalize", o.status === "paid" ? "text-accent" : o.status === "pending" ? "text-[color:var(--warning)]" : "")}><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!creating} onOpenChange={(v) => !v && setCreating(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create manual order</DialogTitle></DialogHeader>
          {creating && (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); create.mutate(creating); }}>
              <div><Label>Customer name</Label><Input required value={creating.customer_name} onChange={(e) => setCreating({ ...creating, customer_name: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Customer email</Label><Input type="email" required value={creating.customer_email} onChange={(e) => setCreating({ ...creating, customer_email: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Product</Label>
                <Select value={creating.product_id} onValueChange={(v) => setCreating({ ...creating, product_id: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} — {formatINR(Number(p.price_inr))}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Payment method</Label>
                <Select value={creating.payment_method} onValueChange={(v) => setCreating({ ...creating, payment_method: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setCreating(null)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-brand text-white" disabled={create.isPending}>Create order</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {detail && (() => {
            const o = detail;
            const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied"); };
            const addr = [o.billing_address_line1, o.billing_address_line2, [o.billing_city, o.billing_state, o.billing_postal_code].filter(Boolean).join(", "), o.billing_country].filter(Boolean).join("\n");
            async function saveNotes() {
              setSavingNotes(true);
              try {
                const { error } = await supabase.from("orders").update({ notes: notesDraft }).eq("id", o.id);
                if (error) throw error;
                toast.success("Notes saved");
                qc.invalidateQueries({ queryKey: ["orders"] });
                setDetail({ ...o, notes: notesDraft });
              } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
              finally { setSavingNotes(false); }
            }
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 flex-wrap">
                    <Receipt className="h-5 w-5 text-primary" />
                    <span className="font-mono">{o.order_number}</span>
                    <Badge variant="outline" className={cn("capitalize border", STATUS_STYLE[o.status] ?? "")}>{o.status}</Badge>
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" /> {new Date(o.created_at).toLocaleString("en-IN")}
                    {o.paid_at && <>· <span className="text-emerald-600">Paid {new Date(o.paid_at).toLocaleString("en-IN")}</span></>}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border p-4 bg-secondary/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary"><User className="h-3.5 w-3.5" /> Customer</div>
                    <div className="font-semibold text-sm">{o.customer_name ?? "—"}</div>
                    {o.customer_email && (
                      <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => copy(o.customer_email!)}>
                        <Mail className="h-3 w-3" /> {o.customer_email} <Copy className="h-3 w-3" />
                      </button>
                    )}
                    {o.customer_phone && (
                      <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => copy(o.customer_phone!)}>
                        <Phone className="h-3 w-3" /> {o.customer_phone} <Copy className="h-3 w-3" />
                      </button>
                    )}
                    {o.customer_gstin && <div className="text-xs"><span className="text-muted-foreground">GSTIN:</span> <span className="font-mono">{o.customer_gstin}</span></div>}
                    {addr && (
                      <div className="text-xs text-muted-foreground flex items-start gap-2 pt-1 whitespace-pre-line">
                        <MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {addr}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border p-4 bg-secondary/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary"><CreditCard className="h-3.5 w-3.5" /> Payment</div>
                    <div className="text-xs"><span className="text-muted-foreground">Method:</span> <span className="font-semibold uppercase">{o.payment_method ?? "—"}</span></div>
                    <div className="text-xs"><span className="text-muted-foreground">Invoice:</span> <span className="font-mono">{o.invoice_number ?? "—"}</span></div>
                    {o.razorpay_order_id && <div className="text-xs"><span className="text-muted-foreground">RZP Order:</span> <span className="font-mono break-all">{o.razorpay_order_id}</span></div>}
                    {o.razorpay_payment_id && (
                      <button className="text-xs flex items-center gap-1 hover:text-foreground" onClick={() => copy(o.razorpay_payment_id!)}>
                        <span className="text-muted-foreground">RZP Pay:</span> <span className="font-mono break-all">{o.razorpay_payment_id}</span> <Copy className="h-3 w-3" />
                      </button>
                    )}
                    {o.payment_id && <div className="text-xs"><span className="text-muted-foreground">Payment ID:</span> <span className="font-mono">{o.payment_id}</span></div>}
                    {Number(o.wallet_applied_inr ?? 0) > 0 && <div className="text-xs text-emerald-600">Wallet used: {formatINR(Number(o.wallet_applied_inr))}</div>}
                    {o.coupon_code && <div className="text-xs">Coupon: <span className="font-mono font-semibold">{o.coupon_code}</span></div>}
                  </div>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <div className="bg-gradient-brand text-white px-4 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"><Package className="h-3.5 w-3.5" /> Line item</div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between gap-4 items-start">
                      <div>
                        <div className="font-semibold">{o.product_name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Qty: {o.quantity ?? 1} · {o.billing_cycle ?? "one-time"} · GST {o.gst_percent}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatINR(Number(o.total_inr))}</div>
                      </div>
                    </div>
                    <div className="border-t pt-2 grid grid-cols-3 gap-2 text-xs">
                      <div><div className="text-muted-foreground">Subtotal</div><div className="font-semibold">{formatINR(Number(o.amount_inr))}</div></div>
                      <div><div className="text-muted-foreground">GST</div><div className="font-semibold">{formatINR(Number(o.gst_inr))}</div></div>
                      <div><div className="text-muted-foreground">Grand total</div><div className="font-semibold text-primary">{formatINR(Number(o.total_inr))}</div></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-primary font-bold">Admin notes</Label>
                  <Textarea rows={3} value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} placeholder="Internal notes about this order…" />
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={saveNotes} disabled={savingNotes || notesDraft === (o.notes ?? "")}>
                      {savingNotes ? "Saving…" : "Save notes"}
                    </Button>
                  </div>
                </div>

                <DialogFooter className="flex-wrap gap-2 sm:justify-between">
                  <div className="flex gap-2">
                    <Select value={o.status} onValueChange={(v) => { setStatus.mutate({ id: o.id, status: v }); setDetail({ ...o, status: v }); }}>
                      <SelectTrigger className="h-9 w-[140px] capitalize"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => downloadInvoiceCsv(o)}><Download className="h-3.5 w-3.5 mr-1.5" /> CSV</Button>
                    <Button size="sm" className="bg-gradient-brand text-white" onClick={() => downloadInvoicePdf(o)}><FileText className="h-3.5 w-3.5 mr-1.5" /> Invoice PDF</Button>
                  </div>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>

  );
}
