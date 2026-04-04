"use client";

import { PRODUCTS } from "@/lib/products";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const BestSellers = () => {
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            Best Sellers
          </h2>
          <p className="mt-2 text-lg text-[color:var(--muted-foreground)]">
            Most popular choices for reliable energy backup.
          </p>
        </div>
        <Link
          href="/shop"
          className="group flex items-center gap-2 text-sm font-bold text-[color:var(--primary)] transition-colors hover:opacity-80"
        >
          View All Products
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
