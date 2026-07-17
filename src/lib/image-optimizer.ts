// Client-side image optimizer: downscales oversized images and re-encodes to
// WebP with a canvas. Keeps the original format if WebP encoding fails or
// somehow produces a larger file. Runs before upload so we only pay to
// transfer/store the smaller variant. Emits progress via onPhase().

export type OptimizePhase =
  | { phase: "decode"; progress: number }
  | { phase: "encode"; progress: number }
  | { phase: "done"; progress: 100 };

export type OptimizeOptions = {
  maxDimension?: number;   // longest edge in px
  quality?: number;        // 0..1
  mimeType?: "image/webp" | "image/jpeg";
};

export type OptimizeResult = {
  file: File;
  originalBytes: number;
  outputBytes: number;
  savedPct: number;
  width: number;
  height: number;
  converted: boolean;
};

export async function optimizeImage(
  input: File,
  opts: OptimizeOptions = {},
  onPhase?: (p: OptimizePhase) => void,
): Promise<OptimizeResult> {
  const { maxDimension = 1920, quality = 0.85, mimeType = "image/webp" } = opts;

  // Skip GIFs — canvas would drop animation.
  if (input.type === "image/gif") {
    onPhase?.({ phase: "done", progress: 100 });
    return { file: input, originalBytes: input.size, outputBytes: input.size, savedPct: 0, width: 0, height: 0, converted: false };
  }

  onPhase?.({ phase: "decode", progress: 10 });
  const bitmap = await createBitmap(input);
  onPhase?.({ phase: "decode", progress: 50 });

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = typeof OffscreenCanvas !== "undefined"
    ? new OffscreenCanvas(w, h)
    : Object.assign(document.createElement("canvas"), { width: w, height: h });
  const ctx = (canvas as HTMLCanvasElement | OffscreenCanvas).getContext("2d") as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap as unknown as CanvasImageSource, 0, 0, w, h);
  (bitmap as ImageBitmap).close?.();

  onPhase?.({ phase: "encode", progress: 60 });
  const blob = await encode(canvas, mimeType, quality);
  onPhase?.({ phase: "encode", progress: 95 });

  // If encoding produced no gain, fall back to original.
  if (!blob || blob.size >= input.size) {
    onPhase?.({ phase: "done", progress: 100 });
    return { file: input, originalBytes: input.size, outputBytes: input.size, savedPct: 0, width: w, height: h, converted: false };
  }

  const base = input.name.replace(/\.[^.]+$/, "");
  const ext = mimeType === "image/webp" ? "webp" : "jpg";
  const optimized = new File([blob], `${base}.${ext}`, { type: mimeType, lastModified: Date.now() });
  const savedPct = Math.round(((input.size - blob.size) / input.size) * 100);
  onPhase?.({ phase: "done", progress: 100 });
  return { file: optimized, originalBytes: input.size, outputBytes: blob.size, savedPct, width: w, height: h, converted: true };
}

async function createBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try { return await createImageBitmap(file); } catch { /* fall through */ }
  }
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not decode image.")); };
    img.src = url;
  });
}

function encode(canvas: HTMLCanvasElement | OffscreenCanvas, type: string, quality: number): Promise<Blob | null> {
  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type, quality }).catch(() => null);
  }
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
