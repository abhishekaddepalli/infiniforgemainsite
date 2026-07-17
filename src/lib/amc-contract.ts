import jsPDF from "jspdf";
import { downloadBlob } from "@/lib/download";
import { formatINR } from "@/lib/catalog";

export interface AmcContractData {
  contract_no: string;
  title: string;
  subtitle?: string | null;
  client_name?: string;
  client_address?: string;
  client_email?: string;
  client_gstin?: string;
  contract_value_inr?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  sla_response_hours?: string | number;
  visits_per_year?: string | number;
  coverage_scope?: string;
  rules?: string;
  terms?: string;
  signatory_provider_name?: string;
  signatory_provider_title?: string;
  signatory_provider_signature?: string | null;
  signatory_provider_signed_at?: string;
  signatory_client_name?: string;
  signatory_client_title?: string;
  signatory_client_signature?: string | null;
  signatory_client_signed_at?: string;
  signature_mode?: "digital" | "physical";
  /** Company/brand logo — dataURL (PNG/JPG) or absolute URL. Fetched to dataURL for PDF embed. */
  logo_url?: string | null;
}

const SELLER = {
  name: "Infiniforge Technologies Pvt Ltd",
  address: "Enterprise Business Platform · India",
  email: "billing@infiniforge.cloud",
  website: "infiniforge.cloud",
  gstin: "29ABCDE1234F1Z5",
  cin: "U72900KA2024PTC000000",
};

// Brand palette
const GREEN: [number, number, number] = [15, 108, 40];       // deep enterprise green
const GREEN_DARK: [number, number, number] = [8, 66, 28];
const SAFFRON: [number, number, number] = [255, 153, 51];
const INK: [number, number, number] = [15, 23, 42];
const MUTED: [number, number, number] = [100, 116, 139];

function slug(s: string) { return s.replace(/[^A-Za-z0-9_-]/g, "_"); }
function lines(text?: string | null): string[] {
  if (!text) return [];
  return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m] as string));
}

async function resolveImage(src?: string | null): Promise<{ dataUrl: string; format: "PNG" | "JPEG"; w: number; h: number } | null> {
  if (!src) return null;
  try {
    let dataUrl = src;
    if (!src.startsWith("data:")) {
      const res = await fetch(src, { mode: "cors" });
      if (!res.ok) return null;
      const blob = await res.blob();
      dataUrl = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = () => reject(fr.error);
        fr.readAsDataURL(blob);
      });
    }
    const format: "PNG" | "JPEG" = dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg") ? "JPEG" : "PNG";
    const dims = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth || 200, h: img.naturalHeight || 200 });
      img.onerror = () => resolve({ w: 200, h: 200 });
      img.src = dataUrl;
    });
    return { dataUrl, format, w: dims.w, h: dims.h };
  } catch { return null; }
}

export async function downloadAmcPdf(c: AmcContractData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 44;

  const logo = await resolveImage(c.logo_url ?? null);

  // ————— HEADER BAND —————
  const bandH = 96;
  doc.setFillColor(...GREEN_DARK); doc.rect(0, 0, W, bandH, "F");
  doc.setFillColor(...SAFFRON); doc.rect(0, bandH, W, 4, "F");
  doc.setFillColor(...GREEN); doc.rect(0, bandH + 4, W, 2, "F");

  // Logo (or monogram)
  const logoBoxX = M, logoBoxY = 22, logoMaxH = 52;
  if (logo) {
    const ratio = logo.w / logo.h;
    const h = logoMaxH, w = Math.min(160, h * ratio);
    // white rounded plate for logo
    doc.setFillColor(255, 255, 255); doc.roundedRect(logoBoxX - 6, logoBoxY - 6, w + 12, h + 12, 6, 6, "F");
    try { doc.addImage(logo.dataUrl, logo.format, logoBoxX, logoBoxY, w, h); } catch { /* ignore */ }
  } else {
    doc.setFillColor(...SAFFRON); doc.roundedRect(logoBoxX, logoBoxY, 46, 46, 8, 8, "F");
    doc.setFont("helvetica", "bold").setFontSize(24).setTextColor(255, 255, 255);
    doc.text("I", logoBoxX + 23, logoBoxY + 32, { align: "center" });
  }

  // Brand name & tagline
  const brandX = M + 180;
  doc.setFont("helvetica", "bold").setFontSize(16).setTextColor(255, 255, 255);
  doc.text(SELLER.name, brandX, 42);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(220, 235, 220);
  doc.text(SELLER.address, brandX, 58);
  doc.text(`${SELLER.email}  ·  ${SELLER.website}`, brandX, 72);

  // Status pill right
  const status = (c.status ?? "active").toUpperCase();
  doc.setFillColor(...SAFFRON); doc.roundedRect(W - M - 96, 28, 96, 22, 11, 11, "F");
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(255, 255, 255);
  doc.text(status, W - M - 48, 43, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(220, 235, 220);
  doc.text(`GSTIN ${SELLER.gstin}`, W - M, 66, { align: "right" });
  doc.setFontSize(8);
  doc.text(`CIN ${SELLER.cin}`, W - M, 78, { align: "right" });

  // ————— TITLE —————
  let y = bandH + 34;
  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(...INK);
  doc.text("ANNUAL MAINTENANCE CONTRACT", M, y);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...MUTED);
  doc.text(`Contract No: `, M, y + 16);
  doc.setFont("helvetica", "bold").setTextColor(...INK);
  doc.text(c.contract_no, M + 78, y + 16);
  doc.setFont("helvetica", "normal").setTextColor(...MUTED);
  doc.text(`Issued: ${new Date().toLocaleDateString("en-IN")}`, W - M, y + 16, { align: "right" });
  y += 34;

  // ————— PARTIES (dynamic height, no overflow) —————
  const colW = (W - 2 * M - 20) / 2;
  const partyBlocks = (blocks: [string, string][]) => {
    // Precompute wrapped lines per row and total height
    const rows = blocks.map(([label, val]) => {
      const bold = label === "Name";
      doc.setFont("helvetica", bold ? "bold" : "normal").setFontSize(bold ? 10 : 9);
      const wrapped = doc.splitTextToSize(val || "—", colW - 24) as string[];
      return { label, wrapped, bold };
    });
    const rowH = (r: { wrapped: string[] }) => 11 /*label*/ + r.wrapped.length * 11 + 4;
    const contentH = rows.reduce((s, r) => s + rowH(r), 0);
    return { rows, height: Math.max(96, contentH + 24) };
  };

  const providerData = partyBlocks([
    ["Name", SELLER.name],
    ["Address", SELLER.address],
    ["Email / GSTIN", `${SELLER.email}  ·  ${SELLER.gstin}`],
  ]);
  const clientData = partyBlocks([
    ["Name", c.client_name || "—"],
    ["Address", c.client_address || "—"],
    ["Email / GSTIN", `${c.client_email || "—"}  ·  ${c.client_gstin || "—"}`],
  ]);
  const partiesH = Math.max(providerData.height, clientData.height);
  const partiesY = y;

  const drawParty = (heading: string, x: number, data: ReturnType<typeof partyBlocks>) => {
    doc.setFillColor(248, 250, 252); doc.roundedRect(x, partiesY, colW, partiesH, 6, 6, "F");
    doc.setDrawColor(226, 232, 240); doc.roundedRect(x, partiesY, colW, partiesH, 6, 6, "S");
    doc.setFillColor(...GREEN); doc.rect(x, partiesY, 3, partiesH, "F");
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...GREEN);
    doc.text(heading.toUpperCase(), x + 12, partiesY + 16);
    let ly = partiesY + 32;
    data.rows.forEach((r) => {
      doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...MUTED);
      doc.text(r.label, x + 12, ly);
      doc.setFont("helvetica", r.bold ? "bold" : "normal").setFontSize(r.bold ? 10 : 9).setTextColor(...INK);
      doc.text(r.wrapped, x + 12, ly + 11);
      ly += 11 + r.wrapped.length * 11 + 4;
    });
  };
  drawParty("Service Provider", M, providerData);
  drawParty("Client", M + colW + 20, clientData);
  y = partiesY + partiesH + 16;

  // ————— CONTRACT SUMMARY CARD —————
  const summaryInnerW = W - 2 * M - 32;
  // Title/subtitle dynamic height
  doc.setFont("helvetica", "bold").setFontSize(12);
  const titleLines = doc.splitTextToSize(c.title || "Maintenance Contract", summaryInnerW) as string[];
  const subLines = c.subtitle ? (doc.setFont("helvetica","normal").setFontSize(9), doc.splitTextToSize(c.subtitle, summaryInnerW) as string[]) : [];
  const headTextH = titleLines.length * 15 + (subLines.length ? subLines.length * 11 + 4 : 0);
  const cardH = 30 + headTextH + 40; // header + kv row
  doc.setFillColor(255, 251, 244); doc.roundedRect(M, y, W - 2 * M, cardH, 8, 8, "F");
  doc.setDrawColor(...SAFFRON).setLineWidth(0.6); doc.roundedRect(M, y, W - 2 * M, cardH, 8, 8, "S");
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(...INK);
  doc.text(titleLines, M + 16, y + 22);
  if (subLines.length) {
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED);
    doc.text(subLines, M + 16, y + 22 + titleLines.length * 15);
  }
  const kvY = y + 30 + headTextH + 14;
  const kvItems: [string, string][] = [
    ["Start date", c.start_date || "—"],
    ["End date", c.end_date || "—"],
    ["SLA response", c.sla_response_hours ? `${c.sla_response_hours} hrs` : "—"],
    ["Visits / year", c.visits_per_year ? String(c.visits_per_year) : "—"],
    ["Contract value", c.contract_value_inr ? formatINR(Number(c.contract_value_inr)) : "—"],
  ];
  const kvColW = (W - 2 * M - 32) / kvItems.length;
  kvItems.forEach(([label, v], i) => {
    const x = M + 16 + i * kvColW;
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...MUTED);
    doc.text(label.toUpperCase(), x, kvY);
    doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...INK);
    const vLines = doc.splitTextToSize(v, kvColW - 6) as string[];
    doc.text(vLines[0] ?? v, x, kvY + 13);
  });
  y += cardH + 22;

  // ————— SECTIONS —————
  const section = (heading: string, body: string[]) => {
    if (body.length === 0) return;
    if (y > H - 160) { doc.addPage(); y = M; }
    doc.setFillColor(...GREEN); doc.rect(M, y - 2, 4, 16, "F");
    doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(...GREEN_DARK);
    doc.text(heading, M + 12, y + 10);
    y += 24;
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(50, 60, 75);
    body.forEach((b, i) => {
      const wrapped = doc.splitTextToSize(`${i + 1}.  ${b}`, W - 2 * M - 10) as string[];
      // keep clause together if possible
      const needed = wrapped.length * 14 + 4;
      if (y + needed > H - 60) { doc.addPage(); y = M; }
      wrapped.forEach((ln: string) => {
        if (y > H - 60) { doc.addPage(); y = M; }
        doc.text(ln, M + 6, y); y += 14;
      });
      y += 3;
    });
    y += 8;
  };
  if (c.coverage_scope) section("Scope of Coverage", lines(c.coverage_scope));
  section("Rules & Conditions", lines(c.rules));
  section("Terms & Conditions", lines(c.terms));

  // ————— SIGNATURES (reserve ~210pt above footer; new page if not enough) —————
  const SIG_BLOCK_H = 210; // heading + boxes + name/role/date
  const FOOTER_RESERVE = 60;
  if (y + SIG_BLOCK_H > H - FOOTER_RESERVE) { doc.addPage(); y = M; }

  doc.setDrawColor(220); doc.setLineDashPattern([2, 2], 0); doc.line(M, y, W - M, y); doc.setLineDashPattern([], 0);
  y += 18;
  doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...INK);
  doc.text("Signatures", M, y);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED);
  doc.text(`Mode: ${(c.signature_mode ?? "digital").toUpperCase()}`, W - M, y, { align: "right" });
  y += 10;

  const drawSig = (title: string, name: string, role: string, dataUrl: string | null | undefined, signedAt: string | undefined, x: number) => {
    const boxY = y + 6;
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...GREEN);
    doc.text(title.toUpperCase(), x, boxY);
    doc.setFillColor(255, 255, 255); doc.setDrawColor(210);
    doc.roundedRect(x, boxY + 6, colW, 66, 4, 4, "FD");
    if (dataUrl) {
      try { doc.addImage(dataUrl, "PNG", x + 6, boxY + 10, colW - 12, 58); } catch { /* ignore */ }
    } else {
      doc.setTextColor(170).setFont("helvetica", "italic").setFontSize(9);
      doc.text("(Signature to be affixed)", x + colW / 2, boxY + 42, { align: "center" });
    }
    doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...INK);
    doc.text(name || "—", x, boxY + 86);
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED);
    doc.text(role || "—", x, boxY + 98);
    if (signedAt) doc.text(`Signed: ${new Date(signedAt).toLocaleString("en-IN")}`, x, boxY + 110);
  };
  drawSig("For Service Provider", c.signatory_provider_name || SELLER.name, c.signatory_provider_title || "Authorised signatory",
    c.signatory_provider_signature ?? null, c.signatory_provider_signed_at, M);
  drawSig("For Client", c.signatory_client_name || c.client_name || "", c.signatory_client_title || "Authorised signatory",
    c.signatory_client_signature ?? null, c.signatory_client_signed_at, M + colW + 20);

  // ————— FOOTER on every page —————
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    const fy = H - 24;
    doc.setDrawColor(230); doc.line(M, fy - 14, W - M, fy - 14);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...MUTED);
    doc.text(`${SELLER.name}  ·  ${SELLER.email}  ·  GSTIN ${SELLER.gstin}`, M, fy);
    doc.text(`Page ${p} of ${pages}`, W / 2, fy, { align: "center" });
    doc.setTextColor(...SAFFRON).setFont("helvetica", "bold");
    doc.text(SELLER.website, W - M, fy, { align: "right" });
  }

  try {
    const blob = doc.output("blob");
    downloadBlob(blob, `AMC_${slug(c.contract_no)}.pdf`);
  } catch {
    doc.save(`AMC_${slug(c.contract_no)}.pdf`);
  }
}

export async function downloadAmcDocx(c: AmcContractData) {
  // Resolve remote logos to dataURL so Word renders them offline.
  const logo = await resolveImage(c.logo_url ?? null);
  const logoImg = logo ? `<img src="${logo.dataUrl}" style="height:56px;max-width:180px;object-fit:contain;background:#fff;padding:4px;border-radius:6px" />`
    : `<div style="width:56px;height:56px;background:#FF9933;color:#fff;font-weight:bold;font-size:26pt;line-height:56px;text-align:center;border-radius:8px">I</div>`;
  const listHtml = (arr: string[]) =>
    arr.length ? `<ol style="margin:6pt 0 0 20pt;padding:0">${arr.map((x) => `<li style="margin-bottom:4pt">${escapeHtml(x)}</li>`).join("")}</ol>` : `<p style="color:#888">—</p>`;
  const sigImg = (u?: string | null) => u ? `<img src="${u}" style="height:70px;max-width:260px;object-fit:contain" />` : `<div style="color:#888;font-style:italic;padding:24px 0">(Signature to be affixed)</div>`;

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>AMC ${escapeHtml(c.contract_no)}</title>
<style>
  body{font-family:Calibri,Arial,sans-serif;color:#0f172a;font-size:11pt;margin:0;padding:0;}
  .band{background:#08421c;color:#fff;padding:18pt 28pt;}
  .band .brand{font-size:16pt;font-weight:bold;margin:0}
  .band .meta{font-size:9pt;color:#d5ebda;margin-top:2pt}
  .stripe1{height:4pt;background:#FF9933;}.stripe2{height:2pt;background:#0f6c28;}
  h1{font-size:20pt;margin:14pt 0 4pt 0;color:#0f172a;}
  h2{font-size:12pt;margin:16pt 0 4pt 0;color:#08421c;border-left:3pt solid #0f6c28;padding:2pt 0 2pt 8pt;}
  table{border-collapse:collapse;width:100%;}
  td{padding:6pt 8pt;vertical-align:top;}
  .party{background:#f8fafc;border:1px solid #e2e8f0;border-left:3pt solid #0f6c28;padding:10pt;}
  .party .lbl{color:#64748b;font-size:8pt;text-transform:uppercase}
  .summary{background:#fffbf4;border:1px solid #FF9933;padding:12pt;border-radius:6pt;}
  .kv b{display:block;color:#0f172a;font-size:10pt;margin-top:2pt}
  .kv span{color:#64748b;font-size:8pt;text-transform:uppercase}
  .sig{border:1px solid #d1d5db;background:#fff;min-height:96pt;padding:6pt;text-align:center;border-radius:4pt;overflow:hidden}
  .muted{color:#64748b;font-size:9pt}
  .pill{display:inline-block;background:#FF9933;color:#fff;font-weight:bold;padding:4pt 12pt;border-radius:12pt;font-size:9pt}
  .footer{margin-top:24pt;border-top:1px solid #e5e7eb;padding-top:8pt;color:#64748b;font-size:8pt}
  .party,.summary{page-break-inside:avoid;}
  .sig-block{page-break-inside:avoid;}
  h2{page-break-after:avoid;}
  .kv td{width:20%;word-wrap:break-word;overflow-wrap:break-word;}
</style></head>
<body>
<div class="band">
  <table><tr>
    <td style="width:70pt;vertical-align:middle">${logoImg}</td>
    <td style="vertical-align:middle;padding-left:12pt">
      <div class="brand">${SELLER.name}</div>
      <div class="meta">${SELLER.address} &nbsp; · &nbsp; ${SELLER.email} &nbsp; · &nbsp; ${SELLER.website}</div>
    </td>
    <td style="text-align:right;vertical-align:middle">
      <div class="pill">${escapeHtml((c.status ?? "active").toUpperCase())}</div>
      <div class="meta" style="margin-top:4pt">GSTIN ${SELLER.gstin}</div>
      <div class="meta">CIN ${SELLER.cin}</div>
    </td>
  </tr></table>
</div>
<div class="stripe1"></div><div class="stripe2"></div>

<div style="padding:16pt 28pt 32pt">
  <table><tr>
    <td><h1>ANNUAL MAINTENANCE CONTRACT</h1>
      <div class="muted">Contract No: <b style="color:#0f172a">${escapeHtml(c.contract_no)}</b></div>
      <div class="muted">Issued: ${new Date().toLocaleDateString("en-IN")}</div>
    </td>
  </tr></table>

  <table style="margin-top:12pt"><tr>
    <td style="width:50%;padding-right:6pt">
      <div class="party">
        <div class="lbl">Service Provider</div>
        <div style="font-weight:bold;font-size:11pt;margin-top:2pt">${SELLER.name}</div>
        <div class="muted">${SELLER.address}<br/>${SELLER.email}<br/>GSTIN ${SELLER.gstin}</div>
      </div>
    </td>
    <td style="width:50%;padding-left:6pt">
      <div class="party">
        <div class="lbl">Client</div>
        <div style="font-weight:bold;font-size:11pt;margin-top:2pt">${escapeHtml(c.client_name ?? "—")}</div>
        <div class="muted">
          ${c.client_address ? escapeHtml(c.client_address).replace(/\n/g, "<br/>") + "<br/>" : ""}
          ${c.client_email ? escapeHtml(c.client_email) + "<br/>" : ""}
          ${c.client_gstin ? "GSTIN " + escapeHtml(c.client_gstin) : ""}
        </div>
      </div>
    </td>
  </tr></table>

  <div class="summary" style="margin-top:14pt">
    <div style="font-weight:bold;font-size:12pt">${escapeHtml(c.title)}</div>
    ${c.subtitle ? `<div class="muted" style="margin-top:4pt">${escapeHtml(c.subtitle)}</div>` : ""}
    <table style="margin-top:10pt" class="kv">
      <tr>
        <td><span>Start date</span><b>${escapeHtml(c.start_date ?? "—")}</b></td>
        <td><span>End date</span><b>${escapeHtml(c.end_date ?? "—")}</b></td>
        <td><span>SLA response</span><b>${c.sla_response_hours ? escapeHtml(String(c.sla_response_hours)) + " hrs" : "—"}</b></td>
        <td><span>Visits / year</span><b>${escapeHtml(String(c.visits_per_year ?? "—"))}</b></td>
        <td><span>Contract value</span><b>${c.contract_value_inr ? formatINR(Number(c.contract_value_inr)) : "—"}</b></td>
      </tr>
    </table>
  </div>

  ${c.coverage_scope ? `<h2>Scope of Coverage</h2>${listHtml(lines(c.coverage_scope))}` : ""}
  <h2>Rules &amp; Conditions</h2>${listHtml(lines(c.rules))}
  <h2>Terms &amp; Conditions</h2>${listHtml(lines(c.terms))}

  <h2>Signatures &nbsp; <span class="muted" style="font-weight:normal">(${escapeHtml((c.signature_mode ?? "digital").toUpperCase())})</span></h2>
  <table><tr>
    <td style="width:50%;padding-right:10pt" class="sig-block">
      <div class="lbl" style="color:#0f6c28;font-weight:bold">FOR SERVICE PROVIDER</div>
      <div class="sig">${sigImg(c.signatory_provider_signature)}</div>
      <div style="margin-top:6pt"><b>${escapeHtml(c.signatory_provider_name || SELLER.name)}</b></div>
      <div class="muted">${escapeHtml(c.signatory_provider_title || "Authorised signatory")}</div>
      ${c.signatory_provider_signed_at ? `<div class="muted">Signed: ${new Date(c.signatory_provider_signed_at).toLocaleString("en-IN")}</div>` : ""}
    </td>
    <td style="width:50%;padding-left:10pt" class="sig-block">
      <div class="lbl" style="color:#0f6c28;font-weight:bold">FOR CLIENT</div>
      <div class="sig">${sigImg(c.signatory_client_signature)}</div>
      <div style="margin-top:6pt"><b>${escapeHtml(c.signatory_client_name || c.client_name || "")}</b></div>
      <div class="muted">${escapeHtml(c.signatory_client_title || "Authorised signatory")}</div>
      ${c.signatory_client_signed_at ? `<div class="muted">Signed: ${new Date(c.signatory_client_signed_at).toLocaleString("en-IN")}</div>` : ""}
    </td>
  </tr></table>

  <div class="footer">${SELLER.name} &nbsp;·&nbsp; ${SELLER.email} &nbsp;·&nbsp; GSTIN ${SELLER.gstin} &nbsp;·&nbsp; <b style="color:#FF9933">${SELLER.website}</b></div>
</div></body></html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  downloadBlob(blob, `AMC_${slug(c.contract_no)}.doc`);
}
