"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatNaira, PRODUCTS } from "@/lib/products";
import { Product } from "@/lib/types";
import {
  ChevronLeft,
  ShoppingCart,
  CreditCard,
  ShieldCheck,
  Zap,
  Battery,
  BadgeCheck,
  Star,
  Plus,
  Minus,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useCartStore } from "@/lib/store/useCartStore";
import InstallmentModal from "@/components/InstallmentModal";

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductClient({ product }: { product: Product }) {
  const price = (product as any).markup_price || (product as any).price || 0;
  const originalPrice =
    (product as any).base_price || (product as any).originalPrice || price;
  const image = (product as any).main_image || (product as any).image || "";
  const category =
    (product as any).category_name || (product as any).category || "";
  const brand = (product as any).brand_name || (product as any).brand || "";
  const features = (product as any).features || [];
  const specifications = (product as any).specifications || [];

  // Find related products (same category)
  const relatedProducts = useMemo(() => {
    const sameCategory = PRODUCTS.filter((p) => {
      const pCategory = (p as any).category_name || (p as any).category || "";
      return pCategory === category && p.id !== product.id;
    });

    if (sameCategory.length >= 6) {
      return sameCategory.slice(0, 6);
    }

    const others = PRODUCTS.filter((p) => {
      const pCategory = (p as any).category_name || (p as any).category || "";
      return pCategory !== category && p.id !== product.id;
    });
    // Shuffle others slightly or just take from start
    return [...sameCategory, ...others].slice(0, 6);
  }, [product, category]);

  const [quantity, setQuantity] = useState(1);
  const [isInstallmentOpen, setIsInstallmentOpen] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: image,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs / Back Link */}
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Energy Marketplace
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Product Image Gallery Placeholder */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
              <Image
                src={image}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />
            </div>
            {/* Gallery Thumbnails Placeholder */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square cursor-pointer rounded-2xl border border-border bg-card opacity-50 transition-all hover:border-primary hover:opacity-100"
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                {category}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                4.9 (48 reviews)
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-primary">
                <BadgeCheck className="h-4 w-4" />
                In Stock
              </span>
            </div>

            <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {product.name}
            </h1>
            <p className="mb-6 text-xl font-medium text-muted-foreground">
              Brand: <span className="text-primary font-bold">{brand}</span>
            </p>

            <p className="mb-8 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {product.description}
            </p>

            <div className="mb-10 flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary">
                {formatNaira(price)}
              </span>
              <span className="text-xl text-muted-foreground line-through opacity-50">
                {formatNaira(originalPrice)}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-10 flex items-center gap-4">
              <span className="text-sm font-bold text-foreground uppercase tracking-widest">
                Quantity:
              </span>
              <div className="flex items-center rounded-xl border border-border bg-card p-1">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-xl font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-xl font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleBuyNow}
                className="flex cursor-pointer flex-1 items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-base font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20"
              >
                <ShoppingCart className="h-5 w-5" />
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="flex cursor-pointer flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-primary py-5 text-base font-bold text-primary transition-all hover:bg-primary/10 active:scale-95"
              >
                <Plus className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setIsInstallmentOpen(true)}
                className="flex cursor-pointer flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-border bg-card py-5 text-base font-bold text-foreground transition-all hover:bg-secondary active:scale-95"
              >
                <CreditCard className="h-5 w-5" />
                Installment
              </button>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Secure payments powered by local gateways.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  12-month standard warranty included.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="mt-20">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
            Technical Specifications
          </h2>
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <table className="w-full text-left">
              <tbody>
                {specifications.map((spec: any, i: number) => (
                  <tr
                    key={spec.label}
                    className={i % 2 === 0 ? "bg-background/50" : ""}
                  >
                    <td className="px-6 py-4 text-sm font-bold text-muted-foreground uppercase">
                      {spec.label}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
            Key Features
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature: string, i: number) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {i % 3 === 0 ? (
                    <ShieldCheck className="h-6 w-6" />
                  ) : i % 3 === 1 ? (
                    <Zap className="h-6 w-6" />
                  ) : (
                    <Battery className="h-6 w-6" />
                  )}
                </div>
                <span className="text-lg font-bold text-foreground">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                You May Also Like
              </h2>
              <Link
                href="/shop"
                className="text-sm font-bold text-primary hover:underline"
              >
                View All Marketplace
              </Link>
            </div>

            <div className="relative">
              <div className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="min-w-[280px] sm:min-w-[320px] snap-start"
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {/* Desktop fade indicators */}
              <div className="hidden lg:block absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <InstallmentModal
        isOpen={isInstallmentOpen}
        onClose={() => setIsInstallmentOpen(false)}
        productPrice={price}
        productName={product.name}
      />
    </main>
  );
}
