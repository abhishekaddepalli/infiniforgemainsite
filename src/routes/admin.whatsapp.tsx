import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="whatsapp"
      title="WhatsApp Business"
      subtitle="Manage WhatsApp orders, templates, chatbots and broadcast lists."
      icon={MessageCircle}
      addLabel="New WhatsApp entry"
      titleLabel="Template / Order / Chat"
      statuses={["active", "pending_approval", "rejected", "archived"]}
      amountLabel="Order value (INR)"
      showDueDate={false}
      metaFields={[
        { key: "type", label: "Type (Order / Template / Broadcast / Bot)" },
        { key: "phone", label: "Customer phone", placeholder: "+91…" },
        { key: "template_name", label: "Template name" },
        { key: "message", label: "Message content", type: "textarea" },
      ]}
      features={[
        "Order-by-WhatsApp flow",
        "Approved message templates",
        "Broadcast lists",
        "Chatbot / auto-replies",
        "Order status notifications",
        "Payment link sharing",
      ]}
    />
  ),
});
