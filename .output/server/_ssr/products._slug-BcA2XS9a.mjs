import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { dt as Package } from "../_libs/lucide-react.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products._slug-BcA2XS9a.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "mx-auto max-w-3xl p-20 text-center",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-10 w-10 mx-auto text-muted-foreground mb-3" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold",
			children: "Product not found"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/products",
				children: "Back to catalog"
			})
		})
	]
}) });
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
