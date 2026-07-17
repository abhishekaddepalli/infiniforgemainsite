import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { qt as Globe } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.domains-CKVgVT_h.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "domains",
	title: "Domain Registrations",
	subtitle: "Register, transfer, renew and manage DNS for customer domains.",
	icon: Globe,
	addLabel: "Register / add domain",
	titleLabel: "Domain name",
	statuses: [
		"active",
		"pending_transfer",
		"expired",
		"redemption",
		"cancelled"
	],
	amountLabel: "Renewal cost (INR)",
	metaFields: [
		{
			key: "registrar",
			label: "Registrar"
		},
		{
			key: "tld",
			label: "TLD",
			placeholder: ".com"
		},
		{
			key: "auto_renew",
			label: "Auto-renew (yes / no)"
		},
		{
			key: "nameservers",
			label: "Nameservers",
			type: "textarea"
		},
		{
			key: "registrant_email",
			label: "Registrant email"
		}
	],
	features: [
		"Bulk domain search & registration",
		"DNS management",
		"Auto-renewal & expiry alerts",
		"Domain transfer workflow",
		"WHOIS privacy toggle",
		"Reseller pricing tiers"
	]
});
//#endregion
export { SplitComponent as component };
