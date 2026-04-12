import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/supabase/products";
import { formatNaira } from "@/lib/products";
import { getPublicUrl } from "@/lib/supabase";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProductsList() {
  let products = [];
  try {
    // Admin list should show all products, including inactive ones
    products = await getProducts(false);
  } catch (err) {
    console.error("Failed to load admin products:", err);
    return (
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <p className="text-lg font-bold text-destructive">Failed to load products.</p>
        <p className="text-sm text-muted-foreground mt-2">Please check your database connection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Products <span className="text-primary text-2xl">Management</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground font-medium">
            Manage your energy solutions catalog.
          </p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex h-12 items-center gap-2 rounded-2xl bg-primary px-8 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5" />
          Add New Product
        </Link>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center justify-between bg-card p-4 rounded-3xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by product name, brand, category..."
            className="h-12 w-full rounded-2xl border-none bg-secondary/50 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex h-12 items-center gap-2 rounded-2xl border border-border bg-secondary/30 px-6 text-sm font-bold text-foreground transition-all hover:bg-secondary">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <select className="h-12 rounded-2xl border border-border bg-secondary/30 px-6 text-sm font-bold text-foreground outline-none transition-all hover:bg-secondary">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <th className="px-8 py-5">Product</th>
                <th className="px-6 py-5">Details</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Stock</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {products.map((product) => {
                const imageUrl = (() => {
                  const rawImage = product.main_image || "";
                  if (!rawImage) return "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";
                  if (rawImage.startsWith("http") || rawImage.startsWith("/")) return rawImage;
                  return getPublicUrl("product-images", rawImage);
                })();

                return (
                  <tr key={product.id} className="group transition-colors hover:bg-secondary/20">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-muted p-2 shadow-sm transition-transform group-hover:scale-105">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-contain"
                          />
                        </div>
                        <div className="max-w-[200px]">
                          <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                          {product.brand_name || "Unknown Brand"}
                        </p>
                        <p className="text-xs font-bold text-muted-foreground">
                          {product.category_name || "General Category"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-foreground">{formatNaira(product.markup_price)}</p>
                        <p className="text-[10px] font-bold text-muted-foreground line-through opacity-50">{formatNaira(product.base_price)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${product.stock_quantity > 10 ? 'bg-emerald-500' : product.stock_quantity > 0 ? 'bg-amber-500' : 'bg-destructive'}`}></div>
                        <p className="text-sm font-bold text-foreground">{product.stock_quantity}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${product.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 transition-all">
                        <Link 
                          href={`/products/${product.id}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link 
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="grid grid-cols-1 divide-y divide-border/50 lg:hidden">
          {products.map((product) => {
            const imageUrl = (() => {
              const rawImage = product.main_image || "";
              if (!rawImage) return "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";
              if (rawImage.startsWith("http") || rawImage.startsWith("/")) return rawImage;
              return getPublicUrl("product-images", rawImage);
            })();

            return (
              <div key={product.id} className="p-6 space-y-4 transition-colors active:bg-secondary/20">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-muted p-2 shadow-sm">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-foreground line-clamp-2">{product.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">ID: {product.id.slice(0, 8)}</p>
                      </div>
                      <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${product.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                        {product.brand_name || "Unknown Brand"}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground">
                        {product.category_name || "General Category"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-secondary/30 p-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</p>
                    <p className="text-sm font-black text-foreground">{formatNaira(product.markup_price)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stock Status</p>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${product.stock_quantity > 10 ? 'bg-emerald-500' : product.stock_quantity > 0 ? 'bg-amber-500' : 'bg-destructive'}`}></div>
                      <p className="text-sm font-bold text-foreground">{product.stock_quantity} units</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link 
                    href={`/products/${product.id}`}
                    target="_blank"
                    className="flex-1 flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors active:bg-secondary"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Link>
                  <Link 
                    href={`/admin/products/${product.id}/edit`}
                    className="flex-1 flex h-10 items-center justify-center gap-2 rounded-xl bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary transition-colors active:bg-primary/20"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Link>
                  <DeleteProductButton id={product.id} name={product.name} isMobile={true} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
