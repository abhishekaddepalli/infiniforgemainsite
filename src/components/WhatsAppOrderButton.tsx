import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildWhatsAppLink,
  formatOrderMessage,
  getWhatsAppConfig,
  type WhatsAppLineItem,
} from "@/lib/whatsapp";
import { toast } from "sonner";


type Props = {
  items: WhatsAppLineItem[];
  total_inr?: number;
  customer_name?: string;
  customer_phone?: string;
  note?: string;
  surface?: "product" | "checkout" | "header";
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
  label?: string;
};

function makeRef() {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `WA-${y}${m}${day}-${rand}`;
}

export function WhatsAppOrderButton({
  items, total_inr, customer_name, customer_phone, note,
  surface = "product", className, size = "default", variant = "outline", label,
}: Props) {
  const cfg = getWhatsAppConfig();
  if (!cfg.wa_ordering_enabled) return null;
  if (surface === "product" && !cfg.wa_ordering_show_products) return null;
  if (surface === "checkout" && !cfg.wa_ordering_show_checkout) return null;
  if (surface === "header" && !cfg.wa_ordering_show_header) return null;

  function handleClick() {
    if (!cfg.wa_ordering_number) {
      toast.error("WhatsApp ordering number is not configured yet.");
      return;
    }
    const reference = makeRef();
    const message = formatOrderMessage(cfg.wa_ordering_greeting, items, {
      total_inr, note, customer_name, customer_phone,
      template: cfg.wa_ordering_template ?? "premium",
      reference,
    });
    // Note: we intentionally do NOT insert a WhatsApp order record here.
    // Clicking only opens WhatsApp — no way to confirm the user actually
    // sent the message, so we don't want fake pending orders in the admin.
    // Real orders are captured either via the checkout flow or via the
    // WhatsApp Business webhook once configured.
    toast.success(`Opening WhatsApp · ${reference}`);
    window.open(buildWhatsAppLink(cfg.wa_ordering_number, message), "_blank", "noopener,noreferrer");
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      size={size}
      variant={variant}
      className={`gap-2 ${className ?? ""}`}
    >
      <MessageCircle className="h-4 w-4 text-[#25D366]" />
      {label ?? cfg.wa_ordering_label}
    </Button>
  );
}

