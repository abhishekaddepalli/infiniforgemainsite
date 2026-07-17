import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { _t as MessageCircle } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { a as formatOrderMessage, o as getWhatsAppConfig, r as buildWhatsAppLink } from "./whatsapp-Bfedub3g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WhatsAppOrderButton-COEOsE3v.js
var import_jsx_runtime = require_jsx_runtime();
function makeRef() {
	const d = /* @__PURE__ */ new Date();
	return `WA-${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
function WhatsAppOrderButton({ items, total_inr, customer_name, customer_phone, note, surface = "product", className, size = "default", variant = "outline", label }) {
	const cfg = getWhatsAppConfig();
	if (!cfg.wa_ordering_enabled) return null;
	if (surface === "product" && !cfg.wa_ordering_show_products) return null;
	if (surface === "checkout" && !cfg.wa_ordering_show_checkout) return null;
	if (surface === "header" && !cfg.wa_ordering_show_header) return null;
	function handleClick() {
		if (!cfg.wa_ordering_number) {
			toast.error("WhatsApp ordering number is not configured yet.");
			return;
		}
		const reference = makeRef();
		const message = formatOrderMessage(cfg.wa_ordering_greeting, items, {
			total_inr,
			note,
			customer_name,
			customer_phone,
			template: cfg.wa_ordering_template ?? "premium",
			reference
		});
		toast.success(`Opening WhatsApp · ${reference}`);
		window.open(buildWhatsAppLink(cfg.wa_ordering_number, message), "_blank", "noopener,noreferrer");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		onClick: handleClick,
		size,
		variant,
		className: `gap-2 ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4 text-[#25D366]" }), label ?? cfg.wa_ordering_label]
	});
}
//#endregion
export { WhatsAppOrderButton as t };
