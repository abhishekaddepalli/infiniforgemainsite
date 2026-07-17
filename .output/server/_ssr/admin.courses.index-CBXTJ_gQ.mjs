import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { An as ChevronRight, Kt as GraduationCap, b as Trash2, jt as Layers, on as Eye, rt as Plus, sn as EyeOff, st as PenLine, un as Ellipsis } from "../_libs/lucide-react.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-CDoe66ii.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as SignaturePad } from "./SignaturePad-BkuZckJR.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
import { a as adminListCourses, s as adminSaveCourse, t as adminDeleteCourse } from "./courses.functions-Cs43ayVV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.courses.index-CBXTJ_gQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CoursesPage() {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const listFn = useServerFn(adminListCourses);
	const saveFn = useServerFn(adminSaveCourse);
	const delFn = useServerFn(adminDeleteCourse);
	const { data: courses = [], isLoading } = useQuery({
		queryKey: ["admin-courses"],
		queryFn: () => listFn()
	});
	const save = useMutation({
		mutationFn: async (c) => saveFn({ data: {
			id: c.id,
			slug: c.slug,
			title: c.title,
			summary: c.summary ?? "",
			description: c.description ?? "",
			cover_image: c.cover_image ?? "",
			category: c.category ?? "",
			level: c.level ?? "beginner",
			instructor_name: c.instructor_name ?? "",
			price_inr: Number(c.price_inr ?? 0),
			is_free: c.is_free ?? true,
			is_published: c.is_published ?? false,
			sort_order: Number(c.sort_order ?? 0),
			min_watch_percent: Number(c.min_watch_percent ?? 95),
			min_quiz_percent: Number(c.min_quiz_percent ?? 85),
			signature_image: c.signature_image ?? null,
			signatory_name: c.signatory_name ?? "",
			signatory_title: c.signatory_title ?? "",
			youtube_privacy_mode: c.youtube_privacy_mode ?? false,
			block_youtube_links: c.block_youtube_links ?? true,
			player_accent_color: /^#[0-9A-Fa-f]{6}$/.test(c.player_accent_color ?? "") ? c.player_accent_color : "#2563eb"
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-courses"] });
			setEditing(null);
			toast.success("Course saved");
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: (id) => delFn({ data: { id } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-courses"] });
			toast.success("Deleted");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between flex-wrap gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "hover:text-foreground",
							children: "Dashboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Courses" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-6 w-6 text-primary" }), " Courses"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Create video-based courses with lessons and quizzes."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "bg-gradient-brand text-white",
				onClick: () => setEditing({
					level: "beginner",
					is_free: true,
					is_published: false,
					sort_order: courses.length + 1,
					min_watch_percent: 95,
					min_quiz_percent: 85,
					youtube_privacy_mode: false,
					block_youtube_links: true,
					player_accent_color: "#2563eb"
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1.5" }), " New course"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border border-border bg-card shadow-card overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "min-w-[720px] w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 hidden md:table-cell",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3",
							children: "Lessons"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3",
							children: "Price"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "pl-3 pr-5 py-3 w-10" })
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
					className: "divide-y divide-border",
					children: [
						isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "p-10 text-center text-muted-foreground",
							children: "Loading…"
						}) }),
						!isLoading && courses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "p-10 text-center text-muted-foreground",
							children: "No courses yet — create your first one."
						}) }),
						courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-secondary/30 cursor-pointer",
							onClick: () => navigate({
								to: "/admin/courses/$id",
								params: { id: c.id }
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium hover:text-primary break-words",
										children: c.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground font-mono break-all",
										children: ["/", c.slug]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 hidden md:table-cell text-xs text-muted-foreground",
									children: c.category ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3",
									onClick: (e) => e.stopPropagation(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/admin/courses/$id",
										params: { id: c.id },
										className: "inline-flex items-center gap-1.5 text-primary hover:underline",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" }),
											" ",
											c.lessons?.[0]?.count ?? 0,
											" lessons & quizzes"
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 text-xs",
									children: c.is_free ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: "Free"
									}) : `₹${c.price_inr}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3",
									children: c.is_published ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										className: "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3 mr-1" }), "Published"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "secondary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3 w-3 mr-1" }), "Draft"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "pl-3 pr-5 py-3",
									onClick: (e) => e.stopPropagation(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "h-8 w-8 rounded-md hover:bg-secondary flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
										align: "end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onSelect: () => navigate({
													to: "/admin/courses/$id",
													params: { id: c.id }
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 mr-2" }), " Lessons & Quizzes"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onSelect: () => setEditing(c),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4 mr-2" }), " Edit details"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												className: "text-destructive",
												onSelect: () => confirm(`Delete "${c.title}"?`) && del.mutate(c.id),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-2" }), " Delete"]
											})
										]
									})] })
								})
							]
						}, c.id))
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editing,
			onOpenChange: (v) => !v && setEditing(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl max-h-[90vh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing?.id ? "Edit course" : "New course" }) }), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						save.mutate(editing);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: editing.title ?? "",
								onChange: (e) => setEditing({
									...editing,
									title: e.target.value,
									slug: editing.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
								}),
								className: "mt-1.5"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: editing.slug ?? "",
								onChange: (e) => setEditing({
									...editing,
									slug: e.target.value
								}),
								className: "mt-1.5"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Summary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: editing.summary ?? "",
							onChange: (e) => setEditing({
								...editing,
								summary: e.target.value
							}),
							className: "mt-1.5",
							placeholder: "Short one-liner"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 4,
							value: editing.description ?? "",
							onChange: (e) => setEditing({
								...editing,
								description: e.target.value
							}),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cover image URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editing.cover_image ?? "",
								onChange: (e) => setEditing({
									...editing,
									cover_image: e.target.value
								}),
								className: "mt-1.5"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editing.category ?? "",
								onChange: (e) => setEditing({
									...editing,
									category: e.target.value
								}),
								className: "mt-1.5",
								placeholder: "Development, Design…"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Level" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: editing.level ?? "beginner",
									onChange: (e) => setEditing({
										...editing,
										level: e.target.value
									}),
									className: "mt-1.5 w-full h-10 px-3 rounded-md border border-input bg-background text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "beginner",
											children: "Beginner"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "intermediate",
											children: "Intermediate"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "advanced",
											children: "Advanced"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Instructor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editing.instructor_name ?? "",
									onChange: (e) => setEditing({
										...editing,
										instructor_name: e.target.value
									}),
									className: "mt-1.5"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sort order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: editing.sort_order ?? 0,
									onChange: (e) => setEditing({
										...editing,
										sort_order: Number(e.target.value)
									}),
									className: "mt-1.5"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-3 gap-3 items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: editing.is_free ?? true,
										onCheckedChange: (v) => setEditing({
											...editing,
											is_free: v
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Free course" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: editing.price_inr ?? 0,
									onChange: (e) => setEditing({
										...editing,
										price_inr: Number(e.target.value)
									}),
									className: "mt-1.5",
									disabled: editing.is_free ?? true
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: editing.is_published ?? false,
										onCheckedChange: (v) => setEditing({
											...editing,
											is_published: v
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Published" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold mb-2",
									children: "Certificate requirements"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Minimum watch time (%)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										max: 100,
										value: editing.min_watch_percent ?? 95,
										onChange: (e) => setEditing({
											...editing,
											min_watch_percent: Number(e.target.value)
										}),
										className: "mt-1.5"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Minimum quiz average (%)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										max: 100,
										value: editing.min_quiz_percent ?? 85,
										onChange: (e) => setEditing({
											...editing,
											min_quiz_percent: Number(e.target.value)
										}),
										className: "mt-1.5"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1.5",
									children: "Learners must meet both thresholds before a certificate is issued."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold mb-2",
								children: "Video player settings"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
												checked: editing.block_youtube_links ?? true,
												onCheckedChange: (v) => setEditing({
													...editing,
													block_youtube_links: v
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Block YouTube title/logo clicks" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-1.5",
											children: "Recommended. Uses the custom player controls and prevents learners opening YouTube from the lesson."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
												checked: editing.youtube_privacy_mode ?? false,
												onCheckedChange: (v) => setEditing({
													...editing,
													youtube_privacy_mode: v
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "YouTube privacy mode" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-1.5",
											children: "Keep off if you see Error 153. Turn on only when videos embed correctly with privacy mode."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Player button colour" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1.5 flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "color",
												value: editing.player_accent_color ?? "#2563eb",
												onChange: (e) => setEditing({
													...editing,
													player_accent_color: e.target.value
												}),
												className: "h-10 w-16 p-1"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: editing.player_accent_color ?? "#2563eb",
												onChange: (e) => setEditing({
													...editing,
													player_accent_color: e.target.value
												}),
												placeholder: "#2563eb",
												pattern: "^#[0-9A-Fa-f]{6}$"
											})]
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold mb-2",
									children: "Authorised signature on certificate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Signatory name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editing.signatory_name ?? "",
										onChange: (e) => setEditing({
											...editing,
											signatory_name: e.target.value
										}),
										className: "mt-1.5",
										placeholder: "e.g. Amit Kumar"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Signatory title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editing.signatory_title ?? "",
										onChange: (e) => setEditing({
											...editing,
											signatory_title: e.target.value
										}),
										className: "mt-1.5",
										placeholder: "e.g. Director of Learning"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignaturePad, {
										value: editing.signature_image ?? null,
										onChange: (v) => setEditing({
											...editing,
											signature_image: v
										}),
										label: "Draw the signature (saved to certificate PDF)"
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setEditing(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "bg-gradient-brand text-white",
							disabled: save.isPending,
							children: "Save"
						})] })
					]
				})]
			})
		})
	] });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Courses",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoursesPage, {})
});
//#endregion
export { SplitComponent as component };
