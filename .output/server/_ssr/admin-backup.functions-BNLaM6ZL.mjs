import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-backup.functions-BNLaM6ZL.js
var BACKUP_TABLES = [
	"profiles",
	"user_roles",
	"categories",
	"products",
	"coupons",
	"orders",
	"payments",
	"subscriptions",
	"wallets",
	"wallet_transactions",
	"tickets",
	"ticket_replies",
	"module_records",
	"admin_audit_logs"
];
async function ensureAdmin(context) {
	const { data, error } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Forbidden: admin only");
}
var exportBackup_createServerFn_handler = createServerRpc({
	id: "32c075db7961294993b3aa50cf59712ee6995c9ce710e14d6a23434d9748f55f",
	name: "exportBackup",
	filename: "src/lib/admin-backup.functions.ts"
}, (opts) => exportBackup.__executeServer(opts));
var exportBackup = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(exportBackup_createServerFn_handler, async ({ context }) => {
	await ensureAdmin(context);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const tables = {};
	const counts = {};
	for (const t of BACKUP_TABLES) {
		const { data, error } = await supabaseAdmin.from(t).select("*");
		if (error) throw new Error(`${t}: ${error.message}`);
		tables[t] = data ?? [];
		counts[t] = (data ?? []).length;
	}
	const payload = {
		version: 1,
		generated_at: (/* @__PURE__ */ new Date()).toISOString(),
		generated_by: context.userId,
		counts,
		tables
	};
	return {
		json: JSON.stringify(payload),
		counts,
		generated_at: payload.generated_at
	};
});
var importBackup_createServerFn_handler = createServerRpc({
	id: "2b3f35f6071efb66ec2b3b3ec6762f07ffb1befb37d060b6a6d0567581d28168",
	name: "importBackup",
	filename: "src/lib/admin-backup.functions.ts"
}, (opts) => importBackup.__executeServer(opts));
var importBackup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(importBackup_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	let payload;
	try {
		payload = JSON.parse(data.json);
	} catch {
		throw new Error("Invalid JSON backup file");
	}
	if (!payload || payload.version !== 1) throw new Error("Unsupported backup version");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const results = {};
	if (data.mode === "replace") for (const t of [...BACKUP_TABLES].reverse()) {
		if (t === "profiles" || t === "user_roles") continue;
		await supabaseAdmin.from(t).delete().neq("id", "00000000-0000-0000-0000-000000000000");
	}
	for (const t of BACKUP_TABLES) {
		const rows = payload.tables?.[t] ?? [];
		if (rows.length === 0) {
			results[t] = {
				restored: 0,
				skipped: 0
			};
			continue;
		}
		const chunkSize = 500;
		let restored = 0;
		let lastError;
		for (let i = 0; i < rows.length; i += chunkSize) {
			const chunk = rows.slice(i, i + chunkSize);
			const { error, count } = await supabaseAdmin.from(t).upsert(chunk, {
				onConflict: "id",
				count: "exact"
			});
			if (error) {
				lastError = error.message;
				break;
			}
			restored += count ?? chunk.length;
		}
		results[t] = {
			restored,
			skipped: rows.length - restored,
			error: lastError
		};
	}
	return {
		ok: true,
		results
	};
});
var listBackupTables_createServerFn_handler = createServerRpc({
	id: "beb33d1d6fdde3a9e0438650ed8b4d7a78ea9e1b8efd1836729b5037f212da62",
	name: "listBackupTables",
	filename: "src/lib/admin-backup.functions.ts"
}, (opts) => listBackupTables.__executeServer(opts));
var listBackupTables = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listBackupTables_createServerFn_handler, async ({ context }) => {
	await ensureAdmin(context);
	return { tables: BACKUP_TABLES };
});
//#endregion
export { exportBackup_createServerFn_handler, importBackup_createServerFn_handler, listBackupTables_createServerFn_handler };
