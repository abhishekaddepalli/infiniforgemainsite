import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _t as MessageCircle } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.whatsapp-Q0vEMENI.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "whatsapp",
	title: "WhatsApp Business",
	subtitle: "Manage WhatsApp orders, templates, chatbots and broadcast lists.",
	icon: MessageCircle,
	addLabel: "New WhatsApp entry",
	titleLabel: "Template / Order / Chat",
	statuses: [
		"active",
		"pending_approval",
		"rejected",
		"archived"
	],
	amountLabel: "Order value (INR)",
	showDueDate: false,
	metaFields: [
		{
			key: "type",
			label: "Type (Order / Template / Broadcast / Bot)"
		},
		{
			key: "phone",
			label: "Customer phone",
			placeholder: "+91…"
		},
		{
			key: "template_name",
			label: "Template name"
		},
		{
			key: "message",
			label: "Message content",
			type: "textarea"
		}
	],
	features: [
		"Order-by-WhatsApp flow",
		"Approved message templates",
		"Broadcast lists",
		"Chatbot / auto-replies",
		"Order status notifications",
		"Payment link sharing"
	]
});
//#endregion
export { SplitComponent as component };
