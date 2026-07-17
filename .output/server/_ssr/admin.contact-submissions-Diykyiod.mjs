import { t as supabase } from "./client-CkD8icLT.mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { Bn as Building2, Rt as Inbox, St as Mail, at as Phone, b as Trash2, cn as ExternalLink } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./AdminShell-BefBi3LN.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-CfEwGGLW.mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.contact-submissions-Diykyiod.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["contact-submissions"],
		queryFn: async () => {
			const { data, error } = await supabase.from("module_records").select("id, created_at, status, metadata").eq("module", "contact_submissions").order("created_at", { ascending: false }).limit(200);
			if (error) throw error;
			return data ?? [];
		}
	});
	const setStatus = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("module_records").update({ status }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Updated");
			qc.invalidateQueries({ queryKey: ["contact-submissions"] });
		}
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("module_records").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["contact-submissions"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "text-2xl font-bold flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-6 w-6" }), " Contact submissions"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: "Every enquiry submitted through the public contact form."
		})] }), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading…"
		}) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-10 text-center text-muted-foreground",
			children: "No submissions yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4",
			children: data.map((s) => {
				const m = s.metadata ?? {};
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold",
											children: m.name ?? "Anonymous"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: s.status
										}),
										m.interest && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "text-[10px] bg-primary/15 text-primary border-0",
											children: m.interest
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: formatDistanceToNow(new Date(s.created_at), { addSuffix: true })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-4 text-xs text-muted-foreground",
									children: [
										m.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: `mailto:${m.email}`,
													className: "hover:text-primary",
													children: m.email
												})
											]
										}),
										m.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }),
												" ",
												m.phone
											]
										}),
										m.company && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }),
												" ",
												m.company
											]
										})
									]
								}),
								m.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm bg-secondary/40 rounded-lg p-3 whitespace-pre-wrap",
									children: m.message
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 shrink-0",
							children: [
								m.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `mailto:${m.email}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 mr-1" }), " Reply"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-8 rounded-md border border-input bg-transparent px-2 text-xs",
									value: s.status,
									onChange: (e) => setStatus.mutate({
										id: s.id,
										status: e.target.value
									}),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "new",
											children: "new"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "contacted",
											children: "contacted"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "qualified",
											children: "qualified"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "closed",
											children: "closed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "spam",
											children: "spam"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "text-destructive",
									onClick: () => {
										if (confirm("Delete this submission?")) del.mutate(s.id);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})
							]
						})]
					})
				}, s.id);
			})
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
	title: "Contact submissions",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {})
});
//#endregion
export { SplitComponent as component };
