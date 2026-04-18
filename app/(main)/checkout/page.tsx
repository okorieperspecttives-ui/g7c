"use client";

import { useState } from "react";
import Link from "next/link";
import { formatNaira } from "@/lib/products";
import { useCartStore } from "@/lib/store/useCartStore";
import { CartItem } from "@/lib/types";
import {
  ChevronLeft, 
  ArrowRight, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Home,
  User,
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Wallet,
  Timer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InstallmentModal from "@/components/InstallmentModal";

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderId] = useState(() => `G7C-${Math.floor(100000 + Math.random() * 900000)}`);
  
  const subtotal = getSubtotal();
  const deliveryFee = 5000;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form (basic check)
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      setIsLoading(false);
      return;
    }

    if (paymentMethod === "layaway" || paymentMethod === "transfer") {
      setIsPaymentModalOpen(true);
      setIsLoading(false);
      return;
    }

    // Simulate API call for other methods (if any)
    setTimeout(() => {
      setIsLoading(false);
      setIsOrdered(true);
      clearCart();
      window.scrollTo(0, 0);
    }, 2000);
  };

  const handleInstallmentSuccess = () => {
    setIsLoading(false);
    setIsOrdered(true);
    clearCart();
    window.scrollTo(0, 0);
  };

  if (isOrdered) {
    const isLayaway = paymentMethod === "layaway";
    return (
      <main className="min-h-screen bg-background pt-32 pb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {isLayaway ? "Reservation Confirmed!" : "Order Placed Successfully!"}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Thank you for choosing Global 7CS. Your {isLayaway ? "reservation" : "order"} reference is <span className="font-bold text-foreground">#{orderId}</span>.
          </p>
          <p className="text-muted-foreground mb-10">
            {isLayaway 
              ? "Your items have been reserved. Once we confirm your 40% deposit, you'll be able to track your payment progress in your dashboard."
              : "Our team will contact you shortly via phone or WhatsApp to confirm delivery details and installation requirements."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-8 py-4 text-sm font-bold text-primary transition-all hover:bg-primary/10"
            >
              <Timer className="h-4 w-4" />
              View My Reservations
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-foreground mb-6">Your checkout is empty</h1>
          <Link href="/shop" className="text-primary font-bold hover:underline">Return to Shop</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-12">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
            <ChevronLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Checkout</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {/* Delivery Information */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Truck className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Delivery Information</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name *</label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input required type="text" placeholder="John Doe" className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input required type="tel" placeholder="+234 ..." className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WhatsApp Number (Optional)</label>
                  <div className="relative">
                    <MessageCircle className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input type="tel" placeholder="+234 ..." className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Delivery Address *</label>
                  <div className="relative">
                    <MapPin className="absolute top-4 left-4 h-4 w-4 text-muted-foreground" />
                    <textarea required rows={3} placeholder="Street name, Apartment, etc." className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none resize-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">City / State *</label>
                  <input required type="text" placeholder="Lagos" className="w-full rounded-xl border border-border bg-card py-4 px-4 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input type="email" placeholder="john@example.com" className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CreditCard className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Payment Method</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className={`relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-5 transition-all ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="transfer" className="sr-only" checked={paymentMethod === 'transfer'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Wallet className="h-5 w-5" />
                    </div>
                    {paymentMethod === 'transfer' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Direct Bank Transfer</p>
                    <p className="text-[11px] font-medium text-muted-foreground">Pay via bank app or USSD</p>
                  </div>
                </label>

                <label className={`relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-5 transition-all ${paymentMethod === 'layaway' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="layaway" className="sr-only" checked={paymentMethod === 'layaway'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Timer className="h-5 w-5" />
                    </div>
                    {paymentMethod === 'layaway' && (
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsPaymentModalOpen(true);
                          }}
                          className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                        >
                          View Plan
                        </button>
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Reserve & Pay Small Small</p>
                    <p className="text-[11px] font-medium text-muted-foreground">40% deposit, 90 days to pay</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 rounded-3xl border border-border bg-card overflow-hidden shadow-xl shadow-primary/5">
              <div className="p-8 border-b border-border bg-muted/30">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
                <div className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="flex justify-between gap-4">
                      <span className="text-sm text-muted-foreground flex-1 line-clamp-1">{item.quantity}x {item.name}</span>
                      <span className="text-sm font-bold text-foreground">{formatNaira((item.markup_price || 0) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-8 space-y-4 bg-card">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                 <span className="font-bold text-foreground">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-foreground">{formatNaira(deliveryFee)}</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-baseline">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-3xl font-black text-primary">{formatNaira(total)}</span>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full mt-8 flex items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-base font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {paymentMethod === 'layaway' ? 'Reserve & Pay Small Small' : 'Place Order'}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-2 pt-6">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <InstallmentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        productPrice={total}
        productName="your entire cart"
        isDirectPayment={paymentMethod === 'transfer'}
        onSuccess={handleInstallmentSuccess}
        items={items.map(item => ({ name: item.name, quantity: item.quantity }))}
      />
    </main>
  );
}
