"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, AlertTriangle, CheckCircle2, Loader2, CreditCard } from "lucide-react";
import { formatNaira } from "@/lib/products";
import { makeLayawayPayment } from "@/lib/actions/layaway";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, reservation, onSuccess }: PaymentModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!reservation) return null;

  const product = reservation.products;
  const total = Number(reservation.total_amount);
  const paid = Number(reservation.paid_amount);
  const remaining = Number(reservation.remaining_balance);
  const minPayment = total * 0.1;
  const mustPayFull = remaining < minPayment;

  const handlePayment = async () => {
    const paymentAmount = Number(amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error("Please enter a valid payment amount.");
      return;
    }

    // Validation
    if (mustPayFull) {
      if (Math.abs(paymentAmount - remaining) > 0.01) {
        toast.error(`Remaining balance is below the 10% minimum. You must pay the full balance of ${formatNaira(remaining)}.`);
        setAmount(remaining.toString());
        return;
      }
    } else {
      if (paymentAmount < minPayment) {
        toast.error(`Minimum payment is 10% of total cost: ${formatNaira(minPayment)}.`);
        setAmount(minPayment.toString());
        return;
      }
    }

    if (paymentAmount > remaining + 0.01) {
      toast.error(`Payment amount cannot exceed the remaining balance of ${formatNaira(remaining)}.`);
      setAmount(remaining.toString());
      return;
    }

    setIsSubmitting(true);
    try {
      const { success, error, message } = await makeLayawayPayment(reservation.id, paymentAmount);
      
      if (success) {
        toast.success(message);
        onSuccess();
        onClose();
      } else {
        toast.error(error || "Failed to record payment.");
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
            className="fixed left-1/2 top-1/2 z-[150] w-[min(95%,450px)] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] bg-background p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Wallet className="h-6 w-6" />
              </div>
              <button onClick={onClose} className="rounded-full bg-secondary p-2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-foreground mb-2">Make a Payment</h2>
            <p className="text-muted-foreground mb-8 font-medium">
              Adding to your reservation for <span className="text-foreground font-bold">{product.name}</span>.
            </p>

            <div className="space-y-6 mb-8">
              {/* Breakdown */}
              <div className="p-6 rounded-3xl bg-secondary/30 border border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Cost</span>
                  <span className="font-bold text-foreground">{formatNaira(total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Already Paid</span>
                  <span className="font-bold text-emerald-500">{formatNaira(paid)}</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">Remaining Balance</span>
                  <span className="text-lg font-black text-primary">{formatNaira(remaining)}</span>
                </div>
              </div>

              {/* Input */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2">
                  Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-foreground">₦</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={mustPayFull ? remaining.toString() : minPayment.toString()}
                    className="w-full rounded-2xl border border-border bg-card py-4 pl-8 pr-4 text-lg font-black focus:border-primary focus:outline-none"
                  />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground px-2">
                  {mustPayFull 
                    ? `* You must pay the full remaining balance of ${formatNaira(remaining)}.`
                    : `* Minimum payment is ${formatNaira(minPayment)} (10% of total cost).`}
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                <AlertTriangle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-primary leading-relaxed">
                  Your payment will be recorded instantly. Please ensure you complete the full balance within the 90-day window to avoid cancellation fees.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                disabled={isSubmitting || !amount}
                onClick={handlePayment}
                className="w-full rounded-2xl bg-primary py-5 text-base font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Confirm Payment"
                )}
              </button>
              <button 
                onClick={onClose}
                className="w-full rounded-2xl border border-border bg-secondary py-5 text-base font-bold text-foreground transition-all hover:bg-border"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
