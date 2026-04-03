"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, formatNaira } from "@/lib/products";
import { ShoppingCart, CreditCard } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-300 hover:border-[color:var(--primary)] hover:shadow-2xl hover:shadow-[color:var(--primary)]/10">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-[color:var(--muted)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 rounded-full bg-[color:var(--primary)]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--primary-foreground)] backdrop-blur-sm">
          {product.category}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="mb-2 line-clamp-1 text-lg font-bold text-[color:var(--card-foreground)] transition-colors group-hover:text-[color:var(--primary)]">
            {product.name}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-[color:var(--muted-foreground)]">
          {product.description}
        </p>

        <div className="mb-6">
          <span className="text-xl font-bold text-[color:var(--primary)]">
            {formatNaira(product.price)}
          </span>
          <span className="ml-2 text-xs text-[color:var(--muted-foreground)] line-through opacity-50">
            {formatNaira(product.originalPrice)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[color:var(--primary)] py-2.5 text-xs font-bold text-[color:var(--primary-foreground)] transition-all hover:opacity-90 active:scale-95">
            <ShoppingCart className="h-3.5 w-3.5" />
            Buy Now
          </button>
          <button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[color:var(--primary)] py-2.5 text-xs font-bold text-[color:var(--primary)] transition-all hover:bg-[color:var(--primary)]/10 active:scale-95">
            <CreditCard className="h-3.5 w-3.5" />
            Installment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
