import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCms } from "@/lib/cms";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/p/$slug")({
  component: LegalPage,
});

function LegalPage() {
  const { slug } = useParams({ from: "/p/$slug" });
  const legal = useCms("legal");
  const page = legal.pages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Badge variant="outline">404</Badge>
          <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
          <p className="mt-3 text-muted-foreground">No page is configured at <code className="bg-secondary px-1.5 py-0.5 rounded text-sm">/p/{slug}</code>.</p>
          <Link to="/" className="mt-6 inline-block text-primary underline">Back to home</Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
          {page.meta_description && <p className="mt-3 text-muted-foreground">{page.meta_description}</p>}
        </div>
      </section>
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-slate max-w-none whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
          {renderMarkdownish(page.body)}
        </div>
      </article>
    </SiteLayout>
  );
}

function renderMarkdownish(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((b, i) => {
    if (b.startsWith("## ")) return <h2 key={i} className="mt-8 mb-3 text-2xl font-bold">{b.slice(3)}</h2>;
    if (b.startsWith("# ")) return <h1 key={i} className="mt-8 mb-3 text-3xl font-bold">{b.slice(2)}</h1>;
    if (b.startsWith("- ")) {
      return <ul key={i} className="list-disc pl-6 space-y-1">{b.split("\n").map((l, j) => <li key={j}>{l.replace(/^-\s*/, "")}</li>)}</ul>;
    }
    return <p key={i} className="mb-4">{b}</p>;
  });
}
