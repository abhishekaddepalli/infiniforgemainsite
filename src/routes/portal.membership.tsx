import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getMyMembership, listTiers, purchaseMembership, createMembershipRazorpayOrder, verifyMembershipPayment, getMyBenefits } from "@/lib/memberships.functions";
import { ExpirationBar } from "@/components/membership/ExpirationBar";
import { MembershipBadge } from "@/components/membership/MembershipBadge";
import { Check, Sparkles, Wallet, CreditCard, Loader2, GraduationCap, Package, FolderTree, LayoutDashboard, ArrowRight, Gift } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/portal/membership")({
  head: () => ({ meta: [{ title: "My Membership — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

declare global {
  interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } }
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

function Page() {
  const qc = useQueryClient();
  const { user, profile } = useAuth();
  const getMine = useServerFn(getMyMembership);
  const list = useServerFn(listTiers);
  const buyWallet = useServerFn(purchaseMembership);
  const createRzp = useServerFn(createMembershipRazorpayOrder);
  const verifyRzp = useServerFn(verifyMembershipPayment);

  const { data: mine } = useQuery({ queryKey: ["my-membership"], queryFn: () => getMine() as any });
  const { data: tiers = [] } = useQuery({ queryKey: ["tiers-public"], queryFn: () => list() as any });

  const [walletBal, setWalletBal] = useState(0);
  useEffect(() => {
    if (!user) return;
    supabase.from("wallets").select("balance_inr").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setWalletBal(Number(data?.balance_inr ?? 0)));
  }, [user]);

  const currentRank = mine?.tier?.rank ?? 0;
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [method, setMethod] = useState<"wallet" | "card">("card");
  const [processing, setProcessing] = useState(false);

  function openPurchase(t: any) {
    setSelectedTier(t);
    setMethod(walletBal >= Number(t.price_inr) ? "wallet" : "card");
  }

  async function confirm() {
    if (!selectedTier) return;
    setProcessing(true);
    try {
      if (method === "wallet") {
        await buyWallet({ data: { tier_id: selectedTier.id } });
        toast.success("Membership activated!");
        setSelectedTier(null);
        qc.invalidateQueries({ queryKey: ["my-membership"] });
        qc.invalidateQueries({ queryKey: ["my-benefits"] });
        return;
      }
      const res: any = await createRzp({ data: { tier_id: selectedTier.id } });
      if (res.free || res.demo) {
        toast.success(res.demo ? "Membership activated (demo mode)" : "Membership activated!");
        setSelectedTier(null);
        qc.invalidateQueries({ queryKey: ["my-membership"] });
        qc.invalidateQueries({ queryKey: ["my-benefits"] });
        return;
      }
      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Razorpay SDK failed to load");
      const tier = selectedTier;
      const rzp = new window.Razorpay({
        key: res.razorpay_key_id,
        order_id: res.razorpay_order_id,
        amount: Math.round(res.amount_inr * 100),
        currency: "INR",
        name: "Infiniforge Membership",
        description: `${res.tier_name} plan`,
        prefill: { name: profile?.full_name ?? "", email: user?.email ?? "", contact: profile?.phone ?? "" },
        theme: { color: "#FF9933" },
        handler: async (resp: any) => {
          try {
            await verifyRzp({ data: {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            } });
            toast.success("Membership activated!");
            setSelectedTier(null);
            qc.invalidateQueries({ queryKey: ["my-membership"] });
            qc.invalidateQueries({ queryKey: ["my-benefits"] });
          } catch (e: any) {
            toast.error(e.message ?? "Verification failed");
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.open();

    } catch (e: any) {
      toast.error(e.message ?? "Purchase failed");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" /> My Membership
        </h1>
        <p className="text-sm text-muted-foreground">Manage your plan and unlock premium content.</p>
      </div>

      {mine ? <ExpirationBar membership={mine as any} /> : (
        <div className="rounded-2xl border p-4 text-sm text-muted-foreground">Loading membership…</div>
      )}

      <BenefitsPanel active={!!mine} />


      <div>
        <h2 className="text-lg font-bold mb-3">Choose a plan</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t: any) => {
            const isCurrent = mine?.tier?.id === t.id;
            const isDowngrade = t.rank < currentRank;
            return (
              <div key={t.id} className={cn(
                "relative rounded-2xl border p-5 flex flex-col bg-card transition",
                isCurrent && "ring-2 ring-primary shadow-lg"
              )} style={{ borderColor: isCurrent ? undefined : `${t.gradient_from}40` }}>
                {isCurrent && <span className="absolute -top-2 right-4 text-[10px] font-bold uppercase tracking-wide bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Current</span>}
                <MembershipBadge slug={t.slug} name={t.name} gradientFrom={t.gradient_from} gradientTo={t.gradient_to} size="lg" className="self-start" />
                <div className="mt-3 mb-1 text-xs text-muted-foreground">{t.description}</div>
                <div className="mt-2">
                  <span className="text-3xl font-black">₹{Number(t.price_inr).toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground ml-1">/ {t.duration_days ? `${t.duration_days}d` : "lifetime"}</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm flex-1">
                  {(t.features ?? []).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-4 w-full text-white"
                  style={{ background: `linear-gradient(135deg, ${t.gradient_from}, ${t.gradient_to})` }}
                  disabled={isCurrent || isDowngrade || t.slug === "free"}
                  onClick={() => openPurchase(t)}
                >
                  {isCurrent ? "Active" : isDowngrade ? "Lower tier" : t.slug === "free" ? "Included" : "Upgrade"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedTier} onOpenChange={(o) => !o && setSelectedTier(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase {selectedTier?.name}</DialogTitle>
            <DialogDescription>
              ₹{Number(selectedTier?.price_inr ?? 0).toLocaleString()} · {selectedTier?.duration_days ? `${selectedTier.duration_days} days` : "lifetime"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm font-medium">Payment method</div>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as "wallet" | "card")}>
              <label className={cn("flex items-start gap-3 rounded-xl border p-3 cursor-pointer", method === "wallet" && "border-primary bg-primary/5")}>
                <RadioGroupItem value="wallet" id="pm-wallet" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium"><Wallet className="h-4 w-4" /> Wallet</div>
                  <div className="text-xs text-muted-foreground">Balance: ₹{walletBal.toLocaleString()}
                    {walletBal < Number(selectedTier?.price_inr ?? 0) && (
                      <span className="text-destructive"> · insufficient</span>
                    )}
                  </div>
                </div>
              </label>
              <label className={cn("flex items-start gap-3 rounded-xl border p-3 cursor-pointer", method === "card" && "border-primary bg-primary/5")}>
                <RadioGroupItem value="card" id="pm-card" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium"><CreditCard className="h-4 w-4" /> Card / UPI / Netbanking</div>
                  <div className="text-xs text-muted-foreground">Pay securely via Razorpay</div>
                </div>
              </label>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTier(null)} disabled={processing}>Cancel</Button>
            <Button
              onClick={confirm}
              disabled={processing || (method === "wallet" && walletBal < Number(selectedTier?.price_inr ?? 0))}
            >
              {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Pay ₹{Number(selectedTier?.price_inr ?? 0).toLocaleString()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const PORTAL_SECTION_META: Record<string, { label: string; to: string; icon: any }> = {
  courses: { label: "Courses", to: "/portal/courses", icon: GraduationCap },
  downloads: { label: "Downloads", to: "/portal/downloads", icon: Package },
  licenses: { label: "Licenses", to: "/portal/licenses", icon: Package },
  subscriptions: { label: "Subscriptions", to: "/portal/subscriptions", icon: LayoutDashboard },
  affiliate: { label: "Affiliate", to: "/portal/affiliate", icon: Sparkles },
  wallet: { label: "Wallet", to: "/portal/wallet", icon: Wallet },
  orders: { label: "Orders", to: "/portal/orders", icon: Package },
  tickets: { label: "Support tickets", to: "/portal/tickets", icon: LayoutDashboard },
};

function BenefitsPanel({ active }: { active: boolean }) {
  const getBenefits = useServerFn(getMyBenefits);
  const { data, isLoading } = useQuery({
    queryKey: ["my-benefits"],
    queryFn: () => getBenefits() as any,
    enabled: active,
  });

  if (!active) return null;

  if (isLoading) {
    return (
      <div className="rounded-2xl border p-6 text-sm text-muted-foreground flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your unlocked benefits…
      </div>
    );
  }

  const courses = data?.courses ?? [];
  const products = data?.products ?? [];
  const categories = data?.categories ?? [];
  const sections: string[] = data?.portal_sections ?? [];
  const totalItems = courses.length + products.length + categories.length + sections.length;

  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-background to-background p-4 sm:p-6 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5" /> Unlocked with your plan
          </div>
          <h2 className="text-lg sm:text-xl font-bold mt-1">Your membership benefits</h2>
        </div>
        <div className="text-xs text-muted-foreground">
          Tier rank <span className="font-semibold text-foreground">{data?.user_rank ?? 0}</span> · {totalItems} item{totalItems === 1 ? "" : "s"}
        </div>
      </header>

      {totalItems === 0 ? (
        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nothing has been assigned to your current tier yet. Upgrade below or check back soon —
          new premium courses, products and categories are unlocked over time.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {sections.length > 0 && (
            <BenefitGroup title="Portal sections" icon={LayoutDashboard} count={sections.length}>
              <div className="flex flex-wrap gap-2">
                {sections.map((id) => {
                  const meta = PORTAL_SECTION_META[id] ?? { label: id, to: "/portal", icon: LayoutDashboard };
                  const Icon = meta.icon;
                  return (
                    <Link key={id} to={meta.to}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary transition">
                      <Icon className="h-3.5 w-3.5" /> {meta.label} <ArrowRight className="h-3 w-3 opacity-60" />
                    </Link>
                  );
                })}
              </div>
            </BenefitGroup>
          )}

          {courses.length > 0 && (
            <BenefitGroup title="Premium courses" icon={GraduationCap} count={courses.length}>
              <div className="grid gap-2">
                {courses.slice(0, 6).map((c: any) => (
                  <Link key={c.id} to="/courses/$slug" params={{ slug: c.slug }}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 hover:border-primary transition">
                    <div className="h-11 w-14 shrink-0 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                      {c.cover_image
                        ? <img src={c.cover_image} alt="" className="h-full w-full object-cover" loading="lazy" />
                        : <GraduationCap className="h-5 w-5 text-primary/60" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate group-hover:text-primary">{c.title}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{c.category ?? "Course"} · {c.level ?? "All levels"}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                  </Link>
                ))}
                {courses.length > 6 && (
                  <Link to="/courses" className="text-xs text-primary font-medium hover:underline text-center pt-1">
                    View all {courses.length} courses →
                  </Link>
                )}
              </div>
            </BenefitGroup>
          )}

          {products.length > 0 && (
            <BenefitGroup title="Digital products" icon={Package} count={products.length}>
              <div className="grid gap-2">
                {products.slice(0, 6).map((p: any) => (
                  <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 hover:border-primary transition">
                    <div className="h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                      {p.thumbnail_url
                        ? <img src={p.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                        : <Package className="h-5 w-5 text-primary/60" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate group-hover:text-primary">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground capitalize truncate">{p.product_type ?? "product"}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                  </Link>
                ))}
                {products.length > 6 && (
                  <Link to="/products" className="text-xs text-primary font-medium hover:underline text-center pt-1">
                    View all {products.length} products →
                  </Link>
                )}
              </div>
            </BenefitGroup>
          )}

          {categories.length > 0 && (
            <BenefitGroup title="Unlocked categories" icon={FolderTree} count={categories.length}>
              <div className="flex flex-wrap gap-2">
                {categories.map((c: any) => (
                  <span key={c.id} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">
                    <FolderTree className="h-3.5 w-3.5 text-primary" /> {c.name}
                  </span>
                ))}
              </div>
            </BenefitGroup>
          )}
        </div>
      )}
    </section>
  );
}

function BenefitGroup({ title, icon: Icon, count, children }: { title: string; icon: any; count: number; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{title}</div>
          <div className="text-[11px] text-muted-foreground">{count} item{count === 1 ? "" : "s"}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
