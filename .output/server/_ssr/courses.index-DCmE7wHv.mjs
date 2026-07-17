import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Dn as CirclePlay, Kt as GraduationCap, j as Sparkles } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as listPublishedCourses } from "./courses.functions-Cs43ayVV.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses.index-DCmE7wHv.js
var import_jsx_runtime = require_jsx_runtime();
function CoursesPage() {
	const { data: courses = [], isLoading } = useQuery({
		queryKey: ["courses-public"],
		queryFn: () => listPublishedCourses()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative bg-gradient-to-b from-primary/10 via-background to-background border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto px-4 py-14 md:py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " New — Learn on Infiniforge"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl md:text-5xl font-bold tracking-tight max-w-3xl",
					children: "Video courses that get you shipping — fast."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground mt-4 max-w-2xl",
					children: "Hand-picked lessons with a branded distraction-free player, quizzes, and completion certificates."
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container mx-auto px-4 py-12",
		children: [
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center text-muted-foreground py-20",
				children: "Loading courses…"
			}),
			!isLoading && courses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-20 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-10 w-10 mx-auto mb-3 text-primary/60" }), "No courses published yet. Check back soon."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/courses/$slug",
					params: { slug: c.slug },
					className: "group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-lg transition-all hover:-translate-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-video bg-gradient-to-br from-primary/20 via-primary/5 to-secondary overflow-hidden",
						children: [
							c.cover_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.cover_image,
								alt: c.title,
								className: "w-full h-full object-cover group-hover:scale-105 transition-transform",
								loading: "lazy"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-full flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-14 w-14 text-primary/40" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-3 left-3",
								children: c.is_free ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-emerald-500 text-white hover:bg-emerald-500",
									children: "Free"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									className: "bg-primary text-white hover:bg-primary",
									children: ["₹", c.price_inr]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute bottom-3 right-3 h-11 w-11 rounded-full bg-white/95 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-6 w-6 text-primary" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5",
								children: [
									c.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.category }),
									c.category && c.level && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									c.level && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.level })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2",
								children: c.title
							}),
							c.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1.5 line-clamp-2",
								children: c.summary
							}),
							c.instructor_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-3",
								children: ["by ", c.instructor_name]
							})
						]
					})]
				}, c.id))
			})
		]
	})] });
}
//#endregion
export { CoursesPage as component };
