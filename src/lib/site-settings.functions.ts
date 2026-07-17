import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

export type SiteContent = {
  hero_eyebrow?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_primary?: string;
  hero_cta_secondary?: string;
  extra_services?: { title: string; description: string }[];
};

const CONTENT_KEY = "homepage";

async function requireAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const authHeader = getRequestHeader("authorization" as never) as string | undefined;
  if (!authHeader) throw new Error("Unauthorized");
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data: u } = await supabaseAdmin.auth.getUser(token);
  if (!u.user) throw new Error("Unauthorized");
  const { data: isStaff } = await supabaseAdmin.rpc("is_staff", { _user_id: u.user.id });
  if (!isStaff) throw new Error("Forbidden");
  return { user: u.user, supabaseAdmin };
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("module_records")
    .select("metadata")
    .eq("module", "site_content")
    .eq("title", CONTENT_KEY)
    .maybeSingle();
  return (data?.metadata ?? {}) as SiteContent;
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator((d: SiteContent) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await requireAdmin();
    const { data: existing } = await supabaseAdmin
      .from("module_records")
      .select("id")
      .eq("module", "site_content")
      .eq("title", CONTENT_KEY)
      .maybeSingle();
    if (existing) {
      await supabaseAdmin.from("module_records").update({ metadata: data }).eq("id", existing.id);
    } else {
      await supabaseAdmin.from("module_records").insert({
        module: "site_content", title: CONTENT_KEY, status: "published", metadata: data,
      });
    }
    return { ok: true };
  });
