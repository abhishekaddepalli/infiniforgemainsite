import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { H as Send, On as CircleCheck, R as ShieldCheck, Sn as Clock, _t as MessageCircle, j as Sparkles, n as Zap, xt as MapPin } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { a as useCms, n as CmsIcon } from "./cms-BQLw1hye.mjs";
import { i as formatContactEnquiryMessage, o as getWhatsAppConfig, r as buildWhatsAppLink } from "./whatsapp-Bfedub3g.mjs";
import { t as SiteLayout } from "./SiteLayout-CrNCfqpS.mjs";
import { t as Reveal } from "./Reveal-CUxnlK3o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BY23t7wc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REASONS = [
	{
		icon: Clock,
		title: "Reply in 4 business hours",
		desc: "Real engineers respond — not a bot queue."
	},
	{
		icon: ShieldCheck,
		title: "GST-invoiced quotes",
		desc: "Signed SLA and DPA on every engagement."
	},
	{
		icon: Zap,
		title: "Scoped in one call",
		desc: "20-minute discovery → fixed price & timeline."
	}
];
function ContactPage() {
	const page = useCms("contact_page");
	const [sent, setSent] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		company: "",
		interest: "Book a demo",
		message: ""
	});
	const wa = getWhatsAppConfig();
	const [lastRef, setLastRef] = (0, import_react.useState)("");
	const [waLink, setWaLink] = (0, import_react.useState)("");
	function makeRef() {
		const d = /* @__PURE__ */ new Date();
		return `IF-${`${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
	}
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const reference = makeRef();
			const { error } = await supabase.from("module_records").insert({
				module: "contact_submissions",
				title: form.name || form.email || "Enquiry",
				status: "new",
				metadata: {
					...form,
					reference,
					recipient: page.form_recipient_email
				}
			});
			if (error) throw error;
			setLastRef(reference);
			if (wa.wa_ordering_enabled && wa.wa_ordering_number) {
				const msg = formatContactEnquiryMessage(form, reference);
				const link = buildWhatsAppLink(wa.wa_ordering_number, msg);
				setWaLink(link);
				window.open(link, "_blank", "noopener,noreferrer");
			} else setWaLink("");
			setSent(true);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to send message");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative bg-gradient-hero overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-hero-blob" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-hero-blob",
				style: { animationDelay: "-5s" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "rounded-full border-primary/30 bg-primary/10 text-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 mr-1.5" }),
							" ",
							page.eyebrow
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 100,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.05]",
							children: [
								page.title.split(" ").slice(0, -2).join(" "),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient-brand animate-gradient bg-clip-text",
									children: page.title.split(" ").slice(-2).join(" ")
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 200,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed",
							children: page.subtitle
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: 280,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground",
							children: REASONS.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-6 w-6 rounded-full bg-accent/15 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r.icon, { className: "h-3 w-3 text-accent" })
								}), r.title]
							}, i))
						})
					})
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-5 gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "lg:col-span-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative rounded-3xl overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -inset-px rounded-3xl bg-gradient-brand opacity-30 blur-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative rounded-3xl border border-border bg-card p-8 lg:p-10 shadow-elegant",
						children: sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-16 animate-reveal-up",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center animate-glow-pulse",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8 text-accent" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-5 text-2xl font-bold",
									children: "Message received"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-muted-foreground",
									children: page.form_success_message
								}),
								lastRef && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: ["Reference: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: lastRef
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap justify-center gap-3",
									children: [waLink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										className: "bg-[#25D366] hover:bg-[#1ebe57] text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: waLink,
											target: "_blank",
											rel: "noopener noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "mr-2 h-4 w-4" }), " Continue on WhatsApp"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => {
											setSent(false);
											setWaLink("");
											setLastRef("");
											setForm({
												name: "",
												email: "",
												phone: "",
												company: "",
												interest: "Book a demo",
												message: ""
											});
										},
										children: "Send another"
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: submit,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-accent animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
										children: "Sales · online now"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Full name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											value: form.name,
											onChange: (e) => setForm({
												...form,
												name: e.target.value
											}),
											placeholder: "Arjun Sharma"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Work email",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											type: "email",
											value: form.email,
											onChange: (e) => setForm({
												...form,
												email: e.target.value
											}),
											placeholder: "arjun@company.in"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Phone (with +91)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											value: form.phone,
											onChange: (e) => setForm({
												...form,
												phone: e.target.value
											}),
											placeholder: "+91 98765 43210"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Company",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.company,
											onChange: (e) => setForm({
												...form,
												company: e.target.value
											}),
											placeholder: "Company Pvt. Ltd."
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "What are you interested in?",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: [
											"Book a demo",
											"Website / App",
											"Hosting / VPS",
											"CCTV / Network",
											"AI automation",
											"AMC / Support"
										].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setForm({
												...form,
												interest: opt
											}),
											className: cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all", form.interest === opt ? "bg-gradient-brand text-white border-transparent shadow-elegant" : "border-border bg-background hover:border-primary/40 hover:text-primary"),
											children: opt
										}, opt))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Message",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 5,
										value: form.message,
										onChange: (e) => setForm({
											...form,
											message: e.target.value
										}),
										placeholder: "Tell us about your project, timelines and budget…"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										disabled: busy,
										className: "h-12 bg-gradient-brand text-white px-8 group",
										children: [busy ? "Sending…" : page.form_submit_label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
									}), wa.wa_ordering_enabled && wa.wa_ordering_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										className: "h-12 px-6 border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10",
										onClick: () => {
											const msg = formatContactEnquiryMessage(form, makeRef());
											window.open(buildWhatsAppLink(wa.wa_ordering_number, msg), "_blank", "noopener,noreferrer");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "mr-2 h-4 w-4 text-[#25D366]" }), " Send via WhatsApp"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Submitting also opens WhatsApp with your enquiry pre-filled for instant response."
								})
							]
						})
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 space-y-4",
				children: [page.cards.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: i * 90,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative rounded-2xl border border-border bg-card p-5 shadow-card flex gap-4 items-start overflow-hidden transition-all hover:-translate-y-1 hover:shadow-elegant",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity", c.accent ? "bg-gradient-green" : "bg-gradient-brand") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("relative h-11 w-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-elegant transition-transform group-hover:scale-110 group-hover:rotate-3", c.accent ? "bg-gradient-green" : "bg-gradient-brand"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsIcon, {
									name: c.icon,
									className: "h-5 w-5"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: c.title
								}), c.lines.map((l, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: l
								}, l + j))]
							})
						]
					})
				}, c.title + i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: page.cards.length * 90,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-2xl bg-gradient-dashboard p-6 text-white shadow-elegant",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-brand opacity-40 blur-3xl animate-hero-blob" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs uppercase tracking-widest text-white/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), " Serving pan-India"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 grid grid-cols-3 gap-2 text-xs",
									children: [
										"Mumbai",
										"Delhi",
										"Bengaluru",
										"Hyderabad",
										"Pune",
										"Chennai",
										"Ahmedabad",
										"Kolkata",
										"Jaipur"
									].map((city) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-white/10 border border-white/10 px-2 py-1 text-center backdrop-blur",
										children: city
									}, city))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-xs text-white/70 leading-relaxed",
									children: "On-site support engineers available across 40+ Indian cities. Remote NOC operates 24×7."
								})
							]
						})]
					})
				})]
			})]
		})
	})] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-sm",
			children: label
		}), children]
	});
}
//#endregion
export { ContactPage as component };
