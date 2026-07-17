import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { GraduationCap, PlayCircle, CheckCircle2, Clock, User as UserIcon, Lock, Sparkles } from "lucide-react";
import { getCourseBySlug, enrollInCourse, getMyEnrollment } from "@/lib/courses.functions";
import { getMyBenefits } from "@/lib/memberships.functions";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { formatDuration } from "@/lib/course-video";

export const Route = createFileRoute("/courses/$slug/")({
  head: () => ({ meta: [{ title: "Course — Infiniforge" }] }),
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getFn = useServerFn(getCourseBySlug);
  const enrollmentFn = useServerFn(getMyEnrollment);
  const enrollFn = useServerFn(enrollInCourse);

  const { data, isLoading } = useQuery({
    queryKey: ["course-public", slug],
    queryFn: () => getFn({ data: { slug } }),
  });

  const { data: enr } = useQuery({
    queryKey: ["course-enrollment", slug, user?.id],
    queryFn: () => enrollmentFn({ data: { courseSlug: slug } }),
    enabled: !!user,
  });

  const benefitsFn = useServerFn(getMyBenefits);
  const { data: benefits } = useQuery({
    queryKey: ["my-benefits"],
    queryFn: () => benefitsFn() as Promise<{ courses: Array<{ id: string }> }>,
    enabled: !!user,
  });

  const enroll = useMutation({
    mutationFn: (courseId: string) => enrollFn({ data: { courseId } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["course-enrollment"] });
      toast.success("Enrolled! Redirecting…");
      navigate({ to: "/courses/$slug/learn", params: { slug } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <SiteLayout><div className="container mx-auto py-20 text-center text-muted-foreground">Loading…</div></SiteLayout>;
  if (!data?.course) return <SiteLayout><div className="container mx-auto py-20 text-center">Course not found.</div></SiteLayout>;
  const { course, lessons } = data;
  const isEnrolled = !!enr?.enrollment;
  const hasMemberAccess = !!benefits?.courses?.some((c) => c.id === course.id);
  const totalDuration = lessons.reduce((s, l) => s + (l.duration_seconds ?? 0), 0);

  return (
    <SiteLayout>
      <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="container mx-auto px-4 py-10 md:py-14 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-2 text-xs">
              {course.category && <Badge variant="secondary">{course.category}</Badge>}
              {course.level && <Badge variant="outline" className="uppercase">{course.level}</Badge>}
              {course.is_free ? <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">Free</Badge> : <Badge className="bg-primary text-white hover:bg-primary">₹{course.price_inr}</Badge>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.title}</h1>
            {course.summary && <p className="text-lg text-muted-foreground">{course.summary}</p>}
            {course.description && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{course.description}</p>}
            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground pt-2">
              {course.instructor_name && <span className="inline-flex items-center gap-1.5"><UserIcon className="h-4 w-4" /> {course.instructor_name}</span>}
              <span className="inline-flex items-center gap-1.5"><PlayCircle className="h-4 w-4" /> {lessons.length} lessons</span>
              {totalDuration > 0 && <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {formatDuration(totalDuration)}</span>}
            </div>
          </div>
          <aside className="rounded-2xl border border-border bg-card p-4 shadow-card md:sticky md:top-24 h-fit">
            {course.cover_image ? (
              <img src={course.cover_image} alt={course.title} className="w-full aspect-video object-cover rounded-lg mb-4" />
            ) : (
              <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center mb-4">
                <GraduationCap className="h-12 w-12 text-primary/40" />
              </div>
            )}
            <div className="text-2xl font-bold mb-3">{course.is_free ? "Free" : `₹${course.price_inr}`}</div>
            {!user && (
              <Button asChild className="w-full bg-gradient-brand text-white"><Link to="/auth">Sign in to enroll</Link></Button>
            )}
            {user && isEnrolled && (
              <Button asChild className="w-full bg-gradient-brand text-white"><Link to="/courses/$slug/learn" params={{ slug }}><PlayCircle className="h-4 w-4 mr-2" /> Continue learning</Link></Button>
            )}
            {user && !isEnrolled && course.is_free && (
              <Button className="w-full bg-gradient-brand text-white" disabled={enroll.isPending} onClick={() => enroll.mutate(course.id)}>
                Enroll for free
              </Button>
            )}
            {user && !isEnrolled && !course.is_free && hasMemberAccess && (
              <Button className="w-full bg-gradient-brand text-white" disabled={enroll.isPending} onClick={() => enroll.mutate(course.id)}>
                <Sparkles className="h-4 w-4 mr-2" /> Enroll with membership
              </Button>
            )}
            {user && !isEnrolled && !course.is_free && !hasMemberAccess && (
              <>
                <Button className="w-full bg-gradient-brand text-white" onClick={() => toast.info("Purchase flow coming soon — contact support to enroll.")}>
                  Buy ₹{course.price_inr}
                </Button>
                <Button variant="outline" asChild className="w-full mt-2">
                  <Link to="/portal/membership"><Sparkles className="h-4 w-4 mr-2" /> Unlock with membership</Link>
                </Button>
              </>
            )}
          </aside>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Course content</h2>
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {lessons.map((l, i) => (
            <div key={l.id} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors">
              <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{l.title}</div>
                {l.description && <div className="text-xs text-muted-foreground truncate">{l.description}</div>}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-3">
                {l.duration_seconds ? <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDuration(l.duration_seconds)}</span> : null}
                {l.is_preview ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : (isEnrolled ? <PlayCircle className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4" />)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}