import { o as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { Tt as Lock, n as Zap } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-DYGCXV35.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPassword() {
	const navigate = useNavigate();
	const [pw, setPw] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-secondary/40 p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
							className: "h-4 w-4 text-white",
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold",
						children: "Infiniforge"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold",
					children: "Set a new password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Choose a strong password with at least 8 characters."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-5 space-y-4",
					onSubmit: async (e) => {
						e.preventDefault();
						setBusy(true);
						const { error } = await supabase.auth.updateUser({ password: pw });
						setBusy(false);
						if (error) toast.error(error.message);
						else {
							toast.success("Password updated");
							navigate({ to: "/auth" });
						}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pw",
						children: "New password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "pw",
							type: "password",
							required: true,
							minLength: 8,
							value: pw,
							onChange: (e) => setPw(e.target.value),
							className: "pl-9"
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full bg-gradient-brand text-white",
						disabled: busy || pw.length < 8,
						children: busy ? "Updating…" : "Update password"
					})]
				})
			]
		})
	});
}
//#endregion
export { ResetPassword as component };
