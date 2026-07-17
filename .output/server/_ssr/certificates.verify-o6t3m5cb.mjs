import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Jn as Award, On as CircleCheck, Tn as CircleX, U as Search } from "../_libs/lucide-react.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { y as verifyCertificate } from "./courses.functions-Cs43ayVV.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/certificates.verify-o6t3m5cb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyCertificatePage() {
	const verifyFn = useServerFn(verifyCertificate);
	const [certificateNumber, setCertificateNumber] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const verify = useMutation({
		mutationFn: (value) => verifyFn({ data: { certificateNumber: value } }),
		onSuccess: setResult
	});
	const submit = (event) => {
		event.preventDefault();
		const value = certificateNumber.trim();
		if (value) verify.mutate(value);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[70vh] bg-secondary/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-3xl px-4 py-14 sm:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3.5 w-3.5 mr-1" }), " Certificate verification"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl sm:text-4xl font-bold tracking-tight",
						children: "Verify a course certificate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "Enter the certificate number exactly as shown on the learner certificate."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "mt-6 flex flex-col sm:flex-row gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: certificateNumber,
							onChange: (event) => setCertificateNumber(event.target.value.toUpperCase()),
							placeholder: "IF-XXXX-XXXX",
							className: "h-11 font-mono"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: verify.isPending || !certificateNumber.trim(),
							className: "h-11 bg-gradient-brand text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 mr-1.5" }), " Verify"]
						})]
					}),
					result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mt-6 rounded-2xl border p-4 ${result.valid ? "border-emerald-500/30 bg-emerald-500/10" : "border-destructive/30 bg-destructive/10"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [result.valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6 text-emerald-600 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-6 w-6 text-destructive shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-semibold",
									children: result.valid ? "Certificate is valid" : "Certificate not found"
								}), result.valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 text-sm text-muted-foreground space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: "Certificate:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono break-all",
												children: result.certificate_number
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: "Course:"
											}),
											" ",
											result.course?.title ?? "Course"
										] }),
										result.issued_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: "Issued:"
											}),
											" ",
											new Date(result.issued_at).toLocaleDateString()
										] })
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Check the number and try again."
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 pt-5 border-t border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/courses",
								children: "Browse courses"
							})
						})
					})
				]
			})
		})
	}) });
}
//#endregion
export { VerifyCertificatePage as component };
