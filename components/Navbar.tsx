"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
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
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

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
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
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
  const searchRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()),
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isMobile &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, isMobile]);

  return (
    <div className="relative" ref={searchRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={iconButtonClassName}
      >
        <Search className="h-5 w-5" strokeWidth={2} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for Mobile Modal */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
              />
            )}

            <motion.div
              initial={
                isMobile
                  ? { opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }
                  : { opacity: 0, y: -10, scale: 0.95 }
              }
              animate={
                isMobile
                  ? { opacity: 1, scale: 1, x: "-50%", y: "-50%" }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                isMobile
                  ? { opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }
                  : { opacity: 0, y: -10, scale: 0.95 }
              }
              className={
                isMobile
                  ? "fixed left-1/2 top-1/2 z-[110] w-[min(90vw,450px)] lg:hidden"
                  : "absolute right-0 top-full mt-4 z-50 w-[min(90vw,450px)] hidden lg:block"
              }
            >
              <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h3 className="text-lg font-bold text-foreground px-2">
                    Search Products
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-2 text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

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
                            <Image
                              src={product.main_image || ""}
                              alt={product.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              {formatNaira(product.markup_price)}
                            </p>
                          </div>
                          <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      ))}
                    </div>
                  ) : query.length >= 2 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        No products found for &quot;{query}&quot;
                      </p>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Start typing to search...
                      </p>
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
  const { items } = useCartStore();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.warn("Supabase auth is not available:", err);
      }
    };

    getUser();

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    } catch (err) {
      console.warn("Supabase auth subscription failed:", err);
    }
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  useEffect(() => {
    setCartCount(items.reduce((total, item) => total + item.quantity, 0));
  }, [items]);

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
    ...CATEGORIES.map((cat) => ({
      label: cat.name,
      href: `/shop?category=${encodeURIComponent(cat.name)}`,
    })),
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

            {user ? (
              <div className="group relative">
                <button className={iconButtonClassName}>
                  {user.user_metadata.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase">
                      {user.email?.[0]}
                    </div>
                  )}
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="w-48 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl">
                    <div className="px-3 py-2 text-xs font-bold text-muted-foreground border-b border-border mb-1 truncate">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left rounded-xl px-3 py-2 text-sm font-bold text-foreground hover:bg-secondary hover:text-destructive transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className={iconButtonClassName}>
                <UserRound className="h-5 w-5" strokeWidth={2} />
              </Link>
            )}

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

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
