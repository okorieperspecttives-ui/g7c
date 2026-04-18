"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, CheckCircle2, ShieldCheck, Wallet, Info, AlertTriangle, Timer, Zap, Copy, Check, MessageCircle } from "lucide-react";
import { formatNaira } from "@/lib/products";
import { toast } from "sonner";

interface InstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productPrice: number;
  productName: string;
  isDirectPayment?: boolean;
  onSuccess?: () => void;
  items?: { name: string; quantity: number }[];
}

const InstallmentModal = ({ 
  isOpen, 
  onClose, 
  productPrice, 
  productName, 
  isDirectPayment = false,
  onSuccess,
  items
}: InstallmentModalProps) => {
  const [showAccountDetails, setShowAccountDetails] = useState(isDirectPayment);
  const [copied, setCopied] = useState(false);

  const depositAmount = isDirectPayment ? productPrice : productPrice * 0.4;
  const balanceAmount = productPrice - depositAmount;

  const accountDetails = {
    bank: "Zenith Bank",
    accountNumber: "1234567890",
    accountName: "Global 7CS Energy Limited",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(accountDetails.accountNumber);
    setCopied(true);
    toast.success("Account number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setShowAccountDetails(isDirectPayment);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[130] w-[min(95%,550px)] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-background p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {showAccountDetails ? <CheckCircle2 className="h-6 w-6" /> : <Wallet className="h-6 w-6" />}
              </div>
              <button onClick={handleClose} className="rounded-full bg-secondary p-2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!showAccountDetails ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Reserve & Pay Small Small</h2>
                  <p className="text-muted-foreground mb-8 font-medium">
                    Secure your <span className="text-foreground font-bold">{productName}</span> today with a 40% deposit and pay the balance gradually.
                  </p>

                  {items && items.length > 0 && (
                    <div className="mb-8 p-4 rounded-2xl bg-secondary/30 border border-border">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Items to Reserve</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                        {items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs font-bold text-foreground">
                            <span className="opacity-70">{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 mb-8">
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20">
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Deposit (40%)</p>
                          <p className="text-3xl font-black text-primary">{formatNaira(depositAmount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Balance</p>
                          <p className="text-lg font-bold text-foreground">{formatNaira(balanceAmount)}</p>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[40%]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-3">
                        <Timer className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-foreground">90 Days</p>
                          <p className="text-[11px] font-medium text-muted-foreground">Maximum duration to complete payment.</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-3">
                        <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-foreground">0% Interest</p>
                          <p className="text-[11px] font-medium text-muted-foreground">No extra charges for paying gradually.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-amber-800 leading-relaxed">
                        Important: Product remains our property until fully paid. Reservations not completed within 90 days will be cancelled, and a 10% restocking fee will be deducted from your deposit.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 px-2 text-xs font-bold text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Your reservation is secured and confirmed instantly.</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setShowAccountDetails(true)}
                      className="w-full rounded-2xl bg-primary py-5 text-base font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      Pay Deposit Now
                    </button>
                    <button 
                      onClick={handleClose}
                      className="w-full rounded-2xl border border-border bg-secondary py-5 text-base font-bold text-foreground transition-all hover:bg-border"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">Payment Details</h2>
                  <p className="text-muted-foreground mb-8 font-medium">
                    Please make a payment of <span className="text-primary font-black">{formatNaira(depositAmount)}</span> to the account below to {isDirectPayment ? 'complete your order' : 'secure your reservation'}.
                  </p>

                  <div className="space-y-4 mb-10">
                    <div className="p-8 rounded-[2rem] bg-secondary/30 border border-border space-y-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <CreditCard className="h-24 w-24" />
                      </div>
                      
                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Bank Name</p>
                        <p className="text-xl font-bold text-foreground">{accountDetails.bank}</p>
                      </div>

                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Account Name</p>
                        <p className="text-xl font-bold text-foreground">{accountDetails.accountName}</p>
                      </div>

                      <div 
                        onClick={handleCopy}
                        className="relative z-10 cursor-pointer p-4 rounded-2xl bg-background border border-primary/20 flex items-center justify-between group/copy transition-all hover:border-primary active:scale-[0.98]"
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Account Number</p>
                          <p className="text-2xl font-black text-foreground tracking-wider">{accountDetails.accountNumber}</p>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover/copy:bg-primary group-hover/copy:text-white transition-all">
                          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                      <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-primary leading-relaxed">
                        After making the transfer, please send your proof of payment to our WhatsApp support for instant confirmation of your reservation.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => {
                        const message = `I've made a ${isDirectPayment ? 'full payment' : 'deposit'} of ${formatNaira(depositAmount)} for ${productName}`;
                        window.open(`https://wa.me/2347079488124?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full rounded-2xl bg-[#25D366] py-5 text-base font-black uppercase tracking-widest text-white shadow-xl shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                    >
                      <MessageCircle className="h-5 w-5 fill-current" />
                      Send Proof on WhatsApp
                    </button>
                    {onSuccess && (
                      <button 
                        onClick={() => {
                          onSuccess();
                          onClose();
                        }}
                        className="w-full rounded-2xl border-2 border-primary bg-primary/5 py-5 text-base font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/10 active:scale-95"
                      >
                        I've Made the Transfer
                      </button>
                    )}
                    {!isDirectPayment && (
                      <button 
                        onClick={() => setShowAccountDetails(false)}
                        className="w-full rounded-2xl border border-border bg-secondary py-5 text-base font-bold text-foreground transition-all hover:bg-border"
                      >
                        Back
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InstallmentModal;
