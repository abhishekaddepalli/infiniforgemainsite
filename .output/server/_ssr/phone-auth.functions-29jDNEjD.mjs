import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
import { o as sendTwilioSms } from "./notifications.server-DSh5-iJH.mjs";
import { createHash, randomInt } from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/phone-auth.functions-29jDNEjD.js
function normalizePhone(input) {
	const trimmed = input.trim().replace(/\s|-/g, "");
	if (!trimmed.startsWith("+")) throw new Error("Phone must include country code, e.g. +919876543210");
	const digits = trimmed.replace(/[^\d+]/g, "");
	if (digits.length < 8 || digits.length > 16) throw new Error("Invalid phone number");
	return digits;
}
function hashCode(phone, code) {
	const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "infiniforge-phone-otp";
	return createHash("sha256").update(`${salt}:${phone}:${code}`).digest("hex");
}
var requestPhoneOtp_createServerFn_handler = createServerRpc({
	id: "08aff47ebd9cbf127f46404715b8a1745039ac262242331d6bbbfea15b25ca03",
	name: "requestPhoneOtp",
	filename: "src/lib/phone-auth.functions.ts"
}, (opts) => requestPhoneOtp.__executeServer(opts));
var requestPhoneOtp = createServerFn({ method: "POST" }).inputValidator((input) => input).handler(requestPhoneOtp_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const since = (/* @__PURE__ */ new Date(Date.now() - 10 * 6e4)).toISOString();
	const { count } = await supabaseAdmin.from("phone_otps").select("id", {
		count: "exact",
		head: true
	}).eq("phone", phone).gte("created_at", since);
	if ((count ?? 0) >= 3) throw new Error("Too many OTP requests. Try again in a few minutes.");
	const code = String(randomInt(1e5, 1e6));
	const expires_at = new Date(Date.now() + 5 * 6e4).toISOString();
	const { error } = await supabaseAdmin.from("phone_otps").insert({
		phone,
		code_hash: hashCode(phone, code),
		expires_at
	});
	if (error) throw new Error(error.message);
	await sendTwilioSms(phone, `Your Infiniforge verification code is ${code}. It expires in 5 minutes.`);
	return {
		ok: true,
		phone
	};
});
var verifyPhoneOtp_createServerFn_handler = createServerRpc({
	id: "6b774b38f83400c50ae6cf6d6a5f73d88a5561b8001abbf345bfc4052108ef62",
	name: "verifyPhoneOtp",
	filename: "src/lib/phone-auth.functions.ts"
}, (opts) => verifyPhoneOtp.__executeServer(opts));
var verifyPhoneOtp = createServerFn({ method: "POST" }).inputValidator((input) => input).handler(verifyPhoneOtp_createServerFn_handler, async ({ data }) => {
	const phone = normalizePhone(data.phone);
	const code = data.code.trim();
	if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: rows, error: rowsErr } = await supabaseAdmin.from("phone_otps").select("id,code_hash,expires_at,attempts,verified").eq("phone", phone).order("created_at", { ascending: false }).limit(1);
	if (rowsErr) throw new Error(rowsErr.message);
	const row = rows?.[0];
	if (!row) throw new Error("No OTP found. Request a new code.");
	if (row.verified) throw new Error("Code already used. Request a new one.");
	if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("Code expired. Request a new one.");
	if ((row.attempts ?? 0) >= 5) throw new Error("Too many attempts. Request a new code.");
	if (!(row.code_hash === hashCode(phone, code))) {
		await supabaseAdmin.from("phone_otps").update({ attempts: (row.attempts ?? 0) + 1 }).eq("id", row.id);
		throw new Error("Incorrect code");
	}
	await supabaseAdmin.from("phone_otps").update({ verified: true }).eq("id", row.id);
	const syntheticEmail = `${phone.replace(/[^\d]/g, "")}@phone.infiniforge.local`;
	const { data: createRes, error: createErr } = await supabaseAdmin.auth.admin.createUser({
		email: syntheticEmail,
		phone,
		email_confirm: true,
		phone_confirm: true,
		user_metadata: { signup_via: "phone_otp" }
	});
	if (createErr && !/already/i.test(createErr.message)) throw new Error(createErr.message);
	const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
		type: "magiclink",
		email: syntheticEmail
	});
	if (linkErr) throw new Error(linkErr.message);
	const hashed = linkData.properties?.hashed_token;
	if (!hashed) throw new Error("Could not issue session token");
	if (linkData.user?.id) await supabaseAdmin.from("user_roles").upsert({
		user_id: linkData.user.id,
		role: "customer"
	}, {
		onConflict: "user_id,role",
		ignoreDuplicates: true
	});
	return {
		email: syntheticEmail,
		token_hash: hashed
	};
});
var sendTestSms_createServerFn_handler = createServerRpc({
	id: "0fd230ee0ba13746d95aa0f1b9bf11f7817bfa5c600576e1536ade4f9b9ac214",
	name: "sendTestSms",
	filename: "src/lib/phone-auth.functions.ts"
}, (opts) => sendTestSms.__executeServer(opts));
var sendTestSms = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(sendTestSms_createServerFn_handler, async ({ data, context }) => {
	const { data: isStaff, error: staffErr } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (staffErr) throw new Error(staffErr.message);
	if (!isStaff) throw new Error("Forbidden: staff only");
	await sendTwilioSms(normalizePhone(data.phone), data.body?.trim() || "Infiniforge test SMS — your Twilio integration is working.", {
		sid: data.sid,
		token: data.token,
		from: data.from
	});
	return { ok: true };
});
//#endregion
export { requestPhoneOtp_createServerFn_handler, sendTestSms_createServerFn_handler, verifyPhoneOtp_createServerFn_handler };
