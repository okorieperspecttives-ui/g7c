import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/lib/types";
import Link from "next/link";
import { Plus, Edit2, Bookmark } from "lucide-react";
import Image from "next/image";
import { getPublicUrl } from "@/lib/supabase";
import DeleteBrandButton from "./DeleteBrandButton";

export default async function BrandsPage() {
  const supabase = await createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  const brandList = (brands as Brand[]) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Brands</h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">Manage your product brands.</p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </Link>
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden shadow-sm mx-2 sm:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Brand</th>
                <th className="hidden md:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slug</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {brandList.map((brand) => {
                const imageUrl = brand.logo_url 
                  ? (brand.logo_url.startsWith("http") ? brand.logo_url : getPublicUrl("brand-logos", brand.logo_url))
                  : "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";

                return (
                  <tr key={brand.id} className="group transition-colors hover:bg-muted/30">
                    <td className="px-4 sm:px-8 py-4 sm:py-5">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative h-10 w-10 sm:h-14 sm:w-14 overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-muted p-1 sm:p-2 shadow-sm shrink-0">
                          <Image
                            src={imageUrl}
                            alt={brand.name}
                            fill
                            sizes="(max-width: 640px) 40px, 56px"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">{brand.name}</p>
                          <p className="md:hidden text-[10px] font-medium text-muted-foreground uppercase tracking-widest truncate max-w-[80px]">
                            {brand.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-8 py-5">
                      <code className="rounded bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {brand.slug}
                      </code>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-5">
                      <span className={`inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
                        brand.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                      }`}>
                        {brand.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                        <Link
                          href={`/admin/brands/${brand.id}/edit`}
                          className="p-1.5 sm:p-2 rounded-lg sm:xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Link>
                        <DeleteBrandButton id={brand.id} name={brand.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {brandList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Bookmark className="h-10 w-10 text-muted-foreground opacity-20" />
                      <p className="text-sm font-bold text-muted-foreground">No brands found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
