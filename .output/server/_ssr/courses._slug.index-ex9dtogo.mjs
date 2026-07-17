import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Dn as CirclePlay, Kt as GraduationCap, On as CircleCheck, Sn as Clock, Tt as Lock, d as User, j as Sparkles } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as formatDuration } from "./course-video-BXT0dBnl.mjs";
import { d as getCourseBySlug, p as getMyEnrollment, u as enrollInCourse } from "./courses.functions-Cs43ayVV.mjs";
import { i as getMyBenefits } from "./memberships.functions-C2eeCH5c.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { t as Route } from "./courses._slug.index-CdQNDstf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses._slug.index-ex9dtogo.js
var import_jsx_runtime = require_jsx_runtime();
function CourseDetail() {
	const { slug } = Route.useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const getFn = useServerFn(getCourseBySlug);
	const enrollmentFn = useServerFn(getMyEnrollment);
	const enrollFn = useServerFn(enrollInCourse);
	const { data, isLoading } = useQuery({
		queryKey: ["course-public", slug],
		queryFn: () => getFn({ data: { slug } })
	});
	const { data: enr } = useQuery({
		queryKey: [
			"course-enrollment",
			slug,
			user?.id
		],
		queryFn: () => enrollmentFn({ data: { courseSlug: slug } }),
		enabled: !!user
	});
	const benefitsFn = useServerFn(getMyBenefits);
	const { data: benefits } = useQuery({
		queryKey: ["my-benefits"],
		queryFn: () => benefitsFn(),
		enabled: !!user
	});
	const enroll = useMutation({
		mutationFn: (courseId) => enrollFn({ data: { courseId } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["course-enrollment"] });
			toast.success("Enrolled! Redirecting…");
			navigate({
				to: "/courses/$slug/learn",
				params: { slug }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container mx-auto py-20 text-center text-muted-foreground",
		children: "Loading…"
	}) });
	if (!data?.course) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container mx-auto py-20 text-center",
		children: "Course not found."
	}) });
	const { course, lessons } = data;
	const isEnrolled = !!enr?.enrollment;
	const hasMemberAccess = !!benefits?.courses?.some((c) => c.id === course.id);
	const totalDuration = lessons.reduce((s, l) => s + (l.duration_seconds ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-gradient-to-br from-primary/10 via-background to-background border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto px-4 py-10 md:py-14 grid md:grid-cols-3 gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-2 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 text-xs",
						children: [
							course.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: course.category
							}),
							course.level && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "uppercase",
								children: course.level
							}),
							course.is_free ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-emerald-500 text-white hover:bg-emerald-500",
								children: "Free"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "bg-primary text-white hover:bg-primary",
								children: ["₹", course.price_inr]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl md:text-4xl font-bold tracking-tight",
						children: course.title
					}),
					course.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg text-muted-foreground",
						children: course.summary
					}),
					course.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground whitespace-pre-wrap",
						children: course.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-5 text-sm text-muted-foreground pt-2",
						children: [
							course.instructor_name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }),
									" ",
									course.instructor_name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-4 w-4" }),
									" ",
									lessons.length,
									" lessons"
								]
							}),
							totalDuration > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
									" ",
									formatDuration(totalDuration)
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "rounded-2xl border border-border bg-card p-4 shadow-card md:sticky md:top-24 h-fit",
				children: [
					course.cover_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: course.cover_image,
						alt: course.title,
						className: "w-full aspect-video object-cover rounded-lg mb-4"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-12 w-12 text-primary/40" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-bold mb-3",
						children: course.is_free ? "Free" : `₹${course.price_inr}`
					}),
					!user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "w-full bg-gradient-brand text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: "Sign in to enroll"
						})
					}),
					user && isEnrolled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "w-full bg-gradient-brand text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/courses/$slug/learn",
							params: { slug },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-4 w-4 mr-2" }), " Continue learning"]
						})
					}),
					user && !isEnrolled && course.is_free && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full bg-gradient-brand text-white",
						disabled: enroll.isPending,
						onClick: () => enroll.mutate(course.id),
						children: "Enroll for free"
					}),
					user && !isEnrolled && !course.is_free && hasMemberAccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full bg-gradient-brand text-white",
						disabled: enroll.isPending,
						onClick: () => enroll.mutate(course.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 mr-2" }), " Enroll with membership"]
					}),
					user && !isEnrolled && !course.is_free && !hasMemberAccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full bg-gradient-brand text-white",
						onClick: () => toast.info("Purchase flow coming soon — contact support to enroll."),
						children: ["Buy ₹", course.price_inr]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						className: "w-full mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/portal/membership",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 mr-2" }), " Unlock with membership"]
						})
					})] })
				]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container mx-auto px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl font-bold mb-4",
			children: "Course content"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden",
			children: lessons.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0",
						children: i + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium truncate",
							children: l.title
						}), l.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground truncate",
							children: l.description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground flex items-center gap-3",
						children: [l.duration_seconds ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
								" ",
								formatDuration(l.duration_seconds)
							]
						}) : null, l.is_preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }) : isEnrolled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" })]
					})
				]
			}, l.id))
		})]
	})] });
}
//#endregion
export { CourseDetail as component };
