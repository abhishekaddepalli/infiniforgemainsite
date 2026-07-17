import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/affiliate-templates")({
  head: () => ({ meta: [{ title: "Affiliate Marketing Templates — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="affiliate_templates"
      title="Marketing Templates"
      subtitle="Ready-to-share templates affiliates can copy or send via WhatsApp / Email. Use {{link}}, {{code}}, {{name}} as placeholders."
      icon={Sparkles}
      addLabel="New template"
      titleLabel="Template title (e.g. VPS launch — WhatsApp)"
      statuses={["active", "draft", "archived"]}
      amountLabel="Sort order"
      showDueDate={false}
      metaFields={[
        { key: "channel", label: "Channel (whatsapp / email / instagram / linkedin / post)" },
        { key: "body", label: "Message body — use {{link}} {{code}} {{name}}", type: "textarea" },
        { key: "cta", label: "Call-to-action label" },
        { key: "category", label: "Product category (hosting / saas / licenses / all)" },
        { key: "notes", label: "Notes for affiliates", type: "textarea" },
      ]}
      features={[
        "Multi-channel templates (WhatsApp/Email/Social)",
        "Dynamic placeholders for affiliate link & code",
        "Category-targeted messaging",
        "Draft / archive workflow",
        "One-click share for affiliates",
      ]}
    />
  ),
});
