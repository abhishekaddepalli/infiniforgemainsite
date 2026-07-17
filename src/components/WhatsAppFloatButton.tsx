import { useState } from "react";
import {
  buildWhatsAppLink,
  formatOrderMessage,
  getWhatsAppConfig,
} from "@/lib/whatsapp";
import { toast } from "sonner";

function makeRef() {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `WA-${y}${m}${day}-${rand}`;
}

export function WhatsAppFloatButton() {
  const cfg = getWhatsAppConfig();
  const [hover, setHover] = useState(false);

  if (!cfg.wa_ordering_enabled || !cfg.wa_ordering_show_header) return null;

  function handleClick() {
    if (!cfg.wa_ordering_number) {
      toast.error("WhatsApp ordering number is not configured yet.");
      return;
    }
    const reference = makeRef();
    const items = [{ name: "General enquiry" }];
    const message = formatOrderMessage(cfg.wa_ordering_greeting, items, {
      template: cfg.wa_ordering_template ?? "premium",
      reference,
    });
    // Do not create an order record here — a click only opens WhatsApp
    // and cannot guarantee the customer actually sent the message.
    toast.success(`Opening WhatsApp · ${reference}`);
    window.open(
      buildWhatsAppLink(cfg.wa_ordering_number, message),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      <div
        className={`hidden sm:flex items-center gap-2 rounded-full bg-background/95 backdrop-blur border border-border shadow-lg pl-4 pr-3 py-2 text-sm font-medium text-foreground transition-all duration-300 ${
          hover ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3 pointer-events-none"
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25D366]" />
        </span>
        Chat with us on WhatsApp
      </div>

      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label="Chat on WhatsApp"
        className="group relative h-14 w-14 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] flex items-center justify-center transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <span className="absolute inset-0 rounded-full ring-1 ring-white/30" />
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="relative h-7 w-7 drop-shadow-sm"
          aria-hidden="true"
        >
          <path d="M19.11 17.29c-.29-.15-1.71-.85-1.97-.94-.26-.1-.46-.15-.65.15-.19.29-.74.94-.91 1.13-.17.19-.34.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.48-.65-.49l-.55-.01c-.19 0-.5.07-.77.36-.26.29-1 1-1 2.42s1.03 2.81 1.17 3c.14.19 2.02 3.09 4.9 4.33.69.3 1.22.47 1.64.6.69.22 1.32.19 1.81.11.55-.08 1.71-.7 1.95-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34zM16.03 5.33c-5.9 0-10.7 4.8-10.7 10.7 0 1.88.49 3.72 1.42 5.34L5 27.33l6.09-1.6a10.66 10.66 0 0 0 4.94 1.26h.01c5.9 0 10.7-4.8 10.7-10.7s-4.81-10.96-10.71-10.96zm0 19.6c-1.55 0-3.08-.42-4.42-1.2l-.32-.19-3.62.95.97-3.53-.21-.34a8.9 8.9 0 0 1-1.36-4.72c0-4.9 3.99-8.89 8.89-8.89s8.89 3.99 8.89 8.89-4 9.03-8.82 9.03z" />
        </svg>
      </button>
    </div>
  );
}
