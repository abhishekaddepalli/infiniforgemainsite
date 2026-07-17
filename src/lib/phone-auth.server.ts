import { createHash } from "crypto";

export function normalizePhone(input: string): string {
  const trimmed = input.trim().replace(/\s|-/g, "");
  if (!trimmed.startsWith("+")) throw new Error("Phone must include country code, e.g. +919876543210");
  const digits = trimmed.replace(/[^\d+]/g, "");
  if (digits.length < 8 || digits.length > 16) throw new Error("Invalid phone number");
  return digits;
}

export function hashCode(phone: string, code: string): string {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "infiniforge-phone-otp";
  return createHash("sha256").update(`${salt}:${phone}:${code}`).digest("hex");
}
