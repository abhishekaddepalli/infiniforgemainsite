import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Check } from "lucide-react";

export function SignaturePad({
  value,
  onChange,
  label = "Draw signature",
  height = 140,
}: {
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  label?: string;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasInk, setHasInk] = useState<boolean>(!!value);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    // Load existing signature
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, c.width, c.height);
      img.src = value;
      setHasInk(true);
    }
  }, [value]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * c.width, y: ((e.clientY - rect.top) / rect.height) * c.height };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    (e.target as Element).setPointerCapture(e.pointerId);
    const ctx = c.getContext("2d")!;
    const p = pos(e);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    drawingRef.current = true;
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  function end() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setHasInk(true);
  }
  function clear() {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    setHasInk(false);
    onChange(null);
  }
  function save() {
    if (!hasInk) return;
    const url = canvasRef.current!.toDataURL("image/png");
    onChange(url);
  }

  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={height}
          className="w-full touch-none cursor-crosshair"
          style={{ height }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={clear}>
          <Eraser className="h-3.5 w-3.5 mr-1.5" /> Clear
        </Button>
        <Button type="button" size="sm" onClick={save} disabled={!hasInk}>
          <Check className="h-3.5 w-3.5 mr-1.5" /> Save signature
        </Button>
      </div>
    </div>
  );
}
