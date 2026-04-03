"use client";

import { PRODUCTS } from "@/lib/products";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  return (
    <section id="shop-section" className="mx-auto w-full max-w-screen-2xl bg-[color:var(--background)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-center justify-between gap-6 border-b border-[color:var(--border)] pb-8 md:flex-row">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            Our Marketplace
          </h2>
          <p className="mt-2 max-w-lg text-lg text-[color:var(--muted-foreground)]">
            Premium energy storage and solar solutions, curated for your power needs.
          </p>
        </div>
        
        {/* Simple Filters Placeholder */}
        <div className="flex gap-4">
          <button className="cursor-pointer rounded-full border border-[color:var(--primary)] bg-[color:var(--primary)]/10 px-6 py-2 text-sm font-bold text-[color:var(--primary)] transition-all hover:bg-[color:var(--primary)]/20">
            All Products
          </button>
          <button className="cursor-pointer rounded-full border border-[color:var(--border)] px-6 py-2 text-sm font-bold text-[color:var(--foreground)] transition-all hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]">
            Solar Kits
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
