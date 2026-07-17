import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { V as Server } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.hosting-5Ws-jMQ_.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "hosting",
	title: "Hosting Accounts",
	subtitle: "Manage shared, reseller and VPS hosting accounts, plans, resources and renewals.",
	icon: Server,
	addLabel: "Add hosting account",
	titleLabel: "Hosting plan / Account",
	statuses: [
		"active",
		"provisioning",
		"suspended",
		"expired",
		"terminated"
	],
	amountLabel: "Plan cost (INR)",
	metaFields: [
		{
			key: "plan_type",
			label: "Type (Shared / VPS / Reseller)"
		},
		{
			key: "primary_domain",
			label: "Primary domain"
		},
		{
			key: "server_ip",
			label: "Server IP"
		},
		{
			key: "disk_gb",
			label: "Disk (GB)",
			type: "number"
		},
		{
			key: "bandwidth_gb",
			label: "Bandwidth (GB)",
			type: "number"
		},
		{
			key: "cpanel_user",
			label: "cPanel / control panel user"
		}
	],
	features: [
		"Shared, Reseller & VPS plans",
		"Auto-provisioning hooks",
		"Resource tracking (disk, RAM, bandwidth)",
		"Suspension & termination workflows",
		"Renewal reminders",
		"White-label branding"
	]
});
//#endregion
export { SplitComponent as component };
