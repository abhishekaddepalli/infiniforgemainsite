import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { j as Sparkles } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.affiliate-templates-DDv2kKLH.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "affiliate_templates",
	title: "Marketing Templates",
	subtitle: "Ready-to-share templates affiliates can copy or send via WhatsApp / Email. Use {{link}}, {{code}}, {{name}} as placeholders.",
	icon: Sparkles,
	addLabel: "New template",
	titleLabel: "Template title (e.g. VPS launch — WhatsApp)",
	statuses: [
		"active",
		"draft",
		"archived"
	],
	amountLabel: "Sort order",
	showDueDate: false,
	metaFields: [
		{
			key: "channel",
			label: "Channel (whatsapp / email / instagram / linkedin / post)"
		},
		{
			key: "body",
			label: "Message body — use {{link}} {{code}} {{name}}",
			type: "textarea"
		},
		{
			key: "cta",
			label: "Call-to-action label"
		},
		{
			key: "category",
			label: "Product category (hosting / saas / licenses / all)"
		},
		{
			key: "notes",
			label: "Notes for affiliates",
			type: "textarea"
		}
	],
	features: [
		"Multi-channel templates (WhatsApp/Email/Social)",
		"Dynamic placeholders for affiliate link & code",
		"Category-targeted messaging",
		"Draft / archive workflow",
		"One-click share for affiliates"
	]
});
//#endregion
export { SplitComponent as component };
