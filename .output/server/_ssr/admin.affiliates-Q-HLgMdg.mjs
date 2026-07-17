import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Gt as Handshake } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.affiliates-Q-HLgMdg.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "affiliates",
	title: "Affiliate Program",
	subtitle: "Manage affiliates, commissions, payouts and marketing creatives.",
	icon: Handshake,
	addLabel: "Add affiliate",
	titleLabel: "Affiliate name",
	statuses: [
		"active",
		"pending_approval",
		"suspended",
		"terminated"
	],
	amountLabel: "Lifetime commission (INR)",
	metaFields: [
		{
			key: "affiliate_code",
			label: "Affiliate code / slug"
		},
		{
			key: "commission_percent",
			label: "Commission %",
			type: "number"
		},
		{
			key: "payout_method",
			label: "Payout method (UPI / Bank / Wallet)"
		},
		{
			key: "contact_email",
			label: "Contact email"
		}
	],
	features: [
		"Unique affiliate codes & links",
		"Tiered commission %",
		"Real-time click & conversion tracking",
		"UPI / bank payouts",
		"Creative & banner library",
		"Fraud detection"
	]
});
//#endregion
export { SplitComponent as component };
