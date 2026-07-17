import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
import { Jn as Award, L as Shield, hn as Crown, j as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MembershipBadge-vyy4IIJ-.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	free: Shield,
	silver: Award,
	gold: Sparkles,
	platinum: Crown
};
function MembershipBadge({ slug, name, gradientFrom, gradientTo, className, size = "md" }) {
	const Icon = ICONS[slug] ?? Shield;
	const from = gradientFrom ?? "#64748b";
	const to = gradientTo ?? "#475569";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center rounded-full font-semibold text-white shadow-sm tracking-wide uppercase", {
			sm: "text-[10px] px-2 py-0.5 gap-1",
			md: "text-xs px-2.5 py-1 gap-1.5",
			lg: "text-sm px-3 py-1.5 gap-2"
		}[size], className),
		style: { background: `linear-gradient(135deg, ${from}, ${to})` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: {
			sm: "h-3 w-3",
			md: "h-3.5 w-3.5",
			lg: "h-4 w-4"
		}[size] }), name]
	});
}
//#endregion
export { MembershipBadge as t };
