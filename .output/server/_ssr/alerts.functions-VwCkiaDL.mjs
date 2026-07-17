import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as normalizePlatformAlertSettings } from "./alert-settings-DkcV0gwP.mjs";
import { a as saveAlertSettings, i as safeDispatchAlert, n as loadAlertSettings, r as requireStaffFromRequest, t as getRequestUser } from "./alerts.server-BvHlDCty.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts.functions-VwCkiaDL.js
var getPlatformAlertSettings_createServerFn_handler = createServerRpc({
	id: "22ae3b9e5754388528b657ba84e1e9dc2cec119268df5feaafe30165f143a8eb",
	name: "getPlatformAlertSettings",
	filename: "src/lib/alerts.functions.ts"
}, (opts) => getPlatformAlertSettings.__executeServer(opts));
var getPlatformAlertSettings = createServerFn({ method: "GET" }).handler(getPlatformAlertSettings_createServerFn_handler, async () => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	await requireStaffFromRequest(supabaseAdmin);
	return loadAlertSettings(supabaseAdmin);
});
var savePlatformAlertSettings_createServerFn_handler = createServerRpc({
	id: "711d311206c0b4feab913614832bc5b56e260ab6be58e5fd87e3adbf2a8774b5",
	name: "savePlatformAlertSettings",
	filename: "src/lib/alerts.functions.ts"
}, (opts) => savePlatformAlertSettings.__executeServer(opts));
var savePlatformAlertSettings = createServerFn({ method: "POST" }).validator((input) => normalizePlatformAlertSettings(input)).handler(savePlatformAlertSettings_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { isAdmin } = await requireStaffFromRequest(supabaseAdmin);
	if (!isAdmin) throw new Error("Only admins can save alert settings.");
	return saveAlertSettings(supabaseAdmin, data);
});
var recordLoginAlert_createServerFn_handler = createServerRpc({
	id: "ec8f00622aba4e2d6da0837e30e536a5680c05494e4f5f4575763ac098c1fc0f",
	name: "recordLoginAlert",
	filename: "src/lib/alerts.functions.ts"
}, (opts) => recordLoginAlert.__executeServer(opts));
var recordLoginAlert = createServerFn({ method: "POST" }).validator((input) => input ?? {}).handler(recordLoginAlert_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const user = await getRequestUser(supabaseAdmin);
	const { data: profile } = await supabaseAdmin.from("profiles").select("full_name,email,phone").eq("id", user.id).maybeSingle();
	const { data: roles } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", user.id);
	const roleLabel = (roles ?? []).map((r) => r.role).join(", ") || "customer";
	await safeDispatchAlert(supabaseAdmin, {
		kind: "login",
		title: `Login detected · ${profile?.full_name ?? user.email ?? "User"}`,
		body: `${profile?.full_name ?? user.email ?? "A user"} signed in as ${roleLabel}.\nTime: ${data.at ?? (/* @__PURE__ */ new Date()).toISOString()}`,
		href: "/admin/users",
		user: true,
		userId: user.id,
		customerEmail: profile?.email ?? user.email,
		customerPhone: profile?.phone,
		customerTitle: "New sign-in to your account",
		customerBody: `We noticed a sign-in to your Infiniforge account.\nTime: ${data.at ?? (/* @__PURE__ */ new Date()).toISOString()}`,
		metadata: {
			user_id: user.id,
			roles: roleLabel
		}
	});
	return { ok: true };
});
var notifyProfileUpdated_createServerFn_handler = createServerRpc({
	id: "b6e719158f8dc96d46038448f209af576259d0027336f17bf979ea68fcb84b28",
	name: "notifyProfileUpdated",
	filename: "src/lib/alerts.functions.ts"
}, (opts) => notifyProfileUpdated.__executeServer(opts));
var notifyProfileUpdated = createServerFn({ method: "POST" }).validator((input) => input).handler(notifyProfileUpdated_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const user = await getRequestUser(supabaseAdmin);
	const { data: profile } = await supabaseAdmin.from("profiles").select("full_name,email,phone").eq("id", user.id).maybeSingle();
	const changed = data.changed?.length ? data.changed.join(", ") : "profile details";
	await safeDispatchAlert(supabaseAdmin, {
		kind: "profile",
		title: `Customer profile updated · ${profile?.full_name ?? user.email ?? "User"}`,
		body: `Updated fields: ${changed}`,
		href: "/admin/users",
		user: true,
		userId: user.id,
		customerEmail: profile?.email ?? user.email,
		customerPhone: profile?.phone,
		customerTitle: "Your profile was updated",
		customerBody: `Your Infiniforge profile changes were saved.\nUpdated fields: ${changed}`,
		metadata: {
			user_id: user.id,
			changed: data.changed ?? []
		}
	});
	return { ok: true };
});
var notifyTicketCreated_createServerFn_handler = createServerRpc({
	id: "2fa947d19101a9cc44d464dfc3952b6719da6bf81ec60112dd31001c086cd8e3",
	name: "notifyTicketCreated",
	filename: "src/lib/alerts.functions.ts"
}, (opts) => notifyTicketCreated.__executeServer(opts));
var notifyTicketCreated = createServerFn({ method: "POST" }).validator((input) => input).handler(notifyTicketCreated_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const user = await getRequestUser(supabaseAdmin);
	const { data: ticket } = await supabaseAdmin.from("tickets").select("*").eq("id", data.ticket_id).maybeSingle();
	if (!ticket) throw new Error("Ticket not found");
	const { data: isStaff } = await supabaseAdmin.rpc("is_staff", { _user_id: user.id });
	if (ticket.customer_id !== user.id && !isStaff) throw new Error("Forbidden");
	const { data: profile } = ticket.customer_id ? await supabaseAdmin.from("profiles").select("email,phone,full_name").eq("id", ticket.customer_id).maybeSingle() : { data: null };
	await safeDispatchAlert(supabaseAdmin, {
		kind: "ticket",
		title: `New support ticket · ${ticket.ticket_number ?? ticket.id.slice(0, 8)}`,
		body: `${ticket.subject}\nPriority: ${ticket.priority}\nDepartment: ${ticket.department}`,
		href: "/admin/tickets",
		user: true,
		userId: ticket.customer_id,
		customerEmail: profile?.email,
		customerPhone: profile?.phone,
		customerTitle: `Ticket received · ${ticket.ticket_number ?? ticket.subject}`,
		customerBody: `Your support ticket has been submitted.\nSubject: ${ticket.subject}`,
		metadata: {
			ticket_id: ticket.id,
			priority: ticket.priority,
			department: ticket.department
		}
	});
	return { ok: true };
});
var notifyOrderCreated_createServerFn_handler = createServerRpc({
	id: "22d2e9601d6995ced4ca2240f3c637650fd43d1cfa2fef43f7e412ba64ccb262",
	name: "notifyOrderCreated",
	filename: "src/lib/alerts.functions.ts"
}, (opts) => notifyOrderCreated.__executeServer(opts));
var notifyOrderCreated = createServerFn({ method: "POST" }).validator((input) => input).handler(notifyOrderCreated_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	await requireStaffFromRequest(supabaseAdmin);
	const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", data.order_id).maybeSingle();
	if (!order) throw new Error("Order not found");
	await safeDispatchAlert(supabaseAdmin, {
		kind: "order",
		title: `New manual order · ${order.order_number}`,
		body: `${order.customer_name ?? "Customer"} ordered ${order.product_name}.\nTotal: ₹${Number(order.total_inr ?? 0).toLocaleString("en-IN")}`,
		href: "/admin/orders",
		user: Boolean(order.customer_id),
		userId: order.customer_id,
		customerEmail: order.customer_email,
		customerPhone: order.customer_phone,
		customerTitle: `Order created · ${order.order_number}`,
		customerBody: `Your order for ${order.product_name} has been created.\nTotal: ₹${Number(order.total_inr ?? 0).toLocaleString("en-IN")}`,
		metadata: {
			order_id: order.id,
			order_number: order.order_number
		}
	});
	return { ok: true };
});
var updateOrderStatusWithAlert_createServerFn_handler = createServerRpc({
	id: "df8a47669bc6bf4d72d33dd5178eda59173cb191d0510cfdf0bb3ea14681aa99",
	name: "updateOrderStatusWithAlert",
	filename: "src/lib/alerts.functions.ts"
}, (opts) => updateOrderStatusWithAlert.__executeServer(opts));
var updateOrderStatusWithAlert = createServerFn({ method: "POST" }).validator((input) => input).handler(updateOrderStatusWithAlert_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { user } = await requireStaffFromRequest(supabaseAdmin);
	const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", data.id).maybeSingle();
	if (!order) throw new Error("Order not found");
	const { error } = await supabaseAdmin.from("orders").update({ status: data.status }).eq("id", data.id);
	if (error) throw new Error(error.message);
	await supabaseAdmin.from("admin_audit_logs").insert({
		actor_id: user.id,
		actor_email: user.email ?? null,
		action: "status.change",
		resource_type: "orders",
		resource_id: data.id,
		details: {
			status: data.status,
			order_number: order.order_number
		}
	});
	await safeDispatchAlert(supabaseAdmin, {
		kind: "order",
		title: `Order status changed · ${order.order_number}`,
		body: `${order.product_name} is now ${data.status}.\nCustomer: ${order.customer_name ?? order.customer_email ?? "—"}`,
		href: "/admin/orders",
		user: Boolean(order.customer_id),
		userId: order.customer_id,
		customerEmail: order.customer_email,
		customerPhone: order.customer_phone,
		customerTitle: `Order update · ${order.order_number}`,
		customerBody: `Your order for ${order.product_name} is now ${data.status}.`,
		metadata: {
			order_id: order.id,
			order_number: order.order_number,
			status: data.status
		}
	});
	return { ok: true };
});
var notifyAuditEvent_createServerFn_handler = createServerRpc({
	id: "03666a4836d754ea2a3104592f039a1d33808b66701cc1b71e577ec0a81569b6",
	name: "notifyAuditEvent",
	filename: "src/lib/alerts.functions.ts"
}, (opts) => notifyAuditEvent.__executeServer(opts));
var notifyAuditEvent = createServerFn({ method: "POST" }).validator((input) => input).handler(notifyAuditEvent_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { user } = await requireStaffFromRequest(supabaseAdmin);
	if (data.details?.test) return {
		ok: true,
		skipped: true
	};
	await safeDispatchAlert(supabaseAdmin, {
		kind: "audit",
		title: `Admin change · ${data.resource}`,
		body: `${user.email ?? "A staff user"} performed ${data.action} on ${data.resource}${data.resource_id ? ` (${data.resource_id})` : ""}.`,
		href: data.resource === "orders" ? "/admin/orders" : "/admin/audit-logs",
		user: false,
		metadata: {
			action: data.action,
			resource: data.resource,
			resource_id: data.resource_id ?? null
		}
	});
	return { ok: true };
});
//#endregion
export { getPlatformAlertSettings_createServerFn_handler, notifyAuditEvent_createServerFn_handler, notifyOrderCreated_createServerFn_handler, notifyProfileUpdated_createServerFn_handler, notifyTicketCreated_createServerFn_handler, recordLoginAlert_createServerFn_handler, savePlatformAlertSettings_createServerFn_handler, updateOrderStatusWithAlert_createServerFn_handler };
