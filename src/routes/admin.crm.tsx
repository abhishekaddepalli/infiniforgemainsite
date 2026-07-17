import { createFileRoute } from "@tanstack/react-router";
import { UserSquare2 } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/crm")({
  head: () => ({ meta: [{ title: "CRM — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="crm"
      title="CRM — Leads & Deals"
      subtitle="Track leads, deals, contacts and pipeline stages across your sales team."
      icon={UserSquare2}
      addLabel="Add lead / deal"
      titleLabel="Lead / Deal name"
      statuses={["new", "contacted", "qualified", "proposal", "won", "lost"]}
      amountLabel="Deal value (INR)"
      metaFields={[
        { key: "contact_name", label: "Contact name" },
        { key: "contact_email", label: "Contact email" },
        { key: "contact_phone", label: "Contact phone" },
        { key: "source", label: "Source (Website / Referral / Ads)" },
        { key: "next_action", label: "Next action", type: "textarea" },
      ]}
      features={[
        "Lead capture from website & WhatsApp",
        "Pipeline stages & drag-drop kanban ready",
        "Deal value & forecast",
        "Contact & company book",
        "Follow-up reminders",
        "Assign to sales reps",
      ]}
    />
  ),
});
