import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl border-4 border-primary/20 animate-pulse"></div>
        <Loader2 className="absolute inset-0 h-16 w-16 animate-spin text-primary stroke-[1.5]" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-lg font-black tracking-tighter uppercase italic">
          Loading <span className="text-primary">Admin</span>
        </p>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Securing your session...
        </p>
      </div>
    </div>
  );
}
