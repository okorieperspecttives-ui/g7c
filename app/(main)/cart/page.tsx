"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, X } from "lucide-react";
import { formatNaira } from "@/lib/products";
import { useCartStore } from "@/lib/store/useCartStore";
import { CartItem } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPublicUrl } from "@/lib/supabase";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getSubtotal, clearDirectCheckout } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = 5000;
  const total = subtotal + deliveryFee;
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    clearDirectCheckout();
  }, [clearDirectCheckout]);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Looks like you haven&apos;t added any energy solutions to your cart yet.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
          <button 
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary/50 px-6 py-3 text-sm font-bold text-muted-foreground transition-all hover:bg-secondary hover:text-destructive active:scale-95"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item: CartItem) => {
              const price = item.markup_price || 0;
              const brand = item.brand_name || "Global 7CS";
              
              const imageUrl = (() => {
                const rawImage = item.main_image || "";
                if (!rawImage) return "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";
                if (rawImage.startsWith("http") || rawImage.startsWith("/")) return rawImage;
                return getPublicUrl("product-images", rawImage);
              })();

              return (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row gap-6 rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/50"
                >
                  <div className="relative h-32 w-full sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
                    <Image src={imageUrl} alt={item.name} fill className="object-contain p-4" />
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{brand}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                      <div className="flex items-center rounded-xl border border-border bg-background p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-10 w-10 flex cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-foreground">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-10 w-10 flex cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Item Total</p>
                        <p className="text-2xl font-black text-primary">{formatNaira(price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline mt-4"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 rounded-3xl border border-border bg-card p-8 shadow-xl shadow-primary/5">
              <h2 className="text-2xl font-bold text-foreground mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-foreground">{formatNaira(deliveryFee)}</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-baseline">
                  <span className="text-lg font-bold text-foreground">Estimated Total</span>
                  <span className="text-3xl font-black text-primary">{formatNaira(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-base font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
                Prices include all applicable taxes and 15% marketplace markup. 
                Secure checkout powered by industry-standard encryption.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showClearConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirm(false)}
              className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 z-[130] w-[min(90%,400px)] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-background p-10 shadow-2xl"
            >
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive mx-auto">
                <Trash2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground text-center mb-2">Clear Cart?</h3>
              <p className="text-lg text-muted-foreground text-center mb-10">
                Are you sure you want to remove all items from your cart? This action cannot be undone.
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                  className="w-full rounded-2xl bg-destructive py-5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-xl shadow-destructive/20"
                >
                  Yes, Clear Everything
                </button>
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="w-full rounded-2xl border border-border bg-secondary py-5 text-base font-bold text-foreground transition-all hover:bg-border"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
