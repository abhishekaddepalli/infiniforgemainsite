import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, Award, ListChecks, FileText, Clipboard, Download } from "lucide-react";
import { getLearnData, saveLessonProgress, submitQuizAttempt, issueCertificate } from "@/lib/courses.functions";
import { BrandedVideoPlayer } from "@/components/course/BrandedVideoPlayer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { resolvePlayableVideo } from "@/lib/course-video";
import { downloadCertificatePdf } from "@/lib/certificate-pdf";

export const Route = createFileRoute("/courses/$slug/learn")({
  head: () => ({ meta: [{ title: "Learning — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: LearnPage,
});

type Lesson = {
  id: string; title: string; description: string | null; notes: string | null;
  video_source: "youtube" | "vimeo" | "drive" | "mp4" | "other";
  video_id: string | null; video_url: string | null;
  start_seconds: number; end_seconds: number | null; duration_seconds: number | null;
  position: number; is_preview: boolean;
};
type Quiz = {
  id: string; lesson_id: string | null; title: string; description: string | null; pass_percent: number;
  questions: { id: string; question: string; options: string[]; correct_index: number; position: number }[];
};
type ProgressRow = { lesson_id: string; watch_seconds: number; completed_at: string | null };
type QuizAttempt = { quiz_id: string; score_percent: number; passed: boolean; created_at: string };
type Certificate = { certificate_number: string; issued_at: string };
type CourseSettings = {
  title?: string;
  signature_image?: string | null;
  signatory_name?: string | null;
  signatory_title?: string | null;
  youtube_privacy_mode?: boolean | null;
  block_youtube_links?: boolean | null;
  player_accent_color?: string | null;
};

function LearnPage() {
  const { slug } = Route.useParams();
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getFn = useServerFn(getLearnData);
  const saveProgressFn = useServerFn(saveLessonProgress);
  const submitQuizFn = useServerFn(submitQuizAttempt);
  const certFn = useServerFn(issueCertificate);
  const [currentIdx, setCurrentIdx] = useState(0);
  const lastSaveRef = useRef<number>(0);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["course-learn", slug, user?.id],
    queryFn: () => getFn({ data: { courseSlug: slug } }),
    enabled: !!user,
    retry: false,
  });

  const saveProgress = useMutation({
    mutationFn: saveProgressFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["course-learn", slug] }),
  });

  const submitQuiz = useMutation({
    mutationFn: submitQuizFn,
    onSuccess: (r) => {
      toast[r.passed ? "success" : "error"](`Score: ${r.percent}% — ${r.passed ? "Passed!" : "Try again"}`);
      qc.invalidateQueries({ queryKey: ["course-learn", slug] });
    },
  });

  const claimCert = useMutation({
    mutationFn: certFn,
    onSuccess: (c) => {
      toast.success(`Certificate ${c.certificate_number} issued!`);
      qc.invalidateQueries({ queryKey: ["course-learn", slug] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const lessons: Lesson[] = useMemo(() => (data?.lessons ?? []) as unknown as Lesson[], [data]);
  const progress: ProgressRow[] = useMemo(() => (data?.progress ?? []) as unknown as ProgressRow[], [data]);
  const quizzes: Quiz[] = useMemo(() => (data?.quizzes ?? []) as unknown as Quiz[], [data]);
  const attempts: QuizAttempt[] = useMemo(() => (data?.attempts ?? []) as unknown as QuizAttempt[], [data]);
  const enrollment = data?.enrollment;
  const certificate = data?.certificate as Certificate | null | undefined;
  const courseSettings = data?.course as CourseSettings | undefined;
  const allQuizzesPassed = Boolean(data?.allQuizzesPassed);

  const firstPlayableIdx = useMemo(() => lessons.findIndex((lesson) => resolvePlayableVideo(lesson)), [lessons]);
  const currentLesson = lessons[currentIdx];
  const currentQuizzes = quizzes.filter((q) => q.lesson_id === currentLesson?.id);
  const endQuiz = quizzes.find((q) => !q.lesson_id);

  useEffect(() => {
    if (lessons.length === 0) return;
    if (currentIdx >= lessons.length) {
      setCurrentIdx(Math.max(firstPlayableIdx, 0));
      return;
    }
    if (currentLesson && !resolvePlayableVideo(currentLesson) && firstPlayableIdx >= 0) {
      setCurrentIdx(firstPlayableIdx);
    }
  }, [currentIdx, currentLesson, firstPlayableIdx, lessons.length]);

  if (loading || (user && isLoading)) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading course…</div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-muted-foreground">You need to enroll first.</p>
      <Button asChild><Link to="/courses/$slug" params={{ slug }}>Back to course</Link></Button>
    </div>
  );
  if (!currentLesson || !enrollment) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">No lessons available yet.</div>;

  const isCompleted = (lid: string) => progress.some((p) => p.lesson_id === lid && p.completed_at);
  const isQuizPassed = (quizId: string) => attempts.some((attempt) => attempt.quiz_id === quizId && attempt.passed);
  const bestQuizScore = (quizId: string) => attempts.filter((attempt) => attempt.quiz_id === quizId).reduce((best, attempt) => Math.max(best, attempt.score_percent), 0);
  const percent = enrollment.progress_percent ?? 0;
  const watchPct = Number(data?.watchPercent ?? 0);
  const quizAvg = Number(data?.quizAvg ?? 0);
  const minWatch = Number(data?.minWatch ?? 95);
  const minQuiz = Number(data?.minQuiz ?? 85);
  const meetsWatch = watchPct >= minWatch;
  const meetsQuiz = quizzes.length === 0 || quizAvg >= minQuiz;
  const canClaimCertificate = meetsWatch && meetsQuiz && allQuizzesPassed;
  const certificateName = `${(profile?.full_name || user?.email || "Learner").trim()}`;

  const handleProgress = (cur: number) => {
    const now = Date.now();
    if (now - lastSaveRef.current > 10000) {
      lastSaveRef.current = now;
      saveProgress.mutate({ data: { enrollmentId: enrollment.id, lessonId: currentLesson.id, watchSeconds: cur, completed: false } });
    }
  };
  const handleComplete = () => {
    saveProgress.mutate({ data: { enrollmentId: enrollment.id, lessonId: currentLesson.id, watchSeconds: currentLesson.end_seconds ?? currentLesson.duration_seconds ?? 0, completed: true } });
    toast.success("Lesson complete!");
  };
  const handleDownloadCertificate = (cert: Certificate) => {
    downloadCertificatePdf({
      certificateNumber: cert.certificate_number,
      issuedAt: cert.issued_at,
      recipientName: certificateName,
      courseTitle: courseSettings?.title ?? "Course",
      issuer: "Infiniforge",
      signatureImage: courseSettings?.signature_image ?? null,
      signatoryName: courseSettings?.signatory_name ?? null,
      signatoryTitle: courseSettings?.signatory_title ?? null,
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-80 lg:min-h-screen bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/courses/$slug" params={{ slug }} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to overview
          </Link>
          <h2 className="font-bold mt-2 line-clamp-2">{data?.course.title}</h2>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Progress</span><span>{percent}%</span></div>
            <Progress value={percent} className="h-2" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {lessons.map((l, i) => {
            const done = isCompleted(l.id);
            const active = i === currentIdx;
            return (
              <button key={l.id} onClick={() => setCurrentIdx(i)}
                className={cn(
                  "w-full text-left p-3 rounded-lg mb-1 flex items-start gap-3 transition-colors",
                  active ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                )}>
                {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" /> : active ? <PlayCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> : <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Lesson {i + 1}</div>
                  <div className="text-sm font-medium line-clamp-2">{l.title}</div>
                </div>
              </button>
            );
          })}
          {endQuiz && (
            <button onClick={() => document.getElementById("final-quiz")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="w-full text-left p-3 rounded-lg mt-4 flex items-start gap-3 bg-primary/5 border border-primary/20 hover:bg-primary/10">
              {isQuizPassed(endQuiz.id) ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" /> : <ListChecks className="h-5 w-5 text-primary shrink-0 mt-0.5" />}
              <div className="min-w-0"><div className="text-[10px] uppercase tracking-wider text-primary">Final quiz</div><div className="text-sm font-medium line-clamp-2">{endQuiz.title}</div></div>
            </button>
          )}
          <button onClick={() => canClaimCertificate && !certificate && claimCert.mutate({ data: { enrollmentId: enrollment.id } })}
            disabled={!canClaimCertificate || claimCert.isPending}
            className="w-full text-left p-3 rounded-lg mt-2 flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed">
            <Award className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-emerald-700">Certificate</div>
              <div className="text-sm font-medium">{certificate ? "Certificate issued" : canClaimCertificate ? "Claim certificate" : `${watchPct}% watched · ${quizzes.length ? `${quizAvg}% quiz avg` : "no quiz"}`}</div>
              {!certificate && !canClaimCertificate && (
                <div className="text-[10px] text-muted-foreground mt-0.5">Need ≥ {minWatch}% watch{quizzes.length ? ` & ≥ ${minQuiz}% quiz avg` : ""}</div>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {(() => {
          const playableVideo = resolvePlayableVideo(currentLesson);
          if (!playableVideo) {
            return (
              <div className="w-full aspect-video rounded-xl bg-secondary flex flex-col items-center justify-center text-center p-6 gap-2">
                <PlayCircle className="h-10 w-10 text-muted-foreground" />
                <p className="font-semibold">Video unavailable</p>
                <p className="text-sm text-muted-foreground max-w-md">This lesson has no valid video URL. Please contact support or ask the admin to update this lesson.</p>
              </div>
            );
          }
          return (
            <BrandedVideoPlayer
              key={currentLesson.id}
              source={playableVideo.source}
              videoId={playableVideo.videoId}
              videoUrl={playableVideo.url}
              startSeconds={currentLesson.start_seconds ?? 0}
              endSeconds={currentLesson.end_seconds}
              title={currentLesson.title}
              youtubePrivacyMode={courseSettings?.youtube_privacy_mode ?? false}
              blockYouTubeLinks={courseSettings?.block_youtube_links ?? true}
              accentColor={courseSettings?.player_accent_color ?? "#2563eb"}
              onProgress={handleProgress}
              onComplete={handleComplete}
            />
          );
        })()}

        <div className="mt-6 flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Lesson {currentIdx + 1} of {lessons.length}</div>
            <h1 className="text-2xl font-bold mt-1">{currentLesson.title}</h1>
            {currentLesson.description && <p className="text-muted-foreground mt-2">{currentLesson.description}</p>}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" disabled={currentIdx === 0} onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}>Previous</Button>
            <Button className="bg-gradient-brand text-white" disabled={saveProgress.isPending} onClick={() => { handleComplete(); setCurrentIdx((i) => Math.min(lessons.length - 1, i + 1)); }}>
              {currentIdx >= lessons.length - 1 ? "Mark done" : "Mark done · Next"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="notes" className="mt-6">
          <TabsList>
            <TabsTrigger value="notes"><FileText className="h-4 w-4 mr-1.5" /> Notes</TabsTrigger>
            {currentQuizzes.length > 0 && <TabsTrigger value="quiz"><ListChecks className="h-4 w-4 mr-1.5" /> Quiz</TabsTrigger>}
          </TabsList>
          <TabsContent value="notes">
            <div className="rounded-2xl border border-border bg-card p-5 whitespace-pre-wrap text-sm">
              {currentLesson.notes || <span className="text-muted-foreground">No notes for this lesson.</span>}
            </div>
          </TabsContent>
          {currentQuizzes.map((q) => (
            <TabsContent key={q.id} value="quiz">
              <QuizRunner quiz={q} enrollmentId={enrollment.id}
                onSubmit={(answers) => submitQuiz.mutate({ data: { quizId: q.id, enrollmentId: enrollment.id, answers } })} />
            </TabsContent>
          ))}
        </Tabs>

        {endQuiz && (
          <section id="final-quiz" className="mt-6 scroll-mt-6 rounded-2xl border border-primary/20 bg-card p-4 sm:p-5 shadow-card">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5"><ListChecks className="h-4 w-4" /> Final assessment</div>
                <h2 className="text-xl font-bold mt-1">{endQuiz.title}</h2>
                {endQuiz.description && <p className="text-sm text-muted-foreground mt-1">{endQuiz.description}</p>}
              </div>
              <Badge variant={isQuizPassed(endQuiz.id) ? "default" : "secondary"}>{isQuizPassed(endQuiz.id) ? "Passed" : `Best ${bestQuizScore(endQuiz.id)}%`}</Badge>
            </div>
            <QuizRunner quiz={endQuiz} enrollmentId={enrollment.id}
              onSubmit={(answers) => submitQuiz.mutate({ data: { quizId: endQuiz.id, enrollmentId: enrollment.id, answers } })} />
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Award className="h-4 w-4 text-amber-500" /> Certificate</div>
              <h2 className="text-xl font-bold mt-1">{certificate ? "Certificate issued" : canClaimCertificate ? "Ready to claim" : "Complete course requirements"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {certificate
                  ? `Certificate no. ${certificate.certificate_number}`
                  : `Watch time ${watchPct}% / ${minWatch}%${quizzes.length ? ` · Quiz avg ${quizAvg}% / ${minQuiz}%` : ""}`}
              </p>
              {!certificate && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <Badge variant={meetsWatch ? "default" : "secondary"} className={meetsWatch ? "bg-emerald-500 text-white" : ""}>
                    {meetsWatch ? "✓" : "○"} Watch ≥ {minWatch}%
                  </Badge>
                  {quizzes.length > 0 && (
                    <Badge variant={meetsQuiz ? "default" : "secondary"} className={meetsQuiz ? "bg-emerald-500 text-white" : ""}>
                      {meetsQuiz ? "✓" : "○"} Quiz avg ≥ {minQuiz}%
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {certificate ? (
                <>
                  <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(certificate.certificate_number); toast.success("Certificate number copied"); }}>
                    <Clipboard className="h-4 w-4 mr-1.5" /> Copy ID
                  </Button>
                  <Button className="bg-gradient-brand text-white" onClick={() => handleDownloadCertificate(certificate)}>
                    <Download className="h-4 w-4 mr-1.5" /> Download
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/certificates/verify">Verify</Link>
                  </Button>
                </>
              ) : (
                <Button className="bg-gradient-brand text-white" disabled={!canClaimCertificate || claimCert.isPending} onClick={() => claimCert.mutate({ data: { enrollmentId: enrollment.id } })}>
                  <Award className="h-4 w-4 mr-1.5" /> Claim certificate
                </Button>
              )}
            </div>
          </div>
        </section>

        {profile?.full_name && <p className="text-xs text-muted-foreground mt-8 text-center">Learning as <Badge variant="secondary">{profile.full_name}</Badge></p>}
      </main>
    </div>
  );
}

function QuizRunner({ quiz, onSubmit }: { quiz: Quiz; enrollmentId: string; onSubmit: (answers: number[]) => void }) {
  const [answers, setAnswers] = useState<number[]>(Array(quiz.questions.length).fill(-1));
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div>
        <h3 className="font-semibold">{quiz.title}</h3>
        <p className="text-xs text-muted-foreground">Pass with ≥ {quiz.pass_percent}%</p>
      </div>
      {quiz.questions.sort((a, b) => a.position - b.position).map((q, qi) => (
        <div key={q.id} className="space-y-2">
          <div className="font-medium text-sm">{qi + 1}. {q.question}</div>
          <div className="space-y-1.5">
            {q.options.map((opt, oi) => (
              <label key={oi} className={cn(
                "flex items-center gap-2 p-2.5 rounded-md border cursor-pointer text-sm transition-colors",
                answers[qi] === oi ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
              )}>
                <input type="radio" name={`q${qi}`} checked={answers[qi] === oi} onChange={() => {
                  const next = [...answers]; next[qi] = oi; setAnswers(next);
                }} />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <Button className="bg-gradient-brand text-white" onClick={() => onSubmit(answers)} disabled={answers.some((a) => a < 0)}>Submit quiz</Button>
    </div>
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char);
}
