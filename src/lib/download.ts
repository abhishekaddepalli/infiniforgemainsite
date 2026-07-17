// Robust file download helpers. Anchors are appended to the DOM before
// click() because some browsers (notably Firefox) ignore programmatic clicks
// on unattached anchors. Object URLs are revoked on the next tick so the
// download has time to initiate before revocation.

export function downloadBlob(blob: Blob, filename: string) {
  try {
    // IE / legacy Edge
    const nav = navigator as unknown as { msSaveOrOpenBlob?: (b: Blob, n: string) => void };
    if (typeof nav.msSaveOrOpenBlob === "function") {
      nav.msSaveOrOpenBlob(blob, filename);
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 250);
  } catch (err) {
    // Last-resort fallback: open in a new tab so the user can still save it
    try {
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      console.error("downloadBlob failed", err);
    }
  }
}

export function downloadCsv(rows: (string | number | null | undefined)[][], filename: string) {
  const csv = rows
    .map((r) =>
      r
        .map((v) => {
          const s = v == null ? "" : String(v);
          return `"${s.replace(/"/g, '""')}"`;
        })
        .join(","),
    )
    .join("\n");
  // BOM makes Excel treat as UTF-8
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}

