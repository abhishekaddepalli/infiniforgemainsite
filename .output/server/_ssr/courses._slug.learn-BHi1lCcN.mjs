import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses._slug.learn-BHi1lCcN.js
var $$splitComponentImporter = () => import("./courses._slug.learn-DyMsBqsX.mjs");
var Route = createFileRoute("/courses/$slug/learn")({
	head: () => ({ meta: [{ title: "Learning — Infiniforge" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
