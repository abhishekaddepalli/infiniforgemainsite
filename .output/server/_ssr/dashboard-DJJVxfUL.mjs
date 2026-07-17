import { o as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { n as Zap } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DJJVxfUL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DashboardRedirect() {
	const { user, roles, loading } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user) {
			navigate({ to: "/auth" });
			return;
		}
		const staff = [
			"super_admin",
			"admin",
			"sales_manager",
			"support",
			"finance",
			"employee"
		];
		if (roles.some((r) => staff.includes(r))) navigate({ to: "/admin" });
		else navigate({ to: "/portal" });
	}, [
		user,
		roles,
		loading,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center animate-pulse mb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5 text-white" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading your dashboard…"
			})]
		})
	});
}
//#endregion
export { DashboardRedirect as component };
