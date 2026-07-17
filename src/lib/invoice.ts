import jsPDF from "jspdf";
import { downloadBlob, downloadCsv } from "@/lib/download";
import type { Database } from "@/integrations/supabase/types";

export type InvoiceOrder = Database["public"]["Tables"]["orders"]["Row"];

const SELLER = {
  name: "Infiniforge Technologies Pvt Ltd",
  address: "Enterprise Business Platform · India",
  email: "billing@infiniforge.cloud",
  website: "infiniforge.cloud",
  gstin: "29ABCDE1234F1Z5",
  state: "Karnataka",
  state_code: "29",
  pan: "ABCDE1234F",
  hsn_default: "998314", // IT design & development services
  bank: {
    name: "HDFC Bank",
    account_name: "Infiniforge Technologies Pvt Ltd",
    account_number: "50200012345678",
    ifsc: "HDFC0001234",
    branch: "Bengaluru MG Road",
    upi: "infiniforge@hdfcbank",
  },
  terms: [
    "Payment due on receipt unless otherwise stated.",
    "Late payments may attract interest at 1.5% per month.",
    "All disputes are subject to Bengaluru jurisdiction.",
    "Digital deliverables are non-refundable once accessed.",
  ],
};

function numberToWordsInr(num: number): string {
  const n = Math.round(num);
  if (n === 0) return "Rupees Zero Only";
  const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const two = (x: number): string => x < 20 ? a[x] : b[Math.floor(x/10)] + (x%10 ? " " + a[x%10] : "");
  const three = (x: number): string => {
    const h = Math.floor(x/100), r = x%100;
    return (h ? a[h] + " Hundred" + (r ? " " : "") : "") + (r ? two(r) : "");
  };
  let rem = n;
  const crore = Math.floor(rem/10000000); rem %= 10000000;
  const lakh = Math.floor(rem/100000); rem %= 100000;
  const thou = Math.floor(rem/1000); rem %= 1000;
  const hund = rem;
  const parts: string[] = [];
  if (crore) parts.push(two(crore) + " Crore");
  if (lakh) parts.push(two(lakh) + " Lakh");
  if (thou) parts.push(two(thou) + " Thousand");
  if (hund) parts.push(three(hund));
  return "Rupees " + parts.join(" ").trim() + " Only";
}


// PDF-safe INR formatter. jsPDF's default Helvetica WinAnsi font cannot
// render the ₹ glyph, so it prints as a tiny "1"-like box. We use "Rs."
// prefix inside PDFs.
export const formatInrPdf = (n: number) =>
  "Rs. " + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(Number(n) || 0));

export type InvoiceTemplate = "modern" | "classic" | "minimal";

export type InvoiceOptions = {
  template?: InvoiceTemplate;
  logoUrl?: string;
};

const TEMPLATE_KEY = "infiniforge.invoice.template";
const LOGO_KEY = "infiniforge.invoice.logo";

export function getSavedTemplate(): InvoiceTemplate {
  if (typeof window === "undefined") return "modern";
  const v = window.localStorage.getItem(TEMPLATE_KEY);
  return v === "classic" || v === "minimal" || v === "modern" ? v : "modern";
}
export function saveTemplate(t: InvoiceTemplate) {
  if (typeof window !== "undefined") window.localStorage.setItem(TEMPLATE_KEY, t);
}
export function getSavedLogo(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(LOGO_KEY) || "";
}
export function saveLogo(url: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(LOGO_KEY, url);
}

export function invoiceFileBase(o: InvoiceOrder) {
  return (o.invoice_number || o.order_number || "invoice").replace(/[^A-Za-z0-9_-]/g, "_");
}

async function urlToDataUrl(url: string): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    const dims: { w: number; h: number } = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 200, h: 60 });
      img.src = dataUrl;
    });
    return { data: dataUrl, w: dims.w, h: dims.h };
  } catch {
    return null;
  }
}

export function downloadInvoiceCsv(o: InvoiceOrder) {
  const rows: [string, string][] = [
    ["Invoice Number", o.invoice_number ?? ""],
    ["Order Number", o.order_number],
    ["Invoice Date", new Date(o.paid_at ?? o.created_at).toLocaleString("en-IN")],
    ["Status", o.status],
    ["Seller", SELLER.name],
    ["Seller GSTIN", SELLER.gstin],
    ["Customer Name", o.customer_name ?? ""],
    ["Customer Email", o.customer_email ?? ""],
    ["Customer Phone", o.customer_phone ?? ""],
    ["Customer GSTIN", o.customer_gstin ?? ""],
    ["Billing Address 1", o.billing_address_line1 ?? ""],
    ["Billing Address 2", o.billing_address_line2 ?? ""],
    ["Billing City", o.billing_city ?? ""],
    ["Billing State", o.billing_state ?? ""],
    ["Billing PIN", o.billing_postal_code ?? ""],
    ["Billing Country", o.billing_country ?? ""],
    ["Item", o.product_name],
    ["Quantity", String(o.quantity ?? 1)],
    ["Billing", o.billing_cycle ?? "one-time"],
    ["Subtotal (INR)", String(o.amount_inr)],
    ["GST %", String(o.gst_percent)],
    ["GST (INR)", String(o.gst_inr)],
    ["Wallet Applied (INR)", String(o.wallet_applied_inr ?? 0)],
    ["Coupon", o.coupon_code ?? ""],
    ["Total (INR)", String(o.total_inr)],
    ["Payment Method", o.payment_method ?? ""],
    ["Payment Reference", o.razorpay_payment_id ?? o.payment_id ?? ""],
  ];
  downloadCsv(rows, `${invoiceFileBase(o)}.csv`);
}

type Palette = {
  primary: [number, number, number];
  accent: [number, number, number];
  ink: [number, number, number];
  muted: [number, number, number];
  soft: [number, number, number];
};

const PALETTES: Record<InvoiceTemplate, Palette> = {
  modern: {
    primary: [255, 128, 20],
    accent: [19, 136, 8],
    ink: [17, 24, 39],
    muted: [107, 114, 128],
    soft: [255, 244, 230],
  },
  classic: {
    primary: [20, 45, 100],
    accent: [180, 140, 40],
    ink: [10, 20, 40],
    muted: [90, 100, 120],
    soft: [242, 245, 252],
  },
  minimal: {
    primary: [30, 30, 30],
    accent: [120, 120, 120],
    ink: [15, 15, 15],
    muted: [130, 130, 130],
    soft: [246, 246, 246],
  },
};

function drawHeader(doc: jsPDF, W: number, M: number, palette: Palette, template: InvoiceTemplate, logo?: { data: string; w: number; h: number } | null) {
  if (template === "modern") {
    doc.setFillColor(...palette.primary);
    doc.rect(0, 0, W, 8, "F");
    doc.setFillColor(...palette.accent);
    doc.rect(0, 8, W, 3, "F");
  } else if (template === "classic") {
    doc.setFillColor(...palette.primary);
    doc.rect(0, 0, W, 70, "F");
  } else {
    doc.setDrawColor(...palette.ink);
    doc.setLineWidth(0.8);
    doc.line(M, 40, W - M, 40);
  }

  let y = template === "classic" ? 30 : 30;
  const textColor: [number, number, number] = template === "classic" ? [255, 255, 255] : palette.ink;

  // Logo (optional)
  if (logo) {
    const targetH = 34;
    const ratio = logo.w / logo.h;
    const targetW = Math.min(140, targetH * ratio);
    try {
      doc.addImage(logo.data, "PNG", M, y - 18, targetW, targetH);
      doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...textColor);
      doc.text(SELLER.name, M + targetW + 10, y);
      doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...((template === "classic" ? [220, 220, 220] : palette.muted) as [number, number, number]));
      doc.text(SELLER.website, M + targetW + 10, y + 12);
    } catch {
      /* ignore */
    }
  } else {
    doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...textColor);
    doc.text(SELLER.name, M, y);
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...((template === "classic" ? [220, 220, 220] : palette.muted) as [number, number, number]));
    doc.text(SELLER.address, M, y + 14);
    doc.text(`${SELLER.email}  ·  ${SELLER.website}`, M, y + 26);
    doc.text(`GSTIN: ${SELLER.gstin}`, M, y + 38);
  }
}

export async function downloadInvoicePdf(o: InvoiceOrder, opts: InvoiceOptions = {}) {
  const template: InvoiceTemplate = opts.template ?? getSavedTemplate();
  const logoUrl = opts.logoUrl ?? getSavedLogo();
  const palette = PALETTES[template];

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 40;

  const logo = logoUrl ? await urlToDataUrl(logoUrl) : null;

  drawHeader(doc, W, M, palette, template, logo);

  // Invoice title block
  const titleColor: [number, number, number] = template === "classic" ? [255, 255, 255] : palette.primary;
  const subColor: [number, number, number] = template === "classic" ? [230, 230, 230] : [90, 90, 90];
  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(...titleColor);
  doc.text("TAX INVOICE", W - M, 34, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...subColor);
  doc.text(`Invoice #: ${o.invoice_number ?? "—"}`, W - M, 50, { align: "right" });
  doc.text(`Order #: ${o.order_number}`, W - M, 62, { align: "right" });

  let y = template === "classic" ? 96 : 96;
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...palette.muted);
  doc.text(`Date: ${new Date(o.paid_at ?? o.created_at).toLocaleDateString("en-IN")}`, W - M, y, { align: "right" });

  y += 20;
  doc.setDrawColor(230);
  doc.setLineWidth(0.5);
  doc.line(M, y, W - M, y);
  y += 24;

  // Bill To card
  const cardW = (W - 2 * M - 20) / 2;
  const cardY = y;
  doc.setFillColor(...palette.soft);
  doc.roundedRect(M, cardY, cardW, 130, 6, 6, "F");
  doc.roundedRect(M + cardW + 20, cardY, cardW, 130, 6, 6, "F");

  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...palette.primary);
  doc.text("BILL TO", M + 14, cardY + 18);
  doc.text("PAYMENT", M + cardW + 20 + 14, cardY + 18);

  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...palette.ink);
  let by = cardY + 34;
  const bx = M + 14;
  const put = (line?: string | null) => {
    if (!line) return;
    const wrapped = doc.splitTextToSize(line, cardW - 28);
    doc.text(wrapped, bx, by);
    by += 12 * wrapped.length;
  };
  put(o.customer_name ?? "—");
  put(o.billing_address_line1);
  put(o.billing_address_line2);
  const cityLine = [o.billing_city, o.billing_state, o.billing_postal_code].filter(Boolean).join(", ");
  put(cityLine);
  put(o.billing_country);
  put(o.customer_email);
  put(o.customer_phone);
  if (o.customer_gstin) put(`GSTIN: ${o.customer_gstin}`);

  // Payment card
  let py = cardY + 34;
  const px = M + cardW + 20 + 14;
  const putP = (label: string, val?: string | null) => {
    if (!val) return;
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...palette.muted);
    doc.text(label.toUpperCase(), px, py);
    py += 10;
    doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...palette.ink);
    doc.text(val, px, py);
    py += 16;
  };
  putP("Status", o.status.toUpperCase());
  putP("Method", o.payment_method ?? "—");
  if (o.razorpay_payment_id) putP("Reference", o.razorpay_payment_id);

  y = cardY + 150;

  // Items table
  doc.setFillColor(...palette.primary);
  doc.rect(M, y, W - 2 * M, 24, "F");
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(255, 255, 255);
  doc.text("DESCRIPTION", M + 12, y + 16);
  doc.text("HSN/SAC", M + 260, y + 16);
  doc.text("QTY", M + 335, y + 16, { align: "right" });
  doc.text("RATE", M + 405, y + 16, { align: "right" });
  doc.text("GST", M + 460, y + 16, { align: "right" });
  doc.text("AMOUNT", W - M - 12, y + 16, { align: "right" });

  y += 36;
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...palette.ink);
  const qty = o.quantity ?? 1;
  const rate = qty ? Number(o.amount_inr) / qty : Number(o.amount_inr);
  const nameLines = doc.splitTextToSize(o.product_name, 220);
  doc.text(nameLines, M + 12, y);
  const nameHeight = 12 * nameLines.length;
  if (o.billing_cycle && o.billing_cycle !== "one-time") {
    doc.setFontSize(8).setTextColor(...palette.muted);
    doc.text(`Billing cycle: ${o.billing_cycle}`, M + 12, y + nameHeight);
  }
  doc.setFontSize(9).setTextColor(...palette.ink);
  doc.text(SELLER.hsn_default, M + 260, y);
  doc.setFontSize(10);
  doc.text(String(qty), M + 335, y, { align: "right" });
  doc.text(formatInrPdf(rate), M + 405, y, { align: "right" });
  doc.text(`${o.gst_percent}%`, M + 460, y, { align: "right" });
  doc.text(formatInrPdf(Number(o.amount_inr)), W - M - 12, y, { align: "right" });

  y += Math.max(nameHeight, 20) + 20;
  doc.setDrawColor(220);
  doc.line(M, y, W - M, y);
  y += 20;

  // Tax split (CGST + SGST intra-state, IGST inter-state)
  const gstAmt = Number(o.gst_inr);
  const gstPct = Number(o.gst_percent);
  const buyerState = (o.billing_state ?? "").trim();
  const isIntraState = !!buyerState && buyerState.toLowerCase() === SELLER.state.toLowerCase();

  const labelX = W - M - 200;
  const valX = W - M - 12;
  const line = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal").setFontSize(bold ? 12 : 10);
    doc.setTextColor(bold ? palette.primary[0] : 70, bold ? palette.primary[1] : 70, bold ? palette.primary[2] : 70);
    doc.text(label, labelX, y, { align: "right" });
    doc.setTextColor(...((bold ? palette.ink : [70, 70, 70]) as [number, number, number]));
    doc.text(value, valX, y, { align: "right" });
    y += bold ? 22 : 15;
  };

  line("Subtotal (Taxable)", formatInrPdf(Number(o.amount_inr)));
  if (isIntraState) {
    line(`CGST (${(gstPct / 2).toFixed(1)}%)`, formatInrPdf(gstAmt / 2));
    line(`SGST (${(gstPct / 2).toFixed(1)}%)`, formatInrPdf(gstAmt / 2));
  } else {
    line(`IGST (${gstPct}%)`, formatInrPdf(gstAmt));
  }
  if (Number(o.wallet_applied_inr ?? 0) > 0) line("Wallet applied", `- ${formatInrPdf(Number(o.wallet_applied_inr))}`);
  if (o.coupon_code) line(`Coupon (${o.coupon_code})`, "Applied");

  y += 6;
  doc.setDrawColor(...palette.primary);
  doc.setLineWidth(1.2);
  doc.line(labelX - 20, y, valX, y);
  y += 20;
  doc.setFillColor(...palette.soft);
  doc.roundedRect(labelX - 30, y - 16, valX - labelX + 42, 32, 4, 4, "F");
  line("TOTAL PAYABLE", formatInrPdf(Number(o.total_inr)), true);

  // Amount in words
  y += 6;
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...palette.primary);
  doc.text("AMOUNT IN WORDS", M, y);
  y += 12;
  doc.setFont("helvetica", "italic").setFontSize(10).setTextColor(...palette.ink);
  const wordLines = doc.splitTextToSize(numberToWordsInr(Number(o.total_inr)), W - 2 * M);
  doc.text(wordLines, M, y);
  y += 12 * wordLines.length + 14;

  // Bank details + Terms side by side
  const colW = (W - 2 * M - 16) / 2;
  const boxTop = y;
  doc.setFillColor(...palette.soft);
  doc.roundedRect(M, boxTop, colW, 110, 6, 6, "F");
  doc.roundedRect(M + colW + 16, boxTop, colW, 110, 6, 6, "F");

  // Bank
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...palette.primary);
  doc.text("BANK DETAILS", M + 12, boxTop + 16);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...palette.ink);
  let bky = boxTop + 30;
  const bkLine = (k: string, v: string) => {
    doc.setFont("helvetica", "normal").setTextColor(...palette.muted).setFontSize(8);
    doc.text(k, M + 12, bky);
    doc.setFont("helvetica", "bold").setTextColor(...palette.ink).setFontSize(9);
    doc.text(v, M + 90, bky);
    bky += 12;
  };
  bkLine("Bank", SELLER.bank.name);
  bkLine("A/C Name", SELLER.bank.account_name);
  bkLine("A/C No.", SELLER.bank.account_number);
  bkLine("IFSC", SELLER.bank.ifsc);
  bkLine("Branch", SELLER.bank.branch);
  bkLine("UPI", SELLER.bank.upi);

  // Terms
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...palette.primary);
  doc.text("TERMS & CONDITIONS", M + colW + 16 + 12, boxTop + 16);
  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...palette.ink);
  let ty = boxTop + 30;
  SELLER.terms.forEach((t, i) => {
    const wrapped = doc.splitTextToSize(`${i + 1}. ${t}`, colW - 24);
    doc.text(wrapped, M + colW + 16 + 12, ty);
    ty += 10 * wrapped.length + 2;
  });

  y = boxTop + 110 + 16;

  // Notes
  if (o.notes) {
    doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...palette.primary);
    doc.text("NOTES", M, y); y += 12;
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...palette.ink);
    const nl = doc.splitTextToSize(o.notes, W - 2 * M);
    doc.text(nl, M, y);
    y += 11 * nl.length + 8;
  }

  // Signature
  const sigY = Math.min(y + 20, H - 90);
  doc.setDrawColor(180);
  doc.setLineWidth(0.5);
  doc.line(W - M - 160, sigY, W - M, sigY);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...palette.muted);
  doc.text("Authorised Signatory", W - M - 80, sigY + 12, { align: "center" });
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...palette.ink);
  doc.text(`for ${SELLER.name}`, W - M - 80, sigY + 24, { align: "center" });

  // Footer
  const footerY = H - 60;
  doc.setDrawColor(230);
  doc.setLineWidth(0.5);
  doc.line(M, footerY, W - M, footerY);
  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...palette.muted);
  doc.text(`PAN: ${SELLER.pan}   ·   GSTIN: ${SELLER.gstin}   ·   ${SELLER.state} (${SELLER.state_code})`, M, footerY + 14);
  doc.text("This is a computer generated invoice.", M, footerY + 26);
  doc.setTextColor(...palette.primary).setFont("helvetica", "bold");
  doc.text(SELLER.website, W - M, footerY + 26, { align: "right" });

  try {
    const blob = doc.output("blob");
    downloadBlob(blob, `${invoiceFileBase(o)}.pdf`);
  } catch {
    doc.save(`${invoiceFileBase(o)}.pdf`);
  }
}

