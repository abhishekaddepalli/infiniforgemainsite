import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-B06bdZ_b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
var KEY = "infiniforge.cart.v1";
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
			if (raw) setItems(JSON.parse(raw));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		localStorage.setItem(KEY, JSON.stringify(items));
	}, [items]);
	const value = (0, import_react.useMemo)(() => {
		const subtotal = items.reduce((s, i) => s + i.price_inr * i.qty, 0);
		const gst = items.reduce((s, i) => s + i.price_inr * i.qty * i.gst_percent / 100, 0);
		return {
			items,
			add: (item, qty = 1) => setItems((prev) => {
				if (prev.find((p) => p.id === item.id)) return prev.map((p) => p.id === item.id ? {
					...p,
					qty: p.qty + qty
				} : p);
				return [...prev, {
					...item,
					qty
				}];
			}),
			remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
			setQty: (id, qty) => setItems((prev) => qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => p.id === id ? {
				...p,
				qty
			} : p)),
			clear: () => setItems([]),
			count: items.reduce((s, i) => s + i.qty, 0),
			subtotal,
			gst,
			total: subtotal + gst
		};
	}, [items]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useCart() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useCart must be used inside CartProvider");
	return c;
}
var WALLET_ELIGIBLE_TYPES_KEY = "infiniforge.wallet.eligible_types";
var DEFAULT_WALLET_ELIGIBLE_TYPES = [
	"subscription",
	"license",
	"digital",
	"service",
	"software",
	"hosting",
	"vps",
	"domain",
	"ssl",
	"consultation",
	"custom_dev",
	"ai",
	"monitoring",
	"amc"
];
function getWalletEligibleTypes() {
	if (typeof window === "undefined") return DEFAULT_WALLET_ELIGIBLE_TYPES;
	try {
		const raw = localStorage.getItem(WALLET_ELIGIBLE_TYPES_KEY);
		if (!raw) return DEFAULT_WALLET_ELIGIBLE_TYPES;
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_WALLET_ELIGIBLE_TYPES;
	} catch {
		return DEFAULT_WALLET_ELIGIBLE_TYPES;
	}
}
//#endregion
export { useCart as a, getWalletEligibleTypes as i, DEFAULT_WALLET_ELIGIBLE_TYPES as n, WALLET_ELIGIBLE_TYPES_KEY as r, CartProvider as t };
