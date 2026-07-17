import { t as supabase } from "./client-CkD8icLT.mjs";
import { n as notifyAuditEvent } from "./alerts.functions-BIA4cKEy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-BROAe_E-.js
/**
* Fire-and-forget audit logger. Never throws — logging must not break UX.
* Records who (auth.uid + email), what, on which resource.
*/
async function logAudit(entry) {
	try {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return;
		await supabase.from("admin_audit_logs").insert({
			actor_id: user.id,
			actor_email: user.email ?? null,
			action: entry.action,
			resource_type: entry.resource,
			resource_id: entry.resource_id ?? null,
			target_user_id: entry.target_user_id ?? null,
			details: entry.details ?? {}
		});
		notifyAuditEvent({ data: entry }).catch(() => void 0);
	} catch {}
}
//#endregion
export { logAudit as t };
