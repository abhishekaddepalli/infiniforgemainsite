import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { listUserMemberships, listMembershipAssignableUsers, assignMembership, revokeMembership } from "@/lib/memberships.functions";
import { MembershipBadge } from "@/components/membership/MembershipBadge";
import { toast } from "sonner";
import { Users } from "lucide-react";

export const Route = createFileRoute("/admin/memberships/users")({
  head: () => ({ meta: [{ title: "User Memberships — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="User Memberships"><Page /></AdminShell>,
});

function Page() {
  const qc = useQueryClient();
  const list = useServerFn(listUserMemberships);
  const listUsers = useServerFn(listMembershipAssignableUsers);
  const assign = useServerFn(assignMembership);
  const revoke = useServerFn(revokeMembership);
  const [assigning, setAssigning] = useState<{ user_id: string; email?: string; name?: string } | null>(null);
  const [form, setForm] = useState({ tier_id: "", starts_at: "", expires_at: "", notes: "" });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-user-memberships"],
    queryFn: async () => (await list()) as any[],
  });

  const { data: tiers = [] } = useQuery({
    queryKey: ["tier-options"],
    queryFn: async () => (await supabase.from("membership_tiers").select("id,name,rank,slug,duration_days").order("rank")).data ?? [],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => (await listUsers()) as any[],
  });

  async function submitAssign() {
    if (!assigning || !form.tier_id) return;
    try {
      await assign({ data: {
        user_id: assigning.user_id, tier_id: form.tier_id,
        starts_at: form.starts_at || null, expires_at: form.expires_at || null, notes: form.notes,
      } });
      toast.success("Membership assigned");
      setAssigning(null);
      setForm({ tier_id: "", starts_at: "", expires_at: "", notes: "" });
      qc.invalidateQueries({ queryKey: ["admin-user-memberships"] });
    } catch (e: any) { toast.error(e.message); }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this membership?")) return;
    try {
      await revoke({ data: { membership_id: id } });
      toast.success("Revoked");
      qc.invalidateQueries({ queryKey: ["admin-user-memberships"] });
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 min-w-0 max-w-full">
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 shrink-0" /> <span className="min-w-0 break-words">User Memberships</span></h1>
        <Button variant="outline" asChild><Link to="/admin/memberships">Back to tiers</Link></Button>
      </div>

      <div className="rounded-xl border p-3">
        <div className="text-sm font-semibold mb-2">Assign membership</div>
        <Select onValueChange={(v) => {
          const u = users.find((x: any) => x.id === v);
          setAssigning({ user_id: v, name: u?.full_name ?? undefined, email: u?.email ?? undefined });
        }}>
          <SelectTrigger><SelectValue placeholder="Pick a user…" /></SelectTrigger>
          <SelectContent className="max-h-72">
            {users.map((u: any) => (
              <SelectItem key={u.id} value={u.id}>{u.full_name || u.email || u.id}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border overflow-x-auto">
        <table className="min-w-[860px] w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Tier</th>
              <th className="text-left p-3">Source</th>
              <th className="text-left p-3">Starts</th>
              <th className="text-left p-3">Expires</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">Loading…</td></tr> :
              rows.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3"><div className="font-medium break-words">{r.profile?.full_name || "—"}</div><div className="text-xs text-muted-foreground break-all">{r.profile?.email}</div></td>
                  <td className="p-3">{r.tier ? <MembershipBadge slug={r.tier.slug} name={r.tier.name} /> : "—"}</td>
                  <td className="p-3 capitalize">{r.source}</td>
                  <td className="p-3 text-xs">{new Date(r.starts_at).toLocaleDateString()}</td>
                  <td className="p-3 text-xs">{r.expires_at ? new Date(r.expires_at).toLocaleString() : "Lifetime"}</td>
                  <td className="p-3"><span className={r.status === "active" ? "text-emerald-500" : "text-muted-foreground"}>{r.status}</span></td>
                  <td className="p-3 text-right">
                    {r.status === "active" && <Button size="sm" variant="ghost" onClick={() => handleRevoke(r.id)}>Revoke</Button>}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!assigning} onOpenChange={(o) => !o && setAssigning(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign to {assigning?.name ?? assigning?.email}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Tier</Label>
              <Select value={form.tier_id} onValueChange={(v) => {
                const t: any = tiers.find((x: any) => x.id === v);
                const exp = t?.duration_days ? new Date(Date.now() + t.duration_days * 86400000).toISOString().slice(0, 16) : "";
                setForm({ ...form, tier_id: v, expires_at: exp });
              }}>
                <SelectTrigger><SelectValue placeholder="Pick a tier…" /></SelectTrigger>
                <SelectContent>
                  {tiers.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name} (rank {t.rank})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Starts at</Label><Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></div>
              <div><Label>Expires at</Label><Input type="datetime-local" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} /></div>
            </div>
            <div><Label>Notes</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigning(null)}>Cancel</Button>
            <Button onClick={submitAssign}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
