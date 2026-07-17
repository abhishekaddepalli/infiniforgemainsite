import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-users.functions-DcS2wimb.js
async function ensureAdmin(context) {
	const { data, error } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Forbidden: admin only");
}
var inviteUser_createServerFn_handler = createServerRpc({
	id: "c9f6ae4d8ad0cd6c9ce6374befb5f970e5263bbdca7f82b7d94e3836da5e771c",
	name: "inviteUser",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => inviteUser.__executeServer(opts));
var inviteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(inviteUser_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const origin = process.env.SITE_URL || "";
	const { data: res, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
		data: { full_name: data.full_name ?? "" },
		redirectTo: origin ? `${origin}/reset-password` : void 0
	});
	if (error) throw new Error(error.message);
	const userId = res.user?.id;
	if (userId && data.role && data.role !== "customer") await supabaseAdmin.from("user_roles").upsert({
		user_id: userId,
		role: data.role
	}, { onConflict: "user_id,role" });
	return {
		ok: true,
		userId
	};
});
var deleteUser_createServerFn_handler = createServerRpc({
	id: "6825df580faeca88f7d9ef3e1218c16ef32fd7ee1ff3bd0b96717bcccd44ccfb",
	name: "deleteUser",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => deleteUser.__executeServer(opts));
var deleteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(deleteUser_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	if (data.userId === context.userId) throw new Error("You cannot delete your own account");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var adminSetPassword_createServerFn_handler = createServerRpc({
	id: "0d0c07a65c0857a08946e2697199515335f20099bc56aa4650be6a1beb0700ce",
	name: "adminSetPassword",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => adminSetPassword.__executeServer(opts));
var adminSetPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminSetPassword_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	if (data.password.length < 8) throw new Error("Password must be at least 8 characters");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, { password: data.password });
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { adminSetPassword_createServerFn_handler, deleteUser_createServerFn_handler, inviteUser_createServerFn_handler };
