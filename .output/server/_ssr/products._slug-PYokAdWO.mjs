import { I as notFound, h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products._slug-PYokAdWO.js
var $$splitComponentImporter = () => import("./products._slug-fu_4AqBW.mjs");
var $$splitNotFoundComponentImporter = () => import("./products._slug-BcA2XS9a.mjs");
var $$splitErrorComponentImporter = () => import("./products._slug-BOFcv3hS.mjs");
var Route = createFileRoute("/products/$slug")({
	head: ({ loaderData }) => {
		const p = loaderData;
		const title = p?.name ? `${p.name} — Infiniforge` : "Product — Infiniforge";
		const desc = p?.description ?? "Buy Infiniforge products with GST invoice, wallet or Razorpay.";
		return { meta: [
			{ title },
			{
				name: "description",
				content: desc
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: desc
			},
			...p?.thumbnail_url ? [{
				property: "og:image",
				content: p.thumbnail_url
			}] : []
		] };
	},
	loader: async ({ params }) => {
		const { data, error } = await supabase.from("products").select("id, name, description, thumbnail_url").eq("slug", params.slug).eq("status", "active").maybeSingle();
		if (error) throw error;
		if (!data) throw notFound();
		return data;
	},
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
