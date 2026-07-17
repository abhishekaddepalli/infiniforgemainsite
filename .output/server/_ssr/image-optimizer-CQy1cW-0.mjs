//#region node_modules/.nitro/vite/services/ssr/assets/image-optimizer-CQy1cW-0.js
async function optimizeImage(input, opts = {}, onPhase) {
	const { maxDimension = 1920, quality = .85, mimeType = "image/webp" } = opts;
	if (input.type === "image/gif") {
		onPhase?.({
			phase: "done",
			progress: 100
		});
		return {
			file: input,
			originalBytes: input.size,
			outputBytes: input.size,
			savedPct: 0,
			width: 0,
			height: 0,
			converted: false
		};
	}
	onPhase?.({
		phase: "decode",
		progress: 10
	});
	const bitmap = await createBitmap(input);
	onPhase?.({
		phase: "decode",
		progress: 50
	});
	const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
	const w = Math.max(1, Math.round(bitmap.width * scale));
	const h = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(w, h) : Object.assign(document.createElement("canvas"), {
		width: w,
		height: h
	});
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.drawImage(bitmap, 0, 0, w, h);
	bitmap.close?.();
	onPhase?.({
		phase: "encode",
		progress: 60
	});
	const blob = await encode(canvas, mimeType, quality);
	onPhase?.({
		phase: "encode",
		progress: 95
	});
	if (!blob || blob.size >= input.size) {
		onPhase?.({
			phase: "done",
			progress: 100
		});
		return {
			file: input,
			originalBytes: input.size,
			outputBytes: input.size,
			savedPct: 0,
			width: w,
			height: h,
			converted: false
		};
	}
	const base = input.name.replace(/\.[^.]+$/, "");
	const optimized = new File([blob], `${base}.${mimeType === "image/webp" ? "webp" : "jpg"}`, {
		type: mimeType,
		lastModified: Date.now()
	});
	const savedPct = Math.round((input.size - blob.size) / input.size * 100);
	onPhase?.({
		phase: "done",
		progress: 100
	});
	return {
		file: optimized,
		originalBytes: input.size,
		outputBytes: blob.size,
		savedPct,
		width: w,
		height: h,
		converted: true
	};
}
async function createBitmap(file) {
	if (typeof createImageBitmap === "function") try {
		return await createImageBitmap(file);
	} catch {}
	return await new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Could not decode image."));
		};
		img.src = url;
	});
}
function encode(canvas, type, quality) {
	if (canvas instanceof OffscreenCanvas) return canvas.convertToBlob({
		type,
		quality
	}).catch(() => null);
	return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
//#endregion
export { optimizeImage as n, formatBytes as t };
