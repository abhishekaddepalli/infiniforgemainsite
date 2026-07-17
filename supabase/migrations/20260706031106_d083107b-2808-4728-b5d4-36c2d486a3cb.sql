
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_lessons TO authenticated;
GRANT ALL ON public.course_lessons TO service_role;
GRANT SELECT ON public.course_lessons TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_quizzes TO authenticated;
GRANT ALL ON public.course_quizzes TO service_role;
GRANT SELECT ON public.course_quizzes TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_quiz_questions TO authenticated;
GRANT ALL ON public.course_quiz_questions TO service_role;
GRANT SELECT ON public.course_quiz_questions TO anon;

GRANT SELECT ON public.membership_tiers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.membership_tiers TO authenticated;
GRANT ALL ON public.membership_tiers TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_memberships TO authenticated;
GRANT ALL ON public.user_memberships TO service_role;

GRANT SELECT ON public.resource_access TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resource_access TO authenticated;
GRANT ALL ON public.resource_access TO service_role;

-- Also grant on other related course tables just in case
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
GRANT SELECT ON public.courses TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_enrollments TO authenticated;
GRANT ALL ON public.course_enrollments TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_lesson_progress TO authenticated;
GRANT ALL ON public.course_lesson_progress TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_quiz_attempts TO authenticated;
GRANT ALL ON public.course_quiz_attempts TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_certificates TO authenticated;
GRANT ALL ON public.course_certificates TO service_role;

-- upsert on resource_access needs a unique constraint on (resource_type, resource_id)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'resource_access_type_id_unique'
  ) THEN
    ALTER TABLE public.resource_access
      ADD CONSTRAINT resource_access_type_id_unique UNIQUE (resource_type, resource_id);
  END IF;
END $$;
