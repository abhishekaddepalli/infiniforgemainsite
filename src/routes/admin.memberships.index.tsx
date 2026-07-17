import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, Crown, Sparkles, Palette, Settings, Lock } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { upsertTier, deleteTier, saveTierAccessSelections } from "@/lib/memberships.functions";
import { MembershipBadge } from "@/components/membership/MembershipBadge";
import { TierAccessTab, type AccessSelection } from "@/components/admin/TierAccessTab";

export const Route = createFileRoute("/admin/memberships/")({
  head: () => ({ meta: [{ title: "Memberships — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Membership Tiers"><Page /></AdminShell>,
});

type Tier = {
  id?: string; slug: string; name: string; rank: number;
  color: string; gradient_from: string; gradient_to: string;
  price_inr: number; duration_days: number | null;
  features: string[]; description: string | null;
  is_active: boolean; sort_order: number;
};

function Page() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Tier | null>(null);
  const [access, setAccess] = useState<AccessSelection[]>([]);
  const save = useServerFn(upsertTier);
  const saveAccess = useServerFn(saveTierAccessSelections);
  const del = useServerFn(deleteTier);

  const { data: tiers = [], isLoading, error } = useQuery({
    queryKey: ["admin-tiers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("membership_tiers").select("*").order("rank");
      if (error) throw error;
      return data as any[];
    },
  });

  function openEditor(t: Tier | null) {
    setAccess([]);
    setEditing(t);
  }

  async function handleSave() {
    if (!editing) return;
    try {
      await save({ data: { ...editing, features: editing.features ?? [] } as any });
      await saveAccess({ data: { tier_rank: editing.rank, selections: access } });
      toast.success("Tier saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-tiers"] });
    } catch (e: any) { toast.error(e.message); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tier?")) return;
    try {
      await del({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-tiers"] });
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Crown className="h-6 w-6 text-amber-500" /> Membership Tiers</h1>
          <p className="text-sm text-muted-foreground">Configure plans, pricing, and content access per tier.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link to="/admin/memberships/users">Manage Users</Link></Button>
          <Button onClick={() => openEditor({
            slug: "", name: "", rank: 1, color: "#6366f1", gradient_from: "#6366f1", gradient_to: "#8b5cf6",
            price_inr: 0, duration_days: 30, features: [], description: "", is_active: true, sort_order: 0,
          })}>
            <Plus className="h-4 w-4 mr-1" /> New tier
          </Button>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{(error as Error).message}</div> : null}
      {isLoading ? <div className="text-sm text-muted-foreground">Loading…</div> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((t: any) => (
            <div key={t.id} className="rounded-xl border p-4 space-y-3 bg-card relative overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: `linear-gradient(90deg, ${t.gradient_from}, ${t.gradient_to})` }}
              />
              <div className="flex items-center justify-between">
                <MembershipBadge slug={t.slug} name={t.name} gradientFrom={t.gradient_from} gradientTo={t.gradient_to} size="lg" />
                <Badge variant="outline">Rank {t.rank}</Badge>
              </div>
              <div className="text-sm text-muted-foreground min-h-[2.5rem]">{t.description || "No description"}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-lg">₹{Number(t.price_inr).toLocaleString()}</span>
                <span className="text-muted-foreground">{t.duration_days ? `${t.duration_days} days` : "Lifetime"}</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {(t.features ?? []).slice(0, 4).map((f: string, i: number) => <li key={i}>• {f}</li>)}
              </ul>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditor({ ...t, features: t.features ?? [] })}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editing?.id ? "Edit tier" : "New tier"}
              {editing && (
                <MembershipBadge slug={editing.slug || "custom"} name={editing.name || "Preview"} gradientFrom={editing.gradient_from} gradientTo={editing.gradient_to} size="sm" />
              )}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="basic"><Settings className="h-4 w-4 mr-1.5" />Basic</TabsTrigger>
                <TabsTrigger value="design"><Palette className="h-4 w-4 mr-1.5" />Design</TabsTrigger>
                <TabsTrigger value="access"><Lock className="h-4 w-4 mr-1.5" />Access</TabsTrigger>
                <TabsTrigger value="features"><Sparkles className="h-4 w-4 mr-1.5" />Features</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
                  <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                  <div><Label>Rank (0=lowest)</Label><Input type="number" value={editing.rank} onChange={(e) => setEditing({ ...editing, rank: Number(e.target.value) })} /></div>
                  <div><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
                  <div><Label>Price (INR)</Label><Input type="number" value={editing.price_inr} onChange={(e) => setEditing({ ...editing, price_inr: Number(e.target.value) })} /></div>
                  <div><Label>Duration (days, blank=lifetime)</Label><Input type="number" value={editing.duration_days ?? ""} onChange={(e) => setEditing({ ...editing, duration_days: e.target.value ? Number(e.target.value) : null })} /></div>
                </div>
                <div><Label>Description</Label><Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
                <div className="flex items-center gap-2"><Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /><Label>Active</Label></div>
              </TabsContent>

              <TabsContent value="design" className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Gradient from</Label><Input type="color" value={editing.gradient_from} onChange={(e) => setEditing({ ...editing, gradient_from: e.target.value, color: e.target.value })} /></div>
                  <div><Label>Gradient to</Label><Input type="color" value={editing.gradient_to} onChange={(e) => setEditing({ ...editing, gradient_to: e.target.value })} /></div>
                </div>
                <div
                  className="rounded-2xl p-6 text-white text-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${editing.gradient_from}, ${editing.gradient_to})` }}
                >
                  <div className="text-xs uppercase tracking-wider opacity-80">Preview</div>
                  <div className="text-2xl font-bold mt-1">{editing.name || "Tier name"}</div>
                  <div className="text-sm opacity-90 mt-1">₹{Number(editing.price_inr).toLocaleString()} · {editing.duration_days ? `${editing.duration_days} days` : "Lifetime"}</div>
                </div>
              </TabsContent>

              <TabsContent value="access" className="mt-4">
                <TierAccessTab tierRank={editing.rank} value={access} onChange={setAccess} />
              </TabsContent>

              <TabsContent value="features" className="space-y-3 mt-4">
                <Label>Features (one per line, shown on the pricing card)</Label>
                <Textarea rows={10} value={(editing.features ?? []).join("\n")} onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n").filter(Boolean) })} />
                <div className="rounded-xl border p-4 bg-muted/30">
                  <div className="text-xs font-medium mb-2 text-muted-foreground">Preview</div>
                  <ul className="space-y-1 text-sm">
                    {(editing.features ?? []).map((f, i) => (
                      <li key={i} className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-primary" />{f}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save tier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
