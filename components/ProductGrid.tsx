"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/supabase/products";
import { ProductDetail } from "@/lib/types";
import { Loader2 } from "lucide-react";

const ProductGrid = () => {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load marketplace products.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

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
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Fetching energy solutions...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-destructive font-bold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-sm font-bold text-primary underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
