import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/ssl")({
  head: () => ({ meta: [{ title: "SSL Certificates — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="ssl"
      title="SSL Certificates"
      subtitle="Issue, install and renew SSL/TLS certificates for customer domains."
      icon={Lock}
      addLabel="Issue SSL"
      titleLabel="Common name (domain)"
      statuses={["active", "pending_validation", "expired", "revoked"]}
      amountLabel="Certificate cost (INR)"
      metaFields={[
        { key: "issuer", label: "Issuer (Let's Encrypt / Sectigo / DigiCert)" },
        { key: "cert_type", label: "Type (DV / OV / EV / Wildcard)" },
        { key: "san_domains", label: "SAN domains (comma separated)", type: "textarea" },
        { key: "validation_method", label: "Validation method (DNS / HTTP / Email)" },
      ]}
      features={[
        "DV, OV, EV & Wildcard support",
        "Auto-renewal via ACME",
        "CSR generation",
        "Expiry & vulnerability alerts",
        "One-click install to hosting",
        "Reseller pricing",
      ]}
    />
  ),
});
