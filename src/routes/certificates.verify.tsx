import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, CheckCircle2, Search, XCircle } from "lucide-react";
import { verifyCertificate } from "@/lib/courses.functions";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/certificates/verify")({
  head: () => ({
    meta: [
      { title: "Verify Certificate — Infiniforge" },
      { name: "description", content: "Verify an Infiniforge course completion certificate by certificate number." },
      { property: "og:title", content: "Verify Certificate — Infiniforge" },
      { property: "og:description", content: "Check whether an Infiniforge course certificate is valid." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VerifyCertificatePage,
});

type VerificationResult = {
  valid: boolean;
  certificate_number?: string;
  issued_at?: string;
  course?: { title?: string; slug?: string } | null;
};

function VerifyCertificatePage() {
  const verifyFn = useServerFn(verifyCertificate);
  const [certificateNumber, setCertificateNumber] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const verify = useMutation({
    mutationFn: (value: string) => verifyFn({ data: { certificateNumber: value } }) as Promise<VerificationResult>,
    onSuccess: setResult,
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = certificateNumber.trim();
    if (value) verify.mutate(value);
  };

  return (
    <SiteLayout>
      <div className="min-h-[70vh] bg-secondary/30">
        <section className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-card">
            <Badge variant="secondary" className="mb-4"><Award className="h-3.5 w-3.5 mr-1" /> Certificate verification</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Verify a course certificate</h1>
            <p className="mt-3 text-sm text-muted-foreground">Enter the certificate number exactly as shown on the learner certificate.</p>

            <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-3">
              <Input
                value={certificateNumber}
                onChange={(event) => setCertificateNumber(event.target.value.toUpperCase())}
                placeholder="IF-XXXX-XXXX"
                className="h-11 font-mono"
              />
              <Button type="submit" disabled={verify.isPending || !certificateNumber.trim()} className="h-11 bg-gradient-brand text-white">
                <Search className="h-4 w-4 mr-1.5" /> Verify
              </Button>
            </form>

            {result && (
              <div className={`mt-6 rounded-2xl border p-4 ${result.valid ? "border-emerald-500/30 bg-emerald-500/10" : "border-destructive/30 bg-destructive/10"}`}>
                <div className="flex items-start gap-3">
                  {result.valid ? <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" /> : <XCircle className="h-6 w-6 text-destructive shrink-0" />}
                  <div className="min-w-0">
                    <h2 className="font-semibold">{result.valid ? "Certificate is valid" : "Certificate not found"}</h2>
                    {result.valid ? (
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        <p><span className="font-medium text-foreground">Certificate:</span> <span className="font-mono break-all">{result.certificate_number}</span></p>
                        <p><span className="font-medium text-foreground">Course:</span> {result.course?.title ?? "Course"}</p>
                        {result.issued_at && <p><span className="font-medium text-foreground">Issued:</span> {new Date(result.issued_at).toLocaleDateString()}</p>}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">Check the number and try again.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-border">
              <Button variant="ghost" asChild><Link to="/courses">Browse courses</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}