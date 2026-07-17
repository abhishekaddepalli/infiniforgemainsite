import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Shield, Search, Plus, Users, Lock, ChevronRight, Zap, Menu,
  LayoutDashboard, ShoppingCart, Package, Boxes, RefreshCw, Receipt,
  Wallet, CreditCard, Ticket, Server, Settings, Bell, Save, RotateCcw,
  Copy, Trash2, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  ROLES, PERMISSION_GROUPS, DEFAULT_MATRIX, ROLE_TONE_CLASS, ACTION_LABEL,
  type RoleKey, type RoleMatrix,
} from "@/lib/rbac";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({
    meta: [
      { title: "Roles & Permissions — Infiniforge Admin" },
      { name: "description", content: "Configure role based access control across every module of Infiniforge — Super Admin, Admin, Sales, Support, Finance, Reseller, Customer, Affiliate and Employee." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RolesPermissions,
});

type NavItem = { label: string; icon: React.ElementType; to?: string; active?: boolean };
const sidebar: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, to: "/admin" },
  { label: "Orders", icon: ShoppingCart },
  { label: "Products", icon: Package },
  { label: "Services", icon: Boxes },
  { label: "Subscriptions", icon: RefreshCw },
  { label: "Customers", icon: Users },
  { label: "Invoices", icon: Receipt },
  { label: "Wallets", icon: Wallet },
  { label: "Payments", icon: CreditCard },
  { label: "Tickets", icon: Ticket },
  { label: "Servers", icon: Server },
  { label: "Roles & Access", icon: Shield, active: true },
  { label: "Settings", icon: Settings },
];

function RolesPermissions() {
  const [openNav, setOpenNav] = useState(false);
  const [selected, setSelected] = useState<RoleKey>("admin");
  const [matrix, setMatrix] = useState<RoleMatrix>(() =>
    JSON.parse(JSON.stringify(DEFAULT_MATRIX)) as RoleMatrix,
  );
  const [query, setQuery] = useState("");
  const [dirty, setDirty] = useState(false);

  const role = ROLES.find((r) => r.key === selected)!;
  const isSuper = role.key === "super_admin";

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PERMISSION_GROUPS;
    return PERMISSION_GROUPS
      .map((g) => ({
        ...g,
        permissions: g.permissions.filter(
          (p) => p.label.toLowerCase().includes(q) || p.key.toLowerCase().includes(q) || g.label.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.permissions.length > 0);
  }, [query]);

  const stats = useMemo(() => {
    const perms = matrix[selected] ?? {};
    let granted = 0, total = 0;
    for (const g of PERMISSION_GROUPS) for (const p of g.permissions) {
      total += (p.actions ?? ["view"]).length;
      granted += (perms[p.key] ?? []).length;
    }
    return { granted, total };
  }, [matrix, selected]);

  function toggleAction(permKey: string, action: string, allActions: string[]) {
    if (isSuper) return;
    setDirty(true);
    setMatrix((prev) => {
      const next = { ...prev, [selected]: { ...prev[selected] } };
      const current = new Set(next[selected][permKey] ?? []);
      if (current.has(action)) current.delete(action);
      else current.add(action);
      const ordered = allActions.filter((a) => current.has(a));
      if (ordered.length === 0) delete next[selected][permKey];
      else next[selected][permKey] = ordered;
      return next;
    });
  }

  function toggleAllInGroup(groupKey: string, grant: boolean) {
    if (isSuper) return;
    setDirty(true);
    setMatrix((prev) => {
      const next = { ...prev, [selected]: { ...prev[selected] } };
      const g = PERMISSION_GROUPS.find((x) => x.key === groupKey)!;
      for (const p of g.permissions) {
        if (grant) next[selected][p.key] = [...(p.actions ?? ["view"])];
        else delete next[selected][p.key];
      }
      return next;
    });
  }

  return (
    <AdminShell title="Roles & Permissions">
      <>
        <div className="flex items-center gap-3 mb-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search permissions…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-9 bg-secondary border-transparent" />
          </div>
        </div>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link to="/admin" className="hover:text-foreground">Dashboard</Link>
                <ChevronRight className="h-3 w-3" />
                <span>Roles &amp; permissions</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" /> Roles &amp; Permissions
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Fine-grained, module-level access control across Infiniforge. Every action can be toggled per role, with system roles safely locked.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setMatrix(JSON.parse(JSON.stringify(DEFAULT_MATRIX))); setDirty(false); }}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset defaults
              </Button>
              <Button size="sm" className="bg-gradient-brand text-white" disabled={!dirty} onClick={() => setDirty(false)}>
                <Save className="h-3.5 w-3.5 mr-1.5" /> Save changes
              </Button>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MiniStat icon={Shield} label="Total roles" value={String(ROLES.length)} hint="2 system, 7 custom" />
            <MiniStat icon={Users} label="Assigned users" value={ROLES.reduce((s, r) => s + r.users, 0).toLocaleString("en-IN")} hint="Across all roles" />
            <MiniStat icon={Lock} label="Permission scopes" value={String(PERMISSION_GROUPS.reduce((s, g) => s + g.permissions.length, 0))} hint={`${PERMISSION_GROUPS.length} modules`} />
            <MiniStat icon={ShieldCheck} label={`${role.name} coverage`} value={`${stats.granted} / ${stats.total}`} hint={`${Math.round((stats.granted / stats.total) * 100)}% of actions granted`} />
          </div>

          <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
            {/* Roles list */}
            <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden h-fit min-w-0">
              <div className="flex items-center justify-between p-5 pb-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">Roles</div>
                  <div className="text-lg font-semibold mt-0.5">All roles</div>
                </div>
                <Button size="sm" variant="outline" className="h-8">
                  <Plus className="h-3.5 w-3.5 mr-1" /> New
                </Button>
              </div>
              <div className="px-3 pb-3 space-y-1">
                {ROLES.map((r) => {
                  const active = r.key === selected;
                  return (
                    <button
                      key={r.key}
                      onClick={() => setSelected(r.key)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors border",
                        active ? "bg-secondary border-border shadow-sm" : "border-transparent hover:bg-secondary/60",
                      )}
                    >
                      <span className={cn("h-9 w-9 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold", ROLE_TONE_CLASS[r.tone])}>
                        {r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold truncate">{r.name}</span>
                          {r.system && <Lock className="h-3 w-3 text-muted-foreground" />}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">{r.users.toLocaleString("en-IN")} users</span>
                      </span>
                      {active && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Permission editor */}
              <div className="space-y-4 min-w-0">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <span className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold", ROLE_TONE_CLASS[role.tone])}>
                      {role.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{role.name}</h2>
                        {role.system && <Badge variant="secondary" className="text-[10px]"><Lock className="h-2.5 w-2.5 mr-1" /> System</Badge>}
                        <Badge className="bg-accent/15 text-accent hover:bg-accent/20 text-[10px]">{role.users.toLocaleString("en-IN")} users</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xl">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"><Copy className="h-3.5 w-3.5 mr-1.5" /> Duplicate</Button>
                    <Button size="sm" variant="outline" disabled={role.system}><Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete</Button>
                  </div>
                </div>

                {isSuper && (
                  <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-semibold">Super Admin has unrestricted access</div>
                      <div className="text-muted-foreground text-xs mt-0.5">All permissions are always granted and cannot be reduced. To limit access, assign a different role.</div>
                    </div>
                  </div>
                )}
              </div>

              {groups.map((g) => {
                const total = g.permissions.reduce((s, p) => s + (p.actions ?? ["view"]).length, 0);
                const granted = g.permissions.reduce((s, p) => s + (matrix[selected][p.key]?.length ?? 0), 0);
                const allGranted = granted === total;
                return (
                  <div key={g.key} className="rounded-2xl border border-border bg-card shadow-card overflow-hidden min-w-0">
                    <div className="flex items-center justify-between gap-4 p-5 pb-4 flex-wrap">
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-2">
                          {g.label}
                          <span className="text-xs font-normal text-muted-foreground">· {granted}/{total} actions</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{g.description}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">Grant all in module</span>
                        <Switch checked={isSuper || allGranted} disabled={isSuper} onCheckedChange={(v) => toggleAllInGroup(g.key, v)} />
                      </div>
                    </div>
                    <div className="border-t border-border overflow-x-auto">
                      <table className="min-w-[760px] w-full text-sm">
                        <thead>
                          <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40">
                            <th className="px-5 py-2.5 font-medium">Permission</th>
                            {["view", "create", "edit", "delete", "approve", "export"].map((a) => (
                              <th key={a} className="px-3 py-2.5 font-medium text-center w-20">{ACTION_LABEL[a]}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {g.permissions.map((p) => {
                            const actions = p.actions ?? ["view"];
                            const grants = new Set(isSuper ? actions : matrix[selected][p.key] ?? []);
                            return (
                              <tr key={p.key} className="hover:bg-secondary/30">
                                <td className="px-5 py-3">
                                  <div className="font-medium">{p.label}</div>
                                  <div className="text-[11px] font-mono text-muted-foreground break-all">{p.key}</div>
                                </td>
                                {["view", "create", "edit", "delete", "approve", "export"].map((a) => {
                                  const available = actions.includes(a as "view");
                                  const checked = grants.has(a);
                                  return (
                                    <td key={a} className="px-3 py-3 text-center">
                                      {available ? (
                                        <Checkbox
                                          checked={checked}
                                          disabled={isSuper}
                                          onCheckedChange={() => toggleAction(p.key, a, actions)}
                                          aria-label={`${ACTION_LABEL[a]} ${p.label}`}
                                        />
                                      ) : (
                                        <span className="text-muted-foreground/40 text-xs">—</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {groups.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                  No permissions match "{query}".
                </div>
              )}
            </div>
          </div>
      </>
    </AdminShell>
  );
}


function MiniStat({ icon: Icon, label, value, hint }: { icon: React.ElementType; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

