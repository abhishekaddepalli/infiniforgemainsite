import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { GraduationCap, PlayCircle, Award, Compass, Sparkles, ArrowRight, Lock } from "lucide-react";
import { listMyCourses, enrollInCourse } from "@/lib/courses.functions";
import { getMyBenefits, getMyMembership } from "@/lib/memberships.functions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/courses")({
  head: () => ({ meta: [{ title: "My Courses — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: MyCoursesPage,
});

type Enrollment = {
  id: string; course_id: string; progress_percent: number; completed_at: string | null; enrolled_at: string;
  course: { id: string; slug: string; title: string; cover_image: string | null; category: string | null; level: string | null };
};

function MyCoursesPage() {
  const listFn = useServerFn(listMyCourses);
  const benefitsFn = useServerFn(getMyBenefits);
  const membershipFn = useServerFn(getMyMembership);
  const enrollFn = useServerFn(enrollInCourse);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ["my-courses"],
    queryFn: () => listFn() as Promise<Enrollment[]>,
  });
  const { data: benefits, isLoading: loadingBenefits } = useQuery({
    queryKey: ["my-benefits"],
    queryFn: () => benefitsFn() as Promise<{ user_rank: number; courses: Array<{ id: string; slug: string; title: string; cover_image: string | null; category: string | null; level: string | null }> }>,
  });
  const { data: membership } = useQuery({
    queryKey: ["my-membership"],
    queryFn: () => membershipFn() as any,
  });

  const enroll = useMutation({
    mutationFn: (courseId: string) => enrollFn({ data: { courseId } }),
    onSuccess: (_res, courseId) => {
      const c = (benefits?.courses ?? []).find((x) => x.id === courseId);
      qc.invalidateQueries({ queryKey: ["my-courses"] });
      toast.success("Enrolled! Opening course…");
      if (c?.slug) navigate({ to: "/courses/$slug/learn", params: { slug: c.slug } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const enrolledIds = new Set(enrollments.map((e) => e.course_id));
  const membershipCourses = (benefits?.courses ?? []).filter((c) => !enrolledIds.has(c.id));
  const tierName = (membership as any)?.tier?.name;
  const noContent = !isLoading && !loadingBenefits && enrollments.length === 0 && membershipCourses.length === 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" /> My Courses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tierName ? `${tierName} member — enroll in any unlocked course below.` : "Continue where you left off."}
          </p>
        </div>
        <Button asChild variant="outline"><Link to="/courses"><Compass className="h-4 w-4 mr-1.5" /> Browse catalog</Link></Button>
      </div>

      {(isLoading || loadingBenefits) && <div className="text-center py-16 text-muted-foreground">Loading…</div>}

      {membershipCourses.length > 0 && (
        <section className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/[0.06] via-background to-background p-4 sm:p-6 space-y-4 shadow-lg">
          <header className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Included with your membership
              </div>
              <h2 className="text-lg sm:text-xl font-bold mt-1">
                {membershipCourses.length} course{membershipCourses.length > 1 ? "s" : ""} unlocked for you
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Enroll for free — your {tierName ?? "membership"} plan covers these.</p>
            </div>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {membershipCourses.map((c) => (
              <div key={c.id}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary hover:-translate-y-0.5 transition-all flex flex-col">
                <Link to="/courses/$slug" params={{ slug: c.slug }} className="block">
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary overflow-hidden">
                    {c.cover_image
                      ? <img src={c.cover_image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                      : <div className="w-full h-full flex items-center justify-center"><GraduationCap className="h-12 w-12 text-primary/40" /></div>}
                    <Badge className="absolute top-3 left-3 bg-amber-500 text-white hover:bg-amber-500"><Sparkles className="h-3 w-3 mr-1" />Member</Badge>
                  </div>
                </Link>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary">{c.title}</h3>
                    <div className="mt-1.5 text-xs text-muted-foreground truncate">{c.category ?? "Course"} · {c.level ?? "All levels"}</div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-white mt-auto"
                    disabled={enroll.isPending}
                    onClick={() => enroll.mutate(c.id)}
                  >
                    <PlayCircle className="h-4 w-4 mr-1.5" />
                    {enroll.isPending ? "Enrolling…" : "Enroll & start"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {enrollments.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2"><PlayCircle className="h-5 w-5 text-primary" /> Continue learning</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((e) => (
              <Link key={e.id} to="/courses/$slug/learn" params={{ slug: e.course.slug }}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary overflow-hidden">
                  {e.course.cover_image
                    ? <img src={e.course.cover_image} alt={e.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                    : <div className="w-full h-full flex items-center justify-center"><GraduationCap className="h-12 w-12 text-primary/40" /></div>}
                  <div className="absolute bottom-3 right-3 h-11 w-11 rounded-full bg-white/95 flex items-center justify-center shadow-lg"><PlayCircle className="h-6 w-6 text-primary" /></div>
                  {e.completed_at && <Badge className="absolute top-3 left-3 bg-emerald-500 text-white hover:bg-emerald-500"><Award className="h-3 w-3 mr-1" />Completed</Badge>}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary">{e.course.title}</h3>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Progress</span><span>{e.progress_percent}%</span></div>
                    <Progress value={e.progress_percent} className="h-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {noContent && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card">
          <Lock className="h-10 w-10 mx-auto text-primary/60 mb-3" />
          <h3 className="font-semibold">No courses unlocked yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {tierName
              ? `Your ${tierName} plan doesn't include any courses yet. Upgrade to unlock more.`
              : "Upgrade your membership to unlock premium courses, or browse the free catalog."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button asChild className="bg-gradient-brand text-white"><Link to="/portal/membership"><Sparkles className="h-4 w-4 mr-1.5" /> View plans</Link></Button>
            <Button asChild variant="outline"><Link to="/courses">Browse catalog <ArrowRight className="h-4 w-4 ml-1.5" /></Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
