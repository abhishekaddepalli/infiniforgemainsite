import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/licenses")({
  head: () => ({ meta: [{ title: "Software Licenses — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="licenses"
      title="Software Licenses"
      subtitle="Issue, activate, suspend and renew software license keys with domain/device binding."
      icon={KeyRound}
      addLabel="Issue license"
      titleLabel="Product / License name"
      statuses={["active", "trial", "suspended", "expired", "revoked"]}
      amountLabel="License fee (INR)"
      metaFields={[
        { key: "license_key", label: "License key", placeholder: "INFG-XXXX-XXXX-XXXX" },
        { key: "bound_domain", label: "Bound domain / device" },
        { key: "tier", label: "Tier (trial / subscription / lifetime)" },
        { key: "customer_email", label: "Customer email" },
      ]}
      features={[
        "Auto-generate license keys",
        "Domain & device binding",
        "Activation & deactivation tracking",
        "Trial, subscription & lifetime tiers",
        "Renewal reminders",
        "White-label license portal",
      ]}
    />
  ),
});
