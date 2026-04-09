"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/lib/products";
import { Product } from "@/lib/types";
import { ShoppingCart, CreditCard, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useState, useMemo } from "react";
import InstallmentModal from "./InstallmentModal";
import { getPublicUrl } from "@/lib/supabase";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();
  const [isInstallmentOpen, setIsInstallmentOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    // Simple visual feedback could be added here (e.g., a toast)
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    router.push("/checkout");
  };

  const handleInstallmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInstallmentOpen(true);
  };

  // Get public URL if it's a storage path, otherwise use as is (for assets/ legacy support)
  const imageUrl = useMemo(() => {
    const rawImage = product.main_image || "";
    if (!rawImage) return "/assets/placeholder.jpg";
    if (rawImage.startsWith("http") || rawImage.startsWith("/")) return rawImage;
    return getPublicUrl("product-images", rawImage);
  }, [product.main_image]);

  const price = product.markup_price || 0;
  const originalPrice = product.base_price || price;
  const category = product.category_name || (product as any).category?.name || "Energy";
  const brand = product.brand_name || (product as any).brand?.name || "Global 7CS";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/10">
      {/* Product Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
          {category}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="mb-1 line-clamp-1 text-lg font-bold text-card-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          by <span className="text-primary">{brand}</span>
        </p>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mb-6">
          <span className="text-xl font-bold text-primary">
            {formatNaira(price)}
          </span>
          <span className="ml-2 text-xs text-muted-foreground line-through opacity-50">
            {formatNaira(originalPrice)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleBuyNow}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Buy Now
            </button>
            <button
              onClick={handleInstallmentClick}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary py-2.5 text-xs font-bold text-primary transition-all hover:bg-primary/10 active:scale-95"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Installment
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 py-2.5 text-xs font-bold text-foreground transition-all hover:bg-secondary active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            Add to Cart
          </button>
        </div>
      </div>

      <InstallmentModal
        isOpen={isInstallmentOpen}
        onClose={() => setIsInstallmentOpen(false)}
        productPrice={price}
        productName={product.name}
      />
    </div>
  );
};

export default ProductCard;
