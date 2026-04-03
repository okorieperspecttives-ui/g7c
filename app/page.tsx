import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-[color:var(--background)]">
      {/* Full-width Hero Section with auto-scrolling carousel */}
      <Hero />
      
      {/* Product Grid Section with 15% marked-up itel Energy products */}
      <ProductGrid />

      {/* Trust Badges / Info Section */}
      <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-12 md:grid-cols-3">
          <div className="text-center">
            <h4 className="mb-2 text-xl font-bold text-[color:var(--foreground)]">Secure Checkout</h4>
            <p className="text-sm text-[color:var(--muted-foreground)]">Payments processed with industry-leading security.</p>
          </div>
          <div className="text-center">
            <h4 className="mb-2 text-xl font-bold text-[color:var(--foreground)]">Installment Plans</h4>
            <p className="text-sm text-[color:var(--muted-foreground)]">Buy now and pay later with flexible monthly plans.</p>
          </div>
          <div className="text-center">
            <h4 className="mb-2 text-xl font-bold text-[color:var(--foreground)]">Expert Support</h4>
            <p className="text-sm text-[color:var(--muted-foreground)]">Our team is available to help with installation and queries.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
