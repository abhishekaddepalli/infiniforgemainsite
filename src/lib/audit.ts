import { supabase } from "@/integrations/supabase/client";
import { notifyAuditEvent } from "@/lib/alerts.functions";

export type AuditAction =
  | "view" | "create" | "update" | "delete"
  | "role.assign" | "role.remove" | "status.change" | "export"
  | "password.reset" | "invite"
  | "backup_export" | "backup_import";

export type AuditResource =
  | "users" | "products" | "categories" | "orders" | "roles"
  | "coupons" | "tickets" | "ticket_departments" | "ticket_priorities" | "ticket_routing_rules"
  | "subscription" | "wallet" | "settings" | "site_content" | "site_cms"
  | "system";

export interface AuditEntry {
  action: AuditAction;
  resource: AuditResource;
  resource_id?: string | null;
  target_user_id?: string | null;
  details?: Record<string, unknown>;
}

/**
 * Fire-and-forget audit logger. Never throws — logging must not break UX.
 * Records who (auth.uid + email), what, on which resource.
 */
export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("admin_audit_logs").insert({
      actor_id: user.id,
      actor_email: user.email ?? null,
      action: entry.action,
      resource_type: entry.resource,
      resource_id: entry.resource_id ?? null,
      target_user_id: entry.target_user_id ?? null,
      details: (entry.details ?? {}) as never,
    });
    void notifyAuditEvent({ data: entry }).catch(() => undefined);
  } catch {
    /* swallow – audit failures must not disrupt admin flow */
  }
}
