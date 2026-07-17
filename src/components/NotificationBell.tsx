import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, MessageCircle, ShoppingCart, Ticket, ExternalLink, Inbox, LogIn, Wallet, UserCog, ScrollText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { playAlertTone } from "@/lib/alert-sound";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

type Notif = {
  id: string;
  kind: "whatsapp" | "order" | "ticket" | "contact" | "login" | "wallet" | "profile" | "audit" | "system";
  title: string;
  subtitle?: string;
  href: string;
  at: string;
  read: boolean;
};

const MAX = 30;

type NotificationRow = {
  id: string;
  kind: Notif["kind"] | string;
  title: string;
  body: string | null;
  href: string | null;
  created_at: string;
  read_at: string | null;
};

function mapRow(r: NotificationRow): Notif {
  return {
    id: r.id,
    kind: (r.kind || "system") as Notif["kind"],
    title: r.title,
    subtitle: r.body ?? undefined,
    href: r.href || "/portal",
    at: r.created_at,
    read: Boolean(r.read_at),
  };
}

export function NotificationBell() {
  const { user, isStaff } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const bootRef = useRef(true);

  const push = (n: Notif) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === n.id)) return prev;
      return [n, ...prev].slice(0, MAX);
    });
    if (!bootRef.current) {
      playAlertTone();
      toast(n.title, { description: n.subtitle });
    }
  };

  useEffect(() => {
    // Give the initial subscription a moment before enabling alerts, so we don't
    // beep for events that arrive during reconnection replay.
    const t = setTimeout(() => { bootRef.current = false; }, 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!user) { setItems([]); return; }
    let alive = true;

    async function loadNotifications() {
      let q = supabase
        .from("notifications")
        .select("id,kind,title,body,href,created_at,read_at")
        .order("created_at", { ascending: false })
        .limit(MAX);
      q = isStaff ? q.eq("audience", "staff") : q.eq("audience", "user").eq("user_id", user!.id);
      const { data } = await q;
      if (alive) setItems(((data ?? []) as NotificationRow[]).map(mapRow));
    }
    void loadNotifications();

    const channel = supabase
      .channel(`app-notifications-${isStaff ? "staff" : user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: isStaff ? "audience=eq.staff" : `user_id=eq.${user.id}`,
        },
        (payload) => {
          push(mapRow(payload.new as NotificationRow));
        },
      )
      .subscribe();

    return () => { alive = false; supabase.removeChannel(channel); };
  }, [user, isStaff]);

  const unread = items.filter((i) => !i.read).length;
  const markAllRead = () => {
    setItems((prev) => {
      const next = prev.map((p) => ({ ...p, read: true }));
      return next;
    });
    const ids = items.filter((i) => !i.read).map((i) => i.id);
    if (ids.length) void supabase.from("notifications").update({ read_at: new Date().toISOString() }).in("id", ids);
  };
  const clearAll = () => markAllRead();

  const iconFor = (k: Notif["kind"]) =>
    k === "whatsapp" ? MessageCircle
      : k === "order" ? ShoppingCart
      : k === "contact" ? Inbox
      : k === "login" ? LogIn
      : k === "wallet" ? Wallet
      : k === "profile" ? UserCog
      : k === "audit" ? ScrollText
      : Ticket;

  return (
    <DropdownMenu onOpenChange={(o) => { if (o) markAllRead(); }}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-background">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {items.length > 0 && (
            <button className="text-[11px] text-muted-foreground hover:text-foreground" onClick={clearAll}>Mark read</button>
          )}
        </div>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            You're all caught up. New orders and tickets will show up here in real time.
          </div>
        ) : (
          <div className="py-1">
            {items.map((n) => {
              const Icon = iconFor(n.kind);
              return (
                <Link
                  key={n.id}
                  to={n.href}
                  className="flex gap-3 items-start px-3 py-2 hover:bg-muted/60 transition"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-semibold truncate">{n.title}</div>
                      {!n.read && <Badge variant="secondary" className="h-4 px-1 text-[9px]">new</Badge>}
                    </div>
                    {n.subtitle && <div className="text-[11px] text-muted-foreground truncate">{n.subtitle}</div>}
                    <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(n.at).toLocaleString()}</div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground mt-1" />
                </Link>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationBell;
