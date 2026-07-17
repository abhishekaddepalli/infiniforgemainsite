import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function ensureAdmin(context: { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

function publicClient() {
  return import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    })
  );
}

// -------- Tiers (public) --------

export const listTiers = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await publicClient();
  const { data, error } = await sb
    .from("membership_tiers")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("rank");
  if (error) throw new Error(error.message);
  return data ?? [];
});

// -------- My membership --------

export const getMyBenefits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: rank } = await context.supabase.rpc("get_user_tier_rank", { _user_id: context.userId });
    const userRank = Number(rank ?? 0);
    const nowIso = new Date().toISOString();
    const { data: activeMemberships } = await context.supabase
      .from("user_memberships")
      .select("tier_id")
      .eq("user_id", context.userId)
      .eq("status", "active")
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`);
    const activeTierIds = new Set((activeMemberships ?? []).map((m) => m.tier_id));
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: allRules, error: rulesError } = await supabaseAdmin
      .from("resource_access")
      .select("resource_type, resource_id, min_tier_rank, required_tier_ids");
    if (rulesError) throw new Error(rulesError.message);

    const normalizeType = (type: string) => {
      if (type === "courses") return "course";
      if (type === "products") return "product";
      if (type === "categories") return "category";
      if (type === "portal_sections") return "portal_section";
      return type;
    };
    const rules = (allRules ?? []).filter((rule) => {
      const required = Array.isArray(rule.required_tier_ids) ? rule.required_tier_ids.map(String) : [];
      return Number(rule.min_tier_rank ?? 0) <= userRank || required.some((tierId) => activeTierIds.has(tierId));
    });

    const grouped: Record<"course" | "product" | "category" | "portal_section", string[]> = {
      course: [],
      product: [],
      category: [],
      portal_section: [],
    };
    for (const r of rules) {
      const type = normalizeType(r.resource_type);
      if ((type === "course" || type === "product" || type === "category" || type === "portal_section") && r.resource_id) {
        grouped[type].push(r.resource_id);
      }
    }
    const courseIds = new Set(grouped.course);
    const productIds = new Set(grouped.product);
    const categoryIds = new Set(grouped.category);
    const portalSections = grouped.portal_section;

    const [allCourses, allProducts, categories] = await Promise.all([
      courseIds.size || categoryIds.size
        ? supabaseAdmin.from("courses").select("id, slug, title, summary, cover_image, category, level").eq("is_published", true)
        : Promise.resolve({ data: [] as any[] }),
      productIds.size || categoryIds.size
        ? supabaseAdmin.from("products").select("id, slug, name, description, product_type, thumbnail_url, price_inr, category_id").eq("status", "active")
        : Promise.resolve({ data: [] as any[] }),
      categoryIds.size
        ? supabaseAdmin.from("categories").select("id, slug, name, description, icon").in("id", Array.from(categoryIds))
        : Promise.resolve({ data: [] as any[] }),
    ]);
    const categoryRows = categories.data ?? [];
    const categoryText = new Set(categoryRows.flatMap((c: any) => [c.id, c.slug, c.name].filter(Boolean).map((v: string) => v.toLowerCase())));
    const courses = (allCourses.data ?? []).filter((course: any) =>
      courseIds.has(course.id) || (course.category && categoryText.has(String(course.category).toLowerCase())),
    );
    const products = (allProducts.data ?? []).filter((product: any) =>
      productIds.has(product.id) || (product.category_id && categoryIds.has(product.category_id)),
    );
    return {
      user_rank: userRank,
      total_rules: rules?.length ?? 0,
      courses,
      products: products.map(({ category_id, ...product }: any) => product),
      categories: categoryRows,
      portal_sections: portalSections,
    };
  });

export const getMyMembership = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_memberships")
      .select("*, tier:membership_tiers(*)")
      .eq("user_id", context.userId)
      .eq("status", "active")
      .order("expires_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

// -------- Access check --------

export const checkAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { resource_type: string; resource_id?: string | null }) => d)
  .handler(async ({ data, context }) => {
    const aliases = data.resource_type === "course" || data.resource_type === "courses"
      ? ["course", "courses"]
      : data.resource_type === "product" || data.resource_type === "products"
        ? ["product", "products"]
        : data.resource_type === "category" || data.resource_type === "categories"
          ? ["category", "categories"]
          : data.resource_type === "portal_section" || data.resource_type === "portal_sections"
            ? ["portal_section", "portal_sections"]
            : [data.resource_type];
    const { data: rules } = await context.supabase
      .from("resource_access")
      .select("min_tier_rank, required_tier_ids")
      .in("resource_type", aliases)
      .eq("resource_id", data.resource_id ?? "");

    const minRank = Math.min(...(rules?.map((r) => Number(r.min_tier_rank ?? 0)) ?? [0]));
    const { data: rank } = await context.supabase.rpc("get_user_tier_rank", { _user_id: context.userId });
    const userRank = (rank as number | null) ?? 0;
    const nowIso = new Date().toISOString();
    const { data: memberships } = await context.supabase
      .from("user_memberships")
      .select("tier_id")
      .eq("user_id", context.userId)
      .eq("status", "active")
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`);
    const tierIds = new Set((memberships ?? []).map((m) => m.tier_id));
    const allowedBySpecificTier = (rules ?? []).some((rule) => {
      const required = Array.isArray(rule.required_tier_ids) ? rule.required_tier_ids.map(String) : [];
      return required.some((tierId) => tierIds.has(tierId));
    });
    return { allowed: userRank >= minRank || allowedBySpecificTier, userRank, requiredRank: minRank };
  });

// -------- Admin: set resource access --------

export const setResourceAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { resource_type: string; resource_id?: string | null; min_tier_rank: number; required_tier_ids?: string[] }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const resourceType = data.resource_type === "courses" ? "course"
      : data.resource_type === "products" ? "product"
        : data.resource_type === "categories" ? "category"
          : data.resource_type === "portal_sections" ? "portal_section"
            : data.resource_type;
    const { error } = await context.supabase
      .from("resource_access")
      .upsert({
        resource_type: resourceType,
        resource_id: data.resource_id ?? "",
        min_tier_rank: data.min_tier_rank,
        required_tier_ids: data.required_tier_ids ?? [],
      }, { onConflict: "resource_type,resource_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getResourceAccess = createServerFn({ method: "GET" })
  .inputValidator((d: { resource_type: string; resource_id?: string | null }) => d)
  .handler(async ({ data }) => {
    const sb = await publicClient();
    const aliases = data.resource_type === "course" || data.resource_type === "courses"
      ? ["course", "courses"]
      : data.resource_type === "product" || data.resource_type === "products"
        ? ["product", "products"]
        : data.resource_type === "category" || data.resource_type === "categories"
          ? ["category", "categories"]
          : data.resource_type === "portal_section" || data.resource_type === "portal_sections"
            ? ["portal_section", "portal_sections"]
            : [data.resource_type];
    const { data: rule } = await sb
      .from("resource_access")
      .select("min_tier_rank, required_tier_ids")
      .in("resource_type", aliases)
      .eq("resource_id", data.resource_id ?? "")
      .order("min_tier_rank")
      .limit(1)
      .maybeSingle();
    return rule ?? { min_tier_rank: 0, required_tier_ids: [] };
  });

// -------- Admin: tier CRUD --------

export const upsertTier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id?: string; slug: string; name: string; rank: number;
    color: string; gradient_from: string; gradient_to: string;
    price_inr: number; duration_days: number | null;
    features: string[]; description?: string | null;
    is_active: boolean; sort_order: number;
  }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("membership_tiers").upsert(data).select().single();
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("membership_tiers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// -------- Admin: user membership management --------

export const listUserMemberships = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase
      .from("user_memberships")
      .select("*, tier:membership_tiers(name, slug, color, rank, gradient_from, gradient_to)")
      .order("updated_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const userIds = Array.from(new Set(rows.map((row) => row.user_id).filter(Boolean)));
    if (userIds.length === 0) return [];

    const { data: profiles, error: profilesError } = await context.supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);
    if (profilesError) throw new Error(profilesError.message);

    const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
    return rows.map((row) => ({ ...row, profile: profileById.get(row.user_id) ?? null }));
  });

export const listMembershipAssignableUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, full_name, email")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const assignMembership = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; tier_id: string; starts_at?: string | null; expires_at?: string | null; notes?: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    // Deactivate existing
    await context.supabase
      .from("user_memberships")
      .update({ status: "cancelled" })
      .eq("user_id", data.user_id)
      .eq("status", "active");
    const { error } = await context.supabase.from("user_memberships").insert({
      user_id: data.user_id,
      tier_id: data.tier_id,
      starts_at: data.starts_at ?? new Date().toISOString(),
      expires_at: data.expires_at ?? null,
      source: "admin",
      status: "active",
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const revokeMembership = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { membership_id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase
      .from("user_memberships")
      .update({ status: "cancelled", expires_at: new Date().toISOString() })
      .eq("id", data.membership_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// -------- Purchase (via wallet OR razorpay) --------

async function activateMembership(
  supabase: import("@supabase/supabase-js").SupabaseClient,
  userId: string,
  tier: { id: string; duration_days: number | null },
  source: "purchase" | "admin" | "free",
) {
  await supabase.from("user_memberships").update({ status: "cancelled" })
    .eq("user_id", userId).eq("status", "active");
  const expires = tier.duration_days
    ? new Date(Date.now() + Number(tier.duration_days) * 86400000).toISOString()
    : null;
  const { error } = await supabase.from("user_memberships").insert({
    user_id: userId, tier_id: tier.id,
    starts_at: new Date().toISOString(), expires_at: expires,
    source, status: "active",
  });
  if (error) throw new Error(error.message);
  return expires;
}

export const purchaseMembership = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { tier_id: string; method?: "wallet" }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: tier, error: tErr } = await supabaseAdmin
      .from("membership_tiers").select("*").eq("id", data.tier_id).single();
    if (tErr) throw new Error(tErr.message);
    if (!tier) throw new Error("Tier not found");
    if (Number(tier.price_inr) > 0) {
      const { data: wallet } = await supabaseAdmin
        .from("wallets").select("id, balance_inr, frozen").eq("user_id", context.userId).maybeSingle();
      if (!wallet) throw new Error("Wallet not found. Please top-up your wallet first.");
      if (wallet.frozen) throw new Error("Wallet is frozen");
      if (Number(wallet.balance_inr) < Number(tier.price_inr)) {
        throw new Error(`Insufficient wallet balance (need ₹${tier.price_inr}, have ₹${wallet.balance_inr}). Top-up your wallet or pay with card.`);
      }
      const newBal = Number(wallet.balance_inr) - Number(tier.price_inr);
      await supabaseAdmin.from("wallets").update({ balance_inr: newBal }).eq("id", wallet.id);
      await supabaseAdmin.from("wallet_transactions").insert({
        wallet_id: wallet.id, user_id: context.userId,
        amount_inr: -Number(tier.price_inr), balance_after_inr: newBal,
        type: "debit", reference_type: "membership", reference_id: tier.id,
        note: `Membership: ${tier.name}`, description: `Membership: ${tier.name}`,
      });
    }
    const expires = await activateMembership(supabaseAdmin, context.userId, tier, "purchase");
    return { ok: true, expires_at: expires };
  });

export const createMembershipRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { tier_id: string }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: tier, error: tErr } = await supabaseAdmin
      .from("membership_tiers").select("*").eq("id", data.tier_id).single();
    if (tErr || !tier) throw new Error(tErr?.message ?? "Tier not found");
    const amt = Math.round(Number(tier.price_inr));
    if (amt <= 0) {
      const expires = await activateMembership(supabaseAdmin, context.userId, tier, "purchase");
      return { free: true, ok: true, expires_at: expires, tier_id: tier.id, amount_inr: 0 };
    }
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      const expires = await activateMembership(supabaseAdmin, context.userId, tier, "purchase");
      return { demo: true, ok: true, expires_at: expires, tier_id: tier.id, amount_inr: amt };
    }
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: amt * 100, currency: "INR",
        receipt: `mb_${Date.now()}`,
        notes: { user_id: context.userId, purpose: "membership", tier_id: tier.id },
      }),
    });
    if (!rzpRes.ok) throw new Error(`Razorpay error: ${await rzpRes.text()}`);
    const rzp = (await rzpRes.json()) as { id: string };
    return {
      demo: false, razorpay_key_id: RAZORPAY_KEY_ID, razorpay_order_id: rzp.id,
      tier_id: tier.id, tier_name: tier.name, amount_inr: amt,
    };
  });

export const verifyMembershipPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => d)
  .handler(async ({ data, context }) => {
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Payment gateway is not configured");
    }
    const crypto = await import("crypto");
    const expected = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`).digest("hex");
    if (expected !== data.razorpay_signature) throw new Error("Invalid payment signature");

    // Fetch the verified razorpay order to bind tier_id + amount server-side.
    const ordRes = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(data.razorpay_order_id)}`, {
      headers: {
        authorization: "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64"),
      },
    });
    if (!ordRes.ok) throw new Error("Could not verify Razorpay order");
    const rzpOrder = (await ordRes.json()) as { amount: number; notes?: Record<string, string>; status?: string };
    const notesUserId = rzpOrder.notes?.user_id;
    const notesTierId = rzpOrder.notes?.tier_id;
    const notesPurpose = rzpOrder.notes?.purpose;
    if (notesPurpose !== "membership") throw new Error("Order is not a membership purchase");
    if (!notesUserId || notesUserId !== context.userId) throw new Error("Order does not belong to this user");
    if (!notesTierId) throw new Error("Order is missing tier reference");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: tier, error } = await supabaseAdmin
      .from("membership_tiers").select("*").eq("id", notesTierId).single();
    if (error || !tier) throw new Error(error?.message ?? "Tier not found");
    const expectedAmount = Math.round(Number(tier.price_inr)) * 100;
    if (Number(rzpOrder.amount) < expectedAmount) throw new Error("Paid amount does not match tier price");

    const expires = await activateMembership(supabaseAdmin, context.userId, tier, "purchase");
    return { ok: true, expires_at: expires };
  });


// -------- Tier-based content access selection --------

export const PORTAL_SECTIONS = [
  { id: "courses", label: "Courses" },
  { id: "downloads", label: "Downloads" },
  { id: "licenses", label: "Licenses" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "affiliate", label: "Affiliate" },
  { id: "wallet", label: "Wallet" },
  { id: "orders", label: "Orders" },
  { id: "tickets", label: "Support tickets" },
] as const;

export const listAccessibleResources = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const [courses, products, categories] = await Promise.all([
      context.supabase.from("courses").select("id, title, slug").order("title"),
      context.supabase.from("products").select("id, name, slug").order("name"),
      context.supabase.from("categories").select("id, name, slug").order("name"),
    ]);
    return {
      courses: courses.data ?? [],
      products: products.data ?? [],
      categories: categories.data ?? [],
      portal_sections: PORTAL_SECTIONS.map((p) => ({ id: p.id, name: p.label })),
    };
  });

export const listTierAccessSelections = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { tier_rank: number }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("resource_access")
      .select("resource_type, resource_id, min_tier_rank")
      .eq("min_tier_rank", data.tier_rank);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((row) => ({
      ...row,
      resource_type: row.resource_type === "courses" ? "course"
        : row.resource_type === "products" ? "product"
          : row.resource_type === "categories" ? "category"
            : row.resource_type === "portal_sections" ? "portal_section"
              : row.resource_type,
    }));
  });

export const saveTierAccessSelections = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    tier_rank: number;
    selections: Array<{ resource_type: string; resource_id: string }>;
  }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    // Downgrade previously-set rules at this rank that are no longer selected.
    const { data: existing } = await context.supabase
      .from("resource_access")
      .select("id, resource_type, resource_id, min_tier_rank")
      .eq("min_tier_rank", data.tier_rank);
    const normalizeType = (type: string) => type === "courses" ? "course"
      : type === "products" ? "product"
        : type === "categories" ? "category"
          : type === "portal_sections" ? "portal_section"
            : type;
    const normalizedSelections = data.selections.map((s) => ({ ...s, resource_type: normalizeType(s.resource_type) }));
    const selectedKey = new Set(normalizedSelections.map((s) => `${s.resource_type}::${s.resource_id}`));
    const toRemove = (existing ?? []).filter((r) => !selectedKey.has(`${normalizeType(r.resource_type)}::${r.resource_id ?? ""}`));
    if (toRemove.length) {
      await context.supabase.from("resource_access").delete().in("id", toRemove.map((r) => r.id));
    }
    // Upsert selected rules at this tier rank.
    if (normalizedSelections.length) {
      const payload = normalizedSelections.map((s) => ({
        resource_type: s.resource_type,
        resource_id: s.resource_id,
        min_tier_rank: data.tier_rank,
      }));
      const { error } = await context.supabase
        .from("resource_access")
        .upsert(payload, { onConflict: "resource_type,resource_id" });
      if (error) throw new Error(error.message);
    }
    return { ok: true, updated: normalizedSelections.length, removed: toRemove.length };
  });
