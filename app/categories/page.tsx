import { Zap, Battery, Box, Plug, Sun, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCategories } from "@/lib/supabase/products";

const ICON_MAP: Record<string, any> = {
  Zap,
  Battery,
  Box,
  Plug,
  Sun,
  Settings,
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6"
          >
            Explore Energy Categories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Find the right power solutions for your specific requirements, from portable stations to complete residential systems.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => {
            // Map icons based on category name if tag isn't available
            const iconKey = (category as any).icon || (
              category.name.includes("Inverter") ? "Zap" :
              category.name.includes("Battery") ? "Battery" :
              category.name.includes("Station") ? "Plug" :
              category.name.includes("Solar") ? "Sun" :
              category.name.includes("System") ? "Box" : "Settings"
            );
            const Icon = ICON_MAP[iconKey];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="group flex flex-col h-full rounded-[2.5rem] border border-border bg-card p-10 transition-all duration-500 hover:border-primary hover:shadow-2xl hover:shadow-primary/5"
                >
                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    {Icon && <Icon className="h-10 w-10" />}
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                  <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
                    {category.tagline || category.description || "Explore our selection."}
                  </p>
                  <div className="mt-auto flex items-center gap-3 text-sm font-black uppercase tracking-widest text-primary">
                    Browse Selection
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
