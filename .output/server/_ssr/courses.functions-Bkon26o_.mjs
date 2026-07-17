import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dkj6ADdV.mjs";
import { i as resolvePlayableVideo } from "./course-video-BXT0dBnl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses.functions-Bkon26o_.js
async function ensureAdmin(context) {
	const { data, error } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Forbidden: admin only");
}
var listPublishedCourses_createServerFn_handler = createServerRpc({
	id: "34b69cba9d724649e782f42b9ed4ecb603e98ca9dde80d3fd002f1c4bf57d5e2",
	name: "listPublishedCourses",
	filename: "src/lib/courses.functions.ts"
}, (opts) => listPublishedCourses.__executeServer(opts));
var listPublishedCourses = createServerFn({ method: "GET" }).handler(listPublishedCourses_createServerFn_handler, async () => {
	const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
	const { data, error } = await createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, { auth: {
		storage: void 0,
		persistSession: false,
		autoRefreshToken: false
	} }).from("courses").select("id, slug, title, summary, cover_image, category, level, price_inr, is_free, instructor_name").eq("is_published", true).order("sort_order").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var getCourseBySlug_createServerFn_handler = createServerRpc({
	id: "6d307843915e1de7cab61ff6aced7e88ee60114e7e061d0a60d8864ee671eee3",
	name: "getCourseBySlug",
	filename: "src/lib/courses.functions.ts"
}, (opts) => getCourseBySlug.__executeServer(opts));
var getCourseBySlug = createServerFn({ method: "GET" }).inputValidator((d) => d).handler(getCourseBySlug_createServerFn_handler, async ({ data }) => {
	const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
	const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, { auth: {
		storage: void 0,
		persistSession: false,
		autoRefreshToken: false
	} });
	const { data: course, error } = await sb.from("courses").select("*").eq("slug", data.slug).eq("is_published", true).maybeSingle();
	if (error) throw new Error(error.message);
	if (!course) return null;
	const { data: lessons } = await sb.from("course_lessons").select("id, title, description, position, duration_seconds, is_preview, video_source").eq("course_id", course.id).order("position");
	return {
		course,
		lessons: lessons ?? []
	};
});
var getMyEnrollment_createServerFn_handler = createServerRpc({
	id: "c430c85c674f9c5b1199f8c20d364401d7a7a6ae99cc6fa70aa87a320a804cf1",
	name: "getMyEnrollment",
	filename: "src/lib/courses.functions.ts"
}, (opts) => getMyEnrollment.__executeServer(opts));
var getMyEnrollment = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(getMyEnrollment_createServerFn_handler, async ({ data, context }) => {
	const { data: course } = await context.supabase.from("courses").select("*").eq("slug", data.courseSlug).maybeSingle();
	if (!course) throw new Error("Course not found");
	const { data: enrollment } = await context.supabase.from("course_enrollments").select("*").eq("course_id", course.id).eq("user_id", context.userId).maybeSingle();
	return {
		course,
		enrollment
	};
});
var enrollInCourse_createServerFn_handler = createServerRpc({
	id: "99a5421bb11460190dcebc0ed1f4c88c7a1cd2e7976c366765bc52998ad22aa4",
	name: "enrollInCourse",
	filename: "src/lib/courses.functions.ts"
}, (opts) => enrollInCourse.__executeServer(opts));
var enrollInCourse = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(enrollInCourse_createServerFn_handler, async ({ data, context }) => {
	const { data: course, error: cErr } = await context.supabase.from("courses").select("id, is_free, is_published, category").eq("id", data.courseId).maybeSingle();
	if (cErr) throw new Error(cErr.message);
	if (!course || !course.is_published) throw new Error("Course unavailable");
	let source = "free";
	if (!course.is_free) {
		const { data: rank } = await context.supabase.rpc("get_user_tier_rank", { _user_id: context.userId });
		const userRank = Number(rank ?? 0);
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const { data: activeMemberships } = await context.supabase.from("user_memberships").select("tier_id").eq("user_id", context.userId).eq("status", "active").or(`expires_at.is.null,expires_at.gt.${nowIso}`);
		const tierIds = new Set((activeMemberships ?? []).map((membership) => membership.tier_id));
		const { data: courseRules } = await context.supabase.from("resource_access").select("min_tier_rank, required_tier_ids").in("resource_type", ["course", "courses"]).eq("resource_id", data.courseId);
		let categoryRules = [];
		if (course.category) {
			let matchingCategories = [];
			const categoryValue = String(course.category);
			const { data: bySlug } = await context.supabase.from("categories").select("id").eq("slug", categoryValue);
			matchingCategories = bySlug ?? [];
			if (matchingCategories.length === 0) {
				const { data: byName } = await context.supabase.from("categories").select("id").eq("name", categoryValue);
				matchingCategories = byName ?? [];
			}
			if (matchingCategories.length === 0 && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(categoryValue)) {
				const { data: byId } = await context.supabase.from("categories").select("id").eq("id", categoryValue);
				matchingCategories = byId ?? [];
			}
			const categoryIds = (matchingCategories ?? []).map((category) => category.id);
			if (categoryIds.length) {
				const { data } = await context.supabase.from("resource_access").select("min_tier_rank, required_tier_ids").in("resource_type", ["category", "categories"]).in("resource_id", categoryIds);
				categoryRules = data ?? [];
			}
		}
		if (![...courseRules ?? [], ...categoryRules].some((rule) => {
			const required = Array.isArray(rule.required_tier_ids) ? rule.required_tier_ids.map(String) : [];
			return userRank >= Number(rule.min_tier_rank ?? 0) || required.some((tierId) => tierIds.has(tierId));
		})) throw new Error("This course requires purchase or a higher membership tier");
		source = "membership";
	}
	const { data: enrollment, error } = await context.supabase.from("course_enrollments").upsert({
		course_id: data.courseId,
		user_id: context.userId,
		source
	}, { onConflict: "course_id,user_id" }).select().single();
	if (error) throw new Error(error.message);
	return enrollment;
});
var getLearnData_createServerFn_handler = createServerRpc({
	id: "cadf9097875b9b8bc955a534ddb68be60477461047810555c9a1caa1cf131ab3",
	name: "getLearnData",
	filename: "src/lib/courses.functions.ts"
}, (opts) => getLearnData.__executeServer(opts));
var getLearnData = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(getLearnData_createServerFn_handler, async ({ data, context }) => {
	const { data: course } = await context.supabase.from("courses").select("*").eq("slug", data.courseSlug).maybeSingle();
	if (!course) throw new Error("Course not found");
	let { data: enrollment } = await context.supabase.from("course_enrollments").select("*").eq("course_id", course.id).eq("user_id", context.userId).maybeSingle();
	if (!enrollment) {
		let canAutoEnroll = !!course.is_free;
		if (!canAutoEnroll) {
			const { data: rank } = await context.supabase.rpc("get_user_tier_rank", { _user_id: context.userId });
			const userRank = Number(rank ?? 0);
			const nowIso = (/* @__PURE__ */ new Date()).toISOString();
			const { data: activeMemberships } = await context.supabase.from("user_memberships").select("tier_id").eq("user_id", context.userId).eq("status", "active").or(`expires_at.is.null,expires_at.gt.${nowIso}`);
			const tierIds = new Set((activeMemberships ?? []).map((membership) => membership.tier_id));
			const { data: courseRules } = await context.supabase.from("resource_access").select("min_tier_rank, required_tier_ids").in("resource_type", ["course", "courses"]).eq("resource_id", course.id);
			let categoryRules = [];
			if (course.category) {
				let matchingCategories = [];
				const categoryValue = String(course.category);
				const { data: bySlug } = await context.supabase.from("categories").select("id").eq("slug", categoryValue);
				matchingCategories = bySlug ?? [];
				if (matchingCategories.length === 0) {
					const { data: byName } = await context.supabase.from("categories").select("id").eq("name", categoryValue);
					matchingCategories = byName ?? [];
				}
				if (matchingCategories.length === 0 && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(categoryValue)) {
					const { data: byId } = await context.supabase.from("categories").select("id").eq("id", categoryValue);
					matchingCategories = byId ?? [];
				}
				const categoryIds = (matchingCategories ?? []).map((category) => category.id);
				if (categoryIds.length) {
					const { data } = await context.supabase.from("resource_access").select("min_tier_rank, required_tier_ids").in("resource_type", ["category", "categories"]).in("resource_id", categoryIds);
					categoryRules = data ?? [];
				}
			}
			canAutoEnroll = [...courseRules ?? [], ...categoryRules].some((rule) => {
				const required = Array.isArray(rule.required_tier_ids) ? rule.required_tier_ids.map(String) : [];
				return userRank >= Number(rule.min_tier_rank ?? 0) || required.some((tierId) => tierIds.has(tierId));
			});
		}
		if (!canAutoEnroll) throw new Error("Not enrolled");
		const { data: created, error: enrollError } = await context.supabase.from("course_enrollments").upsert({
			course_id: course.id,
			user_id: context.userId,
			source: course.is_free ? "free" : "membership"
		}, { onConflict: "course_id,user_id" }).select().single();
		if (enrollError) throw new Error(enrollError.message);
		enrollment = created;
	}
	const { data: lessons } = await context.supabase.from("course_lessons").select("*").eq("course_id", course.id).order("position");
	const playableLessons = (lessons ?? []).filter((lesson) => resolvePlayableVideo({
		video_source: lesson.video_source,
		video_id: lesson.video_id,
		video_url: lesson.video_url
	}));
	const { data: progress } = await context.supabase.from("course_lesson_progress").select("*").eq("enrollment_id", enrollment.id);
	const { data: quizzes } = await context.supabase.from("course_quizzes").select("*, questions:course_quiz_questions(*)").eq("course_id", course.id);
	const { data: attempts } = await context.supabase.from("course_quiz_attempts").select("*").eq("enrollment_id", enrollment.id).order("created_at", { ascending: false });
	const { data: certificate } = await context.supabase.from("course_certificates").select("*").eq("enrollment_id", enrollment.id).maybeSingle();
	const quizRows = quizzes ?? [];
	const attemptRows = attempts ?? [];
	const minWatch = Number(course.min_watch_percent ?? 95);
	const minQuiz = Number(course.min_quiz_percent ?? 85);
	const progressByLesson = new Map((progress ?? []).map((p) => [p.lesson_id, p]));
	let watched = 0, total = 0;
	for (const lesson of playableLessons) {
		const effective = Number((lesson.end_seconds && lesson.start_seconds != null ? lesson.end_seconds - lesson.start_seconds : lesson.duration_seconds) ?? 0);
		const dur = effective > 0 ? effective : 60;
		total += dur;
		const p = progressByLesson.get(lesson.id);
		const w = p?.completed_at ? dur : Math.min(dur, Number(p?.watch_seconds ?? 0));
		watched += Math.max(0, w);
	}
	const watchPercent = total > 0 ? Math.round(watched / total * 100) : 0;
	const bestByQuiz = /* @__PURE__ */ new Map();
	for (const a of attemptRows) bestByQuiz.set(a.quiz_id, Math.max(bestByQuiz.get(a.quiz_id) ?? 0, Number(a.score_percent ?? 0)));
	const quizAvg = quizRows.length ? Math.round(quizRows.reduce((s, q) => s + (bestByQuiz.get(q.id) ?? 0), 0) / quizRows.length) : 100;
	const allQuizzesPassed = quizRows.length === 0 || quizRows.every((quiz) => attemptRows.some((attempt) => attempt.quiz_id === quiz.id && attempt.passed));
	return {
		course,
		enrollment,
		lessons: playableLessons,
		progress: progress ?? [],
		quizzes: quizRows,
		attempts: attemptRows,
		certificate,
		allQuizzesPassed,
		watchPercent,
		quizAvg,
		minWatch,
		minQuiz
	};
});
var saveLessonProgress_createServerFn_handler = createServerRpc({
	id: "4ac868f3a596cb5edb93213fdbc0209e0cf71c33116e98e16db335bc869c6649",
	name: "saveLessonProgress",
	filename: "src/lib/courses.functions.ts"
}, (opts) => saveLessonProgress.__executeServer(opts));
var saveLessonProgress = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(saveLessonProgress_createServerFn_handler, async ({ data, context }) => {
	const { data: enrollment, error: enrollmentError } = await context.supabase.from("course_enrollments").select("id, course_id, user_id").eq("id", data.enrollmentId).maybeSingle();
	if (enrollmentError) throw new Error(enrollmentError.message);
	if (!enrollment || enrollment.user_id !== context.userId) throw new Error("Not allowed");
	const { data: lesson } = await context.supabase.from("course_lessons").select("id").eq("id", data.lessonId).eq("course_id", enrollment.course_id).maybeSingle();
	if (!lesson) throw new Error("Lesson not found");
	const { data: existingProgress } = await context.supabase.from("course_lesson_progress").select("completed_at, watch_seconds").eq("enrollment_id", data.enrollmentId).eq("lesson_id", data.lessonId).maybeSingle();
	const completedAt = data.completed ? (/* @__PURE__ */ new Date()).toISOString() : existingProgress?.completed_at ?? null;
	const payload = {
		enrollment_id: data.enrollmentId,
		lesson_id: data.lessonId,
		user_id: context.userId,
		watch_seconds: Math.max(Number(existingProgress?.watch_seconds ?? 0), Math.max(0, Math.floor(data.watchSeconds))),
		completed_at: completedAt
	};
	const { error } = await context.supabase.from("course_lesson_progress").upsert(payload, { onConflict: "enrollment_id,lesson_id" });
	if (error) throw new Error(error.message);
	const { data: lessons } = await context.supabase.from("course_lessons").select("id, video_source, video_id, video_url").eq("course_id", enrollment.course_id);
	const playableLessonIds = new Set((lessons ?? []).filter((lesson) => resolvePlayableVideo({
		video_source: lesson.video_source,
		video_id: lesson.video_id,
		video_url: lesson.video_url
	})).map((lesson) => lesson.id));
	const total = playableLessonIds.size;
	const { data: done } = await context.supabase.from("course_lesson_progress").select("lesson_id").eq("enrollment_id", data.enrollmentId).not("completed_at", "is", null);
	const completedPlayable = (done ?? []).filter((row) => playableLessonIds.has(row.lesson_id)).length;
	const percent = total ? Math.min(100, Math.round(completedPlayable / total * 100)) : 0;
	await context.supabase.from("course_enrollments").update({
		progress_percent: percent,
		completed_at: percent >= 100 ? (/* @__PURE__ */ new Date()).toISOString() : null
	}).eq("id", data.enrollmentId).eq("user_id", context.userId);
	return { percent };
});
var submitQuizAttempt_createServerFn_handler = createServerRpc({
	id: "51b63688bd18d36eeeff8bbd626990292b08f3c27fe08434a49cde5f688aec66",
	name: "submitQuizAttempt",
	filename: "src/lib/courses.functions.ts"
}, (opts) => submitQuizAttempt.__executeServer(opts));
var submitQuizAttempt = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(submitQuizAttempt_createServerFn_handler, async ({ data, context }) => {
	const { data: enrollment } = await context.supabase.from("course_enrollments").select("id, course_id, user_id").eq("id", data.enrollmentId).maybeSingle();
	if (!enrollment || enrollment.user_id !== context.userId) throw new Error("Not allowed");
	const { data: quiz } = await context.supabase.from("course_quizzes").select("*, questions:course_quiz_questions(id, correct_index, position)").eq("id", data.quizId).single();
	if (!quiz) throw new Error("Quiz not found");
	if (quiz.course_id !== enrollment.course_id) throw new Error("Quiz does not belong to this enrollment");
	const qs = (quiz.questions ?? []).sort((a, b) => a.position - b.position);
	const correct = qs.reduce((acc, q, i) => acc + (data.answers[i] === q.correct_index ? 1 : 0), 0);
	const percent = qs.length ? Math.round(correct / qs.length * 100) : 0;
	const passed = percent >= (quiz.pass_percent ?? 70);
	const { error } = await context.supabase.from("course_quiz_attempts").insert({
		quiz_id: data.quizId,
		enrollment_id: data.enrollmentId,
		user_id: context.userId,
		score_percent: percent,
		passed,
		answers: data.answers
	});
	if (error) throw new Error(error.message);
	return {
		percent,
		passed
	};
});
var issueCertificate_createServerFn_handler = createServerRpc({
	id: "807133c67e4b968799e8dec4951353caeb16e9f4bda401b0fa580ac659c317a3",
	name: "issueCertificate",
	filename: "src/lib/courses.functions.ts"
}, (opts) => issueCertificate.__executeServer(opts));
var issueCertificate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(issueCertificate_createServerFn_handler, async ({ data, context }) => {
	const { data: enr } = await context.supabase.from("course_enrollments").select("id, course_id, progress_percent, user_id").eq("id", data.enrollmentId).single();
	if (!enr || enr.user_id !== context.userId) throw new Error("Not allowed");
	const { data: course } = await context.supabase.from("courses").select("id, min_watch_percent, min_quiz_percent").eq("id", enr.course_id).single();
	const minWatch = Number(course?.min_watch_percent ?? 95);
	const minQuiz = Number(course?.min_quiz_percent ?? 85);
	const { data: lessons } = await context.supabase.from("course_lessons").select("id, video_source, video_id, video_url, start_seconds, end_seconds, duration_seconds").eq("course_id", enr.course_id);
	const playable = (lessons ?? []).filter((lesson) => resolvePlayableVideo({
		video_source: lesson.video_source,
		video_id: lesson.video_id,
		video_url: lesson.video_url
	}));
	const { data: progressRows } = await context.supabase.from("course_lesson_progress").select("lesson_id, watch_seconds, completed_at").eq("enrollment_id", enr.id);
	const progressByLesson = new Map((progressRows ?? []).map((p) => [p.lesson_id, p]));
	let watched = 0, total = 0;
	for (const lesson of playable) {
		const effective = Number((lesson.end_seconds && lesson.start_seconds != null ? lesson.end_seconds - lesson.start_seconds : lesson.duration_seconds) ?? 0);
		const dur = effective > 0 ? effective : 60;
		total += dur;
		const p = progressByLesson.get(lesson.id);
		const w = p?.completed_at ? dur : Math.min(dur, Number(p?.watch_seconds ?? 0));
		watched += Math.max(0, w);
	}
	const watchPercent = total > 0 ? Math.round(watched / total * 100) : 0;
	if (watchPercent < minWatch) throw new Error(`Watch at least ${minWatch}% of the course to earn your certificate (currently ${watchPercent}%).`);
	const { data: quizzes } = await context.supabase.from("course_quizzes").select("id").eq("course_id", enr.course_id);
	if ((quizzes ?? []).length) {
		const { data: attempts } = await context.supabase.from("course_quiz_attempts").select("quiz_id, score_percent").eq("enrollment_id", enr.id);
		const bestByQuiz = /* @__PURE__ */ new Map();
		for (const a of attempts ?? []) bestByQuiz.set(a.quiz_id, Math.max(bestByQuiz.get(a.quiz_id) ?? 0, Number(a.score_percent ?? 0)));
		if ((quizzes ?? []).some((q) => !bestByQuiz.has(q.id))) throw new Error("Attempt every quiz before claiming your certificate.");
		const avg = Math.round((quizzes ?? []).reduce((s, q) => s + (bestByQuiz.get(q.id) ?? 0), 0) / (quizzes ?? []).length);
		if (avg < minQuiz) throw new Error(`Quiz average must be at least ${minQuiz}% (currently ${avg}%).`);
	}
	await context.supabase.from("course_enrollments").update({
		progress_percent: 100,
		completed_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", enr.id).eq("user_id", context.userId);
	const { data: existing } = await context.supabase.from("course_certificates").select("*").eq("enrollment_id", enr.id).maybeSingle();
	if (existing) return existing;
	const certNumber = `IF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
	const { data: cert, error } = await context.supabase.from("course_certificates").insert({
		enrollment_id: enr.id,
		user_id: context.userId,
		course_id: enr.course_id,
		certificate_number: certNumber
	}).select().single();
	if (error) throw new Error(error.message);
	return cert;
});
var verifyCertificate_createServerFn_handler = createServerRpc({
	id: "b31cc007701f1b7e6a067d6811ff4879901e2d81bb23284b9d3c7802bcadb664",
	name: "verifyCertificate",
	filename: "src/lib/courses.functions.ts"
}, (opts) => verifyCertificate.__executeServer(opts));
var verifyCertificate = createServerFn({ method: "GET" }).inputValidator((d) => d).handler(verifyCertificate_createServerFn_handler, async ({ data }) => {
	const certificateNumber = data.certificateNumber.trim().toUpperCase();
	if (!certificateNumber) return { valid: false };
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: cert, error } = await supabaseAdmin.from("course_certificates").select("certificate_number, issued_at, course:courses(title, slug)").eq("certificate_number", certificateNumber).maybeSingle();
	if (error) throw new Error(error.message);
	if (!cert) return {
		valid: false,
		certificate_number: certificateNumber
	};
	return {
		valid: true,
		certificate_number: cert.certificate_number,
		issued_at: cert.issued_at,
		course: cert.course
	};
});
var listMyCourses_createServerFn_handler = createServerRpc({
	id: "f14e4212548c274bc7666938e585c4b3ffd9b8a52d2b53ebb7e80e5447484aa8",
	name: "listMyCourses",
	filename: "src/lib/courses.functions.ts"
}, (opts) => listMyCourses.__executeServer(opts));
var listMyCourses = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMyCourses_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("course_enrollments").select("*, course:courses(id, slug, title, cover_image, category, level)").eq("user_id", context.userId).order("enrolled_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var adminListCourses_createServerFn_handler = createServerRpc({
	id: "b18ba41786239877bbd0f40f382d0bcd8a2eb0abb02799ddfa0158944f032469",
	name: "adminListCourses",
	filename: "src/lib/courses.functions.ts"
}, (opts) => adminListCourses.__executeServer(opts));
var adminListCourses = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(adminListCourses_createServerFn_handler, async ({ context }) => {
	await ensureAdmin(context);
	const { data, error } = await context.supabase.from("courses").select("*, lessons:course_lessons(count)").order("sort_order").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var adminGetCourse_createServerFn_handler = createServerRpc({
	id: "c21ec9d6b16661c7cba60983533a0fe058a49e3868e84a9a305b22de90b49e7d",
	name: "adminGetCourse",
	filename: "src/lib/courses.functions.ts"
}, (opts) => adminGetCourse.__executeServer(opts));
var adminGetCourse = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminGetCourse_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { data: course } = await context.supabase.from("courses").select("*").eq("id", data.id).single();
	const { data: lessons } = await context.supabase.from("course_lessons").select("*").eq("course_id", data.id).order("position");
	const { data: quizzes } = await context.supabase.from("course_quizzes").select("*, questions:course_quiz_questions(*)").eq("course_id", data.id);
	return {
		course,
		lessons: lessons ?? [],
		quizzes: quizzes ?? []
	};
});
var adminSaveCourse_createServerFn_handler = createServerRpc({
	id: "22f3db6b22b959b9d676b936cee80e5aa756f94042f39a4e438ac73fe3e74b52",
	name: "adminSaveCourse",
	filename: "src/lib/courses.functions.ts"
}, (opts) => adminSaveCourse.__executeServer(opts));
var adminSaveCourse = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminSaveCourse_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const playerAccent = /^#[0-9A-Fa-f]{6}$/.test(data.player_accent_color ?? "") ? data.player_accent_color : "#2563eb";
	const payload = {
		slug: data.slug,
		title: data.title,
		summary: data.summary ?? null,
		description: data.description ?? null,
		cover_image: data.cover_image ?? null,
		category: data.category ?? null,
		level: data.level ?? "beginner",
		instructor_name: data.instructor_name ?? null,
		price_inr: data.price_inr ?? 0,
		is_free: data.is_free ?? true,
		is_published: data.is_published ?? false,
		sort_order: data.sort_order ?? 0,
		min_watch_percent: Math.max(0, Math.min(100, Number(data.min_watch_percent ?? 95))),
		min_quiz_percent: Math.max(0, Math.min(100, Number(data.min_quiz_percent ?? 85))),
		signature_image: data.signature_image ?? null,
		signatory_name: data.signatory_name ?? null,
		signatory_title: data.signatory_title ?? null,
		youtube_privacy_mode: data.youtube_privacy_mode ?? false,
		block_youtube_links: data.block_youtube_links ?? true,
		player_accent_color: playerAccent
	};
	if (data.id) {
		const { data: row, error } = await context.supabase.from("courses").update(payload).eq("id", data.id).select().single();
		if (error) throw new Error(error.message);
		return row;
	}
	const { data: row, error } = await context.supabase.from("courses").insert(payload).select().single();
	if (error) throw new Error(error.message);
	return row;
});
var adminDeleteCourse_createServerFn_handler = createServerRpc({
	id: "78903168e8ece0f11fc64285073537b9f68fe55d03716b99a37d7a5bd92e9165",
	name: "adminDeleteCourse",
	filename: "src/lib/courses.functions.ts"
}, (opts) => adminDeleteCourse.__executeServer(opts));
var adminDeleteCourse = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminDeleteCourse_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { error } = await context.supabase.from("courses").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var adminSaveLesson_createServerFn_handler = createServerRpc({
	id: "cbcc5ddeb79840117f557ae15060f6e20fa6f002d10b852902dbcc5404fb84b6",
	name: "adminSaveLesson",
	filename: "src/lib/courses.functions.ts"
}, (opts) => adminSaveLesson.__executeServer(opts));
var adminSaveLesson = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminSaveLesson_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const payload = {
		course_id: data.course_id,
		title: data.title,
		description: data.description ?? null,
		video_source: data.video_source,
		video_url: data.video_url ?? null,
		video_id: data.video_id ?? null,
		start_seconds: data.start_seconds ?? 0,
		end_seconds: data.end_seconds ?? null,
		duration_seconds: data.duration_seconds ?? null,
		notes: data.notes ?? null,
		position: data.position ?? 0,
		is_preview: data.is_preview ?? false
	};
	if (data.id) {
		const { data: row, error } = await context.supabase.from("course_lessons").update(payload).eq("id", data.id).select().single();
		if (error) throw new Error(error.message);
		return row;
	}
	const { data: row, error } = await context.supabase.from("course_lessons").insert(payload).select().single();
	if (error) throw new Error(error.message);
	return row;
});
var adminDeleteLesson_createServerFn_handler = createServerRpc({
	id: "8fc2cd3ed302ad1a1343c3670882a1c5da75d732fb94436f00d2bf5ef304a937",
	name: "adminDeleteLesson",
	filename: "src/lib/courses.functions.ts"
}, (opts) => adminDeleteLesson.__executeServer(opts));
var adminDeleteLesson = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminDeleteLesson_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { error } = await context.supabase.from("course_lessons").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var adminReorderLessons_createServerFn_handler = createServerRpc({
	id: "c8ee956b392ceec6dc3cd5abc2caffbb4ed76d57d664b71b6add8243f63d21b2",
	name: "adminReorderLessons",
	filename: "src/lib/courses.functions.ts"
}, (opts) => adminReorderLessons.__executeServer(opts));
var adminReorderLessons = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminReorderLessons_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	for (const o of data.orders) await context.supabase.from("course_lessons").update({ position: o.position }).eq("id", o.id);
	return { ok: true };
});
var adminSaveQuiz_createServerFn_handler = createServerRpc({
	id: "fb8f6af472d3182f675b867bdfd376dcfc2560a18d318a7e17dbe2c7721280fd",
	name: "adminSaveQuiz",
	filename: "src/lib/courses.functions.ts"
}, (opts) => adminSaveQuiz.__executeServer(opts));
var adminSaveQuiz = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminSaveQuiz_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const quizPayload = {
		course_id: data.course_id,
		lesson_id: data.lesson_id ?? null,
		title: data.title,
		description: data.description ?? null,
		pass_percent: data.pass_percent ?? 70
	};
	let quizId = data.id;
	if (quizId) {
		const { error } = await context.supabase.from("course_quizzes").update(quizPayload).eq("id", quizId);
		if (error) throw new Error(error.message);
	} else {
		const { data: q, error } = await context.supabase.from("course_quizzes").insert(quizPayload).select().single();
		if (error) throw new Error(error.message);
		quizId = q.id;
	}
	await context.supabase.from("course_quiz_questions").delete().eq("quiz_id", quizId);
	if (data.questions.length) {
		const rows = data.questions.map((q, i) => ({
			quiz_id: quizId,
			question: q.question,
			options: q.options,
			correct_index: q.correct_index,
			position: q.position ?? i
		}));
		const { error } = await context.supabase.from("course_quiz_questions").insert(rows);
		if (error) throw new Error(error.message);
	}
	return { id: quizId };
});
var adminDeleteQuiz_createServerFn_handler = createServerRpc({
	id: "71401d9ef3fd428916fa8665de4c2a0219450344a8bd1f89b837a1976a42adbe",
	name: "adminDeleteQuiz",
	filename: "src/lib/courses.functions.ts"
}, (opts) => adminDeleteQuiz.__executeServer(opts));
var adminDeleteQuiz = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminDeleteQuiz_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { error } = await context.supabase.from("course_quizzes").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var adminListEnrollments_createServerFn_handler = createServerRpc({
	id: "1c80ee43dfb749a7ac47b3101652cb3abafad17d84d298bb89a8aef9ae215d1f",
	name: "adminListEnrollments",
	filename: "src/lib/courses.functions.ts"
}, (opts) => adminListEnrollments.__executeServer(opts));
var adminListEnrollments = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(adminListEnrollments_createServerFn_handler, async ({ data, context }) => {
	await ensureAdmin(context);
	const { data: rows, error } = await context.supabase.from("course_enrollments").select("*, profile:profiles(full_name, email)").eq("course_id", data.courseId).order("enrolled_at", { ascending: false });
	if (error) throw new Error(error.message);
	return rows ?? [];
});
//#endregion
export { adminDeleteCourse_createServerFn_handler, adminDeleteLesson_createServerFn_handler, adminDeleteQuiz_createServerFn_handler, adminGetCourse_createServerFn_handler, adminListCourses_createServerFn_handler, adminListEnrollments_createServerFn_handler, adminReorderLessons_createServerFn_handler, adminSaveCourse_createServerFn_handler, adminSaveLesson_createServerFn_handler, adminSaveQuiz_createServerFn_handler, enrollInCourse_createServerFn_handler, getCourseBySlug_createServerFn_handler, getLearnData_createServerFn_handler, getMyEnrollment_createServerFn_handler, issueCertificate_createServerFn_handler, listMyCourses_createServerFn_handler, listPublishedCourses_createServerFn_handler, saveLessonProgress_createServerFn_handler, submitQuizAttempt_createServerFn_handler, verifyCertificate_createServerFn_handler };
