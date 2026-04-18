"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBrand, updateBrand } from "../actions";
import { Brand } from "@/lib/types";
import { Loader2, Upload, X, Save, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPublicUrl } from "@/lib/supabase";

interface BrandFormProps {
  initialData?: Brand;
}

export default function BrandForm({ initialData }: BrandFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.logo_url || null);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [slug, setSlug] = useState(initialData?.slug || "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!initialData) {
      const name = e.target.value;
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(formData: FormData) {
    formData.set("is_active", String(isActive));
    formData.set("slug", slug);
    if (logoFile) formData.set("logo", logoFile);

    startTransition(async () => {
      const result = initialData 
        ? await updateBrand(initialData.id, formData)
        : await createBrand(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Brand ${initialData ? "updated" : "created"} successfully`);
        router.push("/admin/brands");
        router.refresh();
      }
    });
  }

  const displayLogoUrl = previewUrl?.startsWith("blob:") 
    ? previewUrl 
    : (previewUrl ? (previewUrl.startsWith("http") ? previewUrl : getPublicUrl("brand-logos", previewUrl)) : null);

  return (
    <form action={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/brands" className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {initialData ? "Edit" : "New"} Brand
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-[2.5rem] border border-border bg-card p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Brand Name</label>
              <input
                name="name"
                defaultValue={initialData?.name}
                onChange={handleNameChange}
                required
                placeholder="e.g. itel Energy"
                className="w-full rounded-2xl border border-border bg-secondary/30 p-4 text-sm font-bold text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder="brand-slug"
                className="w-full rounded-2xl border border-border bg-secondary/30 p-4 text-sm font-bold text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 mb-4 block">Brand Logo</label>
            <div className="relative aspect-square rounded-3xl border-2 border-dashed border-border bg-secondary/30 overflow-hidden group hover:border-primary/50 transition-colors">
              {displayLogoUrl ? (
                <>
                  <Image src={displayLogoUrl} alt="Preview" fill className="object-contain p-4" />
                  <button
                    type="button"
                    onClick={() => { setLogoFile(null); setPreviewUrl(null); }}
                    className="absolute top-2 right-2 p-2 rounded-xl bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Upload Logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Active Status</label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {initialData ? "Update" : "Create"} Brand
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
