import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/marketing")({
  head: () => ({ meta: [{ title: "Marketing — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="marketing"
      title="Marketing Campaigns"
      subtitle="Email, SMS, WhatsApp and push campaigns with segmentation and tracking."
      icon={Megaphone}
      addLabel="New campaign"
      titleLabel="Campaign name"
      statuses={["draft", "scheduled", "sending", "sent", "paused"]}
      amountLabel="Budget (INR)"
      metaFields={[
        { key: "channel", label: "Channel (Email / SMS / WhatsApp / Push)" },
        { key: "audience", label: "Audience / segment" },
        { key: "subject", label: "Subject / Headline" },
        { key: "body", label: "Message body", type: "textarea" },
        { key: "utm_source", label: "UTM source" },
      ]}
      features={[
        "Email, SMS, WhatsApp & Push",
        "Audience segmentation",
        "Drip campaigns & automation",
        "A/B testing",
        "Open / click / conversion tracking",
        "UTM builder",
      ]}
    />
  ),
});
