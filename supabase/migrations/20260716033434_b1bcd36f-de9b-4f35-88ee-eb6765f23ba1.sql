
-- Restrict course_lessons: only preview lessons public; full content requires enrollment
DROP POLICY IF EXISTS "View lessons of published courses" ON public.course_lessons;

CREATE POLICY "View preview lessons of published courses"
ON public.course_lessons
FOR SELECT
USING (
  is_admin(auth.uid())
  OR is_staff(auth.uid())
  OR (
    is_preview = true
    AND EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_lessons.course_id AND c.is_published = true
    )
  )
  OR (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.course_enrollments e
      WHERE e.course_id = course_lessons.course_id
        AND e.user_id = auth.uid()
    )
  )
);

-- Restrict course_quiz_questions: only enrolled users / staff can see questions & answers
DROP POLICY IF EXISTS "View questions of published courses" ON public.course_quiz_questions;

CREATE POLICY "View questions for enrolled users"
ON public.course_quiz_questions
FOR SELECT
USING (
  is_admin(auth.uid())
  OR is_staff(auth.uid())
  OR (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.course_quizzes q
      JOIN public.course_enrollments e
        ON e.course_id = q.course_id AND e.user_id = auth.uid()
      WHERE q.id = course_quiz_questions.quiz_id
    )
  )
);
