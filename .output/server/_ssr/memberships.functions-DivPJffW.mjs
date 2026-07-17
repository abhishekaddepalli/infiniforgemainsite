import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/memberships.functions-DivPJffW.js
async function ensureAdmin(context) {
	const { data, error } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Forbidden: admin only");
}
function publicClient() {
	return import("../_libs/supabase__supabase-js.mjs").then((n) => n.n).then(({ createClient }) => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, { auth: {
		storage: void 0,
		persistSession: false,
		autoRefreshToken: false
	} }));
}
var listTiers_createServerFn_handler = createServerRpc({
	id: "87e49e25c527797fbf254f04ba0d838328e2d50cb33a0c5752f74b5cbfec4071",
	name: "listTiers",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => listTiers.__executeServer(opts));
var listTiers = createServerFn({ method: "GET" }).handler(listTiers_createServerFn_handler, async () => {
	const { data, error } = await (await publicClient()).from("membership_tiers").select("*").eq("is_active", true).order("sort_order").order("rank");
	if (error) throw new Error(error.message);
	return data ?? [];
});
var getMyBenefits_createServerFn_handler = createServerRpc({
	id: "484d169125ac0ff2543226f180b637f802f9023bc8de60d4bf087b57d5ae63c0",
	name: "getMyBenefits",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => getMyBenefits.__executeServer(opts));
var getMyBenefits = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyBenefits_createServerFn_handler, async ({ context }) => {
	const { data: rank } = await context.supabase.rpc("get_user_tier_rank", { _user_id: context.userId });
	const userRank = Number(rank ?? 0);
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const { data: activeMemberships } = await context.supabase.from("user_memberships").select("tier_id").eq("user_id", context.userId).eq("status", "active").or(`expires_at.is.null,expires_at.gt.${nowIso}`);
	const activeTierIds = new Set((activeMemberships ?? []).map((m) => m.tier_id));
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: allRules, error: rulesError } = await supabaseAdmin.from("resource_access").select("resource_type, resource_id, min_tier_rank, required_tier_ids");
	if (rulesError) throw new Error(rulesError.message);
	const normalizeType = (type) => {
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
	const grouped = {
		course: [],
		product: [],
		category: [],
		portal_section: []
	};
	for (const r of rules) {
		const type = normalizeType(r.resource_type);
		if ((type === "course" || type === "product" || type === "category" || type === "portal_section") && r.resource_id) grouped[type].push(r.resource_id);
	}
	const courseIds = new Set(grouped.course);
	const productIds = new Set(grouped.product);
	const categoryIds = new Set(grouped.category);
	const portalSections = grouped.portal_section;
	const [allCourses, allProducts, categories] = await Promise.all([
		courseIds.size || categoryIds.size ? supabaseAdmin.from("courses").select("id, slug, title, summary, cover_image, category, level").eq("is_published", true) : Promise.resolve({ data: [] }),
		productIds.size || categoryIds.size ? supabaseAdmin.from("products").select("id, slug, name, description, product_type, thumbnail_url, price_inr, category_id").eq("status", "active") : Promise.resolve({ data: [] }),
		categoryIds.size ? supabaseAdmin.from("categories").select("id, slug, name, description, icon").in("id", Array.from(categoryIds)) : Promise.resolve({ data: [] })
	]);
	const categoryRows = categories.data ?? [];
	const categoryText = new Set(categoryRows.flatMap((c) => [
		c.id,
		c.slug,
		c.name
	].filter(Boolean).map((v) => v.toLowerCase())));
	const courses = (allCourses.data ?? []).filter((course) => courseIds.has(course.id) || course.category && categoryText.has(String(course.category).toLowerCase()));
	const products = (allProducts.data ?? []).filter((product) => productIds.has(product.id) || product.category_id && categoryIds.has(product.category_id));
	return {
		user_rank: userRank,
		total_rules: rules?.length ?? 0,
		courses,
		products: products.map(({ category_id, ...product }) => product),
		categories: categoryRows,
		portal_sections: portalSections
	};
});
var getMyMembership_createServerFn_handler = createServerRpc({
	id: "5c2a17230be7c118bb8fede60d479ac7336d773c8a4cae26f19ba1cff8aa90d2",
	name: "getMyMembership",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => getMyMembership.__executeServer(opts));
var getMyMembership = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyMembership_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("user_memberships").select("*, tier:membership_tiers(*)").eq("user_id", context.userId).eq("status", "active").order("expires_at", {
		ascending: false,
		nullsFirst: false
	}).limit(1).maybeSingle();
	if (error) throw new Error(error.message);
	return data;
});
var checkAccess_createServerFn_handler = createServerRpc({
	id: "8353c865a53c163342ef1d97e884973cc3d8de469857dd92d4d365c59d39b5e8",
	name: "checkAccess",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => checkAccess.__executeServer(opts));
var checkAccess = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(checkAccess_createServerFn_handler, async ({ data, context }) => {
	const aliases = data.resource_type === "course" || data.resource_type === "courses" ? ["course", "courses"] : data.resource_type === "product" || data.resource_type === "products" ? ["product", "products"] : data.resource_type === "category" || data.resource_type === "categories" ? ["category", "categories"] : data.resource_type === "portal_section" || data.resource_type === "portal_sections" ? ["portal_section", "portal_sections"] : [data.resource_type];
	const { data: rules } = await context.supabase.from("resource_access").select("min_tier_rank, required_tier_ids").in("resource_type", aliases).eq("resource_id", data.resource_id ?? "");
	const minRank = Math.min(...rules?.map((r) => Number(r.min_tier_rank ?? 0)) ?? [0]);
	const { data: rank } = await context.supabase.rpc("get_user_tier_rank", { _user_id: context.userId });
	const userRank = rank ?? 0;
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const { data: memberships } = await context.supabase.from("user_memberships").select("tier_id").eq("user_id", context.userId).eq("status", "active").or(`expires_at.is.null,expires_at.gt.${nowIso}`);
	const tierIds = new Set((memberships ?? []).map((m) => m.tier_id));
	const allowedBySpecificTier = (rules ?? []).some((rule) => {
		return (Array.isArray(rule.required_tier_ids) ? rule.required_tier_ids.map(String) : []).some((tierId) => tierIds.has(tierId));
	});
	return {
		allowed: userRank >= minRank || allowedBySpecificTier,
		userRank,
		requiredRank: minRank
	};
});
var setResourceAccess_createServerFn_handler = createServerRpc({
	id: "685ed3c7ffd5620a21fde7f39c02a5816bcaacba05078467a901d3f2ff8c5011",
	name: "setResourceAccess",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => setResourceAccess.__executeServer(opts));
var setResourceAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(setResourceAccess_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const resourceType = data.resource_type === "courses" ? "course" : data.resource_type === "products" ? "product" : data.resource_type === "categories" ? "category" : data.resource_type === "portal_sections" ? "portal_section" : data.resource_type;
	const { error } = await context.supabase.from("resource_access").upsert({
		resource_type: resourceType,
		resource_id: data.resource_id ?? "",
		min_tier_rank: data.min_tier_rank,
		required_tier_ids: data.required_tier_ids ?? []
	}, { onConflict: "resource_type,resource_id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getResourceAccess_createServerFn_handler = createServerRpc({
	id: "ab1ba954ebff361cd17e41387ab546efba091c4cb6207c5fc8e539fca1f0ab6b",
	name: "getResourceAccess",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => getResourceAccess.__executeServer(opts));
var getResourceAccess = createServerFn({ method: "GET" }).inputValidator((d) => d).handler(getResourceAccess_createServerFn_handler, async ({ data }) => {
	const sb = await publicClient();
	const aliases = data.resource_type === "course" || data.resource_type === "courses" ? ["course", "courses"] : data.resource_type === "product" || data.resource_type === "products" ? ["product", "products"] : data.resource_type === "category" || data.resource_type === "categories" ? ["category", "categories"] : data.resource_type === "portal_section" || data.resource_type === "portal_sections" ? ["portal_section", "portal_sections"] : [data.resource_type];
	const { data: rule } = await sb.from("resource_access").select("min_tier_rank, required_tier_ids").in("resource_type", aliases).eq("resource_id", data.resource_id ?? "").order("min_tier_rank").limit(1).maybeSingle();
	return rule ?? {
		min_tier_rank: 0,
		required_tier_ids: []
	};
});
var upsertTier_createServerFn_handler = createServerRpc({
	id: "4725246a2da31bb40037710f22b8573a49a68f72959eb478421c99a07ab7635b",
	name: "upsertTier",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => upsertTier.__executeServer(opts));
var upsertTier = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(upsertTier_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { error } = await context.supabase.from("membership_tiers").upsert(data).select().single();
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteTier_createServerFn_handler = createServerRpc({
	id: "ec9e3f25aa3eeade546bdf63ba73a4cbba6610f09e3b65d0adb8eee23bf21d38",
	name: "deleteTier",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => deleteTier.__executeServer(opts));
var deleteTier = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(deleteTier_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { error } = await context.supabase.from("membership_tiers").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listUserMemberships_createServerFn_handler = createServerRpc({
	id: "e2ce16cfdd3ddc9c7f3229e395359e25ebd820426c68ecba64186cd270df15f1",
	name: "listUserMemberships",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => listUserMemberships.__executeServer(opts));
var listUserMemberships = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listUserMemberships_createServerFn_handler, async ({ context }) => {
	await ensureAdmin(context);
	const { data, error } = await context.supabase.from("user_memberships").select("*, tier:membership_tiers(name, slug, color, rank, gradient_from, gradient_to)").order("updated_at", { ascending: false }).limit(500);
	if (error) throw new Error(error.message);
	const rows = data ?? [];
	const userIds = Array.from(new Set(rows.map((row) => row.user_id).filter(Boolean)));
	if (userIds.length === 0) return [];
	const { data: profiles, error: profilesError } = await context.supabase.from("profiles").select("id, full_name, email").in("id", userIds);
	if (profilesError) throw new Error(profilesError.message);
	const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
	return rows.map((row) => ({
		...row,
		profile: profileById.get(row.user_id) ?? null
	}));
});
var listMembershipAssignableUsers_createServerFn_handler = createServerRpc({
	id: "0733e626ebed968ab60de66877c498f6ad4ac5bcb9951a1ce3845222c4049d02",
	name: "listMembershipAssignableUsers",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => listMembershipAssignableUsers.__executeServer(opts));
var listMembershipAssignableUsers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMembershipAssignableUsers_createServerFn_handler, async ({ context }) => {
	await ensureAdmin(context);
	const { data, error } = await context.supabase.from("profiles").select("id, full_name, email").order("created_at", { ascending: false }).limit(500);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var assignMembership_createServerFn_handler = createServerRpc({
	id: "955158c06bcb9fbe7a9d010a0c35506fc00dac3f6cd88763c51932a629d4dcd5",
	name: "assignMembership",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => assignMembership.__executeServer(opts));
var assignMembership = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(assignMembership_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	await context.supabase.from("user_memberships").update({ status: "cancelled" }).eq("user_id", data.user_id).eq("status", "active");
	const { error } = await context.supabase.from("user_memberships").insert({
		user_id: data.user_id,
		tier_id: data.tier_id,
		starts_at: data.starts_at ?? (/* @__PURE__ */ new Date()).toISOString(),
		expires_at: data.expires_at ?? null,
		source: "admin",
		status: "active",
		notes: data.notes ?? null
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var revokeMembership_createServerFn_handler = createServerRpc({
	id: "a0ea4c1e5eb42719bda44e7060480ce171baf91ec4945ff66e870470a4424f25",
	name: "revokeMembership",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => revokeMembership.__executeServer(opts));
var revokeMembership = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(revokeMembership_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { error } = await context.supabase.from("user_memberships").update({
		status: "cancelled",
		expires_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.membership_id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
async function activateMembership(supabase, userId, tier, source) {
	await supabase.from("user_memberships").update({ status: "cancelled" }).eq("user_id", userId).eq("status", "active");
	const expires = tier.duration_days ? new Date(Date.now() + Number(tier.duration_days) * 864e5).toISOString() : null;
	const { error } = await supabase.from("user_memberships").insert({
		user_id: userId,
		tier_id: tier.id,
		starts_at: (/* @__PURE__ */ new Date()).toISOString(),
		expires_at: expires,
		source,
		status: "active"
	});
	if (error) throw new Error(error.message);
	return expires;
}
var purchaseMembership_createServerFn_handler = createServerRpc({
	id: "250b1eacf9f579b0e5528008185c0c516b9d23b61b0cdf9810c96a783a416b76",
	name: "purchaseMembership",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => purchaseMembership.__executeServer(opts));
var purchaseMembership = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(purchaseMembership_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: tier, error: tErr } = await supabaseAdmin.from("membership_tiers").select("*").eq("id", data.tier_id).single();
	if (tErr) throw new Error(tErr.message);
	if (!tier) throw new Error("Tier not found");
	if (Number(tier.price_inr) > 0) {
		const { data: wallet } = await supabaseAdmin.from("wallets").select("id, balance_inr, frozen").eq("user_id", context.userId).maybeSingle();
		if (!wallet) throw new Error("Wallet not found. Please top-up your wallet first.");
		if (wallet.frozen) throw new Error("Wallet is frozen");
		if (Number(wallet.balance_inr) < Number(tier.price_inr)) throw new Error(`Insufficient wallet balance (need ₹${tier.price_inr}, have ₹${wallet.balance_inr}). Top-up your wallet or pay with card.`);
		const newBal = Number(wallet.balance_inr) - Number(tier.price_inr);
		await supabaseAdmin.from("wallets").update({ balance_inr: newBal }).eq("id", wallet.id);
		await supabaseAdmin.from("wallet_transactions").insert({
			wallet_id: wallet.id,
			user_id: context.userId,
			amount_inr: -Number(tier.price_inr),
			balance_after_inr: newBal,
			type: "debit",
			reference_type: "membership",
			reference_id: tier.id,
			note: `Membership: ${tier.name}`,
			description: `Membership: ${tier.name}`
		});
	}
	return {
		ok: true,
		expires_at: await activateMembership(supabaseAdmin, context.userId, tier, "purchase")
	};
});
var createMembershipRazorpayOrder_createServerFn_handler = createServerRpc({
	id: "062b3466561c27d254d07b68a9bbcbd235feb15f5b1a4818ca5376be561f406e",
	name: "createMembershipRazorpayOrder",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => createMembershipRazorpayOrder.__executeServer(opts));
var createMembershipRazorpayOrder = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createMembershipRazorpayOrder_createServerFn_handler, async ({ data, context }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: tier, error: tErr } = await supabaseAdmin.from("membership_tiers").select("*").eq("id", data.tier_id).single();
	if (tErr || !tier) throw new Error(tErr?.message ?? "Tier not found");
	const amt = Math.round(Number(tier.price_inr));
	if (amt <= 0) return {
		free: true,
		ok: true,
		expires_at: await activateMembership(supabaseAdmin, context.userId, tier, "purchase"),
		tier_id: tier.id,
		amount_inr: 0
	};
	const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
	const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
	if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return {
		demo: true,
		ok: true,
		expires_at: await activateMembership(supabaseAdmin, context.userId, tier, "purchase"),
		tier_id: tier.id,
		amount_inr: amt
	};
	const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			authorization: "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")
		},
		body: JSON.stringify({
			amount: amt * 100,
			currency: "INR",
			receipt: `mb_${Date.now()}`,
			notes: {
				user_id: context.userId,
				purpose: "membership",
				tier_id: tier.id
			}
		})
	});
	if (!rzpRes.ok) throw new Error(`Razorpay error: ${await rzpRes.text()}`);
	return {
		demo: false,
		razorpay_key_id: RAZORPAY_KEY_ID,
		razorpay_order_id: (await rzpRes.json()).id,
		tier_id: tier.id,
		tier_name: tier.name,
		amount_inr: amt
	};
});
var verifyMembershipPayment_createServerFn_handler = createServerRpc({
	id: "12888c00ab1478858ae86528d915c3e6e57b286c00e90436717a6fb4ab3ee85a",
	name: "verifyMembershipPayment",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => verifyMembershipPayment.__executeServer(opts));
var verifyMembershipPayment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(verifyMembershipPayment_createServerFn_handler, async ({ data, context }) => {
	const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
	const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
	if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) throw new Error("Payment gateway is not configured");
	if ((await import("crypto")).createHmac("sha256", RAZORPAY_KEY_SECRET).update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`).digest("hex") !== data.razorpay_signature) throw new Error("Invalid payment signature");
	const ordRes = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(data.razorpay_order_id)}`, { headers: { authorization: "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64") } });
	if (!ordRes.ok) throw new Error("Could not verify Razorpay order");
	const rzpOrder = await ordRes.json();
	const notesUserId = rzpOrder.notes?.user_id;
	const notesTierId = rzpOrder.notes?.tier_id;
	if (rzpOrder.notes?.purpose !== "membership") throw new Error("Order is not a membership purchase");
	if (!notesUserId || notesUserId !== context.userId) throw new Error("Order does not belong to this user");
	if (!notesTierId) throw new Error("Order is missing tier reference");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: tier, error } = await supabaseAdmin.from("membership_tiers").select("*").eq("id", notesTierId).single();
	if (error || !tier) throw new Error(error?.message ?? "Tier not found");
	const expectedAmount = Math.round(Number(tier.price_inr)) * 100;
	if (Number(rzpOrder.amount) < expectedAmount) throw new Error("Paid amount does not match tier price");
	return {
		ok: true,
		expires_at: await activateMembership(supabaseAdmin, context.userId, tier, "purchase")
	};
});
var PORTAL_SECTIONS = [
	{
		id: "courses",
		label: "Courses"
	},
	{
		id: "downloads",
		label: "Downloads"
	},
	{
		id: "licenses",
		label: "Licenses"
	},
	{
		id: "subscriptions",
		label: "Subscriptions"
	},
	{
		id: "affiliate",
		label: "Affiliate"
	},
	{
		id: "wallet",
		label: "Wallet"
	},
	{
		id: "orders",
		label: "Orders"
	},
	{
		id: "tickets",
		label: "Support tickets"
	}
];
var listAccessibleResources_createServerFn_handler = createServerRpc({
	id: "94a7efcfdea2aa37325cf72a6a6734167976558646b28a8e7d2e5fea3c8bc070",
	name: "listAccessibleResources",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => listAccessibleResources.__executeServer(opts));
var listAccessibleResources = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listAccessibleResources_createServerFn_handler, async ({ context }) => {
	await ensureAdmin(context);
	const [courses, products, categories] = await Promise.all([
		context.supabase.from("courses").select("id, title, slug").order("title"),
		context.supabase.from("products").select("id, name, slug").order("name"),
		context.supabase.from("categories").select("id, name, slug").order("name")
	]);
	return {
		courses: courses.data ?? [],
		products: products.data ?? [],
		categories: categories.data ?? [],
		portal_sections: PORTAL_SECTIONS.map((p) => ({
			id: p.id,
			name: p.label
		}))
	};
});
var listTierAccessSelections_createServerFn_handler = createServerRpc({
	id: "87be43479f55387e66938288f92f10fa290772d1fbe914a989697c71f9c926a5",
	name: "listTierAccessSelections",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => listTierAccessSelections.__executeServer(opts));
var listTierAccessSelections = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(listTierAccessSelections_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { data: rows, error } = await context.supabase.from("resource_access").select("resource_type, resource_id, min_tier_rank").eq("min_tier_rank", data.tier_rank);
	if (error) throw new Error(error.message);
	return (rows ?? []).map((row) => ({
		...row,
		resource_type: row.resource_type === "courses" ? "course" : row.resource_type === "products" ? "product" : row.resource_type === "categories" ? "category" : row.resource_type === "portal_sections" ? "portal_section" : row.resource_type
	}));
});
var saveTierAccessSelections_createServerFn_handler = createServerRpc({
	id: "dd0d021f8fea8bb2fc57dd425483e00a91df8c60eca2c7bbba7d71cfc74c35c9",
	name: "saveTierAccessSelections",
	filename: "src/lib/memberships.functions.ts"
}, (opts) => saveTierAccessSelections.__executeServer(opts));
var saveTierAccessSelections = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(saveTierAccessSelections_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { data: existing } = await context.supabase.from("resource_access").select("id, resource_type, resource_id, min_tier_rank").eq("min_tier_rank", data.tier_rank);
	const normalizeType = (type) => type === "courses" ? "course" : type === "products" ? "product" : type === "categories" ? "category" : type === "portal_sections" ? "portal_section" : type;
	const normalizedSelections = data.selections.map((s) => ({
		...s,
		resource_type: normalizeType(s.resource_type)
	}));
	const selectedKey = new Set(normalizedSelections.map((s) => `${s.resource_type}::${s.resource_id}`));
	const toRemove = (existing ?? []).filter((r) => !selectedKey.has(`${normalizeType(r.resource_type)}::${r.resource_id ?? ""}`));
	if (toRemove.length) await context.supabase.from("resource_access").delete().in("id", toRemove.map((r) => r.id));
	if (normalizedSelections.length) {
		const payload = normalizedSelections.map((s) => ({
			resource_type: s.resource_type,
			resource_id: s.resource_id,
			min_tier_rank: data.tier_rank
		}));
		const { error } = await context.supabase.from("resource_access").upsert(payload, { onConflict: "resource_type,resource_id" });
		if (error) throw new Error(error.message);
	}
	return {
		ok: true,
		updated: normalizedSelections.length,
		removed: toRemove.length
	};
});
//#endregion
export { assignMembership_createServerFn_handler, checkAccess_createServerFn_handler, createMembershipRazorpayOrder_createServerFn_handler, deleteTier_createServerFn_handler, getMyBenefits_createServerFn_handler, getMyMembership_createServerFn_handler, getResourceAccess_createServerFn_handler, listAccessibleResources_createServerFn_handler, listMembershipAssignableUsers_createServerFn_handler, listTierAccessSelections_createServerFn_handler, listTiers_createServerFn_handler, listUserMemberships_createServerFn_handler, purchaseMembership_createServerFn_handler, revokeMembership_createServerFn_handler, saveTierAccessSelections_createServerFn_handler, setResourceAccess_createServerFn_handler, upsertTier_createServerFn_handler, verifyMembershipPayment_createServerFn_handler };
