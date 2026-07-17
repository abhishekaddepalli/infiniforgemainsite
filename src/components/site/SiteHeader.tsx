import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Zap, LogOut, LayoutDashboard, User as UserIcon, ShoppingCart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/lib/cart";
import { useCms } from "@/lib/cms";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, profile, isStaff, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { count } = useCart();
  const branding = useCms("branding");
  const header = useCms("header");
  const nav = header.nav ?? [];
  const initials = (profile?.full_name ?? user?.email ?? "?").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  const brandName = branding.brand_name || "Infiniforge";
  const brandParts = brandName.split(" ");

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={branding.logo_url || "/pwa-192.png"}
              alt={brandName}
              className="h-10 w-10 rounded-xl object-contain shadow-elegant ring-1 ring-border/60 bg-white/60"
            />
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-foreground">{brandParts[0]}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{brandParts.slice(1).join(" ") || branding.tagline}</span>
            </span>

          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link key={item.to + item.label} to={item.to} className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                  active ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                )}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link to="/checkout" className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary transition-colors" aria-label="Cart">
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-gradient-brand text-white text-[10px] font-bold flex items-center justify-center">{count}</span>
              )}
            </Link>
            {loading ? null : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-secondary transition-colors">
                    <span className="h-8 w-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-semibold">{initials}</span>
                    <span className="text-sm font-medium">{profile?.full_name?.split(" ")[0] ?? "Account"}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isStaff && (
                    <DropdownMenuItem asChild><Link to="/admin"><LayoutDashboard className="h-4 w-4 mr-2" /> Admin console</Link></DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild><Link to="/portal"><UserIcon className="h-4 w-4 mr-2" /> My portal</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/portal/wallet"><Wallet className="h-4 w-4 mr-2" /> Wallet</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild><Link to="/auth">Sign in</Link></Button>
                <Button size="sm" className="bg-gradient-brand text-white shadow-elegant hover:opacity-95" asChild><Link to={header.cta_link || "/auth"}>{header.cta_label || "Get started"}</Link></Button>
              </>
            )}
          </div>

          <button className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur">
            <div className="px-4 py-3 space-y-1">
              {nav.map((item) => (
                <Link key={item.to + item.label} to={item.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
                  {item.label}
                </Link>
              ))}
              {user && (
                <div className="pt-2 border-t border-border/60 mt-2 space-y-1">
                  <Link to="/portal" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                    <UserIcon className="h-4 w-4" /> My portal
                  </Link>
                  <Link to="/portal/wallet" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                    <Wallet className="h-4 w-4" /> Wallet
                  </Link>
                  <Link to="/checkout" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                    <ShoppingCart className="h-4 w-4" /> Cart {count > 0 && <span className="ml-auto h-5 min-w-5 px-1.5 rounded-full bg-gradient-brand text-white text-[10px] font-bold flex items-center justify-center">{count}</span>}
                  </Link>
                  {isStaff && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                      <LayoutDashboard className="h-4 w-4" /> Admin console
                    </Link>
                  )}
                </div>
              )}
              <div className="pt-2 grid grid-cols-2 gap-2">
                {user ? (
                  <Button size="sm" variant="outline" className="col-span-2" onClick={async () => { setOpen(false); await signOut(); navigate({ to: "/" }); }}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild><Link to="/auth">Sign in</Link></Button>
                    <Button size="sm" className="bg-gradient-brand text-white" asChild><Link to={header.cta_link || "/auth"}>{header.cta_label || "Get started"}</Link></Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
