import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { jt as Layers } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.digital-products-wBIvBZzG.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "digital_products",
	title: "Digital Products",
	subtitle: "Sell downloadable assets, eBooks, source code, templates, and design files with secure delivery.",
	icon: Layers,
	addLabel: "Add digital product",
	titleLabel: "Product name",
	statuses: [
		"active",
		"draft",
		"archived"
	],
	amountLabel: "Price (INR)",
	showDueDate: false,
	metaFields: [
		{
			key: "download_url",
			label: "Download / File URL"
		},
		{
			key: "version",
			label: "Version",
			placeholder: "1.0.0"
		},
		{
			key: "download_limit",
			label: "Download limit per order",
			type: "number"
		},
		{
			key: "release_notes",
			label: "Release notes",
			type: "textarea"
		}
	],
	features: [
		"Secure signed download links",
		"Per-order download limits & expiry",
		"License key auto-generation",
		"Version updates & release notes",
		"Preview & sample files",
		"GST-compliant digital invoices"
	]
});
//#endregion
export { SplitComponent as component };
