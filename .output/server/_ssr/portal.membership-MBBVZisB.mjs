import { o as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { At as LayoutDashboard, Et as LoaderCircle, Kt as GraduationCap, Nn as Check, Qt as FolderTree, Xn as ArrowRight, Yt as Gift, dt as Package, gn as CreditCard, j as Sparkles, o as Wallet, wn as Circle } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CiapfthD.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { _ as verifyMembershipPayment, a as getMyMembership, f as purchaseMembership, i as getMyBenefits, n as createMembershipRazorpayOrder, u as listTiers } from "./memberships.functions-C2eeCH5c.mjs";
import { t as MembershipBadge } from "./MembershipBadge-vyy4IIJ-.mjs";
import { t as ExpirationBar } from "./ExpirationBar-BUuZVN4O.mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "../_libs/radix-ui__react-radio-group.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.membership-MBBVZisB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroup$1.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem$1, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupIndicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3.5 w-3.5 fill-primary" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
function loadRazorpay() {
	return new Promise((resolve) => {
		if (typeof window === "undefined") return resolve(false);
		if (window.Razorpay) return resolve(true);
		const s = document.createElement("script");
		s.src = "https://checkout.razorpay.com/v1/checkout.js";
		s.onload = () => resolve(true);
		s.onerror = () => resolve(false);
		document.body.appendChild(s);
	});
}
function Page() {
	const qc = useQueryClient();
	const { user, profile } = useAuth();
	const getMine = useServerFn(getMyMembership);
	const list = useServerFn(listTiers);
	const buyWallet = useServerFn(purchaseMembership);
	const createRzp = useServerFn(createMembershipRazorpayOrder);
	const verifyRzp = useServerFn(verifyMembershipPayment);
	const { data: mine } = useQuery({
		queryKey: ["my-membership"],
		queryFn: () => getMine()
	});
	const { data: tiers = [] } = useQuery({
		queryKey: ["tiers-public"],
		queryFn: () => list()
	});
	const [walletBal, setWalletBal] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		supabase.from("wallets").select("balance_inr").eq("user_id", user.id).maybeSingle().then(({ data }) => setWalletBal(Number(data?.balance_inr ?? 0)));
	}, [user]);
	const currentRank = mine?.tier?.rank ?? 0;
	const [selectedTier, setSelectedTier] = (0, import_react.useState)(null);
	const [method, setMethod] = (0, import_react.useState)("card");
	const [processing, setProcessing] = (0, import_react.useState)(false);
	function openPurchase(t) {
		setSelectedTier(t);
		setMethod(walletBal >= Number(t.price_inr) ? "wallet" : "card");
	}
	async function confirm() {
		if (!selectedTier) return;
		setProcessing(true);
		try {
			if (method === "wallet") {
				await buyWallet({ data: { tier_id: selectedTier.id } });
				toast.success("Membership activated!");
				setSelectedTier(null);
				qc.invalidateQueries({ queryKey: ["my-membership"] });
				qc.invalidateQueries({ queryKey: ["my-benefits"] });
				return;
			}
			const res = await createRzp({ data: { tier_id: selectedTier.id } });
			if (res.free || res.demo) {
				toast.success(res.demo ? "Membership activated (demo mode)" : "Membership activated!");
				setSelectedTier(null);
				qc.invalidateQueries({ queryKey: ["my-membership"] });
				qc.invalidateQueries({ queryKey: ["my-benefits"] });
				return;
			}
			if (!await loadRazorpay() || !window.Razorpay) throw new Error("Razorpay SDK failed to load");
			new window.Razorpay({
				key: res.razorpay_key_id,
				order_id: res.razorpay_order_id,
				amount: Math.round(res.amount_inr * 100),
				currency: "INR",
				name: "Infiniforge Membership",
				description: `${res.tier_name} plan`,
				prefill: {
					name: profile?.full_name ?? "",
					email: user?.email ?? "",
					contact: profile?.phone ?? ""
				},
				theme: { color: "#FF9933" },
				handler: async (resp) => {
					try {
						await verifyRzp({ data: {
							razorpay_order_id: resp.razorpay_order_id,
							razorpay_payment_id: resp.razorpay_payment_id,
							razorpay_signature: resp.razorpay_signature
						} });
						toast.success("Membership activated!");
						setSelectedTier(null);
						qc.invalidateQueries({ queryKey: ["my-membership"] });
						qc.invalidateQueries({ queryKey: ["my-benefits"] });
					} catch (e) {
						toast.error(e.message ?? "Verification failed");
					}
				},
				modal: { ondismiss: () => setProcessing(false) }
			}).open();
		} catch (e) {
			toast.error(e.message ?? "Purchase failed");
		} finally {
			setProcessing(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 sm:p-6 space-y-6 max-w-6xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl sm:text-3xl font-bold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6 text-amber-500" }), " My Membership"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage your plan and unlock premium content."
			})] }),
			mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpirationBar, { membership: mine }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border p-4 text-sm text-muted-foreground",
				children: "Loading membership…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitsPanel, { active: !!mine }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold mb-3",
				children: "Choose a plan"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: tiers.map((t) => {
					const isCurrent = mine?.tier?.id === t.id;
					const isDowngrade = t.rank < currentRank;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("relative rounded-2xl border p-5 flex flex-col bg-card transition", isCurrent && "ring-2 ring-primary shadow-lg"),
						style: { borderColor: isCurrent ? void 0 : `${t.gradient_from}40` },
						children: [
							isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-2 right-4 text-[10px] font-bold uppercase tracking-wide bg-primary text-primary-foreground px-2 py-0.5 rounded-full",
								children: "Current"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembershipBadge, {
								slug: t.slug,
								name: t.name,
								gradientFrom: t.gradient_from,
								gradientTo: t.gradient_to,
								size: "lg",
								className: "self-start"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 mb-1 text-xs text-muted-foreground",
								children: t.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-3xl font-black",
									children: ["₹", Number(t.price_inr).toLocaleString()]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground ml-1",
									children: ["/ ", t.duration_days ? `${t.duration_days}d` : "lifetime"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-1.5 text-sm flex-1",
								children: (t.features ?? []).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-500 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-4 w-full text-white",
								style: { background: `linear-gradient(135deg, ${t.gradient_from}, ${t.gradient_to})` },
								disabled: isCurrent || isDowngrade || t.slug === "free",
								onClick: () => openPurchase(t),
								children: isCurrent ? "Active" : isDowngrade ? "Lower tier" : t.slug === "free" ? "Included" : "Upgrade"
							})
						]
					}, t.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedTier,
				onOpenChange: (o) => !o && setSelectedTier(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Purchase ", selectedTier?.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"₹",
						Number(selectedTier?.price_inr ?? 0).toLocaleString(),
						" · ",
						selectedTier?.duration_days ? `${selectedTier.duration_days} days` : "lifetime"
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: "Payment method"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
							value: method,
							onValueChange: (v) => setMethod(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: cn("flex items-start gap-3 rounded-xl border p-3 cursor-pointer", method === "wallet" && "border-primary bg-primary/5"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
									value: "wallet",
									id: "pm-wallet",
									className: "mt-1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }), " Wallet"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											"Balance: ₹",
											walletBal.toLocaleString(),
											walletBal < Number(selectedTier?.price_inr ?? 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: " · insufficient"
											})
										]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: cn("flex items-start gap-3 rounded-xl border p-3 cursor-pointer", method === "card" && "border-primary bg-primary/5"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
									value: "card",
									id: "pm-card",
									className: "mt-1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }), " Card / UPI / Netbanking"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Pay securely via Razorpay"
									})]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setSelectedTier(null),
						disabled: processing,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: confirm,
						disabled: processing || method === "wallet" && walletBal < Number(selectedTier?.price_inr ?? 0),
						children: [
							processing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
							"Pay ₹",
							Number(selectedTier?.price_inr ?? 0).toLocaleString()
						]
					})] })
				] })
			})
		]
	});
}
var PORTAL_SECTION_META = {
	courses: {
		label: "Courses",
		to: "/portal/courses",
		icon: GraduationCap
	},
	downloads: {
		label: "Downloads",
		to: "/portal/downloads",
		icon: Package
	},
	licenses: {
		label: "Licenses",
		to: "/portal/licenses",
		icon: Package
	},
	subscriptions: {
		label: "Subscriptions",
		to: "/portal/subscriptions",
		icon: LayoutDashboard
	},
	affiliate: {
		label: "Affiliate",
		to: "/portal/affiliate",
		icon: Sparkles
	},
	wallet: {
		label: "Wallet",
		to: "/portal/wallet",
		icon: Wallet
	},
	orders: {
		label: "Orders",
		to: "/portal/orders",
		icon: Package
	},
	tickets: {
		label: "Support tickets",
		to: "/portal/tickets",
		icon: LayoutDashboard
	}
};
function BenefitsPanel({ active }) {
	const getBenefits = useServerFn(getMyBenefits);
	const { data, isLoading } = useQuery({
		queryKey: ["my-benefits"],
		queryFn: () => getBenefits(),
		enabled: active
	});
	if (!active) return null;
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border p-6 text-sm text-muted-foreground flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading your unlocked benefits…"]
	});
	const courses = data?.courses ?? [];
	const products = data?.products ?? [];
	const categories = data?.categories ?? [];
	const sections = data?.portal_sections ?? [];
	const totalItems = courses.length + products.length + categories.length + sections.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-background to-background p-4 sm:p-6 space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-primary flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-3.5 w-3.5" }), " Unlocked with your plan"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg sm:text-xl font-bold mt-1",
					children: "Your membership benefits"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: [
					"Tier rank ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: data?.user_rank ?? 0
					}),
					" · ",
					totalItems,
					" item",
					totalItems === 1 ? "" : "s"
				]
			})]
		}), totalItems === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground",
			children: "Nothing has been assigned to your current tier yet. Upgrade below or check back soon — new premium courses, products and categories are unlocked over time."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 lg:grid-cols-2",
			children: [
				sections.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitGroup, {
					title: "Portal sections",
					icon: LayoutDashboard,
					count: sections.length,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: sections.map((id) => {
							const meta = PORTAL_SECTION_META[id] ?? {
								label: id,
								to: "/portal",
								icon: LayoutDashboard
							};
							const Icon = meta.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: meta.to,
								className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
									" ",
									meta.label,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 opacity-60" })
								]
							}, id);
						})
					})
				}),
				courses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitGroup, {
					title: "Premium courses",
					icon: GraduationCap,
					count: courses.length,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [courses.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/courses/$slug",
							params: { slug: c.slug },
							className: "group flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 hover:border-primary transition",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-11 w-14 shrink-0 rounded-lg overflow-hidden bg-secondary flex items-center justify-center",
									children: c.cover_image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: c.cover_image,
										alt: "",
										className: "h-full w-full object-cover",
										loading: "lazy"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-5 w-5 text-primary/60" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold truncate group-hover:text-primary",
										children: c.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground truncate",
										children: [
											c.category ?? "Course",
											" · ",
											c.level ?? "All levels"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" })
							]
						}, c.id)), courses.length > 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/courses",
							className: "text-xs text-primary font-medium hover:underline text-center pt-1",
							children: [
								"View all ",
								courses.length,
								" courses →"
							]
						})]
					})
				}),
				products.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitGroup, {
					title: "Digital products",
					icon: Package,
					count: products.length,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [products.slice(0, 6).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/products/$slug",
							params: { slug: p.slug },
							className: "group flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 hover:border-primary transition",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-secondary flex items-center justify-center",
									children: p.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.thumbnail_url,
										alt: "",
										className: "h-full w-full object-cover",
										loading: "lazy"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5 text-primary/60" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold truncate group-hover:text-primary",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground capitalize truncate",
										children: p.product_type ?? "product"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" })
							]
						}, p.id)), products.length > 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/products",
							className: "text-xs text-primary font-medium hover:underline text-center pt-1",
							children: [
								"View all ",
								products.length,
								" products →"
							]
						})]
					})
				}),
				categories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitGroup, {
					title: "Unlocked categories",
					icon: FolderTree,
					count: categories.length,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, { className: "h-3.5 w-3.5 text-primary" }),
								" ",
								c.name
							]
						}, c.id))
					})
				})
			]
		})]
	});
}
function BenefitGroup({ title, icon: Icon, count, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-background/60 p-4 space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold truncate",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] text-muted-foreground",
					children: [
						count,
						" item",
						count === 1 ? "" : "s"
					]
				})]
			})]
		}), children]
	});
}
//#endregion
export { Page as component };
