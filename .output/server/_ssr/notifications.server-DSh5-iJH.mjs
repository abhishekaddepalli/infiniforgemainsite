//#region node_modules/.nitro/vite/services/ssr/assets/notifications.server-DSh5-iJH.js
var DEFAULT_TIMEOUT_MS = 15e3;
function escapeHtml(s) {
	return s.replace(/[&<>"']/g, (c) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[c]);
}
function safeSlice(s) {
	return s.length > 400 ? `${s.slice(0, 400)}…` : s;
}
function normPhone(s) {
	const t = s.trim().replace(/\s|-/g, "");
	if (!t.startsWith("+")) throw new Error("Recipient must include country code (e.g. +91…)");
	const digits = t.replace(/[^\d+]/g, "");
	if (digits.length < 8 || digits.length > 16) throw new Error("Invalid phone number");
	return digits;
}
async function withTimeout(promise, label, ms = DEFAULT_TIMEOUT_MS) {
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`${label} timed out after ${Math.round(ms / 1e3)} seconds`)), ms);
	});
	try {
		return await Promise.race([promise, timeout]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
async function fetchWithTimeout(input, init = {}, label = "Request", ms = DEFAULT_TIMEOUT_MS) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), ms);
	try {
		return await fetch(input, {
			...init,
			signal: controller.signal
		});
	} catch (e) {
		if (e instanceof Error && e.name === "AbortError") throw new Error(`${label} timed out after ${Math.round(ms / 1e3)} seconds`);
		throw e;
	} finally {
		clearTimeout(timer);
	}
}
async function connectMailer(cfg) {
	if (!cfg.host) throw new Error("SMTP host is required");
	if (!cfg.port) throw new Error("SMTP port is required");
	if (!cfg.from_email) throw new Error("From email is required");
	const { WorkerMailer } = await import("../_libs/worker-mailer.mjs").then((n) => n.t);
	return withTimeout(WorkerMailer.connect({
		host: cfg.host,
		port: cfg.port,
		secure: cfg.secure,
		credentials: cfg.username ? {
			username: cfg.username,
			password: cfg.password
		} : void 0,
		authType: cfg.username ? ["plain", "login"] : void 0
	}), `SMTP connection to ${cfg.host}:${cfg.port}`);
}
async function sendTwilioSms(to, body, override) {
	const sid = override?.sid?.trim() || process.env.TWILIO_ACCOUNT_SID;
	const token = override?.token?.trim() || process.env.TWILIO_AUTH_TOKEN;
	const from = override?.from?.trim() || process.env.TWILIO_FROM_NUMBER;
	if (!sid || !token || !from) throw new Error("Twilio is not configured. Add Account SID, Auth Token and From number first.");
	const res = await fetchWithTimeout(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: new URLSearchParams({
			To: to,
			From: from,
			Body: body
		}).toString()
	}, "Twilio SMS send");
	const text = await res.text();
	if (!res.ok) throw new Error(`Twilio error (${res.status}): ${safeSlice(text)}`);
}
async function verifyTwilioAccount(sid, token) {
	const accountSid = sid?.trim() || process.env.TWILIO_ACCOUNT_SID;
	const authToken = token?.trim() || process.env.TWILIO_AUTH_TOKEN;
	if (!accountSid || !authToken) throw new Error("Twilio Account SID + Auth Token are required.");
	const res = await fetchWithTimeout(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, { headers: { Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}` } }, "Twilio connection test");
	const text = await res.text();
	if (!res.ok) throw new Error(`Twilio auth failed (${res.status}): ${safeSlice(text)}`);
	return { account_sid_last4: accountSid.slice(-4) };
}
async function sendWa(cfg, to, body) {
	const started = Date.now();
	const provider = (cfg.provider || "").toLowerCase();
	if (provider === "twilio") {
		const sid = cfg.api_url?.trim() || process.env.TWILIO_ACCOUNT_SID;
		const token = cfg.api_key?.trim() || process.env.TWILIO_AUTH_TOKEN;
		const from = cfg.from_number || process.env.TWILIO_FROM_NUMBER;
		if (!sid || !token) throw new Error("Twilio needs Account SID (API URL field) and Auth Token (API key field).");
		if (!from) throw new Error("From WhatsApp number is required.");
		const res = await fetchWithTimeout(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
			method: "POST",
			headers: {
				Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				To: `whatsapp:${to}`,
				From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
				Body: body
			}).toString()
		}, "Twilio WhatsApp send");
		const text = await res.text();
		if (!res.ok) throw new Error(`Twilio WhatsApp failed (${res.status}): ${safeSlice(text)}`);
		return {
			ok: true,
			provider,
			latency_ms: Date.now() - started
		};
	}
	if (provider === "meta") {
		if (!cfg.api_url) throw new Error("Meta Cloud API endpoint URL is required.");
		if (!cfg.api_key) throw new Error("Meta Cloud API bearer token is required.");
		const res = await fetchWithTimeout(cfg.api_url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${cfg.api_key}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				messaging_product: "whatsapp",
				to: to.replace(/^\+/, ""),
				type: "text",
				text: { body }
			})
		}, "Meta WhatsApp send");
		const text = await res.text();
		if (!res.ok) throw new Error(`Meta WhatsApp failed (${res.status}): ${safeSlice(text)}`);
		return {
			ok: true,
			provider,
			latency_ms: Date.now() - started
		};
	}
	if (!cfg.api_url) throw new Error("API endpoint URL is required.");
	const res = await fetchWithTimeout(cfg.api_url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...cfg.api_key ? {
				Authorization: `Bearer ${cfg.api_key}`,
				apikey: cfg.api_key
			} : {}
		},
		body: JSON.stringify({
			from: cfg.from_number,
			to,
			message: body,
			text: body
		})
	}, "WhatsApp provider send");
	const text = await res.text();
	if (!res.ok) throw new Error(`WhatsApp provider failed (${res.status}): ${safeSlice(text)}`);
	return {
		ok: true,
		provider: provider || "custom",
		latency_ms: Date.now() - started
	};
}
//#endregion
export { safeSlice as a, verifyTwilioAccount as c, normPhone as i, withTimeout as l, escapeHtml as n, sendTwilioSms as o, fetchWithTimeout as r, sendWa as s, connectMailer as t };
