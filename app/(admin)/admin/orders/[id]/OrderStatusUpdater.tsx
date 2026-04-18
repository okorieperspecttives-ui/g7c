"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "../../actions";
import { toast } from "sonner";
import { Loader2, ChevronDown } from "lucide-react";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Order status updated to ${newStatus}`);
      }
    });
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-2 shadow-sm">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Change Status:</span>
        <select
          value={currentStatus}
          disabled={isPending}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-transparent text-sm font-bold text-foreground focus:outline-none cursor-pointer disabled:opacity-50 pr-8 appearance-none"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 h-4 w-4 text-muted-foreground pointer-events-none" />
        {isPending && <Loader2 className="absolute -right-8 h-4 w-4 animate-spin text-primary" />}
      </div>
    </div>
  );
}
