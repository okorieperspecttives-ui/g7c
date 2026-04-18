"use client";

import { useEffect, useState } from "react";
import { getMyRefunds } from "@/lib/actions/layaway";
import { formatNaira } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Loader2, X, ShoppingBag, History } from "lucide-react";
import Image from "next/image";
import { getPublicUrl } from "@/lib/supabase";

export default function RefundsSection() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isListOpen, setIsListOpen] = useState(false);

  const fetchRefunds = async () => {
    setIsLoading(true);
    const { refunds: data, error } = await getMyRefunds();
    if (!error) {
      setRefunds(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[2rem] border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingRefunds = refunds.filter(r => r.status === 'pending');
  const totalRefundAmount = refunds.reduce((sum, r) => sum + Number(r.refund_amount), 0);

  return (
    <>
      {/* Summary Card for Dashboard */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsListOpen(true)}
        className="cursor-pointer rounded-[2.5rem] border border-border bg-card p-10 shadow-sm transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <RotateCcw className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground mb-1">My Refunds</h2>
              <p className="text-muted-foreground font-medium">
                {pendingRefunds.length > 0 
                  ? `You have ${pendingRefunds.length} pending refunds`
                  : refunds.length > 0 
                    ? `You have ${refunds.length} total refund records`
                    : "No refund records"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-12">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Refundable</p>
              <p className="text-2xl font-black text-primary">{formatNaira(totalRefundAmount)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <History className="h-6 w-6" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed List Modal */}
      <AnimatePresence>
        {isListOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsListOpen(false)}
              className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[130] w-[min(95%,600px)] bg-background p-8 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                    <RotateCcw className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground">Refund History</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {refunds.length} Refund Records
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsListOpen(false)}
                  className="rounded-full bg-secondary p-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {refunds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-6 rounded-full bg-secondary p-8">
                    <RotateCcw className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-foreground">No refunds found</h3>
                  <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                    Your refund requests will appear here after cancelling a reservation.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {refunds.map((refund) => (
                    <RefundCard key={refund.id} refund={refund} />
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function RefundCard({ refund }: { refund: any }) {
  const product = refund.products;
  const refundAmount = Number(refund.refund_amount);
  const restockingFee = Number(refund.restocking_fee);
  const date = new Date(refund.created_at);

  const imageUrl = product.main_image 
    ? (product.main_image.startsWith('http') ? product.main_image : getPublicUrl('product-images', product.main_image))
    : "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";

  const statusColors: any = {
    pending: "bg-amber-500/10 text-amber-600",
    processed: "bg-emerald-500/10 text-emerald-600",
    failed: "bg-destructive/10 text-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-border bg-card overflow-hidden shadow-sm"
    >
      <div className="p-6 space-y-6">
        {/* Product Info */}
        <div className="flex gap-4 items-center">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white">
            <Image src={imageUrl} alt={product.name} fill className="object-contain p-2" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-foreground truncate">{product.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${statusColors[refund.status]}`}>
                {refund.status}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {date.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Amount Info */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Restocking Fee (10%)</p>
            <p className="text-sm font-bold text-destructive">-{formatNaira(restockingFee)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Refund Amount</p>
            <p className="text-lg font-black text-primary">{formatNaira(refundAmount)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
