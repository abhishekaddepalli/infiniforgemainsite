import { jsPDF } from "jspdf";
import { downloadBlob } from "@/lib/download";

// Indian flag palette
const SAFFRON = "#FF9933";
const WHITE = "#FFFFFF";
const GREEN = "#138808";
const NAVY = "#000080";
const INK = "#0B1F3A";
const GOLD = "#C9A227";

export type CertificateInput = {
  certificateNumber: string;
  issuedAt: string | Date;
  recipientName: string;
  courseTitle: string;
  issuer?: string;
  signatureImage?: string | null;
  signatoryName?: string | null;
  signatoryTitle?: string | null;
};

function drawAshokaChakra(doc: jsPDF, cx: number, cy: number, r: number) {
  doc.setDrawColor(NAVY);
  doc.setLineWidth(0.8);
  doc.circle(cx, cy, r, "S");
  doc.circle(cx, cy, r * 0.15, "S");
  doc.setLineWidth(0.4);
  for (let i = 0; i < 24; i++) {
    const a = (i * Math.PI) / 12;
    doc.line(cx + Math.cos(a) * r * 0.18, cy + Math.sin(a) * r * 0.18, cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
}

export function downloadCertificatePdf(input: CertificateInput) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(255, 253, 247);
  doc.rect(0, 0, W, H, "F");

  // Tricolor top band
  const bandH = 8;
  doc.setFillColor(SAFFRON); doc.rect(0, 0, W, bandH, "F");
  doc.setFillColor(WHITE); doc.rect(0, bandH, W, bandH, "F");
  doc.setFillColor(GREEN); doc.rect(0, bandH * 2, W, bandH, "F");
  // chakra on white band
  drawAshokaChakra(doc, W / 2, bandH + bandH / 2, bandH * 0.42);

  // Tricolor bottom band
  const by = H - bandH * 3;
  doc.setFillColor(SAFFRON); doc.rect(0, by, W, bandH, "F");
  doc.setFillColor(WHITE); doc.rect(0, by + bandH, W, bandH, "F");
  doc.setFillColor(GREEN); doc.rect(0, by + bandH * 2, W, bandH, "F");
  drawAshokaChakra(doc, W / 2, by + bandH + bandH / 2, bandH * 0.42);

  // Inner ornate border
  const m = 18;
  const top = bandH * 3 + 6;
  const bot = by - 6;
  doc.setDrawColor(GOLD); doc.setLineWidth(1.4);
  doc.rect(m, top, W - m * 2, bot - top, "S");
  doc.setDrawColor(NAVY); doc.setLineWidth(0.3);
  doc.rect(m + 2, top + 2, W - m * 2 - 4, bot - top - 4, "S");

  // Corner ornaments (saffron + green)
  const corner = (x: number, y: number, flipX: number, flipY: number) => {
    doc.setDrawColor(SAFFRON); doc.setLineWidth(0.8);
    doc.line(x, y, x + 18 * flipX, y);
    doc.line(x, y, x, y + 18 * flipY);
    doc.setDrawColor(GREEN);
    doc.line(x + 3 * flipX, y + 3 * flipY, x + 15 * flipX, y + 3 * flipY);
    doc.line(x + 3 * flipX, y + 3 * flipY, x + 3 * flipX, y + 15 * flipY);
  };
  corner(m + 4, top + 4, 1, 1);
  corner(W - m - 4, top + 4, -1, 1);
  corner(m + 4, bot - 4, 1, -1);
  corner(W - m - 4, bot - 4, -1, -1);

  // Eyebrow
  doc.setFont("helvetica", "bold");
  doc.setTextColor(SAFFRON);
  doc.setFontSize(11);
  doc.text((input.issuer ?? "INFINIFORGE").toUpperCase() + "  •  CERTIFICATE OF EXCELLENCE", W / 2, top + 20, { align: "center" });

  // Title
  doc.setTextColor(NAVY);
  doc.setFont("times", "bold");
  doc.setFontSize(44);
  doc.text("Certificate of Completion", W / 2, top + 40, { align: "center" });

  // Divider
  doc.setDrawColor(GOLD); doc.setLineWidth(0.6);
  doc.line(W / 2 - 40, top + 46, W / 2 + 40, top + 46);

  // Presented to
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(INK);
  doc.text("This certificate is proudly presented to", W / 2, top + 58, { align: "center" });

  // Name
  doc.setFont("times", "bolditalic");
  doc.setFontSize(38);
  doc.setTextColor(GREEN);
  doc.text(input.recipientName || "Learner", W / 2, top + 76, { align: "center" });

  // Underline under name
  const nameWidth = Math.min(doc.getTextWidth(input.recipientName || "Learner") + 20, W - 80);
  doc.setDrawColor(SAFFRON); doc.setLineWidth(0.5);
  doc.line((W - nameWidth) / 2, top + 80, (W + nameWidth) / 2, top + 80);

  // For completion of
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(INK);
  doc.text("for successfully completing the course", W / 2, top + 92, { align: "center" });

  // Course title
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(NAVY);
  const courseLines = doc.splitTextToSize(input.courseTitle || "Course", W - 80);
  doc.text(courseLines, W / 2, top + 104, { align: "center" });

  // Footer meta row
  const footerY = bot - 22;
  // Left: certificate no
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(SAFFRON);
  doc.text("CERTIFICATE NO.", m + 14, footerY - 4);
  doc.setFont("courier", "bold");
  doc.setFontSize(12);
  doc.setTextColor(INK);
  doc.text(input.certificateNumber, m + 14, footerY + 2);

  // Right: date
  const dateStr = new Date(input.issuedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(GREEN);
  doc.text("DATE OF ISSUE", W - m - 14, footerY - 4, { align: "right" });
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.setTextColor(INK);
  doc.text(dateStr, W - m - 14, footerY + 2, { align: "right" });

  // Center: signature block
  if (input.signatureImage) {
    try {
      const fmt = input.signatureImage.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
      doc.addImage(input.signatureImage, fmt, W / 2 - 25, footerY - 16, 50, 16);
    } catch { /* ignore malformed data URL */ }
  }
  doc.setDrawColor(INK); doc.setLineWidth(0.4);
  doc.line(W / 2 - 30, footerY, W / 2 + 30, footerY);
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(INK);
  doc.text(input.signatoryName || "Authorised Signatory", W / 2, footerY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(input.signatoryTitle || (input.issuer ?? "Infiniforge"), W / 2, footerY + 10, { align: "center" });

  const blob = doc.output("blob");
  downloadBlob(blob, `${input.certificateNumber}.pdf`);
}
