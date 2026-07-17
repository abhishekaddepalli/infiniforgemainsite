import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { GraduationCap, Plus, MoreHorizontal, ChevronRight, Trash2, Edit3, Eye, EyeOff, Layers } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminListCourses, adminSaveCourse, adminDeleteCourse } from "@/lib/courses.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SignaturePad } from "@/components/SignaturePad";

export const Route = createFileRoute("/admin/courses/")({
  head: () => ({ meta: [{ title: "Courses — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell title="Courses"><CoursesPage /></AdminShell>,
});

type CourseRow = {
  id: string; slug: string; title: string; summary: string | null; category: string | null; level: string | null;
  price_inr: number; is_free: boolean; is_published: boolean; sort_order: number; cover_image: string | null;
  description: string | null; instructor_name: string | null; lessons?: { count: number }[];
  min_watch_percent?: number; min_quiz_percent?: number;
  signature_image?: string | null; signatory_name?: string | null; signatory_title?: string | null;
  youtube_privacy_mode?: boolean; block_youtube_links?: boolean; player_accent_color?: string;
};

function CoursesPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Partial<CourseRow> | null>(null);
  const listFn = useServerFn(adminListCourses);
  const saveFn = useServerFn(adminSaveCourse);
  const delFn = useServerFn(adminDeleteCourse);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => listFn() as Promise<CourseRow[]>,
  });

  const save = useMutation({
    mutationFn: async (c: Partial<CourseRow>) => saveFn({ data: {
      id: c.id, slug: c.slug!, title: c.title!, summary: c.summary ?? "",
      description: c.description ?? "", cover_image: c.cover_image ?? "",
      category: c.category ?? "", level: c.level ?? "beginner",
      instructor_name: c.instructor_name ?? "",
      price_inr: Number(c.price_inr ?? 0), is_free: c.is_free ?? true,
      is_published: c.is_published ?? false, sort_order: Number(c.sort_order ?? 0),
      min_watch_percent: Number(c.min_watch_percent ?? 95),
      min_quiz_percent: Number(c.min_quiz_percent ?? 85),
      signature_image: c.signature_image ?? null,
      signatory_name: c.signatory_name ?? "",
      signatory_title: c.signatory_title ?? "",
      youtube_privacy_mode: c.youtube_privacy_mode ?? false,
      block_youtube_links: c.block_youtube_links ?? true,
      player_accent_color: /^#[0-9A-Fa-f]{6}$/.test(c.player_accent_color ?? "") ? c.player_accent_color : "#2563eb",
    } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-courses"] }); setEditing(null); toast.success("Course saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-courses"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">Dashboard</Link><ChevronRight className="h-3 w-3" /><span>Courses</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" /> Courses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Create video-based courses with lessons and quizzes.</p>
        </div>
        <Button size="sm" className="bg-gradient-brand text-white"
          onClick={() => setEditing({ level: "beginner", is_free: true, is_published: false, sort_order: courses.length + 1, min_watch_percent: 95, min_quiz_percent: 85, youtube_privacy_mode: false, block_youtube_links: true, player_accent_color: "#2563eb" })}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> New course
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary/40 border-b border-border">
              <th className="px-5 py-3">Title</th>
              <th className="px-3 py-3 hidden md:table-cell">Category</th>
              <th className="px-3 py-3">Lessons</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Status</th>
              <th className="pl-3 pr-5 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">Loading…</td></tr>}
            {!isLoading && courses.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No courses yet — create your first one.</td></tr>}
            {courses.map((c) => (
              <tr key={c.id} className="hover:bg-secondary/30 cursor-pointer"
                onClick={() => navigate({ to: "/admin/courses/$id", params: { id: c.id } })}>
                <td className="px-5 py-3">
                  <div className="font-medium hover:text-primary break-words">{c.title}</div>
                  <div className="text-xs text-muted-foreground font-mono break-all">/{c.slug}</div>
                </td>
                <td className="px-3 py-3 hidden md:table-cell text-xs text-muted-foreground">{c.category ?? "—"}</td>
                <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                  <Link to="/admin/courses/$id" params={{ id: c.id }} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                    <Layers className="h-3.5 w-3.5" /> {c.lessons?.[0]?.count ?? 0} lessons & quizzes
                  </Link>
                </td>
                <td className="px-3 py-3 text-xs">{c.is_free ? <Badge variant="secondary">Free</Badge> : `₹${c.price_inr}`}</td>
                <td className="px-3 py-3">
                  {c.is_published
                    ? <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15"><Eye className="h-3 w-3 mr-1" />Published</Badge>
                    : <Badge variant="secondary"><EyeOff className="h-3 w-3 mr-1" />Draft</Badge>}
                </td>
                <td className="pl-3 pr-5 py-3" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><button className="h-8 w-8 rounded-md hover:bg-secondary flex items-center justify-center"><MoreHorizontal className="h-4 w-4" /></button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => navigate({ to: "/admin/courses/$id", params: { id: c.id } })}><Layers className="h-4 w-4 mr-2" /> Lessons & Quizzes</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setEditing(c)}><Edit3 className="h-4 w-4 mr-2" /> Edit details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onSelect={() => confirm(`Delete "${c.title}"?`) && del.mutate(c.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit course" : "New course"}</DialogTitle></DialogHeader>
          {editing && (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }}>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Title</Label><Input required value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} className="mt-1.5" /></div>
                <div><Label>Slug</Label><Input required value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="mt-1.5" /></div>
              </div>
              <div><Label>Summary</Label><Input value={editing.summary ?? ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} className="mt-1.5" placeholder="Short one-liner" /></div>
              <div><Label>Description</Label><Textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1.5" /></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><Label>Cover image URL</Label><Input value={editing.cover_image ?? ""} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Category</Label><Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="mt-1.5" placeholder="Development, Design…" /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div><Label>Level</Label>
                  <select value={editing.level ?? "beginner"} onChange={(e) => setEditing({ ...editing, level: e.target.value })} className="mt-1.5 w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                    <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
                  </select>
                </div>
                <div><Label>Instructor</Label><Input value={editing.instructor_name ?? ""} onChange={(e) => setEditing({ ...editing, instructor_name: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Sort order</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="mt-1.5" /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 items-center">
                <div className="flex items-center gap-3"><Switch checked={editing.is_free ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_free: v })} /><Label>Free course</Label></div>
                <div><Label>Price (₹)</Label><Input type="number" value={editing.price_inr ?? 0} onChange={(e) => setEditing({ ...editing, price_inr: Number(e.target.value) })} className="mt-1.5" disabled={editing.is_free ?? true} /></div>
                <div className="flex items-center gap-3"><Switch checked={editing.is_published ?? false} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} /><Label>Published</Label></div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="text-sm font-semibold mb-2">Certificate requirements</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label>Minimum watch time (%)</Label><Input type="number" min={0} max={100} value={editing.min_watch_percent ?? 95} onChange={(e) => setEditing({ ...editing, min_watch_percent: Number(e.target.value) })} className="mt-1.5" /></div>
                  <div><Label>Minimum quiz average (%)</Label><Input type="number" min={0} max={100} value={editing.min_quiz_percent ?? 85} onChange={(e) => setEditing({ ...editing, min_quiz_percent: Number(e.target.value) })} className="mt-1.5" /></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Learners must meet both thresholds before a certificate is issued.</p>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="text-sm font-semibold mb-2">Video player settings</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <Switch checked={editing.block_youtube_links ?? true} onCheckedChange={(v) => setEditing({ ...editing, block_youtube_links: v })} />
                      <Label>Block YouTube title/logo clicks</Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Recommended. Uses the custom player controls and prevents learners opening YouTube from the lesson.</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <Switch checked={editing.youtube_privacy_mode ?? false} onCheckedChange={(v) => setEditing({ ...editing, youtube_privacy_mode: v })} />
                      <Label>YouTube privacy mode</Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Keep off if you see Error 153. Turn on only when videos embed correctly with privacy mode.</p>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Player button colour</Label>
                    <div className="mt-1.5 flex gap-2">
                      <Input type="color" value={editing.player_accent_color ?? "#2563eb"} onChange={(e) => setEditing({ ...editing, player_accent_color: e.target.value })} className="h-10 w-16 p-1" />
                      <Input value={editing.player_accent_color ?? "#2563eb"} onChange={(e) => setEditing({ ...editing, player_accent_color: e.target.value })} placeholder="#2563eb" pattern="^#[0-9A-Fa-f]{6}$" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="text-sm font-semibold mb-2">Authorised signature on certificate</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label>Signatory name</Label><Input value={editing.signatory_name ?? ""} onChange={(e) => setEditing({ ...editing, signatory_name: e.target.value })} className="mt-1.5" placeholder="e.g. Amit Kumar" /></div>
                  <div><Label>Signatory title</Label><Input value={editing.signatory_title ?? ""} onChange={(e) => setEditing({ ...editing, signatory_title: e.target.value })} className="mt-1.5" placeholder="e.g. Director of Learning" /></div>
                </div>
                <div className="mt-3">
                  <SignaturePad value={editing.signature_image ?? null} onChange={(v) => setEditing({ ...editing, signature_image: v })} label="Draw the signature (saved to certificate PDF)" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-brand text-white" disabled={save.isPending}>Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}