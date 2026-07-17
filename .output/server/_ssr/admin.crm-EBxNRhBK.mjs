import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as SquareUserRound } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.crm-EBxNRhBK.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "crm",
	title: "CRM — Leads & Deals",
	subtitle: "Track leads, deals, contacts and pipeline stages across your sales team.",
	icon: SquareUserRound,
	addLabel: "Add lead / deal",
	titleLabel: "Lead / Deal name",
	statuses: [
		"new",
		"contacted",
		"qualified",
		"proposal",
		"won",
		"lost"
	],
	amountLabel: "Deal value (INR)",
	metaFields: [
		{
			key: "contact_name",
			label: "Contact name"
		},
		{
			key: "contact_email",
			label: "Contact email"
		},
		{
			key: "contact_phone",
			label: "Contact phone"
		},
		{
			key: "source",
			label: "Source (Website / Referral / Ads)"
		},
		{
			key: "next_action",
			label: "Next action",
			type: "textarea"
		}
	],
	features: [
		"Lead capture from website & WhatsApp",
		"Pipeline stages & drag-drop kanban ready",
		"Deal value & forecast",
		"Contact & company book",
		"Follow-up reminders",
		"Assign to sales reps"
	]
});
//#endregion
export { SplitComponent as component };
