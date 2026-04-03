"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";

const navigationLinks = [
  { label: "Flash Sale", href: "/flash-sale" },
  { label: "Power Banks", href: "/power-banks" },
  { label: "Solar Kits", href: "/solar-kits" },
  { label: "Inverters", href: "/inverters" },
  { label: "Accessories", href: "/accessories" },
  { label: "Hot & New", href: "/hot-and-new" },
] as const;

const iconButtonClassName =
  "inline-flex h-10 w-10 items-center cursor-pointer justify-center rounded-full border border-transparent text-[color:var(--foreground)] transition-colors duration-200 hover:border-[color:var(--border)] hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 text-[color:var(--foreground)] no-underline"
        >
          <div className="flex min-w-0 flex-col justify-center leading-tight">
            {/* Brand Title */}
            <span className="truncate text-lg font-bold tracking-tight text-[color:var(--foreground)] sm:text-xl">
             Global 7CS
            </span>

            {/* Accent category line */}
            <span className="truncate text-[11px] font-medium text-[color:var(--primary)] sm:text-xs">
              Power Banks • Solar Inverters • More
            </span>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-6 xl:gap-7">
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative text-sm font-medium text-[color:var(--foreground)] no-underline transition-colors duration-200 hover:text-[color:var(--primary)]"
              >
                <span>{item.label}</span>
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[color:var(--primary)] transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Open navigation menu"
            className={`${iconButtonClassName} lg:hidden`}
          >
            <Menu className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <button type="button" aria-label="Search" className={iconButtonClassName}>
            <Search className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <button type="button" aria-label="View cart" className={iconButtonClassName}>
            <ShoppingBag className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Account"
            className={iconButtonClassName}
          >
            <UserRound className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
