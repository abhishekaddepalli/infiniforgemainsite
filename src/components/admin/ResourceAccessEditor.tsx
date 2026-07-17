import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getResourceAccess, setResourceAccess, listTiers } from "@/lib/memberships.functions";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export function ResourceAccessEditor({
  resourceType,
  resourceId,
}: {
  resourceType: string;
  resourceId: string;
}) {
  const getRule = useServerFn(getResourceAccess);
  const setRule = useServerFn(setResourceAccess);
  const listT = useServerFn(listTiers);
  const [minRank, setMinRank] = useState(0);
  const [tiers, setTiers] = useState<Array<{ rank: number; name: string; slug: string }>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listT().then((r: any) => setTiers(r));
    if (resourceId) {
      getRule({ data: { resource_type: resourceType, resource_id: resourceId } })
        .then((r: any) => setMinRank(r.min_tier_rank ?? 0));
    }
  }, [resourceType, resourceId]);

  async function save() {
    setSaving(true);
    try {
      await setRule({ data: { resource_type: resourceType, resource_id: resourceId, min_tier_rank: minRank } });
      toast.success("Access updated");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-3 bg-secondary/30">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Lock className="h-4 w-4" /> Membership access
      </div>
      <div className="space-y-1.5">
        <Label>Minimum tier required</Label>
        <Select value={String(minRank)} onValueChange={(v) => setMinRank(Number(v))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {tiers.sort((a, b) => a.rank - b.rank).map((t) => (
              <SelectItem key={t.rank} value={String(t.rank)}>
                {t.name} (rank {t.rank}){t.rank === 0 ? " — everyone" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button size="sm" onClick={save} disabled={saving || !resourceId}>
        {saving ? "Saving..." : "Save access"}
      </Button>
    </div>
  );
}
