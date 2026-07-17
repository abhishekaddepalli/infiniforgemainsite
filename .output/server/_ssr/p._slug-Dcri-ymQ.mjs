import { _ as Link, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { a as useCms } from "./cms-BQLw1hye.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._slug-Dcri-ymQ.js
var import_jsx_runtime = require_jsx_runtime();
function LegalPage() {
	const { slug } = useParams({ from: "/p/$slug" });
	const page = useCms("legal").pages.find((p) => p.slug === slug);
	if (!page) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-3xl font-bold",
				children: "Page not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-muted-foreground",
				children: [
					"No page is configured at ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
						className: "bg-secondary px-1.5 py-0.5 rounded text-sm",
						children: ["/p/", slug]
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 inline-block text-primary underline",
				children: "Back to home"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-gradient-hero",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-bold tracking-tight",
				children: page.title
			}), page.meta_description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: page.meta_description
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "prose prose-slate max-w-none whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90",
			children: renderMarkdownish(page.body)
		})
	})] });
}
function renderMarkdownish(body) {
	return body.split(/\n\n+/).map((b, i) => {
		if (b.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 mb-3 text-2xl font-bold",
			children: b.slice(3)
		}, i);
		if (b.startsWith("# ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-8 mb-3 text-3xl font-bold",
			children: b.slice(2)
		}, i);
		if (b.startsWith("- ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "list-disc pl-6 space-y-1",
			children: b.split("\n").map((l, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: l.replace(/^-\s*/, "") }, j))
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4",
			children: b
		}, i);
	});
}
//#endregion
export { LegalPage as component };
