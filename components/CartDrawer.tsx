"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatNaira } from "@/lib/products";
import { useCartStore } from "@/lib/store/useCartStore";
import { useState, useMemo } from "react";
import { getPublicUrl } from "@/lib/supabase";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeFromCart, clearCart, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-[min(90%,400px)] bg-background shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold text-foreground">Your Cart</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground">
                    {items.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {items.map((item) => {
                      const price = (item as any).markup_price || (item as any).price || 0;
                      const rawImage = (item as any).main_image || (item as any).image || "";
                      const brand = (item as any).brand_name || (item as any).brand || "";

                      const imageUrl = (() => {
                        if (!rawImage) return "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";
                        if (rawImage.startsWith("http") || rawImage.startsWith("/")) return rawImage;
                        return getPublicUrl("product-images", rawImage);
                      })();

                      return (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-card">
                            <Image src={imageUrl} alt={item.name} fill className="object-contain p-2" />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.name}</h4>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{item.brand_name || "Generic"}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center rounded-lg border border-border bg-card p-1 scale-90 -ml-2">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="h-6 w-6 flex cursor-pointer items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-foreground">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-6 w-6 flex cursor-pointer items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-primary">{formatNaira(item.markup_price)}</span>
                                <button 
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setShowClearConfirm(true)}
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 py-3 text-xs font-bold text-muted-foreground transition-all hover:bg-secondary hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                      Clear Entire Cart
                    </button>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-6 rounded-full bg-secondary p-8">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">Your cart is empty</h3>
                    <p className="text-sm text-muted-foreground">Explore our marketplace to find reliable energy solutions.</p>
                    <button onClick={onClose} className="mt-8 text-sm font-bold text-primary underline cursor-pointer">Start Shopping</button>
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-border bg-card">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Subtotal</span>
                    <span className="text-2xl font-black text-foreground">{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/cart"
                      onClick={onClose}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary py-4 text-sm font-bold text-primary transition-all hover:bg-primary/10"
                    >
                      View Full Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={onClose}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20"
                    >
                      Checkout Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <p className="mt-6 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                    Secure 256-bit SSL encrypted checkout
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              className="fixed left-1/2 top-1/2 z-[130] w-[min(90%,350px)] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] bg-background p-8 shadow-2xl"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground text-center mb-2">Clear Cart?</h3>
              <p className="text-sm text-muted-foreground text-center mb-8">
                Are you sure you want to remove all items from your cart?
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                  className="w-full rounded-2xl bg-destructive py-4 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                >
                  Yes, Clear Everything
                </button>
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="w-full rounded-2xl border border-border bg-secondary py-4 text-sm font-bold text-foreground transition-all hover:bg-border"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
