import { createServerFn } from "@tanstack/react-start";
import {
  getRequestUser,
  loadAlertSettings,
  requireStaffFromRequest,
  safeDispatchAlert,
  saveAlertSettings,
} from "./alerts.server";
import { normalizePlatformAlertSettings, type PlatformAlertSettings } from "./alert-settings";
import type { AuditEntry } from "./audit";

export const getPlatformAlertSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await requireStaffFromRequest(supabaseAdmin);
    return loadAlertSettings(supabaseAdmin);
  });

export const savePlatformAlertSettings = createServerFn({ method: "POST" })
  .validator((input: Partial<PlatformAlertSettings>) => normalizePlatformAlertSettings(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { isAdmin } = await requireStaffFromRequest(supabaseAdmin);
    if (!isAdmin) throw new Error("Only admins can save alert settings.");
    return saveAlertSettings(supabaseAdmin, data);
  });

export const recordLoginAlert = createServerFn({ method: "POST" })
  .validator((input?: { at?: string }) => input ?? {})
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const user = await getRequestUser(supabaseAdmin);
    const { data: profile } = await supabaseAdmin.from("profiles").select("full_name,email,phone").eq("id", user.id).maybeSingle();
    const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", user.id);
    const roleLabel = (roles ?? []).map((r) => r.role).join(", ") || "customer";
    await safeDispatchAlert(supabaseAdmin, {
      kind: "login",
      title: `Login detected · ${profile?.full_name ?? user.email ?? "User"}`,
      body: `${profile?.full_name ?? user.email ?? "A user"} signed in as ${roleLabel}.\nTime: ${data.at ?? new Date().toISOString()}`,
      href: "/admin/users",
      user: true,
      userId: user.id,
      customerEmail: profile?.email ?? user.email,
      customerPhone: profile?.phone,
      customerTitle: "New sign-in to your account",
      customerBody: `We noticed a sign-in to your Infiniforge account.\nTime: ${data.at ?? new Date().toISOString()}`,
      metadata: { user_id: user.id, roles: roleLabel },
    });
    return { ok: true };
  });

export const notifyProfileUpdated = createServerFn({ method: "POST" })
  .validator((input: { changed?: string[] }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const user = await getRequestUser(supabaseAdmin);
    const { data: profile } = await supabaseAdmin.from("profiles").select("full_name,email,phone").eq("id", user.id).maybeSingle();
    const changed = data.changed?.length ? data.changed.join(", ") : "profile details";
    await safeDispatchAlert(supabaseAdmin, {
      kind: "profile",
      title: `Customer profile updated · ${profile?.full_name ?? user.email ?? "User"}`,
      body: `Updated fields: ${changed}`,
      href: "/admin/users",
      user: true,
      userId: user.id,
      customerEmail: profile?.email ?? user.email,
      customerPhone: profile?.phone,
      customerTitle: "Your profile was updated",
      customerBody: `Your Infiniforge profile changes were saved.\nUpdated fields: ${changed}`,
      metadata: { user_id: user.id, changed: data.changed ?? [] },
    });
    return { ok: true };
  });

export const notifyTicketCreated = createServerFn({ method: "POST" })
  .validator((input: { ticket_id: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const user = await getRequestUser(supabaseAdmin);
    const { data: ticket } = await supabaseAdmin.from("tickets").select("*").eq("id", data.ticket_id).maybeSingle();
    if (!ticket) throw new Error("Ticket not found");
    const { data: isStaff } = await supabaseAdmin.rpc("is_staff", { _user_id: user.id });
    if (ticket.customer_id !== user.id && !isStaff) throw new Error("Forbidden");
    const { data: profile } = ticket.customer_id
      ? await supabaseAdmin.from("profiles").select("email,phone,full_name").eq("id", ticket.customer_id).maybeSingle()
      : { data: null };
    await safeDispatchAlert(supabaseAdmin, {
      kind: "ticket",
      title: `New support ticket · ${ticket.ticket_number ?? ticket.id.slice(0, 8)}`,
      body: `${ticket.subject}\nPriority: ${ticket.priority}\nDepartment: ${ticket.department}`,
      href: "/admin/tickets",
      user: true,
      userId: ticket.customer_id,
      customerEmail: profile?.email,
      customerPhone: profile?.phone,
      customerTitle: `Ticket received · ${ticket.ticket_number ?? ticket.subject}`,
      customerBody: `Your support ticket has been submitted.\nSubject: ${ticket.subject}`,
      metadata: { ticket_id: ticket.id, priority: ticket.priority, department: ticket.department },
    });
    return { ok: true };
  });

export const notifyOrderCreated = createServerFn({ method: "POST" })
  .validator((input: { order_id: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await requireStaffFromRequest(supabaseAdmin);
    const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", data.order_id).maybeSingle();
    if (!order) throw new Error("Order not found");
    await safeDispatchAlert(supabaseAdmin, {
      kind: "order",
      title: `New manual order · ${order.order_number}`,
      body: `${order.customer_name ?? "Customer"} ordered ${order.product_name}.\nTotal: ₹${Number(order.total_inr ?? 0).toLocaleString("en-IN")}`,
      href: "/admin/orders",
      user: Boolean(order.customer_id),
      userId: order.customer_id,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      customerTitle: `Order created · ${order.order_number}`,
      customerBody: `Your order for ${order.product_name} has been created.\nTotal: ₹${Number(order.total_inr ?? 0).toLocaleString("en-IN")}`,
      metadata: { order_id: order.id, order_number: order.order_number },
    });
    return { ok: true };
  });

export const updateOrderStatusWithAlert = createServerFn({ method: "POST" })
  .validator((input: { id: string; status: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { user } = await requireStaffFromRequest(supabaseAdmin);
    const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", data.id).maybeSingle();
    if (!order) throw new Error("Order not found");
    const { error } = await supabaseAdmin.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("admin_audit_logs").insert({
      actor_id: user.id,
      actor_email: user.email ?? null,
      action: "status.change",
      resource_type: "orders",
      resource_id: data.id,
      details: { status: data.status, order_number: order.order_number },
    });
    await safeDispatchAlert(supabaseAdmin, {
      kind: "order",
      title: `Order status changed · ${order.order_number}`,
      body: `${order.product_name} is now ${data.status}.\nCustomer: ${order.customer_name ?? order.customer_email ?? "—"}`,
      href: "/admin/orders",
      user: Boolean(order.customer_id),
      userId: order.customer_id,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      customerTitle: `Order update · ${order.order_number}`,
      customerBody: `Your order for ${order.product_name} is now ${data.status}.`,
      metadata: { order_id: order.id, order_number: order.order_number, status: data.status },
    });
    return { ok: true };
  });

export const notifyAuditEvent = createServerFn({ method: "POST" })
  .validator((input: AuditEntry) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { user } = await requireStaffFromRequest(supabaseAdmin);
    if ((data.details as { test?: string } | undefined)?.test) return { ok: true, skipped: true };
    await safeDispatchAlert(supabaseAdmin, {
      kind: "audit",
      title: `Admin change · ${data.resource}`,
      body: `${user.email ?? "A staff user"} performed ${data.action} on ${data.resource}${data.resource_id ? ` (${data.resource_id})` : ""}.`,
      href: data.resource === "orders" ? "/admin/orders" : "/admin/audit-logs",
      user: false,
      metadata: { action: data.action, resource: data.resource, resource_id: data.resource_id ?? null },
    });
    return { ok: true };
  });
