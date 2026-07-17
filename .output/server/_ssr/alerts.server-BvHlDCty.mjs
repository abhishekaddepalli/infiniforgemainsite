import { n as getRequestHeader } from "./request-response-BDiR3rEX.mjs";
import { t as normalizePlatformAlertSettings } from "./alert-settings-DkcV0gwP.mjs";
import { a as safeSlice, l as withTimeout, n as escapeHtml, o as sendTwilioSms, s as sendWa, t as connectMailer } from "./notifications.server-DSh5-iJH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts.server-BvHlDCty.js
var SETTINGS_MODULE = "platform_settings";
var SETTINGS_TITLE = "global";
var STAFF_ROLES = [
	"super_admin",
	"admin",
	"sales_manager",
	"support",
	"finance",
	"employee"
];
var emailRegex = /^\S+@\S+\.\S+$/;
async function getRequestUser(supabaseAdmin) {
	const authHeader = getRequestHeader("authorization");
	if (!authHeader) throw new Error("Unauthorized");
	const token = authHeader.replace(/^Bearer\s+/i, "");
	const { data } = await supabaseAdmin.auth.getUser(token);
	if (!data.user) throw new Error("Unauthorized");
	return data.user;
}
async function requireStaffFromRequest(supabaseAdmin) {
	const user = await getRequestUser(supabaseAdmin);
	const { data: isStaff } = await supabaseAdmin.rpc("is_staff", { _user_id: user.id });
	if (!isStaff) throw new Error("Forbidden");
	const { data: isAdmin } = await supabaseAdmin.rpc("is_admin", { _user_id: user.id });
	return {
		user,
		isAdmin: Boolean(isAdmin)
	};
}
async function loadAlertSettings(supabaseAdmin) {
	const { data } = await supabaseAdmin.from("module_records").select("metadata").eq("module", SETTINGS_MODULE).eq("title", SETTINGS_TITLE).maybeSingle();
	return normalizePlatformAlertSettings(data?.metadata);
}
async function saveAlertSettings(supabaseAdmin, settings) {
	const normalized = normalizePlatformAlertSettings(settings);
	const { data: existing } = await supabaseAdmin.from("module_records").select("id").eq("module", SETTINGS_MODULE).eq("title", SETTINGS_TITLE).maybeSingle();
	if (existing?.id) await supabaseAdmin.from("module_records").update({ metadata: normalized }).eq("id", existing.id);
	else await supabaseAdmin.from("module_records").insert({
		module: SETTINGS_MODULE,
		title: SETTINGS_TITLE,
		status: "active",
		metadata: normalized
	});
	return normalized;
}
async function getStaffRecipients(supabaseAdmin) {
	const { data: roleRows } = await supabaseAdmin.from("user_roles").select("user_id, role").in("role", STAFF_ROLES);
	const ids = Array.from(new Set((roleRows ?? []).map((r) => r.user_id).filter(Boolean)));
	if (!ids.length) return [];
	const { data: profiles } = await supabaseAdmin.from("profiles").select("id,email,full_name,phone").in("id", ids);
	const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
	const missing = ids.filter((id) => !byId.get(id)?.email);
	if (missing.length) for (const id of missing) try {
		const { data } = await supabaseAdmin.auth.admin.getUserById(id);
		if (data?.user?.email) {
			const prev = byId.get(id) ?? {
				id,
				email: null,
				full_name: null,
				phone: null
			};
			byId.set(id, {
				...prev,
				id,
				email: data.user.email
			});
		}
	} catch {}
	return Array.from(byId.values());
}
function uniqueEmails(values) {
	return Array.from(new Set(values.map((v) => v?.trim()).filter((v) => !!v && emailRegex.test(v))));
}
function smtpReady(settings) {
	return !!settings.smtp_host && !!(settings.smtp_from_email || settings.smtp_username);
}
function smtpConfig(settings) {
	return {
		host: settings.smtp_host,
		port: settings.smtp_port,
		secure: settings.smtp_secure,
		username: settings.smtp_username,
		password: settings.smtp_password,
		from_email: settings.smtp_from_email || settings.smtp_username,
		from_name: settings.smtp_from_name || settings.brand_name
	};
}
function waConfig(settings) {
	return {
		provider: settings.wa_provider,
		api_url: settings.wa_api_url,
		api_key: settings.wa_api_key,
		from_number: settings.wa_from_number
	};
}
async function sendEmail(settings, to, subject, title, body) {
	if (!smtpReady(settings) || !to.length) return "skipped";
	let mailer = null;
	try {
		mailer = await connectMailer(smtpConfig(settings));
		const fromEmail = settings.smtp_from_email || settings.smtp_username;
		const html = `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;padding:24px">
      <table role="presentation" width="100%" style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden">
        <tr><td style="padding:26px 28px;background:linear-gradient(135deg,#f97316,#14b8a6);color:#fff">
          <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.85">${escapeHtml(settings.brand_name || "Infiniforge")}</div>
          <div style="font-size:24px;line-height:1.25;font-weight:800;margin-top:6px">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:26px 28px;font-size:14px;line-height:1.65;color:#334155;white-space:pre-line">${escapeHtml(body)}</td></tr>
        <tr><td style="padding:16px 28px;background:#f8fafc;color:#64748b;font-size:12px">Sent automatically by ${escapeHtml(settings.brand_name || "Infiniforge Technologies")} alerts.</td></tr>
      </table>
    </body></html>`;
		await withTimeout(mailer.send({
			from: {
				name: settings.smtp_from_name || settings.brand_name || fromEmail,
				email: fromEmail
			},
			to,
			subject,
			text: body,
			html
		}), "SMTP alert email send");
		return "sent";
	} finally {
		try {
			await mailer?.close();
		} catch {}
	}
}
async function updateDelivery(supabaseAdmin, id, patch) {
	await supabaseAdmin.from("notifications").update(patch).eq("id", id);
}
async function dispatchAlert(supabaseAdmin, payload) {
	const settings = await loadAlertSettings(supabaseAdmin);
	const staffRecipients = payload.staff === false ? [] : await getStaffRecipients(supabaseAdmin);
	const rows = [];
	if (payload.staff !== false) {
		const title = payload.staffTitle ?? payload.title;
		const body = payload.staffBody ?? payload.body ?? "";
		const staffEmails = uniqueEmails([settings.alert_recipient_email, ...staffRecipients.map((r) => r.email)]);
		const staffWa = settings.wa_enabled ? settings.alert_recipient_whatsapp : "";
		const staffSms = settings.twilio_enabled ? settings.alert_recipient_sms : "";
		const { data: n } = await supabaseAdmin.from("notifications").insert({
			audience: "staff",
			title,
			body,
			href: payload.href ?? "/admin",
			kind: payload.kind,
			email_status: smtpReady(settings) && staffEmails.length ? "pending" : "skipped",
			whatsapp_status: staffWa ? "pending" : "skipped",
			sms_status: staffSms ? "pending" : "skipped",
			metadata: payload.metadata ?? {}
		}).select("id").single();
		if (n?.id) rows.push(n.id);
		if (n?.id && staffEmails.length) try {
			await updateDelivery(supabaseAdmin, n.id, { email_status: await sendEmail(settings, staffEmails, `Infiniforge alert: ${title}`, title, body) });
		} catch (e) {
			await updateDelivery(supabaseAdmin, n.id, {
				email_status: "failed",
				metadata: {
					...payload.metadata ?? {},
					email_error: safeSlice(e instanceof Error ? e.message : "Email failed")
				}
			});
		}
		if (n?.id && staffWa) try {
			await sendWa(waConfig(settings), staffWa, `${title}\n\n${body}`);
			await updateDelivery(supabaseAdmin, n.id, { whatsapp_status: "sent" });
		} catch (e) {
			await updateDelivery(supabaseAdmin, n.id, {
				whatsapp_status: "failed",
				metadata: {
					...payload.metadata ?? {},
					whatsapp_error: safeSlice(e instanceof Error ? e.message : "WhatsApp failed")
				}
			});
		}
		if (n?.id && staffSms) try {
			await sendTwilioSms(staffSms, `${title}: ${body}`.slice(0, 1500), {
				sid: settings.twilio_account_sid,
				token: settings.twilio_auth_token,
				from: settings.twilio_from_number
			});
			await updateDelivery(supabaseAdmin, n.id, { sms_status: "sent" });
		} catch (e) {
			await updateDelivery(supabaseAdmin, n.id, {
				sms_status: "failed",
				metadata: {
					...payload.metadata ?? {},
					sms_error: safeSlice(e instanceof Error ? e.message : "SMS failed")
				}
			});
		}
	}
	if (payload.user && payload.userId) {
		const title = payload.customerTitle ?? payload.title;
		const body = payload.customerBody ?? payload.body ?? "";
		const emailTo = uniqueEmails([payload.customerEmail]);
		const phoneTo = payload.customerPhone?.trim();
		const { data: n } = await supabaseAdmin.from("notifications").insert({
			audience: "user",
			user_id: payload.userId,
			title,
			body,
			href: payload.href?.startsWith("/admin") ? "/portal" : payload.href ?? "/portal",
			kind: payload.kind,
			email_status: smtpReady(settings) && emailTo.length ? "pending" : "skipped",
			whatsapp_status: settings.wa_enabled && phoneTo ? "pending" : "skipped",
			sms_status: settings.twilio_enabled && phoneTo ? "pending" : "skipped",
			metadata: payload.metadata ?? {}
		}).select("id").single();
		if (n?.id) rows.push(n.id);
		if (n?.id && emailTo.length) try {
			await updateDelivery(supabaseAdmin, n.id, { email_status: await sendEmail(settings, emailTo, title, title, body) });
		} catch (e) {
			await updateDelivery(supabaseAdmin, n.id, {
				email_status: "failed",
				metadata: {
					...payload.metadata ?? {},
					email_error: safeSlice(e instanceof Error ? e.message : "Email failed")
				}
			});
		}
		if (n?.id && settings.wa_enabled && phoneTo) try {
			await sendWa(waConfig(settings), phoneTo, `${title}\n\n${body}`);
			await updateDelivery(supabaseAdmin, n.id, { whatsapp_status: "sent" });
		} catch (e) {
			await updateDelivery(supabaseAdmin, n.id, {
				whatsapp_status: "failed",
				metadata: {
					...payload.metadata ?? {},
					whatsapp_error: safeSlice(e instanceof Error ? e.message : "WhatsApp failed")
				}
			});
		}
		if (n?.id && settings.twilio_enabled && phoneTo) try {
			await sendTwilioSms(phoneTo, `${title}: ${body}`.slice(0, 1500), {
				sid: settings.twilio_account_sid,
				token: settings.twilio_auth_token,
				from: settings.twilio_from_number
			});
			await updateDelivery(supabaseAdmin, n.id, { sms_status: "sent" });
		} catch (e) {
			await updateDelivery(supabaseAdmin, n.id, {
				sms_status: "failed",
				metadata: {
					...payload.metadata ?? {},
					sms_error: safeSlice(e instanceof Error ? e.message : "SMS failed")
				}
			});
		}
	}
	return {
		ok: true,
		notification_ids: rows
	};
}
async function safeDispatchAlert(supabaseAdmin, payload) {
	try {
		return await dispatchAlert(supabaseAdmin, payload);
	} catch (e) {
		console.error("Alert dispatch failed", e);
		return {
			ok: false,
			notification_ids: []
		};
	}
}
//#endregion
export { saveAlertSettings as a, safeDispatchAlert as i, loadAlertSettings as n, requireStaffFromRequest as r, getRequestUser as t };
