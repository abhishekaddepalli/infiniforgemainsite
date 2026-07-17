import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Tables safe to export/import. auth.* is managed by Supabase — we back up
// public schema only. Order matters on restore (parents before children).
const BACKUP_TABLES = [
  "profiles",
  "user_roles",
  "categories",
  "products",
  "coupons",
  "orders",
  "payments",
  "subscriptions",
  "wallets",
  "wallet_transactions",
  "tickets",
  "ticket_replies",
  "module_records",
  "admin_audit_logs",
] as const;

type TableName = (typeof BACKUP_TABLES)[number];

async function ensureAdmin(context: { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

export const exportBackup = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const tables: Record<string, unknown[]> = {};
    const counts: Record<string, number> = {};
    for (const t of BACKUP_TABLES) {
      const { data, error } = await supabaseAdmin.from(t).select("*");
      if (error) throw new Error(`${t}: ${error.message}`);
      tables[t] = (data ?? []) as unknown[];
      counts[t] = (data ?? []).length;
    }
    const payload = {
      version: 1 as const,
      generated_at: new Date().toISOString(),
      generated_by: context.userId,
      counts,
      tables,
    };
    // Serialize as JSON string so TanStack RPC serializer doesn't choke on
    // dynamic Record<string, unknown[]> shape.
    return { json: JSON.stringify(payload), counts, generated_at: payload.generated_at };
  });

export const importBackup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { json: string; mode: "merge" | "replace" }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    let payload: { version: number; tables: Record<string, unknown[]> };
    try { payload = JSON.parse(data.json); } catch { throw new Error("Invalid JSON backup file"); }
    if (!payload || payload.version !== 1) throw new Error("Unsupported backup version");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const results: Record<string, { restored: number; skipped: number; error?: string }> = {};

    if (data.mode === "replace") {
      for (const t of [...BACKUP_TABLES].reverse()) {
        if (t === "profiles" || t === "user_roles") continue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabaseAdmin.from(t) as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");
      }
    }

    for (const t of BACKUP_TABLES) {
      const rows = (payload.tables?.[t] as Record<string, unknown>[] | undefined) ?? [];
      if (rows.length === 0) { results[t] = { restored: 0, skipped: 0 }; continue; }
      const chunkSize = 500;
      let restored = 0;
      let lastError: string | undefined;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error, count } = await (supabaseAdmin.from(t) as any).upsert(chunk, { onConflict: "id", count: "exact" });
        if (error) { lastError = error.message; break; }
        restored += count ?? chunk.length;
      }
      results[t] = { restored, skipped: rows.length - restored, error: lastError };
    }

    return { ok: true, results };
  });

export const listBackupTables = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    return { tables: BACKUP_TABLES as unknown as string[] };
  });
