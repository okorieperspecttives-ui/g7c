import { createClient } from "@/lib/supabase/server";
import { Category } from "@/lib/types";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Tag } from "lucide-react";
import Image from "next/image";
import { getPublicUrl } from "@/lib/supabase";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  const categoryList = (categories as Category[]) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Categories</h1>
          <p className="text-muted-foreground font-medium">Manage your product categories.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Slug</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {categoryList.map((category) => {
                const imageUrl = category.image_url 
                  ? (category.image_url.startsWith("http") ? category.image_url : getPublicUrl("category-images", category.image_url))
                  : "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";

                return (
                  <tr key={category.id} className="group transition-colors hover:bg-muted/30">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-border bg-muted p-2 shadow-sm">
                          <Image
                            src={imageUrl}
                            alt={category.name}
                            fill
                            sizes="56px"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{category.name}</p>
                          <p className="text-[10px] font-medium text-muted-foreground line-clamp-1 max-w-[200px]">{category.tagline || category.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <code className="rounded bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                        category.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                      }`}>
                        {category.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <DeleteCategoryButton id={category.id} name={category.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {categoryList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Tag className="h-10 w-10 text-muted-foreground opacity-20" />
                      <p className="text-sm font-bold text-muted-foreground">No categories found.</p>
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
