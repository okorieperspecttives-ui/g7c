"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  ChevronDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";
import { CATEGORIES, PRODUCTS, formatNaira } from "@/lib/products";
import { useCartStore } from "@/lib/store/useCartStore";
import Image from "next/image";

const navigationLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Tips & News", href: "/tips" },
  { label: "Support", href: "/support" },
] as const;

const desktopNavLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Tips & News", href: "/tips" },
  { label: "Support", href: "/support" },
] as const;

const iconButtonClassName =
  "relative inline-flex h-10 w-10 items-center cursor-pointer justify-center rounded-full border border-transparent text-[color:var(--foreground)] transition-colors duration-200 hover:border-[color:var(--border)] hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]";

const CategoriesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        onClick={() => router.push("/categories")}
        className="flex items-center gap-1 text-sm font-bold text-[color:var(--foreground)] hover:text-[color:var(--primary)] transition-colors cursor-pointer"
      >
        Categories
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50"
          >
            <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-2xl w-[500px]">
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/shop?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col rounded-2xl p-4 transition-all hover:bg-[color:var(--secondary)] group border border-transparent hover:border-[color:var(--primary)]/20"
                  >
                    <span className="text-sm font-bold text-[color:var(--foreground)] group-hover:text-[color:var(--primary)] transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[color:var(--muted-foreground)] line-clamp-1 mt-1">
                      {cat.tagline}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-[color:var(--border)]">
                <Link 
                  href="/categories" 
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-black uppercase tracking-widest text-[color:var(--primary)] hover:underline flex items-center justify-center gap-2"
                >
                  View All Categories
                  <ChevronDown className="h-3 w-3 -rotate-90" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={iconButtonClassName}
      >
        <Search className="h-5 w-5" strokeWidth={2} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-4 z-50 w-[min(90vw,450px)]"
            >
              <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card p-4 shadow-2xl">
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search power solutions..."
                    className="w-full rounded-2xl border border-border bg-secondary/50 py-4 pl-12 pr-4 text-sm font-medium focus:border-primary focus:outline-none"
                  />
                  {query && (
                    <button 
                      onClick={() => setQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {results.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => {
                            setIsOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-secondary group"
                        >
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white">
                            <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              {formatNaira(product.price)}
                            </p>
                          </div>
                          <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      ))}
                    </div>
                  ) : query.length >= 2 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm font-medium text-muted-foreground">No products found for &quot;{query}&quot;</p>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Start typing to search...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simplified navigation list for mobile (includes categories)
  const mobileLinks = [
    { label: "Shop All", href: "/shop" },
    ...CATEGORIES.map(cat => ({ label: cat.name, href: `/shop?category=${encodeURIComponent(cat.name)}` })),
    { label: "Tips & News", href: "/tips" },
    { label: "Support", href: "/support" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 [font-family:var(--font-geist-sans)] ${
          isScrolled 
            ? "bg-transparent backdrop-blur-md border-b-transparent" 
            : "bg-[color:var(--background)]"
        }`}
        style={{
          borderBottomColor: isScrolled 
            ? "transparent" 
            : "color-mix(in srgb, var(--border) 55%, transparent)",
        }}
      >
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex min-h-[68px] w-full max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 text-[color:var(--foreground)] no-underline"
          >
            <div className="flex min-w-0 flex-col justify-center leading-tight">
              <span className="truncate text-lg font-bold tracking-tight text-[color:var(--foreground)] sm:text-xl">
               Global 7CS
              </span>
              <span className="truncate text-[10px] font-bold uppercase tracking-widest text-[color:var(--primary)]">
                Energy Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-8">
              {/* Special Categories Dropdown */}
              <CategoriesDropdown />

              {desktopNavLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative text-sm font-bold text-[color:var(--foreground)] no-underline transition-colors duration-200 hover:text-[color:var(--primary)]"
                >
                  <span>{item.label}</span>
                  <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[color:var(--primary)] transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <GlobalSearch />

            {/* Responsive Cart Button */}
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsCartOpen(true);
                }
              }}
              className={iconButtonClassName}
            >
              {/* Desktop link wraps icon */}
              <div className="lg:hidden">
                <ShoppingBag className="h-5 w-5" strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-primary-foreground animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </div>
              <Link href="/cart" className="hidden lg:block">
                <ShoppingBag className="h-5 w-5" strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-primary-foreground animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </Link>
            </button>

            <button
              type="button"
              aria-label="Account"
              className={iconButtonClassName}
            >
              <UserRound className="h-5 w-5" strokeWidth={2} />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              type="button"
              aria-label="Open navigation menu"
              className={`${iconButtonClassName} lg:hidden`}
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </nav>
      </header>

      {/* Slide-in Menus */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        links={mobileLinks}
      />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default Navbar;
