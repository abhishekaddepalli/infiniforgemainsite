import { o as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Badge } from "./badge-Cc0IblCb.mjs";
import { n as useAuth } from "./use-auth-07FyFxK7.mjs";
import { Et as LoaderCircle, H as Send, L as Shield, Sn as Clock, Zn as ArrowLeft, _ as TriangleAlert, d as User, fn as Download } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-DBn9CRiI.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as downloadCsv, t as downloadBlob } from "./download-DhKjMGgD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal.tickets._id-CytC4SdX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TicketDetail() {
	const { id } = useParams({ from: "/portal/tickets/$id" });
	const { user, profile, loading, isStaff } = useAuth();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [msg, setMsg] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	const { data: ticket, isLoading: ticketLoading } = useQuery({
		queryKey: ["ticket", id],
		enabled: !!user,
		queryFn: async () => (await supabase.from("tickets").select("*").eq("id", id).maybeSingle()).data
	});
	const { data: replies } = useQuery({
		queryKey: ["ticket-replies", id],
		enabled: !!user,
		queryFn: async () => (await supabase.from("ticket_replies").select("*").eq("ticket_id", id).order("created_at", { ascending: true })).data ?? []
	});
	const post = useMutation({
		mutationFn: async () => {
			if (!msg.trim()) throw new Error("Message empty");
			const { error } = await supabase.from("ticket_replies").insert({
				ticket_id: id,
				author_id: user.id,
				author_name: profile?.full_name ?? user.email ?? "User",
				is_staff: !!isStaff,
				message: msg
			});
			if (error) throw error;
		},
		onSuccess: () => {
			setMsg("");
			qc.invalidateQueries({ queryKey: ["ticket-replies", id] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" })
	});
	if (!ticketLoading && !ticket) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-8 w-8 text-muted-foreground/60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "Ticket not found or you don't have access."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/portal/tickets",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), " Back to tickets"]
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-secondary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "h-16 border-b border-border bg-background/85 backdrop-blur sticky top-0 z-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl h-full px-4 flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/portal/tickets",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold truncate",
							children: ticket?.subject ?? "Loading…"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground font-mono",
							children: ticket?.ticket_number
						})]
					}),
					ticket && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "capitalize",
						children: ticket.status.replace("_", " ")
					}),
					ticket && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlaChip, {
						due: ticket.sla_due_at,
						resolvedAt: ticket.resolved_at
					}),
					ticket && (replies?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => exportThread(ticket, replies ?? []),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 mr-1" }), " Transcript"]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-6 space-y-4",
			children: [
				ticket?.description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2",
						children: "Original request"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm whitespace-pre-wrap",
						children: ticket.description
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [(replies ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex gap-3", r.author_id === user.id ? "flex-row-reverse" : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-white", r.is_staff ? "bg-gradient-green" : "bg-gradient-brand"),
							children: r.is_staff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("max-w-[75%] rounded-2xl px-4 py-2.5", r.author_id === user.id ? "bg-primary text-primary-foreground" : "bg-card border border-border"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] font-medium mb-0.5 opacity-75",
									children: [
										r.author_name,
										" ",
										r.is_staff && "· Support"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm whitespace-pre-wrap",
									children: r.message
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] opacity-60 mt-1",
									children: new Date(r.created_at).toLocaleString("en-IN")
								})
							]
						})]
					}, r.id)), (replies ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground",
						children: "No replies yet — post the first message below."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky bottom-4 rounded-2xl border border-border bg-card p-3 shadow-elegant",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 3,
						value: msg,
						onChange: (e) => setMsg(e.target.value),
						placeholder: "Write a reply…",
						className: "border-0 focus-visible:ring-0 resize-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "bg-gradient-brand text-white",
							onClick: () => post.mutate(),
							disabled: post.isPending,
							children: post.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 mr-1.5" }), " Send"] })
						})
					})]
				})
			]
		})]
	});
}
function SlaChip({ due, resolvedAt }) {
	if (!due || resolvedAt) return null;
	const diff = new Date(due).getTime() - Date.now();
	if (diff < 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		className: "bg-destructive/15 text-destructive border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 mr-1" }), " Overdue"]
	});
	const h = Math.floor(diff / 36e5);
	const m = Math.floor(diff % 36e5 / 6e4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		className: cn("border-0", diff < 36e5 ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" : "bg-secondary text-muted-foreground"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 mr-1" }),
			" ",
			h,
			"h ",
			m,
			"m"
		]
	});
}
function exportThread(t, replies) {
	const base = `ticket-${t.ticket_number}`;
	downloadCsv([
		["Ticket", t.ticket_number],
		["Subject", t.subject],
		["Status", t.status],
		["Priority", t.priority],
		[],
		[
			"Author",
			"Role",
			"Message",
			"At"
		],
		...replies.map((r) => [
			r.author_name ?? "",
			r.is_staff ? "Support" : "You",
			r.message,
			r.created_at
		])
	], `${base}.csv`);
	const txt = [
		`Ticket ${t.ticket_number}`,
		`Subject: ${t.subject}`,
		"",
		t.description ?? "",
		"",
		"── Conversation ──",
		...replies.map((r) => `\n[${new Date(r.created_at).toLocaleString("en-IN")}] ${r.author_name} (${r.is_staff ? "Support" : "You"}):\n${r.message}`)
	].join("\n");
	downloadBlob(new Blob([txt], { type: "text/plain;charset=utf-8" }), `${base}.txt`);
}
//#endregion
export { TicketDetail as component };
