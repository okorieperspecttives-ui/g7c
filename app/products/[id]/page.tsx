"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, formatNaira } from "@/lib/products";
import { ChevronLeft, ShoppingCart, CreditCard, ShieldCheck, Zap, Battery } from "lucide-react";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[color:var(--background)] pt-24">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--primary)]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Product Image Gallery Placeholder */}
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-block w-fit rounded-full bg-[color:var(--primary)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--primary)]">
              {product.category}
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-[color:var(--muted-foreground)] sm:text-xl">
              {product.description}
            </p>

            <div className="mb-10 flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[color:var(--primary)]">
                {formatNaira(product.price)}
              </span>
              <span className="text-xl text-[color:var(--muted-foreground)] line-through opacity-50">
                {formatNaira(product.originalPrice)}
              </span>
            </div>

            {/* Features List */}
            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                    {i % 3 === 0 ? <ShieldCheck className="h-4 w-4" /> : i % 3 === 1 ? <Zap className="h-4 w-4" /> : <Battery className="h-4 w-4" />}
                  </div>
                  <span className="text-sm font-medium text-[color:var(--foreground)]">{feature}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="flex cursor-pointer flex-1 items-center justify-center gap-3 rounded-2xl bg-[color:var(--primary)] py-5 text-base font-bold text-[color:var(--primary-foreground)] transition-all hover:scale-[1.02] active:scale-95">
                <ShoppingCart className="h-5 w-5" />
                Buy Now
              </button>
              <button className="flex cursor-pointer flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-[color:var(--primary)] py-5 text-base font-bold text-[color:var(--primary)] transition-all hover:bg-[color:var(--primary)]/10 active:scale-95">
                <CreditCard className="h-5 w-5" />
                Installment
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-[color:var(--muted-foreground)] sm:text-left">
              Secure payments powered by local gateways. 12-month warranty included.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
