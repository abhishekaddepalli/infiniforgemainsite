import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Bt as Heart, F as ShoppingCart, Gn as Bell, Rt as Inbox, S as Ticket, W as ScrollText, _t as MessageCircle, cn as ExternalLink, j as Sparkles, o as Wallet, p as UserCog, wt as LogIn } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, t as DropdownMenu } from "./dropdown-menu-CDoe66ii.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/NotificationBell-BCzh6Rtq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BrandFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative mt-10 mx-4 lg:mx-8 mb-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#0b1220] via-[#111827] to-[#0b1220] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)]",
		"aria-label": "Application footer",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-[#ff9933]/25 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-[#138808]/25 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_60%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 px-6 py-5 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ff9933] to-[#138808] shadow-lg shadow-[#ff9933]/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-white" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm md:text-base font-semibold tracking-wide text-white",
							children: [
								"Powered by",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-gradient-to-r from-[#ffb266] via-[#ffffff] to-[#7bd67b] bg-clip-text text-transparent font-bold",
									children: "Infiniforge Technologies"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden md:inline h-4 w-px bg-white/20" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs md:text-sm text-white/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Developed with" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-3.5 w-3.5 fill-[#ff4d6d] text-[#ff4d6d] animate-pulse" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"by",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold bg-gradient-to-r from-[#ff9933] to-[#ffd699] bg-clip-text text-transparent",
									children: "Abhishek Addepalli"
								})
							] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative px-6 py-2 text-center text-[10px] uppercase tracking-[0.3em] text-white/40",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Infiniforge Technologies · All rights reserved"
				]
			})
		]
	});
}
var ctx = null;
function getCtx() {
	if (typeof window === "undefined") return null;
	try {
		if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
		if (ctx.state === "suspended") ctx.resume().catch(() => {});
		return ctx;
	} catch {
		return null;
	}
}
function playAlertTone() {
	const ac = getCtx();
	if (!ac) return;
	const now = ac.currentTime;
	[880, 1320].forEach((freq, i) => {
		const osc = ac.createOscillator();
		const gain = ac.createGain();
		osc.type = "sine";
		osc.frequency.value = freq;
		const start = now + i * .18;
		const dur = .22;
		gain.gain.setValueAtTime(1e-4, start);
		gain.gain.exponentialRampToValueAtTime(.28, start + .03);
		gain.gain.exponentialRampToValueAtTime(1e-4, start + dur);
		osc.connect(gain).connect(ac.destination);
		osc.start(start);
		osc.stop(start + dur + .02);
	});
}
var MAX = 30;
function mapRow(r) {
	return {
		id: r.id,
		kind: r.kind || "system",
		title: r.title,
		subtitle: r.body ?? void 0,
		href: r.href || "/portal",
		at: r.created_at,
		read: Boolean(r.read_at)
	};
}
function NotificationBell() {
	const { user, isStaff } = useAuth();
	const [items, setItems] = (0, import_react.useState)([]);
	const bootRef = (0, import_react.useRef)(true);
	const push = (n) => {
		setItems((prev) => {
			if (prev.some((p) => p.id === n.id)) return prev;
			return [n, ...prev].slice(0, MAX);
		});
		if (!bootRef.current) {
			playAlertTone();
			toast(n.title, { description: n.subtitle });
		}
	};
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => {
			bootRef.current = false;
		}, 1500);
		return () => clearTimeout(t);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setItems([]);
			return;
		}
		let alive = true;
		async function loadNotifications() {
			let q = supabase.from("notifications").select("id,kind,title,body,href,created_at,read_at").order("created_at", { ascending: false }).limit(MAX);
			q = isStaff ? q.eq("audience", "staff") : q.eq("audience", "user").eq("user_id", user.id);
			const { data } = await q;
			if (alive) setItems((data ?? []).map(mapRow));
		}
		loadNotifications();
		const channel = supabase.channel(`app-notifications-${isStaff ? "staff" : user.id}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "notifications",
			filter: isStaff ? "audience=eq.staff" : `user_id=eq.${user.id}`
		}, (payload) => {
			push(mapRow(payload.new));
		}).subscribe();
		return () => {
			alive = false;
			supabase.removeChannel(channel);
		};
	}, [user, isStaff]);
	const unread = items.filter((i) => !i.read).length;
	const markAllRead = () => {
		setItems((prev) => {
			return prev.map((p) => ({
				...p,
				read: true
			}));
		});
		const ids = items.filter((i) => !i.read).map((i) => i.id);
		if (ids.length) supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).in("id", ids);
	};
	const clearAll = () => markAllRead();
	const iconFor = (k) => k === "whatsapp" ? MessageCircle : k === "order" ? ShoppingCart : k === "contact" ? Inbox : k === "login" ? LogIn : k === "wallet" ? Wallet : k === "profile" ? UserCog : k === "audit" ? ScrollText : Ticket;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
		onOpenChange: (o) => {
			if (o) markAllRead();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "icon",
				variant: "ghost",
				className: "relative",
				"aria-label": "Notifications",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-background",
					children: unread > 9 ? "9+" : unread
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "end",
			className: "w-96 max-h-[70vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-2 py-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
						className: "p-0",
						children: "Notifications"
					}), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "text-[11px] text-muted-foreground hover:text-foreground",
						onClick: clearAll,
						children: "Mark read"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
				items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 text-center text-xs text-muted-foreground",
					children: "You're all caught up. New orders and tickets will show up here in real time."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-1",
					children: items.map((n) => {
						const Icon = iconFor(n.kind);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.href,
							className: "flex gap-3 items-start px-3 py-2 hover:bg-muted/60 transition",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-semibold truncate",
												children: n.title
											}), !n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "h-4 px-1 text-[9px]",
												children: "new"
											})]
										}),
										n.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground truncate",
											children: n.subtitle
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: new Date(n.at).toLocaleString()
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 text-muted-foreground mt-1" })
							]
						}, n.id);
					})
				})
			]
		})]
	});
}
//#endregion
export { NotificationBell as n, playAlertTone as r, BrandFooter as t };
