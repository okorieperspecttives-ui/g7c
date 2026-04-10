import { LucideIcon, Zap, Battery, Box, Plug, Sun, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getCategories } from "@/lib/supabase/products";
import { Category } from "@/lib/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Battery,
  Box,
  Plug,
  Sun,
  Settings,
};

const CategorySection = async () => {
  const categories: Category[] = (await getCategories()) || [];

  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Premium Energy Categories
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore our curated selection of reliable alternative energy solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const iconKey = (category as any).icon || (
            category.name.includes("Inverter") ? "Zap" :
            category.name.includes("Battery") ? "Battery" :
            category.name.includes("Station") ? "Plug" :
            category.name.includes("Solar") ? "Sun" :
            category.name.includes("System") ? "Box" : "Settings"
          );
          const Icon = ICON_MAP[iconKey];

          return (
            <div
              key={category.id}
              className="group flex flex-col rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {Icon && <Icon className="h-7 w-7" />}
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">
                {category.name}
              </h3>
              <p className="mb-8 text-muted-foreground">
                {category.tagline || category.description || "Explore our selection."}
              </p>
              <Link
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className="mt-auto flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:opacity-80"
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
