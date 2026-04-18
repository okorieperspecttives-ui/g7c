"use client";

import { useState } from "react";
import { updateReservationStatus, deleteReservation } from "../actions";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, Trash2 } from "lucide-react";

export default function ReservationStatusUpdater({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setIsLoading(true);
    const result = await updateReservationStatus(id, newStatus);
    if (result.success) {
      toast.success(`Reservation marked as ${newStatus}`);
    } else {
      toast.error(result.error || "Failed to update status");
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this reservation? This cannot be undone.")) return;
    
    setIsLoading(true);
    const result = await deleteReservation(id);
    if (result.success) {
      toast.success("Reservation deleted");
    } else {
      toast.error(result.error || "Failed to delete reservation");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : (
        <div className="flex items-center gap-1.5">
          {currentStatus === 'active' && (
            <>
              <button 
                onClick={() => handleUpdate('completed')}
                className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"
                title="Mark Completed"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleUpdate('cancelled')}
                className="p-2 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-all"
                title="Mark Cancelled"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          <button 
            onClick={handleDelete}
            className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
            title="Delete Permanently"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
