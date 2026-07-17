import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, PlayCircle, Sparkles } from "lucide-react";
import { listPublishedCourses } from "@/lib/courses.functions";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Courses — Learn with Infiniforge" },
      { name: "description", content: "Video-based courses on hosting, domains, marketing and building your online business — free and premium tracks." },
      { property: "og:title", content: "Courses — Infiniforge" },
      { property: "og:description", content: "Guided video courses to grow your online business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoursesPage,
});

type Course = {
  id: string; slug: string; title: string; summary: string | null; cover_image: string | null;
  category: string | null; level: string | null; price_inr: number; is_free: boolean; instructor_name: string | null;
};

function CoursesPage() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses-public"],
    queryFn: () => listPublishedCourses() as Promise<Course[]>,
  });

  return (
    <SiteLayout>
      <section className="relative bg-gradient-to-b from-primary/10 via-background to-background border-b border-border">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> New — Learn on Infiniforge
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
            Video courses that get you shipping — fast.
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Hand-picked lessons with a branded distraction-free player, quizzes, and completion certificates.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {isLoading && <div className="text-center text-muted-foreground py-20">Loading courses…</div>}
        {!isLoading && courses.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <GraduationCap className="h-10 w-10 mx-auto mb-3 text-primary/60" />
            No courses published yet. Check back soon.
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link key={c.id} to="/courses/$slug" params={{ slug: c.slug }}
              className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-lg transition-all hover:-translate-y-0.5">
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-primary/5 to-secondary overflow-hidden">
                {c.cover_image ? (
                  <img src={c.cover_image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <GraduationCap className="h-14 w-14 text-primary/40" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  {c.is_free ? <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">Free</Badge> : <Badge className="bg-primary text-white hover:bg-primary">₹{c.price_inr}</Badge>}
                </div>
                <div className="absolute bottom-3 right-3 h-11 w-11 rounded-full bg-white/95 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  {c.category && <span>{c.category}</span>}
                  {c.category && c.level && <span>·</span>}
                  {c.level && <span>{c.level}</span>}
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">{c.title}</h3>
                {c.summary && <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{c.summary}</p>}
                {c.instructor_name && <p className="text-xs text-muted-foreground mt-3">by {c.instructor_name}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}