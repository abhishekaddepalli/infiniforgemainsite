import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronRight, ScrollText, Search, RefreshCw } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type Log = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  target_user_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
};

const ACTION_TONE: Record<string, string> = {
  create: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  update: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  delete: "bg-red-500/10 text-red-700 dark:text-red-300",
  "role.assign": "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  "status.change": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export const Route = createFileRoute("/admin/audit-logs")({
  component: () => <AdminShell title="Audit logs" requiredRoles={["super_admin", "admin"]}><AuditPage /></AdminShell>,
});

function AuditPage() {
  const [query, setQuery] = useState("");
  const [resource, setResource] = useState<string>("all");
  const [action, setAction] = useState<string>("all");

  const { data = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-audit-logs", resource, action],
    queryFn: async () => {
      let q = supabase.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(500);
      if (resource !== "all") q = q.eq("resource_type", resource);
      if (action !== "all") q = q.eq("action", action);
      const { data, error } = await q;
      if (error) throw error;
      return data as Log[];
    },
  });

  const filtered = data.filter((l) => {
    if (!query) return true;
    const s = query.toLowerCase();
    return (
      (l.actor_email ?? "").toLowerCase().includes(s) ||
      (l.resource_id ?? "").toLowerCase().includes(s) ||
      JSON.stringify(l.details).toLowerCase().includes(s)
    );
  });

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-3 w-3" /><span>Audit logs</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2">
            <ScrollText className="h-6 w-6 text-primary" /> Audit logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every admin change to users, products, orders, and roles — showing the {filtered.length} most recent of {data.length} entries.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={"h-3.5 w-3.5 mr-1.5 " + (isFetching ? "animate-spin" : "")} /> Refresh
        </Button>
      </div>

      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search actor email, resource id, or details" className="pl-9 h-9 bg-secondary border-transparent" />
        </div>
        <Select value={resource} onValueChange={setResource}>
          <SelectTrigger className="h-9 w-[160px] bg-secondary border-transparent"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All resources</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="products">Products</SelectItem>
            <SelectItem value="categories">Categories</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
            <SelectItem value="coupons">Coupons</SelectItem>
            <SelectItem value="tickets">Tickets</SelectItem>
            <SelectItem value="roles">Roles</SelectItem>
          </SelectContent>
        </Select>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="h-9 w-[160px] bg-secondary border-transparent"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="role.assign">Role assign</SelectItem>
            <SelectItem value="status.change">Status change</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">Loading audit trail…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">No entries match these filters.</TableCell></TableRow>
            ) : (
              filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{l.actor_email ?? l.actor_id?.slice(0, 8) ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={ACTION_TONE[l.action] ?? ""}>{l.action}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="font-medium capitalize">{l.resource_type}</div>
                    {l.resource_id && <div className="text-[11px] text-muted-foreground font-mono">{l.resource_id.slice(0, 8)}…</div>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[380px] truncate font-mono">
                    {Object.keys(l.details ?? {}).length ? JSON.stringify(l.details) : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
