import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { n as getRequestHeader } from "./request-response-BDiR3rEX.mjs";
import { i as safeDispatchAlert } from "./alerts.server-BvHlDCty.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments.functions-E5QlsQWT.js
async function getUserFromAuthHeader() {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const authHeader = getRequestHeader("authorization");
	if (!authHeader) return null;
	const token = authHeader.replace(/^Bearer\s+/i, "");
	const { data } = await supabaseAdmin.auth.getUser(token);
	return data.user ?? null;
}
function orderNumber() {
	const d = /* @__PURE__ */ new Date();
	return `INF-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
function invoiceNumber() {
	const d = /* @__PURE__ */ new Date();
	const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
	return `INV-${d.getFullYear()}-${rand}`;
}
function formatINRPlain(value) {
	return `₹${Math.round(value).toLocaleString("en-IN")}`;
}
async function getProfileForAlert(userId) {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data } = await supabaseAdmin.from("profiles").select("full_name,email,phone").eq("id", userId).maybeSingle();
	return data;
}
async function notifyOrderEvent(userId, orders, phase) {
	if (!orders.length) return;
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const profile = await getProfileForAlert(userId);
	const total = orders.reduce((s, o) => s + Number(o.total_inr ?? 0), 0);
	const orderNumbers = orders.map((o) => String(o.order_number ?? "")).filter(Boolean).join(", ");
	const productLines = orders.map((o) => `• ${o.product_name} — ${formatINRPlain(Number(o.total_inr ?? 0))}`).join("\n");
	await safeDispatchAlert(supabaseAdmin, {
		kind: "order",
		title: phase === "paid" ? `Payment received · ${orders[0].invoice_number ?? orderNumbers}` : `New order placed · ${orders[0].invoice_number ?? orderNumbers}`,
		body: `${profile?.full_name ?? orders[0].customer_name ?? "Customer"} placed ${orders.length} order item${orders.length > 1 ? "s" : ""}.\n${productLines}\nTotal: ${formatINRPlain(total)}`,
		href: "/admin/orders",
		user: true,
		userId,
		customerEmail: String(orders[0].customer_email ?? profile?.email ?? ""),
		customerPhone: String(orders[0].customer_phone ?? profile?.phone ?? ""),
		customerTitle: phase === "paid" ? `Payment successful · ${orders[0].invoice_number ?? orderNumbers}` : `Order received · ${orders[0].invoice_number ?? orderNumbers}`,
		customerBody: phase === "paid" ? `Your payment was successful.\n${productLines}\nTotal paid: ${formatINRPlain(total)}` : `We received your order.\n${productLines}\nTotal: ${formatINRPlain(total)}`,
		metadata: {
			order_ids: orders.map((o) => o.id),
			invoice_number: orders[0].invoice_number,
			phase
		}
	});
}
async function notifyWalletEvent(userId, amount, balance, note, type) {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const profile = await getProfileForAlert(userId);
	const verb = type === "credit" ? "credited" : "debited";
	await safeDispatchAlert(supabaseAdmin, {
		kind: "wallet",
		title: `Wallet ${verb} · ${profile?.full_name ?? profile?.email ?? "Customer"}`,
		body: `${formatINRPlain(Math.abs(amount))} ${verb}.\nBalance: ${formatINRPlain(balance)}\n${note}`,
		href: "/admin/wallets",
		user: true,
		userId,
		customerEmail: profile?.email,
		customerPhone: profile?.phone,
		customerTitle: `Wallet ${verb}`,
		customerBody: `${formatINRPlain(Math.abs(amount))} was ${verb} in your wallet.\nBalance: ${formatINRPlain(balance)}\n${note}`,
		metadata: {
			amount_inr: amount,
			balance_after_inr: balance,
			type,
			note
		}
	});
}
async function creditWallet(userId, amount, note, refType = "topup", refId) {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: w } = await supabaseAdmin.from("wallets").select("id, balance_inr").eq("user_id", userId).maybeSingle();
	if (!w) return;
	const newBal = Number(w.balance_inr ?? 0) + amount;
	await supabaseAdmin.from("wallets").update({ balance_inr: newBal }).eq("id", w.id);
	await supabaseAdmin.from("wallet_transactions").insert({
		wallet_id: w.id,
		user_id: userId,
		amount_inr: amount,
		balance_after_inr: newBal,
		type: "credit",
		reference_type: refType,
		reference_id: refId ?? null,
		note,
		description: note
	});
	await notifyWalletEvent(userId, amount, newBal, note, "credit");
}
async function deductWallet(userId, amount, note, orderId) {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: w } = await supabaseAdmin.from("wallets").select("id, balance_inr").eq("user_id", userId).maybeSingle();
	if (!w) return;
	const newBal = Math.max(0, Number(w.balance_inr ?? 0) - amount);
	await supabaseAdmin.from("wallets").update({ balance_inr: newBal }).eq("id", w.id);
	await supabaseAdmin.from("wallet_transactions").insert({
		wallet_id: w.id,
		user_id: userId,
		amount_inr: -amount,
		balance_after_inr: newBal,
		type: "debit",
		reference_type: "order",
		reference_id: orderId ?? null,
		note,
		description: note
	});
	await notifyWalletEvent(userId, -amount, newBal, note, "debit");
}
var createCheckout_createServerFn_handler = createServerRpc({
	id: "69ad7f0f5f10059b119e512f5ffd71af45c019280d02b4bd5c57f998c631e2a9",
	name: "createCheckout",
	filename: "src/lib/payments.functions.ts"
}, (opts) => createCheckout.__executeServer(opts));
var createCheckout = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(createCheckout_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const user = await getUserFromAuthHeader();
	if (!user) throw new Error("You must be signed in to check out.");
	if (!data.items?.length) throw new Error("Cart is empty.");
	const subtotal = data.items.reduce((s, i) => s + Math.max(0, i.price_inr) * Math.max(1, i.qty), 0);
	const gst = data.items.reduce((s, i) => s + i.price_inr * i.qty * i.gst_percent / 100, 0);
	let total = Math.round((subtotal + gst) * 100) / 100;
	let discount = 0;
	if (data.coupon_code) {
		const { data: c } = await supabaseAdmin.from("coupons").select("*").eq("code", data.coupon_code.toUpperCase()).eq("status", "active").maybeSingle();
		if (c) {
			const val = Number(c.discount_value ?? 0);
			discount = c.discount_type === "percent" ? Math.round(total * val / 100 * 100) / 100 : Math.min(total, val);
		}
	}
	let walletApplied = 0;
	if (data.use_wallet) {
		const { data: w } = await supabaseAdmin.from("wallets").select("balance_inr, frozen").eq("user_id", user.id).maybeSingle();
		if (w && !w.frozen) walletApplied = Math.min(Number(w.balance_inr ?? 0), Math.max(0, total - discount));
	}
	const payable = Math.max(0, Math.round((total - discount - walletApplied) * 100) / 100);
	const commonOrderNo = orderNumber();
	const invoiceNo = invoiceNumber();
	const orderRows = data.items.map((i, idx) => ({
		order_number: `${commonOrderNo}-${idx + 1}`,
		invoice_number: invoiceNo,
		customer_id: user.id,
		customer_email: data.customer_email,
		customer_name: data.customer_name,
		customer_phone: data.customer_phone ?? null,
		customer_gstin: data.gstin ?? null,
		billing_address_line1: data.billing_address_line1 ?? null,
		billing_address_line2: data.billing_address_line2 ?? null,
		billing_city: data.billing_city ?? null,
		billing_state: data.billing_state ?? null,
		billing_postal_code: data.billing_postal_code ?? null,
		billing_country: data.billing_country ?? null,
		product_id: i.id,
		product_name: i.name,
		quantity: i.qty,
		amount_inr: i.price_inr * i.qty,
		gst_percent: i.gst_percent,
		gst_inr: i.price_inr * i.qty * i.gst_percent / 100,
		total_inr: i.price_inr * i.qty * (1 + i.gst_percent / 100),
		status: payable === 0 ? "paid" : "pending",
		payment_method: payable === 0 ? "wallet" : "razorpay",
		coupon_code: data.coupon_code ?? null,
		wallet_applied_inr: idx === 0 ? walletApplied : 0,
		billing_cycle: i.billing
	}));
	if (data.save_to_profile) await supabaseAdmin.from("profiles").update({
		full_name: data.customer_name,
		phone: data.customer_phone ?? null,
		gstin: data.gstin ?? null,
		address_line1: data.billing_address_line1 ?? null,
		address_line2: data.billing_address_line2 ?? null,
		city: data.billing_city ?? null,
		state: data.billing_state ?? null,
		postal_code: data.billing_postal_code ?? null,
		country: data.billing_country ?? null
	}).eq("id", user.id);
	const { data: inserted, error: insErr } = await supabaseAdmin.from("orders").insert(orderRows).select("*");
	if (insErr) throw new Error(insErr.message);
	const orderIds = (inserted ?? []).map((o) => o.id);
	await notifyOrderEvent(user.id, inserted ?? [], "created");
	if (payable === 0 && walletApplied > 0) {
		await deductWallet(user.id, walletApplied, `Order ${commonOrderNo}`, orderIds[0]);
		await supabaseAdmin.from("orders").update({ paid_at: (/* @__PURE__ */ new Date()).toISOString() }).in("id", orderIds);
		const { data: paidOrders } = await supabaseAdmin.from("orders").select("*").in("id", orderIds);
		if (paidOrders?.length) await issueLicensesForOrders(user.id, paidOrders);
		if (paidOrders?.length) await notifyOrderEvent(user.id, paidOrders, "paid");
		return {
			demo: true,
			fully_wallet: true,
			order_group: commonOrderNo,
			order_ids: orderIds,
			payable_inr: 0,
			wallet_applied_inr: walletApplied,
			discount_inr: discount,
			invoice_number: invoiceNo
		};
	}
	const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
	const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
	if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return {
		demo: true,
		fully_wallet: false,
		razorpay_key_id: null,
		razorpay_order_id: `demo_${Date.now()}`,
		order_group: commonOrderNo,
		order_ids: orderIds,
		payable_inr: payable,
		wallet_applied_inr: walletApplied,
		discount_inr: discount,
		invoice_number: invoiceNo
	};
	const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			authorization: "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")
		},
		body: JSON.stringify({
			amount: Math.round(payable * 100),
			currency: "INR",
			receipt: commonOrderNo,
			notes: {
				user_id: user.id,
				order_group: commonOrderNo
			}
		})
	});
	if (!rzpRes.ok) throw new Error(`Razorpay order failed: ${await rzpRes.text()}`);
	const rzp = await rzpRes.json();
	await supabaseAdmin.from("orders").update({ razorpay_order_id: rzp.id }).in("id", orderIds);
	return {
		demo: false,
		fully_wallet: false,
		razorpay_key_id: RAZORPAY_KEY_ID,
		razorpay_order_id: rzp.id,
		order_group: commonOrderNo,
		order_ids: orderIds,
		payable_inr: payable,
		wallet_applied_inr: walletApplied,
		discount_inr: discount,
		invoice_number: invoiceNo
	};
});
function makeLicenseKey(seed) {
	const mix = (seed.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().padEnd(16, "X") + Math.random().toString(36).slice(2, 8).toUpperCase()).slice(0, 16);
	return `INFG-${mix.slice(0, 4)}-${mix.slice(4, 8)}-${mix.slice(8, 12)}-${mix.slice(12, 16)}`;
}
async function issueLicensesForOrders(userId, orders) {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const productIds = Array.from(new Set(orders.map((o) => o.product_id).filter(Boolean)));
	if (!productIds.length) return;
	const { data: products } = await supabaseAdmin.from("products").select("id, product_type, name").in("id", productIds);
	const typeById = new Map((products ?? []).map((p) => [p.id, p.product_type]));
	const rows = [];
	for (const o of orders) {
		const pid = o.product_id;
		if (!pid) continue;
		const ptype = typeById.get(pid);
		if (!ptype || ![
			"license",
			"saas",
			"subscription"
		].includes(ptype)) continue;
		const { data: existing } = await supabaseAdmin.from("module_records").select("id").eq("module", "licenses").contains("metadata", { order_id: o.id }).limit(1);
		if (existing && existing.length) continue;
		const cycle = o.billing_cycle ?? "one-time";
		const expires = /* @__PURE__ */ new Date();
		if (cycle === "monthly" || cycle === "mo") expires.setMonth(expires.getMonth() + 1);
		else if (cycle === "yearly" || cycle === "yr") expires.setFullYear(expires.getFullYear() + 1);
		else expires.setFullYear(expires.getFullYear() + 1);
		const orderId = o.id;
		const key = makeLicenseKey(orderId);
		const tier = cycle === "one-time" ? "annual" : cycle;
		rows.push({
			module: "licenses",
			title: o.product_name,
			subtitle: `License for ${o.order_number}`,
			status: "active",
			owner_id: userId,
			customer_id: userId,
			amount_inr: Number(o.total_inr ?? 0),
			due_at: expires.toISOString(),
			tags: [ptype, cycle],
			metadata: {
				license_key: key,
				tier,
				product_id: pid,
				order_id: orderId,
				order_number: o.order_number,
				invoice_number: o.invoice_number,
				customer_email: o.customer_email,
				customer_name: o.customer_name,
				issued_at: (/* @__PURE__ */ new Date()).toISOString(),
				activation_limit: 3,
				activations: 0
			}
		});
	}
	if (rows.length) await supabaseAdmin.from("module_records").insert(rows);
}
async function finalizeOrders(userId, orderIds, paymentId, orderRef) {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: orders } = await supabaseAdmin.from("orders").select("*").in("id", orderIds);
	if (!orders?.length) throw new Error("Orders not found");
	for (const o of orders) {
		if (o.customer_id !== userId) throw new Error("Order does not belong to this user");
		if (!orderRef.startsWith("demo_") && o.razorpay_order_id && o.razorpay_order_id !== orderRef) throw new Error("Order does not match verified payment");
	}
	const totalWalletApplied = orders.reduce((s, o) => s + Number(o.wallet_applied_inr ?? 0), 0);
	const totalPaid = orders.reduce((s, o) => s + Number(o.total_inr ?? 0), 0) - totalWalletApplied;
	await supabaseAdmin.from("orders").update({
		status: "paid",
		payment_id: paymentId,
		razorpay_payment_id: paymentId,
		razorpay_order_id: orderRef,
		paid_at: (/* @__PURE__ */ new Date()).toISOString()
	}).in("id", orderIds);
	if (totalWalletApplied > 0) await deductWallet(userId, totalWalletApplied, `Applied to ${orders[0].order_number}`, orders[0].id);
	try {
		await supabaseAdmin.from("payments").insert({
			user_id: userId,
			order_id: orders[0].id,
			amount_inr: totalPaid,
			method: "razorpay",
			gateway_reference: paymentId,
			status: "success"
		});
	} catch {}
	for (const o of orders) {
		const cycle = o.billing_cycle;
		if (cycle && cycle !== "one-time") {
			const next = /* @__PURE__ */ new Date();
			if (cycle === "monthly" || cycle === "mo") next.setMonth(next.getMonth() + 1);
			else if (cycle === "yearly" || cycle === "yr") next.setFullYear(next.getFullYear() + 1);
			try {
				await supabaseAdmin.from("subscriptions").insert({
					customer_id: userId,
					product_id: o.product_id,
					plan: o.product_name,
					amount_inr: Number(o.total_inr),
					billing_cycle: cycle,
					status: "active",
					current_period_end: next.toISOString()
				});
			} catch {}
		}
	}
	await issueLicensesForOrders(userId, orders);
	await notifyOrderEvent(userId, orders, "paid");
	return {
		ok: true,
		order_ids: orderIds,
		invoice_number: orders[0].invoice_number
	};
}
var verifyPayment_createServerFn_handler = createServerRpc({
	id: "3082e488c4a8779ced42ff7d7eb0cb04aaf3c1cba345399c512c9e4e1bae4239",
	name: "verifyPayment",
	filename: "src/lib/payments.functions.ts"
}, (opts) => verifyPayment.__executeServer(opts));
var verifyPayment = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(verifyPayment_createServerFn_handler, async ({ data }) => {
	const user = await getUserFromAuthHeader();
	if (!user) throw new Error("Unauthorized");
	const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
	if (RAZORPAY_KEY_SECRET) {
		if ((await import("crypto")).createHmac("sha256", RAZORPAY_KEY_SECRET).update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`).digest("hex") !== data.razorpay_signature) throw new Error("Invalid payment signature");
	}
	return finalizeOrders(user.id, data.order_ids, data.razorpay_payment_id, data.razorpay_order_id);
});
var confirmDemoPayment_createServerFn_handler = createServerRpc({
	id: "42b45334dc5748cd6d77c02771f440e3f398c0475985f2ff6ffd359c04e2a0e1",
	name: "confirmDemoPayment",
	filename: "src/lib/payments.functions.ts"
}, (opts) => confirmDemoPayment.__executeServer(opts));
var confirmDemoPayment = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(confirmDemoPayment_createServerFn_handler, async ({ data }) => {
	const user = await getUserFromAuthHeader();
	if (!user) throw new Error("Unauthorized");
	if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) throw new Error("Demo payment is disabled — use the payment gateway");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: rows } = await supabaseAdmin.from("orders").select("id, customer_id, status").in("id", data.order_ids);
	if (!rows?.length) throw new Error("Orders not found");
	for (const o of rows) {
		if (o.customer_id !== user.id) throw new Error("Order does not belong to this user");
		if (o.status === "paid") throw new Error("Order already paid");
	}
	return finalizeOrders(user.id, data.order_ids, `demo_pay_${Date.now()}`, `demo_${data.order_group}`);
});
var createWalletTopup_createServerFn_handler = createServerRpc({
	id: "9fd3b9de945f6995873b79bc4d3ef1c4aaadf74767f4cbd2a983d3b09663be27",
	name: "createWalletTopup",
	filename: "src/lib/payments.functions.ts"
}, (opts) => createWalletTopup.__executeServer(opts));
var createWalletTopup = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(createWalletTopup_createServerFn_handler, async ({ data }) => {
	const user = await getUserFromAuthHeader();
	if (!user) throw new Error("Unauthorized");
	const amt = Math.max(100, Math.min(5e5, Math.round(data.amount_inr)));
	const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
	const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
	if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
		await creditWallet(user.id, amt, "Wallet top-up (demo mode)");
		return {
			demo: true,
			credited_inr: amt
		};
	}
	const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			authorization: "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")
		},
		body: JSON.stringify({
			amount: amt * 100,
			currency: "INR",
			receipt: `wt_${Date.now()}`,
			notes: {
				user_id: user.id,
				purpose: "wallet_topup",
				amount: amt
			}
		})
	});
	if (!rzpRes.ok) throw new Error(`Razorpay error: ${await rzpRes.text()}`);
	return {
		demo: false,
		razorpay_key_id: RAZORPAY_KEY_ID,
		razorpay_order_id: (await rzpRes.json()).id,
		amount_inr: amt
	};
});
var verifyWalletTopup_createServerFn_handler = createServerRpc({
	id: "1561f9fc062bfa789ae8e48ffb0159f33e07a7f772231ccc7c4b25b23ef10531",
	name: "verifyWalletTopup",
	filename: "src/lib/payments.functions.ts"
}, (opts) => verifyWalletTopup.__executeServer(opts));
var verifyWalletTopup = createServerFn({ method: "POST" }).inputValidator((d) => d).handler(verifyWalletTopup_createServerFn_handler, async ({ data }) => {
	const user = await getUserFromAuthHeader();
	if (!user) throw new Error("Unauthorized");
	const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
	if (RAZORPAY_KEY_SECRET) {
		if ((await import("crypto")).createHmac("sha256", RAZORPAY_KEY_SECRET).update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`).digest("hex") !== data.razorpay_signature) throw new Error("Invalid payment signature");
	}
	await creditWallet(user.id, data.amount_inr, "Wallet top-up", "topup", data.razorpay_payment_id);
	return {
		ok: true,
		credited_inr: data.amount_inr
	};
});
//#endregion
export { confirmDemoPayment_createServerFn_handler, createCheckout_createServerFn_handler, createWalletTopup_createServerFn_handler, verifyPayment_createServerFn_handler, verifyWalletTopup_createServerFn_handler };
