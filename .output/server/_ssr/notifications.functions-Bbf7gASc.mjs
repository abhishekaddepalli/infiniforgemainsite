import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
import { a as safeSlice, c as verifyTwilioAccount, i as normPhone, l as withTimeout, n as escapeHtml, r as fetchWithTimeout, s as sendWa, t as connectMailer } from "./notifications.server-DSh5-iJH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications.functions-Bbf7gASc.js
async function ensureStaff(context) {
	const { data, error } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Forbidden: staff only");
}
var testSmtpConnection_createServerFn_handler = createServerRpc({
	id: "f7773e12bfd5d23689acf5aa012b10f745497291ece12f01bfb87b0515e0c297",
	name: "testSmtpConnection",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => testSmtpConnection.__executeServer(opts));
var testSmtpConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(testSmtpConnection_createServerFn_handler, async ({ data, context }) => {
	await ensureStaff(context);
	const started = Date.now();
	let mailer = null;
	try {
		mailer = await connectMailer(data);
		return {
			ok: true,
			host: `${data.host}:${data.port}`,
			encryption: data.secure ? "TLS/SSL" : "STARTTLS",
			latency_ms: Date.now() - started
		};
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Connection failed";
		throw new Error(`Cannot reach ${data.host}:${data.port} — ${msg}`);
	} finally {
		try {
			await mailer?.close();
		} catch {}
	}
});
var sendTestEmail_createServerFn_handler = createServerRpc({
	id: "2ad56757ed649cc17a526efa58e6efe6bb08b32ef13e8d016df3a6ecf8a92f87",
	name: "sendTestEmail",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => sendTestEmail.__executeServer(opts));
var sendTestEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(sendTestEmail_createServerFn_handler, async ({ data, context }) => {
	await ensureStaff(context);
	const started = Date.now();
	if (!data.to || !/^\S+@\S+\.\S+$/.test(data.to)) throw new Error("Enter a valid recipient email");
	const mailer = await connectMailer(data);
	const fromLine = data.from_name ? `"${data.from_name.replace(/"/g, "'")}" <${data.from_email}>` : data.from_email;
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
            <div><b style="color:#e2e8f0">Sent at:</b> ${(/* @__PURE__ */ new Date()).toUTCString()}</div>
          </div>
          <p style="margin:0;font-size:12px;color:#64748b">You can safely delete this email.</p>
        </td></tr>
      </table>
    </body></html>`;
	try {
		await withTimeout(mailer.send({
			from: {
				name: data.from_name || data.from_email,
				email: data.from_email
			},
			to: data.to,
			subject: "✅ SMTP test — your integration is working",
			text: `SMTP test successful. Host: ${data.host}:${data.port}. Sent at ${(/* @__PURE__ */ new Date()).toISOString()}.`,
			html
		}), "SMTP email send");
		return {
			ok: true,
			latency_ms: Date.now() - started,
			host: `${data.host}:${data.port}`
		};
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Send failed";
		throw new Error(`SMTP send failed: ${msg}`);
	} finally {
		try {
			await mailer.close();
		} catch {}
	}
});
var sendTestWhatsApp_createServerFn_handler = createServerRpc({
	id: "543c450e268e54a00ac8c0bc66e3158b1d23dc24a974efd689b89e673587ea7a",
	name: "sendTestWhatsApp",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => sendTestWhatsApp.__executeServer(opts));
var sendTestWhatsApp = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(sendTestWhatsApp_createServerFn_handler, async ({ data, context }) => {
	await ensureStaff(context);
	return sendWa(data, normPhone(data.to), data.body?.trim() || "🚀 Infiniforge test message — your WhatsApp integration is working. Alerts, orders and reports will now reach you here.");
});
var testWhatsAppConnection_createServerFn_handler = createServerRpc({
	id: "33ad59285366355a99d00262b9798d26de1b4024d9cc32ceab70471604ac0c8c",
	name: "testWhatsAppConnection",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => testWhatsAppConnection.__executeServer(opts));
var testWhatsAppConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(testWhatsAppConnection_createServerFn_handler, async ({ data, context }) => {
	await ensureStaff(context);
	const started = Date.now();
	const provider = (data.provider || "").toLowerCase();
	if (provider === "twilio") {
		await verifyTwilioAccount(data.api_url, data.api_key);
		return {
			ok: true,
			provider,
			latency_ms: Date.now() - started
		};
	}
	if (provider === "meta") {
		if (!data.api_url) throw new Error("Meta Cloud API endpoint URL is required.");
		if (!data.api_key) throw new Error("Meta Cloud API bearer token is required.");
		const res = await fetchWithTimeout(data.api_url.replace(/\/messages\/?$/, ""), { headers: { Authorization: `Bearer ${data.api_key}` } }, "Meta WhatsApp connection test");
		const text = await res.text();
		if (!res.ok && res.status !== 400) throw new Error(`Meta auth failed (${res.status}): ${safeSlice(text)}`);
		return {
			ok: true,
			provider,
			latency_ms: Date.now() - started
		};
	}
	if (!data.api_url) throw new Error("API endpoint URL is required.");
	try {
		const res = await fetchWithTimeout(data.api_url, { method: "OPTIONS" }, "WhatsApp endpoint connection test");
		return {
			ok: true,
			provider: provider || "custom",
			latency_ms: Date.now() - started,
			reachable_status: res.status
		};
	} catch (e) {
		const msg = e instanceof Error ? e.message : "Unreachable";
		throw new Error(`Endpoint unreachable: ${msg}`);
	}
});
var testTwilioConnection_createServerFn_handler = createServerRpc({
	id: "4595a5ff77c1f086daa46e888cac377a2aa9748d55166aa6e04b3998c9e2f3f2",
	name: "testTwilioConnection",
	filename: "src/lib/notifications.functions.ts"
}, (opts) => testTwilioConnection.__executeServer(opts));
var testTwilioConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input ?? {}).handler(testTwilioConnection_createServerFn_handler, async ({ data, context }) => {
	await ensureStaff(context);
	const started = Date.now();
	const verified = await verifyTwilioAccount(data.sid, data.token);
	return {
		ok: true,
		latency_ms: Date.now() - started,
		account_sid_last4: verified.account_sid_last4
	};
});
//#endregion
export { sendTestEmail_createServerFn_handler, sendTestWhatsApp_createServerFn_handler, testSmtpConnection_createServerFn_handler, testTwilioConnection_createServerFn_handler, testWhatsAppConnection_createServerFn_handler };
