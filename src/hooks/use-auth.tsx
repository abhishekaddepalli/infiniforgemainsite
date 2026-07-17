import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type RoleKey =
  | "super_admin" | "admin" | "sales_manager" | "support" | "finance"
  | "reseller" | "customer" | "affiliate" | "employee";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  avatar_url: string | null;
  location: string | null;
  status: string;
  two_fa_enabled: boolean;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gstin: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  roles: RoleKey[];
  loading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  hasRole: (r: RoleKey) => boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STAFF_ROLES: RoleKey[] = ["super_admin", "admin", "sales_manager", "support", "finance", "employee"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<RoleKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  async function loadUserData(u: User | null) {
    if (!u) { setProfile(null); setRoles([]); setRolesLoading(false); return; }
    setRolesLoading(true);
    try {
      const [{ data: prof }, { data: rs }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", u.id),
      ]);
      // Enforce suspended-account block: sign out immediately.
      if (prof && (prof as Profile).status === "suspended") {
        await supabase.auth.signOut();
        setUser(null); setProfile(null); setRoles([]);
        if (typeof window !== "undefined") {
          const { toast } = await import("sonner");
          toast.error("Your account has been suspended. Contact support.");
        }
        return;
      }
      setProfile(prof as Profile | null);
      setRoles((rs ?? []).map((r) => r.role as RoleKey));
    } finally {
      setRolesLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (event === "SIGNED_OUT") { setProfile(null); setRoles([]); setRolesLoading(false); }
      else if (session?.user) {
        setRolesLoading(true);
        setTimeout(() => { void loadUserData(session.user); }, 0);
      }
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      await loadUserData(data.session?.user ?? null);
      setLoading(false);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const combinedLoading = loading || (!!user && rolesLoading);
  const value = useMemo<AuthContextValue>(() => ({
    user, profile, roles, loading: combinedLoading,
    isAdmin: roles.some((r) => r === "super_admin" || r === "admin"),
    isStaff: roles.some((r) => STAFF_ROLES.includes(r)),
    hasRole: (r) => roles.includes(r),
    signOut: async () => { await supabase.auth.signOut(); },
    refresh: async () => { await loadUserData(user); },
  }), [user, profile, roles, combinedLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
