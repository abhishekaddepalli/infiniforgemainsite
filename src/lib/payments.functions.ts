import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { safeDispatchAlert } from "./alerts.server";

type CheckoutItem = {
  id: string;
  name: string;
  price_inr: number;
  gst_percent: number;
  qty: number;
  billing: string;
};

type CheckoutPayload = {
  items: CheckoutItem[];
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  gstin?: string;
  coupon_code?: string;
  use_wallet?: boolean;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
  save_to_profile?: boolean;
};

async function getUserFromAuthHeader() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const authHeader = getRequestHeader("authorization" as never) as string | undefined;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data } = await supabaseAdmin.auth.getUser(token);
  return data.user ?? null;
}

function orderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INF-${y}${m}-${rand}`;
}
function invoiceNumber() {
  const d = new Date();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INV-${d.getFullYear()}-${rand}`;
}

function formatINRPlain(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

async function getProfileForAlert(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("profiles").select("full_name,email,phone").eq("id", userId).maybeSingle();
  return data;
}

async function notifyOrderEvent(userId: string, orders: Array<Record<string, unknown>>, phase: "created" | "paid") {
  if (!orders.length) return;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const profile = await getProfileForAlert(userId);
  const total = orders.reduce((s, o) => s + Number(o.total_inr ?? 0), 0);
  const orderNumbers = orders.map((o) => String(o.order_number ?? "")).filter(Boolean).join(", ");
  const productLines = orders.map((o) => `• ${o.product_name} — ${formatINRPlain(Number(o.total_inr ?? 0))}`).join("\n");
  const title = phase === "paid" ? `Payment received · ${orders[0].invoice_number ?? orderNumbers}` : `New order placed · ${orders[0].invoice_number ?? orderNumbers}`;
  await safeDispatchAlert(supabaseAdmin, {
    kind: "order",
    title,
    body: `${profile?.full_name ?? orders[0].customer_name ?? "Customer"} placed ${orders.length} order item${orders.length > 1 ? "s" : ""}.\n${productLines}\nTotal: ${formatINRPlain(total)}`,
    href: "/admin/orders",
    user: true,
    userId,
    customerEmail: String(orders[0].customer_email ?? profile?.email ?? ""),
    customerPhone: String(orders[0].customer_phone ?? profile?.phone ?? ""),
    customerTitle: phase === "paid" ? `Payment successful · ${orders[0].invoice_number ?? orderNumbers}` : `Order received · ${orders[0].invoice_number ?? orderNumbers}`,
    customerBody: phase === "paid"
      ? `Your payment was successful.\n${productLines}\nTotal paid: ${formatINRPlain(total)}`
      : `We received your order.\n${productLines}\nTotal: ${formatINRPlain(total)}`,
    metadata: { order_ids: orders.map((o) => o.id), invoice_number: orders[0].invoice_number, phase },
  });
}

async function notifyWalletEvent(userId: string, amount: number, balance: number, note: string, type: "credit" | "debit") {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const profile = await getProfileForAlert(userId);
  const verb = type === "credit" ? "credited" : "debited";
  await safeDispatchAlert(supabaseAdmin, {
    kind: "wallet",
    title: `Wallet ${verb} · ${profile?.full_name ?? profile?.email ?? "Customer"}`,
    body: `${formatINRPlain(Math.abs(amount))} ${verb}.\nBalance: ${formatINRPlain(balance)}\n${note}`,
    href: "/admin/wallets",
    user: true,
    userId,
    customerEmail: profile?.email,
    customerPhone: profile?.phone,
    customerTitle: `Wallet ${verb}`,
    customerBody: `${formatINRPlain(Math.abs(amount))} was ${verb} in your wallet.\nBalance: ${formatINRPlain(balance)}\n${note}`,
    metadata: { amount_inr: amount, balance_after_inr: balance, type, note },
  });
}

async function creditWallet(userId: string, amount: number, note: string, refType = "topup", refId?: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: w } = await supabaseAdmin.from("wallets").select("id, balance_inr").eq("user_id", userId).maybeSingle();
  if (!w) return;
  const newBal = Number(w.balance_inr ?? 0) + amount;
  await supabaseAdmin.from("wallets").update({ balance_inr: newBal }).eq("id", w.id);
  await supabaseAdmin.from("wallet_transactions").insert({
    wallet_id: w.id,
    user_id: userId,
    amount_inr: amount,
    balance_after_inr: newBal,
    type: "credit",
    reference_type: refType,
    reference_id: refId ?? null,
    note,
    description: note,
  });
  await notifyWalletEvent(userId, amount, newBal, note, "credit");
}

async function deductWallet(userId: string, amount: number, note: string, orderId?: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: w } = await supabaseAdmin.from("wallets").select("id, balance_inr").eq("user_id", userId).maybeSingle();
  if (!w) return;
  const newBal = Math.max(0, Number(w.balance_inr ?? 0) - amount);
  await supabaseAdmin.from("wallets").update({ balance_inr: newBal }).eq("id", w.id);
  await supabaseAdmin.from("wallet_transactions").insert({
    wallet_id: w.id,
    user_id: userId,
    amount_inr: -amount,
    balance_after_inr: newBal,
    type: "debit",
    reference_type: "order",
    reference_id: orderId ?? null,
    note,
    description: note,
  });
  await notifyWalletEvent(userId, -amount, newBal, note, "debit");
}

export const createCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: CheckoutPayload) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const user = await getUserFromAuthHeader();
    if (!user) throw new Error("You must be signed in to check out.");
    if (!data.items?.length) throw new Error("Cart is empty.");

    const subtotal = data.items.reduce((s, i) => s + Math.max(0, i.price_inr) * Math.max(1, i.qty), 0);
    const gst = data.items.reduce((s, i) => s + (i.price_inr * i.qty * i.gst_percent) / 100, 0);
    let total = Math.round((subtotal + gst) * 100) / 100;

    let discount = 0;
    if (data.coupon_code) {
      const { data: c } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", data.coupon_code.toUpperCase())
        .eq("status", "active")
        .maybeSingle();
      if (c) {
        const val = Number(c.discount_value ?? 0);
        discount = c.discount_type === "percent"
          ? Math.round(((total * val) / 100) * 100) / 100
          : Math.min(total, val);
      }
    }

    let walletApplied = 0;
    if (data.use_wallet) {
      const { data: w } = await supabaseAdmin
        .from("wallets").select("balance_inr, frozen").eq("user_id", user.id).maybeSingle();
      if (w && !w.frozen) {
        walletApplied = Math.min(Number(w.balance_inr ?? 0), Math.max(0, total - discount));
      }
    }

    const payable = Math.max(0, Math.round((total - discount - walletApplied) * 100) / 100);
    const commonOrderNo = orderNumber();
    const invoiceNo = invoiceNumber();

    const orderRows = data.items.map((i, idx) => ({
      order_number: `${commonOrderNo}-${idx + 1}`,
      invoice_number: invoiceNo,
      customer_id: user.id,
      customer_email: data.customer_email,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone ?? null,
      customer_gstin: data.gstin ?? null,
      billing_address_line1: data.billing_address_line1 ?? null,
      billing_address_line2: data.billing_address_line2 ?? null,
      billing_city: data.billing_city ?? null,
      billing_state: data.billing_state ?? null,
      billing_postal_code: data.billing_postal_code ?? null,
      billing_country: data.billing_country ?? null,
      product_id: i.id,
      product_name: i.name,
      quantity: i.qty,
      amount_inr: i.price_inr * i.qty,
      gst_percent: i.gst_percent,
      gst_inr: (i.price_inr * i.qty * i.gst_percent) / 100,
      total_inr: i.price_inr * i.qty * (1 + i.gst_percent / 100),
      status: payable === 0 ? "paid" : "pending",
      payment_method: payable === 0 ? "wallet" : "razorpay",
      coupon_code: data.coupon_code ?? null,
      wallet_applied_inr: idx === 0 ? walletApplied : 0,
      billing_cycle: i.billing,
    }));

    if (data.save_to_profile) {
      await supabaseAdmin.from("profiles").update({
        full_name: data.customer_name,
        phone: data.customer_phone ?? null,
        gstin: data.gstin ?? null,
        address_line1: data.billing_address_line1 ?? null,
        address_line2: data.billing_address_line2 ?? null,
        city: data.billing_city ?? null,
        state: data.billing_state ?? null,
        postal_code: data.billing_postal_code ?? null,
        country: data.billing_country ?? null,
      }).eq("id", user.id);
    }

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("orders").insert(orderRows).select("*");
    if (insErr) throw new Error(insErr.message);
    const orderIds = (inserted ?? []).map((o) => o.id);
    await notifyOrderEvent(user.id, (inserted ?? []) as unknown as Array<Record<string, unknown>>, "created");

    if (payable === 0 && walletApplied > 0) {
      await deductWallet(user.id, walletApplied, `Order ${commonOrderNo}`, orderIds[0]);
      await supabaseAdmin.from("orders").update({ paid_at: new Date().toISOString() }).in("id", orderIds);
      const { data: paidOrders } = await supabaseAdmin.from("orders").select("*").in("id", orderIds);
      if (paidOrders?.length) await issueLicensesForOrders(user.id, paidOrders as unknown as Array<Record<string, unknown>>);
      if (paidOrders?.length) await notifyOrderEvent(user.id, paidOrders as unknown as Array<Record<string, unknown>>, "paid");
      return {
        demo: true, fully_wallet: true,
        order_group: commonOrderNo, order_ids: orderIds,
        payable_inr: 0, wallet_applied_inr: walletApplied, discount_inr: discount,
        invoice_number: invoiceNo,
      };
    }


    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return {
        demo: true, fully_wallet: false,
        razorpay_key_id: null,
        razorpay_order_id: `demo_${Date.now()}`,
        order_group: commonOrderNo, order_ids: orderIds,
        payable_inr: payable, wallet_applied_inr: walletApplied, discount_inr: discount,
        invoice_number: invoiceNo,
      };
    }

    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: Math.round(payable * 100),
        currency: "INR",
        receipt: commonOrderNo,
        notes: { user_id: user.id, order_group: commonOrderNo },
      }),
    });
    if (!rzpRes.ok) throw new Error(`Razorpay order failed: ${await rzpRes.text()}`);
    const rzp = (await rzpRes.json()) as { id: string };

    await supabaseAdmin.from("orders").update({ razorpay_order_id: rzp.id }).in("id", orderIds);

    return {
      demo: false, fully_wallet: false,
      razorpay_key_id: RAZORPAY_KEY_ID,
      razorpay_order_id: rzp.id,
      order_group: commonOrderNo, order_ids: orderIds,
      payable_inr: payable, wallet_applied_inr: walletApplied, discount_inr: discount,
      invoice_number: invoiceNo,
    };
  });

function makeLicenseKey(seed: string) {
  const s = seed.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().padEnd(16, "X");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const mix = (s + rand).slice(0, 16);
  return `INFG-${mix.slice(0, 4)}-${mix.slice(4, 8)}-${mix.slice(8, 12)}-${mix.slice(12, 16)}`;
}

async function issueLicensesForOrders(
  userId: string,
  orders: Array<Record<string, unknown>>,
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const productIds = Array.from(new Set(orders.map((o) => o.product_id).filter(Boolean))) as string[];
  if (!productIds.length) return;
  const { data: products } = await supabaseAdmin
    .from("products").select("id, product_type, name").in("id", productIds);
  const typeById = new Map((products ?? []).map((p) => [p.id as string, p.product_type as string]));

  const rows: Array<Record<string, unknown>> = [];
  for (const o of orders) {
    const pid = o.product_id as string | null;
    if (!pid) continue;
    const ptype = typeById.get(pid);
    if (!ptype || !["license", "saas", "subscription"].includes(ptype)) continue;

    // Skip if a license was already issued for this order
    const { data: existing } = await supabaseAdmin
      .from("module_records").select("id").eq("module", "licenses")
      .contains("metadata", { order_id: o.id as string }).limit(1);
    if (existing && existing.length) continue;

    const cycle = (o.billing_cycle as string) ?? "one-time";
    const expires = new Date();
    if (cycle === "monthly" || cycle === "mo") expires.setMonth(expires.getMonth() + 1);
    else if (cycle === "yearly" || cycle === "yr") expires.setFullYear(expires.getFullYear() + 1);
    else expires.setFullYear(expires.getFullYear() + 1);

    const orderId = o.id as string;
    const key = makeLicenseKey(orderId);
    const tier = cycle === "one-time" ? "annual" : cycle;

    rows.push({
      module: "licenses",
      title: o.product_name,
      subtitle: `License for ${o.order_number}`,
      status: "active",
      owner_id: userId,
      customer_id: userId,
      amount_inr: Number(o.total_inr ?? 0),
      due_at: expires.toISOString(),
      tags: [ptype, cycle],
      metadata: {
        license_key: key,
        tier,
        product_id: pid,
        order_id: orderId,
        order_number: o.order_number,
        invoice_number: o.invoice_number,
        customer_email: o.customer_email,
        customer_name: o.customer_name,
        issued_at: new Date().toISOString(),
        activation_limit: 3,
        activations: 0,
      },
    });
  }
  if (rows.length) await supabaseAdmin.from("module_records").insert(rows as never);
}

async function finalizeOrders(userId: string, orderIds: string[], paymentId: string, orderRef: string) {

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: orders } = await supabaseAdmin.from("orders").select("*").in("id", orderIds);
  if (!orders?.length) throw new Error("Orders not found");

  // Ownership + order-ref binding: every order must belong to the caller and
  // match the razorpay order id that was actually paid for.
  for (const o of orders) {
    if (o.customer_id !== userId) throw new Error("Order does not belong to this user");
    if (!orderRef.startsWith("demo_") && o.razorpay_order_id && o.razorpay_order_id !== orderRef) {
      throw new Error("Order does not match verified payment");
    }
  }

  const totalWalletApplied = orders.reduce((s, o) => s + Number(o.wallet_applied_inr ?? 0), 0);
  const totalPaid = orders.reduce((s, o) => s + Number(o.total_inr ?? 0), 0) - totalWalletApplied;

  await supabaseAdmin.from("orders").update({
    status: "paid",
    payment_id: paymentId,
    razorpay_payment_id: paymentId,
    razorpay_order_id: orderRef,
    paid_at: new Date().toISOString(),
  }).in("id", orderIds);

  if (totalWalletApplied > 0) {
    await deductWallet(userId, totalWalletApplied, `Applied to ${orders[0].order_number}`, orders[0].id);
  }

  try {
    await supabaseAdmin.from("payments").insert({
      user_id: userId,
      order_id: orders[0].id,
      amount_inr: totalPaid,
      method: "razorpay",
      gateway_reference: paymentId,
      status: "success",
    });
  } catch { /* ignore */ }

  for (const o of orders) {
    const cycle = o.billing_cycle;
    if (cycle && cycle !== "one-time") {
      const next = new Date();
      if (cycle === "monthly" || cycle === "mo") next.setMonth(next.getMonth() + 1);
      else if (cycle === "yearly" || cycle === "yr") next.setFullYear(next.getFullYear() + 1);
      try {
        await supabaseAdmin.from("subscriptions").insert({
          customer_id: userId,
          product_id: o.product_id,
          plan: o.product_name,
          amount_inr: Number(o.total_inr),
          billing_cycle: cycle,
          status: "active",
          current_period_end: next.toISOString(),
        });
      } catch { /* ignore */ }
    }
  }

  await issueLicensesForOrders(userId, orders as unknown as Array<Record<string, unknown>>);
  await notifyOrderEvent(userId, orders as unknown as Array<Record<string, unknown>>, "paid");


  return { ok: true, order_ids: orderIds, invoice_number: orders[0].invoice_number };
}

export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator((d: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; order_ids: string[] }) => d)
  .handler(async ({ data }) => {
    const user = await getUserFromAuthHeader();
    if (!user) throw new Error("Unauthorized");
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    if (RAZORPAY_KEY_SECRET) {
      const crypto = await import("crypto");
      const expected = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
        .digest("hex");
      if (expected !== data.razorpay_signature) throw new Error("Invalid payment signature");
    }
    return finalizeOrders(user.id, data.order_ids, data.razorpay_payment_id, data.razorpay_order_id);
  });

export const confirmDemoPayment = createServerFn({ method: "POST" })
  .inputValidator((d: { order_ids: string[]; order_group: string }) => d)
  .handler(async ({ data }) => {
    const user = await getUserFromAuthHeader();
    if (!user) throw new Error("Unauthorized");
    // Only usable when no payment gateway is configured (demo mode).
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Demo payment is disabled — use the payment gateway");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("orders")
      .select("id, customer_id, status")
      .in("id", data.order_ids);
    if (!rows?.length) throw new Error("Orders not found");
    for (const o of rows) {
      if (o.customer_id !== user.id) throw new Error("Order does not belong to this user");
      if (o.status === "paid") throw new Error("Order already paid");
    }
    return finalizeOrders(user.id, data.order_ids, `demo_pay_${Date.now()}`, `demo_${data.order_group}`);
  });

export const createWalletTopup = createServerFn({ method: "POST" })
  .inputValidator((d: { amount_inr: number }) => d)
  .handler(async ({ data }) => {
    const user = await getUserFromAuthHeader();
    if (!user) throw new Error("Unauthorized");
    const amt = Math.max(100, Math.min(500000, Math.round(data.amount_inr)));

    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      await creditWallet(user.id, amt, "Wallet top-up (demo mode)");
      return { demo: true, credited_inr: amt };
    }
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: amt * 100, currency: "INR",
        receipt: `wt_${Date.now()}`,
        notes: { user_id: user.id, purpose: "wallet_topup", amount: amt },
      }),
    });
    if (!rzpRes.ok) throw new Error(`Razorpay error: ${await rzpRes.text()}`);
    const rzp = (await rzpRes.json()) as { id: string };
    return { demo: false, razorpay_key_id: RAZORPAY_KEY_ID, razorpay_order_id: rzp.id, amount_inr: amt };
  });

export const verifyWalletTopup = createServerFn({ method: "POST" })
  .inputValidator((d: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; amount_inr: number }) => d)
  .handler(async ({ data }) => {
    const user = await getUserFromAuthHeader();
    if (!user) throw new Error("Unauthorized");
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    if (RAZORPAY_KEY_SECRET) {
      const crypto = await import("crypto");
      const expected = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
        .digest("hex");
      if (expected !== data.razorpay_signature) throw new Error("Invalid payment signature");
    }
    await creditWallet(user.id, data.amount_inr, "Wallet top-up", "topup", data.razorpay_payment_id);
    return { ok: true, credited_inr: data.amount_inr };
  });
