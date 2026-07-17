//#region node_modules/.nitro/vite/services/ssr/assets/download-DhKjMGgD.js
function downloadBlob(blob, filename) {
	try {
		const nav = navigator;
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
		try {
			const url = URL.createObjectURL(blob);
			window.open(url, "_blank", "noopener,noreferrer");
		} catch {
			console.error("downloadBlob failed", err);
		}
	}
}
function downloadCsv(rows, filename) {
	const csv = rows.map((r) => r.map((v) => {
		return `"${(v == null ? "" : String(v)).replace(/"/g, "\"\"")}"`;
	}).join(",")).join("\n");
	downloadBlob(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }), filename);
}
//#endregion
export { downloadCsv as n, downloadBlob as t };
