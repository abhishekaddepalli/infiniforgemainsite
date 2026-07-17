import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CkD8icLT.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-07FyFxK7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
var STAFF_ROLES = [
	"super_admin",
	"admin",
	"sales_manager",
	"support",
	"finance",
	"employee"
];
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [rolesLoading, setRolesLoading] = (0, import_react.useState)(true);
	async function loadUserData(u) {
		if (!u) {
			setProfile(null);
			setRoles([]);
			setRolesLoading(false);
			return;
		}
		setRolesLoading(true);
		try {
			const [{ data: prof }, { data: rs }] = await Promise.all([supabase.from("profiles").select("*").eq("id", u.id).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", u.id)]);
			if (prof && prof.status === "suspended") {
				await supabase.auth.signOut();
				setUser(null);
				setProfile(null);
				setRoles([]);
				if (typeof window !== "undefined") {
					const { toast } = await import("../_libs/sonner.mjs").then((n) => n.n);
					toast.error("Your account has been suspended. Contact support.");
				}
				return;
			}
			setProfile(prof);
			setRoles((rs ?? []).map((r) => r.role));
		} finally {
			setRolesLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		let mounted = true;
		const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
			if (!mounted) return;
			setUser(session?.user ?? null);
			if (event === "SIGNED_OUT") {
				setProfile(null);
				setRoles([]);
				setRolesLoading(false);
			} else if (session?.user) {
				setRolesLoading(true);
				setTimeout(() => {
					loadUserData(session.user);
				}, 0);
			}
		});
		supabase.auth.getSession().then(async ({ data }) => {
			if (!mounted) return;
			setUser(data.session?.user ?? null);
			await loadUserData(data.session?.user ?? null);
			setLoading(false);
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	const combinedLoading = loading || !!user && rolesLoading;
	const value = (0, import_react.useMemo)(() => ({
		user,
		profile,
		roles,
		loading: combinedLoading,
		isAdmin: roles.some((r) => r === "super_admin" || r === "admin"),
		isStaff: roles.some((r) => STAFF_ROLES.includes(r)),
		hasRole: (r) => roles.includes(r),
		signOut: async () => {
			await supabase.auth.signOut();
		},
		refresh: async () => {
			await loadUserData(user);
		}
	}), [
		user,
		profile,
		roles,
		combinedLoading
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
//#endregion
export { useAuth as n, AuthProvider as t };
