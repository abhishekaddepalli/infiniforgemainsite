import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { An as ChevronRight, Dn as CirclePlay, Dt as ListChecks, Kt as GraduationCap, Tt as Lock, Zn as ArrowLeft, b as Trash2, rt as Plus, st as PenLine } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
import { n as isPlaceholderVideoValue, r as parseVideoUrl } from "./course-video-BXT0dBnl.mjs";
import { t as Route } from "./admin.courses._id-DXHe7XAg.mjs";
import { c as adminSaveLesson, i as adminGetCourse, l as adminSaveQuiz, n as adminDeleteLesson, o as adminReorderLessons, r as adminDeleteQuiz } from "./courses.functions-Cs43ayVV.mjs";
import { h as setResourceAccess, o as getResourceAccess, u as listTiers } from "./memberships.functions-C2eeCH5c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.courses._id-O_F37esC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResourceAccessEditor({ resourceType, resourceId }) {
	const getRule = useServerFn(getResourceAccess);
	const setRule = useServerFn(setResourceAccess);
	const listT = useServerFn(listTiers);
	const [minRank, setMinRank] = (0, import_react.useState)(0);
	const [tiers, setTiers] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		listT().then((r) => setTiers(r));
		if (resourceId) getRule({ data: {
			resource_type: resourceType,
			resource_id: resourceId
		} }).then((r) => setMinRank(r.min_tier_rank ?? 0));
	}, [resourceType, resourceId]);
	async function save() {
		setSaving(true);
		try {
			await setRule({ data: {
				resource_type: resourceType,
				resource_id: resourceId,
				min_tier_rank: minRank
			} });
			toast.success("Access updated");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border p-4 space-y-3 bg-secondary/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), " Membership access"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Minimum tier required" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: String(minRank),
					onValueChange: (v) => setMinRank(Number(v)),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: tiers.sort((a, b) => a.rank - b.rank).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
						value: String(t.rank),
						children: [
							t.name,
							" (rank ",
							t.rank,
							")",
							t.rank === 0 ? " — everyone" : ""
						]
					}, t.rank)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: save,
				disabled: saving || !resourceId,
				children: saving ? "Saving..." : "Save access"
			})
		]
	});
}
function CourseEditorPage() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const getFn = useServerFn(adminGetCourse);
	const saveLessonFn = useServerFn(adminSaveLesson);
	const delLessonFn = useServerFn(adminDeleteLesson);
	const reorderFn = useServerFn(adminReorderLessons);
	const saveQuizFn = useServerFn(adminSaveQuiz);
	const delQuizFn = useServerFn(adminDeleteQuiz);
	const [lessonEdit, setLessonEdit] = (0, import_react.useState)(null);
	const [quizEdit, setQuizEdit] = (0, import_react.useState)(null);
	const { data, isLoading } = useQuery({
		queryKey: ["admin-course", id],
		queryFn: () => getFn({ data: { id } })
	});
	const saveLesson = useMutation({
		mutationFn: async (l) => {
			let source = l.video_source ?? "youtube";
			let videoId = l.video_id ?? "";
			if (isPlaceholderVideoValue(l.video_url)) throw new Error("Please add a valid video URL for this lesson.");
			if (l.video_url) {
				const parsed = parseVideoUrl(l.video_url);
				if (!parsed) throw new Error("Please add a valid YouTube, Vimeo, Drive, or MP4 video URL.");
				source = parsed.source;
				videoId = parsed.videoId;
			}
			return saveLessonFn({ data: {
				id: l.id,
				course_id: id,
				title: l.title,
				description: l.description ?? "",
				video_source: source,
				video_url: l.video_url ?? "",
				video_id: videoId,
				start_seconds: Number(l.start_seconds ?? 0),
				end_seconds: l.end_seconds ? Number(l.end_seconds) : null,
				duration_seconds: l.duration_seconds ? Number(l.duration_seconds) : null,
				notes: l.notes ?? "",
				position: Number(l.position ?? 0),
				is_preview: l.is_preview ?? false
			} });
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-course", id] });
			setLessonEdit(null);
			toast.success("Lesson saved");
		},
		onError: (e) => toast.error(e.message)
	});
	const delLesson = useMutation({
		mutationFn: (lid) => delLessonFn({ data: { id: lid } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-course", id] });
			toast.success("Lesson deleted");
		}
	});
	const move = useMutation({
		mutationFn: (orders) => reorderFn({ data: { orders } }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-course", id] })
	});
	const saveQuiz = useMutation({
		mutationFn: (q) => saveQuizFn({ data: {
			id: q.id,
			course_id: id,
			lesson_id: q.lesson_id ?? null,
			title: q.title,
			description: q.description ?? "",
			pass_percent: Number(q.pass_percent ?? 70),
			questions: (q.questions ?? []).map((qq, i) => ({
				id: qq.id,
				question: qq.question,
				options: qq.options,
				correct_index: qq.correct_index,
				position: qq.position ?? i
			}))
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-course", id] });
			setQuizEdit(null);
			toast.success("Quiz saved");
		},
		onError: (e) => toast.error(e.message)
	});
	const delQuiz = useMutation({
		mutationFn: (qid) => delQuizFn({ data: { id: qid } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-course", id] });
			toast.success("Quiz deleted");
		}
	});
	const move2 = (index, dir) => {
		const lessons = [...data?.lessons ?? []];
		const j = index + dir;
		if (j < 0 || j >= lessons.length) return;
		[lessons[index], lessons[j]] = [lessons[j], lessons[index]];
		move.mutate(lessons.map((l, i) => ({
			id: l.id,
			position: i + 1
		})));
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-center text-muted-foreground",
		children: "Loading…"
	});
	if (!data?.course) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-10 text-center text-muted-foreground",
		children: "Course not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between flex-wrap gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "hover:text-foreground",
						children: "Dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/courses",
						className: "hover:text-foreground",
						children: "Courses"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.course.title })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-6 w-6 text-primary" }),
					" ",
					data.course.title
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/courses",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5 mr-1.5" }), " Back"]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceAccessEditor, {
				resourceType: "course",
				resourceId: data.course.id
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "lessons",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "lessons",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-4 w-4 mr-1.5" }), " Lessons"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "quizzes",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4 mr-1.5" }), " Quizzes"]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "lessons",
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "bg-gradient-brand text-white",
							onClick: () => setLessonEdit({
								video_source: "youtube",
								position: data.lessons.length + 1,
								start_seconds: 0
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1.5" }), " Add lesson"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-border bg-card shadow-card overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "min-w-[760px] w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3 w-12",
										children: "#"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: "Title"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: "Source"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: "Trim"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3",
										children: "Preview"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "pl-3 pr-5 py-3 w-40" })
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
								className: "divide-y divide-border",
								children: [data.lessons.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 6,
									className: "p-10 text-center text-muted-foreground",
									children: "No lessons yet."
								}) }), data.lessons.map((l, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-secondary/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-5 py-3 text-xs text-muted-foreground",
											children: idx + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium break-words",
												children: l.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground line-clamp-1",
												children: l.description
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "uppercase",
												children: l.video_source
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-3 text-xs",
											children: [
												l.start_seconds,
												"s – ",
												l.end_seconds ?? "end"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: l.is_preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-primary/15 text-primary",
												children: "Free preview"
											}) : "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "pl-3 pr-5 py-3 text-right space-x-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													onClick: () => move2(idx, -1),
													children: "↑"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													onClick: () => move2(idx, 1),
													children: "↓"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													onClick: () => setLessonEdit(l),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													className: "text-destructive",
													onClick: () => confirm(`Delete "${l.title}"?`) && delLesson.mutate(l.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})
											]
										})
									]
								}, l.id))]
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "quizzes",
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "bg-gradient-brand text-white",
							onClick: () => setQuizEdit({
								title: "",
								pass_percent: 70,
								questions: []
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1.5" }), " Add quiz"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: [(data.quizzes ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground col-span-2",
							children: "No quizzes yet."
						}), (data.quizzes ?? []).map((raw) => {
							const q = raw;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl border border-border bg-card p-4 shadow-card",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: q.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											q.questions?.length ?? 0,
											" questions · Pass ≥ ",
											q.pass_percent,
											"%"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => setQuizEdit(q),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											className: "text-destructive",
											onClick: () => confirm(`Delete quiz "${q.title}"?`) && delQuiz.mutate(q.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})]
								})
							}, q.id);
						})]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!lessonEdit,
			onOpenChange: (v) => !v && setLessonEdit(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-xl max-h-[90vh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: lessonEdit?.id ? "Edit lesson" : "New lesson" }) }), lessonEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						saveLesson.mutate(lessonEdit);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: lessonEdit.title ?? "",
							onChange: (e) => setLessonEdit({
								...lessonEdit,
								title: e.target.value
							}),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: lessonEdit.description ?? "",
							onChange: (e) => setLessonEdit({
								...lessonEdit,
								description: e.target.value
							}),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Video URL ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "(YouTube, Vimeo, Drive, MP4)"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: lessonEdit.video_url ?? "",
								onChange: (e) => {
									const parsed = parseVideoUrl(e.target.value);
									setLessonEdit({
										...lessonEdit,
										video_url: e.target.value,
										video_source: parsed?.source ?? lessonEdit.video_source ?? "other",
										video_id: parsed?.videoId ?? ""
									});
								},
								className: "mt-1.5",
								placeholder: "https://youtube.com/watch?v=…"
							}),
							lessonEdit.video_source && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: [
									"Detected: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono uppercase",
										children: lessonEdit.video_source
									}),
									" · id ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: lessonEdit.video_id
									})
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Start (sec)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: lessonEdit.start_seconds ?? 0,
									onChange: (e) => setLessonEdit({
										...lessonEdit,
										start_seconds: Number(e.target.value)
									}),
									className: "mt-1.5"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "End (sec)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: lessonEdit.end_seconds ?? "",
									onChange: (e) => setLessonEdit({
										...lessonEdit,
										end_seconds: e.target.value ? Number(e.target.value) : null
									}),
									className: "mt-1.5",
									placeholder: "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duration (sec)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: lessonEdit.duration_seconds ?? "",
									onChange: (e) => setLessonEdit({
										...lessonEdit,
										duration_seconds: e.target.value ? Number(e.target.value) : null
									}),
									className: "mt-1.5"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Notes (markdown supported)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 3,
							value: lessonEdit.notes ?? "",
							onChange: (e) => setLessonEdit({
								...lessonEdit,
								notes: e.target.value
							}),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: lessonEdit.is_preview ?? false,
								onCheckedChange: (v) => setLessonEdit({
									...lessonEdit,
									is_preview: v
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Free preview (visible before enroll)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setLessonEdit(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "bg-gradient-brand text-white",
							disabled: saveLesson.isPending,
							children: "Save"
						})] })
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!quizEdit,
			onOpenChange: (v) => !v && setQuizEdit(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl max-h-[90vh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: quizEdit?.id ? "Edit quiz" : "New quiz" }) }), quizEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: (e) => {
						e.preventDefault();
						saveQuiz.mutate(quizEdit);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: quizEdit.title ?? "",
										onChange: (e) => setQuizEdit({
											...quizEdit,
											title: e.target.value
										}),
										className: "mt-1.5"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pass %" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									max: 100,
									value: quizEdit.pass_percent ?? 70,
									onChange: (e) => setQuizEdit({
										...quizEdit,
										pass_percent: Number(e.target.value)
									}),
									className: "mt-1.5"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Attach to lesson (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: quizEdit.lesson_id ?? "",
									onChange: (e) => setQuizEdit({
										...quizEdit,
										lesson_id: e.target.value || null
									}),
									className: "mt-1.5 w-full h-10 px-3 rounded-md border border-input bg-background text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "End of course"
									}), data.lessons.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: l.id,
										children: l.title
									}, l.id))]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Questions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									variant: "outline",
									onClick: () => setQuizEdit({
										...quizEdit,
										questions: [...quizEdit.questions ?? [], {
											question: "",
											options: ["", ""],
											correct_index: 0,
											position: (quizEdit.questions?.length ?? 0) + 1
										}]
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1.5" }), " Add question"]
								})]
							}), (quizEdit.questions ?? []).map((q, qi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border p-3 space-y-2 bg-secondary/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											placeholder: `Question ${qi + 1}`,
											value: q.question,
											onChange: (e) => {
												const qs = [...quizEdit.questions ?? []];
												qs[qi] = {
													...q,
													question: e.target.value
												};
												setQuizEdit({
													...quizEdit,
													questions: qs
												});
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											size: "sm",
											variant: "ghost",
											className: "text-destructive",
											onClick: () => {
												const qs = [...quizEdit.questions ?? []];
												qs.splice(qi, 1);
												setQuizEdit({
													...quizEdit,
													questions: qs
												});
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									}),
									q.options.map((opt, oi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2 items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "radio",
												name: `q${qi}`,
												checked: q.correct_index === oi,
												onChange: () => {
													const qs = [...quizEdit.questions ?? []];
													qs[qi] = {
														...q,
														correct_index: oi
													};
													setQuizEdit({
														...quizEdit,
														questions: qs
													});
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												required: true,
												placeholder: `Option ${oi + 1}`,
												value: opt,
												onChange: (e) => {
													const qs = [...quizEdit.questions ?? []];
													const os = [...q.options];
													os[oi] = e.target.value;
													qs[qi] = {
														...q,
														options: os
													};
													setQuizEdit({
														...quizEdit,
														questions: qs
													});
												}
											}),
											q.options.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												size: "sm",
												variant: "ghost",
												onClick: () => {
													const qs = [...quizEdit.questions ?? []];
													const os = [...q.options];
													os.splice(oi, 1);
													qs[qi] = {
														...q,
														options: os,
														correct_index: Math.min(q.correct_index, os.length - 1)
													};
													setQuizEdit({
														...quizEdit,
														questions: qs
													});
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})
										]
									}, oi)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: "ghost",
										onClick: () => {
											const qs = [...quizEdit.questions ?? []];
											qs[qi] = {
												...q,
												options: [...q.options, ""]
											};
											setQuizEdit({
												...quizEdit,
												questions: qs
											});
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1.5" }), " Option"]
									})
								]
							}, qi))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setQuizEdit(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "bg-gradient-brand text-white",
							disabled: saveQuiz.isPending,
							children: "Save quiz"
						})] })
					]
				})]
			})
		})
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Course editor",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseEditorPage, {})
});
//#endregion
export { SplitComponent as component };
