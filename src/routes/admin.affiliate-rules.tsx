import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/affiliate-rules")({
  head: () => ({ meta: [{ title: "Affiliate Commission Rules — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="affiliate_rules"
      title="Commission Rules"
      subtitle="Set commission percentages per category, product or partner tier. Rules shown to affiliates in their dashboard."
      icon={Target}
      addLabel="New rule"
      titleLabel="Rule name (e.g. Hosting — All)"
      statuses={["active", "paused", "expired"]}
      amountLabel="Commission %"
      showDueDate={false}
      metaFields={[
        { key: "scope", label: "Scope (category / product / all)" },
        { key: "category_slug", label: "Category slug (optional)" },
        { key: "product_slug", label: "Product slug (optional)" },
        { key: "min_tier", label: "Minimum partner tier (bronze / silver / gold)" },
        { key: "recurring", label: "Applies to recurring? (yes/no)" },
        { key: "notes", label: "Internal notes", type: "textarea" },
      ]}
      features={[
        "Per-category commission %",
        "Per-product overrides",
        "Recurring vs one-time",
        "Partner tier gating",
        "Effective / expiry dates",
      ]}
    />
  ),
});
