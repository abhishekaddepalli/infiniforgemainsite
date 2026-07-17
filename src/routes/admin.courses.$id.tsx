import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronRight, GraduationCap, Plus, Trash2, Edit3, ArrowLeft, PlayCircle, ListChecks } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminGetCourse, adminSaveLesson, adminDeleteLesson, adminReorderLessons,
  adminSaveQuiz, adminDeleteQuiz,
} from "@/lib/courses.functions";
import { isPlaceholderVideoValue, parseVideoUrl } from "@/lib/course-video";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ResourceAccessEditor } from "@/components/admin/ResourceAccessEditor";

export const Route = createFileRoute("/admin/courses/$id")({
  head: () => ({ meta: [{ title: "Course editor — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Course editor"><CourseEditorPage /></AdminShell>,
});

type Lesson = {
  id: string; course_id: string; title: string; description: string | null;
  video_source: string; video_url: string | null; video_id: string | null;
  start_seconds: number; end_seconds: number | null; duration_seconds: number | null;
  notes: string | null; position: number; is_preview: boolean;
};
type Quiz = {
  id: string; course_id: string; lesson_id: string | null; title: string;
  description: string | null; pass_percent: number;
  questions: { id?: string; question: string; options: string[]; correct_index: number; position: number }[];
};

function CourseEditorPage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const getFn = useServerFn(adminGetCourse);
  const saveLessonFn = useServerFn(adminSaveLesson);
  const delLessonFn = useServerFn(adminDeleteLesson);
  const reorderFn = useServerFn(adminReorderLessons);
  const saveQuizFn = useServerFn(adminSaveQuiz);
  const delQuizFn = useServerFn(adminDeleteQuiz);

  const [lessonEdit, setLessonEdit] = useState<Partial<Lesson> | null>(null);
  const [quizEdit, setQuizEdit] = useState<Partial<Quiz> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-course", id],
    queryFn: () => getFn({ data: { id } }),
  });

  const saveLesson = useMutation({
    mutationFn: async (l: Partial<Lesson>) => {
      let source = l.video_source ?? "youtube";
      let videoId = l.video_id ?? "";
      if (isPlaceholderVideoValue(l.video_url)) {
        throw new Error("Please add a valid video URL for this lesson.");
      }
      if (l.video_url) {
        const parsed = parseVideoUrl(l.video_url);
        if (!parsed) throw new Error("Please add a valid YouTube, Vimeo, Drive, or MP4 video URL.");
        source = parsed.source; videoId = parsed.videoId;
      }
      return saveLessonFn({ data: {
        id: l.id, course_id: id, title: l.title!, description: l.description ?? "",
        video_source: source, video_url: l.video_url ?? "", video_id: videoId,
        start_seconds: Number(l.start_seconds ?? 0),
        end_seconds: l.end_seconds ? Number(l.end_seconds) : null,
        duration_seconds: l.duration_seconds ? Number(l.duration_seconds) : null,
        notes: l.notes ?? "", position: Number(l.position ?? 0), is_preview: l.is_preview ?? false,
      } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-course", id] }); setLessonEdit(null); toast.success("Lesson saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const delLesson = useMutation({
    mutationFn: (lid: string) => delLessonFn({ data: { id: lid } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-course", id] }); toast.success("Lesson deleted"); },
  });

  const move = useMutation({
    mutationFn: (orders: { id: string; position: number }[]) => reorderFn({ data: { orders } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-course", id] }),
  });

  const saveQuiz = useMutation({
    mutationFn: (q: Partial<Quiz>) => saveQuizFn({ data: {
      id: q.id, course_id: id, lesson_id: q.lesson_id ?? null,
      title: q.title!, description: q.description ?? "", pass_percent: Number(q.pass_percent ?? 70),
      questions: (q.questions ?? []).map((qq, i) => ({
        id: qq.id, question: qq.question, options: qq.options,
        correct_index: qq.correct_index, position: qq.position ?? i,
      })),
    } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-course", id] }); setQuizEdit(null); toast.success("Quiz saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const delQuiz = useMutation({
    mutationFn: (qid: string) => delQuizFn({ data: { id: qid } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-course", id] }); toast.success("Quiz deleted"); },
  });

  const move2 = (index: number, dir: -1 | 1) => {
    const lessons = [...(data?.lessons ?? [])];
    const j = index + dir;
    if (j < 0 || j >= lessons.length) return;
    [lessons[index], lessons[j]] = [lessons[j], lessons[index]];
    move.mutate(lessons.map((l, i) => ({ id: l.id, position: i + 1 })));
  };

  if (isLoading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!data?.course) return <div className="p-10 text-center text-muted-foreground">Course not found.</div>;

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/admin/courses" className="hover:text-foreground">Courses</Link>
            <ChevronRight className="h-3 w-3" /><span>{data.course.title}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" /> {data.course.title}
          </h1>
        </div>
        <Button asChild variant="outline" size="sm"><Link to="/admin/courses"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back</Link></Button>
      </div>

      <div className="mt-4">
        <ResourceAccessEditor resourceType="course" resourceId={data.course.id} />
      </div>


      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons"><PlayCircle className="h-4 w-4 mr-1.5" /> Lessons</TabsTrigger>
          <TabsTrigger value="quizzes"><ListChecks className="h-4 w-4 mr-1.5" /> Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" className="bg-gradient-brand text-white"
              onClick={() => setLessonEdit({ video_source: "youtube", position: (data.lessons.length + 1), start_seconds: 0 })}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add lesson
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border">
                  <th className="px-5 py-3 w-12">#</th>
                  <th className="px-3 py-3">Title</th>
                  <th className="px-3 py-3">Source</th>
                  <th className="px-3 py-3">Trim</th>
                  <th className="px-3 py-3">Preview</th>
                  <th className="pl-3 pr-5 py-3 w-40"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.lessons.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No lessons yet.</td></tr>}
                {data.lessons.map((l: Lesson, idx: number) => (
                  <tr key={l.id} className="hover:bg-secondary/30">
                    <td className="px-5 py-3 text-xs text-muted-foreground">{idx + 1}</td>
                    <td className="px-3 py-3"><div className="font-medium break-words">{l.title}</div><div className="text-xs text-muted-foreground line-clamp-1">{l.description}</div></td>
                    <td className="px-3 py-3"><Badge variant="secondary" className="uppercase">{l.video_source}</Badge></td>
                    <td className="px-3 py-3 text-xs">{l.start_seconds}s – {l.end_seconds ?? "end"}</td>
                    <td className="px-3 py-3">{l.is_preview ? <Badge className="bg-primary/15 text-primary">Free preview</Badge> : "—"}</td>
                    <td className="pl-3 pr-5 py-3 text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => move2(idx, -1)}>↑</Button>
                      <Button size="sm" variant="ghost" onClick={() => move2(idx, 1)}>↓</Button>
                      <Button size="sm" variant="ghost" onClick={() => setLessonEdit(l)}><Edit3 className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => confirm(`Delete "${l.title}"?`) && delLesson.mutate(l.id)}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" className="bg-gradient-brand text-white"
              onClick={() => setQuizEdit({ title: "", pass_percent: 70, questions: [] })}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add quiz
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(data.quizzes ?? []).length === 0 && <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground col-span-2">No quizzes yet.</div>}
            {(data.quizzes ?? []).map((raw) => {
              const q = raw as unknown as Quiz; return (
              <div key={q.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{q.title}</div>
                    <div className="text-xs text-muted-foreground">{q.questions?.length ?? 0} questions · Pass ≥ {q.pass_percent}%</div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setQuizEdit(q)}><Edit3 className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => confirm(`Delete quiz "${q.title}"?`) && delQuiz.mutate(q.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ); })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Lesson dialog */}
      <Dialog open={!!lessonEdit} onOpenChange={(v) => !v && setLessonEdit(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{lessonEdit?.id ? "Edit lesson" : "New lesson"}</DialogTitle></DialogHeader>
          {lessonEdit && (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); saveLesson.mutate(lessonEdit); }}>
              <div><Label>Title</Label><Input required value={lessonEdit.title ?? ""} onChange={(e) => setLessonEdit({ ...lessonEdit, title: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Description</Label><Textarea rows={2} value={lessonEdit.description ?? ""} onChange={(e) => setLessonEdit({ ...lessonEdit, description: e.target.value })} className="mt-1.5" /></div>
              <div><Label>Video URL <span className="text-xs text-muted-foreground">(YouTube, Vimeo, Drive, MP4)</span></Label>
                <Input required value={lessonEdit.video_url ?? ""} onChange={(e) => {
                  const parsed = parseVideoUrl(e.target.value);
                  setLessonEdit({ ...lessonEdit, video_url: e.target.value, video_source: parsed?.source ?? lessonEdit.video_source ?? "other", video_id: parsed?.videoId ?? "" });
                }} className="mt-1.5" placeholder="https://youtube.com/watch?v=…" />
                {lessonEdit.video_source && <p className="text-xs text-muted-foreground mt-1">Detected: <span className="font-mono uppercase">{lessonEdit.video_source}</span> · id <span className="font-mono">{lessonEdit.video_id}</span></p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Start (sec)</Label><Input type="number" min={0} value={lessonEdit.start_seconds ?? 0} onChange={(e) => setLessonEdit({ ...lessonEdit, start_seconds: Number(e.target.value) })} className="mt-1.5" /></div>
                <div><Label>End (sec)</Label><Input type="number" min={0} value={lessonEdit.end_seconds ?? ""} onChange={(e) => setLessonEdit({ ...lessonEdit, end_seconds: e.target.value ? Number(e.target.value) : null })} className="mt-1.5" placeholder="—" /></div>
                <div><Label>Duration (sec)</Label><Input type="number" min={0} value={lessonEdit.duration_seconds ?? ""} onChange={(e) => setLessonEdit({ ...lessonEdit, duration_seconds: e.target.value ? Number(e.target.value) : null })} className="mt-1.5" /></div>
              </div>
              <div><Label>Notes (markdown supported)</Label><Textarea rows={3} value={lessonEdit.notes ?? ""} onChange={(e) => setLessonEdit({ ...lessonEdit, notes: e.target.value })} className="mt-1.5" /></div>
              <div className="flex items-center gap-3"><Switch checked={lessonEdit.is_preview ?? false} onCheckedChange={(v) => setLessonEdit({ ...lessonEdit, is_preview: v })} /><Label>Free preview (visible before enroll)</Label></div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setLessonEdit(null)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-brand text-white" disabled={saveLesson.isPending}>Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Quiz dialog */}
      <Dialog open={!!quizEdit} onOpenChange={(v) => !v && setQuizEdit(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{quizEdit?.id ? "Edit quiz" : "New quiz"}</DialogTitle></DialogHeader>
          {quizEdit && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveQuiz.mutate(quizEdit); }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label>Title</Label><Input required value={quizEdit.title ?? ""} onChange={(e) => setQuizEdit({ ...quizEdit, title: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Pass %</Label><Input type="number" min={0} max={100} value={quizEdit.pass_percent ?? 70} onChange={(e) => setQuizEdit({ ...quizEdit, pass_percent: Number(e.target.value) })} className="mt-1.5" /></div>
                <div><Label>Attach to lesson (optional)</Label>
                  <select value={quizEdit.lesson_id ?? ""} onChange={(e) => setQuizEdit({ ...quizEdit, lesson_id: e.target.value || null })} className="mt-1.5 w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="">End of course</option>
                    {data.lessons.map((l: Lesson) => <option key={l.id} value={l.id}>{l.title}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Questions</Label>
                  <Button type="button" size="sm" variant="outline" onClick={() => setQuizEdit({
                    ...quizEdit,
                    questions: [...(quizEdit.questions ?? []), { question: "", options: ["", ""], correct_index: 0, position: (quizEdit.questions?.length ?? 0) + 1 }],
                  })}><Plus className="h-3.5 w-3.5 mr-1.5" /> Add question</Button>
                </div>
                {(quizEdit.questions ?? []).map((q, qi) => (
                  <div key={qi} className="rounded-xl border border-border p-3 space-y-2 bg-secondary/30">
                    <div className="flex gap-2">
                      <Input required placeholder={`Question ${qi + 1}`} value={q.question} onChange={(e) => {
                        const qs = [...(quizEdit.questions ?? [])]; qs[qi] = { ...q, question: e.target.value };
                        setQuizEdit({ ...quizEdit, questions: qs });
                      }} />
                      <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => {
                        const qs = [...(quizEdit.questions ?? [])]; qs.splice(qi, 1);
                        setQuizEdit({ ...quizEdit, questions: qs });
                      }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex gap-2 items-center">
                        <input type="radio" name={`q${qi}`} checked={q.correct_index === oi} onChange={() => {
                          const qs = [...(quizEdit.questions ?? [])]; qs[qi] = { ...q, correct_index: oi };
                          setQuizEdit({ ...quizEdit, questions: qs });
                        }} />
                        <Input required placeholder={`Option ${oi + 1}`} value={opt} onChange={(e) => {
                          const qs = [...(quizEdit.questions ?? [])]; const os = [...q.options]; os[oi] = e.target.value;
                          qs[qi] = { ...q, options: os }; setQuizEdit({ ...quizEdit, questions: qs });
                        }} />
                        {q.options.length > 2 && (
                          <Button type="button" size="sm" variant="ghost" onClick={() => {
                            const qs = [...(quizEdit.questions ?? [])]; const os = [...q.options]; os.splice(oi, 1);
                            qs[qi] = { ...q, options: os, correct_index: Math.min(q.correct_index, os.length - 1) };
                            setQuizEdit({ ...quizEdit, questions: qs });
                          }}><Trash2 className="h-4 w-4" /></Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" size="sm" variant="ghost" onClick={() => {
                      const qs = [...(quizEdit.questions ?? [])]; qs[qi] = { ...q, options: [...q.options, ""] };
                      setQuizEdit({ ...quizEdit, questions: qs });
                    }}><Plus className="h-3.5 w-3.5 mr-1.5" /> Option</Button>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setQuizEdit(null)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-brand text-white" disabled={saveQuiz.isPending}>Save quiz</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
