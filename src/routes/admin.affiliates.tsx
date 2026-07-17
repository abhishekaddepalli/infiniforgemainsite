import { createFileRoute } from "@tanstack/react-router";
import { Handshake } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/affiliates")({
  head: () => ({ meta: [{ title: "Affiliates — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="affiliates"
      title="Affiliate Program"
      subtitle="Manage affiliates, commissions, payouts and marketing creatives."
      icon={Handshake}
      addLabel="Add affiliate"
      titleLabel="Affiliate name"
      statuses={["active", "pending_approval", "suspended", "terminated"]}
      amountLabel="Lifetime commission (INR)"
      metaFields={[
        { key: "affiliate_code", label: "Affiliate code / slug" },
        { key: "commission_percent", label: "Commission %", type: "number" },
        { key: "payout_method", label: "Payout method (UPI / Bank / Wallet)" },
        { key: "contact_email", label: "Contact email" },
      ]}
      features={[
        "Unique affiliate codes & links",
        "Tiered commission %",
        "Real-time click & conversion tracking",
        "UPI / bank payouts",
        "Creative & banner library",
        "Fraud detection",
      ]}
    />
  ),
});
