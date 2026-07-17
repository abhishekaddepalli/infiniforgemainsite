import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Dn as CirclePlay, Jn as Award, Kt as GraduationCap, Tt as Lock, Xn as ArrowRight, j as Sparkles, yn as Compass } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Progress } from "./progress-Crx1Tb8I.mjs";
import { h as listMyCourses, u as enrollInCourse } from "./courses.functions-Cs43ayVV.mjs";
import { a as getMyMembership, i as getMyBenefits } from "./memberships.functions-C2eeCH5c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.courses-DW8u0Uof.js
var import_jsx_runtime = require_jsx_runtime();
function MyCoursesPage() {
	const listFn = useServerFn(listMyCourses);
	const benefitsFn = useServerFn(getMyBenefits);
	const membershipFn = useServerFn(getMyMembership);
	const enrollFn = useServerFn(enrollInCourse);
	const qc = useQueryClient();
	const navigate = useNavigate();
	const { data: enrollments = [], isLoading } = useQuery({
		queryKey: ["my-courses"],
		queryFn: () => listFn()
	});
	const { data: benefits, isLoading: loadingBenefits } = useQuery({
		queryKey: ["my-benefits"],
		queryFn: () => benefitsFn()
	});
	const { data: membership } = useQuery({
		queryKey: ["my-membership"],
		queryFn: () => membershipFn()
	});
	const enroll = useMutation({
		mutationFn: (courseId) => enrollFn({ data: { courseId } }),
		onSuccess: (_res, courseId) => {
			const c = (benefits?.courses ?? []).find((x) => x.id === courseId);
			qc.invalidateQueries({ queryKey: ["my-courses"] });
			toast.success("Enrolled! Opening course…");
			if (c?.slug) navigate({
				to: "/courses/$slug/learn",
				params: { slug: c.slug }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	const enrolledIds = new Set(enrollments.map((e) => e.course_id));
	const membershipCourses = (benefits?.courses ?? []).filter((c) => !enrolledIds.has(c.id));
	const tierName = membership?.tier?.name;
	const noContent = !isLoading && !loadingBenefits && enrollments.length === 0 && membershipCourses.length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-6 w-6 text-primary" }), " My Courses"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: tierName ? `${tierName} member — enroll in any unlocked course below.` : "Continue where you left off."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/courses",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "h-4 w-4 mr-1.5" }), " Browse catalog"]
					})
				})]
			}),
			(isLoading || loadingBenefits) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-16 text-muted-foreground",
				children: "Loading…"
			}),
			membershipCourses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/[0.06] via-background to-background p-4 sm:p-6 space-y-4 shadow-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "flex items-center justify-between gap-3 flex-wrap",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-primary flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Included with your membership"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-lg sm:text-xl font-bold mt-1",
							children: [
								membershipCourses.length,
								" course",
								membershipCourses.length > 1 ? "s" : "",
								" unlocked for you"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: [
								"Enroll for free — your ",
								tierName ?? "membership",
								" plan covers these."
							]
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: membershipCourses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary hover:-translate-y-0.5 transition-all flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/courses/$slug",
							params: { slug: c.slug },
							className: "block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-video bg-gradient-to-br from-primary/20 to-secondary overflow-hidden",
								children: [c.cover_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: c.cover_image,
									alt: c.title,
									className: "w-full h-full object-cover group-hover:scale-105 transition-transform",
									loading: "lazy"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-full flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-12 w-12 text-primary/40" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									className: "absolute top-3 left-3 bg-amber-500 text-white hover:bg-amber-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 mr-1" }), "Member"]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 flex-1 flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold line-clamp-2 group-hover:text-primary",
								children: c.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 text-xs text-muted-foreground truncate",
								children: [
									c.category ?? "Course",
									" · ",
									c.level ?? "All levels"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "w-full bg-gradient-to-r from-primary to-primary/80 text-white mt-auto",
								disabled: enroll.isPending,
								onClick: () => enroll.mutate(c.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-4 w-4 mr-1.5" }), enroll.isPending ? "Enrolling…" : "Enroll & start"]
							})]
						})]
					}, c.id))
				})]
			}),
			enrollments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-lg font-semibold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-5 w-5 text-primary" }), " Continue learning"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: enrollments.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/courses/$slug/learn",
						params: { slug: e.course.slug },
						className: "group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-video bg-gradient-to-br from-primary/20 to-secondary overflow-hidden",
							children: [
								e.course.cover_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: e.course.cover_image,
									alt: e.course.title,
									className: "w-full h-full object-cover group-hover:scale-105 transition-transform",
									loading: "lazy"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-full flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-12 w-12 text-primary/40" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-3 right-3 h-11 w-11 rounded-full bg-white/95 flex items-center justify-center shadow-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-6 w-6 text-primary" })
								}),
								e.completed_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									className: "absolute top-3 left-3 bg-emerald-500 text-white hover:bg-emerald-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3 w-3 mr-1" }), "Completed"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold line-clamp-2 group-hover:text-primary",
								children: e.course.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [e.progress_percent, "%"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: e.progress_percent,
									className: "h-1.5"
								})]
							})]
						})]
					}, e.id))
				})]
			}),
			noContent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border p-12 text-center bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-10 w-10 mx-auto text-primary/60 mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold",
						children: "No courses unlocked yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1 mb-4",
						children: tierName ? `Your ${tierName} plan doesn't include any courses yet. Upgrade to unlock more.` : "Upgrade your membership to unlock premium courses, or browse the free catalog."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "bg-gradient-brand text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/portal/membership",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 mr-1.5" }), " View plans"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/courses",
								children: ["Browse catalog ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 ml-1.5" })]
							})
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { MyCoursesPage as component };
