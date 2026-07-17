import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { MessageCircle, RefreshCw, ExternalLink } from "lucide-react";
import { playAlertTone } from "@/lib/alert-sound";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatINR } from "@/lib/catalog";
import { toast } from "sonner";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { logAudit } from "@/lib/audit";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/whatsapp-orders")({
  head: () => ({ meta: [{ title: "WhatsApp Orders — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: WhatsAppOrders,
});

const STATUSES = ["pending", "contacted", "confirmed", "paid", "fulfilled", "cancelled"] as const;
type Status = typeof STATUSES[number];

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-500",
  contacted: "bg-blue-500/15 text-blue-500",
  confirmed: "bg-primary/15 text-primary",
  paid: "bg-accent/15 text-accent",
  fulfilled: "bg-emerald-500/15 text-emerald-500",
  cancelled: "bg-destructive/15 text-destructive",
};

function WhatsAppOrders() {
  const qc = useQueryClient();
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["whatsapp_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_records")
        .select("*")
        .eq("module", "whatsapp_orders")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Live updates: refresh table + play tone when a new WA order arrives.
  useEffect(() => {
    const channel = supabase
      .channel("wa-orders-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "module_records", filter: "module=eq.whatsapp_orders" },
        (payload) => {
          qc.invalidateQueries({ queryKey: ["whatsapp_orders"] });
          if (payload.eventType === "INSERT") {
            playAlertTone();
            toast.success("New WhatsApp order received");
          }
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);


  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("module_records").update({ status }).eq("id", id);
      if (error) throw error;
      await logAudit({ action: "status.change", resource: "orders", resource_id: id, details: { module: "whatsapp_orders", status } });
    },
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["whatsapp_orders"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const rows = data ?? [];
  const stats = STATUSES.map((s) => ({ s, n: rows.filter((r) => r.status === s).length }));

  return (
    <AdminShell title="WhatsApp Orders">
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">WhatsApp Orders</h1>
              <p className="text-sm text-muted-foreground">Every click on an "Order on WhatsApp" button is logged here.</p>
            </div>
          </div>
        </div>
        <Button variant="outline" disabled={isFetching} onClick={async () => { await refetch(); toast.success("Refreshed"); }}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-6">
        {stats.map((x) => (
          <div key={x.s} className="glass rounded-xl p-4">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{x.s}</div>
            <div className="text-2xl font-bold mt-1">{x.n}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden min-w-0">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Ref / Created</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Surface</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {isFetching && rows.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {!isFetching && rows.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No WhatsApp orders yet.</td></tr>
              )}
              {rows.map((r) => {
                const m = (r.metadata ?? {}) as Record<string, unknown>;
                const items = Array.isArray(m.items) ? (m.items as Array<{ name: string; qty?: number }>) : [];
                const phone = (m.customer_phone as string) ?? "";
                const name = (m.customer_name as string) ?? "";
                const ref = (m.reference as string) ?? r.id.slice(0, 8);
                const surface = (m.surface as string) ?? "—";
                const number = (m.business_number as string) ?? "";
                const message = (m.message as string) ?? "";
                return (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="px-4 py-3 align-top">
                      <div className="font-mono text-xs break-all">{ref}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {new Date(r.created_at).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top max-w-xs">
                      <div className="font-medium break-words">{r.title}</div>
                      {items.length > 0 && (
                        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                          {items.slice(0, 4).map((it, i) => (
                            <li key={i}>· {it.name} × {it.qty ?? 1}</li>
                          ))}
                          {items.length > 4 && <li>+ {items.length - 4} more</li>}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div>{name || <span className="text-muted-foreground">Guest</span>}</div>
                      {phone && <div className="text-xs text-muted-foreground">{phone}</div>}
                    </td>
                    <td className="px-4 py-3 align-top font-medium">
                      {r.amount_inr != null ? formatINR(Number(r.amount_inr)) : "—"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Badge variant="outline" className="text-[10px]">{surface}</Badge>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-2">
                        <Badge className={`w-fit ${statusColor[r.status] ?? ""}`}>{r.status}</Badge>
                        <Select
                          value={r.status}
                          onValueChange={(v) => updateStatus.mutate({ id: r.id, status: v as Status })}
                        >
                          <SelectTrigger className="h-7 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {number && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={buildWhatsAppLink(number, message)} target="_blank" rel="noopener noreferrer">
                            Reopen <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminShell>
  );
}
