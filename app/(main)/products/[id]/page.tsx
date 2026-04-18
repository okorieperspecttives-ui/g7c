import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductClient from "./ProductClient";
import { getProductById } from "@/lib/supabase/products";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id, true);
  
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description || undefined,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: [{ url: product.main_image || "" }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id, true);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
