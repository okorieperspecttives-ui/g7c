"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, CheckCircle2, ShieldCheck, Wallet } from "lucide-react";
import { formatNaira } from "@/lib/products";

interface InstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productPrice: number;
  productName: string;
}

const InstallmentModal = ({ isOpen, onClose, productPrice, productName }: InstallmentModalProps) => {
  const calculatePlan = (months: number) => {
    const interest = 1 + (months * 0.05); // 5% interest per month for demo
    const total = productPrice * interest;
    return Math.round(total / months);
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
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[130] w-[min(90%,500px)] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-background p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CreditCard className="h-6 w-6" />
              </div>
              <button onClick={onClose} className="rounded-full bg-secondary p-2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-2">Flexible Installment Plans</h2>
            <p className="text-muted-foreground mb-8">
              Own the <span className="text-foreground font-bold">{productName}</span> today and pay in manageable monthly installments.
            </p>

            <div className="space-y-4 mb-10">
              {[3, 6, 12].map((months) => (
                <div key={months} className="flex items-center justify-between p-5 rounded-2xl border border-border bg-card hover:border-primary transition-all group">
                  <div>
                    <span className="text-sm font-black text-primary uppercase tracking-widest">{months} Months Plan</span>
                    <p className="text-xl font-bold text-foreground mt-1">{formatNaira(calculatePlan(months))} / month</p>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-border group-hover:border-primary flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 mb-10">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Verified partner financing</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Instant approval for qualified buyers</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => alert("Installment feature coming soon!")}
                className="w-full rounded-2xl bg-primary py-5 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                Proceed with Installment
              </button>
              <button 
                onClick={onClose}
                className="w-full rounded-2xl border border-border bg-secondary py-5 text-base font-bold text-foreground transition-all hover:bg-border"
              >
                Cancel
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Our Trusted Partners</p>
              <div className="flex justify-center gap-6 grayscale opacity-50 text-xs font-black italic">
                <span>CREDIT-PRO</span>
                <span>ENERGY-LEASE</span>
                <span>POWER-PAY</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InstallmentModal;
