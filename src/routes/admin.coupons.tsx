import { logAudit } from "@/lib/audit";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tag, Plus, ChevronRight, MoreHorizontal, Trash2, Edit3, Copy } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatINR } from "@/lib/catalog";

export const Route = createFileRoute("/admin/coupons")({
  head: () => ({ meta: [{ title: "Coupons — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Coupons"><CouponsPage /></AdminShell>,
});

type Coupon = {
  id: string; code: string; description: string | null; discount_type: string;
  discount_value: number; max_uses: number | null; uses: number;
  valid_from: string | null; valid_until: string | null; status: string;
};

function CouponsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Coupon> | null>(null);

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("*").order("valid_until", { ascending: false });
      if (error) throw error; return data as Coupon[];
    },
  });

  const save = useMutation({
    mutationFn: async (c: Partial<Coupon>) => {
      const payload = {
        code: c.code!.toUpperCase(), description: c.description ?? null, discount_type: c.discount_type ?? "percent",
        discount_value: Number(c.discount_value ?? 0), max_uses: c.max_uses ? Number(c.max_uses) : null,
        valid_from: c.valid_from || null, valid_until: c.valid_until || null, status: c.status ?? "active",
      };
      if (c.id) {
        const { error } = await supabase.from("coupons").update(payload).eq("id", c.id);
        if (error) throw error;
        await logAudit({ action: "update", resource: "coupons", resource_id: c.id, details: { code: payload.code } });
      } else {
        const { data, error } = await supabase.from("coupons").insert(payload).select("id").single();
        if (error) throw error;
        await logAudit({ action: "create", resource: "coupons", resource_id: data?.id, details: { code: payload.code } });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["coupons"] }); setEditing(null); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "coupons", resource_id: id });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["coupons"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-end sm:justify-between sm:flex-wrap sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">Dashboard</Link><ChevronRight className="h-3 w-3 shrink-0" /><span className="truncate">Coupons</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2 truncate"><Tag className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" /> <span className="truncate">Coupons & Promo Codes</span></h1>
        </div>
        <Button size="sm" className="bg-gradient-brand text-white shrink-0" onClick={() => setEditing({ discount_type: "percent", discount_value: 10, status: "active" })}><Plus className="h-3.5 w-3.5 sm:mr-1.5" /><span className="hidden sm:inline">New coupon</span></Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border">
              <th className="px-5 py-3">Code</th>
              <th className="px-3 py-3">Discount</th>
              <th className="px-3 py-3">Uses</th>
              <th className="px-3 py-3">Valid until</th>
              <th className="px-3 py-3">Status</th>
              <th className="pl-3 pr-5 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">Loading…</td></tr>}
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-secondary/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <code className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">{c.code}</code>
                    <button className="text-muted-foreground hover:text-foreground" onClick={() => { navigator.clipboard.writeText(c.code); toast.success("Copied"); }}><Copy className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{c.description}</div>
                </td>
                <td className="px-3 py-3 font-semibold">{c.discount_type === "percent" ? `${c.discount_value}%` : formatINR(Number(c.discount_value))}</td>
                <td className="px-3 py-3 text-xs">{c.uses} / {c.max_uses ?? "∞"}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{c.valid_until ? new Date(c.valid_until).toLocaleDateString("en-IN") : "—"}</td>
                <td className="px-3 py-3"><Badge className={c.status === "active" ? "bg-accent/15 text-accent border-0" : "bg-secondary"}>{c.status}</Badge></td>
                <td className="pl-3 pr-5 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><button className="h-8 w-8 rounded-md hover:bg-secondary flex items-center justify-center"><MoreHorizontal className="h-4 w-4" /></button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditing(c)}><Edit3 className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => confirm(`Delete "${c.code}"?`) && del.mutate(c.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {isLoading && <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground text-sm">Loading…</div>}
        {!isLoading && coupons.length === 0 && <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground text-sm">No coupons yet.</div>}
        {coupons.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded text-xs">{c.code}</code>
                  <button className="text-muted-foreground hover:text-foreground" onClick={() => { navigator.clipboard.writeText(c.code); toast.success("Copied"); }}><Copy className="h-3.5 w-3.5" /></button>
                  <Badge className={c.status === "active" ? "bg-accent/15 text-accent border-0" : "bg-secondary"}>{c.status}</Badge>
                </div>
                {c.description && <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</div>}
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                  <div><span className="text-muted-foreground">Discount:</span> <span className="font-semibold">{c.discount_type === "percent" ? `${c.discount_value}%` : formatINR(Number(c.discount_value))}</span></div>
                  <div><span className="text-muted-foreground">Uses:</span> {c.uses} / {c.max_uses ?? "∞"}</div>
                  <div className="col-span-2"><span className="text-muted-foreground">Valid until:</span> {c.valid_until ? new Date(c.valid_until).toLocaleDateString("en-IN") : "—"}</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => setEditing(c)}><Edit3 className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                <Button size="sm" variant="outline" className="h-8 px-2 text-destructive" onClick={() => confirm(`Delete "${c.code}"?`) && del.mutate(c.id)}><Trash2 className="h-3.5 w-3.5 mr-1" /> Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit coupon" : "New coupon"}</DialogTitle></DialogHeader>
          {editing && (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }}>
              <div><Label>Code</Label><Input required value={editing.code ?? ""} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} className="mt-1.5 font-mono uppercase" /></div>
              <div><Label>Description</Label><Textarea rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1.5" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Type</Label>
                  <Select value={editing.discount_type} onValueChange={(v) => setEditing({ ...editing, discount_type: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="percent">Percentage</SelectItem><SelectItem value="flat">Flat ₹</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Value</Label><Input type="number" min="0" step="0.01" required value={editing.discount_value ?? 0} onChange={(e) => setEditing({ ...editing, discount_value: Number(e.target.value) })} className="mt-1.5" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Max uses</Label><Input type="number" min="0" value={editing.max_uses ?? ""} onChange={(e) => setEditing({ ...editing, max_uses: e.target.value ? Number(e.target.value) : null })} className="mt-1.5" placeholder="Unlimited" /></div>
                <div><Label>Status</Label>
                  <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="paused">Paused</SelectItem><SelectItem value="expired">Expired</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Valid until</Label><Input type="datetime-local" value={editing.valid_until ? new Date(editing.valid_until).toISOString().slice(0,16) : ""} onChange={(e) => setEditing({ ...editing, valid_until: e.target.value ? new Date(e.target.value).toISOString() : null })} className="mt-1.5" /></div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-brand text-white" disabled={save.isPending}>Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
