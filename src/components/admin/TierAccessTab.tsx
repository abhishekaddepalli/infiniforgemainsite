import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listAccessibleResources, listTierAccessSelections } from "@/lib/memberships.functions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Package, Tags, LayoutDashboard, Search, Sparkles } from "lucide-react";

export type AccessSelection = { resource_type: string; resource_id: string };

const TYPES = [
  { key: "course", label: "Courses", icon: BookOpen, listKey: "courses", nameField: "title" },
  { key: "product", label: "Products", icon: Package, listKey: "products", nameField: "name" },
  { key: "category", label: "Categories", icon: Tags, listKey: "categories", nameField: "name" },
  { key: "portal_section", label: "Portal", icon: LayoutDashboard, listKey: "portal_sections", nameField: "name" },
] as const;

export function TierAccessTab({
  tierRank,
  value,
  onChange,
}: {
  tierRank: number;
  value: AccessSelection[];
  onChange: (v: AccessSelection[]) => void;
}) {
  const listRes = useServerFn(listAccessibleResources);
  const listSel = useServerFn(listTierAccessSelections);
  const [resources, setResources] = useState<any>({ courses: [], products: [], categories: [], portal_sections: [] });
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const [r, s] = await Promise.all([listRes(), listSel({ data: { tier_rank: tierRank } })]);
      setResources(r);
      // Seed selections from DB only if parent has none yet
      if (!value || value.length === 0) {
        onChange((s as any[]).map((row) => ({ resource_type: row.resource_type, resource_id: row.resource_id ?? "" })));
      }
      setLoaded(true);
    })().catch(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierRank]);

  const selectedSet = useMemo(
    () => new Set(value.map((s) => `${s.resource_type}::${s.resource_id}`)),
    [value],
  );

  function toggle(type: string, id: string) {
    const key = `${type}::${id}`;
    if (selectedSet.has(key)) onChange(value.filter((s) => `${s.resource_type}::${s.resource_id}` !== key));
    else onChange([...value, { resource_type: type, resource_id: id }]);
  }

  function toggleAll(type: string, ids: string[], select: boolean) {
    const others = value.filter((s) => s.resource_type !== type || !ids.includes(s.resource_id));
    onChange(select ? [...others, ...ids.map((id) => ({ resource_type: type, resource_id: id }))] : others);
  }

  const totalSelected = value.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">Content unlocked at this tier</span>
          <Badge variant="secondary">{totalSelected} selected</Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8 h-9 w-56" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="course">
        <TabsList className="grid grid-cols-4 w-full">
          {TYPES.map((t) => {
            const items = (resources[t.listKey] ?? []) as any[];
            const selCount = value.filter((v) => v.resource_type === t.key).length;
            const Icon = t.icon;
            return (
              <TabsTrigger key={t.key} value={t.key} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
                {selCount > 0 && (
                  <span className="ml-1 text-[10px] rounded-full bg-primary text-primary-foreground px-1.5 py-0.5">
                    {selCount}/{items.length}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TYPES.map((t) => {
          const items = ((resources[t.listKey] ?? []) as any[]).filter((it) => {
            const name = String(it[t.nameField] ?? it.name ?? "").toLowerCase();
            return !query || name.includes(query.toLowerCase());
          });
          const allSelected = items.length > 0 && items.every((it) => selectedSet.has(`${t.key}::${it.id}`));
          return (
            <TabsContent key={t.key} value={t.key} className="mt-3">
              <div className="rounded-xl border bg-card">
                <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
                  <div className="text-xs text-muted-foreground">
                    {loaded ? `${items.length} ${t.label.toLowerCase()}` : "Loading..."}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleAll(t.key, items.map((i) => i.id), !allSelected)}>
                      {allSelected ? "Clear all" : "Select all"}
                    </Button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y">
                  {items.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">Nothing to show.</div>
                  ) : items.map((it) => {
                    const key = `${t.key}::${it.id}`;
                    const checked = selectedSet.has(key);
                    return (
                      <label
                        key={it.id}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/40 ${checked ? "bg-primary/5" : ""}`}
                      >
                        <Checkbox checked={checked} onCheckedChange={() => toggle(t.key, it.id)} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{it[t.nameField] ?? it.name}</div>
                          {it.slug && <div className="text-xs text-muted-foreground truncate">{it.slug}</div>}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
      <p className="text-xs text-muted-foreground">
        Selected items require this tier's rank or higher. Categories gate every product/course tagged to them.
      </p>
    </div>
  );
}
