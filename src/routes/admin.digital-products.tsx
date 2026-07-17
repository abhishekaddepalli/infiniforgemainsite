import { createFileRoute } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/digital-products")({
  head: () => ({ meta: [{ title: "Digital Products — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="digital_products"
      title="Digital Products"
      subtitle="Sell downloadable assets, eBooks, source code, templates, and design files with secure delivery."
      icon={Layers}
      addLabel="Add digital product"
      titleLabel="Product name"
      statuses={["active", "draft", "archived"]}
      amountLabel="Price (INR)"
      showDueDate={false}
      metaFields={[
        { key: "download_url", label: "Download / File URL" },
        { key: "version", label: "Version", placeholder: "1.0.0" },
        { key: "download_limit", label: "Download limit per order", type: "number" },
        { key: "release_notes", label: "Release notes", type: "textarea" },
      ]}
      features={[
        "Secure signed download links",
        "Per-order download limits & expiry",
        "License key auto-generation",
        "Version updates & release notes",
        "Preview & sample files",
        "GST-compliant digital invoices",
      ]}
    />
  ),
});
