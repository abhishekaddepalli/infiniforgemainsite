import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Wrench, ChevronRight, Plus, Trash2, Save, Building2, Flag, GitBranch, Clock, Loader2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { logAudit } from "@/lib/audit";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/ticket-workflows")({
  head: () => ({ meta: [{ title: "Ticket Workflows — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Ticket Workflows" requiredRoles={["super_admin", "admin"]}><Page /></AdminShell>,
});

type Dept = { id: string; slug: string; name: string; description: string | null; default_assignee: string | null; email: string | null; active: boolean; sort_order: number };
type Prio = { id: string; slug: string; name: string; color: string; sla_response_mins: number; sla_resolve_mins: number; sort_order: number; active: boolean };
type Rule = { id: string; name: string; match_department: string | null; match_priority: string | null; match_keyword: string | null; assign_to: string | null; set_priority: string | null; set_status: string | null; active: boolean; sort_order: number };

const STATUSES = ["open", "in_progress", "waiting", "resolved", "closed"];

function Page() {
  return (
    <>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/admin" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/admin/tickets" className="hover:text-foreground">Tickets</Link>
        <ChevronRight className="h-3 w-3" />
        <span>Workflows</span>
      </div>

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Wrench className="h-6 w-6 text-primary" /> Ticket Workflows
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Configure departments, priorities, SLA targets, and auto-routing rules used across the admin and customer portals.</p>
      </div>

      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList className="grid grid-cols-3 max-w-xl">
          <TabsTrigger value="departments"><Building2 className="h-4 w-4 mr-1.5" /> Departments</TabsTrigger>
          <TabsTrigger value="priorities"><Flag className="h-4 w-4 mr-1.5" /> Priorities & SLA</TabsTrigger>
          <TabsTrigger value="routing"><GitBranch className="h-4 w-4 mr-1.5" /> Routing</TabsTrigger>
        </TabsList>
        <TabsContent value="departments"><DepartmentsTab /></TabsContent>
        <TabsContent value="priorities"><PrioritiesTab /></TabsContent>
        <TabsContent value="routing"><RoutingTab /></TabsContent>
      </Tabs>
    </>
  );
}

function useStaffOptions() {
  return useQuery({
    queryKey: ["ticket-workflow-staff"],
    queryFn: async () => {
      const { data: rs } = await supabase.from("user_roles").select("user_id, role")
        .in("role", ["super_admin", "admin", "sales_manager", "support", "finance", "employee"]);
      const ids = [...new Set((rs ?? []).map((r) => r.user_id))];
      if (!ids.length) return [] as { id: string; label: string }[];
      const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
      return (data ?? []).map((p) => ({ id: p.id, label: p.full_name ?? p.email ?? p.id }));
    },
  });
}

/* ------------------------------ Departments ------------------------------- */
function DepartmentsTab() {
  const qc = useQueryClient();
  const { data: staff = [] } = useStaffOptions();
  const { data = [], isLoading } = useQuery({
    queryKey: ["ticket_departments"],
    queryFn: async () => (await supabase.from("ticket_departments").select("*").order("sort_order")).data as Dept[] ?? [],
  });

  const save = useMutation({
    mutationFn: async (d: Partial<Dept> & { id?: string }) => {
      if (d.id) {
        const { id, ...rest } = d;
        const { error } = await supabase.from("ticket_departments").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw error;
        await logAudit({ action: "update", resource: "ticket_departments", resource_id: id });
      } else {
        const { error, data: ins } = await supabase.from("ticket_departments").insert(d as Dept).select("id").single();
        if (error) throw error;
        await logAudit({ action: "create", resource: "ticket_departments", resource_id: ins?.id });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ticket_departments"] }); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ticket_departments").delete().eq("id", id);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "ticket_departments", resource_id: id });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ticket_departments"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Plus className="h-4 w-4" /> Add department</h3>
        <NewDepartment onSave={(d) => save.mutate(d)} staff={staff} pending={save.isPending} />
      </div>

      {isLoading && <div className="text-center text-sm text-muted-foreground p-6">Loading…</div>}
      {data.map((d) => (
        <DepartmentRow key={d.id} dept={d} staff={staff} onSave={(patch) => save.mutate({ id: d.id, ...patch })} onDelete={() => del.mutate(d.id)} />
      ))}
    </div>
  );
}

function NewDepartment({ onSave, staff, pending }: { onSave: (d: Partial<Dept>) => void; staff: { id: string; label: string }[]; pending: boolean }) {
  const [f, setF] = useState({ slug: "", name: "", description: "", default_assignee: "", email: "", sort_order: 0 });
  return (
    <div className="grid gap-3 md:grid-cols-6">
      <Input placeholder="slug (e.g. billing)" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
      <Input placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <Input placeholder="Notification email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <Select value={f.default_assignee || "none"} onValueChange={(v) => setF({ ...f, default_assignee: v === "none" ? "" : v })}>
        <SelectTrigger><SelectValue placeholder="Default agent" /></SelectTrigger>
        <SelectContent><SelectItem value="none">— none —</SelectItem>{staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
      </Select>
      <Input placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
      <Button disabled={pending || !f.slug || !f.name} onClick={() => {
        onSave({ slug: f.slug, name: f.name, description: f.description || null, email: f.email || null, default_assignee: f.default_assignee || null, active: true, sort_order: f.sort_order });
        setF({ slug: "", name: "", description: "", default_assignee: "", email: "", sort_order: 0 });
      }} className="bg-gradient-brand text-white">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" /> Add</>}
      </Button>
    </div>
  );
}

function DepartmentRow({ dept, staff, onSave, onDelete }: { dept: Dept; staff: { id: string; label: string }[]; onSave: (p: Partial<Dept>) => void; onDelete: () => void }) {
  const [f, setF] = useState(dept);
  return (
    <div className="rounded-2xl border border-border bg-card p-4 grid gap-3 md:grid-cols-6 items-end">
      <div><Label className="text-xs">Slug</Label><Input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /></div>
      <div><Label className="text-xs">Name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div><Label className="text-xs">Email</Label><Input value={f.email ?? ""} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <div><Label className="text-xs">Default agent</Label>
        <Select value={f.default_assignee ?? "none"} onValueChange={(v) => setF({ ...f, default_assignee: v === "none" ? null : v })}>
          <SelectTrigger><SelectValue placeholder="— none —" /></SelectTrigger>
          <SelectContent><SelectItem value="none">— none —</SelectItem>{staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1"><Label className="text-xs">Active</Label>
          <Switch checked={f.active} onCheckedChange={(v) => setF({ ...f, active: v })} /></div>
        <div className="flex-1"><Label className="text-xs">Sort</Label><Input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) || 0 })} /></div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(f)} className="flex-1 bg-gradient-brand text-white"><Save className="h-3.5 w-3.5 mr-1" /> Save</Button>
        <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
      </div>
    </div>
  );
}

/* ------------------------------ Priorities -------------------------------- */
function PrioritiesTab() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["ticket_priorities"],
    queryFn: async () => (await supabase.from("ticket_priorities").select("*").order("sort_order")).data as Prio[] ?? [],
  });

  const save = useMutation({
    mutationFn: async (d: Partial<Prio> & { id?: string }) => {
      if (d.id) {
        const { id, ...rest } = d;
        const { error } = await supabase.from("ticket_priorities").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ticket_priorities").insert(d as Prio);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ticket_priorities"] }); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("ticket_priorities").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ticket_priorities"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Clock className="h-4 w-4" /> SLA is measured in minutes</h3>
        <p className="text-xs text-muted-foreground mb-4">Response = target time until first staff reply. Resolve = target time until the ticket is marked resolved/closed. When a ticket is created, its SLA due-at is auto-computed from the resolve target.</p>
        <NewPriority onSave={(d) => save.mutate(d)} pending={save.isPending} />
      </div>
      {isLoading && <div className="text-center text-sm text-muted-foreground p-6">Loading…</div>}
      {data.map((p) => <PriorityRow key={p.id} p={p} onSave={(patch) => save.mutate({ id: p.id, ...patch })} onDelete={() => del.mutate(p.id)} />)}
    </div>
  );
}

function NewPriority({ onSave, pending }: { onSave: (d: Partial<Prio>) => void; pending: boolean }) {
  const [f, setF] = useState({ slug: "", name: "", color: "#3b82f6", sla_response_mins: 240, sla_resolve_mins: 1440, sort_order: 0 });
  return (
    <div className="grid gap-3 md:grid-cols-7">
      <Input placeholder="slug" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value.toLowerCase() })} />
      <Input placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <Input type="color" value={f.color} onChange={(e) => setF({ ...f, color: e.target.value })} className="h-10 p-1" />
      <Input type="number" placeholder="Response mins" value={f.sla_response_mins} onChange={(e) => setF({ ...f, sla_response_mins: Number(e.target.value) || 0 })} />
      <Input type="number" placeholder="Resolve mins" value={f.sla_resolve_mins} onChange={(e) => setF({ ...f, sla_resolve_mins: Number(e.target.value) || 0 })} />
      <Input type="number" placeholder="Sort" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) || 0 })} />
      <Button disabled={pending || !f.slug || !f.name} onClick={() => { onSave({ ...f, active: true }); setF({ slug: "", name: "", color: "#3b82f6", sla_response_mins: 240, sla_resolve_mins: 1440, sort_order: 0 }); }} className="bg-gradient-brand text-white">
        <Plus className="h-4 w-4 mr-1" /> Add
      </Button>
    </div>
  );
}

function PriorityRow({ p, onSave, onDelete }: { p: Prio; onSave: (patch: Partial<Prio>) => void; onDelete: () => void }) {
  const [f, setF] = useState(p);
  return (
    <div className="rounded-2xl border border-border bg-card p-4 grid gap-3 md:grid-cols-8 items-end">
      <div className="flex items-center gap-2 col-span-2">
        <span className="h-8 w-8 rounded-lg shrink-0" style={{ background: f.color }} />
        <div className="flex-1"><Label className="text-xs">Name / slug</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      </div>
      <div><Label className="text-xs">Slug</Label><Input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /></div>
      <div><Label className="text-xs">Color</Label><Input type="color" value={f.color} onChange={(e) => setF({ ...f, color: e.target.value })} className="p-1" /></div>
      <div><Label className="text-xs">Response mins</Label><Input type="number" value={f.sla_response_mins} onChange={(e) => setF({ ...f, sla_response_mins: Number(e.target.value) || 0 })} /></div>
      <div><Label className="text-xs">Resolve mins</Label><Input type="number" value={f.sla_resolve_mins} onChange={(e) => setF({ ...f, sla_resolve_mins: Number(e.target.value) || 0 })} /></div>
      <div className="flex items-center gap-2"><Switch checked={f.active} onCheckedChange={(v) => setF({ ...f, active: v })} /><span className="text-xs">Active</span></div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(f)} className="flex-1 bg-gradient-brand text-white"><Save className="h-3.5 w-3.5 mr-1" /> Save</Button>
        <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
      </div>
    </div>
  );
}

/* -------------------------------- Routing --------------------------------- */
function RoutingTab() {
  const qc = useQueryClient();
  const { data: staff = [] } = useStaffOptions();
  const { data: depts = [] } = useQuery({ queryKey: ["ticket_departments"], queryFn: async () => (await supabase.from("ticket_departments").select("*").order("sort_order")).data as Dept[] ?? [] });
  const { data: prios = [] } = useQuery({ queryKey: ["ticket_priorities"], queryFn: async () => (await supabase.from("ticket_priorities").select("*").order("sort_order")).data as Prio[] ?? [] });
  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["ticket_routing_rules"],
    queryFn: async () => (await supabase.from("ticket_routing_rules").select("*").order("sort_order")).data as Rule[] ?? [],
  });

  const save = useMutation({
    mutationFn: async (d: Partial<Rule> & { id?: string }) => {
      if (d.id) {
        const { id, ...rest } = d;
        const { error } = await supabase.from("ticket_routing_rules").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id); if (error) throw error;
      } else { const { error } = await supabase.from("ticket_routing_rules").insert(d as Rule); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ticket_routing_rules"] }); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("ticket_routing_rules").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ticket_routing_rules"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><GitBranch className="h-4 w-4" /> Auto-routing rules</h3>
        <p className="text-xs text-muted-foreground mb-4">Applied on ticket creation, in order. First matching rule wins. Leave a match empty to skip that condition. Use “Set …” fields to override the incoming values.</p>
        <NewRule onSave={(d) => save.mutate(d)} depts={depts} prios={prios} staff={staff} pending={save.isPending} />
      </div>

      {isLoading && <div className="text-center text-sm text-muted-foreground p-6">Loading…</div>}
      {rules.map((r) => (
        <RuleRow key={r.id} rule={r} depts={depts} prios={prios} staff={staff} onSave={(patch) => save.mutate({ id: r.id, ...patch })} onDelete={() => del.mutate(r.id)} />
      ))}
    </div>
  );
}

function NewRule({ onSave, depts, prios, staff, pending }: { onSave: (d: Partial<Rule>) => void; depts: Dept[]; prios: Prio[]; staff: { id: string; label: string }[]; pending: boolean }) {
  const empty: Partial<Rule> = { name: "", match_department: null, match_priority: null, match_keyword: null, assign_to: null, set_priority: null, set_status: null, active: true, sort_order: 0 };
  const [f, setF] = useState<Partial<Rule>>(empty);
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Input placeholder="Rule name" value={f.name ?? ""} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <PickerSelect label="Match dept" value={f.match_department} onChange={(v) => setF({ ...f, match_department: v })} options={depts.map((d) => ({ v: d.slug, l: d.name }))} />
      <PickerSelect label="Match priority" value={f.match_priority} onChange={(v) => setF({ ...f, match_priority: v })} options={prios.map((p) => ({ v: p.slug, l: p.name }))} />
      <Input placeholder="Match keyword" value={f.match_keyword ?? ""} onChange={(e) => setF({ ...f, match_keyword: e.target.value })} />
      <PickerSelect label="Assign to" value={f.assign_to} onChange={(v) => setF({ ...f, assign_to: v })} options={staff.map((s) => ({ v: s.id, l: s.label }))} />
      <PickerSelect label="Set priority" value={f.set_priority} onChange={(v) => setF({ ...f, set_priority: v })} options={prios.map((p) => ({ v: p.slug, l: p.name }))} />
      <PickerSelect label="Set status" value={f.set_status} onChange={(v) => setF({ ...f, set_status: v })} options={STATUSES.map((s) => ({ v: s, l: s.replace("_", " ") }))} />
      <Button disabled={pending || !f.name} onClick={() => { onSave(f); setF(empty); }} className="bg-gradient-brand text-white"><Plus className="h-4 w-4 mr-1" /> Add rule</Button>
    </div>
  );
}

function RuleRow({ rule, depts, prios, staff, onSave, onDelete }: { rule: Rule; depts: Dept[]; prios: Prio[]; staff: { id: string; label: string }[]; onSave: (p: Partial<Rule>) => void; onDelete: () => void }) {
  const [f, setF] = useState<Rule>(rule);
  return (
    <div className="rounded-2xl border border-border bg-card p-4 grid gap-3 md:grid-cols-5 items-end">
      <div className="md:col-span-2"><Label className="text-xs">Name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <PickerSelect label="Match dept" value={f.match_department} onChange={(v) => setF({ ...f, match_department: v })} options={depts.map((d) => ({ v: d.slug, l: d.name }))} />
      <PickerSelect label="Match priority" value={f.match_priority} onChange={(v) => setF({ ...f, match_priority: v })} options={prios.map((p) => ({ v: p.slug, l: p.name }))} />
      <div><Label className="text-xs">Match keyword</Label><Input value={f.match_keyword ?? ""} onChange={(e) => setF({ ...f, match_keyword: e.target.value })} /></div>
      <PickerSelect label="Assign to" value={f.assign_to} onChange={(v) => setF({ ...f, assign_to: v })} options={staff.map((s) => ({ v: s.id, l: s.label }))} />
      <PickerSelect label="Set priority" value={f.set_priority} onChange={(v) => setF({ ...f, set_priority: v })} options={prios.map((p) => ({ v: p.slug, l: p.name }))} />
      <PickerSelect label="Set status" value={f.set_status} onChange={(v) => setF({ ...f, set_status: v })} options={STATUSES.map((s) => ({ v: s, l: s.replace("_", " ") }))} />
      <div><Label className="text-xs">Sort</Label><Input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) || 0 })} /></div>
      <div className="flex items-center gap-2"><Switch checked={f.active} onCheckedChange={(v) => setF({ ...f, active: v })} /><span className="text-xs">Active</span></div>
      <div className="flex gap-2 md:col-span-5">
        <Button size="sm" onClick={() => onSave(f)} className="bg-gradient-brand text-white"><Save className="h-3.5 w-3.5 mr-1" /> Save</Button>
        <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-destructive mr-1" /> Delete</Button>
      </div>
    </div>
  );
}

function PickerSelect({ label, value, onChange, options }: { label: string; value: string | null | undefined; onChange: (v: string | null) => void; options: { v: string; l: string }[] }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={value ?? "any"} onValueChange={(v) => onChange(v === "any" ? null : v)}>
        <SelectTrigger><SelectValue placeholder="— any —" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="any">— any —</SelectItem>
          {options.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
