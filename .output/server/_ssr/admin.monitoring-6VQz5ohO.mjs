import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { er as Activity } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.monitoring-6VQz5ohO.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "monitoring",
	title: "Uptime Monitoring",
	subtitle: "Track uptime, response time, SSL expiry and incidents for customer endpoints.",
	icon: Activity,
	addLabel: "Add monitor",
	titleLabel: "Monitor name",
	statuses: [
		"up",
		"degraded",
		"down",
		"paused"
	],
	amountLabel: "Plan cost (INR)",
	showDueDate: false,
	metaFields: [
		{
			key: "endpoint_url",
			label: "Endpoint URL"
		},
		{
			key: "check_type",
			label: "Check type (HTTP / HTTPS / TCP / Ping)"
		},
		{
			key: "interval_sec",
			label: "Check interval (seconds)",
			type: "number"
		},
		{
			key: "alert_email",
			label: "Alert email"
		},
		{
			key: "alert_whatsapp",
			label: "Alert WhatsApp"
		}
	],
	features: [
		"HTTP / HTTPS / TCP / Ping checks",
		"1-minute granularity",
		"Multi-region probes",
		"SSL expiry warnings",
		"Email, SMS, WhatsApp alerts",
		"Public status pages"
	]
});
//#endregion
export { SplitComponent as component };
