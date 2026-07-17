import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Upload, DatabaseBackup, ShieldCheck, HardDriveDownload, HardDriveUpload, Loader2, CheckCircle2, AlertTriangle, FileJson } from "lucide-react";
import { toast } from "sonner";
import { exportBackup, importBackup } from "@/lib/admin-backup.functions";
import { downloadBlob } from "@/lib/download";
import { formatBytes } from "@/lib/image-optimizer";
import { logAudit } from "@/lib/audit";

export const Route = createFileRoute("/admin/backup")({
  head: () => ({ meta: [{ title: "Backup & Restore — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Backup & Restore"><BackupPage /></AdminShell>,
});

function BackupPage() {
  const doExport = useServerFn(exportBackup);
  const doImport = useServerFn(importBackup);

  const [exportProgress, setExportProgress] = useState(0);
  const [lastExport, setLastExport] = useState<{ at: string; size: number; counts: Record<string, number> } | null>(null);
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<Record<string, { restored: number; skipped: number; error?: string }> | null>(null);

  const exportMut = useMutation({
    mutationFn: async () => {
      setExportProgress(15);
      const res = await doExport();
      setExportProgress(70);
      const blob = new Blob([res.json], { type: "application/json" });
      const filename = `infiniforge-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
      downloadBlob(blob, filename);
      setExportProgress(100);
      await logAudit({ action: "backup_export", resource: "system", details: { size: blob.size, counts: res.counts } });
      setLastExport({ at: res.generated_at, size: blob.size, counts: res.counts });
      return res;
    },
    onSuccess: () => toast.success("Backup downloaded"),
    onError: (e: Error) => toast.error(e.message),
    onSettled: () => setTimeout(() => setExportProgress(0), 1200),
  });

  const importMut = useMutation({
    mutationFn: async () => {
      if (!importFile) throw new Error("Choose a backup file first");
      setImportProgress(20);
      const json = await importFile.text();
      setImportProgress(40);
      const res = await doImport({ data: { json, mode: importMode } });
      setImportProgress(100);
      await logAudit({ action: "backup_import", resource: "system", details: { mode: importMode, results: res.results } });
      setImportResults(res.results);
      return res;
    },
    onSuccess: () => toast.success("Backup restored"),
    onError: (e: Error) => toast.error(e.message),
    onSettled: () => setTimeout(() => setImportProgress(0), 1200),
  });

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-6 border">
        <div className="h-14 w-14 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0">
          <DatabaseBackup className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight">Database & Application Backup</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            One-click export of every application table — users, products, orders, wallets, tickets, CMS, licenses, hosting & more. Store the JSON file offsite and restore in seconds if anything goes wrong.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Encrypted at rest</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* EXPORT */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <HardDriveDownload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Export full backup</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Downloads a single portable JSON file</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Users, roles & profiles</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Products, categories & coupons</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Orders, invoices, payments & wallets</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Licenses, hosting, tickets & CRM</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Audit logs & module records</li>
            </ul>
            {exportMut.isPending || exportProgress > 0 ? (
              <div className="space-y-1.5">
                <Progress value={exportProgress} className="h-2" />
                <p className="text-xs text-muted-foreground tabular-nums">Building snapshot… {exportProgress}%</p>
              </div>
            ) : null}
            <Button className="w-full bg-gradient-brand text-white" onClick={() => exportMut.mutate()} disabled={exportMut.isPending}>
              {exportMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              {exportMut.isPending ? "Preparing backup…" : "Download backup now"}
            </Button>
            {lastExport && (
              <div className="rounded-xl border bg-secondary/40 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5"><FileJson className="h-3.5 w-3.5" /> Last snapshot</span>
                  <span className="text-muted-foreground">{new Date(lastExport.at).toLocaleString()}</span>
                </div>
                <div className="text-muted-foreground">{formatBytes(lastExport.size)} · {Object.values(lastExport.counts).reduce((a, b) => a + b, 0)} rows across {Object.keys(lastExport.counts).length} tables</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* IMPORT */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-accent/10 to-transparent border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <HardDriveUpload className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Restore from backup</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Upload a previously exported backup JSON</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <div className="text-sm font-medium">{importFile ? importFile.name : "Click to choose backup file"}</div>
              <div className="text-xs text-muted-foreground mt-1">{importFile ? formatBytes(importFile.size) : "JSON files only"}</div>
              <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { setImportResults(null); setImportFile(e.target.files?.[0] ?? null); }} />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setImportMode("merge")} className={`rounded-xl border p-3 text-left text-sm transition-all ${importMode === "merge" ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}>
                <div className="font-semibold flex items-center gap-1.5">Merge {importMode === "merge" && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Upsert rows — keep newer data</div>
              </button>
              <button type="button" onClick={() => setImportMode("replace")} className={`rounded-xl border p-3 text-left text-sm transition-all ${importMode === "replace" ? "border-destructive bg-destructive/5" : "hover:border-destructive/40"}`}>
                <div className="font-semibold flex items-center gap-1.5">Replace {importMode === "replace" && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Wipe & restore (keeps admin users)</div>
              </button>
            </div>

            {importMode === "replace" && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                Replace mode deletes existing rows in every table before restoring. Only do this on a fresh environment or after taking a fresh export.
              </div>
            )}

            {(importMut.isPending || importProgress > 0) && (
              <div className="space-y-1.5">
                <Progress value={importProgress} className="h-2" />
                <p className="text-xs text-muted-foreground tabular-nums">Restoring data… {importProgress}%</p>
              </div>
            )}

            <Button className="w-full" variant={importMode === "replace" ? "destructive" : "default"} disabled={!importFile || importMut.isPending} onClick={() => importMut.mutate()}>
              {importMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              {importMut.isPending ? "Restoring…" : `Restore (${importMode})`}
            </Button>

            {importResults && (
              <div className="rounded-xl border bg-secondary/40 divide-y">
                <div className="p-2.5 text-xs font-semibold flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Restore complete</div>
                <div className="p-2.5 space-y-1 text-xs max-h-52 overflow-y-auto">
                  {Object.entries(importResults).map(([table, r]) => (
                    <div key={table} className="flex items-center justify-between">
                      <span className="font-mono text-muted-foreground">{table}</span>
                      <span className={r.error ? "text-destructive" : "text-primary tabular-nums"}>
                        {r.error ? r.error : `${r.restored} restored`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
