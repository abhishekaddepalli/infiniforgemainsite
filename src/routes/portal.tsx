import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Wallet, ShoppingBag, Ticket, LogOut, Zap, RefreshCw,
  LayoutDashboard, Key, Download, User as UserIcon, Users, GraduationCap, Crown, Server,
} from "lucide-react";
import { useAuth, type RoleKey } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BrandFooter } from "@/components/BrandFooter";
import { NotificationBell } from "@/components/NotificationBell";

export const Route = createFileRoute("/portal")({
  head: () => ({ meta: [{ title: "My Portal — Infiniforge" }, { name: "robots", content: "noindex" }] }),
  component: PortalLayout,
});

const ROLE_LABEL: Record<RoleKey, string> = {
  super_admin: "Super Admin", admin: "Admin", sales_manager: "Sales Manager",
  support: "Support", finance: "Finance", employee: "Employee",
  reseller: "Reseller Partner", customer: "Customer", affiliate: "Affiliate Partner",
};

type NavItem = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

const MAIN_ITEMS: NavItem[] = [
  { title: "Dashboard", url: "/portal", icon: LayoutDashboard },
  { title: "Orders", url: "/portal/orders", icon: ShoppingBag },
  { title: "Subscriptions", url: "/portal/subscriptions", icon: RefreshCw },
  { title: "Licenses", url: "/portal/licenses", icon: Key },
  { title: "Downloads", url: "/portal/downloads", icon: Download },
  { title: "My Courses", url: "/portal/courses", icon: GraduationCap },
  { title: "My VPS", url: "/portal/vps", icon: Server },
];

const ACCOUNT_ITEMS: NavItem[] = [
  { title: "Wallet", url: "/portal/wallet", icon: Wallet },
  { title: "Membership", url: "/portal/membership", icon: Crown },
  { title: "Affiliate Program", url: "/portal/affiliate", icon: Users },
  { title: "Support Tickets", url: "/portal/tickets", icon: Ticket },
  { title: "Profile", url: "/portal/profile", icon: UserIcon },
];

function PortalLayout() {
  const { user, profile, roles, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/40">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center animate-pulse mb-3">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your portal…</p>
        </div>
      </div>
    );
  }

  const primaryRole: RoleKey = roles.includes("affiliate") ? "affiliate" : "customer";
  const initials = (profile?.full_name ?? user.email ?? "?").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const displayName = profile?.full_name ?? user.email?.split("@")[0] ?? "User";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/40">
        <PortalSidebar
          primaryRole={primaryRole}
          initials={initials}
          displayName={displayName}
          roleLabel={ROLE_LABEL[primaryRole]}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-20 h-14 flex items-center gap-3 border-b border-border bg-background/85 backdrop-blur px-4">
            <SidebarTrigger />
            <Link to="/" className="flex items-center gap-2 md:hidden">
              <span className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="font-bold text-sm">Infiniforge</span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <NotificationBell />
              <Button variant="outline" size="sm" asChild><Link to="/products">Shop</Link></Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => { await signOut(); toast.success("Signed out"); navigate({ to: "/" }); }}
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 min-w-0 flex flex-col">
            <div className="flex-1"><Outlet /></div>
            <BrandFooter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function PortalSidebar({
  primaryRole, initials, displayName, roleLabel,
}: { primaryRole: RoleKey; initials: string; displayName: string; roleLabel: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => (url === "/portal" ? pathname === "/portal" : pathname === url || pathname.startsWith(url + "/"));

  const accountItems = ACCOUNT_ITEMS;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/portal" className="flex items-center gap-2.5 px-2 py-2">
          <span className="h-9 w-9 shrink-0 rounded-xl bg-gradient-brand flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          {!collapsed && (
            <div className="leading-none min-w-0">
              <div className="font-bold text-sm truncate">Infiniforge</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">My Portal</div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_ITEMS.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className={cn("flex items-center gap-2 p-2", collapsed && "justify-center")}>
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          {!collapsed && (
            <div className="leading-tight min-w-0">
              <div className="text-xs font-semibold truncate">{displayName}</div>
              <div className="text-[10px] text-muted-foreground truncate">{roleLabel}</div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
