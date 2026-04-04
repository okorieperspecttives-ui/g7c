"use client";

import { CATEGORIES } from "@/lib/products";
import { LucideIcon, Zap, Battery, Box, Plug, Sun, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Battery,
  Box,
  Plug,
  Sun,
  Settings,
};

const CategorySection = () => {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Premium Energy Categories
        </h2>
        <p className="mt-4 text-lg text-[color:var(--muted-foreground)]">
          Explore our curated selection of reliable alternative energy solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const Icon = ICON_MAP[category.icon];
          return (
            <div
              key={category.name}
              className="group flex flex-col rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-8 transition-all duration-300 hover:border-[color:var(--primary)] hover:shadow-xl hover:shadow-[color:var(--primary)]/5"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--primary)]/10 text-[color:var(--primary)] transition-colors group-hover:bg-[color:var(--primary)] group-hover:text-[color:var(--primary-foreground)]">
                {Icon && <Icon className="h-7 w-7" />}
              </div>
              <h3 className="mb-2 text-xl font-bold text-[color:var(--foreground)]">
                {category.name}
              </h3>
              <p className="mb-8 text-[color:var(--muted-foreground)]">
                {category.tagline}
              </p>
              <Link
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className="mt-auto flex items-center gap-2 text-sm font-bold text-[color:var(--primary)] transition-colors hover:opacity-80"
              >
                Browse Products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
