import { getBrands, getCategories, getProductById } from "@/lib/supabase/products";
import ProductForm from "../../new/ProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  const [product, brands, categories] = await Promise.all([
    getProductById(id),
    getBrands(),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

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
            Edit <span className="text-primary text-2xl">Product</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground font-medium">
            Update your energy solution entry details.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <ProductForm brands={brands} categories={categories} initialData={product} />
      </div>
    </div>
  );
}
