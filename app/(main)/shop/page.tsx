import { Suspense } from "react";
import { Metadata } from "next";
import ShopClient from "./ShopClient";
import { getProducts, getCategories, getBrands } from "@/lib/supabase/products";

export const metadata: Metadata = {
  title: "Shop Alternative Energy Products - Inverters, Batteries & More",
  description: "Browse our wide range of high-quality energy solutions. From solar panels to deep-cycle batteries, find everything you need for energy independence.",
};

export default async function ShopPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts(true),
    getCategories(),
    getBrands(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading Marketplace...</div>}>
      <ShopClient 
        initialProducts={products} 
        initialCategories={categories}
        initialBrands={brands}
      />
    </Suspense>
  );
}
