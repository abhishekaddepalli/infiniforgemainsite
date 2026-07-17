import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Wallet, Loader2, Sparkles, CheckCircle2, FileText, FileDown } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useCart, getWalletEligibleTypes } from "@/lib/cart";
import { formatINR } from "@/lib/catalog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { createCheckout, confirmDemoPayment, verifyPayment } from "@/lib/payments.functions";
import { toast } from "sonner";
import { downloadInvoicePdf, downloadInvoiceCsv, type InvoiceOrder } from "@/lib/invoice";
import { INDIAN_STATES } from "@/lib/indian-states";
import { WhatsAppOrderButton } from "@/components/WhatsAppOrderButton";
import { CheckoutAuthPanel } from "@/components/checkout/CheckoutAuthPanel";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

declare global {
  interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function CheckoutPage() {
  const { items, setQty, remove, subtotal, gst, total, clear } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("India");
  const [saveProfile, setSaveProfile] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [useWallet, setUseWallet] = useState(false);
  const [walletBal, setWalletBal] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [successOrders, setSuccessOrders] = useState<InvoiceOrder[] | null>(null);

  async function loadOrders(ids: string[]): Promise<InvoiceOrder[]> {
    if (!ids.length) return [];
    const { data } = await supabase.from("orders").select("*").in("id", ids);
    return (data ?? []) as InvoiceOrder[];
  }

  useEffect(() => {
    if (profile?.full_name) setName(profile.full_name);
    if (user?.email) setEmail(user.email);
    if (profile?.phone) setPhone(profile.phone);
    if (profile?.gstin) setGstin(profile.gstin);
    if (profile?.address_line1) setAddr1(profile.address_line1);
    if (profile?.address_line2) setAddr2(profile.address_line2);
    if (profile?.city) setCity(profile.city);
    if (profile?.state) setStateName(profile.state);
    if (profile?.postal_code) setPostal(profile.postal_code);
    if (profile?.country) setCountry(profile.country);
  }, [profile, user]);

  useEffect(() => {
    if (!user) return;
    supabase.from("wallets").select("balance_inr").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setWalletBal(Number(data?.balance_inr ?? 0)));
  }, [user]);

  const eligibleTypes = getWalletEligibleTypes();
  const ineligibleItems = items.filter((i) => i.product_type && !eligibleTypes.includes(i.product_type));
  const walletAllowed = ineligibleItems.length === 0;
  const walletApply = (useWallet && walletAllowed) ? Math.min(walletBal, total) : 0;
  const payable = Math.max(0, total - walletApply);

  async function handlePay() {
    if (!user) {
      toast.info("Sign in, create an account, or use guest checkout above to continue");
      document.getElementById("checkout-auth-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    if (!name.trim() || !email.trim()) { toast.error("Name and email required"); return; }
    if (!addr1.trim() || !city.trim() || !stateName.trim() || !postal.trim()) {
      toast.error("Billing address, city, state and PIN code are required for GST invoicing");
      return;
    }

    setProcessing(true);
    try {
      const res = await createCheckout({ data: {
        items: items.map((i) => ({ id: i.id, name: i.name, price_inr: i.price_inr, gst_percent: i.gst_percent, qty: i.qty, billing: i.billing })),
        customer_name: name,
        customer_email: email,
        customer_phone: phone || undefined,
        gstin: gstin || undefined,
        coupon_code: coupon || undefined,
        use_wallet: useWallet,
        billing_address_line1: addr1 || undefined,
        billing_address_line2: addr2 || undefined,
        billing_city: city || undefined,
        billing_state: stateName || undefined,
        billing_postal_code: postal || undefined,
        billing_country: country || undefined,
        save_to_profile: saveProfile,
      } });

      if (res.fully_wallet) {
        const orders = await loadOrders(res.order_ids);
        clear();
        setSuccessOrders(orders);
        toast.success("Order placed — paid with wallet");
        return;
      }

      if (res.demo && !res.razorpay_key_id) {
        await confirmDemoPayment({ data: { order_ids: res.order_ids, order_group: res.order_group } });
        const orders = await loadOrders(res.order_ids);
        clear();
        setSuccessOrders(orders);
        toast.success(`Payment successful (demo). Invoice ${res.invoice_number}`);
        return;
      }

      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Razorpay SDK failed to load");

      const rzp = new window.Razorpay({
        key: res.razorpay_key_id,
        order_id: res.razorpay_order_id,
        amount: Math.round(res.payable_inr * 100),
        currency: "INR",
        name: "Infiniforge Technologies",
        description: `Order ${res.order_group}`,
        prefill: { name, email, contact: phone },
        theme: { color: "#FF9933" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verifyPayment({ data: { ...resp, order_ids: res.order_ids } });
            const orders = await loadOrders(res.order_ids);
            clear();
            setSuccessOrders(orders);
            toast.success(`Payment successful. Invoice ${res.invoice_number}`);
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Payment verification failed");
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.open();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setProcessing(false);
    }
  }

  if (successOrders) {
    const grandTotal = successOrders.reduce((s, o) => s + Number(o.total_inr), 0);
    const gstTotal = successOrders.reduce((s, o) => s + Number(o.gst_inr), 0);
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-8 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-accent/15 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold">Payment successful</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Your GST invoice{successOrders.length > 1 ? "s are" : " is"} ready. Download a copy for your records.
            </p>
            <div className="mt-6 grid gap-3 text-left">
              {successOrders.map((o) => (
                <div key={o.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-brand/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{o.product_name}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {o.invoice_number ?? o.order_number} · GST {formatINR(Number(o.gst_inr))}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{formatINR(Number(o.total_inr))}</div>
                  <Button size="sm" variant="outline" onClick={() => downloadInvoicePdf(o)}>
                    <FileText className="h-3.5 w-3.5 mr-1.5" /> PDF
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => downloadInvoiceCsv(o)}>
                    <FileDown className="h-3.5 w-3.5 mr-1.5" /> CSV
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-5 text-xs text-muted-foreground">
              Total paid <span className="font-semibold text-foreground">{formatINR(grandTotal)}</span> · GST included <span className="font-semibold text-foreground">{formatINR(gstTotal)}</span>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <Button asChild className="bg-gradient-brand text-white"><Link to="/portal">Go to my portal</Link></Button>
              <Button variant="outline" asChild><Link to="/products">Continue shopping</Link></Button>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 text-primary">Secure checkout</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Review your order</h1>
          <p className="text-sm text-muted-foreground mt-2">GST-compliant invoice sent instantly to your email — PDF & CSV download after payment.</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
            <div className="font-semibold">Your cart is empty</div>
            <p className="text-sm text-muted-foreground mt-1">Add products to continue.</p>
            <Button asChild className="mt-5 bg-gradient-brand text-white"><Link to="/products">Browse products</Link></Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {!user && !authLoading && (
                <div id="checkout-auth-panel">
                  <CheckoutAuthPanel
                    defaultEmail={email}
                    defaultName={name}
                    defaultPhone={phone}
                    onAuthenticated={() => { /* useAuth listener will update `user` and rerender */ }}
                  />
                </div>
              )}
              <div className="rounded-2xl border border-border bg-card divide-y divide-border">
                {items.map((i) => (
                  <div
                    key={i.id}
                    className="p-4 grid gap-3 grid-cols-[auto_minmax(0,1fr)_auto] sm:flex sm:items-center sm:gap-4"
                  >
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-brand/10 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 sm:flex-1">
                      <div className="font-medium truncate">{i.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {formatINR(i.price_inr)} · {i.billing === "one-time" ? "one-time" : `per ${i.billing}`} · GST {i.gst_percent}%
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive shrink-0 sm:order-last"
                      onClick={() => remove(i.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:contents">
                      <div className="flex items-center gap-1 shrink-0">
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setQty(i.id, i.qty - 1)}><Minus className="h-3 w-3" /></Button>
                        <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setQty(i.id, i.qty + 1)}><Plus className="h-3 w-3" /></Button>
                      </div>
                      <div className="font-semibold text-right sm:w-28">{formatINR(i.price_inr * i.qty)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Billing details</div>
                  {user && (
                    <Link to="/portal/profile" className="text-xs text-primary hover:underline">Edit saved profile →</Link>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Full name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                  <div><Label>Email *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <div><Label>Phone *</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98xxxxxxxx" /></div>
                  <div><Label>GSTIN (optional)</Label><Input value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" /></div>
                </div>
                <div className="pt-2 border-t border-border/70">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Billing address</div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2"><Label>Address line 1 *</Label><Input value={addr1} onChange={(e) => setAddr1(e.target.value)} placeholder="Flat / Building / Street" /></div>
                    <div className="sm:col-span-2"><Label>Address line 2</Label><Input value={addr2} onChange={(e) => setAddr2(e.target.value)} placeholder="Area / Landmark" /></div>
                    <div><Label>City *</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
                    <div><Label>State *</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={stateName} onChange={(e) => setStateName(e.target.value)}>
                        <option value="">Select state…</option>
                        {INDIAN_STATES.map((st) => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>

                    <div><Label>PIN code *</Label><Input value={postal} onChange={(e) => setPostal(e.target.value)} placeholder="560001" /></div>
                    <div><Label>Country</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} /></div>
                  </div>
                </div>
                {user && (
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Checkbox checked={saveProfile} onCheckedChange={(v) => setSaveProfile(!!v)} />
                    Save these details to my profile for faster checkout next time
                  </label>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 h-fit sticky top-20 space-y-4">
              <div className="font-semibold">Order summary</div>
              <div className="space-y-1 text-sm">
                <Row label="Subtotal" value={formatINR(subtotal)} />
                <Row label="GST" value={formatINR(gst)} />
                {walletApply > 0 && <Row label="Wallet applied" value={`− ${formatINR(walletApply)}`} accent />}
                <div className="pt-2 mt-2 border-t border-border flex justify-between font-semibold text-base">
                  <span>Payable</span><span>{formatINR(payable)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Coupon code</Label>
                <Input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="WELCOME10" />
              </div>

              {user && walletBal > 0 && walletAllowed && (
                <label className="flex items-center gap-2 text-sm p-3 rounded-lg bg-secondary cursor-pointer">
                  <Checkbox checked={useWallet} onCheckedChange={(v) => setUseWallet(!!v)} />
                  <Wallet className="h-4 w-4 text-primary" />
                  <span>Use wallet ({formatINR(walletBal)})</span>
                </label>
              )}
              {user && walletBal > 0 && !walletAllowed && (
                <div className="text-[11px] rounded-lg bg-amber-500/10 border border-amber-500/25 p-2.5 text-amber-700 dark:text-amber-300">
                  Wallet cannot be used — your cart contains items ({ineligibleItems.map((i) => i.product_type).join(", ")}) that require a payment gateway. Wallet is available for subscriptions, licenses, digital products & services only.
                </div>
              )}

              <Button className="w-full bg-gradient-brand text-white h-11" onClick={handlePay} disabled={processing || authLoading}>
                {processing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing…</> : <>Pay {formatINR(payable)}</>}
              </Button>

              <WhatsAppOrderButton
                surface="checkout"
                className="w-full h-11 border-[#25D366]/40 hover:bg-[#25D366]/10"
                items={items.map((i) => ({ name: i.name, qty: i.qty, price_inr: i.price_inr }))}
                total_inr={payable}
                customer_name={name}
                customer_phone={phone}
                note={gstin ? `GSTIN: ${gstin}` : undefined}
              />


              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Secure payments · Razorpay · UPI/Cards/Netbanking
              </div>

              <div className="text-[11px] rounded-lg bg-primary/[0.06] border border-primary/15 p-2.5 flex gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>
                  Running in <strong>demo mode</strong> until <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> are set — payments are simulated but orders, invoices, wallet flows all persist.
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "text-accent font-medium" : ""}>{value}</span>
    </div>
  );
}
