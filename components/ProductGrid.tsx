import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/supabase/products";
import { ProductDetail } from "@/lib/types";

const ProductGrid = async () => {
  let products: ProductDetail[] = [];
  
  try {
    products = await getProducts();
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return (
      <div className="text-center py-20">
        <p className="text-destructive font-bold text-lg">Could not load marketplace products.</p>
        <p className="text-muted-foreground mt-2">Please refresh the page to try again.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground font-medium text-lg">No products available in the marketplace yet.</p>
      </div>
    );
  }

  return (
    <section id="shop-section" className="mx-auto w-full max-w-screen-2xl bg-[color:var(--background)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-center justify-between gap-6 border-b border-[color:var(--border)] pb-8 md:flex-row">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            Our Marketplace
          </h2>
          <p className="mt-2 max-w-lg text-lg text-[color:var(--muted-foreground)]">
            Premium energy storage and solar solutions, curated for your power needs.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="rounded-full border border-[color:var(--primary)] bg-[color:var(--primary)]/10 px-6 py-2 text-sm font-bold text-[color:var(--primary)]">
            All Products
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
