import { getBrands, getCategories } from "@/lib/supabase/products";
import ProductForm from "./ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    getBrands(),
    getCategories(),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Add New <span className="text-primary text-2xl">Product</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground font-medium">
            Create a new energy solution entry.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <ProductForm brands={brands} categories={categories} />
      </div>
    </div>
  );
}
