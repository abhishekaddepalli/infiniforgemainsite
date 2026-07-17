-- Courses feature schema

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  cover_image TEXT,
  category TEXT,
  level TEXT DEFAULT 'beginner',
  instructor_name TEXT,
  price_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_source TEXT NOT NULL DEFAULT 'youtube',
  video_url TEXT,
  video_id TEXT,
  start_seconds INTEGER NOT NULL DEFAULT 0,
  end_seconds INTEGER,
  duration_seconds INTEGER,
  notes TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_lessons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_lessons TO authenticated;
GRANT ALL ON public.course_lessons TO service_role;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View lessons of published courses" ON public.course_lessons FOR SELECT USING (
  public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.is_published = true)
);
CREATE POLICY "Admins manage lessons" ON public.course_lessons FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER course_lessons_updated BEFORE UPDATE ON public.course_lessons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_course_lessons_course ON public.course_lessons(course_id, position);

CREATE TABLE public.course_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pass_percent INTEGER NOT NULL DEFAULT 70,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_quizzes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_quizzes TO authenticated;
GRANT ALL ON public.course_quizzes TO service_role;
ALTER TABLE public.course_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View quizzes of published courses" ON public.course_quizzes FOR SELECT USING (
  public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.is_published = true)
);
CREATE POLICY "Admins manage quizzes" ON public.course_quizzes FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER course_quizzes_updated BEFORE UPDATE ON public.course_quizzes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.course_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.course_quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_index INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_quiz_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_quiz_questions TO authenticated;
GRANT ALL ON public.course_quiz_questions TO service_role;
ALTER TABLE public.course_quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View questions of published courses" ON public.course_quiz_questions FOR SELECT USING (
  public.is_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.course_quizzes q JOIN public.courses c ON c.id = q.course_id
    WHERE q.id = quiz_id AND c.is_published = true
  )
);
CREATE POLICY "Admins manage questions" ON public.course_quiz_questions FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  source TEXT NOT NULL DEFAULT 'free',
  progress_percent INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_enrollments TO authenticated;
GRANT ALL ON public.course_enrollments TO service_role;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own enrollments" ON public.course_enrollments FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Users create own enrollment" ON public.course_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own enrollment" ON public.course_enrollments FOR UPDATE USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage enrollments" ON public.course_enrollments FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.course_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  watch_seconds INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_lesson_progress TO authenticated;
GRANT ALL ON public.course_lesson_progress TO service_role;
ALTER TABLE public.course_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON public.course_lesson_progress FOR ALL USING (auth.uid() = user_id OR public.is_admin(auth.uid())) WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE TRIGGER course_progress_updated BEFORE UPDATE ON public.course_lesson_progress FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.course_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.course_quizzes(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  score_percent INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.course_quiz_attempts TO authenticated;
GRANT ALL ON public.course_quiz_attempts TO service_role;
ALTER TABLE public.course_quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own attempts" ON public.course_quiz_attempts FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Users insert own attempts" ON public.course_quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL UNIQUE REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.course_certificates TO authenticated;
GRANT SELECT ON public.course_certificates TO anon;
GRANT ALL ON public.course_certificates TO service_role;
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own certs, public verify by number" ON public.course_certificates FOR SELECT USING (true);
CREATE POLICY "Users insert own cert" ON public.course_certificates FOR INSERT WITH CHECK (auth.uid() = user_id);