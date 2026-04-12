import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import BestSellers from "@/components/BestSellers";
import ProductGrid from "@/components/ProductGrid";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import WhyShopWithUs from "@/components/WhyShopWithUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* 1. Full-width Hero Section with auto-scrolling carousel */}
      <Hero />

      {/* 3. Best Sellers Section */}
      <BestSellers />

      {/* 2. Featured Categories Section */}
      <CategorySection />



      {/* 4. Main Product Grid / Shop Preview Section */}
      <section id="products" className="bg-secondary/30">
        <div className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Featured Products
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Discover our most popular energy-efficient solutions.
              </p>
            </div>
            <Link
              href="/shop"
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid />
        </div>
      </section>

      {/* 5. Why Choose Us / Trust Section */}
      <TrustSection />

      {/* 6. How It Works Section */}
      <HowItWorks />

      {/* 6.5 Why Shop With Us Section */}
      <WhyShopWithUs />

      {/* 7. Testimonials Section */}
      <Testimonials />

      {/* 7.5 FAQ Section */}
      <FAQ />

      {/* 8. Newsletter / Final CTA Section */}
      <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[3rem] bg-primary px-8 py-20 text-center text-primary-foreground shadow-2xl shadow-primary/30">
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to Power Your Future?
            </h2>
            <p className="mb-10 text-xl font-medium opacity-90">
              Subscribe to our newsletter for the latest arrivals, exclusive marketplace deals, and clean energy tips.
            </p>
            <form className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="relative w-full sm:max-w-md">
                <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-primary" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full rounded-full bg-background py-4 pl-12 pr-6 text-sm font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-white/20"
                />
              </div>
              <button className="w-full rounded-full bg-foreground px-10 py-4 text-sm font-black uppercase tracking-widest text-background transition-all hover:scale-105 active:scale-95 sm:w-auto">
                Join Now
              </button>
            </form>
          </div>
          {/* Decorative Background Elements */}
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>

      {/* 9. Footer */}
      <Footer />
    </main>
  );
}
