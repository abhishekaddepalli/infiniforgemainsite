export function BrandLoader({ label = "Loading Infiniforge…" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full border-2 border-primary/20" />
        <div className="absolute h-32 w-32 rounded-full border-t-2 border-primary animate-spin" />
        <div className="absolute h-40 w-40 rounded-full bg-gradient-to-br from-[#FF9933]/20 via-transparent to-[#138808]/20 blur-2xl animate-pulse" />
        <img
          src="/pwa-192.png"
          alt="Infiniforge Technologies"
          className="relative h-20 w-20 rounded-2xl shadow-xl animate-[pulse_2s_ease-in-out_infinite]"
        />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <div className="text-sm font-semibold tracking-wide bg-gradient-to-r from-[#FF9933] via-primary to-[#138808] bg-clip-text text-transparent">
          Infiniforge Technologies
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
