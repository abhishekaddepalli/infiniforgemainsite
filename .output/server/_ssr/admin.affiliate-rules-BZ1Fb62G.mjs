import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { w as Target } from "../_libs/lucide-react.mjs";
import { t as ModuleCrud } from "./ModuleCrud-CRDW5ors.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.affiliate-rules-BZ1Fb62G.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleCrud, {
	module: "affiliate_rules",
	title: "Commission Rules",
	subtitle: "Set commission percentages per category, product or partner tier. Rules shown to affiliates in their dashboard.",
	icon: Target,
	addLabel: "New rule",
	titleLabel: "Rule name (e.g. Hosting — All)",
	statuses: [
		"active",
		"paused",
		"expired"
	],
	amountLabel: "Commission %",
	showDueDate: false,
	metaFields: [
		{
			key: "scope",
			label: "Scope (category / product / all)"
		},
		{
			key: "category_slug",
			label: "Category slug (optional)"
		},
		{
			key: "product_slug",
			label: "Product slug (optional)"
		},
		{
			key: "min_tier",
			label: "Minimum partner tier (bronze / silver / gold)"
		},
		{
			key: "recurring",
			label: "Applies to recurring? (yes/no)"
		},
		{
			key: "notes",
			label: "Internal notes",
			type: "textarea"
		}
	],
	features: [
		"Per-category commission %",
		"Per-product overrides",
		"Recurring vs one-time",
		"Partner tier gating",
		"Effective / expiry dates"
	]
});
//#endregion
export { SplitComponent as component };
