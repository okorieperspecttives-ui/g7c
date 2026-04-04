"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--card)] pt-20 pb-10">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand & About */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex flex-col leading-tight">
              <span className="text-2xl font-bold tracking-tight text-[color:var(--foreground)]">
                Global 7CS
              </span>
              <span className="text-xs font-medium text-[color:var(--primary)] uppercase tracking-widest">
                Energy Marketplace
              </span>
            </Link>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed">
              Nigeria&apos;s leading marketplace for reliable alternative energy solutions. We curate the best inverters, batteries, and solar systems for your home and business.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-[color:var(--secondary)] border border-[color:var(--border)] transition-colors hover:border-[color:var(--primary)]" />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-[color:var(--foreground)]">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-[color:var(--muted-foreground)]">
              <li><Link href="/shop" className="hover:text-[color:var(--primary)] transition-colors">Shop All Products</Link></li>
              <li><Link href="/shop?category=Inverters" className="hover:text-[color:var(--primary)] transition-colors">Premium Inverters</Link></li>
              <li><Link href="/shop?category=Batteries" className="hover:text-[color:var(--primary)] transition-colors">Energy Storage</Link></li>
              <li><Link href="/support" className="hover:text-[color:var(--primary)] transition-colors">Support Center</Link></li>
              <li><Link href="/about" className="hover:text-[color:var(--primary)] transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-[color:var(--foreground)]">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-6 text-sm font-medium text-[color:var(--muted-foreground)]">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[color:var(--primary)]" />
                <span>No. 2 Isaac John Street, GRA, Ikeja, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[color:var(--primary)]" />
                <span>+234 707 948 8124</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[color:var(--primary)]" />
                <span>sales@global7cs.com</span>
              </li>
              <li>
                <button className="flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-white transition-transform hover:scale-105">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Support
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-[color:var(--foreground)]">
              Newsletter
            </h4>
            <p className="mb-6 text-sm text-[color:var(--muted-foreground)]">
              Subscribe for energy tips, new arrivals, and exclusive marketplace deals.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-sm focus:border-[color:var(--primary)] focus:outline-none"
              />
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[color:var(--primary)] px-4 py-3 text-sm font-bold text-[color:var(--primary-foreground)] transition-all hover:opacity-90">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-[color:var(--border)] pt-10 md:flex-row">
          <p className="text-xs font-medium text-[color:var(--muted-foreground)]">
            © 2026 Global 7CS Energy Marketplace. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 grayscale opacity-50">
            {/* Payment Icons Placeholder */}
            {["Visa", "Mastercard", "Verve", "Paystack"].map((p) => (
              <span key={p} className="text-[10px] font-black uppercase tracking-tighter">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
