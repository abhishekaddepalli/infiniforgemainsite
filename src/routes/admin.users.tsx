import { logAudit } from "@/lib/audit";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Users, Search, Filter, MoreHorizontal, Download, UserPlus, Clock,
  ShieldCheck, Mail, ChevronRight, KeyRound, Trash2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ROLES, ROLE_TONE_CLASS, type RoleKey } from "@/lib/rbac";
import { toast } from "sonner";
import { downloadCsv } from "@/lib/download";
import { inviteUser, deleteUser, adminSetPassword } from "@/lib/admin-users.functions";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "User Management — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (<AdminShell title="Users"><UsersPage /></AdminShell>),
});

type ProfileRow = {
  id: string; full_name: string | null; email: string | null; phone: string | null;
  location: string | null; status: string; two_fa_enabled: boolean; created_at: string;
};

function UsersPage() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleKey | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<ProfileRow | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pwUser, setPwUser] = useState<ProfileRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProfileRow | null>(null);
  const invite = useServerFn(inviteUser);
  const doDelete = useServerFn(deleteUser);
  const setPw = useServerFn(adminSetPassword);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProfileRow[];
    },
  });

  const { data: rolesData = [] } = useQuery({
    queryKey: ["user_roles_all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return data as { user_id: string; role: RoleKey }[];
    },
  });

  const rolesByUser = useMemo(() => {
    const map = new Map<string, RoleKey[]>();
    rolesData.forEach((r) => { const arr = map.get(r.user_id) ?? []; arr.push(r.role); map.set(r.user_id, arr); });
    return map;
  }, [rolesData]);

  function primaryRole(userId: string): RoleKey {
    const rs = rolesByUser.get(userId) ?? ["customer"];
    if (rs.includes("super_admin")) return "super_admin";
    if (rs.includes("admin")) return "admin";
    return rs[0] ?? "customer";
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return profiles.filter((u) => {
      const role = primaryRole(u.id);
      if (roleFilter !== "all" && role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (q && !((u.full_name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q))) return false;
      return true;
    });
  }, [profiles, query, roleFilter, statusFilter, rolesByUser]);

  const stats = useMemo(() => ({
    total: profiles.length,
    staff: profiles.filter((p) => ["super_admin","admin","sales_manager","support","finance","employee"].includes(primaryRole(p.id))).length,
    customers: profiles.filter((p) => primaryRole(p.id) === "customer").length,
    active: profiles.filter((p) => p.status === "active").length,
  }), [profiles, rolesByUser]);

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: RoleKey }) => {
      await supabase.from("user_roles").delete().eq("user_id", userId);
      const toInsert: { user_id: string; role: RoleKey }[] = [{ user_id: userId, role }];
      if (role !== "customer") toInsert.push({ user_id: userId, role: "customer" });
      const { error } = await supabase.from("user_roles").insert(toInsert);
      if (error) throw error;
      await logAudit({ action: "role.assign", resource: "users", resource_id: userId, target_user_id: userId, details: { role } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["user_roles_all"] }); toast.success("Role updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase.from("profiles").update({ status }).eq("id", userId);
      if (error) throw error;
      await logAudit({ action: "status.change", resource: "users", resource_id: userId, target_user_id: userId, details: { status } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profiles"] }); toast.success("Status updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveEdit = useMutation({
    mutationFn: async (p: ProfileRow) => {
      const { error } = await supabase.from("profiles").update({
        full_name: p.full_name, phone: p.phone, location: p.location, two_fa_enabled: p.two_fa_enabled,
      }).eq("id", p.id);
      if (error) throw error;
      await logAudit({ action: "update", resource: "users", resource_id: p.id, target_user_id: p.id, details: { full_name: p.full_name } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profiles"] }); setEditing(null); toast.success("Profile saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-3 w-3" /><span>Users</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Assign roles, invite new team members, control 2FA and suspend accounts. All 9 roles supported.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            const rows: (string | number)[][] = [
              ["Name", "Email", "Phone", "Role", "Status", "2FA", "Created"],
              ...filtered.map((u) => [
                u.full_name ?? "",
                u.email ?? "",
                u.phone ?? "",
                primaryRole(u.id),
                u.status,
                u.two_fa_enabled ? "yes" : "no",
                new Date(u.created_at).toLocaleDateString("en-IN"),
              ]),
            ];
            downloadCsv(rows, `infiniforge-users-${new Date().toISOString().slice(0, 10)}.csv`);
            toast.success(`Exported ${filtered.length} users`);
          }}><Download className="h-3.5 w-3.5 mr-1.5" /> Export</Button>
          <Button size="sm" className="bg-gradient-brand text-white" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Invite user
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat icon={Users} label="Total users" value={stats.total} hint="Across every role" />
        <MiniStat icon={ShieldCheck} label="Staff" value={stats.staff} hint="Internal team members" />
        <MiniStat icon={Users} label="Customers" value={stats.customers} hint="End users" />
        <MiniStat icon={Clock} label="Active" value={stats.active} hint="Currently active" />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden min-w-0">
        <div className="flex flex-col items-stretch gap-3 p-4 border-b border-border sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-9 w-full sm:w-64" />
          </div>
          <Filter className="hidden h-4 w-4 text-muted-foreground sm:block" />
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as RoleKey | "all")}>
            <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {ROLES.map((r) => <SelectItem key={r.key} value={r.key}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground sm:ml-auto">Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {profiles.length}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-3 py-3 font-medium">Role</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">2FA</th>
                <th className="px-3 py-3 font-medium">Location</th>
                <th className="px-3 py-3 font-medium">Joined</th>
                <th className="pl-3 pr-5 py-3 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">Loading users…</td></tr>}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No users match your filters.</td></tr>
              )}
              {filtered.map((u) => {
                const role = primaryRole(u.id);
                const roleDef = ROLES.find((r) => r.key === role)!;
                return (
                  <tr key={u.id} className="hover:bg-secondary/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0", ROLE_TONE_CLASS[roleDef.tone])}>
                          {(u.full_name ?? u.email ?? "?").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{u.full_name ?? "—"}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3 shrink-0" /> <span className="break-all">{u.email}</span></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Select value={role} onValueChange={(v) => updateRole.mutate({ userId: u.id, role: v as RoleKey })}>
                        <SelectTrigger className="h-8 w-[160px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{ROLES.map((r) => <SelectItem key={r.key} value={r.key}>{r.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-3">
                      <Select value={u.status} onValueChange={(v) => updateStatus.mutate({ userId: u.id, status: v })}>
                        <SelectTrigger className="h-8 w-[130px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="invited">Invited</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-3">
                      {u.two_fa_enabled
                        ? <Badge className="bg-accent/15 text-accent border-0">Enabled</Badge>
                        : <Badge variant="secondary">Off</Badge>}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{u.location ?? "—"}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                    <td className="pl-3 pr-5 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-8 w-8 rounded-md hover:bg-secondary flex items-center justify-center"><MoreHorizontal className="h-4 w-4" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditing(u)}>Edit profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setPwUser(u)}>
                            <KeyRound className="h-3.5 w-3.5 mr-2" /> Change password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateStatus.mutate({ userId: u.id, status: u.status === "suspended" ? "active" : "suspended" })}>
                            {u.status === "suspended" ? "Reactivate" : "Suspend"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(u)}>
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete user
                          </DropdownMenuItem>
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
        <DialogContent>
          <DialogHeader><DialogTitle>Edit profile</DialogTitle></DialogHeader>
          {editing && (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); saveEdit.mutate(editing); }}>
              <div><Label>Full name</Label><Input value={editing.full_name ?? ""} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Phone</Label><Input value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Location</Label><Input value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="mt-1.5" /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.two_fa_enabled} onChange={(e) => setEditing({ ...editing, two_fa_enabled: e.target.checked })} />
                Require Two-Factor Authentication
              </label>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-brand text-white" disabled={saveEdit.isPending}>{saveEdit.isPending ? "Saving…" : "Save"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={async (payload) => {
          try {
            await invite({ data: payload });
            toast.success(`Invitation sent to ${payload.email}`);
            qc.invalidateQueries({ queryKey: ["profiles"] });
            qc.invalidateQueries({ queryKey: ["user_roles_all"] });
            setInviteOpen(false);
          } catch (e) { toast.error(e instanceof Error ? e.message : "Invite failed"); }
        }}
      />

      <PasswordDialog
        user={pwUser}
        onOpenChange={(v) => !v && setPwUser(null)}
        onSubmit={async (password) => {
          if (!pwUser) return;
          try {
            await setPw({ data: { userId: pwUser.id, password } });
            toast.success("Password updated");
            await logAudit({ action: "password.reset", resource: "users", resource_id: pwUser.id, target_user_id: pwUser.id });
            setPwUser(null);
          } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
        }}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user?</DialogTitle>
            <DialogDescription>
              This permanently removes <b>{deleteTarget?.full_name ?? deleteTarget?.email}</b> and all their account access. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteTarget) return;
                try {
                  await doDelete({ data: { userId: deleteTarget.id } });
                  await logAudit({ action: "delete", resource: "users", resource_id: deleteTarget.id, target_user_id: deleteTarget.id });
                  toast.success("User deleted");
                  qc.invalidateQueries({ queryKey: ["profiles"] });
                  qc.invalidateQueries({ queryKey: ["user_roles_all"] });
                  setDeleteTarget(null);
                } catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
              }}
            >Delete permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MiniStat({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center"><Icon className="h-4 w-4 text-primary" /></div>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{value.toLocaleString("en-IN")}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function InviteDialog({ open, onOpenChange, onInvite }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  onInvite: (p: { email: string; full_name: string; role: RoleKey }) => Promise<void> | void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<RoleKey>("customer");
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>They'll receive an email to set their password and sign in.</DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={async (e) => {
          e.preventDefault(); setBusy(true);
          try { await onInvite({ email: email.trim(), full_name: name.trim(), role }); setEmail(""); setName(""); setRole("customer"); }
          finally { setBusy(false); }
        }}>
          <div><Label>Email *</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" placeholder="user@company.com" /></div>
          <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" placeholder="Optional" /></div>
          <div><Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as RoleKey)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{ROLES.map((r) => <SelectItem key={r.key} value={r.key}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-brand text-white" disabled={busy || !email}>{busy ? "Sending…" : "Send invite"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PasswordDialog({ user, onOpenChange, onSubmit }: {
  user: ProfileRow | null; onOpenChange: (v: boolean) => void;
  onSubmit: (password: string) => Promise<void> | void;
}) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set new password</DialogTitle>
          <DialogDescription>Set a password for <b>{user?.full_name ?? user?.email}</b>. They'll use it on next sign in.</DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={async (e) => {
          e.preventDefault(); setBusy(true);
          try { await onSubmit(pw); setPw(""); } finally { setBusy(false); }
        }}>
          <div><Label>New password</Label><Input type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1.5" placeholder="Min 8 characters" /></div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-brand text-white" disabled={busy || pw.length < 8}>{busy ? "Updating…" : "Set password"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
