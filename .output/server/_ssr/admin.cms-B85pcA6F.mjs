import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { G as Save, J as RotateCcw, b as Trash2, cn as ExternalLink, j as Sparkles, rt as Plus, tn as FileText, zt as Image } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { t as logAudit } from "./audit-BROAe_E-.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
import { i as fetchAllSections, n as CmsIcon, o as useSaveCmsSection, t as CMS_DEFAULTS } from "./cms-BQLw1hye.mjs";
import { t as Card } from "./card-CfEwGGLW.mjs";
import { t as Switch } from "./switch-CCza_WcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.cms-B85pcA6F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		key: "branding",
		label: "Branding"
	},
	{
		key: "header",
		label: "Header"
	},
	{
		key: "footer",
		label: "Footer"
	},
	{
		key: "home",
		label: "Home page"
	},
	{
		key: "services_page",
		label: "Services page"
	},
	{
		key: "products_page",
		label: "Products page"
	},
	{
		key: "product_detail",
		label: "Product detail"
	},
	{
		key: "pricing_page",
		label: "Pricing page"
	},
	{
		key: "contact_page",
		label: "Contact page"
	},
	{
		key: "announcements",
		label: "Ticker"
	},
	{
		key: "banners",
		label: "Banner slider"
	},
	{
		key: "deployments_page",
		label: "Deployments"
	},
	{
		key: "hosting_page",
		label: "Hosting page"
	},
	{
		key: "whatsapp",
		label: "WhatsApp ordering"
	},
	{
		key: "legal",
		label: "Legal pages"
	},
	{
		key: "seo",
		label: "SEO"
	}
];
function Page() {
	const { data: all, refetch, isLoading } = useQuery({
		queryKey: ["cms-all"],
		queryFn: fetchAllSections
	});
	const [draft, setDraft] = (0, import_react.useState)({});
	const save = useSaveCmsSection();
	(0, import_react.useEffect)(() => {
		if (!all) return;
		const merged = {};
		Object.keys(CMS_DEFAULTS).forEach((k) => {
			merged[k] = {
				...CMS_DEFAULTS[k],
				...all[k] ?? {}
			};
		});
		setDraft(merged);
	}, [all]);
	function update(key, val) {
		setDraft((d) => ({
			...d,
			[key]: val
		}));
	}
	async function persist(key) {
		const value = draft[key] ?? CMS_DEFAULTS[key];
		try {
			await save.mutateAsync({
				key,
				value
			});
			await logAudit({
				action: "update",
				resource: "site_cms",
				details: { section: key }
			});
			toast.success(`${key} saved & published`);
			refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Save failed");
		}
	}
	function reset(key) {
		update(key, CMS_DEFAULTS[key]);
		toast.info(`${key} reset to defaults (not yet saved)`);
	}
	if (isLoading || !draft.branding) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-sm text-muted-foreground",
		children: "Loading CMS…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-4 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-2xl font-bold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6" }), " Site CMS"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Edit every page, image, icon, plan and content block used by the public website. Changes publish instantly."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/",
						target: "_blank",
						rel: "noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4 mr-1.5" }), " View site"]
					})
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "branding",
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
				className: "flex flex-wrap h-auto",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: t.key,
					children: t.label
				}, t.key))
			}), TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: t.key,
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEditor, {
					sectionKey: t.key,
					value: draft[t.key] ?? CMS_DEFAULTS[t.key],
					onChange: (v) => update(t.key, v),
					onSave: () => persist(t.key),
					onReset: () => reset(t.key),
					saving: save.isPending
				})
			}, t.key))]
		})]
	});
}
function SectionEditor({ sectionKey, value, onChange, onSave, onReset, saving }) {
	const Body = SECTION_FORMS[sectionKey];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			value,
			onChange
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-end gap-2 pt-4 border-t",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onReset,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 mr-1.5" }), " Reset defaults"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onSave,
				disabled: saving,
				className: "bg-gradient-brand text-white",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4 mr-1.5" }),
					" ",
					saving ? "Saving…" : "Save & publish"
				]
			})]
		})]
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: label
			}),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: hint
			})
		]
	});
}
function Grid({ children, cols = 2 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `grid gap-4 ${cols === 1 ? "" : cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`,
		children
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-sm font-semibold text-primary flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }),
				" ",
				title
			]
		}), children]
	});
}
function ImageField({ label, value, onChange, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label,
		hint: hint ?? "Paste any image URL (Unsplash, Cloudinary, your CDN, etc)",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-14 w-14 rounded-lg border border-border bg-secondary/40 flex items-center justify-center overflow-hidden shrink-0",
				children: value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: value,
					alt: "",
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-5 w-5 text-muted-foreground" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value,
				onChange: (e) => onChange(e.target.value),
				placeholder: "https://…"
			})]
		})
	});
}
function ArrayEditor({ items, onChange, factory, render, label, addLabel = "Add item" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => onChange([...items, factory()]),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }),
					" ",
					addLabel
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border p-4 space-y-3 bg-secondary/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: ["#", i + 1]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								disabled: i === 0,
								onClick: () => {
									const next = [...items];
									[next[i - 1], next[i]] = [next[i], next[i - 1]];
									onChange(next);
								},
								children: "↑"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								disabled: i === items.length - 1,
								onClick: () => {
									const next = [...items];
									[next[i + 1], next[i]] = [next[i], next[i + 1]];
									onChange(next);
								},
								children: "↓"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "text-destructive",
								onClick: () => {
									const next = [...items];
									next.splice(i, 1);
									onChange(next);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})
						]
					})]
				}), render(it, i, (patch) => {
					const next = [...items];
					next[i] = {
						...it,
						...patch
					};
					onChange(next);
				})]
			}, i)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground text-center py-4",
				children: "No items yet."
			})]
		})]
	});
}
function StringListEditor({ items, onChange, label, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => onChange([...items, ""]),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), " Add"]
			})]
		}), items.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: v,
				placeholder,
				onChange: (e) => {
					const n = [...items];
					n[i] = e.target.value;
					onChange(n);
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				className: "text-destructive",
				onClick: () => {
					const n = [...items];
					n.splice(i, 1);
					onChange(n);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
			})]
		}, i))]
	});
}
function IconField({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
		label: "Icon (lucide-react name)",
		hint: "e.g. Rocket, Server, Users, Wifi. Browse at lucide.dev",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-10 w-10 rounded-lg bg-gradient-brand text-white flex items-center justify-center shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsIcon, {
					name: value,
					className: "h-5 w-5"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: value ?? "",
				onChange: (e) => onChange(e.target.value),
				placeholder: "Rocket"
			})]
		})
	});
}
var SECTION_FORMS = {
	branding: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Brand name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: v.brand_name,
					onChange: (e) => set({ brand_name: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Tagline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: v.tagline,
					onChange: (e) => set({ tagline: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
				label: "Logo URL",
				value: v.logo_url,
				onChange: (x) => set({ logo_url: x }),
				hint: "Shown in header & footer. Leave blank for default lightning bolt icon."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
				label: "Favicon URL",
				value: v.favicon_url,
				onChange: (x) => set({ favicon_url: x })
			})
		] });
	},
	header: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
				label: "Navigation links",
				addLabel: "Add link",
				items: v.nav,
				onChange: (x) => set({ nav: x }),
				factory: () => ({
					label: "",
					to: ""
				}),
				render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Label",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: String(it.label ?? ""),
						onChange: (e) => up({ label: e.target.value })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "URL",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: String(it.to ?? ""),
						onChange: (e) => up({ to: e.target.value }),
						placeholder: "/services"
					})
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "CTA button label",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: v.cta_label,
					onChange: (e) => set({ cta_label: e.target.value })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "CTA button link",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: v.cta_link,
					onChange: (e) => set({ cta_link: e.target.value })
				})
			})] })]
		});
	},
	footer: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tagline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: v.tagline,
							onChange: (e) => set({ tagline: e.target.value })
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Contact email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.email,
						onChange: (e) => set({ email: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Contact phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.phone,
						onChange: (e) => set({ phone: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Address",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.address,
						onChange: (e) => set({ address: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "GSTIN",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.gstin,
						onChange: (e) => set({ gstin: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Copyright line",
						hint: "Use {year} for the current year",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.copyright,
							onChange: (e) => set({ copyright: e.target.value })
						})
					})
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
				label: "Footer link columns",
				addLabel: "Add column",
				items: v.columns,
				onChange: (x) => set({ columns: x }),
				factory: () => ({
					title: "",
					links: []
				}),
				render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Column title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: String(it.title ?? ""),
							onChange: (e) => up({ title: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
						label: "Links",
						addLabel: "Add link",
						items: it.links ?? [],
						onChange: (x) => up({ links: x }),
						factory: () => ({
							label: "",
							to: ""
						}),
						render: (l, _i2, upl) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(l.label ?? ""),
								onChange: (e) => upl({ label: e.target.value })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(l.to ?? ""),
								onChange: (e) => upl({ to: e.target.value })
							})
						})] })
					})]
				})
			})]
		});
	},
	home: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Hero",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.hero_eyebrow,
								onChange: (e) => set({ hero_eyebrow: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: v.hero_title,
									onChange: (e) => set({ hero_title: e.target.value })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Subtitle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									value: v.hero_subtitle,
									onChange: (e) => set({ hero_subtitle: e.target.value })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Primary CTA label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.hero_cta_primary.label,
								onChange: (e) => set({ hero_cta_primary: {
									...v.hero_cta_primary,
									label: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Primary CTA link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.hero_cta_primary.link,
								onChange: (e) => set({ hero_cta_primary: {
									...v.hero_cta_primary,
									link: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Secondary CTA label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.hero_cta_secondary.label,
								onChange: (e) => set({ hero_cta_secondary: {
									...v.hero_cta_secondary,
									label: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Secondary CTA link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.hero_cta_secondary.link,
								onChange: (e) => set({ hero_cta_secondary: {
									...v.hero_cta_secondary,
									link: e.target.value
								} })
							})
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StringListEditor, {
						label: "Trust checks (small line under CTAs)",
						items: v.hero_checks,
						onChange: (x) => set({ hero_checks: x }),
						placeholder: "GST-ready invoicing"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Stats strip",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
						label: "Stats",
						items: v.stats,
						onChange: (x) => set({ stats: x }),
						factory: () => ({
							label: "",
							value: "",
							icon: "TrendingUp"
						}),
						render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
							cols: 3,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Value",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(it.value ?? ""),
										onChange: (e) => up({ value: e.target.value })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Label",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(it.label ?? ""),
										onChange: (e) => up({ label: e.target.value })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
									value: it.icon,
									onChange: (x) => up({ icon: x })
								})
							]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Category / features intro",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Section title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.categories_title,
								onChange: (e) => set({ categories_title: e.target.value })
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Section subtitle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: v.categories_subtitle,
								onChange: (e) => set({ categories_subtitle: e.target.value })
							})
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
						label: "Highlighted feature cards",
						items: v.features,
						onChange: (x) => set({ features: x }),
						factory: () => ({
							title: "",
							description: "",
							icon: "Sparkles"
						}),
						render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: String(it.title ?? ""),
									onChange: (e) => up({ title: e.target.value })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
								value: it.icon,
								onChange: (x) => up({ icon: x })
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: String(it.description ?? ""),
									onChange: (e) => up({ description: e.target.value })
								})
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Featured products header",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Eyebrow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.featured_eyebrow,
							onChange: (e) => set({ featured_eyebrow: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.featured_title,
							onChange: (e) => set({ featured_title: e.target.value })
						})
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Testimonials",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Section title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.testimonials_title,
							onChange: (e) => set({ testimonials_title: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
						label: "Testimonials",
						items: v.testimonials,
						onChange: (x) => set({ testimonials: x }),
						factory: () => ({
							name: "",
							role: "",
							quote: ""
						}),
						render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
									cols: 3,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Name",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: String(it.name ?? ""),
												onChange: (e) => up({ name: e.target.value })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Role",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: String(it.role ?? ""),
												onChange: (e) => up({ role: e.target.value })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Company",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: String(it.company ?? ""),
												onChange: (e) => up({ company: e.target.value })
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Quote",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										value: String(it.quote ?? ""),
										onChange: (e) => up({ quote: e.target.value })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
									label: "Avatar URL (optional)",
									value: String(it.avatar_url ?? ""),
									onChange: (x) => up({ avatar_url: x })
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Bottom CTA banner",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: v.cta_title,
									onChange: (e) => set({ cta_title: e.target.value })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Subtitle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: v.cta_subtitle,
									onChange: (e) => set({ cta_subtitle: e.target.value })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Primary label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.cta_primary.label,
								onChange: (e) => set({ cta_primary: {
									...v.cta_primary,
									label: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Primary link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.cta_primary.link,
								onChange: (e) => set({ cta_primary: {
									...v.cta_primary,
									link: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Secondary label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.cta_secondary.label,
								onChange: (e) => set({ cta_secondary: {
									...v.cta_secondary,
									label: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Secondary link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.cta_secondary.link,
								onChange: (e) => set({ cta_secondary: {
									...v.cta_secondary,
									link: e.target.value
								} })
							})
						})
					] })
				})
			]
		});
	},
	services_page: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Page header",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.eyebrow,
								onChange: (e) => set({ eyebrow: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: v.title,
									onChange: (e) => set({ title: e.target.value })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Subtitle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: v.subtitle,
									onChange: (e) => set({ subtitle: e.target.value })
								})
							})
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Service cards",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
						label: "Services",
						items: v.services,
						onChange: (x) => set({ services: x }),
						factory: () => ({
							name: "",
							description: "",
							price: "",
							icon: "Package"
						}),
						render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
								cols: 3,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(it.name ?? ""),
											onChange: (e) => up({ name: e.target.value })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Price / starting from",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(it.price ?? ""),
											onChange: (e) => up({ price: e.target.value })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
										value: it.icon,
										onChange: (x) => up({ icon: x })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: String(it.description ?? ""),
									onChange: (e) => up({ description: e.target.value })
								})
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Delivery process",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Section title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.process_title,
								onChange: (e) => set({ process_title: e.target.value })
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Section subtitle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: v.process_subtitle,
								onChange: (e) => set({ process_subtitle: e.target.value })
							})
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
						label: "Process steps",
						items: v.process_steps,
						onChange: (x) => set({ process_steps: x }),
						factory: () => ({
							title: "",
							description: ""
						}),
						render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Step title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: String(it.title ?? ""),
									onChange: (e) => up({ title: e.target.value })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: String(it.description ?? ""),
									onChange: (e) => up({ description: e.target.value })
								})
							})]
						})
					})]
				})
			]
		});
	},
	products_page: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Eyebrow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: v.eyebrow,
					onChange: (e) => set({ eyebrow: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.title,
						onChange: (e) => set({ title: e.target.value })
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Subtitle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 2,
						value: v.subtitle,
						onChange: (e) => set({ subtitle: e.target.value })
					})
				})
			})
		] });
	},
	product_detail: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Buy now button label",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.buy_now_label,
						onChange: (e) => set({ buy_now_label: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Add to cart button label",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.add_to_cart_label,
						onChange: (e) => set({ add_to_cart_label: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Live Preview button label",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.demo_button_label,
						onChange: (e) => set({ demo_button_label: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Overview section title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.description_title,
						onChange: (e) => set({ description_title: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Features section title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.features_title,
						onChange: (e) => set({ features_title: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Gallery section title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.gallery_title,
						onChange: (e) => set({ gallery_title: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Related section title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.related_title,
						onChange: (e) => set({ related_title: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Related section subtitle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.related_subtitle,
						onChange: (e) => set({ related_subtitle: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-2 flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: v.show_related,
						onCheckedChange: (x) => set({ show_related: x })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: "Show \"You may also like\" related products"
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
				label: "Trust badges (shown under price)",
				items: v.trust_badges,
				onChange: (x) => set({ trust_badges: x }),
				factory: () => ({
					icon: "ShieldCheck",
					label: ""
				}),
				render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
					value: it.icon,
					onChange: (x) => up({ icon: x })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Label",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: it.label,
						onChange: (e) => up({ label: e.target.value })
					})
				})] })
			})]
		});
	},
	pricing_page: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Page header",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Eyebrow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.eyebrow,
							onChange: (e) => set({ eyebrow: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.title,
								onChange: (e) => set({ title: e.target.value })
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Subtitle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: v.subtitle,
								onChange: (e) => set({ subtitle: e.target.value })
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Footnote",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.footnote,
								onChange: (e) => set({ footnote: e.target.value })
							})
						})
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Plans",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
					label: "Plans",
					items: v.plans,
					onChange: (x) => set({ plans: x }),
					factory: () => ({
						name: "",
						tag: "",
						monthly: 0,
						yearly: 0,
						features: [],
						cta_label: "Get started",
						cta_link: "/contact",
						highlight: false
					}),
					render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
								cols: 3,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Plan name",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(it.name ?? ""),
											onChange: (e) => up({ name: e.target.value })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Tagline",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(it.tag ?? ""),
											onChange: (e) => up({ tag: e.target.value })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-end gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Highlight",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "pt-2",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
														checked: Boolean(it.highlight),
														onCheckedChange: (x) => up({ highlight: x })
													})
												})
											})
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Monthly (₹)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: Number(it.monthly ?? 0),
										onChange: (e) => up({ monthly: Number(e.target.value) })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Yearly (₹)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: Number(it.yearly ?? 0),
										onChange: (e) => up({ yearly: Number(e.target.value) })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "CTA label",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(it.cta_label ?? ""),
										onChange: (e) => up({ cta_label: e.target.value })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "CTA link",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(it.cta_link ?? ""),
										onChange: (e) => up({ cta_link: e.target.value })
									})
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StringListEditor, {
								label: "Features",
								items: it.features ?? [],
								onChange: (x) => up({ features: x }),
								placeholder: "Up to 100 customers"
							})
						]
					})
				})
			})]
		});
	},
	contact_page: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Page header",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.eyebrow,
								onChange: (e) => set({ eyebrow: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: v.title,
									onChange: (e) => set({ title: e.target.value })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Subtitle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: v.subtitle,
									onChange: (e) => set({ subtitle: e.target.value })
								})
							})
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Contact cards (sidebar)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
						label: "Cards",
						items: v.cards,
						onChange: (x) => set({ cards: x }),
						factory: () => ({
							title: "",
							lines: [""],
							icon: "Mail",
							accent: false
						}),
						render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
								cols: 3,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Title",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(it.title ?? ""),
											onChange: (e) => up({ title: e.target.value })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
										value: it.icon,
										onChange: (x) => up({ icon: x })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Green accent",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "pt-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
													checked: Boolean(it.accent),
													onCheckedChange: (x) => up({ accent: x })
												})
											})
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StringListEditor, {
								label: "Lines of text",
								items: it.lines ?? [],
								onChange: (x) => up({ lines: x })
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Form",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Submit button label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.form_submit_label,
								onChange: (e) => set({ form_submit_label: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Recipient email (for notifications)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.form_recipient_email,
								onChange: (e) => set({ form_recipient_email: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Success message",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: v.form_success_message,
									onChange: (e) => set({ form_success_message: e.target.value })
								})
							})
						})
					] })
				})
			]
		});
	},
	legal: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Each page is served at ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "bg-secondary px-1.5 py-0.5 rounded text-xs",
						children: "/p/<slug>"
					}),
					". Supports Markdown-ish content."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
				label: "Legal / info pages",
				addLabel: "Add page",
				items: v.pages,
				onChange: (x) => set({ pages: x }),
				factory: () => ({
					slug: "",
					title: "",
					meta_description: "",
					body: ""
				}),
				render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Slug",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(it.slug ?? ""),
								onChange: (e) => up({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }),
								placeholder: "terms"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Page title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(it.title ?? ""),
								onChange: (e) => up({ title: e.target.value })
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Meta description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(it.meta_description ?? ""),
								onChange: (e) => up({ meta_description: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Body (Markdown)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 10,
								value: String(it.body ?? ""),
								onChange: (e) => up({ body: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `/p/${it.slug}`,
							target: "_blank",
							rel: "noreferrer",
							className: "text-xs text-primary inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }),
								" Preview /p/",
								String(it.slug)
							]
						})
					]
				})
			})]
		});
	},
	seo: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Site defaults",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Site URL (production)",
							hint: "e.g. https://infiniforge.com — used for canonical & absolute OG URLs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.site_url,
								onChange: (e) => set({ site_url: e.target.value }),
								placeholder: "https://infiniforge.com"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Canonical base override (optional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.canonical_base,
								onChange: (e) => set({ canonical_base: e.target.value }),
								placeholder: "https://www.infiniforge.com"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Default title",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: v.default_title,
									onChange: (e) => set({ default_title: e.target.value })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Default meta description",
								hint: "≤160 chars recommended",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: v.default_description,
									onChange: (e) => set({ default_description: e.target.value })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Default keywords (comma-separated)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: v.default_keywords,
									onChange: (e) => set({ default_keywords: e.target.value })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
							label: "Default OpenGraph image",
							value: v.default_og_image,
							onChange: (x) => set({ default_og_image: x }),
							hint: "Used when a page doesn't set its own. 1200×630 recommended."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Robots",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.robots,
								onChange: (e) => set({ robots: e.target.value }),
								placeholder: "index, follow"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Sitemap URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.sitemap_url,
								onChange: (e) => set({ sitemap_url: e.target.value }),
								placeholder: "/sitemap.xml"
							})
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Social",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
						cols: 3,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Twitter site handle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: v.twitter_site,
									onChange: (e) => set({ twitter_site: e.target.value }),
									placeholder: "@infiniforge"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Twitter creator handle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: v.twitter_handle,
									onChange: (e) => set({ twitter_handle: e.target.value }),
									placeholder: "@founder"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Facebook App ID",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: v.facebook_app_id,
									onChange: (e) => set({ facebook_app_id: e.target.value })
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Verification & analytics",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Google Search Console token",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.google_site_verification,
								onChange: (e) => set({ google_site_verification: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Bing Webmaster token (msvalidate.01)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.bing_site_verification,
								onChange: (e) => set({ bing_site_verification: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "GA4 Measurement ID",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.ga_measurement_id,
								onChange: (e) => set({ ga_measurement_id: e.target.value }),
								placeholder: "G-XXXXXXX"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Google Tag Manager ID",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.gtm_id,
								onChange: (e) => set({ gtm_id: e.target.value }),
								placeholder: "GTM-XXXXXX"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Facebook Pixel ID",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.fb_pixel_id,
								onChange: (e) => set({ fb_pixel_id: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Hotjar ID",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.hotjar_id,
								onChange: (e) => set({ hotjar_id: e.target.value })
							})
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Structured data (JSON-LD)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Enable Organization / WebSite JSON-LD",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 h-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: v.json_ld_enabled,
									onCheckedChange: (x) => set({ json_ld_enabled: x })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: v.json_ld_enabled ? "Injected on every page" : "Disabled"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Organization name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.organization_name,
								onChange: (e) => set({ organization_name: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
							label: "Organization logo URL",
							value: v.organization_logo,
							onChange: (x) => set({ organization_logo: x })
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StringListEditor, {
						label: "sameAs profile URLs (social links)",
						items: v.organization_sameas ?? [],
						onChange: (x) => set({ organization_sameas: x }),
						placeholder: "https://twitter.com/infiniforge"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Per-page SEO overrides",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
						label: "Pages",
						addLabel: "Add page",
						items: v.pages,
						onChange: (x) => set({ pages: x }),
						factory: () => ({
							path: "/",
							title: "",
							description: "",
							keywords: "",
							og_image: "",
							noindex: false
						}),
						render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
									cols: 3,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Path",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: String(it.path ?? ""),
											onChange: (e) => up({ path: e.target.value }),
											placeholder: "/services"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "md:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Title",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: String(it.title ?? ""),
												onChange: (e) => up({ title: e.target.value })
											})
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Meta description",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										value: String(it.description ?? ""),
										onChange: (e) => up({ description: e.target.value })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Keywords",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(it.keywords ?? ""),
										onChange: (e) => up({ keywords: e.target.value })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
									label: "OG image URL",
									value: String(it.og_image ?? ""),
									onChange: (x) => up({ og_image: x })
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: Boolean(it.noindex),
										onCheckedChange: (x) => up({ noindex: x })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "noindex (hide from search engines)"
									})]
								})
							]
						})
					})
				})
			]
		});
	},
	announcements: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
				cols: 3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Enabled",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 h-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: v.enabled,
								onCheckedChange: (x) => set({ enabled: x })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: v.enabled ? "Live on site" : "Hidden"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Dismissible",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 h-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: v.dismissible,
								onCheckedChange: (x) => set({ dismissible: x })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "Show close (×) button"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Badge label",
						hint: "Small pill on the left (e.g. Live, News, Offer)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.badge_label,
							onChange: (e) => set({ badge_label: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Scroll speed (seconds)",
						hint: "Lower = faster. 15–120s",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 15,
							max: 120,
							value: v.speed_seconds,
							onChange: (e) => set({ speed_seconds: Number(e.target.value) || 40 })
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
				label: "Ticker messages",
				addLabel: "Add message",
				items: v.items,
				onChange: (x) => set({ items: x }),
				factory: () => ({
					text: "",
					icon: "",
					link: "",
					cta_label: "",
					enabled: true
				}),
				render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Message text",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: String(it.text ?? ""),
							onChange: (e) => up({ text: e.target.value }),
							placeholder: "🎉 Flash sale — 20% off today"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
						cols: 3,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconField, {
								value: it.icon,
								onChange: (x) => up({ icon: x })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Link (optional)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: String(it.link ?? ""),
									onChange: (e) => up({ link: e.target.value }),
									placeholder: "/pricing"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "CTA label (optional)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: String(it.cta_label ?? ""),
									onChange: (e) => up({ cta_label: e.target.value }),
									placeholder: "Grab deal"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: it.enabled !== false,
							onCheckedChange: (x) => up({ enabled: x })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Show this message"
						})]
					})
				] })
			})]
		});
	},
	banners: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
				cols: 3,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Enabled",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 h-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: v.enabled,
								onCheckedChange: (x) => set({ enabled: x })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: v.enabled ? "Shown on homepage" : "Hidden"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Autoplay",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 h-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: v.autoplay,
								onCheckedChange: (x) => set({ autoplay: x })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "Auto-advance slides"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Autoplay interval (seconds)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 2,
							max: 30,
							value: v.autoplay_seconds,
							onChange: (e) => set({ autoplay_seconds: Number(e.target.value) || 6 })
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
				label: "Banner slides",
				addLabel: "Add slide",
				items: v.slides,
				onChange: (x) => set({ slides: x }),
				factory: () => ({
					eyebrow: "",
					title: "",
					subtitle: "",
					image_url: "",
					cta_label: "",
					cta_link: "",
					cta2_label: "",
					cta2_link: "",
					enabled: true
				}),
				render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Eyebrow (small label)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: String(it.eyebrow ?? ""),
							onChange: (e) => up({ eyebrow: e.target.value }),
							placeholder: "New · Offer · Featured"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: String(it.title ?? ""),
							onChange: (e) => up({ title: e.target.value }),
							placeholder: "Big headline"
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Subtitle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: String(it.subtitle ?? ""),
							onChange: (e) => up({ subtitle: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageField, {
						label: "Background image URL",
						value: String(it.image_url ?? ""),
						onChange: (x) => up({ image_url: x }),
						hint: "Wide 16:6 image works best. Leave blank for a brand gradient."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Primary button label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(it.cta_label ?? ""),
								onChange: (e) => up({ cta_label: e.target.value }),
								placeholder: "Shop now"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Primary button link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(it.cta_link ?? ""),
								onChange: (e) => up({ cta_link: e.target.value }),
								placeholder: "/pricing"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Secondary button label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(it.cta2_label ?? ""),
								onChange: (e) => up({ cta2_label: e.target.value }),
								placeholder: "Learn more"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Secondary button link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(it.cta2_link ?? ""),
								onChange: (e) => up({ cta2_link: e.target.value }),
								placeholder: "/services"
							})
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: it.enabled !== false,
							onCheckedChange: (x) => up({ enabled: x })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Show this slide"
						})]
					})
				] })
			})]
		});
	},
	deployments_page: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Eyebrow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.eyebrow,
						onChange: (e) => set({ eyebrow: e.target.value })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.title,
						onChange: (e) => set({ title: e.target.value })
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Subtitle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 2,
						value: v.subtitle,
						onChange: (e) => set({ subtitle: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "CTA title",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.cta_title,
						onChange: (e) => set({ cta_title: e.target.value })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "CTA subtitle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: v.cta_subtitle,
						onChange: (e) => set({ cta_subtitle: e.target.value })
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
					label: "Stack categories (filters)",
					addLabel: "Add category",
					items: v.stacks,
					onChange: (x) => set({ stacks: x }),
					factory: () => ({
						key: "",
						name: ""
					}),
					render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Key (slug)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: String(it.key ?? ""),
							onChange: (e) => up({ key: e.target.value }),
							placeholder: "devops"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Display name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: String(it.name ?? ""),
							onChange: (e) => up({ name: e.target.value }),
							placeholder: "DevOps"
						})
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
					label: "Applications",
					addLabel: "Add application",
					items: v.apps,
					onChange: (x) => set({ apps: x }),
					factory: () => ({
						slug: "",
						name: "",
						tagline: "",
						description: "",
						stack: "devops",
						emoji: "🚀",
						color: "from-primary to-accent",
						from_inr: 999,
						tags: [],
						enabled: true
					}),
					render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
							cols: 3,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Slug",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(it.slug ?? ""),
										onChange: (e) => up({ slug: e.target.value }),
										placeholder: "coolify"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(it.name ?? ""),
										onChange: (e) => up({ name: e.target.value }),
										placeholder: "Coolify"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Stack (category key)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(it.stack ?? ""),
										onChange: (e) => up({ stack: e.target.value }),
										placeholder: "devops"
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tagline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: String(it.tagline ?? ""),
								onChange: (e) => up({ tagline: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: String(it.description ?? ""),
								onChange: (e) => up({ description: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
							cols: 3,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Emoji / icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(it.emoji ?? ""),
										onChange: (e) => up({ emoji: e.target.value }),
										placeholder: "🚀"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Gradient (tailwind)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: String(it.color ?? ""),
										onChange: (e) => up({ color: e.target.value }),
										placeholder: "from-primary to-accent"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "From ₹ / month",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: Number(it.from_inr ?? 0),
										onChange: (e) => up({ from_inr: Number(e.target.value) || 0 })
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tags (comma separated)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: Array.isArray(it.tags) ? it.tags.join(", ") : "",
								onChange: (e) => up({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }),
								placeholder: "docker, self-host, open-source"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: it.enabled !== false,
										onCheckedChange: (x) => up({ enabled: x })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Visible"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: it.popular === true,
										onCheckedChange: (x) => up({ popular: x })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Popular badge"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: it.new === true,
										onCheckedChange: (x) => up({ new: x })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "New badge"
									})]
								})
							]
						})
					] })
				})
			]
		});
	},
	hosting_page: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Hero",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.eyebrow,
								onChange: (e) => set({ eyebrow: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Badge (top pill)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.badge,
								onChange: (e) => set({ badge: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title (main)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.title,
								onChange: (e) => set({ title: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title (gradient word)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.title_gradient,
								onChange: (e) => set({ title_gradient: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Subtitle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									value: v.subtitle,
									onChange: (e) => set({ subtitle: e.target.value })
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Primary CTA label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.cta_primary.label,
								onChange: (e) => set({ cta_primary: {
									...v.cta_primary,
									label: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Primary CTA link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.cta_primary.link,
								onChange: (e) => set({ cta_primary: {
									...v.cta_primary,
									link: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Secondary CTA label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.cta_secondary.label,
								onChange: (e) => set({ cta_secondary: {
									...v.cta_secondary,
									label: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Secondary CTA link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.cta_secondary.link,
								onChange: (e) => set({ cta_secondary: {
									...v.cta_secondary,
									link: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tertiary CTA label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.cta_tertiary.label,
								onChange: (e) => set({ cta_tertiary: {
									...v.cta_tertiary,
									label: e.target.value
								} })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tertiary CTA link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.cta_tertiary.link,
								onChange: (e) => set({ cta_tertiary: {
									...v.cta_tertiary,
									link: e.target.value
								} })
							})
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Hero stats",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrayEditor, {
						label: "Stats",
						items: v.stats,
						onChange: (x) => set({ stats: x }),
						factory: () => ({
							value: "",
							label: "",
							icon: "TrendingUp"
						}),
						render: (it, _i, up) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
							cols: 2,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Value",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: String(it.value ?? ""),
									onChange: (e) => up({ value: e.target.value })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Label",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: String(it.label ?? ""),
									onChange: (e) => up({ label: e.target.value })
								})
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Section headings",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Plans title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.plans_title,
								onChange: (e) => set({ plans_title: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Plans subtitle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.plans_subtitle,
								onChange: (e) => set({ plans_subtitle: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Data centers title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.datacenters_title,
								onChange: (e) => set({ datacenters_title: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Data centers subtitle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.datacenters_subtitle,
								onChange: (e) => set({ datacenters_subtitle: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Migration title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.migration_title,
								onChange: (e) => set({ migration_title: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Migration subtitle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.migration_subtitle,
								onChange: (e) => set({ migration_subtitle: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Testimonials title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.testimonials_title,
								onChange: (e) => set({ testimonials_title: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "FAQ title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.faq_title,
								onChange: (e) => set({ faq_title: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Final CTA title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.final_cta_title,
								onChange: (e) => set({ final_cta_title: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Final CTA subtitle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: v.final_cta_subtitle,
									onChange: (e) => set({ final_cta_subtitle: e.target.value })
								})
							})
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "WhatsApp ordering",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "WhatsApp number override",
						hint: "Leave blank to use global WhatsApp settings. Include country code, e.g. +919999999999",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.whatsapp_number,
							onChange: (e) => set({ whatsapp_number: e.target.value }),
							placeholder: "+91…"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Greeting line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.whatsapp_greeting,
							onChange: (e) => set({ whatsapp_greeting: e.target.value })
						})
					})] })
				})
			]
		});
	},
	whatsapp: ({ value, onChange }) => {
		const v = value;
		const set = (patch) => onChange({
			...v,
			...patch
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Global WhatsApp ordering",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground -mt-2 mb-2",
					children: "Used on every page (hosting, products, header float, checkout). Saved in the database so it applies to all visitors — not just this browser."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "WhatsApp business number",
						hint: "Include country code, e.g. +919876543210",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.number,
							onChange: (e) => set({ number: e.target.value }),
							placeholder: "+91…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Button label",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.label,
							onChange: (e) => set({ label: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Greeting line",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: v.greeting,
								onChange: (e) => set({ greeting: e.target.value })
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Message template",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
							value: v.template,
							onChange: (e) => set({ template: e.target.value }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "premium",
									children: "Premium"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "invoice",
									children: "Invoice"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "concise",
									children: "Concise"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "enquiry",
									children: "Enquiry"
								})
							]
						})
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Visibility",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grid, {
					cols: 2,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Ordering enabled",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
								value: String(v.enabled),
								onChange: (e) => set({ enabled: e.target.value === "true" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "true",
									children: "Enabled"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "false",
									children: "Disabled"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Show on header/float",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
								value: String(v.show_header),
								onChange: (e) => set({ show_header: e.target.value === "true" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "true",
									children: "Show"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "false",
									children: "Hide"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Show on product cards",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
								value: String(v.show_products),
								onChange: (e) => set({ show_products: e.target.value === "true" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "true",
									children: "Show"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "false",
									children: "Hide"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Show on checkout",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm",
								value: String(v.show_checkout),
								onChange: (e) => set({ show_checkout: e.target.value === "true" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "true",
									children: "Show"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "false",
									children: "Hide"
								})]
							})
						})
					]
				})
			})]
		});
	}
};
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Site CMS",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
