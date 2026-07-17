//#region node_modules/.nitro/vite/services/ssr/assets/whatsapp-Bfedub3g.js
var WA_DEFAULTS = {
	wa_ordering_enabled: false,
	wa_ordering_number: "",
	wa_ordering_label: "Order on WhatsApp",
	wa_ordering_greeting: "Hello Infiniforge Technologies 👋",
	wa_ordering_template: "premium",
	wa_ordering_show_products: true,
	wa_ordering_show_checkout: true,
	wa_ordering_show_header: true
};
var LS_KEY = "infiniforge.settings";
function getWhatsAppConfig() {
	if (typeof window === "undefined") return WA_DEFAULTS;
	try {
		const raw = localStorage.getItem(LS_KEY);
		if (!raw) return WA_DEFAULTS;
		const parsed = JSON.parse(raw);
		return {
			...WA_DEFAULTS,
			...parsed
		};
	} catch {
		return WA_DEFAULTS;
	}
}
/** Strip everything except digits (WhatsApp wants a bare international number). */
function normalizeWhatsAppNumber(input) {
	return (input ?? "").replace(/[^\d]/g, "");
}
function buildWhatsAppLink(number, message) {
	return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;
}
var WHATSAPP_TEMPLATES = [
	{
		id: "premium",
		label: "Premium",
		description: "Rich, branded layout with emojis, dividers and totals."
	},
	{
		id: "invoice",
		label: "Invoice",
		description: "Formal invoice-style breakdown with line totals."
	},
	{
		id: "concise",
		label: "Concise",
		description: "Short one-block message, great for quick orders."
	},
	{
		id: "enquiry",
		label: "Enquiry",
		description: "Polite quotation request without prices."
	}
];
var BRAND = "Infiniforge Technologies";
var DIVIDER = "━━━━━━━━━━━━━━━━━━━━";
var SOFT = "──────────────────";
var fmtINR = (n) => `₹${n.toLocaleString("en-IN")}`;
function shortRef() {
	const d = /* @__PURE__ */ new Date();
	return `IF-${`${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
function formatContactEnquiryMessage(e, reference) {
	const ref = reference ?? shortRef();
	const when = (/* @__PURE__ */ new Date()).toLocaleString("en-IN", {
		dateStyle: "medium",
		timeStyle: "short"
	});
	return [
		`✨ *${BRAND}* — New Enquiry`,
		DIVIDER,
		e.interest ? `🎯 *Interest:* ${e.interest}` : "",
		"",
		`*👤 Contact Details*`,
		SOFT,
		e.name ? `• Name    : *${e.name}*` : "",
		e.email ? `• Email   : ${e.email}` : "",
		e.phone ? `• Phone   : ${e.phone}` : "",
		e.company ? `• Company : ${e.company}` : "",
		"",
		e.message ? `*📝 Message*\n${SOFT}\n${e.message}` : "",
		"",
		DIVIDER,
		`🔖  Reference : *${ref}*`,
		`🕒  Sent on   : ${when}`,
		`🌐  infiniforge.cloud`,
		"",
		`_Kindly acknowledge and share the next steps._ 🙏`
	].filter(Boolean).join("\n").replace(/\n{3,}/g, "\n\n");
}
function formatOrderMessage(greeting, items, extras) {
	const template = extras?.template ?? "premium";
	const ref = extras?.reference ?? shortRef();
	const when = (/* @__PURE__ */ new Date()).toLocaleString("en-IN", {
		dateStyle: "medium",
		timeStyle: "short"
	});
	const subtotal = items.reduce((s, i) => s + (typeof i.price_inr === "number" ? i.price_inr * (i.qty ?? 1) : 0), 0);
	const total = extras?.total_inr ?? (subtotal || void 0);
	if (template === "concise") return `*${BRAND}* — New Order\n${items.map((i) => {
		const qty = i.qty ?? 1;
		const p = typeof i.price_inr === "number" ? ` – ${fmtINR(i.price_inr * qty)}` : "";
		return `• ${i.name} ×${qty}${p}`;
	}).join("\n")}${[
		total != null ? `\n*Total:* ${fmtINR(total)}` : "",
		extras?.customer_name ? `\n👤 ${extras.customer_name}` : "",
		extras?.customer_phone ? ` · 📞 ${extras.customer_phone}` : "",
		extras?.note ? `\n📝 ${extras.note}` : "",
		`\n🔖 Ref: ${ref}`
	].join("")}`;
	if (template === "enquiry") {
		const list = items.map((i, idx) => `${idx + 1}. *${i.name}* — qty ${i.qty ?? 1}`).join("\n");
		return [
			`Hello *${BRAND}* team,`,
			"",
			`I would like to *enquire* about the following ${items.length === 1 ? "product" : "products"} and receive a formal quotation:`,
			"",
			list,
			extras?.note ? `\n*Requirement:* ${extras.note}` : "",
			"",
			"Kindly share pricing, delivery timelines and payment options.",
			"",
			SOFT,
			extras?.customer_name ? `Name    : ${extras.customer_name}` : "",
			extras?.customer_phone ? `Contact : ${extras.customer_phone}` : "",
			`Ref No. : ${ref}`,
			`Sent    : ${when}`
		].filter(Boolean).join("\n");
	}
	if (template === "invoice") {
		const rows = items.map((i, idx) => {
			const qty = i.qty ?? 1;
			const price = typeof i.price_inr === "number" ? i.price_inr : 0;
			const line = price * qty;
			return ` ${String(idx + 1).padStart(2, "0")}. ${i.name}\n     ${qty} × ${fmtINR(price)}  =  *${fmtINR(line)}*`;
		}).join("\n");
		return [
			`🧾 *${BRAND}*`,
			`*ORDER REQUEST*`,
			DIVIDER,
			rows,
			DIVIDER,
			total != null ? `*GRAND TOTAL :* ${fmtINR(total)}` : "",
			"",
			extras?.customer_name ? `*Billed To :* ${extras.customer_name}` : "",
			extras?.customer_phone ? `*Phone     :* ${extras.customer_phone}` : "",
			extras?.note ? `*Notes     :* ${extras.note}` : "",
			"",
			`*Reference :* ${ref}`,
			`*Placed on :* ${when}`,
			"",
			`_Please confirm this order and share the payment link._ 🙏`
		].filter(Boolean).join("\n");
	}
	const rows = items.map((i, idx) => {
		const qty = i.qty ?? 1;
		const priceBit = typeof i.price_inr === "number" ? `\n     _${qty} × ${fmtINR(i.price_inr)}_  →  *${fmtINR(i.price_inr * qty)}*` : `\n     _Quantity: ${qty}_`;
		return `  ${idx + 1}. 📦 *${i.name}*${priceBit}`;
	}).join("\n\n");
	return [
		greeting.trim() && !greeting.toLowerCase().includes("infiniforge") ? greeting.trim() : `Hello *${BRAND}* 👋`,
		"",
		`I'd like to place the following order:`,
		DIVIDER,
		rows,
		DIVIDER,
		total != null ? `💰  *Order Total:*  ${fmtINR(total)}` : "",
		extras?.customer_name || extras?.customer_phone ? "\n*Customer Details*" : "",
		extras?.customer_name ? `👤  ${extras.customer_name}` : "",
		extras?.customer_phone ? `📞  ${extras.customer_phone}` : "",
		extras?.note ? `\n📝  *Special Instructions*\n${extras.note}` : "",
		"",
		SOFT,
		`🔖  Reference : *${ref}*`,
		`🕒  Placed on : ${when}`,
		`🌐  infiniforge.cloud`,
		"",
		`_Please confirm availability & share the secure payment link._ ✅`
	].filter(Boolean).join("\n").replace(/\n{3,}/g, "\n\n");
}
//#endregion
export { formatOrderMessage as a, formatContactEnquiryMessage as i, WHATSAPP_TEMPLATES as n, getWhatsAppConfig as o, buildWhatsAppLink as r, normalizeWhatsAppNumber as s, WA_DEFAULTS as t };
