import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Pt as KeyRound } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.licenses-BcODlbsD.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "licenses",
	title: "Software Licenses",
	subtitle: "Issue, activate, suspend and renew software license keys with domain/device binding.",
	icon: KeyRound,
	addLabel: "Issue license",
	titleLabel: "Product / License name",
	statuses: [
		"active",
		"trial",
		"suspended",
		"expired",
		"revoked"
	],
	amountLabel: "License fee (INR)",
	metaFields: [
		{
			key: "license_key",
			label: "License key",
			placeholder: "INFG-XXXX-XXXX-XXXX"
		},
		{
			key: "bound_domain",
			label: "Bound domain / device"
		},
		{
			key: "tier",
			label: "Tier (trial / subscription / lifetime)"
		},
		{
			key: "customer_email",
			label: "Customer email"
		}
	],
	features: [
		"Auto-generate license keys",
		"Domain & device binding",
		"Activation & deactivation tracking",
		"Trial, subscription & lifetime tiers",
		"Renewal reminders",
		"White-label license portal"
	]
});
//#endregion
export { SplitComponent as component };
