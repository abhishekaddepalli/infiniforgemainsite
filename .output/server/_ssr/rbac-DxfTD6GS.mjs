//#region node_modules/.nitro/vite/services/ssr/assets/rbac-DxfTD6GS.js
var ROLES = [
	{
		key: "super_admin",
		name: "Super Admin",
		description: "Unrestricted access to every module, billing and infrastructure controls.",
		users: 2,
		tone: "brand",
		system: true
	},
	{
		key: "admin",
		name: "Admin",
		description: "Manage products, services, customers, staff and platform settings.",
		users: 6,
		tone: "purple"
	},
	{
		key: "sales_manager",
		name: "Sales Manager",
		description: "CRM pipeline, quotations, orders, discounts and sales reports.",
		users: 11,
		tone: "green"
	},
	{
		key: "support",
		name: "Support Team",
		description: "Tickets, live chat, knowledge base and customer communications.",
		users: 18,
		tone: "cyan"
	},
	{
		key: "finance",
		name: "Finance",
		description: "Invoices, payments, refunds, GST filings, wallet and payouts.",
		users: 5,
		tone: "amber"
	},
	{
		key: "reseller",
		name: "Reseller",
		description: "White-label store, own customers, custom pricing, wallet and commissions.",
		users: 47,
		tone: "teal"
	},
	{
		key: "customer",
		name: "Customer",
		description: "Access to owned products, subscriptions, invoices, licenses and tickets.",
		users: 8942,
		tone: "slate",
		system: true
	},
	{
		key: "affiliate",
		name: "Affiliate",
		description: "Referral links, campaigns, conversions, marketing assets and payouts.",
		users: 213,
		tone: "rose"
	},
	{
		key: "employee",
		name: "Employee",
		description: "Assigned projects, service delivery, milestones, tasks and timesheets.",
		users: 34,
		tone: "blue"
	}
];
var CRUD = [
	"view",
	"create",
	"edit",
	"delete"
];
var CRUDA = [
	"view",
	"create",
	"edit",
	"delete",
	"approve"
];
var PERMISSION_GROUPS = [
	{
		key: "dashboard",
		label: "Dashboard & Analytics",
		description: "Widgets, reports and insights across the platform.",
		permissions: [
			{
				key: "dashboard.super",
				label: "Super Admin dashboard",
				actions: ["view"]
			},
			{
				key: "dashboard.finance",
				label: "Finance dashboard",
				actions: ["view", "export"]
			},
			{
				key: "dashboard.sales",
				label: "Sales dashboard",
				actions: ["view", "export"]
			},
			{
				key: "reports.all",
				label: "Global reports & exports",
				actions: ["view", "export"]
			}
		]
	},
	{
		key: "catalog",
		label: "Products & Catalog",
		description: "Physical, digital, SaaS, hosting, VPS, SSL and license products.",
		permissions: [
			{
				key: "products",
				label: "Products",
				actions: CRUD
			},
			{
				key: "categories",
				label: "Categories & brands",
				actions: CRUD
			},
			{
				key: "inventory",
				label: "Inventory & stock",
				actions: ["view", "edit"]
			},
			{
				key: "licenses",
				label: "License keys",
				actions: CRUDA
			},
			{
				key: "downloads",
				label: "Digital downloads",
				actions: CRUD
			}
		]
	},
	{
		key: "services",
		label: "Services & Delivery",
		description: "Website, app, ERP, AI automation and managed services.",
		permissions: [
			{
				key: "services",
				label: "Service catalog",
				actions: CRUD
			},
			{
				key: "projects",
				label: "Projects & milestones",
				actions: CRUD
			},
			{
				key: "quotations",
				label: "Quotations",
				actions: CRUDA
			},
			{
				key: "amc",
				label: "AMC contracts",
				actions: CRUD
			}
		]
	},
	{
		key: "commerce",
		label: "Orders & Subscriptions",
		description: "Checkout, recurring billing, renewals and upgrades.",
		permissions: [
			{
				key: "orders",
				label: "Orders",
				actions: CRUDA
			},
			{
				key: "subscriptions",
				label: "Subscriptions",
				actions: CRUDA
			},
			{
				key: "renewals",
				label: "Renewals & reminders",
				actions: ["view", "edit"]
			},
			{
				key: "coupons",
				label: "Coupons & offers",
				actions: CRUD
			}
		]
	},
	{
		key: "hosting",
		label: "Hosting & Infrastructure",
		description: "VPS, shared hosting, domains, SSL and monitoring.",
		permissions: [
			{
				key: "vps",
				label: "VPS instances",
				actions: CRUDA
			},
			{
				key: "hosting",
				label: "Shared hosting accounts",
				actions: CRUD
			},
			{
				key: "domains",
				label: "Domain registrations",
				actions: CRUD
			},
			{
				key: "ssl",
				label: "SSL certificates",
				actions: CRUD
			},
			{
				key: "monitoring",
				label: "Monitoring & alerts",
				actions: ["view", "edit"]
			}
		]
	},
	{
		key: "finance",
		label: "Finance & Payments",
		description: "Invoices, Razorpay, wallets, GST and refunds.",
		permissions: [
			{
				key: "invoices",
				label: "GST invoices",
				actions: [
					"view",
					"create",
					"edit",
					"export"
				]
			},
			{
				key: "payments",
				label: "Payments & Razorpay",
				actions: ["view", "edit"]
			},
			{
				key: "refunds",
				label: "Refunds & credit notes",
				actions: CRUDA
			},
			{
				key: "wallet.customers",
				label: "Customer wallets",
				actions: [
					"view",
					"edit",
					"approve"
				]
			},
			{
				key: "payouts",
				label: "Reseller / affiliate payouts",
				actions: CRUDA
			},
			{
				key: "taxes",
				label: "GST & tax settings",
				actions: ["view", "edit"]
			}
		]
	},
	{
		key: "crm",
		label: "CRM & Sales",
		description: "Leads, deals, pipeline, companies, contacts.",
		permissions: [
			{
				key: "leads",
				label: "Leads",
				actions: CRUD
			},
			{
				key: "deals",
				label: "Deals & pipeline",
				actions: CRUD
			},
			{
				key: "companies",
				label: "Companies & contacts",
				actions: CRUD
			},
			{
				key: "tasks",
				label: "Tasks & meetings",
				actions: CRUD
			}
		]
	},
	{
		key: "support",
		label: "Support & Tickets",
		description: "Ticketing, SLA, knowledge base and chat.",
		permissions: [
			{
				key: "tickets",
				label: "Support tickets",
				actions: CRUDA
			},
			{
				key: "kb",
				label: "Knowledge base & FAQ",
				actions: CRUD
			},
			{
				key: "chat",
				label: "Live chat",
				actions: ["view", "edit"]
			},
			{
				key: "sla",
				label: "SLA configuration",
				actions: ["view", "edit"]
			}
		]
	},
	{
		key: "customers",
		label: "Customers & Users",
		description: "End customers, resellers, affiliates and employees.",
		permissions: [
			{
				key: "customers",
				label: "Customers",
				actions: CRUD
			},
			{
				key: "resellers",
				label: "Resellers",
				actions: CRUDA
			},
			{
				key: "affiliates",
				label: "Affiliates",
				actions: CRUDA
			},
			{
				key: "employees",
				label: "Employees",
				actions: CRUD
			},
			{
				key: "impersonate",
				label: "Impersonate account",
				actions: ["approve"]
			}
		]
	},
	{
		key: "marketing",
		label: "Marketing & Growth",
		description: "Campaigns, referrals, newsletters and gift cards.",
		permissions: [
			{
				key: "campaigns",
				label: "Campaigns & flash sales",
				actions: CRUD
			},
			{
				key: "referrals",
				label: "Referral program",
				actions: ["view", "edit"]
			},
			{
				key: "newsletter",
				label: "Newsletter & push",
				actions: CRUD
			},
			{
				key: "reviews",
				label: "Reviews & ratings",
				actions: [
					"view",
					"edit",
					"delete",
					"approve"
				]
			}
		]
	},
	{
		key: "cms",
		label: "CMS & Content",
		description: "Landing pages, blog, portfolio and policies.",
		permissions: [
			{
				key: "pages",
				label: "Pages & landing",
				actions: CRUDA
			},
			{
				key: "blog",
				label: "Blog & portfolio",
				actions: CRUD
			},
			{
				key: "media",
				label: "Media library",
				actions: CRUD
			},
			{
				key: "policies",
				label: "Legal & policies",
				actions: [
					"view",
					"edit",
					"approve"
				]
			}
		]
	},
	{
		key: "settings",
		label: "Settings & Platform",
		description: "Roles, integrations, API keys, backups and security.",
		permissions: [
			{
				key: "settings.general",
				label: "General settings",
				actions: ["view", "edit"]
			},
			{
				key: "settings.roles",
				label: "Roles & permissions",
				actions: CRUD
			},
			{
				key: "settings.integrations",
				label: "Integrations (Razorpay, WhatsApp, SMTP)",
				actions: ["view", "edit"]
			},
			{
				key: "settings.api",
				label: "API keys & webhooks",
				actions: CRUD
			},
			{
				key: "settings.backup",
				label: "Backups & maintenance",
				actions: [
					"view",
					"edit",
					"approve"
				]
			},
			{
				key: "settings.security",
				label: "Security & 2FA policies",
				actions: ["view", "edit"]
			}
		]
	}
];
var ALL = (p) => [...p.actions ?? ["view"]];
var VIEW = ["view"];
function build(rolePicker) {
	const out = {};
	for (const g of PERMISSION_GROUPS) for (const p of g.permissions) {
		const v = rolePicker(g, p);
		if (v && v.length) out[p.key] = v;
	}
	return out;
}
var DEFAULT_MATRIX = {
	super_admin: build((_g, p) => ALL(p)),
	admin: build((g, p) => g.key === "settings" && (p.key === "settings.roles" || p.key === "settings.backup") ? ["view", "edit"] : ALL(p)),
	sales_manager: build((g, p) => {
		if ([
			"crm",
			"commerce",
			"marketing"
		].includes(g.key)) return ALL(p);
		if (g.key === "catalog" && ["products", "categories"].includes(p.key)) return ["view", "edit"];
		if (g.key === "services" && p.key === "quotations") return ALL(p);
		if (g.key === "customers" && p.key === "customers") return ["view", "edit"];
		if (g.key === "dashboard" && ["dashboard.sales", "reports.all"].includes(p.key)) return ["view", "export"];
		return null;
	}),
	support: build((g, p) => {
		if (g.key === "support") return ALL(p);
		if (g.key === "customers" && p.key === "customers") return ["view", "edit"];
		if (g.key === "commerce" && ["orders", "subscriptions"].includes(p.key)) return VIEW;
		if (g.key === "hosting") return VIEW;
		if (g.key === "cms" && p.key === "media") return ["view"];
		return null;
	}),
	finance: build((g, p) => {
		if (g.key === "finance") return ALL(p);
		if (g.key === "dashboard" && (p.key === "dashboard.finance" || p.key === "reports.all")) return ["view", "export"];
		if (g.key === "commerce" && p.key === "orders") return ["view", "approve"];
		if (g.key === "customers" && [
			"customers",
			"resellers",
			"affiliates"
		].includes(p.key)) return VIEW;
		return null;
	}),
	reseller: build((g, p) => {
		if (g.key === "commerce" && [
			"orders",
			"subscriptions",
			"coupons"
		].includes(p.key)) return [
			"view",
			"create",
			"edit"
		];
		if (g.key === "catalog" && p.key === "products") return [
			"view",
			"create",
			"edit"
		];
		if (g.key === "services" && ["services", "quotations"].includes(p.key)) return [
			"view",
			"create",
			"edit"
		];
		if (g.key === "customers" && p.key === "customers") return [
			"view",
			"create",
			"edit"
		];
		if (g.key === "finance" && ["invoices", "wallet.customers"].includes(p.key)) return ["view", "create"];
		if (g.key === "marketing" && p.key === "referrals") return ["view", "edit"];
		if (g.key === "cms" && p.key === "pages") return ["view", "edit"];
		return null;
	}),
	customer: build((g, p) => {
		if (g.key === "commerce" && ["orders", "subscriptions"].includes(p.key)) return VIEW;
		if (g.key === "finance" && ["invoices", "wallet.customers"].includes(p.key)) return VIEW;
		if (g.key === "hosting" && [
			"vps",
			"hosting",
			"domains",
			"ssl"
		].includes(p.key)) return VIEW;
		if (g.key === "catalog" && p.key === "licenses") return VIEW;
		if (g.key === "support" && p.key === "tickets") return [
			"view",
			"create",
			"edit"
		];
		return null;
	}),
	affiliate: build((g, p) => {
		if (g.key === "marketing" && ["campaigns", "referrals"].includes(p.key)) return [
			"view",
			"create",
			"edit"
		];
		if (g.key === "finance" && p.key === "payouts") return VIEW;
		if (g.key === "dashboard" && p.key === "reports.all") return ["view", "export"];
		if (g.key === "cms" && p.key === "media") return VIEW;
		return null;
	}),
	employee: build((g, p) => {
		if (g.key === "services" && ["projects", "services"].includes(p.key)) return ["view", "edit"];
		if (g.key === "crm" && p.key === "tasks") return ["view", "edit"];
		if (g.key === "support" && p.key === "tickets") return ["view", "edit"];
		if (g.key === "customers" && p.key === "customers") return VIEW;
		return null;
	})
};
var ROLE_TONE_CLASS = {
	brand: "bg-gradient-brand text-white",
	green: "bg-gradient-green text-white",
	blue: "bg-blue-500 text-white",
	purple: "bg-purple-500 text-white",
	amber: "bg-amber-500 text-white",
	slate: "bg-slate-500 text-white",
	rose: "bg-rose-500 text-white",
	cyan: "bg-cyan-500 text-white",
	teal: "bg-teal-500 text-white"
};
var ACTION_LABEL = {
	view: "View",
	create: "Create",
	edit: "Edit",
	delete: "Delete",
	approve: "Approve",
	export: "Export"
};
//#endregion
export { ROLE_TONE_CLASS as a, ROLES as i, DEFAULT_MATRIX as n, PERMISSION_GROUPS as r, ACTION_LABEL as t };
