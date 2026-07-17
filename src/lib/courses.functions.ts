import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resolvePlayableVideo } from "@/lib/course-video";

async function ensureAdmin(context: { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

// ----- Public catalog -----

export const listPublishedCourses = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await sb.from("courses")
    .select("id, slug, title, summary, cover_image, category, level, price_inr, is_free, instructor_name")
    .eq("is_published", true).order("sort_order").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getCourseBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data: course, error } = await sb.from("courses").select("*").eq("slug", data.slug).eq("is_published", true).maybeSingle();
    if (error) throw new Error(error.message);
    if (!course) return null;
    const { data: lessons } = await sb.from("course_lessons")
      .select("id, title, description, position, duration_seconds, is_preview, video_source")
      .eq("course_id", course.id).order("position");
    return { course, lessons: lessons ?? [] };
  });

// ----- Enrolled learner (authenticated) -----

export const getMyEnrollment = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { courseSlug: string }) => d)
  .handler(async ({ data, context }) => {
    const { data: course } = await context.supabase.from("courses").select("*").eq("slug", data.courseSlug).maybeSingle();
    if (!course) throw new Error("Course not found");
    const { data: enrollment } = await context.supabase.from("course_enrollments")
      .select("*").eq("course_id", course.id).eq("user_id", context.userId).maybeSingle();
    return { course, enrollment };
  });

export const enrollInCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { courseId: string }) => d)
  .handler(async ({ data, context }) => {
    const { data: course, error: cErr } = await context.supabase.from("courses").select("id, is_free, is_published, category").eq("id", data.courseId).maybeSingle();
    if (cErr) throw new Error(cErr.message);
    if (!course || !course.is_published) throw new Error("Course unavailable");
    let source: "free" | "membership" = "free";
    if (!course.is_free) {
      const { data: rank } = await context.supabase.rpc("get_user_tier_rank", { _user_id: context.userId });
      const userRank = Number(rank ?? 0);
      const nowIso = new Date().toISOString();
      const { data: activeMemberships } = await context.supabase
        .from("user_memberships")
        .select("tier_id")
        .eq("user_id", context.userId)
        .eq("status", "active")
        .or(`expires_at.is.null,expires_at.gt.${nowIso}`);
      const tierIds = new Set((activeMemberships ?? []).map((membership) => membership.tier_id));

      const { data: courseRules } = await context.supabase
        .from("resource_access")
        .select("min_tier_rank, required_tier_ids")
        .in("resource_type", ["course", "courses"])
        .eq("resource_id", data.courseId);

      let categoryRules: Array<{ min_tier_rank: number; required_tier_ids: unknown }> = [];
      if (course.category) {
        let matchingCategories: Array<{ id: string }> = [];
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
          const { data } = await context.supabase
            .from("resource_access")
            .select("min_tier_rank, required_tier_ids")
            .in("resource_type", ["category", "categories"])
            .in("resource_id", categoryIds);
          categoryRules = data ?? [];
        }
      }

      const rules = [...(courseRules ?? []), ...categoryRules];
      const allowed = rules.some((rule) => {
        const required = Array.isArray(rule.required_tier_ids) ? rule.required_tier_ids.map(String) : [];
        return userRank >= Number(rule.min_tier_rank ?? 0) || required.some((tierId) => tierIds.has(tierId));
      });
      if (!allowed) {
        throw new Error("This course requires purchase or a higher membership tier");
      }
      source = "membership";
    }
    const { data: enrollment, error } = await context.supabase.from("course_enrollments")
      .upsert({ course_id: data.courseId, user_id: context.userId, source }, { onConflict: "course_id,user_id" })
      .select().single();
    if (error) throw new Error(error.message);
    return enrollment;
  });

export const getLearnData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { courseSlug: string }) => d)
  .handler(async ({ data, context }) => {
    const { data: course } = await context.supabase.from("courses").select("*").eq("slug", data.courseSlug).maybeSingle();
    if (!course) throw new Error("Course not found");
    let { data: enrollment } = await context.supabase.from("course_enrollments")
      .select("*").eq("course_id", course.id).eq("user_id", context.userId).maybeSingle();
    if (!enrollment) {
      let canAutoEnroll = !!course.is_free;
      if (!canAutoEnroll) {
        const { data: rank } = await context.supabase.rpc("get_user_tier_rank", { _user_id: context.userId });
        const userRank = Number(rank ?? 0);
        const nowIso = new Date().toISOString();
        const { data: activeMemberships } = await context.supabase
          .from("user_memberships")
          .select("tier_id")
          .eq("user_id", context.userId)
          .eq("status", "active")
          .or(`expires_at.is.null,expires_at.gt.${nowIso}`);
        const tierIds = new Set((activeMemberships ?? []).map((membership) => membership.tier_id));
        const { data: courseRules } = await context.supabase
          .from("resource_access")
          .select("min_tier_rank, required_tier_ids")
          .in("resource_type", ["course", "courses"])
          .eq("resource_id", course.id);
        let categoryRules: Array<{ min_tier_rank: number; required_tier_ids: unknown }> = [];
        if (course.category) {
          let matchingCategories: Array<{ id: string }> = [];
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
            const { data } = await context.supabase
              .from("resource_access")
              .select("min_tier_rank, required_tier_ids")
              .in("resource_type", ["category", "categories"])
              .in("resource_id", categoryIds);
            categoryRules = data ?? [];
          }
        }
        const rules = [...(courseRules ?? []), ...categoryRules];
        canAutoEnroll = rules.some((rule) => {
          const required = Array.isArray(rule.required_tier_ids) ? rule.required_tier_ids.map(String) : [];
          return userRank >= Number(rule.min_tier_rank ?? 0) || required.some((tierId) => tierIds.has(tierId));
        });
      }
      if (!canAutoEnroll) throw new Error("Not enrolled");
      const { data: created, error: enrollError } = await context.supabase.from("course_enrollments")
        .upsert({ course_id: course.id, user_id: context.userId, source: course.is_free ? "free" : "membership" }, { onConflict: "course_id,user_id" })
        .select().single();
      if (enrollError) throw new Error(enrollError.message);
      enrollment = created;
    }
    const { data: lessons } = await context.supabase.from("course_lessons")
      .select("*").eq("course_id", course.id).order("position");
    const playableLessons = (lessons ?? []).filter((lesson) => resolvePlayableVideo({
      video_source: lesson.video_source,
      video_id: lesson.video_id,
      video_url: lesson.video_url,
    }));
    const { data: progress } = await context.supabase.from("course_lesson_progress")
      .select("*").eq("enrollment_id", enrollment.id);
    const { data: quizzes } = await context.supabase.from("course_quizzes")
      .select("*, questions:course_quiz_questions(*)").eq("course_id", course.id);
    const { data: attempts } = await context.supabase.from("course_quiz_attempts")
      .select("*").eq("enrollment_id", enrollment.id).order("created_at", { ascending: false });
    const { data: certificate } = await context.supabase.from("course_certificates")
      .select("*").eq("enrollment_id", enrollment.id).maybeSingle();
    const quizRows = quizzes ?? [];
    const attemptRows = attempts ?? [];
    const minWatch = Number(course.min_watch_percent ?? 95);
    const minQuiz = Number(course.min_quiz_percent ?? 85);
    // watch percent = sum(min(watch_seconds, effective_duration)) / sum(effective_duration)
    const progressByLesson = new Map((progress ?? []).map((p) => [p.lesson_id, p]));
    let watched = 0, total = 0;
    for (const lesson of playableLessons) {
      const effective = Number(
        (lesson.end_seconds && lesson.start_seconds != null
          ? lesson.end_seconds - lesson.start_seconds
          : lesson.duration_seconds) ?? 0
      );
      const dur = effective > 0 ? effective : 60; // fallback so lessons without meta still count
      total += dur;
      const p = progressByLesson.get(lesson.id);
      const w = p?.completed_at ? dur : Math.min(dur, Number(p?.watch_seconds ?? 0));
      watched += Math.max(0, w);
    }
    const watchPercent = total > 0 ? Math.round((watched / total) * 100) : 0;
    // best quiz average across all quizzes (100 if no quizzes)
    const bestByQuiz = new Map<string, number>();
    for (const a of attemptRows) {
      bestByQuiz.set(a.quiz_id, Math.max(bestByQuiz.get(a.quiz_id) ?? 0, Number(a.score_percent ?? 0)));
    }
    const quizAvg = quizRows.length
      ? Math.round(quizRows.reduce((s, q) => s + (bestByQuiz.get(q.id) ?? 0), 0) / quizRows.length)
      : 100;
    const allQuizzesPassed = quizRows.length === 0 || quizRows.every((quiz) => attemptRows.some((attempt) => attempt.quiz_id === quiz.id && attempt.passed));
    return {
      course, enrollment, lessons: playableLessons, progress: progress ?? [],
      quizzes: quizRows, attempts: attemptRows, certificate, allQuizzesPassed,
      watchPercent, quizAvg, minWatch, minQuiz,
    };
  });

export const saveLessonProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { enrollmentId: string; lessonId: string; watchSeconds: number; completed: boolean }) => d)
  .handler(async ({ data, context }) => {
    const { data: enrollment, error: enrollmentError } = await context.supabase
      .from("course_enrollments")
      .select("id, course_id, user_id")
      .eq("id", data.enrollmentId)
      .maybeSingle();
    if (enrollmentError) throw new Error(enrollmentError.message);
    if (!enrollment || enrollment.user_id !== context.userId) throw new Error("Not allowed");
    const { data: lesson } = await context.supabase
      .from("course_lessons")
      .select("id")
      .eq("id", data.lessonId)
      .eq("course_id", enrollment.course_id)
      .maybeSingle();
    if (!lesson) throw new Error("Lesson not found");
    const { data: existingProgress } = await context.supabase
      .from("course_lesson_progress")
      .select("completed_at, watch_seconds")
      .eq("enrollment_id", data.enrollmentId)
      .eq("lesson_id", data.lessonId)
      .maybeSingle();
    const completedAt = data.completed ? new Date().toISOString() : existingProgress?.completed_at ?? null;
    const payload = {
      enrollment_id: data.enrollmentId,
      lesson_id: data.lessonId,
      user_id: context.userId,
      watch_seconds: Math.max(Number(existingProgress?.watch_seconds ?? 0), Math.max(0, Math.floor(data.watchSeconds))),
      completed_at: completedAt,
    };
    const { error } = await context.supabase.from("course_lesson_progress")
      .upsert(payload, { onConflict: "enrollment_id,lesson_id" });
    if (error) throw new Error(error.message);
    // recompute enrollment percent
    const { data: lessons } = await context.supabase.from("course_lessons").select("id, video_source, video_id, video_url").eq("course_id", enrollment.course_id);
    const playableLessonIds = new Set((lessons ?? []).filter((lesson) => resolvePlayableVideo({
      video_source: lesson.video_source,
      video_id: lesson.video_id,
      video_url: lesson.video_url,
    })).map((lesson) => lesson.id));
    const total = playableLessonIds.size;
    const { data: done } = await context.supabase.from("course_lesson_progress").select("lesson_id").eq("enrollment_id", data.enrollmentId).not("completed_at", "is", null);
    const completedPlayable = (done ?? []).filter((row) => playableLessonIds.has(row.lesson_id)).length;
    const percent = total ? Math.min(100, Math.round((completedPlayable / total) * 100)) : 0;
    await context.supabase.from("course_enrollments").update({
      progress_percent: percent,
      completed_at: percent >= 100 ? new Date().toISOString() : null,
    }).eq("id", data.enrollmentId).eq("user_id", context.userId);
    return { percent };
  });

export const submitQuizAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { quizId: string; enrollmentId: string; answers: number[] }) => d)
  .handler(async ({ data, context }) => {
    const { data: enrollment } = await context.supabase.from("course_enrollments")
      .select("id, course_id, user_id").eq("id", data.enrollmentId).maybeSingle();
    if (!enrollment || enrollment.user_id !== context.userId) throw new Error("Not allowed");
    const { data: quiz } = await context.supabase.from("course_quizzes")
      .select("*, questions:course_quiz_questions(id, correct_index, position)").eq("id", data.quizId).single();
    if (!quiz) throw new Error("Quiz not found");
    if (quiz.course_id !== enrollment.course_id) throw new Error("Quiz does not belong to this enrollment");
    const qs = (quiz.questions ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position);
    const correct = qs.reduce((acc: number, q: { correct_index: number }, i: number) => acc + (data.answers[i] === q.correct_index ? 1 : 0), 0);
    const percent = qs.length ? Math.round((correct / qs.length) * 100) : 0;
    const passed = percent >= (quiz.pass_percent ?? 70);
    const { error } = await context.supabase.from("course_quiz_attempts").insert({
      quiz_id: data.quizId, enrollment_id: data.enrollmentId, user_id: context.userId,
      score_percent: percent, passed, answers: data.answers,
    });
    if (error) throw new Error(error.message);
    return { percent, passed };
  });

export const issueCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { enrollmentId: string }) => d)
  .handler(async ({ data, context }) => {
    const { data: enr } = await context.supabase.from("course_enrollments")
      .select("id, course_id, progress_percent, user_id").eq("id", data.enrollmentId).single();
    if (!enr || enr.user_id !== context.userId) throw new Error("Not allowed");
    const { data: course } = await context.supabase.from("courses")
      .select("id, min_watch_percent, min_quiz_percent").eq("id", enr.course_id).single();
    const minWatch = Number(course?.min_watch_percent ?? 95);
    const minQuiz = Number(course?.min_quiz_percent ?? 85);

    const { data: lessons } = await context.supabase.from("course_lessons")
      .select("id, video_source, video_id, video_url, start_seconds, end_seconds, duration_seconds")
      .eq("course_id", enr.course_id);
    const playable = (lessons ?? []).filter((lesson) => resolvePlayableVideo({
      video_source: lesson.video_source,
      video_id: lesson.video_id,
      video_url: lesson.video_url,
    }));
    const { data: progressRows } = await context.supabase.from("course_lesson_progress")
      .select("lesson_id, watch_seconds, completed_at").eq("enrollment_id", enr.id);
    const progressByLesson = new Map((progressRows ?? []).map((p) => [p.lesson_id, p]));
    let watched = 0, total = 0;
    for (const lesson of playable) {
      const effective = Number(
        (lesson.end_seconds && lesson.start_seconds != null
          ? lesson.end_seconds - lesson.start_seconds
          : lesson.duration_seconds) ?? 0
      );
      const dur = effective > 0 ? effective : 60;
      total += dur;
      const p = progressByLesson.get(lesson.id);
      const w = p?.completed_at ? dur : Math.min(dur, Number(p?.watch_seconds ?? 0));
      watched += Math.max(0, w);
    }
    const watchPercent = total > 0 ? Math.round((watched / total) * 100) : 0;
    if (watchPercent < minWatch) {
      throw new Error(`Watch at least ${minWatch}% of the course to earn your certificate (currently ${watchPercent}%).`);
    }

    const { data: quizzes } = await context.supabase.from("course_quizzes").select("id").eq("course_id", enr.course_id);
    if ((quizzes ?? []).length) {
      const { data: attempts } = await context.supabase.from("course_quiz_attempts")
        .select("quiz_id, score_percent").eq("enrollment_id", enr.id);
      const bestByQuiz = new Map<string, number>();
      for (const a of attempts ?? []) {
        bestByQuiz.set(a.quiz_id, Math.max(bestByQuiz.get(a.quiz_id) ?? 0, Number(a.score_percent ?? 0)));
      }
      const missing = (quizzes ?? []).some((q) => !bestByQuiz.has(q.id));
      if (missing) throw new Error("Attempt every quiz before claiming your certificate.");
      const avg = Math.round(
        (quizzes ?? []).reduce((s, q) => s + (bestByQuiz.get(q.id) ?? 0), 0) / (quizzes ?? []).length
      );
      if (avg < minQuiz) {
        throw new Error(`Quiz average must be at least ${minQuiz}% (currently ${avg}%).`);
      }
    }
    await context.supabase.from("course_enrollments").update({ progress_percent: 100, completed_at: new Date().toISOString() }).eq("id", enr.id).eq("user_id", context.userId);
    const { data: existing } = await context.supabase.from("course_certificates").select("*").eq("enrollment_id", enr.id).maybeSingle();
    if (existing) return existing;
    const certNumber = `IF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const { data: cert, error } = await context.supabase.from("course_certificates")
      .insert({ enrollment_id: enr.id, user_id: context.userId, course_id: enr.course_id, certificate_number: certNumber })
      .select().single();
    if (error) throw new Error(error.message);
    return cert;
  });

export const verifyCertificate = createServerFn({ method: "GET" })
  .inputValidator((d: { certificateNumber: string }) => d)
  .handler(async ({ data }) => {
    const certificateNumber = data.certificateNumber.trim().toUpperCase();
    if (!certificateNumber) return { valid: false };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cert, error } = await supabaseAdmin
      .from("course_certificates")
      .select("certificate_number, issued_at, course:courses(title, slug)")
      .eq("certificate_number", certificateNumber)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!cert) return { valid: false, certificate_number: certificateNumber };
    return {
      valid: true,
      certificate_number: cert.certificate_number,
      issued_at: cert.issued_at,
      course: cert.course,
    };
  });

export const listMyCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("course_enrollments")
      .select("*, course:courses(id, slug, title, cover_image, category, level)")
      .eq("user_id", context.userId).order("enrolled_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ----- Admin -----

export const adminListCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase.from("courses").select("*, lessons:course_lessons(count)").order("sort_order").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetCourse = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { data: course } = await context.supabase.from("courses").select("*").eq("id", data.id).single();
    const { data: lessons } = await context.supabase.from("course_lessons").select("*").eq("course_id", data.id).order("position");
    const { data: quizzes } = await context.supabase.from("course_quizzes").select("*, questions:course_quiz_questions(*)").eq("course_id", data.id);
    return { course, lessons: lessons ?? [], quizzes: quizzes ?? [] };
  });

export const adminSaveCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id?: string; slug: string; title: string; summary?: string; description?: string;
    cover_image?: string; category?: string; level?: string; instructor_name?: string;
    price_inr?: number; is_free?: boolean; is_published?: boolean; sort_order?: number;
    min_watch_percent?: number; min_quiz_percent?: number;
    signature_image?: string | null; signatory_name?: string; signatory_title?: string;
    youtube_privacy_mode?: boolean; block_youtube_links?: boolean; player_accent_color?: string;
  }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const playerAccent = /^#[0-9A-Fa-f]{6}$/.test(data.player_accent_color ?? "") ? data.player_accent_color : "#2563eb";
    const payload = {
      slug: data.slug, title: data.title, summary: data.summary ?? null, description: data.description ?? null,
      cover_image: data.cover_image ?? null, category: data.category ?? null, level: data.level ?? "beginner",
      instructor_name: data.instructor_name ?? null, price_inr: data.price_inr ?? 0,
      is_free: data.is_free ?? true, is_published: data.is_published ?? false, sort_order: data.sort_order ?? 0,
      min_watch_percent: Math.max(0, Math.min(100, Number(data.min_watch_percent ?? 95))),
      min_quiz_percent: Math.max(0, Math.min(100, Number(data.min_quiz_percent ?? 85))),
      signature_image: data.signature_image ?? null,
      signatory_name: data.signatory_name ?? null,
      signatory_title: data.signatory_title ?? null,
      youtube_privacy_mode: data.youtube_privacy_mode ?? false,
      block_youtube_links: data.block_youtube_links ?? true,
      player_accent_color: playerAccent,
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

export const adminDeleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("courses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSaveLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id?: string; course_id: string; title: string; description?: string;
    video_source: string; video_url?: string; video_id?: string;
    start_seconds?: number; end_seconds?: number | null; duration_seconds?: number | null;
    notes?: string; position?: number; is_preview?: boolean;
  }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const payload = {
      course_id: data.course_id, title: data.title, description: data.description ?? null,
      video_source: data.video_source, video_url: data.video_url ?? null, video_id: data.video_id ?? null,
      start_seconds: data.start_seconds ?? 0, end_seconds: data.end_seconds ?? null,
      duration_seconds: data.duration_seconds ?? null, notes: data.notes ?? null,
      position: data.position ?? 0, is_preview: data.is_preview ?? false,
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

export const adminDeleteLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("course_lessons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReorderLessons = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { orders: { id: string; position: number }[] }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    for (const o of data.orders) {
      await context.supabase.from("course_lessons").update({ position: o.position }).eq("id", o.id);
    }
    return { ok: true };
  });

export const adminSaveQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: {
    id?: string; course_id: string; lesson_id?: string | null;
    title: string; description?: string; pass_percent?: number;
    questions: { id?: string; question: string; options: string[]; correct_index: number; position: number }[];
  }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const quizPayload = {
      course_id: data.course_id, lesson_id: data.lesson_id ?? null,
      title: data.title, description: data.description ?? null, pass_percent: data.pass_percent ?? 70,
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
        quiz_id: quizId, question: q.question, options: q.options,
        correct_index: q.correct_index, position: q.position ?? i,
      }));
      const { error } = await context.supabase.from("course_quiz_questions").insert(rows);
      if (error) throw new Error(error.message);
    }
    return { id: quizId };
  });

export const adminDeleteQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("course_quizzes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListEnrollments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { courseId: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { data: rows, error } = await context.supabase.from("course_enrollments")
      .select("*, profile:profiles(full_name, email)").eq("course_id", data.courseId).order("enrolled_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
