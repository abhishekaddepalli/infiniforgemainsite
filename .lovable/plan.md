## What's broken

When an admin creates a VPS via `Admin → VPS`, only a `module_records` row is written. No order/invoice is generated, no notification is sent, and the customer dashboard has no billing/expiry alert surface.

## Plan

### 1. Admin VPS form — new fields
In `src/routes/admin.vps.tsx` "Add VPS for client" dialog, add a **Billing** section:
- Billing cycle: Monthly / Quarterly / Yearly / One-time
- Payment method: Wallet / Razorpay (online) / Bank transfer / Cash / Marked as paid (free/complimentary)
- Auto-renew: on/off toggle
- GST %: default 18
- Generate invoice on save: on by default
- Send notification to customer: on by default
- Next renewal date (auto-computed from cycle, editable)

Also add a **Quick-fill from hosting plan** dropdown that pulls specs from `src/routes/hosting.tsx` VPS plan presets (Starter/Pro/Business/Enterprise → CPU/RAM/Storage/Bandwidth/Price) so admin can populate specs+price in one click.

### 2. On save — create order + invoice + notification
Extend the `upsert` mutation:
1. Insert/update `module_records` (existing behaviour) — store `billing_cycle`, `auto_renew`, `payment_method` in `metadata`.
2. When creating (not editing) AND `generate_invoice` is on: insert into `orders` with:
   - `product_name`: `"VPS — {title} ({plan})"`
   - `customer_id`, `customer_name`, `customer_email` from profile
   - `amount_inr`, `gst_percent`, `gst_inr`, `total_inr` computed
   - `payment_method`, `billing_cycle`
   - `status`: `"paid"` if method = wallet/marked-paid, else `"pending"`
   - `invoice_number`: auto (uses order_number as fallback)
   - `paid_at`: now() when paid
3. Insert a `notifications` row for the customer: title "New VPS provisioned", body with hostname + due date + amount + pay link `/portal/orders`.
4. If payment_method = wallet: also insert `wallet_transactions` debit + update `wallets.balance_inr`.

### 3. Customer dashboard — VPS + billing alerts
`src/routes/portal.index.tsx` `VpsDashStrip` already lists VPS. Add:
- **Expiry alert banner** at top when any VPS `due_at` ≤ 7 days: amber card with "Renew now" CTA linking to `/portal/vps`.
- On each VPS card, show `billing_cycle`, `auto_renew` badge, and **Renew** button.

### 4. Customer VPS page — renew flow
`src/routes/portal.vps.tsx`:
- Add "Renew" button per instance → opens dialog to pick cycle + payment method (wallet or online), creates a fresh `orders` row (status pending or paid), extends `due_at` by the cycle length.
- Add "Auto-renew" toggle per instance (updates metadata.auto_renew).
- Show billing cycle, next renewal, last paid amount on card.

### 5. Admin VPS list — surface billing
- Show billing cycle + auto-renew chip in the table.
- Add a "Generate invoice" action on each row for VPS created before this change (backfill).
- Add "Mark renewed" quick action that extends `due_at` and creates a paid order.

## Out of scope (later, per user "later I'll add original VPS details")
- Actual VPS API provisioning (Virtualizor/Proxmox).
- Razorpay checkout integration for the renew flow (link to existing `/portal/orders` pay path).
- Auto-renew cron job (will need `pg_cron` job — flagged as follow-up).

## Files to change
- `src/routes/admin.vps.tsx` — billing section, hosting quick-fill, order+notification on save, renew action.
- `src/routes/portal.vps.tsx` — renew dialog, auto-renew toggle, cycle badges.
- `src/routes/portal.index.tsx` — expiry alert banner.
- `src/lib/vps-billing.ts` (new) — shared helpers: cycle→months, computeTotals, HOSTING_VPS_PRESETS, createVpsOrder, createVpsNotification, extendDueDate.

No DB schema changes needed — `orders`, `notifications`, `wallet_transactions`, `module_records.metadata` all support the fields.
