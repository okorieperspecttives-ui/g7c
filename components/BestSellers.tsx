import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/supabase/products";
import { ProductDetail } from "@/lib/types";

const BestSellers = async () => {
  let products: ProductDetail[] = [];
  
  try {
    products = await getFeaturedProducts(4);
  } catch (err) {
    console.error("Failed to fetch best sellers:", err);
    return null; // Silently hide if error occurs for better UX on home
  }

  if (products.length === 0) return null;

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
