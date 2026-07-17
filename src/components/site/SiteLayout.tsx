import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { AnnouncementTicker } from "./AnnouncementTicker";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";

import { CmsSeo } from "@/lib/cms";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <CmsSeo />
      <AnnouncementTicker />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloatButton />
    </div>
  );
}
