"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  ArrowRight, 
  X, 
  BookOpen, 
  Zap, 
  Battery, 
  ShieldCheck,
  Sun 
} from "lucide-react";

interface TipArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  category: string;
  icon: any;
}

const ARTICLES: TipArticle[] = [
  {
    id: "choose-right-inverter",
    title: "How to Choose the Right Inverter for Your Home",
    excerpt: "Selecting the perfect inverter size depends on your power consumption and critical loads. Learn how to calculate your needs correctly.",
    content: `
      Choosing the right inverter is the first step toward energy independence. Here's a quick guide to help you decide:
      
      1. List Your Critical Loads: Identify which appliances must stay on during a power outage (e.g., fans, lights, fridge, laptops).
      2. Calculate Total Wattage: Add up the wattage of all these appliances. This is your "Continuous Load."
      3. Account for Surge Power: Appliances with motors (like fridges) need 2-3x their rated wattage to start.
      4. Choose Your Inverter Size: Your inverter should be at least 20-30% larger than your continuous load to handle peaks and run efficiently.
      
      For a typical Nigerian household with basic needs (fans, TV, lights), a 1kVA - 2.5kVA system is often a great starting point.
    `,
    image: "https://images.unsplash.com/photo-1594398941390-694739d83e8e?q=80&w=2070&auto=format&fit=crop",
    readTime: "5 min read",
    category: "Guides",
    icon: Zap,
  },
  {
    id: "solar-maintenance-nigeria",
    title: "Solar Battery Maintenance Tips in Nigerian Weather",
    excerpt: "Heat and dust are the enemies of battery lifespan. Follow these simple steps to keep your system running for years.",
    content: `
      Nigeria's tropical climate presents unique challenges for energy storage. To maximize your battery life:
      
      1. Keep it Cool: Ensure your batteries are stored in a well-ventilated area away from direct sunlight.
      2. Regular Dusting: Dust can act as an insulator, trapping heat. Clean the terminals and casing monthly.
      3. Monitor Depth of Discharge: Avoid draining your batteries below 50% for lead-acid or 20% for lithium to prevent permanent damage.
      4. Check Connections: Ensure all cable connections are tight and free from corrosion.
      
      Proper maintenance can extend your battery life by up to 40%!
    `,
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop",
    readTime: "4 min read",
    category: "Maintenance",
    icon: Battery,
  },
  {
    id: "understanding-warranties",
    title: "Understanding Warranties for Energy Products",
    excerpt: "Not all warranties are created equal. Learn what to look for in your energy product's guarantee and how to claim it.",
    content: `
      A warranty is a promise of quality. When shopping for energy products, look for:
      
      1. Manufacturer vs. Vendor Warranty: Always prefer manufacturer-backed warranties for long-term peace of mind.
      2. Coverage Details: Does it cover parts and labor, or just parts?
      3. Warranty Period: Typical periods are 1 year for inverters and 2-5 years for high-quality lithium batteries.
      4. Exclusions: Most warranties don't cover damage from power surges or physical misuse.
      
      At Global 7CS, we only list products with verifiable warranties to protect your investment.
    `,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop",
    readTime: "3 min read",
    category: "Tips",
    icon: ShieldCheck,
  },
  {
    id: "lithium-vs-lead-acid",
    title: "Benefits of Lithium Batteries vs Lead-Acid in Nigeria",
    excerpt: "Is the higher upfront cost of lithium worth it? We break down the long-term savings and performance benefits.",
    content: `
      While lead-acid batteries have a lower initial price, lithium batteries (LiFePO4) are rapidly becoming the standard for Nigerian homes.
      
      Why choose Lithium?
      1. Longer Lifespan: Lithium lasts 3000-6000 cycles, while lead-acid typically lasts 500-800.
      2. Higher Efficiency: You can use up to 90% of a lithium battery's capacity without damage.
      3. Faster Charging: Lithium charges 2-3x faster, which is critical during limited grid availability.
      4. No Maintenance: No topping up with distilled water or cleaning acid spills.
      
      In the long run, Lithium is significantly cheaper per unit of energy delivered.
    `,
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2071&auto=format&fit=crop",
    readTime: "6 min read",
    category: "Comparison",
    icon: Sun,
  },
];

export default function TipsClient() {
  const [selectedArticle, setSelectedArticle] = useState<TipArticle | null>(null);

  return (
    <main className="min-h-screen bg-[color:var(--background)] pt-32 pb-20">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-6xl mb-6"
          >
            Tips & News
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[color:var(--muted-foreground)] max-w-2xl mx-auto"
          >
            Stay informed with the latest guides, maintenance tips, and energy news curated for the Nigerian market.
          </motion.p>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {ARTICLES.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-500 hover:border-[color:var(--primary)] hover:shadow-2xl hover:shadow-[color:var(--primary)]/10"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 rounded-full bg-[color:var(--background)]/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[color:var(--foreground)] backdrop-blur-md">
                  {article.category}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-8 sm:p-10">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[color:var(--primary)]">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </div>
                <h2 className="mb-4 text-2xl font-bold text-[color:var(--foreground)] group-hover:text-[color:var(--primary)] transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="mb-8 text-lg text-[color:var(--muted-foreground)] leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="mt-auto">
                  <button 
                    onClick={() => setSelectedArticle(article)}
                    className="flex cursor-pointer items-center gap-2 text-sm font-black uppercase tracking-widest text-[color:var(--primary)] group-hover:underline"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for Article Content */}
        <AnimatePresence>
          {selectedArticle && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedArticle(null)}
                className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed left-1/2 top-1/2 z-[130] w-[min(90%,800px)] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[3rem] bg-[color:var(--background)] p-8 sm:p-12 shadow-2xl"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                      <selectedArticle.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--primary)]">
                        {selectedArticle.category}
                      </span>
                      <p className="text-xs font-medium text-[color:var(--muted-foreground)]">{selectedArticle.readTime}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="rounded-full bg-[color:var(--secondary)] p-2 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <h2 className="mb-6 text-3xl font-bold text-[color:var(--foreground)] sm:text-4xl leading-tight">
                  {selectedArticle.title}
                </h2>
                
                <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[2rem]">
                  <Image src={selectedArticle.image} alt={selectedArticle.title} fill className="object-cover" />
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-line text-lg leading-relaxed text-[color:var(--muted-foreground)]">
                    {selectedArticle.content}
                  </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-[color:var(--border)] pt-12 sm:flex-row">
                  <div className="flex items-center gap-4">
                    <BookOpen className="h-5 w-5 text-[color:var(--primary)]" />
                    <span className="text-sm font-bold text-[color:var(--foreground)]">Expert-vetted content</span>
                  </div>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="w-full rounded-2xl bg-[color:var(--primary)] py-4 px-10 text-sm font-bold text-[color:var(--primary-foreground)] shadow-xl shadow-[color:var(--primary)]/20 transition-all hover:scale-[1.02] active:scale-95 sm:w-auto"
                  >
                    Back to Tips
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
