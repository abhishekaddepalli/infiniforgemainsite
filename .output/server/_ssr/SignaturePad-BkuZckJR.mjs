import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { Nn as Check, ln as Eraser } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SignaturePad-BkuZckJR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignaturePad({ value, onChange, label = "Draw signature", height = 140 }) {
	const canvasRef = (0, import_react.useRef)(null);
	const drawingRef = (0, import_react.useRef)(false);
	const [hasInk, setHasInk] = (0, import_react.useState)(!!value);
	(0, import_react.useEffect)(() => {
		const c = canvasRef.current;
		if (!c) return;
		const ctx = c.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, c.width, c.height);
		if (value) {
			const img = new Image();
			img.onload = () => ctx.drawImage(img, 0, 0, c.width, c.height);
			img.src = value;
			setHasInk(true);
		}
	}, [value]);
	function pos(e) {
		const c = canvasRef.current;
		const rect = c.getBoundingClientRect();
		return {
			x: (e.clientX - rect.left) / rect.width * c.width,
			y: (e.clientY - rect.top) / rect.height * c.height
		};
	}
	function start(e) {
		const c = canvasRef.current;
		e.target.setPointerCapture(e.pointerId);
		const ctx = c.getContext("2d");
		const p = pos(e);
		ctx.strokeStyle = "#0f172a";
		ctx.lineWidth = 2.2;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		drawingRef.current = true;
	}
	function move(e) {
		if (!drawingRef.current) return;
		const ctx = canvasRef.current.getContext("2d");
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
		const c = canvasRef.current;
		const ctx = c.getContext("2d");
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, c.width, c.height);
		setHasInk(false);
		onChange(null);
	}
	function save() {
		if (!hasInk) return;
		onChange(canvasRef.current.toDataURL("image/png"));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-white overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					width: 600,
					height,
					className: "w-full touch-none cursor-crosshair",
					style: { height },
					onPointerDown: start,
					onPointerMove: move,
					onPointerUp: end,
					onPointerLeave: end
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: clear,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "h-3.5 w-3.5 mr-1.5" }), " Clear"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					size: "sm",
					onClick: save,
					disabled: !hasInk,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 mr-1.5" }), " Save signature"]
				})]
			})
		]
	});
}
//#endregion
export { SignaturePad as t };
