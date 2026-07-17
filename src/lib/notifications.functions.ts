import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { connectMailer, escapeHtml, fetchWithTimeout, normPhone, safeSlice, sendWa, verifyTwilioAccount, withTimeout, type SmtpBase, type WhatsAppCfg } from "./notifications.server";

async function ensureStaff(context: { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff only");
}

// ---------- SMTP: connection test ----------

export const testSmtpConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: SmtpBase) => input)
  .handler(async ({ data, context }) => {
    await ensureStaff(context);
    const started = Date.now();
    let mailer: Awaited<ReturnType<typeof connectMailer>> | null = null;
    try {
      mailer = await connectMailer(data);
      return {
        ok: true,
        host: `${data.host}:${data.port}`,
        encryption: data.secure ? "TLS/SSL" : "STARTTLS",
        latency_ms: Date.now() - started,
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      throw new Error(`Cannot reach ${data.host}:${data.port} — ${msg}`);
    } finally {
      try { await mailer?.close(); } catch { /* ignore */ }
    }
  });

// ---------- SMTP: send test email ----------

export const sendTestEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: SmtpBase & { to: string }) => input)
  .handler(async ({ data, context }) => {
    await ensureStaff(context);
    const started = Date.now();
    if (!data.to || !/^\S+@\S+\.\S+$/.test(data.to)) throw new Error("Enter a valid recipient email");

    const mailer = await connectMailer(data);
    const fromLine = data.from_name
      ? `"${data.from_name.replace(/"/g, "'")}" <${data.from_email}>`
      : data.from_email;

    const html = `<!doctype html><html><body style="margin:0;background:#0f172a;font-family:Arial,sans-serif;padding:24px;color:#e2e8f0">
      <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:linear-gradient(135deg,#1e293b,#0f172a);border:1px solid #334155;border-radius:20px;overflow:hidden">
        <tr><td style="padding:32px 28px 20px;text-align:center;background:linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)">
          <div style="font-size:28px;font-weight:800;color:#fff">✓ SMTP Test Successful</div>
          <div style="color:#e0e7ff;margin-top:6px;font-size:13px">Your outbound email pipeline is live.</div>
        </td></tr>
        <tr><td style="padding:28px">
          <p style="margin:0 0 14px;font-size:15px;color:#cbd5e1">Hello 👋</p>
          <p style="margin:0 0 14px;font-size:14px;color:#94a3b8;line-height:1.6">
            This is a test message from your admin panel. Your SMTP integration
            (<b style="color:#e2e8f0">${escapeHtml(data.host)}:${data.port}</b>) is configured correctly.
          </p>
          <div style="margin:20px 0;padding:14px 16px;background:#0b1220;border:1px solid #1e293b;border-radius:12px;font-size:12px;color:#94a3b8">
            <div><b style="color:#e2e8f0">From:</b> ${escapeHtml(fromLine)}</div>
            <div><b style="color:#e2e8f0">Encryption:</b> ${data.secure ? "TLS/SSL" : "STARTTLS"}</div>
            <div><b style="color:#e2e8f0">Sent at:</b> ${new Date().toUTCString()}</div>
          </div>
          <p style="margin:0;font-size:12px;color:#64748b">You can safely delete this email.</p>
        </td></tr>
      </table>
    </body></html>`;

    try {
      await withTimeout(mailer.send({
        from: { name: data.from_name || data.from_email, email: data.from_email },
        to: data.to,
        subject: "✅ SMTP test — your integration is working",
        text: `SMTP test successful. Host: ${data.host}:${data.port}. Sent at ${new Date().toISOString()}.`,
        html,
      }), "SMTP email send");
      return { ok: true, latency_ms: Date.now() - started, host: `${data.host}:${data.port}` };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Send failed";
      throw new Error(`SMTP send failed: ${msg}`);
    } finally {
      try { await mailer.close(); } catch { /* ignore */ }
    }
  });

// ---------- WHATSAPP ----------

export const sendTestWhatsApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: WhatsAppCfg & { to: string; body?: string }) => input)
  .handler(async ({ data, context }) => {
    await ensureStaff(context);
    const to = normPhone(data.to);
    const body = data.body?.trim() ||
      "🚀 Infiniforge test message — your WhatsApp integration is working. Alerts, orders and reports will now reach you here.";
    return sendWa(data, to, body);
  });

export const testWhatsAppConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: WhatsAppCfg) => input)
  .handler(async ({ data, context }) => {
    await ensureStaff(context);
    const started = Date.now();
    const provider = (data.provider || "").toLowerCase();

    if (provider === "twilio") {
      await verifyTwilioAccount(data.api_url, data.api_key);
      return { ok: true, provider, latency_ms: Date.now() - started };
    }

    if (provider === "meta") {
      if (!data.api_url) throw new Error("Meta Cloud API endpoint URL is required.");
      if (!data.api_key) throw new Error("Meta Cloud API bearer token is required.");
      // Ping the base graph URL derived from the endpoint
      const base = data.api_url.replace(/\/messages\/?$/, "");
      const res = await fetchWithTimeout(base, {
        headers: { Authorization: `Bearer ${data.api_key}` },
      }, "Meta WhatsApp connection test");
      const text = await res.text();
      if (!res.ok && res.status !== 400) throw new Error(`Meta auth failed (${res.status}): ${safeSlice(text)}`);
      return { ok: true, provider, latency_ms: Date.now() - started };
    }

    if (!data.api_url) throw new Error("API endpoint URL is required.");
    // Simple reachability check
    try {
      const res = await fetchWithTimeout(data.api_url, { method: "OPTIONS" }, "WhatsApp endpoint connection test");
      return { ok: true, provider: provider || "custom", latency_ms: Date.now() - started, reachable_status: res.status };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unreachable";
      throw new Error(`Endpoint unreachable: ${msg}`);
    }
  });

// ---------- SMS (Twilio connection test) ----------

export const testTwilioConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { sid?: string; token?: string }) => input ?? {})
  .handler(async ({ data, context }) => {
    await ensureStaff(context);
    const started = Date.now();
    const verified = await verifyTwilioAccount(data.sid, data.token);
    return { ok: true, latency_ms: Date.now() - started, account_sid_last4: verified.account_sid_last4 };
  });
