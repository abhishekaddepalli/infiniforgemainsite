import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Receipt, Download, Search, FileText, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/download";
import { downloadInvoicePdf, getSavedTemplate, saveTemplate, getSavedLogo, saveLogo, type InvoiceOrder, type InvoiceTemplate } from "@/lib/invoice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export const Route = createFileRoute("/admin/invoices")({
  head: () => ({ meta: [{ title: "Invoices — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Invoices"><Page /></AdminShell>,
});

type Order = {
  id: string; order_number: string; customer_name: string | null; customer_email: string | null;
  product_name: string; amount_inr: number; gst_inr: number; total_inr: number;
  status: string; payment_method: string | null; created_at: string;
};

function downloadInvoice(o: Order) {
  const rows = [
    ["Invoice", o.order_number],
    ["Date", new Date(o.created_at).toLocaleDateString("en-IN")],
    ["Customer", o.customer_name ?? ""],
    ["Email", o.customer_email ?? ""],
    ["Item", o.product_name],
    ["Subtotal (INR)", String(o.amount_inr)],
    ["GST (INR)", String(o.gst_inr)],
    ["Total (INR)", String(o.total_inr)],
    ["Status", o.status],
    ["Payment", o.payment_method ?? ""],
  ];
  downloadCsv(rows, `${o.order_number}.csv`);
}

function exportAllInvoices(orders: Order[]) {
  const rows: (string | number)[][] = [
    ["Invoice #", "Date", "Customer", "Email", "Item", "Subtotal", "GST", "Total", "Status", "Payment"],
    ...orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleDateString("en-IN"),
      o.customer_name ?? "",
      o.customer_email ?? "",
      o.product_name,
      Number(o.amount_inr),
      Number(o.gst_inr),
      Number(o.total_inr),
      o.status,
      o.payment_method ?? "",
    ]),
  ];
  downloadCsv(rows, `infiniforge-invoices-${new Date().toISOString().slice(0, 10)}.csv`);
}

function Page() {
  const [q, setQ] = useState("");
  const [template, setTemplate] = useState<InvoiceTemplate>("modern");
  const [logo, setLogo] = useState("");
  useEffect(() => { setTemplate(getSavedTemplate()); setLogo(getSavedLogo()); }, []);
  const { data = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").in("status", ["paid", "refunded"]).order("created_at", { ascending: false });
      if (error) throw error; return data as Order[];
    },
  });
  const filtered = data.filter((o) => {
    if (!q) return true; const s = q.toLowerCase();
    return o.order_number.toLowerCase().includes(s) || (o.customer_email ?? "").toLowerCase().includes(s);
  });
  const gstTotal = data.reduce((a, o) => a + Number(o.gst_inr), 0);
  const revenue = data.filter((o) => o.status === "paid").reduce((a, o) => a + Number(o.total_inr), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Receipt className="h-6 w-6" /> GST Invoices</h2>
          <p className="text-sm text-muted-foreground mt-1">Revenue: <span className="font-semibold text-foreground">{formatINR(revenue)}</span> · GST collected: <span className="font-semibold text-foreground">{formatINR(gstTotal)}</span></p>
        </div>
        <Button variant="outline" onClick={() => exportAllInvoices(filtered)} disabled={filtered.length === 0}>
          <Download className="h-4 w-4 mr-2" /> Export {filtered.length} to CSV
        </Button>
      </div>
      <div className="glass rounded-2xl p-4 grid min-w-0 gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center">
        <div className="flex items-center gap-2 text-sm font-medium"><Palette className="h-4 w-4 text-primary" /> Invoice template</div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={template} onValueChange={(v) => { const t = v as InvoiceTemplate; setTemplate(t); saveTemplate(t); }}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern (Saffron)</SelectItem>
              <SelectItem value="classic">Classic (Navy)</SelectItem>
              <SelectItem value="minimal">Minimal (B&amp;W)</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Logo URL (optional, PNG)" value={logo} onChange={(e) => { setLogo(e.target.value); saveLogo(e.target.value); }} className="min-w-0 w-full max-w-md flex-1" />
        </div>
        <div className="text-xs text-muted-foreground">Saved for this browser</div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoice number or email" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground bg-secondary/50">
              <tr>
                <th className="text-left px-5 py-3">Invoice #</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Item</th>
                <th className="text-right px-5 py-3">Subtotal</th>
                <th className="text-right px-5 py-3">GST</th>
                <th className="text-right px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">Loading…</td></tr>}
              {!isLoading && filtered.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">No invoices yet. <Link to="/admin/orders" className="text-primary underline">Create an order</Link>.</td></tr>}
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-5 py-3 font-mono text-xs">{o.order_number}</td>
                  <td className="px-5 py-3">{o.customer_name ?? "—"}<div className="text-xs text-muted-foreground">{o.customer_email}</div></td>
                  <td className="px-5 py-3">{o.product_name}</td>
                  <td className="px-5 py-3 text-right">{formatINR(Number(o.amount_inr))}</td>
                  <td className="px-5 py-3 text-right">{formatINR(Number(o.gst_inr))}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatINR(Number(o.total_inr))}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => downloadInvoicePdf(o as unknown as InvoiceOrder)}><FileText className="h-3.5 w-3.5 mr-1" /> PDF</Button>
                      <Button size="sm" variant="ghost" onClick={() => downloadInvoice(o)}><Download className="h-3.5 w-3.5 mr-1" /> CSV</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
