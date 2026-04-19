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
import { createOrder } from "@/lib/actions/orders";
import { toast } from "sonner";
import { Copy, Check, Info, AlertTriangle } from "lucide-react";
import { getPublicUrl } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items: cartItems, getSubtotal, clearCart, directCheckoutItem, clearDirectCheckout } = useCartStore();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Use direct checkout item if available, otherwise use cart items
  const checkoutItems = directCheckoutItem ? [directCheckoutItem] : cartItems;
  
  const subtotal = directCheckoutItem 
    ? (directCheckoutItem.markup_price || 0) * directCheckoutItem.quantity 
    : getSubtotal();
    
  const deliveryFee = 5000;
  const total = subtotal + deliveryFee;

  const getImageUrl = (item: CartItem) => {
    const rawImage = item.main_image || "";
    if (!rawImage) return "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";
    if (rawImage.startsWith("http") || rawImage.startsWith("/")) return rawImage;
    return getPublicUrl("product-images", rawImage);
  };

  const accountDetails = {
    bank: "Zenith Bank",
    accountNumber: "1234567890",
    accountName: "Global 7CS Energy Limited",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(accountDetails.accountNumber);
    setCopied(true);
    toast.success("Account number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form (basic check)
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (paymentMethod === "layaway") {
      setIsPaymentModalOpen(true);
      return;
    }

    setIsLoading(true);

    const formData = new FormData(form);
    const shippingAddress = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      whatsapp: formData.get("whatsapp"),
      address: formData.get("address"),
      city: formData.get("city"),
      email: formData.get("email"),
    };

    const result = await createOrder({
      items: checkoutItems,
      totalAmount: total,
      shippingAddress,
      paymentMethod,
    });

    if (result.success) {
      setOrderId(result.orderId || "");
      setIsOrdered(true);
      if (directCheckoutItem) {
        clearDirectCheckout();
      } else {
        clearCart();
      }
      window.scrollTo(0, 0);
    } else {
      toast.error(result.error || "Failed to place order");
    }
    setIsLoading(false);
  };

  const handleInstallmentSuccess = () => {
    setIsLoading(false);
    setIsOrdered(true);
    // orderId will be set by the modal or we can generate one
    setOrderId(`G7C-RES-${Math.floor(100000 + Math.random() * 900000)}`);
    if (directCheckoutItem) {
      clearDirectCheckout();
    } else {
      clearCart();
    }
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
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for choosing Global 7CS. Your {isLayaway ? "reservation" : "order"} reference is <span className="font-bold text-foreground">#{orderId}</span>.
          </p>

          <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm mb-10">
            <div className="p-8 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground uppercase tracking-widest text-xs">Summary</h3>
            </div>
            <div className="p-8 space-y-4">
              {checkoutItems.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.quantity}x {item.name}</span>
                  <span className="text-sm font-bold text-foreground">{formatNaira((item.markup_price || 0) * item.quantity)}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="font-bold text-foreground">Total Paid/Deposit</span>
                <span className="text-xl font-black text-primary">
                  {isLayaway ? formatNaira(total * 0.4) : formatNaira(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-3xl p-8 mb-10 text-left border border-primary/10">
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Next Steps
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                <p>We've sent a confirmation message to your in-app notifications.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                <p>
                  {isLayaway 
                    ? "Go to 'My Reservations' in your dashboard to track your payment progress and make balance payments."
                    : "Our team will contact you within 24 hours to verify your payment and schedule delivery."}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                <p>Keep your order ID (#{orderId}) handy for any inquiries.</p>
              </li>
            </ul>
          </div>

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
              {isLayaway ? "View My Reservations" : "Go to Dashboard"}
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  if (checkoutItems.length === 0) {
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
                    <input required name="fullName" type="text" placeholder="John Doe" className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input required name="phone" type="tel" placeholder="+234 ..." className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WhatsApp Number (Optional)</label>
                  <div className="relative">
                    <MessageCircle className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input name="whatsapp" type="tel" placeholder="+234 ..." className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Delivery Address *</label>
                  <div className="relative">
                    <MapPin className="absolute top-4 left-4 h-4 w-4 text-muted-foreground" />
                    <textarea required name="address" rows={3} placeholder="Street name, Apartment, etc." className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none resize-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">City / State *</label>
                  <input required name="city" type="text" placeholder="Lagos" className="w-full rounded-xl border border-border bg-card py-4 px-4 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input name="email" type="email" placeholder="john@example.com" className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-sm focus:border-primary focus:outline-none" />
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
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className={`relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-5 transition-all ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="transfer" className="sr-only" checked={paymentMethod === 'transfer'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Wallet className="h-5 w-5" />
                    </div>
                    {paymentMethod === 'transfer' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Bank Transfer</p>
                    <p className="text-[11px] font-medium text-muted-foreground">Pay via bank app</p>
                  </div>
                </label>

                <label className={`relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-5 transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="cod" className="sr-only" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Truck className="h-5 w-5" />
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Cash on Delivery</p>
                    <p className="text-[11px] font-medium text-muted-foreground">Pay when you receive</p>
                  </div>
                </label>

                <label className={`relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-5 transition-all ${paymentMethod === 'layaway' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}>
                  <input type="radio" name="payment" value="layaway" className="sr-only" checked={paymentMethod === 'layaway'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Timer className="h-5 w-5" />
                    </div>
                    {paymentMethod === 'layaway' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Pay Small Small</p>
                    <p className="text-[11px] font-medium text-muted-foreground">40% deposit, 90 days</p>
                  </div>
                </label>
              </div>

              <AnimatePresence mode="wait">
                {paymentMethod === 'transfer' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-8 p-8 rounded-3xl bg-primary/5 border border-primary/20"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Info className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-foreground">Bank Account Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 rounded-2xl bg-card border border-border">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Bank Name</p>
                          <p className="font-bold text-foreground">{accountDetails.bank}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-2xl bg-card border border-border">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Account Number</p>
                          <p className="text-xl font-black text-primary tracking-wider">{accountDetails.accountNumber}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-2xl bg-card border border-border">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Account Name</p>
                          <p className="font-bold text-foreground">{accountDetails.accountName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-medium text-amber-700 leading-relaxed">
                        After payment, please allow up to 24 hours for manual verification. We will contact you once your payment is confirmed to schedule shipping.
                      </p>
                    </div>
                  </motion.div>
                )}
                {paymentMethod === 'cod' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-8 p-6 rounded-3xl bg-secondary/30 border border-border flex items-start gap-4"
                  >
                    <Truck className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Cash on Delivery Policy</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Please ensure you have the exact amount ready upon delivery. Our delivery agent will verify the payment before handing over the items.
                      </p>
                    </div>
                  </motion.div>
                )}
                {paymentMethod === 'layaway' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-start gap-4"
                  >
                    <Timer className="h-6 w-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Pay Small Small (Layaway)</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Secure your items with a 40% deposit and pay the balance over 90 days. Items will be shipped once the full balance is paid.
                      </p>
                      <button 
                        type="button"
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
                      >
                        Configure Payment Plan
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-2xl shadow-primary/5">
              <div className="p-8 border-b border-border bg-muted/30">
                <h2 className="text-xl font-black text-foreground mb-6 uppercase tracking-tight">Order Summary</h2>
                <div className="space-y-6">
                  {checkoutItems.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-secondary flex-shrink-0 overflow-hidden border border-border p-2">
                        <img src={getImageUrl(item)} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{item.quantity} × {formatNaira(item.markup_price || 0)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-foreground">{formatNaira((item.markup_price || 0) * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-8 space-y-4 bg-card">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-bold text-foreground">{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-foreground">{formatNaira(deliveryFee)}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Total to Pay</span>
                    <span className="text-4xl font-black text-primary">{formatNaira(total)}</span>
                  </div>
                  {paymentMethod === 'layaway' && (
                    <div className="flex justify-between items-center p-3 rounded-xl bg-primary/5 border border-primary/10 mt-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Initial Deposit (40%)</span>
                      <span className="text-sm font-black text-primary">{formatNaira(total * 0.4)}</span>
                    </div>
                  )}
                </div>

                <button
                  disabled={isLoading || checkoutItems.length === 0}
                  type="submit"
                  className="w-full mt-8 flex items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-base font-black uppercase tracking-widest text-primary-foreground transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {paymentMethod === 'layaway' ? 'Secure with Deposit' : 'Confirm Order'}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-2 pt-6 opacity-50">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Secure Encryption</span>
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
        productName={directCheckoutItem ? directCheckoutItem.name : "your entire cart"}
        isDirectPayment={paymentMethod === 'transfer'}
        onSuccess={handleInstallmentSuccess}
        items={checkoutItems.map(item => ({ 
          id: item.id, 
          name: item.name, 
          quantity: item.quantity,
          price: item.markup_price || 0 
        }))}
      />
    </main>
  );
}
