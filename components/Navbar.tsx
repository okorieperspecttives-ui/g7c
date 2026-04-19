"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  ShoppingBag,
  UserRound,
  ChevronDown,
  X,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";
import { CATEGORIES, PRODUCTS, formatNaira } from "@/lib/products";
import { useCartStore } from "@/lib/store/useCartStore";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import NotificationBell from "./NotificationBell";

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

const UserDropdown = ({ user, handleLogout }: { user: User; handleLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={iconButtonClassName}
      >
        {user.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary uppercase border border-primary/20">
            {user.email?.[0]}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full pt-2 z-50 origin-top-right"
          >
            <div className="w-64 overflow-hidden rounded-[2rem] border border-border bg-card p-2 shadow-2xl">
              <div className="px-5 py-4 border-b border-border/50 mb-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">
                  Signed in as
                </p>
                <p className="text-sm font-bold text-foreground truncate">
                  {user.email}
                </p>
              </div>
              <div className="p-1 space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 w-full text-left rounded-2xl px-3 py-3 text-sm font-bold text-foreground hover:bg-secondary transition-all group"
                >
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Zap className="h-4 w-4" />
                  </div>
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 w-full text-left rounded-2xl px-3 py-3 text-sm font-bold text-foreground hover:bg-secondary transition-all group"
                >
                  <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                    <UserRound className="h-4 w-4" />
                  </div>
                  My Profile
                </Link>
                <div className="pt-1 mt-1 border-t border-border/50">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full text-left rounded-2xl px-3 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 transition-all group"
                  >
                    <div className="h-9 w-9 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive group-hover:text-white transition-colors">
                      <X className="h-4 w-4" />
                    </div>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
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
            {user && <NotificationBell />}

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
              <UserDropdown user={user} handleLogout={handleLogout} />
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
