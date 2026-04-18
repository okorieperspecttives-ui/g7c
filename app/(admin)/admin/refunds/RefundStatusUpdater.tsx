"use client";

import { useState } from "react";
import { updateRefundStatus, deleteRefund } from "../actions";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, Trash2 } from "lucide-react";

export default function RefundStatusUpdater({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setIsLoading(true);
    const result = await updateRefundStatus(id, newStatus);
    if (result.success) {
      toast.success(`Refund marked as ${newStatus}`);
    } else {
      toast.error(result.error || "Failed to update status");
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this refund record? This cannot be undone.")) return;
    
    setIsLoading(true);
    const result = await deleteRefund(id);
    if (result.success) {
      toast.success("Refund record deleted");
    } else {
      toast.error(result.error || "Failed to delete refund record");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : (
        <div className="flex items-center gap-1.5">
          {currentStatus === 'pending' && (
            <>
              <button 
                onClick={() => handleUpdate('processed')}
                className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"
                title="Mark Processed"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleUpdate('failed')}
                className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                title="Mark Failed"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          <button 
            onClick={handleDelete}
            className="p-2 rounded-xl border border-border bg-muted/30 text-muted-foreground hover:bg-destructive hover:text-white transition-all"
            title="Delete Permanently"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
