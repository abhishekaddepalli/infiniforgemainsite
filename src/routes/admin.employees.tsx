import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Users, ChevronRight, Search, UserPlus, Loader2, Trash2, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLES, ROLE_TONE_CLASS, type RoleKey } from "@/lib/rbac";
const ROLE_MAP = Object.fromEntries(ROLES.map((r) => [r.key, r])) as Record<RoleKey, typeof ROLES[number]>;
import { inviteUser, deleteUser } from "@/lib/admin-users.functions";
import { logAudit } from "@/lib/audit";
import { downloadCsv } from "@/lib/download";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/employees")({
  head: () => ({ meta: [{ title: "Employees & Team — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (<AdminShell title="Employees" requiredRoles={["super_admin", "admin"]}><EmployeesPage /></AdminShell>),
});

const STAFF_ROLES: RoleKey[] = ["super_admin", "admin", "sales_manager", "support", "finance", "employee"];

function EmployeesPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<RoleKey | "all">("all");
  const [invite, setInvite] = useState<{ email: string; full_name: string; role: RoleKey } | null>(null);
  const [addRoleFor, setAddRoleFor] = useState<{ id: string; role: RoleKey } | null>(null);
  const inviteFn = useServerFn(inviteUser);
  const delFn = useServerFn(deleteUser);

  const { data: rolesData = [] } = useQuery({
    queryKey: ["staff-user-roles"],
    queryFn: async () => (await supabase.from("user_roles").select("user_id, role").in("role", STAFF_ROLES)).data ?? [],
  });
  const staffIds = useMemo(() => [...new Set(rolesData.map((r) => r.user_id))], [rolesData]);
  const { data: profiles = [] } = useQuery({
    queryKey: ["staff-profiles", staffIds.join(",")],
    enabled: staffIds.length > 0,
    queryFn: async () => (await supabase.from("profiles").select("id, full_name, email, phone, status, created_at").in("id", staffIds)).data ?? [],
  });

  const rolesByUser = useMemo(() => {
    const m = new Map<string, RoleKey[]>();
    rolesData.forEach((r) => { const a = m.get(r.user_id) ?? []; a.push(r.role as RoleKey); m.set(r.user_id, a); });
    return m;
  }, [rolesData]);

  const rows = useMemo(() => profiles
    .map((p) => ({ ...p, roles: rolesByUser.get(p.id) ?? [] }))
    .filter((p) => {
      if (filter !== "all" && !p.roles.includes(filter)) return false;
      if (!q) return true;
      return (p.full_name ?? "").toLowerCase().includes(q.toLowerCase()) || (p.email ?? "").toLowerCase().includes(q.toLowerCase());
    }), [profiles, rolesByUser, filter, q]);

  const stats = useMemo(() => {
    const s: Record<string, number> = { total: profiles.length };
    STAFF_ROLES.forEach((r) => { s[r] = 0; });
    rolesByUser.forEach((rs) => rs.forEach((r) => { s[r] = (s[r] ?? 0) + 1; }));
    return s;
  }, [profiles, rolesByUser]);

  const addRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: RoleKey }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: id, role });
      if (error) throw error;
      await logAudit({ action: "role.assign", resource: "roles", resource_id: id, details: { role } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["staff-user-roles"] }); setAddRoleFor(null); toast.success("Role added"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const removeRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: RoleKey }) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", id).eq("role", role);
      if (error) throw error;
      await logAudit({ action: "role.remove", resource: "roles", resource_id: id, details: { role } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["staff-user-roles"] }); toast.success("Role removed"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">Dashboard</Link><ChevronRight className="h-3 w-3" /><span>Employees</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Team & Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage internal staff — Admins, Sales, Support, Finance, Employees.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => downloadCsv([
            ["Name", "Email", "Phone", "Roles", "Status", "Joined"],
            ...rows.map((r) => [r.full_name ?? "", r.email ?? "", r.phone ?? "", r.roles.join("|"), r.status ?? "", r.created_at]),
          ], "employees.csv")}>Export CSV</Button>
          <Button size="sm" className="bg-gradient-brand text-white" onClick={() => setInvite({ email: "", full_name: "", role: "employee" })}><UserPlus className="h-3.5 w-3.5 mr-1.5" /> Invite team member</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard label="Total staff" value={stats.total} />
        {STAFF_ROLES.map((r) => <StatCard key={r} label={ROLE_MAP[r]?.name ?? r} value={stats[r] ?? 0} />)}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden min-w-0">
        <div className="flex flex-col items-stretch gap-3 p-4 border-b border-border sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name or email…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 h-9 w-full sm:w-72" />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as RoleKey | "all")}>
            <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All staff roles</SelectItem>
              {STAFF_ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_MAP[r]?.name ?? r}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground sm:ml-auto">{rows.length} of {profiles.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border">
                <th className="px-5 py-3">Employee</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Roles</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Joined</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No staff yet — invite your first team member.</td></tr>}
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30">
                  <td className="px-5 py-3">
                    <div className="font-medium">{p.full_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground font-mono">{p.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-3 py-3 text-xs">
                    <div className="break-all">{p.email}</div>
                    {p.phone && <div className="text-muted-foreground">{p.phone}</div>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.roles.map((r) => (
                        <Badge key={r} className={cn("gap-1 capitalize", ROLE_TONE_CLASS[ROLE_MAP[r]?.tone ?? "slate"])}>
                          {ROLE_MAP[r]?.name ?? r}
                          <button type="button" onClick={() => removeRole.mutate({ id: p.id, role: r })} className="ml-1 opacity-70 hover:opacity-100">×</button>
                        </Badge>
                      ))}
                      <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={() => setAddRoleFor({ id: p.id, role: "employee" })}>+ Add role</Button>
                    </div>
                  </td>
                  <td className="px-3 py-3"><Badge variant={p.status === "active" ? "default" : "outline"} className="capitalize">{p.status ?? "active"}</Badge></td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString("en-IN")}</td>
                  <td className="px-3 py-3 text-right">
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={async () => {
                      if (!confirm(`Remove ${p.full_name ?? p.email} completely?`)) return;
                      try { await delFn({ data: { userId: p.id } }); toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["staff-user-roles"] }); }
                      catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                    }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!invite} onOpenChange={(v) => !v && setInvite(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Invite team member</DialogTitle></DialogHeader>
          {invite && (
            <form className="space-y-3" onSubmit={async (e) => {
              e.preventDefault();
              try {
                await inviteFn({ data: invite });
                toast.success("Invitation sent");
                setInvite(null);
                qc.invalidateQueries({ queryKey: ["staff-user-roles"] });
              } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
            }}>
              <div><Label>Full name</Label><Input value={invite.full_name} onChange={(e) => setInvite({ ...invite, full_name: e.target.value })} className="mt-1.5" required /></div>
              <div><Label>Work email</Label><Input type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} className="mt-1.5" required /></div>
              <div><Label>Role</Label>
                <Select value={invite.role} onValueChange={(v) => setInvite({ ...invite, role: v as RoleKey })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{STAFF_ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_MAP[r]?.name ?? r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <DialogFooter><Button type="submit" className="bg-gradient-brand text-white">Send invite</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!addRoleFor} onOpenChange={(v) => !v && setAddRoleFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add role</DialogTitle></DialogHeader>
          {addRoleFor && (
            <div className="space-y-3">
              <Select value={addRoleFor.role} onValueChange={(v) => setAddRoleFor({ ...addRoleFor, role: v as RoleKey })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STAFF_ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_MAP[r]?.name ?? r}</SelectItem>)}</SelectContent>
              </Select>
              <DialogFooter>
                <Button className="bg-gradient-brand text-white" disabled={addRole.isPending} onClick={() => addRole.mutate(addRoleFor)}>
                  {addRole.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add role"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}
