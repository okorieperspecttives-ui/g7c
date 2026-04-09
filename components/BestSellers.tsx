"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/supabase/products";
import { ProductDetail } from "@/lib/types";

const BestSellers = () => {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const data = await getFeaturedProducts(4);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch best sellers:", err);
        setError("Could not load best sellers.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBestSellers();
  }, []);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground font-medium">Loading best sellers...</p>
        </div>
      </section>
    );
  }

  if (error) return null; // Silently hide if error occurs for better UX on home

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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
