import { createFileRoute } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/domains")({
  head: () => ({ meta: [{ title: "Domains — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="domains"
      title="Domain Registrations"
      subtitle="Register, transfer, renew and manage DNS for customer domains."
      icon={Globe}
      addLabel="Register / add domain"
      titleLabel="Domain name"
      statuses={["active", "pending_transfer", "expired", "redemption", "cancelled"]}
      amountLabel="Renewal cost (INR)"
      metaFields={[
        { key: "registrar", label: "Registrar" },
        { key: "tld", label: "TLD", placeholder: ".com" },
        { key: "auto_renew", label: "Auto-renew (yes / no)" },
        { key: "nameservers", label: "Nameservers", type: "textarea" },
        { key: "registrant_email", label: "Registrant email" },
      ]}
      features={[
        "Bulk domain search & registration",
        "DNS management",
        "Auto-renewal & expiry alerts",
        "Domain transfer workflow",
        "WHOIS privacy toggle",
        "Reseller pricing tiers",
      ]}
    />
  ),
});
