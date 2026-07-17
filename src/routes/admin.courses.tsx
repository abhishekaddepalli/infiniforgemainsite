import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/courses")({
  head: () => ({ meta: [{ title: "Courses — Infiniforge Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <Outlet />,
});
