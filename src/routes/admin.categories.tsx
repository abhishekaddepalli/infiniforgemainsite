import { logAudit } from "@/lib/audit";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderTree, Plus, MoreHorizontal, ChevronRight, Trash2, Edit3 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({ meta: [{ title: "Categories — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Categories"><CategoriesPage /></AdminShell>,
});

type Category = { id: string; slug: string; name: string; description: string | null; icon: string | null; sort_order: number };

function CategoriesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Category> | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error; return data as Category[];
    },
  });

  const save = useMutation({
    mutationFn: async (c: Partial<Category>) => {
      const payload = { name: c.name!, slug: c.slug!, description: c.description ?? null, icon: c.icon ?? null, sort_order: Number(c.sort_order ?? 0) };
      if (c.id) {
        const { error } = await supabase.from("categories").update(payload).eq("id", c.id);
        if (error) throw error;
        await logAudit({ action: "update", resource: "categories", resource_id: c.id, details: { name: payload.name } });
      } else {
        const { data, error } = await supabase.from("categories").insert(payload).select("id").single();
        if (error) throw error;
        await logAudit({ action: "create", resource: "categories", resource_id: data?.id, details: { name: payload.name } });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); setEditing(null); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      await logAudit({ action: "delete", resource: "categories", resource_id: id });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-end sm:justify-between sm:flex-wrap sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">Dashboard</Link><ChevronRight className="h-3 w-3 shrink-0" /><span className="truncate">Categories</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2 truncate"><FolderTree className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" /> <span className="truncate">Categories</span></h1>
        </div>
        <Button size="sm" className="bg-gradient-brand text-white shrink-0" onClick={() => setEditing({ sort_order: categories.length + 1 })}><Plus className="h-3.5 w-3.5 sm:mr-1.5" /><span className="hidden sm:inline">New category</span></Button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border">
              <th className="px-5 py-3">Name</th>
              <th className="px-3 py-3">Slug</th>
              <th className="px-3 py-3">Icon</th>
              <th className="px-3 py-3">Sort</th>
              <th className="pl-3 pr-5 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && <tr><td colSpan={5} className="p-10 text-center text-muted-foreground">Loading…</td></tr>}
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-secondary/30">
                <td className="px-5 py-3"><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.description}</div></td>
                <td className="px-3 py-3 font-mono text-xs">/{c.slug}</td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{c.icon}</td>
                <td className="px-3 py-3 text-xs">{c.sort_order}</td>
                <td className="pl-3 pr-5 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><button className="h-8 w-8 rounded-md hover:bg-secondary flex items-center justify-center"><MoreHorizontal className="h-4 w-4" /></button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditing(c)}><Edit3 className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => confirm(`Delete "${c.name}"?`) && del.mutate(c.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {isLoading && <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground text-sm">Loading…</div>}
        {!isLoading && categories.length === 0 && <div className="rounded-2xl border border-border bg-card p-6 text-center text-muted-foreground text-sm">No categories yet.</div>}
        {categories.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <div className="font-semibold truncate">{c.name}</div>
                {c.description && <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{c.description}</div>}
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="font-mono">/{c.slug}</span>
                  {c.icon && <span>Icon: {c.icon}</span>}
                  <span>Sort: {c.sort_order}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => setEditing(c)}><Edit3 className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                <Button size="sm" variant="outline" className="h-8 px-2 text-destructive" onClick={() => confirm(`Delete "${c.name}"?`) && del.mutate(c.id)}><Trash2 className="h-3.5 w-3.5 mr-1" /> Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit category" : "New category"}</DialogTitle></DialogHeader>
          {editing && (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }}>
              <div><Label>Name</Label><Input required value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Slug</Label><Input required value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Icon (Lucide name)</Label><Input value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="mt-1.5" placeholder="Server" /></div>
              <div><Label>Description</Label><Textarea rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Sort order</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="mt-1.5" /></div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-brand text-white" disabled={save.isPending}>Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
