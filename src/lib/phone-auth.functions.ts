import { createServerFn } from "@tanstack/react-start";
import { randomInt } from "crypto";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { hashCode, normalizePhone } from "./phone-auth.server";
import { sendTwilioSms } from "./notifications.server";

export const requestPhoneOtp = createServerFn({ method: "POST" })
  .inputValidator((input: { phone: string }) => input)
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Rate limit: max 3 requests per phone per 10 min
    const since = new Date(Date.now() - 10 * 60_000).toISOString();
    const { count } = await supabaseAdmin
      .from("phone_otps")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) throw new Error("Too many OTP requests. Try again in a few minutes.");

    const code = String(randomInt(100000, 1000000));
    const expires_at = new Date(Date.now() + 5 * 60_000).toISOString();

    const { error } = await supabaseAdmin.from("phone_otps").insert({
      phone,
      code_hash: hashCode(phone, code),
      expires_at,
    });
    if (error) throw new Error(error.message);

    await sendTwilioSms(phone, `Your Infiniforge verification code is ${code}. It expires in 5 minutes.`);
    return { ok: true, phone };
  });

export const verifyPhoneOtp = createServerFn({ method: "POST" })
  .inputValidator((input: { phone: string; code: string }) => input)
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    const code = data.code.trim();
    if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error: rowsErr } = await supabaseAdmin
      .from("phone_otps")
      .select("id,code_hash,expires_at,attempts,verified")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1);
    if (rowsErr) throw new Error(rowsErr.message);
    const row = rows?.[0];
    if (!row) throw new Error("No OTP found. Request a new code.");
    if (row.verified) throw new Error("Code already used. Request a new one.");
    if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("Code expired. Request a new one.");
    if ((row.attempts ?? 0) >= 5) throw new Error("Too many attempts. Request a new code.");

    const match = row.code_hash === hashCode(phone, code);
    if (!match) {
      await supabaseAdmin.from("phone_otps").update({ attempts: (row.attempts ?? 0) + 1 }).eq("id", row.id);
      throw new Error("Incorrect code");
    }
    await supabaseAdmin.from("phone_otps").update({ verified: true }).eq("id", row.id);

    // Get or create the auth user for this phone. Use a deterministic synthetic
    // email so we can issue a magiclink token the client can exchange for a session.
    const syntheticEmail = `${phone.replace(/[^\d]/g, "")}@phone.infiniforge.local`;

    // Try to create; if it already exists, ignore.
    const { data: createRes, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: syntheticEmail,
      phone,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: { signup_via: "phone_otp" },
    });
    if (createErr && !/already/i.test(createErr.message)) {
      // Non-conflict error — surface it
      throw new Error(createErr.message);
    }
    void createRes;

    // Generate a magiclink to log the user in.
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: syntheticEmail,
    });
    if (linkErr) throw new Error(linkErr.message);

    const hashed = linkData.properties?.hashed_token;
    if (!hashed) throw new Error("Could not issue session token");

    // Ensure a customer role exists (handle_new_user trigger normally does this,
    // but generateLink after createUser can race).
    if (linkData.user?.id) {
      await supabaseAdmin.from("user_roles").upsert(
        { user_id: linkData.user.id, role: "customer" },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );
    }

    return { email: syntheticEmail, token_hash: hashed };
  });

export const sendTestSms = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { phone: string; body?: string; sid?: string; token?: string; from?: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: isStaff, error: staffErr } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (staffErr) throw new Error(staffErr.message);
    if (!isStaff) throw new Error("Forbidden: staff only");
    const to = normalizePhone(data.phone);
    await sendTwilioSms(
      to,
      data.body?.trim() || "Infiniforge test SMS — your Twilio integration is working.",
      { sid: data.sid, token: data.token, from: data.from },
    );
    return { ok: true };
  });
