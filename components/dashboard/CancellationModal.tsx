"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { formatNaira } from "@/lib/products";
import { cancelPaySmallSmallReservation } from "@/lib/actions/layaway";
import { toast } from "sonner";
import Image from "next/image";
import { getPublicUrl } from "@/lib/supabase";

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
  onSuccess: () => void;
}

export default function CancellationModal({ isOpen, onClose, reservation, onSuccess }: CancellationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!reservation) return null;

  const product = reservation.products;
  const paidAmount = Number(reservation.paid_amount);
  const restockingFee = paidAmount * 0.1;
  const refundAmount = paidAmount - restockingFee;

  const imageUrl = product.main_image 
    ? (product.main_image.startsWith('http') ? product.main_image : getPublicUrl('product-images', product.main_image))
    : "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";

  const handleCancel = async () => {
    setIsSubmitting(true);
    try {
      const { success, error, message } = await cancelPaySmallSmallReservation(reservation.id);
      
      if (success) {
        toast.success(message);
        onSuccess();
        onClose();
      } else {
        toast.error(error || "Failed to cancel reservation.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[150] w-[min(95%,500px)] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] bg-background p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <Trash2 className="h-6 w-6" />
              </div>
              <button onClick={onClose} className="rounded-full bg-secondary p-2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-foreground mb-2">Cancel Reservation</h2>
            <p className="text-muted-foreground mb-8 font-medium">
              Are you sure you want to cancel your reservation for <span className="text-foreground font-bold">{product.name}</span>?
            </p>

            <div className="flex gap-4 items-center mb-8 p-4 rounded-2xl bg-secondary/30 border border-border">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white">
                <Image src={imageUrl} alt={product.name} fill className="object-contain p-2" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                <p className="text-xs font-medium text-muted-foreground">Total Paid: {formatNaira(paidAmount)}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-6 rounded-3xl bg-secondary/30 border border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount Already Paid</span>
                  <span className="font-bold text-foreground">{formatNaira(paidAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-destructive">Restocking Fee (10%)</span>
                  <span className="font-bold text-destructive">-{formatNaira(restockingFee)}</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">Estimated Refund</span>
                  <span className="text-lg font-black text-primary">{formatNaira(refundAmount)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-amber-800 leading-relaxed">
                  Important: This action cannot be undone. The reservation will be cancelled and moved to refunds for manual processing by our team.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                disabled={isSubmitting}
                onClick={handleCancel}
                className="w-full rounded-2xl bg-destructive py-5 text-base font-black uppercase tracking-widest text-white shadow-xl shadow-destructive/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cancelling...
                  </div>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
              <button 
                onClick={onClose}
                className="w-full rounded-2xl border border-border bg-secondary py-5 text-base font-bold text-foreground transition-all hover:bg-border"
              >
                Keep Reservation
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
