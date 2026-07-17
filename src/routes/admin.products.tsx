import { logAudit } from "@/lib/audit";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Plus, Search, MoreHorizontal, ChevronRight, Trash2, Edit3, Star, Upload, X, ImageIcon, Loader2, Sparkles, CheckSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { optimizeImage, formatBytes } from "@/lib/image-optimizer";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Products"><ProductsPage /></AdminShell>,
});

type Product = {
  id: string; slug: string; sku: string | null; name: string; category_id: string | null;
  product_type: string; description: string | null; price_inr: number; billing: string;
  gst_percent: number; stock: number | null; status: string; featured: boolean; popular: boolean;
  features: unknown; thumbnail_url: string | null;
  demo_url?: string | null; demo_enabled?: boolean; long_description?: string | null;
  gallery_urls?: string[] | null;
};
type Category = { id: string; name: string; slug: string };

const PRODUCT_TYPES = ["physical","digital","software","license","subscription","hosting","vps","domain","ssl","service","consultation","custom_dev","ai","monitoring","amc"];
const BILLING = ["one-time","monthly","quarterly","half-yearly","yearly","lifetime"];
const STATUSES = ["active","draft","archived"];
const BUCKET = "product-images";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 years

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function featurePlaceholder(type: string) {
  const map: Record<string, string> = {
    hosting: "4 vCPU · 8 GB RAM\nNVMe SSD storage\nFree SSL & daily backups\n24×7 NOC support",
    vps: "Dedicated cores\nRoot access\nSnapshot & clone\n99.99% SLA",
    domain: "Free WHOIS privacy\nAuto-renewal\nDomain lock\nEmail forwarding",
    ssl: "256-bit encryption\nUnlimited subdomains\nFree reissuance\n₹1.75 Cr warranty",
    license: "Genuine key delivery\nDomain / device binding\nLifetime activation\nInvoice included",
    subscription: "Cancel anytime\nUnlimited users\nGST invoicing\nPriority support",
    digital: "Instant download\nLifetime updates\nSource files included",
    service: "Dedicated engineer\nSLA-backed delivery\nQuarterly reviews",
    monitoring: "1-minute checks\nWhatsApp/SMS alerts\nSSL expiry warnings\nPublic status page",
    amc: "Priority tickets\nQuarterly audits\nFree minor upgrades",
    ai: "Trained on your data\nRAG + tools\nPrivate deployment",
  };
  return map[type] ?? "One feature per line";
}
function typeHint(type: string) {
  const map: Record<string, string> = {
    physical: "Physical goods require gateway checkout (wallet payments not allowed).",
    subscription: "Subscriptions auto-renew on the billing cycle; customer can cancel from the portal.",
    license: "License is auto-issued in Licenses module on payment; add key format in module metadata.",
    hosting: "Auto-creates a Hosting module record on purchase; track provisioning there.",
    vps: "Provisioning tracked via Hosting module; wallet-eligible.",
    domain: "Registration is tracked in Domains module.",
    ssl: "SSL issuance tracked in SSL module.",
    amc: "AMC is tracked with renewal reminders in AMC module.",
    monitoring: "Endpoint monitoring added to Monitoring module.",
    service: "Manual delivery — an order ticket is created for the support team.",
    ai: "AI Automation deliverable — tracked in CRM/Reports.",
  };
  return map[type] ?? "Product-type specific delivery flows apply automatically on payment.";
}

function ProductsPage() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>("active");


  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data as Product[];
    },
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id,name,slug").order("sort_order");
      if (error) throw error; return data as Category[];
    },
  });

  const filtered = useMemo(() => products.filter((p) => {
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !(p.sku ?? "").toLowerCase().includes(query.toLowerCase())) return false;
    if (categoryFilter !== "all" && p.category_id !== categoryFilter) return false;
    if (typeFilter !== "all" && p.product_type !== typeFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  }), [products, query, categoryFilter, typeFilter, statusFilter]);

  const save = useMutation({
    mutationFn: async (p: Partial<Product> & { features_text?: string }) => {
      const featureList = (p.features_text ?? "")
        .split("\n").map((s) => s.trim()).filter(Boolean);
      const payload = {
        name: p.name!, slug: p.slug!, sku: p.sku ?? null, category_id: p.category_id ?? null,
        product_type: p.product_type ?? "physical", description: p.description ?? null,
        long_description: p.long_description ?? null,
        price_inr: Number(p.price_inr ?? 0), billing: p.billing ?? "one-time",
        gst_percent: Number(p.gst_percent ?? 18), stock: p.stock ? Number(p.stock) : null,
        status: p.status ?? "active", featured: !!p.featured, popular: !!p.popular,
        thumbnail_url: p.thumbnail_url ?? null,
        demo_url: p.demo_url ?? null,
        demo_enabled: !!p.demo_enabled,
        gallery_urls: Array.isArray(p.gallery_urls) ? p.gallery_urls : [],
        features: featureList.length ? featureList : (Array.isArray(p.features) ? p.features : []),
      };
      if (p.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", p.id);
        if (error) throw error;
        await logAudit({ action: "update", resource: "products", resource_id: p.id, details: { name: payload.name } });
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        await logAudit({ action: "create", resource: "products", resource_id: data?.id, details: { name: payload.name } });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); setEditing(null); toast.success("Product saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "products", resource_id: id });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkDel = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("products").delete().in("id", ids);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "products", details: { count: ids.length, bulk: true } });
    },
    onSuccess: (_d, ids) => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(`Deleted ${ids.length} product${ids.length === 1 ? "" : "s"}`);
      setSelected(new Set());
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkStatusMut = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      const { error } = await supabase.from("products").update({ status }).in("id", ids);
      if (error) throw error;
      await logAudit({ action: "update", resource: "products", details: { count: ids.length, status, bulk: true } });
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(`Updated ${v.ids.length} product${v.ids.length === 1 ? "" : "s"}`);
      setSelected(new Set());
    },
    onError: (e: Error) => toast.error(e.message),
  });



  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState<"idle" | "optimize" | "upload" | "done">("idle");
  const [savings, setSavings] = useState<{ original: number; optimized: number; savedPct: number } | null>(null);

  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  const ALLOWED_EXT = ["png", "jpg", "jpeg", "webp", "gif"];
  const MAX_BYTES = 5 * 1024 * 1024;
  const MIN_DIM = 200;
  const MAX_DIM = 4000;

  function loadDimensions(file: File): Promise<{ w: number; h: number }> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve({ w: img.naturalWidth, h: img.naturalHeight }); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("This file isn't a readable image. Try PNG, JPG, or WebP.")); };
      img.src = url;
    });
  }

  async function handleFileUpload(file: File) {
    if (!editing) return;
    setUploadError(null);
    setSavings(null);

    const ext = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXT.includes(ext)) {
      const msg = "Unsupported format. Use PNG, JPG, WebP, or GIF.";
      setUploadError(msg); toast.error(msg); return;
    }
    if (file.size === 0) {
      const msg = "This file is empty.";
      setUploadError(msg); toast.error(msg); return;
    }
    if (file.size > MAX_BYTES) {
      const msg = `Image is ${(file.size / 1024 / 1024).toFixed(1)}MB — max allowed is 5MB.`;
      setUploadError(msg); toast.error(msg); return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadPhase("optimize");
    try {
      const { w, h } = await loadDimensions(file);
      if (w < MIN_DIM || h < MIN_DIM) throw new Error(`Image is too small (${w}×${h}). Minimum is ${MIN_DIM}×${MIN_DIM}px.`);
      if (w > MAX_DIM || h > MAX_DIM) throw new Error(`Image is too large (${w}×${h}). Maximum is ${MAX_DIM}×${MAX_DIM}px.`);

      // Phase 1: optimize (0-40% of combined bar)
      const result = await optimizeImage(file, { maxDimension: 1920, quality: 0.85, mimeType: "image/webp" }, (p) => {
        setUploadProgress(Math.round(p.progress * 0.4));
      });
      setSavings({ original: result.originalBytes, optimized: result.outputBytes, savedPct: result.savedPct });

      // Phase 2: upload (40-100%)
      setUploadPhase("upload");
      const outExt = result.file.name.split(".").pop() ?? ext;
      const path = `${crypto.randomUUID()}.${outExt}`;
      const { data: signedUp, error: signErr } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
      if (signErr) throw new Error(signErr.message.includes("row-level") ? "You don't have permission to upload images." : signErr.message);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedUp.signedUrl, true);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.setRequestHeader("cache-control", "31536000");
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setUploadProgress(40 + Math.round((ev.loaded / ev.total) * 60));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) { setUploadProgress(100); resolve(); }
          else reject(new Error(`Upload failed (${xhr.status}). Please try again.`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload. Please try again."));
        xhr.send(result.file);
      });

      const { data: signed, error: sErr } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
      if (sErr) throw sErr;
      setEditing({ ...editing, thumbnail_url: signed.signedUrl });
      setUploadPhase("done");
      toast.success(result.converted
        ? `Image optimized & uploaded — saved ${result.savedPct}% (${formatBytes(result.originalBytes)} → ${formatBytes(result.outputBytes)})`
        : "Image uploaded");
    } catch (e) {
      const msg = (e as Error).message || "Upload failed. Please try again.";
      setUploadError(msg); toast.error(msg);
    } finally {
      setUploading(false);
      setTimeout(() => { setUploadProgress(0); setUploadPhase("idle"); }, 1200);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }


  const activeFilterCount = (categoryFilter !== "all" ? 1 : 0) + (typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">Dashboard</Link><ChevronRight className="h-3 w-3" /><span>Products</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2"><Package className="h-6 w-6 text-primary" /> Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage every product type — physical, digital, SaaS, hosting, VPS, licenses, AMC.</p>
        </div>
        <Button size="sm" className="bg-gradient-brand text-white" onClick={() => setEditing({
          product_type: "subscription", billing: "monthly", status: "active", gst_percent: 18, featured: false, popular: false, price_inr: 0,
        })}><Plus className="h-3.5 w-3.5 mr-1.5" /> New product</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name or SKU…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-9 w-64" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {PRODUCT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => { setCategoryFilter("all"); setTypeFilter("all"); setStatusFilter("all"); }}>
              <X className="h-3.5 w-3.5 mr-1" /> Clear ({activeFilterCount})
            </Button>
          )}
          <div className="text-xs text-muted-foreground ml-auto">Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {products.length}</div>
        </div>
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-border bg-primary/5">
            <CheckSquare className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{selected.size} selected</span>
            <div className="flex-1" />
            <Select value={bulkStatus} onValueChange={setBulkStatus}>
              <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Button size="sm" variant="outline" disabled={bulkStatusMut.isPending}
              onClick={() => bulkStatusMut.mutate({ ids: Array.from(selected), status: bulkStatus })}>
              {bulkStatusMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply status"}
            </Button>
            <Button size="sm" variant="destructive" disabled={bulkDel.isPending}
              onClick={() => {
                const ids = Array.from(selected);
                if (confirm(`Delete ${ids.length} product${ids.length === 1 ? "" : "s"}?`)) bulkDel.mutate(ids);
              }}>
              {bulkDel.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Trash2 className="h-3.5 w-3.5 mr-1" /> Delete</>}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}><X className="h-4 w-4" /></Button>
          </div>
        )}
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="min-w-[920px] w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border">
                <th className="pl-5 pr-2 py-3 w-8">
                  <Checkbox
                    checked={filtered.length > 0 && filtered.every((p) => selected.has(p.id))}
                    onCheckedChange={(v) => {
                      const next = new Set(selected);
                      if (v) filtered.forEach((p) => next.add(p.id));
                      else filtered.forEach((p) => next.delete(p.id));
                      setSelected(next);
                    }}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3 text-right">Price</th>
                <th className="px-3 py-3">Billing</th>
                <th className="px-3 py-3">Status</th>
                <th className="pl-3 pr-5 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">Loading products…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No products match these filters.</td></tr>}
              {filtered.map((p) => {
                const isSel = selected.has(p.id);
                return (
                <tr key={p.id} className={cn("hover:bg-secondary/30", isSel && "bg-primary/5")}>
                  <td className="pl-5 pr-2 py-3">
                    <Checkbox
                      checked={isSel}
                      onCheckedChange={(v) => {
                        const next = new Set(selected);
                        if (v) next.add(p.id); else next.delete(p.id);
                        setSelected(next);
                      }}
                      aria-label={`Select ${p.name}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border">
                        {p.thumbnail_url ? <img src={p.thumbnail_url} alt={p.name} className="h-full w-full object-cover" /> : <ImageIcon className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium flex items-center gap-2 truncate">{p.name} {p.featured && <Star className="h-3.5 w-3.5 text-primary fill-primary shrink-0" />}</div>
                        <div className="text-xs text-muted-foreground font-mono truncate">{p.sku ?? "—"} · /{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><Badge variant="secondary" className="text-[10px] uppercase">{p.product_type}</Badge></td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{categories.find(c => c.id === p.category_id)?.name ?? "—"}</td>
                  <td className="px-3 py-3 text-right font-semibold">{formatINR(Number(p.price_inr))}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{p.billing}</td>
                  <td className="px-3 py-3"><span className={cn("inline-flex text-[11px] font-semibold rounded-full px-2.5 py-1 capitalize", p.status === "active" ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground")}>{p.status}</span></td>
                  <td className="pl-3 pr-5 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button className="h-8 w-8 rounded-md hover:bg-secondary flex items-center justify-center"><MoreHorizontal className="h-4 w-4" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing(p)}><Edit3 className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => confirm(`Delete "${p.name}"?`) && del.mutate(p.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
          {editing && (
            <form className="grid grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto pr-1" onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }}>
              <div className="col-span-2">
                <Label>Thumbnail</Label>
                <div
                  onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); if (!uploading) setDragActive(true); }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); if (!uploading) setDragActive(true); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
                  onDrop={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    setDragActive(false);
                    if (uploading) return;
                    const file = e.dataTransfer.files?.[0];
                    if (!file) return;
                    if (e.dataTransfer.files.length > 1) {
                      const msg = "Drop one image at a time.";
                      setUploadError(msg); toast.error(msg); return;
                    }
                    handleFileUpload(file);
                  }}
                  className={`mt-1.5 flex items-center gap-4 rounded-xl border-2 border-dashed p-3 transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : uploadError ? "border-destructive/40" : "border-border bg-secondary/40"
                  }`}
                >
                  <div className="h-20 w-20 rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden shrink-0 relative">
                    {editing.thumbnail_url ? <img src={editing.thumbnail_url} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                    {uploading && (
                      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                    <div className="flex gap-2 flex-wrap items-center">
                      <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => { setUploadError(null); fileInputRef.current?.click(); }}>
                        {uploading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1.5" />}
                        {uploading ? `${uploadPhase === "optimize" ? "Optimizing" : "Uploading"}… ${uploadProgress}%` : editing.thumbnail_url ? "Replace image" : "Upload image"}
                      </Button>
                      {editing.thumbnail_url && (
                        <Button type="button" size="sm" variant="ghost" onClick={() => { setUploadError(null); setEditing({ ...editing, thumbnail_url: null }); }}>
                          <X className="h-3.5 w-3.5 mr-1" /> Remove
                        </Button>
                      )}
                      <span className="text-[11px] text-muted-foreground">
                        {dragActive ? "Drop to upload" : "or drag & drop — auto-converted to WebP"}
                      </span>
                    </div>
                    {uploading && (
                      <div className="space-y-1" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100}>
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-[11px] text-muted-foreground tabular-nums flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3 text-primary" />
                          {uploadPhase === "optimize" ? "Compressing to WebP without quality loss" : uploadPhase === "upload" ? "Uploading optimized file to secure storage" : "Finalizing"}… {uploadProgress}%
                        </p>
                      </div>
                    )}
                    {!uploading && savings && savings.savedPct > 0 && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[11px] text-primary flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" /> Saved {savings.savedPct}% · {formatBytes(savings.original)} → {formatBytes(savings.optimized)} (WebP)
                      </div>
                    )}
                    <p className="text-[11px] text-muted-foreground">PNG, JPG, WebP, or GIF · 200×200–4000×4000 · up to 5MB. Auto-converted to WebP.</p>

                    {uploadError && (
                      <p className="text-[11px] text-destructive font-medium flex items-start gap-1.5" role="alert">
                        <X className="h-3 w-3 mt-0.5 shrink-0" /> {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-2"><Label>Name</Label><Input required value={editing.name ?? ""} onChange={(e) => {
                const name = e.target.value;
                setEditing({ ...editing, name, slug: editing.id || editing.slug ? editing.slug : slugify(name) });
              }} className="mt-1.5" /></div>
              <div><Label>Slug</Label><Input required value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="mt-1.5" placeholder="my-product" /></div>
              <div><Label>SKU</Label><Input value={editing.sku ?? ""} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Category</Label>
                <Select value={editing.category_id ?? ""} onValueChange={(v) => setEditing({ ...editing, category_id: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Type</Label>
                <Select value={editing.product_type} onValueChange={(v) => setEditing({ ...editing, product_type: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{PRODUCT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Price (INR)</Label><Input type="number" min="0" step="0.01" required value={editing.price_inr ?? 0} onChange={(e) => setEditing({ ...editing, price_inr: Number(e.target.value) })} className="mt-1.5" /></div>
              <div><Label>Billing</Label>
                <Select value={editing.billing} onValueChange={(v) => setEditing({ ...editing, billing: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{BILLING.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>GST %</Label><Input type="number" min="0" step="0.01" value={editing.gst_percent ?? 18} onChange={(e) => setEditing({ ...editing, gst_percent: Number(e.target.value) })} className="mt-1.5" /></div>
              <div><Label>Stock</Label><Input type="number" min="0" value={editing.stock ?? ""} onChange={(e) => setEditing({ ...editing, stock: e.target.value ? Number(e.target.value) : null })} className="mt-1.5" placeholder="Unlimited" /></div>
              <div><Label>Status</Label>
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2"><Label>Short description <span className="text-muted-foreground text-xs font-normal">(shown on catalog cards)</span></Label><Textarea rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1.5" /></div>
              <div className="col-span-2"><Label>Long description <span className="text-muted-foreground text-xs font-normal">(shown on product detail page — supports line breaks)</span></Label><Textarea rows={5} value={editing.long_description ?? ""} onChange={(e) => setEditing({ ...editing, long_description: e.target.value })} className="mt-1.5" placeholder="Rich, detailed overview shown on the single-product page." /></div>
              <div className="col-span-2">
                <Label>Features <span className="text-muted-foreground text-xs font-normal">(one per line — shown on the storefront card)</span></Label>
                <Textarea rows={4} className="mt-1.5" placeholder={featurePlaceholder(editing.product_type ?? "physical")}
                  value={Array.isArray(editing.features) ? (editing.features as string[]).join("\n") : ""}
                  onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n") })} />
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  {typeHint(editing.product_type ?? "physical")}
                </p>
              </div>
              <div className="col-span-2 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label className="text-sm font-semibold">Live Preview / Demo link</Label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Enable to show a "Live Preview" button on the product page (opens in a new tab).</p>
                  </div>
                  <Switch checked={!!editing.demo_enabled} onCheckedChange={(v) => setEditing({ ...editing, demo_enabled: v })} />
                </div>
                <Input
                  type="url"
                  placeholder="https://demo.example.com"
                  value={editing.demo_url ?? ""}
                  disabled={!editing.demo_enabled}
                  onChange={(e) => setEditing({ ...editing, demo_url: e.target.value })}
                />
              </div>
              <div className="col-span-2 flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.popular} onCheckedChange={(v) => setEditing({ ...editing, popular: v })} /> Popular</label>
              </div>
              <DialogFooter className="col-span-2">
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-brand text-white" disabled={save.isPending || uploading}>{save.isPending ? "Saving…" : "Save product"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
