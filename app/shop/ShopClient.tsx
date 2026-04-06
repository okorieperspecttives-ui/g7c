"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, ChevronDown, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CAPACITY_RANGES = ["< 1kVA", "1-3kVA", "3-5kVA", "5-10kVA", "> 10kVA"];
const BRANDS = ["itel Energy", "Generic"]; // Future-proofed

export default function ShopClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || []
  );
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>(
    searchParams.get("capacity")?.split(",").filter(Boolean) || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brand")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "Newest");
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  // Sync URL Params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategories.length) params.set("category", selectedCategories.join(","));
    if (selectedCapacities.length) params.set("capacity", selectedCapacities.join(","));
    if (selectedBrands.length) params.set("brand", selectedBrands.join(","));
    if (sortBy !== "Newest") params.set("sort", sortBy);
    
    const queryString = params.toString();
    router.replace(`/shop${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [searchQuery, selectedCategories, selectedCapacities, selectedBrands, sortBy, router]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const price = (product as any).markup_price || (product as any).price || 0;
      const category = (product as any).category_name || (product as any).category || "";
      const brand = (product as any).brand_name || (product as any).brand || "";
      const capacity = (product as any).capacity || "";

      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(category);
      const matchesCapacity = selectedCapacities.length === 0 || (capacity && selectedCapacities.includes(capacity));
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(brand);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesCapacity && matchesBrand && matchesPrice;
    }).sort((a, b) => {
      const aPrice = (a as any).markup_price || (a as any).price || 0;
      const bPrice = (b as any).markup_price || (b as any).price || 0;
      if (sortBy === "Price: Low to High") return aPrice - bPrice;
      if (sortBy === "Price: High to Low") return bPrice - aPrice;
      return 0;
    });
  }, [searchQuery, selectedCategories, selectedCapacities, selectedBrands, priceRange, sortBy]);

  const toggleItem = (list: string[], setFn: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setFn(list.filter(i => i !== item));
    } else {
      setFn([...list, item]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedCapacities([]);
    setSelectedBrands([]);
    setPriceRange([0, 2000000]);
    setSortBy("Newest");
  };

  const FilterSidebar = () => (
    <div className="space-y-10">
      {/* Category Filter */}
      <section>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-foreground">Categories</h3>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map(cat => (
            <label key={cat.name} className="flex cursor-pointer items-center gap-3 group">
              <div 
                onClick={() => toggleItem(selectedCategories, setSelectedCategories, cat.name)}
                className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                  selectedCategories.includes(cat.name) ? "bg-primary border-primary" : "border-border bg-card group-hover:border-primary"
                }`}
              >
                {selectedCategories.includes(cat.name) && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <span className={`text-sm font-medium transition-colors ${selectedCategories.includes(cat.name) ? "text-foreground" : "text-muted-foreground"}`}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Capacity Filter */}
      <section>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-foreground">Capacity</h3>
        <div className="flex flex-wrap gap-2">
          {CAPACITY_RANGES.map(range => (
            <button
              key={range}
              onClick={() => toggleItem(selectedCapacities, setSelectedCapacities, range)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                selectedCapacities.includes(range) 
                ? "bg-primary text-primary-foreground" 
                : "bg-card border border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </section>

      {/* Price Range Placeholder (Simple inputs for now) */}
      <section>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-foreground">Price Range</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-full rounded-xl border border-border bg-card p-3 text-xs focus:border-primary focus:outline-none"
          />
          <span className="text-muted-foreground">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full rounded-xl border border-border bg-card p-3 text-xs focus:border-primary focus:outline-none"
          />
        </div>
      </section>

      {/* Brand Filter */}
      <section>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-foreground">Brands</h3>
        <div className="flex flex-col gap-3">
          {BRANDS.map(brand => (
            <label key={brand} className="flex cursor-pointer items-center gap-3 group">
              <div 
                onClick={() => toggleItem(selectedBrands, setSelectedBrands, brand)}
                className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                  selectedBrands.includes(brand) ? "bg-primary border-primary" : "border-border bg-card group-hover:border-primary"
                }`}
              >
                {selectedBrands.includes(brand) && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <span className={`text-sm font-medium transition-colors ${selectedBrands.includes(brand) ? "text-foreground" : "text-muted-foreground"}`}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </section>

      <button 
        onClick={clearFilters}
        className="w-full rounded-2xl border border-border bg-secondary py-4 text-xs font-bold text-foreground transition-all hover:bg-border"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Alternative Energy Marketplace
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Premium, reliable power solutions curated for your home and business.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar />
          </aside>

          <div className="flex-1">
            {/* Top Bar */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products, brands, specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-sm font-medium focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative inline-block w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="cursor-pointer w-full appearance-none rounded-2xl border border-border bg-card px-6 py-4 pr-12 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Popularity</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                
                <button 
                  onClick={() => setIsFilterMobileOpen(true)}
                  className="flex lg:hidden cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-bold text-foreground hover:border-primary"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Showing <span className="text-foreground font-bold">{filteredProducts.length}</span> results
              </p>
              {(selectedCategories.length > 0 || searchQuery || selectedCapacities.length > 0) && (
                <button onClick={clearFilters} className="text-xs font-bold text-primary hover:underline">
                  Reset Filters
                </button>
              )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-card rounded-[3rem] border border-border border-dashed">
                <div className="mb-6 rounded-full bg-secondary p-8">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground max-w-xs">We couldn&apos;t find any products matching your current filters.</p>
                <button onClick={clearFilters} className="mt-8 text-sm font-bold text-primary underline">Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isFilterMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterMobileOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-[110] h-[85vh] rounded-t-[3rem] bg-background p-8 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Filters</h2>
                <button onClick={() => setIsFilterMobileOpen(false)} className="rounded-full bg-secondary p-2 text-muted-foreground">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <FilterSidebar />
              </div>
              <div className="pt-6 border-t border-border mt-auto">
                <button 
                  onClick={() => setIsFilterMobileOpen(false)}
                  className="w-full rounded-2xl bg-primary py-5 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
