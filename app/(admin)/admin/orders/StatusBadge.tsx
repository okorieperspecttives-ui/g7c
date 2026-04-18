export default function StatusBadge({ status }: { status: string }) {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-500/10 text-amber-500";
      case "confirmed":
        return "bg-blue-500/10 text-blue-500";
      case "processing":
        return "bg-purple-500/10 text-purple-500";
      case "shipped":
        return "bg-indigo-500/10 text-indigo-500";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-500";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${getStyles()}`}>
      {status}
    </span>
  );
}
