import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Tt as Lock } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.ssl-CxKkNdDA.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "ssl",
	title: "SSL Certificates",
	subtitle: "Issue, install and renew SSL/TLS certificates for customer domains.",
	icon: Lock,
	addLabel: "Issue SSL",
	titleLabel: "Common name (domain)",
	statuses: [
		"active",
		"pending_validation",
		"expired",
		"revoked"
	],
	amountLabel: "Certificate cost (INR)",
	metaFields: [
		{
			key: "issuer",
			label: "Issuer (Let's Encrypt / Sectigo / DigiCert)"
		},
		{
			key: "cert_type",
			label: "Type (DV / OV / EV / Wildcard)"
		},
		{
			key: "san_domains",
			label: "SAN domains (comma separated)",
			type: "textarea"
		},
		{
			key: "validation_method",
			label: "Validation method (DNS / HTTP / Email)"
		}
	],
	features: [
		"DV, OV, EV & Wildcard support",
		"Auto-renewal via ACME",
		"CSR generation",
		"Expiry & vulnerability alerts",
		"One-click install to hosting",
		"Reseller pricing"
	]
});
//#endregion
export { SplitComponent as component };
