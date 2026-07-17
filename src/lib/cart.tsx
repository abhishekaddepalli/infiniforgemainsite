import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price_inr: number;
  gst_percent: number;
  billing: string;
  qty: number;
  thumbnail_url?: string | null;
  product_type?: string;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  gst: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "infiniforge.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((s, i) => s + i.price_inr * i.qty, 0);
    const gst = items.reduce((s, i) => s + (i.price_inr * i.qty * i.gst_percent) / 100, 0);
    return {
      items,
      add: (item, qty = 1) => setItems((prev) => {
        const found = prev.find((p) => p.id === item.id);
        if (found) return prev.map((p) => p.id === item.id ? { ...p, qty: p.qty + qty } : p);
        return [...prev, { ...item, qty }];
      }),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      setQty: (id, qty) => setItems((prev) => qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => p.id === id ? { ...p, qty } : p)),
      clear: () => setItems([]),
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      gst,
      total: subtotal + gst,
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

// Product types allowed to be paid using wallet balance. Anything not in this list
// (e.g. physical goods that need real payments/GST reconciliation) forces gateway checkout.
export const WALLET_ELIGIBLE_TYPES_KEY = "infiniforge.wallet.eligible_types";
export const DEFAULT_WALLET_ELIGIBLE_TYPES = [
  "subscription", "license", "digital", "service", "software",
  "hosting", "vps", "domain", "ssl", "consultation", "custom_dev",
  "ai", "monitoring", "amc",
];
export function getWalletEligibleTypes(): string[] {
  if (typeof window === "undefined") return DEFAULT_WALLET_ELIGIBLE_TYPES;
  try {
    const raw = localStorage.getItem(WALLET_ELIGIBLE_TYPES_KEY);
    if (!raw) return DEFAULT_WALLET_ELIGIBLE_TYPES;
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_WALLET_ELIGIBLE_TYPES;
  } catch { return DEFAULT_WALLET_ELIGIBLE_TYPES; }
}
