import { t as supabase } from "./client-CkD8icLT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vps-billing-DmHiUlI3.js
var CYCLE_MONTHS = {
	monthly: 1,
	quarterly: 3,
	yearly: 12,
	one_time: 0
};
var CYCLE_LABEL = {
	monthly: "Monthly",
	quarterly: "Quarterly (3 months)",
	yearly: "Yearly (12 months)",
	one_time: "One-time (no renewal)"
};
var PAYMENT_METHOD_LABEL = {
	wallet: "Customer wallet",
	razorpay: "Online (Razorpay / UPI / Card)",
	bank_transfer: "Bank transfer / NEFT",
	cash: "Cash",
	complimentary: "Complimentary / Marked as paid"
};
/** Presets that mirror the /hosting page VPS plans so admins can 1-click populate specs+price. */
var HOSTING_VPS_PRESETS = [
	{
		id: "vps-lite",
		name: "VPS Lite",
		plan: "VPS Lite",
		cpu: 2,
		ram: 4,
		storage: 80,
		bandwidth: 2e3,
		price: 599
	},
	{
		id: "vps-pro",
		name: "VPS Pro",
		plan: "VPS Pro",
		cpu: 4,
		ram: 8,
		storage: 160,
		bandwidth: 4e3,
		price: 1799
	},
	{
		id: "vps-scale",
		name: "VPS Scale",
		plan: "VPS Scale",
		cpu: 8,
		ram: 16,
		storage: 320,
		bandwidth: 8e3,
		price: 3499
	}
];
function addMonthsISO(fromIso, months) {
	const from = fromIso ? new Date(fromIso) : /* @__PURE__ */ new Date();
	const d = new Date(from);
	d.setMonth(d.getMonth() + months);
	return d.toISOString();
}
function computeTotals(amount, gstPercent) {
	const base = Math.max(0, Number(amount) || 0);
	const gstPct = Math.max(0, Number(gstPercent) || 0);
	const gst = Math.round(base * gstPct) / 100;
	return {
		base,
		gst,
		total: Math.round((base + gst) * 100) / 100
	};
}
function isPaidOnCreate(method) {
	return method === "wallet" || method === "complimentary" || method === "cash" || method === "bank_transfer";
}
/**
* Insert an order/invoice for a VPS. Returns the inserted order row.
* Status is 'paid' for offline/wallet methods and 'pending' for razorpay.
*/
async function createVpsOrder(args) {
	const { base, gst, total } = computeTotals(args.amountInr, args.gstPercent);
	const paid = isPaidOnCreate(args.paymentMethod);
	const productName = args.plan ? `VPS — ${args.vpsTitle} (${args.plan})` : `VPS — ${args.vpsTitle}`;
	const payload = {
		customer_id: args.customerId,
		product_name: productName,
		customer_name: args.customerName ?? null,
		customer_email: args.customerEmail ?? null,
		customer_phone: args.customerPhone ?? null,
		amount_inr: base,
		gst_percent: args.gstPercent,
		gst_inr: gst,
		total_inr: total,
		quantity: args.quantity ?? 1,
		status: paid ? "paid" : "pending",
		payment_method: args.paymentMethod,
		billing_cycle: args.billingCycle,
		paid_at: paid ? (/* @__PURE__ */ new Date()).toISOString() : null,
		notes: args.notes ?? (args.hostname ? `Hostname: ${args.hostname}` : null)
	};
	const { data, error } = await supabase.from("orders").insert(payload).select("*").single();
	if (error) throw error;
	if (data && !data.invoice_number) {
		await supabase.from("orders").update({ invoice_number: data.order_number }).eq("id", data.id);
		data.invoice_number = data.order_number;
	}
	return data;
}
/** Debit a customer's wallet for a paid-with-wallet VPS order. */
async function debitWalletForOrder(args) {
	const { data: w, error: wErr } = await supabase.from("wallets").select("id, balance_inr").eq("user_id", args.customerId).maybeSingle();
	if (wErr) throw wErr;
	if (!w) throw new Error("Customer wallet not found.");
	const bal = Number(w.balance_inr ?? 0);
	if (bal < args.amount) throw new Error(`Insufficient wallet balance (₹${bal.toFixed(2)} < ₹${args.amount.toFixed(2)}).`);
	const balanceAfter = Math.round((bal - args.amount) * 100) / 100;
	const { error: uErr } = await supabase.from("wallets").update({ balance_inr: balanceAfter }).eq("id", w.id);
	if (uErr) throw uErr;
	const { error: tErr } = await supabase.from("wallet_transactions").insert({
		wallet_id: w.id,
		user_id: args.customerId,
		amount_inr: args.amount,
		type: "debit",
		description: args.description,
		balance_after_inr: balanceAfter,
		reference_type: "order",
		reference_id: args.orderId
	});
	if (tErr) throw tErr;
}
/** Notify the customer that their VPS was provisioned / invoiced / renewed. */
async function notifyCustomerVps(args) {
	const { error } = await supabase.from("notifications").insert({
		audience: "user",
		user_id: args.customerId,
		title: args.title,
		body: args.body,
		href: args.href ?? "/portal/vps",
		kind: args.kind ?? "vps"
	});
	if (error) throw error;
}
//#endregion
export { addMonthsISO as a, debitWalletForOrder as c, PAYMENT_METHOD_LABEL as i, notifyCustomerVps as l, CYCLE_MONTHS as n, computeTotals as o, HOSTING_VPS_PRESETS as r, createVpsOrder as s, CYCLE_LABEL as t };
