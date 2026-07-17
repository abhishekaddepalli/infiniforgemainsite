import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { Ft as Info, M as Smartphone, On as CircleCheck, Y as Rocket, fn as Download, j as Sparkles, mt as MonitorSmartphone, n as Zap, ut as Palette, zt as Image } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CfEwGGLW.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.pwa-DJ6ktwh5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULTS = {
	name: "Infiniforge Technologies",
	short_name: "Infiniforge",
	description: "India's unified enterprise platform for SaaS, IT, hosting & AI automation.",
	theme_color: "#FF9933",
	background_color: "#0F172A",
	display: "standalone",
	orientation: "portrait",
	start_url: "/",
	icon_url: "/pwa-512.png",
	install_prompt_enabled: true,
	install_prompt_text: "Install the app for a faster, app-like experience."
};
function PwaSettingsPage() {
	const qc = useQueryClient();
	const [cfg, setCfg] = (0, import_react.useState)(DEFAULTS);
	const { data, isLoading } = useQuery({
		queryKey: ["pwa-config"],
		queryFn: async () => {
			const { data } = await supabase.from("module_records").select("id, metadata").eq("module", "pwa_settings").eq("title", "config").maybeSingle();
			return data;
		}
	});
	(0, import_react.useEffect)(() => {
		if (data?.metadata) setCfg({
			...DEFAULTS,
			...data.metadata
		});
	}, [data]);
	const save = useMutation({
		mutationFn: async () => {
			if (data?.id) {
				const { error } = await supabase.from("module_records").update({ metadata: cfg }).eq("id", data.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("module_records").insert({
					module: "pwa_settings",
					title: "config",
					status: "published",
					metadata: cfg
				});
				if (error) throw error;
			}
		},
		onSuccess: () => {
			toast.success("PWA settings saved. Reload the app to see changes.");
			qc.invalidateQueries({ queryKey: ["pwa-config"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const set = (k, v) => setCfg((c) => ({
		...c,
		[k]: v
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Progressive Web App",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 lg:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col lg:flex-row lg:items-center gap-4 justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Progressive Web App"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-2xl lg:text-3xl font-bold",
								children: "Installable App Experience"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground max-w-2xl",
								children: "Let customers install Infiniforge to their home screen with your branding, colors, and icon. Delivers an app-like experience on Android, iOS, and desktop."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border bg-card/60 backdrop-blur px-3 py-2 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-primary font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Home-screen install"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border bg-card/60 backdrop-blur px-3 py-2 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-primary font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Splash & theme"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border bg-card/60 backdrop-blur px-3 py-2 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-primary font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Custom icon"]
									})
								})
							]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-primary" }), " App identity"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Names shown under the installed app icon and in the install prompt." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: cfg.name,
										onChange: (e) => set("name", e.target.value),
										maxLength: 45
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Short name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground text-xs",
										children: "(home screen)"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: cfg.short_name,
										onChange: (e) => set("short_name", e.target.value),
										maxLength: 12
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: cfg.description,
									onChange: (e) => set("description", e.target.value),
									maxLength: 200
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Start URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: cfg.start_url,
										onChange: (e) => set("start_url", e.target.value),
										placeholder: "/"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Orientation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
										value: cfg.orientation,
										onChange: (e) => set("orientation", e.target.value),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "any",
												children: "Any"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "portrait",
												children: "Portrait"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "landscape",
												children: "Landscape"
											})
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Display mode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2",
									children: [
										"standalone",
										"fullscreen",
										"minimal-ui",
										"browser"
									].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => set("display", m),
										className: `rounded-lg border px-3 py-2 text-xs font-medium capitalize transition ${cfg.display === m ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`,
										children: m.replace("-", " ")
									}, m))
								})] })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-4 w-4 text-primary" }), " Branding & colors"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Theme color paints the status bar; background shows during launch splash." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Theme color" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1.5 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "color",
										className: "h-10 w-16 rounded-md border border-input cursor-pointer",
										value: cfg.theme_color,
										onChange: (e) => set("theme_color", e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: cfg.theme_color,
										onChange: (e) => set("theme_color", e.target.value)
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Background color" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1.5 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "color",
										className: "h-10 w-16 rounded-md border border-input cursor-pointer",
										value: cfg.background_color,
										onChange: (e) => set("background_color", e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: cfg.background_color,
										onChange: (e) => set("background_color", e.target.value)
									})]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" }), " App icon URL (512×512 recommended)"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-4 rounded-xl border border-dashed border-border p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: cfg.icon_url,
									alt: "Icon preview",
									width: 72,
									height: 72,
									className: "h-18 w-18 rounded-xl shadow-md ring-1 ring-border object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: cfg.icon_url,
										onChange: (e) => set("icon_url", e.target.value),
										placeholder: "/pwa-512.png or https://…"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Use the default ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												className: "text-primary",
												children: "/pwa-512.png"
											}),
											" or paste any public image URL."
										]
									})]
								})]
							})] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 text-primary" }), " Install prompt"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Floating card shown to eligible visitors inviting them to install." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg border border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: "Show install prompt"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Disable to hide the on-site install banner."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: cfg.install_prompt_enabled,
									onCheckedChange: (v) => set("install_prompt_enabled", v)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Prompt message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: cfg.install_prompt_text,
								onChange: (e) => set("install_prompt_text", e.target.value),
								maxLength: 140
							})] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => save.mutate(),
								disabled: save.isPending || isLoading,
								className: "bg-gradient-brand text-white shadow-md",
								size: "lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "h-4 w-4 mr-2" }), save.isPending ? "Saving…" : "Save PWA settings"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "lg",
								onClick: () => setCfg(DEFAULTS),
								children: "Reset to defaults"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "flex items-center gap-2 text-base",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorSmartphone, { className: "h-4 w-4 text-primary" }), " Live preview"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Install prompt & splash" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative overflow-hidden rounded-2xl p-4 shadow-lg",
									style: { background: `linear-gradient(135deg, ${cfg.theme_color}, ${cfg.background_color})` },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: cfg.icon_url,
											alt: "Preview",
											width: 48,
											height: 48,
											className: "h-12 w-12 rounded-xl ring-2 ring-white/30"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] uppercase tracking-wider text-white/80 font-semibold",
													children: "Install App"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-sm font-bold text-white truncate",
													children: cfg.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-white/85 line-clamp-2 mt-0.5",
													children: cfg.install_prompt_text
												})
											]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border p-4",
									style: { background: cfg.background_color },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: cfg.icon_url,
											alt: "Home preview",
											width: 64,
											height: 64,
											className: "mx-auto h-16 w-16 rounded-2xl shadow-2xl"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 text-xs font-medium text-white truncate",
											children: cfg.short_name
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg p-3 text-center",
										style: { background: cfg.theme_color },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase text-white/80 font-semibold",
											children: "Theme"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-white font-mono",
											children: cfg.theme_color
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg p-3 text-center border border-border",
										style: { background: cfg.background_color },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase text-white/80 font-semibold",
											children: "Splash"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-white font-mono",
											children: cfg.background_color
										})]
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-primary" }), " Install tips"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3.5 w-3.5 text-primary shrink-0 mt-0.5" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Android/Chrome:" }), " auto-detects install eligibility and shows the branded card."] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3.5 w-3.5 text-primary shrink-0 mt-0.5" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "iOS Safari:" }), " users tap Share → Add to Home Screen."] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3.5 w-3.5 text-primary shrink-0 mt-0.5" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Desktop:" }), " install icon appears in the browser address bar."] })
								]
							})
						]
					})] })]
				})]
			})]
		})
	});
}
//#endregion
export { PwaSettingsPage as component };
