import { createFileRoute } from "@tanstack/react-router";
import { Server } from "lucide-react";
import { ModuleCrud } from "@/components/admin/ModuleCrud";

export const Route = createFileRoute("/admin/hosting")({
  head: () => ({ meta: [{ title: "Hosting — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <ModuleCrud
      module="hosting"
      title="Hosting Accounts"
      subtitle="Manage shared, reseller and VPS hosting accounts, plans, resources and renewals."
      icon={Server}
      addLabel="Add hosting account"
      titleLabel="Hosting plan / Account"
      statuses={["active", "provisioning", "suspended", "expired", "terminated"]}
      amountLabel="Plan cost (INR)"
      metaFields={[
        { key: "plan_type", label: "Type (Shared / VPS / Reseller)" },
        { key: "primary_domain", label: "Primary domain" },
        { key: "server_ip", label: "Server IP" },
        { key: "disk_gb", label: "Disk (GB)", type: "number" },
        { key: "bandwidth_gb", label: "Bandwidth (GB)", type: "number" },
        { key: "cpanel_user", label: "cPanel / control panel user" },
      ]}
      features={[
        "Shared, Reseller & VPS plans",
        "Auto-provisioning hooks",
        "Resource tracking (disk, RAM, bandwidth)",
        "Suspension & termination workflows",
        "Renewal reminders",
        "White-label branding",
      ]}
    />
  ),
});
