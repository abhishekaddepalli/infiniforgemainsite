import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import {
  LayoutDashboard, Package, Boxes, Users, Receipt, Wallet, Ticket, Settings,
  Bell, Search, ShoppingCart, RefreshCw, CreditCard, Server, Shield, Zap,
  Menu, Sparkles, LogOut, FolderTree, Tag, ScrollText, KeyRound, Globe,
  Lock, Activity, Wrench, MessageCircle, Megaphone, FileText, BarChart3,
  Share2, Handshake, Layers, Cloud, DatabaseBackup, Smartphone, GraduationCap,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth, type RoleKey } from "@/hooks/use-auth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { BrandFooter } from "@/components/BrandFooter";
import { NotificationBell } from "@/components/NotificationBell";

const STAFF: RoleKey[] = ["super_admin", "admin", "sales_manager", "support", "finance", "employee"];
const SALES: RoleKey[] = ["super_admin", "admin", "sales_manager"];
const FIN: RoleKey[] = ["super_admin", "admin", "finance"];
const OPS: RoleKey[] = ["super_admin", "admin"];

export const ADMIN_ROUTE_ROLES: Record<string, RoleKey[]> = {
  "/admin": STAFF,
  "/admin/orders": ["super_admin", "admin", "sales_manager", "finance"],
  "/admin/invoices": FIN,
  "/admin/payments": FIN,
  "/admin/products": SALES,
  "/admin/digital-products": SALES,
  "/admin/licenses": SALES,
  "/admin/services": SALES,
  "/admin/categories": SALES,
  "/admin/coupons": SALES,
  "/admin/courses": SALES,
  "/admin/memberships": OPS,
  "/admin/memberships/users": OPS,
  "/admin/subscriptions": ["super_admin", "admin", "sales_manager", "finance"],
  "/admin/wallets": FIN,
  "/admin/users": OPS,
  "/admin/roles": ["super_admin"],
  "/admin/audit-logs": OPS,
  "/admin/tickets": ["super_admin", "admin", "support"],
  "/admin/ticket-workflows": ["super_admin", "admin"],
  "/admin/employees": OPS,
  "/admin/servers": OPS,
  "/admin/vps": OPS,
  "/admin/hosting": OPS,
  "/admin/domains": OPS,
  "/admin/ssl": OPS,
  "/admin/monitoring": OPS,
  "/admin/amc": OPS,
  "/admin/infrastructure-reports": OPS,
  "/admin/crm": ["super_admin", "admin", "sales_manager"],
  "/admin/affiliates": ["super_admin", "admin", "sales_manager", "finance"],
  "/admin/affiliate-applications": ["super_admin", "admin", "sales_manager"],
  "/admin/affiliate-rules": ["super_admin", "admin", "sales_manager", "finance"],
  "/admin/affiliate-templates": ["super_admin", "admin", "sales_manager"],
  
  "/admin/marketing": ["super_admin", "admin", "sales_manager"],
  "/admin/whatsapp": ["super_admin", "admin", "sales_manager", "support"],
  "/admin/whatsapp-orders": ["super_admin", "admin", "sales_manager", "support"],
  "/admin/cms": OPS,
  "/admin/contact-submissions": ["super_admin", "admin", "sales_manager", "support"],
  "/admin/reports": ["super_admin", "admin", "finance"],
  "/admin/backup": ["super_admin"],
  "/admin/pwa": ["super_admin"],
  "/admin/settings": OPS,
};

const navGroups: { label: string; items: { label: string; icon: typeof Package; to: string }[] }[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
      { label: "Reports", icon: BarChart3, to: "/admin/reports" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", icon: Package, to: "/admin/products" },
      { label: "Digital Products", icon: Layers, to: "/admin/digital-products" },
      { label: "Licenses", icon: KeyRound, to: "/admin/licenses" },
      { label: "Services", icon: Boxes, to: "/admin/services" },
      { label: "Categories", icon: FolderTree, to: "/admin/categories" },
      { label: "Coupons", icon: Tag, to: "/admin/coupons" },
      { label: "Courses", icon: GraduationCap, to: "/admin/courses" },
      { label: "Memberships", icon: Sparkles, to: "/admin/memberships" },
      { label: "Membership Users", icon: Users, to: "/admin/memberships/users" },
    ],
  },
  {
    label: "Sales & Billing",
    items: [
      { label: "Orders", icon: ShoppingCart, to: "/admin/orders" },
      { label: "Subscriptions", icon: RefreshCw, to: "/admin/subscriptions" },
      { label: "Invoices", icon: Receipt, to: "/admin/invoices" },
      { label: "Payments", icon: CreditCard, to: "/admin/payments" },
      { label: "Wallets", icon: Wallet, to: "/admin/wallets" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { label: "Servers", icon: Server, to: "/admin/servers" },
      { label: "VPS Instances", icon: Cpu, to: "/admin/vps" },
      { label: "Hosting", icon: Cloud, to: "/admin/hosting" },
      { label: "Domains", icon: Globe, to: "/admin/domains" },
      { label: "SSL Certificates", icon: Lock, to: "/admin/ssl" },
      { label: "Monitoring", icon: Activity, to: "/admin/monitoring" },
      { label: "AMC", icon: Wrench, to: "/admin/amc" },
      { label: "Infra Reports", icon: BarChart3, to: "/admin/infrastructure-reports" },
    ],
  },
  {
    label: "Growth",
    items: [
      { label: "CRM", icon: Handshake, to: "/admin/crm" },
      { label: "Affiliates", icon: Share2, to: "/admin/affiliates" },
      { label: "Affiliate Applications", icon: Handshake, to: "/admin/affiliate-applications" },
      { label: "Commission Rules", icon: Sparkles, to: "/admin/affiliate-rules" },
      { label: "Marketing Templates", icon: Megaphone, to: "/admin/affiliate-templates" },
      
      { label: "Marketing", icon: Megaphone, to: "/admin/marketing" },
      { label: "WhatsApp", icon: MessageCircle, to: "/admin/whatsapp" },
      { label: "WhatsApp Orders", icon: MessageCircle, to: "/admin/whatsapp-orders" },
      { label: "Site CMS", icon: FileText, to: "/admin/cms" },
      { label: "Contact Inbox", icon: MessageCircle, to: "/admin/contact-submissions" },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Tickets", icon: Ticket, to: "/admin/tickets" },
      { label: "Ticket Workflows", icon: Wrench, to: "/admin/ticket-workflows" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Users", icon: Users, to: "/admin/users" },
      { label: "Employees", icon: Handshake, to: "/admin/employees" },
      { label: "Roles & Access", icon: Shield, to: "/admin/roles" },
      { label: "Audit Logs", icon: ScrollText, to: "/admin/audit-logs" },
      { label: "Backup & Restore", icon: DatabaseBackup, to: "/admin/backup" },
      { label: "PWA / Install App", icon: Smartphone, to: "/admin/pwa" },
      { label: "Settings", icon: Settings, to: "/admin/settings" },
    ],
  },
];

export function AdminShell({
  title,
  requiredRoles,
  children,
}: {
  title?: string;
  requiredRoles?: RoleKey[];
  children: ReactNode;
}) {
  const { user, profile, loading, isStaff, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openNav, setOpenNav] = useState(false);

  const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const allowed = requiredRoles ?? ADMIN_ROUTE_ROLES[normalizedPathname];
  const hasRouteAccess = !allowed || roles.some((r) => allowed.includes(r));

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    if (!isStaff) {
      toast.error("You don't have permission to access the admin console.");
      navigate({ to: "/" });
      return;
    }
    if (!hasRouteAccess) {
      toast.error("Your role can't access this page.");
      navigate({ to: "/admin" });
    }
  }, [user, isStaff, hasRouteAccess, loading, navigate]);

  if (loading || !user || !isStaff || !hasRouteAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/40">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center animate-pulse mb-3">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Loading admin console…</p>
        </div>
      </div>
    );
  }

  const initials = (profile?.full_name ?? user.email ?? "?").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="admin-shell flex min-h-screen w-full max-w-full bg-secondary/40">
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 max-w-[85vw] shrink-0 bg-gradient-dashboard text-sidebar-foreground transition-transform flex flex-col",
        openNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}>
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-white/10 shrink-0">
          <img src="/pwa-192.png" alt="Infiniforge" className="h-10 w-10 rounded-xl object-contain bg-white/90 p-0.5 ring-1 ring-white/20" />

          <div className="min-w-0 leading-none">
            <div className="font-bold text-white text-sm">Infiniforge</div>
            <div className="truncate text-[10px] uppercase tracking-[0.18em] text-white/50">Admin Console</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {navGroups.map((group) => {
            const visible = group.items.filter((n) => {
              const need = ADMIN_ROUTE_ROLES[n.to];
              return !need || roles.some((r) => need.includes(r));
            });
            if (visible.length === 0) return null;
            return (
              <div key={group.label} className="space-y-0.5">
                <div className="px-3 py-1 text-[10px] uppercase font-semibold tracking-wider text-white/40">{group.label}</div>
                {visible.map((n) => {
                  const active = n.to === "/admin" ? pathname === "/admin" : pathname.startsWith(n.to);
                  return (
                    <Link key={n.to} to={n.to} onClick={() => setOpenNav(false)} className={cn(
                      "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-white/10 text-white shadow-sm" : "text-white/60 hover:text-white hover:bg-white/5",
                    )}>
                      <n.icon className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 flex-1 truncate text-left">{n.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
          <div className="glass !bg-white/5 border-white/10 rounded-2xl p-4 mt-2">
            <div className="flex items-center gap-2 text-primary-glow text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Enterprise plan
            </div>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">All modules unlocked. White-label ready.</p>
          </div>
        </nav>
      </aside>

      {openNav && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpenNav(false)} />}

      <div className="flex-1 min-w-0 max-w-full">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-8">
          <button className="lg:hidden h-9 w-9 rounded-lg border border-border flex items-center justify-center shrink-0" onClick={() => setOpenNav(true)}>
            <Menu className="h-4 w-4" />
          </button>
          <div className="relative flex-1 min-w-0 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-9 h-9 bg-secondary border-transparent" />
          </div>
          <Button variant="outline" size="sm" className="hidden md:flex shrink-0" asChild>
            <Link to="/">View site</Link>
          </Button>
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex min-w-0 items-center gap-2 pl-2 border-l border-border hover:opacity-80">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-semibold">{initials}</div>
                <div className="hidden min-w-0 max-w-40 sm:block leading-tight text-left">
                  <div className="truncate text-xs font-semibold">{profile?.full_name ?? user.email?.split("@")[0]}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{user.email}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to="/admin">Dashboard</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/admin/users">Users</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/admin/roles">Roles</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 min-w-0 max-w-full">
          {title && <h1 className="sr-only">{title}</h1>}
          {children}
        </div>
        <BrandFooter />
      </div>
    </div>
  );
}
