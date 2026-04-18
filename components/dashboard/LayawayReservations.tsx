"use client";

import { useEffect, useState } from "react";
import { getMyReservations } from "@/lib/actions/layaway";
import { formatNaira } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Timer, ArrowRight, Loader2, CheckCircle2, AlertTriangle, Wallet, X, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { getPublicUrl } from "@/lib/supabase";
import PaymentModal from "./PaymentModal";
import CancellationModal from "./CancellationModal";

export default function LayawayReservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [selectedCancelReservation, setSelectedCancelReservation] = useState<any>(null);

  const fetchReservations = async (silent = false) => {
    if (!silent) setIsLoading(true);
    const { reservations: data, error } = await getMyReservations();
    if (!error) {
      setReservations(data || []);
    }
    if (!silent) setIsLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handlePaymentSuccess = () => {
    fetchReservations(true); // Silent refresh
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[2rem] border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeReservations = reservations.filter(r => r.status === 'active');
  const totalPaid = reservations.reduce((sum, r) => sum + Number(r.paid_amount), 0);
  const totalRemaining = activeReservations.reduce((sum, r) => sum + Number(r.remaining_balance), 0);

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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CreditCard className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground mb-1">Pay Small Small</h2>
              <p className="text-muted-foreground font-medium">
                {activeReservations.length > 0 
                  ? `You have ${activeReservations.length} items in Pay Small Small`
                  : "No active reservations"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-12">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-black text-emerald-500">{formatNaira(totalPaid)}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Balance</p>
              <p className="text-2xl font-black text-primary">{formatNaira(totalRemaining)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="h-6 w-6" />
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground">My Reservations</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {activeReservations.length} Active Plans
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

              {reservations.filter(r => r.status !== 'cancelled').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-6 rounded-full bg-secondary p-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-foreground">No reservations yet</h3>
                  <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                    Secure your products today with a 40% deposit and pay the balance gradually.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reservations
                    .filter(r => r.status !== 'cancelled')
                    .map((res) => (
                      <ReservationCard 
                        key={res.id} 
                        reservation={res} 
                        onPay={() => setSelectedReservation(res)} 
                        onCancel={() => setSelectedCancelReservation(res)}
                      />
                    ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        reservation={selectedReservation}
        onSuccess={handlePaymentSuccess}
      />

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={!!selectedCancelReservation}
        onClose={() => setSelectedCancelReservation(null)}
        reservation={selectedCancelReservation}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}

function ReservationCard({ reservation, onPay, onCancel }: { reservation: any; onPay: () => void; onCancel: () => void }) {
  const product = reservation.products;
  const total = Number(reservation.total_amount);
  const paid = Number(reservation.paid_amount);
  const remaining = Number(reservation.remaining_balance);
  const progress = (paid / total) * 100;

  const expiresAt = new Date(reservation.expires_at);
  const now = new Date();
  const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const imageUrl = product.main_image 
    ? (product.main_image.startsWith('http') ? product.main_image : getPublicUrl('product-images', product.main_image))
    : "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";

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
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                reservation.status === 'active' ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-500"
              }`}>
                {reservation.status}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
            <span className="text-muted-foreground">Progress ({Math.round(progress)}%)</span>
            <span className="text-primary">{formatNaira(paid)} / {formatNaira(total)}</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        {/* Action / Balance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex justify-between sm:block w-full sm:w-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground sm:mb-1">Remaining</p>
            <p className="text-lg font-black text-foreground">{formatNaira(remaining)}</p>
          </div>
          
          {reservation.status === 'active' ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onCancel}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive transition-all hover:bg-destructive hover:text-white"
                title="Cancel Reservation"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button
                onClick={onPay}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Wallet className="h-4 w-4" />
                <span>Pay Next</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-[10px] justify-end">
              <CheckCircle2 className="h-4 w-4" />
              Fully Paid
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
