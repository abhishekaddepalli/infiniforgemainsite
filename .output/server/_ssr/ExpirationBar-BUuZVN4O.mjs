import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
import { It as Infinity$1, Sn as Clock, Xn as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as MembershipBadge } from "./MembershipBadge-vyy4IIJ-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ExpirationBar-BUuZVN4O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function pad(n) {
	return String(n).padStart(2, "0");
}
function ExpirationBar({ membership, compact = false }) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(id);
	}, []);
	if (!membership) return null;
	const isLifetime = !membership.expires_at;
	const start = new Date(membership.starts_at).getTime();
	const end = membership.expires_at ? new Date(membership.expires_at).getTime() : 0;
	const total = Math.max(1, end - start);
	const remaining = Math.max(0, end - now);
	const pct = isLifetime ? 100 : Math.max(0, Math.min(100, remaining / total * 100));
	const { color, glow } = (0, import_react.useMemo)(() => {
		if (isLifetime) return {
			color: "from-emerald-400 via-teal-400 to-cyan-400",
			glow: "shadow-[0_0_24px_rgba(16,185,129,0.35)]"
		};
		if (pct > 50) return {
			color: "from-emerald-400 via-emerald-500 to-teal-500",
			glow: "shadow-[0_0_20px_rgba(16,185,129,0.35)]"
		};
		if (pct > 20) return {
			color: "from-amber-400 via-orange-500 to-amber-600",
			glow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]"
		};
		return {
			color: "from-red-500 via-rose-500 to-red-600",
			glow: "shadow-[0_0_24px_rgba(239,68,68,0.5)]"
		};
	}, [pct, isLifetime]);
	const d = Math.floor(remaining / 864e5);
	const h = Math.floor(remaining % 864e5 / 36e5);
	const m = Math.floor(remaining % 36e5 / 6e4);
	const s = Math.floor(remaining % 6e4 / 1e3);
	const urgent = !isLifetime && pct < 20;
	const expired = !isLifetime && remaining <= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-secondary/40", "border-border/70 backdrop-blur", compact ? "p-3" : "p-4 sm:p-5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembershipBadge, {
						slug: membership.tier.slug,
						name: membership.tier.name,
						gradientFrom: membership.tier.gradient_from,
						gradientTo: membership.tier.gradient_to,
						size: compact ? "md" : "lg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), expired ? "Expired" : isLifetime ? "Lifetime access" : "Time remaining"]
						}), isLifetime ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-base font-bold flex items-center gap-1.5 text-emerald-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, { className: "h-4 w-4" }), " Never expires"]
						}) : expired ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base font-bold text-red-500",
							children: "Membership ended"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("font-mono text-base sm:text-lg font-bold tabular-nums", urgent && "text-red-500 animate-pulse"),
							children: [
								d,
								"d ",
								pad(h),
								"h ",
								pad(m),
								"m ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground text-sm",
									children: [pad(s), "s"]
								})
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/portal/membership",
					className: cn("text-xs font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-full", "bg-primary text-primary-foreground hover:opacity-90 transition"),
					children: [expired || membership.tier.slug === "free" ? "Upgrade" : "Manage", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
				})]
			}),
			!isLifetime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-2.5 w-full rounded-full bg-secondary overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-1000 ease-out", color, glow),
					style: { width: `${pct}%` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center justify-between text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Started ", new Date(membership.starts_at).toLocaleDateString()] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn(urgent && "text-red-500 font-semibold"),
					children: ["Expires ", new Date(membership.expires_at).toLocaleString()]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }` })
		]
	});
}
//#endregion
export { ExpirationBar as t };
