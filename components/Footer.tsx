"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, ArrowRight, Camera, Share2, X, Send } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: <MessageCircle className="h-5 w-5" />, href: "https://wa.me/2347079488124", label: "WhatsApp", color: "hover:bg-[#25D366] hover:text-white" },
    { icon: <Camera className="h-5 w-5" />, href: "#", label: "Instagram", color: "hover:bg-[#E4405F] hover:text-white" },
    { icon: <X className="h-5 w-5" />, href: "#", label: "Twitter", color: "hover:bg-[#000000] hover:text-white" },
    { icon: <Share2 className="h-5 w-5" />, href: "#", label: "Facebook", color: "hover:bg-[#1877F2] hover:text-white" },
  ];

  return (
    <footer className="border-t border-border bg-card pt-20 pb-10">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand & About */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex flex-col leading-tight">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Global 7CS
              </span>
              <span className="text-xs font-medium text-primary uppercase tracking-widest">
                Energy Marketplace
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Nigeria&apos;s leading marketplace for reliable alternative energy solutions. We curate the best inverters, batteries, and solar systems for your home and business.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground border border-border transition-all duration-300 ${social.color} hover:border-transparent hover:-translate-y-1`}
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/shop" className="hover:text-primary transition-colors">Shop All Products</Link></li>
              <li><Link href="/shop?category=Inverters" className="hover:text-primary transition-colors">Premium Inverters</Link></li>
              <li><Link href="/shop?category=Batteries" className="hover:text-primary transition-colors">Energy Storage</Link></li>
              <li><Link href="/support" className="hover:text-primary transition-colors">Support Center</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-6 text-sm font-medium text-muted-foreground">
              <li className="flex items-start gap-3 group">
                <div className="mt-1 h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="group-hover:text-foreground transition-colors">No. 2 Isaac John Street, GRA, Ikeja, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="group-hover:text-foreground transition-colors">+234 707 948 8124</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="group-hover:text-foreground transition-colors">sales@global7cs.com</span>
              </li>
              <li>
                <Link
                  href="https://wa.me/2347079488124"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">
              Newsletter
            </h4>
            <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
              Subscribe for energy tips, new arrivals, and exclusive marketplace deals.
            </p>
            <form className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-11 py-3.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
              <button className="group flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                Subscribe
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border pt-10 md:flex-row">
          <p className="text-xs font-medium text-muted-foreground">
            © 2026 Global 7CS Energy Marketplace. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-8 grayscale opacity-50 contrast-125">
            {/* Payment Icons Placeholder */}
            {["Visa", "Mastercard", "Verve", "Paystack"].map((p) => (
              <span key={p} className="text-[10px] font-black uppercase tracking-widest">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
