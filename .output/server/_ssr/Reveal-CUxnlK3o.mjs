import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Reveal-CUxnlK3o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Reveal({ children, as: Tag = "div", className, delay = 0, once = true }) {
	const ref = (0, import_react.useRef)(null);
	const [shown, setShown] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		if (typeof IntersectionObserver === "undefined") {
			setShown(true);
			return;
		}
		const io = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					setShown(true);
					if (once) io.disconnect();
				} else if (!once) setShown(false);
			});
		}, {
			threshold: .12,
			rootMargin: "0px 0px -40px 0px"
		});
		io.observe(el);
		return () => io.disconnect();
	}, [once]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		className: cn("reveal", shown && "reveal-visible", className),
		style: delay ? { transitionDelay: `${delay}ms` } : void 0,
		children
	});
}
//#endregion
export { Reveal as t };
