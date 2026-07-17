import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { yt as Megaphone } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.marketing-CYlLehUq.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "marketing",
	title: "Marketing Campaigns",
	subtitle: "Email, SMS, WhatsApp and push campaigns with segmentation and tracking.",
	icon: Megaphone,
	addLabel: "New campaign",
	titleLabel: "Campaign name",
	statuses: [
		"draft",
		"scheduled",
		"sending",
		"sent",
		"paused"
	],
	amountLabel: "Budget (INR)",
	metaFields: [
		{
			key: "channel",
			label: "Channel (Email / SMS / WhatsApp / Push)"
		},
		{
			key: "audience",
			label: "Audience / segment"
		},
		{
			key: "subject",
			label: "Subject / Headline"
		},
		{
			key: "body",
			label: "Message body",
			type: "textarea"
		},
		{
			key: "utm_source",
			label: "UTM source"
		}
	],
	features: [
		"Email, SMS, WhatsApp & Push",
		"Audience segmentation",
		"Drip campaigns & automation",
		"A/B testing",
		"Open / click / conversion tracking",
		"UTM builder"
	]
});
//#endregion
export { SplitComponent as component };
