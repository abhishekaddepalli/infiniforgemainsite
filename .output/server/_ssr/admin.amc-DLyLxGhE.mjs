import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Et as LoaderCircle, Lt as IndianRupee, N as Signature, On as CircleCheck, R as ShieldCheck, U as Search, b as Trash2, h as Upload, i as Wrench, nn as FileDown, ot as Pencil, r as X, rt as Plus, tn as FileText, zn as CalendarClock, zt as Image$1 } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CiapfthD.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { n as formatINR } from "./catalog-0WyprjD8.mjs";
import { t as SignaturePad } from "./SignaturePad-BkuZckJR.mjs";
import { a as useCms } from "./cms-BQLw1hye.mjs";
import { t as downloadBlob } from "./download-DhKjMGgD.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.amc-DLyLxGhE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
var SELLER = {
	name: "Infiniforge Technologies Pvt Ltd",
	address: "Enterprise Business Platform · India",
	email: "billing@infiniforge.cloud",
	website: "infiniforge.cloud",
	gstin: "29ABCDE1234F1Z5",
	cin: "U72900KA2024PTC000000"
};
var GREEN = [
	15,
	108,
	40
];
var GREEN_DARK = [
	8,
	66,
	28
];
var SAFFRON = [
	255,
	153,
	51
];
var INK = [
	15,
	23,
	42
];
var MUTED = [
	100,
	116,
	139
];
function slug(s) {
	return s.replace(/[^A-Za-z0-9_-]/g, "_");
}
function lines(text) {
	if (!text) return [];
	return text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}
function escapeHtml(s) {
	return s.replace(/[&<>"']/g, (m) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[m]);
}
async function resolveImage(src) {
	if (!src) return null;
	try {
		let dataUrl = src;
		if (!src.startsWith("data:")) {
			const res = await fetch(src, { mode: "cors" });
			if (!res.ok) return null;
			const blob = await res.blob();
			dataUrl = await new Promise((resolve, reject) => {
				const fr = new FileReader();
				fr.onload = () => resolve(fr.result);
				fr.onerror = () => reject(fr.error);
				fr.readAsDataURL(blob);
			});
		}
		const format = dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg") ? "JPEG" : "PNG";
		const dims = await new Promise((resolve) => {
			const img = new Image();
			img.onload = () => resolve({
				w: img.naturalWidth || 200,
				h: img.naturalHeight || 200
			});
			img.onerror = () => resolve({
				w: 200,
				h: 200
			});
			img.src = dataUrl;
		});
		return {
			dataUrl,
			format,
			w: dims.w,
			h: dims.h
		};
	} catch {
		return null;
	}
}
async function downloadAmcPdf(c) {
	const doc = new import_jspdf_node_min.default({
		unit: "pt",
		format: "a4"
	});
	const W = doc.internal.pageSize.getWidth();
	const H = doc.internal.pageSize.getHeight();
	const M = 44;
	const logo = await resolveImage(c.logo_url ?? null);
	const bandH = 96;
	doc.setFillColor(...GREEN_DARK);
	doc.rect(0, 0, W, bandH, "F");
	doc.setFillColor(...SAFFRON);
	doc.rect(0, bandH, W, 4, "F");
	doc.setFillColor(...GREEN);
	doc.rect(0, 100, W, 2, "F");
	const logoBoxX = M, logoBoxY = 22, logoMaxH = 52;
	if (logo) {
		const ratio = logo.w / logo.h;
		const h = logoMaxH, w = Math.min(160, h * ratio);
		doc.setFillColor(255, 255, 255);
		doc.roundedRect(logoBoxX - 6, logoBoxY - 6, w + 12, 64, 6, 6, "F");
		try {
			doc.addImage(logo.dataUrl, logo.format, logoBoxX, logoBoxY, w, h);
		} catch {}
	} else {
		doc.setFillColor(...SAFFRON);
		doc.roundedRect(logoBoxX, logoBoxY, 46, 46, 8, 8, "F");
		doc.setFont("helvetica", "bold").setFontSize(24).setTextColor(255, 255, 255);
		doc.text("I", 67, 54, { align: "center" });
	}
	const brandX = 224;
	doc.setFont("helvetica", "bold").setFontSize(16).setTextColor(255, 255, 255);
	doc.text(SELLER.name, brandX, 42);
	doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(220, 235, 220);
	doc.text(SELLER.address, brandX, 58);
	doc.text(`${SELLER.email}  ·  ${SELLER.website}`, brandX, 72);
	const status = (c.status ?? "active").toUpperCase();
	doc.setFillColor(...SAFFRON);
	doc.roundedRect(W - M - 96, 28, 96, 22, 11, 11, "F");
	doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(255, 255, 255);
	doc.text(status, W - M - 48, 43, { align: "center" });
	doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(220, 235, 220);
	doc.text(`GSTIN ${SELLER.gstin}`, W - M, 66, { align: "right" });
	doc.setFontSize(8);
	doc.text(`CIN ${SELLER.cin}`, W - M, 78, { align: "right" });
	let y = 130;
	doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(...INK);
	doc.text("ANNUAL MAINTENANCE CONTRACT", M, y);
	doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...MUTED);
	doc.text(`Contract No: `, M, y + 16);
	doc.setFont("helvetica", "bold").setTextColor(...INK);
	doc.text(c.contract_no, 122, y + 16);
	doc.setFont("helvetica", "normal").setTextColor(...MUTED);
	doc.text(`Issued: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}`, W - M, y + 16, { align: "right" });
	y += 34;
	const colW = (W - 2 * M - 20) / 2;
	const partyBlocks = (blocks) => {
		const rows = blocks.map(([label, val]) => {
			const bold = label === "Name";
			doc.setFont("helvetica", bold ? "bold" : "normal").setFontSize(bold ? 10 : 9);
			return {
				label,
				wrapped: doc.splitTextToSize(val || "—", colW - 24),
				bold
			};
		});
		const rowH = (r) => 11 + r.wrapped.length * 11 + 4;
		const contentH = rows.reduce((s, r) => s + rowH(r), 0);
		return {
			rows,
			height: Math.max(96, contentH + 24)
		};
	};
	const providerData = partyBlocks([
		["Name", SELLER.name],
		["Address", SELLER.address],
		["Email / GSTIN", `${SELLER.email}  ·  ${SELLER.gstin}`]
	]);
	const clientData = partyBlocks([
		["Name", c.client_name || "—"],
		["Address", c.client_address || "—"],
		["Email / GSTIN", `${c.client_email || "—"}  ·  ${c.client_gstin || "—"}`]
	]);
	const partiesH = Math.max(providerData.height, clientData.height);
	const partiesY = y;
	const drawParty = (heading, x, data) => {
		doc.setFillColor(248, 250, 252);
		doc.roundedRect(x, partiesY, colW, partiesH, 6, 6, "F");
		doc.setDrawColor(226, 232, 240);
		doc.roundedRect(x, partiesY, colW, partiesH, 6, 6, "S");
		doc.setFillColor(...GREEN);
		doc.rect(x, partiesY, 3, partiesH, "F");
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
	const summaryInnerW = W - 2 * M - 32;
	doc.setFont("helvetica", "bold").setFontSize(12);
	const titleLines = doc.splitTextToSize(c.title || "Maintenance Contract", summaryInnerW);
	const subLines = c.subtitle ? (doc.setFont("helvetica", "normal").setFontSize(9), doc.splitTextToSize(c.subtitle, summaryInnerW)) : [];
	const headTextH = titleLines.length * 15 + (subLines.length ? subLines.length * 11 + 4 : 0);
	const cardH = 30 + headTextH + 40;
	doc.setFillColor(255, 251, 244);
	doc.roundedRect(M, y, W - 2 * M, cardH, 8, 8, "F");
	doc.setDrawColor(...SAFFRON).setLineWidth(.6);
	doc.roundedRect(M, y, W - 2 * M, cardH, 8, 8, "S");
	doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(...INK);
	doc.text(titleLines, 60, y + 22);
	if (subLines.length) {
		doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED);
		doc.text(subLines, 60, y + 22 + titleLines.length * 15);
	}
	const kvY = y + 30 + headTextH + 14;
	const kvItems = [
		["Start date", c.start_date || "—"],
		["End date", c.end_date || "—"],
		["SLA response", c.sla_response_hours ? `${c.sla_response_hours} hrs` : "—"],
		["Visits / year", c.visits_per_year ? String(c.visits_per_year) : "—"],
		["Contract value", c.contract_value_inr ? formatINR(Number(c.contract_value_inr)) : "—"]
	];
	const kvColW = (W - 2 * M - 32) / kvItems.length;
	kvItems.forEach(([label, v], i) => {
		const x = 60 + i * kvColW;
		doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...MUTED);
		doc.text(label.toUpperCase(), x, kvY);
		doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...INK);
		const vLines = doc.splitTextToSize(v, kvColW - 6);
		doc.text(vLines[0] ?? v, x, kvY + 13);
	});
	y += cardH + 22;
	const section = (heading, body) => {
		if (body.length === 0) return;
		if (y > H - 160) {
			doc.addPage();
			y = M;
		}
		doc.setFillColor(...GREEN);
		doc.rect(M, y - 2, 4, 16, "F");
		doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(...GREEN_DARK);
		doc.text(heading, 56, y + 10);
		y += 24;
		doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(50, 60, 75);
		body.forEach((b, i) => {
			const wrapped = doc.splitTextToSize(`${i + 1}.  ${b}`, W - 2 * M - 10);
			const needed = wrapped.length * 14 + 4;
			if (y + needed > H - 60) {
				doc.addPage();
				y = M;
			}
			wrapped.forEach((ln) => {
				if (y > H - 60) {
					doc.addPage();
					y = M;
				}
				doc.text(ln, 50, y);
				y += 14;
			});
			y += 3;
		});
		y += 8;
	};
	if (c.coverage_scope) section("Scope of Coverage", lines(c.coverage_scope));
	section("Rules & Conditions", lines(c.rules));
	section("Terms & Conditions", lines(c.terms));
	if (y + 210 > H - 60) {
		doc.addPage();
		y = M;
	}
	doc.setDrawColor(220);
	doc.setLineDashPattern([2, 2], 0);
	doc.line(M, y, W - M, y);
	doc.setLineDashPattern([], 0);
	y += 18;
	doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...INK);
	doc.text("Signatures", M, y);
	doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED);
	doc.text(`Mode: ${(c.signature_mode ?? "digital").toUpperCase()}`, W - M, y, { align: "right" });
	y += 10;
	const drawSig = (title, name, role, dataUrl, signedAt, x) => {
		const boxY = y + 6;
		doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...GREEN);
		doc.text(title.toUpperCase(), x, boxY);
		doc.setFillColor(255, 255, 255);
		doc.setDrawColor(210);
		doc.roundedRect(x, boxY + 6, colW, 66, 4, 4, "FD");
		if (dataUrl) try {
			doc.addImage(dataUrl, "PNG", x + 6, boxY + 10, colW - 12, 58);
		} catch {}
		else {
			doc.setTextColor(170).setFont("helvetica", "italic").setFontSize(9);
			doc.text("(Signature to be affixed)", x + colW / 2, boxY + 42, { align: "center" });
		}
		doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...INK);
		doc.text(name || "—", x, boxY + 86);
		doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED);
		doc.text(role || "—", x, boxY + 98);
		if (signedAt) doc.text(`Signed: ${new Date(signedAt).toLocaleString("en-IN")}`, x, boxY + 110);
	};
	drawSig("For Service Provider", c.signatory_provider_name || SELLER.name, c.signatory_provider_title || "Authorised signatory", c.signatory_provider_signature ?? null, c.signatory_provider_signed_at, M);
	drawSig("For Client", c.signatory_client_name || c.client_name || "", c.signatory_client_title || "Authorised signatory", c.signatory_client_signature ?? null, c.signatory_client_signed_at, M + colW + 20);
	const pages = doc.getNumberOfPages();
	for (let p = 1; p <= pages; p++) {
		doc.setPage(p);
		const fy = H - 24;
		doc.setDrawColor(230);
		doc.line(M, fy - 14, W - M, fy - 14);
		doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...MUTED);
		doc.text(`${SELLER.name}  ·  ${SELLER.email}  ·  GSTIN ${SELLER.gstin}`, M, fy);
		doc.text(`Page ${p} of ${pages}`, W / 2, fy, { align: "center" });
		doc.setTextColor(...SAFFRON).setFont("helvetica", "bold");
		doc.text(SELLER.website, W - M, fy, { align: "right" });
	}
	try {
		downloadBlob(doc.output("blob"), `AMC_${slug(c.contract_no)}.pdf`);
	} catch {
		doc.save(`AMC_${slug(c.contract_no)}.pdf`);
	}
}
async function downloadAmcDocx(c) {
	const logo = await resolveImage(c.logo_url ?? null);
	const logoImg = logo ? `<img src="${logo.dataUrl}" style="height:56px;max-width:180px;object-fit:contain;background:#fff;padding:4px;border-radius:6px" />` : `<div style="width:56px;height:56px;background:#FF9933;color:#fff;font-weight:bold;font-size:26pt;line-height:56px;text-align:center;border-radius:8px">I</div>`;
	const listHtml = (arr) => arr.length ? `<ol style="margin:6pt 0 0 20pt;padding:0">${arr.map((x) => `<li style="margin-bottom:4pt">${escapeHtml(x)}</li>`).join("")}</ol>` : `<p style="color:#888">—</p>`;
	const sigImg = (u) => u ? `<img src="${u}" style="height:70px;max-width:260px;object-fit:contain" />` : `<div style="color:#888;font-style:italic;padding:24px 0">(Signature to be affixed)</div>`;
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
      <div class="muted">Issued: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")}</div>
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
	downloadBlob(new Blob(["﻿", html], { type: "application/msword" }), `AMC_${slug(c.contract_no)}.doc`);
}
var STATUSES = [
	"draft",
	"active",
	"pending_renewal",
	"expired",
	"cancelled"
];
var DEFAULT_RULES = `Service provider will respond to reported incidents within the agreed SLA window.
Preventive maintenance visits will be scheduled at mutually agreed intervals.
Emergency on-site support beyond scope will be billed additionally at standard rates.
Client will provide safe access, power and network connectivity for on-site work.
Spare parts and hardware replacements are excluded unless explicitly listed in scope.`;
var DEFAULT_TERMS = `This contract is valid from the start date through the end date stated above.
Renewal is subject to mutual agreement 30 days prior to expiry.
Either party may terminate with a 30-day written notice; pro-rata refunds apply on unused period.
All disputes shall be governed by the laws of India and subject to jurisdiction of the courts in the seller's registered state.
Payment terms: contract value payable in advance / as per invoice schedule. GST applicable extra.`;
function empty() {
	const today = /* @__PURE__ */ new Date();
	const next = /* @__PURE__ */ new Date();
	next.setFullYear(today.getFullYear() + 1);
	return {
		contract_no: `AMC-${Date.now().toString().slice(-8)}`,
		title: "",
		subtitle: "",
		status: "draft",
		amount_inr: "",
		start_date: today.toISOString().slice(0, 10),
		end_date: next.toISOString().slice(0, 10),
		client_name: "",
		client_email: "",
		client_address: "",
		client_gstin: "",
		sla_response_hours: "8",
		visits_per_year: "4",
		coverage_scope: "Preventive maintenance, incident response, remote support and quarterly reviews.",
		rules: DEFAULT_RULES,
		terms: DEFAULT_TERMS,
		signature_mode: "digital",
		signatory_provider_name: "",
		signatory_provider_title: "Authorised signatory",
		signatory_provider_signature: null,
		signatory_provider_signed_at: "",
		signatory_client_name: "",
		signatory_client_title: "Authorised signatory",
		signatory_client_signature: null,
		signatory_client_signed_at: "",
		logo_url: null
	};
}
function statusTone(s) {
	if (s === "active") return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
	if (s === "pending_renewal") return "bg-amber-500/15 text-amber-500 border-amber-500/30";
	if (s === "expired" || s === "cancelled") return "bg-rose-500/15 text-rose-500 border-rose-500/30";
	return "bg-primary/15 text-primary border-primary/30";
}
function toContract(r, fallbackLogo) {
	const m = r.metadata ?? {};
	return {
		contract_no: m.contract_no ?? r.id.slice(0, 8).toUpperCase(),
		title: r.title,
		subtitle: r.subtitle,
		client_name: m.client_name,
		client_address: m.client_address,
		client_email: m.client_email,
		client_gstin: m.client_gstin,
		contract_value_inr: r.amount_inr ?? void 0,
		status: r.status,
		start_date: m.start_date,
		end_date: m.end_date ?? (r.due_at ? r.due_at.slice(0, 10) : void 0),
		sla_response_hours: m.sla_response_hours,
		visits_per_year: m.visits_per_year,
		coverage_scope: m.coverage_scope,
		rules: m.rules,
		terms: m.terms,
		signature_mode: m.signature_mode ?? "digital",
		signatory_provider_name: m.signatory_provider_name,
		signatory_provider_title: m.signatory_provider_title,
		signatory_provider_signature: m.signatory_provider_signature ?? null,
		signatory_provider_signed_at: m.signatory_provider_signed_at,
		signatory_client_name: m.signatory_client_name,
		signatory_client_title: m.signatory_client_title,
		signatory_client_signature: m.signatory_client_signature ?? null,
		signatory_client_signed_at: m.signatory_client_signed_at,
		logo_url: m.logo_url ?? fallbackLogo ?? null
	};
}
function Page() {
	const qc = useQueryClient();
	const brandLogoFallback = useCms("branding")?.logo_url || null;
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(empty);
	const logoInputRef = (0, import_react.useRef)(null);
	const { data: records = [], isLoading } = useQuery({
		queryKey: ["module_records", "amc"],
		queryFn: async () => {
			const { data, error } = await supabase.from("module_records").select("*").eq("module", "amc").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return records.filter((r) => {
			if (statusFilter !== "all" && r.status !== statusFilter) return false;
			if (!q) return true;
			const meta = r.metadata ?? {};
			return r.title.toLowerCase().includes(q) || meta.client_name?.toLowerCase().includes(q) || meta.contract_no?.toLowerCase().includes(q);
		});
	}, [
		records,
		search,
		statusFilter
	]);
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: records.length,
			active: records.filter((r) => r.status === "active").length,
			renew: records.filter((r) => r.status === "pending_renewal").length,
			value: records.reduce((s, r) => s + Number(r.amount_inr ?? 0), 0)
		};
	}, [records]);
	const upsert = useMutation({
		mutationFn: async (f) => {
			const metadata = {
				contract_no: f.contract_no,
				client_name: f.client_name,
				client_email: f.client_email,
				client_address: f.client_address,
				client_gstin: f.client_gstin,
				start_date: f.start_date,
				end_date: f.end_date,
				sla_response_hours: f.sla_response_hours,
				visits_per_year: f.visits_per_year,
				coverage_scope: f.coverage_scope,
				rules: f.rules,
				terms: f.terms,
				signature_mode: f.signature_mode,
				signatory_provider_name: f.signatory_provider_name,
				signatory_provider_title: f.signatory_provider_title,
				signatory_provider_signature: f.signatory_provider_signature,
				signatory_provider_signed_at: f.signatory_provider_signed_at,
				signatory_client_name: f.signatory_client_name,
				signatory_client_title: f.signatory_client_title,
				signatory_client_signature: f.signatory_client_signature,
				signatory_client_signed_at: f.signatory_client_signed_at,
				logo_url: f.logo_url
			};
			const payload = {
				module: "amc",
				title: f.title.trim(),
				subtitle: f.subtitle.trim() || null,
				status: f.status,
				amount_inr: f.amount_inr ? Number(f.amount_inr) : 0,
				due_at: f.end_date ? new Date(f.end_date).toISOString() : null,
				tags: [f.signature_mode, f.status],
				metadata
			};
			if (f.id) {
				const { error } = await supabase.from("module_records").update(payload).eq("id", f.id);
				if (error) throw error;
				await logAudit({
					action: "update",
					resource: "settings",
					resource_id: f.id,
					details: {
						module: "amc",
						title: payload.title
					}
				});
			} else {
				const { error } = await supabase.from("module_records").insert(payload);
				if (error) throw error;
				await logAudit({
					action: "create",
					resource: "settings",
					details: {
						module: "amc",
						title: payload.title
					}
				});
			}
		},
		onSuccess: () => {
			toast.success(form.id ? "Contract updated" : "Contract created");
			setOpen(false);
			setForm(empty());
			qc.invalidateQueries({ queryKey: ["module_records", "amc"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("module_records").delete().eq("id", id);
			if (error) throw error;
			await logAudit({
				action: "delete",
				resource: "settings",
				resource_id: id,
				details: { module: "amc" }
			});
		},
		onSuccess: () => {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["module_records", "amc"] });
		},
		onError: (e) => toast.error(e.message)
	});
	function openNew() {
		setForm(empty());
		setOpen(true);
	}
	function openEdit(r) {
		const m = r.metadata ?? {};
		setForm({
			id: r.id,
			contract_no: m.contract_no ?? `AMC-${r.id.slice(0, 8).toUpperCase()}`,
			title: r.title,
			subtitle: r.subtitle ?? "",
			status: r.status,
			amount_inr: r.amount_inr != null ? String(r.amount_inr) : "",
			start_date: m.start_date ?? "",
			end_date: m.end_date ?? (r.due_at ? r.due_at.slice(0, 10) : ""),
			client_name: m.client_name ?? "",
			client_email: m.client_email ?? "",
			client_address: m.client_address ?? "",
			client_gstin: m.client_gstin ?? "",
			sla_response_hours: m.sla_response_hours ?? "",
			visits_per_year: m.visits_per_year ?? "",
			coverage_scope: m.coverage_scope ?? "",
			rules: m.rules ?? DEFAULT_RULES,
			terms: m.terms ?? DEFAULT_TERMS,
			signature_mode: m.signature_mode ?? "digital",
			signatory_provider_name: m.signatory_provider_name ?? "",
			signatory_provider_title: m.signatory_provider_title ?? "Authorised signatory",
			signatory_provider_signature: m.signatory_provider_signature ?? null,
			signatory_provider_signed_at: m.signatory_provider_signed_at ?? "",
			signatory_client_name: m.signatory_client_name ?? "",
			signatory_client_title: m.signatory_client_title ?? "Authorised signatory",
			signatory_client_signature: m.signatory_client_signature ?? null,
			signatory_client_signed_at: m.signatory_client_signed_at ?? "",
			logo_url: m.logo_url ?? null
		});
		setOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-2xl bg-gradient-brand flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-6 w-6 text-white" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold",
						children: "AMC Contracts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1 max-w-2xl",
						children: "Draft, sign and export Annual Maintenance Contracts with rules, SLA terms and dual-party signatures (digital or physical)."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openNew,
					className: "bg-gradient-brand text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-2" }), " New AMC contract"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: ShieldCheck,
						label: "Total contracts",
						value: String(stats.total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: CircleCheck,
						label: "Active",
						value: String(stats.active),
						tone: "green"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: CalendarClock,
						label: "Pending renewal",
						value: String(stats.renew),
						tone: "saffron"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						icon: IndianRupee,
						label: "Portfolio value",
						value: formatINR(stats.value),
						tone: "brand"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-4 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 min-w-[220px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search by title, client, contract no…",
							className: "pl-9",
							value: search,
							onChange: (e) => setSearch(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[180px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s))] })]
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin inline mr-2" }), " Loading…"]
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center text-sm text-muted-foreground",
					children: [
						"No contracts yet. Click ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "New AMC contract" }),
						" to create one."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl border border-border/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "min-w-[860px] w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs uppercase text-muted-foreground border-b border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2",
									children: "Contract"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2",
									children: "Client"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right py-2 px-2",
									children: "Value"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2",
									children: "End date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left py-2 px-2",
									children: "Signatures"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right py-2 px-2",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((r) => {
							const m = r.metadata ?? {};
							const providerSigned = !!m.signatory_provider_signature;
							const clientSigned = !!m.signatory_client_signature;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/50 hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium break-words",
											children: r.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground break-all",
											children: m.contract_no ?? r.id.slice(0, 8)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-2",
										children: m.client_name ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: statusTone(r.status),
											children: r.status.replace("_", " ")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-2 text-right tabular-nums",
										children: r.amount_inr ? formatINR(Number(r.amount_inr)) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-2",
										children: m.end_date ?? (r.due_at ? new Date(r.due_at).toLocaleDateString("en-IN") : "—")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: providerSigned ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-muted",
												children: providerSigned ? "Provider ✓" : "Provider …"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: clientSigned ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-muted",
												children: clientSigned ? "Client ✓" : "Client …"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-2 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													title: "Export PDF",
													onClick: () => downloadAmcPdf(toContract(r, brandLogoFallback)),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													title: "Export Word",
													onClick: () => downloadAmcDocx(toContract(r, brandLogoFallback)),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													onClick: () => openEdit(r),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													onClick: () => {
														if (confirm(`Delete contract "${r.title}"?`)) remove.mutate(r.id);
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
												})
											]
										})
									})
								]
							}, r.id);
						}) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-4xl max-h-[92vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Edit AMC contract" : "New AMC contract" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							defaultValue: "details",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "grid grid-cols-4 w-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "details",
											children: "Details"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "rules",
											children: "Rules & Terms"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "sign",
											children: "Signatures"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "preview",
											children: "Export"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "details",
									className: "grid gap-4 md:grid-cols-2 mt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-2 glass rounded-2xl p-4 flex flex-wrap items-center gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-16 w-16 rounded-xl bg-white/60 dark:bg-white/10 border border-border/60 flex items-center justify-center overflow-hidden shrink-0",
													children: form.logo_url || brandLogoFallback ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: form.logo_url || brandLogoFallback || "",
														alt: "Contract logo",
														className: "max-h-full max-w-full object-contain"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "h-6 w-6 text-muted-foreground" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-1 min-w-[220px]",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-xs uppercase tracking-wide text-muted-foreground",
															children: "Contract logo"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-sm font-medium",
															children: form.logo_url ? "Custom logo attached" : brandLogoFallback ? "Using website brand logo" : "No logo — will show text header"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[11px] text-muted-foreground mt-0.5",
															children: "PNG/JPG, transparent works best. Max ~1MB."
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															ref: logoInputRef,
															type: "file",
															accept: "image/png,image/jpeg,image/webp,image/svg+xml",
															className: "hidden",
															onChange: (e) => {
																const file = e.target.files?.[0];
																if (!file) return;
																if (file.size > 1024 * 1024 * 2) {
																	toast.error("Logo too large (max 2MB)");
																	return;
																}
																const reader = new FileReader();
																reader.onload = () => setForm((f) => ({
																	...f,
																	logo_url: String(reader.result || "")
																}));
																reader.readAsDataURL(file);
																e.target.value = "";
															}
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															type: "button",
															variant: "outline",
															size: "sm",
															onClick: () => logoInputRef.current?.click(),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 mr-2" }), " Upload logo"]
														}),
														brandLogoFallback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															type: "button",
															variant: "outline",
															size: "sm",
															onClick: () => setForm((f) => ({
																...f,
																logo_url: brandLogoFallback
															})),
															children: "Use website logo"
														}),
														form.logo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															type: "button",
															variant: "ghost",
															size: "sm",
															onClick: () => setForm((f) => ({
																...f,
																logo_url: null
															})),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 mr-1" }), " Remove"]
														})
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Contract number",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: form.contract_no,
												onChange: (e) => setForm({
													...form,
													contract_no: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Status",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: form.status,
												onValueChange: (v) => setForm({
													...form,
													status: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: s,
													children: s
												}, s)) })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Contract title",
											span2: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: form.title,
												onChange: (e) => setForm({
													...form,
													title: e.target.value
												}),
												required: true
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Short description / notes",
											span2: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												rows: 2,
												value: form.subtitle,
												onChange: (e) => setForm({
													...form,
													subtitle: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Client / Company",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: form.client_name,
												onChange: (e) => setForm({
													...form,
													client_name: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Client email",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "email",
												value: form.client_email,
												onChange: (e) => setForm({
													...form,
													client_email: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Client GSTIN",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: form.client_gstin,
												onChange: (e) => setForm({
													...form,
													client_gstin: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Contract value (INR)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: 0,
												step: "0.01",
												value: form.amount_inr,
												onChange: (e) => setForm({
													...form,
													amount_inr: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Client address",
											span2: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												rows: 2,
												value: form.client_address,
												onChange: (e) => setForm({
													...form,
													client_address: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Start date",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "date",
												value: form.start_date,
												onChange: (e) => setForm({
													...form,
													start_date: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "End date",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "date",
												value: form.end_date,
												onChange: (e) => setForm({
													...form,
													end_date: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "SLA response (hours)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: form.sla_response_hours,
												onChange: (e) => setForm({
													...form,
													sla_response_hours: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Visits per year",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: form.visits_per_year,
												onChange: (e) => setForm({
													...form,
													visits_per_year: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Coverage scope",
											span2: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												rows: 3,
												value: form.coverage_scope,
												onChange: (e) => setForm({
													...form,
													coverage_scope: e.target.value
												})
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "rules",
									className: "grid gap-4 mt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Rules & conditions (one per line — auto numbered on export)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												rows: 8,
												value: form.rules,
												onChange: (e) => setForm({
													...form,
													rules: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
											label: "Terms & conditions (one per line — auto numbered on export)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												rows: 8,
												value: form.terms,
												onChange: (e) => setForm({
													...form,
													terms: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: "Tip: keep each clause on its own line. Blank lines are ignored."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "sign",
									className: "grid gap-6 mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs uppercase tracking-wide text-muted-foreground",
											children: "Signing mode"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.signature_mode,
											onValueChange: (v) => setForm({
												...form,
												signature_mode: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "w-[220px]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "digital",
												children: "Digital (draw signature)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "physical",
												children: "Physical (print & sign)"
											})] })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-6 md:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "glass rounded-2xl p-4 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 font-semibold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Signature, { className: "h-4 w-4 text-primary" }), " Service Provider"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
													label: "Signatory name",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: form.signatory_provider_name,
														onChange: (e) => setForm({
															...form,
															signatory_provider_name: e.target.value
														})
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
													label: "Designation",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: form.signatory_provider_title,
														onChange: (e) => setForm({
															...form,
															signatory_provider_title: e.target.value
														})
													})
												}),
												form.signature_mode === "digital" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignaturePad, {
													value: form.signatory_provider_signature,
													onChange: (url) => setForm({
														...form,
														signatory_provider_signature: url,
														signatory_provider_signed_at: url ? (/* @__PURE__ */ new Date()).toISOString() : ""
													})
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground rounded-lg bg-muted p-3",
													children: "Physical mode: the exported document leaves a signature box for wet-ink signature after printing."
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "glass rounded-2xl p-4 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 font-semibold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Signature, { className: "h-4 w-4 text-primary" }), " Client"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
													label: "Signatory name",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: form.signatory_client_name,
														onChange: (e) => setForm({
															...form,
															signatory_client_name: e.target.value
														})
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
													label: "Designation",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: form.signatory_client_title,
														onChange: (e) => setForm({
															...form,
															signatory_client_title: e.target.value
														})
													})
												}),
												form.signature_mode === "digital" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignaturePad, {
													value: form.signatory_client_signature,
													onChange: (url) => setForm({
														...form,
														signatory_client_signature: url,
														signatory_client_signed_at: url ? (/* @__PURE__ */ new Date()).toISOString() : ""
													})
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground rounded-lg bg-muted p-3",
													children: "Physical mode: the exported document leaves a signature box for wet-ink signature after printing."
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "preview",
									className: "mt-4 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Save the contract first, then export as PDF or Word. Both formats include your rules, terms and signatures."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											onClick: () => downloadAmcPdf(toContract({
												id: form.id ?? "preview",
												module: "amc",
												title: form.title,
												subtitle: form.subtitle,
												status: form.status,
												amount_inr: form.amount_inr ? Number(form.amount_inr) : 0,
												due_at: form.end_date ? new Date(form.end_date).toISOString() : null,
												tags: [],
												metadata: { ...form },
												created_at: "",
												updated_at: ""
											}, brandLogoFallback)),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-2" }), " Preview PDF"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											onClick: () => downloadAmcDocx(toContract({
												id: form.id ?? "preview",
												module: "amc",
												title: form.title,
												subtitle: form.subtitle,
												status: form.status,
												amount_inr: form.amount_inr ? Number(form.amount_inr) : 0,
												due_at: form.end_date ? new Date(form.end_date).toISOString() : null,
												tags: [],
												metadata: { ...form },
												created_at: "",
												updated_at: ""
											}, brandLogoFallback)),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4 mr-2" }), " Preview Word (.doc)"]
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => upsert.mutate(form),
							disabled: upsert.isPending || !form.title.trim(),
							children: [upsert.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }), form.id ? "Save changes" : "Create contract"]
						})] })
					]
				})
			})
		]
	});
}
function F({ label, span2, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: span2 ? "md:col-span-2" : "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground",
			children: label
		}), children]
	});
}
function Kpi({ icon: Icon, label, value, tone }) {
	const bg = tone === "green" ? "bg-gradient-green" : tone === "saffron" ? "bg-gradient-saffron" : tone === "brand" ? "bg-gradient-brand" : "bg-secondary";
	const cls = tone ? "text-white" : "text-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass rounded-2xl p-4 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-10 w-10 rounded-xl ${bg} flex items-center justify-center shrink-0`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-5 w-5 ${cls}` })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] uppercase tracking-wider text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-lg font-bold truncate",
				children: value
			})]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "AMC Contracts",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
