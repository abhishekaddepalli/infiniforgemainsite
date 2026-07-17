import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/monitoring")({
  head: () => ({ meta: [{ title: "Monitoring — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="monitoring"
      title="Uptime Monitoring"
      subtitle="Track uptime, response time, SSL expiry and incidents for customer endpoints."
      icon={Activity}
      addLabel="Add monitor"
      titleLabel="Monitor name"
      statuses={["up", "degraded", "down", "paused"]}
      amountLabel="Plan cost (INR)"
      showDueDate={false}
      metaFields={[
        { key: "endpoint_url", label: "Endpoint URL" },
        { key: "check_type", label: "Check type (HTTP / HTTPS / TCP / Ping)" },
        { key: "interval_sec", label: "Check interval (seconds)", type: "number" },
        { key: "alert_email", label: "Alert email" },
        { key: "alert_whatsapp", label: "Alert WhatsApp" },
      ]}
      features={[
        "HTTP / HTTPS / TCP / Ping checks",
        "1-minute granularity",
        "Multi-region probes",
        "SSL expiry warnings",
        "Email, SMS, WhatsApp alerts",
        "Public status pages",
      ]}
    />
  ),
});
