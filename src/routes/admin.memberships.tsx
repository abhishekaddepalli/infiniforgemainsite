import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/memberships")({
  head: () => ({ meta: [{ title: "Memberships — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <Outlet />,
});
