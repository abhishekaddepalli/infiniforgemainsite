import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Boxes, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/services")({
  head: () => ({ meta: [{ title: "Services — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Services"><Page /></AdminShell>,
});

type Product = {
  id: string; name: string; slug: string; price_inr: number; product_type: string;
  billing: string | null; status: string; category_id: string | null;
};
type Category = { id: string; name: string };

const SERVICE_TYPES = ["service", "saas", "hosting", "domain", "ssl", "amc", "monitoring"];

function Page() {
  const { data: products = [] } = useQuery({
    queryKey: ["services-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id,name,slug,price_inr,product_type,billing,status,category_id").in("product_type", SERVICE_TYPES).order("name");
      if (error) throw error; return data as Product[];
    },
  });
  const { data: cats = [] } = useQuery({
    queryKey: ["services-cats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("id,name");
      if (error) throw error; return data as Category[];
    },
  });
  const catMap = new Map(cats.map((c) => [c.id, c.name]));

  const grouped = SERVICE_TYPES.map((t) => ({ type: t, items: products.filter((p) => p.product_type === t) })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 truncate"><Boxes className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" /> <span className="truncate">Services catalog</span></h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">All recurring & professional services sold on the platform.</p>
        </div>
        <Button asChild size="sm" className="shrink-0"><Link to="/admin/products"><Plus className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">New service</span></Link></Button>
      </div>

      {grouped.length === 0 && <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No services yet. <Link to="/admin/products" className="text-primary underline">Add one</Link>.</div>}

      {grouped.map((g) => (
        <div key={g.type} className="glass rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground truncate">{g.type}</h3>
            <span className="text-xs text-muted-foreground shrink-0">{g.items.length} items</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((p) => (
              <Link key={p.id} to="/admin/products" className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">{p.category_id ? catMap.get(p.category_id) ?? "—" : "Uncategorised"}</div>
                  </div>
                  <span className={"inline-flex px-2 py-0.5 rounded text-[10px] font-medium shrink-0 " + (p.status === "active" ? "bg-emerald-500/15 text-emerald-600" : "bg-secondary text-muted-foreground")}>{p.status}</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                  <span className="text-lg font-bold">{formatINR(Number(p.price_inr))}</span>
                  {p.billing && <span className="text-xs text-muted-foreground">/ {p.billing}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
