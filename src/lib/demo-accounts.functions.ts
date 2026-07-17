import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEMO_ACCOUNTS } from "./demo-accounts";

/**
 * Seeds the nine demo accounts (one per role) if missing, then upserts their role rows.
 * Restricted to signed-in super admins to prevent unauthenticated privileged
 * account (re)creation via the shared demo password.
 */
export const seedDemoAccounts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
  const { data: isSuper, error: roleErr } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "super_admin",
  });
  if (roleErr) throw new Error(roleErr.message);
  if (!isSuper) throw new Error("Forbidden: super admin only");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const created: string[] = [];
  const existing: string[] = [];

  for (const acc of DEMO_ACCOUNTS) {
    let userId: string | null = null;

    const { data: createRes, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: acc.email,
      password: acc.password,
      email_confirm: true,
      user_metadata: { full_name: acc.full_name, demo: true },
    });

    if (createErr) {
      // Already exists — look them up
      const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (listErr) throw new Error(listErr.message);
      const match = list.users.find((u) => u.email?.toLowerCase() === acc.email.toLowerCase());
      if (!match) throw new Error(`Could not create or find ${acc.email}: ${createErr.message}`);
      userId = match.id;
      existing.push(acc.email);
    } else {
      userId = createRes.user?.id ?? null;
      if (userId) created.push(acc.email);
    }

    if (!userId) continue;

    // Ensure the assigned role exists (customer is added by the handle_new_user trigger)
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: acc.role }, { onConflict: "user_id,role" });

    // Make sure the profile has the right display name
    await supabaseAdmin
      .from("profiles")
      .update({ full_name: acc.full_name })
      .eq("id", userId);
  }

  return { created: created.length, existing: existing.length, total: DEMO_ACCOUNTS.length };
});
